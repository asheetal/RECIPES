import { useAuthContext } from '~/hooks/AuthContext';
import { memo, useRef, useMemo, useCallback } from 'react';
import { ContentTypes } from 'librechat-data-provider';
import type {
  TMessageContentParts,
  SearchResultData,
  TAttachment,
  Agents,
} from 'librechat-data-provider';
import type { ToolCallGroupExpansionState } from './ToolCallGroup';
import { ParallelContentRenderer, type PartWithIndex } from './ParallelContent';
import { mapAttachments, groupSequentialToolCalls } from '~/utils';
import { useMessagesOperations, MessageContext, SearchContext } from '~/Providers';
import PendingSkillCall from './Parts/PendingSkillCall';
import { EditTextPart, EmptyText, AttachmentGroup } from './Parts';
import MemoryArtifacts from './MemoryArtifacts';
import FinalDownloads from './FinalDownloads';
import ToolCallGroup from './ToolCallGroup';
import Container from './Container';
import Part from './Part';
import { progressState, diagnosticSummary, buildDiagnostic, pauseInfo, continuationPrompt } from './progress';

const getToolCallId = (part: TMessageContentParts): string =>
  (part?.[ContentTypes.TOOL_CALL] as Agents.ToolCall | undefined)?.id ?? '';

const getToolGroupId = (parts: PartWithIndex[], fallbackScope: number): string => {
  const firstPart = parts[0];
  if (!firstPart) {
    return 'empty';
  }
  const toolCallId = getToolCallId(firstPart.part);
  if (toolCallId) {
    return `tool:${toolCallId}`;
  }
  return `fallback:${fallbackScope}:${firstPart.idx}`;
};

type PartWithContextProps = {
  part: TMessageContentParts;
  idx: number;
  isLastPart: boolean;
  messageId: string;
  conversationId?: string | null;
  nextType?: string;
  isSubmitting: boolean;
  isLatestMessage?: boolean;
  isCreatedByUser: boolean;
  isLast: boolean;
  partAttachments: TAttachment[] | undefined;
  hideAttachments?: boolean;
  onToolExpand?: () => void;
};

const PartWithContext = memo(function PartWithContext({
  part,
  idx,
  isLastPart,
  messageId,
  conversationId,
  nextType,
  isSubmitting,
  isLatestMessage,
  isCreatedByUser,
  isLast,
  partAttachments,
  hideAttachments,
  onToolExpand,
}: PartWithContextProps) {
  const contextValue = useMemo(
    () => ({
      messageId,
      isExpanded: true as const,
      conversationId,
      partIndex: idx,
      nextType,
      isSubmitting,
      isLatestMessage,
    }),
    [messageId, conversationId, idx, nextType, isSubmitting, isLatestMessage],
  );

  return (
    <MessageContext.Provider value={contextValue}>
      <Part
        part={part}
        attachments={partAttachments}
        isSubmitting={isSubmitting}
        key={`part-${messageId}-${idx}`}
        isCreatedByUser={isCreatedByUser}
        isLast={isLastPart}
        showCursor={isLastPart && isLast}
        hideAttachments={hideAttachments}
        onToolExpand={onToolExpand}
      />
    </MessageContext.Provider>
  );
});

type ContentPartsProps = {
  content: Array<TMessageContentParts | undefined> | undefined;
  messageId: string;
  /**
   * Skill names the user invoked manually via the `$` popover on this turn.
   * `createdHandler` seeds this on the assistant placeholder from
   * `submission.manualSkills`, and `finalHandler`'s server-backed
   * `responseMessage` replacement drops it — so the field is naturally
   * present only for the lifetime of the stream. Scalar string array (not
   * the full message object) so `React.memo` stays shallow-happy.
   */
  manualSkills?: string[];
  /** ISO timestamp of the parent message, surfaced in parallel column headers. */
  createdAt?: string | null;
  diagnosticMetadata?: Record<string, unknown>;
  messageError?: boolean;
  unfinished?: boolean;
  conversationId?: string | null;
  attachments?: TAttachment[];
  searchResults?: { [key: string]: SearchResultData };
  isCreatedByUser: boolean;
  isLast: boolean;
  isSubmitting: boolean;
  isLatestMessage?: boolean;
  edit?: boolean;
  enterEdit?: (cancel?: boolean) => void | null | undefined;
  siblingIdx?: number;
  setSiblingIdx?:
    | ((value: number) => void | React.Dispatch<React.SetStateAction<number>>)
    | null
    | undefined;
};

/**
 * ContentParts renders message content parts, handling both sequential and parallel layouts.
 *
 * For 90% of messages (single-agent, no parallel execution), this renders sequentially.
 * For multi-agent parallel execution, it uses ParallelContentRenderer to show columns.
 */
