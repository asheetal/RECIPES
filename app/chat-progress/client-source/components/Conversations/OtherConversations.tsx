import { useId, useMemo, useEffect, useState } from 'react';
import { ChevronRight, MessagesSquare } from 'lucide-react';
import { useActiveJobs, useConversationsInfiniteQuery } from '~/data-provider';
import { useLocalStorage } from '~/hooks';
import Convo from '~/components/Conversations/Convo';

const noop = () => {};
export default function OtherConversations({ toggleNav }: { toggleNav: () => void }) {
  const [open, setOpen] = useLocalStorage('labOtherConversationsExpanded', false);
  const id = useId();
  const [wanted, setWanted] = useState(20);
  const { data: activeJobsData } = useActiveJobs();
  const activeJobIds = new Set(activeJobsData?.activeJobIds ?? []);
  const q = useConversationsInfiniteQuery(
    { isArchived: false, sortBy: 'updatedAt', sortDirection: 'desc' },
    { enabled: open, staleTime: 30000 },
  );
  // Filter every loaded page, never assume the first page contains all unassigned chats.
  const chats = useMemo(() => {
    const seen = new Set<string>();
    return (q.data?.pages.flatMap(p => p.conversations) ?? []).filter(c => {
      if (c.chatProjectId || !c.conversationId || seen.has(c.conversationId)) return false;
      seen.add(c.conversationId); return true;
    });
  }, [q.data]);
  useEffect(() => {
    if (open && chats.length < wanted && q.hasNextPage && !q.isFetching && !q.isError) void q.fetchNextPage();
  }, [open, chats.length, wanted, q.hasNextPage, q.isFetching, q.isError, q.fetchNextPage]);
  return <div className="mt-1">
    <button type="button" aria-expanded={open} aria-controls={id}
      onClick={() => setOpen(!open)}
      className="flex h-9 w-full items-center gap-1.5 rounded-lg pl-1.5 pr-2 text-left text-sm hover:bg-surface-hover">
      <ChevronRight size={14} className={open ? 'rotate-90' : ''} aria-hidden="true" />
      <MessagesSquare size={16} aria-hidden="true" /><span className="truncate">Other conversations</span>
    </button>
    {open && <div id={id} className="pl-3">
      {chats.map(c => <Convo key={c.conversationId} conversation={c} retainView={noop}
        toggleNav={toggleNav} isGenerating={activeJobIds.has(c.conversationId!)} />)}
      {q.isLoading && <p role="status" className="px-3 py-2 text-xs">Loading conversations…</p>}
      {q.isError && <button onClick={() => void q.refetch()} className="px-3 py-2 text-xs">Could not load conversations. Retry</button>}
      {!q.isLoading && !q.isError && !chats.length && !q.hasNextPage &&
        <p className="px-3 py-2 text-xs text-text-secondary">No conversations outside projects.</p>}
      {q.hasNextPage && <button type="button" disabled={q.isFetchingNextPage}
        onClick={() => { setWanted(chats.length + 20); void q.fetchNextPage(); }} className="px-3 py-2 text-xs text-text-secondary hover:text-text-primary">
        {q.isFetchingNextPage ? 'Loading…' : 'Load more conversations'}
      </button>}
    </div>}
  </div>;
}
