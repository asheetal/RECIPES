import useAfterCompression from '~/hooks/Chat/useAfterCompression';
export default function CompressionWait({conversationId}: {conversationId: string}) {
  const state = useAfterCompression(conversationId);
  if (!state?.active) return null;
  return <div role="status" aria-live="polite" className="mx-3 mt-2 rounded-lg px-3 py-2 text-sm" style={{backgroundColor:'#EDE3D5', color:'#5C4B3A'}}><span className="motion-safe:animate-pulse">Compressing…</span></div>;
}