const ContentParts = memo(function ContentParts({
  edit,
  isLast,
  content,
  manualSkills,
  messageId,
  enterEdit,
  siblingIdx,
  attachments,
  isSubmitting,
  setSiblingIdx,
  searchResults,
  conversationId,
  isCreatedByUser,
  isLatestMessage,
  createdAt,
  diagnosticMetadata,
  messageError,
  unfinished,
}: ContentPartsProps) {
  const { user } = useAuthContext();
  const { ask } = useMessagesOperations();
  const continueClicked = useRef(false);
  const attachmentMap = useMemo(() => mapAttachments(attachments ?? []), [attachments]);
  const effectiveIsSubmitting = isLatestMessage ? isSubmitting : false;
  const toolGroupExpansionRef = useRef(new Map<string, ToolCallGroupExpansionState>());
  const fallbackScopeRef = useRef({ messageId, scope: 0 });
  if (fallbackScopeRef.current.messageId !== messageId) {
    if (!effectiveIsSubmitting) {
      fallbackScopeRef.current.scope += 1;
      toolGroupExpansionRef.current.clear();
    }
    fallbackScopeRef.current.messageId = messageId;
  }
  const fallbackScope = fallbackScopeRef.current.scope;

  const handleGroupExpansionChange = useCallback(
    (groupId: string, state: ToolCallGroupExpansionState) => {
      if (!state.userOverride) {
        toolGroupExpansionRef.current.delete(groupId);
        return;
      }
      toolGroupExpansionRef.current.set(groupId, state);
    },
    [],
  );

  /**
   * Interim skill cards — rendered in a separate slot ABOVE the Parts
   * iteration based purely on the `manualSkills` message field. `content`
   * is only read to determine the "Running → Ran" visual transition
   * (`hasRealContent`), never to gate visibility, so backend deltas /
   * optimistic emissions can't race the pending cards off the screen.
   *
   * Lifecycle:
   *  - `useChatFunctions` seeds `manualSkills` on the assistant placeholder
   *    at construction → cards appear immediately on submit, with the
   *    shimmering "Running X" state (no content yet).
   *  - Through the stream, `useStepHandler` spreads the response on every
   *    update so `manualSkills` rides along; once the first real content
   *    part lands, `hasRealContent` flips true and the cards switch to
   *    the static "Ran X" state — matching what users see for
   *    model-invoked skills as they finish priming.
   *  - At finalize, `finalHandler` replaces the message with the server
   *    response (no `manualSkills` field) → interim cards disappear and
   *    the real `skill` tool_call part in `content` takes over.
   *
   * Skipped on the user side (they get `SkillPills` on the user
   * bubble) and when no skills were invoked on this turn.
   */
  const pendingSkills = useMemo(
    () => (!isCreatedByUser && manualSkills != null ? manualSkills : []),
    [isCreatedByUser, manualSkills],
  );
  const hasPendingSkills = pendingSkills.length > 0;

  /**
   * True once the assistant has started streaming something meaningful —
   * any non-text part, OR a text part with non-empty content. Drives the
   * "Running X → Ran X" transition on pending cards. An empty-text
   * placeholder (some endpoints seed one in `initialResponse.content` on
   * assistant-side) does NOT count as real content, to avoid flipping
   * the transition before the model has actually produced anything.
   */
  const hasRealContent = useMemo(
    () =>
      (content ?? []).some((part) => {
        if (part == null) {
          return false;
        }
        if (part.type !== ContentTypes.TEXT) {
          return true;
        }
        const text = typeof part.text === 'string' ? part.text : (part.text?.value ?? '');
        return text.length > 0;
      }),
    [content],
  );

  const renderPendingSkills = () =>
    pendingSkills.map((name) => (
      <PendingSkillCall key={`pending-skill-${name}`} skillName={name} loaded={hasRealContent} />
    ));

  const renderPart = useCallback(
    (part: TMessageContentParts, idx: number, isLastPart: boolean) => {
      return (
        <PartWithContext
          key={`provider-${messageId}-${idx}`}
          idx={idx}
          part={part}
          isLast={isLast}
          messageId={messageId}
          isLastPart={isLastPart}
          conversationId={conversationId}
          isLatestMessage={isLatestMessage}
          isCreatedByUser={isCreatedByUser}
          nextType={content?.[idx + 1]?.type}
          isSubmitting={effectiveIsSubmitting}
          partAttachments={attachmentMap[getToolCallId(part)]}
        />
      );
    },
    [
      attachmentMap,
      content,
      conversationId,
      effectiveIsSubmitting,
      isCreatedByUser,
      isLast,
      isLatestMessage,
      messageId,
    ],
  );

  const renderGroupedPart = useCallback(
    (part: TMessageContentParts, idx: number, isLastPart: boolean, onToolExpand?: () => void) => {
      return (
        <PartWithContext
          key={`provider-${messageId}-${idx}`}
          idx={idx}
          part={part}
          isLast={isLast}
          messageId={messageId}
          isLastPart={isLastPart}
          conversationId={conversationId}
          isLatestMessage={isLatestMessage}
          isCreatedByUser={isCreatedByUser}
          nextType={content?.[idx + 1]?.type}
          isSubmitting={effectiveIsSubmitting}
          partAttachments={attachmentMap[getToolCallId(part)]}
          hideAttachments
          onToolExpand={onToolExpand}
        />
      );
    },
    [
      attachmentMap,
      content,
      conversationId,
      effectiveIsSubmitting,
      isCreatedByUser,
      isLast,
      isLatestMessage,
      messageId,
    ],
  );

  const sequentialParts = useMemo<PartWithIndex[]>(() => {
    if (!content) {
      return [];
    }
    const result: PartWithIndex[] = [];
    content.forEach((part, idx) => {
      if (part) {
        result.push({ part, idx });
      }
    });
    return result;
  }, [content]);

  const groupedParts = useMemo(
    () =>
      groupSequentialToolCalls(sequentialParts).map((group) => {
        if (group.type === 'single') {
          return group;
        }
        const groupId = getToolGroupId(group.parts, fallbackScope);
        const groupAttachments = group.parts.flatMap(
          ({ part }) => attachmentMap[getToolCallId(part)] ?? [],
        );
        return { ...group, groupId, groupAttachments };
      }),
    [sequentialParts, attachmentMap, fallbackScope],
  );

  // Early return: no content to render AND no pending skill cards
  if (!content && !hasPendingSkills) {
    return null;
  }

  // Edit mode: render editable text parts. Interim skill cards are a
  // mid-stream concern, not relevant in edit mode.
  if (edit === true && enterEdit && setSiblingIdx) {
    return (
      <>
        {(content ?? []).map((part, idx) => {
          if (!part) {
            return null;
          }
          const isTextPart =
            part?.type === ContentTypes.TEXT ||
            typeof (part as unknown as Agents.MessageContentText)?.text === 'string';
          const isThinkPart =
            part?.type === ContentTypes.THINK ||
            typeof (part as unknown as Agents.ReasoningDeltaUpdate)?.think === 'string';
          if (!isTextPart && !isThinkPart) {
            return null;
          }

          const isToolCall = part.type === ContentTypes.TOOL_CALL || part['tool_call_ids'] != null;
          if (isToolCall) {
            return null;
          }

          return (
            <EditTextPart
              index={idx}
              part={part as Agents.MessageContentText | Agents.ReasoningDeltaUpdate}
              messageId={messageId}
              isSubmitting={isSubmitting}
              enterEdit={enterEdit}
              siblingIdx={siblingIdx ?? null}
              setSiblingIdx={setSiblingIdx}
              key={`edit-${messageId}-${idx}`}
            />
          );
        })}
      </>
    );
  }

  const safeContent = content ?? [];
  const showEmptyCursor = safeContent.length === 0 && effectiveIsSubmitting;
  const lastContentIdx = safeContent.length - 1;

  // Progress is driven by actual tool events, not just model commentary.
  if (!isCreatedByUser && !edit) {
    const state = progressState(safeContent, attachments ?? [], messageError, unfinished && !effectiveIsSubmitting);
    if (effectiveIsSubmitting) {
      return <div role="status" aria-live="polite" style={{backgroundColor: "#EDE3D5", color: "#5C4B3A"}}
        className="my-2 rounded-lg bg-black/5 px-3 py-2 text-sm text-text-secondary dark:bg-white/5">
        <span className="inline-block motion-safe:animate-pulse">{state.status}</span>
        {state.recoveryWarnings.map((warning) => <p key={warning} role="alert" className="mt-2">{warning}</p>)}
      </div>;
    }
    const paused = pauseInfo(safeContent);
    if (paused && !messageError && !unfinished) {
      return <SearchContext.Provider value={{ searchResults }}>
        <div role="status" className="my-2 rounded-lg px-3 py-2 text-sm" style={{backgroundColor:'#EDE3D5',color:'#5C4B3A'}}>Paused: work remaining</div>
        <FinalDownloads files={state.finalFiles} missing={state.missingFiles} />
        {state.finalParts.map(({part,idx}) => renderPart(part,idx,idx===state.parts.length-1))}
        {isLatestMessage && <button type="button" disabled={isSubmitting} className="my-2 rounded-lg border px-3 py-2 text-sm" onClick={(e)=>{
          if(isSubmitting || continueClicked.current || !conversationId)return;
          continueClicked.current=true;e.currentTarget.disabled=true;
          try { ask({text:continuationPrompt(paused),parentMessageId:messageId,conversationId}); }
          catch(error){continueClicked.current=false;e.currentTarget.disabled=false;throw error;}
        }}>Continue unfinished work</button>}
        <details className="my-2 text-sm"><summary>Diagnostic log</summary><button type="button" className="my-2 rounded border p-2" onClick={()=>{
          const blob=new Blob([JSON.stringify(buildDiagnostic({messageId,conversationId,content:safeContent,attachments:attachments??[],messageError,unfinished,metadata:diagnosticMetadata??{createdAt}}),null,2)],{type:'application/json'});
          const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='chat-diagnostic.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
        }}>Download diagnostic log</button></details>
      </SearchContext.Provider>;
    }
    if (state.problem && user?.role !== 'ADMIN') {
      return <div role="status" aria-live="polite" className="my-2 rounded-lg px-3 py-2 text-sm"
        style={{backgroundColor:'#EDE3D5',color:'#5C4B3A'}}>
        The model has crashed. Please repeat your prompt by changing prompt or by changing model. The admin has been notified of the model crash.
      </div>;
    }
    if (state.problem) {
      return <SearchContext.Provider value={{ searchResults }}>
        {state.recoveryWarnings.map((warning) => <p key={warning} role="alert" className="my-2 rounded border p-2 text-sm">{warning}</p>)}
        <FinalDownloads files={state.finalFiles} missing={state.missingFiles} />
        <details open className="my-2 rounded-lg border border-border-light p-3">
          <summary className="cursor-pointer text-sm font-medium">{diagnosticSummary(safeContent, messageError, unfinished).title}</summary>
          <button type="button" className="my-2 rounded border px-2 py-1 text-xs"
            onClick={() => {
              const blob = new Blob([JSON.stringify(buildDiagnostic({messageId, conversationId, content: safeContent, attachments: attachments ?? [], messageError, unfinished, metadata: diagnosticMetadata ?? {createdAt}}), null, 2)], {type:'application/json'});
              const url = URL.createObjectURL(blob); const a = document.createElement('a');
              a.href=url; a.download='chat-diagnostic.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
            }}>Download diagnostic log</button>
          {state.parts.map((part, idx) => renderPart(part, idx, idx === state.parts.length - 1))}
          <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-all text-xs">{JSON.stringify(content, null, 2)}</pre>
        </details>
      </SearchContext.Provider>;
    }
    if (state.lastTool >= 0) {
      return <SearchContext.Provider value={{searchResults}}>
        {state.recoveryWarnings.map((warning) => <p key={warning} role="alert" className="my-2 rounded border p-2 text-sm">{warning}</p>)}
        <FinalDownloads files={state.finalFiles} missing={state.missingFiles} />
        {state.finalParts.length ? state.finalParts.map(({part, idx}) => renderPart(part, idx, idx === state.parts.length - 1)) :
          <div className="text-sm text-text-secondary">No final response was saved. Your files remain available in Chat Files.</div>}
      </SearchContext.Provider>;
    }
  }

  // Parallel content: use dedicated renderer with columns (TMessageContentParts includes ContentMetadata)
  const hasParallelContent = safeContent.some((part) => part?.groupId != null);
  if (hasParallelContent) {
    return (
      <>
        {renderPendingSkills()}
        <ParallelContentRenderer
          content={content}
          messageId={messageId}
          createdAt={createdAt}
          conversationId={conversationId}
          attachments={attachments}
          searchResults={searchResults}
          isSubmitting={effectiveIsSubmitting}
          renderPart={renderPart}
        />
      </>
    );
  }

  // Sequential content: render parts in order (90% of cases)
  return (
    <SearchContext.Provider value={{ searchResults }}>
      <MemoryArtifacts attachments={attachments} />
      {renderPendingSkills()}
      {showEmptyCursor && (
        <Container>
          <EmptyText />
        </Container>
      )}
      {groupedParts.map((group) => {
        if (group.type === 'single') {
          const { part, idx } = group.part;
          return renderPart(part, idx, idx === lastContentIdx);
        }
        const { groupId } = group;
        return (
          <ToolCallGroup
            key={`tool-group-${groupId}`}
            parts={group.parts}
            isSubmitting={effectiveIsSubmitting}
            isLast={group.parts.some((p) => p.idx === lastContentIdx)}
            renderPart={renderGroupedPart}
            lastContentIdx={lastContentIdx}
            groupAttachments={group.groupAttachments}
            initialExpansionState={toolGroupExpansionRef.current.get(groupId)}
            onExpansionChange={(state) => handleGroupExpansionChange(groupId, state)}
          />
        );
      })}
    </SearchContext.Provider>
  );
});

export default ContentParts;
