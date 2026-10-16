type Message = { messageId?: string; parentMessageId?: string | null; isCreatedByUser?: boolean; model?: string | null; endpoint?: string | null; text?: string; createdAt?: string | Date };
type Selection = { model?: string | null; endpoint?: string | null; agent_id?: string | null; assistant_id?: string | null };
export function modelChanged(selection: Selection | null | undefined, previous: Message | undefined): boolean {
  if (!selection || !previous?.model) return false;
  const model = selection.endpoint === 'agents' ? selection.agent_id :
    /assistants/i.test(selection.endpoint || '') ? selection.assistant_id : selection.model;
  if (!model) return false;
  return model !== previous.model || (!!previous.endpoint && !!selection.endpoint && previous.endpoint !== selection.endpoint);
}
export function textChanged(draft: string, original: string): boolean {
  return draft.trim().length > 0 && draft.trim() !== original.trim();
}
export function lastReply<T extends Message>(prompt: Message, messages: T[], latestId?: string): T | undefined {
  const byId = new Map(messages.map(m => [m.messageId, m]));
  let current = byId.get(latestId); const seen = new Set<string>();
  while (current?.messageId && !seen.has(current.messageId)) {
    seen.add(current.messageId);
    if (!current.isCreatedByUser && current.parentMessageId === prompt.messageId) return current;
    current = byId.get(current.parentMessageId ?? undefined);
  }
  return messages.filter(m => !m.isCreatedByUser && m.parentMessageId === prompt.messageId)
    .sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
}
export function ancestorMessages<T extends Message>(prompt: Message, messages: T[]): T[] | null {
  const byId = new Map(messages.map(m => [m.messageId,m]));
  const result: T[] = []; const seen = new Set<string>(); let parent = prompt.parentMessageId;
  while (parent && parent !== '00000000-0000-0000-0000-000000000000') {
    if (seen.has(parent)) return null;
    seen.add(parent); const m = byId.get(parent);
    if (!m) return null;
    result.unshift(m); parent = m.parentMessageId;
  }
  return result;
}
