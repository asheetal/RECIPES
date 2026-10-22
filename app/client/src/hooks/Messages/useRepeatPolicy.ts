import { useContext } from 'react';
import type { TMessage } from 'librechat-data-provider';
import { MessagesViewContext } from '~/Providers/MessagesViewContext';
import { lastReply, modelChanged, ancestorMessages } from './repeatPolicy';

export default function useRepeatPolicy(message?: TMessage) {
  const ctx = useContext(MessagesViewContext);
  const messages = ctx?.getMessages() ?? [];
  const prompt = message?.isCreatedByUser ? message : messages.find(m => m.messageId === message?.parentMessageId);
  const reply = prompt ? lastReply(prompt, messages, ctx?.latestMessageId) : undefined;
  const changed = modelChanged(ctx?.conversation, reply ?? (message?.isCreatedByUser ? undefined : message));
  const canRepeat = !!ctx && !!prompt && changed && !ctx.isSubmitting && ancestorMessages(prompt, messages) !== null;
  function repeat() {
    if (!ctx || ctx.isSubmitting || !prompt) return;
    const current = ctx.getMessages() ?? [];
    const baseline = lastReply(prompt, current, ctx.latestMessageId);
    if (!modelChanged(ctx.conversation, baseline)) return;
    const prefix = ancestorMessages(prompt, current);
    if (!prefix) return;
    ctx.ask({ text: prompt.text || '', parentMessageId: prompt.parentMessageId, conversationId: prompt.conversationId }, {
      overrideMessages: prefix,
      overrideFiles: prompt.files,
      overrideManualSkills: prompt.manualSkills,
      overrideQuotes: prompt.quotes,
    });
  }
  return { canRepeat, changed, repeat };
}
