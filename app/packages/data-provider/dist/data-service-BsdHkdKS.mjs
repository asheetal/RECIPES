import { ZodArray, ZodError, ZodIssueCode, z } from "zod";
import axios from "axios";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/utils.ts
const envVarRegex = /^\${(.+)}$/;
/**
* Infrastructure env vars that must never be resolved via placeholder expansion.
* These are internal secrets whose exposure would compromise the system —
* they have no legitimate reason to appear in outbound headers, MCP env/args, or OAuth config.
*
* Intentionally excludes API keys (operators reference them in config) and
* OAuth/session secrets (referenced in MCP OAuth config via processMCPEnv).
*/
const SENSITIVE_ENV_VARS = new Set([
	"JWT_SECRET",
	"JWT_REFRESH_SECRET",
	"CREDS_KEY",
	"CREDS_IV",
	"MEILI_MASTER_KEY",
	"MONGO_URI",
	"REDIS_URI",
	"REDIS_PASSWORD"
]);
/** Returns true when `varName` refers to an infrastructure secret that must not leak. */
function isSensitiveEnvVar(varName) {
	return SENSITIVE_ENV_VARS.has(varName);
}
/** Extracts the environment variable name from a template literal string */
function extractVariableName(value) {
	if (!value) return null;
	const match = value.trim().match(envVarRegex);
	return match ? match[1] : null;
}
/** Extracts the value of an environment variable from a string. */
function extractEnvVariable(value) {
	if (!value) return value;
	const trimmed = value.trim();
	const singleMatch = trimmed.match(envVarRegex);
	if (singleMatch) {
		const varName = singleMatch[1];
		if (isSensitiveEnvVar(varName)) return trimmed;
		return process.env[varName] || trimmed;
	}
	const regex = /\${([^}]+)}/g;
	let result = trimmed;
	const matches = [];
	let match;
	while ((match = regex.exec(trimmed)) !== null) matches.push({
		fullMatch: match[0],
		varName: match[1],
		index: match.index
	});
	for (let i = matches.length - 1; i >= 0; i--) {
		const { fullMatch, varName, index } = matches[i];
		if (isSensitiveEnvVar(varName)) continue;
		const envValue = process.env[varName] || fullMatch;
		result = result.substring(0, index) + envValue + result.substring(index + fullMatch.length);
	}
	return result;
}
/**
* Normalize the endpoint name to system-expected value.
* @param name
*/
function normalizeEndpointName(name = "") {
	return name.toLowerCase() === "ollama" ? "ollama" : name;
}
//#endregion
//#region src/feedback.ts
const FEEDBACK_RATINGS = ["thumbsUp", "thumbsDown"];
const FEEDBACK_REASON_KEYS = [
	"not_matched",
	"inaccurate",
	"bad_style",
	"missing_image",
	"unjustified_refusal",
	"not_helpful",
	"other",
	"accurate_reliable",
	"creative_solution",
	"clear_well_written",
	"attention_to_detail"
];
const FEEDBACK_TAGS = [
	{
		key: "not_matched",
		label: "com_ui_feedback_tag_not_matched",
		direction: "thumbsDown",
		icon: "AlertCircle"
	},
	{
		key: "inaccurate",
		label: "com_ui_feedback_tag_inaccurate",
		direction: "thumbsDown",
		icon: "AlertCircle"
	},
	{
		key: "bad_style",
		label: "com_ui_feedback_tag_bad_style",
		direction: "thumbsDown",
		icon: "PenTool"
	},
	{
		key: "missing_image",
		label: "com_ui_feedback_tag_missing_image",
		direction: "thumbsDown",
		icon: "ImageOff"
	},
	{
		key: "unjustified_refusal",
		label: "com_ui_feedback_tag_unjustified_refusal",
		direction: "thumbsDown",
		icon: "Ban"
	},
	{
		key: "not_helpful",
		label: "com_ui_feedback_tag_not_helpful",
		direction: "thumbsDown",
		icon: "ThumbsDown"
	},
	{
		key: "other",
		label: "com_ui_feedback_tag_other",
		direction: "thumbsDown",
		icon: "HelpCircle"
	},
	{
		key: "accurate_reliable",
		label: "com_ui_feedback_tag_accurate_reliable",
		direction: "thumbsUp",
		icon: "CheckCircle"
	},
	{
		key: "creative_solution",
		label: "com_ui_feedback_tag_creative_solution",
		direction: "thumbsUp",
		icon: "Lightbulb"
	},
	{
		key: "clear_well_written",
		label: "com_ui_feedback_tag_clear_well_written",
		direction: "thumbsUp",
		icon: "PenTool"
	},
	{
		key: "attention_to_detail",
		label: "com_ui_feedback_tag_attention_to_detail",
		direction: "thumbsUp",
		icon: "Search"
	}
];
function getTagsForRating(rating) {
	return FEEDBACK_TAGS.filter((tag) => tag.direction === rating);
}
const feedbackTagKeySchema = z.enum(FEEDBACK_REASON_KEYS);
const feedbackRatingSchema = z.enum(FEEDBACK_RATINGS);
const feedbackSchema = z.object({
	rating: feedbackRatingSchema,
	tag: feedbackTagKeySchema,
	text: z.string().max(1024).optional()
});
function toMinimalFeedback(feedback) {
	if (!feedback?.rating || !feedback?.tag || !feedback.tag.key) return;
	return {
		rating: feedback.rating,
		tag: feedback.tag.key,
		text: feedback.text
	};
}
function getTagByKey(key) {
	if (!key) return;
	return FEEDBACK_TAGS.find((tag) => tag.key === key);
}
//#endregion
//#region src/types/assistants.ts
let Tools = /* @__PURE__ */ function(Tools) {
	Tools["execute_code"] = "execute_code";
	Tools["code_interpreter"] = "code_interpreter";
	Tools["file_search"] = "file_search";
	Tools["web_search"] = "web_search";
	Tools["retrieval"] = "retrieval";
	Tools["function"] = "function";
	Tools["memory"] = "memory";
	Tools["ui_resources"] = "ui_resources";
	Tools["skill"] = "skill";
	Tools["read_file"] = "read_file";
	Tools["bash_tool"] = "bash_tool";
	return Tools;
}({});
let EToolResources = /* @__PURE__ */ function(EToolResources) {
	EToolResources["code_interpreter"] = "code_interpreter";
	EToolResources["execute_code"] = "execute_code";
	EToolResources["file_search"] = "file_search";
	EToolResources["image_edit"] = "image_edit";
	EToolResources["context"] = "context";
	EToolResources["ocr"] = "ocr";
	return EToolResources;
}({});
let AnnotationTypes = /* @__PURE__ */ function(AnnotationTypes) {
	AnnotationTypes["FILE_CITATION"] = "file_citation";
	AnnotationTypes["FILE_PATH"] = "file_path";
	return AnnotationTypes;
}({});
let StepStatus = /* @__PURE__ */ function(StepStatus) {
	StepStatus["IN_PROGRESS"] = "in_progress";
	StepStatus["CANCELLED"] = "cancelled";
	StepStatus["FAILED"] = "failed";
	StepStatus["COMPLETED"] = "completed";
	StepStatus["EXPIRED"] = "expired";
	return StepStatus;
}({});
let MessageContentTypes = /* @__PURE__ */ function(MessageContentTypes) {
	MessageContentTypes["TEXT"] = "text";
	MessageContentTypes["IMAGE_FILE"] = "image_file";
	return MessageContentTypes;
}({});
let RunStatus = /* @__PURE__ */ function(RunStatus) {
	RunStatus["QUEUED"] = "queued";
	RunStatus["IN_PROGRESS"] = "in_progress";
	RunStatus["REQUIRES_ACTION"] = "requires_action";
	RunStatus["CANCELLING"] = "cancelling";
	RunStatus["CANCELLED"] = "cancelled";
	RunStatus["FAILED"] = "failed";
	RunStatus["COMPLETED"] = "completed";
	RunStatus["EXPIRED"] = "expired";
	return RunStatus;
}({});
const actionDelimiter = "_action_";
const actionDomainSeparator = "---";
/** Mirrors `Constants.mcp_delimiter`; duplicated here to avoid a circular import from `config.ts`. */
const mcpDelimiter = "_mcp_";
/**
* Checks whether a tool name is an OpenAPI action tool.
*
* Action format: `operationId_action_normalizedDomain`
* MCP format:    `toolName_mcp_serverName`
*
* Cross-delimiter collision: an MCP tool like `get_action_mcp_srv` contains
* `_action_` as a false positive. Guarded by checking whether `_mcp_` appears
* after `_action_`. In the collision case the `_mcp_` suffix always follows
* `_action_`; in a valid action tool whose operationId contains `_mcp_`, the
* `_mcp_` precedes `_action_`.
*
* Theoretical limitation: a non-RFC-compliant domain containing literal
* underscores that form `_mcp_` (e.g. `api_mcp_internal.com`) would produce
* a false negative. RFC 952/1123 prohibit underscores in hostnames, so this
* is not expected in practice.
*/
function isActionTool(toolName) {
	const actionIdx = toolName.indexOf(actionDelimiter);
	if (actionIdx < 0) return false;
	const mcpIdx = toolName.indexOf(mcpDelimiter);
	return mcpIdx < 0 || mcpIdx < actionIdx;
}
const hostImageIdSuffix = "_host_copy";
const hostImageNamePrefix = "host_copy_";
let FilePurpose = /* @__PURE__ */ function(FilePurpose) {
	FilePurpose["Vision"] = "vision";
	FilePurpose["FineTune"] = "fine-tune";
	FilePurpose["FineTuneResults"] = "fine-tune-results";
	FilePurpose["Assistants"] = "assistants";
	FilePurpose["AssistantsOutput"] = "assistants_output";
	return FilePurpose;
}({});
const defaultOrderQuery = {
	order: "desc",
	limit: 100
};
let AssistantStreamEvents = /* @__PURE__ */ function(AssistantStreamEvents) {
	AssistantStreamEvents["ThreadCreated"] = "thread.created";
	AssistantStreamEvents["ThreadRunCreated"] = "thread.run.created";
	AssistantStreamEvents["ThreadRunQueued"] = "thread.run.queued";
	AssistantStreamEvents["ThreadRunInProgress"] = "thread.run.in_progress";
	AssistantStreamEvents["ThreadRunRequiresAction"] = "thread.run.requires_action";
	AssistantStreamEvents["ThreadRunCompleted"] = "thread.run.completed";
	AssistantStreamEvents["ThreadRunFailed"] = "thread.run.failed";
	AssistantStreamEvents["ThreadRunCancelling"] = "thread.run.cancelling";
	AssistantStreamEvents["ThreadRunCancelled"] = "thread.run.cancelled";
	AssistantStreamEvents["ThreadRunExpired"] = "thread.run.expired";
	AssistantStreamEvents["ThreadRunStepCreated"] = "thread.run.step.created";
	AssistantStreamEvents["ThreadRunStepInProgress"] = "thread.run.step.in_progress";
	AssistantStreamEvents["ThreadRunStepCompleted"] = "thread.run.step.completed";
	AssistantStreamEvents["ThreadRunStepFailed"] = "thread.run.step.failed";
	AssistantStreamEvents["ThreadRunStepCancelled"] = "thread.run.step.cancelled";
	AssistantStreamEvents["ThreadRunStepExpired"] = "thread.run.step.expired";
	AssistantStreamEvents["ThreadRunStepDelta"] = "thread.run.step.delta";
	AssistantStreamEvents["ThreadMessageCreated"] = "thread.message.created";
	AssistantStreamEvents["ThreadMessageInProgress"] = "thread.message.in_progress";
	AssistantStreamEvents["ThreadMessageCompleted"] = "thread.message.completed";
	AssistantStreamEvents["ThreadMessageIncomplete"] = "thread.message.incomplete";
	AssistantStreamEvents["ThreadMessageDelta"] = "thread.message.delta";
	AssistantStreamEvents["ErrorEvent"] = "error";
	return AssistantStreamEvents;
}({});
//#endregion
//#region src/schemas.ts
const isUUID = z.string().uuid();
let AuthType = /* @__PURE__ */ function(AuthType) {
	AuthType["OVERRIDE_AUTH"] = "override_auth";
	AuthType["USER_PROVIDED"] = "user_provided";
	AuthType["SYSTEM_DEFINED"] = "system_defined";
	return AuthType;
}({});
const authTypeSchema = z.nativeEnum(AuthType);
let EModelEndpoint = /* @__PURE__ */ function(EModelEndpoint) {
	EModelEndpoint["azureOpenAI"] = "azureOpenAI";
	EModelEndpoint["openAI"] = "openAI";
	EModelEndpoint["google"] = "google";
	EModelEndpoint["anthropic"] = "anthropic";
	EModelEndpoint["assistants"] = "assistants";
	EModelEndpoint["azureAssistants"] = "azureAssistants";
	EModelEndpoint["agents"] = "agents";
	EModelEndpoint["custom"] = "custom";
	EModelEndpoint["bedrock"] = "bedrock";
	return EModelEndpoint;
}({});
/** Mirrors `@librechat/agents` providers */
let Providers = /* @__PURE__ */ function(Providers) {
	Providers["OPENAI"] = "openAI";
	Providers["ANTHROPIC"] = "anthropic";
	Providers["AZURE"] = "azureOpenAI";
	Providers["GOOGLE"] = "google";
	Providers["VERTEXAI"] = "vertexai";
	Providers["BEDROCK"] = "bedrock";
	Providers["MISTRALAI"] = "mistralai";
	Providers["MISTRAL"] = "mistral";
	Providers["DEEPSEEK"] = "deepseek";
	Providers["MOONSHOT"] = "moonshot";
	Providers["OPENROUTER"] = "openrouter";
	Providers["XAI"] = "xai";
	return Providers;
}({});
/**
* Endpoints that support direct PDF processing in the agent system
*/
const documentSupportedProviders = new Set([
	"anthropic",
	"openAI",
	"bedrock",
	"custom",
	"google",
	"vertexai",
	"mistralai",
	"mistral",
	"deepseek",
	"moonshot",
	"openrouter",
	"xai"
]);
const openAILikeProviders = new Set([
	"openAI",
	"azureOpenAI",
	"custom",
	"mistralai",
	"mistral",
	"deepseek",
	"moonshot",
	"openrouter",
	"xai"
]);
const isOpenAILikeProvider = (provider) => {
	return openAILikeProviders.has(provider ?? "");
};
/**
* Providers whose `usage_metadata.input_tokens` ALREADY INCLUDES cached tokens
* (`input_token_details.cache_*` is a subset, not an additional charge):
* Google/Vertex (`promptTokenCount`), OpenAI/Azure (`prompt_tokens`), and the
* OpenAI-compatible family. `@librechat/agents`' `getAnthropicUsageMetadata`
* folds `cache_creation` + `cache_read` into `input_tokens`, so Anthropic is a
* subset provider too; without this the cache portion is billed twice. Bedrock
* stays additive — its Converse path passes AWS `inputTokens` through unmodified.
* Single source of truth shared by the backend billing path
* (`packages/api/src/agents/usage.ts`) and the client usage normalization.
*/
const cacheSubsetProviders = new Set([
	"openAI",
	"azureOpenAI",
	"google",
	"vertexai",
	"xai",
	"deepseek",
	"openrouter",
	"moonshot",
	"anthropic"
]);
const inputTokensIncludesCache = (provider) => {
	return cacheSubsetProviders.has(provider ?? "");
};
const isDocumentSupportedProvider = (provider) => {
	return documentSupportedProviders.has(provider ?? "");
};
const paramEndpoints = new Set([
	"agents",
	"openAI",
	"bedrock",
	"azureOpenAI",
	"anthropic",
	"custom",
	"google"
]);
let BedrockProviders = /* @__PURE__ */ function(BedrockProviders) {
	BedrockProviders["AI21"] = "ai21";
	BedrockProviders["Amazon"] = "amazon";
	BedrockProviders["Anthropic"] = "anthropic";
	BedrockProviders["Cohere"] = "cohere";
	BedrockProviders["DeepSeek"] = "deepseek";
	BedrockProviders["Meta"] = "meta";
	BedrockProviders["MistralAI"] = "mistral";
	BedrockProviders["Moonshot"] = "moonshot";
	BedrockProviders["MoonshotAI"] = "moonshotai";
	BedrockProviders["OpenAI"] = "openai";
	BedrockProviders["StabilityAI"] = "stability";
	BedrockProviders["ZAI"] = "zai";
	return BedrockProviders;
}({});
const getModelKey = (endpoint, model) => {
	if (endpoint === "bedrock") {
		const parts = model.split(".");
		return [parts[0], parts[1]].find((part) => Object.values(BedrockProviders).includes(part)) ?? parts[0];
	}
	return model;
};
const getSettingsKeys = (endpoint, model) => {
	const endpointKey = endpoint;
	return [`${endpointKey}-${getModelKey(endpointKey, model)}`, endpointKey];
};
const isAssistantsEndpoint = (_endpoint) => {
	const endpoint = _endpoint ?? "";
	if (!endpoint) return false;
	return endpoint.toLowerCase().endsWith("assistants");
};
const isAgentsEndpoint = (_endpoint) => {
	const endpoint = _endpoint ?? "";
	if (!endpoint) return false;
	return endpoint === "agents";
};
const isParamEndpoint = (endpoint, endpointType) => {
	if (paramEndpoints.has(endpoint)) return true;
	if (endpointType != null) return paramEndpoints.has(endpointType);
	return false;
};
let ImageDetail = /* @__PURE__ */ function(ImageDetail) {
	ImageDetail["low"] = "low";
	ImageDetail["auto"] = "auto";
	ImageDetail["high"] = "high";
	return ImageDetail;
}({});
let ReasoningEffort = /* @__PURE__ */ function(ReasoningEffort) {
	ReasoningEffort["unset"] = "";
	ReasoningEffort["none"] = "none";
	ReasoningEffort["minimal"] = "minimal";
	ReasoningEffort["low"] = "low";
	ReasoningEffort["medium"] = "medium";
	ReasoningEffort["high"] = "high";
	ReasoningEffort["xhigh"] = "xhigh";
	return ReasoningEffort;
}({});
let ReasoningParameterFormat = /* @__PURE__ */ function(ReasoningParameterFormat) {
	ReasoningParameterFormat["disabled"] = "disabled";
	ReasoningParameterFormat["reasoningEffort"] = "reasoning_effort";
	ReasoningParameterFormat["reasoningObject"] = "reasoning_object";
	return ReasoningParameterFormat;
}({});
let ReasoningResponseKey = /* @__PURE__ */ function(ReasoningResponseKey) {
	ReasoningResponseKey["reasoning"] = "reasoning";
	ReasoningResponseKey["reasoningContent"] = "reasoning_content";
	return ReasoningResponseKey;
}({});
let AnthropicEffort = /* @__PURE__ */ function(AnthropicEffort) {
	AnthropicEffort["unset"] = "";
	AnthropicEffort["low"] = "low";
	AnthropicEffort["medium"] = "medium";
	AnthropicEffort["high"] = "high";
	AnthropicEffort["xhigh"] = "xhigh";
	AnthropicEffort["max"] = "max";
	return AnthropicEffort;
}({});
/**
* Controls whether the model's reasoning content is returned in responses.
*
* - `'auto'` - LibreChat decides: opt in to `'summarized'` for models that
*   omit by default (Opus 4.7+), leave the field off for older models.
* - `'summarized'` - always request a post-hoc summary of the reasoning.
* - `'omitted'` - always suppress reasoning content. Slightly lower latency.
*
* See https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7#thinking-content-omitted-by-default
*/
let ThinkingDisplay = /* @__PURE__ */ function(ThinkingDisplay) {
	ThinkingDisplay["auto"] = "auto";
	ThinkingDisplay["summarized"] = "summarized";
	ThinkingDisplay["omitted"] = "omitted";
	return ThinkingDisplay;
}({});
let BedrockReasoningConfig = /* @__PURE__ */ function(BedrockReasoningConfig) {
	BedrockReasoningConfig["low"] = "low";
	BedrockReasoningConfig["medium"] = "medium";
	BedrockReasoningConfig["high"] = "high";
	return BedrockReasoningConfig;
}({});
let ReasoningSummary = /* @__PURE__ */ function(ReasoningSummary) {
	ReasoningSummary["none"] = "";
	ReasoningSummary["auto"] = "auto";
	ReasoningSummary["concise"] = "concise";
	ReasoningSummary["detailed"] = "detailed";
	return ReasoningSummary;
}({});
let Verbosity = /* @__PURE__ */ function(Verbosity) {
	Verbosity["none"] = "";
	Verbosity["low"] = "low";
	Verbosity["medium"] = "medium";
	Verbosity["high"] = "high";
	return Verbosity;
}({});
let ThinkingLevel = /* @__PURE__ */ function(ThinkingLevel) {
	ThinkingLevel["unset"] = "";
	ThinkingLevel["minimal"] = "minimal";
	ThinkingLevel["low"] = "low";
	ThinkingLevel["medium"] = "medium";
	ThinkingLevel["high"] = "high";
	return ThinkingLevel;
}({});
const imageDetailNumeric = {
	["low"]: 0,
	["auto"]: 1,
	["high"]: 2
};
const imageDetailValue = {
	0: "low",
	1: "auto",
	2: "high"
};
const eImageDetailSchema = z.nativeEnum(ImageDetail);
const eReasoningEffortSchema = z.nativeEnum(ReasoningEffort);
const eReasoningParameterFormatSchema = z.nativeEnum(ReasoningParameterFormat);
const eReasoningResponseKeySchema = z.nativeEnum(ReasoningResponseKey);
const eAnthropicEffortSchema = z.nativeEnum(AnthropicEffort);
const eThinkingDisplaySchema = z.nativeEnum(ThinkingDisplay);
const eReasoningSummarySchema = z.nativeEnum(ReasoningSummary);
const eVerbositySchema = z.nativeEnum(Verbosity);
const eThinkingLevelSchema = z.nativeEnum(ThinkingLevel);
const defaultAssistantFormValues = {
	assistant: "",
	id: "",
	name: "",
	description: "",
	instructions: "",
	conversation_starters: [],
	model: "",
	functions: [],
	code_interpreter: false,
	image_vision: false,
	retrieval: false,
	append_current_datetime: false
};
const defaultAgentFormValues = {
	agent: {},
	id: "",
	name: "",
	description: "",
	instructions: "",
	model: "",
	model_parameters: {},
	tools: [],
	tool_options: {},
	provider: {},
	edges: [],
	artifacts: "",
	recursion_limit: void 0,
	["execute_code"]: false,
	["file_search"]: false,
	["web_search"]: false,
	category: "general",
	support_contact: {
		name: "",
		email: ""
	},
	/** Optional allowlist. Only applies when `skills_enabled === true`.
	*  Empty/undefined + enabled = full catalog; non-empty + enabled = narrow to ids. */
	skills: void 0,
	/** Master toggle for skill use on this agent. `true` activates skills
	*  (full catalog unless `skills` narrows it). Anything else = inactive. */
	skills_enabled: void 0,
	/** `undefined` = feature disabled by default (no subagent tool injected). */
	subagents: void 0
};
const ImageVisionTool = {
	type: "function",
	["function"]: {
		name: "image_vision",
		description: "Get detailed text descriptions for all current image attachments.",
		parameters: {
			type: "object",
			properties: {},
			required: []
		}
	}
};
const isImageVisionTool = (tool) => tool.type === "function" && tool.function?.name === ImageVisionTool.function?.name;
const openAISettings = {
	model: { default: "gpt-4o-mini" },
	temperature: {
		min: 0,
		max: 2,
		step: .01,
		default: 1
	},
	top_p: {
		min: 0,
		max: 1,
		step: .01,
		default: 1
	},
	presence_penalty: {
		min: -2,
		max: 2,
		step: .01,
		default: 0
	},
	frequency_penalty: {
		min: -2,
		max: 2,
		step: .01,
		default: 0
	},
	resendFiles: { default: true },
	maxContextTokens: { default: void 0 },
	max_tokens: { default: void 0 },
	imageDetail: {
		default: "auto",
		min: 0,
		max: 2,
		step: 1
	}
};
/**
* `65535` (not 65536) is the value valid on both Google AI Studio and Vertex AI:
* Vertex caps current Gemini text models at 65,535 output tokens, so defaulting to
* 65,536 would make otherwise-default Vertex requests fail validation.
*/
const GOOGLE_MAX_OUTPUT = 65535;
const GOOGLE_IMAGE_MAX_OUTPUT = 32768;
const GOOGLE_LEGACY_MAX_OUTPUT = 8192;
/**
* Resolves the documented max output-token limit for a Google/Gemini model.
* Current Gemini text models (2.5 and 3+) support 64K output tokens; their image
* variants (e.g. `gemini-2.5-flash-image`) cap at 32K; legacy/deprecated models
* (2.0 and earlier, including legacy image models) and Gemma retain the 8K limit.
*/
const getGoogleMaxOutputTokens = (modelName) => {
	if (/gemini-(?:2\.5|[3-9]|\d{2,})/i.test(modelName)) {
		if (/image/i.test(modelName)) return GOOGLE_IMAGE_MAX_OUTPUT;
		return GOOGLE_MAX_OUTPUT;
	}
	return GOOGLE_LEGACY_MAX_OUTPUT;
};
const googleSettings = {
	model: { default: "gemini-1.5-flash-latest" },
	maxOutputTokens: {
		min: 1,
		max: GOOGLE_MAX_OUTPUT,
		step: 1,
		default: GOOGLE_LEGACY_MAX_OUTPUT,
		reset: (modelName) => getGoogleMaxOutputTokens(modelName),
		set: (value, modelName) => {
			const max = getGoogleMaxOutputTokens(modelName);
			return value > max ? max : value;
		}
	},
	temperature: {
		min: 0,
		max: 2,
		step: .01,
		default: 1
	},
	topP: {
		min: 0,
		max: 1,
		step: .01,
		default: .95
	},
	topK: {
		min: 1,
		max: 40,
		step: 1,
		default: 40
	},
	thinking: { default: true },
	thinkingBudget: {
		min: -1,
		max: 32e3,
		step: 1,
		/** `-1` = Dynamic Thinking, meaning the model will adjust
		* the budget based on the complexity of the request.
		*/
		default: -1
	},
	thinkingLevel: { default: "" }
};
const ANTHROPIC_MAX_OUTPUT = 128e3;
const CLAUDE_4_64K_MAX_OUTPUT = 64e3;
const CLAUDE_32K_MAX_OUTPUT = 32e3;
const DEFAULT_MAX_OUTPUT = 8192;
const LEGACY_ANTHROPIC_MAX_OUTPUT = 4096;
/**
* Claude "Mythos-class" model families — new top-level classes (peers of
* `opus`/`sonnet`/`haiku`) that ship with the post-Opus-4.7 modern profile:
* adaptive thinking always on, raw thinking omitted by default (summarized
* opt-in), sampling parameters rejected, and a 1M context window. The tier
* word is the class name itself, so the `opus`/`sonnet` version parsers don't
* cover them.
*
* Single source of truth: add a future sibling class name here and every
* Mythos-class gate (adaptive thinking, sampling omission, prompt caching, 1M
* context, 128K output) picks it up.
*/
const MYTHOS_CLASS_FAMILIES = ["fable", "mythos"];
const MYTHOS_CLASS_PATTERN = new RegExp(`claude-(?:${MYTHOS_CLASS_FAMILIES.join("|")})[-.]?\\d`);
/** Whether the model is a Claude Mythos-class model (e.g. `claude-fable-5`). */
function isMythosClassModel(model) {
	return MYTHOS_CLASS_PATTERN.test(model);
}
const anthropicSettings = {
	model: { default: "claude-3-5-sonnet-latest" },
	temperature: {
		min: 0,
		max: 1,
		step: .01,
		default: 1
	},
	promptCache: { default: true },
	promptCacheTtl: { default: void 0 },
	thinking: { default: true },
	thinkingBudget: {
		min: 1024,
		step: 100,
		max: 2e5,
		default: 2e3
	},
	maxOutputTokens: {
		min: 1,
		max: ANTHROPIC_MAX_OUTPUT,
		step: 1,
		default: DEFAULT_MAX_OUTPUT,
		reset: (modelName) => {
			if (isMythosClassModel(modelName)) return ANTHROPIC_MAX_OUTPUT;
			if (/claude-opus[-.]?(?:4[-.]?(?:[6-9]|\d{2,})|[5-9]|\d{2,})/.test(modelName)) return ANTHROPIC_MAX_OUTPUT;
			if (/claude-(?:sonnet|haiku)[-.]?[4-9]/.test(modelName)) return CLAUDE_4_64K_MAX_OUTPUT;
			if (/claude-opus[-.]?(?:[5-9]|4[-.]?([5-9]|\d{2,}))/.test(modelName)) return CLAUDE_4_64K_MAX_OUTPUT;
			if (/claude-opus[-.]?[4-9]/.test(modelName)) return CLAUDE_32K_MAX_OUTPUT;
			return DEFAULT_MAX_OUTPUT;
		},
		set: (value, modelName) => {
			if (isMythosClassModel(modelName)) {
				if (value > ANTHROPIC_MAX_OUTPUT) return ANTHROPIC_MAX_OUTPUT;
				return value;
			}
			if (/claude-opus[-.]?(?:4[-.]?(?:[6-9]|\d{2,})|[5-9]|\d{2,})/.test(modelName)) {
				if (value > ANTHROPIC_MAX_OUTPUT) return ANTHROPIC_MAX_OUTPUT;
				return value;
			}
			if (/claude-(?:sonnet|haiku)[-.]?[4-9]/.test(modelName) && value > CLAUDE_4_64K_MAX_OUTPUT) return CLAUDE_4_64K_MAX_OUTPUT;
			if (/claude-opus[-.]?(?:[5-9]|4[-.]?([5-9]|\d{2,}))/.test(modelName)) {
				if (value > CLAUDE_4_64K_MAX_OUTPUT) return CLAUDE_4_64K_MAX_OUTPUT;
				return value;
			}
			if (/claude-opus[-.]?[4-9]/.test(modelName) && value > CLAUDE_32K_MAX_OUTPUT) return CLAUDE_32K_MAX_OUTPUT;
			if (value > ANTHROPIC_MAX_OUTPUT) return ANTHROPIC_MAX_OUTPUT;
			return value;
		}
	},
	topP: {
		min: 0,
		max: 1,
		step: .01,
		default: .7
	},
	topK: {
		min: 1,
		max: 40,
		step: 1,
		default: 5
	},
	resendFiles: { default: true },
	maxContextTokens: { default: void 0 },
	legacy: { maxOutputTokens: {
		min: 1,
		max: LEGACY_ANTHROPIC_MAX_OUTPUT,
		step: 1,
		default: LEGACY_ANTHROPIC_MAX_OUTPUT
	} },
	effort: {
		default: "",
		options: [
			"",
			"low",
			"medium",
			"high",
			"xhigh",
			"max"
		]
	},
	thinkingDisplay: {
		default: "auto",
		options: [
			"auto",
			"summarized",
			"omitted"
		]
	},
	web_search: { default: false }
};
const agentsSettings = {
	model: { default: "gpt-3.5-turbo-test" },
	temperature: {
		min: 0,
		max: 1,
		step: .01,
		default: 1
	},
	top_p: {
		min: 0,
		max: 1,
		step: .01,
		default: 1
	},
	presence_penalty: {
		min: -2,
		max: 2,
		step: .01,
		default: 0
	},
	frequency_penalty: {
		min: -2,
		max: 2,
		step: .01,
		default: 0
	},
	resendFiles: { default: true },
	maxContextTokens: { default: void 0 },
	max_tokens: { default: void 0 },
	imageDetail: { default: "auto" }
};
const endpointSettings = {
	["openAI"]: openAISettings,
	["google"]: googleSettings,
	["anthropic"]: anthropicSettings,
	["agents"]: agentsSettings,
	["bedrock"]: agentsSettings
};
const google = endpointSettings["google"];
const eModelEndpointSchema = z.nativeEnum(EModelEndpoint);
const extendedModelEndpointSchema = z.union([eModelEndpointSchema, z.string()]);
const tPluginAuthConfigSchema = z.object({
	authField: z.string(),
	label: z.string(),
	description: z.string(),
	optional: z.boolean().optional(),
	/** Whether the field holds a secret and should be masked in the UI (defaults to masked when omitted). */
	sensitive: z.boolean().optional()
});
const tPluginSchema = z.object({
	name: z.string(),
	pluginKey: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	authConfig: z.array(tPluginAuthConfigSchema).optional(),
	authenticated: z.boolean().optional(),
	chatMenu: z.boolean().optional(),
	isButton: z.boolean().optional(),
	toolkit: z.boolean().optional()
});
const tExampleSchema = z.object({
	input: z.object({ content: z.string() }),
	output: z.object({ content: z.string() })
});
const tMessageSchema = z.object({
	messageId: z.string(),
	endpoint: z.string().optional(),
	clientId: z.string().nullable().optional(),
	conversationId: z.string().nullable(),
	parentMessageId: z.string().nullable(),
	responseMessageId: z.string().nullable().optional(),
	overrideParentMessageId: z.string().nullable().optional(),
	bg: z.string().nullable().optional(),
	model: z.string().nullable().optional(),
	title: z.string().nullable().or(z.literal("New Chat")).default("New Chat"),
	sender: z.string().optional(),
	text: z.string(),
	/** @deprecated */
	generation: z.string().nullable().optional(),
	isCreatedByUser: z.boolean(),
	isTemporary: z.boolean().optional(),
	expiredAt: z.string().nullable().optional(),
	error: z.boolean().optional(),
	clientTimestamp: z.string().optional(),
	createdAt: z.string().optional().default(() => (/* @__PURE__ */ new Date()).toISOString()),
	updatedAt: z.string().optional().default(() => (/* @__PURE__ */ new Date()).toISOString()),
	current: z.boolean().optional(),
	unfinished: z.boolean().optional(),
	searchResult: z.boolean().optional(),
	finish_reason: z.string().optional(),
	thread_id: z.string().optional(),
	iconURL: z.string().nullable().optional(),
	feedback: feedbackSchema.optional(),
	/** metadata */
	metadata: z.record(z.unknown()).optional(),
	/** Output tokens for assistant messages, calibrated prompt-side estimate for user messages */
	tokenCount: z.number().optional(),
	contextMeta: z.object({
		calibrationRatio: z.number().optional().describe("EMA ratio of provider-reported vs local token estimates; seeds the pruner on subsequent runs"),
		encoding: z.string().optional().describe("Tokenizer encoding used when this ratio was computed (e.g. \"claude\", \"o200k_base\")")
	}).optional(),
	/**
	* Skill names the user invoked manually via the `$` popover on this turn.
	* Purely UI metadata — `SkillPills` renders these above the message
	* bubble so users can see which skills they asked for in history and on
	* reload. Runtime resolution uses the top-level payload field with the
	* same name. Empty / absent for model-invoked skills (shown as tool_call
	* content parts on the assistant message instead).
	*/
	manualSkills: z.array(z.string()).optional(),
	/**
	* Skill names auto-primed on this turn because their `always-apply`
	* frontmatter flag is set. Persisted at turn time so the pinned-variant
	* pills on the user bubble survive reload and stay stable across later
	* edits to the skill's `alwaysApply` flag (the user bubble reflects
	* what actually ran, not the current catalog).
	*/
	alwaysAppliedSkills: z.array(z.string()).optional(),
	/**
	* Verbatim excerpts the user quoted (via the "Add to chat" selection
	* popup) to reference on this turn. UI metadata that `MessageQuotes`
	* renders above the user bubble so the references persist on reload. The
	* excerpts are merged into the user message text sent to the model at
	* request time and counted in the user message token count.
	*/
	quotes: z.array(z.string()).optional()
});
const coerceNumber = z.union([z.number(), z.string()]).transform((val) => {
	if (typeof val === "string") return val.trim() === "" ? void 0 : parseFloat(val);
	return val;
});
const DocumentType = z.lazy(() => z.union([
	z.null(),
	z.boolean(),
	z.number(),
	z.string(),
	z.array(z.lazy(() => DocumentType)),
	z.record(z.lazy(() => DocumentType))
]));
const tConversationSchema = z.object({
	conversationId: z.string().nullable(),
	endpoint: eModelEndpointSchema.nullable(),
	endpointType: eModelEndpointSchema.nullable().optional(),
	isArchived: z.boolean().optional(),
	pinned: z.boolean().optional(),
	title: z.string().nullable().or(z.literal("New Chat")).default("New Chat"),
	user: z.string().optional(),
	messages: z.array(z.string()).optional(),
	tools: z.union([z.array(tPluginSchema), z.array(z.string())]).optional(),
	modelLabel: z.string().nullable().optional(),
	userLabel: z.string().optional(),
	model: z.string().nullable().optional(),
	promptPrefix: z.string().nullable().optional(),
	temperature: z.number().nullable().optional(),
	topP: z.number().optional(),
	topK: z.number().optional(),
	top_p: z.number().optional(),
	frequency_penalty: z.number().optional(),
	presence_penalty: z.number().optional(),
	parentMessageId: z.string().optional(),
	maxOutputTokens: coerceNumber.nullable().optional(),
	maxContextTokens: coerceNumber.optional(),
	max_tokens: coerceNumber.optional(),
	promptCache: z.boolean().optional(),
	promptCacheTtl: z.enum(["5m", "1h"]).optional(),
	system: z.string().optional(),
	thinking: z.boolean().optional(),
	thinkingBudget: coerceNumber.optional(),
	thinkingLevel: eThinkingLevelSchema.optional(),
	stream: z.boolean().optional(),
	artifacts: z.string().optional(),
	context: z.string().nullable().optional(),
	examples: z.array(tExampleSchema).optional(),
	tags: z.array(z.string()).optional(),
	chatProjectId: z.string().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	resendFiles: z.boolean().optional(),
	file_ids: z.array(z.string()).optional(),
	imageDetail: eImageDetailSchema.optional(),
	reasoning_effort: eReasoningEffortSchema.optional().nullable(),
	reasoning_summary: eReasoningSummarySchema.optional().nullable(),
	verbosity: eVerbositySchema.optional().nullable(),
	useResponsesApi: z.boolean().optional(),
	effort: eAnthropicEffortSchema.optional().nullable(),
	thinkingDisplay: eThinkingDisplaySchema.optional().nullable(),
	web_search: z.boolean().optional(),
	url_context: z.boolean().optional(),
	disableStreaming: z.boolean().optional(),
	assistant_id: z.string().optional(),
	agent_id: z.string().optional(),
	region: z.string().optional(),
	maxTokens: coerceNumber.optional(),
	additionalModelRequestFields: DocumentType.optional(),
	instructions: z.string().optional(),
	additional_instructions: z.string().optional(),
	append_current_datetime: z.boolean().optional(),
	/** Used to overwrite active conversation settings when saving a Preset */
	presetOverride: z.record(z.unknown()).optional(),
	stop: z.array(z.string()).optional(),
	greeting: z.string().optional(),
	spec: z.string().nullable().optional(),
	iconURL: z.string().nullable().optional(),
	expiredAt: z.string().nullable().optional(),
	isTemporary: z.boolean().optional(),
	fileTokenLimit: coerceNumber.optional(),
	/** @deprecated */
	resendImages: z.boolean().optional(),
	/** @deprecated Prefer `modelLabel` over `chatGptLabel` */
	chatGptLabel: z.string().nullable().optional()
});
const tPresetSchema = tConversationSchema.omit({
	conversationId: true,
	chatProjectId: true,
	createdAt: true,
	updatedAt: true,
	title: true
}).merge(z.object({
	conversationId: z.string().nullable().optional(),
	presetId: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	defaultPreset: z.boolean().optional(),
	order: z.number().optional(),
	endpoint: extendedModelEndpointSchema.nullable()
}));
const tConvoUpdateSchema = tConversationSchema.merge(z.object({
	endpoint: extendedModelEndpointSchema.nullable(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional()
}));
const tQueryParamsSchema = tConversationSchema.pick({
	/** The model spec to be used */
	spec: true,
	/** The AI context window, overrides the system-defined window as determined by `model` value */
	maxContextTokens: true,
	/**
	* Whether or not to re-submit files from previous messages on subsequent messages
	* */
	resendFiles: true,
	/**
	* @endpoints openAI, custom, azureOpenAI
	*
	* System parameter that only affects the above endpoints.
	* Image detail for re-sizing according to OpenAI spec, defaults to `auto`
	* */
	imageDetail: true,
	/**
	* AKA Custom Instructions, dynamically added to chat history as a system message;
	* for `bedrock` endpoint, this is used as the `system` model param if the provider uses it;
	* for `assistants` endpoint, this is used as the `additional_instructions` model param:
	* https://platform.openai.com/docs/api-reference/runs/createRun#runs-createrun-additional_instructions
	* ; otherwise, a message with `system` role is added to the chat history
	*/
	promptPrefix: true,
	/** @endpoints openAI, custom, azureOpenAI, google, anthropic, assistants, azureAssistants, bedrock */
	model: true,
	/** @endpoints openAI, custom, azureOpenAI, google, anthropic, bedrock */
	temperature: true,
	/** @endpoints openAI, custom, azureOpenAI */
	presence_penalty: true,
	/** @endpoints openAI, custom, azureOpenAI */
	frequency_penalty: true,
	/** @endpoints openAI, custom, azureOpenAI */
	stop: true,
	/** @endpoints openAI, custom, azureOpenAI */
	top_p: true,
	/** @endpoints openAI, custom, azureOpenAI */
	max_tokens: true,
	/** @endpoints openAI, custom, azureOpenAI */
	reasoning_effort: true,
	/** @endpoints openAI, custom, azureOpenAI */
	reasoning_summary: true,
	/** @endpoints openAI, custom, azureOpenAI */
	verbosity: true,
	/** @endpoints openAI, custom, azureOpenAI */
	useResponsesApi: true,
	/** @endpoints openAI, anthropic, google */
	web_search: true,
	/** @endpoints google */
	url_context: true,
	/** @endpoints openAI, custom, azureOpenAI */
	disableStreaming: true,
	/** @endpoints google, anthropic, bedrock */
	topP: true,
	/** @endpoints google, anthropic */
	topK: true,
	/** @endpoints google, anthropic */
	maxOutputTokens: true,
	/** @endpoints anthropic */
	promptCache: true,
	promptCacheTtl: true,
	thinking: true,
	thinkingBudget: true,
	thinkingLevel: true,
	effort: true,
	thinkingDisplay: true,
	/** @endpoints bedrock */
	region: true,
	/** @endpoints bedrock */
	maxTokens: true,
	/** @endpoints agents */
	agent_id: true,
	/** @endpoints assistants, azureAssistants */
	assistant_id: true,
	/** @endpoints assistants, azureAssistants */
	append_current_datetime: true,
	/**
	* @endpoints assistants, azureAssistants
	*
	* Overrides existing assistant instructions, only used for the current run:
	* https://platform.openai.com/docs/api-reference/runs/createRun#runs-createrun-instructions
	* */
	instructions: true,
	/** @endpoints openAI, google, anthropic */
	fileTokenLimit: true
}).merge(z.object({ 
/** @endpoints openAI, custom, azureOpenAI, google, anthropic, assistants, azureAssistants, bedrock, agents */
endpoint: extendedModelEndpointSchema.nullable() }));
/** Narrowed preset schema for use in model specs — omits system/DB/deprecated fields.
*
* `greeting` and `iconURL` are admin-configurable display fields on a model spec's
* preset (landing greeting, preset-level icon fallback) and must be preserved.
* `spec` is set by the client from `modelSpec.name` via `getModelSpecPreset` and is
* omitted to avoid duplicate configuration surface.
*/
const tModelSpecPresetSchema = tPresetSchema.omit({
	conversationId: true,
	presetId: true,
	title: true,
	defaultPreset: true,
	order: true,
	isArchived: true,
	user: true,
	messages: true,
	tags: true,
	file_ids: true,
	expiredAt: true,
	parentMessageId: true,
	resendImages: true,
	chatGptLabel: true,
	presetOverride: true,
	spec: true
});
const tSharedLinkSchema = z.object({
	conversationId: z.string(),
	shareId: z.string(),
	targetMessageId: z.string().optional(),
	messages: z.array(z.string()),
	title: z.string(),
	createdAt: z.string(),
	updatedAt: z.string()
});
const tConversationTagSchema = z.object({
	_id: z.string(),
	user: z.string(),
	tag: z.string(),
	description: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	count: z.number(),
	position: z.number()
});
const googleBaseSchema = tConversationSchema.pick({
	chatProjectId: true,
	model: true,
	modelLabel: true,
	promptPrefix: true,
	examples: true,
	temperature: true,
	maxOutputTokens: true,
	artifacts: true,
	topP: true,
	topK: true,
	thinking: true,
	thinkingBudget: true,
	thinkingLevel: true,
	web_search: true,
	url_context: true,
	fileTokenLimit: true,
	iconURL: true,
	greeting: true,
	spec: true,
	maxContextTokens: true
});
const googleSchema = googleBaseSchema.transform((obj) => removeNullishValues(obj, true)).catch(() => ({}));
/**
* TODO: Map the following fields:
- presence_penalty -> presencePenalty
- frequency_penalty -> frequencyPenalty
- stop -> stopSequences
*/
const googleGenConfigSchema = z.object({
	maxOutputTokens: coerceNumber.optional(),
	temperature: coerceNumber.optional(),
	topP: coerceNumber.optional(),
	topK: coerceNumber.optional(),
	presencePenalty: coerceNumber.optional(),
	frequencyPenalty: coerceNumber.optional(),
	stopSequences: z.array(z.string()).optional(),
	thinkingConfig: z.object({
		includeThoughts: z.boolean().optional(),
		thinkingBudget: coerceNumber.optional(),
		thinkingLevel: z.string().optional()
	}).optional(),
	web_search: z.boolean().optional(),
	url_context: z.boolean().optional()
}).strip().optional();
function removeNullishValues(obj, removeEmptyStrings) {
	const newObj = { ...obj };
	Object.keys(newObj).forEach((key) => {
		const value = newObj[key];
		if (value === void 0 || value === null) delete newObj[key];
		if (removeEmptyStrings && typeof value === "string" && value === "") delete newObj[key];
	});
	return newObj;
}
const assistantSchema = tConversationSchema.pick({
	chatProjectId: true,
	model: true,
	assistant_id: true,
	instructions: true,
	artifacts: true,
	promptPrefix: true,
	iconURL: true,
	greeting: true,
	spec: true,
	append_current_datetime: true
}).transform((obj) => ({
	...obj,
	model: obj.model ?? openAISettings.model.default,
	assistant_id: obj.assistant_id ?? void 0,
	instructions: obj.instructions ?? void 0,
	promptPrefix: obj.promptPrefix ?? null,
	iconURL: obj.iconURL ?? void 0,
	greeting: obj.greeting ?? void 0,
	spec: obj.spec ?? void 0,
	append_current_datetime: obj.append_current_datetime ?? false
})).catch(() => ({
	model: openAISettings.model.default,
	assistant_id: void 0,
	instructions: void 0,
	promptPrefix: null,
	iconURL: void 0,
	greeting: void 0,
	spec: void 0,
	append_current_datetime: false
}));
const compactAssistantSchema = tConversationSchema.pick({
	chatProjectId: true,
	model: true,
	assistant_id: true,
	instructions: true,
	promptPrefix: true,
	artifacts: true,
	iconURL: true,
	greeting: true,
	spec: true
}).transform((obj) => removeNullishValues(obj)).catch(() => ({}));
const agentsBaseSchema = tConversationSchema.pick({
	chatProjectId: true,
	model: true,
	modelLabel: true,
	temperature: true,
	top_p: true,
	presence_penalty: true,
	frequency_penalty: true,
	resendFiles: true,
	imageDetail: true,
	agent_id: true,
	instructions: true,
	promptPrefix: true,
	iconURL: true,
	greeting: true,
	maxContextTokens: true
});
const agentsSchema = agentsBaseSchema.transform((obj) => ({
	...obj,
	model: obj.model ?? agentsSettings.model.default,
	modelLabel: obj.modelLabel ?? null,
	temperature: obj.temperature ?? 1,
	top_p: obj.top_p ?? 1,
	presence_penalty: obj.presence_penalty ?? 0,
	frequency_penalty: obj.frequency_penalty ?? 0,
	resendFiles: typeof obj.resendFiles === "boolean" ? obj.resendFiles : agentsSettings.resendFiles.default,
	imageDetail: obj.imageDetail ?? "auto",
	agent_id: obj.agent_id ?? void 0,
	instructions: obj.instructions ?? void 0,
	promptPrefix: obj.promptPrefix ?? null,
	iconURL: obj.iconURL ?? void 0,
	greeting: obj.greeting ?? void 0,
	maxContextTokens: obj.maxContextTokens ?? void 0
})).catch(() => ({
	model: agentsSettings.model.default,
	modelLabel: null,
	temperature: 1,
	top_p: 1,
	presence_penalty: 0,
	frequency_penalty: 0,
	resendFiles: agentsSettings.resendFiles.default,
	imageDetail: "auto",
	agent_id: void 0,
	instructions: void 0,
	promptPrefix: null,
	iconURL: void 0,
	greeting: void 0,
	maxContextTokens: void 0
}));
const openAIBaseSchema = tConversationSchema.pick({
	chatProjectId: true,
	model: true,
	modelLabel: true,
	chatGptLabel: true,
	promptPrefix: true,
	temperature: true,
	top_p: true,
	presence_penalty: true,
	frequency_penalty: true,
	resendFiles: true,
	artifacts: true,
	imageDetail: true,
	stop: true,
	iconURL: true,
	greeting: true,
	spec: true,
	maxContextTokens: true,
	max_tokens: true,
	reasoning_effort: true,
	reasoning_summary: true,
	verbosity: true,
	useResponsesApi: true,
	web_search: true,
	disableStreaming: true,
	fileTokenLimit: true
});
const openAISchema = openAIBaseSchema.transform((obj) => removeNullishValues(obj, true)).catch(() => ({}));
const openRouterSchema = openAIBaseSchema.merge(tConversationSchema.pick({
	promptCache: true,
	promptCacheTtl: true
})).transform((obj) => removeNullishValues(obj, true)).catch(() => ({}));
const compactGoogleSchema = googleBaseSchema.transform((obj) => {
	const newObj = { ...obj };
	if (newObj.temperature === google.temperature.default) delete newObj.temperature;
	if (newObj.maxOutputTokens === google.maxOutputTokens.reset(newObj.model ?? "")) delete newObj.maxOutputTokens;
	if (newObj.topP === google.topP.default) delete newObj.topP;
	if (newObj.topK === google.topK.default) delete newObj.topK;
	return removeNullishValues(newObj, true);
}).catch(() => ({}));
const anthropicBaseSchema = tConversationSchema.pick({
	chatProjectId: true,
	model: true,
	modelLabel: true,
	promptPrefix: true,
	temperature: true,
	maxOutputTokens: true,
	topP: true,
	topK: true,
	resendFiles: true,
	promptCache: true,
	promptCacheTtl: true,
	thinking: true,
	thinkingBudget: true,
	effort: true,
	thinkingDisplay: true,
	artifacts: true,
	iconURL: true,
	greeting: true,
	spec: true,
	maxContextTokens: true,
	web_search: true,
	fileTokenLimit: true,
	stop: true,
	stream: true
});
const anthropicSchema = anthropicBaseSchema.transform((obj) => removeNullishValues(obj)).catch(() => ({}));
const tBannerSchema = z.object({
	bannerId: z.string(),
	message: z.string(),
	displayFrom: z.string(),
	displayTo: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	isPublic: z.boolean(),
	persistable: z.boolean().default(false)
});
const compactAgentsBaseSchema = tConversationSchema.pick({
	chatProjectId: true,
	spec: true,
	iconURL: true,
	greeting: true,
	agent_id: true,
	instructions: true,
	additional_instructions: true
});
const compactAgentsSchema = compactAgentsBaseSchema.transform((obj) => removeNullishValues(obj)).catch(() => ({}));
//#endregion
//#region src/generate.ts
let ComponentTypes = /* @__PURE__ */ function(ComponentTypes) {
	ComponentTypes["Input"] = "input";
	ComponentTypes["Textarea"] = "textarea";
	ComponentTypes["Slider"] = "slider";
	ComponentTypes["Checkbox"] = "checkbox";
	ComponentTypes["Switch"] = "switch";
	ComponentTypes["Dropdown"] = "dropdown";
	ComponentTypes["Combobox"] = "combobox";
	ComponentTypes["Tags"] = "tags";
	return ComponentTypes;
}({});
let SettingTypes = /* @__PURE__ */ function(SettingTypes) {
	SettingTypes["Number"] = "number";
	SettingTypes["Boolean"] = "boolean";
	SettingTypes["String"] = "string";
	SettingTypes["Enum"] = "enum";
	SettingTypes["Array"] = "array";
	return SettingTypes;
}({});
let OptionTypes = /* @__PURE__ */ function(OptionTypes) {
	OptionTypes["Conversation"] = "conversation";
	OptionTypes["Model"] = "model";
	OptionTypes["Custom"] = "custom";
	return OptionTypes;
}({});
const requiredSettingFields = [
	"key",
	"type",
	"component"
];
function generateDynamicSchema(settings) {
	const schemaFields = {};
	for (const setting of settings) {
		const { key, type, default: defaultValue, range, options, minText, maxText, minTags, maxTags } = setting;
		if (type === "number") {
			let schema = z.number();
			if (range) {
				schema = schema.min(range.min);
				schema = schema.max(range.max);
			}
			if (typeof defaultValue === "number") schemaFields[key] = schema.default(defaultValue);
			else schemaFields[key] = schema;
			continue;
		}
		if (type === "boolean") {
			const schema = z.boolean();
			if (typeof defaultValue === "boolean") schemaFields[key] = schema.default(defaultValue);
			else schemaFields[key] = schema;
			continue;
		}
		if (type === "string") {
			let schema = z.string();
			if (minText) schema = schema.min(minText);
			if (maxText) schema = schema.max(maxText);
			if (typeof defaultValue === "string") schemaFields[key] = schema.default(defaultValue);
			else schemaFields[key] = schema;
			continue;
		}
		if (type === "enum") {
			if (!options || options.length === 0) {
				console.warn(`Missing or empty 'options' for enum setting '${key}'.`);
				continue;
			}
			const schema = z.enum(options);
			if (typeof defaultValue === "string") schemaFields[key] = schema.default(defaultValue);
			else schemaFields[key] = schema;
			continue;
		}
		if (type === "array") {
			let schema = z.array(z.string().or(z.number()));
			if (minTags && schema instanceof ZodArray) schema = schema.min(minTags);
			if (maxTags && schema instanceof ZodArray) schema = schema.max(maxTags);
			if (defaultValue && Array.isArray(defaultValue)) schema = schema.default(defaultValue);
			schemaFields[key] = schema;
			continue;
		}
		console.warn(`Unsupported setting type: ${type}`);
	}
	return z.object(schemaFields);
}
const ZodTypeToSettingType = {
	ZodString: "string",
	ZodNumber: "number",
	ZodBoolean: "boolean"
};
const minColumns = 1;
const maxColumns = 4;
const minSliderOptions = 2;
const minDropdownOptions = 2;
const minComboboxOptions = 2;
/**
* Validates the provided setting using the constraints unique to each component type.
* @throws {ZodError} Throws a ZodError if any validation fails.
*/
function validateSettingDefinitions(settings) {
	const errors = [];
	const columnsSet = /* @__PURE__ */ new Set();
	for (const setting of settings) if (setting.columns !== void 0) if (setting.columns < minColumns || setting.columns > maxColumns) errors.push({
		code: ZodIssueCode.custom,
		message: `Invalid columns value for setting ${setting.key}. Must be between ${minColumns} and ${maxColumns}.`,
		path: ["columns"]
	});
	else columnsSet.add(setting.columns);
	const columns = columnsSet.size === 1 ? columnsSet.values().next().value : 2;
	for (const setting of settings) {
		for (const field of requiredSettingFields) if (setting[field] === void 0) errors.push({
			code: ZodIssueCode.custom,
			message: `Missing required field ${field} for setting ${setting.key}.`,
			path: [field]
		});
		const settingTypes = Object.values(SettingTypes);
		if (!settingTypes.includes(setting.type)) errors.push({
			code: ZodIssueCode.custom,
			message: `Invalid type for setting ${setting.key}. Must be one of ${settingTypes.join(", ")}.`,
			path: ["type"]
		});
		if (setting.component === "tags" && setting.type !== "array" || setting.component !== "tags" && setting.type === "array") errors.push({
			code: ZodIssueCode.custom,
			message: `Tags component for setting ${setting.key} must have type array.`,
			path: ["type"]
		});
		if (setting.component === "tags") {
			if (setting.minTags !== void 0 && setting.minTags < 0) errors.push({
				code: ZodIssueCode.custom,
				message: `Invalid minTags value for setting ${setting.key}. Must be non-negative.`,
				path: ["minTags"]
			});
			if (setting.maxTags !== void 0 && setting.maxTags < 0) errors.push({
				code: ZodIssueCode.custom,
				message: `Invalid maxTags value for setting ${setting.key}. Must be non-negative.`,
				path: ["maxTags"]
			});
			if (setting.default && !Array.isArray(setting.default)) errors.push({
				code: ZodIssueCode.custom,
				message: `Invalid default value for setting ${setting.key}. Must be an array.`,
				path: ["default"]
			});
			if (setting.default && setting.maxTags && setting.default.length > setting.maxTags) errors.push({
				code: ZodIssueCode.custom,
				message: `Invalid default value for setting ${setting.key}. Must have at most ${setting.maxTags} tags.`,
				path: ["default"]
			});
			if (setting.default && setting.minTags && setting.default.length < setting.minTags) errors.push({
				code: ZodIssueCode.custom,
				message: `Invalid default value for setting ${setting.key}. Must have at least ${setting.minTags} tags.`,
				path: ["default"]
			});
			if (!setting.default) setting.default = [];
		}
		if (setting.component === "input" || setting.component === "textarea") {
			if (setting.type === "number" && setting.component === "textarea") errors.push({
				code: ZodIssueCode.custom,
				message: `Textarea component for setting ${setting.key} must have type string.`,
				path: ["type"]
			});
			if (setting.minText !== void 0 && setting.maxText !== void 0 && setting.minText > setting.maxText) errors.push({
				code: ZodIssueCode.custom,
				message: `For setting ${setting.key}, minText cannot be greater than maxText.`,
				path: [
					setting.key,
					"minText",
					"maxText"
				]
			});
			if (!setting.placeholder) setting.placeholder = "";
		}
		if (setting.component === "slider") {
			if (setting.type === "number" && !setting.range) errors.push({
				code: ZodIssueCode.custom,
				message: `Slider component for setting ${setting.key} must have a range if type is number.`,
				path: ["range"]
			});
			if (setting.type === "enum" && (!setting.options || setting.options.length < minSliderOptions)) errors.push({
				code: ZodIssueCode.custom,
				message: `Slider component for setting ${setting.key} requires at least ${minSliderOptions} options for enum type.`,
				path: ["options"]
			});
			setting.includeInput = setting.type === "number" ? setting.includeInput ?? true : false;
		}
		if (setting.component === "slider" && setting.type === "number") {
			if (setting.default === void 0 && setting.range) setting.default = Math.round((setting.range.min + setting.range.max) / 2);
		}
		if (setting.component === "checkbox" || setting.component === "switch") {
			if (setting.options && setting.options.length > 2) errors.push({
				code: ZodIssueCode.custom,
				message: `Checkbox/Switch component for setting ${setting.key} must have 1-2 options.`,
				path: ["options"]
			});
			if (!setting.default && setting.type === "boolean") setting.default = false;
		}
		if (setting.component === "dropdown") {
			if (!setting.options || setting.options.length < minDropdownOptions) errors.push({
				code: ZodIssueCode.custom,
				message: `Dropdown component for setting ${setting.key} requires at least ${minDropdownOptions} options.`,
				path: ["options"]
			});
			if (!setting.default && setting.options && setting.options.length > 0) setting.default = setting.options[0];
		}
		if (setting.component === "combobox") {
			if (!setting.options || setting.options.length < minComboboxOptions) errors.push({
				code: ZodIssueCode.custom,
				message: `Combobox component for setting ${setting.key} requires at least ${minComboboxOptions} options.`,
				path: ["options"]
			});
			if (!setting.default && setting.options && setting.options.length > 0) setting.default = setting.options[0];
		}
		if (!setting.columnSpan) setting.columnSpan = Math.floor((columns ?? 0) / 2);
		if (!setting.label) setting.label = setting.key;
		if (setting.component === "input" || setting.component === "textarea") {
			if (setting.minText !== void 0 && setting.minText < 0) errors.push({
				code: ZodIssueCode.custom,
				message: `Invalid minText value for setting ${setting.key}. Must be non-negative.`,
				path: ["minText"]
			});
			if (setting.maxText !== void 0 && setting.maxText < 0) errors.push({
				code: ZodIssueCode.custom,
				message: `Invalid maxText value for setting ${setting.key}. Must be non-negative.`,
				path: ["maxText"]
			});
		}
		if (setting.optionType !== "custom") {
			const conversationSchema = tConversationSchema.shape[setting.key];
			if (!conversationSchema) errors.push({
				code: ZodIssueCode.custom,
				message: `Setting ${setting.key} with optionType "${setting.optionType}" must be defined in tConversationSchema.`,
				path: ["optionType"]
			});
			else if ((ZodTypeToSettingType[conversationSchema._def.typeName] || null) !== setting.type) errors.push({
				code: ZodIssueCode.custom,
				message: `Setting ${setting.key} with optionType "${setting.optionType}" must match the type defined in tConversationSchema.`,
				path: ["optionType"]
			});
		}
		if (setting.type === "number" && isNaN(setting.default) && setting.default != null) errors.push({
			code: ZodIssueCode.custom,
			message: `Invalid default value for setting ${setting.key}. Must be a number.`,
			path: ["default"]
		});
		if (setting.type === "boolean" && typeof setting.default !== "boolean" && setting.default != null) errors.push({
			code: ZodIssueCode.custom,
			message: `Invalid default value for setting ${setting.key}. Must be a boolean.`,
			path: ["default"]
		});
		if ((setting.type === "string" || setting.type === "enum") && typeof setting.default !== "string" && setting.default != null) errors.push({
			code: ZodIssueCode.custom,
			message: `Invalid default value for setting ${setting.key}. Must be a string.`,
			path: ["default"]
		});
		if (setting.type === "enum" && setting.options && !setting.options.includes(setting.default)) errors.push({
			code: ZodIssueCode.custom,
			message: `Invalid default value for setting ${setting.key}. Must be one of the options: [${setting.options.join(", ")}].`,
			path: ["default"]
		});
		if (setting.type === "number" && setting.range && typeof setting.default === "number" && (setting.default < setting.range.min || setting.default > setting.range.max)) errors.push({
			code: ZodIssueCode.custom,
			message: `Invalid default value for setting ${setting.key}. Must be within the range [${setting.range.min}, ${setting.range.max}].`,
			path: ["default"]
		});
		if (setting.enumMappings && setting.type === "enum" && setting.options) {
			for (const option of setting.options) if (!(option in setting.enumMappings)) errors.push({
				code: ZodIssueCode.custom,
				message: `Missing enumMapping for option "${option}" in setting ${setting.key}.`,
				path: ["enumMappings"]
			});
		}
	}
	if (errors.length > 0) throw new ZodError(errors);
}
const generateOpenAISchema = (customOpenAI) => {
	const defaults = {
		...openAISettings,
		...customOpenAI
	};
	return tConversationSchema.pick({
		model: true,
		chatGptLabel: true,
		promptPrefix: true,
		temperature: true,
		top_p: true,
		presence_penalty: true,
		frequency_penalty: true,
		resendFiles: true,
		imageDetail: true,
		maxContextTokens: true
	}).transform((obj) => ({
		...obj,
		model: obj.model ?? defaults.model.default,
		chatGptLabel: obj.chatGptLabel ?? null,
		promptPrefix: obj.promptPrefix ?? null,
		temperature: obj.temperature ?? defaults.temperature.default,
		top_p: obj.top_p ?? defaults.top_p.default,
		presence_penalty: obj.presence_penalty ?? defaults.presence_penalty.default,
		frequency_penalty: obj.frequency_penalty ?? defaults.frequency_penalty.default,
		resendFiles: typeof obj.resendFiles === "boolean" ? obj.resendFiles : defaults.resendFiles.default,
		imageDetail: obj.imageDetail ?? defaults.imageDetail.default,
		maxContextTokens: obj.maxContextTokens ?? void 0
	})).catch(() => ({
		model: defaults.model.default,
		chatGptLabel: null,
		promptPrefix: null,
		temperature: defaults.temperature.default,
		top_p: defaults.top_p.default,
		presence_penalty: defaults.presence_penalty.default,
		frequency_penalty: defaults.frequency_penalty.default,
		resendFiles: defaults.resendFiles.default,
		imageDetail: defaults.imageDetail.default,
		maxContextTokens: void 0
	}));
};
const generateGoogleSchema = (customGoogle) => {
	const defaults = {
		...googleSettings,
		...customGoogle
	};
	return tConversationSchema.pick({
		model: true,
		modelLabel: true,
		promptPrefix: true,
		examples: true,
		temperature: true,
		maxOutputTokens: true,
		topP: true,
		topK: true,
		maxContextTokens: true
	}).transform((obj) => {
		return {
			...obj,
			model: obj.model ?? defaults.model.default,
			modelLabel: obj.modelLabel ?? null,
			promptPrefix: obj.promptPrefix ?? null,
			examples: obj.examples ?? [{
				input: { content: "" },
				output: { content: "" }
			}],
			temperature: obj.temperature ?? defaults.temperature.default,
			maxOutputTokens: obj.maxOutputTokens ?? defaults.maxOutputTokens.reset(obj.model ?? defaults.model.default),
			topP: obj.topP ?? defaults.topP.default,
			topK: obj.topK ?? defaults.topK.default,
			maxContextTokens: obj.maxContextTokens ?? void 0
		};
	}).catch(() => ({
		model: defaults.model.default,
		modelLabel: null,
		promptPrefix: null,
		examples: [{
			input: { content: "" },
			output: { content: "" }
		}],
		temperature: defaults.temperature.default,
		maxOutputTokens: defaults.maxOutputTokens.default,
		topP: defaults.topP.default,
		topK: defaults.topK.default,
		maxContextTokens: void 0
	}));
};
//#endregion
//#region src/limits.ts
/** Maximum number of explicit subagents per parent agent. UI + Zod schema share this. */
const MAX_SUBAGENTS = 10;
//#endregion
//#region src/models.ts
const modelSpecSubagentsSchema = z.object({
	enabled: z.boolean().optional(),
	allowSelf: z.boolean().optional(),
	agent_ids: z.array(z.string()).max(10).optional()
});
const tModelSpecSchema = z.object({
	name: z.string(),
	label: z.string(),
	preset: tModelSpecPresetSchema,
	order: z.number().optional(),
	default: z.boolean().optional(),
	softDefault: z.boolean().optional(),
	description: z.string().optional(),
	group: z.string().optional(),
	groupIcon: z.union([z.string(), eModelEndpointSchema]).optional(),
	showIconInMenu: z.boolean().optional(),
	showIconInHeader: z.boolean().optional(),
	showOnLanding: z.boolean().optional(),
	conversation_starters: z.array(z.string()).optional(),
	iconURL: z.union([z.string(), eModelEndpointSchema]).optional(),
	authType: authTypeSchema.optional(),
	hideBadgeRow: z.boolean().optional(),
	webSearch: z.boolean().optional(),
	fileSearch: z.boolean().optional(),
	executeCode: z.boolean().optional(),
	artifacts: z.union([z.string(), z.boolean()]).optional(),
	mcpServers: z.array(z.string()).optional(),
	skills: z.union([z.boolean(), z.array(z.string())]).optional(),
	subagents: modelSpecSubagentsSchema.optional()
});
const specsConfigSchema = z.object({
	enforce: z.boolean().default(false),
	prioritize: z.boolean().default(true),
	list: z.array(tModelSpecSchema).default([]),
	addedEndpoints: z.array(z.union([z.string(), eModelEndpointSchema])).optional()
});
//#endregion
//#region src/balance.ts
const REFILL_INTERVAL_UNITS = [
	"seconds",
	"minutes",
	"hours",
	"days",
	"weeks",
	"months"
];
function getRefillEligibilityDate(lastRefill, value, unit) {
	const result = new Date(lastRefill);
	switch (unit) {
		case "seconds":
			result.setSeconds(result.getSeconds() + value);
			return result;
		case "minutes":
			result.setMinutes(result.getMinutes() + value);
			return result;
		case "hours":
			result.setHours(result.getHours() + value);
			return result;
		case "days":
			result.setDate(result.getDate() + value);
			return result;
		case "weeks":
			result.setDate(result.getDate() + value * 7);
			return result;
		case "months":
			result.setMonth(result.getMonth() + value);
			return result;
		default: return result;
	}
}
//#endregion
//#region src/file-config.ts
const supportsFiles = {
	["openAI"]: true,
	["google"]: true,
	["assistants"]: true,
	["azureAssistants"]: true,
	["agents"]: true,
	["azureOpenAI"]: true,
	["anthropic"]: true,
	["custom"]: true,
	["bedrock"]: true
};
const excelFileTypes = [
	"application/vnd.ms-excel",
	"application/msexcel",
	"application/x-msexcel",
	"application/x-ms-excel",
	"application/x-excel",
	"application/x-dos_ms_excel",
	"application/xls",
	"application/x-xls",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];
const fullMimeTypesList = [
	"text/x-c",
	"text/x-c++",
	"application/csv",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"text/html",
	"text/x-java",
	"application/json",
	"text/markdown",
	"application/pdf",
	"text/x-php",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"text/x-python",
	"text/x-script.python",
	"text/x-ruby",
	"text/x-tex",
	"text/plain",
	"text/css",
	"text/calendar",
	"text/vtt",
	"image/jpeg",
	"text/javascript",
	"image/gif",
	"image/png",
	"image/heic",
	"image/heif",
	"application/x-tar",
	"application/x-sh",
	"application/typescript",
	"application/sql",
	"application/yaml",
	"application/vnd.coffeescript",
	"application/xml",
	"application/zip",
	"application/x-zip-compressed",
	"application/x-parquet",
	"application/vnd.oasis.opendocument.text",
	"application/vnd.oasis.opendocument.spreadsheet",
	"application/vnd.oasis.opendocument.presentation",
	"application/vnd.oasis.opendocument.graphics",
	"image/svg",
	"image/svg+xml",
	"video/mp4",
	"video/avi",
	"video/mov",
	"video/wmv",
	"video/flv",
	"video/webm",
	"video/mkv",
	"video/m4v",
	"video/3gp",
	"video/ogv",
	"audio/mp3",
	"audio/wav",
	"audio/ogg",
	"audio/m4a",
	"audio/aac",
	"audio/flac",
	"audio/wma",
	"audio/opus",
	"audio/mpeg",
	...excelFileTypes
];
const codeInterpreterMimeTypesList = [
	"text/x-c",
	"text/x-c++",
	"application/csv",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"text/html",
	"text/x-java",
	"application/json",
	"text/markdown",
	"application/pdf",
	"text/x-php",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"text/x-python",
	"text/x-script.python",
	"text/x-ruby",
	"text/x-tex",
	"text/plain",
	"text/css",
	"text/calendar",
	"image/jpeg",
	"text/javascript",
	"image/gif",
	"image/png",
	"image/heic",
	"image/heif",
	"application/x-tar",
	"application/typescript",
	"application/xml",
	"application/zip",
	"application/x-zip-compressed",
	"application/x-parquet",
	...excelFileTypes
];
const retrievalMimeTypesList = [
	"text/x-c",
	"text/x-c++",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"text/html",
	"text/x-java",
	"application/json",
	"text/markdown",
	"application/pdf",
	"text/x-php",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"text/x-python",
	"text/x-script.python",
	"text/x-ruby",
	"text/x-tex",
	"text/plain"
];
const imageExtRegex = /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i;
/** Maps MIME types to Bedrock Converse API document format values */
const bedrockDocumentFormats = {
	"application/pdf": "pdf",
	"text/csv": "csv",
	"application/csv": "csv",
	"application/msword": "doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
	"application/vnd.ms-excel": "xls",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
	"text/html": "html",
	"text/plain": "txt",
	"text/markdown": "md"
};
const isBedrockDocumentType = (mimeType) => mimeType != null && mimeType in bedrockDocumentFormats;
/** File extensions accepted by Bedrock document uploads (for input accept attributes) */
const bedrockDocumentExtensions = ".pdf,.csv,.doc,.docx,.xls,.xlsx,.html,.htm,.txt,.md,application/pdf,text/csv,application/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/html,text/plain,text/markdown";
const excelMimeTypes = /^application\/(vnd\.ms-excel|msexcel|x-msexcel|x-ms-excel|x-excel|x-dos_ms_excel|xls|x-xls|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/;
const textMimeTypes = /^(text\/(x-c|x-csharp|tab-separated-values|x-c\+\+|x-h|x-java|html|markdown|x-php|x-python|x-script\.python|x-ruby|x-tex|plain|css|vtt|javascript|csv|xml|calendar))$/;
const applicationMimeTypes = /^(application\/(epub\+zip|csv|json|msword|pdf|x-tar|x-sh|x-zip-compressed|typescript|sql|yaml|x-parquet|vnd\.apache\.parquet|vnd\.coffeescript|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation|spreadsheetml\.sheet)|vnd\.oasis\.opendocument\.(text|spreadsheet|presentation|graphics)|xml|zip))$/;
const imageMimeTypes = /^image\/(jpeg|gif|png|webp|heic|heif)$/;
const audioMimeTypes = /^audio\/(mp3|mpeg|mpeg3|wav|wave|x-wav|ogg|vorbis|mp4|m4a|x-m4a|flac|x-flac|webm|aac|wma|opus)$/;
const videoMimeTypes = /^video\/(mp4|avi|mov|wmv|flv|webm|mkv|m4v|3gp|ogv)$/;
const defaultOCRMimeTypes = [
	imageMimeTypes,
	excelMimeTypes,
	/^application\/pdf$/,
	/^application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation)$/,
	/^application\/vnd\.ms-(word|powerpoint)$/,
	/^application\/epub\+zip$/,
	/^application\/vnd\.oasis\.opendocument\.(text|spreadsheet|presentation|graphics)$/
];
/** MIME types handled by the built-in document parser (pdf, docx, excel variants, ods/odt) */
const documentParserMimeTypes = [
	excelMimeTypes,
	/^application\/pdf$/,
	/^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/,
	/^application\/vnd\.oasis\.opendocument\.spreadsheet$/,
	/^application\/vnd\.oasis\.opendocument\.text$/
];
const defaultTextMimeTypes = [/^[\w.-]+\/[\w.-]+$/];
const defaultSTTMimeTypes = [audioMimeTypes];
const supportedMimeTypes = [
	textMimeTypes,
	excelMimeTypes,
	applicationMimeTypes,
	imageMimeTypes,
	videoMimeTypes,
	audioMimeTypes,
	/^image\/(svg|svg\+xml)$/
];
const codeInterpreterMimeTypes = [
	textMimeTypes,
	excelMimeTypes,
	applicationMimeTypes,
	imageMimeTypes
];
const codeTypeMapping = {
	c: "text/x-c",
	cs: "text/x-csharp",
	cpp: "text/x-c++",
	h: "text/x-h",
	md: "text/markdown",
	php: "text/x-php",
	py: "text/x-python",
	rb: "text/x-ruby",
	tex: "text/x-tex",
	java: "text/x-java",
	js: "text/javascript",
	sh: "application/x-sh",
	ts: "application/typescript",
	tar: "application/x-tar",
	zip: "application/zip",
	txt: "text/plain",
	log: "text/plain",
	csv: "text/csv",
	tsv: "text/tab-separated-values",
	parquet: "application/x-parquet",
	json: "application/json",
	xml: "application/xml",
	html: "text/html",
	htm: "text/html",
	css: "text/css",
	yml: "application/yaml",
	yaml: "application/yaml",
	sql: "application/sql",
	dart: "text/plain",
	coffee: "application/vnd.coffeescript",
	go: "text/plain",
	rs: "text/plain",
	swift: "text/plain",
	kt: "text/plain",
	kts: "text/plain",
	scala: "text/plain",
	lua: "text/plain",
	r: "text/plain",
	pl: "text/plain",
	pm: "text/plain",
	groovy: "text/plain",
	gradle: "text/plain",
	clj: "text/plain",
	cljs: "text/plain",
	cljc: "text/plain",
	elm: "text/plain",
	erl: "text/plain",
	hrl: "text/plain",
	ex: "text/plain",
	exs: "text/plain",
	hs: "text/plain",
	lhs: "text/plain",
	ml: "text/plain",
	mli: "text/plain",
	fs: "text/plain",
	fsx: "text/plain",
	lisp: "text/plain",
	cl: "text/plain",
	scm: "text/plain",
	rkt: "text/plain",
	jsx: "text/plain",
	tsx: "text/plain",
	vue: "text/plain",
	svelte: "text/plain",
	astro: "text/plain",
	scss: "text/plain",
	sass: "text/plain",
	less: "text/plain",
	styl: "text/plain",
	toml: "text/plain",
	ini: "text/plain",
	cfg: "text/plain",
	conf: "text/plain",
	env: "text/plain",
	properties: "text/plain",
	graphql: "text/plain",
	gql: "text/plain",
	proto: "text/plain",
	dockerfile: "text/plain",
	makefile: "text/plain",
	cmake: "text/plain",
	rake: "text/plain",
	gemspec: "text/plain",
	bash: "text/plain",
	zsh: "text/plain",
	fish: "text/plain",
	ps1: "text/plain",
	psm1: "text/plain",
	bat: "text/plain",
	cmd: "text/plain",
	asm: "text/plain",
	s: "text/plain",
	v: "text/plain",
	zig: "text/plain",
	nim: "text/plain",
	cr: "text/plain",
	d: "text/plain",
	pas: "text/plain",
	pp: "text/plain",
	f90: "text/plain",
	f95: "text/plain",
	f03: "text/plain",
	jl: "text/plain",
	m: "text/plain",
	mm: "text/plain",
	ada: "text/plain",
	adb: "text/plain",
	ads: "text/plain",
	cob: "text/plain",
	cbl: "text/plain",
	tcl: "text/plain",
	awk: "text/plain",
	sed: "text/plain",
	odt: "application/vnd.oasis.opendocument.text",
	ods: "application/vnd.oasis.opendocument.spreadsheet",
	odp: "application/vnd.oasis.opendocument.presentation",
	odg: "application/vnd.oasis.opendocument.graphics",
	ics: "text/calendar",
	ical: "text/calendar",
	ifb: "text/calendar",
	icalendar: "text/calendar"
};
/** Maps image extensions to MIME types for formats browsers may not recognize */
const imageTypeMapping = {
	heic: "image/heic",
	heif: "image/heif"
};
/** Normalizes non-standard MIME types that browsers may report to their canonical forms */
const mimeTypeAliases = {
	"application/x-zip-compressed": "application/zip",
	"text/x-python-script": "text/x-python",
	"text/x-markdown": "text/markdown"
};
/**
* Infers the MIME type from a file's extension when the browser doesn't recognize it,
* and normalizes known non-standard MIME type aliases to their canonical forms.
* @param fileName - The file name including its extension
* @param currentType - The MIME type reported by the browser (may be empty string)
* @returns The normalized or inferred MIME type; empty string if unresolvable
*/
function inferMimeType(fileName, currentType) {
	if (currentType) return mimeTypeAliases[currentType] ?? currentType;
	const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
	return codeTypeMapping[extension] || imageTypeMapping[extension] || currentType;
}
const retrievalMimeTypes = [/^(text\/(x-c|x-c\+\+|x-h|html|x-java|markdown|x-php|x-python|x-script\.python|x-ruby|x-tex|plain|vtt|xml))$/, /^(application\/(json|pdf|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation)))$/];
const megabyte = 1024 * 1024;
/** Helper function to get megabytes value */
const mbToBytes = (mb) => mb * megabyte;
const defaultSizeLimit = mbToBytes(512);
const defaultSkillImportSizeLimit = mbToBytes(50);
const defaultTokenLimit = 1e5;
const assistantsFileConfig = {
	fileLimit: 10,
	fileSizeLimit: defaultSizeLimit,
	totalSizeLimit: defaultSizeLimit,
	supportedMimeTypes,
	disabled: false
};
const fileConfig = {
	endpoints: {
		["assistants"]: assistantsFileConfig,
		["azureAssistants"]: assistantsFileConfig,
		["agents"]: assistantsFileConfig,
		["anthropic"]: {
			fileLimit: 10,
			fileSizeLimit: defaultSizeLimit,
			totalSizeLimit: defaultSizeLimit,
			supportedMimeTypes,
			disabled: false
		},
		default: {
			fileLimit: 10,
			fileSizeLimit: defaultSizeLimit,
			totalSizeLimit: defaultSizeLimit,
			supportedMimeTypes,
			disabled: false
		}
	},
	skills: { fileSizeLimit: defaultSkillImportSizeLimit },
	serverFileSizeLimit: defaultSizeLimit,
	avatarSizeLimit: mbToBytes(2),
	fileTokenLimit: defaultTokenLimit,
	clientImageResize: {
		enabled: false,
		maxWidth: 1900,
		maxHeight: 1900,
		quality: .92
	},
	ocr: { supportedMimeTypes: defaultOCRMimeTypes },
	text: { supportedMimeTypes: defaultTextMimeTypes },
	stt: { supportedMimeTypes: defaultSTTMimeTypes },
	checkType: function(fileType, supportedTypes = supportedMimeTypes) {
		return supportedTypes.some((regex) => regex.test(fileType));
	}
};
const supportedMimeTypesSchema = z.array(z.string()).optional();
const endpointFileConfigSchema = z.object({
	disabled: z.boolean().optional(),
	fileLimit: z.number().min(0).optional(),
	fileSizeLimit: z.number().min(0).optional(),
	totalSizeLimit: z.number().min(0).optional(),
	supportedMimeTypes: supportedMimeTypesSchema.optional()
});
const skillFileConfigSchema = z.object({ fileSizeLimit: z.number().min(0).optional() });
const fileConfigSchema = z.object({
	endpoints: z.record(endpointFileConfigSchema).optional(),
	skills: skillFileConfigSchema.optional(),
	serverFileSizeLimit: z.number().min(0).optional(),
	avatarSizeLimit: z.number().min(0).optional(),
	fileTokenLimit: z.number().min(0).optional(),
	imageGeneration: z.object({
		percentage: z.number().min(0).max(100).optional(),
		px: z.number().min(0).optional()
	}).optional(),
	clientImageResize: z.object({
		enabled: z.boolean().optional(),
		maxWidth: z.number().min(0).optional(),
		maxHeight: z.number().min(0).optional(),
		quality: z.number().min(0).max(1).optional()
	}).optional(),
	ocr: z.object({ supportedMimeTypes: supportedMimeTypesSchema.optional() }).optional(),
	text: z.object({ supportedMimeTypes: supportedMimeTypesSchema.optional() }).optional()
});
/** Helper function to safely convert string patterns to RegExp objects */
const convertStringsToRegex = (patterns) => patterns.reduce((acc, pattern) => {
	try {
		const regex = new RegExp(pattern);
		acc.push(regex);
	} catch (error) {
		console.error(`Invalid regex pattern "${pattern}" skipped.`, error);
	}
	return acc;
}, []);
/** Detects whether the given MIME type patterns accept all file types (e.g., `.*` or `.+`). */
const isPermissiveMimeConfig = (types) => {
	if (!types || types.length === 0) return false;
	return types.some((regex) => regex.test("x-librechat/x-probe"));
};
/**
* Gets the appropriate endpoint file configuration with standardized lookup logic.
*
* @param params - Object containing fileConfig, endpoint, and optional conversationEndpoint
* @param params.fileConfig - The merged file configuration
* @param params.endpoint - The endpoint name to look up
* @param params.conversationEndpoint - Optional conversation endpoint for additional context
* @returns The endpoint file configuration or undefined
*/
/**
* Merges an endpoint config with the default config to ensure all fields are populated.
* For document-supported providers, uses the comprehensive MIME type list (includes videos/audio).
*/
function mergeWithDefault(endpointConfig, defaultConfig, endpoint) {
	/** Use comprehensive MIME types for document-supported providers */
	const defaultMimeTypes = isDocumentSupportedProvider(endpoint) ? supportedMimeTypes : defaultConfig.supportedMimeTypes;
	return {
		disabled: endpointConfig.disabled ?? defaultConfig.disabled,
		fileLimit: endpointConfig.fileLimit ?? defaultConfig.fileLimit,
		fileSizeLimit: endpointConfig.fileSizeLimit ?? defaultConfig.fileSizeLimit,
		totalSizeLimit: endpointConfig.totalSizeLimit ?? defaultConfig.totalSizeLimit,
		supportedMimeTypes: endpointConfig.supportedMimeTypes ?? defaultMimeTypes
	};
}
function getEndpointFileConfig(params) {
	const { fileConfig: mergedFileConfig, endpoint, endpointType } = params;
	if (!mergedFileConfig?.endpoints) return fileConfig.endpoints.default;
	/** Compute an effective default by merging user-configured default over the base default */
	const baseDefaultConfig = fileConfig.endpoints.default;
	const userDefaultConfig = mergedFileConfig.endpoints.default;
	const defaultConfig = userDefaultConfig ? mergeWithDefault(userDefaultConfig, baseDefaultConfig, "default") : baseDefaultConfig;
	const normalizedEndpoint = normalizeEndpointName(endpoint ?? "");
	const standardEndpoints = new Set([
		"default",
		"agents",
		"assistants",
		"azureAssistants",
		"openAI",
		"azureOpenAI",
		"anthropic",
		"google",
		"bedrock"
	]);
	const normalizedEndpointType = normalizeEndpointName(endpointType ?? "");
	if (endpointType === "custom" || !standardEndpoints.has(normalizedEndpointType) && normalizedEndpoint && !standardEndpoints.has(normalizedEndpoint)) {
		/** 1. Check direct endpoint lookup (could be normalized or not) */
		if (endpoint && mergedFileConfig.endpoints[endpoint]) return mergeWithDefault(mergedFileConfig.endpoints[endpoint], defaultConfig, endpoint);
		/** 2. Check normalized endpoint lookup (skip standard endpoint keys) */
		for (const key in mergedFileConfig.endpoints) if (!standardEndpoints.has(key) && normalizeEndpointName(key) === normalizedEndpoint) return mergeWithDefault(mergedFileConfig.endpoints[key], defaultConfig, key);
		/** 3. Fallback to generic 'custom' config if any */
		if (mergedFileConfig.endpoints["custom"]) return mergeWithDefault(mergedFileConfig.endpoints["custom"], defaultConfig, endpoint);
		/** 4. Fallback to 'agents' (all custom endpoints are non-assistants) */
		if (mergedFileConfig.endpoints["agents"]) return mergeWithDefault(mergedFileConfig.endpoints["agents"], defaultConfig, endpoint);
		/** 5. Fallback to default */
		return defaultConfig;
	}
	/** Check endpointType first (most reliable for standard endpoints) */
	if (endpointType && mergedFileConfig.endpoints[endpointType]) return mergeWithDefault(mergedFileConfig.endpoints[endpointType], defaultConfig, endpointType);
	/** Check direct endpoint lookup */
	if (endpoint && mergedFileConfig.endpoints[endpoint]) return mergeWithDefault(mergedFileConfig.endpoints[endpoint], defaultConfig, endpoint);
	/** Check normalized endpoint */
	if (normalizedEndpoint && mergedFileConfig.endpoints[normalizedEndpoint]) return mergeWithDefault(mergedFileConfig.endpoints[normalizedEndpoint], defaultConfig, normalizedEndpoint);
	if (isAgentsEndpoint(normalizedEndpointType || normalizedEndpoint) && mergedFileConfig.endpoints["agents"]) return mergeWithDefault(mergedFileConfig.endpoints["agents"], defaultConfig, "agents");
	/** Return default config */
	return defaultConfig;
}
function mergeFileConfig(dynamic) {
	const mergedConfig = {
		...fileConfig,
		endpoints: { ...fileConfig.endpoints },
		skills: { ...fileConfig.skills },
		ocr: {
			...fileConfig.ocr,
			supportedMimeTypes: fileConfig.ocr?.supportedMimeTypes || []
		},
		text: {
			...fileConfig.text,
			supportedMimeTypes: fileConfig.text?.supportedMimeTypes || []
		},
		stt: {
			...fileConfig.stt,
			supportedMimeTypes: fileConfig.stt?.supportedMimeTypes || []
		}
	};
	if (!dynamic) return mergedConfig;
	if (dynamic.serverFileSizeLimit !== void 0) mergedConfig.serverFileSizeLimit = mbToBytes(dynamic.serverFileSizeLimit);
	if (dynamic.avatarSizeLimit !== void 0) mergedConfig.avatarSizeLimit = mbToBytes(dynamic.avatarSizeLimit);
	if (dynamic.fileTokenLimit !== void 0) mergedConfig.fileTokenLimit = dynamic.fileTokenLimit;
	if (dynamic.skills?.fileSizeLimit !== void 0) mergedConfig.skills = {
		...mergedConfig.skills,
		fileSizeLimit: mbToBytes(dynamic.skills.fileSizeLimit)
	};
	if (dynamic.clientImageResize !== void 0) mergedConfig.clientImageResize = {
		...mergedConfig.clientImageResize,
		...dynamic.clientImageResize
	};
	if (dynamic.ocr !== void 0) {
		const { supportedMimeTypes: ocrMimeTypes, ...ocrRest } = dynamic.ocr;
		mergedConfig.ocr = {
			...mergedConfig.ocr,
			...ocrRest
		};
		if (ocrMimeTypes) mergedConfig.ocr.supportedMimeTypes = convertStringsToRegex(ocrMimeTypes);
	}
	if (dynamic.text !== void 0) {
		const { supportedMimeTypes: textMimeTypes, ...textRest } = dynamic.text;
		mergedConfig.text = {
			...mergedConfig.text,
			...textRest
		};
		if (textMimeTypes) mergedConfig.text.supportedMimeTypes = convertStringsToRegex(textMimeTypes);
	}
	if (!dynamic.endpoints) return mergedConfig;
	for (const key in dynamic.endpoints) {
		const dynamicEndpoint = dynamic.endpoints[key];
		/** Deep copy the base endpoint config if it exists to prevent mutation */
		if (!mergedConfig.endpoints[key]) mergedConfig.endpoints[key] = {};
		else mergedConfig.endpoints[key] = { ...mergedConfig.endpoints[key] };
		const mergedEndpoint = mergedConfig.endpoints[key];
		if (dynamicEndpoint.disabled === true) {
			mergedEndpoint.disabled = true;
			mergedEndpoint.fileLimit = 0;
			mergedEndpoint.fileSizeLimit = 0;
			mergedEndpoint.totalSizeLimit = 0;
			mergedEndpoint.supportedMimeTypes = [];
			continue;
		}
		if (dynamicEndpoint.fileSizeLimit !== void 0) mergedEndpoint.fileSizeLimit = mbToBytes(dynamicEndpoint.fileSizeLimit);
		if (dynamicEndpoint.totalSizeLimit !== void 0) mergedEndpoint.totalSizeLimit = mbToBytes(dynamicEndpoint.totalSizeLimit);
		["fileLimit"].forEach((field) => {
			if (dynamicEndpoint[field] !== void 0) mergedEndpoint[field] = dynamicEndpoint[field];
		});
		if (dynamicEndpoint.disabled !== void 0) mergedEndpoint.disabled = dynamicEndpoint.disabled;
		if (dynamicEndpoint.supportedMimeTypes) mergedEndpoint.supportedMimeTypes = convertStringsToRegex(dynamicEndpoint.supportedMimeTypes);
	}
	return mergedConfig;
}
//#endregion
//#region src/api-endpoints.ts
let BASE_URL = "";
if (typeof process === "undefined" || process.browser === true) BASE_URL = document.querySelector("base")?.getAttribute("href") || "/";
if (BASE_URL && BASE_URL.endsWith("/")) BASE_URL = BASE_URL.slice(0, -1);
const apiBaseUrl = () => BASE_URL;
const buildQuery = (params) => {
	const query = Object.entries(params).filter(([, value]) => {
		if (Array.isArray(value)) return value.length > 0;
		return value !== void 0 && value !== null && value !== "";
	}).map(([key, value]) => {
		if (Array.isArray(value)) return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
		return `${key}=${encodeURIComponent(String(value))}`;
	}).join("&");
	return query ? `?${query}` : "";
};
const health = () => `${BASE_URL}/health`;
const user = () => `${BASE_URL}/api/user`;
const balance = () => `${BASE_URL}/api/balance`;
const userPlugins = () => `${BASE_URL}/api/user/plugins`;
const deleteUser$1 = () => `${BASE_URL}/api/user/delete`;
const messagesRoot = `${BASE_URL}/api/messages`;
const messages = (params) => {
	const { conversationId, messageId, ...rest } = params;
	if (conversationId && messageId) return `${messagesRoot}/${conversationId}/${messageId}`;
	if (conversationId) return `${messagesRoot}/${conversationId}`;
	return `${messagesRoot}${buildQuery(rest)}`;
};
const messagesArtifacts = (messageId) => `${messagesRoot}/artifact/${messageId}`;
const messagesBranch = () => `${messagesRoot}/branch`;
const shareRoot = `${BASE_URL}/api/share`;
const shareMessages = (shareId) => `${shareRoot}/${shareId}`;
const sharedStartupConfig = (shareId) => `${shareMessages(shareId)}/config`;
const getSharedLink$1 = (conversationId) => `${shareRoot}/link/${conversationId}`;
const getSharedLinks = (pageSize, sortBy, sortDirection, search, cursor) => `${shareRoot}?pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}${search ? `&search=${search}` : ""}${cursor ? `&cursor=${cursor}` : ""}`;
const createSharedLink$1 = (conversationId) => `${shareRoot}/${conversationId}`;
const updateSharedLink$1 = (shareId) => `${shareRoot}/${shareId}`;
/** Share-scoped file routes: serve snapshotted files via shared-link permission. */
const sharedFile = (shareId, fileId) => `${shareRoot}/${shareId}/files/${encodeURIComponent(fileId)}`;
const sharedFileDownload = (shareId, fileId) => `${sharedFile(shareId, fileId)}/download`;
const sharedFilePreview = (shareId, fileId) => `${sharedFile(shareId, fileId)}/preview`;
const keysEndpoint = `${BASE_URL}/api/keys`;
const keys = () => keysEndpoint;
const userKeyQuery$1 = (name) => `${keysEndpoint}?name=${name}`;
const revokeUserKey$1 = (name) => `${keysEndpoint}/${name}`;
const revokeAllUserKeys$1 = () => `${keysEndpoint}?all=true`;
const apiKeysEndpoint = `${BASE_URL}/api/api-keys`;
const apiKeys = () => apiKeysEndpoint;
const apiKeyById = (id) => `${apiKeysEndpoint}/${id}`;
const conversationsRoot = `${BASE_URL}/api/convos`;
const conversations = (params) => {
	return `${conversationsRoot}${buildQuery(params)}`;
};
const conversationById = (id) => `${conversationsRoot}/${id}`;
const genTitle$1 = (conversationId) => `${conversationsRoot}/gen_title/${encodeURIComponent(conversationId)}`;
const updateConversation$1 = () => `${conversationsRoot}/update`;
const archiveConversation$1 = () => `${conversationsRoot}/archive`;
const pinConversation$1 = () => `${conversationsRoot}/pin`;
const deleteConversation$1 = () => `${conversationsRoot}`;
const deleteAllConversation = () => `${conversationsRoot}/all`;
const importConversation = () => `${conversationsRoot}/import`;
const forkConversation$1 = () => `${conversationsRoot}/fork`;
const duplicateConversation$1 = () => `${conversationsRoot}/duplicate`;
const projectsRoot = `${BASE_URL}/api/projects`;
const projects = (params = {}) => {
	return `${projectsRoot}${buildQuery(params)}`;
};
const projectById = (id) => `${projectsRoot}/${encodeURIComponent(id)}`;
const projectConversation = (conversationId) => `${projectsRoot}/conversations/${encodeURIComponent(conversationId)}`;
const searchEnabled = () => `${BASE_URL}/api/search/enable`;
const presets = () => `${BASE_URL}/api/presets`;
const deletePreset$1 = () => `${BASE_URL}/api/presets/delete`;
const aiEndpoints = () => `${BASE_URL}/api/endpoints`;
const tokenConfig = () => `${BASE_URL}/api/endpoints/token-config`;
const contextProjection = () => `${BASE_URL}/api/endpoints/context-projection`;
const models = () => `${BASE_URL}/api/models`;
const tokenizer = () => `${BASE_URL}/api/tokenizer`;
const login$1 = () => `${BASE_URL}/api/auth/login`;
const logout$1 = () => `${BASE_URL}/api/auth/logout`;
const register$1 = () => `${BASE_URL}/api/auth/register`;
const loginGoogle = () => `${BASE_URL}/api/auth/google`;
const refreshToken$1 = (retry) => `${BASE_URL}/api/auth/refresh${retry === true ? "?retry=true" : ""}`;
const requestPasswordReset$1 = () => `${BASE_URL}/api/auth/requestPasswordReset`;
const resetPassword$1 = () => `${BASE_URL}/api/auth/resetPassword`;
const verifyEmail$1 = () => `${BASE_URL}/api/user/verify`;
const loginPage = () => `${BASE_URL}/login`;
const registerPage = () => `${BASE_URL}/register`;
const REDIRECT_PARAM = "redirect_to";
const LOGIN_PATH_RE = /(?:^|\/)login(?:\/|$)/;
/**
* Builds a `/login?redirect_to=...` URL from the given or current location.
* Returns plain `/login` (no param) when already on a login route to prevent recursive nesting.
*/
function buildLoginRedirectUrl(pathname, search, hash) {
	const p = pathname ?? window.location.pathname;
	if (LOGIN_PATH_RE.test(p)) return "/login";
	const s = search ?? window.location.search;
	const h = hash ?? window.location.hash;
	const currentPath = `${BASE_URL && (p === BASE_URL || p.startsWith(BASE_URL + "/")) ? p.slice(BASE_URL.length) || "/" : p}${s}${h}`;
	if (!currentPath || currentPath === "/") return "/login";
	return `/login?${REDIRECT_PARAM}=${encodeURIComponent(currentPath)}`;
}
const resendVerificationEmail$1 = () => `${BASE_URL}/api/user/verify/resend`;
const plugins = () => `${BASE_URL}/api/plugins`;
const mcpReinitialize = (serverName) => `${BASE_URL}/api/mcp/${serverName}/reinitialize`;
const mcpConnectionStatus = () => `${BASE_URL}/api/mcp/connection/status`;
const mcpServerConnectionStatus = (serverName) => `${BASE_URL}/api/mcp/connection/status/${serverName}`;
const mcpAuthValues = (serverName) => {
	return `${BASE_URL}/api/mcp/${serverName}/auth-values`;
};
const cancelMCPOAuth$1 = (serverName) => {
	return `${BASE_URL}/api/mcp/oauth/cancel/${serverName}`;
};
const mcpOAuthBind = (serverName) => `${BASE_URL}/api/mcp/${serverName}/oauth/bind`;
const actionOAuthBind = (actionId) => `${BASE_URL}/api/actions/${actionId}/oauth/bind`;
const config = (context) => `${BASE_URL}/api/config${buildQuery({ context })}`;
const prompts = () => `${BASE_URL}/api/prompts`;
const addPromptToGroup$1 = (groupId) => `${BASE_URL}/api/prompts/groups/${groupId}/prompts`;
const assistants = ({ path = "", options, version, endpoint, isAvatar }) => {
	let url = isAvatar === true ? `${images()}/assistants` : `${BASE_URL}/api/assistants/v${version}`;
	if (path && path !== "") url += `/${path}`;
	if (endpoint) options = {
		...options ?? {},
		endpoint
	};
	if (options && Object.keys(options).length > 0) {
		const queryParams = new URLSearchParams(options).toString();
		url += `?${queryParams}`;
	}
	return url;
};
const agents = ({ path = "", options }) => {
	let url = `${BASE_URL}/api/agents`;
	if (path && path !== "") url += `/${path}`;
	if (options && Object.keys(options).length > 0) {
		const queryParams = new URLSearchParams(options).toString();
		url += `?${queryParams}`;
	}
	return url;
};
const activeJobs = () => `${BASE_URL}/api/agents/chat/active`;
const mcp = {
	tools: `${BASE_URL}/api/mcp/tools`,
	servers: `${BASE_URL}/api/mcp/servers`
};
const mcpServer = (serverName) => `${BASE_URL}/api/mcp/servers/${serverName}`;
const revertAgentVersion$1 = (agent_id) => `${agents({ path: `${agent_id}/revert` })}`;
const files = () => `${BASE_URL}/api/files`;
const filePreview = (fileId) => `${BASE_URL}/api/files/${encodeURIComponent(fileId)}/preview`;
const agentFiles = (agentId) => `${BASE_URL}/api/files/agent/${agentId}`;
const images = () => `${files()}/images`;
const avatar = () => `${images()}/avatar`;
const speech = () => `${files()}/speech`;
const speechToText$1 = () => `${speech()}/stt`;
const textToSpeech$1 = () => `${speech()}/tts`;
const textToSpeechManual = () => `${textToSpeech$1()}/manual`;
const textToSpeechVoices = () => `${textToSpeech$1()}/voices`;
const getCustomConfigSpeech$1 = () => `${speech()}/config/get`;
const getPromptGroup$1 = (_id) => `${prompts()}/groups/${_id}`;
const getPromptGroupsWithFilters = (filter) => {
	let url = `${prompts()}/groups`;
	const cleanedFilter = Object.entries(filter).reduce((acc, [key, value]) => {
		if (value !== void 0 && value !== null && value !== "") acc[key] = value;
		return acc;
	}, {});
	if (Object.keys(cleanedFilter).length > 0) {
		const queryParams = new URLSearchParams(cleanedFilter).toString();
		url += `?${queryParams}`;
	}
	return url;
};
const getPromptsWithFilters = (filter) => {
	let url = prompts();
	if (Object.keys(filter).length > 0) {
		const queryParams = new URLSearchParams(filter).toString();
		url += `?${queryParams}`;
	}
	return url;
};
const getPrompt$1 = (_id) => `${prompts()}/${_id}`;
const getRandomPrompts$1 = (limit, skip) => `${prompts()}/random?limit=${limit}&skip=${skip}`;
const postPrompt = prompts;
const updatePromptGroup$1 = getPromptGroup$1;
const recordPromptGroupUsage$1 = (groupId) => `${prompts()}/groups/${groupId}/use`;
const updatePromptLabels$1 = (_id) => `${getPrompt$1(_id)}/labels`;
const updatePromptTag = (_id) => `${getPrompt$1(_id)}/tags/production`;
const deletePromptGroup$1 = getPromptGroup$1;
const deletePrompt$1 = ({ _id, groupId }) => {
	return `${prompts()}/${_id}?groupId=${groupId}`;
};
const getCategories$1 = () => `${BASE_URL}/api/categories`;
const getAllPromptGroups$1 = () => `${prompts()}/all`;
const skills = () => `${BASE_URL}/api/skills`;
const importSkill$1 = () => `${skills()}/import`;
const getSkill$1 = (id) => `${skills()}/${encodeURIComponent(id)}`;
const listSkillsWithFilters = (filter) => {
	const cleaned = Object.entries(filter).reduce((acc, [key, value]) => {
		if (value !== void 0 && value !== null && value !== "") acc[key] = String(value);
		return acc;
	}, {});
	const query = Object.keys(cleaned).length > 0 ? `?${new URLSearchParams(cleaned).toString()}` : "";
	return `${skills()}${query}`;
};
const skillFiles = (id) => `${getSkill$1(id)}/files`;
const skillFile = (id, relativePath) => `${skillFiles(id)}/${encodeURIComponent(relativePath)}`;
const adminSkillsSync = () => `${BASE_URL}/api/admin/skills/sync`;
const adminSkillsSyncStatus = () => `${adminSkillsSync()}/status`;
const adminSkillsSyncRun = () => `${adminSkillsSync()}/run`;
const adminSkillsSyncCredential = (credentialKey) => `${adminSkillsSync()}/credentials/${encodeURIComponent(credentialKey)}`;
const skillStates = () => `${BASE_URL}/api/user/settings/skills/active`;
const roles = () => `${BASE_URL}/api/roles`;
const adminRoles = () => `${BASE_URL}/api/admin/roles`;
const getRole$1 = (roleName) => `${roles()}/${encodeURIComponent(roleName)}`;
const updatePromptPermissions$1 = (roleName) => `${getRole$1(roleName)}/prompts`;
const updateMemoryPermissions$1 = (roleName) => `${getRole$1(roleName)}/memories`;
const updateAgentPermissions$1 = (roleName) => `${getRole$1(roleName)}/agents`;
const updatePeoplePickerPermissions$1 = (roleName) => `${getRole$1(roleName)}/people-picker`;
const updateMCPServersPermissions$1 = (roleName) => `${getRole$1(roleName)}/mcp-servers`;
const updateRemoteAgentsPermissions$1 = (roleName) => `${getRole$1(roleName)}/remote-agents`;
const updateMarketplacePermissions$1 = (roleName) => `${getRole$1(roleName)}/marketplace`;
const updateSkillPermissions$1 = (roleName) => `${getRole$1(roleName)}/skills`;
const conversationTags = (tag) => `${BASE_URL}/api/tags${tag != null && tag ? `/${encodeURIComponent(tag)}` : ""}`;
const addTagToConversation$1 = (conversationId) => `${conversationTags()}/convo/${conversationId}`;
const userTerms = () => `${BASE_URL}/api/user/terms`;
const acceptUserTerms = () => `${BASE_URL}/api/user/terms/accept`;
const banner = () => `${BASE_URL}/api/banner`;
const feedback = (conversationId, messageId) => `${BASE_URL}/api/messages/${conversationId}/${messageId}/feedback`;
const enableTwoFactor$1 = () => `${BASE_URL}/api/auth/2fa/enable`;
const verifyTwoFactor$1 = () => `${BASE_URL}/api/auth/2fa/verify`;
const confirmTwoFactor$1 = () => `${BASE_URL}/api/auth/2fa/confirm`;
const disableTwoFactor$1 = () => `${BASE_URL}/api/auth/2fa/disable`;
const regenerateBackupCodes$1 = () => `${BASE_URL}/api/auth/2fa/backup/regenerate`;
const verifyTwoFactorTemp$1 = () => `${BASE_URL}/api/auth/2fa/verify-temp`;
const memories = () => `${BASE_URL}/api/memories`;
const memory = (key) => `${memories()}/${encodeURIComponent(key)}`;
const memoryPreferences = () => `${memories()}/preferences`;
const searchPrincipals$1 = (params) => {
	const { q: query, limit, types } = params;
	let url = `${BASE_URL}/api/permissions/search-principals?q=${encodeURIComponent(query)}`;
	if (limit !== void 0) url += `&limit=${limit}`;
	if (types && types.length > 0) url += `&types=${types.join(",")}`;
	return url;
};
const getAccessRoles$1 = (resourceType) => `${BASE_URL}/api/permissions/${resourceType}/roles`;
const getResourcePermissions$1 = (resourceType, resourceId) => `${BASE_URL}/api/permissions/${resourceType}/${resourceId}`;
const updateResourcePermissions$1 = (resourceType, resourceId) => `${BASE_URL}/api/permissions/${resourceType}/${resourceId}`;
const getEffectivePermissions$1 = (resourceType, resourceId) => `${BASE_URL}/api/permissions/${resourceType}/${resourceId}/effective`;
const getAllEffectivePermissions$1 = (resourceType) => `${BASE_URL}/api/permissions/${resourceType}/effective/all`;
const graphToken = (scopes) => `${BASE_URL}/api/auth/graph-token?scopes=${encodeURIComponent(scopes)}`;
//#endregion
//#region src/types/files.ts
let FileSources = /* @__PURE__ */ function(FileSources) {
	FileSources["local"] = "local";
	FileSources["firebase"] = "firebase";
	FileSources["azure"] = "azure";
	FileSources["azure_blob"] = "azure_blob";
	FileSources["openai"] = "openai";
	FileSources["s3"] = "s3";
	FileSources["cloudfront"] = "cloudfront";
	FileSources["vectordb"] = "vectordb";
	FileSources["execute_code"] = "execute_code";
	FileSources["mistral_ocr"] = "mistral_ocr";
	FileSources["azure_mistral_ocr"] = "azure_mistral_ocr";
	FileSources["vertexai_mistral_ocr"] = "vertexai_mistral_ocr";
	FileSources["text"] = "text";
	FileSources["document_parser"] = "document_parser";
	return FileSources;
}({});
const checkOpenAIStorage = (source) => source === "openai" || source === "azure";
let FileContext = /* @__PURE__ */ function(FileContext) {
	FileContext["avatar"] = "avatar";
	FileContext["unknown"] = "unknown";
	FileContext["agents"] = "agents";
	FileContext["assistants"] = "assistants";
	FileContext["execute_code"] = "execute_code";
	FileContext["image_generation"] = "image_generation";
	FileContext["assistants_output"] = "assistants_output";
	FileContext["message_attachment"] = "message_attachment";
	FileContext["skill_file"] = "skill_file";
	FileContext["filename"] = "filename";
	FileContext["updatedAt"] = "updatedAt";
	FileContext["source"] = "source";
	FileContext["filterSource"] = "filterSource";
	FileContext["context"] = "context";
	FileContext["bytes"] = "bytes";
	return FileContext;
}({});
//#endregion
//#region src/types/agents.ts
let AuthTypeEnum = /* @__PURE__ */ function(AuthTypeEnum) {
	AuthTypeEnum["ServiceHttp"] = "service_http";
	AuthTypeEnum["OAuth"] = "oauth";
	AuthTypeEnum["None"] = "none";
	return AuthTypeEnum;
}({});
let AuthorizationTypeEnum = /* @__PURE__ */ function(AuthorizationTypeEnum) {
	AuthorizationTypeEnum["Bearer"] = "bearer";
	AuthorizationTypeEnum["Basic"] = "basic";
	AuthorizationTypeEnum["Custom"] = "custom";
	return AuthorizationTypeEnum;
}({});
let TokenExchangeMethodEnum = /* @__PURE__ */ function(TokenExchangeMethodEnum) {
	TokenExchangeMethodEnum["DefaultPost"] = "default_post";
	TokenExchangeMethodEnum["BasicAuthHeader"] = "basic_auth_header";
	return TokenExchangeMethodEnum;
}({});
//#endregion
//#region src/mcp.ts
const validateOAuthClientCredentials = (oauth, ctx) => {
	if (oauth.client_secret && !oauth.client_id) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["client_secret"],
		message: "OAuth client_secret requires client_id"
	});
	if (oauth.client_id && oauth.client_secret && (!oauth.authorization_url || !oauth.token_url)) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["client_secret"],
		message: "OAuth client_secret with client_id requires both authorization_url and token_url"
	});
};
const OAuthOptionsBaseSchema = z.object({
	/** OAuth authorization endpoint (optional - can be auto-discovered) */
	authorization_url: z.string().transform((val) => extractEnvVariable(val)).pipe(z.string().url()).optional(),
	/** OAuth token endpoint (optional - can be auto-discovered) */
	token_url: z.string().transform((val) => extractEnvVariable(val)).pipe(z.string().url()).optional(),
	/** OAuth client ID (optional - can use dynamic registration) */
	client_id: z.string().optional(),
	/** OAuth client secret (requires explicit authorization and token endpoints) */
	client_secret: z.string().optional(),
	/** OAuth scopes to request */
	scope: z.string().optional(),
	/** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
	redirect_uri: z.string().transform((val) => extractEnvVariable(val)).pipe(z.string().url()).optional(),
	/** Token exchange method */
	token_exchange_method: z.nativeEnum(TokenExchangeMethodEnum).optional(),
	/** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
	grant_types_supported: z.array(z.string()).optional(),
	/** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
	token_endpoint_auth_methods_supported: z.array(z.string()).optional(),
	/** Supported response types (defaults to ['code']) */
	response_types_supported: z.array(z.string()).optional(),
	/** Supported code challenge methods (defaults to ['S256', 'plain']) */
	code_challenge_methods_supported: z.array(z.string()).optional(),
	/** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
	skip_code_challenge_check: z.boolean().optional(),
	/**
	* Auth0/Cognito-style `audience` parameter. Authorization servers that pre-date
	* RFC 8707 — most prominently Auth0 — issue API-scoped access tokens only when
	* the `/authorize` request advertises an `audience`. RFC 8707 `resource` (set
	* automatically from Protected Resource Metadata) is the standards-conformant
	* route; `audience` covers the providers that ignore it.
	*
	* When set, the value is forwarded as-is on `/authorize` (both pre-configured
	* and DCR-discovered paths). Whether it is also forwarded on the
	* `refresh_token` grant is controlled by `forward_audience_on_refresh` below.
	*
	* The `authorization_code` exchange intentionally never receives `audience` —
	* Auth0 binds audience from the original `/authorize` request and embeds it
	* in the issued access token; sending it again is redundant.
	*
	* No canonicalization is applied — the audience identifier is provider-defined
	* and may differ from the MCP server URL. This field is only accepted from
	* trusted/admin MCP configuration and is rejected from user-managed servers.
	*/
	audience: z.string().min(1).optional(),
	/**
	* Whether to also forward `audience` on the `refresh_token` grant body.
	*
	* Default: `true`. Required for Auth0, which strips the API audience from
	* refreshed access tokens unless `audience` is re-supplied on every refresh
	* — without it the next MCP call 401s once the initial access token expires.
	*
	* Set to `false` for providers that document refresh requests as
	* `grant_type` + `client_id` + `refresh_token` only (Cognito and other
	* strict OAuth 2.0 token endpoints). Those providers maintain the original
	* `aud` claim across refreshes when the initial token was resource-bound,
	* so the extra parameter is redundant and may be rejected as
	* `invalid_request`.
	*
	* Ignored when `audience` itself is not configured.
	*/
	forward_audience_on_refresh: z.boolean().optional(),
	/** OAuth revocation endpoint (optional - can be auto-discovered) */
	revocation_endpoint: z.string().transform((val) => extractEnvVariable(val)).pipe(z.string().url()).optional(),
	/** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
	revocation_endpoint_auth_methods_supported: z.array(z.string()).optional()
});
const OAuthOptionsSchema = OAuthOptionsBaseSchema.superRefine(validateOAuthClientCredentials);
const BLOCKED_USER_OAUTH_ENDPOINT_PARAMS = ["audience", "resource"];
const envVarPattern = /\$\{[^}]+\}/;
const userOAuthEndpointUrlSchema = z.string().refine((val) => !envVarPattern.test(val), { message: "Environment variable references are not allowed in URLs" }).pipe(z.string().url()).refine((value) => {
	try {
		const { searchParams } = new URL(value);
		return BLOCKED_USER_OAUTH_ENDPOINT_PARAMS.every((param) => !searchParams.has(param));
	} catch {
		return true;
	}
}, { message: "OAuth endpoint URLs cannot include audience or resource query parameters" });
const UserOAuthOptionsSchema = OAuthOptionsBaseSchema.omit({
	audience: true,
	forward_audience_on_refresh: true
}).extend({
	authorization_url: userOAuthEndpointUrlSchema.optional(),
	token_url: userOAuthEndpointUrlSchema.optional(),
	redirect_uri: userOAuthEndpointUrlSchema.optional(),
	revocation_endpoint: userOAuthEndpointUrlSchema.optional(),
	audience: z.never().optional(),
	forward_audience_on_refresh: z.never().optional()
}).superRefine(validateOAuthClientCredentials);
const OboOptionsSchema = z.object({ 
/** Scopes to request for the downstream MCP server (e.g., "api://<client-id>/Mcp.Tools.ReadWrite") */
scopes: z.string().min(1) });
const BaseOptionsSchema = z.object({
	/** Display name for the MCP server - only letters, numbers, and spaces allowed */
	title: z.string().regex(/^[a-zA-Z0-9 ]+$/, "Title can only contain letters, numbers, and spaces").optional(),
	/** Description of the MCP server */
	description: z.string().optional(),
	/**
	* Controls whether the MCP server is initialized during application startup.
	* - true (default): Server is initialized during app startup and included in app-level connections
	* - false: Skips initialization at startup and excludes from app-level connections - useful for servers
	*   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
	*/
	startup: z.boolean().optional(),
	iconPath: z.string().optional(),
	timeout: z.number().int().nonnegative().optional(),
	/** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
	sseReadTimeout: z.number().int().positive().optional(),
	initTimeout: z.number().int().nonnegative().optional(),
	/** Controls visibility in chat dropdown menu (MCPSelect) */
	chatMenu: z.boolean().optional(),
	/**
	* Controls server instruction behavior:
	* - undefined/not set: No instructions included (default)
	* - true: Use server-provided instructions
	* - string: Use custom instructions (overrides server-provided)
	*/
	serverInstructions: z.union([z.boolean(), z.string()]).optional(),
	/**
	* Whether this server requires OAuth authentication
	* If not specified, will be auto-detected during construction
	*/
	requiresOAuth: z.boolean().optional(),
	/**
	* OAuth configuration for SSE and Streamable HTTP transports
	* - Optional: OAuth can be auto-discovered on 401 responses
	* - Pre-configured confidential clients must pin both OAuth endpoints
	*/
	oauth: OAuthOptionsSchema.optional(),
	/** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
	oauth_headers: z.record(z.string(), z.string()).optional(),
	/**
	* API Key authentication configuration for SSE and Streamable HTTP transports
	* - source: 'admin' means the key is provided by admin and shared by all users
	* - source: 'user' means each user provides their own key via customUserVars
	*/
	apiKey: z.object({
		/** API key value (only for admin-provided mode, stored encrypted) */
		key: z.string().optional(),
		/** Whether key is provided by admin or each user */
		source: z.enum(["admin", "user"]),
		/** How to format the authorization header */
		authorization_type: z.enum([
			"basic",
			"bearer",
			"custom"
		]),
		/** Custom header name when authorization_type is 'custom' */
		custom_header: z.string().optional()
	}).optional(),
	customUserVars: z.record(z.string(), z.object({
		title: z.string(),
		description: z.string(),
		/**
		* Whether the field holds a secret and should be masked in the UI.
		* Defaults to masked when omitted; set to `false` for non-secret setup
		* values (e.g. username, project key, base URL) to render as plain text.
		*/
		sensitive: z.boolean().optional()
	})).optional()
});
const ProxyUrlSchema = z.string().transform((val) => extractEnvVariable(val)).pipe(z.string().url()).refine((val) => {
	const protocol = new URL(val).protocol;
	return protocol === "http:" || protocol === "https:" || protocol === "socks:" || protocol === "socks5:";
}, { message: "Proxy URL must use http://, https://, socks://, or socks5://" });
const StdioOptionsSchema = BaseOptionsSchema.extend({
	type: z.literal("stdio").default("stdio"),
	obo: z.undefined().optional(),
	/**
	* The executable to run to start the server.
	*/
	command: z.string(),
	/**
	* Command line arguments to pass to the executable.
	*/
	args: z.array(z.string()),
	/**
	* The environment to use when spawning the process.
	*
	* If not specified, the result of getDefaultEnvironment() will be used.
	* Environment variables can be referenced using ${VAR_NAME} syntax.
	*/
	env: z.record(z.string(), z.string()).optional().transform((env) => {
		if (!env) return env;
		const processedEnv = {};
		for (const [key, value] of Object.entries(env)) processedEnv[key] = extractEnvVariable(value);
		return processedEnv;
	}),
	/**
	* How to handle stderr of the child process.
	* Accepts: 'pipe' | 'ignore' | 'inherit' | file descriptor number.
	* Defaults to "inherit".
	*/
	stderr: z.union([z.enum([
		"pipe",
		"ignore",
		"inherit"
	]), z.number().int().nonnegative()]).optional()
});
const WebSocketOptionsSchema = BaseOptionsSchema.extend({
	type: z.literal("websocket").default("websocket"),
	obo: z.undefined().optional(),
	url: z.string().transform((val) => extractEnvVariable(val)).pipe(z.string().url()).refine((val) => {
		const protocol = new URL(val).protocol;
		return protocol === "ws:" || protocol === "wss:";
	}, { message: "WebSocket URL must start with ws:// or wss://" })
});
const SSEOptionsSchema = BaseOptionsSchema.extend({
	type: z.literal("sse").default("sse"),
	headers: z.record(z.string(), z.string()).optional(),
	/**
	* On-Behalf-Of (OBO) token exchange configuration.
	* When configured, LibreChat exchanges the logged-in user's federated access token
	* for a token scoped to this MCP server via the OAuth 2.0 OBO flow (jwt-bearer grant).
	* The exchanged token is injected as a Bearer Authorization header automatically.
	* Requires the user to be authenticated via OpenID Connect (e.g., Entra ID).
	*/
	obo: OboOptionsSchema.optional(),
	/** Optional outbound proxy URL for this remote MCP transport */
	proxy: ProxyUrlSchema.optional(),
	url: z.string().transform((val) => extractEnvVariable(val)).pipe(z.string().url()).refine((val) => {
		const protocol = new URL(val).protocol;
		return protocol !== "ws:" && protocol !== "wss:";
	}, { message: "SSE URL must not start with ws:// or wss://" })
});
const StreamableHTTPOptionsSchema = BaseOptionsSchema.extend({
	type: z.union([z.literal("streamable-http"), z.literal("http")]),
	headers: z.record(z.string(), z.string()).optional(),
	/**
	* On-Behalf-Of (OBO) token exchange configuration.
	* When configured, LibreChat exchanges the logged-in user's federated access token
	* for a token scoped to this MCP server via the OAuth 2.0 OBO flow (jwt-bearer grant).
	* The exchanged token is injected as a Bearer Authorization header automatically.
	* Requires the user to be authenticated via OpenID Connect (e.g., Entra ID).
	*/
	obo: OboOptionsSchema.optional(),
	/** Optional outbound proxy URL for this remote MCP transport */
	proxy: ProxyUrlSchema.optional(),
	url: z.string().transform((val) => extractEnvVariable(val)).pipe(z.string().url()).refine((val) => {
		const protocol = new URL(val).protocol;
		return protocol !== "ws:" && protocol !== "wss:";
	}, { message: "Streamable HTTP URL must not start with ws:// or wss://" })
});
const MCPOptionsSchema = z.union([
	StdioOptionsSchema,
	WebSocketOptionsSchema,
	SSEOptionsSchema,
	StreamableHTTPOptionsSchema
]);
const MCPServersSchema = z.record(z.string(), MCPOptionsSchema);
/**
* Helper to omit server-managed fields that should not come from UI
*/
const omitServerManagedFields = (schema) => schema.omit({
	startup: true,
	timeout: true,
	sseReadTimeout: true,
	initTimeout: true,
	chatMenu: true,
	serverInstructions: true,
	requiresOAuth: true,
	customUserVars: true,
	oauth_headers: true
});
const userManagedServerFields = (schema) => omitServerManagedFields(schema).extend({ oauth: UserOAuthOptionsSchema.optional() });
const isWsProtocol = (val) => /^wss?:/i.test(val);
const isHttpProtocol = (val) => /^https?:/i.test(val);
/**
* Builds a URL schema for user input that rejects ${VAR} env variable patterns
* and validates protocol constraints without resolving environment variables.
*/
const userUrlSchema = (protocolCheck, message) => z.string().refine((val) => !envVarPattern.test(val), { message: "Environment variable references are not allowed in URLs" }).pipe(z.string().url()).refine(protocolCheck, { message });
/**
* MCP Server configuration that comes from UI/API input only.
* Omits server-managed fields like startup, timeout, customUserVars, etc.
* Allows: title, description, url, iconPath, oauth (user credentials).
* Admin-only OAuth audience fields are rejected for user-managed servers.
*
* SECURITY: Stdio transport is intentionally excluded from user input.
* Stdio allows arbitrary command execution and should only be configured
* by administrators via the YAML config file (librechat.yaml).
* Only remote transports (SSE, HTTP, WebSocket) are allowed via the API.
*
* SECURITY: URL fields use userUrlSchema instead of the admin schemas'
* extractEnvVariable transform to prevent env variable exfiltration
* through user-controlled URLs (e.g. http://attacker.com/?k=${JWT_SECRET}).
* Protocol checks use positive allowlists (http(s) / ws(s)) to block
* file://, ftp://, javascript:, and other non-network schemes.
*/
const MCPServerUserInputSchema = z.union([
	userManagedServerFields(WebSocketOptionsSchema).extend({ url: userUrlSchema(isWsProtocol, "WebSocket URL must use ws:// or wss://") }),
	userManagedServerFields(SSEOptionsSchema).extend({
		proxy: z.never().optional(),
		url: userUrlSchema(isHttpProtocol, "SSE URL must use http:// or https://")
	}),
	userManagedServerFields(StreamableHTTPOptionsSchema).extend({
		proxy: z.never().optional(),
		url: userUrlSchema(isHttpProtocol, "Streamable HTTP URL must use http:// or https://")
	})
]);
/**
* Set of every field name that may appear in a user-submitted MCP server config,
* derived from `MCPServerUserInputSchema`'s union members. Used as the comparison
* surface for the OBO lockdown check in `updateMCPServerController` so that
* server-managed fields on the existing config (`dbId`, `source`, `author`,
* `requiresOAuth`, `oauthMetadata`, etc.) don't show up as differences and
* cause spurious 403s on legitimate saves.
*
* Schema-derived rather than hand-maintained: when a new field is added to
* `BaseOptionsSchema` or any transport variant, it flows into this set
* automatically. The OBO lockdown then locks the new field by default
* (since it won't be in the hand-curated `OBO_USER_EDITABLE_FIELDS`
* allowlist), preventing a silent privilege regression.
*/
const MCP_USER_INPUT_FIELDS = (() => {
	const fields = /* @__PURE__ */ new Set();
	for (const variant of MCPServerUserInputSchema.options) {
		const shape = variant.shape;
		for (const key of Object.keys(shape)) fields.add(key);
	}
	return fields;
})();
//#endregion
//#region src/config.ts
const defaultSocialLogins = [
	"google",
	"facebook",
	"openid",
	"github",
	"discord",
	"saml"
];
const BASE_ONLY_CONFIG_SECTIONS = [];
const defaultRetrievalModels = [
	"gpt-4o",
	"o1-preview-2024-09-12",
	"o1-preview",
	"o1-mini-2024-09-12",
	"o1-mini",
	"o3-mini",
	"chatgpt-4o-latest",
	"gpt-4o-2024-05-13",
	"gpt-4o-2024-08-06",
	"gpt-4o-mini",
	"gpt-4o-mini-2024-07-18",
	"gpt-4-turbo-preview",
	"gpt-3.5-turbo-0125",
	"gpt-4-0125-preview",
	"gpt-4-1106-preview",
	"gpt-3.5-turbo-1106",
	"gpt-3.5-turbo-0125",
	"gpt-4-turbo",
	"gpt-4-0125",
	"gpt-4-1106"
];
const excludedKeys = new Set([
	"conversationId",
	"title",
	"iconURL",
	"greeting",
	"endpoint",
	"endpointType",
	"createdAt",
	"updatedAt",
	"expiredAt",
	"isTemporary",
	"messages",
	"isArchived",
	"tags",
	"user",
	"__v",
	"_id",
	"tools",
	"model",
	"files",
	"spec",
	"disableParams",
	"chatProjectId"
]);
let SettingsViews = /* @__PURE__ */ function(SettingsViews) {
	SettingsViews["default"] = "default";
	SettingsViews["advanced"] = "advanced";
	return SettingsViews;
}({});
/** Validates any FileSources value — use for file metadata, DB records, and upload routing. */
const fileSourceSchema = z.nativeEnum(FileSources);
/**
* `allowedAddresses` is an SSRF exemption list scoped to private IP space.
* Validate at config-load time:
*  - Reject URLs, paths, CIDR ranges, bare host/IP forms, and whitespace.
*  - Require `host:port` or `[ipv6]:port` entries so an exemption is scoped
*    to one service port instead of every port on a private host.
*  - Reject IPv4 literals that fall outside the private/loopback/link-local
*    ranges. Public IPs are never SSRF targets, so listing one has no
*    defensive purpose and must not silently grant trust.
*  - Hostnames pass through; their resolved IP is checked at runtime by
*    `resolveHostnameSSRF` and only a private resolved IP is meaningful.
*
* Mirrors a minimal subset of `isPrivateIP` from `@librechat/api` to avoid a
* circular package dependency. The runtime helper is the authoritative check;
* this refinement is a UX guardrail.
*/
function isPrivateIPv4Literal(value) {
	const match = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (!match) return false;
	const [a, b, c] = match.slice(1).map(Number);
	if (a === 0 || a === 10 || a === 127) return true;
	if (a === 169 && b === 254) return true;
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && b === 168) return true;
	if (a === 192 && b === 0 && c === 0) return true;
	if (a === 100 && b >= 64 && b <= 127) return true;
	if (a === 198 && (b === 18 || b === 19)) return true;
	if (a >= 224) return true;
	return false;
}
function isPrivateIPv6Literal(value) {
	if (!value.includes(":")) return false;
	if (value === "::1" || value === "::") return true;
	if (value.startsWith("fc") || value.startsWith("fd")) return true;
	const firstHextet = value.split(":", 1)[0];
	if (/^[0-9a-f]{1,4}$/.test(firstHextet ?? "")) {
		if ((parseInt(firstHextet, 16) & 65472) === 65152) return true;
	}
	const mappedMatch = value.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
	if (mappedMatch) return isPrivateIPv4Literal(mappedMatch[1]);
	return false;
}
/**
* Mirrors the allowedAddresses parser in `@librechat/api`'s auth helpers.
* Kept as a local copy because the data-provider package cannot import from
* `@librechat/api` without creating a circular dependency. Keep the two
* implementations in sync.
*/
function normalizePort(port) {
	if (typeof port !== "string" && typeof port !== "number") return "";
	const portString = String(port).trim();
	if (!/^\d+$/.test(portString)) return "";
	const parsed = Number(portString);
	if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) return "";
	return String(parsed);
}
function parseAllowedAddressEntry(entry) {
	const trimmed = entry.toLowerCase().trim();
	const bracketedIPv6 = trimmed.match(/^\[([^\]]+)\]:(\d+)$/);
	const hostPort = bracketedIPv6 ? null : trimmed.match(/^([^:]+):(\d+)$/);
	const address = (bracketedIPv6?.[1] ?? hostPort?.[1] ?? "").replace(/^\[|\]$/g, "");
	const port = normalizePort(bracketedIPv6?.[2] ?? hostPort?.[2] ?? "");
	if (!address || !port) return null;
	return {
		address,
		port
	};
}
const allowedAddressEntrySchema = z.string().refine((entry) => entry.length > 0 && entry.trim().length > 0, { message: "allowedAddresses entries must be non-empty" }).refine((entry) => !entry.includes("://") && !entry.includes("/") && !/\s/.test(entry), { message: "allowedAddresses entries must be host:port pairs — no URLs, paths, CIDR ranges, or whitespace" }).refine((entry) => parseAllowedAddressEntry(entry) != null, { message: "allowedAddresses entries must include a port, for example localhost:11434 or [::1]:11434" }).refine((entry) => {
	const parsed = parseAllowedAddressEntry(entry);
	if (!parsed) return false;
	const stripped = parsed.address;
	const isIPv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(stripped);
	const isIPv6 = !isIPv4 && stripped.includes(":");
	if (!isIPv4 && !isIPv6) return true;
	return isIPv4 ? isPrivateIPv4Literal(stripped) : isPrivateIPv6Literal(stripped);
}, { message: "allowedAddresses is scoped to private IP space — public IP literals are not permitted (use hostname:port if it resolves to a private IP)" });
const allowedAddressesSchema = z.array(allowedAddressEntrySchema).optional();
const fileStorageSchema = z.enum([
	"local",
	"firebase",
	"s3",
	"azure_blob",
	"cloudfront"
]);
const fileStrategiesSchema = z.object({
	default: fileStorageSchema.optional(),
	avatar: fileStorageSchema.optional(),
	image: fileStorageSchema.optional(),
	document: fileStorageSchema.optional(),
	skills: fileStorageSchema.optional()
}).optional();
const cloudfrontSigningSchema = z.enum([
	"none",
	"cookies",
	"url"
]);
const cloudfrontConfigSchema = z.object({
	domain: z.string().url(),
	distributionId: z.string().optional(),
	invalidateOnDelete: z.boolean().default(false),
	imageSigning: cloudfrontSigningSchema.default("none"),
	urlExpiry: z.number().positive().default(3600),
	cookieExpiry: z.number().positive().max(604800).default(1800),
	cookieDomain: z.string().min(1).refine((d) => d.startsWith("."), { message: "cookieDomain must start with a dot (e.g., \".example.com\") to apply to subdomains" }).optional(),
	storageRegion: z.string().min(1).optional(),
	includeRegionInPath: z.boolean().default(false),
	requireSignedAccess: z.boolean().default(false)
}).refine((data) => !data.invalidateOnDelete || !!data.distributionId, {
	message: "distributionId is required when invalidateOnDelete is true",
	path: ["distributionId"]
}).refine((data) => data.imageSigning !== "cookies" || !!data.cookieDomain, {
	message: "cookieDomain is required when imageSigning is \"cookies\" (e.g., \".example.com\" for API at api.example.com and CDN at cdn.example.com)",
	path: ["cookieDomain"]
}).refine((data) => !data.requireSignedAccess || data.imageSigning === "cookies", {
	message: "cloudfront.requireSignedAccess=true requires cloudfront.imageSigning=\"cookies\" (signed URL mode is not yet implemented)",
	path: ["requireSignedAccess"]
}).optional();
const skillSyncIdentifierSchema = z.string().min(1).max(64).regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/, { message: "must start with a letter or digit and contain only letters, digits, underscores, or hyphens" });
const SKILL_SYNC_MIN_INTERVAL_MINUTES = 5;
const SKILL_SYNC_MAX_INTERVAL_MINUTES = Math.floor(2147483647 / 6e4);
const SKILL_SYNC_DEFAULT_DISCOVERY_DEPTH = 2;
const SKILL_SYNC_MAX_DISCOVERY_DEPTH = 10;
const skillSyncGitHubOwnerSchema = z.string().min(1).max(39).regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/, { message: "must be a valid GitHub owner name" });
const skillSyncGitHubRepoSchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/, { message: "must be a valid GitHub repository name" });
const invalidGitRefChars = new Set([
	"~",
	"^",
	":",
	"?",
	"*",
	"["
]);
function hasInvalidGitRefCharacter(value) {
	for (const char of value) {
		const code = char.charCodeAt(0);
		if (code <= 32 || code === 127 || invalidGitRefChars.has(char)) return true;
	}
	return false;
}
const skillSyncGitHubRefSchema = z.string().min(1).max(255).refine((value) => !value.startsWith("/") && !value.endsWith("/"), { message: "must not start or end with a slash" }).refine((value) => !value.includes("..") && !value.includes("//") && !value.includes("\\"), { message: "must not contain traversal segments, empty path segments, or backslashes" }).refine((value) => !value.includes("@{") && value !== "@", { message: "must not contain invalid Git ref syntax" }).refine((value) => !value.endsWith("."), { message: "must not end with a dot" }).refine((value) => !hasInvalidGitRefCharacter(value), { message: "must not contain invalid Git ref characters" }).refine((value) => value.split("/").every((segment) => segment && !segment.startsWith(".") && !segment.endsWith(".lock")), { message: "must contain valid Git ref path segments" });
const skillSyncPathSchema = z.string().max(500).refine((value) => value.trim().length > 0, { message: "must not be empty" }).transform((value) => {
	const trimmed = value.trim().replace(/^\/+|\/+$/g, "");
	return trimmed === "." ? "" : trimmed;
}).refine((value) => !value.includes("\\") && !value.includes(".."), { message: "must not contain traversal segments or backslashes" }).refine((value) => value === "" || /^[a-zA-Z0-9._\-/]+$/.test(value), { message: "must contain only letters, digits, dots, underscores, hyphens, and slashes" }).refine((value) => value === "" || value.split("/").every((segment) => segment.length > 0 && segment !== "."), { message: "must not contain empty or dot path segments" });
const skillSyncTokenReferenceSchema = z.string().trim().regex(/^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/, { message: "must be an environment variable reference like ${GITHUB_SKILLS_TOKEN}" });
/**
* Tenant that owns the skills mirrored from a source. When set, the sync runner
* executes that source's database writes inside the tenant's async context so
* synced skills are created, listed, and shared within the tenant under strict
* tenant isolation. Mirrors the request tenant-id contract: no reserved system id.
*/
const skillSyncTenantIdSchema = z.string().max(128).refine((value) => /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(value), { message: "must be a valid tenant id" }).refine((value) => value !== "__SYSTEM__", { message: "must not be the reserved system tenant id" });
const skillSyncGitHubSourceSchema = z.object({
	id: skillSyncIdentifierSchema,
	owner: skillSyncGitHubOwnerSchema,
	repo: skillSyncGitHubRepoSchema,
	ref: skillSyncGitHubRefSchema.default("main"),
	paths: z.array(skillSyncPathSchema).min(1),
	skillDiscoveryDepth: z.number().int().min(0).max(10).optional(),
	credentialKey: skillSyncIdentifierSchema.optional(),
	token: skillSyncTokenReferenceSchema.optional(),
	tenantId: skillSyncTenantIdSchema.optional()
}).superRefine((source, ctx) => {
	if (!source.credentialKey && !source.token) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["credentialKey"],
		message: "Either credentialKey or token is required"
	});
	if (source.credentialKey && source.token) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["token"],
		message: "Use either credentialKey or token, not both"
	});
});
const skillSyncConfigSchema = z.object({ github: z.object({
	enabled: z.boolean().default(false),
	intervalMinutes: z.number().int().min(5).max(SKILL_SYNC_MAX_INTERVAL_MINUTES).default(60),
	runOnStartup: z.boolean().default(false),
	sources: z.array(skillSyncGitHubSourceSchema).default([])
}).superRefine((github, ctx) => {
	if (github.enabled && github.sources.length === 0) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["sources"],
		message: "At least one GitHub source is required when skill sync is enabled"
	});
	const seen = /* @__PURE__ */ new Set();
	for (const source of github.sources) {
		if (seen.has(source.id)) ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["sources"],
			message: `Duplicate GitHub skill sync source id "${source.id}"`
		});
		seen.add(source.id);
	}
}).optional() }).optional();
function getSchemaDefaults(schema) {
	const shape = schema.shape;
	const entries = Object.entries(shape).map(([key, value]) => {
		if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()];
		return [key, void 0];
	});
	return Object.fromEntries(entries);
}
const modelConfigSchema = z.object({
	deploymentName: z.string().optional(),
	version: z.string().optional(),
	assistants: z.boolean().optional()
}).or(z.boolean());
const paramValueSchema = z.lazy(() => z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(paramValueSchema),
	z.record(z.string(), paramValueSchema)
]));
/** Validates addParams while keeping web_search aligned with current runtime boolean handling. */
const addParamsSchema = z.record(z.string(), paramValueSchema).superRefine((params, ctx) => {
	if (params.web_search === void 0 || typeof params.web_search === "boolean") return;
	ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["web_search"],
		message: "`web_search` must be a boolean in addParams"
	});
});
const azureBaseSchema = z.object({
	apiKey: z.string(),
	serverless: z.boolean().optional(),
	instanceName: z.string().optional(),
	deploymentName: z.string().optional(),
	assistants: z.boolean().optional(),
	addParams: addParamsSchema.optional(),
	dropParams: z.array(z.string()).optional(),
	version: z.string().optional(),
	baseURL: z.string().optional(),
	additionalHeaders: z.record(z.string()).optional()
});
const azureGroupSchema = z.object({
	group: z.string(),
	models: z.record(z.string(), modelConfigSchema)
}).required().and(azureBaseSchema);
const azureGroupConfigsSchema = z.array(azureGroupSchema).min(1);
let Capabilities = /* @__PURE__ */ function(Capabilities) {
	Capabilities["code_interpreter"] = "code_interpreter";
	Capabilities["image_vision"] = "image_vision";
	Capabilities["retrieval"] = "retrieval";
	Capabilities["actions"] = "actions";
	Capabilities["tools"] = "tools";
	return Capabilities;
}({});
let AgentCapabilities = /* @__PURE__ */ function(AgentCapabilities) {
	AgentCapabilities["hide_sequential_outputs"] = "hide_sequential_outputs";
	AgentCapabilities["programmatic_tools"] = "programmatic_tools";
	AgentCapabilities["end_after_tools"] = "end_after_tools";
	AgentCapabilities["deferred_tools"] = "deferred_tools";
	AgentCapabilities["execute_code"] = "execute_code";
	AgentCapabilities["file_search"] = "file_search";
	AgentCapabilities["web_search"] = "web_search";
	AgentCapabilities["artifacts"] = "artifacts";
	AgentCapabilities["subagents"] = "subagents";
	AgentCapabilities["actions"] = "actions";
	AgentCapabilities["context"] = "context";
	AgentCapabilities["skills"] = "skills";
	AgentCapabilities["tools"] = "tools";
	AgentCapabilities["chain"] = "chain";
	AgentCapabilities["ocr"] = "ocr";
	return AgentCapabilities;
}({});
const defaultAssistantsVersion = {
	["assistants"]: 2,
	["azureAssistants"]: 1
};
const baseEndpointSchema = z.object({
	streamRate: z.number().optional(),
	baseURL: z.string().optional(),
	/**
	* Custom request headers forwarded to the provider on every request. Values
	* support the same placeholder resolution as custom endpoints — env vars
	* (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
	* (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
	* providers through an AI gateway / reverse proxy that consumes metadata
	* headers (provider-native request shaping is preserved).
	*/
	headers: z.record(z.string()).optional(),
	titlePrompt: z.string().optional(),
	titleModel: z.string().optional(),
	titleConvo: z.boolean().optional(),
	titleMethod: z.union([
		z.literal("completion"),
		z.literal("functions"),
		z.literal("structured")
	]).optional(),
	titleEndpoint: z.string().optional(),
	titlePromptTemplate: z.string().optional(),
	/**
	* When conversation titles are generated. `immediate` (default) generates the
	* title as soon as the request is made, in parallel with the response, from the
	* user's first message. `final` defers generation until the full response
	* completes (legacy behavior).
	*/
	titleTiming: z.union([z.literal("immediate"), z.literal("final")]).optional(),
	/** Maximum characters allowed in a single tool result before truncation. */
	maxToolResultChars: z.number().positive().optional()
});
const bedrockGuardrailConfigSchema = z.object({
	guardrailIdentifier: z.string(),
	guardrailVersion: z.string(),
	trace: z.enum([
		"enabled",
		"disabled",
		"enabled_full"
	]).optional(),
	streamProcessingMode: z.enum(["sync", "async"]).optional()
});
const bedrockEndpointSchema = baseEndpointSchema.merge(z.object({
	availableRegions: z.array(z.string()).optional(),
	models: z.array(z.string()).optional(),
	guardrailConfig: bedrockGuardrailConfigSchema.optional(),
	inferenceProfiles: z.record(z.string(), z.string()).optional()
}));
const modelItemSchema = z.union([z.string(), z.object({
	name: z.string(),
	description: z.string().optional()
})]);
const assistantEndpointSchema = baseEndpointSchema.merge(z.object({
	disableBuilder: z.boolean().optional(),
	pollIntervalMs: z.number().optional(),
	timeoutMs: z.number().optional(),
	version: z.union([z.string(), z.number()]).default(2),
	supportedIds: z.array(z.string()).min(1).optional(),
	excludedIds: z.array(z.string()).min(1).optional(),
	privateAssistants: z.boolean().optional(),
	retrievalModels: z.array(z.string()).min(1).optional().default(defaultRetrievalModels),
	capabilities: z.array(z.nativeEnum(Capabilities)).optional().default([
		"code_interpreter",
		"image_vision",
		"retrieval",
		"actions",
		"tools"
	]),
	apiKey: z.string().optional(),
	models: z.object({
		default: z.array(modelItemSchema).min(1),
		fetch: z.boolean().optional(),
		userIdQuery: z.boolean().optional()
	}).optional(),
	headers: z.record(z.string()).optional()
}));
const defaultAgentCapabilities = [
	"deferred_tools",
	"execute_code",
	"file_search",
	"web_search",
	"artifacts",
	"subagents",
	"actions",
	"context",
	"skills",
	"tools",
	"chain",
	"ocr"
];
const LOCAL_REMOTE_OIDC_HOSTS = new Set([
	"localhost",
	"127.0.0.1",
	"[::1]"
]);
function isRemoteOidcUrlAllowed(value) {
	try {
		const url = new URL(value);
		if (url.protocol === "https:") return true;
		if (url.protocol !== "http:") return false;
		const hostname = url.hostname.toLowerCase();
		return LOCAL_REMOTE_OIDC_HOSTS.has(hostname) || hostname.endsWith(".localhost");
	} catch {
		return false;
	}
}
const remoteApiOidcUrlSchema = z.string().url().refine(isRemoteOidcUrlAllowed, { message: "must use https:// unless targeting localhost" });
const remoteApiOidcScopeSchema = z.string().refine((scope) => !scope.includes(","), { message: "scopes must be space-separated" });
const remoteApiOidcSchema = z.object({
	enabled: z.boolean().default(false),
	issuer: remoteApiOidcUrlSchema.optional(),
	audience: z.string().min(1).optional(),
	jwksUri: remoteApiOidcUrlSchema.optional(),
	scope: remoteApiOidcScopeSchema.optional()
}).superRefine((oidc, ctx) => {
	if (oidc.enabled === true && !oidc.issuer) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["issuer"],
		message: "issuer is required when OIDC auth is enabled"
	});
	if (oidc.enabled === true && !oidc.audience) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["audience"],
		message: "audience is required when OIDC auth is enabled"
	});
});
const remoteApiAuthSchema = z.object({
	apiKey: z.object({ enabled: z.boolean().default(true) }).optional(),
	oidc: remoteApiOidcSchema.optional()
});
const remoteApiSchema = z.object({ auth: remoteApiAuthSchema.optional() });
const agentsEndpointSchema = baseEndpointSchema.omit({ baseURL: true }).merge(z.object({
	recursionLimit: z.number().optional(),
	disableBuilder: z.boolean().optional().default(false),
	maxRecursionLimit: z.number().optional(),
	maxCitations: z.number().min(1).max(50).optional().default(30),
	maxCitationsPerFile: z.number().min(1).max(10).optional().default(7),
	minRelevanceScore: z.number().min(0).max(1).optional().default(.45),
	allowedProviders: z.array(z.union([z.string(), eModelEndpointSchema])).optional(),
	capabilities: z.array(z.nativeEnum(AgentCapabilities)).optional().default(defaultAgentCapabilities),
	skills: z.object({ maxCatalogSkills: z.number().int().min(1).max(100).optional() }).optional(),
	remoteApi: remoteApiSchema.optional()
})).default({
	disableBuilder: false,
	capabilities: defaultAgentCapabilities,
	maxCitations: 30,
	maxCitationsPerFile: 7,
	minRelevanceScore: .45
});
const paramDefinitionSchema = z.object({
	key: z.string(),
	description: z.string().optional(),
	type: z.nativeEnum(SettingTypes).optional(),
	default: z.union([
		z.number(),
		z.boolean(),
		z.string(),
		z.array(z.string())
	]).optional(),
	showLabel: z.boolean().optional(),
	showDefault: z.boolean().optional(),
	options: z.array(z.string()).optional(),
	range: z.object({
		min: z.number(),
		max: z.number(),
		step: z.number().optional()
	}).optional(),
	enumMappings: z.record(z.union([
		z.number(),
		z.boolean(),
		z.string()
	])).optional(),
	component: z.nativeEnum(ComponentTypes).optional(),
	optionType: z.nativeEnum(OptionTypes).optional(),
	columnSpan: z.number().int().nonnegative().optional(),
	columns: z.number().int().min(1).max(4).optional(),
	label: z.string().optional(),
	placeholder: z.string().optional(),
	labelCode: z.boolean().optional(),
	placeholderCode: z.boolean().optional(),
	descriptionCode: z.boolean().optional(),
	minText: z.number().optional(),
	maxText: z.number().optional(),
	minTags: z.number().min(0).optional(),
	maxTags: z.number().min(0).optional(),
	includeInput: z.boolean().optional(),
	descriptionSide: z.enum([
		"top",
		"right",
		"bottom",
		"left"
	]).optional(),
	searchPlaceholder: z.string().optional(),
	selectPlaceholder: z.string().optional(),
	searchPlaceholderCode: z.boolean().optional(),
	selectPlaceholderCode: z.boolean().optional()
});
const endpointSchema = baseEndpointSchema.merge(z.object({
	name: z.string().refine((value) => !eModelEndpointSchema.safeParse(value).success, { message: `Value cannot be one of the default endpoint (EModelEndpoint) values: ${Object.values(EModelEndpoint).join(", ")}` }),
	apiKey: z.string(),
	baseURL: z.string(),
	models: z.object({
		default: z.array(modelItemSchema).min(1),
		fetch: z.boolean().optional(),
		userIdQuery: z.boolean().optional()
	}),
	iconURL: z.string().optional(),
	modelDisplayLabel: z.string().optional(),
	/**
	* Forces the endpoint to use a provider's native client / request format
	* instead of the default OpenAI-compatible client. Currently supports
	* `anthropic`, for endpoints that speak the Anthropic `/v1/messages` API
	* (Anthropic itself or Anthropic-compatible gateways). Omit for
	* OpenAI-compatible endpoints.
	*/
	provider: z.literal("anthropic").optional(),
	headers: z.record(z.string()).optional(),
	addParams: addParamsSchema.optional(),
	dropParams: z.array(z.string()).optional(),
	customParams: z.object({
		defaultParamsEndpoint: z.string().default("custom"),
		reasoningFormat: eReasoningParameterFormatSchema.optional(),
		reasoningKey: eReasoningResponseKeySchema.optional(),
		/** Replays `reasoning_content` within a run's tool-call turns (e.g. Xiaomi MiMo, Kimi). */
		includeReasoningContent: z.boolean().optional(),
		/** Also reconstructs `reasoning_content` from persisted history across turns (implies `includeReasoningContent`). */
		includeReasoningHistory: z.boolean().optional(),
		paramDefinitions: z.array(paramDefinitionSchema).optional()
	}).strict().optional(),
	directEndpoint: z.boolean().optional(),
	titleMessageRole: z.enum([
		"system",
		"user",
		"assistant"
	]).optional(),
	/** Static per-model token config: context window and per-million-token rates */
	tokenConfig: z.record(z.object({
		prompt: z.number(),
		completion: z.number(),
		context: z.number(),
		cacheRead: z.number().optional(),
		cacheWrite: z.number().optional()
	})).optional()
}));
const azureEndpointSchema = z.object({
	groups: azureGroupConfigsSchema,
	assistants: z.boolean().optional()
}).and(endpointSchema.pick({
	streamRate: true,
	titleConvo: true,
	titleMethod: true,
	titleModel: true,
	titlePrompt: true,
	titleTiming: true,
	titlePromptTemplate: true
}).partial());
/**
* Vertex AI model configuration - similar to Azure model config
* Allows specifying deployment name for each model
*/
const vertexModelConfigSchema = z.object({ 
/** The actual model ID/deployment name used by Vertex AI API */
deploymentName: z.string().optional() }).or(z.boolean());
/**
* Vertex AI configuration schema for Anthropic models served via Google Cloud Vertex AI.
* Similar to Azure configuration, this allows running Anthropic models through Google Cloud.
*/
const vertexAISchema = z.object({
	/** Enable Vertex AI mode for Anthropic (defaults to true when vertex config is present) */
	enabled: z.boolean().optional(),
	/** Google Cloud Project ID (optional - auto-detected from service key file if not provided) */
	projectId: z.string().optional(),
	/** Vertex AI region (e.g., 'us-east5', 'europe-west1') */
	region: z.string().default("us-east5"),
	/** Optional: Path to service account key file */
	serviceKeyFile: z.string().optional(),
	/** Optional: Default deployment name for all models (can be overridden per model) */
	deploymentName: z.string().optional(),
	/** Optional: Available models - can be string array or object with deploymentName mapping */
	models: z.union([z.array(z.string()), z.record(z.string(), vertexModelConfigSchema)]).optional()
});
/**
* Anthropic endpoint schema with optional Vertex AI configuration.
* Extends baseEndpointSchema with Vertex AI support.
*/
const anthropicEndpointSchema = baseEndpointSchema.merge(z.object({
	/** Vertex AI configuration for running Anthropic models on Google Cloud */
	vertex: vertexAISchema.optional(),
	/** Optional: List of available models */
	models: z.array(z.string()).optional()
}));
const ttsOpenaiSchema = z.object({
	url: z.string().optional(),
	apiKey: z.string(),
	model: z.string(),
	voices: z.array(z.string())
});
const ttsAzureOpenAISchema = z.object({
	instanceName: z.string(),
	apiKey: z.string(),
	deploymentName: z.string(),
	apiVersion: z.string(),
	model: z.string(),
	voices: z.array(z.string())
});
const ttsElevenLabsSchema = z.object({
	url: z.string().optional(),
	websocketUrl: z.string().optional(),
	apiKey: z.string(),
	model: z.string(),
	voices: z.array(z.string()),
	voice_settings: z.object({
		similarity_boost: z.number().optional(),
		stability: z.number().optional(),
		style: z.number().optional(),
		use_speaker_boost: z.boolean().optional()
	}).optional(),
	pronunciation_dictionary_locators: z.array(z.string()).optional()
});
const ttsLocalaiSchema = z.object({
	url: z.string(),
	apiKey: z.string().optional(),
	voices: z.array(z.string()),
	backend: z.string()
});
const ttsSchema = z.object({
	openai: ttsOpenaiSchema.optional(),
	azureOpenAI: ttsAzureOpenAISchema.optional(),
	elevenlabs: ttsElevenLabsSchema.optional(),
	localai: ttsLocalaiSchema.optional()
});
const sttOpenaiSchema = z.object({
	url: z.string().optional(),
	apiKey: z.string(),
	model: z.string()
});
const sttAzureOpenAISchema = z.object({
	instanceName: z.string(),
	apiKey: z.string(),
	deploymentName: z.string(),
	apiVersion: z.string()
});
const sttSchema = z.object({
	openai: sttOpenaiSchema.optional(),
	azureOpenAI: sttAzureOpenAISchema.optional()
});
const speechTab = z.object({
	conversationMode: z.boolean().optional(),
	advancedMode: z.boolean().optional(),
	speechToText: z.boolean().optional().or(z.object({
		/** Keep in sync with STTProviders enum (defined below — cannot reference due to eval order) */
		engineSTT: z.enum(["openai", "azureOpenAI"]).optional(),
		languageSTT: z.string().optional(),
		autoTranscribeAudio: z.boolean().optional(),
		decibelValue: z.number().optional(),
		autoSendText: z.number().optional()
	})).optional(),
	textToSpeech: z.boolean().optional().or(z.object({
		/** Keep in sync with TTSProviders enum (defined below — cannot reference due to eval order) */
		engineTTS: z.enum([
			"openai",
			"azureOpenAI",
			"elevenlabs",
			"localai"
		]).optional(),
		voice: z.string().optional(),
		languageTTS: z.string().optional(),
		automaticPlayback: z.boolean().optional(),
		playbackRate: z.number().min(.25).max(4).optional(),
		cacheTTS: z.boolean().optional()
	})).optional()
}).optional();
let RateLimitPrefix = /* @__PURE__ */ function(RateLimitPrefix) {
	RateLimitPrefix["FILE_UPLOAD"] = "FILE_UPLOAD";
	RateLimitPrefix["IMPORT"] = "IMPORT";
	RateLimitPrefix["TTS"] = "TTS";
	RateLimitPrefix["STT"] = "STT";
	return RateLimitPrefix;
}({});
const rateLimitSchema = z.object({
	fileUploads: z.object({
		ipMax: z.number().optional(),
		ipWindowInMinutes: z.number().optional(),
		userMax: z.number().optional(),
		userWindowInMinutes: z.number().optional()
	}).optional(),
	conversationsImport: z.object({
		ipMax: z.number().optional(),
		ipWindowInMinutes: z.number().optional(),
		userMax: z.number().optional(),
		userWindowInMinutes: z.number().optional()
	}).optional(),
	tts: z.object({
		ipMax: z.number().optional(),
		ipWindowInMinutes: z.number().optional(),
		userMax: z.number().optional(),
		userWindowInMinutes: z.number().optional()
	}).optional(),
	stt: z.object({
		ipMax: z.number().optional(),
		ipWindowInMinutes: z.number().optional(),
		userMax: z.number().optional(),
		userWindowInMinutes: z.number().optional()
	}).optional()
});
let EImageOutputType = /* @__PURE__ */ function(EImageOutputType) {
	EImageOutputType["PNG"] = "png";
	EImageOutputType["WEBP"] = "webp";
	EImageOutputType["JPEG"] = "jpeg";
	return EImageOutputType;
}({});
const termsOfServiceSchema = z.object({
	externalUrl: z.string().optional(),
	openNewTab: z.boolean().optional(),
	modalAcceptance: z.boolean().optional(),
	modalTitle: z.string().optional(),
	modalContent: z.string().or(z.array(z.string())).optional()
});
const localizedStringSchema = z.union([z.string(), z.record(z.string())]);
const mcpServersSchema = z.object({
	placeholder: z.string().optional(),
	use: z.boolean().optional(),
	create: z.boolean().optional(),
	share: z.boolean().optional(),
	public: z.boolean().optional(),
	configureObo: z.boolean().optional(),
	trustCheckbox: z.object({
		label: localizedStringSchema.optional(),
		subLabel: localizedStringSchema.optional()
	}).optional()
}).optional();
let RetentionMode = /* @__PURE__ */ function(RetentionMode) {
	RetentionMode["ALL"] = "all";
	RetentionMode["TEMPORARY"] = "temporary";
	return RetentionMode;
}({});
const interfaceSchema = z.object({
	privacyPolicy: z.object({
		externalUrl: z.string().optional(),
		openNewTab: z.boolean().optional()
	}).optional(),
	termsOfService: termsOfServiceSchema.optional(),
	customWelcome: z.string().optional(),
	mcpServers: mcpServersSchema.optional(),
	modelSelect: z.boolean().optional(),
	parameters: z.boolean().optional(),
	multiConvo: z.boolean().optional(),
	bookmarks: z.boolean().optional(),
	memories: z.boolean().optional(),
	presets: z.boolean().optional(),
	prompts: z.union([z.boolean(), z.object({
		use: z.boolean().optional(),
		create: z.boolean().optional(),
		share: z.boolean().optional(),
		public: z.boolean().optional()
	})]).optional(),
	agents: z.union([z.boolean(), z.object({
		use: z.boolean().optional(),
		create: z.boolean().optional(),
		share: z.boolean().optional(),
		public: z.boolean().optional()
	})]).optional(),
	temporaryChat: z.boolean().optional(),
	temporaryChatRetention: z.number().min(1).max(8760).optional(),
	autoSubmitFromUrl: z.boolean().optional(),
	retentionMode: z.nativeEnum(RetentionMode).default("temporary"),
	retainAgentFiles: z.boolean().optional(),
	runCode: z.boolean().optional(),
	webSearch: z.boolean().optional(),
	contextUsage: z.boolean().optional(),
	contextCost: z.boolean().optional(),
	currency: z.object({
		code: z.string(),
		rate: z.number().positive()
	}).optional(),
	peoplePicker: z.object({
		users: z.boolean().optional(),
		groups: z.boolean().optional(),
		roles: z.boolean().optional()
	}).optional(),
	marketplace: z.object({ use: z.boolean().optional() }).optional(),
	fileSearch: z.boolean().optional(),
	fileCitations: z.boolean().optional(),
	/** Tool keys (and `'mcp'` or an MCP server name) pinned to the prompt bar by default */
	defaultPinnedTools: z.array(z.string()).optional(),
	buildInfo: z.boolean().optional(),
	remoteAgents: z.object({
		use: z.boolean().optional(),
		create: z.boolean().optional(),
		share: z.boolean().optional(),
		public: z.boolean().optional()
	}).optional(),
	skills: z.union([z.boolean(), z.object({
		use: z.boolean().optional(),
		create: z.boolean().optional(),
		share: z.boolean().optional(),
		public: z.boolean().optional(),
		defaultActiveOnShare: z.boolean().optional()
	})]).optional(),
	sharedLinks: z.union([z.boolean(), z.object({
		create: z.boolean().optional(),
		share: z.boolean().optional(),
		public: z.boolean().optional(),
		snapshotFiles: z.boolean().optional()
	})]).optional()
}).default({
	modelSelect: true,
	parameters: true,
	presets: true,
	multiConvo: true,
	bookmarks: true,
	memories: true,
	prompts: {
		use: true,
		create: true,
		share: false,
		public: false
	},
	agents: {
		use: true,
		create: true,
		share: false,
		public: false
	},
	temporaryChat: true,
	autoSubmitFromUrl: true,
	runCode: true,
	webSearch: true,
	contextUsage: true,
	contextCost: false,
	peoplePicker: {
		users: true,
		groups: true,
		roles: true
	},
	marketplace: { use: false },
	mcpServers: {
		use: true,
		create: true,
		share: false,
		public: false
	},
	fileSearch: true,
	fileCitations: true,
	buildInfo: true,
	remoteAgents: {
		use: false,
		create: false,
		share: false,
		public: false
	},
	skills: {
		use: true,
		create: true,
		share: false,
		public: false,
		defaultActiveOnShare: false
	},
	sharedLinks: {
		create: true,
		share: true,
		public: true,
		snapshotFiles: true
	}
});
const turnstileOptionsSchema = z.object({
	language: z.string().default("auto"),
	size: z.enum([
		"normal",
		"compact",
		"flexible",
		"invisible"
	]).default("normal")
}).default({
	language: "auto",
	size: "normal"
});
const turnstileSchema = z.object({
	siteKey: z.string(),
	options: turnstileOptionsSchema.optional()
});
let OCRStrategy = /* @__PURE__ */ function(OCRStrategy) {
	OCRStrategy["MISTRAL_OCR"] = "mistral_ocr";
	OCRStrategy["CUSTOM_OCR"] = "custom_ocr";
	OCRStrategy["AZURE_MISTRAL_OCR"] = "azure_mistral_ocr";
	OCRStrategy["VERTEXAI_MISTRAL_OCR"] = "vertexai_mistral_ocr";
	OCRStrategy["DOCUMENT_PARSER"] = "document_parser";
	return OCRStrategy;
}({});
let SearchCategories = /* @__PURE__ */ function(SearchCategories) {
	SearchCategories["PROVIDERS"] = "providers";
	SearchCategories["SCRAPERS"] = "scrapers";
	SearchCategories["RERANKERS"] = "rerankers";
	return SearchCategories;
}({});
let SearchProviders = /* @__PURE__ */ function(SearchProviders) {
	SearchProviders["SERPER"] = "serper";
	SearchProviders["SEARXNG"] = "searxng";
	SearchProviders["TAVILY"] = "tavily";
	return SearchProviders;
}({});
let ScraperProviders = /* @__PURE__ */ function(ScraperProviders) {
	ScraperProviders["FIRECRAWL"] = "firecrawl";
	ScraperProviders["SERPER"] = "serper";
	ScraperProviders["TAVILY"] = "tavily";
	return ScraperProviders;
}({});
let RerankerTypes = /* @__PURE__ */ function(RerankerTypes) {
	RerankerTypes["JINA"] = "jina";
	RerankerTypes["COHERE"] = "cohere";
	RerankerTypes["NONE"] = "none";
	return RerankerTypes;
}({});
let SafeSearchTypes = /* @__PURE__ */ function(SafeSearchTypes) {
	SafeSearchTypes[SafeSearchTypes["OFF"] = 0] = "OFF";
	SafeSearchTypes[SafeSearchTypes["MODERATE"] = 1] = "MODERATE";
	SafeSearchTypes[SafeSearchTypes["STRICT"] = 2] = "STRICT";
	return SafeSearchTypes;
}({});
const webSearchSchema = z.object({
	serperApiKey: z.string().optional().default("${SERPER_API_KEY}"),
	searxngInstanceUrl: z.string().optional().default("${SEARXNG_INSTANCE_URL}"),
	searxngApiKey: z.string().optional().default("${SEARXNG_API_KEY}"),
	firecrawlApiKey: z.string().optional().default("${FIRECRAWL_API_KEY}"),
	firecrawlApiUrl: z.string().optional().default("${FIRECRAWL_API_URL}"),
	firecrawlVersion: z.string().optional().default("${FIRECRAWL_VERSION}"),
	tavilyApiKey: z.string().optional().default("${TAVILY_API_KEY}"),
	tavilySearchUrl: z.string().optional().default("${TAVILY_SEARCH_URL}"),
	tavilyExtractUrl: z.string().optional().default("${TAVILY_EXTRACT_URL}"),
	jinaApiKey: z.string().optional().default("${JINA_API_KEY}"),
	jinaApiUrl: z.string().optional().default("${JINA_API_URL}"),
	cohereApiKey: z.string().optional().default("${COHERE_API_KEY}"),
	searchProvider: z.nativeEnum(SearchProviders).optional(),
	scraperProvider: z.nativeEnum(ScraperProviders).optional(),
	rerankerType: z.nativeEnum(RerankerTypes).optional(),
	scraperTimeout: z.number().int().nonnegative().optional(),
	safeSearch: z.nativeEnum(SafeSearchTypes).default(1),
	firecrawlOptions: z.object({
		formats: z.array(z.string()).optional(),
		includeTags: z.array(z.string()).optional(),
		excludeTags: z.array(z.string()).optional(),
		headers: z.record(z.string()).optional(),
		waitFor: z.number().optional(),
		timeout: z.number().int().nonnegative().optional(),
		maxAge: z.number().optional(),
		mobile: z.boolean().optional(),
		skipTlsVerification: z.boolean().optional(),
		blockAds: z.boolean().optional(),
		removeBase64Images: z.boolean().optional(),
		parsePDF: z.boolean().optional(),
		storeInCache: z.boolean().optional(),
		zeroDataRetention: z.boolean().optional(),
		location: z.object({
			country: z.string().optional(),
			languages: z.array(z.string()).optional()
		}).optional(),
		onlyMainContent: z.boolean().optional(),
		changeTrackingOptions: z.object({
			modes: z.array(z.string()).optional(),
			schema: z.record(z.unknown()).optional(),
			prompt: z.string().optional(),
			tag: z.string().nullable().optional()
		}).optional()
	}).optional(),
	tavilySearchOptions: z.object({
		searchDepth: z.enum([
			"basic",
			"advanced",
			"fast",
			"ultra-fast"
		]).optional(),
		maxResults: z.number().int().min(1).max(20).optional(),
		includeImages: z.boolean().optional(),
		includeAnswer: z.union([z.boolean(), z.enum(["basic", "advanced"])]).optional(),
		includeRawContent: z.union([z.boolean(), z.enum(["markdown", "text"])]).optional(),
		includeDomains: z.array(z.string()).optional(),
		excludeDomains: z.array(z.string()).optional(),
		topic: z.enum([
			"general",
			"news",
			"finance"
		]).optional(),
		timeRange: z.enum([
			"day",
			"week",
			"month",
			"year",
			"d",
			"w",
			"m",
			"y"
		]).optional(),
		includeImageDescriptions: z.boolean().optional(),
		includeFavicon: z.boolean().optional(),
		chunksPerSource: z.number().int().min(1).max(3).optional(),
		safeSearch: z.boolean().optional(),
		timeout: z.number().int().nonnegative().max(12e4).optional()
	}).optional(),
	tavilyScraperOptions: z.object({
		extractDepth: z.enum(["basic", "advanced"]).optional(),
		includeImages: z.boolean().optional(),
		includeFavicon: z.boolean().optional(),
		format: z.enum(["markdown", "text"]).optional(),
		timeout: z.number().int().nonnegative().max(12e4).optional()
	}).optional()
});
const ocrSchema = z.object({
	mistralModel: z.string().optional(),
	apiKey: z.string().optional().default("${OCR_API_KEY}"),
	baseURL: z.string().optional().default("${OCR_BASEURL}"),
	strategy: z.nativeEnum(OCRStrategy).default("mistral_ocr")
});
const balanceSchema = z.object({
	enabled: z.boolean().optional().default(false),
	startBalance: z.number().optional().default(2e4),
	autoRefillEnabled: z.boolean().optional().default(false),
	refillIntervalValue: z.number().optional().default(30),
	refillIntervalUnit: z.enum(REFILL_INTERVAL_UNITS).optional().default("days"),
	refillAmount: z.number().optional().default(1e4)
});
const transactionsSchema = z.object({ enabled: z.boolean().optional().default(true) });
const DEFAULT_MEMORY_MAX_INPUT_TOKENS = 12e3;
const memorySchema = z.object({
	disabled: z.boolean().optional(),
	validKeys: z.array(z.string()).optional(),
	tokenLimit: z.number().optional(),
	charLimit: z.number().optional().default(1e4),
	maxInputTokens: z.number().int().positive().optional().default(DEFAULT_MEMORY_MAX_INPUT_TOKENS),
	personalize: z.boolean().default(true),
	messageWindowSize: z.number().optional().default(5),
	agent: z.union([z.object({
		enabled: z.boolean().optional(),
		id: z.string()
	}), z.object({
		enabled: z.boolean().optional(),
		provider: z.string(),
		model: z.string(),
		instructions: z.string().optional(),
		model_parameters: z.record(z.union([
			z.string(),
			z.number(),
			z.boolean()
		])).optional()
	})]).optional()
});
const summarizationTriggerSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("token_ratio"),
		value: z.number().finite().min(0).max(1)
	}),
	z.object({
		type: z.literal("remaining_tokens"),
		value: z.number().finite().int().positive()
	}),
	z.object({
		type: z.literal("messages_to_refine"),
		value: z.number().finite().int().positive()
	})
]);
const contextPruningSchema = z.object({
	enabled: z.boolean().optional(),
	keepLastAssistants: z.number().min(0).max(10).optional(),
	softTrimRatio: z.number().min(0).max(1).optional(),
	hardClearRatio: z.number().min(0).max(1).optional(),
	minPrunableToolChars: z.number().min(0).optional()
});
const summarizationConfigSchema = z.object({
	enabled: z.boolean().optional(),
	provider: z.string().optional(),
	model: z.string().optional(),
	parameters: z.record(z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null()
	])).optional(),
	trigger: summarizationTriggerSchema.optional(),
	prompt: z.string().optional(),
	updatePrompt: z.string().optional(),
	reserveRatio: z.number().min(0).max(1).optional(),
	maxSummaryTokens: z.number().positive().optional(),
	contextPruning: contextPruningSchema.optional()
});
const customEndpointsSchema = z.array(endpointSchema.partial()).optional();
const messageFilterPiiCustomPatternSchema = z.object({
	id: z.string().min(1),
	label: z.string().min(1),
	regex: z.string().min(1).refine((value) => {
		try {
			new RegExp(value, "g");
			return true;
		} catch {
			return false;
		}
	}, { message: "Invalid regex" })
});
const messageFilterPiiSchema = z.object({
	starterPatterns: z.array(z.string()).optional(),
	customPatterns: z.array(messageFilterPiiCustomPatternSchema).optional()
});
const messageFilterSchema = z.object({ pii: messageFilterPiiSchema.optional() });
const configSchema = z.object({
	version: z.string(),
	cache: z.boolean().default(true),
	ocr: ocrSchema.optional(),
	webSearch: webSearchSchema.optional(),
	memory: memorySchema.optional(),
	summarization: summarizationConfigSchema.optional(),
	skillSync: skillSyncConfigSchema,
	secureImageLinks: z.boolean().optional(),
	imageOutputType: z.nativeEnum(EImageOutputType).default("png"),
	includedTools: z.array(z.string()).optional(),
	filteredTools: z.array(z.string()).optional(),
	mcpServers: MCPServersSchema.optional(),
	mcpSettings: z.object({
		allowedDomains: z.array(z.string()).optional(),
		allowedAddresses: allowedAddressesSchema
	}).optional(),
	interface: interfaceSchema,
	turnstile: turnstileSchema.optional(),
	fileStrategy: fileStorageSchema.default("local"),
	fileStrategies: fileStrategiesSchema,
	cloudfront: cloudfrontConfigSchema,
	actions: z.object({
		allowedDomains: z.array(z.string()).optional(),
		allowedAddresses: allowedAddressesSchema
	}).optional(),
	registration: z.object({
		socialLogins: z.array(z.string()).optional(),
		allowedDomains: z.array(z.string()).optional()
	}).default({ socialLogins: defaultSocialLogins }),
	balance: balanceSchema.optional(),
	transactions: transactionsSchema.optional(),
	speech: z.object({
		tts: ttsSchema.optional(),
		stt: sttSchema.optional(),
		speechTab: speechTab.optional()
	}).optional(),
	rateLimits: rateLimitSchema.optional(),
	fileConfig: fileConfigSchema.optional(),
	modelSpecs: specsConfigSchema.optional(),
	messageFilter: messageFilterSchema.optional(),
	endpoints: z.object({
		allowedAddresses: allowedAddressesSchema,
		all: baseEndpointSchema.omit({ baseURL: true }).optional(),
		["openAI"]: baseEndpointSchema.optional(),
		["google"]: baseEndpointSchema.optional(),
		["anthropic"]: anthropicEndpointSchema.optional(),
		["azureOpenAI"]: azureEndpointSchema.optional(),
		["azureAssistants"]: assistantEndpointSchema.optional(),
		["assistants"]: assistantEndpointSchema.optional(),
		["agents"]: agentsEndpointSchema.optional(),
		["custom"]: customEndpointsSchema.optional(),
		["bedrock"]: bedrockEndpointSchema.optional()
	}).strict().refine((data) => Object.keys(data).length > 0, { message: "At least one `endpoints` field must be provided." }).optional()
});
const getConfigDefaults = () => getSchemaDefaults(configSchema);
let KnownEndpoints = /* @__PURE__ */ function(KnownEndpoints) {
	KnownEndpoints["anyscale"] = "anyscale";
	KnownEndpoints["apipie"] = "apipie";
	KnownEndpoints["cohere"] = "cohere";
	KnownEndpoints["fireworks"] = "fireworks";
	KnownEndpoints["deepseek"] = "deepseek";
	KnownEndpoints["moonshot"] = "moonshot";
	KnownEndpoints["groq"] = "groq";
	KnownEndpoints["helicone"] = "helicone";
	KnownEndpoints["huggingface"] = "huggingface";
	KnownEndpoints["mistral"] = "mistral";
	KnownEndpoints["mlx"] = "mlx";
	KnownEndpoints["ollama"] = "ollama";
	KnownEndpoints["openrouter"] = "openrouter";
	KnownEndpoints["perplexity"] = "perplexity";
	KnownEndpoints["shuttleai"] = "shuttleai";
	KnownEndpoints["together.ai"] = "together.ai";
	KnownEndpoints["unify"] = "unify";
	KnownEndpoints["vercel"] = "vercel";
	KnownEndpoints["xai"] = "xai";
	return KnownEndpoints;
}({});
let FetchTokenConfig = /* @__PURE__ */ function(FetchTokenConfig) {
	FetchTokenConfig["openrouter"] = "openrouter";
	FetchTokenConfig["helicone"] = "helicone";
	return FetchTokenConfig;
}({});
const defaultEndpoints = [
	"openAI",
	"assistants",
	"azureAssistants",
	"azureOpenAI",
	"agents",
	"google",
	"anthropic",
	"custom",
	"bedrock"
];
const alternateName = {
	["openAI"]: "OpenAI",
	["assistants"]: "Assistants",
	["agents"]: "My Agents",
	["azureAssistants"]: "Azure Assistants",
	["azureOpenAI"]: "Azure OpenAI",
	["google"]: "Google",
	["anthropic"]: "Anthropic",
	["custom"]: "Custom",
	["bedrock"]: "AWS Bedrock",
	["ollama"]: "Ollama",
	["deepseek"]: "DeepSeek",
	["moonshot"]: "Moonshot",
	["xai"]: "xAI",
	["vercel"]: "Vercel",
	["helicone"]: "Helicone"
};
const sharedOpenAIModels = [
	"gpt-5.5",
	"gpt-5.5-pro",
	"chat-latest",
	"gpt-5.4",
	"gpt-5.4-pro",
	"gpt-5.4-mini",
	"gpt-5.4-nano",
	"gpt-5.3-codex",
	"gpt-5.2",
	"gpt-5.1",
	"gpt-5.1-codex",
	"gpt-5.1-codex-max",
	"gpt-5.1-codex-mini",
	"gpt-5",
	"gpt-5-mini",
	"gpt-5-nano",
	"gpt-4.1",
	"gpt-4.1-mini",
	"gpt-4.1-nano",
	"gpt-4o-mini",
	"gpt-4o"
];
const sharedAnthropicModels = [
	"claude-fable-5",
	"claude-opus-4-8",
	"claude-opus-4-7",
	"claude-sonnet-4-6",
	"claude-opus-4-6",
	"claude-sonnet-4-5",
	"claude-sonnet-4-5-20250929",
	"claude-haiku-4-5",
	"claude-haiku-4-5-20251001",
	"claude-opus-4-1",
	"claude-opus-4-1-20250805",
	"claude-opus-4-5",
	"claude-sonnet-4-20250514",
	"claude-sonnet-4-0",
	"claude-opus-4-20250514",
	"claude-opus-4-0",
	"claude-3-7-sonnet-latest",
	"claude-3-7-sonnet-20250219",
	"claude-3-5-haiku-20241022",
	"claude-3-5-sonnet-20241022",
	"claude-3-5-sonnet-20240620",
	"claude-3-5-sonnet-latest"
];
const bedrockModels = [
	"anthropic.claude-fable-5",
	"anthropic.claude-opus-4-8",
	"anthropic.claude-opus-4-7",
	"anthropic.claude-sonnet-4-6",
	"anthropic.claude-opus-4-6-v1",
	"anthropic.claude-sonnet-4-5-20250929-v1:0",
	"anthropic.claude-haiku-4-5-20251001-v1:0",
	"anthropic.claude-opus-4-1-20250805-v1:0",
	"anthropic.claude-3-5-sonnet-20241022-v2:0",
	"anthropic.claude-3-5-sonnet-20240620-v1:0",
	"anthropic.claude-3-5-haiku-20241022-v1:0",
	"cohere.command-r-v1:0",
	"cohere.command-r-plus-v1:0",
	"meta.llama2-13b-chat-v1",
	"meta.llama2-70b-chat-v1",
	"meta.llama3-8b-instruct-v1:0",
	"meta.llama3-70b-instruct-v1:0",
	"meta.llama3-1-8b-instruct-v1:0",
	"meta.llama3-1-70b-instruct-v1:0",
	"meta.llama3-1-405b-instruct-v1:0",
	"mistral.mistral-7b-instruct-v0:2",
	"mistral.mixtral-8x7b-instruct-v0:1",
	"mistral.mistral-large-2402-v1:0",
	"mistral.mistral-large-2407-v1:0",
	"mistral.mistral-small-2402-v1:0",
	"ai21.jamba-instruct-v1:0",
	"amazon.titan-text-lite-v1",
	"amazon.titan-text-express-v1",
	"amazon.titan-text-premier-v1:0"
];
const defaultModels = {
	["azureAssistants"]: sharedOpenAIModels,
	["assistants"]: [...sharedOpenAIModels, "chatgpt-4o-latest"],
	["agents"]: sharedOpenAIModels,
	["google"]: [
		"gemini-3.5-flash",
		"gemini-3.1-pro-preview",
		"gemini-3.1-pro-preview-customtools",
		"gemini-3.1-flash-lite-preview",
		"gemini-3-pro-preview",
		"gemini-3-flash-preview",
		"gemini-2.5-pro",
		"gemini-2.5-flash",
		"gemini-2.5-flash-lite"
	],
	["anthropic"]: sharedAnthropicModels,
	["openAI"]: [
		...sharedOpenAIModels,
		"chatgpt-4o-latest",
		"gpt-4-vision-preview",
		"gpt-3.5-turbo-instruct-0914",
		"gpt-3.5-turbo-instruct"
	],
	["bedrock"]: bedrockModels
};
const fitlerAssistantModels = (str) => {
	return /gpt-4|gpt-3\\.5/i.test(str) && !/vision|instruct/i.test(str);
};
const openAIModels = defaultModels["openAI"];
const initialModelsConfig = {
	initial: [],
	["openAI"]: openAIModels,
	["assistants"]: openAIModels.filter(fitlerAssistantModels),
	["agents"]: openAIModels,
	["azureOpenAI"]: openAIModels,
	["google"]: defaultModels["google"],
	["anthropic"]: defaultModels["anthropic"],
	["bedrock"]: defaultModels["bedrock"]
};
const EndpointURLs = {
	["assistants"]: `${apiBaseUrl()}/api/assistants/v2/chat`,
	["azureAssistants"]: `${apiBaseUrl()}/api/assistants/v1/chat`,
	["agents"]: `${apiBaseUrl()}/api/agents/chat`
};
const modularEndpoints = new Set([
	"anthropic",
	"google",
	"openAI",
	"azureOpenAI",
	"custom",
	"agents",
	"bedrock"
]);
const supportsBalanceCheck = {
	["custom"]: true,
	["openAI"]: true,
	["anthropic"]: true,
	["assistants"]: true,
	["agents"]: true,
	["azureAssistants"]: true,
	["azureOpenAI"]: true,
	["bedrock"]: true,
	["google"]: true
};
const visionModels = [
	"qwen-vl",
	"grok-vision",
	"grok-2-vision",
	"grok-3",
	"gpt-4o-mini",
	"gpt-4o",
	"gpt-4-turbo",
	"gpt-4-vision",
	"o4-mini",
	"o3",
	"o1",
	"gpt-5",
	"gpt-4.1",
	"gpt-4.5",
	"llava",
	"llava-13b",
	"gemini-pro-vision",
	"claude-3",
	"gemma",
	"gemini-exp",
	"gemini-1.5",
	"gemini-2",
	"gemini-2.5",
	"gemini-3",
	"moondream",
	"llama3.2-vision",
	"llama-3.2-11b-vision",
	"llama-3-2-11b-vision",
	"llama-3.2-90b-vision",
	"llama-3-2-90b-vision",
	"llama-4",
	"claude-opus-4",
	"claude-sonnet-4",
	"claude-haiku-4"
];
let VisionModes = /* @__PURE__ */ function(VisionModes) {
	VisionModes["generative"] = "generative";
	VisionModes["agents"] = "agents";
	return VisionModes;
}({});
function validateVisionModel({ model, additionalModels = [], availableModels }) {
	if (!model) return false;
	if (model.includes("gpt-4-turbo-preview") || model.includes("o1-mini")) return false;
	if (availableModels && !availableModels.includes(model)) return false;
	return visionModels.concat(additionalModels).some((visionModel) => model.includes(visionModel));
}
const imageGenTools = new Set([
	"dalle",
	"dall-e",
	"stable-diffusion",
	"flux",
	"gemini_image_gen"
]);
/**
* Enum for collections using infinite queries
*/
let InfiniteCollections = /* @__PURE__ */ function(InfiniteCollections) {
	/**
	* Collection for Prompt Groups
	*/
	InfiniteCollections["PROMPT_GROUPS"] = "promptGroups";
	/**
	* Collection for Shared Links
	*/
	InfiniteCollections["SHARED_LINKS"] = "sharedLinks";
	return InfiniteCollections;
}({});
/**
* Enum for time intervals
*/
let Time = /* @__PURE__ */ function(Time) {
	Time[Time["ONE_DAY"] = 864e5] = "ONE_DAY";
	Time[Time["TWELVE_HOURS"] = 432e5] = "TWELVE_HOURS";
	Time[Time["ONE_HOUR"] = 36e5] = "ONE_HOUR";
	Time[Time["THIRTY_MINUTES"] = 18e5] = "THIRTY_MINUTES";
	Time[Time["TEN_MINUTES"] = 6e5] = "TEN_MINUTES";
	Time[Time["FIVE_MINUTES"] = 3e5] = "FIVE_MINUTES";
	Time[Time["THREE_MINUTES"] = 18e4] = "THREE_MINUTES";
	Time[Time["TWO_MINUTES"] = 12e4] = "TWO_MINUTES";
	Time[Time["ONE_MINUTE"] = 6e4] = "ONE_MINUTE";
	Time[Time["THIRTY_SECONDS"] = 3e4] = "THIRTY_SECONDS";
	return Time;
}({});
/**
* Enum for cache keys.
*/
let CacheKeys = /* @__PURE__ */ function(CacheKeys) {
	/**
	* Key for the config store namespace.
	*/
	CacheKeys["CONFIG_STORE"] = "CONFIG_STORE";
	/**
	* Key for the tool cache namespace (plugins, MCP tools, tool definitions).
	*/
	CacheKeys["TOOL_CACHE"] = "TOOL_CACHE";
	/**
	* Key for the roles cache.
	*/
	CacheKeys["ROLES"] = "ROLES";
	/**
	* Key for the title generation cache.
	*/
	CacheKeys["GEN_TITLE"] = "GEN_TITLE";
	/**
	* Key for the tools cache.
	*/
	CacheKeys["TOOLS"] = "TOOLS";
	/**
	* Key for the model config cache.
	*/
	CacheKeys["MODELS_CONFIG"] = "MODELS_CONFIG";
	/**
	* Key for the model queries cache.
	*/
	CacheKeys["MODEL_QUERIES"] = "MODEL_QUERIES";
	/**
	* Key for the default startup config cache.
	*/
	CacheKeys["STARTUP_CONFIG"] = "STARTUP_CONFIG";
	/**
	* Key for the default endpoint config cache.
	*/
	CacheKeys["ENDPOINT_CONFIG"] = "ENDPOINT_CONFIG";
	/**
	* Key for accessing the model token config cache.
	*/
	CacheKeys["TOKEN_CONFIG"] = "TOKEN_CONFIG";
	/**
	* Key for the app config namespace.
	*/
	CacheKeys["APP_CONFIG"] = "APP_CONFIG";
	/**
	* Key for accessing Abort Keys
	*/
	CacheKeys["ABORT_KEYS"] = "ABORT_KEYS";
	/**
	* Key for the bans cache.
	*/
	CacheKeys["BANS"] = "BANS";
	/**
	* Key for the encoded domains cache.
	* Used by Azure OpenAI Assistants.
	*/
	CacheKeys["ENCODED_DOMAINS"] = "ENCODED_DOMAINS";
	/**
	* Key for the cached audio run Ids.
	*/
	CacheKeys["AUDIO_RUNS"] = "AUDIO_RUNS";
	/**
	* Key for in-progress messages.
	*/
	CacheKeys["MESSAGES"] = "MESSAGES";
	/**
	* Key for in-progress flow states.
	*/
	CacheKeys["FLOWS"] = "FLOWS";
	/**
	* Key for pending chat requests (concurrency check)
	*/
	CacheKeys["PENDING_REQ"] = "PENDING_REQ";
	/**
	* Key for s3 check intervals per user
	*/
	CacheKeys["S3_EXPIRY_INTERVAL"] = "S3_EXPIRY_INTERVAL";
	/**
	* key for open id exchanged tokens
	*/
	CacheKeys["OPENID_EXCHANGED_TOKENS"] = "OPENID_EXCHANGED_TOKENS";
	/**
	* Key for OpenID session.
	*/
	CacheKeys["OPENID_SESSION"] = "OPENID_SESSION";
	/**
	* Key for SAML session.
	*/
	CacheKeys["SAML_SESSION"] = "SAML_SESSION";
	/**
	* Key for admin panel OAuth exchange codes (one-time-use, short TTL).
	*/
	CacheKeys["ADMIN_OAUTH_EXCHANGE"] = "ADMIN_OAUTH_EXCHANGE";
	return CacheKeys;
}({});
/**
* Enum for violation types, used to identify, log, and cache violations.
*/
let ViolationTypes = /* @__PURE__ */ function(ViolationTypes) {
	/**
	* File Upload Violations (exceeding limit).
	*/
	ViolationTypes["FILE_UPLOAD_LIMIT"] = "file_upload_limit";
	/**
	* Illegal Model Request (not available).
	*/
	ViolationTypes["ILLEGAL_MODEL_REQUEST"] = "illegal_model_request";
	/**
	* Token Limit Violation.
	*/
	ViolationTypes["TOKEN_BALANCE"] = "token_balance";
	/**
	* An issued ban.
	*/
	ViolationTypes["BAN"] = "ban";
	/**
	* TTS Request Limit Violation.
	*/
	ViolationTypes["TTS_LIMIT"] = "tts_limit";
	/**
	* STT Request Limit Violation.
	*/
	ViolationTypes["STT_LIMIT"] = "stt_limit";
	/**
	* Reset Password Limit Violation.
	*/
	ViolationTypes["RESET_PASSWORD_LIMIT"] = "reset_password_limit";
	/**
	* Verify Email Limit Violation.
	*/
	ViolationTypes["VERIFY_EMAIL_LIMIT"] = "verify_email_limit";
	/**
	* Verify Conversation Access violation.
	*/
	ViolationTypes["CONVO_ACCESS"] = "convo_access";
	/**
	* Tool Call Limit Violation.
	*/
	ViolationTypes["TOOL_CALL_LIMIT"] = "tool_call_limit";
	/**
	* General violation (catch-all).
	*/
	ViolationTypes["GENERAL"] = "general";
	/**
	* Login attempt violations.
	*/
	ViolationTypes["LOGINS"] = "logins";
	/**
	* Concurrent request violations.
	*/
	ViolationTypes["CONCURRENT"] = "concurrent";
	/**
	* Non-browser access violations.
	*/
	ViolationTypes["NON_BROWSER"] = "non_browser";
	/**
	* Message limit violations.
	*/
	ViolationTypes["MESSAGE_LIMIT"] = "message_limit";
	/**
	* Registration violations.
	*/
	ViolationTypes["REGISTRATIONS"] = "registrations";
	return ViolationTypes;
}({});
/**
* Enum for error message types that are not "violations" as above, used to identify client-facing errors.
*/
let ErrorTypes = /* @__PURE__ */ function(ErrorTypes) {
	/**
	* No User-provided Key.
	*/
	ErrorTypes["NO_USER_KEY"] = "no_user_key";
	/**
	* Expired User-provided Key.
	*/
	ErrorTypes["EXPIRED_USER_KEY"] = "expired_user_key";
	/**
	* Invalid User-provided Key.
	*/
	ErrorTypes["INVALID_USER_KEY"] = "invalid_user_key";
	/**
	* No Base URL Provided.
	*/
	ErrorTypes["NO_BASE_URL"] = "no_base_url";
	/**
	* Base URL targets a restricted or invalid address (SSRF protection).
	*/
	ErrorTypes["INVALID_BASE_URL"] = "invalid_base_url";
	/**
	* Moderation error
	*/
	ErrorTypes["MODERATION"] = "moderation";
	/**
	* Prompt exceeds max length
	*/
	ErrorTypes["INPUT_LENGTH"] = "INPUT_LENGTH";
	/**
	* Invalid request error, API rejected request
	*/
	ErrorTypes["INVALID_REQUEST"] = "invalid_request_error";
	/**
	* Invalid action request error, likely not on list of allowed domains
	*/
	ErrorTypes["INVALID_ACTION"] = "invalid_action_error";
	/**
	* Invalid request error, API rejected request
	*/
	ErrorTypes["NO_SYSTEM_MESSAGES"] = "no_system_messages";
	/**
	* Google provider returned an error
	*/
	ErrorTypes["GOOGLE_ERROR"] = "google_error";
	/**
	* Google provider does not allow custom tools with built-in tools
	*/
	ErrorTypes["GOOGLE_TOOL_CONFLICT"] = "google_tool_conflict";
	/**
	* Invalid Agent Provider (excluded by Admin)
	*/
	ErrorTypes["INVALID_AGENT_PROVIDER"] = "invalid_agent_provider";
	/**
	* Missing model selection
	*/
	ErrorTypes["MISSING_MODEL"] = "missing_model";
	/**
	* Models configuration not loaded
	*/
	ErrorTypes["MODELS_NOT_LOADED"] = "models_not_loaded";
	/**
	* Endpoint models not loaded
	*/
	ErrorTypes["ENDPOINT_MODELS_NOT_LOADED"] = "endpoint_models_not_loaded";
	/**
	* Generic Authentication failure
	*/
	ErrorTypes["AUTH_FAILED"] = "auth_failed";
	/**
	* Model refused to respond (content policy violation)
	*/
	ErrorTypes["REFUSAL"] = "refusal";
	/**
	* SSE stream 404 — job completed, expired, or was deleted before the subscriber connected
	*/
	ErrorTypes["STREAM_EXPIRED"] = "stream_expired";
	return ErrorTypes;
}({});
/**
* Enum for authentication keys.
*/
let AuthKeys = /* @__PURE__ */ function(AuthKeys) {
	/**
	* Key for the Service Account to use Vertex AI.
	*/
	AuthKeys["GOOGLE_SERVICE_KEY"] = "GOOGLE_SERVICE_KEY";
	/**
	* API key to use Google Generative AI.
	*
	* Note: this is not for Environment Variables, but to access encrypted object values.
	*/
	AuthKeys["GOOGLE_API_KEY"] = "GOOGLE_API_KEY";
	/**
	* API key to use Anthropic.
	*
	* Note: this is not for Environment Variables, but to access encrypted object values.
	*/
	AuthKeys["ANTHROPIC_API_KEY"] = "ANTHROPIC_API_KEY";
	return AuthKeys;
}({});
/**
* Enum for Image Detail Cost.
*
* **Low Res Fixed Cost:** `85`
*
* **High Res Calculation:**
*
* Number of `512px` Tiles * `170` + `85` (Additional Cost)
*/
let ImageDetailCost = /* @__PURE__ */ function(ImageDetailCost) {
	/**
	* Low resolution is a fixed value.
	*/
	ImageDetailCost[ImageDetailCost["LOW"] = 85] = "LOW";
	/**
	* High resolution Cost Per Tile
	*/
	ImageDetailCost[ImageDetailCost["HIGH"] = 170] = "HIGH";
	/**
	* Additional Cost added to High Resolution Total Cost
	*/
	ImageDetailCost[ImageDetailCost["ADDITIONAL"] = 85] = "ADDITIONAL";
	return ImageDetailCost;
}({});
/**
* Tab values for Settings Dialog
*/
let SettingsTabValues = /* @__PURE__ */ function(SettingsTabValues) {
	/**
	* Tab for General Settings
	*/
	SettingsTabValues["GENERAL"] = "general";
	/**
	* Tab for Chat Settings
	*/
	SettingsTabValues["CHAT"] = "chat";
	/**
	* Tab for Speech Settings
	*/
	SettingsTabValues["SPEECH"] = "speech";
	/**
	* Tab for Beta Features
	*/
	SettingsTabValues["BETA"] = "beta";
	/**
	* Tab for Data Controls
	*/
	SettingsTabValues["DATA"] = "data";
	/**
	* Tab for Balance Settings
	*/
	SettingsTabValues["BALANCE"] = "balance";
	/**
	* Tab for Account Settings
	*/
	SettingsTabValues["ACCOUNT"] = "account";
	/**
	* Chat input commands
	*/
	SettingsTabValues["COMMANDS"] = "commands";
	/**
	* Tab for Personalization Settings
	*/
	SettingsTabValues["PERSONALIZATION"] = "personalization";
	/**
	* Tab for About / Build Info
	*/
	SettingsTabValues["ABOUT"] = "about";
	return SettingsTabValues;
}({});
let STTProviders = /* @__PURE__ */ function(STTProviders) {
	/**
	* Provider for OpenAI STT
	*/
	STTProviders["OPENAI"] = "openai";
	/**
	* Provider for Microsoft Azure STT
	*/
	STTProviders["AZURE_OPENAI"] = "azureOpenAI";
	return STTProviders;
}({});
let TTSProviders = /* @__PURE__ */ function(TTSProviders) {
	/**
	* Provider for OpenAI TTS
	*/
	TTSProviders["OPENAI"] = "openai";
	/**
	* Provider for Microsoft Azure OpenAI TTS
	*/
	TTSProviders["AZURE_OPENAI"] = "azureOpenAI";
	/**
	* Provider for ElevenLabs TTS
	*/
	TTSProviders["ELEVENLABS"] = "elevenlabs";
	/**
	* Provider for LocalAI TTS
	*/
	TTSProviders["LOCALAI"] = "localai";
	return TTSProviders;
}({});
/** Enum for app-wide constants */
let Constants = /* @__PURE__ */ function(Constants) {
	/**
	* Key for the app's version. The placeholder `v0.8.7` is
	* swapped in by `@rollup/plugin-replace` during `npm run build:data-provider`
	* using the value of the root `package.json`'s `version` field. Consumers
	* always import this via the built dist bundle (see `main` field in
	* `packages/data-provider/package.json`), so production and UI code get the
	* substituted value. Only tests that import the TypeScript source directly
	* would observe the raw placeholder.
	*/
	Constants["VERSION"] = "v0.8.7";
	/** Key for the Custom Config's version (librechat.yaml). */
	Constants["CONFIG_VERSION"] = "1.3.13";
	/** Standard value for the first message's `parentMessageId` value, to indicate no parent exists. */
	Constants["NO_PARENT"] = "00000000-0000-0000-0000-000000000000";
	/** Standard value to use whatever the submission prelim. `responseMessageId` is */
	Constants["USE_PRELIM_RESPONSE_MESSAGE_ID"] = "USE_PRELIM_RESPONSE_MESSAGE_ID";
	/** Standard value for the initial conversationId before a request is sent */
	Constants["NEW_CONVO"] = "new";
	/** Standard value for the temporary conversationId after a request is sent and before the server responds */
	Constants["PENDING_CONVO"] = "PENDING";
	/** Standard value for the conversationId used for search queries */
	Constants["SEARCH"] = "search";
	/** Fixed, encoded domain length for Azure OpenAI Assistants Function name parsing. */
	Constants[Constants["ENCODED_DOMAIN_LENGTH"] = 10] = "ENCODED_DOMAIN_LENGTH";
	/** Identifier for using current_model in multi-model requests. */
	Constants["CURRENT_MODEL"] = "current_model";
	/** Common divider for text values */
	Constants["COMMON_DIVIDER"] = "__";
	/** Max length for commands */
	Constants[Constants["COMMANDS_MAX_LENGTH"] = 56] = "COMMANDS_MAX_LENGTH";
	/** Default Stream Rate (ms) */
	Constants[Constants["DEFAULT_STREAM_RATE"] = 1] = "DEFAULT_STREAM_RATE";
	/** Saved Tag */
	Constants["SAVED_TAG"] = "Saved";
	/** Max number of Conversation starters for Agents/Assistants */
	Constants[Constants["MAX_CONVO_STARTERS"] = 4] = "MAX_CONVO_STARTERS";
	/** Delimiter for MCP tools */
	Constants["mcp_delimiter"] = "_mcp_";
	/** Prefix for MCP plugins */
	Constants["mcp_prefix"] = "mcp_";
	/** Unique value to indicate all MCP servers. For backend use only. */
	Constants["mcp_all"] = "sys__all__sys";
	/** Unique value to indicate clearing MCP servers from UI state. For frontend use only. */
	Constants["mcp_clear"] = "sys__clear__sys";
	/** Key suffix for non-spec user default tool storage */
	Constants["spec_defaults_key"] = "__defaults__";
	/**
	* Unique value to indicate the MCP tool was added to an agent.
	* This helps inform the UI if the mcp server was previously added.
	* */
	Constants["mcp_server"] = "sys__server__sys";
	/**
	* Handoff Tool Name Prefix
	*/
	Constants["LC_TRANSFER_TO_"] = "lc_transfer_to_";
	/** Placeholder Agent ID for Ephemeral Agents */
	Constants["EPHEMERAL_AGENT_ID"] = "ephemeral";
	/** Programmatic Tool Calling tool name */
	Constants["PROGRAMMATIC_TOOL_CALLING"] = "run_tools_with_code";
	/** Bash Programmatic Tool Calling tool name */
	Constants["BASH_PROGRAMMATIC_TOOL_CALLING"] = "run_tools_with_bash";
	/** Subagent spawn tool name (must match `@librechat/agents` `Constants.SUBAGENT`). */
	Constants["SUBAGENT"] = "subagent";
	return Constants;
}({});
/** Maximum explicit subagent hops allowed from any root agent at runtime. */
const MAX_SUBAGENT_DEPTH = 5;
/** Maximum unique explicit subagent targets that may be loaded at runtime. */
const MAX_SUBAGENT_GRAPH_NODES = 50;
/** Maximum expanded SubagentConfig entries embedded into one run request. */
const MAX_SUBAGENT_RUN_CONFIGS = 100;
let LocalStorageKeys = /* @__PURE__ */ function(LocalStorageKeys) {
	/** Key for the admin defined App Title */
	LocalStorageKeys["APP_TITLE"] = "appTitle";
	/** Key for the last conversation setup. */
	LocalStorageKeys["LAST_CONVO_SETUP"] = "lastConversationSetup";
	/** Key for the last selected model. */
	LocalStorageKeys["LAST_MODEL"] = "lastSelectedModel";
	/** Key for the last selected tools. */
	LocalStorageKeys["LAST_TOOLS"] = "lastSelectedTools";
	/** Key for the last selected spec by name*/
	LocalStorageKeys["LAST_SPEC"] = "lastSelectedSpec";
	/** Key for temporary files to delete */
	LocalStorageKeys["FILES_TO_DELETE"] = "filesToDelete";
	/** Prefix key for the last selected assistant ID by index */
	LocalStorageKeys["ASST_ID_PREFIX"] = "assistant_id__";
	/** Prefix key for the last selected agent ID by index */
	LocalStorageKeys["AGENT_ID_PREFIX"] = "agent_id__";
	/** Key for the last selected fork setting */
	LocalStorageKeys["FORK_SETTING"] = "forkSetting";
	/** Key for remembering the last selected option, instead of manually selecting */
	LocalStorageKeys["REMEMBER_FORK_OPTION"] = "rememberDefaultFork";
	/** Key for remembering the split at target fork option modifier */
	LocalStorageKeys["FORK_SPLIT_AT_TARGET"] = "splitAtTarget";
	/** Key for saving text drafts */
	LocalStorageKeys["TEXT_DRAFT"] = "textDraft_";
	/** Key for saving file drafts */
	LocalStorageKeys["FILES_DRAFT"] = "filesDraft_";
	/** Key for last Selected Prompt Category */
	LocalStorageKeys["LAST_PROMPT_CATEGORY"] = "lastPromptCategory";
	/** Key for rendering User Messages as Markdown */
	LocalStorageKeys["ENABLE_USER_MSG_MARKDOWN"] = "enableUserMsgMarkdown";
	/** Key for auto-expanding tool call details */
	LocalStorageKeys["AUTO_EXPAND_TOOLS"] = "autoExpandTools";
	/** Last selected MCP values per conversation ID */
	LocalStorageKeys["LAST_MCP_"] = "LAST_MCP_";
	/** Last checked toggle for Code Interpreter API per conversation ID */
	LocalStorageKeys["LAST_CODE_TOGGLE_"] = "LAST_CODE_TOGGLE_";
	/** Last checked toggle for Web Search per conversation ID */
	LocalStorageKeys["LAST_WEB_SEARCH_TOGGLE_"] = "LAST_WEB_SEARCH_TOGGLE_";
	/** Last checked toggle for File Search per conversation ID */
	LocalStorageKeys["LAST_FILE_SEARCH_TOGGLE_"] = "LAST_FILE_SEARCH_TOGGLE_";
	/** Last checked toggle for Artifacts per conversation ID */
	LocalStorageKeys["LAST_ARTIFACTS_TOGGLE_"] = "LAST_ARTIFACTS_TOGGLE_";
	/** Last checked toggle for Skills per conversation ID */
	LocalStorageKeys["LAST_SKILLS_TOGGLE_"] = "LAST_SKILLS_TOGGLE_";
	/** Key for the last selected agent provider */
	LocalStorageKeys["LAST_AGENT_PROVIDER"] = "lastAgentProvider";
	/** Key for the last selected agent model */
	LocalStorageKeys["LAST_AGENT_MODEL"] = "lastAgentModel";
	/** Pin state for MCP tools per conversation ID */
	LocalStorageKeys["PIN_MCP_"] = "PIN_MCP_";
	/** Pin state for Web Search per conversation ID */
	LocalStorageKeys["PIN_WEB_SEARCH_"] = "PIN_WEB_SEARCH_";
	/** Pin state for Code Interpreter per conversation ID */
	LocalStorageKeys["PIN_CODE_INTERPRETER_"] = "PIN_CODE_INTERPRETER_";
	return LocalStorageKeys;
}({});
let ForkOptions = /* @__PURE__ */ function(ForkOptions) {
	/** Key for direct path option */
	ForkOptions["DIRECT_PATH"] = "directPath";
	/** Key for including branches */
	ForkOptions["INCLUDE_BRANCHES"] = "includeBranches";
	/** Key for target level fork (default) */
	ForkOptions["TARGET_LEVEL"] = "targetLevel";
	/** Default option */
	ForkOptions["DEFAULT"] = "default";
	return ForkOptions;
}({});
/**
* Enum for Cohere related constants
*/
let CohereConstants = /* @__PURE__ */ function(CohereConstants) {
	/**
	* Cohere API Endpoint, for special handling
	*/
	CohereConstants["API_URL"] = "https://api.cohere.ai/v1";
	/**
	* Role for "USER" messages
	*/
	CohereConstants["ROLE_USER"] = "USER";
	/**
	* Role for "SYSTEM" messages
	*/
	CohereConstants["ROLE_SYSTEM"] = "SYSTEM";
	/**
	* Role for "CHATBOT" messages
	*/
	CohereConstants["ROLE_CHATBOT"] = "CHATBOT";
	/**
	* Title message as required by Cohere
	*/
	CohereConstants["TITLE_MESSAGE"] = "TITLE:";
	return CohereConstants;
}({});
let SystemCategories = /* @__PURE__ */ function(SystemCategories) {
	SystemCategories["ALL"] = "sys__all__sys";
	SystemCategories["MY_PROMPTS"] = "sys__my__prompts__sys";
	SystemCategories["NO_CATEGORY"] = "sys__no__category__sys";
	SystemCategories["SHARED_PROMPTS"] = "sys__shared__prompts__sys";
	return SystemCategories;
}({});
const providerEndpointMap = {
	["openAI"]: "openAI",
	["bedrock"]: "bedrock",
	["anthropic"]: "anthropic",
	["azureOpenAI"]: "azureOpenAI"
};
const specialVariables = {
	current_date: true,
	current_user: true,
	iso_datetime: true,
	current_datetime: true
};
/**
* Retrieves a specific field from the endpoints configuration for a given endpoint key.
* Does not infer or default any endpoint type when absent.
*/
function getEndpointField(endpointsConfig, endpoint, property) {
	if (!endpointsConfig || endpoint === null || endpoint === void 0) return;
	const config = endpointsConfig[endpoint];
	if (!config) return;
	return config[property];
}
/**
* Resolves the effective endpoint type:
* - Non-agents endpoint: config.type || endpoint
* - Agents + provider: config[provider].type || provider
* - Agents, no provider: EModelEndpoint.agents
*
* Returns `undefined` when endpoint is null/undefined.
*/
function resolveEndpointType(endpointsConfig, endpoint, agentProvider) {
	if (!endpoint) return;
	if (!isAgentsEndpoint(endpoint)) return getEndpointField(endpointsConfig, endpoint, "type") || endpoint;
	if (agentProvider) {
		const providerType = getEndpointField(endpointsConfig, agentProvider, "type");
		if (providerType) return providerType;
		return agentProvider;
	}
	return "agents";
}
/** Resolves the `defaultParamsEndpoint` for a given endpoint from its custom params config */
function getDefaultParamsEndpoint(endpointsConfig, endpoint) {
	if (!endpointsConfig || !endpoint) return;
	return endpointsConfig[endpoint]?.customParams?.defaultParamsEndpoint;
}
//#endregion
//#region src/accessPermissions.ts
/**
* Granular Permission System Types for Agent Sharing
*
* This file contains TypeScript interfaces and Zod schemas for the enhanced
* agent permission system that supports sharing with specific users/groups
* and Entra ID integration.
*/
/**
* Principal types for permission system
*/
let PrincipalType = /* @__PURE__ */ function(PrincipalType) {
	PrincipalType["USER"] = "user";
	PrincipalType["GROUP"] = "group";
	PrincipalType["PUBLIC"] = "public";
	PrincipalType["ROLE"] = "role";
	return PrincipalType;
}({});
/**
* Principal model types for MongoDB references
*/
let PrincipalModel = /* @__PURE__ */ function(PrincipalModel) {
	PrincipalModel["USER"] = "User";
	PrincipalModel["GROUP"] = "Group";
	PrincipalModel["ROLE"] = "Role";
	return PrincipalModel;
}({});
/**
* Resource types for permission system
*/
let ResourceType = /* @__PURE__ */ function(ResourceType) {
	ResourceType["AGENT"] = "agent";
	ResourceType["PROMPTGROUP"] = "promptGroup";
	ResourceType["MCPSERVER"] = "mcpServer";
	ResourceType["REMOTE_AGENT"] = "remoteAgent";
	ResourceType["SKILL"] = "skill";
	ResourceType["SHARED_LINK"] = "sharedLink";
	return ResourceType;
}({});
/**
* Permission bit constants for bitwise operations
*/
let PermissionBits = /* @__PURE__ */ function(PermissionBits) {
	/** 001 - Can view and use agent */
	PermissionBits[PermissionBits["VIEW"] = 1] = "VIEW";
	/**  010 - Can modify agent settings */
	PermissionBits[PermissionBits["EDIT"] = 2] = "EDIT";
	/**  100 - Can delete agent */
	PermissionBits[PermissionBits["DELETE"] = 4] = "DELETE";
	/**  1000 - Can share agent with others (future) */
	PermissionBits[PermissionBits["SHARE"] = 8] = "SHARE";
	return PermissionBits;
}({});
/**
* Standard access role IDs
*/
let AccessRoleIds = /* @__PURE__ */ function(AccessRoleIds) {
	AccessRoleIds["AGENT_VIEWER"] = "agent_viewer";
	AccessRoleIds["AGENT_EDITOR"] = "agent_editor";
	AccessRoleIds["AGENT_OWNER"] = "agent_owner";
	AccessRoleIds["PROMPTGROUP_VIEWER"] = "promptGroup_viewer";
	AccessRoleIds["PROMPTGROUP_EDITOR"] = "promptGroup_editor";
	AccessRoleIds["PROMPTGROUP_OWNER"] = "promptGroup_owner";
	AccessRoleIds["MCPSERVER_VIEWER"] = "mcpServer_viewer";
	AccessRoleIds["MCPSERVER_EDITOR"] = "mcpServer_editor";
	AccessRoleIds["MCPSERVER_OWNER"] = "mcpServer_owner";
	AccessRoleIds["REMOTE_AGENT_VIEWER"] = "remoteAgent_viewer";
	AccessRoleIds["REMOTE_AGENT_EDITOR"] = "remoteAgent_editor";
	AccessRoleIds["REMOTE_AGENT_OWNER"] = "remoteAgent_owner";
	AccessRoleIds["SKILL_VIEWER"] = "skill_viewer";
	AccessRoleIds["SKILL_EDITOR"] = "skill_editor";
	AccessRoleIds["SKILL_OWNER"] = "skill_owner";
	AccessRoleIds["SHARED_LINK_VIEWER"] = "sharedLink_viewer";
	AccessRoleIds["SHARED_LINK_OWNER"] = "sharedLink_owner";
	return AccessRoleIds;
}({});
/**
* Principal schema - represents a user, group, role, or public access
*/
const principalSchema = z.object({
	type: z.nativeEnum(PrincipalType),
	id: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	source: z.enum(["local", "entra"]).optional(),
	avatar: z.string().optional(),
	description: z.string().optional(),
	idOnTheSource: z.string().optional(),
	accessRoleId: z.nativeEnum(AccessRoleIds).optional(),
	memberCount: z.number().optional()
});
/**
* Access role schema - defines named permission sets
*/
const accessRoleSchema = z.object({
	accessRoleId: z.nativeEnum(AccessRoleIds),
	name: z.string(),
	description: z.string().optional(),
	resourceType: z.nativeEnum(ResourceType).default("agent"),
	permBits: z.number()
});
/**
* Permission entry schema - represents a single ACL entry
*/
const permissionEntrySchema = z.object({
	id: z.string(),
	principalType: z.nativeEnum(PrincipalType),
	principalId: z.string().optional(),
	principalName: z.string().optional(),
	role: accessRoleSchema,
	grantedBy: z.string(),
	grantedAt: z.string(),
	inheritedFrom: z.string().optional(),
	source: z.enum(["local", "entra"]).optional()
});
/**
* Resource permissions response schema
*/
const resourcePermissionsResponseSchema = z.object({
	resourceType: z.nativeEnum(ResourceType),
	resourceId: z.string(),
	permissions: z.array(permissionEntrySchema)
});
/**
* Update resource permissions request schema
* This matches the user's requirement for the frontend DTO structure
*/
const updateResourcePermissionsRequestSchema = z.object({
	updated: principalSchema.array(),
	removed: principalSchema.array(),
	public: z.boolean().optional(),
	publicAccessRoleId: z.string().optional()
});
/**
* Update resource permissions response schema
* Returns the updated permissions with accessRoleId included
*/
const updateResourcePermissionsResponseSchema = z.object({
	message: z.string(),
	results: z.object({
		principals: principalSchema.array(),
		public: z.boolean().optional(),
		publicAccessRoleId: z.string().optional()
	})
});
/**
* Get resource permissions response schema
* This matches the enhanced aggregation-based endpoint response format
*/
const getResourcePermissionsResponseSchema = z.object({
	resourceType: z.nativeEnum(ResourceType),
	resourceId: z.nativeEnum(AccessRoleIds),
	principals: z.array(principalSchema),
	public: z.boolean(),
	publicAccessRoleId: z.nativeEnum(AccessRoleIds).optional()
});
/**
* Effective permissions response schema
* Returns just the permission bitmask for a user on a resource
*/
const effectivePermissionsResponseSchema = z.object({ permissionBits: z.number() });
/**
* Convert permission bits to access level
*/
function permBitsToAccessLevel(permBits) {
	if ((permBits & 4) > 0) return "owner";
	if ((permBits & 2) > 0) return "editor";
	if ((permBits & 1) > 0) return "viewer";
	return "none";
}
/**
* Convert access role ID to permission bits
*/
function accessRoleToPermBits(accessRoleId) {
	switch (accessRoleId) {
		case "agent_viewer":
		case "promptGroup_viewer":
		case "mcpServer_viewer":
		case "remoteAgent_viewer":
		case "skill_viewer":
		case "sharedLink_viewer": return 1;
		case "agent_editor":
		case "promptGroup_editor":
		case "mcpServer_editor":
		case "remoteAgent_editor":
		case "skill_editor": return 3;
		case "agent_owner":
		case "promptGroup_owner":
		case "mcpServer_owner":
		case "remoteAgent_owner":
		case "skill_owner":
		case "sharedLink_owner": return 15;
		default: return 1;
	}
}
/**
* Check if permission bitmask contains other bitmask
* @param permissions - The permission bitmask to check
* @param requiredPermission - The required permission bit(s)
* @returns {boolean} Whether permissions contains requiredPermission
*/
function hasPermissions(permissions, requiredPermission) {
	return (permissions & requiredPermission) === requiredPermission;
}
//#endregion
//#region src/keys.ts
let QueryKeys = /* @__PURE__ */ function(QueryKeys) {
	QueryKeys["messages"] = "messages";
	QueryKeys["sharedMessages"] = "sharedMessages";
	QueryKeys["sharedStartupConfig"] = "sharedStartupConfig";
	QueryKeys["sharedLinks"] = "sharedLinks";
	QueryKeys["allConversations"] = "allConversations";
	QueryKeys["archivedConversations"] = "archivedConversations";
	QueryKeys["searchConversations"] = "searchConversations";
	QueryKeys["conversation"] = "conversation";
	QueryKeys["searchEnabled"] = "searchEnabled";
	QueryKeys["user"] = "user";
	QueryKeys["name"] = "name";
	QueryKeys["models"] = "models";
	QueryKeys["balance"] = "balance";
	QueryKeys["endpoints"] = "endpoints";
	QueryKeys["tokenConfig"] = "tokenConfig";
	QueryKeys["contextProjection"] = "contextProjection";
	QueryKeys["presets"] = "presets";
	QueryKeys["searchResults"] = "searchResults";
	QueryKeys["tokenCount"] = "tokenCount";
	QueryKeys["availablePlugins"] = "availablePlugins";
	QueryKeys["startupConfig"] = "startupConfig";
	QueryKeys["assistants"] = "assistants";
	QueryKeys["assistant"] = "assistant";
	QueryKeys["agents"] = "agents";
	QueryKeys["agent"] = "agent";
	QueryKeys["files"] = "files";
	QueryKeys["fileConfig"] = "fileConfig";
	QueryKeys["tools"] = "tools";
	QueryKeys["toolAuth"] = "toolAuth";
	QueryKeys["toolCalls"] = "toolCalls";
	QueryKeys["mcpTools"] = "mcpTools";
	QueryKeys["mcpConnectionStatus"] = "mcpConnectionStatus";
	QueryKeys["mcpAuthValues"] = "mcpAuthValues";
	QueryKeys["agentTools"] = "agentTools";
	QueryKeys["actions"] = "actions";
	QueryKeys["assistantDocs"] = "assistantDocs";
	QueryKeys["agentDocs"] = "agentDocs";
	QueryKeys["fileDownload"] = "fileDownload";
	QueryKeys["filePreview"] = "filePreview";
	QueryKeys["voices"] = "voices";
	QueryKeys["customConfigSpeech"] = "customConfigSpeech";
	QueryKeys["prompts"] = "prompts";
	QueryKeys["prompt"] = "prompt";
	QueryKeys["promptGroups"] = "promptGroups";
	QueryKeys["allPromptGroups"] = "allPromptGroups";
	QueryKeys["promptGroup"] = "promptGroup";
	QueryKeys["projects"] = "projects";
	QueryKeys["project"] = "project";
	QueryKeys["projectConversations"] = "projectConversations";
	QueryKeys["categories"] = "categories";
	QueryKeys["randomPrompts"] = "randomPrompts";
	QueryKeys["agentCategories"] = "agentCategories";
	QueryKeys["marketplaceAgents"] = "marketplaceAgents";
	QueryKeys["roles"] = "roles";
	QueryKeys["rolesList"] = "rolesList";
	QueryKeys["conversationTags"] = "conversationTags";
	QueryKeys["health"] = "health";
	QueryKeys["userTerms"] = "userTerms";
	QueryKeys["banner"] = "banner";
	QueryKeys["memories"] = "memories";
	QueryKeys["principalSearch"] = "principalSearch";
	QueryKeys["accessRoles"] = "accessRoles";
	QueryKeys["resourcePermissions"] = "resourcePermissions";
	QueryKeys["effectivePermissions"] = "effectivePermissions";
	QueryKeys["graphToken"] = "graphToken";
	QueryKeys["mcpServers"] = "mcpServers";
	QueryKeys["mcpServer"] = "mcpServer";
	QueryKeys["activeJobs"] = "activeJobs";
	QueryKeys["agentApiKeys"] = "agentApiKeys";
	QueryKeys["skills"] = "skills";
	QueryKeys["skill"] = "skill";
	QueryKeys["skillFiles"] = "skillFiles";
	QueryKeys["skillFileContent"] = "skillFileContent";
	QueryKeys["skillTree"] = "skillTree";
	QueryKeys["skillNodeContent"] = "skillNodeContent";
	QueryKeys["skillFavorites"] = "skillFavorites";
	QueryKeys["skillStates"] = "skillStates";
	QueryKeys["favorites"] = "favorites";
	return QueryKeys;
}({});
const DynamicQueryKeys = { agentFiles: (agentId) => ["agentFiles", agentId] };
let MutationKeys = /* @__PURE__ */ function(MutationKeys) {
	MutationKeys["createAgentApiKey"] = "createAgentApiKey";
	MutationKeys["deleteAgentApiKey"] = "deleteAgentApiKey";
	MutationKeys["fileUpload"] = "fileUpload";
	MutationKeys["fileDelete"] = "fileDelete";
	MutationKeys["updatePreset"] = "updatePreset";
	MutationKeys["deletePreset"] = "deletePreset";
	MutationKeys["loginUser"] = "loginUser";
	MutationKeys["logoutUser"] = "logoutUser";
	MutationKeys["refreshToken"] = "refreshToken";
	MutationKeys["avatarUpload"] = "avatarUpload";
	MutationKeys["speechToText"] = "speechToText";
	MutationKeys["textToSpeech"] = "textToSpeech";
	MutationKeys["assistantAvatarUpload"] = "assistantAvatarUpload";
	MutationKeys["agentAvatarUpload"] = "agentAvatarUpload";
	MutationKeys["updateAction"] = "updateAction";
	MutationKeys["updateAgentAction"] = "updateAgentAction";
	MutationKeys["deleteAction"] = "deleteAction";
	MutationKeys["deleteAgentAction"] = "deleteAgentAction";
	MutationKeys["revertAgentVersion"] = "revertAgentVersion";
	MutationKeys["deleteUser"] = "deleteUser";
	MutationKeys["updateRole"] = "updateRole";
	MutationKeys["enableTwoFactor"] = "enableTwoFactor";
	MutationKeys["verifyTwoFactor"] = "verifyTwoFactor";
	MutationKeys["updateMemoryPreferences"] = "updateMemoryPreferences";
	MutationKeys["createProject"] = "createProject";
	MutationKeys["updateProject"] = "updateProject";
	MutationKeys["deleteProject"] = "deleteProject";
	MutationKeys["assignConversationToProject"] = "assignConversationToProject";
	MutationKeys["createSkillNode"] = "createSkillNode";
	MutationKeys["updateSkillNode"] = "updateSkillNode";
	MutationKeys["deleteSkillNode"] = "deleteSkillNode";
	MutationKeys["updateSkillNodeContent"] = "updateSkillNodeContent";
	MutationKeys["convoPin"] = "convoPin";
	return MutationKeys;
}({});
//#endregion
//#region src/headers-helpers.ts
function setAcceptLanguageHeader(value) {
	axios.defaults.headers.common["Accept-Language"] = value;
}
function setTokenHeader(token) {
	if (token === void 0) delete axios.defaults.headers.common["Authorization"];
	else axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}
