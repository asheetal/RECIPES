
'use strict';
const { randomUUID } = require('node:crypto');

/**
 * Prompt-management layer.
 * Owns token thresholds, prompt queue and cancellation decisions.
 * Performs no LLM calls, compression work or UI rendering.
 */
class PromptManager {
  constructor(repository) {
    this.repository = repository;
  }

  enqueue(scope, prompt) {
    return this.repository.change(scope, state => {
      if (state.deleted) throw Error('Chat deleted');
      if (typeof prompt?.id !== 'string' || !prompt.id)
        throw Error('Prompt ID required');

      if (state.active?.id === prompt.id ||
          state.lastCompleted?.promptId === prompt.id ||
          state.queue.some(item => item.id === prompt.id)) {
        return { accepted: true, duplicate: true, promptId: prompt.id };
      }

      state.queue.push(structuredClone(prompt));
      return { accepted: true, duplicate: false, promptId: prompt.id };
    });
  }

  takeNext(scope) {
    return this.repository.change(scope, state => {
      if (state.deleted || state.phase !== 'idle' ||
          state.active || !state.queue.length) return null;

      state.active = {
        ...state.queue.shift(),
        baseTokens: state.tokens,
      };
      state.phase = 'running';
      return structuredClone(state.active);
    });
  }

  /**
   * Called after P1's response and deliverables have been persisted
   * and its final response has been published.
   */
  complete(scope, { promptId, deltaTokens, snapshot }) {
    return this.repository.change(scope, state => {
      if (state.deleted) throw Error('Chat deleted');
      if (state.lastCompleted?.promptId === promptId)
        return state.job ? structuredClone(state.job) : null;

      if (state.phase !== 'running' || state.active?.id !== promptId)
        throw Error('Stale prompt completion');
      if (!Number.isSafeInteger(deltaTokens) || deltaTokens < 0)
        throw Error('Invalid token increment');
      if (!snapshot?.headMessageId)
        throw Error('Persisted response snapshot required');

      const total = state.active.baseTokens + deltaTokens;
      if (!Number.isSafeInteger(total)) throw Error('Invalid token total');

      state.tokens = total;
      state.active = null;
      state.revision++;
      state.lastCompleted = {
        promptId,
        headMessageId: snapshot.headMessageId,
        tokens: total,
      };

      if (total < state.policy.threshold) {
        state.phase = 'idle';
        return null;
      }

      state.phase = 'compressing';
      state.job = {
        id: randomUUID(),
        revision: state.revision,
        snapshot: structuredClone(snapshot),
        beforeTokens: total,
        targetTokens: Math.floor(total * state.policy.ratio),
        status: 'pending',
      };
      return structuredClone(state.job);
    });
  }

  /**
   * Cancelling queued P2 leaves the compression job untouched.
   * Running-prompt cancellation returns an instruction to the flow layer.
   */
  cancel(scope, promptId) {
    return this.repository.change(scope, state => {
      if (state.deleted) return { kind: 'none' };

      const index = state.queue.findIndex(item => item.id === promptId);
      if (index >= 0) {
        state.queue.splice(index, 1);
        return { kind: 'queued_cancelled', promptId };
      }

      if (state.active?.id === promptId) {
        state.phase = 'cancelling';
        return { kind: 'abort_prompt', promptId };
      }
      return { kind: 'none' };
    });
  }

  finishCancellation(scope, promptId, deltaTokens = 0) {
    return this.repository.change(scope, state => {
      if (state.deleted || state.phase !== 'cancelling' ||
          state.active?.id !== promptId) return false;

      if (!Number.isSafeInteger(deltaTokens) || deltaTokens < 0)
        throw Error('Invalid cancellation token increment');
      const total = state.active.baseTokens + deltaTokens;
      if (!Number.isSafeInteger(total)) throw Error('Invalid token total');

      state.tokens = total;
      state.active = null;
      state.phase = 'idle';
      state.revision++;
      return true;
    });
  }

  commitCompression(scope, jobId, result) {
    return this.repository.change(scope, state => {
      if (state.deleted || state.phase !== 'compressing' ||
          state.job?.id !== jobId ||
          state.job.revision !== state.revision) return false;

      if (!Number.isSafeInteger(result.tokens) || result.tokens < 0 ||
          result.tokens >= state.job.beforeTokens || !result.context)
        throw Error('Invalid compression result');

      state.context = structuredClone(result.context);
      state.tokens = result.tokens;
      state.revision++;
      state.job = null;
      state.phase = 'idle';
      return true;
    });
  }

  failCompression(scope, jobId, code) {
    return this.repository.change(scope, state => {
      if (state.deleted || state.phase !== 'compressing' ||
          state.job?.id !== jobId) return false;

      state.job.status = 'failed';
      state.job.errorCode = code;
      state.phase = 'recovery_failed';
      return true;
    });
  }

  resumeCompression(scope) {
    return this.repository.change(scope, state => {
      if (state.deleted || state.phase !== 'recovery_failed' ||
          !state.job) return null;

      state.phase = 'compressing';
      state.job.status = 'pending';
      delete state.job.errorCode;
      return structuredClone(state.job);
    });
  }

  /**
   * Chat/project deletion uses this transition before deleting chat data.
   * The flow layer executes the returned cancellation instructions.
   */
  deleteChat(scope) {
    return this.repository.change(scope, state => {
      const effects = {
        abortPromptId: state.active?.id,
        abortCompressionId: state.job?.id,
      };

      state.deleted = true;
      state.phase = 'deleted';
      state.active = null;
      state.queue = [];
      state.job = null;
      state.context = null;
      state.revision++;
      return effects;
    });
  }

  async status(scope) {
    const state = await this.repository.read(scope);
    return {
      state: state.phase,
      canEdit: !state.deleted &&
        !['compressing', 'recovery_failed'].includes(state.phase),
      queued: state.queue.length,
    };
  }
}

function initialState(policy) {
  if (!Number.isSafeInteger(policy.threshold) || policy.threshold < 1 ||
      !Number.isFinite(policy.ratio) || policy.ratio <= 0 || policy.ratio >= 1)
    throw Error('Invalid compression policy');

  return {
    phase: 'idle',
    tokens: 0,
    revision: 0,
    queue: [],
    active: null,
    job: null,
    context: null,
    lastCompleted: null,
    deleted: false,
    policy: { ...policy },
  };
}

module.exports = { PromptManager, initialState };
