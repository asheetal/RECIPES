import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { request, apiBaseUrl, QueryKeys } from 'librechat-data-provider';
type CompressionStatus = { active: boolean; waiting: boolean; canEdit: boolean; state: string; tokens: number };
export default function useAfterCompression(conversationId?: string | null) {
  const client = useQueryClient();
  const previous = useRef<{id?: string | null; active: boolean}>({active: false});
  const query = useQuery<CompressionStatus>(
    ['afterCompression', conversationId],
    () => request.get<CompressionStatus>(`${apiBaseUrl()}/api/agents/chat/compression/${encodeURIComponent(conversationId || '')}`),
    {enabled: !!conversationId && conversationId !== 'new', refetchInterval: 1000, refetchIntervalInBackground: true, retry: false, staleTime: 500},
  );
  useEffect(() => {
    if (previous.current.id === conversationId && previous.current.active && query.data && !query.data.active) {
      client.invalidateQueries([QueryKeys.messages, conversationId]);
    }
    previous.current = {id: conversationId, active: !!query.data?.active};
  }, [query.data, conversationId, client]);
  return query.data;
}
