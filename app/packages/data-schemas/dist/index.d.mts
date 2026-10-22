import { A as AuditCategory, B as ConfigAssignTarget, C as AdminMember, D as AuditAction, E as AdminUserSearchResult, F as AuditOutcome, H as SystemCapability, I as AuditSeverity, L as AuditTarget, M as AuditIntegrity, N as AuditMetadata, O as AuditActor, P as AuditMetadataValue, R as BaseSystemCapability, S as AdminGroup, T as AdminUserListItem, V as ConfigSection, _ as AdminAuditLogEntry, a as SystemCapabilities, b as AdminConfigListResponse, c as hasImpliedCapability, d as AUDIT_ACTIONS, f as AUDIT_ACTION_CATEGORY, g as AUDIT_SEVERITIES, h as AUDIT_OUTCOMES, i as ResourceCapabilityMap, j as AuditContext, k as AuditActorType, l as isValidCapability, m as AUDIT_CATEGORIES, n as CAPABILITY_CATEGORIES, o as configCapability, p as AUDIT_ACTOR_TYPES, r as CapabilityImplications, s as expandImplications, t as BASE_CONFIG_PRINCIPAL_ID, u as readConfigCapability, v as AdminConfig, w as AdminSystemGrant, x as AdminConfigResponse, y as AdminConfigDeleteResponse, z as CapabilityCategory } from "./capabilities-9RvPR_IR.mjs";
import { AgentSubagentsConfig, AgentToolOptions, AgentToolResources, CloudFrontConfig, CodeEnvRef, DeepPartial, EModelEndpoint, EToolResources, FileStorage, GraphEdge, MCPOptions, MCPServerDB, PermissionBits, PermissionTypes, Permissions, PrincipalModel, PrincipalType, RefillIntervalUnit, ResourceType, SearchCategories, SkillSyncConfig, SummarizationConfig, TAgentsEndpoint, TAnthropicEndpoint, TAssistantEndpoint, TAttachment, TAzureConfig, TConfigDefaults, TCustomConfig, TCustomEndpoints, TEndpoint, TFeedbackRating, TFeedbackTag, TFileConfig, TMemoryConfig, TPrincipalSearchResult, TUserFavorite, TVertexAIConfig, TVertexAISchema } from "librechat-data-provider";
import winston from "winston";
import { AsyncLocalStorage } from "async_hooks";
import mongoose, { AnyBulkWriteOperation, ClientSession, Connection, DeleteResult, Document, FilterQuery, Model, MongooseBulkWriteOptions, PipelineStage, QueryOptions, RootFilterQuery, Schema, SortOrder, Types } from "mongoose";
import { BulkWriteResult } from "mongodb";

