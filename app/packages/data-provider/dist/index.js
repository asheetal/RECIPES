Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_data_service = require("./data-service-XTxx76uB.js");
let zod = require("zod");
let dayjs = require("dayjs");
dayjs = require_data_service.__toESM(dayjs);
let dayjs_plugin_utc_js = require("dayjs/plugin/utc.js");
dayjs_plugin_utc_js = require_data_service.__toESM(dayjs_plugin_utc_js);
let dayjs_plugin_timezone_js = require("dayjs/plugin/timezone.js");
dayjs_plugin_timezone_js = require_data_service.__toESM(dayjs_plugin_timezone_js);
let axios = require("axios");
axios = require_data_service.__toESM(axios);
let url = require("url");
let crypto = require("crypto");
crypto = require_data_service.__toESM(crypto);
let js_yaml = require("js-yaml");
//#region src/bedrock.ts
const DEFAULT_ENABLED_MAX_TOKENS = 8192;
const DEFAULT_THINKING_BUDGET = 2e3;
const BEDROCK_OUTPUT_128K_BETA = "output-128k-2025-02-19";
const BEDROCK_FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
const bedrockReasoningConfigValues = new Set(Object.values(require_data_service.BedrockReasoningConfig));
/**
* Resolves the final `thinking.display` value for an adaptive-thinking request.
*
* Starting with Claude Opus 4.7, the Messages API returns empty `thinking`
* blocks unless the request sets `thinking.display`. This helper encodes the
* three user-facing modes — `'auto'` (LibreChat decides), `'summarized'`, and
* `'omitted'` — into the wire value (or `undefined` when the field should be
* left off).
*
* See https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7#thinking-content-omitted-by-default
*/
/**
* Safely extracts a nested `thinking.display` string from a persisted
* `additionalModelRequestFields` object, returning `undefined` if the shape
* isn't what we expect.
*/
function extractPersistedDisplay(amrf) {
	if (typeof amrf !== "object" || amrf === null) return;
	const thinking = amrf.thinking;
	if (typeof thinking !== "object" || thinking === null) return;
	const display = thinking.display;
	return typeof display === "string" ? display : void 0;
}
function resolveThinkingDisplay(model, explicit) {
	if (explicit === "summarized") return "summarized";
	if (explicit === "omitted") return "omitted";
	if (omitsThinkingByDefault(model)) return "summarized";
}
/** Extracts opus major/minor version from both naming formats */
function parseOpusVersion(model) {
	const nameFirst = model.match(/claude-opus[-.]?(\d+)(?:[-.](\d{1,2})(?!\d))?/);
	if (nameFirst) return {
		major: parseInt(nameFirst[1], 10),
		minor: nameFirst[2] != null ? parseInt(nameFirst[2], 10) : 0
	};
	const numFirst = model.match(/claude-(\d+)(?:[-.](\d{1,2})(?!\d))?-opus/);
	if (numFirst) return {
		major: parseInt(numFirst[1], 10),
		minor: numFirst[2] != null ? parseInt(numFirst[2], 10) : 0
	};
	return null;
}
/** Extracts sonnet major/minor version from both naming formats.
*  Uses single-digit minor capture to avoid matching date suffixes (e.g., -20250514). */
function parseSonnetVersion(model) {
	const nameFirst = model.match(/claude-sonnet[-.]?(\d+)(?:[-.](\d)(?!\d))?/);
	if (nameFirst) return {
		major: parseInt(nameFirst[1], 10),
		minor: nameFirst[2] != null ? parseInt(nameFirst[2], 10) : 0
	};
	const numFirst = model.match(/claude-(\d+)(?:[-.](\d)(?!\d))?-sonnet/);
	if (numFirst) return {
		major: parseInt(numFirst[1], 10),
		minor: numFirst[2] != null ? parseInt(numFirst[2], 10) : 0
	};
	return null;
}
/**
* Mythos-class detection (Claude Fable / Mythos) lives in `schemas.ts` as
* `isMythosClassModel` — the single source of truth for the family names.
* The helpers below OR it in alongside the `opus`/`sonnet` version parsers.
*/
/** Checks if a model supports adaptive thinking (Opus 4.6+, Sonnet 4.6+, Fable/Mythos) */
function supportsAdaptiveThinking(model) {
	const opus = parseOpusVersion(model);
	if (opus && (opus.major > 4 || opus.major === 4 && opus.minor >= 6)) return true;
	const sonnet = parseSonnetVersion(model);
	if (sonnet != null && (sonnet.major > 4 || sonnet.major === 4 && sonnet.minor >= 6)) return true;
	if (require_data_service.isMythosClassModel(model)) return true;
	return false;
}
/**
* Checks if a model omits `thinking` content from responses by default.
*
* Starting with Claude Opus 4.7, the Messages API returns empty `thinking`
* blocks unless the request explicitly opts in via `thinking.display =
* "summarized"`. This helper narrows the opt-in to Opus 4.7+ (and any future
* major Opus version) so older adaptive-thinking models are left untouched.
*
* See https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7#thinking-content-omitted-by-default
*/
function omitsThinkingByDefault(model) {
	const opus = parseOpusVersion(model);
	if (opus && (opus.major > 4 || opus.major === 4 && opus.minor >= 7)) return true;
	if (require_data_service.isMythosClassModel(model)) return true;
	return false;
}
function omitsSamplingParameters(model) {
	const opus = parseOpusVersion(model);
	if (opus && (opus.major > 4 || opus.major === 4 && opus.minor >= 7)) return true;
	if (require_data_service.isMythosClassModel(model)) return true;
	return false;
}
/** Checks if a model has a 1M context window (Sonnet 4.6+, Opus 4.6+, Opus 5+, Fable/Mythos) */
function supportsContext1m(model) {
	const sonnet = parseSonnetVersion(model);
	if (sonnet != null && (sonnet.major > 4 || sonnet.major === 4 && sonnet.minor >= 6)) return true;
	const opus = parseOpusVersion(model);
	if (opus && (opus.major > 4 || opus.major === 4 && opus.minor >= 6)) return true;
	if (require_data_service.isMythosClassModel(model)) return true;
	return false;
}
/**
* Gets the appropriate anthropic_beta headers for Bedrock Anthropic models.
* Bedrock uses `anthropic_beta` (with underscore) in additionalModelRequestFields.
*
* @param model - The Bedrock model identifier (e.g., "anthropic.claude-sonnet-4-6")
* @returns Array of beta header strings, or empty array if not applicable
*/
function getBedrockAnthropicBetaHeaders(model) {
	const betaHeaders = [];
	/** Mythos-class (Fable/Mythos) is intentionally not matched: these betas are built-in/no-op for the
	* 4.7+ generation (Fable has native 128K output), so omitting them on Bedrock is lossless. */
	const isClaude4PlusModel = /anthropic\.claude-(?:[4-9](?:\.\d+)?(?:-\d+)?-(?:sonnet|opus|haiku)|(?:sonnet|opus|haiku)-[4-9])/.test(model);
	if (model.includes("anthropic.claude-3-7-sonnet") || isClaude4PlusModel) betaHeaders.push(BEDROCK_OUTPUT_128K_BETA);
	if (isClaude4PlusModel) betaHeaders.push(BEDROCK_FINE_GRAINED_TOOL_STREAMING_BETA);
	return betaHeaders;
}
function mergeBedrockAnthropicBetaHeaders(existing, generated) {
	let existingValues = [];
	if (Array.isArray(existing)) existingValues = existing;
	else if (typeof existing === "string") existingValues = [existing];
	const betaHeaders = /* @__PURE__ */ new Set();
	[...existingValues, ...generated].forEach((value) => {
		if (typeof value !== "string") return;
		value.split(",").map((header) => header.trim()).filter(Boolean).forEach((header) => betaHeaders.add(header));
	});
	return Array.from(betaHeaders);
}
const bedrockInputSchema = require_data_service.tConversationSchema.pick({
	chatProjectId: true,
	modelLabel: true,
	promptPrefix: true,
	resendFiles: true,
	iconURL: true,
	greeting: true,
	spec: true,
	maxOutputTokens: true,
	maxContextTokens: true,
	artifacts: true,
	region: true,
	system: true,
	model: true,
	maxTokens: true,
	temperature: true,
	topP: true,
	stop: true,
	thinking: true,
	thinkingBudget: true,
	effort: true,
	thinkingDisplay: true,
	reasoning_effort: true,
	promptCache: true,
	promptCacheTtl: true,
	topK: true,
	additionalModelRequestFields: true
}).transform((obj) => {
	if (obj.additionalModelRequestFields?.thinking != null) {
		const thinking = obj.additionalModelRequestFields.thinking;
		obj.thinking = !!thinking;
		obj.thinkingBudget = typeof thinking === "object" && "budget_tokens" in thinking ? thinking.budget_tokens : void 0;
		if (obj.thinkingDisplay == null) {
			const persistedDisplay = extractPersistedDisplay({ thinking });
			if (persistedDisplay === "summarized" || persistedDisplay === "omitted") obj.thinkingDisplay = persistedDisplay;
		}
		delete obj.additionalModelRequestFields;
	}
	return require_data_service.removeNullishValues(obj);
}).catch(() => ({}));
const bedrockInputParser = require_data_service.tConversationSchema.pick({
	chatProjectId: true,
	modelLabel: true,
	promptPrefix: true,
	resendFiles: true,
	iconURL: true,
	greeting: true,
	spec: true,
	artifacts: true,
	maxOutputTokens: true,
	maxContextTokens: true,
	region: true,
	model: true,
	maxTokens: true,
	temperature: true,
	topP: true,
	stop: true,
	thinking: true,
	thinkingBudget: true,
	effort: true,
	thinkingDisplay: true,
	reasoning_effort: true,
	promptCache: true,
	promptCacheTtl: true,
	topK: true,
	additionalModelRequestFields: true
}).catchall(zod.z.any()).transform((data) => {
	const knownKeys = [
		"chatProjectId",
		"modelLabel",
		"promptPrefix",
		"resendFiles",
		"iconURL",
		"greeting",
		"spec",
		"maxOutputTokens",
		"artifacts",
		"additionalModelRequestFields",
		"region",
		"model",
		"maxTokens",
		"temperature",
		"topP",
		"stop",
		"promptCache",
		"promptCacheTtl"
	];
	const additionalFields = {};
	const typedData = data;
	const shouldOmitSamplingParameters = typeof typedData.model === "string" && omitsSamplingParameters(typedData.model);
	Object.entries(typedData).forEach(([key, value]) => {
		if (!knownKeys.includes(key)) {
			if (key === "topK") additionalFields["top_k"] = value;
			else additionalFields[key] = value;
			delete typedData[key];
		}
	});
	/** Configure thinking for Bedrock Anthropic models: 3.7 Sonnet, Claude 4+ (opus/sonnet/haiku), and Mythos-class (Fable/Mythos). */
	if (typeof typedData.model === "string" && (typedData.model.includes("anthropic.claude-3-7-sonnet") || /anthropic\.claude-(?:[4-9](?:\.\d+)?(?:-\d+)?-(?:sonnet|opus|haiku)|(?:sonnet|opus|haiku)-[4-9])/.test(typedData.model) || require_data_service.isMythosClassModel(typedData.model))) {
		if (supportsAdaptiveThinking(typedData.model)) {
			const effort = additionalFields.effort;
			if (effort && typeof effort === "string" && effort !== "") additionalFields.output_config = { effort };
			delete additionalFields.effort;
			if (additionalFields.thinking === false) {
				delete additionalFields.thinking;
				delete additionalFields.thinkingBudget;
				delete additionalFields.thinkingDisplay;
			} else {
				/**
				* Persisted agent `model_parameters` round-trip back through this
				* parser with the prior `thinking.display` embedded in
				* `additionalModelRequestFields`. Surface it as the resolver's
				* explicit value when no top-level `thinkingDisplay` is set so the
				* prior user choice (e.g. 'omitted') survives instead of being
				* clobbered by the Opus 4.7+ auto → 'summarized' fallback.
				*/
				const topLevelDisplay = additionalFields.thinkingDisplay;
				const persistedDisplay = extractPersistedDisplay(typedData.additionalModelRequestFields);
				const thinkingConfig = { type: "adaptive" };
				const display = resolveThinkingDisplay(typedData.model, topLevelDisplay ?? persistedDisplay);
				if (display) thinkingConfig.display = display;
				additionalFields.thinking = thinkingConfig;
				delete additionalFields.thinkingBudget;
				delete additionalFields.thinkingDisplay;
			}
		} else {
			if (additionalFields.thinking === void 0) additionalFields.thinking = true;
			else if (additionalFields.thinking === false) {
				delete additionalFields.thinking;
				delete additionalFields.thinkingBudget;
			}
			if (additionalFields.thinking === true && additionalFields.thinkingBudget === void 0) additionalFields.thinkingBudget = DEFAULT_THINKING_BUDGET;
			delete additionalFields.effort;
			delete additionalFields.thinkingDisplay;
		}
		/** Anthropic uses 'effort' via output_config, not reasoning_config */
		delete additionalFields.reasoning_effort;
		if (typedData.model.includes("anthropic.")) {
			const betaHeaders = getBedrockAnthropicBetaHeaders(typedData.model);
			if (betaHeaders.length > 0) {
				const existingBetaHeaders = typedData.additionalModelRequestFields?.anthropic_beta;
				additionalFields.anthropic_beta = mergeBedrockAnthropicBetaHeaders(existingBetaHeaders, betaHeaders);
			}
		}
	} else {
		delete additionalFields.thinking;
		delete additionalFields.thinkingBudget;
		delete additionalFields.effort;
		delete additionalFields.thinkingDisplay;
		delete additionalFields.output_config;
		delete additionalFields.anthropic_beta;
		const reasoningEffort = additionalFields.reasoning_effort;
		delete additionalFields.reasoning_effort;
		if (typeof reasoningEffort === "string" && bedrockReasoningConfigValues.has(reasoningEffort)) additionalFields.reasoning_config = reasoningEffort;
	}
	const isAnthropicModel = typeof typedData.model === "string" && typedData.model.includes("anthropic.");
	/** Strip stale fields from previously-persisted additionalModelRequestFields */
	if (typeof typedData.additionalModelRequestFields === "object" && typedData.additionalModelRequestFields != null) {
		const amrf = typedData.additionalModelRequestFields;
		if (!isAnthropicModel) {
			delete amrf.anthropic_beta;
			delete amrf.thinking;
			delete amrf.thinkingBudget;
			delete amrf.effort;
			delete amrf.output_config;
			delete amrf.reasoning_config;
		} else {
			delete amrf.reasoning_config;
			delete amrf.reasoning_effort;
		}
		if (shouldOmitSamplingParameters) {
			delete amrf.temperature;
			delete amrf.topP;
			delete amrf.top_p;
			delete amrf.topK;
			delete amrf.top_k;
		}
	}
	if (shouldOmitSamplingParameters) {
		delete typedData.temperature;
		delete typedData.topP;
		delete additionalFields.temperature;
		delete additionalFields.topP;
		delete additionalFields.top_p;
		delete additionalFields.topK;
		delete additionalFields.top_k;
	}
	/** Default promptCache for claude and nova models, if not defined */
	if (typeof typedData.model === "string" && (typedData.model.includes("claude") || typedData.model.includes("nova"))) {
		if (typedData.promptCache === void 0) typedData.promptCache = true;
	} else if (typedData.promptCache === true) typedData.promptCache = void 0;
	/**
	* A cache TTL is meaningless without caching — tie it to promptCache. When
	* caching is off or unsupported for the model (cleared above), drop the TTL
	* so an unsupported `1h` is never sent on a non-caching Bedrock request.
	*/
	if (typedData.promptCache !== true) typedData.promptCacheTtl = void 0;
	if (Object.keys(additionalFields).length > 0) typedData.additionalModelRequestFields = {
		...typedData.additionalModelRequestFields || {},
		...additionalFields
	};
	if (typedData.maxOutputTokens !== void 0) typedData.maxTokens = typedData.maxOutputTokens;
	else if (typedData.maxTokens !== void 0) typedData.maxOutputTokens = typedData.maxTokens;
	return require_data_service.removeNullishValues(typedData);
}).catch(() => ({}));
/**
* Configures the "thinking" parameter based on given input and thinking options.
*
* @param data - The parsed Bedrock request options object
* @returns The object with thinking configured appropriately
*/
function configureThinking(data) {
	const updatedData = { ...data };
	const thinking = updatedData.additionalModelRequestFields?.thinking;
	if (thinking === true) {
		updatedData.maxTokens = updatedData.maxTokens ?? updatedData.maxOutputTokens ?? DEFAULT_ENABLED_MAX_TOKENS;
		delete updatedData.maxOutputTokens;
		const thinkingConfig = {
			type: "enabled",
			budget_tokens: updatedData.additionalModelRequestFields?.thinkingBudget ?? DEFAULT_THINKING_BUDGET
		};
		if (thinkingConfig.budget_tokens > updatedData.maxTokens) thinkingConfig.budget_tokens = Math.floor(updatedData.maxTokens * .9);
		updatedData.additionalModelRequestFields.thinking = thinkingConfig;
		delete updatedData.additionalModelRequestFields.thinkingBudget;
	} else if (typeof thinking === "object" && thinking != null && thinking.type === "adaptive") {
		if (updatedData.maxTokens == null && updatedData.maxOutputTokens != null) updatedData.maxTokens = updatedData.maxOutputTokens;
		delete updatedData.maxOutputTokens;
		delete updatedData.additionalModelRequestFields.thinkingBudget;
	}
	return updatedData;
}
const bedrockOutputParser = (data) => {
	const knownKeys = [
		...Object.keys(require_data_service.tConversationSchema.shape),
		"topK",
		"top_k"
	];
	let result = {};
	Object.entries(data).forEach(([key, value]) => {
		if (knownKeys.includes(key)) result[key] = value;
	});
	if (typeof data.additionalModelRequestFields === "object" && data.additionalModelRequestFields !== null) Object.entries(data.additionalModelRequestFields).forEach(([key, value]) => {
		if (knownKeys.includes(key)) if (key === "top_k") result["topK"] = value;
		else if (key === "thinking" || key === "thinkingBudget") return;
		else result[key] = value;
	});
	if (result.maxTokens !== void 0 && result.maxOutputTokens === void 0) result.maxOutputTokens = result.maxTokens;
	else if (result.maxOutputTokens !== void 0 && result.maxTokens === void 0) result.maxTokens = result.maxOutputTokens;
	result = configureThinking(result);
	const amrf = result.additionalModelRequestFields;
	if (!amrf || Object.keys(amrf).length === 0) delete result.additionalModelRequestFields;
	return result;
};
//#endregion
//#region src/types/runs.ts
let ContentTypes = /* @__PURE__ */ function(ContentTypes) {
	ContentTypes["TEXT"] = "text";
	ContentTypes["THINK"] = "think";
	ContentTypes["TEXT_DELTA"] = "text_delta";
	ContentTypes["TOOL_CALL"] = "tool_call";
	ContentTypes["IMAGE_FILE"] = "image_file";
	ContentTypes["IMAGE_URL"] = "image_url";
	ContentTypes["VIDEO_URL"] = "video_url";
	ContentTypes["INPUT_AUDIO"] = "input_audio";
	ContentTypes["AGENT_UPDATE"] = "agent_update";
	ContentTypes["SUMMARY"] = "summary";
	ContentTypes["ERROR"] = "error";
	return ContentTypes;
}({});
let StepTypes = /* @__PURE__ */ function(StepTypes) {
	StepTypes["TOOL_CALLS"] = "tool_calls";
	StepTypes["MESSAGE_CREATION"] = "message_creation";
	return StepTypes;
}({});
let ToolCallTypes = /* @__PURE__ */ function(ToolCallTypes) {
	ToolCallTypes["FUNCTION"] = "function";
	ToolCallTypes["RETRIEVAL"] = "retrieval";
	ToolCallTypes["FILE_SEARCH"] = "file_search";
	ToolCallTypes["CODE_INTERPRETER"] = "code_interpreter";
	ToolCallTypes["TOOL_CALL"] = "tool_call";
	return ToolCallTypes;
}({});
/** Event names dispatched by the agent graph and consumed by step handlers. */
let StepEvents = /* @__PURE__ */ function(StepEvents) {
	StepEvents["ON_RUN_STEP"] = "on_run_step";
	StepEvents["ON_AGENT_UPDATE"] = "on_agent_update";
	StepEvents["ON_MESSAGE_DELTA"] = "on_message_delta";
	StepEvents["ON_REASONING_DELTA"] = "on_reasoning_delta";
	StepEvents["ON_RUN_STEP_DELTA"] = "on_run_step_delta";
	StepEvents["ON_RUN_STEP_COMPLETED"] = "on_run_step_completed";
	StepEvents["ON_SUMMARIZE_START"] = "on_summarize_start";
	StepEvents["ON_SUMMARIZE_DELTA"] = "on_summarize_delta";
	StepEvents["ON_SUMMARIZE_COMPLETE"] = "on_summarize_complete";
	StepEvents["ON_SUBAGENT_UPDATE"] = "on_subagent_update";
	return StepEvents;
}({});
/** Token-tracking event names streamed to the client (separate from StepEvents dispatch). */
let UsageEvents = /* @__PURE__ */ function(UsageEvents) {
	UsageEvents["ON_CONTEXT_USAGE"] = "on_context_usage";
	UsageEvents["ON_TOKEN_USAGE"] = "on_token_usage";
	return UsageEvents;
}({});
/**
* Full prompt token count for one completed model call — the EXACT context the
* model saw, provider-aware: additive providers (Bedrock) report `input_tokens`
* excluding cache, so cache reads/writes are added back; subset providers
* (Anthropic, OpenAI, …) already fold cache into `input_tokens`. When the
* provider is absent (custom/OpenAI-compatible payloads), fall back to the same
* magnitude heuristic `normalizeUsageUnits` uses — cache ≤ input means it's
* already included — so cached events aren't re-inflated. The ground truth the
* gauge reconciles its calibrated estimate to.
*/
const promptTokensFromUsage = (event) => {
	const input = event.input_tokens ?? 0;
	const details = event.input_token_details ?? {};
	const cacheRead = details.cache_read ?? 0;
	const cacheCreation = details.cache_creation ?? 0;
	return (event.provider != null ? require_data_service.inputTokensIncludesCache(event.provider) : cacheRead + cacheCreation <= input) ? input : input + cacheRead + cacheCreation;
};
/**
* Reconciles a pre-invoke context snapshot's CALIBRATED estimate to a call's
* ACTUAL prompt tokens. The SDK's calibration multiplier scales only
* `messageTokens` (instructions/summary are raw tiktoken counts), and it can
* over-shoot badly when a provider injects server-side content the SDK never
* counted (e.g. Anthropic web search) — pinning the gauge several× too high and
* persisting it. Trust the provider's own prompt count: keep the raw
* instruction/summary rows, set `messageTokens` to the remainder, and recompute
* the free space. No-op when `promptTokens` is unusable.
*/
const reconcileContextUsage = (snapshot, promptTokens) => {
	if (!Number.isFinite(promptTokens) || promptTokens <= 0) return snapshot;
	const { breakdown } = snapshot;
	const budget = snapshot.contextBudget ?? breakdown.maxContextTokens;
	const nonMessageTokens = (breakdown.instructionTokens ?? 0) + (breakdown.summaryTokens ?? 0);
	const messageTokens = Math.max(0, promptTokens - nonMessageTokens);
	return {
		...snapshot,
		breakdown: {
			...breakdown,
			messageTokens
		},
		remainingContextTokens: budget != null ? Math.max(0, budget - promptTokens) : snapshot.remainingContextTokens
	};
};
//#endregion
//#region src/parsers.ts
dayjs.default.extend(dayjs_plugin_utc_js.default);
dayjs.default.extend(dayjs_plugin_timezone_js.default);
const endpointSchemas = {
	["openAI"]: require_data_service.openAISchema,
	["azureOpenAI"]: require_data_service.openAISchema,
	["custom"]: require_data_service.openAISchema,
	["openrouter"]: require_data_service.openRouterSchema,
	["google"]: require_data_service.googleSchema,
	["anthropic"]: require_data_service.anthropicSchema,
	["assistants"]: require_data_service.assistantSchema,
	["azureAssistants"]: require_data_service.assistantSchema,
	["agents"]: require_data_service.compactAgentsSchema,
	["bedrock"]: bedrockInputSchema
};
const isEndpointSchemaLookupKey = (value) => value != null && Object.prototype.hasOwnProperty.call(endpointSchemas, value);
const getFallbackEndpointSchema = (schemas, endpointType, defaultParamsEndpoint) => {
	if (!endpointType) return;
	return (isEndpointSchemaLookupKey(defaultParamsEndpoint) ? schemas[defaultParamsEndpoint] : void 0) ?? schemas[endpointType];
};
/** Get the enabled endpoints from the `ENDPOINTS` environment variable */
function getEnabledEndpoints() {
	const defaultEndpoints = [
		"openAI",
		"agents",
		"assistants",
		"azureAssistants",
		"azureOpenAI",
		"google",
		"anthropic",
		"bedrock"
	];
	const endpointsEnv = process.env.ENDPOINTS ?? "";
	let enabledEndpoints = defaultEndpoints;
	if (endpointsEnv) enabledEndpoints = endpointsEnv.split(",").filter((endpoint) => endpoint.trim()).map((endpoint) => endpoint.trim());
	return enabledEndpoints;
}
/** Orders an existing EndpointsConfig object based on enabled endpoint/custom ordering */
function orderEndpointsConfig(endpointsConfig) {
	if (!endpointsConfig) return {};
	const enabledEndpoints = getEnabledEndpoints();
	const endpointKeys = Object.keys(endpointsConfig);
	const defaultCustomIndex = enabledEndpoints.indexOf("custom");
	return endpointKeys.reduce((accumulatedConfig, currentEndpointKey) => {
		const isCustom = !(currentEndpointKey in require_data_service.EModelEndpoint);
		if (!enabledEndpoints.includes(currentEndpointKey) && !isCustom) return accumulatedConfig;
		const index = enabledEndpoints.indexOf(currentEndpointKey);
		if (isCustom) accumulatedConfig[currentEndpointKey] = {
			order: defaultCustomIndex >= 0 ? defaultCustomIndex : 9999,
			...endpointsConfig[currentEndpointKey]
		};
		else if (endpointsConfig[currentEndpointKey]) accumulatedConfig[currentEndpointKey] = {
			...endpointsConfig[currentEndpointKey],
			order: index
		};
		return accumulatedConfig;
	}, {});
}
/** Converts an array of Zod issues into a string. */
function errorsToString(errors) {
	return errors.map((error) => {
		return `${error.path.join(".")}: ${error.message}`;
	}).join(" ");
}
function getFirstDefinedValue(possibleValues) {
	let returnValue;
	for (const value of possibleValues) if (value) {
		returnValue = value;
		break;
	}
	return returnValue;
}
function getNonEmptyValue(possibleValues) {
	for (const value of possibleValues) if (value && value.trim() !== "") return value;
}
const parseConvo = ({ endpoint, endpointType, conversation, possibleValues, defaultParamsEndpoint }) => {
	const primarySchema = endpointSchemas[endpoint];
	if (!primarySchema && !endpointType) throw new Error(`Unknown endpoint: ${endpoint}`);
	const convo = (primarySchema ?? getFallbackEndpointSchema(endpointSchemas, endpointType, defaultParamsEndpoint))?.parse(conversation);
	const { models } = possibleValues ?? {};
	if (models && convo) convo.model = getFirstDefinedValue(models) ?? convo.model;
	return convo;
};
/** Match GPT followed by digit, optional decimal, and optional suffix
*
* Examples: gpt-4, gpt-4o, gpt-4.5, gpt-5a, etc. */
const extractGPTVersion = (modelStr) => {
	const gptMatch = modelStr.match(/gpt-(\d+(?:\.\d+)?)([a-z])?/i);
	if (gptMatch) return `GPT-${gptMatch[1]}${gptMatch[2] || ""}`;
	return "";
};
/** Match omni models (o1, o3, etc.), "o" followed by a digit, possibly with decimal */
const extractOmniVersion = (modelStr) => {
	const omniMatch = modelStr.match(/\bo(\d+(?:\.\d+)?)\b/i);
	if (omniMatch) return `o${omniMatch[1]}`;
	return "";
};
const getResponseSender = (endpointOption) => {
	const { model: _m, endpoint: _e, endpointType, modelDisplayLabel: _mdl, chatGptLabel: _cgl, modelLabel: _ml } = endpointOption;
	const endpoint = _e;
	const model = _m ?? "";
	const modelDisplayLabel = _mdl ?? "";
	const chatGptLabel = _cgl ?? "";
	const modelLabel = _ml ?? "";
	if ([
		"openAI",
		"bedrock",
		"azureOpenAI"
	].includes(endpoint)) {
		if (modelLabel) return modelLabel;
		else if (chatGptLabel) return chatGptLabel;
		else if (model && extractOmniVersion(model)) return extractOmniVersion(model);
		else if (model && (model.includes("mistral") || model.includes("codestral"))) return "Mistral";
		else if (model && model.includes("deepseek")) return "Deepseek";
		else if (model && model.includes("kimi")) return "Kimi";
		else if (model && model.includes("moonshot")) return "Moonshot";
		else if (model && model.includes("gpt-")) return extractGPTVersion(model) || "GPT";
		return require_data_service.alternateName[endpoint] ?? "AI";
	}
	if (endpoint === "anthropic") return modelLabel || "Claude";
	if (endpoint === "bedrock") return modelLabel || require_data_service.alternateName[endpoint];
	if (endpoint === "google") {
		if (modelLabel) return modelLabel;
		else if (model?.toLowerCase().includes("gemma") === true) return "Gemma";
		return "Gemini";
	}
	if (endpoint === "custom" || endpointType === "custom") {
		if (modelLabel) return modelLabel;
		else if (chatGptLabel) return chatGptLabel;
		else if (model && extractOmniVersion(model)) return extractOmniVersion(model);
		else if (model && (model.includes("mistral") || model.includes("codestral"))) return "Mistral";
		else if (model && model.includes("deepseek")) return "Deepseek";
		else if (model && model.includes("kimi")) return "Kimi";
		else if (model && model.includes("moonshot")) return "Moonshot";
		else if (model && model.includes("gpt-")) return extractGPTVersion(model) || "GPT";
		else if (modelDisplayLabel) return modelDisplayLabel;
		return "AI";
	}
	return "";
};
const compactEndpointSchemas = {
	["openAI"]: require_data_service.openAISchema,
	["azureOpenAI"]: require_data_service.openAISchema,
	["custom"]: require_data_service.openAISchema,
	["openrouter"]: require_data_service.openRouterSchema,
	["assistants"]: require_data_service.compactAssistantSchema,
	["azureAssistants"]: require_data_service.compactAssistantSchema,
	["agents"]: require_data_service.compactAgentsSchema,
	["google"]: require_data_service.compactGoogleSchema,
	["bedrock"]: bedrockInputSchema,
	["anthropic"]: require_data_service.anthropicSchema
};
const parseCompactConvo = ({ endpoint, endpointType, conversation, possibleValues, defaultParamsEndpoint }) => {
	if (!endpoint) throw new Error(`undefined endpoint: ${endpoint}`);
	const primarySchema = compactEndpointSchemas[endpoint];
	if (!primarySchema && !endpointType) throw new Error(`Unknown endpoint: ${endpoint}`);
	const schema = primarySchema ?? getFallbackEndpointSchema(compactEndpointSchemas, endpointType, defaultParamsEndpoint);
	if (!schema) throw new Error(`Unknown endpointType: ${endpointType}`);
	const { iconURL: _clientIconURL, ...conversationWithoutIconURL } = conversation;
	const convo = schema.parse(conversationWithoutIconURL);
	const { models } = possibleValues ?? {};
	if (models && convo) convo.model = getFirstDefinedValue(models) ?? convo.model;
	return convo;
};
function parseTextParts(contentParts, skipReasoning = false) {
	let result = "";
	for (const part of contentParts) {
		if (!part?.type) continue;
		if (part.type === "text") {
			const textValue = (typeof part.text === "string" ? part.text : part.text?.value) || "";
			if (result.length > 0 && textValue.length > 0 && result[result.length - 1] !== " " && textValue[0] !== " ") result += " ";
			result += textValue;
		} else if (part.type === "think" && !skipReasoning) {
			const textValue = typeof part.think === "string" ? part.think : "";
			if (result.length > 0 && textValue.length > 0 && result[result.length - 1] !== " " && textValue[0] !== " ") result += " ";
			result += textValue;
		}
	}
	return result;
}
const SEPARATORS = [
	".",
	"?",
	"!",
	"۔",
	"。",
	"‥",
	";",
	"¡",
	"¿",
	"\n",
	"```"
];
function findLastSeparatorIndex(text, separators = SEPARATORS) {
	let lastIndex = -1;
	for (const separator of separators) {
		const index = text.lastIndexOf(separator);
		if (index > lastIndex) lastIndex = index;
	}
	return lastIndex;
}
/**
* Anchors a dayjs instant to the user's IANA timezone when one is supplied,
* so local-time special vars reflect the user's wall clock rather than the
* server's. Falls back to the original instant for missing or invalid zones.
*/
function applyTimezone(value, timezone) {
	if (!timezone) return value;
	try {
		const zoned = value.tz(timezone);
		return zoned.isValid() ? zoned : value;
	} catch {
		return value;
	}
}
function replaceSpecialVars({ text, user, now: inputNow, timezone }) {
	let result = text;
	if (!result) return result;
	const now = applyTimezone(inputNow != null ? (0, dayjs.default)(inputNow) : (0, dayjs.default)(), timezone);
	const weekdayName = now.format("dddd");
	const currentDate = now.format("YYYY-MM-DD");
	result = result.replace(/{{\s*current_date\s*}}/gi, `${currentDate} (${weekdayName})`);
	const currentDatetime = now.format("YYYY-MM-DD HH:mm:ss Z");
	result = result.replace(/{{\s*current_datetime\s*}}/gi, `${currentDatetime} (${weekdayName})`);
	const isoDatetime = now.toISOString();
	result = result.replace(/{{\s*iso_datetime\s*}}/gi, isoDatetime);
	if (user && user.name) result = result.replace(/{{\s*current_user\s*}}/gi, user.name);
	return result;
}
/**
* Encodes an ephemeral agent ID from endpoint, model, optional sender, and optional index.
* Uses __ to replace : (reserved in graph node names) and ___ to separate sender.
*
* Format: endpoint__model___sender or endpoint__model___sender____index (if index provided)
*
* @example
* encodeEphemeralAgentId({ endpoint: 'openAI', model: 'gpt-4o', sender: 'GPT-4o' })
* // => 'openAI__gpt-4o___GPT-4o'
*
* @example
* encodeEphemeralAgentId({ endpoint: 'openAI', model: 'gpt-4o', sender: 'GPT-4o', index: 1 })
* // => 'openAI__gpt-4o___GPT-4o____1'
*/
function encodeEphemeralAgentId({ endpoint, model, sender, index }) {
	const base = `${endpoint}:${model}`.replace(/:/g, "__");
	let result = base;
	if (sender) result = `${base}___${sender.replace(/:/g, "__")}`;
	if (index != null) result = `${result}____${index}`;
	return result;
}
/**
* Parses an ephemeral agent ID back into its components.
* Returns undefined if the ID doesn't match the expected format.
*
* Format: endpoint__model___sender or endpoint__model___sender____index
* - ____ (4 underscores) separates optional index suffix
* - ___ (triple underscore) separates model from optional sender
* - __ (double underscore) replaces : in endpoint/model names
*
* @example
* parseEphemeralAgentId('openAI__gpt-4o___GPT-4o')
* // => { endpoint: 'openAI', model: 'gpt-4o', sender: 'GPT-4o' }
*
* @example
* parseEphemeralAgentId('openAI__gpt-4o___GPT-4o____1')
* // => { endpoint: 'openAI', model: 'gpt-4o', sender: 'GPT-4o', index: 1 }
*/
function parseEphemeralAgentId(agentId) {
	if (!agentId.includes("__")) return;
	let index;
	let workingId = agentId;
	if (agentId.includes("____")) {
		const lastIndexSep = agentId.lastIndexOf("____");
		const indexStr = agentId.slice(lastIndexSep + 4);
		const parsedIndex = parseInt(indexStr, 10);
		if (!isNaN(parsedIndex)) {
			index = parsedIndex;
			workingId = agentId.slice(0, lastIndexSep);
		}
	}
	let sender;
	let mainPart = workingId;
	if (workingId.includes("___")) {
		const [before, after] = workingId.split("___");
		mainPart = before;
		sender = after?.replace(/__/g, ":");
	}
	const [endpoint, ...modelParts] = mainPart.split("__");
	if (!endpoint || modelParts.length === 0) return;
	return {
		endpoint,
		model: modelParts.join(":"),
		sender,
		index
	};
}
/**
* Checks if an agent ID represents an ephemeral (non-saved) agent.
* Real agent IDs always start with "agent_", so anything else is ephemeral.
*/
function isEphemeralAgentId(agentId) {
	return !agentId?.startsWith("agent_");
}
/**
* Strips the index suffix (____N) from an agent ID if present.
* Works with both ephemeral and real agent IDs.
*
* @example
* stripAgentIdSuffix('agent_abc123____1') // => 'agent_abc123'
* stripAgentIdSuffix('openAI__gpt-4o___GPT-4o____1') // => 'openAI__gpt-4o___GPT-4o'
* stripAgentIdSuffix('agent_abc123') // => 'agent_abc123' (unchanged)
*/
function stripAgentIdSuffix(agentId) {
	return agentId.replace(/____\d+$/, "");
}
/**
* Appends an index suffix (____N) to an agent ID.
* Used to distinguish parallel agents with the same base ID.
*
* @example
* appendAgentIdSuffix('agent_abc123', 1) // => 'agent_abc123____1'
* appendAgentIdSuffix('openAI__gpt-4o___GPT-4o', 1) // => 'openAI__gpt-4o___GPT-4o____1'
*/
function appendAgentIdSuffix(agentId, index) {
	return `${agentId}____${index}`;
}
//#endregion
//#region src/azure.ts
function validateAzureGroups(configs) {
	let isValid = true;
	const modelNames = [];
	const modelGroupMap = {};
	const groupMap = {};
	const errors = [];
	const result = require_data_service.azureGroupConfigsSchema.safeParse(configs);
	if (!result.success) {
		isValid = false;
		errors.push(errorsToString(result.error.errors));
	} else for (const group of result.data) {
		const { group: groupName, apiKey, instanceName = "", deploymentName = "", version = "", baseURL = "", additionalHeaders, models, serverless = false, ...rest } = group;
		if (groupMap[groupName]) {
			errors.push(`Duplicate group name detected: "${groupName}". Group names must be unique.`);
			return {
				isValid: false,
				modelNames,
				modelGroupMap,
				groupMap,
				errors
			};
		}
		if (serverless && !baseURL) {
			errors.push(`Group "${groupName}" is serverless but missing mandatory "baseURL."`);
			return {
				isValid: false,
				modelNames,
				modelGroupMap,
				groupMap,
				errors
			};
		}
		if (!instanceName && !serverless) {
			errors.push(`Group "${groupName}" is missing an "instanceName" for non-serverless configuration.`);
			return {
				isValid: false,
				modelNames,
				modelGroupMap,
				groupMap,
				errors
			};
		}
		groupMap[groupName] = {
			apiKey,
			instanceName,
			deploymentName,
			version,
			baseURL,
			additionalHeaders,
			models,
			serverless,
			...rest
		};
		for (const modelName in group.models) {
			modelNames.push(modelName);
			const model = group.models[modelName];
			if (modelGroupMap[modelName]) {
				errors.push(`Duplicate model name detected: "${modelName}". Model names must be unique across groups.`);
				return {
					isValid: false,
					modelNames,
					modelGroupMap,
					groupMap,
					errors
				};
			}
			if (serverless) {
				modelGroupMap[modelName] = { group: groupName };
				continue;
			}
			const groupDeploymentName = group.deploymentName ?? "";
			const groupVersion = group.version ?? "";
			if (typeof model === "boolean") {
				if (!groupDeploymentName || !groupVersion) {
					errors.push(`Model "${modelName}" in group "${groupName}" is missing a deploymentName or version.`);
					return {
						isValid: false,
						modelNames,
						modelGroupMap,
						groupMap,
						errors
					};
				}
				modelGroupMap[modelName] = { group: groupName };
			} else {
				const modelDeploymentName = model.deploymentName ?? "";
				const modelVersion = model.version ?? "";
				if (!modelDeploymentName && !groupDeploymentName || !modelVersion && !groupVersion) {
					errors.push(`Model "${modelName}" in group "${groupName}" is missing a required deploymentName or version.`);
					return {
						isValid: false,
						modelNames,
						modelGroupMap,
						groupMap,
						errors
					};
				}
				modelGroupMap[modelName] = { group: groupName };
			}
		}
	}
	return {
		isValid,
		modelNames,
		modelGroupMap,
		groupMap,
		errors
	};
}
function mapModelToAzureConfig({ modelName, modelGroupMap, groupMap }) {
	const modelConfig = modelGroupMap[modelName];
	if (!modelConfig) throw new Error(`Model named "${modelName}" not found in configuration.`);
	const groupConfig = groupMap[modelConfig.group];
	if (!groupConfig) throw new Error(`Group "${modelConfig.group}" for model "${modelName}" not found in configuration.`);
	const instanceName = groupConfig.instanceName ?? "";
	if (!instanceName && groupConfig.serverless !== true) throw new Error(`Group "${modelConfig.group}" is missing an instanceName for non-serverless configuration.`);
	const baseURL = groupConfig.baseURL ?? "";
	if (groupConfig.serverless === true && !baseURL) throw new Error(`Group "${modelConfig.group}" is missing the required base URL for serverless configuration.`);
	if (groupConfig.serverless === true) {
		const result = {
			azureOptions: {
				azureOpenAIApiVersion: require_data_service.extractEnvVariable(groupConfig.version ?? ""),
				azureOpenAIApiKey: require_data_service.extractEnvVariable(groupConfig.apiKey)
			},
			baseURL: require_data_service.extractEnvVariable(baseURL),
			serverless: true
		};
		const apiKeyValue = result.azureOptions.azureOpenAIApiKey;
		if (typeof apiKeyValue === "string" && require_data_service.envVarRegex.test(apiKeyValue)) throw new Error(`Azure configuration environment variable "${apiKeyValue}" was not found.`);
		if (groupConfig.additionalHeaders) result.headers = groupConfig.additionalHeaders;
		return result;
	}
	if (!instanceName) throw new Error(`Group "${modelConfig.group}" is missing an instanceName for non-serverless configuration.`);
	const modelDetails = groupConfig.models[modelName];
	const { deploymentName = "", version = "" } = typeof modelDetails === "object" ? {
		deploymentName: modelDetails.deploymentName ?? groupConfig.deploymentName,
		version: modelDetails.version ?? groupConfig.version
	} : {
		deploymentName: groupConfig.deploymentName,
		version: groupConfig.version
	};
	if (!deploymentName || !version) throw new Error(`Model "${modelName}" in group "${modelConfig.group}" is missing a deploymentName ("${deploymentName}") or version ("${version}").`);
	const azureOptions = {
		azureOpenAIApiKey: require_data_service.extractEnvVariable(groupConfig.apiKey),
		azureOpenAIApiInstanceName: require_data_service.extractEnvVariable(instanceName),
		azureOpenAIApiDeploymentName: require_data_service.extractEnvVariable(deploymentName),
		azureOpenAIApiVersion: require_data_service.extractEnvVariable(version)
	};
	for (const value of Object.values(azureOptions)) if (typeof value === "string" && require_data_service.envVarRegex.test(value)) throw new Error(`Azure configuration environment variable "${value}" was not found.`);
	const result = { azureOptions };
	if (baseURL) result.baseURL = require_data_service.extractEnvVariable(baseURL);
	if (groupConfig.additionalHeaders) result.headers = groupConfig.additionalHeaders;
	return result;
}
function mapGroupToAzureConfig({ groupName, groupMap }) {
	const groupConfig = groupMap[groupName];
	if (!groupConfig) throw new Error(`Group named "${groupName}" not found in configuration.`);
	const instanceName = groupConfig.instanceName ?? "";
	const serverless = groupConfig.serverless ?? false;
	const baseURL = groupConfig.baseURL ?? "";
	if (!instanceName && !serverless) throw new Error(`Group "${groupName}" is missing an instanceName for non-serverless configuration.`);
	if (serverless && !baseURL) throw new Error(`Group "${groupName}" is missing the required base URL for serverless configuration.`);
	const models = Object.keys(groupConfig.models);
	if (models.length === 0) throw new Error(`Group "${groupName}" does not have any models configured.`);
	const firstModelName = models[0];
	const modelDetails = groupConfig.models[firstModelName];
	const azureOptions = {
		azureOpenAIApiVersion: require_data_service.extractEnvVariable(groupConfig.version ?? ""),
		azureOpenAIApiKey: require_data_service.extractEnvVariable(groupConfig.apiKey),
		azureOpenAIApiInstanceName: require_data_service.extractEnvVariable(instanceName)
	};
	if (serverless) return {
		azureOptions,
		baseURL: require_data_service.extractEnvVariable(baseURL),
		serverless: true,
		...groupConfig.additionalHeaders && { headers: groupConfig.additionalHeaders }
	};
	const { deploymentName = "", version = "" } = typeof modelDetails === "object" ? {
		deploymentName: modelDetails.deploymentName ?? groupConfig.deploymentName,
		version: modelDetails.version ?? groupConfig.version
	} : {
		deploymentName: groupConfig.deploymentName,
		version: groupConfig.version
	};
	if (!deploymentName || !version) throw new Error(`Model "${firstModelName}" in group "${groupName}" or the group itself is missing a deploymentName ("${deploymentName}") or version ("${version}").`);
	azureOptions.azureOpenAIApiDeploymentName = require_data_service.extractEnvVariable(deploymentName);
	azureOptions.azureOpenAIApiVersion = require_data_service.extractEnvVariable(version);
	const result = { azureOptions };
	if (baseURL) result.baseURL = require_data_service.extractEnvVariable(baseURL);
	if (groupConfig.additionalHeaders) result.headers = groupConfig.additionalHeaders;
	return result;
}
//#endregion
//#region src/messages.ts
function buildTree({ messages, fileMap }) {
	if (messages === null) return null;
	const messageMap = {};
	const rootMessages = [];
	const childrenCount = {};
	messages.forEach((message) => {
		if (!message) return;
		const parentId = message.parentMessageId ?? "";
		childrenCount[parentId] = (childrenCount[parentId] || 0) + 1;
		const extendedMessage = {
			...message,
			children: [],
			depth: 0,
			siblingIndex: childrenCount[parentId] - 1
		};
		if (message.files && fileMap) extendedMessage.files = message.files.map((file) => fileMap[file.file_id ?? ""] ?? file);
		messageMap[message.messageId] = extendedMessage;
		const parentMessage = messageMap[parentId];
		if (parentMessage) {
			parentMessage.children.push(extendedMessage);
			extendedMessage.depth = parentMessage.depth + 1;
		} else rootMessages.push(extendedMessage);
	});
	return rootMessages;
}
//#endregion
//#region src/artifacts.ts
let ArtifactModes = /* @__PURE__ */ function(ArtifactModes) {
	ArtifactModes["DEFAULT"] = "default";
	ArtifactModes["SHADCNUI"] = "shadcnui";
	ArtifactModes["CUSTOM"] = "custom";
	return ArtifactModes;
}({});
const utils = `
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
const accordian = `import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
`;
const alertDialog = `import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
`;
const alert = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border border-gray-200 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950 dark:border-gray-800 dark:[&>svg]:text-gray-50",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50",
        destructive:
          "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

`;
const avatar = `import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "../../lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

`;
const badge = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        destructive:
          "border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/80",
        outline: "text-gray-950 dark:text-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

