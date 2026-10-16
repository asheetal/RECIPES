const require_langfuseConfig = require("../langfuseConfig.cjs");
const require_langfuseRuntimeScope = require("../langfuseRuntimeScope.cjs");
const require_langfuse = require("../langfuse.cjs");
const require_callbacks = require("../utils/callbacks.cjs");
const require_enum = require("../common/enum.cjs");
require("../common/index.cjs");
const require_tokens = require("../utils/tokens.cjs");
const require_langfuseToolOutputTracing = require("../langfuseToolOutputTracing.cjs");
const require_instrumentation = require("../instrumentation.cjs");
const require_core = require("../messages/core.cjs");
const require_ids = require("../messages/ids.cjs");
const require_prune = require("../messages/prune.cjs");
const require_budget = require("../messages/budget.cjs");
const require_events = require("../utils/events.cjs");
const require_format = require("../messages/format.cjs");
const require_cache = require("../messages/cache.cjs");
const require_anthropicToolCache = require("../messages/anthropicToolCache.cjs");
const require_content = require("../messages/content.cjs");
const require_tools = require("../messages/tools.cjs");
const require_reducer = require("../messages/reducer.cjs");
require("../messages/index.cjs");
const require_graph = require("../utils/graph.cjs");
const require_llm = require("../utils/llm.cjs");
const require_handlers = require("../tools/handlers.cjs");
const require_toolOutputReferences = require("../tools/toolOutputReferences.cjs");
const require_run = require("../utils/run.cjs");
require("../utils/index.cjs");
const require_toolCache = require("../llm/openrouter/toolCache.cjs");
const require_LocalCodingTools = require("../tools/local/LocalCodingTools.cjs");
const require_CloudflareSandboxTools = require("../tools/cloudflare/CloudflareSandboxTools.cjs");
require("../tools/cloudflare/index.cjs");
const require_resolveLocalExecutionTools = require("../tools/local/resolveLocalExecutionTools.cjs");
require("../tools/local/index.cjs");
const require_ToolNode = require("../tools/ToolNode.cjs");
const require_SubagentExecutor = require("../tools/subagent/SubagentExecutor.cjs");
require("../tools/subagent/index.cjs");
const require_toolCache$1 = require("../llm/bedrock/toolCache.cjs");
const require_init = require("../llm/init.cjs");
const require_invoke = require("../llm/invoke.cjs");
const require_SubagentTool = require("../tools/SubagentTool.cjs");
const require_index$6 = require("../summarization/index.cjs");
const require_request = require("../llm/request.cjs");
const require_node = require("../summarization/node.cjs");
const require_schema = require("../tools/schema.cjs");
const require_AgentContext = require("../agents/AgentContext.cjs");
const require_fake = require("../llm/fake.cjs");
let _langchain_core_messages = require("@langchain/core/messages");
let _langchain_langgraph = require("@langchain/langgraph");
let _langchain_core_tools = require("@langchain/core/tools");
let nanoid = require("nanoid");
//#region src/graphs/Graph.ts
const { AGENT, TOOLS, SUMMARIZE } = require_enum.GraphNodeKeys;
/** Minimum relative variance before calibrated toolSchemaTokens overrides current value. */
const CALIBRATION_VARIANCE_THRESHOLD = .15;
/**
* Start index of the span post-prune formatters can mutate in place: the
* trailing tool batch plus its owning AI message (artifact formatting touches
* every tool result after the last AI tool call; Bedrock rewrites the AI
* message before a trailing tool result). Capped so the usage-snapshot
* recount stays constant-cost.
*/
function trailingMutationStart(messages) {
	const MAX_SPAN = 16;
	let index = messages.length - 1;
	while (index >= 0 && messages[index]?.getType() === "tool" && messages.length - index < MAX_SPAN) index--;
	return Math.max(0, Math.min(index, messages.length - 2));
}
function getHandlerDispatchedEventKey(eventName, stepId) {
	return `${eventName}:${stepId}`;
}
function getReasoningText(value) {
	if (typeof value === "string") return value !== "" ? value : void 0;
	const summaryText = value?.summary?.map((summary) => summary.text ?? "").filter((text) => text !== "").join("");
	return summaryText != null && summaryText !== "" ? summaryText : void 0;
}
function getReasoningDetailsText(value) {
	if (!Array.isArray(value)) return;
	const reasoningText = value.filter((detail) => detail.type === "reasoning.text").map((detail) => detail.text ?? "").filter((text) => text !== "").join("");
	return reasoningText !== "" ? reasoningText : void 0;
}
function getResponseReasoningContent({ responseMessage, reasoningKey }) {
	const additionalKwargs = responseMessage?.additional_kwargs;
	if (additionalKwargs == null) return;
	const keyedReasoning = getReasoningText(additionalKwargs[reasoningKey]);
	if (keyedReasoning != null) return keyedReasoning;
	const reasoningContent = getReasoningText(additionalKwargs.reasoning_content);
	if (reasoningContent != null) return reasoningContent;
	const reasoning = getReasoningText(additionalKwargs.reasoning);
	if (reasoning != null) return reasoning;
	return getReasoningDetailsText(additionalKwargs.reasoning_details);
}
function isTextMessageContentPart(contentPart) {
	return typeof contentPart === "object" && "type" in contentPart && typeof contentPart.type === "string" && contentPart.type.startsWith("text");
}
function isGoogleServerSideToolMessageContentPart(contentPart) {
	return typeof contentPart === "object" && "type" in contentPart && (contentPart.type === "toolCall" || contentPart.type === "toolResponse");
}
function hasGoogleServerSideToolDeltaContent(provider, content) {
	return require_llm.isGoogleLike(provider) && Array.isArray(content) && content.some((contentPart) => isGoogleServerSideToolMessageContentPart(contentPart));
}
function getMessageDeltaContent(provider, content) {
	if (content == null) return;
	if (typeof content === "string") return content !== "" ? [{
		type: "text",
		text: content
	}] : void 0;
	if (content.length === 0) return;
	const hasGoogleServerSideToolPart = require_llm.isGoogleLike(provider) && content.some((contentPart) => isGoogleServerSideToolMessageContentPart(contentPart));
	if (content.every((contentPart) => isTextMessageContentPart(contentPart))) return content;
	if (!hasGoogleServerSideToolPart) return;
	const messageContent = content.filter((contentPart) => isTextMessageContentPart(contentPart) || isGoogleServerSideToolMessageContentPart(contentPart));
	return messageContent.length > 0 ? messageContent : void 0;
}
function hasTextDeltaContent(content) {
	if (content == null) return false;
	return content.some((contentPart) => {
		if (contentPart.type?.startsWith("text") !== true) return false;
		const text = contentPart.text;
		return typeof text === "string" && text !== "";
	});
}
function hasReasoningDeltaContent(content) {
	if (content == null) return false;
	return content.some((contentPart) => contentPart.type === "think" && contentPart.think !== "");
}
function getCurrentStepIds({ graph, metadata }) {
	const baseStepKey = graph.getStepBaseKey(metadata);
	const currentStepIds = [];
	for (const [stepKey, stepIds] of graph.stepKeyIds) {
		if (stepKey !== baseStepKey && !stepKey.startsWith(`${baseStepKey}_`)) continue;
		currentStepIds.push(...stepIds);
	}
	return currentStepIds;
}
function hasCurrentTextDeltaStep({ graph, metadata }) {
	return getCurrentStepIds({
		graph,
		metadata
	}).some((stepId) => graph.messageStepHasTextDeltas.has(stepId));
}
function hasCurrentReasoningDeltaStep({ graph, metadata }) {
	return getCurrentStepIds({
		graph,
		metadata
	}).some((stepId) => graph.reasoningStepHasDeltas.has(stepId));
}
function clearCurrentDeltaStepMarkers({ graph, metadata }) {
	for (const stepId of getCurrentStepIds({
		graph,
		metadata
	})) {
		graph.messageStepHasTextDeltas.delete(stepId);
		graph.reasoningStepHasDeltas.delete(stepId);
	}
}
async function dispatchMessageCreationStep({ graph, stepKey, messageId, metadata }) {
	await graph.dispatchRunStep(stepKey, {
		type: "message_creation",
		message_creation: { message_id: messageId }
	}, metadata);
	return graph.getStepIdByKey(stepKey);
}
async function dispatchTextMessageContent({ graph, stepKey, provider, content, metadata }) {
	const messageId = require_ids.getMessageId(stepKey, graph) ?? "";
	if (!messageId) return false;
	if (hasGoogleServerSideToolDeltaContent(provider, content)) {
		for (const contentPart of content) {
			const stepId = await dispatchMessageCreationStep({
				graph,
				stepKey,
				messageId,
				metadata
			});
			await graph.dispatchMessageDelta(stepId, { content: [contentPart] }, metadata);
		}
		return true;
	}
	const stepId = await dispatchMessageCreationStep({
		graph,
		stepKey,
		messageId,
		metadata
	});
	await graph.dispatchMessageDelta(stepId, { content }, metadata);
	return true;
}
async function dispatchReasoningContent({ graph, agentContext, reasoningContent, metadata }) {
	const previousTokenType = agentContext.currentTokenType;
	const previousTokenTypeSwitch = agentContext.tokenTypeSwitch;
	const previousTransitionCount = agentContext.reasoningTransitionCount;
	agentContext.currentTokenType = "think";
	agentContext.tokenTypeSwitch = "reasoning";
	const stepKey = graph.getStepKey(metadata);
	const messageId = require_ids.getMessageId(stepKey, graph) ?? "";
	if (!messageId) {
		agentContext.currentTokenType = previousTokenType;
		agentContext.tokenTypeSwitch = previousTokenTypeSwitch;
		agentContext.reasoningTransitionCount = previousTransitionCount;
		return false;
	}
	await graph.dispatchRunStep(stepKey, {
		type: "message_creation",
		message_creation: { message_id: messageId }
	}, metadata);
	const stepId = graph.getStepIdByKey(stepKey);
	await graph.dispatchReasoningDelta(stepId, { content: [{
		type: "think",
		think: reasoningContent
	}] }, metadata);
	return true;
}
function markPostReasoningContent(agentContext) {
	if (agentContext.tokenTypeSwitch !== "reasoning" || agentContext.currentTokenType === "text") return;
	agentContext.currentTokenType = "text";
	agentContext.tokenTypeSwitch = "content";
	agentContext.reasoningTransitionCount++;
}
function getDispatchableFinalReasoningContent({ agentContext, responseReasoningContent, hasStreamedTextDeltaStep, hasStreamedReasoningDeltaStep }) {
	if (responseReasoningContent == null || hasStreamedReasoningDeltaStep) return;
	if (agentContext.provider === "openrouter" && hasStreamedTextDeltaStep) return;
	return responseReasoningContent;
}
var Graph = class {
	messageStepHasTextDeltas = /* @__PURE__ */ new Set();
	messageStepHasToolCalls = /* @__PURE__ */ new Map();
	messageIdsByStepKey = /* @__PURE__ */ new Map();
	prelimMessageIdsByStepKey = /* @__PURE__ */ new Map();
	config;
	contentData = [];
	stepKeyIds = /* @__PURE__ */ new Map();
	contentIndexMap = /* @__PURE__ */ new Map();
	toolCallStepIds = /* @__PURE__ */ new Map();
	/**
	* Step IDs dispatched through the handler registry during this run.
	* Event echo suppression is tracked separately so repeated deltas for
	* the same step are scoped to the active custom event dispatch.
	*/
	handlerDispatchedStepIds = /* @__PURE__ */ new Set();
	reasoningStepHasDeltas = /* @__PURE__ */ new Set();
	handlerDispatchedEventCounts = /* @__PURE__ */ new Map();
	signal;
	/** Set of invoked tool call IDs from non-message run steps completed mid-run, if any */
	invokedToolIds;
	handlerRegistry;
	/**
	* True when event-driven tool execution can be routed through callbacks even
	* though this graph intentionally does not own the full handler registry.
	* Self-spawned subagent graphs use this shape: their callback forwarder sends
	* `ON_TOOL_EXECUTE` to the parent's handler, while child run-step events stay
	* wrapped as `ON_SUBAGENT_UPDATE` instead of leaking as parent events.
	*/
	eventToolExecutionAvailable = false;
	hookRegistry;
	/**
	* Run-scoped HITL configuration. When `humanInTheLoop?.enabled` is
	* `true`, `ToolNode` raises a real `interrupt()` for `PreToolUse`
	* `ask` decisions instead of treating them as a synchronous deny.
	* Threaded from `RunConfig.humanInTheLoop`.
	*/
	humanInTheLoop;
	/**
	* Run-scoped config for the tool output reference registry. Threaded
	* from `RunConfig.toolOutputReferences` down into every ToolNode this
	* graph compiles.
	*/
	toolOutputReferences;
	/**
	* Run-scoped Langfuse defaults. Per-agent config wins when present.
	*/
	langfuse;
	/**
	* Run-scoped opt-in for eager event-driven tool execution. The stream
	* handler may prestart eligible event-driven tools; ToolNode later
	* consumes the settled promises while preserving final ToolMessage order.
	*/
	eagerEventToolExecution;
	eagerEventToolExecutions = /* @__PURE__ */ new Map();
	eagerEventToolUsageCount = /* @__PURE__ */ new Map();
	eagerEventToolUsageCountsByAgentId = /* @__PURE__ */ new Map();
	eagerEventToolCallChunks = /* @__PURE__ */ new Map();
	/**
	* Run-scoped execution backend for built-in code tools. Defaults to the
	* remote Code API sandbox when unset.
	*/
	toolExecution;
	/**
	* Shared registry instance used by every ToolNode compiled from this
	* graph. Lazily constructed on first access so multi-agent graphs
	* produce one registry per run (not one per agent), letting cross-
	* agent `{{tool<i>turn<n>}}` substitutions resolve.
	*/
	_toolOutputRegistry;
	/**
	* Tool session contexts for automatic state persistence across tool invocations.
	* Keyed by tool name (e.g., Constants.EXECUTE_CODE).
	* Currently supports code execution session tracking (session_id, files).
	*/
	sessions = /* @__PURE__ */ new Map();
	/**
	* Clears heavy references to allow GC to reclaim memory held by
	* LangGraph's internal config / AsyncLocalStorage RunTree chain.
	* Call after a run completes and content has been extracted.
	*/
	clearHeavyState() {
		this.config = void 0;
		this.signal = void 0;
		this.contentData = [];
		this.contentIndexMap = /* @__PURE__ */ new Map();
		this.stepKeyIds = /* @__PURE__ */ new Map();
		this.toolCallStepIds.clear();
		this.messageIdsByStepKey = /* @__PURE__ */ new Map();
		this.messageStepHasTextDeltas = /* @__PURE__ */ new Set();
		this.reasoningStepHasDeltas = /* @__PURE__ */ new Set();
		this.messageStepHasToolCalls = /* @__PURE__ */ new Map();
		this.prelimMessageIdsByStepKey = /* @__PURE__ */ new Map();
		this.invokedToolIds = void 0;
		this.handlerRegistry = void 0;
		this.hookRegistry = void 0;
		this.humanInTheLoop = void 0;
		this.toolOutputReferences = void 0;
		this.eagerEventToolExecution = void 0;
		this.eagerEventToolExecutions.clear();
		this.clearEagerEventToolUsageCounts();
		this.eagerEventToolCallChunks.clear();
		this.toolExecution = void 0;
		this.handlerDispatchedEventCounts.clear();
		/**
		* ToolNodes compiled from this graph captured the registry
		* instance at construction time, so simply dropping the Graph's
		* own reference would leave their captured reference — and every
		* stored `tool<i>turn<n>` entry, plus up to `maxTotalSize` of raw
		* output — alive across subsequent `processStream()` calls. Wipe
		* the registry's contents first so subsequent runs start fresh.
		*/
		this._toolOutputRegistry?.clear();
		this._toolOutputRegistry = void 0;
		for (const node of this._compiledToolNodes) node.clearDirectPathTurns();
		this._compiledToolNodes.clear();
		this.sessions.clear();
	}
	getEagerEventToolUsageCount(agentId) {
		if (agentId == null || agentId === "") return this.eagerEventToolUsageCount;
		let usageCount = this.eagerEventToolUsageCountsByAgentId.get(agentId);
		if (usageCount == null) {
			usageCount = /* @__PURE__ */ new Map();
			this.eagerEventToolUsageCountsByAgentId.set(agentId, usageCount);
		}
		return usageCount;
	}
	clearEagerEventToolUsageCounts() {
		this.eagerEventToolUsageCount.clear();
		for (const usageCount of this.eagerEventToolUsageCountsByAgentId.values()) usageCount.clear();
	}
	markHandlerDispatchedEvent(eventName, stepId) {
		const key = getHandlerDispatchedEventKey(eventName, stepId);
		this.handlerDispatchedEventCounts.set(key, (this.handlerDispatchedEventCounts.get(key) ?? 0) + 1);
		return () => {
			const count = this.handlerDispatchedEventCounts.get(key) ?? 0;
			if (count <= 1) {
				this.handlerDispatchedEventCounts.delete(key);
				return;
			}
			this.handlerDispatchedEventCounts.set(key, count - 1);
		};
	}
	hasHandlerDispatchedEvent(eventName, stepId) {
		const key = getHandlerDispatchedEventKey(eventName, stepId);
		return (this.handlerDispatchedEventCounts.get(key) ?? 0) > 0;
	}
	/**
	* Subclass hook to register a freshly compiled ToolNode so
	* `clearHeavyState` can flush its per-Run direct-path turn cache
	* at end-of-Run. Internal — called from `initializeTools` in the
	* concrete graph subclasses.
	*/
	registerCompiledToolNode(node) {
		this._compiledToolNodes.add(node);
	}
	/**
	* Returns the shared `ToolOutputReferenceRegistry` for this run,
	* constructing it on first access. Returns `undefined` when the
	* feature is disabled. All ToolNodes compiled from this graph share
	* this single instance so cross-agent `{{…}}` references resolve.
	*
	* @internal Public so `attemptInvoke` can read it through the typed
	* `InvokeContext` and project ToolMessages into LLM-facing annotated
	* copies right before each provider call (see
	* `annotateMessagesForLLM`). Host code should not call this directly
	* — registry mutations outside the ToolNode lifecycle break the
	* partitioning, eviction, and turn-counter invariants.
	*/
	getOrCreateToolOutputRegistry() {
		if (this.toolOutputReferences?.enabled !== true) return;
		if (this._toolOutputRegistry == null) this._toolOutputRegistry = new require_toolOutputReferences.ToolOutputReferenceRegistry({
			maxOutputSize: this.toolOutputReferences.maxOutputSize,
			maxTotalSize: this.toolOutputReferences.maxTotalSize
		});
		return this._toolOutputRegistry;
	}
	/**
	* Single per-Run file checkpointer shared across every ToolNode the
	* graph compiles. Lazily constructed when
	* `toolExecution.local.fileCheckpointing === true` or
	* `toolExecution.cloudflare.fileCheckpointing === true` so
	* multi-agent graphs see ONE snapshot store, not one-per-agent.
	* Returns undefined when checkpointing is disabled or a supported
	* coding-tool engine isn't selected. Exposed via
	* `Run.getFileCheckpointer()` / `Run.rewindFiles()`.
	*/
	_fileCheckpointer;
	/**
	* ToolNodes compiled into this Graph's workflow. Tracked so
	* `clearHeavyState()` can flush their per-Run direct-path turn
	* cache (`directPathTurns`) at end-of-Run — that map intentionally
	* survives `run()` re-entry (resume-stable per Codex P2 #30) but
	* would otherwise grow linearly with tool calls and could collide
	* across Runs if a provider reuses call ids (Codex P2 #33).
	*/
	_compiledToolNodes = /* @__PURE__ */ new Set();
	getOrCreateFileCheckpointer() {
		if (this._fileCheckpointer != null) return this._fileCheckpointer;
		if (this.toolExecution?.engine === "local" && this.toolExecution.local?.fileCheckpointing === true) {
			const bundle = require_LocalCodingTools.createLocalCodingToolBundle(this.toolExecution.local ?? {});
			this._fileCheckpointer = bundle.checkpointer;
			return this._fileCheckpointer;
		}
		if (this.toolExecution?.engine === "cloudflare-sandbox" && this.toolExecution.cloudflare?.fileCheckpointing === true) {
			const bundle = require_CloudflareSandboxTools.createCloudflareCodingToolBundle(this.toolExecution.cloudflare);
			this._fileCheckpointer = bundle.checkpointer;
			return this._fileCheckpointer;
		}
	}
};
var StandardGraph = class StandardGraph extends Graph {
	overrideModel;
	/** Optional compile options passed into workflow.compile() */
	compileOptions;
	messages = [];
	/** Cached run messages preserved before clearHeavyState() so getRunMessages() works after cleanup. */
	cachedRunMessages;
	runId;
	/**
	* Boundary between historical messages (loaded from conversation state)
	* and messages produced during the current run.  Set once in the state
	* reducer when messages first arrive.  Used by `getRunMessages()` and
	* multi-agent message filtering — NOT for pruner token counting (the
	* pruner maintains its own `lastTurnStartIndex` in its closure).
	*/
	startIndex = 0;
	signal;
	/** Map of agent contexts by agent ID */
	agentContexts = /* @__PURE__ */ new Map();
	/** Default agent ID to use */
	defaultAgentId;
	/**
	* Host sink for model usage emitted inside subagent child runs. Threaded
	* into each `SubagentExecutor` this graph creates (and from there into
	* child graphs, so nested subagents report too). See
	* {@link t.StandardGraphInput.subagentUsageSink}.
	*/
	subagentUsageSink;
	constructor({ runId, signal, agents, langfuse, tokenCounter, indexTokenCountMap, calibrationRatio, subagentUsageSink }) {
		super();
		this.runId = runId;
		this.signal = signal;
		this.langfuse = langfuse;
		this.subagentUsageSink = subagentUsageSink;
		if (agents.length === 0) throw new Error("At least one agent configuration is required");
		for (const agentConfig of agents) {
			const agentContext = require_AgentContext.AgentContext.fromConfig(agentConfig, tokenCounter, indexTokenCountMap);
			if (calibrationRatio != null && calibrationRatio > 0) agentContext.calibrationRatio = calibrationRatio;
			this.agentContexts.set(agentConfig.agentId, agentContext);
		}
		this.defaultAgentId = agents[0].agentId;
	}
	resetValues(keepContent) {
		this.messages = [];
		this.cachedRunMessages = void 0;
		this.config = require_graph.resetIfNotEmpty(this.config, void 0);
		if (keepContent !== true) {
			this.contentData = require_graph.resetIfNotEmpty(this.contentData, []);
			this.contentIndexMap = require_graph.resetIfNotEmpty(this.contentIndexMap, /* @__PURE__ */ new Map());
		}
		this.stepKeyIds = require_graph.resetIfNotEmpty(this.stepKeyIds, /* @__PURE__ */ new Map());
		/**
		* Clear in-place instead of replacing with a new Map to preserve the
		* shared reference held by ToolNode (passed at construction time).
		* Using resetIfNotEmpty would create a new Map, leaving ToolNode with
		* a stale reference on 2nd+ processStream calls.
		*/
		this.toolCallStepIds.clear();
		this.eagerEventToolExecutions.clear();
		this.clearEagerEventToolUsageCounts();
		this.eagerEventToolCallChunks.clear();
		this.handlerDispatchedStepIds = require_graph.resetIfNotEmpty(this.handlerDispatchedStepIds, /* @__PURE__ */ new Set());
		this.handlerDispatchedEventCounts = require_graph.resetIfNotEmpty(this.handlerDispatchedEventCounts, /* @__PURE__ */ new Map());
		this.messageIdsByStepKey = require_graph.resetIfNotEmpty(this.messageIdsByStepKey, /* @__PURE__ */ new Map());
		this.messageStepHasToolCalls = require_graph.resetIfNotEmpty(this.messageStepHasToolCalls, /* @__PURE__ */ new Map());
		this.messageStepHasTextDeltas = require_graph.resetIfNotEmpty(this.messageStepHasTextDeltas, /* @__PURE__ */ new Set());
		this.reasoningStepHasDeltas = require_graph.resetIfNotEmpty(this.reasoningStepHasDeltas, /* @__PURE__ */ new Set());
		this.prelimMessageIdsByStepKey = require_graph.resetIfNotEmpty(this.prelimMessageIdsByStepKey, /* @__PURE__ */ new Map());
		this.invokedToolIds = require_graph.resetIfNotEmpty(this.invokedToolIds, void 0);
		for (const context of this.agentContexts.values()) context.reset();
	}
	clearHeavyState() {
		this.cachedRunMessages = this.messages.slice(this.startIndex);
		super.clearHeavyState();
		this.messages = [];
		this.overrideModel = void 0;
		for (const context of this.agentContexts.values()) context.reset();
	}
	getRunStep(stepId) {
		const index = this.contentIndexMap.get(stepId);
		if (index !== void 0) return this.contentData[index];
	}
	getAgentContext(metadata) {
		if (!metadata) throw new Error("No metadata provided to retrieve agent context");
		const currentNode = metadata.langgraph_node;
		if (!currentNode) throw new Error("No langgraph_node in metadata to retrieve agent context");
		let agentId;
		if (currentNode.startsWith(AGENT)) agentId = currentNode.substring(AGENT.length);
		else if (currentNode.startsWith(TOOLS)) agentId = currentNode.substring(TOOLS.length);
		else if (currentNode.startsWith(SUMMARIZE)) agentId = currentNode.substring(SUMMARIZE.length);
		const agentContext = this.agentContexts.get(agentId ?? "");
		if (!agentContext) throw new Error(`No agent context found for agent ID ${agentId}`);
		return agentContext;
	}
	getStepBaseKey(metadata) {
		if (!metadata) return "";
		const keyList = this.getInvocationKeyList(metadata);
		if (this.checkKeyList(keyList)) throw new Error("Missing metadata");
		return require_graph.joinKeys(keyList);
	}
	getStepKey(metadata) {
		if (!metadata) return "";
		const keyList = this.getKeyList(metadata);
		if (this.checkKeyList(keyList)) throw new Error("Missing metadata");
		return require_graph.joinKeys(keyList);
	}
	getStepIdByKey(stepKey, index) {
		const stepIds = this.stepKeyIds.get(stepKey);
		if (!stepIds) throw new Error(`No step IDs found for stepKey ${stepKey}`);
		if (index === void 0) return stepIds[stepIds.length - 1];
		return stepIds[index];
	}
	generateStepId(stepKey) {
		const stepIds = this.stepKeyIds.get(stepKey);
		let newStepId;
		let stepIndex = 0;
		if (stepIds) {
			stepIndex = stepIds.length;
			newStepId = `step_${(0, nanoid.nanoid)()}`;
			stepIds.push(newStepId);
			this.stepKeyIds.set(stepKey, stepIds);
		} else {
			newStepId = `step_${(0, nanoid.nanoid)()}`;
			this.stepKeyIds.set(stepKey, [newStepId]);
		}
		return [newStepId, stepIndex];
	}
	getKeyList(metadata) {
		if (!metadata) return [];
		const keyList = this.getInvocationKeyList(metadata);
		const agentContext = this.getAgentContext(metadata);
		if (agentContext.currentTokenType === "think" || agentContext.currentTokenType === "think_and_text") keyList.push("reasoning");
		else if (agentContext.tokenTypeSwitch === "content") keyList.push(`post-reasoning-${agentContext.reasoningTransitionCount}`);
		return keyList;
	}
	getInvocationKeyList(metadata) {
		const keyList = this.getBaseKeyList(metadata);
		if (this.invokedToolIds != null && this.invokedToolIds.size > 0) keyList.push(this.invokedToolIds.size + "");
		return keyList;
	}
	getBaseKeyList(metadata) {
		const configurable = this.config?.configurable;
		const runId = metadata.run_id ?? configurable?.run_id ?? this.runId;
		const threadId = metadata.thread_id ?? configurable?.thread_id ?? runId;
		const checkpointNs = metadata.checkpoint_ns ?? metadata.langgraph_checkpoint_ns ?? "";
		return [
			runId,
			threadId,
			metadata.langgraph_node,
			metadata.langgraph_step,
			checkpointNs
		];
	}
	checkKeyList(keyList) {
		return keyList.some((key) => key === void 0);
	}
	getRunMessages() {
		if (this.messages.length === 0 && this.cachedRunMessages != null) return this.cachedRunMessages;
		return this.messages.slice(this.startIndex);
	}
	getContentParts() {
		return require_core.convertMessagesToContent(this.messages.slice(this.startIndex));
	}
	getCalibrationRatio() {
		return this.agentContexts.get(this.defaultAgentId)?.calibrationRatio ?? 1;
	}
	getResolvedInstructionOverhead() {
		return this.agentContexts.get(this.defaultAgentId)?.resolvedInstructionOverhead;
	}
	getToolCount() {
		const context = this.agentContexts.get(this.defaultAgentId);
		return (context?.tools?.length ?? 0) + (context?.toolDefinitions?.length ?? 0);
	}
	/**
	* Get all run steps, optionally filtered by agent ID
	*/
	getRunSteps(agentId) {
		if (agentId == null || agentId === "") return [...this.contentData];
		return this.contentData.filter((step) => step.agentId === agentId);
	}
	/**
	* Get run steps grouped by agent ID
	*/
	getRunStepsByAgent() {
		const stepsByAgent = /* @__PURE__ */ new Map();
		for (const step of this.contentData) {
			if (step.agentId == null || step.agentId === "") continue;
			const steps = stepsByAgent.get(step.agentId) ?? [];
			steps.push(step);
			stepsByAgent.set(step.agentId, steps);
		}
		return stepsByAgent;
	}
	/**
	* Get agent IDs that participated in this run
	*/
	getActiveAgentIds() {
		const agentIds = /* @__PURE__ */ new Set();
		for (const step of this.contentData) if (step.agentId != null && step.agentId !== "") agentIds.add(step.agentId);
		return Array.from(agentIds);
	}
	/**
	* Maps contentPart indices to agent IDs for post-run analysis
	* Returns a map where key is the contentPart index and value is the agentId
	*/
	getContentPartAgentMap() {
		const contentPartAgentMap = /* @__PURE__ */ new Map();
		for (const step of this.contentData) if (step.agentId != null && step.agentId !== "" && Number.isFinite(step.index)) contentPartAgentMap.set(step.index, step.agentId);
		return contentPartAgentMap;
	}
	initializeTools({ currentTools, currentToolMap, agentContext }) {
		const toolDefinitions = agentContext?.toolDefinitions;
		const eventDrivenMode = toolDefinitions != null && toolDefinitions.length > 0;
		const traceToolNode = require_langfuseToolOutputTracing.shouldTraceToolNodeForLangfuse({
			runLangfuse: this.langfuse,
			agentLangfuse: agentContext?.langfuse
		});
		if (eventDrivenMode) {
			const schemaTools = require_schema.createSchemaOnlyTools(toolDefinitions);
			const toolDefMap = new Map(toolDefinitions.map((def) => [def.name, def]));
			const graphTools = agentContext?.graphTools;
			const directToolNames = /* @__PURE__ */ new Set();
			const allTools = [...schemaTools];
			const allToolMap = new Map(schemaTools.map((tool) => [tool.name, tool]));
			if (graphTools && graphTools.length > 0) {
				for (const tool of graphTools) if ("name" in tool) {
					allTools.push(tool);
					allToolMap.set(tool.name, tool);
					directToolNames.add(tool.name);
				}
			}
			const node = new require_ToolNode.ToolNode({
				tools: allTools,
				toolMap: allToolMap,
				trace: traceToolNode,
				runLangfuse: this.langfuse,
				agentLangfuse: agentContext?.langfuse,
				eventDrivenMode: true,
				sessions: this.sessions,
				toolDefinitions: toolDefMap,
				agentId: agentContext?.agentId,
				executingAgentId: agentContext?.agentId,
				toolCallStepIds: this.toolCallStepIds,
				toolRegistry: agentContext?.toolRegistry,
				hookRegistry: this.hookRegistry,
				humanInTheLoop: this.humanInTheLoop,
				eagerEventToolExecution: this.eagerEventToolExecution,
				eagerEventToolExecutions: this.eagerEventToolExecutions,
				eagerEventToolUsageCount: this.getEagerEventToolUsageCount(agentContext?.agentId),
				toolExecution: this.toolExecution,
				directToolNames: directToolNames.size > 0 ? directToolNames : void 0,
				maxContextTokens: agentContext?.maxContextTokens,
				maxToolResultChars: agentContext?.maxToolResultChars,
				toolOutputRegistry: this.getOrCreateToolOutputRegistry(),
				fileCheckpointer: this.getOrCreateFileCheckpointer(),
				errorHandler: (data, metadata) => StandardGraph.handleToolCallErrorStatic(this, data, metadata)
			});
			this.registerCompiledToolNode(node);
			return node;
		}
		const graphTools = agentContext?.graphTools;
		const baseTools = currentTools ?? [];
		const node = new require_ToolNode.ToolNode({
			tools: graphTools && graphTools.length > 0 ? [...baseTools, ...graphTools] : baseTools,
			toolMap: graphTools && graphTools.length > 0 ? new Map([...currentToolMap ?? /* @__PURE__ */ new Map(), ...graphTools.filter((t) => "name" in t).map((t) => [t.name, t])]) : currentToolMap,
			trace: traceToolNode,
			runLangfuse: this.langfuse,
			agentLangfuse: agentContext?.langfuse,
			executingAgentId: agentContext?.agentId,
			toolCallStepIds: this.toolCallStepIds,
			errorHandler: (data, metadata) => StandardGraph.handleToolCallErrorStatic(this, data, metadata),
			toolRegistry: agentContext?.toolRegistry,
			sessions: this.sessions,
			toolExecution: this.toolExecution,
			hookRegistry: this.hookRegistry,
			humanInTheLoop: this.humanInTheLoop,
			maxContextTokens: agentContext?.maxContextTokens,
			maxToolResultChars: agentContext?.maxToolResultChars,
			toolOutputRegistry: this.getOrCreateToolOutputRegistry(),
			fileCheckpointer: this.getOrCreateFileCheckpointer()
		});
		this.registerCompiledToolNode(node);
		return node;
	}
	overrideTestModel(responses, sleep, toolCalls) {
		this.overrideModel = require_fake.createFakeStreamingLLM({
			responses,
			sleep,
			toolCalls
		});
	}
	getUsageMetadata(finalMessage) {
		if (finalMessage && "usage_metadata" in finalMessage && finalMessage.usage_metadata != null) return finalMessage.usage_metadata;
	}
	cleanupSignalListener(currentModel) {
		if (!this.signal) return;
		const model = this.overrideModel ?? currentModel;
		if (!model) return;
		const client = model?.exposedClient;
		if (!client?.abortHandler) return;
		this.signal.removeEventListener("abort", client.abortHandler);
		client.abortHandler = void 0;
	}
	createCallModel(agentId = "default") {
		return async (state, config) => {
			const agentContext = this.agentContexts.get(agentId);
			if (!agentContext) throw new Error(`Agent context not found for agentId: ${agentId}`);
			if (!config) throw new Error("No config provided");
			const { messages } = state;
			const discoveredNames = require_tools.extractToolDiscoveries(messages);
			if (discoveredNames.length > 0) agentContext.markToolsAsDiscovered(discoveredNames);
			const rawToolsForBinding = require_resolveLocalExecutionTools.resolveLocalToolsForBinding({
				tools: agentContext.getToolsForBinding(),
				toolExecution: this.toolExecution
			});
			/**
			* Anthropic prompt-cache breakpoint on the tool definitions.
			*
			* Without this, the (often static) tool inventory shows up as
			* fresh input on every turn — measured at ~28k tokens/turn for
			* the local engine's coding-tool bundle, dominating per-turn
			* cost even when message-level caching is on.
			*
			* Strategy: partition tools into [static, deferred] and stamp
			* `cache_control: ephemeral` on the last static tool.
			* Discovered deferred tools that arrive across turns sit *after*
			* the breakpoint and don't invalidate the prefix.
			*/
			let toolsForBinding = rawToolsForBinding;
			if (agentContext.provider === "anthropic" && agentContext.clientOptions?.promptCache === true) toolsForBinding = require_anthropicToolCache.partitionAndMarkAnthropicToolCache(rawToolsForBinding, require_anthropicToolCache.makeIsDeferred(agentContext.toolDefinitions), require_cache.resolvePromptCacheTtl(agentContext.clientOptions?.promptCacheTtl)) ?? rawToolsForBinding;
			else if (agentContext.provider === "openrouter" && agentContext.clientOptions?.promptCache === true) toolsForBinding = require_toolCache.partitionAndMarkOpenRouterToolCache(rawToolsForBinding, require_anthropicToolCache.makeIsDeferred(agentContext.toolDefinitions), require_cache.resolvePromptCacheTtl(agentContext.clientOptions?.promptCacheTtl)) ?? rawToolsForBinding;
			else if (agentContext.provider === "bedrock" && agentContext.clientOptions?.promptCache === true) {
				const bedrockModel = agentContext.clientOptions?.model;
				if (bedrockModel == null || require_cache.supportsBedrockToolCache(bedrockModel)) toolsForBinding = require_toolCache$1.partitionAndMarkBedrockToolCache(rawToolsForBinding, require_anthropicToolCache.makeIsDeferred(agentContext.toolDefinitions)) ?? rawToolsForBinding;
			}
			let model = this.overrideModel ?? require_init.initializeModel({
				tools: toolsForBinding,
				provider: agentContext.provider,
				clientOptions: agentContext.clientOptions
			});
			if (agentContext.systemRunnable) model = agentContext.systemRunnable.pipe(model);
			if (agentContext.tokenCalculationPromise) await agentContext.tokenCalculationPromise;
			if (!config.signal) config.signal = this.signal;
			this.config = config;
			let messagesToUse = messages;
			let contextUsage = null;
			if (!agentContext.pruneMessages && agentContext.tokenCounter && agentContext.maxContextTokens != null) agentContext.pruneMessages = require_prune.createPruneMessages({
				startIndex: agentContext.indexTokenCountMap[0] != null ? this.startIndex : 0,
				provider: agentContext.provider,
				tokenCounter: agentContext.tokenCounter,
				maxTokens: agentContext.maxContextTokens,
				thinkingEnabled: require_request.isThinkingEnabled(agentContext.provider, agentContext.clientOptions),
				indexTokenCountMap: agentContext.indexTokenCountMap,
				contextPruningConfig: agentContext.contextPruningConfig,
				summarizationEnabled: agentContext.summarizationEnabled,
				reserveRatio: agentContext.summarizationConfig?.reserveRatio,
				calibrationRatio: agentContext.calibrationRatio,
				getInstructionTokens: () => agentContext.instructionTokens,
				log: (level, message, data) => {
					require_events.emitAgentLog(config, level, "prune", message, data, {
						runId: this.runId,
						agentId
					});
				}
			});
			if (agentContext.pruneMessages) {
				const { context, indexTokenCountMap, messagesToRefine, prePruneContextTokens, remainingContextTokens, originalToolContent, calibrationRatio, resolvedInstructionOverhead, contextBudget, effectiveInstructionTokens } = agentContext.pruneMessages({
					messages,
					usageMetadata: agentContext.currentUsage,
					lastCallUsage: agentContext.lastCallUsage,
					totalTokensFresh: agentContext.totalTokensFresh
				});
				agentContext.indexTokenCountMap = indexTokenCountMap;
				if (calibrationRatio != null && calibrationRatio > 0) agentContext.calibrationRatio = calibrationRatio;
				if (resolvedInstructionOverhead != null) {
					agentContext.resolvedInstructionOverhead = resolvedInstructionOverhead;
					const nonToolOverhead = agentContext.instructionTokens - agentContext.toolSchemaTokens;
					const calibratedToolTokens = Math.max(0, resolvedInstructionOverhead - nonToolOverhead);
					const currentToolTokens = agentContext.toolSchemaTokens;
					if ((currentToolTokens > 0 ? Math.abs(calibratedToolTokens - currentToolTokens) / currentToolTokens : 1) > CALIBRATION_VARIANCE_THRESHOLD) {
						agentContext.toolSchemaTokens = calibratedToolTokens;
						/** Largest-remainder apportionment keeps the per-tool breakdown
						*  summing exactly to the calibrated aggregate */
						if (agentContext.toolTokenCounts != null && currentToolTokens > 0) agentContext.toolTokenCounts = require_tokens.apportionTokenCounts(agentContext.toolTokenCounts, calibratedToolTokens / currentToolTokens, calibratedToolTokens);
					}
				}
				if (agentContext._labAfterResponseMode && context.length < messages.length) throw new Error("Context window exceeded before this response finished.");
				messagesToUse = context;
				/** Dispatched right before the model invoke — a summarization
				*  detour returns from this node without an LLM call, and the
				*  post-summary retry produces its own snapshot.
				*
				*  The breakdown describes the post-prune prompt: counts from the
				*  kept context, message tokens derived from the same calibrated
				*  budget math as `remainingContextTokens` (the index map is keyed
				*  by pre-prune state indices, so summing it over `context` would
				*  missum); `prePruneContextTokens` carries the pre-prune metric. */
				const usageBreakdown = agentContext.getTokenBudgetBreakdown(messages);
				usageBreakdown.messageCount = context.length;
				contextUsage = {
					runId: this.runId,
					agentId,
					breakdown: usageBreakdown,
					contextBudget,
					effectiveInstructionTokens,
					prePruneContextTokens,
					remainingContextTokens,
					calibrationRatio: agentContext.calibrationRatio
				};
				require_budget.syncBudgetDerivedFields(contextUsage);
				if (!agentContext._labAfterResponseMode && agentContext.summarizationEnabled === true && Array.isArray(messagesToRefine) && messagesToRefine.length > 0) {
					const shouldSkip = agentContext.shouldSkipSummarization(messages.length);
					if (!shouldSkip && require_index$6.shouldTriggerSummarization({
						trigger: agentContext.summarizationConfig?.trigger,
						maxContextTokens: agentContext.maxContextTokens,
						prePruneContextTokens: prePruneContextTokens != null ? prePruneContextTokens + agentContext.instructionTokens : void 0,
						remainingContextTokens,
						messagesToRefineCount: messagesToRefine.length
					})) {
						if (originalToolContent != null && originalToolContent.size > 0)
 /**
						* Merge — never overwrite — the pruner's masking record
						* into pendingOriginalToolContent.  Carry-over entries
						* from a prior summarize (preserved by the recency
						* window for masked tool messages still in the tail) and
						* the current pruner's new entries are both keyed by
						* indices in the current `state.messages`, so a key-wise
						* union is correct.  Overwriting would discard the
						* carry-over and reduce summary fidelity when those
						* masked tail messages eventually move into the head.
						*/
						if (agentContext.pendingOriginalToolContent == null) agentContext.pendingOriginalToolContent = originalToolContent;
						else {
							for (const [idx, content] of originalToolContent) agentContext.pendingOriginalToolContent.set(idx, content);
							/**
							* Re-apply the per-store char cap after the union.  The
							* pruner enforces ORIGINAL_CONTENT_MAX_CHARS inside its
							* own map via the onContentStored callback, but a
							* key-wise merge with recency carry-over bypasses that
							* accounting and could let the merged map grow without
							* bound across long sessions.
							*/
							require_prune.enforceOriginalContentCap(agentContext.pendingOriginalToolContent);
						}
						require_events.emitAgentLog(config, "info", "graph", "Summarization triggered", void 0, {
							runId: this.runId,
							agentId
						});
						require_events.emitAgentLog(config, "debug", "graph", "Summarization trigger details", {
							totalMessages: messages.length,
							remainingContextTokens: remainingContextTokens ?? 0,
							summaryVersion: agentContext.summaryVersion + 1,
							toolSchemaTokens: agentContext.toolSchemaTokens,
							instructionTokens: agentContext.instructionTokens,
							systemMessageTokens: agentContext.systemMessageTokens
						}, {
							runId: this.runId,
							agentId
						});
						agentContext.markSummarizationTriggered(messages.length);
						return { summarizationRequest: {
							remainingContextTokens: remainingContextTokens ?? 0,
							agentId: agentId || agentContext.agentId
						} };
					}
					if (shouldSkip) require_events.emitAgentLog(config, "debug", "graph", "Summarization skipped — no new messages or per-run cap reached", {
						messageCount: messages.length,
						messagesToRefineCount: messagesToRefine.length,
						contextLength: context.length
					}, {
						runId: this.runId,
						agentId
					});
				}
			}
			let finalMessages = messagesToUse;
			/** Tail snapshot for the dispatch-time usage delta: in-place
			*  formatters (artifact appends, Bedrock content rewrites, legacy
			*  string conversion) mutate without changing length or identity —
			*  capture before they run. Legacy string conversion can also touch
			*  messages before the tail, so those convertible indices are
			*  tracked separately (none exist in the common case). */
			const tailStart = trailingMutationStart(messagesToUse);
			let preFormatTailTokens = null;
			let legacyIndices = null;
			let preFormatLegacyTokens = 0;
			if (contextUsage != null && agentContext.tokenCounter != null) {
				preFormatTailTokens = 0;
				for (const message of messagesToUse.slice(tailStart)) preFormatTailTokens += agentContext.tokenCounter(message);
				if (agentContext.useLegacyContent) {
					legacyIndices = [];
					for (let i = 0; i < tailStart; i++) if (require_content.isLegacyConvertible(messagesToUse[i])) {
						legacyIndices.push(i);
						preFormatLegacyTokens += agentContext.tokenCounter(messagesToUse[i]);
					}
				}
			}
			if (agentContext.useLegacyContent) finalMessages = require_content.formatContentStrings(finalMessages);
			const lastMessageX = finalMessages.length >= 2 ? finalMessages[finalMessages.length - 2] : null;
			const lastMessageY = finalMessages.length >= 1 ? finalMessages[finalMessages.length - 1] : null;
			const anthropicLike = require_llm.isAnthropicLike(agentContext.provider, agentContext.clientOptions);
			if (agentContext.provider === "bedrock" && lastMessageX instanceof _langchain_core_messages.AIMessageChunk && lastMessageY instanceof _langchain_core_messages.ToolMessage && typeof lastMessageX.content === "string") {
				const trimmed = lastMessageX.content.trim();
				finalMessages[finalMessages.length - 2].content = trimmed.length > 0 ? [{
					type: "text",
					text: trimmed
				}] : "";
			}
			if (lastMessageY instanceof _langchain_core_messages.ToolMessage) {
				if (anthropicLike) require_core.formatAnthropicArtifactContent(finalMessages);
				else if (require_llm.isOpenAILike(agentContext.provider) && agentContext.provider !== "deepseek" || require_llm.isGoogleLike(agentContext.provider)) require_core.formatArtifactPayload(finalMessages);
			}
			if (require_request.isThinkingEnabled(agentContext.provider, agentContext.clientOptions))
 /**
			* Pass `this.startIndex` so the function can distinguish CURRENT-run
			* AI messages (the agent's own iterations — possibly without a
			* leading thinking block, which Claude is allowed to skip) from
			* historical context that genuinely needs the
			* `[Previous agent context]` placeholder. Without this signal the
			* function would convert the agent's own in-run tool_use messages,
			* polluting the next iteration's prompt with a placeholder the
			* model treats as suspicious injected content.
			*/
			finalMessages = require_format.ensureThinkingBlockInMessages(finalMessages, agentContext.provider, config, this.startIndex);
			const anthropicPromptCacheEnabled = agentContext.provider === "anthropic" && agentContext.clientOptions?.promptCache === true;
			const openRouterPromptCacheEnabled = agentContext.provider === "openrouter" && agentContext.clientOptions?.promptCache === true;
			const bedrockPromptCacheEnabled = agentContext.provider === "bedrock" && agentContext.clientOptions?.promptCache === true;
			const providerPromptCacheEnabled = anthropicPromptCacheEnabled || openRouterPromptCacheEnabled || bedrockPromptCacheEnabled;
			if (anthropicLike && (!agentContext.pruneMessages || finalMessages !== messagesToUse || providerPromptCacheEnabled)) {
				const beforeSanitize = finalMessages.length;
				finalMessages = require_prune.sanitizeOrphanToolBlocks(finalMessages);
				if (finalMessages.length !== beforeSanitize) require_events.emitAgentLog(config, "warn", "sanitize", "Orphan tool blocks removed", {
					before: beforeSanitize,
					after: finalMessages.length,
					dropped: beforeSanitize - finalMessages.length
				}, {
					runId: this.runId,
					agentId
				});
			}
			if ((anthropicPromptCacheEnabled || openRouterPromptCacheEnabled) && !agentContext.systemRunnable) finalMessages = require_cache.addTailCacheControl(finalMessages, require_cache.resolvePromptCacheTtl(anthropicPromptCacheEnabled ? agentContext.clientOptions?.promptCacheTtl : agentContext.clientOptions?.promptCacheTtl));
			else if (bedrockPromptCacheEnabled) {
				const bedrockOptions = agentContext.clientOptions;
				finalMessages = require_cache.addBedrockTailCacheControl(finalMessages, require_cache.resolveBedrockPromptCacheTtl(bedrockOptions?.promptCacheTtl, bedrockOptions?.model));
			}
			if (agentContext.lastStreamCall != null && agentContext.streamBuffer != null) {
				const timeSinceLastCall = Date.now() - agentContext.lastStreamCall;
				if (timeSinceLastCall < agentContext.streamBuffer) await require_run.sleep(Math.ceil((agentContext.streamBuffer - timeSinceLastCall) / 1e3) * 1e3);
			}
			agentContext.lastStreamCall = Date.now();
			agentContext.markTokensStale();
			let result;
			const fallbacks = agentContext.clientOptions?.fallbacks ?? [];
			if (finalMessages.length === 0 && !agentContext.hasPendingCompactionSummary()) {
				const budgetBreakdown = agentContext.getTokenBudgetBreakdown(messages);
				const breakdown = agentContext.formatTokenBudgetBreakdown(messages);
				const instructionsExceedBudget = budgetBreakdown.instructionTokens > budgetBreakdown.maxContextTokens;
				let guidance;
				if (instructionsExceedBudget) {
					const toolPct = budgetBreakdown.toolSchemaTokens > 0 ? Math.round(budgetBreakdown.toolSchemaTokens / budgetBreakdown.instructionTokens * 100) : 0;
					guidance = toolPct > 50 ? `Tool definitions consume ${budgetBreakdown.toolSchemaTokens} tokens (${toolPct}% of instructions) across ${budgetBreakdown.toolCount} tools, exceeding maxContextTokens (${budgetBreakdown.maxContextTokens}). Reduce the number of tools or increase maxContextTokens.` : `Instructions (${budgetBreakdown.instructionTokens} tokens) exceed maxContextTokens (${budgetBreakdown.maxContextTokens}). Increase maxContextTokens or shorten the system prompt.`;
					if (agentContext.summarizationEnabled === true) guidance += " Summarization was skipped because the summary would further increase the instruction overhead.";
				} else guidance = "Please increase the context window size or make your message shorter.";
				require_events.emitAgentLog(config, "error", "graph", "Empty messages after pruning", {
					messageCount: messages.length,
					instructionsExceedBudget,
					breakdown
				}, {
					runId: this.runId,
					agentId
				});
				throw new Error(JSON.stringify({
					type: "empty_messages",
					info: `Message pruning removed all messages as none fit in the context window. ${guidance}\n${breakdown}`
				}));
			}
			/** Past the empty-prompt guard — a model call is now guaranteed */
			if (contextUsage != null) {
				const usageRatio = contextUsage.calibrationRatio != null && contextUsage.calibrationRatio > 0 ? contextUsage.calibrationRatio : 1;
				if (agentContext.tokenCounter != null && finalMessages.length !== messagesToUse.length) {
					/** Post-prune formatting restructured the payload (e.g. thinking
					*  placeholder collapse, orphan drops) — recount so the gauge
					*  reflects what is actually sent */
					let rawTokens = 0;
					for (const message of finalMessages) rawTokens += agentContext.tokenCounter(message);
					contextUsage.breakdown.messageCount = finalMessages.length;
					if (contextUsage.contextBudget != null && contextUsage.effectiveInstructionTokens != null) contextUsage.remainingContextTokens = Math.max(0, contextUsage.contextBudget - contextUsage.effectiveInstructionTokens - Math.round(rawTokens * usageRatio));
				} else if (preFormatTailTokens != null && agentContext.tokenCounter != null && contextUsage.remainingContextTokens != null) {
					/** Same-length formatting can still mutate in place — the trailing
					*  tool batch (artifacts, Bedrock rewrites) and any legacy-converted
					*  messages before it — adjust remaining by the calibrated delta */
					let postFormatTailTokens = 0;
					for (const message of finalMessages.slice(tailStart)) postFormatTailTokens += agentContext.tokenCounter(message);
					let formatDelta = postFormatTailTokens - preFormatTailTokens;
					if (legacyIndices != null && legacyIndices.length > 0) {
						let postFormatLegacyTokens = 0;
						for (const index of legacyIndices) postFormatLegacyTokens += agentContext.tokenCounter(finalMessages[index]);
						formatDelta += postFormatLegacyTokens - preFormatLegacyTokens;
					}
					if (formatDelta !== 0) contextUsage.remainingContextTokens = Math.max(0, Math.min(contextUsage.contextBudget ?? Number.MAX_SAFE_INTEGER, contextUsage.remainingContextTokens - Math.round(formatDelta * usageRatio)));
				}
				require_budget.syncBudgetDerivedFields(contextUsage);
				/** Awaited so async host handlers receive the pre-invoke snapshot
				*  before any model deltas are emitted */
				await require_events.safeDispatchCustomEvent("on_context_usage", contextUsage, config);
			}
			const invokeStart = Date.now();
			const invokeMeta = {
				runId: this.runId,
				agentId
			};
			require_events.emitAgentLog(config, "debug", "graph", "Invoking LLM", {
				messageCount: finalMessages.length,
				provider: agentContext.provider
			}, invokeMeta, { force: true });
			const langfuse = require_langfuseConfig.resolveLangfuseConfig(this.langfuse, agentContext.langfuse);
			const traceMetadata = require_langfuse.createLangfuseTraceMetadata({
				messageId: this.runId,
				parentMessageId: config.configurable?.requestBody?.parentMessageId,
				agentId,
				agentName: agentContext.name
			});
			let langfuseHandler;
			let invokeConfig = {
				...config,
				metadata: {
					...config.metadata ?? {},
					...traceMetadata
				}
			};
			require_instrumentation.initializeLangfuseTracing(langfuse);
			if (require_callbacks.findCallback(config.callbacks, require_langfuse.isLangfuseCallbackHandler) == null) {
				langfuseHandler = require_langfuse.createLangfuseHandler({
					langfuse,
					userId: config.configurable?.user_id,
					sessionId: config.configurable?.thread_id,
					traceMetadata,
					tags: ["librechat", "agent"],
					traceIdSeed: langfuse?.deterministicTraceId === true ? this.runId : void 0
				});
				if (langfuseHandler != null) invokeConfig = {
					...invokeConfig,
					callbacks: require_callbacks.appendCallbacks(invokeConfig.callbacks, [langfuseHandler])
				};
			}
			const metadata = config.metadata;
			try {
				result = await require_langfuseRuntimeScope.withLangfuseRuntimeScope(require_langfuseRuntimeScope.resolveLangfuseRuntimeScope({
					runLangfuse: this.langfuse,
					langfuseOverlay: agentContext.langfuse
				}), () => require_invoke.attemptInvoke({
					model: this.overrideModel ?? model,
					messages: finalMessages,
					provider: agentContext.provider,
					context: this
				}, invokeConfig));
			} catch (primaryError) {
				clearCurrentDeltaStepMarkers({
					graph: this,
					metadata
				});
				result = await require_langfuseRuntimeScope.withLangfuseRuntimeScope(require_langfuseRuntimeScope.resolveLangfuseRuntimeScope({
					runLangfuse: this.langfuse,
					langfuseOverlay: agentContext.langfuse
				}), () => require_invoke.tryFallbackProviders({
					fallbacks,
					tools: agentContext.tools,
					messages: finalMessages,
					config: invokeConfig,
					primaryError,
					context: this
				}));
			} finally {
				await require_langfuse.disposeLangfuseHandler(langfuseHandler);
			}
			if (!result) throw new Error("No result after model invocation");
			/**
			* Fallback: populate toolCallStepIds in the graph execution context.
			*
			* When model.stream() is available (the common case), attemptInvoke
			* processes all chunks through a local ChatModelStreamHandler which
			* creates run steps and populates toolCallStepIds before returning.
			* The code below is a fallback for the rare case where model.stream
			* is unavailable and model.invoke() was used instead.
			*
			* Text content is dispatched FIRST so that MESSAGE_CREATION is the
			* current step when handleToolCalls runs. handleToolCalls then creates
			* TOOL_CALLS on top of it. The dedup in getMessageId and
			* toolCallStepIds.has makes this safe when attemptInvoke already
			* handled everything — both paths become no-ops.
			*/
			const responseMessage = result.messages?.[0];
			const toolCalls = responseMessage?.tool_calls;
			const hasToolCalls = Array.isArray(toolCalls) && toolCalls.length > 0;
			const responseReasoningContent = getResponseReasoningContent({
				responseMessage,
				reasoningKey: agentContext.reasoningKey
			});
			const textMessageContent = getMessageDeltaContent(agentContext.provider, responseMessage?.content);
			const hasStreamedTextDeltaStep = hasCurrentTextDeltaStep({
				graph: this,
				metadata
			});
			const dispatchableFinalReasoningContent = getDispatchableFinalReasoningContent({
				agentContext,
				responseReasoningContent,
				hasStreamedTextDeltaStep,
				hasStreamedReasoningDeltaStep: hasCurrentReasoningDeltaStep({
					graph: this,
					metadata
				})
			});
			if (hasToolCalls) {
				if (dispatchableFinalReasoningContent != null && await dispatchReasoningContent({
					graph: this,
					agentContext,
					reasoningContent: dispatchableFinalReasoningContent,
					metadata
				})) markPostReasoningContent(agentContext);
				if (textMessageContent != null && !hasStreamedTextDeltaStep) {
					const stepKey = this.getStepKey(metadata);
					if (await dispatchTextMessageContent({
						graph: this,
						stepKey,
						provider: agentContext.provider,
						content: textMessageContent,
						metadata
					})) markPostReasoningContent(agentContext);
				}
				await require_handlers.handleToolCalls(toolCalls, metadata, this);
			}
			/**
			* When streaming events are unavailable, ChatModelStreamHandler never
			* fires. Dispatch final reasoning/text content here. getMessageId makes
			* this a no-op when the streaming path already handled the same step.
			*/
			if (!hasToolCalls && responseMessage != null) {
				if (dispatchableFinalReasoningContent != null && await dispatchReasoningContent({
					graph: this,
					agentContext,
					reasoningContent: dispatchableFinalReasoningContent,
					metadata
				}) && textMessageContent != null) markPostReasoningContent(agentContext);
				if (textMessageContent != null && !hasStreamedTextDeltaStep) {
					const stepKey = this.getStepKey(metadata);
					await dispatchTextMessageContent({
						graph: this,
						stepKey,
						provider: agentContext.provider,
						content: textMessageContent,
						metadata
					});
				}
			}
			const invokeElapsed = ((Date.now() - invokeStart) / 1e3).toFixed(2);
			agentContext.currentUsage = this.getUsageMetadata(result.messages?.[0]);
			if (agentContext.currentUsage) {
				agentContext.updateLastCallUsage(agentContext.currentUsage);
				require_events.emitAgentLog(config, "debug", "graph", `LLM call complete (${invokeElapsed}s)`, {
					...agentContext.currentUsage,
					elapsedSeconds: Number(invokeElapsed),
					instructionTokens: agentContext.instructionTokens,
					toolSchemaTokens: agentContext.toolSchemaTokens,
					messageCount: finalMessages.length
				}, invokeMeta, { force: true });
			} else require_events.emitAgentLog(config, "debug", "graph", `LLM call complete (${invokeElapsed}s)`, {
				elapsedSeconds: Number(invokeElapsed),
				messageCount: finalMessages.length
			}, invokeMeta, { force: true });
			this.cleanupSignalListener();
			return result;
		};
	}
	createAgentNode(agentId) {
		const getConfig = () => this.config;
		const agentContext = this.agentContexts.get(agentId);
		if (!agentContext) throw new Error(`Agent context not found for agentId: ${agentId}`);
		/**
		* Depth countdown across graph boundaries: the parent's `maxSubagentDepth`
		* becomes this executor's `maxDepth`. When the child graph is constructed,
		* `buildChildInputs()` decrements `maxSubagentDepth` on the child's
		* `AgentInputs` (only when `allowNested: true`; otherwise subagentConfigs
		* are stripped entirely). The child graph's own `createAgentNode()` then
		* reads the decremented value here and creates a narrower executor —
		* recursion is bounded even though each graph has its own separate
		* executor instance.
		*/
		const effectiveSubagentDepth = agentContext.maxSubagentDepth ?? 1;
		if (agentContext.subagentConfigs != null && agentContext.subagentConfigs.length > 0 && effectiveSubagentDepth > 0) {
			const resolvedConfigs = require_SubagentExecutor.resolveSubagentConfigs(agentContext.subagentConfigs, agentContext);
			if (resolvedConfigs.length > 0) {
				const getParentHandlerRegistry = () => this.handlerRegistry;
				const executor = new require_SubagentExecutor.SubagentExecutor({
					configs: new Map(resolvedConfigs.map((c) => [c.type, c])),
					parentSignal: this.signal,
					hookRegistry: this.hookRegistry,
					/** Lazy — Run wires the registry onto the graph AFTER
					*  `createWorkflow()` runs, so a direct capture here would be
					*  `undefined` at construction time. */
					parentHandlerRegistry: getParentHandlerRegistry,
					parentRunId: this.runId ?? "",
					parentAgentId: agentContext.agentId,
					langfuse: this.langfuse,
					tokenCounter: agentContext.tokenCounter,
					usageSink: this.subagentUsageSink,
					maxDepth: effectiveSubagentDepth,
					createChildGraph: (input) => {
						const childGraph = new StandardGraph(input);
						childGraph.hookRegistry = this.hookRegistry;
						/**
						* Do not propagate `humanInTheLoop` into the child graph yet:
						* nested subagent interrupts need a stable child checkpoint and
						* resume bridge. Child hooks still fire; `ask` decisions fail
						* closed inside the subagent until that flow is implemented.
						*/
						childGraph.toolOutputReferences = this.toolOutputReferences;
						childGraph.eagerEventToolExecution = this.eagerEventToolExecution;
						childGraph.toolExecution = this.toolExecution;
						childGraph.eventToolExecutionAvailable = this.handlerRegistry?.getHandler("on_tool_execute") != null;
						return childGraph;
					}
				});
				const subagentTool = (0, _langchain_core_tools.tool)(async (rawInput, config) => {
					const input = rawInput;
					const description = typeof input.description === "string" && input.description.trim().length > 0 ? input.description : "No task description provided";
					const subagentType = typeof input.subagent_type === "string" ? input.subagent_type : "";
					const threadId = config.configurable?.thread_id;
					/**
					* When the tool is dispatched from an LLM's `tool_call`, LangChain
					* threads the originating `ToolCall` onto the RunnableConfig as
					* `config.toolCall` (see `ToolRunnableConfig` in
					* `@langchain/core/tools` — internal but stable since ≥0.3.x).
					* Surfacing its id lets hosts correlate `SubagentUpdateEvent`s
					* back to the parent's `tool_call_id` deterministically — no
					* temporal heuristics needed. If a future LangChain version
					* changes the threading, the type-guarded read falls back to
					* `undefined` and the correlation degrades gracefully.
					*/
					const toolCall = config.toolCall;
					const parentToolCallId = typeof toolCall?.id === "string" ? toolCall.id : void 0;
					return (await executor.execute({
						description,
						subagentType,
						threadId,
						parentToolCallId,
						/**
						* Forward the parent's `configurable` so host-set fields
						* (`requestBody`, `user`, etc.) propagate into the child
						* workflow. The executor scrubs run-identity fields before
						* forwarding — see `SubagentExecuteParams.parentConfigurable`.
						*/
						parentConfigurable: config.configurable
					})).content;
				}, require_SubagentTool.buildSubagentToolParams(resolvedConfigs));
				if (!agentContext.graphTools) agentContext.graphTools = [];
				agentContext.graphTools.push(subagentTool);
				/**
				* Refresh toolSchemaTokens to include the subagent tool's schema.
				* `calculateInstructionTokens()` was kicked off in `fromConfig()`
				* before graphTools was populated, so its result did not count this
				* tool. Without this retrigger, token-budget/pruning logic
				* underestimates prompt overhead.
				*/
				if (agentContext.tokenCounter) {
					const { tokenCounter, baseIndexTokenCountMap } = agentContext;
					agentContext.tokenCalculationPromise = agentContext.calculateInstructionTokens(tokenCounter).then(() => {
						agentContext.updateTokenMapWithInstructions(baseIndexTokenCountMap);
					}).catch((err) => {
						console.error("Error recalculating instruction tokens after subagent tool injection:", err);
					});
				}
			}
		}
		const agentNode = `${AGENT}${agentId}`;
		const toolNode = `${TOOLS}${agentId}`;
		const summarizeNode = `${SUMMARIZE}${agentId}`;
		const routeMessage = (state, config) => {
			this.config = config;
			if (state.summarizationRequest != null) return summarizeNode;
			return require_ToolNode.toolsCondition(state, toolNode, this.invokedToolIds);
		};
		return new _langchain_langgraph.StateGraph(_langchain_langgraph.Annotation.Root({
			messages: (0, _langchain_langgraph.Annotation)({
				reducer: require_reducer.messagesStateReducer,
				default: () => []
			}),
			summarizationRequest: (0, _langchain_langgraph.Annotation)({
				reducer: (_, b) => b,
				default: () => void 0
			})
		})).addNode(agentNode, this.createCallModel(agentId)).addNode(toolNode, this.initializeTools({
			currentTools: agentContext.tools,
			currentToolMap: agentContext.toolMap,
			agentContext
		})).addNode(summarizeNode, require_node.createSummarizeNode({
			agentContext,
			graph: {
				contentData: this.contentData,
				contentIndexMap: this.contentIndexMap,
				get config() {
					return getConfig();
				},
				runId: this.runId,
				isMultiAgent: this.isMultiAgentGraph(),
				hookRegistry: this.hookRegistry,
				dispatchRunStep: async (runStep, nodeConfig) => {
					this.contentData.push(runStep);
					this.contentIndexMap.set(runStep.id, runStep.index);
					const resolvedConfig = nodeConfig ?? this.config;
					const handler = this.handlerRegistry?.getHandler("on_run_step");
					if (handler) {
						await handler.handle("on_run_step", runStep, resolvedConfig?.configurable, this);
						this.handlerDispatchedStepIds.add(runStep.id);
					}
					const unmarkHandlerDispatchedEvent = handler ? this.markHandlerDispatchedEvent("on_run_step", runStep.id) : void 0;
					try {
						if (resolvedConfig) await require_events.safeDispatchCustomEvent("on_run_step", runStep, resolvedConfig);
					} finally {
						unmarkHandlerDispatchedEvent?.();
					}
				},
				dispatchRunStepCompleted: async (stepId, result, nodeConfig) => {
					const resolvedConfig = nodeConfig ?? this.config;
					const runStep = this.contentData.find((s) => s.id === stepId);
					const handler = this.handlerRegistry?.getHandler("on_run_step_completed");
					if (handler) await handler.handle("on_run_step_completed", { result: {
						...result,
						id: stepId,
						index: runStep?.index ?? 0
					} }, resolvedConfig?.configurable, this);
				}
			},
			generateStepId: (stepKey) => this.generateStepId(stepKey)
		})).addEdge(_langchain_langgraph.START, agentNode).addConditionalEdges(agentNode, routeMessage).addEdge(summarizeNode, agentNode).addEdge(toolNode, agentContext.toolEnd ? _langchain_langgraph.END : agentNode).compile();
	}
	createWorkflow() {
		const agentNode = this.createAgentNode(this.defaultAgentId);
		return new _langchain_langgraph.StateGraph(_langchain_langgraph.Annotation.Root({ messages: (0, _langchain_langgraph.Annotation)({
			reducer: (a, b) => {
				if (!this.messages.length) this.startIndex = a.length + b.length;
				const result = require_reducer.messagesStateReducer(a, b);
				this.messages = result;
				return result;
			},
			default: () => []
		}) })).addNode(this.defaultAgentId, agentNode, { ends: [_langchain_langgraph.END] }).addEdge(_langchain_langgraph.START, this.defaultAgentId).compile(this.compileOptions);
	}
	/**
	* Indicates if this is a multi-agent graph.
	* Override in MultiAgentGraph to return true.
	* Used to conditionally include agentId in RunStep for frontend rendering.
	*/
	isMultiAgentGraph() {
		return false;
	}
	/**
	* Get the parallel group ID for an agent, if any.
	* Override in MultiAgentGraph to provide actual group IDs.
	* Group IDs are incrementing numbers (1, 2, 3...) reflecting execution order.
	* @param _agentId - The agent ID to look up
	* @returns undefined for StandardGraph (no parallel groups), or group number for MultiAgentGraph
	*/
	getParallelGroupIdForAgent(_agentId) {}
	/**
	* Dispatches a run step to the client, returns the step ID
	*/
	async dispatchRunStep(stepKey, stepDetails, metadata) {
		if (!this.config) throw new Error("No config provided");
		const [stepId, stepIndex] = this.generateStepId(stepKey);
		if (stepDetails.type === "tool_calls" && stepDetails.tool_calls) for (const tool_call of stepDetails.tool_calls) {
			const toolCallId = tool_call.id ?? "";
			if (!toolCallId || this.toolCallStepIds.has(toolCallId)) continue;
			this.toolCallStepIds.set(toolCallId, stepId);
		}
		const runStep = {
			stepIndex,
			id: stepId,
			type: stepDetails.type,
			index: this.contentData.length,
			stepDetails,
			usage: null
		};
		const runId = this.runId ?? "";
		if (runId) runStep.runId = runId;
		if (metadata) try {
			const agentContext = this.getAgentContext(metadata);
			if (this.isMultiAgentGraph() && agentContext.agentId) {
				runStep.agentId = agentContext.agentId;
				const groupId = this.getParallelGroupIdForAgent(agentContext.agentId);
				if (groupId != null) runStep.groupId = groupId;
			}
		} catch (_e) {}
		this.contentData.push(runStep);
		this.contentIndexMap.set(stepId, runStep.index);
		const handler = this.handlerRegistry?.getHandler("on_run_step");
		if (handler) {
			await handler.handle("on_run_step", runStep, metadata, this);
			this.handlerDispatchedStepIds.add(stepId);
		}
		const unmarkHandlerDispatchedEvent = handler ? this.markHandlerDispatchedEvent("on_run_step", stepId) : void 0;
		try {
			await require_events.safeDispatchCustomEvent("on_run_step", runStep, this.config);
		} finally {
			unmarkHandlerDispatchedEvent?.();
		}
		return stepId;
	}
	/**
	* Static version of handleToolCallError to avoid creating strong references
	* that prevent garbage collection
	*/
	static async handleToolCallErrorStatic(graph, data, metadata) {
		if (!graph.config) throw new Error("No config provided");
		if (!data.id) {
			console.warn("No Tool ID provided for Tool Error");
			return;
		}
		const stepId = graph.toolCallStepIds.get(data.id) ?? "";
		if (!stepId) throw new Error(`No stepId found for tool_call_id ${data.id}`);
		const { name, input: args, error } = data;
		const runStep = graph.getRunStep(stepId);
		if (!runStep) throw new Error(`No run step found for stepId ${stepId}`);
		const tool_call = {
			id: data.id,
			name: name || "",
			args: typeof args === "string" ? args : JSON.stringify(args),
			output: `Error processing tool${error?.message != null ? `: ${error.message}` : ""}`,
			progress: 1
		};
		await graph.handlerRegistry?.getHandler("on_run_step_completed")?.handle("on_run_step_completed", { result: {
			id: stepId,
			index: runStep.index,
			type: "tool_call",
			tool_call
		} }, metadata, graph);
	}
	/**
	* Instance method that delegates to the static method
	* Kept for backward compatibility
	*/
	async handleToolCallError(data, metadata) {
		await StandardGraph.handleToolCallErrorStatic(this, data, metadata);
	}
	async dispatchRunStepDelta(id, delta, metadata) {
		if (!this.config) throw new Error("No config provided");
		else if (!id) throw new Error("No step ID found");
		const runStepDelta = {
			id,
			delta
		};
		const handler = this.handlerRegistry?.getHandler("on_run_step_delta");
		if (handler) {
			await handler.handle("on_run_step_delta", runStepDelta, metadata, this);
			this.handlerDispatchedStepIds.add(id);
		}
		const unmarkHandlerDispatchedEvent = handler ? this.markHandlerDispatchedEvent("on_run_step_delta", id) : void 0;
		try {
			await require_events.safeDispatchCustomEvent("on_run_step_delta", runStepDelta, this.config);
		} finally {
			unmarkHandlerDispatchedEvent?.();
		}
	}
	async dispatchMessageDelta(id, delta, metadata) {
		if (!this.config) throw new Error("No config provided");
		const messageDelta = {
			id,
			delta
		};
		if (hasTextDeltaContent(delta.content)) this.messageStepHasTextDeltas.add(id);
		const handler = this.handlerRegistry?.getHandler("on_message_delta");
		if (handler) {
			await handler.handle("on_message_delta", messageDelta, metadata, this);
			this.handlerDispatchedStepIds.add(id);
		}
		const unmarkHandlerDispatchedEvent = handler ? this.markHandlerDispatchedEvent("on_message_delta", id) : void 0;
		try {
			await require_events.safeDispatchCustomEvent("on_message_delta", messageDelta, this.config);
		} finally {
			unmarkHandlerDispatchedEvent?.();
		}
	}
	dispatchReasoningDelta = async (stepId, delta, metadata) => {
		if (!this.config) throw new Error("No config provided");
		const reasoningDelta = {
			id: stepId,
			delta
		};
		if (hasReasoningDeltaContent(delta.content)) this.reasoningStepHasDeltas.add(stepId);
		const handler = this.handlerRegistry?.getHandler("on_reasoning_delta");
		if (handler) {
			await handler.handle("on_reasoning_delta", reasoningDelta, metadata, this);
			this.handlerDispatchedStepIds.add(stepId);
		}
		const unmarkHandlerDispatchedEvent = handler ? this.markHandlerDispatchedEvent("on_reasoning_delta", stepId) : void 0;
		try {
			await require_events.safeDispatchCustomEvent("on_reasoning_delta", reasoningDelta, this.config);
		} finally {
			unmarkHandlerDispatchedEvent?.();
		}
	};
};
//#endregion
exports.Graph = Graph;
exports.StandardGraph = StandardGraph;

//# sourceMappingURL=Graph.cjs.map