function getTokenHeader() {
	const authorization = axios.defaults.headers.common["Authorization"];
	return typeof authorization === "string" ? authorization : void 0;
}
//#endregion
//#region src/request.ts
async function _get(url, options) {
	return (await axios.get(url, { ...options })).data;
}
async function _getResponse(url, options) {
	return await axios.get(url, { ...options });
}
async function _post(url, data) {
	return (await axios.post(url, JSON.stringify(data), { headers: { "Content-Type": "application/json" } })).data;
}
async function _postMultiPart(url, formData, options) {
	return (await axios.post(url, formData, {
		...options,
		headers: { "Content-Type": "multipart/form-data" }
	})).data;
}
async function _postTTS(url, formData, options) {
	return (await axios.post(url, formData, {
		...options,
		headers: { "Content-Type": "multipart/form-data" },
		responseType: "arraybuffer"
	})).data;
}
async function _put(url, data) {
	return (await axios.put(url, JSON.stringify(data), { headers: { "Content-Type": "application/json" } })).data;
}
async function _delete(url) {
	return (await axios.delete(url)).data;
}
async function _deleteWithOptions(url, options) {
	return (await axios.delete(url, { ...options })).data;
}
async function _patch(url, data) {
	return (await axios.patch(url, JSON.stringify(data), { headers: { "Content-Type": "application/json" } })).data;
}
const AUTH_RECOVERY_EVENT = "authRecovery";
const AUTH_REDIRECT_EVENT = "authRedirectStarted";
const AUTH_REDIRECT_STORAGE_KEY = "librechat.auth.redirect.startedAt";
const AUTH_REDIRECT_DEDUPE_MS = 15e3;
const TOKEN_REFRESH_BUFFER_MS = 120 * 1e3;
const refreshToken = (retry) => _post(refreshToken$1(retry));
const SHARE_PAGE_PATH_REGEX = /^\/share\/[^/]+\/?$/;
const SHARED_MESSAGES_PATH_REGEX = /^\/api\/share\/[^/]+$/;
const normalizePathname = (pathname) => pathname.startsWith("/") ? pathname : `/${pathname}`;
const stripBasePath = (pathname) => {
	const normalizedPathname = normalizePathname(pathname);
	const baseUrl = apiBaseUrl();
	if (!baseUrl) return normalizedPathname;
	const normalizedBaseUrl = normalizePathname(baseUrl);
	if (normalizedPathname === normalizedBaseUrl || normalizedPathname.startsWith(`${normalizedBaseUrl}/`)) return normalizedPathname.slice(normalizedBaseUrl.length) || "/";
	return normalizedPathname;
};
const isSharePage = () => SHARE_PAGE_PATH_REGEX.test(stripBasePath(window.location.pathname));
const getRequestPathname = (url) => {
	if (typeof url !== "string") return "";
	try {
		return new URL(url, window.location.origin).pathname;
	} catch {
		return url.split(/[?#]/)[0] ?? "";
	}
};
const isSharedMessagesRequest = (url, method) => method?.toLowerCase() === "get" && SHARED_MESSAGES_PATH_REGEX.test(stripBasePath(getRequestPathname(url)));
const dispatchTokenUpdatedEvent = (token) => {
	setTokenHeader(token);
	clearAuthRedirectStartedAt();
	window.dispatchEvent(new CustomEvent("tokenUpdated", { detail: token }));
};
const getAuthRecoveryState = () => {
	const browserWindow = window;
	browserWindow.__librechatAuthRecovery ??= {
		lastRedirectStartedAt: 0,
		refreshPromise: null
	};
	return browserWindow.__librechatAuthRecovery;
};
const getAuthRedirectStartedAt = () => {
	const state = getAuthRecoveryState();
	try {
		const startedAt = window.localStorage.getItem(AUTH_REDIRECT_STORAGE_KEY);
		const storedStartedAt = startedAt != null ? Number(startedAt) : 0;
		return Math.max(Number.isFinite(storedStartedAt) ? storedStartedAt : 0, state.lastRedirectStartedAt);
	} catch {
		return state.lastRedirectStartedAt;
	}
};
const setAuthRedirectStartedAt = () => {
	const state = getAuthRecoveryState();
	state.lastRedirectStartedAt = Date.now();
	try {
		window.localStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, String(state.lastRedirectStartedAt));
	} catch {}
};
const clearAuthRedirectStartedAt = () => {
	const state = getAuthRecoveryState();
	state.lastRedirectStartedAt = 0;
	try {
		window.localStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
	} catch {}
};
const isAuthRedirectInProgress = () => {
	const startedAt = getAuthRedirectStartedAt();
	return Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < AUTH_REDIRECT_DEDUPE_MS;
};
const dispatchAuthRecoveryEvent = (state) => {
	window.dispatchEvent(new CustomEvent(AUTH_RECOVERY_EVENT, { detail: { state } }));
};
const setRequestAuthorizationHeader = (config, token) => {
	const headers = config.headers ?? {};
	headers["Authorization"] = `Bearer ${token}`;
	config.headers = headers;
};
const isAuthRecoveryEndpoint = (url) => url?.includes("/api/auth/2fa") === true || url?.includes("/api/auth/logout") === true || url?.includes("/api/auth/refresh") === true;
const startAuthRecovery = (retryRefresh) => {
	const state = getAuthRecoveryState();
	if (state.refreshPromise) return state.refreshPromise;
	dispatchAuthRecoveryEvent("started");
	state.refreshPromise = refreshToken(retryRefresh).then((response) => {
		const token = response?.token ?? "";
		if (!token) return null;
		dispatchTokenUpdatedEvent(token);
		return token;
	}).finally(() => {
		state.refreshPromise = null;
		dispatchAuthRecoveryEvent("finished");
	});
	return state.refreshPromise;
};
const redirectToLoginOnce = () => {
	if (isAuthRedirectInProgress()) return;
	const href = apiBaseUrl() + buildLoginRedirectUrl();
	setAuthRedirectStartedAt();
	window.dispatchEvent(new CustomEvent(AUTH_REDIRECT_EVENT, { detail: { href } }));
	window.location.href = href;
};
const getBearerToken = () => {
	const authorization = axios.defaults.headers.common["Authorization"];
	if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) return null;
	return authorization.slice(7);
};
const getJwtExpiryMs = (token) => {
	const payload = token.split(".")[1];
	if (!payload) return null;
	try {
		const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
		const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + (4 - normalizedPayload.length % 4) % 4, "=");
		const decodedPayload = JSON.parse(window.atob(paddedPayload));
		return typeof decodedPayload.exp === "number" ? decodedPayload.exp * 1e3 : null;
	} catch {
		return null;
	}
};
const shouldRefreshBeforeRequest = (url) => {
	if (isAuthRecoveryEndpoint(url) || isAuthRedirectInProgress()) return false;
	const token = getBearerToken();
	if (!token) return false;
	const expiresAt = getJwtExpiryMs(token);
	if (expiresAt == null) return false;
	const timeUntilExpiry = expiresAt - Date.now();
	return timeUntilExpiry > 0 && timeUntilExpiry <= TOKEN_REFRESH_BUFFER_MS;
};
if (typeof window !== "undefined") {
	axios.interceptors.request.use(async (config) => {
		const state = getAuthRecoveryState();
		if (state.refreshPromise && !isAuthRecoveryEndpoint(config.url)) {
			const token = await state.refreshPromise.catch(() => null);
			if (token) setRequestAuthorizationHeader(config, token);
			return config;
		}
		if (!shouldRefreshBeforeRequest(config.url)) return config;
		const token = await startAuthRecovery(false).catch(() => null);
		if (token) setRequestAuthorizationHeader(config, token);
		return config;
	});
	axios.interceptors.response.use((response) => response, async (error) => {
		const originalRequest = error.config;
		if (!error.response) return Promise.reject(error);
		if (!originalRequest) return Promise.reject(error);
		const isRefreshRequest = originalRequest.url?.includes("/api/auth/refresh") === true;
		if (isAuthRecoveryEndpoint(originalRequest.url) && !isRefreshRequest) return Promise.reject(error);
		if (isRefreshRequest && getAuthRecoveryState().refreshPromise) return Promise.reject(error);
		/** Skip refresh when the Authorization header has been cleared (e.g. during logout),
		*  but allow the shared link data request to proceed so private shares can still
		*  recover auth/redirect without unrelated share-page queries forcing login. */
		if (!axios.defaults.headers.common["Authorization"] && !(isSharePage() && isSharedMessagesRequest(originalRequest.url, originalRequest.method))) return Promise.reject(error);
		if (isAuthRedirectInProgress()) return Promise.reject(error);
		if (error.response.status === 401 && !originalRequest._retry) {
			if (!(getAuthRecoveryState().refreshPromise != null)) console.warn("401 error, refreshing token");
			originalRequest._retry = true;
			try {
				const token = await startAuthRecovery(isRefreshRequest);
				if (token) {
					setRequestAuthorizationHeader(originalRequest, token);
					return await axios(originalRequest);
				}
				redirectToLoginOnce();
				return Promise.reject(error);
			} catch (err) {
				return Promise.reject(err);
			}
		}
		return Promise.reject(error);
	});
}
var request_default = {
	get: _get,
	getResponse: _getResponse,
	post: _post,
	postMultiPart: _postMultiPart,
	postTTS: _postTTS,
	put: _put,
	delete: _delete,
	deleteWithOptions: _deleteWithOptions,
	patch: _patch,
	refreshToken,
	dispatchTokenUpdatedEvent
};
//#endregion
//#region src/data-service.ts
var data_service_exports = /* @__PURE__ */ __exportAll({
	acceptTerms: () => acceptTerms,
	addPromptToGroup: () => addPromptToGroup,
	addTagToConversation: () => addTagToConversation,
	archiveConversation: () => archiveConversation,
	assignConversationToProject: () => assignConversationToProject,
	bindActionOAuth: () => bindActionOAuth,
	bindMCPOAuth: () => bindMCPOAuth,
	branchMessage: () => branchMessage,
	callTool: () => callTool,
	cancelMCPOAuth: () => cancelMCPOAuth,
	clearAllConversations: () => clearAllConversations,
	confirmTwoFactor: () => confirmTwoFactor,
	createAgent: () => createAgent,
	createAgentApiKey: () => createAgentApiKey,
	createAssistant: () => createAssistant,
	createConversationTag: () => createConversationTag,
	createMCPServer: () => createMCPServer,
	createMemory: () => createMemory,
	createPreset: () => createPreset,
	createProject: () => createProject,
	createPrompt: () => createPrompt,
	createSharedLink: () => createSharedLink,
	createSkill: () => createSkill,
	createSkillNode: () => createSkillNode,
	deleteAction: () => deleteAction,
	deleteAgent: () => deleteAgent,
	deleteAgentAction: () => deleteAgentAction,
	deleteAgentApiKey: () => deleteAgentApiKey,
	deleteAssistant: () => deleteAssistant,
	deleteConversation: () => deleteConversation,
	deleteConversationTag: () => deleteConversationTag,
	deleteFiles: () => deleteFiles,
	deleteGitHubSkillSyncCredential: () => deleteGitHubSkillSyncCredential,
	deleteMCPServer: () => deleteMCPServer,
	deleteMemory: () => deleteMemory,
	deletePreset: () => deletePreset,
	deleteProject: () => deleteProject,
	deletePrompt: () => deletePrompt,
	deletePromptGroup: () => deletePromptGroup,
	deleteSharedLink: () => deleteSharedLink,
	deleteSkill: () => deleteSkill,
	deleteSkillFile: () => deleteSkillFile,
	deleteSkillNode: () => deleteSkillNode,
	deleteUser: () => deleteUser,
	disableTwoFactor: () => disableTwoFactor,
	duplicateAgent: () => duplicateAgent,
	duplicateConversation: () => duplicateConversation,
	editArtifact: () => editArtifact,
	enableTwoFactor: () => enableTwoFactor,
	forkConversation: () => forkConversation,
	genTitle: () => genTitle,
	getAIEndpoints: () => getAIEndpoints,
	getAccessRoles: () => getAccessRoles,
	getActions: () => getActions,
	getActiveJobs: () => getActiveJobs,
	getAgentApiKeys: () => getAgentApiKeys,
	getAgentById: () => getAgentById,
	getAgentCategories: () => getAgentCategories,
	getAgentFiles: () => getAgentFiles,
	getAllEffectivePermissions: () => getAllEffectivePermissions,
	getAllPromptGroups: () => getAllPromptGroups,
	getAssistantById: () => getAssistantById,
	getAssistantDocs: () => getAssistantDocs,
	getAvailableAgentTools: () => getAvailableAgentTools,
	getAvailablePlugins: () => getAvailablePlugins,
	getAvailableTools: () => getAvailableTools,
	getBanner: () => getBanner,
	getCategories: () => getCategories,
	getCodeOutputDownload: () => getCodeOutputDownload,
	getContextProjection: () => getContextProjection,
	getConversationById: () => getConversationById,
	getConversationTags: () => getConversationTags,
	getConversations: () => getConversations,
	getCustomConfigSpeech: () => getCustomConfigSpeech,
	getDomainServerBaseUrl: () => getDomainServerBaseUrl,
	getEffectivePermissions: () => getEffectivePermissions,
	getExpandedAgentById: () => getExpandedAgentById,
	getFavorites: () => getFavorites,
	getFileConfig: () => getFileConfig,
	getFileDownload: () => getFileDownload,
	getFileDownloadURL: () => getFileDownloadURL,
	getFilePreview: () => getFilePreview,
	getFiles: () => getFiles,
	getGitHubSkillSyncStatus: () => getGitHubSkillSyncStatus,
	getGraphApiToken: () => getGraphApiToken,
	getLoginGoogle: () => getLoginGoogle,
	getMCPAuthValues: () => getMCPAuthValues,
	getMCPConnectionStatus: () => getMCPConnectionStatus,
	getMCPServer: () => getMCPServer,
	getMCPServerConnectionStatus: () => getMCPServerConnectionStatus,
	getMCPServers: () => getMCPServers,
	getMCPTools: () => getMCPTools,
	getMarketplaceAgents: () => getMarketplaceAgents,
	getMemories: () => getMemories,
	getMessagesByConvoId: () => getMessagesByConvoId,
	getModels: () => getModels,
	getPresets: () => getPresets,
	getProjectById: () => getProjectById,
	getPrompt: () => getPrompt,
	getPromptGroup: () => getPromptGroup,
	getPromptGroups: () => getPromptGroups,
	getPrompts: () => getPrompts,
	getRandomPrompts: () => getRandomPrompts,
	getResourcePermissions: () => getResourcePermissions,
	getRole: () => getRole,
	getSearchEnabled: () => getSearchEnabled,
	getSharedFileDownload: () => getSharedFileDownload,
	getSharedFilePreview: () => getSharedFilePreview,
	getSharedLink: () => getSharedLink,
	getSharedMessages: () => getSharedMessages,
	getSharedStartupConfig: () => getSharedStartupConfig,
	getSkill: () => getSkill,
	getSkillFavorites: () => getSkillFavorites,
	getSkillFileContent: () => getSkillFileContent,
	getSkillNodeContent: () => getSkillNodeContent,
	getSkillStates: () => getSkillStates,
	getSkillTree: () => getSkillTree,
	getStartupConfig: () => getStartupConfig,
	getTokenConfig: () => getTokenConfig,
	getToolCalls: () => getToolCalls,
	getUser: () => getUser,
	getUserBalance: () => getUserBalance,
	getUserTerms: () => getUserTerms,
	getVerifyAgentToolAuth: () => getVerifyAgentToolAuth,
	getVoices: () => getVoices,
	healthCheck: () => healthCheck,
	importConversationsFile: () => importConversationsFile,
	importSkill: () => importSkill,
	listAgents: () => listAgents,
	listAssistants: () => listAssistants,
	listConversations: () => listConversations,
	listMessages: () => listMessages,
	listProjects: () => listProjects,
	listRoles: () => listRoles,
	listSharedLinks: () => listSharedLinks,
	listSkillFiles: () => listSkillFiles,
	listSkills: () => listSkills,
	login: () => login,
	logout: () => logout,
	makePromptProduction: () => makePromptProduction,
	pinConversation: () => pinConversation,
	rebuildConversationTags: () => rebuildConversationTags,
	recordPromptGroupUsage: () => recordPromptGroupUsage,
	regenerateBackupCodes: () => regenerateBackupCodes,
	register: () => register,
	reinitializeMCPServer: () => reinitializeMCPServer,
	requestPasswordReset: () => requestPasswordReset,
	resendVerificationEmail: () => resendVerificationEmail,
	resetPassword: () => resetPassword,
	revertAgentVersion: () => revertAgentVersion,
	revokeAllUserKeys: () => revokeAllUserKeys,
	revokeUserKey: () => revokeUserKey,
	runGitHubSkillSync: () => runGitHubSkillSync,
	searchPrincipals: () => searchPrincipals,
	setGitHubSkillSyncCredential: () => setGitHubSkillSyncCredential,
	speechToText: () => speechToText,
	textToSpeech: () => textToSpeech,
	updateAction: () => updateAction,
	updateAgent: () => updateAgent,
	updateAgentAction: () => updateAgentAction,
	updateAgentPermissions: () => updateAgentPermissions,
	updateAssistant: () => updateAssistant,
	updateConversation: () => updateConversation,
	updateConversationTag: () => updateConversationTag,
	updateFavorites: () => updateFavorites,
	updateFeedback: () => updateFeedback,
	updateMCPServer: () => updateMCPServer,
	updateMCPServersPermissions: () => updateMCPServersPermissions,
	updateMarketplacePermissions: () => updateMarketplacePermissions,
	updateMemory: () => updateMemory,
	updateMemoryPermissions: () => updateMemoryPermissions,
	updateMemoryPreferences: () => updateMemoryPreferences,
	updateMessage: () => updateMessage,
	updateMessageContent: () => updateMessageContent,
	updatePeoplePickerPermissions: () => updatePeoplePickerPermissions,
	updatePreset: () => updatePreset,
	updateProject: () => updateProject,
	updatePromptGroup: () => updatePromptGroup,
	updatePromptLabels: () => updatePromptLabels,
	updatePromptPermissions: () => updatePromptPermissions,
	updateRemoteAgentsPermissions: () => updateRemoteAgentsPermissions,
	updateResourcePermissions: () => updateResourcePermissions,
	updateSharedLink: () => updateSharedLink,
	updateSkill: () => updateSkill,
	updateSkillFavorites: () => updateSkillFavorites,
	updateSkillNode: () => updateSkillNode,
	updateSkillNodeContent: () => updateSkillNodeContent,
	updateSkillPermissions: () => updateSkillPermissions,
	updateSkillStates: () => updateSkillStates,
	updateTokenCount: () => updateTokenCount,
	updateUserKey: () => updateUserKey,
	updateUserPlugins: () => updateUserPlugins,
	uploadAgentAvatar: () => uploadAgentAvatar,
	uploadAssistantAvatar: () => uploadAssistantAvatar,
	uploadAvatar: () => uploadAvatar,
	uploadFile: () => uploadFile,
	uploadImage: () => uploadImage,
	uploadSkillFile: () => uploadSkillFile,
	userKeyQuery: () => userKeyQuery,
	verifyEmail: () => verifyEmail,
	verifyTwoFactor: () => verifyTwoFactor,
	verifyTwoFactorTemp: () => verifyTwoFactorTemp
});
function revokeUserKey(name) {
	return request_default.delete(revokeUserKey$1(name));
}
function revokeAllUserKeys() {
	return request_default.delete(revokeAllUserKeys$1());
}
function deleteUser(payload) {
	return request_default.deleteWithOptions(deleteUser$1(), { data: payload });
}
function getFavorites() {
	return request_default.get(`${apiBaseUrl()}/api/user/settings/favorites`);
}
function updateFavorites(favorites) {
	return request_default.post(`${apiBaseUrl()}/api/user/settings/favorites`, { favorites });
}
/**
* Skill favorites (star-a-skill). The backend route is phase 2 — see the
* original UI PR for the client surface. Until then, these resolve with
* an empty list so the UI hooks compile and the Star button is a no-op.
*/
function getSkillFavorites() {
	return Promise.resolve([]);
}
function updateSkillFavorites(skillFavorites) {
	return Promise.resolve(skillFavorites);
}
/** Per-user skill active/inactive overrides. */
function getSkillStates() {
	return request_default.get(skillStates());
}
function updateSkillStates(skillStates$1) {
	return request_default.post(skillStates(), { skillStates: skillStates$1 });
}
function getSharedMessages(shareId) {
	return request_default.get(shareMessages(shareId));
}
function getSharedStartupConfig(shareId) {
	return request_default.get(sharedStartupConfig(shareId));
}
const listSharedLinks = async (params) => {
	const { pageSize, sortBy, sortDirection, search, cursor } = params;
	return request_default.get(getSharedLinks(pageSize, sortBy, sortDirection, search, cursor));
};
function getSharedLink(conversationId) {
	return request_default.get(getSharedLink$1(conversationId));
}
function createSharedLink(conversationId, targetMessageId, snapshotFiles) {
	return request_default.post(createSharedLink$1(conversationId), {
		targetMessageId,
		snapshotFiles
	});
}
function updateSharedLink(shareId, targetMessageId, snapshotFiles) {
	return request_default.patch(updateSharedLink$1(shareId), {
		targetMessageId,
		snapshotFiles
	});
}
function deleteSharedLink(shareId) {
	return request_default.delete(shareMessages(shareId));
}
function updateUserKey(payload) {
	const { value } = payload;
	if (!value) throw new Error("value is required");
	return request_default.put(keys(), payload);
}
function getAgentApiKeys() {
	return request_default.get(apiKeys());
}
function createAgentApiKey(payload) {
	return request_default.post(apiKeys(), payload);
}
function deleteAgentApiKey(id) {
	return request_default.delete(apiKeyById(id));
}
function getPresets() {
	return request_default.get(presets());
}
function createPreset(payload) {
	return request_default.post(presets(), payload);
}
function updatePreset(payload) {
	return request_default.post(presets(), payload);
}
function deletePreset(arg) {
	return request_default.post(deletePreset$1(), arg);
}
function getSearchEnabled() {
	return request_default.get(searchEnabled());
}
function getUser() {
	return request_default.get(user());
}
function getUserBalance() {
	return request_default.get(balance());
}
const updateTokenCount = (text) => {
	return request_default.post(tokenizer(), { arg: text });
};
const login = (payload) => {
	return request_default.post(login$1(), payload);
};
const logout = () => {
	return request_default.post(logout$1());
};
const register = (payload) => {
	return request_default.post(register$1(), payload);
};
const userKeyQuery = (name) => request_default.get(userKeyQuery$1(name));
const getLoginGoogle = () => {
	return request_default.get(loginGoogle());
};
const requestPasswordReset = (payload) => {
	return request_default.post(requestPasswordReset$1(), payload);
};
const resetPassword = (payload) => {
	return request_default.post(resetPassword$1(), payload);
};
const verifyEmail = (payload) => {
	return request_default.post(verifyEmail$1(), payload);
};
const resendVerificationEmail = (payload) => {
	return request_default.post(resendVerificationEmail$1(), payload);
};
const getAvailablePlugins = () => {
	return request_default.get(plugins());
};
const updateUserPlugins = (payload) => {
	return request_default.post(userPlugins(), payload);
};
const reinitializeMCPServer = (serverName) => {
	return request_default.post(mcpReinitialize(serverName));
};
const bindMCPOAuth = (serverName) => {
	return request_default.post(mcpOAuthBind(serverName));
};
const bindActionOAuth = (actionId) => {
	return request_default.post(actionOAuthBind(actionId));
};
const getMCPConnectionStatus = () => {
	return request_default.get(mcpConnectionStatus());
};
const getMCPServerConnectionStatus = (serverName) => {
	return request_default.get(mcpServerConnectionStatus(serverName));
};
const getMCPAuthValues = (serverName) => {
	return request_default.get(mcpAuthValues(serverName));
};
function cancelMCPOAuth(serverName) {
	return request_default.post(cancelMCPOAuth$1(serverName), {});
}
const getStartupConfig = (options) => {
	return request_default.get(config(options?.context));
};
const getAIEndpoints = () => {
	return request_default.get(aiEndpoints());
};
const getTokenConfig = () => {
	return request_default.get(tokenConfig());
};
const getContextProjection = (payload) => {
	return request_default.post(contextProjection(), payload);
};
const getModels = async () => {
	return request_default.get(models());
};
const createAssistant = ({ version, ...data }) => {
	return request_default.post(assistants({ version }), data);
};
const getAssistantById = ({ endpoint, assistant_id, version }) => {
	return request_default.get(assistants({
		path: assistant_id,
		endpoint,
		version
	}));
};
const updateAssistant = ({ assistant_id, data, version }) => {
	return request_default.patch(assistants({
		path: assistant_id,
		version
	}), data);
};
const deleteAssistant = ({ assistant_id, model, endpoint, version }) => {
	return request_default.delete(assistants({
		path: assistant_id,
		options: {
			model,
			endpoint
		},
		version
	}));
};
const listAssistants = (params, version) => {
	return request_default.get(assistants({
		version,
		options: params
	}));
};
function getAssistantDocs({ endpoint, version }) {
	if (!isAssistantsEndpoint(endpoint)) return Promise.resolve([]);
	return request_default.get(assistants({
		path: "documents",
		version,
		options: { endpoint },
		endpoint
	}));
}
const getAvailableTools = (_endpoint, version) => {
	let path = "";
	if (isAssistantsEndpoint(_endpoint)) {
		const endpoint = _endpoint;
		path = assistants({
			path: "tools",
			endpoint,
			version: version ?? defaultAssistantsVersion[endpoint]
		});
	} else path = agents({ path: "tools" });
	return request_default.get(path);
};
const getMCPTools = () => {
	return request_default.get(mcp.tools);
};
const getVerifyAgentToolAuth = (params) => {
	return request_default.get(agents({ path: `tools/${params.toolId}/auth` }));
};
const callTool = ({ toolId, toolParams }) => {
	return request_default.post(agents({ path: `tools/${toolId}/call` }), toolParams);
};
const getToolCalls = (params) => {
	return request_default.get(agents({
		path: "tools/calls",
		options: params
	}));
};
const getFiles = () => {
	return request_default.get(files());
};
/**
* Poll the lifecycle of an inline file preview. Returns the smallest
* shape needed to drive the UI:
*   - `status` always present (defaults to `'ready'` server-side for
*     legacy records that pre-date the field).
*   - `text` and `textFormat` only when `status === 'ready'` and text
*     was extracted (preserves the HTML-or-null security contract).
*   - `previewError` only when `status === 'failed'`.
*
* Called from `useFilePreview`; React Query's `refetchInterval`
* polls while `status === 'pending'` and stops on terminal status.
*/
const getFilePreview = (fileId) => {
	return request_default.get(filePreview(fileId));
};
/** Preview status for a snapshotted file served through a shared link. */
const getSharedFilePreview = (shareId, fileId) => {
	return request_default.get(sharedFilePreview(shareId, fileId));
};
const getAgentFiles = (agentId) => {
	return request_default.get(agentFiles(agentId));
};
const getFileConfig = () => {
	return request_default.get(`${files()}/config`);
};
const uploadImage = (data, signal) => {
	const requestConfig = signal ? { signal } : void 0;
	return request_default.postMultiPart(images(), data, requestConfig);
};
const uploadFile = (data, signal) => {
	const requestConfig = signal ? { signal } : void 0;
	return request_default.postMultiPart(files(), data, requestConfig);
};
const updateAction = (data) => {
	const { assistant_id, version, ...body } = data;
	return request_default.post(assistants({
		path: `actions/${assistant_id}`,
		version
	}), body);
};
function getActions() {
	return request_default.get(agents({ path: "actions" }));
}
const deleteAction = async ({ assistant_id, action_id, model, version, endpoint }) => request_default.delete(assistants({
	path: `actions/${assistant_id}/${action_id}/${model}`,
	version,
	endpoint
}));
/**
* Agents
*/
const createAgent = ({ ...data }) => {
	return request_default.post(agents({}), data);
};
const getAgentById = ({ agent_id }) => {
	return request_default.get(agents({ path: agent_id }));
};
const getExpandedAgentById = ({ agent_id }) => {
	return request_default.get(agents({ path: `${agent_id}/expanded` }));
};
const updateAgent = ({ agent_id, data }) => {
	return request_default.patch(agents({ path: agent_id }), data);
};
const duplicateAgent = ({ agent_id }) => {
	return request_default.post(agents({ path: `${agent_id}/duplicate` }));
};
const deleteAgent = ({ agent_id }) => {
	return request_default.delete(agents({ path: agent_id }));
};
const listAgents = (params) => {
	return request_default.get(agents({ options: params }));
};
const revertAgentVersion = ({ agent_id, version_index }) => request_default.post(revertAgentVersion$1(agent_id), { version_index });
/**
* Get agent categories with counts for marketplace tabs
*/
const getAgentCategories = () => {
	return request_default.get(agents({ path: "categories" }));
};
/**
* Unified marketplace agents endpoint with query string controls
*/
const getMarketplaceAgents = (params) => {
	return request_default.get(agents({ options: params }));
};
const getAvailableAgentTools = () => {
	return request_default.get(agents({ path: "tools" }));
};
const updateAgentAction = (data) => {
	const { agent_id, ...body } = data;
	return request_default.post(agents({ path: `actions/${agent_id}` }), body);
};
const deleteAgentAction = async ({ agent_id, action_id }) => request_default.delete(agents({ path: `actions/${agent_id}/${action_id}` }));
/**
* MCP Servers
*/
/**
*
* Ensure and List loaded mcp server configs from the cache Enriched with effective permissions.
*/
const getMCPServers = async () => {
	return request_default.get(mcp.servers);
};
/**
* Get a single MCP server by ID
*/
const getMCPServer = async (serverName) => {
	return request_default.get(mcpServer(serverName));
};
/**
* Create a new MCP server
*/
const createMCPServer = async (data) => {
	return request_default.post(mcp.servers, data);
};
/**
* Update an existing MCP server
*/
const updateMCPServer = async (serverName, data) => {
	return request_default.patch(mcpServer(serverName), data);
};
/**
* Delete an MCP server
*/
const deleteMCPServer = async (serverName) => {
	return request_default.delete(mcpServer(serverName));
};
/**
* Imports a conversations file.
*
* @param data - The FormData containing the file to import.
* @returns A Promise that resolves to the import start response.
*/
const importConversationsFile = (data) => {
	return request_default.postMultiPart(importConversation(), data);
};
const uploadAvatar = (data) => {
	return request_default.postMultiPart(avatar(), data);
};
const uploadAssistantAvatar = (data) => {
	return request_default.postMultiPart(assistants({
		isAvatar: true,
		path: `${data.assistant_id}/avatar`,
		options: {
			model: data.model,
			endpoint: data.endpoint
		},
		version: data.version
	}), data.formData);
};
const uploadAgentAvatar = (data) => {
	return request_default.postMultiPart(`${images()}/agents/${data.agent_id}/avatar`, data.formData);
};
const getFileDownload = async (userId, file_id) => {
	return request_default.getResponse(`${files()}/download/${userId}/${file_id}`, {
		responseType: "blob",
		headers: { Accept: "application/octet-stream" }
	});
};
const getFileDownloadURL = async (userId, file_id) => {
	return request_default.get(`${files()}/download-url/${userId}/${file_id}`);
};
/** Blob download for a snapshotted file served through a shared link. */
const getSharedFileDownload = async (shareId, file_id) => {
	return request_default.getResponse(sharedFileDownload(shareId, file_id), {
		responseType: "blob",
		headers: { Accept: "application/octet-stream" }
	});
};
const getCodeOutputDownload = async (url) => {
	return request_default.getResponse(url, {
		responseType: "blob",
		headers: { Accept: "application/octet-stream" }
	});
};
const deleteFiles = async (payload) => request_default.deleteWithOptions(files(), { data: payload });
const speechToText = (data) => {
	return request_default.postMultiPart(speechToText$1(), data);
};
const textToSpeech = (data) => {
	return request_default.postTTS(textToSpeechManual(), data);
};
const getVoices = () => {
	return request_default.get(textToSpeechVoices());
};
const getCustomConfigSpeech = () => {
	return request_default.get(getCustomConfigSpeech$1());
};
function duplicateConversation(payload) {
	return request_default.post(duplicateConversation$1(), payload);
}
function forkConversation(payload) {
	return request_default.post(forkConversation$1(), payload);
}
function deleteConversation(payload) {
	return request_default.deleteWithOptions(deleteConversation$1(), { data: { arg: payload } });
}
function clearAllConversations() {
	return request_default.delete(deleteAllConversation());
}
const listConversations = (params) => {
	return request_default.get(conversations(params ?? {}));
};
function getConversations(cursor) {
	return request_default.get(conversations({ cursor }));
}
function getConversationById(id) {
	return request_default.get(conversationById(id));
}
function updateConversation(payload) {
	return request_default.post(updateConversation$1(), { arg: payload });
}
function archiveConversation(payload) {
	return request_default.post(archiveConversation$1(), { arg: payload });
}
function listProjects(params) {
	return request_default.get(projects(params ?? {}));
}
function createProject(payload) {
	return request_default.post(projects(), payload);
}
function getProjectById(projectId) {
	return request_default.get(projectById(projectId));
}
function updateProject(payload) {
	const { projectId, ...data } = payload;
	return request_default.patch(projectById(projectId), data);
}
function deleteProject(projectId) {
	return request_default.delete(projectById(projectId));
}
function assignConversationToProject(payload) {
	const { conversationId, projectId } = payload;
	return request_default.put(projectConversation(conversationId), { projectId });
}
function pinConversation(payload) {
	return request_default.post(pinConversation$1(), { arg: payload });
}
function genTitle(payload) {
	return request_default.get(genTitle$1(payload.conversationId));
}
const listMessages = (params) => {
	return request_default.get(messages(params ?? {}));
};
function updateMessage(payload) {
	const { conversationId, messageId, text } = payload;
	if (!conversationId) throw new Error("conversationId is required");
	return request_default.put(messages({
		conversationId,
		messageId
	}), { text });
}
function updateMessageContent(payload) {
	const { conversationId, messageId, index, text } = payload;
	if (!conversationId) throw new Error("conversationId is required");
	return request_default.put(messages({
		conversationId,
		messageId
	}), {
		text,
		index
	});
}
const editArtifact = async ({ messageId, ...params }) => {
	return request_default.post(messagesArtifacts(messageId), params);
};
const branchMessage = async (payload) => {
	return request_default.post(messagesBranch(), payload);
};
function getMessagesByConvoId(conversationId) {
	if (conversationId === "new" || conversationId === "PENDING") return Promise.resolve([]);
	return request_default.get(messages({ conversationId }));
}
function getPrompt(id) {
	return request_default.get(getPrompt$1(id));
}
function getPrompts(filter) {
	return request_default.get(getPromptsWithFilters(filter));
}
function getAllPromptGroups() {
	return request_default.get(getAllPromptGroups$1());
}
function getPromptGroups(filter) {
	return request_default.get(getPromptGroupsWithFilters(filter));
}
function getPromptGroup(id) {
	return request_default.get(getPromptGroup$1(id));
}
function createPrompt(payload) {
	return request_default.post(postPrompt(), payload);
}
function addPromptToGroup(groupId, payload) {
	return request_default.post(addPromptToGroup$1(groupId), payload);
}
function updatePromptGroup(variables) {
	return request_default.patch(updatePromptGroup$1(variables.id), variables.payload);
}
function recordPromptGroupUsage(groupId) {
	return request_default.post(recordPromptGroupUsage$1(groupId));
}
function deletePrompt(payload) {
	return request_default.delete(deletePrompt$1(payload));
}
function makePromptProduction(id) {
	return request_default.patch(updatePromptTag(id));
}
function updatePromptLabels(variables) {
	return request_default.patch(updatePromptLabels$1(variables.id), variables.payload);
}
function deletePromptGroup(id) {
	return request_default.delete(deletePromptGroup$1(id));
}
function getCategories() {
	return request_default.get(getCategories$1());
}
function getRandomPrompts(variables) {
	return request_default.get(getRandomPrompts$1(variables.limit, variables.skip));
}
function listSkills(params) {
	return request_default.get(listSkillsWithFilters(params ?? {}));
}
function getSkill(id) {
	return request_default.get(getSkill$1(id));
}
function createSkill(payload) {
	return request_default.post(skills(), payload);
}
function updateSkill(variables) {
	return request_default.patch(getSkill$1(variables.id), {
		expectedVersion: variables.expectedVersion,
		...variables.payload
	});
}
function deleteSkill(id) {
	return request_default.delete(getSkill$1(id));
}
function listSkillFiles(skillId) {
	return request_default.get(skillFiles(skillId));
}
function uploadSkillFile(skillId, formData) {
	return request_default.postMultiPart(skillFiles(skillId), formData);
}
/**
* Import a skill from a .md, .zip, or .skill file. The backend extracts the
* archive, creates the skill from SKILL.md, and persists all additional files.
* Single HTTP request — no client-side zip processing needed.
*/
function importSkill(formData) {
	return request_default.postMultiPart(importSkill$1(), formData);
}
function getSkillFileContent(skillId, relativePath) {
	return request_default.get(skillFile(skillId, relativePath));
}
function deleteSkillFile(skillId, relativePath) {
	return request_default.delete(skillFile(skillId, relativePath));
}
const getSkillTree = (_skillId) => {
	return Promise.resolve({ nodes: [] });
};
const createSkillNode = (skillId, data) => {
	const name = data instanceof FormData ? data.get("name") || "untitled" : data.name;
	const type = data instanceof FormData ? "file" : data.type;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return Promise.resolve({
		_id: `pending-${now}`,
		skillId,
		parentId: null,
		type,
		name,
		order: 0,
		author: "",
		createdAt: now,
		updatedAt: now
	});
};
const updateSkillNode = (variables) => {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return Promise.resolve({
		_id: variables.nodeId,
		skillId: variables.skillId,
		parentId: variables.data.parentId ?? null,
		type: "file",
		name: variables.data.name ?? "",
		order: variables.data.order ?? 0,
		author: "",
		createdAt: now,
		updatedAt: now
	});
};
const deleteSkillNode = (_variables) => {
	return Promise.resolve();
};
const getSkillNodeContent = (_variables) => {
	return Promise.resolve({
		content: "",
		mimeType: "text/plain"
	});
};
const updateSkillNodeContent = (variables) => {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return Promise.resolve({
		_id: variables.nodeId,
		skillId: variables.skillId,
		parentId: null,
		type: "file",
		name: "",
		order: 0,
		author: "",
		createdAt: now,
		updatedAt: now
	});
};
function getGitHubSkillSyncStatus() {
	return request_default.get(adminSkillsSyncStatus());
}
function runGitHubSkillSync() {
	return request_default.post(adminSkillsSyncRun());
}
function setGitHubSkillSyncCredential(variables) {
	return request_default.put(adminSkillsSyncCredential(variables.credentialKey), { token: variables.token });
}
function deleteGitHubSkillSyncCredential(credentialKey) {
	return request_default.delete(adminSkillsSyncCredential(credentialKey));
}
function listRoles() {
	return request_default.get(`${adminRoles()}?limit=200`);
}
function getRole(roleName) {
	return request_default.get(getRole$1(roleName));
}
function updatePromptPermissions(variables) {
	return request_default.put(updatePromptPermissions$1(variables.roleName), variables.updates);
}
function updateAgentPermissions(variables) {
	return request_default.put(updateAgentPermissions$1(variables.roleName), variables.updates);
}
function updateMemoryPermissions(variables) {
	return request_default.put(updateMemoryPermissions$1(variables.roleName), variables.updates);
}
function updatePeoplePickerPermissions(variables) {
	return request_default.put(updatePeoplePickerPermissions$1(variables.roleName), variables.updates);
}
function updateMCPServersPermissions(variables) {
	return request_default.put(updateMCPServersPermissions$1(variables.roleName), variables.updates);
}
function updateRemoteAgentsPermissions(variables) {
	return request_default.put(updateRemoteAgentsPermissions$1(variables.roleName), variables.updates);
}
function updateMarketplacePermissions(variables) {
	return request_default.put(updateMarketplacePermissions$1(variables.roleName), variables.updates);
}
function updateSkillPermissions(variables) {
	return request_default.put(updateSkillPermissions$1(variables.roleName), variables.updates);
}
function getConversationTags() {
	return request_default.get(conversationTags());
}
function createConversationTag(payload) {
	return request_default.post(conversationTags(), payload);
}
function updateConversationTag(tag, payload) {
	return request_default.put(conversationTags(tag), payload);
}
function deleteConversationTag(tag) {
	return request_default.delete(conversationTags(tag));
}
function addTagToConversation(conversationId, payload) {
	return request_default.put(addTagToConversation$1(conversationId), payload);
}
function rebuildConversationTags() {
	return request_default.post(conversationTags("rebuild"));
}
function healthCheck() {
	return request_default.get(health());
}
function getUserTerms() {
	return request_default.get(userTerms());
}
function acceptTerms() {
	return request_default.post(acceptUserTerms());
}
function getBanner() {
	return request_default.get(banner());
}
function updateFeedback(conversationId, messageId, payload) {
	return request_default.put(feedback(conversationId, messageId), payload);
}
function enableTwoFactor(payload) {
	return request_default.post(enableTwoFactor$1(), payload);
}
function verifyTwoFactor(payload) {
	return request_default.post(verifyTwoFactor$1(), payload);
}
function confirmTwoFactor(payload) {
	return request_default.post(confirmTwoFactor$1(), payload);
}
function disableTwoFactor(payload) {
	return request_default.post(disableTwoFactor$1(), payload);
}
function regenerateBackupCodes(payload) {
	return request_default.post(regenerateBackupCodes$1(), payload);
}
function verifyTwoFactorTemp(payload) {
	return request_default.post(verifyTwoFactorTemp$1(), payload);
}
const getMemories = () => {
	return request_default.get(memories());
};
const deleteMemory = (key) => {
	return request_default.delete(memory(key));
};
const updateMemory = (key, value, originalKey) => {
	return request_default.patch(memory(originalKey || key), {
		key,
		value
	});
};
const updateMemoryPreferences = (preferences) => {
	return request_default.patch(memoryPreferences(), preferences);
};
const createMemory = (data) => {
	return request_default.post(memories(), data);
};
function searchPrincipals(params) {
	return request_default.get(searchPrincipals$1(params));
}
function getAccessRoles(resourceType) {
	return request_default.get(getAccessRoles$1(resourceType));
}
function getResourcePermissions(resourceType, resourceId) {
	return request_default.get(getResourcePermissions$1(resourceType, resourceId));
}
function updateResourcePermissions(resourceType, resourceId, data) {
	return request_default.put(updateResourcePermissions$1(resourceType, resourceId), data);
}
function getEffectivePermissions(resourceType, resourceId) {
	return request_default.get(getEffectivePermissions$1(resourceType, resourceId));
}
function getAllEffectivePermissions(resourceType) {
	return request_default.get(getAllEffectivePermissions$1(resourceType));
}
function getGraphApiToken(params) {
	return request_default.get(graphToken(params.scopes));
}
function getDomainServerBaseUrl() {
	return `${apiBaseUrl()}/api`;
}
const getActiveJobs = () => {
	return request_default.get(activeJobs());
};
//#endregion
export { permissionEntrySchema as $, feedbackSchema as $a, extendedModelEndpointSchema as $i, MCP_USER_INPUT_FIELDS as $n, specsConfigSchema as $r, balanceSchema as $t, updateResourcePermissions as A, tPluginAuthConfigSchema as Aa, anthropicSettings as Ai, modularEndpoints as An, fileConfig as Ar, SKILL_SYNC_MAX_INTERVAL_MINUTES as At, MutationKeys as B, RunStatus as Ba, defaultAssistantFormValues as Bi, summarizationTriggerSchema as Bn, mbToBytes as Br, TTSProviders as Bt, resetPassword as C, tBannerSchema as Ca, ThinkingLevel as Ci, initialModelsConfig as Cn, defaultOCRMimeTypes as Cr, MAX_SUBAGENT_RUN_CONFIGS as Ct, updateFeedback as D, tExampleSchema as Da, agentsSettings as Di, messageFilterPiiSchema as Dn, endpointFileConfigSchema as Dr, RetentionMode as Dt, searchPrincipals as E, tConvoUpdateSchema as Ea, agentsSchema as Ei, memorySchema as En, documentParserMimeTypes as Er, RerankerTypes as Et, request_default as F, AnnotationTypes as Fa, compactAgentsBaseSchema as Fi, resolveEndpointType as Fn, imageMimeTypes as Fr, SearchCategories as Ft, PrincipalType as G, defaultOrderQuery as Ga, eReasoningEffortSchema as Gi, validateVisionModel as Gn, retrievalMimeTypesList as Gr, allowedAddressesSchema as Gt, AccessRoleIds as H, Tools as Ha, eAnthropicEffortSchema as Hi, transactionsSchema as Hn, mergeFileConfig as Hr, ViolationTypes as Ht, getTokenHeader as I, AssistantStreamEvents as Ia, compactAgentsSchema as Ii, skillSyncConfigSchema as In, imageTypeMapping as Ir, SearchProviders as It, accessRoleToPermBits as J, isActionTool as Ja, eReasoningSummarySchema as Ji, visionModels as Jn, textMimeTypes as Jr, assistantEndpointSchema as Jt, ResourceType as K, hostImageIdSuffix as Ka, eReasoningParameterFormatSchema as Ki, vertexAISchema as Kn, supportedMimeTypes as Kr, alternateName as Kt, setAcceptLanguageHeader as L, EToolResources as La, compactAssistantSchema as Li, skillSyncGitHubSourceSchema as Ln, inferMimeType as Lr, SettingsTabValues as Lt, updateUserKey as M, tPresetSchema as Ma, authTypeSchema as Mi, paramDefinitionSchema as Mn, fullMimeTypesList as Mr, STTProviders as Mt, updateUserPlugins as N, tQueryParamsSchema as Na, cacheSubsetProviders as Ni, providerEndpointMap as Nn, getEndpointFileConfig as Nr, SafeSearchTypes as Nt, updateMessage as O, tMessageSchema as Oa, anthropicBaseSchema as Oi, messageFilterSchema as On, excelFileTypes as Or, SKILL_SYNC_DEFAULT_DISCOVERY_DEPTH as Ot, userKeyQuery as P, tSharedLinkSchema as Pa, coerceNumber as Pi, rateLimitSchema as Pn, imageExtRegex as Pr, ScraperProviders as Pt, permBitsToAccessLevel as Q, feedbackRatingSchema as Qa, endpointSettings as Qi, MCPServersSchema as Qn, modelSpecSubagentsSchema as Qr, azureGroupSchema as Qt, setTokenHeader as R, FilePurpose as Ra, compactGoogleSchema as Ri, specialVariables as Rn, isBedrockDocumentType as Rr, SettingsViews as Rt, requestPasswordReset as S, removeNullishValues as Sa, ThinkingDisplay as Si, imageGenTools as Sn, convertStringsToRegex as Sr, MAX_SUBAGENT_GRAPH_NODES as St, revokeUserKey as T, tConversationTagSchema as Ta, agentsBaseSchema as Ti, isRemoteOidcUrlAllowed as Tn, defaultTextMimeTypes as Tr, RateLimitPrefix as Tt, PermissionBits as U, actionDelimiter as Ua, eImageDetailSchema as Ui, turnstileOptionsSchema as Un, mimeTypeAliases as Ur, VisionModes as Ut, QueryKeys as V, StepStatus as Va, documentSupportedProviders as Vi, supportsBalanceCheck as Vn, megabyte as Vr, Time as Vt, PrincipalModel as W, actionDomainSeparator as Wa, eModelEndpointSchema as Wi, turnstileSchema as Wn, retrievalMimeTypes as Wr, agentsEndpointSchema as Wt, getResourcePermissionsResponseSchema as X, FEEDBACK_REASON_KEYS as Xa, eThinkingLevelSchema as Xi, MCPOptionsSchema as Xn, REFILL_INTERVAL_UNITS as Xr, azureEndpointSchema as Xt, effectivePermissionsResponseSchema as Y, FEEDBACK_RATINGS as Ya, eThinkingDisplaySchema as Yi, webSearchSchema as Yn, videoMimeTypes as Yr, azureBaseSchema as Yt, hasPermissions as Z, FEEDBACK_TAGS as Za, eVerbositySchema as Zi, MCPServerUserInputSchema as Zn, getRefillEligibilityDate as Zr, azureGroupConfigsSchema as Zt, getResourcePermissions as _, openAIBaseSchema as _a, Providers as _i, fileStrategiesSchema as _n, bedrockDocumentExtensions as _r, ImageDetailCost as _t, data_service_exports as a, googleSettings as aa, generateDynamicSchema as ai, configSchema as an, extractEnvVariable as ao, AuthorizationTypeEnum as ar, AuthKeys as at, register as b, openRouterSchema as ba, ReasoningResponseKey as bi, getEndpointField as bn, codeInterpreterMimeTypesList as br, LocalStorageKeys as bt, getAccessRoles as c, inputTokensIncludesCache as ca, validateSettingDefinitions as ci, defaultAssistantsVersion as cn, normalizeEndpointName as co, FileSources as cr, Capabilities as ct, getAvailablePlugins as d, isDocumentSupportedProvider as da, BedrockProviders as di, defaultRetrievalModels as dn, buildLoginRedirectUrl as dr, DEFAULT_MEMORY_MAX_INPUT_TOKENS as dt, getModelKey as ea, tModelSpecSchema as ei, baseEndpointSchema as en, feedbackTagKeySchema as eo, SSEOptionsSchema as er, principalSchema as et, getConversationById as f, isImageVisionTool as fa, BedrockReasoningConfig as fi, defaultSocialLogins as fn, loginPage as fr, EImageOutputType as ft, getModels as g, isUUID as ga, MYTHOS_CLASS_FAMILIES as gi, fileStorageSchema as gn, audioMimeTypes as gr, ForkOptions as gt, getMCPServerConnectionStatus as h, isParamEndpoint as ha, ImageVisionTool as hi, fileSourceSchema as hn, applicationMimeTypes as hr, FetchTokenConfig as ht, createPreset as i, googleSchema as ia, SettingTypes as ii, cloudfrontConfigSchema as in, envVarRegex as io, AuthTypeEnum as ir, AgentCapabilities as it, updateTokenCount as j, tPluginSchema as ja, assistantSchema as ji, ocrSchema as jn, fileConfigSchema as jr, SKILL_SYNC_MIN_INTERVAL_MINUTES as jt, updateMessageContent as k, tModelSpecPresetSchema as ka, anthropicSchema as ki, modelConfigSchema as kn, excelMimeTypes as kr, SKILL_SYNC_MAX_DISCOVERY_DEPTH as kt, getAgentApiKeys as l, isAgentsEndpoint as la, AnthropicEffort as li, defaultEndpoints as ln, checkOpenAIStorage as lr, CohereConstants as lt, getEffectivePermissions as m, isOpenAILikeProvider as ma, ImageDetail as mi, excludedKeys as mn, sharedFileDownload as mr, ErrorTypes as mt, clearAllConversations as n, googleBaseSchema as na, ComponentTypes as ni, bedrockGuardrailConfigSchema as nn, getTagsForRating as no, StreamableHTTPOptionsSchema as nr, updateResourcePermissionsRequestSchema as nt, deleteAgentApiKey as o, imageDetailNumeric as oa, generateGoogleSchema as oi, contextPruningSchema as on, extractVariableName as oo, TokenExchangeMethodEnum as or, BASE_ONLY_CONFIG_SECTIONS as ot, getCustomConfigSpeech as p, isMythosClassModel as pa, EModelEndpoint as pi, endpointSchema as pn, registerPage as pr, EndpointURLs as pt, accessRoleSchema as q, hostImageNamePrefix as qa, eReasoningResponseKeySchema as qi, vertexModelConfigSchema as qn, supportsFiles as qr, anthropicEndpointSchema as qt, createAgentApiKey as r, googleGenConfigSchema as ra, OptionTypes as ri, bedrockModels as rn, toMinimalFeedback as ro, WebSocketOptionsSchema as rr, updateResourcePermissionsResponseSchema as rt, deletePreset as s, imageDetailValue as sa, generateOpenAISchema as si, defaultAgentCapabilities as sn, isSensitiveEnvVar as so, FileContext as sr, CacheKeys as st, cancelMCPOAuth as t, getSettingsKeys as ta, MAX_SUBAGENTS as ti, bedrockEndpointSchema as tn, getTagByKey as to, StdioOptionsSchema as tr, resourcePermissionsResponseSchema as tt, getAllEffectivePermissions as u, isAssistantsEndpoint as ua, AuthType as ui, defaultModels as un, apiBaseUrl as ur, Constants as ut, getSharedLink as v, openAISchema as va, ReasoningEffort as vi, getConfigDefaults as vn, bedrockDocumentFormats as vr, InfiniteCollections as vt, revokeAllUserKeys as w, tConversationSchema as wa, Verbosity as wi, interfaceSchema as wn, defaultSTTMimeTypes as wr, OCRStrategy as wt, reinitializeMCPServer as x, paramEndpoints as xa, ReasoningSummary as xi, getSchemaDefaults as xn, codeTypeMapping as xr, MAX_SUBAGENT_DEPTH as xt, getSharedMessages as y, openAISettings as ya, ReasoningParameterFormat as yi, getDefaultParamsEndpoint as yn, codeInterpreterMimeTypes as yr, KnownEndpoints as yt, DynamicQueryKeys as z, MessageContentTypes as za, defaultAgentFormValues as zi, summarizationConfigSchema as zn, isPermissiveMimeConfig as zr, SystemCategories as zt };

//# sourceMappingURL=data-service-BsdHkdKS.mjs.map