`;
const breadcrumb = `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "../../lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500 sm:gap-2.5 dark:text-gray-400",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-gray-950 dark:hover:text-gray-50", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-gray-950 dark:text-gray-50", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}

`;
const button = `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
        destructive:
          "bg-red-500 text-gray-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/90",
        outline:
          "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        link: "text-gray-900 underline-offset-4 hover:underline dark:text-gray-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`;
const calendar = `import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 dark:[&:has([aria-selected])]:bg-gray-800",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gray-900 text-gray-50 hover:bg-gray-900 hover:text-gray-50 focus:bg-gray-900 focus:text-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50 dark:hover:text-gray-900 dark:focus:bg-gray-50 dark:focus:text-gray-900",
        day_today: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
        day_outside:
          "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-500 aria-selected:opacity-30 dark:text-gray-400 dark:aria-selected:bg-gray-800/50 dark:aria-selected:text-gray-400",
        day_disabled: "text-gray-500 opacity-50 dark:text-gray-400",
        day_range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

`;
const card = `import * as React from 'react';

import { cn } from '../../lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`;
const carousel = `import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

`;
const checkbox = `import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-gray-200 dark:border-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-gray-50  dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=checked]:bg-gray-50 dark:data-[state=checked]:text-gray-900",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

`;
const collapsible = `import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

`;
const dialog = `import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:ring-offset-gray-950 dark:focus:ring-gray-300 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-400">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

`;
const drawer = `import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "../../lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-100 dark:bg-gray-800" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}

`;
const dropdownMenu = `import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[state=open]:bg-gray-100 dark:focus:bg-gray-800 dark:data-[state=open]:bg-gray-800",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100 dark:bg-gray-800", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

`;
const hoverCard = `import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "../../lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }

`;
const input = `import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`;
const label = `import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
`;
const menuBar = `
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-950",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-gray-100 focus:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-50",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100 dark:bg-gray-800", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-gray-500 dark:text-gray-400",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}

`;
const navigationMenu = `import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{""}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)] dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-gray-200 shadow-md dark:bg-gray-800" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}

`;
const pagination = `import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "../../lib/utils"
import { ButtonProps, buttonVariants } from "./button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}

`;
const popover = `import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }

`;
const progress = `import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "../../lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-gray-900 transition-all dark:bg-gray-50"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
`;
const radioGroup = `import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-gray-200 dark:border-gray-900 text-gray-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:text-gray-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }

`;
const select = `import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "../../lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-gray-300",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100 dark:bg-gray-800", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

`;
const separator = `import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-gray-200 dark:bg-gray-800",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

`;
const skeleton = `import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-100 dark:bg-gray-800", className)}
      {...props}
    />
  )
}

export { Skeleton }
`;
const slider = `import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
      <SliderPrimitive.Range className="absolute h-full bg-gray-900 dark:bg-gray-50" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-gray-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-50 dark:bg-gray-950 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

`;
const switchComponent = `import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-200 dark:focus-visible:ring-gray-300 dark:focus-visible:ring-offset-gray-950 dark:data-[state=checked]:bg-gray-50 dark:data-[state=unchecked]:bg-gray-800",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 dark:bg-gray-950"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

`;
const table = `import * as React from "react"

import { cn } from "../../lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-gray-800/50",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

`;
const tabs = `import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

`;
const textarea = `import * as React from "react"

import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

`;
const toast = `import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-gray-200 p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-gray-800",
  {
    variants: {
      variant: {
        default: "border bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50",
        destructive:
          "destructive group border-red-500 bg-red-500 text-gray-50 dark:border-red-900 dark:bg-red-900 dark:text-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-gray-100/40 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-gray-50 group-[.destructive]:focus:ring-red-500 dark:border-gray-800 dark:ring-offset-gray-950 dark:hover:bg-gray-800 dark:focus:ring-gray-300 dark:group-[.destructive]:border-gray-800/40 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-gray-50 dark:group-[.destructive]:focus:ring-red-900",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-950/50 opacity-0 transition-opacity hover:text-gray-950 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 dark:text-gray-50/50 dark:hover:text-gray-50",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

`;
const toaster = `import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

`;
const toggleGroup = `import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { toggleVariants } from "./toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }

`;
const toggle = `import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900 dark:ring-offset-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-400 dark:focus-visible:ring-gray-300 dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-gray-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

`;
const tooltip = `import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

`;
const useToast = `import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "./toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
`;
const shadcnComponents = {
	utils,
	accordian,
	alertDialog,
	alert,
	avatar,
	badge,
	breadcrumb,
	button,
	calendar,
	card,
	carousel,
	checkbox,
	collapsible,
	dialog,
	drawer,
	dropdownMenu,
	hoverCard,
	input,
	label,
	menuBar,
	navigationMenu,
	pagination,
	popover,
	progress,
	radioGroup,
	select,
	separator,
	skeleton,
	slider,
	switchComponent,
	table,
	tabs,
	textarea,
	toast,
	toaster,
	toggleGroup,
	toggle,
	tooltip,
	useToast
};
const essentialShadcnComponents = {
	utils,
	avatar,
	button,
	card,
	checkbox,
	input,
	label,
	radioGroup,
	select,
	textarea
};
//#endregion
//#region src/permissions.ts
/**
* Enum for Permission Types
*/
let PermissionTypes = /* @__PURE__ */ function(PermissionTypes) {
	/**
	* Type for Prompt Permissions
	*/
	PermissionTypes["PROMPTS"] = "PROMPTS";
	/**
	* Type for Bookmark Permissions
	*/
	PermissionTypes["BOOKMARKS"] = "BOOKMARKS";
	/**
	* Type for Agent Permissions
	*/
	PermissionTypes["AGENTS"] = "AGENTS";
	/**
	* Type for Memory Permissions
	*/
	PermissionTypes["MEMORIES"] = "MEMORIES";
	/**
	* Type for Multi-Conversation Permissions
	*/
	PermissionTypes["MULTI_CONVO"] = "MULTI_CONVO";
	/**
	* Type for Temporary Chat
	*/
	PermissionTypes["TEMPORARY_CHAT"] = "TEMPORARY_CHAT";
	/**
	* Type for using the "Run Code" LC Code Interpreter API feature
	*/
	PermissionTypes["RUN_CODE"] = "RUN_CODE";
	/**
	* Type for using the "Web Search" feature
	*/
	PermissionTypes["WEB_SEARCH"] = "WEB_SEARCH";
	/**
	* Type for People Picker Permissions
	*/
	PermissionTypes["PEOPLE_PICKER"] = "PEOPLE_PICKER";
	/**
	* Type for Marketplace Permissions
	*/
	PermissionTypes["MARKETPLACE"] = "MARKETPLACE";
	/**
	* Type for using the "File Search" feature
	*/
	PermissionTypes["FILE_SEARCH"] = "FILE_SEARCH";
	/**
	* Type for using the "File Citations" feature in agents
	*/
	PermissionTypes["FILE_CITATIONS"] = "FILE_CITATIONS";
	/**
	* Type for MCP Server Permissions
	*/
	PermissionTypes["MCP_SERVERS"] = "MCP_SERVERS";
	/**
	* Type for Remote Agent (API) Permissions
	*/
	PermissionTypes["REMOTE_AGENTS"] = "REMOTE_AGENTS";
	/**
	* Type for Skill Permissions
	*/
	PermissionTypes["SKILLS"] = "SKILLS";
	/**
	* Type for Shared Link Permissions
	*/
	PermissionTypes["SHARED_LINKS"] = "SHARED_LINKS";
	return PermissionTypes;
}({});
/**
* Maps PermissionTypes to their corresponding `interface` config field names.
* Used to identify which interface fields seed role permissions at startup
* and must NOT be overridden via DB config (use the role permissions editor instead).
*/
const PERMISSION_TYPE_INTERFACE_FIELDS = {
	["PROMPTS"]: "prompts",
	["AGENTS"]: "agents",
	["BOOKMARKS"]: "bookmarks",
	["MEMORIES"]: "memories",
	["MULTI_CONVO"]: "multiConvo",
	["TEMPORARY_CHAT"]: "temporaryChat",
	["RUN_CODE"]: "runCode",
	["WEB_SEARCH"]: "webSearch",
	["FILE_SEARCH"]: "fileSearch",
	["FILE_CITATIONS"]: "fileCitations",
	["PEOPLE_PICKER"]: "peoplePicker",
	["MARKETPLACE"]: "marketplace",
	["MCP_SERVERS"]: "mcpServers",
	["REMOTE_AGENTS"]: "remoteAgents",
	["SKILLS"]: "skills",
	["SHARED_LINKS"]: "sharedLinks"
};
/** Set of interface config field names that correspond to role permissions. */
const INTERFACE_PERMISSION_FIELDS = new Set(Object.values(PERMISSION_TYPE_INTERFACE_FIELDS));
/**
* YAML sub-keys within composite interface permission fields that map to permission bits.
* When an interface permission field is an object, only these sub-keys are stripped from
* DB overrides — other sub-keys (like `placeholder`, `trustCheckbox`) are UI-only and pass through.
*
* Mapping to Permissions enum:
*   'use'           → Permissions.USE       (agents, prompts, mcpServers, remoteAgents, marketplace)
*   'create'        → Permissions.CREATE    (agents, prompts, mcpServers, remoteAgents)
*   'share'         → Permissions.SHARE     (agents, prompts, mcpServers, remoteAgents)
*   'public'        → Permissions.SHARE_PUBLIC (agents, prompts, mcpServers, remoteAgents)
*   'users'         → Permissions.VIEW_USERS   (peoplePicker only)
*   'groups'        → Permissions.VIEW_GROUPS  (peoplePicker only)
*   'roles'         → Permissions.VIEW_ROLES   (peoplePicker only)
*   'configureObo'  → Permissions.CONFIGURE_OBO (mcpServers only)
*/
const PERMISSION_SUB_KEYS = new Set([
	"use",
	"create",
	"share",
	"public",
	"users",
	"groups",
	"roles",
	"configureObo"
]);
/**
* Enum for Role-Based Access Control Constants
*/
let Permissions = /* @__PURE__ */ function(Permissions) {
	Permissions["USE"] = "USE";
	Permissions["CREATE"] = "CREATE";
	Permissions["UPDATE"] = "UPDATE";
	Permissions["READ"] = "READ";
	Permissions["READ_AUTHOR"] = "READ_AUTHOR";
	Permissions["SHARE"] = "SHARE";
	/** Can disable if desired */
	Permissions["OPT_OUT"] = "OPT_OUT";
	Permissions["VIEW_USERS"] = "VIEW_USERS";
	Permissions["VIEW_GROUPS"] = "VIEW_GROUPS";
	Permissions["VIEW_ROLES"] = "VIEW_ROLES";
	/** Can share resources publicly (with everyone) */
	Permissions["SHARE_PUBLIC"] = "SHARE_PUBLIC";
	/**
	* Can configure MCP server On-Behalf-Of (OBO) token exchange. Gates the
	* `obo` field on MCP server configs because OBO silently mints and forwards
	* per-user delegated tokens to whatever URL the server points at.
	*/
	Permissions["CONFIGURE_OBO"] = "CONFIGURE_OBO";
	return Permissions;
}({});
const promptPermissionsSchema = zod.z.object({
	["USE"]: zod.z.boolean().default(true),
	["CREATE"]: zod.z.boolean().default(true),
	["SHARE"]: zod.z.boolean().default(false),
	["SHARE_PUBLIC"]: zod.z.boolean().default(false)
});
const bookmarkPermissionsSchema = zod.z.object({ ["USE"]: zod.z.boolean().default(true) });
const memoryPermissionsSchema = zod.z.object({
	["USE"]: zod.z.boolean().default(true),
	["CREATE"]: zod.z.boolean().default(true),
	["UPDATE"]: zod.z.boolean().default(true),
	["READ"]: zod.z.boolean().default(true),
	["OPT_OUT"]: zod.z.boolean().default(true)
});
const agentPermissionsSchema = zod.z.object({
	["USE"]: zod.z.boolean().default(true),
	["CREATE"]: zod.z.boolean().default(true),
	["SHARE"]: zod.z.boolean().default(false),
	["SHARE_PUBLIC"]: zod.z.boolean().default(false)
});
const multiConvoPermissionsSchema = zod.z.object({ ["USE"]: zod.z.boolean().default(true) });
const temporaryChatPermissionsSchema = zod.z.object({ ["USE"]: zod.z.boolean().default(true) });
const runCodePermissionsSchema = zod.z.object({ ["USE"]: zod.z.boolean().default(true) });
const webSearchPermissionsSchema = zod.z.object({ ["USE"]: zod.z.boolean().default(true) });
const peoplePickerPermissionsSchema = zod.z.object({
	["VIEW_USERS"]: zod.z.boolean().default(true),
	["VIEW_GROUPS"]: zod.z.boolean().default(true),
	["VIEW_ROLES"]: zod.z.boolean().default(true)
});
const marketplacePermissionsSchema = zod.z.object({ ["USE"]: zod.z.boolean().default(false) });
const fileSearchPermissionsSchema = zod.z.object({ ["USE"]: zod.z.boolean().default(true) });
const fileCitationsPermissionsSchema = zod.z.object({ ["USE"]: zod.z.boolean().default(true) });
const mcpServersPermissionsSchema = zod.z.object({
	["USE"]: zod.z.boolean().default(true),
	["CREATE"]: zod.z.boolean().default(true),
	["SHARE"]: zod.z.boolean().default(false),
	["SHARE_PUBLIC"]: zod.z.boolean().default(false),
	["CONFIGURE_OBO"]: zod.z.boolean().default(false)
});
const remoteAgentsPermissionsSchema = zod.z.object({
	["USE"]: zod.z.boolean().default(false),
	["CREATE"]: zod.z.boolean().default(false),
	["SHARE"]: zod.z.boolean().default(false),
	["SHARE_PUBLIC"]: zod.z.boolean().default(false)
});
const skillPermissionsSchema = zod.z.object({
	["USE"]: zod.z.boolean().default(true),
	["CREATE"]: zod.z.boolean().default(true),
	["SHARE"]: zod.z.boolean().default(false),
	["SHARE_PUBLIC"]: zod.z.boolean().default(false)
});
const sharedLinksPermissionsSchema = zod.z.object({
	["CREATE"]: zod.z.boolean().default(true),
	["SHARE"]: zod.z.boolean().default(true),
	["SHARE_PUBLIC"]: zod.z.boolean().default(false)
});
const permissionsSchema = zod.z.object({
	["PROMPTS"]: promptPermissionsSchema,
	["BOOKMARKS"]: bookmarkPermissionsSchema,
	["MEMORIES"]: memoryPermissionsSchema,
	["AGENTS"]: agentPermissionsSchema,
	["MULTI_CONVO"]: multiConvoPermissionsSchema,
	["TEMPORARY_CHAT"]: temporaryChatPermissionsSchema,
	["RUN_CODE"]: runCodePermissionsSchema,
	["WEB_SEARCH"]: webSearchPermissionsSchema,
	["PEOPLE_PICKER"]: peoplePickerPermissionsSchema,
	["MARKETPLACE"]: marketplacePermissionsSchema,
	["FILE_SEARCH"]: fileSearchPermissionsSchema,
	["FILE_CITATIONS"]: fileCitationsPermissionsSchema,
	["MCP_SERVERS"]: mcpServersPermissionsSchema,
	["REMOTE_AGENTS"]: remoteAgentsPermissionsSchema,
	["SKILLS"]: skillPermissionsSchema,
	["SHARED_LINKS"]: sharedLinksPermissionsSchema
});
//#endregion
//#region src/roles.ts
/**
* Enum for System Defined Roles
*/
let SystemRoles = /* @__PURE__ */ function(SystemRoles) {
	/**
	* The Admin role
	*/
	SystemRoles["ADMIN"] = "ADMIN";
	/**
	* The default user role
	*/
	SystemRoles["USER"] = "USER";
	return SystemRoles;
}({});
const roleSchema = zod.z.object({
	name: zod.z.string(),
	permissions: permissionsSchema
});
const defaultRolesSchema = zod.z.object({
	["ADMIN"]: roleSchema.extend({
		name: zod.z.literal("ADMIN"),
		permissions: permissionsSchema.extend({
			["PROMPTS"]: promptPermissionsSchema.extend({
				["USE"]: zod.z.boolean().default(true),
				["CREATE"]: zod.z.boolean().default(true),
				["SHARE"]: zod.z.boolean().default(true),
				["SHARE_PUBLIC"]: zod.z.boolean().default(true)
			}),
			["BOOKMARKS"]: bookmarkPermissionsSchema.extend({ ["USE"]: zod.z.boolean().default(true) }),
			["MEMORIES"]: memoryPermissionsSchema.extend({
				["USE"]: zod.z.boolean().default(true),
				["CREATE"]: zod.z.boolean().default(true),
				["UPDATE"]: zod.z.boolean().default(true),
				["READ"]: zod.z.boolean().default(true),
				["OPT_OUT"]: zod.z.boolean().default(true)
			}),
			["AGENTS"]: agentPermissionsSchema.extend({
				["USE"]: zod.z.boolean().default(true),
				["CREATE"]: zod.z.boolean().default(true),
				["SHARE"]: zod.z.boolean().default(true),
				["SHARE_PUBLIC"]: zod.z.boolean().default(true)
			}),
			["MULTI_CONVO"]: multiConvoPermissionsSchema.extend({ ["USE"]: zod.z.boolean().default(true) }),
			["TEMPORARY_CHAT"]: temporaryChatPermissionsSchema.extend({ ["USE"]: zod.z.boolean().default(true) }),
			["RUN_CODE"]: runCodePermissionsSchema.extend({ ["USE"]: zod.z.boolean().default(true) }),
			["WEB_SEARCH"]: webSearchPermissionsSchema.extend({ ["USE"]: zod.z.boolean().default(true) }),
			["PEOPLE_PICKER"]: peoplePickerPermissionsSchema.extend({
				["VIEW_USERS"]: zod.z.boolean().default(true),
				["VIEW_GROUPS"]: zod.z.boolean().default(true),
				["VIEW_ROLES"]: zod.z.boolean().default(true)
			}),
			["MARKETPLACE"]: zod.z.object({ ["USE"]: zod.z.boolean().default(false) }),
			["FILE_SEARCH"]: fileSearchPermissionsSchema.extend({ ["USE"]: zod.z.boolean().default(true) }),
			["FILE_CITATIONS"]: fileCitationsPermissionsSchema.extend({ ["USE"]: zod.z.boolean().default(true) }),
			["MCP_SERVERS"]: mcpServersPermissionsSchema.extend({
				["USE"]: zod.z.boolean().default(true),
				["CREATE"]: zod.z.boolean().default(true),
				["SHARE"]: zod.z.boolean().default(true),
				["SHARE_PUBLIC"]: zod.z.boolean().default(true),
				["CONFIGURE_OBO"]: zod.z.boolean().default(true)
			}),
			["REMOTE_AGENTS"]: remoteAgentsPermissionsSchema.extend({
				["USE"]: zod.z.boolean().default(true),
				["CREATE"]: zod.z.boolean().default(true),
				["SHARE"]: zod.z.boolean().default(true),
				["SHARE_PUBLIC"]: zod.z.boolean().default(true)
			}),
			["SKILLS"]: skillPermissionsSchema.extend({
				["USE"]: zod.z.boolean().default(true),
				["CREATE"]: zod.z.boolean().default(true),
				["SHARE"]: zod.z.boolean().default(true),
				["SHARE_PUBLIC"]: zod.z.boolean().default(true)
			}),
			["SHARED_LINKS"]: sharedLinksPermissionsSchema.extend({
				["CREATE"]: zod.z.boolean().default(true),
				["SHARE"]: zod.z.boolean().default(true),
				["SHARE_PUBLIC"]: zod.z.boolean().default(true)
			})
		})
	}),
	["USER"]: roleSchema.extend({
		name: zod.z.literal("USER"),
		permissions: permissionsSchema
	})
});
const systemRoleSet = new Set(Object.values(SystemRoles).map((r) => r.toUpperCase()));
/** Case-insensitive check for reserved system role names. */
function isSystemRoleName(name) {
	if (!name) return false;
	return systemRoleSet.has(name.toUpperCase());
}
const roleDefaults = defaultRolesSchema.parse({
	["ADMIN"]: {
		name: "ADMIN",
		permissions: {
			["PROMPTS"]: {
				["USE"]: true,
				["CREATE"]: true,
				["SHARE"]: true,
				["SHARE_PUBLIC"]: true
			},
			["BOOKMARKS"]: { ["USE"]: true },
			["MEMORIES"]: {
				["USE"]: true,
				["CREATE"]: true,
				["UPDATE"]: true,
				["READ"]: true,
				["OPT_OUT"]: true
			},
			["AGENTS"]: {
				["USE"]: true,
				["CREATE"]: true,
				["SHARE"]: true,
				["SHARE_PUBLIC"]: true
			},
			["MULTI_CONVO"]: { ["USE"]: true },
			["TEMPORARY_CHAT"]: { ["USE"]: true },
			["RUN_CODE"]: { ["USE"]: true },
			["WEB_SEARCH"]: { ["USE"]: true },
			["PEOPLE_PICKER"]: {
				["VIEW_USERS"]: true,
				["VIEW_GROUPS"]: true,
				["VIEW_ROLES"]: true
			},
			["MARKETPLACE"]: { ["USE"]: true },
			["FILE_SEARCH"]: { ["USE"]: true },
			["FILE_CITATIONS"]: { ["USE"]: true },
			["MCP_SERVERS"]: {
				["USE"]: true,
				["CREATE"]: true,
				["SHARE"]: true,
				["SHARE_PUBLIC"]: true,
				["CONFIGURE_OBO"]: true
			},
			["REMOTE_AGENTS"]: {
				["USE"]: true,
				["CREATE"]: true,
				["SHARE"]: true,
				["SHARE_PUBLIC"]: true
			},
			["SKILLS"]: {
				["USE"]: true,
				["CREATE"]: true,
				["SHARE"]: true,
				["SHARE_PUBLIC"]: true
			},
			["SHARED_LINKS"]: {
				["CREATE"]: true,
				["SHARE"]: true,
				["SHARE_PUBLIC"]: true
			}
		}
	},
	["USER"]: {
		name: "USER",
		permissions: {
			["PROMPTS"]: {
				["USE"]: true,
				["CREATE"]: true,
				["SHARE"]: false,
				["SHARE_PUBLIC"]: false
			},
			["BOOKMARKS"]: {},
			["MEMORIES"]: {},
			["AGENTS"]: {
				["USE"]: true,
				["CREATE"]: true,
				["SHARE"]: false,
				["SHARE_PUBLIC"]: false
			},
			["MULTI_CONVO"]: {},
			["TEMPORARY_CHAT"]: {},
			["RUN_CODE"]: {},
			["WEB_SEARCH"]: {},
			["PEOPLE_PICKER"]: {
				["VIEW_USERS"]: false,
				["VIEW_GROUPS"]: false,
				["VIEW_ROLES"]: false
			},
			["MARKETPLACE"]: { ["USE"]: false },
			["FILE_SEARCH"]: {},
			["FILE_CITATIONS"]: {},
			["MCP_SERVERS"]: {
				["USE"]: true,
				["CREATE"]: false,
				["SHARE"]: false,
				["SHARE_PUBLIC"]: false,
				["CONFIGURE_OBO"]: false
			},
			["REMOTE_AGENTS"]: {
				["USE"]: false,
				["CREATE"]: false,
				["SHARE"]: false,
				["SHARE_PUBLIC"]: false
			},
			["SKILLS"]: {
				["USE"]: true,
				["CREATE"]: true,
				["SHARE"]: false,
				["SHARE_PUBLIC"]: false
			},
			["SHARED_LINKS"]: {
				["CREATE"]: true,
				["SHARE"]: true,
				["SHARE_PUBLIC"]: true
			}
		}
	}
});
//#endregion
//#region src/types.ts
/**
* @deprecated Superseded by the persisted `userInvocable` /
* `disableModelInvocation` pair derived from frontmatter. Retained for the
* transition window so older UI forms and tests still type-check; the
* backend no longer reads or writes it.
*/
let InvocationMode = /* @__PURE__ */ function(InvocationMode) {
	InvocationMode["auto"] = "auto";
	InvocationMode["manual"] = "manual";
	InvocationMode["both"] = "both";
	return InvocationMode;
}({});
//#endregion
//#region src/types/skills.ts
/**
* Shared skill validation constants — the single source of truth for name,
* description, title, body, and file-path length limits. Mirrored by
* `packages/data-schemas/src/methods/skill.ts`; whenever those constants
* change, the DB-side validators MUST be updated to match.
*
* Exported from `librechat-data-provider` so both frontend form validators
* and backend Mongoose pre-save hooks use the same literals.
*/
const SKILL_NAME_MAX_LENGTH = 64;
const SKILL_DESCRIPTION_MAX_LENGTH = 1024;
const SKILL_DESCRIPTION_SHORT_THRESHOLD = 20;
const SKILL_DISPLAY_TITLE_MAX_LENGTH = 128;
const SKILL_BODY_MAX_LENGTH = 1e5;
/**
* Kebab-case identifier pattern: must start with a lowercase letter or digit,
* and contain only lowercase letters, digits, and hyphens. Mirrors the
* backend `SKILL_NAME_PATTERN` in `packages/data-schemas/src/methods/skill.ts`.
*/
const SKILL_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
//#endregion
//#region src/types/web.ts
let DATE_RANGE = /* @__PURE__ */ function(DATE_RANGE) {
	DATE_RANGE["PAST_HOUR"] = "h";
	DATE_RANGE["PAST_24_HOURS"] = "d";
	DATE_RANGE["PAST_WEEK"] = "w";
	DATE_RANGE["PAST_MONTH"] = "m";
	DATE_RANGE["PAST_YEAR"] = "y";
	return DATE_RANGE;
}({});
//#endregion
//#region src/actions.ts
function sha1(input) {
	return crypto.default.createHash("sha1").update(input).digest("hex");
}
function createURL(domain, path) {
	return new url.URL(`${domain.replace(/\/$/, "")}/${path.replace(/^\//, "")}`).toString();
}
const schemaTypeHandlers = {
	string: (schema) => {
		if (schema.enum) return zod.z.enum(schema.enum);
		let stringSchema = zod.z.string();
		if (schema.minLength !== void 0) stringSchema = stringSchema.min(schema.minLength);
		if (schema.maxLength !== void 0) stringSchema = stringSchema.max(schema.maxLength);
		return stringSchema;
	},
	number: (schema) => {
		let numberSchema = zod.z.number();
		if (schema.minimum !== void 0) numberSchema = numberSchema.min(schema.minimum);
		if (schema.maximum !== void 0) numberSchema = numberSchema.max(schema.maximum);
		return numberSchema;
	},
	integer: (schema) => schemaTypeHandlers.number(schema).int(),
	boolean: () => zod.z.boolean(),
	array: (schema) => {
		if (schema.items) {
			const zodSchema = openAPISchemaToZod(schema.items);
			if (zodSchema) return zod.z.array(zodSchema);
			return zod.z.array(zod.z.unknown());
		}
		return zod.z.array(zod.z.unknown());
	},
	object: (schema) => {
		const shape = {};
		if (schema.properties) Object.entries(schema.properties).forEach(([key, value]) => {
			shape[key] = openAPISchemaToZod(value) || zod.z.unknown();
			if (schema.required && schema.required.includes(key)) shape[key] = shape[key].describe(value.description || "");
			else shape[key] = shape[key].optional().describe(value.description || "");
		});
		return zod.z.object(shape);
	}
};
function openAPISchemaToZod(schema) {
	if (schema.type === "object" && Object.keys(schema.properties || {}).length === 0) return;
	return (schemaTypeHandlers[schema.type] || (() => zod.z.unknown()))(schema);
}
/**
* Class representing a function signature.
*/
var FunctionSignature = class {
	constructor(name, description, parameters, strict) {
		this.name = name;
		this.description = description;
		this.parameters = parameters;
		this.strict = strict ?? false;
	}
	toObjectTool() {
		const parameters = {
			...this.parameters,
			additionalProperties: this.strict ? false : void 0
		};
		return {
			type: "function",
			function: {
				name: this.name,
				description: this.description,
				parameters,
				...this.strict ? { strict: this.strict } : {}
			}
		};
	}
};
var RequestConfig = class {
	constructor(domain, basePath, method, operation, isConsequential, contentType, parameterLocations) {
		this.domain = domain;
		this.basePath = basePath;
		this.method = method;
		this.operation = operation;
		this.isConsequential = isConsequential;
		this.contentType = contentType;
		this.parameterLocations = parameterLocations;
	}
};
var RequestExecutor = class {
	constructor(config) {
		this.config = config;
		this.authHeaders = {};
		this.path = config.basePath;
	}
	setParams(params) {
		this.operationHash = sha1(JSON.stringify(params));
		this.params = { ...params };
		if (this.config.parameterLocations) {
			for (const [key, value] of Object.entries(params)) if (this.config.parameterLocations[key] === "path") {
				const paramPattern = `{${key}}`;
				if (this.path.includes(paramPattern)) {
					this.path = this.path.replace(paramPattern, encodeURIComponent(String(value)));
					delete this.params[key];
				}
			}
		} else for (const [key, value] of Object.entries(params)) {
			const paramPattern = `{${key}}`;
			if (this.path.includes(paramPattern)) {
				this.path = this.path.replace(paramPattern, encodeURIComponent(String(value)));
				delete this.params[key];
			}
		}
		return this;
	}
	async setAuth(metadata) {
		if (!metadata.auth) return this;
		const { type, authorization_type, custom_auth_header, authorization_url, client_url, scope, token_exchange_method } = metadata.auth;
		const { api_key, oauth_client_id, oauth_client_secret, oauth_token_expires_at, oauth_access_token = "" } = metadata;
		const isApiKey = api_key != null && api_key.length > 0 && type === "service_http";
		const isOAuth = !!(oauth_client_id != null && oauth_client_id && oauth_client_secret != null && oauth_client_secret && type === "oauth" && authorization_url != null && authorization_url && client_url != null && client_url && scope != null && scope && token_exchange_method);
		if (isApiKey && authorization_type === "basic") {
			const basicToken = Buffer.from(api_key).toString("base64");
			this.authHeaders["Authorization"] = `Basic ${basicToken}`;
		} else if (isApiKey && authorization_type === "bearer") this.authHeaders["Authorization"] = `Bearer ${api_key}`;
		else if (isApiKey && authorization_type === "custom" && custom_auth_header != null && custom_auth_header) this.authHeaders[custom_auth_header] = api_key;
		else if (isOAuth) {
			const now = /* @__PURE__ */ new Date();
			if (!oauth_access_token) throw new Error("No access token found. Please log in first.");
			if (oauth_token_expires_at && now >= new Date(oauth_token_expires_at)) throw new Error("Access token is expired. Please re-login.");
			this.authToken = oauth_access_token;
			this.authHeaders["Authorization"] = `Bearer ${this.authToken}`;
		}
		return this;
	}
	async execute(options) {
		const url$1 = createURL(this.config.domain, this.path);
		const headers = {
			...this.authHeaders,
			...this.config.contentType ? { "Content-Type": this.config.contentType } : {}
		};
		const method = this.config.method.toLowerCase();
		/**
		* SECURITY: Disable automatic redirects to prevent SSRF bypass.
		* Attackers could use redirects to access internal services:
		*   1. Set action URL to allowed external domain
		*   2. External domain redirects to internal service (e.g., 127.0.0.1, rag_api)
		*   3. Without this protection, axios would follow the redirect
		*
		* By setting maxRedirects: 0, we prevent this attack vector.
		* The action will receive the redirect response (3xx) instead of following it.
		*
		* SECURITY: When httpAgent/httpsAgent are provided (SSRF-safe agents), they validate
		* the DNS-resolved IP at TCP connect time, preventing TOCTOU DNS rebinding attacks.
		*/
		const axios$1 = axios.default.create({
			maxRedirects: 0,
			validateStatus: (status) => status >= 200 && status < 400,
			...options?.httpAgent != null ? { httpAgent: options.httpAgent } : {},
			...options?.httpsAgent != null ? { httpsAgent: options.httpsAgent } : {}
		});
		const queryParams = {};
		const bodyParams = {};
		if (this.config.parameterLocations && this.params) for (const key of Object.keys(this.params)) {
			const loc = this.config.parameterLocations[key] || (method === "get" ? "query" : "body");
			const val = this.params[key];
			if (loc === "query") queryParams[key] = val;
			else if (loc === "header") headers[key] = String(val);
			else if (loc === "body") bodyParams[key] = val;
		}
		else if (this.params) {
			Object.assign(queryParams, this.params);
			Object.assign(bodyParams, this.params);
		}
		if (method === "get") return axios$1.get(url$1, {
			headers,
			params: queryParams
		});
		else if (method === "post") return axios$1.post(url$1, bodyParams, {
			headers,
			params: queryParams
		});
		else if (method === "put") return axios$1.put(url$1, bodyParams, {
			headers,
			params: queryParams
		});
		else if (method === "delete") return axios$1.delete(url$1, {
			headers,
			data: bodyParams,
			params: queryParams
		});
		else if (method === "patch") return axios$1.patch(url$1, bodyParams, {
			headers,
			params: queryParams
		});
		else throw new Error(`Unsupported HTTP method: ${method}`);
	}
	getConfig() {
		return this.config;
	}
};
var ActionRequest = class {
	constructor(domain, path, method, operation, isConsequential, contentType, parameterLocations) {
		this.config = new RequestConfig(domain, path, method, operation, isConsequential, contentType, parameterLocations);
	}
	get domain() {
		return this.config.domain;
	}
	get path() {
		return this.config.basePath;
	}
	get method() {
		return this.config.method;
	}
	get operation() {
		return this.config.operation;
	}
	get isConsequential() {
		return this.config.isConsequential;
	}
	get contentType() {
		return this.config.contentType;
	}
	createExecutor() {
		return new RequestExecutor(this.config);
	}
	setParams(params) {
		const executor = this.createExecutor();
		executor.setParams(params);
		return executor;
	}
	async setAuth(metadata) {
		return this.createExecutor().setAuth(metadata);
	}
	async execute() {
		return this.createExecutor().execute();
	}
};
function resolveRef(obj, components) {
	if ("$ref" in obj && components) {
		const refPath = obj.$ref.replace(/^#\/components\//, "").split("/");
		let resolved = components;
		for (const segment of refPath) if (typeof resolved === "object" && resolved !== null && segment in resolved) resolved = resolved[segment];
		else throw new Error(`Could not resolve reference: ${obj.$ref}`);
		return resolveRef(resolved, components);
	}
	return obj;
}
function sanitizeOperationId(input) {
	return input.replace(/[^a-zA-Z0-9_-]/g, "");
}
/**
* Converts an OpenAPI spec to function signatures and request builders.
*/
function openapiToFunction(openapiSpec, generateZodSchemas = false) {
	const functionSignatures = [];
	const requestBuilders = {};
	const zodSchemas = {};
	const baseUrl = openapiSpec.servers?.[0]?.url ?? "";
	for (const [path, methods] of Object.entries(openapiSpec.paths)) for (const [method, operation] of Object.entries(methods)) {
		const paramLocations = {};
		const operationObj = operation;
		const defaultOperationId = `${method}_${path}`;
		const operationId = operationObj.operationId || sanitizeOperationId(defaultOperationId);
		const description = operationObj.summary || operationObj.description || "";
		const isStrict = operationObj["x-strict"] ?? false;
		const parametersSchema = {
			type: "object",
			properties: {},
			required: []
		};
		if (operationObj.parameters) for (const param of operationObj.parameters ?? []) {
			const resolvedParam = resolveRef(param, openapiSpec.components);
			const paramName = resolvedParam.name;
			if (!paramName || !resolvedParam.schema) continue;
			const paramSchema = resolveRef(resolvedParam.schema, openapiSpec.components);
			parametersSchema.properties[paramName] = paramSchema;
			if (resolvedParam.required) parametersSchema.required.push(paramName);
			paramLocations[paramName] = resolvedParam.in === "query" || resolvedParam.in === "path" || resolvedParam.in === "header" || resolvedParam.in === "body" ? resolvedParam.in : "query";
		}
		let contentType = "";
		if (operationObj.requestBody) {
			const content = operationObj.requestBody.content;
			contentType = Object.keys(content ?? {})[0];
			const schema = content?.[contentType]?.schema;
			const resolvedSchema = resolveRef(schema, openapiSpec.components);
			parametersSchema.properties = {
				...parametersSchema.properties,
				...resolvedSchema.properties
			};
			if (resolvedSchema.required) parametersSchema.required.push(...resolvedSchema.required);
			if (resolvedSchema.properties) for (const key in resolvedSchema.properties) paramLocations[key] = "body";
			contentType = contentType ?? "application/json";
		}
		const functionSignature = new FunctionSignature(operationId, description, parametersSchema, isStrict);
		functionSignatures.push(functionSignature);
		requestBuilders[operationId] = new ActionRequest(baseUrl, path, method, operationId, !!(operationObj["x-openai-isConsequential"] ?? false), contentType, paramLocations);
		if (generateZodSchemas && Object.keys(parametersSchema.properties).length > 0) {
			const schema = openAPISchemaToZod(parametersSchema);
			if (schema) zodSchemas[operationId] = schema;
		}
	}
	return {
		functionSignatures,
		requestBuilders,
		zodSchemas
	};
}
/**
* Cross-platform IP validation (works in Node.js and browser).
* @param input - String to check if it's an IP address
* @returns 0 if not IP, 4 for IPv4, 6 for IPv6
*/
function isIP(input) {
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(input)) return 4;
	if (/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(input)) return 6;
	return 0;
}
/**
* Extracts domain from URL (protocol + hostname).
* @param url - URL to extract from
* @returns Protocol and hostname (e.g., "https://example.com")
*/
function extractDomainFromUrl(url$2) {
	try {
		/** Parsed URL object */
		const parsedUrl = new url.URL(url$2);
		const hostname = isIP(parsedUrl.hostname) === 6 ? `[${parsedUrl.hostname}]` : parsedUrl.hostname;
		return `${parsedUrl.protocol}//${hostname}`;
	} catch {
		throw new Error(`Invalid URL format: ${url$2}`);
	}
}
/**
* Validates client domain matches OpenAPI spec server URL domain (SSRF prevention).
* @param clientProvidedDomain - Domain from client (with/without protocol)
* @param specServerUrl - Server URL from OpenAPI spec
* @returns Validation result with normalized domains
*/
function validateActionDomain(clientProvidedDomain, specServerUrl) {
	try {
		/** Parsed spec URL */
		const specUrl = new url.URL(specServerUrl);
		if (specUrl.protocol !== "http:" && specUrl.protocol !== "https:") return {
			isValid: false,
			message: `Invalid protocol: Only HTTP and HTTPS are allowed, got ${specUrl.protocol}`
		};
		/** Spec hostname only */
		const specHostname = specUrl.hostname;
		const normalizedSpecDomain = isIP(specHostname) === 6 ? `${specUrl.protocol}//[${specHostname}]` : `${specUrl.protocol}//${specHostname}`;
		/** Extract hostname from client domain if it's a full URL */
		let clientHostname = clientProvidedDomain;
		let clientHasProtocol = false;
		if (clientProvidedDomain.includes("://")) {
			if (!clientProvidedDomain.startsWith("http://") && !clientProvidedDomain.startsWith("https://")) return {
				isValid: false,
				message: `Invalid protocol: Only HTTP and HTTPS are allowed in client domain`
			};
			try {
				clientHostname = new url.URL(clientProvidedDomain).hostname;
				clientHasProtocol = true;
			} catch {
				clientHasProtocol = false;
			}
		}
		/** Normalize IPv6 addresses by removing brackets for comparison */
		const normalizedClientHostname = clientHostname.replace(/^\[(.+)\]$/, "$1");
		const normalizedSpecHostname = specHostname.replace(/^\[(.+)\]$/, "$1");
		/** Check if hostname is valid IP using cross-platform isIP */
		const isIPAddress = isIP(normalizedClientHostname) !== 0;
		/** Normalized client domain */
		let normalizedClientDomain;
		if (clientHasProtocol) normalizedClientDomain = extractDomainFromUrl(clientProvidedDomain);
		else if (isIPAddress) {
			const hostname = isIP(normalizedClientHostname) === 6 && !clientHostname.startsWith("[") ? `[${normalizedClientHostname}]` : clientHostname;
			normalizedClientDomain = `${specUrl.protocol}//${hostname}`;
		} else normalizedClientDomain = `https://${clientHostname}`;
		if (normalizedSpecDomain === normalizedClientDomain || !clientHasProtocol && isIPAddress && normalizedClientHostname === normalizedSpecHostname) return {
			isValid: true,
			normalizedSpecDomain,
			normalizedClientDomain
		};
		return {
			isValid: false,
			message: `Domain mismatch: Client provided '${clientProvidedDomain}', but spec uses '${specHostname}'`,
			normalizedSpecDomain,
			normalizedClientDomain
		};
	} catch (error) {
		return {
			isValid: false,
			message: `Failed to validate domain: ${error instanceof Error ? error.message : "Unknown error"}`
		};
	}
}
/**
* Validates and parses an OpenAPI spec.
*/
function validateAndParseOpenAPISpec(specString) {
	try {
		let parsedSpec;
		try {
			parsedSpec = JSON.parse(specString);
		} catch {
			parsedSpec = (0, js_yaml.load)(specString);
		}
		if (!parsedSpec.servers || !Array.isArray(parsedSpec.servers) || parsedSpec.servers.length === 0) return {
			status: false,
			message: "Could not find a valid URL in `servers`"
		};
		if (!parsedSpec.servers[0].url) return {
			status: false,
			message: "Could not find a valid URL in `servers`"
		};
		const paths = parsedSpec.paths;
		if (!paths || typeof paths !== "object" || Object.keys(paths).length === 0) return {
			status: false,
			message: "No paths found in the OpenAPI spec."
		};
		const components = parsedSpec.components?.schemas || {};
		const messages = [];
		for (const [path, methods] of Object.entries(paths)) for (const [httpMethod, operation] of Object.entries(methods)) {
			const { responses } = operation;
			if (typeof operation === "object" && responses) for (const [statusCode, response] of Object.entries(responses)) {
				const content = response.content;
				if (content && content["application/json"] && content["application/json"].schema) {
					const schema = content["application/json"].schema;
					if ("$ref" in schema && typeof schema.$ref === "string") {
						const refName = schema.$ref.split("/").pop();
						if (refName && !components[refName]) messages.push(`In context=('paths', '${path}', '${httpMethod}', '${statusCode}', 'response', 'content', 'application/json', 'schema'), reference to unknown component ${refName}; using empty schema`);
					}
				}
			}
		}
		return {
			status: true,
			message: messages.join("\n") || "OpenAPI spec is valid.",
			spec: parsedSpec,
			serverUrl: parsedSpec.servers[0].url
		};
	} catch (error) {
		console.error(error);
		return {
			status: false,
			message: "Error parsing OpenAPI spec."
		};
	}
}
//#endregion
//#region src/createPayload.ts
/** Resolves the browser's IANA timezone so the server can localize prompt variables. */
function getUserTimezone() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || void 0;
	} catch {
		return;
	}
}
function createPayload(submission) {
	const { isEdited, addedConvo, userMessage, isContinued, isTemporary, isRegenerate, conversation, editedContent, ephemeralAgent, endpointOption, manualSkills } = submission;
	const { conversationId } = require_data_service.tConvoUpdateSchema.parse(conversation);
	const { endpoint: _e, endpointType } = endpointOption;
	const endpoint = _e;
	let server = `${require_data_service.EndpointURLs["agents"]}/${endpoint}`;
	if (require_data_service.isAssistantsEndpoint(endpoint)) server = require_data_service.EndpointURLs[endpointType ?? endpoint] + (isEdited ? "/modify" : "");
	const payload = {
		...userMessage,
		...endpointOption,
		endpoint,
		addedConvo,
		isTemporary,
		isRegenerate,
		editedContent,
		conversationId,
		isContinued: !!(isEdited && isContinued),
		ephemeralAgent: require_data_service.isAssistantsEndpoint(endpoint) ? void 0 : ephemeralAgent,
		manualSkills: require_data_service.isAssistantsEndpoint(endpoint) ? void 0 : manualSkills,
		timezone: getUserTimezone()
	};
	return {
		server,
		payload
	};
}
//#endregion
//#region src/parameterSettings.ts
const baseDefinitions = {
	model: {
		key: "model",
		label: "com_ui_model",
		labelCode: true,
		type: "string",
		component: "dropdown",
		optionType: "model",
		selectPlaceholder: "com_ui_select_model",
		searchPlaceholder: "com_ui_select_search_model",
		searchPlaceholderCode: true,
		selectPlaceholderCode: true,
		columnSpan: 4
	},
	temperature: {
		key: "temperature",
		label: "com_endpoint_temperature",
		labelCode: true,
		description: "com_endpoint_openai_temp",
		descriptionCode: true,
		type: "number",
		component: "slider",
		optionType: "model",
		columnSpan: 4
	},
	topP: {
		key: "topP",
		label: "com_endpoint_top_p",
		labelCode: true,
		description: "com_endpoint_anthropic_topp",
		descriptionCode: true,
		type: "number",
		component: "slider",
		optionType: "model",
		columnSpan: 4
	},
	stop: {
		key: "stop",
		label: "com_endpoint_stop",
		labelCode: true,
		description: "com_endpoint_openai_stop",
		descriptionCode: true,
		placeholder: "com_endpoint_stop_placeholder",
		placeholderCode: true,
		type: "array",
		default: [],
		component: "tags",
		optionType: "conversation",
		minTags: 0,
		maxTags: 4
	},
	imageDetail: {
		key: "imageDetail",
		label: "com_endpoint_plug_image_detail",
		labelCode: true,
		description: "com_endpoint_openai_detail",
		descriptionCode: true,
		type: "enum",
		default: "auto",
		component: "slider",
		options: [
			"low",
			"auto",
			"high"
		],
		enumMappings: {
			["low"]: "com_ui_low",
			["auto"]: "com_ui_auto",
			["high"]: "com_ui_high"
		},
		optionType: "conversation",
		columnSpan: 2
	}
};
const createDefinition = (base, overrides) => {
	return {
		...base,
		...overrides
	};
};
const librechat = {
	modelLabel: {
		key: "modelLabel",
		label: "com_endpoint_custom_name",
		labelCode: true,
		type: "string",
		default: "",
		component: "input",
		placeholder: "com_endpoint_openai_custom_name_placeholder",
		placeholderCode: true,
		optionType: "conversation"
	},
	maxContextTokens: {
		key: "maxContextTokens",
		label: "com_endpoint_context_tokens",
		labelCode: true,
		type: "number",
		component: "input",
		placeholder: "com_nav_theme_system",
		placeholderCode: true,
		description: "com_endpoint_context_info",
		descriptionCode: true,
		optionType: "model",
		columnSpan: 2
	},
	resendFiles: {
		key: "resendFiles",
		label: "com_endpoint_plug_resend_files",
		labelCode: true,
		description: "com_endpoint_openai_resend_files",
		descriptionCode: true,
		type: "boolean",
		default: true,
		component: "switch",
		optionType: "conversation",
		showDefault: false,
		columnSpan: 2
	},
	promptPrefix: {
		key: "promptPrefix",
		label: "com_endpoint_prompt_prefix",
		labelCode: true,
		type: "string",
		default: "",
		component: "textarea",
		placeholder: "com_endpoint_openai_prompt_prefix_placeholder",
		placeholderCode: true,
		optionType: "model"
	},
	fileTokenLimit: {
		key: "fileTokenLimit",
		label: "com_ui_file_token_limit",
		labelCode: true,
		description: "com_ui_file_token_limit_desc",
		descriptionCode: true,
		placeholder: "com_nav_theme_system",
		placeholderCode: true,
		type: "number",
		component: "input",
		columnSpan: 2
	}
};
const openAIParams = {
	chatGptLabel: {
		...librechat.modelLabel,
		key: "chatGptLabel"
	},
	promptPrefix: librechat.promptPrefix,
	temperature: createDefinition(baseDefinitions.temperature, {
		default: require_data_service.openAISettings.temperature.default,
		range: {
			min: require_data_service.openAISettings.temperature.min,
			max: require_data_service.openAISettings.temperature.max,
			step: require_data_service.openAISettings.temperature.step
		}
	}),
	top_p: createDefinition(baseDefinitions.topP, {
		key: "top_p",
		default: require_data_service.openAISettings.top_p.default,
		range: {
			min: require_data_service.openAISettings.top_p.min,
			max: require_data_service.openAISettings.top_p.max,
			step: require_data_service.openAISettings.top_p.step
		}
	}),
	frequency_penalty: {
		key: "frequency_penalty",
		label: "com_endpoint_frequency_penalty",
		labelCode: true,
		description: "com_endpoint_openai_freq",
		descriptionCode: true,
		type: "number",
		default: require_data_service.openAISettings.frequency_penalty.default,
		range: {
			min: require_data_service.openAISettings.frequency_penalty.min,
			max: require_data_service.openAISettings.frequency_penalty.max,
			step: require_data_service.openAISettings.frequency_penalty.step
		},
		component: "slider",
		optionType: "model",
		columnSpan: 4
	},
	presence_penalty: {
		key: "presence_penalty",
		label: "com_endpoint_presence_penalty",
		labelCode: true,
		description: "com_endpoint_openai_pres",
		descriptionCode: true,
		type: "number",
		default: require_data_service.openAISettings.presence_penalty.default,
		range: {
			min: require_data_service.openAISettings.presence_penalty.min,
			max: require_data_service.openAISettings.presence_penalty.max,
			step: require_data_service.openAISettings.presence_penalty.step
		},
		component: "slider",
		optionType: "model",
		columnSpan: 4
	},
	max_tokens: {
		key: "max_tokens",
		label: "com_endpoint_max_output_tokens",
		labelCode: true,
		type: "number",
		component: "input",
		description: "com_endpoint_openai_max_tokens",
		descriptionCode: true,
		placeholder: "com_nav_theme_system",
		placeholderCode: true,
		optionType: "model",
		columnSpan: 2
	},
	reasoning_effort: {
		key: "reasoning_effort",
		label: "com_endpoint_reasoning_effort",
		labelCode: true,
		description: "com_endpoint_openai_reasoning_effort",
		descriptionCode: true,
		type: "enum",
		default: "",
		component: "slider",
		options: [
			"",
			"none",
			"minimal",
			"low",
			"medium",
			"high",
			"xhigh"
		],
		enumMappings: {
			[""]: "com_ui_auto",
			["none"]: "com_ui_none",
			["minimal"]: "com_ui_minimal",
			["low"]: "com_ui_low",
			["medium"]: "com_ui_medium",
			["high"]: "com_ui_high",
			["xhigh"]: "com_ui_xhigh"
		},
		optionType: "model",
		columnSpan: 4
	},
	useResponsesApi: {
		key: "useResponsesApi",
		label: "com_endpoint_use_responses_api",
		labelCode: true,
		description: "com_endpoint_openai_use_responses_api",
		descriptionCode: true,
		type: "boolean",
		default: false,
		component: "switch",
		optionType: "model",
		showDefault: false,
		columnSpan: 2
	},
	web_search: {
		key: "web_search",
		label: "com_ui_web_search",
		labelCode: true,
		description: "com_endpoint_openai_use_web_search",
		descriptionCode: true,
		type: "boolean",
		default: false,
		component: "switch",
		optionType: "model",
		showDefault: false,
		columnSpan: 2
	},
	reasoning_summary: {
		key: "reasoning_summary",
		label: "com_endpoint_reasoning_summary",
		labelCode: true,
		description: "com_endpoint_openai_reasoning_summary",
		descriptionCode: true,
		type: "enum",
		default: "",
		component: "slider",
		options: [
			"",
			"auto",
			"concise",
			"detailed"
		],
		enumMappings: {
			[""]: "com_ui_unset",
			["auto"]: "com_ui_auto",
			["concise"]: "com_ui_concise",
			["detailed"]: "com_ui_detailed"
		},
		optionType: "model",
		columnSpan: 4
	},
	verbosity: {
		key: "verbosity",
		label: "com_endpoint_verbosity",
		labelCode: true,
		description: "com_endpoint_openai_verbosity",
		descriptionCode: true,
		type: "enum",
		default: "",
		component: "slider",
		options: [
			"",
			"low",
			"medium",
			"high"
		],
		enumMappings: {
			[""]: "com_ui_none",
			["low"]: "com_ui_low",
			["medium"]: "com_ui_medium",
			["high"]: "com_ui_high"
		},
		optionType: "model",
		columnSpan: 4
	},
	disableStreaming: {
		key: "disableStreaming",
		label: "com_endpoint_disable_streaming_label",
		labelCode: true,
		description: "com_endpoint_disable_streaming",
		descriptionCode: true,
		type: "boolean",
		default: false,
		component: "switch",
		optionType: "model",
		showDefault: false,
		columnSpan: 2
	}
};
const anthropic = {
	maxOutputTokens: {
		key: "maxOutputTokens",
		label: "com_endpoint_max_output_tokens",
		labelCode: true,
		type: "number",
		component: "input",
		description: "com_endpoint_anthropic_maxoutputtokens",
		descriptionCode: true,
		placeholder: "com_nav_theme_system",
		placeholderCode: true,
		range: {
			min: require_data_service.anthropicSettings.maxOutputTokens.min,
			max: require_data_service.anthropicSettings.maxOutputTokens.max,
			step: require_data_service.anthropicSettings.maxOutputTokens.step
		},
		optionType: "model",
		columnSpan: 2
	},
	temperature: createDefinition(baseDefinitions.temperature, {
		default: require_data_service.anthropicSettings.temperature.default,
		range: {
			min: require_data_service.anthropicSettings.temperature.min,
			max: require_data_service.anthropicSettings.temperature.max,
			step: require_data_service.anthropicSettings.temperature.step
		}
	}),
	topP: createDefinition(baseDefinitions.topP, {
		default: require_data_service.anthropicSettings.topP.default,
		range: {
			min: require_data_service.anthropicSettings.topP.min,
			max: require_data_service.anthropicSettings.topP.max,
			step: require_data_service.anthropicSettings.topP.step
		}
	}),
	topK: {
		key: "topK",
		label: "com_endpoint_top_k",
		labelCode: true,
		description: "com_endpoint_anthropic_topk",
		descriptionCode: true,
		type: "number",
		default: require_data_service.anthropicSettings.topK.default,
		range: {
			min: require_data_service.anthropicSettings.topK.min,
			max: require_data_service.anthropicSettings.topK.max,
			step: require_data_service.anthropicSettings.topK.step
		},
		component: "slider",
		optionType: "model",
		columnSpan: 4
	},
	promptCache: {
		key: "promptCache",
		label: "com_endpoint_prompt_cache",
		labelCode: true,
		description: "com_endpoint_anthropic_prompt_cache",
		descriptionCode: true,
		type: "boolean",
		default: require_data_service.anthropicSettings.promptCache.default,
		component: "switch",
		optionType: "conversation",
		showDefault: false,
		columnSpan: 2
	},
	promptCacheTtl: {
		key: "promptCacheTtl",
		label: "com_endpoint_prompt_cache_ttl",
		labelCode: true,
		description: "com_endpoint_anthropic_prompt_cache_ttl",
		descriptionCode: true,
		type: "enum",
		default: require_data_service.anthropicSettings.promptCacheTtl.default,
		options: ["5m", "1h"],
		component: "combobox",
		optionType: "conversation",
		showDefault: false,
		selectPlaceholder: "com_endpoint_prompt_cache_ttl_default",
		selectPlaceholderCode: true,
		columnSpan: 2
	},
	thinking: {
		key: "thinking",
		label: "com_endpoint_thinking",
		labelCode: true,
		description: "com_endpoint_anthropic_thinking",
		descriptionCode: true,
		type: "boolean",
		default: require_data_service.anthropicSettings.thinking.default,
		component: "switch",
		optionType: "conversation",
		showDefault: false,
		columnSpan: 2
	},
	thinkingBudget: {
		key: "thinkingBudget",
		label: "com_endpoint_thinking_budget",
		labelCode: true,
		description: "com_endpoint_anthropic_thinking_budget",
		descriptionCode: true,
		type: "number",
		component: "input",
		default: require_data_service.anthropicSettings.thinkingBudget.default,
		range: {
			min: require_data_service.anthropicSettings.thinkingBudget.min,
			max: require_data_service.anthropicSettings.thinkingBudget.max,
			step: require_data_service.anthropicSettings.thinkingBudget.step
		},
		optionType: "conversation",
		columnSpan: 2
	},
	web_search: {
		key: "web_search",
		label: "com_ui_web_search",
		labelCode: true,
		description: "com_endpoint_anthropic_use_web_search",
		descriptionCode: true,
		type: "boolean",
		default: require_data_service.anthropicSettings.web_search.default,
		component: "switch",
		optionType: "conversation",
		showDefault: false,
		columnSpan: 2
	},
	effort: {
		key: "effort",
		label: "com_endpoint_effort",
		labelCode: true,
		description: "com_endpoint_anthropic_effort",
		descriptionCode: true,
		type: "enum",
		default: require_data_service.anthropicSettings.effort.default,
		component: "slider",
		options: require_data_service.anthropicSettings.effort.options,
		enumMappings: {
			[""]: "com_ui_auto",
			["low"]: "com_ui_low",
			["medium"]: "com_ui_medium",
			["high"]: "com_ui_high",
			["xhigh"]: "com_ui_xhigh",
			["max"]: "com_ui_max"
		},
		optionType: "model",
		columnSpan: 4
	},
	thinkingDisplay: {
		key: "thinkingDisplay",
		label: "com_endpoint_anthropic_thinking_display",
		labelCode: true,
		description: "com_endpoint_anthropic_thinking_display_desc",
		descriptionCode: true,
		type: "enum",
		default: require_data_service.anthropicSettings.thinkingDisplay.default,
		component: "slider",
		options: require_data_service.anthropicSettings.thinkingDisplay.options,
		enumMappings: {
			["auto"]: "com_ui_auto",
			["summarized"]: "com_ui_summarized",
			["omitted"]: "com_ui_omitted"
		},
		optionType: "model",
		columnSpan: 4
	}
};
const bedrock = {
	system: {
		key: "system",
		label: "com_endpoint_prompt_prefix",
		labelCode: true,
		type: "string",
		default: "",
		component: "textarea",
		placeholder: "com_endpoint_openai_prompt_prefix_placeholder",
		placeholderCode: true,
		optionType: "model"
	},
	region: {
		key: "region",
		type: "string",
		label: "com_ui_region",
		labelCode: true,
		component: "combobox",
		optionType: "conversation",
		selectPlaceholder: "com_ui_select_region",
		searchPlaceholder: "com_ui_select_search_region",
		searchPlaceholderCode: true,
		selectPlaceholderCode: true,
		columnSpan: 2
	},
	maxTokens: {
		key: "maxTokens",
		label: "com_endpoint_max_output_tokens",
		labelCode: true,
		type: "number",
		component: "input",
		description: "com_endpoint_anthropic_maxoutputtokens",
		descriptionCode: true,
		placeholder: "com_nav_theme_system",
		placeholderCode: true,
		optionType: "model",
		columnSpan: 2
	},
	temperature: createDefinition(baseDefinitions.temperature, {
		default: 1,
		range: {
			min: 0,
			max: 1,
			step: .01
		}
	}),
	topK: createDefinition(anthropic.topK, { range: {
		min: 0,
		max: 500,
		step: 1
	} }),
	topP: createDefinition(baseDefinitions.topP, {
		default: .999,
		range: {
			min: 0,
			max: 1,
			step: .01
		}
	}),
	promptCache: {
		key: "promptCache",
		label: "com_endpoint_prompt_cache",
		labelCode: true,
		type: "boolean",
		description: "com_endpoint_anthropic_prompt_cache",
		descriptionCode: true,
		default: true,
		component: "switch",
		optionType: "conversation",
		showDefault: false,
		columnSpan: 2
	},
	promptCacheTtl: {
		key: "promptCacheTtl",
		label: "com_endpoint_prompt_cache_ttl",
		labelCode: true,
		description: "com_endpoint_anthropic_prompt_cache_ttl",
		descriptionCode: true,
		type: "enum",
		default: void 0,
		options: ["5m", "1h"],
		component: "combobox",
		optionType: "conversation",
		showDefault: false,
		selectPlaceholder: "com_endpoint_prompt_cache_ttl_default",
		selectPlaceholderCode: true,
		columnSpan: 2
	},
	reasoning_effort: {
		key: "reasoning_effort",
		label: "com_endpoint_reasoning_effort",
		labelCode: true,
		description: "com_endpoint_bedrock_reasoning_effort",
		descriptionCode: true,
		type: "enum",
		default: "",
		component: "slider",
		options: [
			"",
			"low",
			"medium",
			"high"
		],
		enumMappings: {
			[""]: "com_ui_off",
			["low"]: "com_ui_low",
			["medium"]: "com_ui_medium",
			["high"]: "com_ui_high"
		},
		optionType: "model",
		columnSpan: 4
	}
};
const mistral = {
	temperature: createDefinition(baseDefinitions.temperature, {
		default: .7,
		range: {
			min: 0,
			max: 1,
			step: .01
		}
	}),
	topP: createDefinition(baseDefinitions.topP, { range: {
		min: 0,
		max: 1,
		step: .01
	} })
};
const cohere = {
	temperature: createDefinition(baseDefinitions.temperature, {
		default: .3,
		range: {
			min: 0,
			max: 1,
			step: .01
		}
	}),
	topP: createDefinition(baseDefinitions.topP, {
		default: .75,
		range: {
			min: .01,
			max: .99,
			step: .01
		}
	})
};
const meta = {
	temperature: createDefinition(baseDefinitions.temperature, {
		default: .5,
		range: {
			min: 0,
			max: 1,
			step: .01
		}
	}),
	topP: createDefinition(baseDefinitions.topP, {
		default: .9,
		range: {
			min: 0,
			max: 1,
			step: .01
		}
	})
};
const google = {
	temperature: createDefinition(baseDefinitions.temperature, {
		default: require_data_service.googleSettings.temperature.default,
		range: {
			min: require_data_service.googleSettings.temperature.min,
			max: require_data_service.googleSettings.temperature.max,
			step: require_data_service.googleSettings.temperature.step
		}
	}),
	topP: createDefinition(baseDefinitions.topP, {
		default: require_data_service.googleSettings.topP.default,
		range: {
			min: require_data_service.googleSettings.topP.min,
			max: require_data_service.googleSettings.topP.max,
			step: require_data_service.googleSettings.topP.step
		}
	}),
	topK: {
		key: "topK",
		label: "com_endpoint_top_k",
		labelCode: true,
		description: "com_endpoint_google_topk",
		descriptionCode: true,
		type: "number",
		default: require_data_service.googleSettings.topK.default,
		range: {
			min: require_data_service.googleSettings.topK.min,
			max: require_data_service.googleSettings.topK.max,
			step: require_data_service.googleSettings.topK.step
		},
		component: "slider",
		optionType: "model",
		columnSpan: 4
	},
	maxOutputTokens: {
		key: "maxOutputTokens",
		label: "com_endpoint_max_output_tokens",
		labelCode: true,
		type: "number",
		component: "input",
		description: "com_endpoint_google_maxoutputtokens",
		descriptionCode: true,
		placeholder: "com_nav_theme_system",
		placeholderCode: true,
		default: require_data_service.googleSettings.maxOutputTokens.default,
		range: {
			min: require_data_service.googleSettings.maxOutputTokens.min,
			max: require_data_service.googleSettings.maxOutputTokens.max,
			step: require_data_service.googleSettings.maxOutputTokens.step
		},
		optionType: "model",
		columnSpan: 2
	},
	thinking: {
		key: "thinking",
		label: "com_endpoint_thinking",
		labelCode: true,
		description: "com_endpoint_google_thinking",
		descriptionCode: true,
		type: "boolean",
		default: require_data_service.googleSettings.thinking.default,
		component: "switch",
		optionType: "conversation",
		showDefault: false,
		columnSpan: 2
	},
	thinkingBudget: {
		key: "thinkingBudget",
		label: "com_endpoint_thinking_budget",
		labelCode: true,
		description: "com_endpoint_google_thinking_budget",
		descriptionCode: true,
		placeholder: "com_ui_auto",
		placeholderCode: true,
		type: "number",
		component: "input",
		range: {
			min: require_data_service.googleSettings.thinkingBudget.min,
			max: require_data_service.googleSettings.thinkingBudget.max,
			step: require_data_service.googleSettings.thinkingBudget.step
		},
		optionType: "conversation",
		columnSpan: 2
	},
	thinkingLevel: {
		key: "thinkingLevel",
		label: "com_endpoint_thinking_level",
		labelCode: true,
		description: "com_endpoint_google_thinking_level",
		descriptionCode: true,
		type: "enum",
		default: "",
		component: "slider",
		options: [
			"",
			"minimal",
			"low",
			"medium",
			"high"
		],
		enumMappings: {
			[""]: "com_ui_auto",
			["minimal"]: "com_ui_minimal",
			["low"]: "com_ui_low",
			["medium"]: "com_ui_medium",
			["high"]: "com_ui_high"
		},
		optionType: "conversation",
		columnSpan: 4
	},
	web_search: {
		key: "web_search",
		label: "com_endpoint_use_search_grounding",
		labelCode: true,
		description: "com_endpoint_google_use_search_grounding",
		descriptionCode: true,
		type: "boolean",
		default: false,
		component: "switch",
		optionType: "model",
		showDefault: false,
		columnSpan: 2
	},
	url_context: {
		key: "url_context",
		label: "com_endpoint_use_url_context",
		labelCode: true,
		description: "com_endpoint_google_use_url_context",
		descriptionCode: true,
		type: "boolean",
		default: false,
		component: "switch",
		optionType: "model",
		showDefault: false,
		columnSpan: 2
	}
};
const googleConfig = [
	librechat.modelLabel,
	librechat.promptPrefix,
	librechat.maxContextTokens,
	google.maxOutputTokens,
	google.temperature,
	google.topP,
	google.topK,
	librechat.resendFiles,
	google.thinking,
	google.thinkingBudget,
	google.thinkingLevel,
	google.web_search,
	google.url_context,
	librechat.fileTokenLimit
];
const googleCol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	librechat.promptPrefix
];
const googleCol2 = [
	librechat.maxContextTokens,
	google.maxOutputTokens,
	google.temperature,
	google.topP,
	google.topK,
	librechat.resendFiles,
	google.thinking,
	google.thinkingBudget,
	google.thinkingLevel,
	google.web_search,
	google.url_context,
	librechat.fileTokenLimit
];
const openAI = [
	librechat.modelLabel,
	librechat.promptPrefix,
	librechat.maxContextTokens,
	openAIParams.max_tokens,
	openAIParams.temperature,
	openAIParams.top_p,
	openAIParams.frequency_penalty,
	openAIParams.presence_penalty,
	baseDefinitions.stop,
	librechat.resendFiles,
	baseDefinitions.imageDetail,
	openAIParams.web_search,
	openAIParams.reasoning_effort,
	openAIParams.useResponsesApi,
	openAIParams.reasoning_summary,
	openAIParams.verbosity,
	openAIParams.disableStreaming,
	librechat.fileTokenLimit
];
const openRouter = [
	...openAI,
	anthropic.promptCache,
	anthropic.promptCacheTtl
];
const openAICol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	librechat.promptPrefix
];
const openAICol2 = [
	librechat.maxContextTokens,
	openAIParams.max_tokens,
	openAIParams.temperature,
	openAIParams.top_p,
	openAIParams.frequency_penalty,
	openAIParams.presence_penalty,
	baseDefinitions.stop,
	librechat.resendFiles,
	baseDefinitions.imageDetail,
	openAIParams.reasoning_effort,
	openAIParams.reasoning_summary,
	openAIParams.verbosity,
	openAIParams.useResponsesApi,
	openAIParams.web_search,
	openAIParams.disableStreaming,
	librechat.fileTokenLimit
];
const anthropicConfig = [
	librechat.modelLabel,
	librechat.promptPrefix,
	librechat.maxContextTokens,
	anthropic.maxOutputTokens,
	anthropic.temperature,
	anthropic.topP,
	anthropic.topK,
	librechat.resendFiles,
	anthropic.promptCache,
	anthropic.promptCacheTtl,
	anthropic.thinking,
	anthropic.thinkingBudget,
	anthropic.effort,
	anthropic.thinkingDisplay,
	anthropic.web_search,
	librechat.fileTokenLimit
];
const anthropicCol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	librechat.promptPrefix
];
const anthropicCol2 = [
	librechat.maxContextTokens,
	anthropic.maxOutputTokens,
	anthropic.temperature,
	anthropic.topP,
	anthropic.topK,
	librechat.resendFiles,
	anthropic.promptCache,
	anthropic.promptCacheTtl,
	anthropic.thinking,
	anthropic.thinkingBudget,
	anthropic.effort,
	anthropic.thinkingDisplay,
	anthropic.web_search,
	librechat.fileTokenLimit
];
const bedrockAnthropic = [
	librechat.modelLabel,
	bedrock.system,
	librechat.maxContextTokens,
	bedrock.maxTokens,
	bedrock.temperature,
	bedrock.topP,
	bedrock.topK,
	baseDefinitions.stop,
	librechat.resendFiles,
	bedrock.region,
	bedrock.promptCache,
	bedrock.promptCacheTtl,
	anthropic.thinking,
	anthropic.thinkingBudget,
	anthropic.effort,
	anthropic.thinkingDisplay,
	librechat.fileTokenLimit
];
const bedrockMistral = [
	librechat.modelLabel,
	librechat.promptPrefix,
	librechat.maxContextTokens,
	bedrock.maxTokens,
	mistral.temperature,
	mistral.topP,
	librechat.resendFiles,
	bedrock.region,
	librechat.fileTokenLimit
];
const bedrockCohere = [
	librechat.modelLabel,
	librechat.promptPrefix,
	librechat.maxContextTokens,
	bedrock.maxTokens,
	cohere.temperature,
	cohere.topP,
	librechat.resendFiles,
	bedrock.region,
	librechat.fileTokenLimit
];
const bedrockGeneral = [
	librechat.modelLabel,
	librechat.promptPrefix,
	librechat.maxContextTokens,
	meta.temperature,
	meta.topP,
	librechat.resendFiles,
	bedrock.region,
	bedrock.promptCache,
	bedrock.promptCacheTtl,
	librechat.fileTokenLimit
];
const bedrockAnthropicCol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	bedrock.system,
	baseDefinitions.stop
];
const bedrockAnthropicCol2 = [
	librechat.maxContextTokens,
	bedrock.maxTokens,
	bedrock.temperature,
	bedrock.topP,
	bedrock.topK,
	librechat.resendFiles,
	bedrock.region,
	bedrock.promptCache,
	bedrock.promptCacheTtl,
	anthropic.thinking,
	anthropic.thinkingBudget,
	anthropic.effort,
	anthropic.thinkingDisplay,
	librechat.fileTokenLimit
];
const bedrockMistralCol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	librechat.promptPrefix
];
const bedrockMistralCol2 = [
	librechat.maxContextTokens,
	bedrock.maxTokens,
	mistral.temperature,
	mistral.topP,
	librechat.resendFiles,
	bedrock.region,
	librechat.fileTokenLimit
];
const bedrockCohereCol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	librechat.promptPrefix
];
const bedrockCohereCol2 = [
	librechat.maxContextTokens,
	bedrock.maxTokens,
	cohere.temperature,
	cohere.topP,
	librechat.resendFiles,
	bedrock.region,
	librechat.fileTokenLimit
];
const bedrockGeneralCol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	librechat.promptPrefix
];
const bedrockGeneralCol2 = [
	librechat.maxContextTokens,
	meta.temperature,
	meta.topP,
	librechat.resendFiles,
	bedrock.region,
	bedrock.promptCache,
	bedrock.promptCacheTtl,
	librechat.fileTokenLimit
];
const bedrockZAI = [
	librechat.modelLabel,
	librechat.promptPrefix,
	librechat.maxContextTokens,
	meta.temperature,
	meta.topP,
	librechat.resendFiles,
	bedrock.region,
	bedrock.reasoning_effort,
	librechat.fileTokenLimit
];
const bedrockZAICol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	librechat.promptPrefix
];
const bedrockZAICol2 = [
	librechat.maxContextTokens,
	meta.temperature,
	meta.topP,
	librechat.resendFiles,
	bedrock.region,
	bedrock.reasoning_effort,
	librechat.fileTokenLimit
];
const bedrockMoonshot = [
	librechat.modelLabel,
	bedrock.system,
	librechat.maxContextTokens,
	createDefinition(bedrock.maxTokens, { default: 16384 }),
	bedrock.temperature,
	bedrock.topP,
	baseDefinitions.stop,
	librechat.resendFiles,
	bedrock.region,
	bedrock.reasoning_effort,
	librechat.fileTokenLimit
];
const bedrockMoonshotCol1 = [
	baseDefinitions.model,
	librechat.modelLabel,
	bedrock.system,
	baseDefinitions.stop
];
const bedrockMoonshotCol2 = [
	librechat.maxContextTokens,
	createDefinition(bedrock.maxTokens, { default: 16384 }),
	bedrock.temperature,
	bedrock.topP,
	librechat.resendFiles,
	bedrock.region,
	bedrock.reasoning_effort,
	librechat.fileTokenLimit
];
const paramSettings = {
	["openAI"]: openAI,
	["azureOpenAI"]: openAI,
	["custom"]: openAI,
	["openrouter"]: openRouter,
	["anthropic"]: anthropicConfig,
	[`bedrock-anthropic`]: bedrockAnthropic,
	[`bedrock-mistral`]: bedrockMistral,
	[`bedrock-cohere`]: bedrockCohere,
	[`bedrock-meta`]: bedrockGeneral,
	[`bedrock-ai21`]: bedrockGeneral,
	[`bedrock-amazon`]: bedrockGeneral,
	[`bedrock-deepseek`]: bedrockGeneral,
	[`bedrock-moonshot`]: bedrockMoonshot,
	[`bedrock-moonshotai`]: bedrockMoonshot,
	[`bedrock-openai`]: bedrockGeneral,
	[`bedrock-zai`]: bedrockZAI,
	["google"]: googleConfig
};
const openAIColumns = {
	col1: openAICol1,
	col2: openAICol2
};
const bedrockGeneralColumns = {
	col1: bedrockGeneralCol1,
	col2: bedrockGeneralCol2
};
const presetSettings = {
	["openAI"]: openAIColumns,
	["azureOpenAI"]: openAIColumns,
	["custom"]: openAIColumns,
	["openrouter"]: {
		col1: openAICol1,
		col2: [
			...openAICol2,
			anthropic.promptCache,
			anthropic.promptCacheTtl
		]
	},
	["anthropic"]: {
		col1: anthropicCol1,
		col2: anthropicCol2
	},
	[`bedrock-anthropic`]: {
		col1: bedrockAnthropicCol1,
		col2: bedrockAnthropicCol2
	},
	[`bedrock-mistral`]: {
		col1: bedrockMistralCol1,
		col2: bedrockMistralCol2
	},
	[`bedrock-cohere`]: {
		col1: bedrockCohereCol1,
		col2: bedrockCohereCol2
	},
	[`bedrock-meta`]: bedrockGeneralColumns,
	[`bedrock-ai21`]: bedrockGeneralColumns,
	[`bedrock-amazon`]: bedrockGeneralColumns,
	[`bedrock-deepseek`]: bedrockGeneralColumns,
	[`bedrock-moonshot`]: {
		col1: bedrockMoonshotCol1,
		col2: bedrockMoonshotCol2
	},
	[`bedrock-moonshotai`]: {
		col1: bedrockMoonshotCol1,
		col2: bedrockMoonshotCol2
	},
	[`bedrock-openai`]: bedrockGeneralColumns,
	[`bedrock-zai`]: {
		col1: bedrockZAICol1,
		col2: bedrockZAICol2
	},
	["google"]: {
		col1: googleCol1,
		col2: googleCol2
	}
};
const agentParamSettings = Object.entries(presetSettings).reduce((acc, [key, value]) => {
	if (value) acc[key] = value.col2;
	return acc;
}, {});
/**
* Resolves model-aware defaults for a settings configuration before rendering.
* Google's `maxOutputTokens` default depends on the selected Gemini model so that
* current models (2.5 and 3+) surface their 64K output limit instead of the legacy 8K value.
*/
function applyModelAwareDefaults(settings, endpoint, model) {
	if (endpoint !== "google" || !model) return settings;
	return settings.map((setting) => setting.key === "maxOutputTokens" ? {
		...setting,
		default: require_data_service.googleSettings.maxOutputTokens.reset(model)
	} : setting);
}
//#endregion
//#region src/codeEnvRef.ts
/**
* Closed set of resource kinds for sandbox file caching. Defined as a
* `as const` tuple so the runtime list and the TypeScript union can't
* drift on future additions — adding a new kind to the tuple updates
* both at once.
*
* - `skill`: shared per skill identity. Cross-user-within-tenant
*   sharing. Code API sessionKey omits the user dimension.
*   `version` is required (the skill's monotonic counter scopes the
*   cache per revision so any edit invalidates the prior cache
*   entry naturally).
* - `agent`: shared per agent identity. Same sharing semantic as
*   skills (agents are addressable resources accessible to a
*   permission-defined audience).
* - `user`: user-private. Code API sessionKey is keyed by the
*   requesting user from auth context. Used for chat attachments
*   and code-output artifacts.
*/
const CODE_ENV_KINDS = [
	"skill",
	"agent",
	"user"
];
//#endregion
exports.AccessRoleIds = require_data_service.AccessRoleIds;
exports.ActionRequest = ActionRequest;
exports.AgentCapabilities = require_data_service.AgentCapabilities;
exports.AnnotationTypes = require_data_service.AnnotationTypes;
exports.AnthropicEffort = require_data_service.AnthropicEffort;
exports.ArtifactModes = ArtifactModes;
exports.AssistantStreamEvents = require_data_service.AssistantStreamEvents;
exports.AuthKeys = require_data_service.AuthKeys;
exports.AuthType = require_data_service.AuthType;
exports.AuthTypeEnum = require_data_service.AuthTypeEnum;
exports.AuthorizationTypeEnum = require_data_service.AuthorizationTypeEnum;
exports.BASE_ONLY_CONFIG_SECTIONS = require_data_service.BASE_ONLY_CONFIG_SECTIONS;
exports.BEDROCK_FINE_GRAINED_TOOL_STREAMING_BETA = BEDROCK_FINE_GRAINED_TOOL_STREAMING_BETA;
exports.BEDROCK_OUTPUT_128K_BETA = BEDROCK_OUTPUT_128K_BETA;
exports.BedrockProviders = require_data_service.BedrockProviders;
exports.BedrockReasoningConfig = require_data_service.BedrockReasoningConfig;
exports.CODE_ENV_KINDS = CODE_ENV_KINDS;
exports.CacheKeys = require_data_service.CacheKeys;
exports.Capabilities = require_data_service.Capabilities;
exports.CohereConstants = require_data_service.CohereConstants;
exports.ComponentTypes = require_data_service.ComponentTypes;
exports.Constants = require_data_service.Constants;
exports.ContentTypes = ContentTypes;
exports.DATE_RANGE = DATE_RANGE;
exports.DEFAULT_MEMORY_MAX_INPUT_TOKENS = require_data_service.DEFAULT_MEMORY_MAX_INPUT_TOKENS;
exports.DynamicQueryKeys = require_data_service.DynamicQueryKeys;
exports.EImageOutputType = require_data_service.EImageOutputType;
exports.EModelEndpoint = require_data_service.EModelEndpoint;
exports.EToolResources = require_data_service.EToolResources;
exports.EndpointURLs = require_data_service.EndpointURLs;
exports.ErrorTypes = require_data_service.ErrorTypes;
exports.FEEDBACK_RATINGS = require_data_service.FEEDBACK_RATINGS;
exports.FEEDBACK_REASON_KEYS = require_data_service.FEEDBACK_REASON_KEYS;
exports.FEEDBACK_TAGS = require_data_service.FEEDBACK_TAGS;
exports.FetchTokenConfig = require_data_service.FetchTokenConfig;
exports.FileContext = require_data_service.FileContext;
exports.FilePurpose = require_data_service.FilePurpose;
exports.FileSources = require_data_service.FileSources;
exports.ForkOptions = require_data_service.ForkOptions;
exports.FunctionSignature = FunctionSignature;
exports.INTERFACE_PERMISSION_FIELDS = INTERFACE_PERMISSION_FIELDS;
exports.ImageDetail = require_data_service.ImageDetail;
exports.ImageDetailCost = require_data_service.ImageDetailCost;
exports.ImageVisionTool = require_data_service.ImageVisionTool;
exports.InfiniteCollections = require_data_service.InfiniteCollections;
exports.InvocationMode = InvocationMode;
exports.KnownEndpoints = require_data_service.KnownEndpoints;
exports.LocalStorageKeys = require_data_service.LocalStorageKeys;
exports.MAX_SUBAGENTS = require_data_service.MAX_SUBAGENTS;
exports.MAX_SUBAGENT_DEPTH = require_data_service.MAX_SUBAGENT_DEPTH;
exports.MAX_SUBAGENT_GRAPH_NODES = require_data_service.MAX_SUBAGENT_GRAPH_NODES;
exports.MAX_SUBAGENT_RUN_CONFIGS = require_data_service.MAX_SUBAGENT_RUN_CONFIGS;
exports.MCPOptionsSchema = require_data_service.MCPOptionsSchema;
exports.MCPServerUserInputSchema = require_data_service.MCPServerUserInputSchema;
exports.MCPServersSchema = require_data_service.MCPServersSchema;
exports.MCP_USER_INPUT_FIELDS = require_data_service.MCP_USER_INPUT_FIELDS;
exports.MYTHOS_CLASS_FAMILIES = require_data_service.MYTHOS_CLASS_FAMILIES;
exports.MessageContentTypes = require_data_service.MessageContentTypes;
exports.MutationKeys = require_data_service.MutationKeys;
exports.OCRStrategy = require_data_service.OCRStrategy;
exports.OptionTypes = require_data_service.OptionTypes;
exports.PERMISSION_SUB_KEYS = PERMISSION_SUB_KEYS;
exports.PERMISSION_TYPE_INTERFACE_FIELDS = PERMISSION_TYPE_INTERFACE_FIELDS;
exports.PermissionBits = require_data_service.PermissionBits;
exports.PermissionTypes = PermissionTypes;
exports.Permissions = Permissions;
exports.PrincipalModel = require_data_service.PrincipalModel;
exports.PrincipalType = require_data_service.PrincipalType;
exports.Providers = require_data_service.Providers;
exports.QueryKeys = require_data_service.QueryKeys;
exports.REFILL_INTERVAL_UNITS = require_data_service.REFILL_INTERVAL_UNITS;
exports.RateLimitPrefix = require_data_service.RateLimitPrefix;
exports.ReasoningEffort = require_data_service.ReasoningEffort;
exports.ReasoningParameterFormat = require_data_service.ReasoningParameterFormat;
exports.ReasoningResponseKey = require_data_service.ReasoningResponseKey;
exports.ReasoningSummary = require_data_service.ReasoningSummary;
exports.RerankerTypes = require_data_service.RerankerTypes;
exports.ResourceType = require_data_service.ResourceType;
exports.RetentionMode = require_data_service.RetentionMode;
exports.RunStatus = require_data_service.RunStatus;
exports.SEPARATORS = SEPARATORS;
exports.SKILL_BODY_MAX_LENGTH = SKILL_BODY_MAX_LENGTH;
exports.SKILL_DESCRIPTION_MAX_LENGTH = SKILL_DESCRIPTION_MAX_LENGTH;
exports.SKILL_DESCRIPTION_SHORT_THRESHOLD = SKILL_DESCRIPTION_SHORT_THRESHOLD;
exports.SKILL_DISPLAY_TITLE_MAX_LENGTH = SKILL_DISPLAY_TITLE_MAX_LENGTH;
exports.SKILL_NAME_MAX_LENGTH = SKILL_NAME_MAX_LENGTH;
exports.SKILL_NAME_PATTERN = SKILL_NAME_PATTERN;
exports.SKILL_SYNC_DEFAULT_DISCOVERY_DEPTH = require_data_service.SKILL_SYNC_DEFAULT_DISCOVERY_DEPTH;
exports.SKILL_SYNC_MAX_DISCOVERY_DEPTH = require_data_service.SKILL_SYNC_MAX_DISCOVERY_DEPTH;
exports.SKILL_SYNC_MAX_INTERVAL_MINUTES = require_data_service.SKILL_SYNC_MAX_INTERVAL_MINUTES;
exports.SKILL_SYNC_MIN_INTERVAL_MINUTES = require_data_service.SKILL_SYNC_MIN_INTERVAL_MINUTES;
exports.SSEOptionsSchema = require_data_service.SSEOptionsSchema;
exports.STTProviders = require_data_service.STTProviders;
exports.SafeSearchTypes = require_data_service.SafeSearchTypes;
exports.ScraperProviders = require_data_service.ScraperProviders;
exports.SearchCategories = require_data_service.SearchCategories;
exports.SearchProviders = require_data_service.SearchProviders;
exports.SettingTypes = require_data_service.SettingTypes;
exports.SettingsTabValues = require_data_service.SettingsTabValues;
exports.SettingsViews = require_data_service.SettingsViews;
exports.StdioOptionsSchema = require_data_service.StdioOptionsSchema;
exports.StepEvents = StepEvents;
exports.StepStatus = require_data_service.StepStatus;
exports.StepTypes = StepTypes;
exports.StreamableHTTPOptionsSchema = require_data_service.StreamableHTTPOptionsSchema;
exports.SystemCategories = require_data_service.SystemCategories;
exports.SystemRoles = SystemRoles;
exports.TTSProviders = require_data_service.TTSProviders;
exports.ThinkingDisplay = require_data_service.ThinkingDisplay;
exports.ThinkingLevel = require_data_service.ThinkingLevel;
exports.Time = require_data_service.Time;
exports.TokenExchangeMethodEnum = require_data_service.TokenExchangeMethodEnum;
exports.ToolCallTypes = ToolCallTypes;
exports.Tools = require_data_service.Tools;
exports.UsageEvents = UsageEvents;
exports.Verbosity = require_data_service.Verbosity;
exports.ViolationTypes = require_data_service.ViolationTypes;
exports.VisionModes = require_data_service.VisionModes;
exports.WebSocketOptionsSchema = require_data_service.WebSocketOptionsSchema;
exports.accessRoleSchema = require_data_service.accessRoleSchema;
exports.accessRoleToPermBits = require_data_service.accessRoleToPermBits;
exports.accordian = accordian;
exports.actionDelimiter = require_data_service.actionDelimiter;
exports.actionDomainSeparator = require_data_service.actionDomainSeparator;
exports.agentParamSettings = agentParamSettings;
exports.agentPermissionsSchema = agentPermissionsSchema;
exports.agentsBaseSchema = require_data_service.agentsBaseSchema;
exports.agentsEndpointSchema = require_data_service.agentsEndpointSchema;
exports.agentsSchema = require_data_service.agentsSchema;
exports.agentsSettings = require_data_service.agentsSettings;
exports.alert = alert;
exports.alertDialog = alertDialog;
exports.allowedAddressesSchema = require_data_service.allowedAddressesSchema;
exports.alternateName = require_data_service.alternateName;
exports.anthropicBaseSchema = require_data_service.anthropicBaseSchema;
exports.anthropicEndpointSchema = require_data_service.anthropicEndpointSchema;
exports.anthropicSchema = require_data_service.anthropicSchema;
exports.anthropicSettings = require_data_service.anthropicSettings;
exports.apiBaseUrl = require_data_service.apiBaseUrl;
exports.appendAgentIdSuffix = appendAgentIdSuffix;
exports.applicationMimeTypes = require_data_service.applicationMimeTypes;
exports.applyModelAwareDefaults = applyModelAwareDefaults;
exports.assistantEndpointSchema = require_data_service.assistantEndpointSchema;
exports.assistantSchema = require_data_service.assistantSchema;
exports.audioMimeTypes = require_data_service.audioMimeTypes;
exports.authTypeSchema = require_data_service.authTypeSchema;
exports.avatar = avatar;
exports.azureBaseSchema = require_data_service.azureBaseSchema;
exports.azureEndpointSchema = require_data_service.azureEndpointSchema;
exports.azureGroupConfigsSchema = require_data_service.azureGroupConfigsSchema;
exports.azureGroupSchema = require_data_service.azureGroupSchema;
exports.badge = badge;
exports.balanceSchema = require_data_service.balanceSchema;
exports.baseEndpointSchema = require_data_service.baseEndpointSchema;
exports.bedrockDocumentExtensions = require_data_service.bedrockDocumentExtensions;
exports.bedrockDocumentFormats = require_data_service.bedrockDocumentFormats;
exports.bedrockEndpointSchema = require_data_service.bedrockEndpointSchema;
exports.bedrockGuardrailConfigSchema = require_data_service.bedrockGuardrailConfigSchema;
exports.bedrockInputParser = bedrockInputParser;
exports.bedrockInputSchema = bedrockInputSchema;
exports.bedrockModels = require_data_service.bedrockModels;
exports.bedrockOutputParser = bedrockOutputParser;
exports.bookmarkPermissionsSchema = bookmarkPermissionsSchema;
exports.breadcrumb = breadcrumb;
exports.buildLoginRedirectUrl = require_data_service.buildLoginRedirectUrl;
exports.buildTree = buildTree;
exports.button = button;
exports.cacheSubsetProviders = require_data_service.cacheSubsetProviders;
exports.calendar = calendar;
exports.card = card;
exports.carousel = carousel;
exports.checkOpenAIStorage = require_data_service.checkOpenAIStorage;
exports.checkbox = checkbox;
exports.cloudfrontConfigSchema = require_data_service.cloudfrontConfigSchema;
exports.codeInterpreterMimeTypes = require_data_service.codeInterpreterMimeTypes;
exports.codeInterpreterMimeTypesList = require_data_service.codeInterpreterMimeTypesList;
exports.codeTypeMapping = require_data_service.codeTypeMapping;
exports.coerceNumber = require_data_service.coerceNumber;
exports.collapsible = collapsible;
exports.compactAgentsBaseSchema = require_data_service.compactAgentsBaseSchema;
exports.compactAgentsSchema = require_data_service.compactAgentsSchema;
exports.compactAssistantSchema = require_data_service.compactAssistantSchema;
exports.compactGoogleSchema = require_data_service.compactGoogleSchema;
exports.configSchema = require_data_service.configSchema;
exports.contextPruningSchema = require_data_service.contextPruningSchema;
exports.convertStringsToRegex = require_data_service.convertStringsToRegex;
exports.createPayload = createPayload;
exports.createURL = createURL;
Object.defineProperty(exports, "dataService", {
	enumerable: true,
	get: function() {
		return require_data_service.data_service_exports;
	}
});
exports.defaultAgentCapabilities = require_data_service.defaultAgentCapabilities;
exports.defaultAgentFormValues = require_data_service.defaultAgentFormValues;
exports.defaultAssistantFormValues = require_data_service.defaultAssistantFormValues;
exports.defaultAssistantsVersion = require_data_service.defaultAssistantsVersion;
exports.defaultEndpoints = require_data_service.defaultEndpoints;
exports.defaultModels = require_data_service.defaultModels;
exports.defaultOCRMimeTypes = require_data_service.defaultOCRMimeTypes;
exports.defaultOrderQuery = require_data_service.defaultOrderQuery;
exports.defaultRetrievalModels = require_data_service.defaultRetrievalModels;
exports.defaultSTTMimeTypes = require_data_service.defaultSTTMimeTypes;
exports.defaultSocialLogins = require_data_service.defaultSocialLogins;
exports.defaultTextMimeTypes = require_data_service.defaultTextMimeTypes;
exports.dialog = dialog;
exports.documentParserMimeTypes = require_data_service.documentParserMimeTypes;
exports.documentSupportedProviders = require_data_service.documentSupportedProviders;
exports.drawer = drawer;
exports.dropdownMenu = dropdownMenu;
exports.eAnthropicEffortSchema = require_data_service.eAnthropicEffortSchema;
exports.eImageDetailSchema = require_data_service.eImageDetailSchema;
exports.eModelEndpointSchema = require_data_service.eModelEndpointSchema;
exports.eReasoningEffortSchema = require_data_service.eReasoningEffortSchema;
exports.eReasoningParameterFormatSchema = require_data_service.eReasoningParameterFormatSchema;
exports.eReasoningResponseKeySchema = require_data_service.eReasoningResponseKeySchema;
exports.eReasoningSummarySchema = require_data_service.eReasoningSummarySchema;
exports.eThinkingDisplaySchema = require_data_service.eThinkingDisplaySchema;
exports.eThinkingLevelSchema = require_data_service.eThinkingLevelSchema;
exports.eVerbositySchema = require_data_service.eVerbositySchema;
exports.effectivePermissionsResponseSchema = require_data_service.effectivePermissionsResponseSchema;
exports.encodeEphemeralAgentId = encodeEphemeralAgentId;
exports.endpointFileConfigSchema = require_data_service.endpointFileConfigSchema;
exports.endpointSchema = require_data_service.endpointSchema;
exports.endpointSettings = require_data_service.endpointSettings;
exports.envVarRegex = require_data_service.envVarRegex;
exports.errorsToString = errorsToString;
exports.essentialShadcnComponents = essentialShadcnComponents;
exports.excelFileTypes = require_data_service.excelFileTypes;
exports.excelMimeTypes = require_data_service.excelMimeTypes;
exports.excludedKeys = require_data_service.excludedKeys;
exports.extendedModelEndpointSchema = require_data_service.extendedModelEndpointSchema;
exports.extractDomainFromUrl = extractDomainFromUrl;
exports.extractEnvVariable = require_data_service.extractEnvVariable;
exports.extractVariableName = require_data_service.extractVariableName;
exports.feedbackRatingSchema = require_data_service.feedbackRatingSchema;
exports.feedbackSchema = require_data_service.feedbackSchema;
exports.feedbackTagKeySchema = require_data_service.feedbackTagKeySchema;
exports.fileCitationsPermissionsSchema = fileCitationsPermissionsSchema;
exports.fileConfig = require_data_service.fileConfig;
exports.fileConfigSchema = require_data_service.fileConfigSchema;
exports.fileSearchPermissionsSchema = fileSearchPermissionsSchema;
exports.fileSourceSchema = require_data_service.fileSourceSchema;
exports.fileStorageSchema = require_data_service.fileStorageSchema;
exports.fileStrategiesSchema = require_data_service.fileStrategiesSchema;
exports.findLastSeparatorIndex = findLastSeparatorIndex;
exports.fullMimeTypesList = require_data_service.fullMimeTypesList;
exports.generateDynamicSchema = require_data_service.generateDynamicSchema;
exports.generateGoogleSchema = require_data_service.generateGoogleSchema;
exports.generateOpenAISchema = require_data_service.generateOpenAISchema;
exports.getConfigDefaults = require_data_service.getConfigDefaults;
exports.getDefaultParamsEndpoint = require_data_service.getDefaultParamsEndpoint;
exports.getEnabledEndpoints = getEnabledEndpoints;
exports.getEndpointField = require_data_service.getEndpointField;
exports.getEndpointFileConfig = require_data_service.getEndpointFileConfig;
exports.getFirstDefinedValue = getFirstDefinedValue;
exports.getModelKey = require_data_service.getModelKey;
exports.getNonEmptyValue = getNonEmptyValue;
exports.getRefillEligibilityDate = require_data_service.getRefillEligibilityDate;
exports.getResourcePermissionsResponseSchema = require_data_service.getResourcePermissionsResponseSchema;
exports.getResponseSender = getResponseSender;
exports.getSchemaDefaults = require_data_service.getSchemaDefaults;
exports.getSettingsKeys = require_data_service.getSettingsKeys;
exports.getTagByKey = require_data_service.getTagByKey;
exports.getTagsForRating = require_data_service.getTagsForRating;
exports.getTokenHeader = require_data_service.getTokenHeader;
exports.googleBaseSchema = require_data_service.googleBaseSchema;
exports.googleGenConfigSchema = require_data_service.googleGenConfigSchema;
exports.googleSchema = require_data_service.googleSchema;
exports.googleSettings = require_data_service.googleSettings;
exports.hasPermissions = require_data_service.hasPermissions;
exports.hostImageIdSuffix = require_data_service.hostImageIdSuffix;
exports.hostImageNamePrefix = require_data_service.hostImageNamePrefix;
exports.hoverCard = hoverCard;
exports.imageDetailNumeric = require_data_service.imageDetailNumeric;
exports.imageDetailValue = require_data_service.imageDetailValue;
exports.imageExtRegex = require_data_service.imageExtRegex;
exports.imageGenTools = require_data_service.imageGenTools;
exports.imageMimeTypes = require_data_service.imageMimeTypes;
exports.imageTypeMapping = require_data_service.imageTypeMapping;
exports.inferMimeType = require_data_service.inferMimeType;
exports.initialModelsConfig = require_data_service.initialModelsConfig;
exports.input = input;
exports.inputTokensIncludesCache = require_data_service.inputTokensIncludesCache;
exports.interfaceSchema = require_data_service.interfaceSchema;
exports.isActionTool = require_data_service.isActionTool;
exports.isAgentsEndpoint = require_data_service.isAgentsEndpoint;
exports.isAssistantsEndpoint = require_data_service.isAssistantsEndpoint;
exports.isBedrockDocumentType = require_data_service.isBedrockDocumentType;
exports.isDocumentSupportedProvider = require_data_service.isDocumentSupportedProvider;
exports.isEphemeralAgentId = isEphemeralAgentId;
exports.isImageVisionTool = require_data_service.isImageVisionTool;
exports.isMythosClassModel = require_data_service.isMythosClassModel;
exports.isOpenAILikeProvider = require_data_service.isOpenAILikeProvider;
exports.isParamEndpoint = require_data_service.isParamEndpoint;
exports.isPermissiveMimeConfig = require_data_service.isPermissiveMimeConfig;
exports.isRemoteOidcUrlAllowed = require_data_service.isRemoteOidcUrlAllowed;
exports.isSensitiveEnvVar = require_data_service.isSensitiveEnvVar;
exports.isSystemRoleName = isSystemRoleName;
exports.isUUID = require_data_service.isUUID;
exports.label = label;
exports.librechat = librechat;
exports.loginPage = require_data_service.loginPage;
exports.mapGroupToAzureConfig = mapGroupToAzureConfig;
exports.mapModelToAzureConfig = mapModelToAzureConfig;
exports.marketplacePermissionsSchema = marketplacePermissionsSchema;
exports.mbToBytes = require_data_service.mbToBytes;
exports.mcpServersPermissionsSchema = mcpServersPermissionsSchema;
exports.megabyte = require_data_service.megabyte;
exports.memoryPermissionsSchema = memoryPermissionsSchema;
exports.memorySchema = require_data_service.memorySchema;
exports.menuBar = menuBar;
exports.mergeFileConfig = require_data_service.mergeFileConfig;
exports.messageFilterPiiSchema = require_data_service.messageFilterPiiSchema;
exports.messageFilterSchema = require_data_service.messageFilterSchema;
exports.mimeTypeAliases = require_data_service.mimeTypeAliases;
exports.modelConfigSchema = require_data_service.modelConfigSchema;
exports.modelSpecSubagentsSchema = require_data_service.modelSpecSubagentsSchema;
exports.modularEndpoints = require_data_service.modularEndpoints;
exports.multiConvoPermissionsSchema = multiConvoPermissionsSchema;
exports.navigationMenu = navigationMenu;
exports.normalizeEndpointName = require_data_service.normalizeEndpointName;
exports.ocrSchema = require_data_service.ocrSchema;
exports.omitsSamplingParameters = omitsSamplingParameters;
exports.omitsThinkingByDefault = omitsThinkingByDefault;
exports.openAIBaseSchema = require_data_service.openAIBaseSchema;
exports.openAISchema = require_data_service.openAISchema;
exports.openAISettings = require_data_service.openAISettings;
exports.openRouterSchema = require_data_service.openRouterSchema;
exports.openapiToFunction = openapiToFunction;
exports.orderEndpointsConfig = orderEndpointsConfig;
exports.pagination = pagination;
exports.paramDefinitionSchema = require_data_service.paramDefinitionSchema;
exports.paramEndpoints = require_data_service.paramEndpoints;
exports.paramSettings = paramSettings;
exports.parseCompactConvo = parseCompactConvo;
exports.parseConvo = parseConvo;
exports.parseEphemeralAgentId = parseEphemeralAgentId;
exports.parseTextParts = parseTextParts;
exports.peoplePickerPermissionsSchema = peoplePickerPermissionsSchema;
exports.permBitsToAccessLevel = require_data_service.permBitsToAccessLevel;
exports.permissionEntrySchema = require_data_service.permissionEntrySchema;
exports.permissionsSchema = permissionsSchema;
exports.popover = popover;
exports.presetSettings = presetSettings;
exports.principalSchema = require_data_service.principalSchema;
exports.progress = progress;
exports.promptPermissionsSchema = promptPermissionsSchema;
exports.promptTokensFromUsage = promptTokensFromUsage;
exports.providerEndpointMap = require_data_service.providerEndpointMap;
exports.radioGroup = radioGroup;
exports.rateLimitSchema = require_data_service.rateLimitSchema;
exports.reconcileContextUsage = reconcileContextUsage;
exports.registerPage = require_data_service.registerPage;
exports.remoteAgentsPermissionsSchema = remoteAgentsPermissionsSchema;
exports.removeNullishValues = require_data_service.removeNullishValues;
exports.replaceSpecialVars = replaceSpecialVars;
exports.request = require_data_service.request_default;
exports.resolveEndpointType = require_data_service.resolveEndpointType;
exports.resolveRef = resolveRef;
exports.resolveThinkingDisplay = resolveThinkingDisplay;
exports.resourcePermissionsResponseSchema = require_data_service.resourcePermissionsResponseSchema;
exports.retrievalMimeTypes = require_data_service.retrievalMimeTypes;
exports.retrievalMimeTypesList = require_data_service.retrievalMimeTypesList;
exports.roleDefaults = roleDefaults;
exports.roleSchema = roleSchema;
exports.runCodePermissionsSchema = runCodePermissionsSchema;
exports.select = select;
exports.separator = separator;
exports.setAcceptLanguageHeader = require_data_service.setAcceptLanguageHeader;
exports.setTokenHeader = require_data_service.setTokenHeader;
exports.sha1 = sha1;
exports.shadcnComponents = shadcnComponents;
exports.sharedFileDownload = require_data_service.sharedFileDownload;
exports.sharedLinksPermissionsSchema = sharedLinksPermissionsSchema;
exports.skeleton = skeleton;
exports.skillPermissionsSchema = skillPermissionsSchema;
exports.skillSyncConfigSchema = require_data_service.skillSyncConfigSchema;
exports.skillSyncGitHubSourceSchema = require_data_service.skillSyncGitHubSourceSchema;
exports.slider = slider;
exports.specialVariables = require_data_service.specialVariables;
exports.specsConfigSchema = require_data_service.specsConfigSchema;
exports.stripAgentIdSuffix = stripAgentIdSuffix;
exports.summarizationConfigSchema = require_data_service.summarizationConfigSchema;
exports.summarizationTriggerSchema = require_data_service.summarizationTriggerSchema;
exports.supportedMimeTypes = require_data_service.supportedMimeTypes;
exports.supportsAdaptiveThinking = supportsAdaptiveThinking;
exports.supportsBalanceCheck = require_data_service.supportsBalanceCheck;
exports.supportsContext1m = supportsContext1m;
exports.supportsFiles = require_data_service.supportsFiles;
exports.switchComponent = switchComponent;
exports.tBannerSchema = require_data_service.tBannerSchema;
exports.tConversationSchema = require_data_service.tConversationSchema;
exports.tConversationTagSchema = require_data_service.tConversationTagSchema;
exports.tConvoUpdateSchema = require_data_service.tConvoUpdateSchema;
exports.tExampleSchema = require_data_service.tExampleSchema;
exports.tMessageSchema = require_data_service.tMessageSchema;
exports.tModelSpecPresetSchema = require_data_service.tModelSpecPresetSchema;
exports.tModelSpecSchema = require_data_service.tModelSpecSchema;
exports.tPluginAuthConfigSchema = require_data_service.tPluginAuthConfigSchema;
exports.tPluginSchema = require_data_service.tPluginSchema;
exports.tPresetSchema = require_data_service.tPresetSchema;
exports.tQueryParamsSchema = require_data_service.tQueryParamsSchema;
exports.tSharedLinkSchema = require_data_service.tSharedLinkSchema;
exports.table = table;
exports.tabs = tabs;
exports.temporaryChatPermissionsSchema = temporaryChatPermissionsSchema;
exports.textMimeTypes = require_data_service.textMimeTypes;
exports.textarea = textarea;
exports.toMinimalFeedback = require_data_service.toMinimalFeedback;
exports.toast = toast;
exports.toaster = toaster;
exports.toggle = toggle;
exports.toggleGroup = toggleGroup;
exports.tooltip = tooltip;
exports.transactionsSchema = require_data_service.transactionsSchema;
exports.turnstileOptionsSchema = require_data_service.turnstileOptionsSchema;
exports.turnstileSchema = require_data_service.turnstileSchema;
exports.updateResourcePermissionsRequestSchema = require_data_service.updateResourcePermissionsRequestSchema;
exports.updateResourcePermissionsResponseSchema = require_data_service.updateResourcePermissionsResponseSchema;
exports.useToast = useToast;
exports.utils = utils;
exports.validateActionDomain = validateActionDomain;
exports.validateAndParseOpenAPISpec = validateAndParseOpenAPISpec;
exports.validateAzureGroups = validateAzureGroups;
exports.validateSettingDefinitions = require_data_service.validateSettingDefinitions;
exports.validateVisionModel = require_data_service.validateVisionModel;
exports.vertexAISchema = require_data_service.vertexAISchema;
exports.vertexModelConfigSchema = require_data_service.vertexModelConfigSchema;
exports.videoMimeTypes = require_data_service.videoMimeTypes;
exports.visionModels = require_data_service.visionModels;
exports.webSearchPermissionsSchema = webSearchPermissionsSchema;
exports.webSearchSchema = require_data_service.webSearchSchema;

//# sourceMappingURL=index.js.map