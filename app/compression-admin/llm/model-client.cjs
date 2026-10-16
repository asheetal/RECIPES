
'use strict';

class ModelCallError extends Error {
  constructor(code, { status, retryAfterMs, retryable = false } = {}) {
    super(code);
    this.name = 'ModelCallError';
    this.code = code;
    this.status = status;
    this.retryAfterMs = retryAfterMs;
    this.retryable = retryable;
  }
}

/**
 * Lowest layer: one provider request.
 * No prompt queues, compression decisions, retries, database access or UI.
 */
class ModelClient {
  constructor({ resolveConnection, fetchImpl = globalThis.fetch, timeoutMs = 120000 }) {
    this.resolveConnection = resolveConnection;
    this.fetch = fetchImpl;
    this.timeoutMs = timeoutMs;
  }

  async complete({ messages, maxOutputTokens, signal }) {
    if (signal?.aborted) throw new ModelCallError('CANCELLED');
    if (!Array.isArray(messages) || !Number.isSafeInteger(maxOutputTokens) ||
        maxOutputTokens < 1) throw new ModelCallError('INVALID_REQUEST');

    const connection = await this.resolveConnection();
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) controller.abort();

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.timeoutMs);
    timer.unref?.();

    const started = Date.now();
    try {
      const response = await this.fetch(
        connection.base.replace(/\/+$/, '') + '/chat/completions',
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            ...connection.headers,
            Authorization: 'Bearer ' + connection.key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: connection.model,
            messages,
            max_tokens: maxOutputTokens,
            stream: false,
          }),
        },
      );

      if (!response.ok) {
        const retryHeader = response.headers.get('retry-after');
        let retryAfterMs;
        if (retryHeader) {
          retryAfterMs = /^\d+$/.test(retryHeader)
            ? Number(retryHeader) * 1000
            : Math.max(0, Date.parse(retryHeader) - Date.now());
          if (!Number.isFinite(retryAfterMs)) retryAfterMs = undefined;
        }
        await response.body?.cancel().catch(() => {});
        throw new ModelCallError('PROVIDER_HTTP_ERROR', {
          status: response.status,
          retryAfterMs,
          retryable: response.status === 429 || response.status >= 500,
        });
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      if (choice?.finish_reason === 'length')
        throw new ModelCallError('OUTPUT_LIMIT');
      if (typeof choice?.message?.content !== 'string' ||
          !choice.message.content.trim())
        throw new ModelCallError('EMPTY_RESPONSE');

      return {
        text: choice.message.content,
        usage: data.usage || {},
        model: connection.model,
        endpoint: connection.endpoint,
        requestId: response.headers.get('x-request-id') || data.id || null,
        elapsedMs: Date.now() - started,
      };
    } catch (error) {
      if (signal?.aborted) throw new ModelCallError('CANCELLED');
      if (timedOut)
        throw new ModelCallError('MODEL_TIMEOUT', { retryable: true });
      if (error instanceof ModelCallError) throw error;
      throw new ModelCallError('TRANSPORT_ERROR', { retryable: true });
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
    }
  }
}

module.exports = { ModelClient, ModelCallError };