//#region src/app/agents.d.ts
/**
* Sets up the Agents configuration from the config (`librechat.yaml`) file.
* If no agents config is defined, uses the provided defaults or parses empty object.
*
* @param config - The loaded custom configuration.
* @param [defaultConfig] - Default configuration from getConfigDefaults.
* @returns The Agents endpoint configuration.
*/
declare function agentsConfigSetup(config: Partial<TCustomConfig>, defaultConfig?: Partial<TAgentsEndpoint>): Partial<TAgentsEndpoint>;
//#endregion
//#region src/types/app.d.ts
type JsonSchemaType = {
  type: "string" | "number" | "integer" | "float" | "boolean" | "array" | "object";
  enum?: string[];
  items?: JsonSchemaType;
  properties?: Record<string, JsonSchemaType>;
  required?: string[];
  description?: string;
  additionalProperties?: boolean | JsonSchemaType;
};
type ConvertJsonSchemaToZodOptions = {
  allowEmptyObject?: boolean;
  dropFields?: string[];
  transformOneOfAnyOf?: boolean;
};
interface FunctionTool {
  type: "function";
  function: {
    description: string;
    name: string;
    parameters: JsonSchemaType;
  };
}
/**
* Application configuration object
* Based on the configuration defined in api/server/services/Config/getAppConfig.js
*/
interface AppConfig {
  /** The main custom configuration */
  config: Partial<TCustomConfig>;
  /** OCR configuration */
  ocr?: TCustomConfig["ocr"];
  /** File paths configuration */
  paths?: {
    uploads: string;
    imageOutput: string;
    publicPath: string;
    [key: string]: string;
  };
  /** Memory configuration */
  memory?: TMemoryConfig;
  /** Summarization configuration */
  summarization?: SummarizationConfig;
  /** Web search configuration */
  webSearch?: TCustomConfig["webSearch"];
  /** Message filter configuration (PII and future filter types) */
  messageFilter?: TCustomConfig["messageFilter"];
  /** Skill sync configuration */
  skillSync?: SkillSyncConfig;
  /** File storage strategy ('local', 's3', 'firebase', 'azure_blob', 'cloudfront') */
  fileStrategy: FileStorage;
  /** File strategies configuration */
  fileStrategies?: TCustomConfig["fileStrategies"];
  /** CloudFront CDN configuration */
  cloudfront?: CloudFrontConfig;
  /** Registration configurations */
  registration?: TCustomConfig["registration"];
  /** Actions configurations */
  actions?: TCustomConfig["actions"];
  /** Admin-filtered tools */
  filteredTools?: string[];
  /** Admin-included tools */
  includedTools?: string[];
  /** Image output type configuration */
  imageOutputType: string;
  /** Interface configuration */
  interfaceConfig?: TCustomConfig["interface"];
  /** Turnstile configuration */
  turnstileConfig?: Partial<TCustomConfig["turnstile"]>;
  /** Balance configuration */
  balance?: Partial<TCustomConfig["balance"]>;
  /** Transactions configuration */
  transactions?: TCustomConfig["transactions"];
  /** Speech configuration */
  speech?: TCustomConfig["speech"];
  /** MCP server configuration */
  mcpConfig?: TCustomConfig["mcpServers"] | null;
  /** MCP settings (domain allowlist, etc.) */
  mcpSettings?: TCustomConfig["mcpSettings"] | null;
  /** File configuration */
  fileConfig?: TFileConfig;
  /** Secure image links configuration */
  secureImageLinks?: TCustomConfig["secureImageLinks"];
  /** Processed model specifications */
  modelSpecs?: TCustomConfig["modelSpecs"];
  /** Available tools */
  availableTools?: Record<string, FunctionTool>;
  endpoints?: {
    /** Admin exemption list of host:port pairs that bypass the SSRF private-IP block */allowedAddresses?: string[]; /** OpenAI endpoint configuration */
    openAI?: Partial<TEndpoint>; /** Google endpoint configuration */
    google?: Partial<TEndpoint>; /** Bedrock endpoint configuration */
    bedrock?: Partial<TEndpoint>; /** Anthropic endpoint configuration with optional Vertex AI support */
    anthropic?: Partial<TAnthropicEndpoint> & {
      /** Validated Vertex AI configuration */vertexConfig?: TVertexAIConfig;
    }; /** Azure OpenAI endpoint configuration */
    azureOpenAI?: TAzureConfig; /** Assistants endpoint configuration */
    assistants?: Partial<TAssistantEndpoint>; /** Azure assistants endpoint configuration */
    azureAssistants?: Partial<TAssistantEndpoint>; /** Agents endpoint configuration */
    [EModelEndpoint.agents]?: Partial<TAgentsEndpoint>; /** Custom endpoints configuration */
    [EModelEndpoint.custom]?: TCustomEndpoints; /** Global endpoint configuration */
    all?: Partial<TEndpoint>;
  };
}
//#endregion
//#region src/app/interface.d.ts
/**
* Loads the default interface object.
* @param params - The loaded custom configuration.
* @param params.config - The loaded custom configuration.
* @param params.configDefaults - The custom configuration default values.
* @returns default interface object.
*/
declare function loadDefaultInterface({
  config,
  configDefaults
}: {
  config?: Partial<TCustomConfig>;
  configDefaults: TConfigDefaults;
}): Promise<AppConfig["interfaceConfig"]>;
//#endregion
//#region src/app/memory.d.ts
declare function loadMemoryConfig(config: TCustomConfig["memory"]): TMemoryConfig | undefined;
declare function isMemoryEnabled(config: TMemoryConfig | undefined): boolean;
declare function isMemoryAgentEnabled(config: TMemoryConfig | undefined): boolean;
//#endregion
//#region src/app/service.d.ts
declare function loadSummarizationConfig(config: DeepPartial<TCustomConfig>): AppConfig["summarization"];
declare function loadSkillSyncConfig(config: DeepPartial<TCustomConfig>): AppConfig["skillSync"];
type Paths = {
  root: string;
  uploads: string;
  clientPath: string;
  dist: string;
  publicPath: string;
  fonts: string;
  assets: string;
  imageOutput: string;
  structuredTools: string;
  pluginManifest: string;
};
/**
* Loads custom config and initializes app-wide variables.
* @function AppService
*/
declare const AppService: (params?: {
  config: DeepPartial<TCustomConfig>;
  paths?: Paths;
  systemTools?: Record<string, FunctionTool>;
}) => Promise<AppConfig>;
//#endregion
//#region src/app/specs.d.ts
/**
* Sets up Model Specs from the config (`librechat.yaml`) file.
* @param [endpoints] - The loaded custom configuration for endpoints.
* @param [modelSpecs] - The loaded custom configuration for model specs.
* @param [interfaceConfig] - The loaded interface configuration.
* @returns The processed model specs, if any.
*/
declare function processModelSpecs(endpoints?: TCustomConfig["endpoints"], _modelSpecs?: TCustomConfig["modelSpecs"], interfaceConfig?: TCustomConfig["interface"]): TCustomConfig["modelSpecs"] | undefined;
//#endregion
//#region src/app/turnstile.d.ts
/**
* Loads and maps the Cloudflare Turnstile configuration.
*
* Expected config structure:
*
* turnstile:
*   siteKey: "your-site-key-here"
*   options:
*     language: "auto"    // "auto" or an ISO 639-1 language code (e.g. en)
*     size: "normal"      // Options: "normal", "compact", "flexible", or "invisible"
*
* @param config - The loaded custom configuration.
* @param configDefaults - The custom configuration default values.
* @returns The mapped Turnstile configuration.
*/
declare function loadTurnstileConfig(config: Partial<TCustomConfig> | undefined, configDefaults: TConfigDefaults): Partial<TCustomConfig["turnstile"]>;
//#endregion
//#region src/app/vertex.d.ts
/**
* Default Vertex AI models available through Google Cloud
* These are the standard Anthropic model names as served by Vertex AI
*/
declare const defaultVertexModels: string[];
/**
* Validates and processes Vertex AI configuration
* @param vertexConfig - The Vertex AI configuration object
* @returns Validated configuration with errors if any
*/
declare function validateVertexConfig(vertexConfig: TVertexAISchema | undefined): TVertexAIConfig | null;
/**
* Sets up the Vertex AI configuration from the config (`librechat.yaml`) file.
* Similar to azureConfigSetup, this processes and validates the Vertex AI configuration.
* @param config - The loaded custom configuration.
* @returns The validated Vertex AI configuration or null if not configured.
*/
declare function vertexConfigSetup(config: Partial<TCustomConfig>): TVertexAIConfig | null;
//#endregion
//#region src/types/web.d.ts
type TWebSearchKeys = "serperApiKey" | "searxngInstanceUrl" | "searxngApiKey" | "firecrawlApiKey" | "firecrawlApiUrl" | "firecrawlVersion" | "tavilyApiKey" | "tavilySearchUrl" | "tavilyExtractUrl" | "jinaApiKey" | "jinaApiUrl" | "cohereApiKey";
type TWebSearchCategories = SearchCategories.PROVIDERS | SearchCategories.SCRAPERS | SearchCategories.RERANKERS;
//#endregion
//#region src/app/web.d.ts
declare const webSearchAuth: {
  providers: {
    serper: {
      serperApiKey: 1;
    };
    searxng: {
      searxngInstanceUrl: 1; /** Optional (0) */
      searxngApiKey: 0;
    };
    tavily: {
      tavilyApiKey: 1;
      tavilySearchUrl: 0;
    };
  };
  scrapers: {
    firecrawl: {
      firecrawlApiKey: 1; /** Optional (0) */
      firecrawlApiUrl: 0;
      firecrawlVersion: 0;
    };
    serper: {
      serperApiKey: 1;
    };
    tavily: {
      tavilyApiKey: 1;
      tavilyExtractUrl: 0;
    };
  };
  rerankers: {
    jina: {
      jinaApiKey: 1; /** Optional (0) */
      jinaApiUrl: 0;
    };
    cohere: {
      cohereApiKey: 1;
    };
  };
};
/**
* Extracts all unique API keys from the webSearchAuth configuration object
*/
declare function getWebSearchKeys(): TWebSearchKeys[];
declare const webSearchKeys: TWebSearchKeys[];
declare function loadWebSearchConfig(config: TCustomConfig["webSearch"]): TCustomConfig["webSearch"];
//#endregion
//#region src/common/enum.d.ts
/**
* Common role combinations. Values mirror unions of `PermissionBits` flags;
* literals are required by `--isolatedDeclarations` (cross-file enum refs
* aren't computable). The guard below fails fast on any drift.
*/
declare enum RoleBits {
  /** VIEW */
  VIEWER = 1,
  /** VIEW | EDIT */
  EDITOR = 3,
  /** VIEW | EDIT | DELETE */
  MANAGER = 7,
  /** VIEW | EDIT | DELETE | SHARE */
  OWNER = 15
}
//#endregion
//#region src/common/pagination.d.ts
interface CursorPaginationParams {
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
interface CursorPaginationResponse<T> {
  data: T[];
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
    previousCursor?: string;
    totalCount?: number;
  };
}
//#endregion
//#region src/common/permissions.d.ts
/**
* Upper bound for any stored `permBits` value. Computed as the bitwise OR of
* every numeric member of `PermissionBits`. Used by:
*
*   - the `permBits` schema validator (rejects writes above this bound)
*   - `permissionBitSupersets` (enumerates `$in` candidates within this range)
*   - every ACL read path (via `permissionBitSupersets`)
*
* The shared definition keeps the read-side enumeration and the write-side
* bound locked together: adding a new member to `PermissionBits` auto-expands
* both at once. See issue #12729 for the Cosmos DB / `$bitsAllSet` fix.
*/
declare const MAX_PERM_BITS: number;
//#endregion
//#region src/types/user.d.ts
interface IUser extends Document {
  _id: Types.ObjectId;
  /**
  * Mongoose's `Document.id` virtual is typed `id?: any`. At runtime it's
  * always `_id.toString()` for a hydrated doc, so narrow to a required
  * string. This also lets `IUser` satisfy Express.User augmentations
  * (the OIDC remote-agent middleware assigns `req.user = IUser` where
  * the project's local `Express.User` requires `id: string`).
  */
  id: string;
  name?: string;
  username?: string;
  email: string;
  emailVerified: boolean;
  password?: string;
  avatar?: string;
  provider: string;
  role?: string;
  googleId?: string;
  facebookId?: string;
  openidId?: string;
  samlId?: string;
  ldapId?: string;
  githubId?: string;
  discordId?: string;
  appleId?: string;
  plugins?: string[];
  openidIssuer?: string;
  twoFactorEnabled?: boolean;
  totpSecret?: string;
  backupCodes?: Array<{
    codeHash: string;
    used: boolean;
    usedAt?: Date | null;
  }>;
  pendingTotpSecret?: string;
  pendingBackupCodes?: Array<{
    codeHash: string;
    used: boolean;
    usedAt?: Date | null;
  }>;
  refreshToken?: Array<{
    refreshToken: string;
  }>;
  expiresAt?: Date;
  termsAccepted?: boolean;
  personalization?: {
    memories?: boolean;
  };
  favorites?: TUserFavorite[];
  /** Per-skill active/inactive overrides. Key = skillId, value = active state. */
  skillStates?: Record<string, boolean>;
  createdAt?: Date;
  updatedAt?: Date;
  /** Field for external source identification (for consistency with TPrincipal schema) */
  idOnTheSource?: string;
  tenantId?: string;
  federatedTokens?: OIDCTokens;
  openidTokens?: OIDCTokens;
}
interface OIDCTokens {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_at?: number;
}
interface BalanceConfig {
  enabled?: boolean;
  startBalance?: number;
  autoRefillEnabled?: boolean;
  refillIntervalValue?: number;
  refillIntervalUnit?: RefillIntervalUnit;
  refillAmount?: number;
}
interface CreateUserRequest extends Partial<IUser> {
  email: string;
}
interface UpdateUserRequest {
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  emailVerified?: boolean;
  avatar?: string;
  plugins?: string[];
  twoFactorEnabled?: boolean;
  termsAccepted?: boolean;
  personalization?: {
    memories?: boolean;
  };
  skillStates?: Record<string, boolean>;
}
interface UserDeleteResult {
  deletedCount: number;
  message: string;
}
interface UserFilterOptions extends CursorPaginationParams {
  _id?: Types.ObjectId | string;
  search?: string;
  role?: string;
  emailVerified?: boolean;
  provider?: string;
  twoFactorEnabled?: boolean;
  googleId?: string;
  facebookId?: string;
  openidId?: string;
  samlId?: string;
  ldapId?: string;
  githubId?: string;
  discordId?: string;
  appleId?: string;
  createdAfter?: string;
  createdBefore?: string;
}
interface UserQueryOptions {
  fieldsToSelect?: string | string[] | null;
  lean?: boolean;
}
//#endregion
//#region src/types/token.d.ts
interface IToken extends Document {
  userId: Types.ObjectId;
  email?: string;
  type?: string;
  identifier?: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  metadata?: Map<string, unknown>;
  tenantId?: string;
}
interface TokenCreateData {
  userId: Types.ObjectId | string;
  email?: string;
  type?: string;
  identifier?: string;
  token: string;
  expiresIn: number;
  metadata?: Record<string, unknown> | Map<string, unknown>;
}
interface TokenQuery {
  userId?: Types.ObjectId | string;
  token?: string;
  email?: string | null;
  type?: string | null;
  identifier?: string | RegExp | null;
}
interface TokenUpdateData {
  email?: string;
  type?: string;
  identifier?: string;
  token?: string;
  expiresAt?: Date;
  expiresIn?: number;
  metadata?: Record<string, unknown> | Map<string, unknown>;
}
interface TokenDeleteResult {
  deletedCount?: number;
}
//#endregion
//#region src/types/convo.d.ts
interface IConversation extends Document {
  conversationId: string;
  title?: string;
  user?: string;
  messages?: Types.ObjectId[];
  isTemporary?: boolean;
  endpoint?: string;
  endpointType?: string;
  model?: string;
  region?: string;
  chatGptLabel?: string;
  examples?: unknown[];
  modelLabel?: string;
  promptPrefix?: string;
  temperature?: number;
  top_p?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  maxTokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  file_ids?: string[];
  resendImages?: boolean;
  promptCache?: boolean;
  promptCacheTtl?: "5m" | "1h";
  thinking?: boolean;
  thinkingBudget?: number;
  effort?: string;
  system?: string;
  resendFiles?: boolean;
  imageDetail?: string;
  agent_id?: string;
  assistant_id?: string;
  instructions?: string;
  stop?: string[];
  isArchived?: boolean;
  pinned?: boolean;
  iconURL?: string;
  greeting?: string;
  spec?: string;
  tags?: string[];
  chatProjectId?: string | null;
  tools?: string[];
  maxContextTokens?: number;
  max_tokens?: number;
  reasoning_effort?: string;
  reasoning_summary?: string;
  verbosity?: string;
  useResponsesApi?: boolean;
  web_search?: boolean;
  url_context?: boolean;
  disableStreaming?: boolean;
  fileTokenLimit?: number;
  files?: string[];
  expiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
//#endregion
//#region src/types/chatProject.d.ts
interface IChatProject {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  user: string;
  conversationCount: number;
  lastConversationAt?: Date | null;
  lastConversationId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
interface IChatProjectDocument extends Omit<IChatProject, "_id">, Document {}
//#endregion
//#region src/types/session.d.ts
interface ISession extends Document {
  refreshTokenHash: string;
  expiration: Date;
  user: Types.ObjectId;
  tenantId?: string;
}
interface CreateSessionOptions {
  expiration?: Date;
  /** Duration in milliseconds for session expiry. Default: 7 days */
  expiresIn?: number;
}
interface UpdateExpirationOptions {
  /** Duration in milliseconds for session expiry. Default: 7 days */
  expiresIn?: number;
}
interface SessionSearchParams {
  refreshToken?: string;
  userId?: string;
  sessionId?: string | {
    sessionId: string;
  };
}
interface SessionQueryOptions {
  lean?: boolean;
}
interface DeleteSessionParams {
  refreshToken?: string;
  sessionId?: string;
}
interface DeleteAllSessionsOptions {
  excludeCurrentSession?: boolean;
  currentSessionId?: string;
}
interface SessionResult {
  session: Partial<ISession>;
  refreshToken: string;
}
interface SignPayloadParams {
  payload: Record<string, unknown>;
  secret?: string;
  expirationTime: number;
}
//#endregion
//#region src/types/balance.d.ts
interface IBalance extends Document {
  user: Types.ObjectId;
  tokenCredits: number;
  autoRefillEnabled: boolean;
  refillIntervalValue: number;
  refillIntervalUnit: RefillIntervalUnit;
  lastRefill: Date;
  refillAmount: number;
  tenantId?: string;
}
/** Plain data fields for creating or updating a balance record (no Mongoose Document methods) */
interface IBalanceUpdate {
  user?: string;
  tokenCredits?: number;
  autoRefillEnabled?: boolean;
  refillIntervalValue?: number;
  refillIntervalUnit?: RefillIntervalUnit;
  refillAmount?: number;
  lastRefill?: Date;
}
//#endregion
//#region src/types/banner.d.ts
interface IBanner extends Document {
  bannerId: string;
  message: string;
  displayFrom: Date;
  displayTo?: Date;
  type: "banner" | "popup";
  isPublic: boolean;
  persistable: boolean;
  tenantId?: string;
}
//#endregion
//#region src/types/transaction.d.ts
interface TransactionData {
  user: string;
  conversationId: string;
  tokenType: string;
  model?: string;
  context?: string;
  valueKey?: string;
  rate?: number;
  rawAmount?: number;
  tokenValue?: number;
  inputTokens?: number;
  writeTokens?: number;
  readTokens?: number;
  messageId?: string;
  inputTokenCount?: number;
  rateDetail?: Record<string, number>;
}
//#endregion
//#region src/types/message.d.ts
interface IMessage extends Document {
  messageId: string;
  conversationId: string;
  user: string;
  model?: string;
  endpoint?: string;
  conversationSignature?: string;
  clientId?: string;
  invocationId?: number;
  parentMessageId?: string | null;
  tokenCount?: number;
  summaryTokenCount?: number;
  sender?: string;
  text?: string;
  summary?: string;
  isCreatedByUser: boolean;
  isTemporary?: boolean;
  unfinished?: boolean;
  error?: boolean;
  finish_reason?: string;
  feedback?: {
    rating: TFeedbackRating;
    tag: TFeedbackTag | undefined;
    text?: string;
  };
  _meiliIndex?: boolean;
  files?: unknown[];
  plugin?: {
    latest?: string;
    inputs?: unknown[];
    outputs?: string;
  };
  plugins?: unknown[];
  content?: unknown[];
  thread_id?: string;
  iconURL?: string;
  addedConvo?: boolean;
  metadata?: Record<string, unknown>;
  contextMeta?: {
    calibrationRatio?: number;
    encoding?: string;
  };
  attachments?: unknown[];
  /** Skills the user invoked manually via the `$` popover on this turn. UI-only metadata for `SkillPills`. */
  manualSkills?: string[];
  /**
  * Skills auto-primed on this turn via `always-apply` frontmatter. Persisted
  * at turn time so pinned badges survive later flips of the skill's
  * `alwaysApply` flag — the audit trail follows what actually ran, not what
  * the current catalog says.
  */
  alwaysAppliedSkills?: string[];
  /** Verbatim excerpts the user quoted to reference on this turn. UI-only metadata for `MessageQuotes`. */
  quotes?: string[];
  expiredAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
//#endregion
//#region src/types/agent.d.ts
interface ISupportContact {
  name?: string;
  email?: string;
}
interface IAgent extends Omit<Document, "model"> {
  id: string;
  name?: string;
  description?: string;
  instructions?: string;
  avatar?: {
    filepath: string;
    source: string;
  };
  provider: string;
  model: string;
  model_parameters?: Record<string, unknown>;
  artifacts?: string;
  access_level?: number;
  recursion_limit?: number;
  tools?: string[];
  skills?: string[];
  skills_enabled?: boolean;
  tool_kwargs?: Array<unknown>;
  actions?: string[];
  author: Types.ObjectId;
  authorName?: string;
  hide_sequential_outputs?: boolean;
  end_after_tools?: boolean;
  /** @deprecated Use edges instead */
  agent_ids?: string[];
  edges?: GraphEdge[];
  conversation_starters?: string[];
  tool_resources?: AgentToolResources;
  versions?: Omit<IAgent, "versions">[];
  category: string;
  support_contact?: ISupportContact;
  is_promoted?: boolean;
  /** MCP server names extracted from tools for efficient querying */
  mcpServerNames?: string[];
  /** Per-tool configuration (defer_loading, allowed_callers) */
  tool_options?: AgentToolOptions;
  /** Subagent spawning configuration — isolated-context child agents. */
  subagents?: AgentSubagentsConfig;
  tenantId?: string;
}
//#endregion
//#region src/types/agentApiKey.d.ts
interface IAgentApiKey extends Document {
  userId: Types.ObjectId;
  name: string;
  keyHash: string;
  keyPrefix: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tenantId?: string;
}
interface AgentApiKeyCreateData {
  userId: Types.ObjectId | string;
  name: string;
  expiresAt?: Date | null;
}
interface AgentApiKeyCreateResult {
  id: string;
  name: string;
  keyPrefix: string;
  key: string;
  createdAt: Date;
  expiresAt?: Date;
}
interface AgentApiKeyListItem {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}
interface AgentApiKeyQuery {
  userId?: Types.ObjectId | string;
  keyPrefix?: string;
  id?: string;
}
interface AgentApiKeyDeleteResult {
  deletedCount?: number;
}
//#endregion
//#region src/types/agentCategory.d.ts
type AgentCategory = {
  /** Unique identifier for the category (e.g., 'general', 'hr', 'finance') */value: string; /** Display label for the category */
  label: string; /** Description of the category */
  description?: string; /** Display order for sorting categories */
  order: number; /** Whether the category is active and should be displayed */
  isActive: boolean; /** Whether this is a custom user-created category */
  custom?: boolean;
  tenantId?: string;
};
type IAgentCategory = AgentCategory & Document & {
  _id: Types.ObjectId;
};
//#endregion
//#region src/types/role.d.ts
interface IRole extends Document {
  name: string;
  description?: string;
  permissions: {
    [PermissionTypes.BOOKMARKS]?: {
      [Permissions.USE]?: boolean;
    };
    [PermissionTypes.PROMPTS]?: {
      [Permissions.USE]?: boolean;
      [Permissions.CREATE]?: boolean;
      [Permissions.SHARE]?: boolean;
      [Permissions.SHARE_PUBLIC]?: boolean;
    };
    [PermissionTypes.MEMORIES]?: {
      [Permissions.USE]?: boolean;
      [Permissions.CREATE]?: boolean;
      [Permissions.UPDATE]?: boolean;
      [Permissions.READ]?: boolean;
    };
    [PermissionTypes.AGENTS]?: {
      [Permissions.USE]?: boolean;
      [Permissions.CREATE]?: boolean;
      [Permissions.SHARE]?: boolean;
      [Permissions.SHARE_PUBLIC]?: boolean;
    };
    [PermissionTypes.MULTI_CONVO]?: {
      [Permissions.USE]?: boolean;
    };
    [PermissionTypes.TEMPORARY_CHAT]?: {
      [Permissions.USE]?: boolean;
    };
    [PermissionTypes.RUN_CODE]?: {
      [Permissions.USE]?: boolean;
    };
    [PermissionTypes.WEB_SEARCH]?: {
      [Permissions.USE]?: boolean;
    };
    [PermissionTypes.PEOPLE_PICKER]?: {
      [Permissions.VIEW_USERS]?: boolean;
      [Permissions.VIEW_GROUPS]?: boolean;
      [Permissions.VIEW_ROLES]?: boolean;
    };
    [PermissionTypes.MARKETPLACE]?: {
      [Permissions.USE]?: boolean;
    };
    [PermissionTypes.FILE_SEARCH]?: {
      [Permissions.USE]?: boolean;
    };
    [PermissionTypes.FILE_CITATIONS]?: {
      [Permissions.USE]?: boolean;
    };
    [PermissionTypes.MCP_SERVERS]?: {
      [Permissions.USE]?: boolean;
      [Permissions.CREATE]?: boolean;
      [Permissions.SHARE]?: boolean;
      [Permissions.SHARE_PUBLIC]?: boolean;
    };
    [PermissionTypes.REMOTE_AGENTS]?: {
      [Permissions.USE]?: boolean;
      [Permissions.CREATE]?: boolean;
      [Permissions.SHARE]?: boolean;
      [Permissions.SHARE_PUBLIC]?: boolean;
    };
    [PermissionTypes.SKILLS]?: {
      [Permissions.USE]?: boolean;
      [Permissions.CREATE]?: boolean;
      [Permissions.SHARE]?: boolean;
      [Permissions.SHARE_PUBLIC]?: boolean;
    };
    [PermissionTypes.SHARED_LINKS]?: {
      [Permissions.CREATE]?: boolean;
      [Permissions.SHARE]?: boolean;
      [Permissions.SHARE_PUBLIC]?: boolean;
    };
  };
  tenantId?: string;
}
type RolePermissions = IRole["permissions"];
type RolePermissionsInput = DeepPartial<RolePermissions>;
interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: RolePermissionsInput;
}
interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: RolePermissionsInput;
}
interface RoleFilterOptions extends CursorPaginationParams {
  search?: string;
  hasPermission?: string;
}
//#endregion
//#region src/types/action.d.ts
interface IAction extends Document {
  user: mongoose.Types.ObjectId;
  action_id: string;
  type: string;
  settings?: unknown;
  agent_id?: string;
  assistant_id?: string;
  metadata: {
    api_key?: string;
    auth: {
      authorization_type?: string;
      custom_auth_header?: string;
      type: "service_http" | "oauth" | "none";
      authorization_content_type?: string;
      authorization_url?: string;
      client_url?: string;
      scope?: string;
      token_exchange_method: "default_post" | "basic_auth_header" | null;
    };
    domain: string;
    privacy_policy_url?: string;
    raw_spec?: string;
    oauth_client_id?: string;
    oauth_client_secret?: string;
  };
  tenantId?: string;
}
//#endregion
//#region src/types/assistant.d.ts
interface IAssistant extends Document {
  user: Types.ObjectId;
  assistant_id: string;
  avatar?: {
    filepath: string;
    source: string;
  };
  conversation_starters?: string[];
  access_level?: number;
  file_ids?: string[];
  actions?: string[];
  append_current_datetime?: boolean;
  tenantId?: string;
}
//#endregion
//#region src/types/file.d.ts
interface IMongoFile extends Omit<Document, "model"> {
  user: Types.ObjectId;
  conversationId?: string;
  messageId?: string;
  file_id: string;
  temp_file_id?: string;
  bytes: number;
  text?: string;
  /**
  * Format of the `text` field — `'html'` when the backend produced
  * a sanitized full-document HTML preview (e.g. office types via
  * `bufferToOfficeHtml`), `'text'` for plain-text extracts (e.g.
  * RAG mammoth/pdf-parse output), `undefined` for legacy records
  * that pre-date the field. Clients MUST treat `undefined` as
  * `'text'` and refuse to inject the value into HTML contexts —
  * otherwise plain document text containing `<script>` tags would
  * become executable markup. See Codex P1 review on PR #12934.
  */
  textFormat?: "html" | "text";
  /**
  * Lifecycle of the inline preview rendered from `text`. Tracks the
  * deferred-preview code-execution flow (PR #12951 follow-up): the
  * immediate persist step saves the file blob and emits the attachment
  * record with `status: 'pending'`; a background render runs HTML
  * extraction and updates the record to `'ready'` (with `text` +
  * `textFormat`) or `'failed'` (with `previewError`). Decouples the
  * agent's final response from CPU-heavy office-format rendering.
  *
  * Absent for legacy records and for files that never expect a preview
  * (RAG uploads, images, plain-text artifacts). Clients MUST treat
  * `undefined` as `'ready'` so prior-version records render normally.
  */
  status?: "pending" | "ready" | "failed";
  /**
  * Short machine-readable reason when `status === 'failed'` —
  * `'timeout'`, `'parser-error'`, `'oversized'`, `'orphaned'`. UI hint
  * for tooltip text; not user-facing prose. Absent otherwise.
  */
  previewError?: string;
  /**
  * Generation marker for the deferred-preview lifecycle. The
  * immediate persist step stamps a fresh UUID on every emit; the
  * deferred render's update only commits when the marker still
  * matches. Guards against an older render overwriting a newer
  * record on cross-turn filename reuse. Absent for legacy records
  * and for files that never expect a preview.
  */
  previewRevision?: string;
  filename: string;
  filepath: string;
  storageKey?: string;
  storageRegion?: string;
  object: "file";
  embedded?: boolean;
  type: string;
  context?: string;
  usage: number;
  source: string;
  model?: string;
  width?: number;
  height?: number;
  metadata?: {
    /**
    * Code-environment cache pointer for files re-uploadable to
    * codeapi (chat attachments, agent tool resources, code-output
    * files). Carries the resource kind + identity so codeapi can
    * derive the sessionKey explicitly.
    */
    codeEnvRef?: CodeEnvRef;
  };
  expiresAt?: Date;
  expiredAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
//#endregion
//#region src/types/share.d.ts
/**
* Immutable snapshot of a file referenced by a shared chat snapshot. Captured at
* share create/update so shared-link viewers can preview/download the file through
* the share-scoped routes without consulting the original owner's live file ACL.
* References the original stored object (no byte copy); only the metadata needed to
* stream/preview is duplicated.
*/
interface SharedFileSnapshot {
  file_id: string;
  source?: string;
  storageKey?: string;
  filepath?: string;
  type?: string;
  filename?: string;
  bytes?: number;
  width?: number;
  height?: number;
  model?: string;
  /** Deferred-preview generation marker captured at share time. The share routes
  * refuse to serve when the live file's revision no longer matches (the file_id
  * was reused/overwritten by a later turn), so a link can't surface post-share
  * content. */
  previewRevision?: string;
  tenantId?: string;
}
interface ISharedLink {
  _id?: Types.ObjectId;
  conversationId: string;
  title?: string;
  user?: string;
  messages?: Types.ObjectId[];
  shareId?: string;
  targetMessageId?: string;
  expiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  /** Owning tenant for multi-tenant deployments (read by the shared-link access middleware). */
  tenantId?: string;
  /**
  * Per-link choice of whether the conversation's files are included in the share
  * (the "share files" checkbox). `false` means the viewer sees no files; absent
  * means a legacy link (treated as included). Distinct from `fileSnapshots` so an
  * opt-out is never mistaken for a not-yet-backfilled legacy link.
  */
  snapshotFiles?: boolean;
  /** Per-share file snapshot referenced by the share-scoped file routes. */
  fileSnapshots?: SharedFileSnapshot[];
}
interface ShareServiceError extends Error {
  code: string;
}
/**
* A file or attachment as exposed through a public shared link: storage- and
* identity-internal fields are stripped, but render-relevant data (including
* dynamic tool-call payloads keyed by tool name) is preserved.
*/
type SharedFile = Record<string, unknown>;
/**
* Public, anonymized projection of a message returned by a shared link. Only
* render-relevant fields are surfaced; internal fields (user, endpoint,
* conversationSignature, clientId, plugin(s), metadata, etc.) are omitted.
*/
type SharedMessage = Pick<IMessage, "messageId" | "parentMessageId" | "conversationId" | "sender" | "text" | "content" | "iconURL" | "isCreatedByUser" | "createdAt" | "updatedAt" | "tokenCount" | "unfinished" | "error" | "finish_reason" | "manualSkills" | "alwaysAppliedSkills" | "quotes"> & {
  model?: string;
  files?: SharedFile[];
  attachments?: SharedFile[];
};
interface SharedLinksResult {
  links: Array<{
    shareId: string;
    title: string;
    createdAt: Date;
    conversationId: string;
  }>;
  nextCursor?: Date;
  hasNextPage: boolean;
}
interface SharedMessagesResult {
  conversationId: string;
  messages: Array<SharedMessage>;
  shareId: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface CreateShareResult {
  _id?: string;
  shareId: string;
  conversationId: string;
  targetMessageId?: string;
}
interface UpdateShareResult {
  _id?: string;
  shareId: string;
  conversationId: string;
  targetMessageId?: string;
}
interface DeleteShareResult {
  _id?: string;
  success: boolean;
  shareId: string;
  message: string;
}
interface GetShareLinkResult {
  _id?: string;
  shareId: string | null;
  targetMessageId?: string;
  snapshotFiles?: boolean;
  success: boolean;
}
interface DeleteAllSharesResult {
  message: string;
  deletedCount: number;
}
//#endregion
//#region src/types/pluginAuth.d.ts
interface IPluginAuth extends Document {
  authField: string;
  value: string;
  userId: string;
  pluginKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
interface PluginAuthQuery {
  userId: string;
  authField?: string;
  pluginKey?: string;
}
interface FindPluginAuthParams {
  userId: string;
  authField: string;
  pluginKey?: string;
}
interface FindPluginAuthsByKeysParams {
  userId: string;
  pluginKeys: string[];
}
interface UpdatePluginAuthParams {
  userId: string;
  authField: string;
  pluginKey: string;
  value: string;
}
interface DeletePluginAuthParams {
  userId: string;
  authField?: string;
  pluginKey?: string;
  all?: boolean;
}
//#endregion
//#region src/types/memory.d.ts
interface IMemoryEntry extends Document {
  userId: Types.ObjectId;
  key: string;
  value: string;
  tokenCount?: number;
  updated_at?: Date;
  tenantId?: string;
}
interface IMemoryEntryLean {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  key: string;
  value: string;
  tokenCount?: number;
  updated_at?: Date;
  __v?: number;
}
interface SetMemoryParams {
  userId: string | Types.ObjectId;
  key: string;
  value: string;
  tokenCount?: number;
}
interface DeleteMemoryParams {
  userId: string | Types.ObjectId;
  key: string;
}
interface GetFormattedMemoriesParams {
  userId: string | Types.ObjectId;
}
interface MemoryResult {
  ok: boolean;
}
interface FormattedMemoriesResult {
  withKeys: string;
  withoutKeys: string;
  totalTokens?: number;
}
//#endregion
//#region src/types/prompts.d.ts
interface IPrompt extends Document {
  groupId: Types.ObjectId;
  author: Types.ObjectId;
  prompt: string;
  type: "text" | "chat";
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
interface IPromptGroup {
  name: string;
  numberOfGenerations: number;
  oneliner: string;
  category: string;
  productionId: Types.ObjectId;
  author: Types.ObjectId;
  authorName: string;
  command?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublic?: boolean;
  tenantId?: string;
}
interface IPromptGroupDocument extends IPromptGroup, Document {}
//#endregion
//#region src/types/skill.d.ts
/**
* Skill — the single source of truth for a LibreChat skill.
* Each document is the full SKILL.md body plus structured frontmatter and metadata.
* The `version` field is an integer monotonic counter used for optimistic concurrency.
*/
interface ISkill {
  /**
  * Machine-readable kebab-case identifier. This is what Claude sees in the
  * system-prompt skill manifest and what slash-command integrations key off.
  * Unique per `(author, tenantId)`. Must be stable across edits — a rename
  * invalidates any external reference to the skill.
  */
  name: string;
  /**
  * Human-readable label shown only in the LibreChat UI (skill list, detail
  * header, sharing dialogs). NOT sent to Claude and NOT part of the trigger
  * path — `name` + `description` drive triggering. Purely cosmetic: lets an
  * author keep a stable kebab-case `name` while showing something prettier
  * in the UI.
  */
  displayTitle?: string;
  /**
  * "When to use this skill" sentence. This is the highest-leverage field for
  * Claude's triggering decision — vague or missing descriptions cause
  * undertriggering. Denormalized from the YAML frontmatter onto its own
  * column so listings can filter/sort on it without loading `body`.
  */
  description: string;
  /** The SKILL.md body (markdown after the YAML frontmatter). */
  body: string;
  /**
  * Structured YAML frontmatter (excluding `name` and `description`, which live as
  * top-level columns). Stored as Mongoose Mixed so callers can extend without schema
  * churn; validated in strict mode via `validateSkillFrontmatter` — unknown keys
  * are rejected so expanding the allowed set is an intentional code change.
  */
  frontmatter: Record<string, unknown>;
  /**
  * Mirrors the `disable-model-invocation` frontmatter field. `true` removes
  * the skill from the model's catalog and rejects model-side `skill` tool
  * calls; manual `$` invocation is unaffected. Defaults to `false`.
  */
  disableModelInvocation?: boolean;
  /**
  * Mirrors the `user-invocable` frontmatter field. `false` hides the skill
  * from the `$` popover and rejects manual invocation. Defaults to `true`.
  */
  userInvocable?: boolean;
  /**
  * Skill-declared tool allowlist (mirrors the `allowed-tools` frontmatter
  * field). When the skill is invoked **manually** (via `$` popover, or
  * always-apply once Phase 5 lands), these tools are unioned into the
  * agent's effective tool set for the turn. Tolerant of unknown names —
  * the runtime intersects against the loaded tool registry and silently
  * drops anything missing, so cross-ecosystem skills authored against
  * unimplemented tools import without breaking.
  *
  * Note: model-invoked skills (via the `skill` tool mid-turn) do NOT
  * trigger tool union at execution time — adding tools after the graph
  * has started would require a rebuild. Agents that need a tool when
  * the model picks a skill should add it to `agent.tools` directly.
  */
  allowedTools?: string[];
  category?: string;
  author: Types.ObjectId;
  authorName: string;
  version: number;
  /**
  * Provenance of this skill's canonical definition.
  * - `inline` — authored inside LibreChat.
  * - `github` — mirrored from a configured GitHub skill sync source.
  * - `notion` — reserved for future external sync integrations.
  */
  source: "inline" | "github" | "notion";
  /**
  * Provenance payload keyed by `source`, including upstream identifiers
  * such as GitHub source id, path, and commit/blob SHAs.
  */
  sourceMetadata?: Record<string, unknown>;
  /** Denormalized count of associated `SkillFile` rows. Kept in sync by skill methods. */
  fileCount: number;
  /**
  * When `true`, the skill is auto-primed into every turn — no user `$`
  * invocation or model discretion required. Mirrors the `always-apply` YAML
  * frontmatter field; indexed so the per-turn "always-apply" query stays
  * cheap as the catalog grows.
  */
  alwaysApply: boolean;
  tenantId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  /** Computed from ACL at read time, never persisted. */
  isPublic?: boolean;
}
interface ISkillDocument extends ISkill, Document {}
/**
* Lean summary projection returned by `listSkillsByAccess`. The list query
* uses a narrow `.select()` that omits `body` and `frontmatter` to keep
* payloads small, so those fields are truthfully absent on summary rows.
*/
type ISkillSummary = Omit<ISkill, "body" | "frontmatter">;
/**
* SkillFile — metadata for a file bundled inside a skill.
* Blob content lives in the existing file storage layer (local/S3/etc.) and is
* addressed via `source` + `filepath` + `file_id` (mirroring the File schema).
* `(skillId, relativePath)` is unique per skill.
*/
interface ISkillFile {
  skillId: Types.ObjectId;
  relativePath: string;
  file_id: string;
  filename: string;
  filepath: string;
  storageKey?: string;
  storageRegion?: string;
  source: string;
  sourceMetadata?: Record<string, unknown>;
  mimeType: string;
  bytes: number;
  category: "script" | "reference" | "asset" | "other";
  isExecutable: boolean;
  author: Types.ObjectId;
  tenantId?: string;
  /** Lazily cached text content (≤ 512 KB). Populated on first read; cleared on re-upload. */
  content?: string;
  /** Set on first read. `true` prevents repeated storage reads for non-text files. */
  isBinary?: boolean;
  /**
  * Code-environment cache pointer. Set after uploading the file to
  * codeapi, used to check freshness on subsequent primes. Cleared
  * when the skill file is re-uploaded to storage.
  */
  codeEnvRef?: CodeEnvRef;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ISkillFileDocument extends ISkillFile, Document {}
//#endregion
//#region src/types/skillSync.d.ts
type SkillSyncProvider = "github";
type SkillSyncRunStatus = "idle" | "running" | "succeeded" | "failed" | "skipped";
interface ISkillSyncCredential {
  provider: SkillSyncProvider;
  credentialKey: string;
  encryptedToken: string;
  tokenHash: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ISkillSyncCredentialDocument extends ISkillSyncCredential, Document {}
interface ISkillSyncStatus {
  provider: SkillSyncProvider;
  sourceId: string;
  tenantId?: string;
  status: SkillSyncRunStatus;
  credentialKey?: string;
  owner?: string;
  repo?: string;
  ref?: string;
  paths?: string[];
  startedAt?: Date;
  finishedAt?: Date;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
  errorCode?: string;
  errorMessage?: string;
  syncedSkillCount: number;
  syncedFileCount: number;
  deletedSkillCount: number;
  deletedFileCount: number;
  lockOwner?: string;
  lockExpiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ISkillSyncStatusDocument extends ISkillSyncStatus, Document {}
//#endregion
//#region src/types/accessRole.d.ts
type AccessRole = {
  /** e.g., "agent_viewer", "agent_editor" */accessRoleId: string; /** e.g., "Viewer", "Editor" */
  name: string;
  description?: string; /** e.g., 'agent', 'project', 'file' */
  resourceType: string; /** e.g., 1 for read, 3 for read+write */
  permBits: number;
  tenantId?: string;
};
type IAccessRole = AccessRole & Document & {
  _id: Types.ObjectId;
};
//#endregion
//#region src/types/aclEntry.d.ts
type AclEntry = {
  /** The type of principal (PrincipalType.USER, PrincipalType.GROUP, PrincipalType.PUBLIC) */principalType: PrincipalType; /** The ID of the principal (null for PrincipalType.PUBLIC, string for PrincipalType.ROLE) */
  principalId?: Types.ObjectId | string; /** The model name for the principal (`PrincipalModel`) */
  principalModel?: PrincipalModel; /** The type of resource (`ResourceType`) */
  resourceType: ResourceType; /** The ID of the resource */
  resourceId: Types.ObjectId; /** Permission bits for this entry */
  permBits: number; /** Optional role ID for predefined roles */
  roleId?: Types.ObjectId; /** ID of the resource this permission is inherited from */
  inheritedFrom?: Types.ObjectId; /** ID of the user who granted this permission */
  grantedBy?: Types.ObjectId; /** When this permission was granted */
  grantedAt?: Date; /** Optional expiration date for permissions tied to expiring resources */
  expiredAt?: Date;
  tenantId?: string;
};
type IAclEntry = AclEntry & Document & {
  _id: Types.ObjectId;
};
//#endregion
//#region src/types/systemGrant.d.ts
type SystemGrant = {
  /** The type of principal — matches PrincipalType enum values */principalType: PrincipalType; /** ObjectId string for user/group, role name string for role */
  principalId: string | Types.ObjectId; /** The capability being granted */
  capability: SystemCapability; /** Absent = platform-operator, present = tenant-scoped */
  tenantId?: string; /** ID of the user who granted this capability */
  grantedBy?: Types.ObjectId; /** When this capability was granted */
  grantedAt?: Date; /** Reserved for future TTL enforcement — time-bounded / temporary grants. */
  expiresAt?: Date;
};
type ISystemGrant = SystemGrant & Document & {
  _id: Types.ObjectId;
};
//#endregion
//#region src/types/auditLog.d.ts
/**
* AuditLog is an append-only, hash-chained compliance record. Enforcement lives
* in `~/schema/auditLog` (immutable fields, pre-update/delete/save hooks) and in
* `~/methods/auditLog` (per-chain hash linking + a unique `{ chainKey, seq }`
* index that serializes concurrent appends). `createdAt` is set explicitly by
* the writer so it is covered by the entry hash.
*/
type AuditLog = {
  /** Record-format version, so future migrations can interpret older rows. */schemaVersion: number;
  category: AuditCategory;
  action: AuditAction;
  outcome: AuditOutcome;
  severity: AuditSeverity;
  actor: AuditActor;
  target: AuditTarget;
  metadata?: AuditMetadata;
  context?: AuditContext; /** Absent = platform-level entry; present = tenant-scoped entry. */
  tenantId?: string;
  /**
  * Always present; equals `tenantId` or the platform sentinel. The hash chain
  * and keyset pagination are scoped to this key, and `{ chainKey, seq }` is the
  * unique index that serializes appends.
  */
  chainKey: string; /** Monotonic per-chain sequence number (1-based). */
  seq: number; /** Hash of the previous entry in the chain; genesis links to the zero hash. */
  prevHash: string; /** SHA-256 over this entry's canonical content (including `seq` and `prevHash`). */
  hash: string;
  createdAt: Date;
};
type IAuditLog = AuditLog & Document & {
  _id: Types.ObjectId;
};
/** Actor as accepted by writers; `id` may be an ObjectId for convenience. */
interface AuditActorInput {
  type: AuditActorType;
  id?: string | Types.ObjectId;
  name: string;
}
/** Target as accepted by writers; `id` may be an ObjectId for convenience. */
interface AuditTargetInput {
  type: string;
  id?: string | Types.ObjectId;
  name?: string;
}
interface RecordAuditEntryInput {
  action: AuditAction;
  /** Derived from `action` when omitted. */
  category?: AuditCategory;
  /** Defaults to `'success'`. */
  outcome?: AuditOutcome;
  /** Defaults to `'warning'` for `failure`/`denied`, else `'info'`. */
  severity?: AuditSeverity;
  actor: AuditActorInput;
  target: AuditTargetInput;
  metadata?: AuditMetadata;
  context?: AuditContext;
  tenantId?: string;
}
/** Options that shape a single audit write. */
interface RecordAuditEntryOptions {
  /**
  * When true, a failed write throws instead of resolving to `null`. Callers
  * that must not proceed without a durable audit record opt in here; the
  * default is fail-open so audit emission never blocks a privileged operation.
  */
  failClosed?: boolean;
}
interface AuditLogFilters {
  search?: string;
  category?: AuditCategory[];
  action?: AuditAction[];
  outcome?: AuditOutcome[];
  severity?: AuditSeverity[];
  /** Exact match on `actor.type`. */
  actorType?: AuditActorType;
  /** Case-insensitive substring match against the denormalized `actor.name`. */
  actorQuery?: string;
  /** Exact match on `target.type`. */
  targetType?: string;
  /** Case-insensitive substring match against the denormalized `target.name`. */
  targetQuery?: string;
  /** Case-insensitive substring match against `metadata.capability`. */
  capability?: string;
  from?: Date;
  to?: Date;
  /** Offset pagination (legacy / random-access). Prefer `cursor`. */
  offset?: number;
  limit?: number;
  /**
  * Keyset cursor: the `seq` of the last entry from the previous page. Results
  * are newest-first, so the next page is `seq < cursor`. Stable under
  * concurrent appends, unlike `offset`.
  */
  cursor?: number;
}
interface AuditLogPage {
  entries: AdminAuditLogEntry[];
  total: number;
  /** Pass as `cursor` to fetch the next page; `null` when the page is the last. */
  nextCursor: number | null;
}
/** Outcome of verifying a chain's tamper-evidence. */
interface AuditChainVerification {
  ok: boolean;
  chainKey: string;
  /** Number of entries inspected. */
  checked: number;
  /** First `seq` where the chain broke (gap, broken link, or hash mismatch). */
  brokenAt?: number;
  reason?: string;
  /** Earliest/latest `seq` present. `firstSeq > 1` indicates a purged prefix. */
  range?: {
    firstSeq: number;
    lastSeq: number;
  };
}
interface PurgeAuditLogOptions {
  /** Delete entries strictly older than this instant (a contiguous prefix). */
  before: Date;
  /** Required safety latch; the purge is a no-op unless explicitly confirmed. */
  confirm: boolean;
}
/** A trusted boundary marker proving a prefix was purged by an authorized
* retention run rather than deleted by an attacker. Persisted by the caller
* (e.g. alongside retention-job records) and passed back to `verifyAuditChain`. */
interface AuditCheckpoint {
  /** Highest `seq` that was purged; the chain resumes at `throughSeq + 1`. */
  throughSeq: number;
  /** Hash of the last purged entry === `prevHash` of the new earliest entry. */
  prevHash: string;
}
interface PurgeAuditLogResult {
  deletedCount: number;
  /** The boundary the verifier must be given to accept the now-shorter chain.
  * Absent when the chain is now empty or nothing was purged. */
  checkpoint?: AuditCheckpoint;
}
interface VerifyAuditChainOptions {
  /** Stop verification early when the caller has gone away. */
  isCancelled?: () => boolean;
  /** Maximum rows to inspect before returning a bounded, non-OK result. */
  maxRows?: number;
  /** When the chain no longer starts at `seq: 1` (a prefix was purged), the
  * verifier requires this boundary to distinguish an authorized retention purge
  * from an attacker deleting the oldest rows. Without it, a non-genesis start
  * fails verification rather than being silently trusted. */
  trustedCheckpoint?: AuditCheckpoint;
}
//#endregion
//#region src/types/group.d.ts
interface IGroup extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  email?: string;
  avatar?: string;
  /** Array of member IDs (stores idOnTheSource values, not ObjectIds) */
  memberIds?: string[];
  source: "local" | "entra";
  /** External ID (e.g., Entra ID) - required for non-local sources */
  idOnTheSource?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
interface CreateGroupRequest {
  name: string;
  description?: string;
  email?: string;
  avatar?: string;
  memberIds?: string[];
  source: "local" | "entra";
  idOnTheSource?: string;
}
interface UpdateGroupRequest {
  name?: string;
  description?: string;
  email?: string;
  avatar?: string;
  memberIds?: string[];
  source?: "local" | "entra" | "ldap";
  idOnTheSource?: string;
}
interface GroupFilterOptions extends CursorPaginationParams {
  search?: string;
  source?: "local" | "entra" | "ldap";
  hasMember?: string;
}
//#endregion
//#region src/types/config.d.ts
/**
* Configuration override for a principal (user, group, or role).
* Stores partial overrides at the TCustomConfig (YAML) level,
* which are merged with the base config before processing through AppService.
*/
type Config = {
  /** The type of principal (user, group, role) */principalType: PrincipalType; /** The ID of the principal (ObjectId for users/groups, string for roles) */
  principalId: Types.ObjectId | string; /** The model name for the principal */
  principalModel: PrincipalModel; /** Priority level for determining merge order (higher = more specific) */
  priority: number; /** Configuration overrides matching librechat.yaml structure */
  overrides: Partial<TCustomConfig>; /** Dot-paths that suppress inherited config values during resolution */
  tombstones?: string[]; /** Whether this config override is currently active */
  isActive: boolean; /** Version number for cache invalidation, auto-increments on overrides change */
  configVersion: number; /** Tenant identifier for multi-tenancy isolation */
  tenantId?: string; /** When this config was created */
  createdAt?: Date; /** When this config was last updated */
  updatedAt?: Date;
};
type IConfig = Config & Document & {
  _id: Types.ObjectId;
};
//#endregion
//#region src/types/mcp.d.ts
/**
* Mongoose document interface for MCP Server
* Extends API interface with Mongoose-specific database fields
*/
interface MCPServerDocument extends Omit<MCPServerDB, "author" | "_id">, Document<Types.ObjectId> {
  author: Types.ObjectId;
  tenantId?: string;
}
//#endregion
//#region src/types/index.d.ts
type ObjectId = Types.ObjectId;
//#endregion
//#region src/app/resolution.d.ts
/**
* Merge DB config overrides into a base AppConfig.
*
* Configs are sorted by priority ascending (lowest first, highest wins).
* Each config's `overrides` is deep-merged into the base config in order.
*/
declare function mergeConfigOverrides(baseConfig: AppConfig, configs: IConfig[]): AppConfig;
//#endregion
//#region src/crypto/index.d.ts
declare function signPayload({
  payload,
  secret,
  expirationTime
}: SignPayloadParams): Promise<string>;
declare function hashToken(str: string): Promise<string>;
/** --- Legacy v1/v2 Setup: AES-CBC with fixed key and IV --- */
/**
* Encrypts a value using AES-CBC
* @param value - The plaintext to encrypt
* @returns The encrypted string in hex format
*/
declare function encrypt(value: string): Promise<string>;
/**
* Decrypts an encrypted value using AES-CBC
* @param encryptedValue - The encrypted string in hex format
* @returns The decrypted plaintext
*/
declare function decrypt(encryptedValue: string): Promise<string>;
/** --- v2: AES-CBC with a random IV per encryption --- */
/**
* Encrypts a value using AES-CBC with a random IV per encryption
* @param value - The plaintext to encrypt
* @returns The encrypted string with IV prepended (iv:ciphertext format)
*/
declare function encryptV2(value: string): Promise<string>;
/**
* Decrypts an encrypted value using AES-CBC with random IV
* @param encryptedValue - The encrypted string in iv:ciphertext format
* @returns The decrypted plaintext
*/
declare function decryptV2(encryptedValue: string): Promise<string>;
/**
* Encrypts a value using AES-256-CTR.
* Note: AES-256 requires a 32-byte key. Ensure that process.env.CREDS_KEY is a 64-character hex string.
* @param value - The plaintext to encrypt.
* @returns The encrypted string with a "v3:" prefix.
*/
declare function encryptV3(value: string): string;
/**
* Decrypts an encrypted value using AES-256-CTR.
* @param encryptedValue - The encrypted string with "v3:" prefix.
* @returns The decrypted plaintext.
*/
declare function decryptV3(encryptedValue: string): string;
/**
* Generates random values as a hex string
* @param length - The number of random bytes to generate
* @returns The random values as a hex string
*/
declare function getRandomValues(length: number): Promise<string>;
/**
* Computes SHA-256 hash for the given input.
* @param input - The input to hash.
* @returns The SHA-256 hash of the input.
*/
declare function hashBackupCode(input: string): Promise<string>;
//#endregion
//#region src/schema/action.d.ts
declare const Action: mongoose.Schema<IAction>;
//#endregion
//#region src/schema/agent.d.ts
declare const agentSchema: Schema<IAgent>;
//#endregion
//#region src/schema/agentApiKey.d.ts
interface IAgentApiKey$1 extends Document {
  userId: Types.ObjectId;
  name: string;
  keyHash: string;
  keyPrefix: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tenantId?: string;
}
declare const agentApiKeySchema: Schema<IAgentApiKey$1>;
//#endregion
//#region src/schema/agentCategory.d.ts
declare const agentCategorySchema: Schema<IAgentCategory>;
//#endregion
//#region src/schema/assistant.d.ts
declare const assistantSchema: Schema<IAssistant>;
//#endregion
//#region src/schema/balance.d.ts
declare const balanceSchema: Schema<IBalance>;
//#endregion
//#region src/schema/banner.d.ts
interface IBanner$1 extends Document {
  bannerId: string;
  message: string;
  displayFrom: Date;
  displayTo?: Date;
  type: "banner" | "popup";
  isPublic: boolean;
  persistable: boolean;
  tenantId?: string;
}
declare const bannerSchema: Schema<IBanner$1>;
//#endregion
//#region src/schema/categories.d.ts
interface ICategory extends Document {
  label: string;
  value: string;
  tenantId?: string;
}
declare const categoriesSchema: Schema<ICategory>;
//#endregion
//#region src/schema/chatProject.d.ts
declare const chatProjectSchema: Schema<IChatProjectDocument>;
//#endregion
//#region src/schema/conversationTag.d.ts
interface IConversationTag extends Document {
  tag?: string;
  user?: string;
  description?: string;
  count?: number;
  position?: number;
  tenantId?: string;
}
declare const conversationTag: Schema<IConversationTag>;
//#endregion
//#region src/schema/convo.d.ts
declare const convoSchema: Schema<IConversation>;
//#endregion
//#region src/schema/file.d.ts
declare const file: Schema<IMongoFile>;
//#endregion
//#region src/schema/key.d.ts
interface IKey extends Document {
  userId: Types.ObjectId;
  name: string;
  value: string;
  expiresAt?: Date;
  tenantId?: string;
}
declare const keySchema: Schema<IKey>;
//#endregion
//#region src/schema/message.d.ts
declare const messageSchema: Schema<IMessage>;
//#endregion
//#region src/schema/pluginAuth.d.ts
declare const pluginAuthSchema: Schema<IPluginAuth>;
//#endregion
//#region src/schema/preset.d.ts
interface IPreset$1 extends Document {
  presetId: string;
  title: string;
  user: string | null;
  defaultPreset?: boolean;
  order?: number;
  endpoint?: string;
  endpointType?: string;
  model?: string;
  region?: string;
  chatGptLabel?: string;
  examples?: unknown[];
  modelLabel?: string;
  promptPrefix?: string;
  temperature?: number;
  top_p?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  maxTokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  file_ids?: string[];
  resendImages?: boolean;
  promptCache?: boolean;
  promptCacheTtl?: "5m" | "1h";
  thinking?: boolean;
  thinkingBudget?: number;
  effort?: string;
  system?: string;
  resendFiles?: boolean;
  imageDetail?: string;
  agent_id?: string;
  assistant_id?: string;
  instructions?: string;
  stop?: string[];
  isArchived?: boolean;
  iconURL?: string;
  greeting?: string;
  spec?: string;
  tags?: string[];
  tools?: string[];
  maxContextTokens?: number;
  max_tokens?: number;
  reasoning_effort?: string;
  reasoning_summary?: string;
  verbosity?: string;
  useResponsesApi?: boolean;
  web_search?: boolean;
  url_context?: boolean;
  disableStreaming?: boolean;
  fileTokenLimit?: number;
  tenantId?: string;
}
declare const presetSchema: Schema<IPreset$1>;
//#endregion
//#region src/schema/prompt.d.ts
declare const promptSchema: Schema<IPrompt>;
//#endregion
//#region src/schema/promptGroup.d.ts
declare const promptGroupSchema: Schema<IPromptGroupDocument>;
//#endregion
//#region src/schema/role.d.ts
declare const roleSchema: Schema<IRole>;
//#endregion
//#region src/schema/session.d.ts
declare const sessionSchema: Schema<ISession>;
//#endregion
//#region src/schema/share.d.ts
interface ISharedLink$1 extends Document {
  conversationId: string;
  title?: string;
  user?: string;
  messages?: Types.ObjectId[];
  shareId?: string;
  targetMessageId?: string;
  expiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
  snapshotFiles?: boolean;
  fileSnapshots?: SharedFileSnapshot[];
}
declare const shareSchema: Schema<ISharedLink$1>;
//#endregion
//#region src/schema/skillSyncCredential.d.ts
declare const skillSyncCredentialSchema: Schema<ISkillSyncCredentialDocument>;
//#endregion
//#region src/schema/skillSyncStatus.d.ts
declare const skillSyncStatusSchema: Schema<ISkillSyncStatusDocument>;
//#endregion
//#region src/schema/token.d.ts
declare const tokenSchema: Schema<IToken>;
//#endregion
//#region src/schema/toolCall.d.ts
interface IToolCallData$1 extends Document {
  conversationId: string;
  messageId: string;
  toolId: string;
  user: Types.ObjectId;
  result?: unknown;
  attachments?: TAttachment[];
  blockIndex?: number;
  partIndex?: number;
  expiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
declare const toolCallSchema: Schema<IToolCallData$1>;
//#endregion
//#region src/schema/transaction.d.ts
interface ITransaction extends Document {
  user: Types.ObjectId;
  conversationId?: string;
  tokenType: "prompt" | "completion" | "credits";
  model?: string;
  context?: string;
  valueKey?: string;
  rate?: number;
  rawAmount?: number;
  tokenValue?: number;
  inputTokens?: number;
  writeTokens?: number;
  readTokens?: number;
  messageId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
}
declare const transactionSchema: Schema<ITransaction>;
//#endregion
//#region src/schema/user.d.ts
declare const userSchema: Schema<IUser>;
//#endregion
//#region src/schema/memory.d.ts
declare const MemoryEntrySchema: Schema<IMemoryEntry>;
//#endregion
//#region src/schema/group.d.ts
declare const groupSchema: Schema<IGroup>;
//#endregion
//#region src/schema/systemGrant.d.ts
declare const systemGrantSchema: Schema<ISystemGrant>;
//#endregion
//#region src/schema/auditLog.d.ts
/** Sentinel `chainKey` for platform-level (non-tenant) audit entries. */
declare const PLATFORM_CHAIN_KEY = "__platform__";
/** Genesis link: the `prevHash` of the first entry in any chain. */
declare const GENESIS_HASH: string;
/**
* Append-only by schema contract: every field is `immutable`, every
* update-style operation is short-circuited in the pre-hooks below, and there
* is no `updatedAt` — a mutable timestamp would imply mutation is allowed.
* `createdAt` is set explicitly by the writer (not by `timestamps`) so it is
* covered by the per-entry hash. Tamper-evidence beyond these app-layer guards
* comes from the hash chain (`prevHash`/`hash`/`seq`) maintained in
* `~/methods/auditLog`.
*/
declare const auditLogSchema: Schema<IAuditLog>;
//#endregion
//#region src/schema/config.d.ts
declare const configSchema: Schema<IConfig>;
//#endregion
//#region src/utils/principal.d.ts
/**
* Normalizes a principalId to the correct type for MongoDB queries and storage.
* USER and GROUP principals are stored as ObjectIds; ROLE principals are strings.
* Ensures a string caller ID is cast to ObjectId so it matches documents written
* by `grantCapability` — which always stores user/group IDs as ObjectIds to match
* what `getUserPrincipals` returns.
*/
declare const normalizePrincipalId: (principalId: string | Types.ObjectId, principalType: PrincipalType) => string | Types.ObjectId;
//#endregion
//#region src/utils/string.d.ts
/**
* Escapes special regex characters in a string.
*/
declare function escapeRegExp(str: string): string;
//#endregion
//#region src/utils/tempChatRetention.d.ts
/**
* Default retention period for temporary chats in hours
*/
declare const DEFAULT_RETENTION_HOURS: number;
/**
* Minimum allowed retention period in hours
*/
declare const MIN_RETENTION_HOURS = 1;
/**
* Maximum allowed retention period in hours (1 year = 8760 hours)
*/
declare const MAX_RETENTION_HOURS = 8760;
/**
* Gets the temporary chat retention period from environment variables or config
* @param interfaceConfig - The custom configuration object
* @returns The retention period in hours
*/
declare function getTempChatRetentionHours(interfaceConfig?: AppConfig["interfaceConfig"] | null): number;
/**
* Creates an expiration date for temporary chats
* @param interfaceConfig - The custom configuration object
* @returns The expiration date
*/
declare function createTempChatExpirationDate(interfaceConfig?: AppConfig["interfaceConfig"]): Date;
//#endregion
//#region src/utils/retention.d.ts
type RetentionFilterDocument = {
  isTemporary?: boolean | null;
  expiredAt?: Date | null;
};
declare const activeExpirationFilter: <T extends RetentionFilterDocument = RetentionFilterDocument>() => FilterQuery<T>;
declare const legacyPermanentExpirationFilter: <T extends RetentionFilterDocument = RetentionFilterDocument>() => FilterQuery<T>;
declare const buildRetentionVisibilityFilter: <T extends RetentionFilterDocument = RetentionFilterDocument>() => FilterQuery<T>;
declare const createFallbackRetentionDate: (now?: number) => Date;
//#endregion
//#region src/utils/tenantBulkWrite.d.ts
/**
* Tenant-safe wrapper around Mongoose `Model.bulkWrite()`.
*
* Mongoose's `bulkWrite` does not trigger schema-level middleware hooks, so the
* `applyTenantIsolation` plugin cannot intercept it. This wrapper:
*
* 1. **Sanitizes** every update document by stripping `tenantId` unconditionally
*    (both top-level and inside `$set`/`$unset`/`$setOnInsert`/`$rename`).
* 2. **Injects** `tenantId` into operation filters and insert documents when a
*    tenant context is active.
*
* Unlike the Mongoose middleware guard (`sanitizeTenantIdMutation`), which throws
* on cross-tenant values, this wrapper strips silently. Throwing mid-batch would
* abort the entire write for one bad field; the filter injection already scopes
* every operation to the correct tenant.
*
* Behavior:
* - **tenantId present** (normal request): sanitize + inject into filters/documents.
* - **SYSTEM_TENANT_ID**: sanitize only, skip injection (cross-tenant system op).
* - **No tenantId + strict mode**: throws (fail-closed, same as the plugin).
* - **No tenantId + non-strict**: sanitize only, no injection (backward compat).
*/
declare function tenantSafeBulkWrite<T>(model: Model<T>, ops: AnyBulkWriteOperation[], options?: MongooseBulkWriteOptions): Promise<BulkWriteResult>;
//#endregion
//#region src/utils/transactions.d.ts
declare const CANCEL_RATE = 1.15;
/**
* Checks if the connected MongoDB deployment supports transactions
* This requires a MongoDB replica set configuration
*
* @returns True if transactions are supported, false otherwise
*/
declare const supportsTransactions: (mongoose: typeof import("mongoose")) => Promise<boolean>;
/**
* Gets whether the current MongoDB deployment supports transactions
* Caches the result for performance
*
* @returns True if transactions are supported, false otherwise
*/
declare const getTransactionSupport: (mongoose: typeof import("mongoose"), transactionSupportCache: boolean | null) => Promise<boolean>;
//#endregion
//#region src/utils/objectId.d.ts
/** Returns true when `id` is a 24-character hex string (MongoDB ObjectId format). */
declare const isValidObjectIdString: (id: string) => boolean;
//#endregion
//#region src/utils/yaml.d.ts
/**
* Strip a trailing YAML inline comment from an unquoted scalar.
* YAML treats ` # ...` (space before hash) as a comment; `#` without a
* preceding space is part of the value (e.g. `hashtag#foo`). A scalar
* that's entirely a comment (`# nothing yet`) collapses to empty so
* callers can treat it as "no value". Applied narrowly — only to
* boolean fields where the token is a single word — to avoid
* accidentally truncating free-form strings like descriptions that
* might legitimately contain `#`.
*/
declare function stripYamlTrailingComment(value: string): string;
//#endregion
//#region src/models/skillSyncCredential.d.ts
declare function createSkillSyncCredentialModel(mongoose: typeof import("mongoose")): Model<ISkillSyncCredentialDocument>;
//#endregion
//#region src/models/skillSyncStatus.d.ts
declare function createSkillSyncStatusModel(mongoose: typeof import("mongoose")): Model<ISkillSyncStatusDocument>;
//#endregion
//#region src/models/conversationTag.d.ts
declare function createConversationTagModel(mongoose: typeof import("mongoose")): Model<IConversationTag>;
//#endregion
//#region src/models/agentCategory.d.ts
declare function createAgentCategoryModel(mongoose: typeof import("mongoose")): Model<IAgentCategory>;
//#endregion
//#region src/models/chatProject.d.ts
declare function createChatProjectModel(mongoose: typeof import("mongoose")): Model<IChatProjectDocument>;
//#endregion
//#region src/models/agentApiKey.d.ts
declare function createAgentApiKeyModel(mongoose: typeof import("mongoose")): Model<IAgentApiKey$1>;
//#endregion
//#region src/models/transaction.d.ts
declare function createTransactionModel(mongoose: typeof import("mongoose")): Model<ITransaction>;
//#endregion
//#region src/models/promptGroup.d.ts
declare function createPromptGroupModel(mongoose: typeof import("mongoose")): Model<IPromptGroupDocument>;
//#endregion
//#region src/models/systemGrant.d.ts
/**
* SystemGrant is a cross-tenant control plane — its query logic in systemGrant methods
* explicitly handles tenantId conditions (platform-level vs tenant-scoped grants).
* Do NOT apply tenant isolation plugin here; it would inject a hard tenantId equality
* filter that conflicts with the $and/$or logic in hasCapabilityForPrincipals.
*/
declare function createSystemGrantModel(mongoose: typeof import("mongoose")): Model<ISystemGrant>;
//#endregion
//#region src/models/pluginAuth.d.ts
declare function createPluginAuthModel(mongoose: typeof import("mongoose")): Model<IPluginAuth>;
//#endregion
//#region src/models/sharedLink.d.ts
declare function createSharedLinkModel(mongoose: typeof import("mongoose")): Model<ISharedLink$1>;
//#endregion
//#region src/models/accessRole.d.ts
declare function createAccessRoleModel(mongoose: typeof import("mongoose")): Model<IAccessRole>;
//#endregion
//#region src/models/mcpServer.d.ts
declare function createMCPServerModel(mongoose: typeof import("mongoose")): Model<MCPServerDocument>;
//#endregion
//#region src/models/assistant.d.ts
declare function createAssistantModel(mongoose: typeof import("mongoose")): Model<IAssistant>;
//#endregion
//#region src/models/skillFile.d.ts
declare function createSkillFileModel(mongoose: typeof import("mongoose")): Model<ISkillFileDocument>;
//#endregion
//#region src/models/convo.d.ts
declare function createConversationModel(mongoose: typeof import("mongoose")): Model<IConversation>;
//#endregion
//#region src/models/toolCall.d.ts
declare function createToolCallModel(mongoose: typeof import("mongoose")): Model<IToolCallData$1>;
//#endregion
//#region src/models/aclEntry.d.ts
declare function createAclEntryModel(mongoose: typeof import("mongoose")): Model<IAclEntry>;
//#endregion
//#region src/models/auditLog.d.ts
/**
* AuditLog is an append-only, hash-chained compliance record.
*
* Like SystemGrant, the tenant-isolation plugin is intentionally not applied:
* every query is scoped by `chainKey` (the JWT-resolved tenantId, or the
* platform sentinel for admin operations outside any tenant), which is also the
* serialization key for the per-tenant hash chain.
*/
declare function createAuditLogModel(mongoose: typeof import("mongoose")): Model<IAuditLog>;
//#endregion
//#region src/models/session.d.ts
declare function createSessionModel(mongoose: typeof import("mongoose")): Model<ISession>;
//#endregion
//#region src/models/balance.d.ts
declare function createBalanceModel(mongoose: typeof import("mongoose")): Model<IBalance>;
//#endregion
//#region src/models/message.d.ts
declare function createMessageModel(mongoose: typeof import("mongoose")): Model<IMessage>;
//#endregion
//#region src/models/action.d.ts
declare function createActionModel(mongoose: typeof import("mongoose")): Model<IAction>;
//#endregion
//#region src/models/banner.d.ts
declare function createBannerModel(mongoose: typeof import("mongoose")): Model<IBanner>;
//#endregion
//#region src/models/preset.d.ts
declare function createPresetModel(mongoose: typeof import("mongoose")): Model<IPreset$1>;
//#endregion
//#region src/models/prompt.d.ts
declare function createPromptModel(mongoose: typeof import("mongoose")): Model<IPrompt>;
//#endregion
//#region src/models/memory.d.ts
declare function createMemoryModel(mongoose: typeof import("mongoose")): Model<IMemoryEntry>;
//#endregion
//#region src/models/config.d.ts
declare function createConfigModel(mongoose: typeof import("mongoose")): Model<IConfig>;
//#endregion
//#region src/models/token.d.ts
declare function createTokenModel(mongoose: typeof import("mongoose")): Model<IToken>;
//#endregion
//#region src/models/agent.d.ts
declare function createAgentModel(mongoose: typeof import("mongoose")): Model<IAgent>;
//#endregion
//#region src/models/skill.d.ts
declare function createSkillModel(mongoose: typeof import("mongoose")): Model<ISkillDocument>;
//#endregion
//#region src/models/group.d.ts
declare function createGroupModel(mongoose: typeof import("mongoose")): Model<IGroup>;
//#endregion
//#region src/models/user.d.ts
declare function createUserModel(mongoose: typeof import("mongoose")): Model<IUser>;
//#endregion
//#region src/models/role.d.ts
declare function createRoleModel(mongoose: typeof import("mongoose")): Model<IRole>;
//#endregion
//#region src/models/file.d.ts
declare function createFileModel(mongoose: typeof import("mongoose")): Model<IMongoFile>;
//#endregion
//#region src/models/key.d.ts
declare function createKeyModel(mongoose: typeof import("mongoose")): Model<IKey>;
//#endregion
//#region src/models/index.d.ts
/**
* Creates all database models for all collections
*/
declare function createModels(mongoose: typeof import("mongoose")): {
  User: ReturnType<typeof createUserModel>;
  Token: ReturnType<typeof createTokenModel>;
  Session: ReturnType<typeof createSessionModel>;
  Balance: ReturnType<typeof createBalanceModel>;
  Conversation: ReturnType<typeof createConversationModel>;
  ChatProject: ReturnType<typeof createChatProjectModel>;
  Message: ReturnType<typeof createMessageModel>;
  Agent: ReturnType<typeof createAgentModel>;
  AgentApiKey: ReturnType<typeof createAgentApiKeyModel>;
  AgentCategory: ReturnType<typeof createAgentCategoryModel>;
  MCPServer: ReturnType<typeof createMCPServerModel>;
  Role: ReturnType<typeof createRoleModel>;
  Action: ReturnType<typeof createActionModel>;
  Assistant: ReturnType<typeof createAssistantModel>;
  File: ReturnType<typeof createFileModel>;
  Banner: ReturnType<typeof createBannerModel>;
  Key: ReturnType<typeof createKeyModel>;
  PluginAuth: ReturnType<typeof createPluginAuthModel>;
  Transaction: ReturnType<typeof createTransactionModel>;
  Preset: ReturnType<typeof createPresetModel>;
  Prompt: ReturnType<typeof createPromptModel>;
  PromptGroup: ReturnType<typeof createPromptGroupModel>;
  Skill: ReturnType<typeof createSkillModel>;
  SkillFile: ReturnType<typeof createSkillFileModel>;
  SkillSyncCredential: ReturnType<typeof createSkillSyncCredentialModel>;
  SkillSyncStatus: ReturnType<typeof createSkillSyncStatusModel>;
  ConversationTag: ReturnType<typeof createConversationTagModel>;
  SharedLink: ReturnType<typeof createSharedLinkModel>;
  ToolCall: ReturnType<typeof createToolCallModel>;
  MemoryEntry: ReturnType<typeof createMemoryModel>;
  AccessRole: ReturnType<typeof createAccessRoleModel>;
  AclEntry: ReturnType<typeof createAclEntryModel>;
  SystemGrant: ReturnType<typeof createSystemGrantModel>;
  AuditLog: ReturnType<typeof createAuditLogModel>;
  Group: ReturnType<typeof createGroupModel>;
  Config: ReturnType<typeof createConfigModel>;
};
//#endregion
//#region src/methods/role.d.ts
declare class RoleConflictError extends Error {
  constructor(message: string);
}
interface RoleDeps {
  /** Returns a cache store for the given key. Injected from getLogStores. */
  getCache?: (key: string) => {
    get: (k: string) => Promise<unknown>;
    set: (k: string, v: unknown) => Promise<void>;
  };
}
declare function createRoleMethods(mongoose: typeof import("mongoose"), deps?: RoleDeps): {
  listRoles: (options?: {
    limit?: number;
    offset?: number;
  }) => Promise<Pick<IRole, "_id" | "name" | "description">[]>;
  countRoles: () => Promise<number>;
  initializeRoles: () => Promise<void>;
  getRoleByName: (roleName: string, fieldsToSelect?: string | string[] | null) => Promise<IRole>;
  findRolesByNames: (roleNames: string[], fieldsToSelect?: string | string[] | null) => Promise<IRole[]>;
  updateRoleByName: (roleName: string, updates: Partial<IRole>) => Promise<IRole>;
  updateAccessPermissions: (roleName: string, permissionsUpdate: Record<string, Record<string, boolean>>, roleData?: IRole) => Promise<void>;
  migrateRoleSchema: (roleName?: string) => Promise<number>;
  createRoleByName: (roleData: Partial<IRole>) => Promise<IRole>;
  deleteRoleByName: (roleName: string) => Promise<IRole | null>;
  updateUsersByRole: (oldRole: string, newRole: string) => Promise<void>;
  findUserIdsByRole: (roleName: string) => Promise<string[]>;
  updateUsersRoleByIds: (userIds: string[], newRole: string) => Promise<void>;
  listUsersByRole: (roleName: string, options?: {
    limit?: number;
    offset?: number;
  }) => Promise<IUser[]>;
  countUsersByRole: (roleName: string) => Promise<number>;
};
type RoleMethods = ReturnType<typeof createRoleMethods>;
//#endregion
//#region src/methods/session.d.ts
declare class SessionError extends Error {
  code: string;
  constructor(message: string, code?: string);
}
/** Default refresh token expiry: 7 days in milliseconds */
declare const DEFAULT_REFRESH_TOKEN_EXPIRY: number;
declare function createSessionMethods(mongoose: typeof import("mongoose")): {
  findSession: (params: SessionSearchParams, options?: SessionQueryOptions) => Promise<ISession | null>;
  SessionError: typeof SessionError;
  deleteSession: (params: DeleteSessionParams) => Promise<{
    deletedCount?: number;
  }>;
  createSession: (userId: string, options?: CreateSessionOptions) => Promise<SessionResult>;
  updateExpiration: (session: ISession | string, newExpiration?: Date, options?: UpdateExpirationOptions) => Promise<ISession>;
  countActiveSessions: (userId: string) => Promise<number>;
  generateRefreshToken: (session: ISession) => Promise<string>;
  deleteAllUserSessions: (userId: string | {
    userId: string;
  }, options?: DeleteAllSessionsOptions) => Promise<{
    deletedCount?: number;
  }>;
};
type SessionMethods = ReturnType<typeof createSessionMethods>;
//#endregion
//#region src/methods/user.d.ts
/** Default JWT session expiry: 15 minutes in milliseconds */
declare const DEFAULT_SESSION_EXPIRY: number;
/** Factory function that takes mongoose instance and returns the methods */
declare function createUserMethods(mongoose: typeof import("mongoose")): {
  findUser: (searchCriteria: FilterQuery<IUser>, fieldsToSelect?: string | string[] | null) => Promise<IUser | null>;
  findUsers: (searchCriteria: FilterQuery<IUser>, fieldsToSelect?: string | string[] | null, options?: {
    limit?: number;
    offset?: number;
    sort?: Record<string, 1 | -1>;
  }) => Promise<IUser[]>;
  countUsers: (filter?: FilterQuery<IUser>) => Promise<number>;
  createUser: (data: CreateUserRequest, balanceConfig?: BalanceConfig, disableTTL?: boolean, returnUser?: boolean) => Promise<mongoose.Types.ObjectId | Partial<IUser>>;
  updateUser: (userId: string, updateData: Partial<IUser>) => Promise<IUser | null>;
  searchUsers: ({
    searchPattern,
    limit,
    fieldsToSelect
  }: {
    searchPattern: string;
    limit?: number;
    fieldsToSelect?: string | string[] | null;
  }) => Promise<{
    _id: mongoose.Types.ObjectId;
    id: string;
    name?: string;
    username?: string;
    email: string;
    emailVerified: boolean;
    password?: string;
    avatar?: string;
    provider: string;
    role?: string;
    googleId?: string;
    facebookId?: string;
    openidId?: string;
    samlId?: string;
    ldapId?: string;
    githubId?: string;
    discordId?: string;
    appleId?: string;
    plugins?: string[];
    openidIssuer?: string;
    twoFactorEnabled?: boolean;
    totpSecret?: string;
    backupCodes?: Array<{
      codeHash: string;
      used: boolean;
      usedAt?: Date | null;
    }>;
    pendingTotpSecret?: string;
    pendingBackupCodes?: Array<{
      codeHash: string;
      used: boolean;
      usedAt?: Date | null;
    }>;
    refreshToken?: Array<{
      refreshToken: string;
    }>;
    expiresAt?: Date;
    termsAccepted?: boolean;
    personalization?: {
      memories?: boolean;
    };
    favorites?: import("librechat-data-provider").TUserFavorite[];
    skillStates?: Record<string, boolean>;
    createdAt?: Date;
    updatedAt?: Date;
    idOnTheSource?: string;
    tenantId?: string;
    federatedTokens?: OIDCTokens;
    openidTokens?: OIDCTokens;
    $locals: Record<string, unknown>;
    $op: "save" | "validate" | "remove" | null;
    $where: Record<string, unknown>;
    baseModelName?: string;
    collection: mongoose.Collection;
    db: mongoose.Connection;
    errors?: mongoose.Error.ValidationError;
    isNew: boolean;
    schema: mongoose.Schema;
  }[]>;
  getUserById: (userId: string, fieldsToSelect?: string | string[] | null) => Promise<IUser | null>;
  generateToken: (user: IUser, expiresIn?: number) => Promise<string>;
  deleteUserById: (userId: string) => Promise<UserDeleteResult>;
  updateUserPlugins: (userId: string, plugins: string[] | undefined, pluginKey: string, action: "install" | "uninstall") => Promise<IUser | null>;
  toggleUserMemories: (userId: string, memoriesEnabled: boolean) => Promise<IUser | null>;
};
type UserMethods = ReturnType<typeof createUserMethods>;
//#endregion
//#region src/methods/file.d.ts
type FileOwnerScope = {
  userId: string;
  tenantId?: string | null;
};
/** Factory function that takes mongoose instance and returns the file methods */
declare function createFileMethods(mongoose: typeof import("mongoose")): {
  findFileById: (file_id: string, options?: Record<string, unknown>) => Promise<IMongoFile | null>;
  getFiles: (filter: FilterQuery<IMongoFile>, _sortOptions?: Record<string, SortOrder> | null, selectFields?: Record<string, 0 | 1> | string | null) => Promise<IMongoFile[] | null>;
  getExpiredFiles: (limit?: number, now?: Date) => Promise<IMongoFile[]>;
  getToolFilesByIds: (fileIds: string[], toolResourceSet?: Set<EToolResources>, ownerScope?: FileOwnerScope) => Promise<IMongoFile[]>;
  getCodeGeneratedFiles: (conversationId: string, threadFileIds?: string[], ownerScope?: FileOwnerScope) => Promise<IMongoFile[]>;
  getUserCodeFiles: (fileIds: string[], ownerScope: FileOwnerScope) => Promise<IMongoFile[]>;
  claimCodeFile: (data: {
    filename: string;
    conversationId: string;
    file_id: string;
    user: string;
    tenantId?: string | null;
  }) => Promise<IMongoFile>;
  createFile: (data: Partial<IMongoFile>, disableTTL?: boolean) => Promise<IMongoFile | null>;
  updateFile: (data: Partial<IMongoFile> & {
    file_id: string;
  }, extraFilter?: FilterQuery<IMongoFile>) => Promise<IMongoFile | null>;
  updateFileUsage: (data: {
    file_id: string;
    inc?: number;
    user?: string;
    tenantId?: string | null;
  }) => Promise<IMongoFile | null>;
  deleteFile: (file_id: string) => Promise<IMongoFile | null>;
  deleteFiles: (file_ids: string[], user?: string) => Promise<{
    deletedCount?: number;
  }>;
  deleteFileByFilter: (filter: FilterQuery<IMongoFile>) => Promise<IMongoFile | null>;
  batchUpdateFiles: (updates: Array<{
    file_id: string;
    filepath: string;
    storageKey?: string;
    storageRegion?: string;
  }>) => Promise<void>;
  updateFilesUsage: (files: Array<{
    file_id: string;
  }>, fileIds?: string[], options?: {
    user?: string;
    tenantId?: string | null;
  }) => Promise<IMongoFile[]>;
  sweepOrphanedPreviews: (maxAgeMs?: number) => Promise<number>;
};
type FileMethods = ReturnType<typeof createFileMethods>;
//#endregion
//#region src/methods/token.d.ts
declare function createTokenMethods(mongoose: typeof import("mongoose")): {
  findToken: (query: TokenQuery, options?: QueryOptions) => Promise<IToken | null>;
  createToken: (tokenData: TokenCreateData) => Promise<IToken>;
  updateToken: (query: TokenQuery, updateData: TokenUpdateData) => Promise<IToken | null>;
  deleteTokens: (query: TokenQuery) => Promise<TokenDeleteResult>;
};
type TokenMethods = ReturnType<typeof createTokenMethods>;
//#endregion
//#region src/methods/key.d.ts
/** Factory function that takes mongoose instance and returns the key methods */
declare function createKeyMethods(mongoose: typeof import("mongoose")): {
  getUserKey: (params: {
    userId: string;
    name: string;
  }) => Promise<string>;
  updateUserKey: (params: {
    userId: string;
    name: string;
    value: string;
    expiresAt?: Date | null;
  }) => Promise<unknown>;
  deleteUserKey: (params: {
    userId: string;
    name?: string;
    all?: boolean;
  }) => Promise<unknown>;
  getUserKeyValues: (params: {
    userId: string;
    name: string;
  }) => Promise<Record<string, string>>;
  getUserKeyExpiry: (params: {
    userId: string;
    name: string;
  }) => Promise<{
    expiresAt: Date | "never" | null;
  }>;
};
type KeyMethods = ReturnType<typeof createKeyMethods>;
//#endregion
//#region src/methods/memory.d.ts
declare function createMemoryMethods(mongoose: typeof import("mongoose")): {
  setMemory: ({
    userId,
    key,
    value,
    tokenCount
  }: SetMemoryParams) => Promise<MemoryResult>;
  createMemory: ({
    userId,
    key,
    value,
    tokenCount
  }: SetMemoryParams) => Promise<MemoryResult>;
  deleteMemory: ({
    userId,
    key
  }: DeleteMemoryParams) => Promise<MemoryResult>;
  getAllUserMemories: (userId: string | Types.ObjectId) => Promise<IMemoryEntryLean[]>;
  getFormattedMemories: ({
    userId
  }: GetFormattedMemoriesParams) => Promise<FormattedMemoriesResult>;
  deleteAllUserMemories: (userId: string | Types.ObjectId) => Promise<number>;
};
type MemoryMethods = ReturnType<typeof createMemoryMethods>;
//#endregion
//#region src/methods/agentCategory.d.ts
declare function createAgentCategoryMethods(mongoose: typeof import("mongoose")): {
  getActiveCategories: () => Promise<IAgentCategory[]>;
  getCategoriesWithCounts: () => Promise<(IAgentCategory & {
    agentCount: number;
  })[]>;
  getValidCategoryValues: () => Promise<string[]>;
  seedCategories: (categories: Array<{
    value: string;
    label?: string;
    description?: string;
    order?: number;
    custom?: boolean;
  }>) => Promise<import("mongoose").mongo.BulkWriteResult>;
  findCategoryByValue: (value: string) => Promise<IAgentCategory | null>;
  createCategory: (categoryData: Partial<IAgentCategory>) => Promise<IAgentCategory>;
  updateCategory: (value: string, updateData: Partial<IAgentCategory>) => Promise<IAgentCategory | null>;
  deleteCategory: (value: string) => Promise<boolean>;
  findCategoryById: (id: string | Types.ObjectId) => Promise<IAgentCategory | null>;
  getAllCategories: () => Promise<IAgentCategory[]>;
  ensureDefaultCategories: () => Promise<boolean>;
};
type AgentCategoryMethods = ReturnType<typeof createAgentCategoryMethods>;
//#endregion
//#region src/methods/agentApiKey.d.ts
declare function createAgentApiKeyMethods(mongoose: typeof import("mongoose")): {
  createAgentApiKey: (data: AgentApiKeyCreateData) => Promise<AgentApiKeyCreateResult>;
  validateAgentApiKey: (apiKey: string) => Promise<{
    userId: Types.ObjectId;
    keyId: Types.ObjectId;
  } | null>;
  listAgentApiKeys: (userId: string | Types.ObjectId) => Promise<AgentApiKeyListItem[]>;
  deleteAgentApiKey: (keyId: string | Types.ObjectId, userId: string | Types.ObjectId) => Promise<boolean>;
  deleteAllAgentApiKeys: (userId: string | Types.ObjectId) => Promise<number>;
  getAgentApiKeyById: (keyId: string | Types.ObjectId, userId: string | Types.ObjectId) => Promise<AgentApiKeyListItem | null>;
};
type AgentApiKeyMethods = ReturnType<typeof createAgentApiKeyMethods>;
//#endregion
//#region src/methods/mcpServer.d.ts
declare function createMCPServerMethods(mongoose: typeof import("mongoose")): {
  createMCPServer: (data: {
    config: MCPOptions;
    author: string | Types.ObjectId;
    reservedServerNames?: Iterable<string>;
  }) => Promise<MCPServerDocument>;
  findMCPServerByServerName: (serverName: string) => Promise<MCPServerDocument | null>;
  findMCPServerByObjectId: (_id: string | Types.ObjectId) => Promise<MCPServerDocument | null>;
  findMCPServersByAuthor: (authorId: string | Types.ObjectId) => Promise<MCPServerDocument[]>;
  getListMCPServersByIds: ({
    ids,
    otherParams,
    limit,
    after
  }: {
    ids?: Types.ObjectId[];
    otherParams?: RootFilterQuery<MCPServerDocument>;
    limit?: number | null;
    after?: string | null;
  }) => Promise<{
    data: MCPServerDocument[];
    has_more: boolean;
    after: string | null;
  }>;
  getListMCPServersByNames: ({
    names
  }: {
    names: string[];
  }) => Promise<{
    data: MCPServerDocument[];
  }>;
  updateMCPServer: (serverName: string, updateData: {
    config?: MCPOptions;
  }) => Promise<MCPServerDocument | null>;
  deleteMCPServer: (serverName: string) => Promise<MCPServerDocument | null>;
};
type MCPServerMethods = ReturnType<typeof createMCPServerMethods>;
//#endregion
//#region src/methods/pluginAuth.d.ts
declare function createPluginAuthMethods(mongoose: typeof import("mongoose")): {
  findOnePluginAuth: ({
    userId,
    authField,
    pluginKey
  }: FindPluginAuthParams) => Promise<IPluginAuth | null>;
  findPluginAuthsByKeys: ({
    userId,
    pluginKeys
  }: FindPluginAuthsByKeysParams) => Promise<IPluginAuth[]>;
  updatePluginAuth: ({
    userId,
    authField,
    pluginKey,
    value
  }: UpdatePluginAuthParams) => Promise<IPluginAuth>;
  deletePluginAuth: ({
    userId,
    authField,
    pluginKey,
    all
  }: DeletePluginAuthParams) => Promise<DeleteResult>;
  deleteAllUserPluginAuths: (userId: string) => Promise<DeleteResult>;
};
type PluginAuthMethods = ReturnType<typeof createPluginAuthMethods>;
//#endregion
//#region src/methods/accessRole.d.ts
declare function createAccessRoleMethods(mongoose: typeof import("mongoose")): {
  createRole: (roleData: Partial<IAccessRole>) => Promise<IAccessRole>;
  updateRole: (accessRoleId: string | Types.ObjectId, updateData: Partial<IAccessRole>) => Promise<IAccessRole | null>;
  deleteRole: (accessRoleId: string | Types.ObjectId) => Promise<DeleteResult>;
  getAllRoles: () => Promise<IAccessRole[]>;
  findRoleById: (roleId: string | Types.ObjectId) => Promise<IAccessRole | null>;
  seedDefaultRoles: () => Promise<Record<string, IAccessRole>>;
  findRoleByIdentifier: (accessRoleId: string | Types.ObjectId) => Promise<IAccessRole | null>;
  getRoleForPermissions: (resourceType: string, permBits: PermissionBits | RoleBits) => Promise<IAccessRole | null>;
  findRoleByPermissions: (resourceType: string, permBits: PermissionBits | RoleBits) => Promise<IAccessRole | null>;
  findRolesByResourceType: (resourceType: string) => Promise<IAccessRole[]>;
};
type AccessRoleMethods = ReturnType<typeof createAccessRoleMethods>;
//#endregion
//#region src/methods/userGroup.d.ts
declare function createUserGroupMethods(mongoose: typeof import("mongoose")): {
  findGroupById: (groupId: string | Types.ObjectId, projection?: Record<string, 0 | 1>, session?: ClientSession) => Promise<IGroup | null>;
  findGroupByExternalId: (idOnTheSource: string, source?: "entra" | "local", projection?: Record<string, 0 | 1>, session?: ClientSession) => Promise<IGroup | null>;
  findGroupsByExternalIds: (idsOnTheSource: string[], source?: "entra" | "local", session?: ClientSession) => Promise<IGroup[]>;
  findGroupsByNamePattern: (namePattern: string, source?: "entra" | "local" | null, limit?: number, session?: ClientSession) => Promise<IGroup[]>;
  findGroupsByMemberId: (userId: string | Types.ObjectId, session?: ClientSession) => Promise<IGroup[]>;
  createGroup: (groupData: Partial<IGroup>, session?: ClientSession) => Promise<IGroup>;
  upsertGroupByExternalId: (idOnTheSource: string, source: "entra" | "local", updateData: Partial<IGroup>, session?: ClientSession) => Promise<IGroup | null>;
  addUserToGroup: (userId: string | Types.ObjectId, groupId: string | Types.ObjectId, session?: ClientSession) => Promise<{
    user: IUser;
    group: IGroup | null;
  }>;
  removeUserFromGroup: (userId: string | Types.ObjectId, groupId: string | Types.ObjectId, session?: ClientSession) => Promise<{
    user: IUser;
    group: IGroup | null;
  }>;
  removeUserFromAllGroups: (userId: string | Types.ObjectId) => Promise<void>;
  findGroupByQuery: (filter: Record<string, unknown>, session?: ClientSession) => Promise<IGroup | null>;
  updateGroupById: (groupId: string | Types.ObjectId, data: Record<string, unknown>, session?: ClientSession) => Promise<IGroup | null>;
  bulkUpdateGroups: (filter: Record<string, unknown>, update: Record<string, unknown>, options?: {
    session?: ClientSession;
  }) => Promise<import("mongoose").UpdateWriteOpResult>;
  getUserGroups: (userId: string | Types.ObjectId, session?: ClientSession) => Promise<IGroup[]>;
  getUserPrincipals: (params: {
    userId: string | Types.ObjectId;
    role?: string | null;
  }, session?: ClientSession) => Promise<Array<{
    principalType: PrincipalType;
    principalId?: string | Types.ObjectId;
  }>>;
  syncUserEntraGroups: (userId: string | Types.ObjectId, entraGroups: Array<{
    id: string;
    name: string;
    description?: string;
    email?: string;
  }>, session?: ClientSession) => Promise<{
    user: IUser;
    addedGroups: IGroup[];
    removedGroups: IGroup[];
  }>;
  searchPrincipals: (searchPattern: string, limitPerType?: number, typeFilter?: Array<PrincipalType.USER | PrincipalType.GROUP | PrincipalType.ROLE> | null, session?: ClientSession) => Promise<TPrincipalSearchResult[]>;
  calculateRelevanceScore: (item: TPrincipalSearchResult, searchPattern: string) => number;
  sortPrincipalsByRelevance: <T extends {
    _searchScore?: number;
    type: string;
    name?: string;
    email?: string;
  }>(results: T[]) => T[];
  listGroups: (filter?: {
    source?: "local" | "entra";
    search?: string;
    limit?: number;
    offset?: number;
  }, session?: ClientSession) => Promise<IGroup[]>;
  countGroups: (filter?: {
    source?: "local" | "entra";
    search?: string;
  }, session?: ClientSession) => Promise<number>;
  deleteGroup: (groupId: string | Types.ObjectId, session?: ClientSession) => Promise<IGroup | null>;
  removeMemberById: (groupId: string | Types.ObjectId, memberId: string, session?: ClientSession) => Promise<IGroup | null>;
};
type UserGroupMethods = ReturnType<typeof createUserGroupMethods>;
//#endregion
//#region src/methods/aclEntry.d.ts
/**
* Enumerates every `permBits` value (in the range `[0, MAX_PERM_BITS]`) whose
* set bits include all bits in `requiredBits`. Used with a `$in` filter to push
* permission-mask matching down to the database without relying on the
* `$bitsAllSet` query operator, which is not supported by Azure Cosmos DB for
* MongoDB (see issue #12729).
*
* **Invariant:** stored `permBits` values must lie in `[0, MAX_PERM_BITS]`.
* Values with higher-order bits set would never appear in the emitted `$in`
* list and would silently produce false permission denials. The aclEntry
* schema enforces this with a `max` validator; if the `PermissionBits` enum
* grows, `MAX_PERM_BITS` auto-expands from the new enum values.
*
* **Cache safety:** callers sometimes forward user input directly (e.g.
* `req.query.requiredPermission` is parsed and passed through without a range
* check). To prevent the process-global cache from growing unboundedly from
* attacker-supplied integers, any `requiredBits` outside `[0, MAX_PERM_BITS]`
* or with bits set above the max returns a shared frozen empty array and is
* NOT added to the cache. An empty `$in` list correctly matches zero rows,
* which is the right behavior for a request asking for bits the system does
* not recognize.
*
* For the current 4-bit `PermissionBits` enum the worst case is `required = 0`
* which expands to 16 values; the best case (all bits required) expands to 1.
* Results are memoized per `requiredBits` so the expansion runs at most once
* per distinct mask over the process lifetime.
*/
declare function permissionBitSupersets(requiredBits: number): readonly number[];
declare function createAclEntryMethods(mongoose: typeof import("mongoose")): {
  findEntriesByPrincipal: (principalType: string, principalId: string | Types.ObjectId, resourceType?: string) => Promise<IAclEntry[]>;
  findEntriesByResource: (resourceType: string, resourceId: string | Types.ObjectId) => Promise<IAclEntry[]>;
  findEntriesByPrincipalsAndResource: (principalsList: Array<{
    principalType: string;
    principalId?: string | Types.ObjectId;
  }>, resourceType: string, resourceId: string | Types.ObjectId) => Promise<IAclEntry[]>;
  hasPermission: (principalsList: Array<{
    principalType: string;
    principalId?: string | Types.ObjectId;
  }>, resourceType: string, resourceId: string | Types.ObjectId, permissionBit: number) => Promise<boolean>;
  getEffectivePermissions: (principalsList: Array<{
    principalType: string;
    principalId?: string | Types.ObjectId;
  }>, resourceType: string, resourceId: string | Types.ObjectId) => Promise<number>;
  getEffectivePermissionsForResources: (principalsList: Array<{
    principalType: string;
    principalId?: string | Types.ObjectId;
  }>, resourceType: string, resourceIds: Array<string | Types.ObjectId>) => Promise<Map<string, number>>;
  grantPermission: (principalType: string, principalId: string | Types.ObjectId | null, resourceType: string, resourceId: string | Types.ObjectId, permBits: number, grantedBy?: string | Types.ObjectId, session?: ClientSession, roleId?: string | Types.ObjectId, expiredAt?: Date) => Promise<IAclEntry | null>;
  revokePermission: (principalType: string, principalId: string | Types.ObjectId | null, resourceType: string, resourceId: string | Types.ObjectId, session?: ClientSession) => Promise<DeleteResult>;
  modifyPermissionBits: (principalType: string, principalId: string | Types.ObjectId | null, resourceType: string, resourceId: string | Types.ObjectId, addBits?: number | null, removeBits?: number | null, session?: ClientSession) => Promise<IAclEntry | null>;
  findAccessibleResources: (principalsList: Array<{
    principalType: string;
    principalId?: string | Types.ObjectId;
  }>, resourceType: string, requiredPermBit: number) => Promise<Types.ObjectId[]>;
  deleteAclEntries: (filter: Record<string, unknown>, options?: {
    session?: ClientSession;
  }) => Promise<DeleteResult>;
  bulkWriteAclEntries: (ops: AnyBulkWriteOperation<AclEntry>[], options?: {
    session?: ClientSession;
  }) => Promise<import("mongodb").BulkWriteResult>;
  findPublicResourceIds: (resourceType: string, requiredPermissions: number) => Promise<Types.ObjectId[]>;
  aggregateAclEntries: (pipeline: PipelineStage[]) => Promise<unknown[]>;
  getSoleOwnedResourceIds: (userObjectId: Types.ObjectId, resourceTypes: string | string[]) => Promise<Types.ObjectId[]>;
};
type AclEntryMethods = ReturnType<typeof createAclEntryMethods>;
//#endregion
//#region src/methods/systemGrant.d.ts
declare function createSystemGrantMethods(mongoose: typeof import("mongoose")): {
  grantCapability: ({
    principalType,
    principalId,
    capability,
    tenantId,
    grantedBy
  }: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
    capability: SystemCapability;
    tenantId?: string;
    grantedBy?: string | Types.ObjectId;
  }, session?: ClientSession) => Promise<{
    grant: ISystemGrant | null;
    created: boolean;
  }>;
  seedSystemGrants: () => Promise<void>;
  revokeCapability: ({
    principalType,
    principalId,
    capability,
    tenantId
  }: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
    capability: SystemCapability;
    tenantId?: string;
  }, session?: ClientSession) => Promise<{
    deletedCount: number;
  }>;
  hasCapabilityForPrincipals: ({
    principals,
    capability,
    tenantId
  }: {
    principals: Array<{
      principalType: PrincipalType;
      principalId?: string | Types.ObjectId;
    }>;
    capability: SystemCapability;
    tenantId?: string;
  }) => Promise<boolean>;
  getHeldCapabilities: ({
    principals,
    capabilities,
    tenantId
  }: {
    principals: Array<{
      principalType: PrincipalType;
      principalId?: string | Types.ObjectId;
    }>;
    capabilities: SystemCapability[];
    tenantId?: string;
  }) => Promise<Set<SystemCapability>>;
  listGrants: (options?: {
    tenantId?: string;
    principalTypes?: PrincipalType[];
    limit?: number;
    offset?: number;
  }) => Promise<ISystemGrant[]>;
  countGrants: (options?: {
    tenantId?: string;
    principalTypes?: PrincipalType[];
  }) => Promise<number>;
  getCapabilitiesForPrincipal: ({
    principalType,
    principalId,
    tenantId
  }: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
    tenantId?: string;
  }) => Promise<ISystemGrant[]>;
  getCapabilitiesForPrincipals: ({
    principals,
    tenantId
  }: {
    principals: Array<{
      principalType: PrincipalType;
      principalId: string | Types.ObjectId;
    }>;
    tenantId?: string;
  }) => Promise<ISystemGrant[]>;
  deleteGrantsForPrincipal: (principalType: PrincipalType, principalId: string | Types.ObjectId, options?: {
    tenantId?: string;
    session?: ClientSession;
  }) => Promise<ISystemGrant[]>;
};
type SystemGrantMethods = ReturnType<typeof createSystemGrantMethods>;
//#endregion
//#region src/methods/auditLog.d.ts
declare const MAX_AUDIT_LOG_LIMIT = 500;
/**
* Upper bound on rows emitted by the CSV export stream. At 100k rows per tenant
* per export request, a careless admin script (or a hostile auditor) can keep a
* cursor and a Node worker busy without saturating either; beyond that, exports
* should be sliced by `from`/`to`.
*/
declare const MAX_AUDIT_EXPORT_ROWS = 1e5;
/**
* Upper bound on rows verified in a single HTTP-triggered integrity check. Full
* offline jobs can pass a larger value explicitly when needed.
*/
declare const MAX_AUDIT_VERIFY_ROWS = 1e5;
/** Record-format version stamped on every new entry. */
declare const AUDIT_SCHEMA_VERSION = 1;
interface AuditLogMethods {
  recordAuditEntry: (input: RecordAuditEntryInput, options?: RecordAuditEntryOptions) => Promise<IAuditLog | null>;
  listAuditLogPage: (tenantId: string | undefined, filters: AuditLogFilters) => Promise<AuditLogPage>;
  findAuditLogEntry: (tenantId: string | undefined, id: string) => Promise<AdminAuditLogEntry | null>;
  streamAuditLogEntries: (tenantId: string | undefined, filters: Omit<AuditLogFilters, "offset" | "limit" | "cursor">, onEntry: (entry: AdminAuditLogEntry) => void | Promise<void>, options?: {
    isCancelled?: () => boolean;
    maxRows?: number;
  }) => Promise<{
    count: number;
    truncated: boolean;
  }>;
  verifyAuditChain: (tenantId: string | undefined, options?: VerifyAuditChainOptions) => Promise<AuditChainVerification>;
  purgeAuditLogEntries: (tenantId: string | undefined, options: PurgeAuditLogOptions) => Promise<PurgeAuditLogResult>;
}
//#endregion
//#region src/methods/share.d.ts
/** Factory function that takes mongoose instance and returns the methods */
declare function createShareMethods(mongoose: typeof import("mongoose")): {
  getSharedLink: (user: string, conversationId: string) => Promise<GetShareLinkResult>;
  getSharedLinks: (user: string, pageParam?: Date, pageSize?: number, sortBy?: string, sortDirection?: string, search?: string) => Promise<SharedLinksResult>;
  createSharedLink: (user: string, conversationId: string, targetMessageId?: string, expiredAt?: Date, snapshotFiles?: boolean) => Promise<CreateShareResult>;
  updateSharedLink: (user: string, shareId: string, targetMessageId?: string, expiredAt?: Date | null, snapshotFiles?: boolean) => Promise<UpdateShareResult>;
  deleteSharedLink: (user: string, shareId: string) => Promise<DeleteShareResult | null>;
  getSharedMessages: (shareId: string, shareObjectId?: string, options?: {
    snapshotFiles?: boolean;
  }) => Promise<SharedMessagesResult | null>;
  getSharedLinkFile: (shareId: string, fileId: string) => Promise<{
    file: SharedFileSnapshot | null;
    hasSnapshots: boolean;
    optedOut: boolean;
  }>;
  backfillSharedLinkFiles: (shareId: string, fileId?: string) => Promise<SharedFileSnapshot | SharedFileSnapshot[] | null>;
  deleteAllSharedLinks: (user: string) => Promise<DeleteAllSharesResult & {
    deletedIds: string[];
  }>;
  deleteConvoSharedLink: (user: string, conversationId: string) => Promise<DeleteAllSharesResult & {
    deletedIds: string[];
  }>;
};
type ShareMethods = ReturnType<typeof createShareMethods>;
//#endregion
//#region src/methods/action.d.ts
declare function createActionMethods(mongoose: typeof import("mongoose")): {
  getActions: (searchParams: FilterQuery<IAction>, includeSensitive?: boolean) => Promise<IAction[]>;
  updateAction: (searchParams: FilterQuery<IAction>, updateData: Partial<IAction>) => Promise<IAction | null>;
  deleteAction: (searchParams: FilterQuery<IAction>) => Promise<IAction | null>;
  deleteActions: (searchParams: FilterQuery<IAction>) => Promise<number>;
};
type ActionMethods = ReturnType<typeof createActionMethods>;
//#endregion
//#region src/methods/assistant.d.ts
declare function createAssistantMethods(mongoose: typeof import("mongoose")): {
  updateAssistantDoc: (searchParams: FilterQuery<IAssistant>, updateData: Partial<IAssistant>) => Promise<IAssistant | null>;
  deleteAssistant: (searchParams: FilterQuery<IAssistant>) => Promise<IAssistant | null>;
  deleteAssistants: (searchParams: FilterQuery<IAssistant>) => Promise<number>;
  getAssistants: (searchParams: FilterQuery<IAssistant>, select?: string | Record<string, number> | null) => Promise<IAssistant[]>;
  getAssistant: (searchParams: FilterQuery<IAssistant>) => Promise<IAssistant | null>;
};
type AssistantMethods = ReturnType<typeof createAssistantMethods>;
//#endregion
//#region src/methods/banner.d.ts
declare function createBannerMethods(mongoose: typeof import("mongoose")): {
  getBanner: (user?: IUser | null) => Promise<IBanner | null>;
};
type BannerMethods = ReturnType<typeof createBannerMethods>;
//#endregion
//#region src/methods/toolCall.d.ts
interface IToolCallData {
  messageId?: string;
  conversationId?: string;
  user?: string;
  [key: string]: unknown;
}
declare function createToolCallMethods(mongoose: typeof import("mongoose")): {
  createToolCall: (toolCallData: IToolCallData) => Promise<IToolCallData>;
  updateToolCall: (id: string, updateData: Partial<IToolCallData>) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    messageId?: string | undefined;
    conversationId?: string | undefined;
    user?: string | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  }) | null>;
  deleteToolCalls: (userId: string, conversationId?: string) => Promise<import("mongodb").DeleteResult>;
  getToolCallById: (id: string) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    messageId?: string | undefined;
    conversationId?: string | undefined;
    user?: string | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  }) | null>;
  getToolCallsByConvo: (conversationId: string, userId: string) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    messageId?: string | undefined;
    conversationId?: string | undefined;
    user?: string | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  })[]>;
  getToolCallsByMessage: (messageId: string, userId: string) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    messageId?: string | undefined;
    conversationId?: string | undefined;
    user?: string | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  })[]>;
};
type ToolCallMethods = ReturnType<typeof createToolCallMethods>;
//#endregion
//#region src/methods/categories.d.ts
type CategoryOption = {
  label: string;
  value: string;
};
declare function createCategoriesMethods(_mongoose: typeof import("mongoose")): {
  getCategories: () => Promise<CategoryOption[]>;
};
type CategoriesMethods = ReturnType<typeof createCategoriesMethods>;
//#endregion
//#region src/methods/preset.d.ts
interface IPreset {
  user?: string;
  presetId?: string;
  order?: number;
  defaultPreset?: boolean;
  tools?: (string | {
    pluginKey?: string;
  })[];
  updatedAt?: Date;
  [key: string]: unknown;
}
declare function createPresetMethods(mongoose: typeof import("mongoose")): {
  getPreset: (user: string, presetId: string) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    user?: string | undefined;
    presetId?: string | undefined;
    order?: number | undefined;
    defaultPreset?: boolean | undefined;
    tools?: (string | {
      pluginKey?: string | undefined;
    })[] | undefined;
    updatedAt?: Date | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  }) | {
    message: string;
  } | null>;
  getPresets: (user: string, filter?: Record<string, unknown>) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    user?: string | undefined;
    presetId?: string | undefined;
    order?: number | undefined;
    defaultPreset?: boolean | undefined;
    tools?: (string | {
      pluginKey?: string | undefined;
    })[] | undefined;
    updatedAt?: Date | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  })[] | {
    message: string;
  }>;
  savePreset: (user: string, {
    presetId,
    newPresetId,
    defaultPreset,
    ...preset
  }: {
    presetId?: string;
    newPresetId?: string;
    defaultPreset?: boolean;
    [key: string]: unknown;
  }) => Promise<IPreset | {
    message: string;
  }>;
  deletePresets: (user: string, filter?: Record<string, unknown>) => Promise<import("mongodb").DeleteResult>;
};
type PresetMethods = ReturnType<typeof createPresetMethods>;
//#endregion
//#region src/methods/conversationTag.d.ts
declare function createConversationTagMethods(mongoose: typeof import("mongoose")): {
  getConversationTags: (user: string) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    user: string;
    tag: string;
    description?: string | undefined;
    position: number;
    count: number;
    createdAt?: Date | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  })[]>;
  createConversationTag: (user: string, data: {
    tag: string;
    description?: string;
    addToConversation?: boolean;
    conversationId?: string;
  }) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    user: string;
    tag: string;
    description?: string | undefined;
    position: number;
    count: number;
    createdAt?: Date | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  }) | null>;
  updateConversationTag: (user: string, oldTag: string, data: {
    tag?: string;
    description?: string;
    position?: number;
  }) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    user: string;
    tag: string;
    description?: string | undefined;
    position: number;
    count: number;
    createdAt?: Date | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  }) | null>;
  deleteConversationTag: (user: string, tag: string) => Promise<(import("mongoose").FlattenMaps<{
    [x: string]: unknown;
    user: string;
    tag: string;
    description?: string | undefined;
    position: number;
    count: number;
    createdAt?: Date | undefined;
  }> & {
    _id: import("mongoose").Types.ObjectId;
  } & {
    __v: number;
  }) | null>;
  deleteConversationTags: (filter: Record<string, unknown>) => Promise<number>;
  bulkIncrementTagCounts: (user: string, tags: string[]) => Promise<void>;
  updateTagsForConversation: (user: string, conversationId: string, tags: string[]) => Promise<string[]>;
};
type ConversationTagMethods = ReturnType<typeof createConversationTagMethods>;
//#endregion
//#region src/methods/message.d.ts
interface MessageQueryOptions {
  limit?: number;
  sort?: Record<string, 1 | -1> | false;
}
interface MessageTextStatsOptions {
  limit?: number;
}
interface MessageTextStats {
  messageId: string;
  textBytes: number;
  quoteCount: number;
  quoteBytes: number;
  quoteLineCount: number;
  nonStringQuoteCount: number;
}
interface MessageMethods {
  saveMessage(ctx: {
    userId: string;
    isTemporary?: boolean;
    interfaceConfig?: AppConfig["interfaceConfig"];
  }, params: Partial<IMessage> & {
    newMessageId?: string;
  }, metadata?: {
    context?: string;
  }): Promise<IMessage | null | undefined>;
  bulkSaveMessages(messages: Array<Partial<IMessage>>, overrideTimestamp?: boolean): Promise<unknown>;
  recordMessage(params: {
    user: string;
    endpoint?: string;
    messageId: string;
    conversationId?: string;
    parentMessageId?: string;
    [key: string]: unknown;
  }): Promise<IMessage | null>;
  updateMessageText(userId: string, params: {
    messageId: string;
    text: string;
  }): Promise<void>;
  updateMessage(userId: string, message: Partial<IMessage> & {
    newMessageId?: string;
  }, metadata?: {
    context?: string;
  }): Promise<Partial<IMessage>>;
  deleteMessagesSince(userId: string, params: {
    messageId: string;
    conversationId: string;
  }): Promise<DeleteResult>;
  getMessages(filter: FilterQuery<IMessage>, select?: string, options?: MessageQueryOptions): Promise<IMessage[]>;
  getMessageTextStats(filter: FilterQuery<IMessage>, options?: MessageTextStatsOptions): Promise<MessageTextStats[]>;
  getMessage(params: {
    user: string;
    messageId: string;
  }): Promise<IMessage | null>;
  getMessagesByCursor(filter: FilterQuery<IMessage>, options?: {
    sortField?: string;
    sortOrder?: 1 | -1;
    limit?: number;
    cursor?: string | null;
  }): Promise<{
    messages: IMessage[];
    nextCursor: string | null;
  }>;
  searchMessages(query: string, searchOptions: Partial<IMessage>, hydrate?: boolean): Promise<unknown>;
  deleteMessages(filter: FilterQuery<IMessage>): Promise<DeleteResult>;
}
//#endregion
//#region src/methods/conversation.d.ts
interface ConversationMethods {
  getConvoFiles(conversationId: string): Promise<string[]>;
  searchConversation(conversationId: string): Promise<IConversation | null>;
  deleteNullOrEmptyConversations(): Promise<{
    conversations: {
      deletedCount?: number;
    };
    messages: {
      deletedCount?: number;
    };
  }>;
  saveConvo(ctx: {
    userId: string;
    isTemporary?: boolean;
    interfaceConfig?: AppConfig["interfaceConfig"];
  }, data: {
    conversationId: string;
    newConversationId?: string;
    [key: string]: unknown;
  }, metadata?: {
    context?: string;
    unsetFields?: Record<string, number>;
    noUpsert?: boolean;
    createdAtOnInsert?: Date;
  }): Promise<IConversation | {
    message: string;
  } | null>;
  bulkSaveConvos(conversations: Array<Record<string, unknown>>): Promise<unknown>;
  getConvosByCursor(user: string, options?: {
    cursor?: string | null;
    limit?: number;
    isArchived?: boolean;
    tags?: string[];
    search?: string;
    sortBy?: string;
    sortDirection?: string;
    projectId?: string;
  }): Promise<{
    conversations: IConversation[];
    nextCursor: string | null;
  }>;
  getConvosQueried(user: string, convoIds: Array<{
    conversationId: string;
  }> | null, cursor?: string | null, limit?: number): Promise<{
    conversations: IConversation[];
    nextCursor: string | null;
    convoMap: Record<string, unknown>;
  }>;
  getConvo(user: string, conversationId: string): Promise<IConversation | null>;
  getConvoRetention(user: string, conversationId: string): Promise<Pick<IConversation, "expiredAt"> | null>;
  getConvoTitle(user: string, conversationId: string): Promise<string | null>;
  deleteConvos(user: string, filter: FilterQuery<IConversation>): Promise<DeleteResult & {
    messages: DeleteResult;
  }>;
}
//#endregion
//#region src/methods/chatProject.d.ts
type ChatProjectSortBy = "name" | "createdAt" | "lastConversationAt";
type ChatProjectSortDirection = "asc" | "desc";
type CreateChatProjectInput = {
  name: string;
  description?: string | null;
};
type UpdateChatProjectInput = Partial<CreateChatProjectInput>;
type ListChatProjectsOptions = {
  cursor?: string | null;
  limit?: number;
  sortBy?: ChatProjectSortBy;
  sortDirection?: ChatProjectSortDirection;
  search?: string;
};
type ListChatProjectsResult = {
  projects: IChatProject[];
  nextCursor: string | null;
};
type DeleteChatProjectResult = {
  deletedCount: number;
  modifiedCount: number;
};
type AssignConversationToProjectResult = {
  conversation: IConversation;
  previousProjectId: string | null;
  projectId: string | null;
};
interface ChatProjectMethods {
  createChatProject(user: string, input: CreateChatProjectInput): Promise<IChatProject>;
  getChatProject(user: string, projectId: string): Promise<IChatProject | null>;
  listChatProjects(user: string, options?: ListChatProjectsOptions): Promise<ListChatProjectsResult>;
  updateChatProject(user: string, projectId: string, input: UpdateChatProjectInput): Promise<IChatProject | null>;
  deleteChatProject(user: string, projectId: string): Promise<DeleteChatProjectResult>;
  assignConversationToProject(user: string, conversationId: string, projectId: string | null): Promise<AssignConversationToProjectResult | null>;
  refreshChatProjectStats(user: string, projectId: string): Promise<IChatProject | null>;
}
//#endregion
//#region src/methods/tx.d.ts
/**
* Token Pricing Configuration
*
* Pattern Matching
* ================
* `findMatchingPattern` uses `modelName.includes(key)` and selects the **longest**
* matching key. If a key's length equals the model name's length (exact match), it
* returns immediately — no further keys are checked.
*
* For keys of different lengths, definition order does not affect the result — the
* longest match always wins. For **same-length ties**, the function iterates in
* reverse, so the last-defined key wins. Key ordering therefore matters for:
* 1. **Performance**: list older/legacy models first, newer models last — newer
*    models are more commonly used and will match earlier in the reverse scan.
* 2. **Same-length tie-breaking**: when two keys of equal length both match,
*    the last-defined key wins.
*/
interface TxDeps {
  /** From @librechat/api — matches a model name to a canonical key. */
  matchModelName: (model: string, endpoint?: string) => string | undefined;
  /** From @librechat/api — finds the longest key in `values` whose key is a substring of `model`. */
  findMatchingPattern: (model: string, values: Record<string, number | Record<string, number>>) => string | undefined;
}
declare const defaultRate = 6;
/**
* Mapping of model token sizes to their respective multipliers for prompt and completion.
* The rates are 1 USD per 1M tokens.
*/
declare const tokenValues: Record<string, {
  prompt: number;
  completion: number;
}>;
/**
* Mapping of model token sizes to their respective multipliers for cached input, read and write.
* The rates are 1 USD per 1M tokens.
*/
declare const cacheTokenValues: Record<string, {
  write: number;
  read: number;
}>;
/**
* Premium (tiered) pricing for models whose rates change based on prompt size.
*/
declare const premiumTokenValues: Record<string, {
  threshold: number;
  prompt: number;
  completion: number;
}>;
declare function createTxMethods(_mongoose: typeof import("mongoose"), txDeps: TxDeps): {
  tokenValues: Record<string, {
    prompt: number;
    completion: number;
  }>;
  premiumTokenValues: Record<string, {
    threshold: number;
    prompt: number;
    completion: number;
  }>;
  getValueKey: (model: string, endpoint?: string) => string | undefined;
  getMultiplier: ({
    model,
    valueKey,
    endpoint,
    tokenType,
    inputTokenCount,
    endpointTokenConfig
  }: {
    model?: string;
    valueKey?: string;
    endpoint?: string;
    tokenType?: "prompt" | "completion";
    inputTokenCount?: number;
    endpointTokenConfig?: Record<string, Record<string, number>>;
  }) => number;
  getPremiumRate: (valueKey: string, tokenType: string, inputTokenCount?: number | null) => number | null;
  getCacheMultiplier: ({
    valueKey,
    cacheType,
    model,
    endpoint,
    endpointTokenConfig
  }: {
    valueKey?: string;
    cacheType?: "write" | "read";
    model?: string;
    endpoint?: string;
    endpointTokenConfig?: Record<string, Record<string, number>>;
  }) => number | null;
  defaultRate: number;
  cacheTokenValues: Record<string, {
    write: number;
    read: number;
  }>;
};
type TxMethods = ReturnType<typeof createTxMethods>;
//#endregion
//#region src/methods/transaction.d.ts
type MultiplierParams = {
  model?: string;
  valueKey?: string;
  tokenType?: "prompt" | "completion";
  inputTokenCount?: number;
  endpointTokenConfig?: Record<string, Record<string, number>>;
};
type CacheMultiplierParams = {
  cacheType?: "write" | "read";
  model?: string;
  endpointTokenConfig?: Record<string, Record<string, number>>;
};
/** Input data for creating a transaction */
interface TxData {
  user: string | Types.ObjectId;
  conversationId?: string;
  model?: string;
  context?: string;
  tokenType?: "prompt" | "completion" | "credits";
  rawAmount?: number;
  valueKey?: string;
  endpointTokenConfig?: Record<string, Record<string, number>> | null;
  inputTokenCount?: number;
  inputTokens?: number;
  writeTokens?: number;
  readTokens?: number;
  balance?: {
    enabled?: boolean;
  };
  transactions?: {
    enabled?: boolean;
  };
}
/** Return value from a successful transaction that also updates the balance */
interface TransactionResult {
  rate: number;
  user: string;
  balance: number;
  prompt?: number;
  completion?: number;
  credits?: number;
}
declare function createTransactionMethods(mongoose: typeof import("mongoose"), txMethods: {
  getMultiplier: (params: MultiplierParams) => number;
  getCacheMultiplier: (params: CacheMultiplierParams) => number | null;
}): {
  updateBalance: ({
    user,
    incrementValue,
    setValues
  }: {
    user: string;
    incrementValue: number;
    setValues?: IBalanceUpdate;
  }) => Promise<IBalance>;
  bulkInsertTransactions: (docs: TransactionData[]) => Promise<void>;
  findBalanceByUser: (user: string) => Promise<IBalance | null>;
  upsertBalanceFields: (user: string, fields: IBalanceUpdate) => Promise<IBalance | null>;
  getTransactions: (filter: FilterQuery<ITransaction>) => Promise<ITransaction[]>;
  deleteTransactions: (filter: FilterQuery<ITransaction>) => Promise<import("mongodb").DeleteResult>;
  deleteBalances: (filter: FilterQuery<IBalance>) => Promise<import("mongodb").DeleteResult>;
  createTransaction: (_txData: TxData) => Promise<TransactionResult | undefined>;
  createAutoRefillTransaction: (txData: TxData) => Promise<{
    rate: number;
    user: string;
    balance: number;
    transaction: ITransaction;
  } | undefined>;
  createStructuredTransaction: (_txData: TxData) => Promise<TransactionResult | undefined>;
};
type TransactionMethods = ReturnType<typeof createTransactionMethods>;
//#endregion
//#region src/methods/spendTokens.d.ts
/** Base transaction context passed by callers — does not include fields added internally */
interface SpendTxData {
  user: string | import("mongoose").Types.ObjectId;
  conversationId?: string;
  model?: string;
  context?: string;
  endpointTokenConfig?: Record<string, Record<string, number>> | null;
  balance?: {
    enabled?: boolean;
  };
  transactions?: {
    enabled?: boolean;
  };
  valueKey?: string;
}
declare function createSpendTokensMethods(_mongoose: typeof import("mongoose"), transactionMethods: {
  createTransaction: (txData: TxData) => Promise<TransactionResult | undefined>;
  createStructuredTransaction: (txData: TxData) => Promise<TransactionResult | undefined>;
}): {
  spendTokens: (txData: SpendTxData, tokenUsage: {
    promptTokens?: number;
    completionTokens?: number;
  }) => Promise<void>;
  spendStructuredTokens: (txData: SpendTxData, tokenUsage: {
    promptTokens?: {
      input?: number;
      write?: number;
      read?: number;
    };
    completionTokens?: number;
  }) => Promise<{
    prompt: TransactionResult | undefined;
    completion: TransactionResult | undefined;
  }>;
};
type SpendTokensMethods = ReturnType<typeof createSpendTokensMethods>;
//#endregion
//#region src/methods/prompt.d.ts
interface PromptMethods {
  getPromptGroups(filter: Record<string, unknown>): Promise<{
    promptGroups: Record<string, unknown>[];
    pageNumber: string;
    pageSize: string;
    pages: string;
  } | {
    message: string;
  }>;
  deletePromptGroup(params: {
    _id: string;
  }): Promise<{
    message: string;
  }>;
  getAllPromptGroups(filter: Record<string, unknown>): Promise<Record<string, unknown>[] | {
    message: string;
  }>;
  getListPromptGroupsByAccess(params: {
    accessibleIds?: Types.ObjectId[];
    otherParams?: Record<string, unknown>;
    limit?: number | null;
    after?: string | null;
  }): Promise<{
    object: "list";
    data: Record<string, unknown>[];
    first_id: string | null;
    last_id: string | null;
    has_more: boolean;
    after: string | null;
  }>;
  incrementPromptGroupUsage(groupId: string): Promise<{
    numberOfGenerations: number;
  }>;
  createPromptGroup(saveData: {
    prompt: Record<string, unknown>;
    group: Record<string, unknown>;
    author: string;
    authorName: string;
  }): Promise<{
    prompt: Record<string, unknown> | null;
    group: Record<string, unknown>;
  }>;
  savePrompt(saveData: {
    prompt: Record<string, unknown>;
    author: string | Types.ObjectId;
  }): Promise<{
    prompt: IPrompt;
  } | {
    message: string;
  }>;
  getPrompts(filter: Record<string, unknown>): Promise<Record<string, unknown>[] | {
    message: string;
  }>;
  getPrompt(filter: Record<string, unknown>): Promise<Record<string, unknown> | null | {
    message: string;
  }>;
  getRandomPromptGroups(filter: {
    skip: number | string;
    limit: number | string;
  }): Promise<{
    prompts: unknown[];
  } | {
    message: string;
  }>;
  getPromptGroupsWithPrompts(filter: Record<string, unknown>): Promise<Record<string, unknown> | null | {
    message: string;
  }>;
  getPromptGroup(filter: Record<string, unknown>): Promise<Record<string, unknown> | null>;
  getOwnedPromptGroupIds(author: string): Promise<Types.ObjectId[]>;
  deletePrompt(params: {
    promptId: string | Types.ObjectId;
    groupId: string | Types.ObjectId;
  }): Promise<{
    prompt: string;
    promptGroup?: {
      message: string;
      id: string | Types.ObjectId;
    };
  }>;
  deleteUserPrompts(userId: string): Promise<void>;
  updatePromptGroup(filter: Record<string, unknown>, data: Record<string, unknown>): Promise<IPromptGroupDocument | {
    message: string;
  }>;
  makePromptProduction(promptId: string): Promise<{
    message: string;
  }>;
  updatePromptLabels(_id: string, labels: unknown): Promise<{
    message: string;
  }>;
}
//#endregion
//#region src/methods/skill.d.ts
/** ---------- Validation helpers (pure) ---------- */
/**
* A single validation issue emitted by a skill validator. Most issues are
* errors and block the mutation; some are warnings (e.g. "description is
* awfully short, Claude may undertrigger the skill") that surface inline
* coaching without rejecting the request.
*/
type ValidationIssue = {
  field: string;
  code: string;
  message: string;
  /**
  * Defaults to `'error'` when omitted. Errors cause `createSkill` /
  * `updateSkill` to throw with code `SKILL_VALIDATION_FAILED`; warnings
  * are surfaced on successful responses so the UI can show inline feedback.
  */
  severity?: "error" | "warning";
};
/** Partition an issue list into blocking errors and non-blocking warnings. */
declare function partitionIssues(issues: ValidationIssue[]): {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};
declare function validateSkillName(name: unknown): ValidationIssue[];
declare function validateSkillDescription(description: unknown): ValidationIssue[];
declare function validateSkillBody(body: unknown): ValidationIssue[];
/**
* Validate a skill's structured YAML frontmatter. Strict mode: unknown keys
* are rejected so any expansion of the allowed set is an intentional code
* change. Known keys are type-checked against `FRONTMATTER_KIND`; `hooks` and
* `metadata` fall back to a shallow JSON-safety check because their full
* schemas live outside this module.
*/
declare function validateSkillFrontmatter(frontmatter: unknown): ValidationIssue[];
declare function validateRelativePath(relativePath: unknown): ValidationIssue[];
declare function inferSkillFileCategory(relativePath: string): "script" | "reference" | "asset" | "other";
/** ---------- Method factory ---------- */
interface SkillDeps {
  /** Removes all ACL entries for a resource. Injected from PermissionService. */
  removeAllPermissions: (params: {
    resourceType: string;
    resourceId: unknown;
  }) => Promise<void>;
  /** Returns resource IDs solely owned by the given user. From createAclEntryMethods. */
  getSoleOwnedResourceIds: (userObjectId: Types.ObjectId, resourceTypes: string | string[]) => Promise<Types.ObjectId[]>;
}
type CreateSkillInput = {
  name: string;
  displayTitle?: string;
  description: string;
  body?: string;
  frontmatter?: Record<string, unknown>;
  category?: string;
  author: Types.ObjectId;
  authorName: string;
  source?: "inline" | "github" | "notion";
  sourceMetadata?: Record<string, unknown>;
  /**
  * When `true`, the skill is auto-primed into every turn. Callers pass this
  * through alongside `frontmatter` so the boolean lands on both the indexed
  * first-class column (queryable) and the raw frontmatter bag (inspectable).
  */
  alwaysApply?: boolean;
  tenantId?: string;
};
type UpdateSkillInput = {
  name?: string;
  displayTitle?: string;
  description?: string;
  body?: string;
  frontmatter?: Record<string, unknown>;
  category?: string;
  alwaysApply?: boolean;
  source?: "inline" | "github" | "notion";
  sourceMetadata?: Record<string, unknown>;
};
type GetAuthorSkillByNameParams = {
  name: string;
  author: Types.ObjectId | string;
  tenantId?: string | null;
};
/**
* Maps the runtime-enforced frontmatter fields onto their first-class
* column equivalents. Returns only the keys that were explicitly set on the
* frontmatter so callers can decide whether to write `undefined` (skip the
* `$set`) versus a concrete value.
*
* `allowed-tools` accepts string or string[] per the validator; both are
* normalized to an array. Empty strings are filtered out so a stray comma
* in YAML doesn't leak through as `''`.
*/
declare function deriveStructuredFrontmatterFields(frontmatter: Record<string, unknown> | undefined): {
  disableModelInvocation?: boolean;
  userInvocable?: boolean;
  allowedTools?: string[];
};
type UpsertSkillFileInput = {
  skillId: Types.ObjectId | string;
  relativePath: string;
  file_id: string;
  filename: string;
  filepath: string;
  storageKey?: string;
  storageRegion?: string;
  source: string;
  sourceMetadata?: Record<string, unknown>;
  mimeType: string;
  bytes: number;
  isExecutable?: boolean;
  author: Types.ObjectId;
  tenantId?: string;
};
type ListSkillsByAccessParams = {
  accessibleIds: Types.ObjectId[];
  category?: string;
  search?: string;
  limit: number;
  cursor?: string | null;
};
type ListSkillsByAccessResult = {
  /**
  * Summary rows — `body` and `frontmatter` are intentionally omitted at the
  * query projection layer to keep list payloads small. Callers that need the
  * full document must fetch the detail via `getSkillById`.
  */
  skills: Array<ISkillSummary & {
    _id: Types.ObjectId;
  }>;
  has_more: boolean;
  after: string | null;
};
type ListAlwaysApplySkillsParams = {
  accessibleIds: Types.ObjectId[]; /** Max rows to return per page. The caller paginates to fill an active-state budget. */
  limit: number; /** Opaque cursor from a prior page. `null` / absent = first page. */
  cursor?: string | null;
};
type ListAlwaysApplySkillsResult = {
  /**
  * Rows for `alwaysApply: true` skills within `accessibleIds` on this page.
  * Returns `body` eagerly — callers prime the full SKILL.md on every turn,
  * so round-tripping through `getSkillById` per skill would double DB ops.
  */
  skills: Array<{
    _id: Types.ObjectId;
    name: string;
    body: string;
    author: Types.ObjectId;
    allowedTools?: string[];
  }>; /** `true` when another page exists beyond this one. */
  has_more: boolean; /** Cursor for the next page, or `null` when `has_more` is `false`. */
  after: string | null;
};
type UpdateSkillResult = {
  status: "updated";
  skill: ISkill & {
    _id: Types.ObjectId;
  };
  warnings: ValidationIssue[];
} | {
  status: "conflict";
  current: ISkill & {
    _id: Types.ObjectId;
  };
} | {
  status: "not_found";
};
type CreateSkillResult = {
  skill: ISkill & {
    _id: Types.ObjectId;
  };
  warnings: ValidationIssue[];
};
declare function createSkillMethods(mongoose: typeof import("mongoose"), deps: SkillDeps): {
  createSkill: (data: CreateSkillInput) => Promise<CreateSkillResult>;
  getSkillById: (id: string | Types.ObjectId) => Promise<(ISkill & {
    _id: Types.ObjectId;
  }) | null>;
  getSkillByName: (name: string, accessibleIds: Types.ObjectId[], options?: {
    /**
    * Manual paths (`$` popover, always-apply once Phase 5 lands) set
    * this so a same-name newer `userInvocable: false` duplicate can't
    * shadow the older user-invocable doc the popover surfaced.
    * Disable-model-invocation status is irrelevant here — manually-
    * primed disabled skills are explicitly supported (iter 4).
    */
    preferUserInvocable?: boolean;
    /**
    * Model paths (`skill` / `read_file` tool handlers) set this so a
    * same-name newer `disable-model-invocation: true` duplicate can't
    * shadow the cataloged model-invocable doc. User-invocability is
    * irrelevant here — `userInvocable: false` skills are model-only
    * and remain valid model-invocation targets.
    *
    * Both flags fall back to the newest match when no preferred doc
    * exists, so handlers can still fire their explicit-rejection
    * error paths (e.g. "cannot be invoked by the model" in the
    * disabled-only case).
    */
    preferModelInvocable?: boolean;
  }) => Promise<(ISkill & {
    _id: Types.ObjectId;
  }) | null>;
  getAuthorSkillByName: (params: GetAuthorSkillByNameParams) => Promise<(ISkill & {
    _id: Types.ObjectId;
  }) | null>;
  listSkillsByAccess: (params: ListSkillsByAccessParams) => Promise<ListSkillsByAccessResult>;
  listAlwaysApplySkills: (params: ListAlwaysApplySkillsParams) => Promise<ListAlwaysApplySkillsResult>;
  updateSkill: (params: {
    id: string;
    expectedVersion: number;
    update: UpdateSkillInput;
  }) => Promise<UpdateSkillResult>;
  deleteSkill: (id: string) => Promise<{
    deleted: boolean;
  }>;
  deleteUserSkills: (userId: Types.ObjectId | string) => Promise<number>;
  findSkillBySourceIdentity: (params: {
    source: "github" | "notion";
    upstreamId: string;
    tenantId?: string;
  }) => Promise<(ISkill & {
    _id: Types.ObjectId;
  }) | null>;
  listSkillsBySource: (params: {
    source: "github" | "notion";
    sourceId: string;
  }) => Promise<Array<ISkill & {
    _id: Types.ObjectId;
  }>>;
  listSkillFiles: (skillId: Types.ObjectId | string) => Promise<Array<ISkillFile & {
    _id: Types.ObjectId;
  }>>;
  upsertSkillFile: (row: UpsertSkillFileInput) => Promise<ISkillFile & {
    _id: Types.ObjectId;
  }>;
  deleteSkillFile: (skillId: Types.ObjectId | string, relativePath: string) => Promise<{
    deleted: boolean;
  }>;
  getSkillFileByPath: (skillId: Types.ObjectId | string, relativePath: string) => Promise<(ISkillFile & {
    _id: Types.ObjectId;
  }) | null>;
  updateSkillFileContent: (skillId: Types.ObjectId | string, relativePath: string, update: {
    content?: string;
    isBinary?: boolean;
  }) => Promise<void>;
  updateSkillFileCodeEnvIds: (updates: Array<{
    skillId: Types.ObjectId | string;
    relativePath: string;
    codeEnvRef: CodeEnvRef;
  }>) => Promise<{
    matchedCount: number;
    modifiedCount: number;
  }>;
};
type SkillMethods = ReturnType<typeof createSkillMethods>;
//#endregion
//#region src/methods/skillSync.d.ts
type SkillSyncCredentialSummary = {
  provider: SkillSyncProvider;
  credentialKey: string;
  credentialPresent: boolean;
  tokenFingerprint?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
type UpsertSkillSyncCredentialInput = {
  provider: SkillSyncProvider;
  credentialKey: string;
  token: string;
  userId?: Types.ObjectId;
};
type SkillSyncStatusInput = {
  provider: SkillSyncProvider;
  sourceId: string;
  tenantId?: string;
  status: SkillSyncRunStatus;
  credentialKey?: string;
  owner?: string;
  repo?: string;
  ref?: string;
  paths?: string[];
  startedAt?: Date;
  finishedAt?: Date;
  errorCode?: string;
  errorMessage?: string;
  syncedSkillCount?: number;
  syncedFileCount?: number;
  deletedSkillCount?: number;
  deletedFileCount?: number;
};
type SkillSyncLockInput = {
  provider: SkillSyncProvider;
  lockOwner: string;
  leaseMs: number;
  tenantId?: string;
};
type SkillSyncReleaseLockInput = {
  provider: SkillSyncProvider;
  lockOwner: string;
  tenantId?: string;
};
type SkillSyncMethods = {
  upsertSkillSyncCredential: (input: UpsertSkillSyncCredentialInput) => Promise<SkillSyncCredentialSummary>;
  deleteSkillSyncCredential: (provider: SkillSyncProvider, credentialKey: string) => Promise<{
    deleted: boolean;
  }>;
  listSkillSyncCredentials: (provider: SkillSyncProvider) => Promise<SkillSyncCredentialSummary[]>;
  getSkillSyncCredentialToken: (provider: SkillSyncProvider, credentialKey: string) => Promise<string | null>;
  getSkillSyncCredentialSummary: (provider: SkillSyncProvider, credentialKey: string) => Promise<SkillSyncCredentialSummary | null>;
  listSkillSyncStatuses: (provider: SkillSyncProvider) => Promise<ISkillSyncStatus[]>;
  getSkillSyncStatus: (provider: SkillSyncProvider, sourceId: string, tenantId?: string) => Promise<ISkillSyncStatus | null>;
  upsertSkillSyncStatus: (input: SkillSyncStatusInput) => Promise<ISkillSyncStatus>;
  tryAcquireSkillSyncLock: (params: SkillSyncLockInput) => Promise<boolean>;
  refreshSkillSyncLock: (params: SkillSyncLockInput) => Promise<boolean>;
  releaseSkillSyncLock: (params: SkillSyncReleaseLockInput) => Promise<void>;
};
//#endregion
//#region src/methods/agent.d.ts
interface AgentDeps {
  /** Removes all ACL permissions for a resource. Injected from PermissionService. */
  removeAllPermissions: (params: {
    resourceType: string;
    resourceId: unknown;
  }) => Promise<void>;
  /** Gets actions. Created by createActionMethods. */
  getActions: (searchParams: FilterQuery<unknown>, includeSensitive?: boolean) => Promise<unknown[]>;
  /** Returns resource IDs solely owned by the given user. From createAclEntryMethods. */
  getSoleOwnedResourceIds: (userObjectId: Types.ObjectId, resourceTypes: string | string[]) => Promise<Types.ObjectId[]>;
}
/**
* Generates a hash of action metadata for version comparison.
*/
declare function generateActionMetadataHash(actionIds: string[] | null | undefined, actions: Array<{
  action_id: string;
  metadata: Record<string, unknown> | null;
}>): Promise<string>;
declare function createAgentMethods(mongoose: typeof import("mongoose"), deps: AgentDeps): {
  getAgent: (searchParameter: FilterQuery<IAgent>) => Promise<IAgent | null>;
  getAgents: (searchParameter: FilterQuery<IAgent>) => Promise<IAgent[]>;
  createAgent: (agentData: Record<string, unknown>) => Promise<IAgent>;
  hasAgentWithMCPServerName: ({
    agentIds,
    serverName
  }: {
    agentIds: Types.ObjectId[];
    serverName: string;
  }) => Promise<boolean>;
  getMCPServerNamesByAgentIds: (agentIds: Types.ObjectId[]) => Promise<string[]>;
  updateAgent: (searchParameter: FilterQuery<IAgent>, updateData: Record<string, unknown>, options?: {
    updatingUserId?: string | null;
    forceVersion?: boolean;
    skipVersioning?: boolean;
  }) => Promise<IAgent | null>;
  deleteAgent: (searchParameter: FilterQuery<IAgent>) => Promise<IAgent | null>;
  deleteUserAgents: (userId: string) => Promise<void>;
  revertAgentVersion: (searchParameter: FilterQuery<IAgent>, versionIndex: number) => Promise<IAgent>;
  countPromotedAgents: () => Promise<number>;
  addAgentResourceFile: ({
    agent_id,
    tool_resource,
    file_id,
    updatingUserId
  }: {
    agent_id: string;
    tool_resource: string;
    file_id: string;
    updatingUserId?: string;
  }) => Promise<IAgent>;
  getListAgentsByAccess: ({
    accessibleIds,
    otherParams,
    limit,
    after,
    includeSkillConfig
  }: {
    accessibleIds?: Types.ObjectId[];
    otherParams?: Record<string, unknown>;
    limit?: number | null;
    after?: string | null;
    includeSkillConfig?: boolean;
  }) => Promise<{
    object: string;
    data: Array<Record<string, unknown>>;
    first_id: string | null;
    last_id: string | null;
    has_more: boolean;
    after: string | null;
  }>;
  removeAgentResourceFiles: ({
    agent_id,
    files
  }: {
    agent_id: string;
    files: Array<{
      tool_resource: string;
      file_id: string;
    }>;
  }) => Promise<IAgent>;
  generateActionMetadataHash: typeof generateActionMetadataHash;
  removeAgentFromUserFavorites: (resourceId: string, userIds: string[]) => Promise<void>;
  removeAgentResourceFilesFromAllAgents: ({
    file_ids
  }: {
    file_ids: string[];
  }) => Promise<{
    matchedCount: number;
    modifiedCount: number;
  }>;
};
type AgentMethods = ReturnType<typeof createAgentMethods>;
//#endregion
//#region src/methods/config.d.ts
declare function createConfigMethods(mongoose: typeof import("mongoose")): {
  listAllConfigs: (filter?: {
    isActive?: boolean;
  }, session?: ClientSession) => Promise<IConfig[]>;
  findConfigByPrincipal: (principalType: PrincipalType, principalId: string | Types.ObjectId, options?: {
    includeInactive?: boolean;
  }, session?: ClientSession) => Promise<IConfig | null>;
  getApplicableConfigs: (principals?: Array<{
    principalType: string;
    principalId?: string | Types.ObjectId;
  }>, session?: ClientSession) => Promise<IConfig[]>;
  upsertConfig: (principalType: PrincipalType, principalId: string | Types.ObjectId, principalModel: PrincipalModel, overrides: Partial<TCustomConfig>, priority: number, session?: ClientSession, options?: {
    expectEmpty?: boolean;
    preservePriority?: boolean;
  }) => Promise<IConfig | null>;
  patchConfigFields: (principalType: PrincipalType, principalId: string | Types.ObjectId, principalModel: PrincipalModel, fields: Record<string, unknown>, priority: number, session?: ClientSession) => Promise<IConfig | null>;
  tombstoneConfigField: (principalType: PrincipalType, principalId: string | Types.ObjectId, principalModel: PrincipalModel, fieldPath: string, priority: number, session?: ClientSession) => Promise<IConfig | null>;
  unsetConfigField: (principalType: PrincipalType, principalId: string | Types.ObjectId, fieldPath: string, session?: ClientSession) => Promise<IConfig | null>;
  deleteConfig: (principalType: PrincipalType, principalId: string | Types.ObjectId, session?: ClientSession, options?: {
    expectEmpty?: boolean;
  }) => Promise<IConfig | null>;
  toggleConfigActive: (principalType: PrincipalType, principalId: string | Types.ObjectId, isActive: boolean, session?: ClientSession, options?: {
    expectEmpty?: boolean;
  }) => Promise<IConfig | null>;
};
type ConfigMethods = ReturnType<typeof createConfigMethods>;
//#endregion
//#region src/methods/index.d.ts
type AllMethods = UserMethods & SessionMethods & TokenMethods & RoleMethods & KeyMethods & FileMethods & MemoryMethods & AgentCategoryMethods & AgentApiKeyMethods & MCPServerMethods & UserGroupMethods & AclEntryMethods & SystemGrantMethods & AuditLogMethods & ShareMethods & AccessRoleMethods & PluginAuthMethods & ActionMethods & AssistantMethods & BannerMethods & ToolCallMethods & CategoriesMethods & PresetMethods & ConversationTagMethods & MessageMethods & ConversationMethods & ChatProjectMethods & TxMethods & TransactionMethods & SpendTokensMethods & PromptMethods & SkillMethods & SkillSyncMethods & AgentMethods & ConfigMethods;
/** Dependencies injected from the api layer into createMethods */
interface CreateMethodsDeps {
  /** Matches a model name to a canonical key. From @librechat/api. */
  matchModelName?: (model: string, endpoint?: string) => string | undefined;
  /** Finds the first key in values whose key is a substring of model. From @librechat/api. */
  findMatchingPattern?: (model: string, values: Record<string, number | Record<string, number>>) => string | undefined;
  /** Removes all ACL permissions for a resource. From PermissionService. */
  removeAllPermissions?: (params: {
    resourceType: string;
    resourceId: unknown;
  }) => Promise<void>;
  /** Returns a cache store for the given key. From getLogStores. */
  getCache?: RoleDeps["getCache"];
}
/**
* Creates all database methods for all collections
* @param mongoose - Mongoose instance
* @param deps - Optional dependencies injected from the api layer
*/
declare function createMethods(mongoose: typeof import("mongoose"), deps?: CreateMethodsDeps): AllMethods;
//#endregion
//#region src/config/winston.d.ts
declare const logger: winston.Logger;
//#endregion
//#region src/config/meiliLogger.d.ts
declare const logger$1: winston.Logger;
//#endregion
//#region src/config/parsers.d.ts
/**
* Redacts sensitive information from a console message and trims it to a specified length if provided.
* @param str - The console message to be redacted.
* @param trimLength - The optional length at which to trim the redacted message.
* @returns The redacted and optionally trimmed console message.
*/
declare function redactMessage(str: string, trimLength?: number): string;
/**
* Redacts sensitive information from log messages at every level.
* Note: Intentionally mutates the object.
* @param info - The log information object.
* @returns The modified log information object.
*/
//#endregion
//#region src/config/tenantContext.d.ts
interface TenantContext {
  tenantId?: string;
  userId?: string;
  requestId?: string;
}
/** Sentinel value for deliberate cross-tenant system operations */
declare const SYSTEM_TENANT_ID = "__SYSTEM__";
/**
* AsyncLocalStorage instance for propagating tenant context.
* Callbacks passed to `tenantStorage.run()` must be `async` for the context to propagate
* through Mongoose query execution. Sync callbacks returning a Mongoose thenable will lose context.
*/
declare const tenantStorage: AsyncLocalStorage<TenantContext>;
/** Returns the current tenant ID from async context, or undefined if none is set */
declare function getTenantId(): string | undefined;
/** Returns the current user ID from async context, or undefined if none is set */
declare function getUserId(): string | undefined;
/** Returns the current request ID from async context, or undefined if none is set */
declare function getRequestId(): string | undefined;
/**
* Runs a function in an explicit cross-tenant system context (bypasses tenant filtering).
* The callback MUST be async — sync callbacks returning Mongoose thenables will lose context.
*/
declare function runAsSystem<T>(fn: () => Promise<T>): Promise<T>;
/**
* Appends `:${tenantId}` to a cache key when a non-system tenant context is active.
* Returns the base key unchanged when no ALS context is set or when running
* inside `runAsSystem()` (SYSTEM_TENANT_ID context).
*/
declare function scopedCacheKey(baseKey: string): string;
//#endregion
//#region src/migrations/tenantIndexes.d.ts
interface MigrationResult {
  dropped: string[];
  skipped: string[];
  errors: string[];
}
/**
* Drops superseded unique indexes that block multi-tenant operation.
* Idempotent — skips indexes that don't exist. Safe to run on fresh databases.
*
* Call this before enabling multi-tenant middleware on an existing deployment.
* On a fresh database (no pre-existing data), this is a no-op.
*/
declare function dropSupersededTenantIndexes(connection: Connection): Promise<MigrationResult>;
//#endregion
//#region src/migrations/promptGroupIndexes.d.ts
declare function dropSupersededPromptGroupIndexes(connection: Connection): Promise<{
  dropped: string[];
  skipped: string[];
  errors: string[];
}>;
//#endregion
export { AUDIT_ACTIONS, AUDIT_ACTION_CATEGORY, AUDIT_ACTOR_TYPES, AUDIT_CATEGORIES, AUDIT_OUTCOMES, AUDIT_SCHEMA_VERSION, AUDIT_SEVERITIES, type AccessRole, type AccessRoleMethods, type AclEntry, type AclEntryMethods, type ActionMethods, type AdminAuditLogEntry, type AdminConfig, type AdminConfigDeleteResponse, type AdminConfigListResponse, type AdminConfigResponse, type AdminGroup, type AdminMember, type AdminSystemGrant, type AdminUserListItem, type AdminUserSearchResult, type AgentApiKeyCreateData, type AgentApiKeyCreateResult, type AgentApiKeyDeleteResult, type AgentApiKeyListItem, type AgentApiKeyMethods, type AgentApiKeyQuery, type AgentCategory, type AgentCategoryMethods, type AgentMethods, type AllMethods, type AppConfig, AppService, type AssignConversationToProjectResult, type AssistantMethods, type AuditAction, type AuditActor, type AuditActorInput, type AuditActorType, type AuditCategory, type AuditChainVerification, type AuditCheckpoint, type AuditContext, type AuditIntegrity, type AuditLog, type AuditLogFilters, type AuditLogMethods, type AuditLogPage, type AuditMetadata, type AuditMetadataValue, type AuditOutcome, type AuditSeverity, type AuditTarget, type AuditTargetInput, BASE_CONFIG_PRINCIPAL_ID, type BalanceConfig, type BannerMethods, type BaseSystemCapability, CANCEL_RATE, CAPABILITY_CATEGORIES, type CapabilityCategory, CapabilityImplications, type CategoriesMethods, type ChatProjectMethods, type ChatProjectSortBy, type ChatProjectSortDirection, type Config, type ConfigAssignTarget, type ConfigMethods, type ConfigSection, type ConversationMethods, type ConversationTagMethods, type ConvertJsonSchemaToZodOptions, type CreateChatProjectInput, type CreateGroupRequest, type CreateMethodsDeps, type CreateRoleRequest, type CreateSessionOptions, type CreateShareResult, type CreateSkillInput, type CreateSkillResult, type CreateUserRequest, CursorPaginationParams, CursorPaginationResponse, DEFAULT_REFRESH_TOKEN_EXPIRY, DEFAULT_RETENTION_HOURS, DEFAULT_SESSION_EXPIRY, type DeleteAllSessionsOptions, type DeleteAllSharesResult, type DeleteChatProjectResult, type DeleteMemoryParams, type DeletePluginAuthParams, type DeleteSessionParams, type DeleteShareResult, type FileMethods, type FileOwnerScope, type FindPluginAuthParams, type FindPluginAuthsByKeysParams, type FormattedMemoriesResult, type FunctionTool, GENESIS_HASH, type GetFormattedMemoriesParams, type GetShareLinkResult, type GroupFilterOptions, type IAccessRole, type IAclEntry, type IAction, type IAgent, type IAgentApiKey, type IAgentCategory, type IAssistant, type IAuditLog, type IBalance, type IBalanceUpdate, type IBanner, type IChatProject, type IChatProjectDocument, type IConfig, type IConversation, type IGroup, type IMemoryEntry, type IMemoryEntryLean, type IMessage, type IMongoFile, type IPluginAuth, type IPrompt, type IPromptGroup, type IPromptGroupDocument, type IRole, type ISession, type ISharedLink, type ISkill, type ISkillDocument, type ISkillFile, type ISkillFileDocument, type ISkillSummary, type ISkillSyncCredential, type ISkillSyncCredentialDocument, type ISkillSyncStatus, type ISkillSyncStatusDocument, type ISupportContact, type ISystemGrant, type IToken, type IUser, type JsonSchemaType, type KeyMethods, type ListChatProjectsOptions, type ListChatProjectsResult, type ListSkillsByAccessParams, type ListSkillsByAccessResult, MAX_AUDIT_EXPORT_ROWS, MAX_AUDIT_LOG_LIMIT, MAX_AUDIT_VERIFY_ROWS, MAX_PERM_BITS, MAX_RETENTION_HOURS, type MCPServerDocument, type MCPServerMethods, MIN_RETENTION_HOURS, type MemoryMethods, type MemoryResult, type MessageMethods, type OIDCTokens, type ObjectId, PLATFORM_CHAIN_KEY, Paths, type PluginAuthMethods, type PluginAuthQuery, type PresetMethods, type PromptMethods, type PurgeAuditLogOptions, type PurgeAuditLogResult, type RecordAuditEntryInput, type RecordAuditEntryOptions, ResourceCapabilityMap, RetentionFilterDocument, RoleBits, RoleConflictError, type RoleFilterOptions, type RoleMethods, type RolePermissions, type RolePermissionsInput, SYSTEM_TENANT_ID, type SessionMethods, type SessionQueryOptions, type SessionResult, type SessionSearchParams, type SetMemoryParams, type ShareMethods, type ShareServiceError, type SharedFile, type SharedFileSnapshot, type SharedLinksResult, type SharedMessage, type SharedMessagesResult, type SignPayloadParams, type SkillDeps, type SkillMethods, type SkillSyncCredentialSummary, type SkillSyncMethods, type SkillSyncProvider, type SkillSyncRunStatus, type SkillSyncStatusInput, type SpendTokensMethods, SystemCapabilities, type SystemCapability, type SystemGrant, type SystemGrantMethods, type TWebSearchCategories, type TWebSearchKeys, type TenantContext, type TokenCreateData, type TokenDeleteResult, type TokenMethods, type TokenQuery, type TokenUpdateData, type ToolCallMethods, type TransactionData, type TransactionMethods, type TxMethods, type UpdateChatProjectInput, type UpdateExpirationOptions, type UpdateGroupRequest, type UpdatePluginAuthParams, type UpdateRoleRequest, type UpdateShareResult, type UpdateSkillInput, type UpdateSkillResult, type UpdateUserRequest, type UpsertSkillFileInput, type UpsertSkillSyncCredentialInput, type UserDeleteResult, type UserFilterOptions, type UserGroupMethods, type UserMethods, type UserQueryOptions, type ValidationIssue, type VerifyAuditChainOptions, Action as actionSchema, activeExpirationFilter, agentApiKeySchema, agentCategorySchema, agentSchema, agentsConfigSetup, assistantSchema, auditLogSchema, balanceSchema, bannerSchema, buildRetentionVisibilityFilter, cacheTokenValues, categoriesSchema, chatProjectSchema, configCapability, configSchema, conversationTag as conversationTagSchema, convoSchema, createFallbackRetentionDate, createMethods, createModels, createTempChatExpirationDate, createTxMethods, decrypt, decryptV2, decryptV3, defaultRate, defaultVertexModels, deriveStructuredFrontmatterFields, dropSupersededPromptGroupIndexes, dropSupersededTenantIndexes, encrypt, encryptV2, encryptV3, escapeRegExp, expandImplications, file as fileSchema, getRandomValues, getRequestId, getTempChatRetentionHours, getTenantId, getTransactionSupport, getUserId, getWebSearchKeys, groupSchema, hasImpliedCapability, hashBackupCode, hashToken, inferSkillFileCategory, isMemoryAgentEnabled, isMemoryEnabled, isValidCapability, isValidObjectIdString, keySchema, legacyPermanentExpirationFilter, loadDefaultInterface, loadMemoryConfig, loadSkillSyncConfig, loadSummarizationConfig, loadTurnstileConfig, loadWebSearchConfig, logger, logger$1 as meiliLogger, MemoryEntrySchema as memorySchema, mergeConfigOverrides, messageSchema, normalizePrincipalId, partitionIssues, permissionBitSupersets, pluginAuthSchema, premiumTokenValues, presetSchema, processModelSpecs, promptGroupSchema, promptSchema, readConfigCapability, redactMessage, roleSchema, runAsSystem, scopedCacheKey, sessionSchema, shareSchema, signPayload, skillSyncCredentialSchema, skillSyncStatusSchema, stripYamlTrailingComment, supportsTransactions, systemGrantSchema, tenantSafeBulkWrite, tenantStorage, tokenSchema, tokenValues, toolCallSchema, transactionSchema, userSchema, validateRelativePath, validateSkillBody, validateSkillDescription, validateSkillFrontmatter, validateSkillName, validateVertexConfig, vertexConfigSetup, webSearchAuth, webSearchKeys };
//# sourceMappingURL=index.d.mts.map