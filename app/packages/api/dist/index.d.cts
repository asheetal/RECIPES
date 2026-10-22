import { $ as DownloadURLParams, $t as GoogleServiceKey, A as GoogleParameters, At as BedrockUserCredentials, B as GoogleAudioBlock, Bt as ThinkingConfigDisabled, C as OCRImage, Ct as GetUserKeyValuesFunction, D as PageDimensions, Dt as BedrockConfigOptions, E as OCRUsageInfo, Et as UserKeyValues, F as AudioResult, Ft as AnthropicCredentials, G as OpenRouterAudioBlock, Gt as OAIClientOptions, H as GoogleVideoBlock, Ht as ThinkingConfigParam, I as BedrockDocumentBlock, It as AnthropicLLMConfigResult, J as STTService, Jt as OpenAIConfiguration, K as OpenRouterVideoBlock, Kt as OpenAIConfigOptions, L as DocumentBlock, Lt as AnthropicModelOptions, M as AudioBlock, Mt as InferenceProfileConfig, N as AudioFileInfo, Nt as BalanceUpdateFields, O as GoogleConfigOptions, Ot as BedrockCredentials, P as AudioProcessingResult, Pt as AnthropicConfigOptions, Q as BatchUpdateFn, Qt as GenericClient, R as DocumentResult, Rt as AnthropicParameters, S as MistralSignedUrlResponse, St as GetUserKeyFunction, T as OCRResultPage, Tt as TCustomEndpointsConfig, U as OpenAIFileBlock, Ut as VertexAIClientOptions, V as GoogleDocumentBlock, Vt as ThinkingConfigEnabled, W as OpenAIInputFileBlock, Wt as LLMConfigResult, X as VideoBlock, Xt as OpenAIParameters, Y as StrategyFunctions, Yt as OpenAIModelOptions, Z as VideoResult, Zt as AzureOptions, _ as PromptGroupsListResponse, _t as CustomError, a as GenerationJob, at as SaveBufferParams, b as MistralOCRRequest, bt as BaseInitializeParams, c as ResumeState, ct as UploadFileParams, d as UnsubscribeFn, dt as UrlBuilder, en as checkUserKeyExpiry, et as GetURLParams, f as EndpointTokenConfig, ft as CreatedEvent, g as PromptGroupsAllResponse, gt as StreamEvent, h as AccessiblePromptGroupsResult, ht as ServerSentEvent, i as ErrorHandler, in as ResolvedPrincipal, it as SaveBufferFn, j as AnthropicDocumentBlock, jt as GuardrailConfiguration, k as GoogleCredentials, kt as BedrockLLMConfigResult, l as SubscribeOptions, lt as UploadImageParams, m as RunLLMConfig, mt as FinalMessageFields, n as ContentPart, nn as RequestBody, nt as ProcessAvatarParams, o as GenerationJobMetadata, ot as SaveURLParams, p as TokenConfig, pt as FinalEvent, q as ProcessedFile, qt as OpenAIConfigResult, r as DoneHandler, rn as ServerRequest, rt as S3FileRef, s as GenerationJobStatus, st as SaveURLResult, t as ChunkHandler, tn as loadServiceKey, tt as ImageUploadResult, u as SubscribeWithResumeResult, ut as UploadResult, v as MistralFileUploadResponse, vt as MongoServerError, w as OCRResult, wt as InitializeResultBase, x as MistralOCRUploadResult, xt as EndpointDbMethods, y as MistralOCRError, yt as ValidationError, z as FileObject, zt as ThinkingConfigAdaptive } from "./index-D9XDH6QQ.cjs";
import { AccessRoleMethods, AdminAuditLogEntry, AgentApiKeyCreateResult, AgentApiKeyListItem, AllMethods, AppConfig, AuditChainVerification, AuditLogFilters, AuditLogPage, BalanceConfig, ChatProjectMethods, ConfigSection, ConvertJsonSchemaToZodOptions, CreateSkillInput, CreateSkillResult, FileOwnerScope, GroupFilterOptions, IAclEntry, IAgent, IBalance, IBalanceUpdate, IConfig, IGroup, IMongoFile, IPromptGroupDocument, IRole, ISkill, ISkillFile, ISkillSyncStatus, ISystemGrant, IToken, IUser, JsonSchemaType as JsonSchemaType$1, ListSkillsByAccessResult, MemoryMethods, ObjectId, PluginAuthMethods, RecordAuditEntryInput, RecordAuditEntryOptions, RoleMethods, SkillSyncCredentialSummary, SkillSyncProvider, SkillSyncStatusInput, SystemCapability, TWebSearchCategories, TWebSearchKeys, TokenMethods, TransactionData, TxMethods, UpdateSkillInput, UpdateSkillResult, UpsertSkillFileInput, UpsertSkillSyncCredentialInput, UserDeleteResult, UserMethods, decrypt, decryptV2, decryptV3, encrypt, encryptV2, encryptV3, getRandomValues, hashBackupCode, isMemoryAgentEnabled, isMemoryEnabled, loadMemoryConfig } from "@librechat/data-schemas";
import { AnyBulkWriteOperation, ClientSession, DeleteResult, FilterQuery, Model, Mongoose, PipelineStage, ProjectionType, QueryOptions, Types, mongo } from "mongoose";
import { AccessRoleIds, ActionMetadata, Agent, AgentAvatar, AgentCapabilities, AgentModelParameters, AgentSubagentsConfig, AgentToolOptions, AgentToolResources, Agents, AnthropicEffort, ArtifactModes, AuthType, AuthTypeEnum, CloudFrontConfig, CodeEnvKind, CodeEnvRef, DynamicSettingProps, EModelEndpoint, EToolResources, GraphEdge, MCPOptions as MCPOptions$1, MCPOptionsSchema, MCPServersSchema, MessageFilterPiiConfig, PermissionTypes, Permissions, PrincipalModel, PrincipalType, ReasoningParameterFormat, ReasoningResponseKey, RefillIntervalUnit, ResourceType, SSEOptionsSchema, SearchResultData, SettingDefinition, SkillSyncConfig, StdioOptionsSchema, StreamableHTTPOptionsSchema, SummarizationConfig, TAgentsEndpoint, TAttachment, TConfig, TContextProjectionRequest, TContextUsageEvent, TConversation, TCustomConfig, TCustomEndpoints, TEndpoint, TEndpointOption, TEndpointsConfig, TEphemeralAgent, TFile, TMessage, TMessageContentParts, TModelSpec, TModelSpecPreset, TModelsConfig, TPlugin, TPreset, TResponseUsage, TSharedLinkStartupConfig, TSpecsConfig, TTokenConfigMap, TTokenUsageEvent, TTransactionsConfig, TUser, TWebSearchConfig, ThinkingDisplay, TokenExchangeMethodEnum, Tools, UIResource, WebSocketOptionsSchema, librechat, supportsAdaptiveThinking } from "librechat-data-provider";
import { NextFunction, Request, RequestHandler, Response as Response$1, Router } from "express";
import http, { Server } from "http";
import { AsyncLocalStorage } from "node:async_hooks";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import firebase from "firebase/app";
import { FirebaseStorage } from "firebase/storage";
import { S3Client } from "@aws-sdk/client-s3";
import { HttpsProxyAgent } from "https-proxy-agent";
import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Dispatcher } from "undici";
import { Keyv, StoredDataNoRaw } from "keyv";
import http$1, { Agent as Agent$1 } from "node:http";
import https, { Agent as Agent$2 } from "node:https";
import { LookupFunction } from "node:net";
import z$1, { z } from "zod";
import { AllowedCaller, AnthropicClientOptions, CodeEnvFile, EventHandler as EventHandler$1, GenericTool, GoogleClientOptions, GraphEdge as GraphEdge$1, IState, InjectedMessage, JsonSchemaType, JsonSchemaType as JsonSchemaType$2, LCTool, LCTool as LCTool$1, LCToolRegistry, LCToolRegistry as LCToolRegistry$1, LLMConfig, MessageContentComplex, Providers, Run, RunConfig, StandardGraph, StreamEventData, ToolEndCallback as ToolEndCallback$1, ToolMap, ToolSessionMap, VertexAIClientOptions as VertexAIClientOptions$1 } from "@librechat/agents";
import { Readable } from "stream";
import { EventEmitter } from "events";
import { AudioContent, EmbeddedResource, ImageContent, ListToolsResult, TextContent, Tool as Tool$1 } from "@modelcontextprotocol/sdk/types.js";
import { OAuthClientInformation as OAuthClientInformation$1, OAuthTokens } from "@modelcontextprotocol/sdk/shared/auth.js";
import { Logger } from "winston";
import { RequestOptions } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import https$1 from "https";
import fetch$1 from "node-fetch";
import { BaseMessage } from "@librechat/agents/langchain/messages";
import { DynamicStructuredTool, StructuredToolInterface } from "@librechat/agents/langchain/tools";
import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";
import { ClientOptions as ClientOptions$1 } from "@anthropic-ai/sdk";
import { GoogleAIToolType } from "@librechat/agents/langchain/google-common";
import FormData from "form-data";
import { RedisClientType, RedisClusterType } from "@redis/client";
import { Cluster, Redis } from "ioredis";
import { KeyvFile } from "keyv-file";
import { ReadPreference } from "mongodb";
import { RedisStore } from "rate-limit-redis";
import { MemoryStore } from "express-session";
import { RedisStore as RedisStore$1 } from "connect-redis";

//#region src/app/service.d.ts
declare const DEFAULT_OVERRIDE_CACHE_TTL = 6e4;
interface CacheStore {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown, ttl?: number) => Promise<unknown>;
  delete: (key: string) => Promise<boolean>;
  /** Keyv options — used for key enumeration when clearing override caches. */
  opts?: {
    store?: {
      keys?: () => IterableIterator<string>;
    };
  };
}
interface AppConfigServiceDeps {
  /** Load the base AppConfig from YAML + AppService processing. */
  loadBaseConfig: () => Promise<AppConfig | undefined>;
  /** Cache tools after base config is loaded. */
  setCachedTools: (tools: Record<string, unknown>) => Promise<void>;
  /** Get a cache store by key. */
  getCache: (key: string) => CacheStore;
  /** The CacheKeys constants from librechat-data-provider. */
  cacheKeys: {
    APP_CONFIG: string;
  };
  /** Fetch applicable DB config overrides for a set of principals. */
  getApplicableConfigs: (principals?: Array<{
    principalType: string;
    principalId?: string | Types.ObjectId;
  }>) => Promise<IConfig[]>;
  /** Resolve full principal list (user + role + groups) from userId/role. */
  getUserPrincipals: (params: {
    userId: string | Types.ObjectId;
    role?: string | null;
  }) => Promise<Array<{
    principalType: string;
    principalId?: string | Types.ObjectId;
  }>>;
  /** TTL in ms for per-user/role merged config caches. Defaults to 60 000. */
  overrideCacheTtl?: number;
}
interface GetAppConfigOptions {
  role?: string;
  userId?: string;
  tenantId?: string;
  refresh?: boolean;
  /** When true, return only the YAML-derived base config — no DB override queries. */
  baseOnly?: boolean;
}
/** @internal Resets the memoized strict-override flag and one-time no-tenantId warning gate. Exposed for test teardown only. */
declare function _resetOverrideStrictCache(): void;
declare function createAppConfigService(deps: AppConfigServiceDeps): {
  getAppConfig: (options?: GetAppConfigOptions) => Promise<AppConfig>;
  clearAppConfigCache: () => Promise<void>;
  clearOverrideCache: (tenantId?: string) => Promise<void>;
};
type AppConfigService = ReturnType<typeof createAppConfigService>;
//#endregion
//#region src/app/config.d.ts
/**
* Retrieves the balance configuration object
* */
declare function getBalanceConfig(appConfig?: AppConfig): Partial<TCustomConfig["balance"]> | null;
/**
* Retrieves the transactions configuration object
* */
declare function getTransactionsConfig(appConfig?: AppConfig): Partial<TTransactionsConfig>;
declare const getCustomEndpointConfig: ({
  endpoint,
  appConfig
}: {
  endpoint: string | EModelEndpoint;
  appConfig?: AppConfig;
}) => Partial<TEndpoint> | undefined;
//#endregion
//#region src/app/metrics.d.ts
declare const normalizePath: (rawPath: string) => string;
interface PrometheusMetrics {
  metricsMiddleware: (req: Request, res: Response$1, next: NextFunction) => void;
  metricsRouter: Router;
}
type OpenIDUserLookupResult = "found" | "not_found" | "migration" | "auth_failed" | "error";
type GenerationJobStore = "memory" | "redis";
type GenerationJobResult = "created" | "completed" | "error" | "aborted" | "abort_failed";
type GenerationStreamSubscriptionType = "initial" | "resume" | "resume_state";
type GenerationStreamSubscriptionResult = "success" | "not_found" | "error" | "found" | "missing";
type RumProxyEndpoint = "traces" | "logs" | "unknown";
type RumProxyResult = "success" | "auth_drop" | "auth_error" | "bad_request" | "not_configured" | "collector_4xx" | "collector_5xx" | "collector_error" | "collector_timeout";
declare function recordOpenIDUserLookup(result: OpenIDUserLookupResult, durationSeconds: number): void;
declare function recordGenerationJob(store: GenerationJobStore, result: GenerationJobResult): void;
declare function setGenerationJobsInFlight(store: GenerationJobStore, count: number): void;
declare function recordGenerationStreamSubscription(store: GenerationJobStore, type: GenerationStreamSubscriptionType, result: GenerationStreamSubscriptionResult): void;
declare function recordGenerationStreamResumePendingEvents(store: GenerationJobStore, count: number): void;
declare function recordRumProxyRequest(endpoint: RumProxyEndpoint, result: RumProxyResult): void;
declare const isMetricsConfigured: () => boolean;
declare function recordMongooseQuery(model: string, operation: string, status: string, durationSeconds: number): void;
declare function instrumentMongooseQueryMetrics(mongoose: Mongoose): void;
declare function createMetrics(): PrometheusMetrics;
//#endregion
//#region src/app/permissions.d.ts
declare function updateInterfacePermissions({
  appConfig,
  getRoleByName,
  updateAccessPermissions,
  tenantId
}: {
  appConfig: AppConfig;
  getRoleByName: (roleName: string, fieldsToSelect?: string | string[]) => Promise<IRole | null>;
  updateAccessPermissions: (roleName: string, permissionsUpdate: Partial<Record<PermissionTypes, Record<string, boolean | undefined>>>, roleData?: IRole | null) => Promise<void>;
  /**
  * Optional tenant ID for scoping role updates to a specific tenant.
  * When provided (and not SYSTEM_TENANT_ID), runs inside `tenantStorage.run({ tenantId })`.
  * When omitted or SYSTEM_TENANT_ID, uses the caller's existing ALS context.
  */
  tenantId?: string;
}): Promise<void>;
//#endregion
//#region src/app/cdn.d.ts
/**
* Initializes file storage clients based on the configured file strategies.
* Handles both the main fileStrategy and granular fileStrategies config.
*/
declare function initializeFileStorage(appConfig: AppConfig): void;
//#endregion
//#region src/app/checks.d.ts
declare const deprecatedAzureVariables: {
  key: string;
  description: string;
}[];
declare const conflictingAzureVariables: {
  key: string;
}[];
/**
* Checks environment variables for default secrets and deprecated variables.
* Logs warnings for any default secret values being used and for usage of deprecated variables.
* Advises on replacing default secrets and updating deprecated variables.
* @param {Object} options
* @param {Function} options.isEnabled - Function to check if a feature is enabled
* @param {Function} options.checkEmailConfig - Function to check email configuration
*/
declare function checkVariables(): void;
/**
* Checks the health of auxiliary API's by attempting a fetch request to their respective `/health` endpoints.
* Logs information or warning based on the API's availability and response.
*/
declare function checkHealth(): Promise<void>;
declare function checkInterfaceConfig(appConfig: AppConfig): void;
/**
* Performs startup checks including environment variable validation and health checks.
* This should be called during application startup before initializing services.
* @param [appConfig] - The application configuration object.
*/
declare function performStartupChecks(appConfig?: AppConfig): Promise<void>;
/**
* Performs basic checks on the loaded config object.
* @param config - The loaded custom configuration.
*/
declare function checkConfig(config: Partial<TCustomConfig>): void;
/**
* Checks web search configuration values to ensure they are environment variable references.
* Warns if actual API keys or URLs are used instead of environment variable references.
* Logs debug information for properly configured environment variable references.
* @param webSearchConfig - The loaded web search configuration object.
*/
declare function checkWebSearchConfig(webSearchConfig?: Partial<TCustomConfig["webSearch"]> | null): void;
//#endregion
//#region src/app/resolve.d.ts
interface UserForConfigResolution {
  tenantId?: string;
  role?: string;
}
type GetAppConfig = (opts: {
  role?: string;
  tenantId?: string;
  baseOnly?: boolean;
}) => Promise<AppConfig>;
/**
* Resolves AppConfig scoped to the given user's tenant when available,
* falling back to YAML-only base config for new users or non-tenant deployments.
*
* Auth flows only apply role-level overrides (userId is not passed) because
* user/group principal resolution requires heavier DB work that is deferred
* to post-authentication config calls.
*
* `tenantId` is propagated through two channels that serve different purposes:
* - `tenantStorage.run()` sets the ALS context so Mongoose's `applyTenantIsolation`
*   plugin scopes any DB queries (e.g., `getApplicableConfigs`) to the tenant.
* - The explicit `tenantId` parameter to `getAppConfig` is used for cache-key
*   computation in `overrideCacheKey()`. Both channels are required.
*/
declare function resolveAppConfigForUser(getAppConfig: GetAppConfig, user: UserForConfigResolution | null | undefined): Promise<AppConfig>;
//#endregion
//#region src/app/shutdown.d.ts
/**
* Register a cleanup task to run after the HTTP server has closed.
* Tasks run in registration order; if one throws, subsequent tasks
* and the final exit are not blocked. Use this instead of attaching
* `process.on('SIGTERM', ...)` handlers directly — multiple competing
* signal handlers race with the HTTP drain because Node dispatches
* listeners in registration order and any one of them can call
* `process.exit` before the HTTP server has finished closing.
*/
declare function registerShutdownTask(name: string, fn: () => void | Promise<void>): void;
/**
* Wires SIGTERM, SIGINT, SIGQUIT, and SIGHUP to a graceful shutdown
* sequence: close the HTTP server (stop accepting new connections, let
* in-flight requests finish), run any tasks registered via
* `registerShutdownTask`, then `process.exit(0)`. After
* SHUTDOWN_TIMEOUT_MS the process is force-exited with code 1 — a
* safety net for long-lived connections such as SSE streams that may
* not finish in time.
*/
declare function setupGracefulShutdown(server: Server): void;
/**
* @internal Reset module state for tests. Not part of the public API.
*/
declare function __resetShutdownStateForTests(): void;
//#endregion
//#region src/app/build.d.ts
interface BuildInfo {
  commit: string | null;
  commitShort: string | null;
  branch: string | null;
  buildDate: string | null;
}
/**
* Resolves the current deployment's build info from (in order): explicit env vars,
* then local git metadata. Used by `/api/config` to expose commit/branch to clients
* when `interface.buildInfo` is enabled.
*/
declare function resolveBuildInfo(): BuildInfo;
//#endregion
//#region src/artifacts/update.d.ts
declare const ARTIFACT_START = ":::artifact";
declare const ARTIFACT_END = ":::";
type TextPart = {
  type?: string;
  text?: string;
};
type ArtifactMessage = {
  content?: TextPart[];
  text?: string;
};
type ArtifactBoundary = {
  start: number;
  end: number;
  source: "content" | "text";
  partIndex?: number;
  text: string;
};
declare const findAllArtifacts: (message: ArtifactMessage) => ArtifactBoundary[];
declare const replaceArtifactContent: (originalText: string, artifact: ArtifactBoundary, original: string, updated: string) => string | null;
//#endregion
//#region src/middleware/capabilities.d.ts
interface CapabilityDeps {
  getUserPrincipals: (params: {
    userId: string | Types.ObjectId;
    role?: string | null;
  }, session?: ClientSession) => Promise<ResolvedPrincipal[]>;
  hasCapabilityForPrincipals: (params: {
    principals: ResolvedPrincipal[];
    capability: SystemCapability;
    tenantId?: string;
  }) => Promise<boolean>;
}
interface CapabilityUser {
  id: string;
  role: string;
  tenantId?: string;
}
interface CapabilityStore {
  principals: Map<string, ResolvedPrincipal[]>;
  results: Map<string, boolean>;
}
type HasCapabilityFn = (user: CapabilityUser, capability: SystemCapability) => Promise<boolean>;
type RequireCapabilityFn = (capability: SystemCapability) => (req: ServerRequest, res: Response$1, next: NextFunction) => Promise<void>;
type HasConfigCapabilityFn = (user: CapabilityUser, section: ConfigSection | null, verb?: "manage" | "read") => Promise<boolean>;
/**
* Per-request store for caching resolved principals and capability check results.
* When running inside an Express request (via `capabilityContextMiddleware`),
* duplicate `hasCapability` calls within the same request are served from
* the in-memory Map instead of hitting the database again.
* Outside a request context (background jobs, tests), the store is undefined
* and every check falls through to the database — correct behavior.
*/
declare const capabilityStore: AsyncLocalStorage<CapabilityStore>;
declare function capabilityContextMiddleware(_req: ServerRequest, _res: Response$1, next: NextFunction): void;
/**
* Reads principals from the per-request ALS cache without side effects.
* Returns `undefined` when called outside a request context or before
* `requireCapability` has populated the cache for this user.
*/
declare function getCachedPrincipals(user: CapabilityUser): ResolvedPrincipal[] | undefined;
/**
* Factory that creates `hasCapability` and `requireCapability` with injected
* database methods. Follows the same dependency-injection pattern as
* `generateCheckAccess`.
*/
declare function generateCapabilityCheck(deps: CapabilityDeps): {
  hasCapability: HasCapabilityFn;
  requireCapability: RequireCapabilityFn;
  hasConfigCapability: HasConfigCapabilityFn;
};
//#endregion
//#region src/admin/config.d.ts
interface AdminConfigDeps {
  listAllConfigs: (filter?: {
    isActive?: boolean;
  }, session?: ClientSession) => Promise<IConfig[]>;
  findConfigByPrincipal: (principalType: PrincipalType, principalId: string | Types.ObjectId, options?: {
    includeInactive?: boolean;
  }, session?: ClientSession) => Promise<IConfig | null>;
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
  hasConfigCapability: (user: CapabilityUser, section: ConfigSection | null, verb?: "manage" | "read") => Promise<boolean>;
  hasCapability?: (user: CapabilityUser, capability: SystemCapability) => Promise<boolean>;
  getAppConfig?: (options?: {
    role?: string;
    userId?: string;
    tenantId?: string;
    baseOnly?: boolean;
  }) => Promise<AppConfig>;
  /** Invalidate all config-related caches after a mutation. */
  invalidateConfigCaches?: (tenantId?: string) => Promise<void>;
}
declare function createAdminConfigHandlers(deps: AdminConfigDeps): {
  listConfigs: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getBaseConfig: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getConfig: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  upsertConfigOverrides: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  patchConfigField: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  tombstoneConfigField: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  deleteConfigField: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  deleteConfigOverrides: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  toggleConfig: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
};
//#endregion
//#region src/admin/grants.d.ts
interface AdminGrantsDeps {
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
  getCapabilitiesForPrincipal: (params: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
    tenantId?: string;
  }) => Promise<ISystemGrant[]>;
  getCapabilitiesForPrincipals: (params: {
    principals: Array<{
      principalType: PrincipalType;
      principalId: string | Types.ObjectId;
    }>;
    tenantId?: string;
  }) => Promise<ISystemGrant[]>;
  grantCapability: (params: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
    capability: SystemCapability;
    tenantId?: string;
    grantedBy?: string | Types.ObjectId;
  }) => Promise<{
    grant: ISystemGrant | null;
    created: boolean;
  }>;
  revokeCapability: (params: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
    capability: SystemCapability;
    tenantId?: string;
  }) => Promise<{
    deletedCount: number;
  }>;
  getUserPrincipals: (params: {
    userId: string;
    role?: string | null;
    tenantId?: string;
  }) => Promise<ResolvedPrincipal[]>;
  hasCapabilityForPrincipals: (params: {
    principals: ResolvedPrincipal[];
    capability: SystemCapability;
    tenantId?: string;
  }) => Promise<boolean>;
  getHeldCapabilities: (params: {
    principals: ResolvedPrincipal[];
    capabilities: SystemCapability[];
    tenantId?: string;
  }) => Promise<Set<SystemCapability>>;
  getCachedPrincipals?: (user: {
    id: string;
    role: string;
    tenantId?: string;
  }) => ResolvedPrincipal[] | undefined;
  checkRoleExists?: (roleId: string) => Promise<boolean>;
  /** Optional audit emission. Failure is logged but does not roll back the grant
  * unless `auditFailClosed` is set. */
  recordAuditEntry?: (input: RecordAuditEntryInput, options?: RecordAuditEntryOptions) => Promise<void>;
  /**
  * When true, a failed audit write surfaces as a 5xx instead of being
  * swallowed. The grant itself is already persisted (and grant writes are
  * idempotent upserts), so a client retry is safe; an operator must reconcile
  * the missing audit row. Defaults to fail-open.
  */
  auditFailClosed?: boolean;
}
/** Currently ROLE-only; Record/Set structure preserved for future principal-type expansion. */
type GrantPrincipalType = PrincipalType.ROLE;
/** Creates admin grant handlers with dependency injection for the /api/admin/grants routes. */
declare function createAdminGrantsHandlers(deps: AdminGrantsDeps): {
  listGrants: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getEffectiveCapabilities: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getPrincipalGrants: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  assignGrant: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  revokeGrant: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
};
//#endregion
//#region src/admin/groups.d.ts
type GroupListFilter = Pick<GroupFilterOptions, "source" | "search">;
interface AdminGroupsDeps {
  listGroups: (filter?: GroupListFilter & {
    limit?: number;
    offset?: number;
  }, session?: ClientSession) => Promise<IGroup[]>;
  countGroups: (filter?: GroupListFilter, session?: ClientSession) => Promise<number>;
  findGroupById: (groupId: string | Types.ObjectId, projection?: Record<string, 0 | 1>, session?: ClientSession) => Promise<IGroup | null>;
  createGroup: (groupData: Partial<IGroup>, session?: ClientSession) => Promise<IGroup>;
  updateGroupById: (groupId: string | Types.ObjectId, data: Partial<Pick<IGroup, "name" | "description" | "email" | "avatar">>, session?: ClientSession) => Promise<IGroup | null>;
  deleteGroup: (groupId: string | Types.ObjectId, session?: ClientSession) => Promise<IGroup | null>;
  addUserToGroup: (userId: string | Types.ObjectId, groupId: string | Types.ObjectId, session?: ClientSession) => Promise<{
    user: IUser;
    group: IGroup | null;
  }>;
  removeUserFromGroup: (userId: string | Types.ObjectId, groupId: string | Types.ObjectId, session?: ClientSession) => Promise<{
    user: IUser;
    group: IGroup | null;
  }>;
  removeMemberById: (groupId: string | Types.ObjectId, memberId: string, session?: ClientSession) => Promise<IGroup | null>;
  findUsers: (searchCriteria: FilterQuery<IUser>, fieldsToSelect?: string | string[] | null) => Promise<IUser[]>;
  deleteConfig: (principalType: PrincipalType, principalId: string | Types.ObjectId) => Promise<IConfig | null>;
  deleteAclEntries: (filter: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
  }) => Promise<DeleteResult>;
}
declare function createAdminGroupsHandlers(deps: AdminGroupsDeps): {
  listGroups: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getGroup: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  createGroup: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  updateGroup: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  deleteGroup: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getGroupMembers: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  addGroupMember: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  removeGroupMember: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
};
//#endregion
//#region src/admin/roles.d.ts
type RoleListItem = {
  _id: Types.ObjectId | string;
  name: string;
  description?: string;
};
interface AdminRolesDeps {
  listRoles: (options?: {
    limit?: number;
    offset?: number;
  }) => Promise<RoleListItem[]>;
  countRoles: () => Promise<number>;
  getRoleByName: (name: string, fields?: string | string[] | null) => Promise<IRole | null>;
  createRoleByName: (roleData: Partial<IRole>) => Promise<IRole>;
  updateRoleByName: (name: string, updates: Partial<IRole>) => Promise<IRole | null>;
  updateAccessPermissions: (name: string, perms: Record<string, Record<string, boolean>>, roleData?: IRole) => Promise<void>;
  deleteRoleByName: (name: string) => Promise<IRole | null>;
  findUser: (criteria: FilterQuery<IUser>, fields?: string | string[] | null) => Promise<IUser | null>;
  updateUser: (userId: string, data: Partial<IUser>) => Promise<IUser | null>;
  updateUsersByRole: (oldRole: string, newRole: string) => Promise<void>;
  findUserIdsByRole: (roleName: string) => Promise<string[]>;
  updateUsersRoleByIds: (userIds: string[], newRole: string) => Promise<void>;
  listUsersByRole: (roleName: string, options?: {
    limit?: number;
    offset?: number;
  }) => Promise<IUser[]>;
  countUsersByRole: (roleName: string) => Promise<number>;
  /** Removes the per-principal config override (keyed by type + name, not ObjectId). */
  deleteConfig: (principalType: PrincipalType, principalId: string | Types.ObjectId) => Promise<IConfig | null>;
  /** Removes all ACL entries scoped to this principal. */
  deleteAclEntries: (filter: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
  }) => Promise<void>;
  /** Removes all system capability grants held by this principal and returns
  * the removed grants so each can be audited. */
  deleteGrantsForPrincipal: (principalType: PrincipalType, principalId: string | Types.ObjectId, options?: {
    tenantId?: string;
  }) => Promise<ISystemGrant[]>;
  /** Optional audit emission for grants removed by the role-deletion cascade.
  * Failure is logged but never blocks the deletion (which has already happened). */
  recordAuditEntry?: (input: RecordAuditEntryInput, options?: RecordAuditEntryOptions) => Promise<void>;
}
declare function createAdminRolesHandlers(deps: AdminRolesDeps): {
  listRoles: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getRole: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  createRole: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  updateRole: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  updateRolePermissions: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  deleteRole: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getRoleMembers: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  addRoleMember: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  removeRoleMember: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
};
//#endregion
//#region src/skills/sync/github.d.ts
declare const GITHUB_FINE_GRAINED_TOKEN_RECOMMENDATION = "Use a GitHub fine-grained personal access token scoped to the selected repository with read-only Contents and Metadata permissions.";
type FetchFn = typeof fetch;
type SaveBufferResult = {
  filepath: string;
  source: string;
  storageKey?: string;
  storageRegion?: string;
};
type MaybePromise$2<T> = T | Promise<T>;
type GitHubSkillSyncDeps = {
  getConfig: () => MaybePromise$2<SkillSyncConfig | undefined>;
  getCredentialToken: (provider: SkillSyncProvider, credentialKey: string) => Promise<string | null>;
  getCredentialSummary: (provider: SkillSyncProvider, credentialKey: string) => Promise<SkillSyncCredentialSummary | null>;
  listCredentials: (provider: SkillSyncProvider) => Promise<SkillSyncCredentialSummary[]>;
  listStatuses: (provider: SkillSyncProvider) => Promise<ISkillSyncStatus[]>;
  upsertStatus: (input: SkillSyncStatusInput) => Promise<ISkillSyncStatus>;
  tryAcquireLock: (params: {
    provider: SkillSyncProvider;
    lockOwner: string;
    leaseMs: number;
    tenantId?: string;
  }) => Promise<boolean>;
  refreshLock: (params: {
    provider: SkillSyncProvider;
    lockOwner: string;
    leaseMs: number;
    tenantId?: string;
  }) => Promise<boolean>;
  releaseLock: (params: {
    provider: SkillSyncProvider;
    lockOwner: string;
    tenantId?: string;
  }) => Promise<void>;
  createSkill: (data: CreateSkillInput) => Promise<CreateSkillResult>;
  updateSkill: (params: {
    id: string;
    expectedVersion: number;
    update: UpdateSkillInput;
  }) => Promise<UpdateSkillResult>;
  getSkillById: (id: string | Types.ObjectId) => Promise<(ISkill & {
    _id: Types.ObjectId;
  }) | null>;
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
  listSkillFiles: (skillId: string | Types.ObjectId) => Promise<Array<ISkillFile & {
    _id: Types.ObjectId;
  }>>;
  getSkillFileByPath: (skillId: string | Types.ObjectId, relativePath: string) => Promise<(ISkillFile & {
    _id: Types.ObjectId;
  }) | null>;
  upsertSkillFile: (row: UpsertSkillFileInput) => Promise<ISkillFile & {
    _id: Types.ObjectId;
  }>;
  deleteSkillFile: (skillId: string | Types.ObjectId, relativePath: string) => Promise<{
    deleted: boolean;
  }>;
  deleteSkill: (id: string) => Promise<{
    deleted: boolean;
  }>;
  saveBuffer: (params: {
    userId: string;
    buffer: Buffer;
    fileName: string;
    basePath?: string;
    isImage?: boolean;
    tenantId?: string;
  }) => Promise<SaveBufferResult>;
  deleteFile?: (file: {
    filepath: string;
    source: string;
    storageKey?: string;
    storageRegion?: string;
    user?: Types.ObjectId | string;
    tenantId?: string;
  }) => Promise<void>;
  grantPermission: (params: {
    principalType: string;
    principalId: string | Types.ObjectId | null;
    resourceType: string;
    resourceId: string | Types.ObjectId;
    accessRoleId: string;
    grantedBy: string | Types.ObjectId;
  }) => Promise<unknown>;
  fetchFn?: FetchFn;
  lockOwner?: string;
  allowServerCredentials?: boolean;
};
type GitHubSkillSyncRunResult = {
  status: "started" | "skipped" | "completed" | "failed";
  message?: string;
  sources: Array<ISkillSyncStatus & {
    credentialPresent?: boolean;
  }>;
};
type GitHubSkillSyncStatus = {
  enabled: boolean;
  intervalMinutes: number;
  runOnStartup: boolean;
  sources: Array<ISkillSyncStatus & {
    credentialPresent: boolean;
  }>;
  credentials: SkillSyncCredentialSummary[];
  fineGrainedTokenRecommendation: string;
};
type GitHubSkillSyncRunner = {
  getStatus: () => Promise<GitHubSkillSyncStatus>;
  runOnce: () => Promise<GitHubSkillSyncRunResult>;
};
declare function createGitHubSkillSyncRunner(deps: GitHubSkillSyncDeps): GitHubSkillSyncRunner;
//#endregion
//#region src/skills/sync/orchestrator.d.ts
type MaybePromise$1<T> = T | Promise<T>;
type SkillSyncAppConfigLike = {
  skillSync?: unknown;
  config?: {
    skillSync?: unknown;
  };
};
type SkillSyncRequestUser = {
  tenantId?: string | null;
};
type SkillSyncRequestLike = {
  config?: SkillSyncAppConfigLike;
  user?: SkillSyncRequestUser;
  skillSyncAllowServerCredentials?: boolean;
};
type SkillSyncTriggerLogger = {
  warn: (message: string, metadata?: object) => void;
  error: (message: string, error?: unknown) => void;
};
type SkillSyncTriggerRunnerFactoryInput = {
  getConfig: () => MaybePromise$1<SkillSyncConfig | undefined>;
  loadAppConfig: () => MaybePromise$1<SkillSyncAppConfigLike | undefined>;
  allowServerCredentials?: boolean;
};
type SkillSyncTriggerOrchestratorDeps = {
  createRunner: (input: SkillSyncTriggerRunnerFactoryInput) => GitHubSkillSyncRunner;
  logger: SkillSyncTriggerLogger;
  minIntervalMs?: number;
  staleRunningMs?: number;
  inFlight?: Set<string>;
};
type SkillSyncTriggerOrchestrator = {
  getRunnerForAdminRequest: (request: SkillSyncRequestLike) => GitHubSkillSyncRunner;
  maybeRunForRequest: (request: SkillSyncRequestLike) => Promise<boolean>;
};
declare function createSkillSyncTriggerOrchestrator(deps: SkillSyncTriggerOrchestratorDeps): SkillSyncTriggerOrchestrator;
//#endregion
//#region src/skills/sync/scheduler.d.ts
declare const SKILL_SYNC_MAX_TIMER_INTERVAL_MINUTES: number;
type MaybePromise<T> = T | Promise<T>;
type GitHubSkillSyncScheduler = {
  stop: () => void;
};
declare function startGitHubSkillSyncScheduler(params: {
  getConfig: () => MaybePromise<SkillSyncConfig | undefined>;
  runner: GitHubSkillSyncRunner;
}): GitHubSkillSyncScheduler;
//#endregion
//#region src/admin/skills.d.ts
type AdminSkillsRequest = Request & {
  user?: {
    _id?: Types.ObjectId;
    id?: string;
    tenantId?: string;
  };
  skillSyncAllowServerCredentials?: boolean;
  skillSyncCanReadCredentials?: boolean;
};
type SkillSyncCapabilityUser = {
  id: string;
  role: string;
  tenantId?: string;
};
type AdminSkillSyncDeps = {
  runner?: GitHubSkillSyncRunner;
  getRunner?: (req: Request) => GitHubSkillSyncRunner;
  upsertCredential: (input: UpsertSkillSyncCredentialInput) => Promise<SkillSyncCredentialSummary>;
  deleteCredential: (provider: SkillSyncProvider, credentialKey: string) => Promise<{
    deleted: boolean;
  }>;
};
type AdminSkillSyncAccessDeps = {
  getAppConfig: (options: {
    baseOnly: true;
  }) => Promise<{
    skillSync?: unknown;
  } | undefined>;
  hasCapability: (user: SkillSyncCapabilityUser, capability: SystemCapability) => Promise<boolean>;
};
type AdminSkillsSyncHandler = (req: AdminSkillsRequest, res: Response$1) => Promise<Response$1>;
type AdminSkillsSyncHandlers = {
  getSyncStatus: AdminSkillsSyncHandler;
  runSync: AdminSkillsSyncHandler;
  setCredential: AdminSkillsSyncHandler;
  deleteCredential: (req: Request, res: Response$1) => Promise<Response$1>;
};
type AdminSkillsSyncAccess = {
  attachBaseSkillSyncConfig: RequestHandler;
  attachCredentialReadAccess: RequestHandler;
  requireReadSkills: RequestHandler;
  requirePlatformManageSkills: RequestHandler;
  requireSyncRunCapability: RequestHandler;
};
declare function createAdminSkillsSyncAccess(deps: AdminSkillSyncAccessDeps): AdminSkillsSyncAccess;
declare function createAdminSkillsSyncHandlers(deps: AdminSkillSyncDeps): AdminSkillsSyncHandlers;
//#endregion
//#region src/admin/users.d.ts
interface AdminUsersDeps {
  findUsers: (searchCriteria: FilterQuery<IUser>, fieldsToSelect?: string | string[] | null, options?: {
    limit?: number;
    offset?: number;
    sort?: Record<string, 1 | -1>;
  }) => Promise<IUser[]>;
  countUsers: (filter?: FilterQuery<IUser>) => Promise<number>;
  /**
  * Thin data-layer delete — removes the User document only.
  * Full cascade of user-owned resources (conversations, messages, files, tokens, etc.)
  * is handled by `UserController.deleteUserController` in the self-delete flow.
  * This admin endpoint currently cascades Config and AclEntries.
  * A future iteration should consolidate the full cascade into a shared service function.
  */
  deleteUserById: (userId: string) => Promise<UserDeleteResult>;
  deleteConfig: (principalType: PrincipalType, principalId: string | Types.ObjectId) => Promise<IConfig | null>;
  deleteAclEntries: (filter: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId;
  }) => Promise<void>;
}
declare function createAdminUsersHandlers(deps: AdminUsersDeps): {
  listUsers: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  searchUsers: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  deleteUser: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
};
//#endregion
//#region src/admin/auditLog.d.ts
interface AdminAuditLogDeps {
  listAuditLogPage: (tenantId: string | undefined, filters: AuditLogFilters) => Promise<AuditLogPage>;
  findAuditLogEntry: (tenantId: string | undefined, id: string) => Promise<AdminAuditLogEntry | null>;
  streamAuditLogEntries: (tenantId: string | undefined, filters: Omit<AuditLogFilters, "offset" | "limit" | "cursor">, onEntry: (entry: AdminAuditLogEntry) => void | Promise<void>, options?: {
    isCancelled?: () => boolean;
    maxRows?: number;
  }) => Promise<{
    count: number;
    truncated: boolean;
  }>;
  verifyAuditChain: (tenantId: string | undefined, options?: {
    isCancelled?: () => boolean;
    maxRows?: number;
  }) => Promise<AuditChainVerification>;
}
declare function createAdminAuditLogHandlers(deps: AdminAuditLogDeps): {
  listAuditLog: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  getAuditLogEntry: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  verifyAuditLog: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  exportAuditLogCsv: (req: ServerRequest, res: Response$1) => Promise<Response$1 | void>;
};
//#endregion
//#region src/cdn/azure.d.ts
/**
* Initializes the Azure Blob Service client.
* This function establishes a connection by checking if a connection string is provided.
* If available, the connection string is used; otherwise, Managed Identity (via DefaultAzureCredential) is utilized.
* Note: Container creation (and its public access settings) is handled later in the CRUD functions.
* @returns The initialized client, or null if the required configuration is missing.
*/
declare const initializeAzureBlobService: () => Promise<BlobServiceClient | null>;
/**
* Retrieves the Azure ContainerClient for the given container name.
* @param [containerName=process.env.AZURE_CONTAINER_NAME || 'files'] - The container name.
* @returns The Azure ContainerClient.
*/
declare const getAzureContainerClient: (containerName?: string) => Promise<ContainerClient | null>;
//#endregion
//#region src/cdn/cloudfront.d.ts
interface CloudFrontFullConfig extends NonNullable<CloudFrontConfig> {
  privateKey: string | null;
  keyPairId: string | null;
}
declare function initializeCloudFront(config: CloudFrontConfig): boolean;
declare function getCloudFrontConfig(): Readonly<CloudFrontFullConfig> | null;
//#endregion
//#region src/cdn/cloudfront-cookies.d.ts
declare const CLOUDFRONT_SCOPE_COOKIE = "LibreChat-CloudFront-Scope";
interface CloudFrontCookieScope {
  userId?: string | null;
  tenantId?: string | null;
  storageRegion?: string | null;
  issuedAt?: number | null;
  expiresAt?: number | null;
}
type CloudFrontScopeValue = string | number | {
  toString(): string;
} | null | undefined;
type CloudFrontScopeUser = {
  _id?: CloudFrontScopeValue;
  id?: CloudFrontScopeValue;
  tenantId?: CloudFrontScopeValue;
  orgId?: CloudFrontScopeValue;
  storageRegion?: CloudFrontScopeValue;
};
type CloudFrontCookieRequest = {
  cookies?: Partial<Record<string, string>>;
  user?: CloudFrontScopeUser | null;
};
type CloudFrontAuthCookieRefreshRequest = CloudFrontCookieRequest & {
  cloudFrontAuthCookieRefreshResult?: CloudFrontAuthCookieRefreshResult;
};
type CloudFrontAuthCookieRefreshResult = {
  enabled: boolean;
  attempted: boolean;
  refreshed: boolean;
  reason?: string;
  expiresInSec?: number;
  refreshAfterSec?: number;
};
type CloudFrontCookieRefreshOptions = CloudFrontCookieScope & {
  orgId?: CloudFrontScopeValue;
  force?: boolean;
  refreshWindowSec?: number;
};
declare function getCloudFrontCookieRefreshWindowSec(cookieExpiry?: number): number;
declare function getCloudFrontCookieTiming(): {
  expiresInSec: number;
  refreshAfterSec: number;
  refreshWindowSec: number;
};
declare function parseCloudFrontCookieScope(value: string | null | undefined): CloudFrontCookieScope | null;
declare function resolveCloudFrontCookieScope(req: CloudFrontCookieRequest | null | undefined, user: CloudFrontScopeUser | null | undefined, options?: CloudFrontCookieRefreshOptions): CloudFrontCookieScope;
/**
* Clears CloudFront signed cookies from the response.
* Should be called during logout to revoke CDN access.
*/
declare function clearCloudFrontCookies(res: Response$1, scope?: CloudFrontCookieScope): void;
/**
* Sets CloudFront signed cookies on the response for CDN access.
* Returns true if cookies were set, false if CloudFront cookies are not enabled.
*/
declare function setCloudFrontCookies(res: Response$1, scope?: CloudFrontCookieScope, previousScope?: CloudFrontCookieScope | null): boolean;
declare function maybeRefreshCloudFrontAuthCookies(req: CloudFrontCookieRequest | null | undefined, res: Response$1, user: CloudFrontScopeUser | null | undefined, options?: CloudFrontCookieRefreshOptions): CloudFrontAuthCookieRefreshResult;
declare function forceRefreshCloudFrontAuthCookies(req: CloudFrontCookieRequest | null | undefined, res: Response$1, user: CloudFrontScopeUser | null | undefined, options?: CloudFrontCookieRefreshOptions): CloudFrontAuthCookieRefreshResult;
declare function maybeRefreshCloudFrontAuthCookiesMiddleware(req: CloudFrontAuthCookieRefreshRequest, res: Response$1, next: NextFunction): void;
//#endregion
//#region src/cdn/firebase.d.ts
declare const initializeFirebase: () => firebase.FirebaseApp | null;
declare const getFirebaseStorage: () => FirebaseStorage | null;
//#endregion
//#region src/cdn/s3.d.ts
/**
* Initializes and returns an instance of the AWS S3 client.
*
* If AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are provided, they will be used.
* Otherwise, the AWS SDK's default credentials chain (including IRSA) is used.
*
* If AWS_ENDPOINT_URL is provided, it will be used as the endpoint.
*
* @returns An instance of S3Client if the region is provided; otherwise, null.
*/
declare const initializeS3: () => S3Client | null;
//#endregion
//#region src/auth/ip.d.ts
/**
* Checks if an IP address belongs to a private, reserved, or link-local range.
* Handles IPv4, IPv6, and IPv4-mapped IPv6 addresses (::ffff:A.B.C.D).
*/
declare function isPrivateIP(ip: string): boolean;
//#endregion
//#region src/auth/domain.d.ts
/**
* @param email
* @param allowedDomains
*/
declare function isEmailDomainAllowed(email: string, allowedDomains?: string[] | null): boolean;
/**
* Checks whether a hostname/IP literal and port appear in an admin-supplied
* exemption list. Address match is case-insensitive and bracket-stripped, so
* `[::1]` matches `::1` and `LOCALHOST` matches `localhost` when the port
* also matches.
*
* The normalization and scoping rules live in `./allowedAddresses` so the
* connect-time DNS lookup in `agent.ts` and this preflight helper share a
* single implementation. See that module for the security invariants.
*/
declare function isAddressAllowed(hostnameOrIP: string, allowedAddresses?: string[] | null, port?: string | number | null): boolean;
/**
* Checks if a hostname resolves to a private/reserved IP address.
* Directly validates literal IPv4 and IPv6 addresses without DNS lookup.
* For hostnames, resolves via DNS and checks all returned addresses.
* Fails open on DNS errors (returns false), since the HTTP request would also fail.
*
* When `allowedAddresses` is provided, the hostname/port and any resolved
* IP/port are matched against the list — a match short-circuits to `false`
* so admin-exempted private services bypass the SSRF block.
*/
declare function resolveHostnameSSRF(hostname: string, allowedAddresses?: string[] | null, port?: string | number | null): Promise<boolean>;
/**
* SSRF Protection: Checks if a hostname/IP is a potentially dangerous internal target.
* Blocks private IPs, localhost, cloud metadata IPs, and common internal hostnames.
*
* When `allowedAddresses` is provided, a literal host:port match exempts the
* target — used by admins to permit known-good internal services (self-hosted
* Ollama, Docker host, etc.) without disabling SSRF protection for every port
* on the same host.
*
* @param hostname - The hostname or IP to check
* @param allowedAddresses - Optional admin exemption list of host:port pairs
* @returns true if the target is blocked (SSRF risk), false if safe
*/
declare function isSSRFTarget(hostname: string, allowedAddresses?: string[] | null, port?: string | number | null): boolean;
/**
* Validates domain for OpenAPI Agent Actions (HTTP/HTTPS only).
* SECURITY: WebSocket protocols are NOT allowed per OpenAPI specification.
* @param domain - The domain to check (can include protocol/port)
* @param allowedDomains - List of allowed domain patterns
* @param allowedAddresses - Optional admin exemption list of host:port pairs
*/
declare function isActionDomainAllowed(domain?: string | null, allowedDomains?: string[] | null, allowedAddresses?: string[] | null): Promise<boolean>;
/**
* Extracts full domain spec (protocol://hostname:port) from MCP server config URL.
* Returns the full origin for proper protocol/port matching against allowedDomains.
* @returns The full origin string, or null when:
*   - No `url` property, non-string, or empty (stdio transport — always allowed upstream)
*   - URL string present but cannot be parsed (rejected fail-closed upstream when allowlist active)
*   Callers must distinguish these two null cases; see {@link isMCPDomainAllowed}.
* @param config - MCP server configuration (accepts any config with optional url field)
*/
declare function extractMCPServerDomain(config: Record<string, unknown>): string | null;
/**
* Validates MCP server domain against allowedDomains.
* Supports HTTP, HTTPS, WS, and WSS protocols (per MCP specification).
* Stdio transports (no URL) are always allowed.
* Configs with a non-empty URL that cannot be parsed are rejected fail-closed when an
* allowlist is active, preventing template placeholders (e.g. `{{HOST}}`) from bypassing
* domain validation after `processMCPEnv` resolves them at connection time.
* When no allowlist is configured, unparseable URLs fall through to connection-level
* SSRF protection (`createSSRFSafeUndiciConnect`).
* @param config - MCP server configuration with optional url field
* @param allowedDomains - List of allowed domains (with wildcard support)
*/
declare function isMCPDomainAllowed(config: Record<string, unknown>, allowedDomains?: string[] | null, allowedAddresses?: string[] | null): Promise<boolean>;
/**
* Checks whether an OAuth URL matches any entry in the MCP allowedDomains list,
* honoring protocol and port constraints when specified by the admin.
*
* Mirrors the allowlist-matching logic of {@link isDomainAllowedCore} (hostname,
* protocol, and explicit-port checks) but is synchronous — no DNS resolution is
* needed because the caller is deciding whether to *skip* the subsequent
* SSRF/DNS checks, not replace them.
*
* @remarks `parseDomainSpec` normalizes `www.` prefixes, so both the input URL
* and allowedDomains entries starting with `www.` are matched without that prefix.
*/
declare function isOAuthUrlAllowed(url: string, allowedDomains?: string[] | null, allowedAddresses?: string[] | null): boolean;
/**
* Validates that a user-provided endpoint URL does not target private/internal addresses.
* Throws if the URL is unparseable, uses a non-HTTP(S) scheme, targets a known SSRF hostname,
* or DNS-resolves to a private IP.
*
* When `allowedAddresses` is provided, hostname/IP + port pairs are matched
* against the list — admin-exempted private services bypass the SSRF block.
* This lets operators permit known-good private services (self-hosted Ollama,
* Docker host, etc.) without disabling protection for every port on the same host.
*
* @note DNS rebinding: validation performs a single DNS lookup. An adversary controlling
*   DNS with TTL=0 could respond with a public IP at validation time and a private IP
*   at request time. This is an accepted limitation of point-in-time DNS checks.
* @note Fail-open on DNS errors: a resolution failure here implies a failure at request
*   time as well, matching {@link resolveHostnameSSRF} semantics.
*/
declare function validateEndpointURL(url: string, endpoint: string, allowedAddresses?: string[] | null): Promise<void>;
//#endregion
//#region src/auth/openid.d.ts
type OpenIdEmailClaims = {
  email?: unknown;
  preferred_username?: unknown;
  upn?: unknown;
  [claim: string]: unknown;
};
type OpenIdIssuerSource = {
  iss?: string;
  issuer?: string;
  serverMetadata?: () => {
    issuer?: string;
  } | undefined;
};
type OpenIdLookupField = "openidId" | "idOnTheSource";
type OpenIdUserResolution = {
  user: IUser | null;
  error: string | null;
  migration: boolean;
};
declare function normalizeOpenIdIssuer(issuer: string | undefined): string | undefined;
declare function getOpenIdIssuer(...sources: Array<OpenIdIssuerSource | null | undefined>): string | undefined;
declare function getIssuerBoundConditions(field: OpenIdLookupField, value: string | undefined, openidIssuer: string | undefined): FilterQuery<IUser>[];
declare function isUserIssuerAllowed(user: IUser, openidIssuer: string | undefined): boolean;
/**
* Resolves the OpenID user identifier claim, honoring OPENID_EMAIL_CLAIM before
* email/preferred_username/upn fallbacks.
*/
declare function getOpenIdEmail(claims: OpenIdEmailClaims | null | undefined, strategyName?: string): string | undefined;
/**
* Finds or migrates a user for OpenID authentication
* @returns user object (with migration fields if needed), error message, and whether migration is needed
*/
declare function findOpenIDUser({
  openidId,
  findUser,
  email,
  openidIssuer,
  idOnTheSource,
  strategyName
}: {
  openidId: string;
  findUser: UserMethods["findUser"];
  email?: string;
  openidIssuer?: string;
  idOnTheSource?: string;
  strategyName?: string;
}): Promise<OpenIdUserResolution>;
//#endregion
//#region src/utils/proxy.d.ts
type ProxyEnvConfig = {
  httpProxy?: string;
  httpsProxy?: string;
  noProxy?: string;
};
type HttpsProxyAgentInstance = InstanceType<typeof HttpsProxyAgent>;
declare function getProxyEnvConfig(): ProxyEnvConfig | undefined;
declare function getEnvProxyDispatcher(): Dispatcher | undefined;
declare function getProxyDispatcher(proxyUrl?: string | null): Dispatcher | undefined;
declare function shouldBypassProxy(targetUrl: string | URL, noProxy?: string): boolean;
declare function getProxyUrlForUrl(targetUrl?: string | URL): string | undefined;
declare function getHttpsProxyAgent(targetUrl?: string | URL): HttpsProxyAgentInstance | undefined;
declare function applyAxiosProxyConfig(config: AxiosRequestConfig, targetUrl?: string | URL): AxiosRequestConfig;
declare const getOpenIdProxyDispatcher: () => Dispatcher | undefined;
//#endregion
//#region src/auth/exchange.d.ts
/**
* Gets the admin panel URL from environment or falls back to default.
* @returns The admin panel URL
*/
declare function getAdminPanelUrl(): string;
/**
* User data stored in the exchange cache
*/
interface AdminExchangeUser {
  _id: string;
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  avatar?: string;
  provider?: string;
  openidId?: string;
}
/**
* Data stored in cache for admin OAuth exchange.
*
* `expiresAt` is the absolute expiry of `token` (ms epoch). Used by admin
* panel clients to drive proactive refresh before the bearer expires.
*/
interface AdminExchangeData {
  userId: string;
  user: AdminExchangeUser;
  token: string;
  refreshToken?: string;
  origin?: string;
  codeChallenge?: string;
  expiresAt?: number;
}
/**
* Response from the exchange endpoint
*/
interface AdminExchangeResponse {
  token: string;
  refreshToken?: string;
  user: AdminExchangeUser;
  expiresAt?: number;
}
/**
* Serializes user data for the exchange cache.
* @param user - The authenticated user object
* @returns Serialized user data for admin panel
*/
declare function serializeUserForExchange(user: IUser): AdminExchangeUser;
/**
* Verifies a PKCE code_verifier against a stored code_challenge.
* Uses hex-encoded SHA-256 comparison (not RFC 7636 S256 which uses base64url).
* @param verifier - The code_verifier provided during exchange
* @param challenge - The hex-encoded SHA-256 code_challenge stored during code generation
* @returns True if the verifier matches the challenge
*/
declare function verifyCodeChallenge(verifier: string, challenge: string): boolean;
/**
* Generates an exchange code and stores user data for admin panel OAuth flow.
* @param cache - The Keyv cache instance for storing exchange data
* @param user - The authenticated user object
* @param token - The JWT access token
* @param refreshToken - Optional refresh token for OpenID users
* @param origin - The admin panel origin (scheme://host:port) for origin binding
* @param codeChallenge - PKCE code_challenge (hex-encoded SHA-256 of code_verifier)
* @param expiresAt - Optional absolute expiry of `token` (ms epoch); admin panel uses for proactive refresh
* @returns The generated exchange code
*/
declare function generateAdminExchangeCode(cache: Keyv, user: IUser, token: string, refreshToken?: string, origin?: string, codeChallenge?: string, expiresAt?: number): Promise<string>;
/**
* Exchanges an authorization code for tokens and user data.
* The code is deleted immediately after retrieval (one-time use).
* @param cache - The Keyv cache instance for retrieving exchange data
* @param code - The authorization code to exchange
* @param requestOrigin - The origin of the requesting client for origin binding
* @param codeVerifier - PKCE code_verifier to verify against the stored code_challenge
* @returns The exchange response with token, refreshToken, and user data, or null if invalid/expired
*/
declare function exchangeAdminCode(cache: Keyv, code: string, requestOrigin?: string, codeVerifier?: string): Promise<AdminExchangeResponse | null>;
/** PKCE challenge cache TTL: 5 minutes (enough for user to authenticate with IdP) */
declare const PKCE_CHALLENGE_TTL: number;
/** Regex pattern for valid PKCE challenges: 64 hex characters (SHA-256 hex digest) */
declare const PKCE_CHALLENGE_PATTERN: RegExp;
/** Minimal request shape needed by {@link stripCodeChallenge}. */
interface PkceStrippableRequest {
  query: Record<string, unknown>;
  originalUrl: string;
  url: string;
}
/**
* Strips admin-panel-only params from the request query and URL strings.
*
* openid-client v6's Passport Strategy uses `currentUrl.searchParams.size === 0`
* to distinguish an initial authorization request from an OAuth callback.
* Admin-panel-specific query params would cause the strategy to misclassify the
* request as a callback and return 401.
*
* Applied defensively to all providers to ensure the admin-panel-private
* parameters never reach any Passport strategy.
*/
declare function stripCodeChallenge(req: PkceStrippableRequest): void;
/**
* Stores the admin-panel PKCE challenge in cache, then strips admin-panel-only
* params from the request so they don't interfere with the Passport strategy.
*
* Must be called before `passport.authenticate()` — the two operations are
* logically atomic: read the challenge from the query, persist it, then remove
* those parameters from the request URL.
* @param cache - The Keyv cache instance for storing PKCE challenges.
* @param req - The Express request to read and mutate.
* @param state - The OAuth state value (cache key).
* @param provider - Provider name for logging.
* @returns True if stored (or no challenge provided); false on cache failure.
*/
declare function storeAndStripChallenge(cache: Keyv, req: PkceStrippableRequest, state: string, provider: string): Promise<boolean>;
/**
* Checks if the redirect URI is for the admin panel (cross-origin).
* Uses proper URL parsing to compare origins, handling edge cases where
* both URLs might share the same prefix (e.g., localhost:3000 vs localhost:3001).
*
* @param redirectUri - The redirect URI to check.
* @param adminPanelUrl - The admin panel URL (defaults to ADMIN_PANEL_URL env var)
* @param domainClient - The main client domain
* @returns True if redirecting to admin panel (different origin from main client).
*/
declare function isAdminPanelRedirect(redirectUri: string, adminPanelUrl: string, domainClient: string): boolean;
//#endregion
//#region src/auth/refresh.d.ts
interface AdminRefreshClaims {
  sub?: string;
  iss?: string;
}
/**
* The minimal shape this module needs from an `openid-client` tokenset.
* Avoids a hard import dependency on `openid-client` types in this package.
*/
interface RefreshTokenset {
  access_token?: string;
  refresh_token?: string;
  claims: () => AdminRefreshClaims;
}
interface OpenIDRefreshParams {
  scope?: string;
  audience?: string;
}
interface MintedToken {
  /** Bearer the admin panel will send on subsequent requests. */
  token: string;
  /** Absolute expiry of `token` (ms epoch). Drives the admin panel's proactive refresh. */
  expiresAt: number;
}
interface AdminRefreshDeps {
  findUsers: (filter: FilterQuery<IUser>, projection: string, options: {
    sort: Record<string, 1 | -1>;
    limit: number;
  }) => Promise<IUser[]>;
  getUserById: (id: string, projection: string) => Promise<IUser | null>;
  /**
  * Mints the bearer the admin panel will send on subsequent requests, and
  * reports its absolute expiry. The minter is authoritative for the bearer's
  * lifetime — the helper does not attempt to derive expiry from the IdP's
  * `exp` claim. Default OSS callers pass `generateToken(user, sessionExpiry)`
  * and `Date.now() + sessionExpiry`.
  */
  mintToken: (user: IUser, tokenset: RefreshTokenset) => Promise<MintedToken>;
  /**
  * Authorizes the resolved user against the same admin-access invariant
  * the initial OAuth callback enforces. The IdP refresh token can outlive
  * a capability/role change, so the bearer must not be reissued for a
  * user who no longer holds `ACCESS_ADMIN`. Optional only for backward
  * compatibility with existing callers; route handlers that mint admin
  * bearers should always inject this.
  */
  canAccessAdmin?: (user: IUser) => Promise<boolean>;
  /**
  * Optional post-success hook for forks that need to do additional work
  * with the refreshed tokenset and resolved user (e.g. update a server-side
  * token cache or reconcile downstream session state). Errors thrown here
  * propagate to the route handler.
  */
  onRefreshSuccess?: (user: IUser, tokenset: RefreshTokenset) => Promise<void>;
}
interface AdminRefreshOptions {
  /**
  * Optional user `_id` from the previous admin-panel session. When provided,
  * the resolved user must have a matching `openidId` — otherwise the refresh
  * is rejected as a possible identity-swap attempt.
  */
  userId?: string;
  /**
  * The refresh token the admin panel sent in. Preserved as the response
  * `refreshToken` when the IdP doesn't rotate (Auth0 with rotation off,
  * Microsoft personal accounts in some flows). Without this fallback, the
  * admin panel would receive `undefined` and lose its refresh capability.
  */
  previousRefreshToken?: string;
  /**
  * Issuer URL of the OpenID provider this server trusts. When provided
  * alongside an `iss` claim on the refreshed tokenset, the helper rejects
  * the refresh if the two don't match. Defends against tokensets emitted
  * by an unexpected issuer, even though `IUser` lookup is still keyed by
  * `openidId` alone.
  */
  expectedIssuer?: string;
  /**
  * Trusted tenant id resolved by the route layer (e.g. `getTenantId()` from
  * the pre-auth tenant ALS scope). When provided, the helper:
  *   - constrains the fallback `findUsers` lookup with `tenantId`, and
  *   - asserts a direct `getUserById` result has a matching `tenantId`,
  * so the same `(sub, iss)` existing in another tenant can never resolve
  * here. Multi-tenant deployments MUST pass this. Single-tenant deployments
  * may omit it.
  */
  tenantId?: string;
}
declare class AdminRefreshError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(code: string, status: number, message: string);
}
declare function buildOpenIDRefreshParams(): OpenIDRefreshParams;
/**
* Looks up the active admin user for a freshly-refreshed OpenID tokenset,
* mints the bearer the admin panel should send on subsequent requests, and
* returns the response shape used by `/api/admin/oauth/exchange`.
*
* The route handler is responsible for the IdP `refreshTokenGrant` call;
* this helper takes the resulting tokenset and turns it into an admin-panel
* exchange response.
*/
declare function applyAdminRefresh(tokenset: RefreshTokenset, deps: AdminRefreshDeps, options?: AdminRefreshOptions): Promise<AdminExchangeResponse>;
//#endregion
//#region src/auth/agent.d.ts
/**
* Creates HTTP and HTTPS agents that block TCP connections to private/reserved IP addresses.
* Provides TOCTOU-safe SSRF protection by validating the resolved IP at connect time,
* preventing DNS rebinding attacks where a hostname resolves to a public IP during
* pre-validation but to a private IP when the actual connection is made.
*
* @param allowedAddresses - Optional admin exemption list of host:port pairs that bypass the block.
*/
declare function createSSRFSafeAgents(allowedAddresses?: string[] | null): {
  httpAgent: http$1.Agent;
  httpsAgent: https.Agent;
};
/**
* Returns undici-compatible `connect` options with SSRF-safe DNS lookup.
* Pass the result as the `connect` property when constructing an undici `Agent`.
*
* @param allowedAddresses - Optional admin exemption list of host:port pairs that bypass the block.
*/
declare function createSSRFSafeUndiciConnect(allowedAddresses?: string[] | null, port?: string | number | null): {
  lookup: LookupFunction;
};
//#endregion
//#region src/auth/password.d.ts
interface UserWithPassword {
  password?: string;
  [key: string]: unknown;
}
interface ComparePasswordDeps {
  compare: (candidatePassword: string, hash: string) => Promise<boolean>;
}
/** Compares a candidate password against a user's hashed password. */
declare function comparePassword(user: UserWithPassword, candidatePassword: string, deps: ComparePasswordDeps): Promise<boolean>;
//#endregion
//#region src/auth/invite.d.ts
interface InviteDeps {
  createToken: (data: {
    userId: Types.ObjectId;
    email: string;
    token: string;
    createdAt: number;
    expiresIn: number;
  }) => Promise<unknown>;
  findToken: (filter: {
    token: string;
    email: string;
  }) => Promise<unknown>;
}
/** Creates a new user invite and returns the encoded token. */
declare function createInvite(email: string, deps: InviteDeps): Promise<string | {
  message: string;
}>;
/** Retrieves and validates a user invite by encoded token and email. */
declare function getInvite(encodedToken: string, email: string, deps: InviteDeps): Promise<unknown>;
//#endregion
//#region src/auth/codeapi.d.ts
declare function isCodeApiJwtAuthEnabled(): boolean;
declare function mintCodeApiToken(req: ServerRequest): Promise<string>;
declare function getCodeApiAuthHeaders(req?: ServerRequest): Promise<Record<string, string>>;
//#endregion
//#region src/auth/openidRoleSync.d.ts
type OpenIdRoleSyncClaimSource = "access" | "id" | "userinfo";
type OpenIdRoleSyncOptions = {
  enabled: boolean;
  apiEnabled: boolean;
  claimSource: OpenIdRoleSyncClaimSource;
  claim?: string;
  rolePriority: string[];
  fallbackRole?: string;
};
type OpenIdRoleSyncSelectionInput = {
  currentRole?: string;
  openIdRoleValues?: string | unknown[];
  rolePriority: string[];
  fallbackRole?: string;
};
type OpenIdRoleSyncSelectionResult = {
  selectedRole?: string;
  reason?: "matched_priority" | "kept_current" | "fallback" | "no_matching_role";
};
type OpenIdRolesForOpenIdSyncInput = {
  options: OpenIdRoleSyncOptions;
  accessToken?: string;
  accessClaims?: unknown;
  idToken?: string;
  claims?: unknown;
  userinfo?: unknown;
  decodeToken: (token: string) => unknown;
  resolveGroupOverage?: () => Promise<string[] | null>;
};
type OpenIdRoleSyncRolesLookup = (roleNames: string[], fieldsToSelect?: string | string[] | null) => Promise<Array<{
  name?: string | null;
}> | null | undefined>;
type LibreChatRolesForOpenIdSyncInput = {
  rolePriority: string[];
  fallbackRole?: string;
  getRolesByNames: OpenIdRoleSyncRolesLookup;
  logPrefix?: string;
};
type LibreChatRolesForOpenIdSync = {
  rolePriority: string[];
  fallbackRole?: string;
};
/**
* Reads and validates the OPENID_ROLE_SYNC_* environment configuration.
*/
declare function getOpenIdRoleSyncOptions(env?: NodeJS.ProcessEnv): OpenIdRoleSyncOptions;
/**
* Extracts the configured role claim from the configured OpenID source.
* Callers provide token decoding and optional group-overage resolution.
*/
declare function getOpenIdRolesForOpenIdSync({
  options,
  accessToken,
  accessClaims,
  idToken,
  claims,
  userinfo,
  decodeToken,
  resolveGroupOverage
}: OpenIdRolesForOpenIdSyncInput): Promise<string | unknown[] | undefined>;
/**
* Gets the configured LibreChat roles that OpenID role sync is allowed to assign.
* The names are read from config, checked against storage, and returned as canonical role names.
*/
declare function getLibreChatRolesForOpenIdSync(input: LibreChatRolesForOpenIdSyncInput): Promise<LibreChatRolesForOpenIdSync>;
/**
* Chooses the LibreChat role to assign from normalized OpenID token values and validated config.
* Priority roles win first, then the current fallback role can be preserved, then fallback applies.
*/
declare function selectOpenIdRole(input: OpenIdRoleSyncSelectionInput): OpenIdRoleSyncSelectionResult;
//#endregion
//#region src/apiKeys/service.d.ts
interface ApiKeyServiceDependencies {
  validateAgentApiKey: AllMethods["validateAgentApiKey"];
  createAgentApiKey: AllMethods["createAgentApiKey"];
  listAgentApiKeys: AllMethods["listAgentApiKeys"];
  deleteAgentApiKey: AllMethods["deleteAgentApiKey"];
  getAgentApiKeyById: AllMethods["getAgentApiKeyById"];
  findUser: (query: {
    _id: string | Types.ObjectId;
  }) => Promise<IUser | null>;
}
interface RemoteAgentAccessResult {
  hasAccess: boolean;
  permissions: number;
  agent: {
    _id: Types.ObjectId;
    [key: string]: unknown;
  } | null;
}
declare class AgentApiKeyService {
  private deps;
  constructor(deps: ApiKeyServiceDependencies);
  validateApiKey(apiKey: string): Promise<{
    userId: Types.ObjectId;
    keyId: Types.ObjectId;
  } | null>;
  createApiKey(params: {
    userId: string | Types.ObjectId;
    name: string;
    expiresAt?: Date | null;
  }): Promise<AgentApiKeyCreateResult>;
  listApiKeys(userId: string | Types.ObjectId): Promise<AgentApiKeyListItem[]>;
  deleteApiKey(keyId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<boolean>;
  getApiKeyById(keyId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<AgentApiKeyListItem | null>;
  getUserFromApiKey(apiKey: string): Promise<IUser | null>;
}
declare function createApiKeyServiceDependencies(mongoose: typeof import("mongoose")): ApiKeyServiceDependencies;
interface GetRemoteAgentPermissionsDeps {
  getEffectivePermissions: (params: {
    userId: string;
    role?: string;
    resourceType: ResourceType;
    resourceId: string | Types.ObjectId;
  }) => Promise<number>;
}
/** AGENT owners automatically have full REMOTE_AGENT permissions */
declare function getRemoteAgentPermissions(deps: GetRemoteAgentPermissionsDeps, userId: string, role: string | undefined, resourceId: string | Types.ObjectId): Promise<number>;
declare function checkRemoteAgentAccess(params: {
  userId: string;
  role?: string;
  agentId: string;
  getAgent: (query: {
    id: string;
  }) => Promise<{
    _id: Types.ObjectId;
    [key: string]: unknown;
  } | null>;
  getEffectivePermissions: (params: {
    userId: string;
    role?: string;
    resourceType: ResourceType;
    resourceId: string | Types.ObjectId;
  }) => Promise<number>;
}): Promise<RemoteAgentAccessResult>;
//#endregion
//#region src/apiKeys/middleware.d.ts
interface ApiKeyAuthDependencies {
  validateAgentApiKey: (apiKey: string) => Promise<{
    userId: Types.ObjectId;
    keyId: Types.ObjectId;
  } | null>;
  findUser: (query: {
    _id: string | Types.ObjectId;
  }) => Promise<IUser | null>;
}
interface RemoteAgentAccessDependencies {
  getAgent: (query: {
    id: string;
  }) => Promise<{
    _id: Types.ObjectId;
    [key: string]: unknown;
  } | null>;
  getEffectivePermissions: (params: {
    userId: string;
    role?: string;
    resourceType: ResourceType;
    resourceId: string | Types.ObjectId;
  }) => Promise<number>;
}
interface ApiKeyAuthRequest extends Request {
  user?: IUser & {
    id: string;
  };
  apiKeyId?: Types.ObjectId;
}
interface RemoteAgentAccessRequest extends ApiKeyAuthRequest {
  agent?: {
    _id: Types.ObjectId;
    [key: string]: unknown;
  };
  agentPermissions?: number;
}
declare function createRequireApiKeyAuth(deps: ApiKeyAuthDependencies): (req: ApiKeyAuthRequest, res: Response$1, next: NextFunction) => Promise<Response$1 | undefined>;
declare function createCheckRemoteAgentAccess(deps: RemoteAgentAccessDependencies): (req: RemoteAgentAccessRequest, res: Response$1, next: NextFunction) => Promise<Response$1 | undefined>;
//#endregion
//#region src/apiKeys/handlers.d.ts
interface ApiKeyHandlerDependencies {
  createAgentApiKey: (params: {
    userId: string | Types.ObjectId;
    name: string;
    expiresAt?: Date | null;
  }) => Promise<{
    id: string;
    name: string;
    key: string;
    keyPrefix: string;
    createdAt: Date;
    expiresAt?: Date;
  }>;
  listAgentApiKeys: (userId: string | Types.ObjectId) => Promise<Array<{
    id: string;
    name: string;
    keyPrefix: string;
    lastUsedAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
  }>>;
  deleteAgentApiKey: (keyId: string | Types.ObjectId, userId: string | Types.ObjectId) => Promise<boolean>;
  getAgentApiKeyById: (keyId: string | Types.ObjectId, userId: string | Types.ObjectId) => Promise<{
    id: string;
    name: string;
    keyPrefix: string;
    lastUsedAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
  } | null>;
}
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    _id: Types.ObjectId;
  };
}
declare function createApiKeyHandlers(deps: ApiKeyHandlerDependencies): {
  createApiKey: (req: AuthenticatedRequest, res: Response$1) => Promise<Response$1 | undefined>;
  listApiKeys: (req: AuthenticatedRequest, res: Response$1) => Promise<void>;
  getApiKey: (req: AuthenticatedRequest, res: Response$1) => Promise<Response$1 | undefined>;
  deleteApiKey: (req: AuthenticatedRequest, res: Response$1) => Promise<Response$1 | undefined>;
};
//#endregion
//#region src/apiKeys/permissions.d.ts
interface Principal {
  type: string;
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  source?: string;
  idOnTheSource?: string;
  accessRoleId: string;
  isImplicit?: boolean;
}
interface EnricherDependencies {
  aggregateAclEntries: (pipeline: PipelineStage[]) => Promise<Record<string, unknown>[]>;
  bulkWriteAclEntries: (ops: AnyBulkWriteOperation[], options?: Record<string, unknown>) => Promise<unknown>;
  findRoleByIdentifier: (accessRoleId: string) => Promise<{
    _id: Types.ObjectId;
    permBits: number;
  } | null>;
  logger: {
    error: (msg: string, ...args: unknown[]) => void;
  };
}
interface EnrichResult {
  principals: Principal[];
  entriesToBackfill: Types.ObjectId[];
}
/** Enriches REMOTE_AGENT principals with implicit AGENT owners */
declare function enrichRemoteAgentPrincipals(deps: EnricherDependencies, resourceId: string | Types.ObjectId, principals: Principal[]): Promise<EnrichResult>;
/** Backfills REMOTE_AGENT ACL entries for AGENT owners (fire-and-forget) */
declare function backfillRemoteAgentPermissions(deps: EnricherDependencies, resourceId: string | Types.ObjectId, entriesToBackfill: Types.ObjectId[]): void;
//#endregion
//#region src/mcp/mcpConfig.d.ts
/**
* Centralized configuration for MCP-related environment variables.
* Provides typed access to MCP settings with default values.
*/
declare const mcpConfig: {
  OAUTH_ON_AUTH_ERROR: boolean;
  OAUTH_DETECTION_TIMEOUT: number; /** How long (ms) to wait for the user to complete an OAuth flow before timing out. Default: 10 minutes */
  OAUTH_HANDLING_TIMEOUT: number; /** TTL (ms) for OAuth flow state. Must outlive OAUTH_HANDLING_TIMEOUT so the state survives the wait. Default: 15 minutes */
  OAUTH_FLOW_TTL: number;
  CONNECTION_CHECK_TTL: number;
  /** Max number of `tools/list` pages to request when an MCP server paginates its tool list.
  * Bounds the pagination loop so a misbehaving server cannot stall tool discovery. Default: 50 */
  TOOLS_LIST_MAX_PAGES: number; /** Max total tools to retain from paginated `tools/list` responses. Default: 1000 */
  TOOLS_LIST_MAX_TOOLS: number; /** Max approximate JSON bytes to retain from paginated `tools/list` responses. Default: 5 MiB */
  TOOLS_LIST_MAX_BYTES: number; /** Max elapsed time (ms) for paginated `tools/list` discovery. Default: 30000 */
  TOOLS_LIST_TIMEOUT_MS: number; /** Idle timeout (ms) after which user connections are disconnected. Default: 15 minutes */
  USER_CONNECTION_IDLE_TIMEOUT: number; /** Max connect/disconnect cycles before the circuit breaker trips. Default: 7 */
  CB_MAX_CYCLES: number; /** Sliding window (ms) for counting cycles. Default: 45s */
  CB_CYCLE_WINDOW_MS: number; /** Cooldown (ms) after the cycle breaker trips. Default: 15s */
  CB_CYCLE_COOLDOWN_MS: number; /** Max consecutive failed connection rounds before backoff. Default: 3 */
  CB_MAX_FAILED_ROUNDS: number; /** Sliding window (ms) for counting failed rounds. Default: 120s */
  CB_FAILED_WINDOW_MS: number; /** Base backoff (ms) after failed round threshold is reached. Default: 30s */
  CB_BASE_BACKOFF_MS: number; /** Max backoff cap (ms) for exponential backoff. Default: 300s */
  CB_MAX_BACKOFF_MS: number;
};
//#endregion
//#region src/flow/types.d.ts
type FlowStatus = "PENDING" | "COMPLETED" | "FAILED";
interface FlowMetadata {
  [key: string]: unknown;
}
interface FlowState<T = unknown> {
  type: string;
  status: FlowStatus;
  metadata: FlowMetadata;
  createdAt: number;
  result?: T;
  error?: string;
  completedAt?: number;
  failedAt?: number;
}
interface FlowManagerOptions {
  ttl: number;
  ci?: boolean;
  logger?: Logger;
}
//#endregion
//#region src/mcp/oauth/types.d.ts
interface OAuthMetadata {
  /** OAuth authorization endpoint */
  authorization_endpoint: string;
  /** OAuth token endpoint */
  token_endpoint: string;
  /** OAuth issuer */
  issuer?: string;
  /** Supported scopes */
  scopes_supported?: string[];
  /** Response types supported */
  response_types_supported?: string[];
  /** Grant types supported */
  grant_types_supported?: string[];
  /** Token endpoint auth methods supported */
  token_endpoint_auth_methods_supported?: string[];
  /** Code challenge methods supported */
  code_challenge_methods_supported?: string[];
  /** Dynamic client registration endpoint (RFC 7591) */
  registration_endpoint?: string;
  /** Revocation endpoint */
  revocation_endpoint?: string;
  /** Revocation endpoint auth methods supported */
  revocation_endpoint_auth_methods_supported?: string[];
}
interface OAuthStoredClientMetadata extends OAuthMetadata {
  /** Canonical OAuth resource indicator used when the authorization code was exchanged. */
  resource?: string;
}
interface OAuthProtectedResourceMetadata {
  /** Resource identifier */
  resource: string;
  /** Authorization servers */
  authorization_servers?: string[];
  /** Scopes supported by the resource */
  scopes_supported?: string[];
}
interface OAuthClientInformation {
  /** Client ID */
  client_id: string;
  /** Client secret (optional for public clients) */
  client_secret?: string;
  /** Client name */
  client_name?: string;
  /** Redirect URIs */
  redirect_uris?: string[];
  /** Grant types */
  grant_types?: string[];
  /** Response types */
  response_types?: string[];
  /** Scope */
  scope?: string;
  /** Token endpoint auth method */
  token_endpoint_auth_method?: string;
}
interface MCPOAuthState {
  /** Current step in the OAuth flow */
  step: "discovery" | "registration" | "authorization" | "token_exchange" | "complete" | "error";
  /** Server name */
  serverName: string;
  /** User ID */
  userId: string;
  /** OAuth metadata from discovery */
  metadata?: OAuthMetadata;
  /** Resource metadata */
  resourceMetadata?: OAuthProtectedResourceMetadata;
  /** Client information */
  clientInfo?: OAuthClientInformation;
  /** Authorization URL */
  authorizationUrl?: string;
  /** Code verifier for PKCE */
  codeVerifier?: string;
  /** State parameter for OAuth flow */
  state?: string;
  /** Error information */
  error?: string;
  /** Timestamp */
  timestamp: number;
}
interface MCPOAuthFlowMetadata extends FlowMetadata {
  serverName: string;
  userId: string;
  serverUrl: string;
  state: string;
  codeVerifier?: string;
  clientInfo?: OAuthClientInformation;
  metadata?: OAuthMetadata;
  resourceMetadata?: OAuthProtectedResourceMetadata;
  authorizationUrl?: string;
  /** Custom headers for OAuth token exchange, persisted at flow initiation for the callback. */
  oauthHeaders?: Record<string, string>;
  /** Domain allowlist captured at flow initiation for callback-time SSRF enforcement. */
  allowedDomains?: string[] | null;
  /** Address exemptions captured at flow initiation for callback-time SSRF enforcement. */
  allowedAddresses?: string[] | null;
  /** True when the flow reused a stored client registration from a prior successful OAuth flow */
  reusedStoredClient?: boolean;
  /** Tenant context captured at flow initiation for callback replay (SameSite cookies unavailable on cross-origin redirects) */
  tenantId?: string;
}
interface MCPOAuthTokens extends OAuthTokens {
  /** When the tokens were obtained */
  obtained_at: number;
  /** Calculated expiry time */
  expires_at?: number;
}
/** Extended OAuth tokens that may include refresh token expiry */
interface ExtendedOAuthTokens extends OAuthTokens {
  /** Refresh token expiry in seconds (non-standard, some providers include this) */
  refresh_token_expires_in?: number;
}
//#endregion
//#region src/mcp/oauth/obo.d.ts
interface OboConfig {
  scopes: string;
}
/**
* Function type for performing OBO token exchange.
* Injected from the main API layer since it requires OpenID configuration and caching.
*/
type OboTokenResolver = (user: IUser, accessToken: string, scopes: string, fromCache?: boolean) => Promise<{
  access_token: string;
  expires_in?: number;
}>;
type OboTokenResolutionReason = "missing_upstream_token" | "missing_upstream_access_token" | "empty_exchange_response" | "exchange_failed";
declare class OboTokenResolutionError extends Error {
  readonly reason: OboTokenResolutionReason;
  readonly retryable: boolean;
  readonly userMessage: string;
  override readonly cause?: unknown;
  constructor(reason: OboTokenResolutionReason, userMessage: string, retryable?: boolean, cause?: unknown);
}
/**
* Performs an OBO token exchange for the given user and MCP server OBO config.
* Returns MCPOAuthTokens suitable for injection into the MCP connection.
*/
declare function resolveOboToken(user: IUser, oboConfig: OboConfig, oboTokenResolver: OboTokenResolver): Promise<MCPOAuthTokens>;
/**
* Re-evaluates whether the original author of a DB-stored OBO config still has
* permission to configure OBO. The connection layer calls this before performing
* an OBO token exchange so that retained configs fail closed if the author's role
* is downgraded after the server was created.
*
* Returns true when the author's role grants `MCP_SERVERS.CONFIGURE_OBO`. Any of
* the following degraded states return false (fail closed):
*   - missing author id
*   - user lookup miss / no role
*   - role lookup miss
*   - role missing the CONFIGURE_OBO bit
*/
type GetUserRoleByAuthorId = (authorId: string) => Promise<string | null | undefined>;
type GetRolePermissions = (roleName: string) => Promise<Record<string, Record<string, boolean | undefined>> | null | undefined>;
declare function isOboConfigStillTrusted({
  authorId,
  getUserRoleByAuthorId,
  getRolePermissions
}: {
  authorId: string | undefined;
  getUserRoleByAuthorId: GetUserRoleByAuthorId;
  getRolePermissions: GetRolePermissions;
}): Promise<boolean>;
/**
* Async predicate injected into MCP runtime to gate OBO exchanges per server.
* Returns true when OBO is allowed for the given config, false to fail closed.
*
* The runtime passes `source`, `author`, and `dbId` so the implementation can
* use the same `isUserSourced` semantics as the rest of the MCP layer (a
* missing `source` field on a legacy cached config still falls back to
* `dbId`-presence heuristics).
*/
type OboTrustChecker = (config: {
  source?: string;
  author?: string;
  dbId?: string;
}) => Promise<boolean>;
//#endregion
//#region src/utils/graph.d.ts
/**
* Response from a Graph API token exchange.
*/
interface GraphTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}
/**
* Function type for resolving Graph API tokens via OBO flow.
* This function is injected from the main API layer since it requires
* access to OpenID configuration and caching services.
*/
type GraphTokenResolver = (user: IUser, accessToken: string, scopes: string, fromCache?: boolean) => Promise<GraphTokenResponse>;
/**
* Options for processing Graph token placeholders.
*/
interface GraphTokenOptions {
  user?: IUser;
  graphTokenResolver?: GraphTokenResolver;
  scopes?: string;
}
/**
* Checks if a string contains the Graph token placeholder.
* @param value - The string to check
* @returns True if the placeholder is present
*/
declare function containsGraphTokenPlaceholder(value: string): boolean;
/**
* Checks if any value in a record contains the Graph token placeholder.
* @param record - The record to check (e.g., headers, env vars)
* @returns True if any value contains the placeholder
*/
declare function recordContainsGraphTokenPlaceholder(record: Record<string, string> | undefined): boolean;
/**
* Checks if MCP options contain the Graph token placeholder in connection fields.
* @param options - The MCP options object
* @returns True if any field contains the placeholder
*/
declare function mcpOptionsContainGraphTokenPlaceholder(options: {
  args?: string[];
  headers?: Record<string, string>;
  env?: Record<string, string>;
  oauth?: Record<string, string | string[] | boolean | number | null | undefined>;
  oauth_headers?: Record<string, string>;
  url?: string;
}): boolean;
/**
* Asynchronously resolves Graph token placeholders in a string.
* This function must be called before the synchronous processMCPEnv pipeline.
*
* @param value - The string containing the placeholder
* @param options - Options including user and graph token resolver
* @returns The string with Graph token placeholder replaced
*/
declare function resolveGraphTokenPlaceholder(value: string, options: GraphTokenOptions): Promise<string>;
/**
* Asynchronously resolves Graph token placeholders in a record of string values.
*
* @param record - The record containing placeholders (e.g., headers)
* @param options - Options including user and graph token resolver
* @returns The record with Graph token placeholders replaced
*/
declare function resolveGraphTokensInRecord(record: Record<string, string> | undefined, options: GraphTokenOptions): Promise<Record<string, string> | undefined>;
/**
* Pre-processes MCP options to resolve Graph token placeholders.
* This must be called before processMCPEnv since Graph token resolution is async.
*
* @param options - The MCP options object
* @param graphOptions - Options for Graph token resolution
* @returns The options with Graph token placeholders resolved
*/
declare function preProcessGraphTokens<T extends {
  args?: string[];
  headers?: Record<string, string>;
  env?: Record<string, string>;
  oauth?: Record<string, string | string[] | boolean | number | null | undefined>;
  oauth_headers?: Record<string, string>;
  url?: string;
}>(options: T, graphOptions: GraphTokenOptions): Promise<T>;
//#endregion
//#region src/flow/manager.d.ts
/**
* Lifetime of a PENDING OAuth flow: how long the auth button stays valid and an
* in-flight flow can be reused before it is replaced. Mirrors
* `mcpConfig.OAUTH_HANDLING_TIMEOUT` (`MCP_OAUTH_HANDLING_TIMEOUT`) so the reuse
* window matches the wait the server grants the user. Default: 10 minutes.
*/
declare const PENDING_STALE_MS: number;
/**
* Normalizes an expiration timestamp to milliseconds.
* Timestamps below 10 billion are assumed to be in seconds (valid until ~2286).
*/
declare function normalizeExpiresAt(timestamp: number): number;
declare class FlowStateManager<T = unknown> {
  private keyv;
  private ttl;
  private intervals;
  constructor(store: Keyv, options?: FlowManagerOptions);
  private setupCleanupHandlers;
  /**
  * Flow keys are intentionally NOT tenant-scoped. OAuth callbacks arrive
  * without tenant ALS context (the provider redirect doesn't carry
  * X-Tenant-Id). Flow IDs are random UUIDs with no collision risk, and
  * flow data is ephemeral (TTL-bounded, no sensitive user content).
  */
  private getFlowKey;
  private isTokenExpired;
  /**
  * Stores initial PENDING flow state without starting the monitor loop.
  * Use this when you need to guarantee the state is persisted before
  * performing an action (e.g., an OAuth redirect), then call createFlow()
  * separately to start monitoring for completion.
  */
  initFlow(flowId: string, type: string, metadata?: FlowMetadata): Promise<void>;
  /**
  * Creates a new flow and waits for its completion
  */
  createFlow(flowId: string, type: string, metadata?: FlowMetadata, signal?: AbortSignal): Promise<T>;
  private monitorFlow;
  /**
  * Completes a flow successfully
  */
  completeFlow(flowId: string, type: string, result: T): Promise<boolean>;
  /**
  * Checks if a flow is stale based on its age and status
  * @param flowId - The flow identifier
  * @param type - The flow type
  * @param staleThresholdMs - Age in milliseconds after which a non-pending flow is considered stale (default: 2 minutes)
  * @returns Object with isStale boolean and age in milliseconds
  */
  isFlowStale(flowId: string, type: string, staleThresholdMs?: number): Promise<{
    isStale: boolean;
    age: number;
    status?: string;
  }>;
  /**
  * Marks a flow as failed
  */
  failFlow(flowId: string, type: string, error: Error | string): Promise<boolean>;
  /**
  * Gets current flow state
  */
  getFlowState(flowId: string, type: string): Promise<StoredDataNoRaw<FlowState<T>> | null>;
  /**
  * Creates a new flow and waits for its completion, only executing the handler if no existing flow is found
  * @param flowId - The ID of the flow
  * @param type - The type of flow
  * @param handler - Async function to execute if no existing flow is found
  * @param signal - Optional AbortSignal to cancel the flow
  */
  createFlowWithHandler(flowId: string, type: string, handler: () => Promise<T>, signal?: AbortSignal): Promise<T>;
  /**
  * Deletes a flow state
  */
  deleteFlow(flowId: string, type: string): Promise<boolean>;
}
//#endregion
//#region src/mcp/types/index.d.ts
type StdioOptions = z.infer<typeof StdioOptionsSchema>;
type WebSocketOptions = z.infer<typeof WebSocketOptionsSchema>;
type SSEOptions = z.infer<typeof SSEOptionsSchema>;
type StreamableHTTPOptions = z.infer<typeof StreamableHTTPOptionsSchema>;
type MCPOptions = z.infer<typeof MCPOptionsSchema> & {
  customUserVars?: Record<string, {
    title: string;
    description: string;
  }>;
};
type MCPServers = z.infer<typeof MCPServersSchema>;
interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}
interface LCFunctionTool {
  type: "function";
  ["function"]: LCTool$1;
}
type LCAvailableTools = Record<string, LCFunctionTool>;
type LCManifestTool = TPlugin;
type LCToolManifest = TPlugin[];
interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
  }>;
}
type ConnectionState = "disconnected" | "connecting" | "connected" | "error";
type MCPTool = Tool$1;
type MCPToolListResponse = ListToolsResult;
type ToolContentPart = TextContent | ImageContent | EmbeddedResource | AudioContent;
type MCPToolCallResponse = undefined | {
  _meta?: Record<string, unknown>;
  content?: Array<ToolContentPart>;
  isError?: boolean;
};
type Provider = "google" | "anthropic" | "openai" | "azureopenai" | "openrouter" | "xai" | "deepseek" | "ollama" | "bedrock";
type FormattedContent = {
  type: "text";
  text: string;
} | {
  type: "image";
  inlineData: {
    mimeType: string;
    data: string;
  };
} | {
  type: "image";
  source: {
    type: "base64";
    media_type: string;
    data: string;
  };
} | {
  type: "image_url";
  image_url: {
    url: string;
  };
};
type FileSearchSource = {
  fileId: string;
  relevance: number;
  fileName?: string;
  metadata?: {
    storageType?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
type Artifacts = {
  content?: FormattedContent[];
  [Tools.ui_resources]?: {
    data: UIResource[];
  };
  [Tools.file_search]?: {
    sources: FileSearchSource[];
    fileCitations?: boolean;
  };
  [Tools.web_search]?: SearchResultData;
  files?: Array<{
    id: string;
    name: string;
  }>;
  session_id?: string;
  file_ids?: string[];
} | undefined;
type FormattedContentResult = [string, Artifacts | undefined];
type ImageFormatter = (item: ImageContent) => FormattedContent;
type FormattedToolResponse = FormattedContentResult;
/**
* Origin of an MCP server definition.
* - `'yaml'`   — operator-defined in librechat.yaml, full trust, boot-time init
* - `'config'` — admin-defined via Config override, full trust, lazy init
* - `'user'`   — user-provided via UI, sandboxed (restricted placeholder resolution)
*/
type MCPServerSource = "yaml" | "config" | "user";
type ParsedServerConfig = MCPOptions & {
  url?: string;
  requiresOAuth?: boolean;
  oauthMetadata?: Record<string, unknown> | null;
  capabilities?: string;
  tools?: string;
  toolFunctions?: LCAvailableTools;
  initDuration?: number;
  updatedAt?: number;
  dbId?: string; /** Origin of this server definition — determines trust level and placeholder resolution */
  source?: MCPServerSource; /** True if access is only via agent (not directly shared with user) */
  consumeOnly?: boolean; /** True when inspection failed at startup; the server is known but not fully initialized */
  inspectionFailed?: boolean;
  /**
  * User-id of the creating user (DB-sourced configs only). Used at runtime to gate
  * OBO token exchanges by re-checking the author's CONFIGURE_OBO permission, so a
  * stored config remains safe if the author's role is downgraded.
  */
  author?: string;
};
type AddServerResult = {
  serverName: string;
  config: ParsedServerConfig;
};
interface BasicConnectionOptions {
  serverName: string;
  serverConfig: MCPOptions;
  useSSRFProtection?: boolean;
  allowedDomains?: string[] | null;
  /** Admin exemption list of host:port pairs that bypass the SSRF private-IP block */
  allowedAddresses?: string[] | null;
  /** When true, only resolve customUserVars in processMCPEnv (for DB-stored servers) */
  dbSourced?: boolean;
  /** When true, serverConfig has already gone through processMCPEnv for this request */
  skipEnvProcessing?: boolean;
  /** When true, the connection is intentionally short-lived for a single request/tool call */
  ephemeralConnection?: boolean;
}
/** User context for placeholder resolution in MCP connections (non-OAuth and OAuth alike) */
interface UserConnectionContext {
  user?: IUser;
  customUserVars?: Record<string, string>;
  requestBody?: RequestBody;
  requestScopedConnections?: RequestScopedMCPConnectionStore;
  graphTokenResolver?: GraphTokenResolver;
  connectionTimeout?: number;
}
interface RequestScopedMCPConnectionStore {
  connections: Map<string, unknown>;
  pending: Map<string, Promise<unknown>>;
}
interface OAuthStartOptions {
  expiresAt?: number;
}
type OAuthStartHandler = (authURL: string, options?: OAuthStartOptions) => Promise<void>;
interface OAuthConnectionOptions extends UserConnectionContext {
  useOAuth: true;
  flowManager: FlowStateManager<MCPOAuthTokens | null>;
  tokenMethods?: TokenMethods;
  signal?: AbortSignal;
  oauthStart?: OAuthStartHandler;
  oauthEnd?: () => Promise<void>;
  returnOnOAuth?: boolean;
  oboTokenResolver?: OboTokenResolver;
  oboTrustChecker?: OboTrustChecker;
}
/** Options accepted by UserConnectionManager.getUserConnection. OAuth fields are optional. */
interface UserMCPConnectionOptions extends UserConnectionContext {
  serverName: string;
  forceNew?: boolean;
  ephemeralConnection?: boolean;
  serverConfig?: ParsedServerConfig;
  flowManager?: FlowStateManager<MCPOAuthTokens | null>;
  tokenMethods?: TokenMethods;
  signal?: AbortSignal;
  oauthStart?: OAuthStartHandler;
  oauthEnd?: () => Promise<void>;
  returnOnOAuth?: boolean;
  oboTokenResolver?: OboTokenResolver;
  oboTrustChecker?: OboTrustChecker;
}
interface ToolDiscoveryOptions {
  serverName: string;
  user?: IUser;
  flowManager?: FlowStateManager<MCPOAuthTokens | null>;
  tokenMethods?: TokenMethods;
  signal?: AbortSignal;
  oauthStart?: OAuthStartHandler;
  customUserVars?: Record<string, string>;
  requestBody?: RequestBody;
  graphTokenResolver?: GraphTokenResolver;
  connectionTimeout?: number;
  /** Pre-resolved config-source servers for tenant-scoped lookup */
  configServers?: Record<string, ParsedServerConfig>;
  oboTokenResolver?: OboTokenResolver;
  oboTrustChecker?: OboTrustChecker;
}
interface ToolDiscoveryResult {
  tools: Tool$1[] | null;
  oauthRequired: boolean;
  oauthUrl: string | null;
}
//#endregion
//#region src/mcp/registry/MCPServersRegistry.d.ts
/** Request context for resolving the effective MCP allowlists. */
interface MCPAllowlistContext {
  userId?: string;
  role?: string;
}
/**
* Resolves the effective `mcpSettings` allowlists for a request. Injected from the app
* layer (where the merged, tenant-scoped config lives) so the registry keeps no app-config
* dependency. Reads the ALS tenant context internally; pass the acting user to also pick up
* user/role-scoped overrides.
*/
type MCPAllowlistResolver = (ctx?: MCPAllowlistContext) => Promise<{
  allowedDomains?: string[] | null;
  allowedAddresses?: string[] | null;
}>;
/**
* Central registry for managing MCP server configurations.
* Authoritative source of truth for all MCP servers provided by LibreChat.
*
* Uses a three-layer architecture:
* - YAML Cache (cacheConfigsRepo): Operator-defined configs loaded at startup (in-memory or Redis)
* - Config Cache (configCacheRepo): Admin-defined configs from Config overrides, lazily initialized
* - DB Repository (dbConfigsRepo): User-provided configs created at runtime (MongoDB + ACL)
*
* Query priority: Config cache → YAML cache → DB.
*/
declare class MCPServersRegistry {
  private static instance;
  private readonly dbConfigsRepo;
  private readonly cacheConfigsRepo;
  private readonly configCacheRepo;
  /** YAML-derived base allowlists; used at boot and as the fallback when no resolver is set. */
  private readonly allowedDomains?;
  private readonly allowedAddresses?;
  /** Resolves the per-request (tenant-scoped) merged allowlists; falls back to the base above. */
  private readonly allowlistResolver?;
  private readonly readThroughCache;
  private readonly readThroughCacheAll;
  private readonly pendingGetAllPromises;
  /** Tracks in-flight config server initializations to prevent duplicate work. */
  private readonly pendingConfigInits;
  /** Memoized YAML server names — set once after boot-time init, never changes. */
  private yamlServerNames;
  private yamlServerNamesPromise;
  constructor(mongoose: typeof import("mongoose"), allowedDomains?: string[] | null, allowedAddresses?: string[] | null, allowlistResolver?: MCPAllowlistResolver);
  /** Creates and initializes the singleton MCPServersRegistry instance */
  static createInstance(mongoose: typeof import("mongoose"), allowedDomains?: string[] | null, allowedAddresses?: string[] | null, allowlistResolver?: MCPAllowlistResolver): MCPServersRegistry;
  /** Returns the singleton MCPServersRegistry instance */
  static getInstance(): MCPServersRegistry;
  /** YAML base allowlist (boot/fallback). For request-time decisions use {@link resolveAllowlists}. */
  getAllowedDomains(): string[] | null | undefined;
  /** YAML base allowlist (boot/fallback). For request-time decisions use {@link resolveAllowlists}. */
  getAllowedAddresses(): string[] | null | undefined;
  /** Returns true when no explicit allowedDomains allowlist is configured, enabling SSRF TOCTOU protection */
  shouldEnableSSRFProtection(): boolean;
  /**
  * Resolves the effective domain/address allowlists for the current request.
  *
  * MCP allowlists live in `mcpSettings`, which is tenant/principal-scoped admin config, so
  * they must be read per-request from the merged config — not from a process-global value
  * that would leak across tenants. The injected resolver reads the ALS tenant context; pass
  * the acting user so user/role-scoped overrides resolve too (config-source inspection has no
  * user and resolves at tenant scope). Falls back to the YAML base allowlists when no resolver
  * is injected or the resolver fails, so a transient lookup error fails to the operator's
  * baseline rather than disabling the allowlist.
  */
  resolveAllowlists(ctx?: MCPAllowlistContext): Promise<{
    allowedDomains?: string[] | null;
    allowedAddresses?: string[] | null;
    useSSRFProtection: boolean;
  }>;
  /**
  * Returns the config for a single server, mirroring the precedence used by
  * getAllServerConfigs so list views and single-server lookups agree on
  * the same name:
  *   1. user-tier base entry wins absolutely over a config-tier candidate
  *   2. healthy YAML/DB base wins over a failed (inspectionFailed) candidate
  *   3. healthy candidate overlays its fields onto the base, preserving the
  *      base entry's source tag so downstream recovery routes correctly
  *   4. with no base, the candidate is returned as-is (config-only server)
  *
  * readThroughCache memoizes only the global YAML/DB lookup; the per-call
  * configServers candidate is tenant-scoped and is never cached, so a
  * failed stub from one tenant can never satisfy a no-userId lookup from
  * another.
  */
  getServerConfig(serverName: string, userId?: string, configServers?: Record<string, ParsedServerConfig>): Promise<ParsedServerConfig | undefined>;
  /**
  * Returns the full server config map after merging YAML cache, Config-tier overrides,
  * and User-DB entries.
  *
  * Precedence (lowest to highest): YAML cache > Config-tier overrides (success only) > User DB.
  * Two guards keep the merge safe:
  *   1. Config-tier entries carrying `inspectionFailed: true` never overlay an existing
  *      base entry; the healthy base is preserved for the duration of the retry window.
  *   2. User-DB entries (`source: 'user'`) are never replaced by Config-tier overlays.
  * On a successful overlay the base entry's `source` field is preserved so downstream
  * recovery logic routes to the correct storage location.
  */
  getAllServerConfigs(userId?: string, configServers?: Record<string, ParsedServerConfig>, role?: string): Promise<Record<string, ParsedServerConfig>>;
  /**
  * Returns YAML + user-DB server configs, cached via `readThroughCacheAll`.
  * YAML wins on name collisions so a user-created server cannot hide global config.
  * Always called by `getAllServerConfigs` so the DB query is amortized across
  * requests within the TTL window regardless of whether `configServers` is present.
  */
  private getBaseServerConfigs;
  private fetchBaseServerConfigs;
  /**
  * Stores a minimal config stub so the server remains "known" to the registry
  * even when inspection fails at startup. This enables reinitialize to recover.
  */
  addServerStub(serverName: string, config: MCPOptions, storageLocation: "CACHE", userId?: string): Promise<AddServerResult>;
  addServer(serverName: string, config: MCPOptions, storageLocation: "CACHE" | "DB", userId?: string, reservedServerNames?: Iterable<string>): Promise<AddServerResult>;
  /**
  * Re-inspects a server that previously failed initialization.
  * Uses the stored stub config to attempt a full inspection and replaces the stub on success.
  */
  reinspectServer(serverName: string, storageLocation: "CACHE" | "DB", userId?: string): Promise<AddServerResult>;
  updateServer(serverName: string, config: MCPOptions, storageLocation: "CACHE" | "DB", userId?: string): Promise<ParsedServerConfig>;
  /**
  * Ensures that config-source MCP servers (from admin Config overrides) are initialized.
  * Identifies servers in `resolvedMcpConfig` that are not from YAML, lazily initializes
  * any not yet in the config cache, and returns their parsed configs.
  *
  * Config cache keys are scoped by a hash of the raw config to prevent cross-tenant
  * cache poisoning when two tenants define a server with the same name but different configs.
  */
  ensureConfigServers(resolvedMcpConfig: Record<string, MCPOptions>): Promise<Record<string, ParsedServerConfig>>;
  /**
  * Returns true when `rawConfig` matches the YAML cache entry for this server
  * on every admin-configurable field, so an unmodified YAML-defined server
  * can skip lazy-init and avoid being re-inspected or shadowed in the
  * config tier.
  */
  private isUnmodifiedYamlServer;
  /**
  * Ensures a single config-source server is initialized.
  * Cache key is scoped by config hash to prevent cross-tenant poisoning.
  * Deduplicates concurrent init requests for the same server+config.
  * Stale failure stubs are retried after `CONFIG_STUB_RETRY_MS` to recover from transient errors.
  */
  private ensureSingleConfigServer;
  /**
  * Lazily initializes a config-source MCP server: inspects capabilities/tools, then
  * stores the parsed config in the config cache with `source: 'config'`.
  */
  private lazyInitConfigServer;
  /**
  * Writes a config to `configCacheRepo` using the atomic upsert operation.
  * Safe for cross-process races — the underlying cache handles add-or-update internally.
  */
  private upsertConfigCache;
  /**
  * Clears the config-source server cache, forcing re-inspection on next access.
  * Called when admin config overrides change (e.g., mcpServers mutation).
  *
  * @returns Names of servers that were evicted from the config cache.
  *          Callers should disconnect active connections for these servers.
  */
  invalidateConfigCache(): Promise<string[]>;
  getOAuthServers(userId?: string): Promise<Set<string>>;
  reset(): Promise<void>;
  removeServer(serverName: string, storageLocation: "CACHE" | "DB", userId?: string): Promise<void>;
  private getConfigRepository;
  private getReadThroughCacheKey;
  private invalidateServerReadCaches;
  private getOperatorManagedServerNames;
  private parseServerNameFromConfigCacheKey;
  private warnOnOperatorManagedNameCollisions;
  private resetYamlServerNamesMemo;
  /**
  * Returns memoized YAML server names. Populated lazily on first call after boot/reset.
  * YAML servers don't change after boot, so this avoids repeated `getAll()` calls.
  * Uses promise deduplication to prevent concurrent cold-start double-fetch.
  */
  private getYamlServerNames;
  /**
  * Produces a config-cache key scoped by server name AND a hash of the raw config plus the
  * effective allowlists. Hashing the raw config prevents cross-tenant poisoning when two
  * tenants define the same server name with different configurations; hashing the allowlists
  * prevents poisoning when the same config resolves differently because tenants have different
  * `mcpSettings.allowedDomains` / `allowedAddresses` (so one tenant's inspection result — e.g.
  * an `inspectionFailed` stub from a rejected domain — never satisfies another tenant's lookup).
  */
  private configCacheKey;
}
//#endregion
//#region src/mcp/oauth/handler.d.ts
declare class MCPOAuthHandler {
  private static readonly FLOW_TYPE;
  /**
  * Creates a fetch function with custom headers injected
  */
  private static createOAuthFetch;
  /**
  * Discovers OAuth metadata from the server
  */
  private static discoverMetadata;
  /**
  * Discovers OAuth authorization server metadata, retrying with just the origin
  * when discovery fails for a path-based URL. Shared implementation used by
  * `discoverMetadata` and both `refreshOAuthTokens` branches.
  */
  private static discoverWithOriginFallback;
  private static hasUnpinnedClientSecret;
  static buildStoredClientMetadata(metadata?: OAuthMetadata, resourceMetadata?: OAuthProtectedResourceMetadata): OAuthStoredClientMetadata | undefined;
  private static appendResourceParameter;
  private static assertNoUnpinnedClientSecret;
  /**
  * Registers an OAuth client dynamically
  */
  private static registerOAuthClient;
  /**
  * Initiates the OAuth flow for an MCP server
  */
  static initiateOAuthFlow(serverName: string, serverUrl: string, userId: string, oauthHeaders: Record<string, string>, config?: MCPOptions$1["oauth"], allowedDomains?: string[] | null, findToken?: TokenMethods["findToken"], allowedAddresses?: string[] | null, tenantId?: string): Promise<{
    authorizationUrl: string;
    flowId: string;
    flowMetadata: MCPOAuthFlowMetadata;
  }>;
  /**
  * Completes the OAuth flow by exchanging the authorization code for tokens.
  *
  * The token exchange reuses the SSRF policy captured during
  * {@link initiateOAuthFlow} and enforces it again at connect time. This closes
  * DNS rebinding gaps between the preflight validation and the callback request.
  */
  static completeOAuthFlow(flowId: string, authorizationCode: string, flowManager: FlowStateManager<MCPOAuthTokens>, oauthHeaders: Record<string, string>): Promise<MCPOAuthTokens>;
  /**
  * Gets the OAuth flow metadata
  */
  static getFlowState(flowId: string, flowManager: FlowStateManager<MCPOAuthTokens>): Promise<MCPOAuthFlowMetadata | null>;
  /**
  * Generates a flow ID for the OAuth flow
  * @returns Consistent ID so concurrent requests share the same flow
  */
  static generateFlowId(userId: string, serverName: string, tenantId?: string): string;
  static parseFlowId(flowId: string): {
    userId: string;
    serverName: string;
    tenantId?: string;
  } | null;
  /** Same shape as `generateFlowId`; kept distinct so token-fetch flows can diverge from OAuth flows */
  static generateTokenFlowId(userId: string, serverName: string, tenantId?: string): string;
  /**
  * Generates a secure state parameter
  */
  private static generateState;
  /**
  * Enforces RFC 9728 §3.3 / §7.3: the `resource` identifier advertised by an OAuth
  * Protected Resource Metadata document MUST match the URL the client used to fetch
  * the document. A mismatch means the metadata is attacker-controlled (or the server
  * is badly misconfigured); per the RFC the whole document MUST be discarded, and in
  * practice we must fail the OAuth flow because `authorization_servers` on the same
  * document is also untrustworthy and was the primary theft vector in
  * GHSA-gvpj-vm2f-2m23.
  *
  * Uses the MCP SDK's own {@link checkResourceAllowed} so the semantics (same origin
  * plus configured-path-prefix) match what the SDK enforces internally via
  * {@link selectResourceURL}, a code path LibreChat does not go through.
  */
  private static assertResourceBoundToServer;
  /**
  * Validates an OAuth URL is not targeting a private/internal address.
  * Skipped when the full URL (hostname + protocol + port) matches an admin-trusted
  * allowedDomains entry, honoring protocol/port constraints when the admin specifies them.
  *
  * SECURITY: when `allowedDomains` is configured and the URL did NOT match it
  * (i.e., we are in the SSRF fallback path because the admin's strict bound
  * rejected this URL), the address exemption must NOT broaden that bound — a
  * malicious MCP server could otherwise advertise OAuth metadata at any
  * private address the admin permitted for an unrelated purpose (e.g. a
  * self-hosted LLM). When `allowedDomains` is empty, `allowedAddresses` is
  * the only opt-in mechanism for permitting private OAuth endpoints, so it
  * is consulted normally.
  */
  private static validateOAuthUrl;
  private static readonly STATE_MAP_TYPE;
  /**
  * Stores a mapping from the opaque OAuth state parameter to the flowId.
  * This allows the callback to resolve the flowId from an unguessable state
  * value, preventing attackers from forging callback requests.
  */
  static storeStateMapping(state: string, flowId: string, flowManager: FlowStateManager<MCPOAuthTokens | null>): Promise<void>;
  /**
  * Resolves an opaque OAuth state parameter back to the original flowId.
  * Returns null if the state is not found (expired or never stored).
  */
  static resolveStateToFlowId(state: string, flowManager: FlowStateManager<MCPOAuthTokens | null>): Promise<string | null>;
  /**
  * Deletes an orphaned state mapping when a flow is replaced.
  * Prevents old authorization URLs from resolving after a flow restart.
  */
  static deleteStateMapping(state: string, flowManager: FlowStateManager<MCPOAuthTokens | null>): Promise<void>;
  /**
  * Gets the default redirect URI for a server
  */
  private static getDefaultRedirectUri;
  /**
  * Processes and logs a token refresh response from an OAuth server.
  * Normalizes the response to MCPOAuthTokens format and logs debug info about refresh token rotation.
  */
  private static processRefreshResponse;
  /**
  * Posts a `refresh_token` grant, transparently retrying without the `scope`
  * parameter when — and only when — the authorization server rejects the request
  * because of that parameter.
  *
  * RFC 6749 §6 makes `scope` optional on refresh (the server reuses the originally
  * granted scope when it is omitted). LibreChat sends it by default because some
  * servers expect it, but others — notably Salesforce — reject any `scope` on the
  * refresh grant with HTTP 400 "scope parameter not supported". A failed refresh
  * forces a full re-authentication, which on multi-replica deployments amplifies the
  * PKCE retry storm, so we recover automatically instead of surfacing the failure.
  */
  private static postRefreshRequest;
  /**
  * Narrowly detects "this server does not accept a `scope` parameter on the refresh
  * grant" so the retry-without-scope fallback can never mask unrelated refresh
  * failures (e.g. `invalid_grant` for an expired/revoked refresh token). Matches the
  * RFC 6749 `invalid_scope` error and Salesforce's "scope parameter not supported".
  */
  private static isScopeParameterRejection;
  /**
  * Refreshes OAuth tokens using a refresh token
  */
  static refreshOAuthTokens(refreshToken: string, metadata: {
    serverName: string;
    serverUrl?: string;
    clientInfo?: OAuthClientInformation;
    storedTokenEndpoint?: string;
    storedAuthMethods?: string[];
    resource?: string;
  }, oauthHeaders: Record<string, string>, config?: MCPOptions$1["oauth"], allowedDomains?: string[] | null, allowedAddresses?: string[] | null, signal?: AbortSignal): Promise<MCPOAuthTokens>;
  /**
  * Revokes OAuth tokens at the authorization server (RFC 7009)
  */
  static revokeOAuthToken(serverName: string, token: string, tokenType: "refresh" | "access", metadata: {
    serverUrl: string;
    clientId: string;
    clientSecret: string;
    revocationEndpoint?: string;
    revocationEndpointAuthMethodsSupported?: string[];
  }, oauthHeaders?: Record<string, string>, allowedDomains?: string[] | null, allowedAddresses?: string[] | null): Promise<void>;
}
//#endregion
//#region src/mcp/oauth/tokens.d.ts
declare class ReauthenticationRequiredError extends Error {
  constructor(serverName: string, reason: "expired" | "missing" | "invalid_client");
}
interface StoreTokensParams {
  userId: string;
  serverName: string;
  tokens: OAuthTokens | ExtendedOAuthTokens | MCPOAuthTokens;
  createToken: TokenMethods["createToken"];
  updateToken?: TokenMethods["updateToken"];
  findToken?: TokenMethods["findToken"];
  clientInfo?: OAuthClientInformation$1;
  metadata?: Partial<OAuthStoredClientMetadata>;
  /** Optional: Pass existing token state to avoid duplicate DB calls */
  existingTokens?: {
    accessToken?: IToken | null;
    refreshToken?: IToken | null;
    clientInfoToken?: IToken | null;
  };
}
interface GetTokensParams {
  userId: string;
  serverName: string;
  findToken: TokenMethods["findToken"];
  refreshTokens?: (refreshToken: string, metadata: {
    userId: string;
    serverName: string;
    identifier: string;
    clientInfo?: OAuthClientInformation$1;
    storedTokenEndpoint?: string;
    storedAuthMethods?: string[];
    resource?: string;
  }, signal?: AbortSignal) => Promise<MCPOAuthTokens>;
  createToken?: TokenMethods["createToken"];
  updateToken?: TokenMethods["updateToken"];
  /** Enables cleanup of stale client registration and refresh token on invalid_client errors during refresh. */
  deleteTokens?: TokenMethods["deleteTokens"];
  signal?: AbortSignal;
}
declare class MCPTokenStorage {
  static getLogPrefix(userId: string, serverName: string): string;
  /**
  * Stores OAuth tokens for an MCP server
  *
  * @param params.existingTokens - Optional: Pass existing token state to avoid duplicate DB calls.
  * This is useful when refreshing tokens, as getTokens() already has the token state.
  */
  static storeTokens({
    userId,
    serverName,
    tokens,
    createToken,
    updateToken,
    findToken,
    clientInfo,
    existingTokens,
    metadata
  }: StoreTokensParams): Promise<void>;
  /**
  * Forces a refresh of OAuth tokens using the stored refresh token, regardless
  * of whether the access token appears locally expired. Use this when the
  * server has signaled token invalidity (e.g. a 401 mid-session) — the 401 is
  * the authoritative signal, not the local `expires_at`.
  *
  * Returns the new tokens, or `null` when refresh is not possible (no refresh
  * token stored, no refresh callback, etc.). Throws `ReauthenticationRequiredError`
  * when the refresh server response indicates the client registration is stale.
  */
  static forceRefreshTokens({
    userId,
    serverName,
    findToken,
    createToken,
    updateToken,
    deleteTokens,
    refreshTokens,
    existingAccessToken,
    existingRefreshToken,
    signal
  }: GetTokensParams & {
    existingAccessToken?: IToken | null;
    existingRefreshToken?: IToken | null;
  }): Promise<MCPOAuthTokens | null>;
  /**
  * Retrieves OAuth tokens for an MCP server
  */
  static getTokens({
    userId,
    serverName,
    findToken,
    createToken,
    updateToken,
    deleteTokens,
    refreshTokens
  }: GetTokensParams): Promise<MCPOAuthTokens | null>;
  static getClientInfoAndMetadata({
    userId,
    serverName,
    findToken
  }: {
    userId: string;
    serverName: string;
    findToken: TokenMethods["findToken"];
  }): Promise<{
    clientInfo: OAuthClientInformation$1;
    clientMetadata: Record<string, unknown>;
  } | null>;
  /** Deletes only the stored client registration for a specific user and server */
  static deleteClientRegistration({
    userId,
    serverName,
    deleteTokens
  }: {
    userId: string;
    serverName: string;
    deleteTokens: TokenMethods["deleteTokens"];
  }): Promise<void>;
  /**
  * Deletes all OAuth-related tokens for a specific user and server
  */
  static deleteUserTokens({
    userId,
    serverName,
    deleteToken
  }: {
    userId: string;
    serverName: string;
    deleteToken: (filter: {
      userId: string;
      type: string;
      identifier: string;
    }) => Promise<void>;
  }): Promise<void>;
}
//#endregion
//#region src/mcp/oauth/detectOAuth.d.ts
interface OAuthDetectionResult {
  requiresOAuth: boolean;
  method: "protected-resource-metadata" | "401-challenge-metadata" | "no-metadata-found";
  metadata?: Record<string, unknown> | null;
}
/**
* Detects if an MCP server requires OAuth authentication using proactive discovery methods.
*
* Strategy (RFC 9728 §5.1 aligned):
* 1. Probe the server for a 401 challenge and extract the `resource_metadata` URL from
*    the `WWW-Authenticate` header, if any.
* 2. Call the SDK's Protected Resource Metadata discovery. When the hint is present it
*    overrides the path-aware well-known endpoint, matching the behavior of Claude
*    Desktop / MCP Inspector / Copilot and avoiding stale path-aware metadata.
* 3. If no metadata was found but the server advertised `Bearer`, report OAuth-required
*    without metadata (legacy servers without `.well-known` still need auth).
* 4. Optional fallback: treat any 401/403 as an OAuth requirement when
*    `MCP_OAUTH_ON_AUTH_ERROR=true`.
*
* @param serverUrl - The MCP server URL to check for OAuth requirements
*/
declare function detectOAuthRequirement(serverUrl: string, allowedDomains?: string[] | null, allowedAddresses?: string[] | null): Promise<OAuthDetectionResult>;
//#endregion
//#region src/mcp/oauth/methods.d.ts
type ClientAuthMethod = "client_secret_basic" | "client_secret_post" | "none";
/** Maps a user-facing `TokenExchangeMethodEnum` to an OAuth auth method string. */
declare function getForcedTokenEndpointAuthMethod(tokenExchangeMethod?: TokenExchangeMethodEnum): "client_secret_basic" | "client_secret_post" | undefined;
/**
* Selects the auth method to request during dynamic client registration.
*
* Priority:
* 1. Forced override from `tokenExchangeMethod` config
* 2. First credential-based method from server's advertised list (skips `none` per RFC 7591 —
*    `none` declares a public client, which is incorrect for DCR with a generated secret)
* 3. `none` if the server only advertises `none`
* 4. Server's first listed method (unsupported exotic method — best-effort)
* 5. Falls through to `undefined` (caller keeps its default)
*/
declare function selectRegistrationAuthMethod(serverAdvertised: string[] | undefined, tokenExchangeMethod?: TokenExchangeMethodEnum): string | undefined;
/**
* Resolves the auth method for token endpoint requests (refresh, pre-configured flows).
*
* Priority:
* 1. Forced override from `tokenExchangeMethod` config
* 2. Preferred method from client registration response (`clientInfo.token_endpoint_auth_method`)
* 3. First match from server's advertised methods
*/
declare function resolveTokenEndpointAuthMethod(options: {
  tokenExchangeMethod?: TokenExchangeMethodEnum;
  tokenAuthMethods: string[];
  preferredMethod?: string;
}): "client_secret_basic" | "client_secret_post" | undefined;
/**
* Infers the client auth method from request state when `clientInfo.token_endpoint_auth_method`
* is not set. Used inside the fetch wrapper to determine how credentials were applied by the SDK.
*
* Per RFC 8414 Section 2, defaults to `client_secret_basic` for confidential clients.
*/
declare function inferClientAuthMethod(hasAuthorizationHeader: boolean, hasBodyClientId: boolean, hasBodyClientSecret: boolean, hasClientSecret: boolean): ClientAuthMethod;
//#endregion
//#region src/mcp/oauth/pending.d.ts
type PendingOAuthFlowState = Pick<FlowState<MCPOAuthTokens | null>, "createdAt" | "metadata" | "status">;
type PendingOAuthFlowManager = Pick<FlowStateManager<MCPOAuthTokens | null>, "getFlowState">;
type PendingOAuthStart = {
  authURL: string;
  options?: OAuthStartOptions;
};
type ReplayablePendingMCPOAuthStartOptions = {
  flowManager?: PendingOAuthFlowManager | null;
  userId: string;
  serverName: string;
};
declare function getReplayablePendingMCPOAuthStartFromFlow(flow: PendingOAuthFlowState | null | undefined, now?: number): PendingOAuthStart | undefined;
declare function getReplayablePendingMCPOAuthStart({
  flowManager,
  userId,
  serverName
}: ReplayablePendingMCPOAuthStartOptions): Promise<PendingOAuthStart | undefined>;
//#endregion
//#region src/mcp/oauth/events.d.ts
type OAuthPromptOptions = {
  expiresAt?: number;
};
type OAuthToolCall = {
  id?: string;
  name: string;
  type: "tool_call" | "tool_call_chunk";
  args?: string;
  output?: string;
};
declare function getOAuthPromptExpiresAt(options?: OAuthPromptOptions, now?: number): number;
declare function getMCPServerNamesFromTools(tools?: unknown[] | null): Set<string>;
declare function buildMCPAuthStepId(serverName: string): string;
declare function buildMCPAuthToolCall({
  id,
  args,
  output,
  serverName,
  type
}: {
  id?: string;
  args?: string;
  output?: string;
  serverName: string;
  type?: OAuthToolCall["type"];
}): OAuthToolCall;
declare function buildMCPAuthRunStepEvent({
  runId,
  stepId,
  toolCall,
  index
}: {
  runId?: string | null;
  stepId: string;
  toolCall: OAuthToolCall;
  index?: number;
}): ServerSentEvent;
declare function buildMCPAuthRunStepDeltaEvent({
  authURL,
  stepId,
  toolCall,
  options
}: {
  authURL: string;
  stepId: string;
  toolCall: OAuthToolCall;
  options?: OAuthPromptOptions;
}): ServerSentEvent;
declare function buildMCPAuthRunStepEndDeltaEvent({
  stepId,
  toolCall
}: {
  stepId: string;
  toolCall: OAuthToolCall;
}): ServerSentEvent;
declare function buildMCPAuthRunStepCompletedEvent({
  stepId,
  toolCall,
  index
}: {
  stepId: string;
  toolCall: OAuthToolCall;
  index?: number;
}): ServerSentEvent;
//#endregion
//#region src/mcp/connection.d.ts
interface MCPConnectionParams {
  serverName: string;
  serverConfig: MCPOptions;
  userId?: string;
  oauthTokens?: MCPOAuthTokens | null;
  useSSRFProtection?: boolean;
  allowedAddresses?: string[] | null;
  ephemeralConnection?: boolean;
}
/** Result of an MCP `tools/list` request: one page of tools plus an optional pagination cursor. */
type MCPListToolsResult = Awaited<ReturnType<Client["listTools"]>>;
declare class MCPConnection extends EventEmitter {
  client: Client;
  private options;
  private transport;
  private connectionState;
  private connectPromise;
  private readonly MAX_RECONNECT_ATTEMPTS;
  readonly serverName: string;
  private shouldStopReconnecting;
  private isReconnecting;
  private isInitializing;
  private reconnectAttempts;
  private agents;
  private readonly userId?;
  private lastPingTime;
  private lastConnectionCheckAt;
  private oauthTokens?;
  private requestHeaders?;
  private oauthRequired;
  private oauthRecovery;
  private readonly useSSRFProtection;
  private readonly allowedAddresses?;
  private readonly ephemeralConnection;
  private readonly proxyConfig?;
  iconPath?: string;
  timeout?: number;
  sseReadTimeout?: number;
  url?: string;
  /**
  * Timestamp when this connection was created.
  * Used to detect if connection is stale compared to updated config.
  */
  readonly createdAt: number;
  private static circuitBreakers;
  static clearCooldown(serverName: string): void;
  private getCircuitBreaker;
  private isCircuitOpen;
  private recordCycle;
  private recordFailedRound;
  private resetFailedRounds;
  static decrementCycleCount(serverName: string): void;
  setRequestHeaders(headers: Record<string, string> | null): void;
  getRequestHeaders(): Record<string, string> | null | undefined;
  constructor(params: MCPConnectionParams);
  /** Helper to generate consistent log prefixes */
  private getLogPrefix;
  /**
  * Factory function to create fetch functions without capturing the entire `this` context.
  * This helps prevent memory leaks by only passing necessary dependencies.
  *
  * When `sseBodyTimeout` is provided, a second Agent is created with a much longer
  * body timeout for GET requests (the Streamable HTTP SSE stream). POST requests
  * continue using the normal timeout so they fail fast on real errors.
  */
  private createFetchFunction;
  private emitError;
  private constructTransport;
  private setupEventListeners;
  private handleReconnection;
  private subscribeToResources;
  connectClient(): Promise<void>;
  private patchTransportSend;
  private setupTransportOnMessageHandler;
  connect(): Promise<void>;
  private setupTransportErrorHandlers;
  private closeAgents;
  disconnect(resetCycleTracking?: boolean): Promise<void>;
  fetchResources(): Promise<MCPResource[]>;
  /**
  * Fetches the server's tools, following MCP `tools/list` cursor pagination so a
  * server that spans multiple pages (e.g. an aggregating gateway exposing many
  * tools) is loaded in full instead of being truncated to the first page.
  *
  * Pagination is bounded by {@link mcpConfig.TOOLS_LIST_MAX_PAGES}, aggregate
  * tool count, approximate serialized size, elapsed time, and a repeated-cursor
  * guard. On error, the tools already fetched are returned rather than discarded,
  * and the method never throws.
  */
  fetchTools(): Promise<MCPListToolsResult["tools"]>;
  private warnToolsListBudgetExceeded;
  /** Fetches a single `tools/list` page, returning null (and logging) on failure so pagination can stop gracefully. */
  private listToolsPage;
  fetchPrompts(): Promise<MCPPrompt[]>;
  isConnected(): Promise<boolean>;
  setOAuthTokens(tokens: MCPOAuthTokens): void;
  /**
  * Check if this connection is stale compared to config update time.
  * A connection is stale if it was created before the config was updated.
  *
  * @param configUpdatedAt - Unix timestamp (ms) when config was last updated
  * @returns true if connection was created before config update, false otherwise
  */
  isStale(configUpdatedAt: number): boolean;
  private isOAuthError;
  /**
  * Checks if an error indicates rate limiting (HTTP 429).
  * Rate limited requests should stop reconnection attempts to avoid making the situation worse.
  */
  private isRateLimitError;
}
//#endregion
//#region src/mcp/ConnectionsRepository.d.ts
/**
* Manages MCP connections with lazy loading and reconnection.
* Maintains a pool of connections and handles connection lifecycle management.
* Queries server configurations dynamically from the MCPServersRegistry (single source of truth).
*
* Scope-aware: Each repository is tied to a specific owner scope:
* - ownerId = undefined → manages app-level servers only
* - ownerId = userId → manages user-level and private servers for that user
*/
declare class ConnectionsRepository {
  protected connections: Map<string, MCPConnection>;
  protected oauthOpts: OAuthConnectionOptions | undefined;
  private readonly ownerId;
  constructor(ownerId?: string, oauthOpts?: OAuthConnectionOptions);
  /** Returns the number of active connections in this repository */
  getConnectionCount(): number;
  /** Checks whether this repository can connect to a specific server */
  has(serverName: string): Promise<boolean>;
  /** Gets or creates a connection for the specified server with lazy loading */
  get(serverName: string): Promise<MCPConnection | null>;
  /** Gets or creates connections for multiple servers concurrently */
  getMany(serverNames: string[]): Promise<Map<string, MCPConnection>>;
  /** Returns all currently loaded connections without creating new ones */
  getLoaded(): Promise<Map<string, MCPConnection>>;
  /** Gets or creates connections for all configured servers in this repository's scope */
  getAll(): Promise<Map<string, MCPConnection>>;
  /** Disconnects and removes a specific server connection from the pool */
  disconnect(serverName: string): Promise<void>;
  /** Disconnects all active connections and returns array of disconnect promises */
  disconnectAll(): Promise<void>[];
  protected prefix(serverName: string): string;
  /**
  * App-level (shared) connections cannot serve servers that need per-user context:
  * env/header placeholders like `{{MY_KEY}}` are only resolved by `processMCPEnv()`
  * when real `customUserVars` values exist — which requires a user-level connection.
  * OBO servers also require a user-level connection because each tool call
  * uses the current user's bearer token.
  */
  private isAllowedToConnectToServer;
}
//#endregion
//#region src/mcp/UserConnectionManager.d.ts
type PendingOAuthStart$1 = {
  authURL: string;
  options?: OAuthStartOptions;
};
type PendingOAuthState = {
  oauthStarts: Set<OAuthStartHandler>;
  emittedAuthUrls: WeakMap<OAuthStartHandler, string>;
  primaryOAuthStart?: OAuthStartHandler;
  lastOAuthStart?: PendingOAuthStart$1;
};
type PendingConnection = {
  promise: Promise<MCPConnection>;
  oauth: PendingOAuthState;
};
/**
* Abstract base class for managing user-specific MCP connections with lifecycle management.
* Only meant to be extended by MCPManager.
* Much of the logic was move here from the old MCPManager to make it more manageable.
* User connections will soon be ephemeral and not cached anymore:
* https://github.com/danny-avila/LibreChat/discussions/8790
*/
declare abstract class UserConnectionManager {
  appConnections: ConnectionsRepository | null;
  protected userConnections: Map<string, Map<string, MCPConnection>>;
  /** Last activity timestamp for users (not per server) */
  protected userLastActivity: Map<string, number>;
  /** In-flight connection promises keyed by `userId:serverName` — coalesces concurrent attempts */
  protected pendingConnections: Map<string, PendingConnection>;
  /** Updates the last activity timestamp for a user */
  protected updateUserLastActivity(userId: string): void;
  /** Gets or creates a connection for a specific user, coalescing concurrent attempts */
  getUserConnection(opts: UserMCPConnectionOptions): Promise<MCPConnection>;
  private createPendingOAuthState;
  private createPendingOAuthStart;
  private addPendingOAuthStart;
  private emitPendingOAuthStart;
  private getPendingOAuthStart;
  private getFlowPendingOAuthStart;
  private reissuePendingOAuthStart;
  private createUserConnectionInternal;
  /**
  * Mirrors the resolution MCPConnectionFactory performs internally
  * (preProcessGraphTokens + processMCPEnv). Both must stay in sync so the
  * config validated here matches the one the factory actually connects with.
  */
  protected resolveRuntimeConfig({
    config,
    user,
    customUserVars,
    requestBody,
    graphTokenResolver
  }: {
    config: ParsedServerConfig;
    user?: UserMCPConnectionOptions["user"];
    customUserVars?: Record<string, string>;
    requestBody?: UserMCPConnectionOptions["requestBody"];
    graphTokenResolver?: UserMCPConnectionOptions["graphTokenResolver"];
  }): Promise<ParsedServerConfig>;
  protected assertResolvedRuntimeConfigAllowed({
    config,
    user,
    customUserVars,
    requestBody,
    graphTokenResolver,
    allowedDomains,
    allowedAddresses,
    logPrefix
  }: {
    config: ParsedServerConfig;
    user?: UserMCPConnectionOptions["user"];
    customUserVars?: Record<string, string>;
    requestBody?: UserMCPConnectionOptions["requestBody"];
    graphTokenResolver?: UserMCPConnectionOptions["graphTokenResolver"];
    allowedDomains?: string[] | null;
    allowedAddresses?: string[] | null;
    logPrefix: string;
  }): Promise<ParsedServerConfig>;
  private applyRuntimeOAuthDetection;
  /** Returns all connections for a specific user */
  getUserConnections(userId: string): Map<string, MCPConnection> | undefined;
  /** Removes a specific user connection entry */
  protected removeUserConnection(userId: string, serverName: string): void;
  /** Disconnects and removes a specific user connection */
  disconnectUserConnection(userId: string, serverName: string): Promise<void>;
  /** Disconnects and removes all connections for a specific user */
  disconnectUserConnections(userId: string): Promise<void>;
  /** Check for and disconnect idle connections */
  protected checkIdleConnections(currentUserId?: string): void;
  /** Returns counts of tracked users and connections for diagnostics */
  getConnectionStats(): {
    trackedUsers: number;
    totalConnections: number;
    activityEntries: number;
    appConnectionCount: number;
  };
}
//#endregion
//#region src/mcp/MCPManager.d.ts
/**
* Centralized manager for MCP server connections and tool execution.
* Extends UserConnectionManager to handle both app-level and user-specific connections.
*/
declare class MCPManager extends UserConnectionManager {
  private static instance;
  /** Creates and initializes the singleton MCPManager instance */
  static createInstance(configs: MCPServers): Promise<MCPManager>;
  /** Returns the singleton MCPManager instance */
  static getInstance(): MCPManager;
  /** Initializes the MCPManager by setting up server registry and app connections */
  initialize(configs: MCPServers): Promise<void>;
  /** Retrieves an app-level or user-specific connection based on provided arguments */
  getConnection(args: {
    serverName: string;
    user?: IUser;
    forceNew?: boolean;
    flowManager?: FlowStateManager<MCPOAuthTokens | null>; /** Pre-resolved config for config-source servers not in YAML/DB */
    serverConfig?: ParsedServerConfig;
  } & Omit<OAuthConnectionOptions, "useOAuth" | "user" | "flowManager">): Promise<MCPConnection>;
  /**
  * Discovers tools from an MCP server, even when OAuth is required.
  * Per MCP spec, tool listing should be possible without authentication.
  * Use this for agent initialization to get tool schemas before OAuth flow.
  */
  discoverServerTools(args: ToolDiscoveryOptions): Promise<ToolDiscoveryResult>;
  /** Returns all available tool functions from app-level connections */
  getAppToolFunctions(): Promise<LCAvailableTools>;
  /** Returns all available tool functions from all connections available to user */
  getServerToolFunctions(userId: string, serverName: string): Promise<LCAvailableTools | null>;
  /**
  * Get instructions for MCP servers
  * @param serverNames Optional array of server names. If not provided or empty, returns all servers.
  * @returns Object mapping server names to their instructions
  */
  private getInstructions;
  /**
  * Format MCP server instructions for injection into context
  * @param serverNames Optional array of server names to include. If not provided, includes all servers.
  * @returns Formatted instructions string ready for context injection
  */
  formatInstructionsForContext(serverNames?: string[], configServers?: Record<string, ParsedServerConfig>): Promise<string>;
  /**
  * Calls a tool on an MCP server, using either a user-specific connection
  * (if userId is provided) or an app-level connection. Updates the last activity timestamp
  * for user-specific connections upon successful call initiation.
  *
  * @param graphTokenResolver - Optional function to resolve Graph API tokens via OBO flow.
  *   When provided and the server config contains `{{LIBRECHAT_GRAPH_ACCESS_TOKEN}}` placeholders,
  *   they will be resolved to actual Graph API tokens before the tool call.
  */
  callTool({
    user,
    serverName,
    serverConfig: providedConfig,
    toolName,
    provider,
    toolArguments,
    options,
    tokenMethods,
    requestBody,
    requestScopedConnections,
    flowManager,
    oauthStart,
    oauthEnd,
    customUserVars,
    graphTokenResolver,
    oboTokenResolver,
    oboTrustChecker
  }: {
    user?: IUser;
    serverName: string; /** Pre-resolved config from tool creation context — avoids readThrough TTL and cross-tenant issues */
    serverConfig?: ParsedServerConfig;
    toolName: string;
    provider: Provider;
    toolArguments?: Record<string, unknown>;
    options?: RequestOptions;
    requestBody?: RequestBody;
    requestScopedConnections?: RequestScopedMCPConnectionStore;
    tokenMethods?: TokenMethods;
    customUserVars?: Record<string, string>;
    flowManager: FlowStateManager<MCPOAuthTokens | null>;
    oauthStart?: OAuthStartHandler;
    oauthEnd?: () => Promise<void>;
    graphTokenResolver?: GraphTokenResolver;
    oboTokenResolver?: OboTokenResolver;
    oboTrustChecker?: OboTrustChecker;
  }): Promise<FormattedToolResponse>;
}
//#endregion
//#region src/mcp/auth.d.ts
declare function getUserMCPAuthMap({
  userId,
  tools,
  servers,
  toolInstances,
  findPluginAuthsByKeys
}: {
  userId: string;
  tools?: (string | undefined)[];
  servers?: (string | undefined)[];
  toolInstances?: (GenericTool | null)[];
  findPluginAuthsByKeys: PluginAuthMethods["findPluginAuthsByKeys"];
}): Promise<Record<string, Record<string, string>>>;
//#endregion
//#region src/mcp/zod.d.ts
/**
* Helper function to resolve $ref references
* @param schema - The schema to resolve
* @param definitions - The definitions to use
* @param visited - The set of visited references
* @returns The resolved schema
*/
declare function resolveJsonSchemaRefs<T extends Record<string, unknown>>(schema: T, definitions?: Record<string, unknown>, visited?: Set<string>): T;
/**
* Recursively normalizes a JSON schema for LLM API compatibility.
*
* Transformations applied:
* - Converts `const` values to `enum` arrays (Gemini/Vertex AI rejects `const`)
* - Strips vendor extension fields (`x-*` prefixed keys, e.g. `x-google-enum-descriptions`)
* - Strips leftover `$defs`/`definitions` blocks that may survive ref resolution
*
* @param schema - The JSON schema to normalize
* @returns The normalized schema
*/
declare function normalizeJsonSchema<T extends Record<string, unknown>>(schema: T): T;
/**
* Sanitizes a JSON schema to Gemini/Vertex AI's function-calling Schema subset
* (https://ai.google.dev/api/caching#Schema), recursively. Gemini accepts only a
* restricted slice of JSON Schema, and `@langchain/google-common`'s
* `zod_to_gemini_parameters` additionally throws on any union — so MCP tools that
* ship richer schemas crash on the Google endpoint while working on OpenAI/Claude.
*
* Transforms (all lossy and Gemini-specific — gate on the Google/Vertex provider,
* run after `normalizeJsonSchema`):
* - Collapses `anyOf`/`oneOf` to the first non-null member (merging parent + branch
*   `properties`/`required`), and merges `allOf` intersections.
* - Collapses multi-entry `type` arrays to a single type, tracking `nullable`.
* - Keeps only string `enum` values — Gemini's `enum` is `Type.STRING`-only — and
*   drops the keyword entirely for non-string types (e.g. a boolean `const`
*   normalized to `enum: [true]`).
* - Folds `exclusiveMinimum`/`exclusiveMaximum` into `minimum`/`maximum`.
* - Strips `const` (after enum conversion) and every keyword in `GEMINI_UNSUPPORTED_KEYS`
*   (`additionalProperties`, `examples`, `readOnly`, `multipleOf`, `uniqueItems`,
*   `patternProperties`, `prefixItems`, etc.) that the Gemini schema validator rejects.
*
* @param schema - The JSON schema to sanitize
* @returns The Gemini-compatible schema
*/
declare function sanitizeGeminiSchema<T extends Record<string, unknown>>(schema: T): T;
/**
* Converts a JSON Schema to a Zod schema.
*
* @deprecated This function is deprecated in favor of using JSON schemas directly.
* LangChain.js now supports JSON schemas natively, eliminating the need for Zod conversion.
* Use `resolveJsonSchemaRefs` to handle $ref references and pass the JSON schema directly to tools.
*
* @see https://js.langchain.com/docs/how_to/custom_tools/
*/
declare function convertJsonSchemaToZod(schema: JsonSchemaType$1 & Record<string, unknown>, options?: ConvertJsonSchemaToZodOptions): z.ZodType | undefined;
/**
* Helper function that resolves refs before converting to Zod.
*
* @deprecated This function is deprecated in favor of using JSON schemas directly.
* LangChain.js now supports JSON schemas natively, eliminating the need for Zod conversion.
* Use `resolveJsonSchemaRefs` to handle $ref references and pass the JSON schema directly to tools.
*
* @see https://js.langchain.com/docs/how_to/custom_tools/
*/
declare function convertWithResolvedRefs(schema: JsonSchemaType$1 & Record<string, unknown>, options?: ConvertJsonSchemaToZodOptions): z.ZodType | undefined;
//#endregion
//#region src/mcp/errors.d.ts
/**
* MCP-specific error classes
*/
declare const MCPErrorCodes: {
  readonly DOMAIN_NOT_ALLOWED: "MCP_DOMAIN_NOT_ALLOWED";
  readonly INSPECTION_FAILED: "MCP_INSPECTION_FAILED";
};
type MCPErrorCode = (typeof MCPErrorCodes)[keyof typeof MCPErrorCodes];
/**
* Custom error for MCP domain restriction violations.
* Thrown when a user attempts to connect to an MCP server whose domain is not in the allowlist.
*/
declare class MCPDomainNotAllowedError extends Error {
  readonly code: "MCP_DOMAIN_NOT_ALLOWED";
  readonly statusCode = 403;
  readonly domain: string;
  constructor(domain: string);
}
/**
* Custom error for MCP server inspection failures.
* Thrown when attempting to connect/inspect an MCP server fails.
*/
declare class MCPInspectionFailedError extends Error {
  readonly code: "MCP_INSPECTION_FAILED";
  readonly statusCode = 400;
  readonly serverName: string;
  constructor(serverName: string, cause?: Error);
}
/**
* Type guard to check if an error is an MCPDomainNotAllowedError
*/
declare function isMCPDomainNotAllowedError(error: unknown): error is MCPDomainNotAllowedError;
/**
* Type guard to check if an error is an MCPInspectionFailedError
*/
declare function isMCPInspectionFailedError(error: unknown): error is MCPInspectionFailedError;
//#endregion
//#region src/mcp/cache.d.ts
/**
* Clears config-source MCP server inspection cache so servers are re-inspected on next access.
* Best-effort disconnection of app-level connections for evicted servers.
*
* User-level connections (used by config-source servers) are cleaned up lazily via
* the stale-check mechanism on the next tool call — this is an accepted design tradeoff
* since iterating all active user sessions is expensive and config mutations are rare.
*/
declare function clearMcpConfigCache(): Promise<void>;
//#endregion
//#region src/mcp/tools.d.ts
interface MCPToolInput {
  name: string;
  description?: string;
  inputSchema?: JsonSchemaType$2;
}
interface MCPToolCacheDeps {
  getCachedTools: (options?: {
    userId?: string;
    serverName?: string;
  }) => Promise<LCAvailableTools | null>;
  setCachedTools: (tools: LCAvailableTools, options?: {
    userId?: string;
    serverName?: string;
  }) => Promise<boolean>;
  getServerConfig: (serverName: string, userId?: string) => Promise<ParsedServerConfig | undefined>;
}
interface MCPToolCacheService {
  updateMCPServerTools: (params: {
    userId: string;
    serverName: string;
    tools: MCPToolInput[] | null;
    serverConfig?: ParsedServerConfig;
  }) => Promise<LCAvailableTools>;
  mergeAppTools: (appTools: LCAvailableTools) => Promise<void>;
  cacheMCPServerTools: (params: {
    userId: string;
    serverName: string;
    serverTools: LCAvailableTools;
    serverConfig?: ParsedServerConfig;
  }) => Promise<void>;
  getMCPServerTools: (userId: string, serverName: string, serverConfig?: ParsedServerConfig) => Promise<LCAvailableTools | null>;
}
declare function createMCPToolCacheService(deps: MCPToolCacheDeps): MCPToolCacheService;
//#endregion
//#region src/mcp/request.d.ts
interface MCPRequestContext extends RequestScopedMCPConnectionStore {
  cleanupStarted: boolean;
  cleanupOnResponse: boolean;
  responseCleanupAttached: boolean;
}
interface MCPRequestContextOptions {
  cleanupOnResponse?: boolean;
}
interface MCPResponseLike {
  writableEnded?: boolean;
  finished?: boolean;
  destroyed?: boolean;
  once?: (event: "finish" | "close", listener: () => void) => unknown;
}
declare function createMCPRequestContext(): MCPRequestContext;
declare function cleanupMCPRequestContext(context?: MCPRequestContext): Promise<void>;
declare function getMCPRequestContext(req?: object, res?: MCPResponseLike, options?: MCPRequestContextOptions): MCPRequestContext | undefined;
declare function cleanupMCPRequestContextForReq(req?: object): Promise<void>;
//#endregion
//#region src/mcp/utils.d.ts
declare const mcpToolPattern: RegExp;
type PlaceholderValue = string | number | boolean | null | undefined | readonly PlaceholderValue[] | {
  readonly [key: string]: PlaceholderValue;
};
type UserScopedConnectionConfig = Pick<ParsedServerConfig, "requiresOAuth" | "source" | "dbId"> & {
  args?: string[];
  /** Loosened from the parsed shapes so raw (pre-inspection) configs qualify;
  *  scoping predicates only check key presence */
  obo?: {
    scopes?: string;
  } | null;
  customUserVars?: Record<string, {
    description?: string;
    title?: string;
    sensitive?: boolean;
  } | undefined>;
  env?: Record<string, string | undefined>;
  headers?: Record<string, string | undefined>;
  oauth?: PlaceholderValue;
  oauth_headers?: Record<string, string | undefined>;
  url?: string;
};
/** Whether a server should use MCP OAuth handling. */
declare function isOAuthServer(config: Pick<ParsedServerConfig, "requiresOAuth" | "oauth">): boolean;
/**
* Whether a server needs the OAuth-style connection wiring (flow manager,
* token methods, OBO/OAuth resolvers). Distinct from `isOAuthServer`: OBO
* servers reuse the same wiring even though they don't run an OAuth handshake,
* because the runtime needs `oboTokenResolver`/`oboTrustChecker` plumbed through.
*
* Without this, an OBO server with `requiresOAuth: false` would land in the
* non-OAuth branch of MCPManager.discoverServerTools / UserConnectionManager,
* which omits the OBO resolver — `usesObo` then evaluates to false in the
* factory and the connection sends a bare request that the upstream rejects.
*/
declare function requiresOAuthMachinery(config: Pick<ParsedServerConfig, "requiresOAuth" | "oauth" | "obo">): boolean;
/** Checks that `customUserVars` is present AND non-empty (guards against truthy `{}`) */
declare function hasCustomUserVars(config: Pick<UserScopedConnectionConfig, "customUserVars">): boolean;
/**
* Trusted YAML/config servers may use per-user/request placeholders that can
* only be resolved once a real request context exists. User-sourced DB servers
* deliberately stay sandboxed and only resolve customUserVars.
*/
declare function hasRuntimeContextPlaceholders(config: UserScopedConnectionConfig): boolean;
declare function hasRuntimeUrlPlaceholders(config: UserScopedConnectionConfig): boolean;
declare function hasRuntimeBodyPlaceholders(config: UserScopedConnectionConfig): boolean;
declare function getRuntimeBodyPlaceholderFields(config: UserScopedConnectionConfig): string[];
declare function getMissingRuntimeBodyPlaceholderFields(config: UserScopedConnectionConfig, requestBody?: RequestBody): string[];
/**
* `BODY` placeholders vary by chat request, so the normal userId:serverName
* cache would reuse a connection built with stale request context.
*
* Ephemeral connections are created and torn down per tool call — configs using
* these placeholders pay a full connect + initialize on every invocation.
*
* User/OpenID/Graph placeholders still require user-scoped connections, but they
* are not request-scoped by themselves. HTTP transports refresh resolved headers
* before each tool call, so token/user headers can remain on the cached user
* connection without forcing a reconnect for every invocation.
*/
declare function requiresEphemeralUserConnection(config: UserScopedConnectionConfig): boolean;
/**
* Returns true when a server requires a per-user connection instead of an
* app-shared connection.
*/
declare function requiresUserScopedConnection(config: UserScopedConnectionConfig): boolean;
/**
* Returns the names of `customUserVars` declared on the server config for which
* the user has not supplied a non-blank value (unset, empty, or whitespace-only
* values count as missing, since they still fail auth). An empty array means
* every declared variable is satisfied (or the server declares none).
*
* Used to gate tool exposure: a server that requires user-provided credentials
* should not surface its tools to the model until those values are set,
* otherwise every tool call fails authentication. See issue #10969.
*/
declare function getMissingCustomUserVars(config: Pick<ParsedServerConfig, "customUserVars">, providedVars?: Record<string, string> | null): string[];
/**
* Determines whether a server config is user-sourced (sandboxed placeholder resolution).
* When `source` is set, it is authoritative. When absent (pre-upgrade cached configs),
* falls back to the legacy `dbId` heuristic for backward compatibility.
*/
declare function isUserSourced(config: Pick<ParsedServerConfig, "source" | "dbId">): boolean;
/**
* Allowlist-based sanitization for API responses. Only explicitly listed fields are included;
* new fields added to ParsedServerConfig are excluded by default until allowlisted here.
*
* `url` and the oauth flow URLs (`authorization_url`, `token_url`, `revocation_endpoint`) can
* encode internal infrastructure, so they are stripped unless `canEdit` is set: the same
* disclosure threshold the PATCH route enforces. Callers derive `canEdit` per server (operator
* YAML/config-tier servers from the MANAGE_MCP_SERVERS capability, user-sourced servers from
* per-resource ACL EDIT), so a user-sourced config shared view-only does not disclose its URL
* to the viewer.
* DB-stored configs reject ${VAR} patterns at validation time (MCPServerUserInputSchema);
* env variable resolution is handled at the schema/input boundary.
*/
declare function redactServerSecrets(config: ParsedServerConfig, options?: {
  canEdit?: boolean;
}): Partial<ParsedServerConfig>;
/** Applies allowlist-based sanitization to a map of server configs. */
declare function redactAllServerSecrets(configs: Record<string, ParsedServerConfig>, options?: {
  canEditByServer?: ReadonlyMap<string, boolean>;
}): Record<string, Partial<ParsedServerConfig>>;
/**
* Normalizes a server name to match the pattern ^[a-zA-Z0-9_.-]+$
* This is required for Azure OpenAI models with Tool Calling
*/
declare function normalizeServerName(serverName: string): string;
/**
* Builds the synthetic tool-call name used during MCP OAuth flows.
* Format: `oauth<mcp_delimiter><normalizedServerName>`
*
* Guards against the caller passing a pre-wrapped name (one that already
* starts with the oauth prefix in its original, un-normalized form) to
* prevent double-wrapping.
*/
declare function buildOAuthToolCallName(serverName: string): string;
/** Checks whether a message indicates the stored client registration is invalid/stale. */
declare function isInvalidClientMessage(message: string): boolean;
/**
* Checks whether a message indicates the OAuth client registration was rejected.
* Superset of `isInvalidClientMessage`: also matches `unauthorized_client`
* (grant-type refusal), which has different recovery semantics.
*/
declare function isClientRejectionMessage(message: string): boolean;
/**
* Sanitizes a URL by removing query parameters to prevent credential leakage in logs.
* @param url - The URL to sanitize (string or URL object)
* @returns The sanitized URL string without query parameters
*/
declare function sanitizeUrlForLogging(url: string | URL): string;
/**
* Escapes special regex characters in a string so they are treated literally.
* @param str - The string to escape
* @returns The escaped string safe for use in a regex pattern
*/
declare function escapeRegex(str: string): string;
/**
* Generates a URL-friendly server name from a title.
* Converts to lowercase, replaces spaces with hyphens, removes special characters.
* @param title - The display title to convert
* @returns A slug suitable for use as serverName (e.g., "GitHub MCP Tool" → "github-mcp-tool")
*/
declare function generateServerNameFromTitle(title: string): string;
//#endregion
//#region src/utils/axios.d.ts
/**
* Logs Axios errors based on the error object and a custom message.
* @param options - The options object.
* @param options.message - The custom message to be logged.
* @param options.error - The Axios error object.
* @returns The log message.
*/
declare const logAxiosError: ({
  message,
  error
}: {
  message: string;
  error: AxiosError | Error | unknown;
}) => string;
/**
* Creates and configures an Axios instance with optional proxy settings.

* @returns A configured Axios instance
* @throws If there's an issue creating the Axios instance or parsing the proxy URL
*/
declare function createAxiosInstance(): AxiosInstance;
//#endregion
//#region src/utils/azure.d.ts
/**
* Sanitizes the model name to be used in the URL by removing or replacing disallowed characters.
* @param modelName - The model name to be sanitized.
* @returns The sanitized model name.
*/
declare const sanitizeModelName: (modelName: string) => string;
/**
* Generates the Azure OpenAI API endpoint URL.
* @param params - The parameters object.
* @param params.azureOpenAIApiInstanceName - The Azure OpenAI API instance name.
* @param params.azureOpenAIApiDeploymentName - The Azure OpenAI API deployment name.
* @returns The complete endpoint URL for the Azure OpenAI API.
*/
declare const genAzureEndpoint: ({
  azureOpenAIApiInstanceName,
  azureOpenAIApiDeploymentName
}: {
  azureOpenAIApiInstanceName: string;
  azureOpenAIApiDeploymentName: string;
}) => string;
/**
* Generates the Azure OpenAI API chat completion endpoint URL with the API version.
* If both deploymentName and modelName are provided, modelName takes precedence.
* @param azureConfig - The Azure configuration object.
* @param azureConfig.azureOpenAIApiInstanceName - The Azure OpenAI API instance name.
* @param azureConfig.azureOpenAIApiDeploymentName - The Azure OpenAI API deployment name (optional).
* @param azureConfig.azureOpenAIApiVersion - The Azure OpenAI API version.
* @param modelName - The model name to be included in the deployment name (optional).
* @param client - The API Client class for optionally setting properties (optional).
* @returns The complete chat completion endpoint URL for the Azure OpenAI API.
* @throws Error if neither azureOpenAIApiDeploymentName nor modelName is provided.
*/
declare const genAzureChatCompletion: ({
  azureOpenAIApiInstanceName,
  azureOpenAIApiDeploymentName,
  azureOpenAIApiVersion
}: {
  azureOpenAIApiInstanceName: string;
  azureOpenAIApiDeploymentName?: string;
  azureOpenAIApiVersion: string;
}, modelName?: string, client?: GenericClient) => string;
/**
* Retrieves the Azure OpenAI API credentials from environment variables.
* @returns An object containing the Azure OpenAI API credentials.
*/
declare const getAzureCredentials: () => AzureOptions;
/**
* Constructs a URL by replacing placeholders in the baseURL with values from the azure object.
* It specifically looks for '${INSTANCE_NAME}' and '${DEPLOYMENT_NAME}' within the baseURL and replaces
* them with 'azureOpenAIApiInstanceName' and 'azureOpenAIApiDeploymentName' from the azure object.
* If the respective azure property is not provided, the placeholder is replaced with an empty string.
*
* @param params - The parameters object.
* @param params.baseURL - The baseURL to inspect for replacement placeholders.
* @param params.azureOptions - The azure options object containing the instance and deployment names.
* @returns The complete baseURL with credentials injected for the Azure OpenAI API.
*/
declare function constructAzureURL({
  baseURL,
  azureOptions
}: {
  baseURL: string;
  azureOptions?: AzureOptions;
}): string;
//#endregion
//#region src/utils/code.d.ts
/**
* Dedicated agents for code-server requests, preventing socket pool contamination.
* follow-redirects (used by axios) leaks `socket.destroy` as a timeout listener;
* on Node 19+ (keepAlive: true by default), tainted sockets re-enter the global pool
* and kill unrelated requests (e.g., node-fetch in CodeExecutor) after the idle timeout.
*/
declare const codeServerHttpAgent: http.Agent;
declare const codeServerHttpsAgent: https$1.Agent;
//#endregion
//#region src/utils/common.d.ts
/**
* Checks if the given value is truthy by being either the boolean `true` or a string
* that case-insensitively matches 'true'.
*
* @param value - The value to check.
* @returns Returns `true` if the value is the boolean `true` or a case-insensitive
*                    match for the string 'true', otherwise returns `false`.
* @example
*
* isEnabled("True");  // returns true
* isEnabled("TRUE");  // returns true
* isEnabled(true);    // returns true
* isEnabled("false"); // returns false
* isEnabled(false);   // returns false
* isEnabled(null);    // returns false
* isEnabled();        // returns false
*/
declare function isEnabled(value?: string | boolean | null | undefined): boolean;
/**
* Checks if the provided value is 'user_provided'.
*
* @param value - The value to check.
* @returns - Returns true if the value is 'user_provided', otherwise false.
*/
declare const isUserProvided: (value?: string) => boolean;
/**
* @param values
*/
declare function optionalChainWithEmptyCheck(...values: (string | number | undefined)[]): string | number | undefined;
//#endregion
//#region src/utils/content.d.ts
/**
* Filters out malformed tool call content parts that don't have the required tool_call property.
* This handles edge cases where tool_call content parts may be created with only a type property
* but missing the actual tool_call data.
*
* @param contentParts - Array of content parts to filter
* @returns Filtered array with malformed tool calls removed
*
* @example
* // Removes malformed tool_call without the tool_call property
* const parts = [
*   { type: 'tool_call', tool_call: { id: '123', name: 'test' } }, // valid - kept
*   { type: 'tool_call' }, // invalid - filtered out
*   { type: 'text', text: 'Hello' }, // valid - kept (other types pass through)
* ];
* const filtered = filterMalformedContentParts(parts);
* // Returns all parts except the malformed tool_call
*/
declare function filterMalformedContentParts(contentParts: TMessageContentParts[]): TMessageContentParts[];
declare function filterMalformedContentParts<T>(contentParts: T): T;
//#endregion
//#region src/utils/email.d.ts
/**
* Check if email configuration is set
* @returns Returns `true` if either Mailgun or SMTP is properly configured
*/
declare function checkEmailConfig(): boolean;
//#endregion
//#region src/utils/env.d.ts
/**
* List of allowed user fields that can be used in MCP environment variables.
* These are non-sensitive string/boolean fields from the IUser interface.
*/
declare const ALLOWED_USER_FIELDS: readonly ["id", "name", "username", "email", "provider", "role", "googleId", "facebookId", "openidId", "samlId", "ldapId", "githubId", "discordId", "appleId", "emailVerified", "twoFactorEnabled", "termsAccepted"];
type AllowedUserField = (typeof ALLOWED_USER_FIELDS)[number];
type SafeUser = Pick<IUser, AllowedUserField>;
/**
* Encodes a string value to be safe for HTTP headers.
* HTTP headers are restricted to ASCII characters (0-255) per the Fetch API standard.
* Non-ASCII characters with Unicode values > 255 are Base64 encoded with 'b64:' prefix.
*
* NOTE: This is a LibreChat-specific encoding scheme to work around Fetch API limitations.
* MCP servers receiving headers with the 'b64:' prefix should:
* 1. Detect the 'b64:' prefix in header values
* 2. Remove the prefix and Base64-decode the remaining string
* 3. Use the decoded UTF-8 string as the actual value
*
* Example decoding (Node.js):
*   if (headerValue.startsWith('b64:')) {
*     const decoded = Buffer.from(headerValue.slice(4), 'base64').toString('utf8');
*   }
*
* @param value - The string value to encode
* @returns ASCII-safe string (encoded if necessary)
*
* @example
* encodeHeaderValue("José")   // Returns "José" (é = 233, safe)
* encodeHeaderValue("Marić")  // Returns "b64:TWFyacSH" (ć = 263, needs encoding)
*/
declare function encodeHeaderValue(value: string): string;
/**
* Creates a safe user object containing only allowed fields.
* Preserves federatedTokens for OpenID token template variable resolution.
*
* @param user - The user object to extract safe fields from
* @returns A new object containing only allowed fields plus federatedTokens if present
*/
declare function createSafeUser(user: IUser | null | undefined): Partial<SafeUser> & {
  federatedTokens?: IUser["federatedTokens"];
};
/**
* Recursively processes an object to replace environment variables in string values
* @param params - Processing parameters
* @param params.options - The MCP options to process
* @param params.user - The user object containing all user fields
* @param params.customUserVars - vars that user set in settings
* @param params.body - the body of the request that is being processed
* @returns - The processed object with environment variables replaced
*/
declare function processMCPEnv(params: {
  options: Readonly<MCPOptions$1> & {
    dbId?: string;
  };
  user?: Partial<IUser>;
  customUserVars?: Record<string, string>;
  body?: RequestBody; /** When true, only resolve customUserVars — skip env vars, user/OpenID/body placeholders (for DB-stored servers) */
  dbSourced?: boolean;
}): MCPOptions$1;
/**
* Recursively resolves placeholders in a nested object structure while preserving types.
* Only processes string values - leaves numbers, booleans, arrays, and nested objects intact.
*
* @param options - Configuration object
* @param options.obj - The object to process
* @param options.user - Optional user object for replacing user field placeholders
* @param options.body - Optional request body object for replacing body field placeholders
* @param options.customUserVars - Optional custom user variables to replace placeholders
* @returns The processed object with placeholders replaced in string values
*/
declare function resolveNestedObject<T = unknown>(options?: {
  obj: T | undefined;
  user?: Partial<IUser> | {
    id: string;
  };
  body?: RequestBody;
  customUserVars?: Record<string, string>;
}): T;
/**
* Resolves header values by replacing user placeholders, body variables, custom variables, and environment variables.
* Automatically encodes non-ASCII characters for header safety.
*
* @param options - Optional configuration object
* @param options.headers - The headers object to process
* @param options.user - Optional user object for replacing user field placeholders (can be partial with just id)
* @param options.body - Optional request body object for replacing body field placeholders
* @param options.customUserVars - Optional custom user variables to replace placeholders
* @returns The processed headers with all placeholders replaced
*/
declare function resolveHeaders(options?: {
  headers: Record<string, string> | undefined;
  user?: Partial<IUser> | {
    id: string;
  };
  body?: RequestBody;
  customUserVars?: Record<string, string>;
}): Record<string, string>;
//#endregion
//#region src/utils/events.d.ts
/**
* Sends a Server-Sent Event to the client.
* Empty-string StreamEvent data is silently dropped.
*/
declare function sendEvent(res: Response$1, event: ServerSentEvent): void;
/**
* Sends error data in Server Sent Events format and ends the response.
* @param res - The server response.
* @param message - The error message.
*/
declare function handleError(res: Response$1, message: string): void;
//#endregion
//#region src/utils/files.d.ts
/**
* Resolves a user-facing error message from a file upload error.
* Returns the error's own message if it matches a known user-facing pattern,
* otherwise returns the default message.
*/
declare function resolveUploadErrorMessage(error: {
  message?: string;
} | null | undefined, defaultMessage?: string): string;
/**
* Sanitize a filename by removing any directory components, replacing unsafe characters
* @param inputName
*/
declare function sanitizeFilename(inputName: string): string;
/**
* Sanitize a code-execution artifact path while preserving directory components
* so subsequent prime() runs can place the file at the same nested location in
* the next sandbox session. Each segment is sanitized independently with the
* same rules as `sanitizeFilename`. Falls back to the basename for absolute
* paths or names containing `..` traversal.
*
* Each path component is capped at `ARTIFACT_PATH_SEGMENT_MAX_BYTES` (255 bytes)
* — the leaf with extension preservation (matching `sanitizeFilename`),
* non-leaf segments with a plain truncate-and-disambiguate. Without the
* cap, long artifact names flow into `saveBuffer`'s storage key
* unbounded and trip `ENAMETOOLONG` instead of persisting.
*/
declare function sanitizeArtifactPath(inputName: string): string;
/**
* Map a (sanitized) artifact path to a flat storage-safe key. The local
* storage strategies key by single component; this avoids creating
* unintended subdirectories on disk while the DB record retains the
* nested path for the next prime().
*
* Optionally caps the result at `maxLength` UTF-8 bytes. Per-segment caps
* applied by `sanitizeArtifactPath` aren't enough on their own —
* `${file_id}__${flatName}` has to fit in one filesystem path component
* (NAME_MAX = 255 on most filesystems), so a deeply-nested path whose
* segments are individually within bounds can still produce a flat form
* that overflows once `${file_id}__` is prepended. The caller passes
* `255 - prefix.length` and the truncation preserves the leaf extension
* with the same disambiguating hex suffix that `sanitizeFilename` uses.
*
* Without this cap, oversized flat keys hit `ENAMETOOLONG` inside
* `saveBuffer`, the artifact falls back to a download URL, and the next
* prime() never sees it.
*/
declare function flattenArtifactPath(safePath: string, maxLength?: number): string;
/**
* Options for reading files
*/
interface ReadFileOptions {
  encoding?: BufferEncoding;
  /** Size threshold in bytes. Files larger than this will be streamed. Default: 10MB */
  streamThreshold?: number;
  /** Size of chunks when streaming. Default: 64KB */
  highWaterMark?: number;
  /** File size in bytes if known (e.g. from multer). Avoids extra stat() call. */
  fileSize?: number;
}
/**
* Result from reading a file
*/
interface ReadFileResult<T> {
  content: T;
  bytes: number;
}
/**
* Reads a file asynchronously. Uses streaming for large files to avoid memory issues.
*
* @param filePath - Path to the file to read
* @param options - Options for reading the file
* @returns Promise resolving to the file contents and size
* @throws Error if the file cannot be read
*/
declare function readFileAsString(filePath: string, options?: ReadFileOptions): Promise<ReadFileResult<string>>;
/**
* Reads a file as a Buffer asynchronously. Uses streaming for large files.
*
* @param filePath - Path to the file to read
* @param options - Options for reading the file
* @returns Promise resolving to the file contents and size
* @throws Error if the file cannot be read
*/
declare function readFileAsBuffer(filePath: string, options?: Omit<ReadFileOptions, "encoding">): Promise<ReadFileResult<Buffer>>;
/**
* Reads a JSON file asynchronously
*
* @param filePath - Path to the JSON file to read
* @param options - Options for reading the file
* @returns Promise resolving to the parsed JSON object
* @throws Error if the file cannot be read or parsed
*/
declare function readJsonFile<T = unknown>(filePath: string, options?: Omit<ReadFileOptions, "encoding">): Promise<T>;
//#endregion
//#region src/utils/import.d.ts
/** 250 MiB — default max file size for conversation imports */
declare const DEFAULT_IMPORT_MAX_FILE_SIZE = 262144e3;
/** Resolves the import file-size limit from the env var, falling back to the 250 MiB default */
declare function resolveImportMaxFileSize(): number;
//#endregion
//#region src/utils/generators.d.ts
type SSRFSafeAgents = {
  httpAgent: Agent$1;
  httpsAgent: Agent$2;
};
/**
* Makes a function to make HTTP request and logs the process.
* @param params
* @param params.directEndpoint - Whether to use a direct endpoint.
* @param params.reverseProxyUrl - The reverse proxy URL to use for the request.
* @param params.ssrfAgents - Optional SSRF-safe agents for user-provided URLs.
* @param params.redirect - Optional redirect policy for user-provided URLs.
* @returns A promise that resolves to the response of the fetch request.
*/
declare function createFetch({
  directEndpoint,
  reverseProxyUrl,
  ssrfAgents,
  redirect
}: {
  directEndpoint?: boolean;
  reverseProxyUrl?: string;
  ssrfAgents?: SSRFSafeAgents;
  redirect?: fetch$1.RequestRedirect;
}): (_url: fetch$1.RequestInfo, init: fetch$1.RequestInit) => Promise<fetch$1.Response>;
/**
* Creates event handlers for stream events that don't capture client references
* @param res - The response object to send events to
* @returns Object containing handler functions
*/
declare function createStreamEventHandlers(res: Response$1): {
  on_run_step: (event: ServerSentEvent) => void;
  on_message_delta: (event: ServerSentEvent) => void;
  on_reasoning_delta: (event: ServerSentEvent) => void;
};
declare function createHandleLLMNewToken(streamRate: number): () => Promise<void>;
//#endregion
//#region src/utils/headers.d.ts
/**
* Merges two header maps, with `override` winning on key collisions. Matching is
* case-insensitive (HTTP header names are), so an `override` key replaces any
* case variant from `base` rather than leaving both names in the output (which
* clients may collapse, breaking auth or protocol headers); the `override`
* casing is kept. The `anthropic-beta` header is special-cased: values from both
* sides are comma-unioned (deduped) so a custom beta coexists with
* provider-managed betas instead of clobbering them.
*
* Used both to layer endpoint headers over global (`endpoints.all`) headers and
* to attach admin-configured custom headers beneath provider-managed headers
* (auth/version/beta), so the provider integration's own headers always win.
*
* @returns the merged map, or `undefined` when neither side has any headers.
*/
declare function mergeHeaders(base?: Record<string, string>, override?: Record<string, string>): Record<string, string> | undefined;
/**
* Resolves placeholder templates in the outbound request headers of a built LLM
* config, mutating it in place. Handles the OpenAI-compatible
* `configuration.defaultHeaders` (OpenAI / Azure / custom) and the native
* Anthropic `clientOptions.defaultHeaders` (including Vertex) carriers. Native
* Google `customHeaders` are intentionally NOT handled here — they are resolved
* once at init in `initializeGoogle`, so the provider-managed `Authorization`
* header (built from a possibly user-provided key) never passes through env
* expansion.
*
* Resolution runs at request time so request-body placeholders (e.g.
* `{{LIBRECHAT_BODY_CONVERSATIONID}}`) resolve against the live request. It is a
* no-op for header values without placeholders, and idempotent under config reuse.
*/
declare function resolveConfigHeaders({
  llmConfig,
  user,
  body,
  customUserVars
}: {
  llmConfig?: RunLLMConfig | null;
  user?: Partial<IUser> | {
    id: string;
  };
  body?: RequestBody;
  customUserVars?: Record<string, string>;
}): void;
//#endregion
//#region src/utils/path.d.ts
/**
* Gets the base path from the DOMAIN_CLIENT environment variable.
* This is useful for constructing URLs when LibreChat is served from a subdirectory.
* @returns {string} The base path (e.g., '/librechat' or '')
*/
declare function getBasePath(): string;
//#endregion
//#region src/utils/latex.d.ts
/**
* Unescapes LaTeX preprocessing done by the frontend preprocessLaTeX function.
* This reverses the escaping of currency dollar signs and other LaTeX transformations.
*
* The frontend escapes dollar signs for proper LaTeX rendering (e.g., $14 → \\$14),
* but the database stores the original unescaped versions. This function reverses
* that transformation to match database content.
*
* @param text - The escaped text from the frontend
* @returns The unescaped text matching the database format
*/
declare function unescapeLaTeX(text: string | null | undefined): string | null | undefined;
//#endregion
//#region src/utils/llm.d.ts
type LibreChatKeys = keyof typeof librechat;
type LibreChatParams = {
  modelOptions: Omit<NonNullable<DynamicSettingProps["conversation"]>, LibreChatKeys>;
  resendFiles: boolean;
  promptPrefix?: string | null;
  maxContextTokens?: number;
  fileTokenLimit?: number;
  modelLabel?: string | null;
};
/**
* Separates LibreChat-specific parameters from model options
* @param options - The combined options object
*/
declare function extractLibreChatParams(options?: DynamicSettingProps["conversation"]): LibreChatParams;
//#endregion
//#region src/utils/math.d.ts
/**
* Evaluates a mathematical expression provided as a string and returns the result.
*
* If the input is already a number, it returns the number as is.
* If the input is not a string or contains invalid characters, an error is thrown.
* If the evaluated result is not a number, an error is thrown.
*
* Uses mathjs for safe expression evaluation instead of eval().
*
* @param str - The mathematical expression to evaluate, or a number.
* @param fallbackValue - The default value to return if the input is not a string or number, or if the evaluated result is not a number.
*
* @returns The result of the evaluated expression or the input number.
*
* @throws Throws an error if the input is not a string or number, contains invalid characters, or does not evaluate to a number.
*/
declare function math(str: string | number | undefined, fallbackValue?: number): number;
//#endregion
//#region src/utils/oidc.d.ts
interface OpenIDTokenInfo {
  accessToken?: string;
  idToken?: string;
  expiresAt?: number;
  userId?: string;
  userEmail?: string;
  userName?: string;
  claims?: Record<string, unknown>;
}
/**
* Placeholder for Microsoft Graph API access token.
* This placeholder is resolved asynchronously via OBO (On-Behalf-Of) flow
* and requires special handling outside the synchronous processMCPEnv pipeline.
*/
declare const GRAPH_TOKEN_PLACEHOLDER = "{{LIBRECHAT_GRAPH_ACCESS_TOKEN}}";
/**
* Default Microsoft Graph API scopes for OBO token exchange.
* Can be overridden via GRAPH_API_SCOPES environment variable.
*/
declare const DEFAULT_GRAPH_SCOPES = "https://graph.microsoft.com/.default";
declare function extractOpenIDTokenInfo(user: Partial<IUser> | null | undefined): OpenIDTokenInfo | null;
declare function isOpenIDTokenValid(tokenInfo: OpenIDTokenInfo | null): boolean;
declare function processOpenIDPlaceholders(value: string, tokenInfo: OpenIDTokenInfo | null): string;
declare function createBearerAuthHeader(tokenInfo: OpenIDTokenInfo | null): string;
declare function isOpenIDAvailable(): boolean;
//#endregion
//#region src/utils/openid.d.ts
/**
* Helper function to safely log sensitive data when debug mode is enabled
* @param obj - Object to stringify
* @param maxLength - Maximum length of the stringified output
* @returns Stringified object with sensitive data masked
*/
declare function safeStringify(obj: unknown, maxLength?: number): string;
/**
* Helper to log headers without revealing sensitive information
* @param headers - Headers object to log
* @returns Stringified headers with sensitive data masked
*/
declare function logHeaders(headers: Headers | undefined | null): string;
//#endregion
//#region src/utils/promise.d.ts
/**
* Wraps a promise with a timeout. If the promise doesn't resolve/reject within
* the specified time, it will be rejected with a timeout error.
*
* @param promise - The promise to wrap with a timeout
* @param timeoutMs - Timeout duration in milliseconds
* @param errorMessage - Custom error message for timeout (optional)
* @param logger - Optional logger function to log timeout errors (e.g., console.warn, logger.warn)
* @returns Promise that resolves/rejects with the original promise or times out
*
* @example
* ```typescript
* const result = await withTimeout(
*   fetchData(),
*   5000,
*   'Failed to fetch data within 5 seconds',
*   console.warn
* );
* ```
*/
declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string, logger?: (message: string, error: Error) => void): Promise<T>;
/**
* Create an in-process concurrency limiter. Returns a `run` function that
* wraps async tasks: at most `concurrency` invocations may execute at once;
* additional calls queue and dequeue in FIFO order as slots free.
*
* Use to bound the parallelism of expensive CPU-or-IO work that fans out
* from a single producer (e.g. an agent emitting many office artifacts in
* one tool result), so the work doesn't compete with the still-running
* agent inference for event-loop time. Tasks remain queued — they are
* never dropped or rejected by the limiter itself — so the overall workload
* still completes; only peak concurrency is capped.
*
* Each task is wrapped in a thunk so timeouts and other side effects do
* not start until the limiter actually invokes it.
*
* @example
* ```typescript
* const limit = createConcurrencyLimiter(2);
* const results = await Promise.all(files.map((f) => limit(() => parse(f))));
* ```
*/
declare function createConcurrencyLimiter(concurrency: number): <T>(task: () => Promise<T>) => Promise<T>;
//#endregion
//#region src/utils/ports.d.ts
/**
* Strips port suffix from req.ip for use as a rate-limiter key (IPv4 and IPv6-safe).
* Bracket notation for the ip property avoids express-rate-limit v8's toString()
* heuristic that scans for the literal substring "req.ip" (ERR_ERL_KEY_GEN_IPV6).
*/
declare function removePorts(req: Request): string | undefined;
//#endregion
//#region src/utils/sanitizeTitle.d.ts
/** Max character length for sanitized titles (the output will never exceed this). */
declare const MAX_TITLE_LENGTH = 200;
declare const DEFAULT_TITLE_FALLBACK = "Untitled Conversation";
/**
* Sanitizes LLM-generated chat titles by removing {@link https://en.wikipedia.org/wiki/Chain-of-thought_prompting <think>}
* reasoning blocks, normalizing whitespace, and truncating to {@link MAX_TITLE_LENGTH} characters.
*
* Titles exceeding the limit are truncated at a code-point-safe boundary and suffixed with `...`.
*
* @param rawTitle - The raw LLM-generated title string, potentially containing <think> blocks.
* @returns A sanitized, potentially truncated title string, never empty (fallback used if needed).
*/
declare function sanitizeTitle(rawTitle: string): string;
//#endregion
//#region src/utils/text.d.ts
/** Token count function that can be sync or async */
type TokenCountFn = (text: string) => number | Promise<number>;
/**
* Processes text content by counting tokens and truncating if it exceeds the specified limit.
* Uses ratio-based estimation to minimize expensive tokenCountFn calls.
*
* @param text - The text content to process
* @param tokenLimit - The maximum number of tokens allowed
* @param tokenCountFn - Function to count tokens (can be sync or async)
* @returns Promise resolving to object with processed text, token count, and truncation status
*
* @remarks
* This function uses a ratio-based estimation algorithm instead of binary search.
* Binary search would require O(log n) tokenCountFn calls (~17 for 100k chars),
* while this approach typically requires only 2-3 calls for a 90%+ reduction in CPU usage.
*/
declare function processTextWithTokenLimit({
  text,
  tokenLimit,
  tokenCountFn,
  preserve
}: {
  text: string;
  tokenLimit: number;
  tokenCountFn: TokenCountFn;
  preserve?: "start" | "end";
}): Promise<{
  text: string;
  tokenCount: number;
  wasTruncated: boolean;
}>;
//#endregion
//#region src/utils/yaml.d.ts
declare function loadYaml(filepath: string): unknown;
//#endregion
//#region src/utils/http.d.ts
/**
* Normalizes an error-like object into an HTTP status and message.
* Ensures we always respond with a valid numeric status to avoid UI hangs.
*/
declare function normalizeHttpError(err: Error | {
  status?: number;
  message?: string;
} | unknown, fallbackStatus?: number): {
  status: number;
  message: string;
};
//#endregion
//#region src/utils/tokens.d.ts
declare const maxTokensMap: Record<string, Record<string, number>>;
declare const modelMaxOutputs: {
  o1: number;
  "o1-mini": number;
  "o1-preview": number;
  "gpt-5": number;
  "gpt-5.1": number;
  "gpt-5.2": number;
  "gpt-5.3": number;
  "gpt-5.4": number;
  "gpt-5.4-pro": number;
  "gpt-5.4-mini": number;
  "gpt-5.4-nano": number;
  "gpt-5.5": number;
  "gpt-5.5-pro": number;
  "chat-latest": number;
  "gpt-5-mini": number;
  "gpt-5-nano": number;
  "gpt-5-pro": number;
  "gpt-5.2-pro": number;
  "gpt-oss-20b": number;
  "gpt-oss-120b": number;
  system_default: number;
};
declare const maxOutputTokensMap: Record<string, Record<string, number>>;
/** Finds the longest matching key in the tokens map via substring match. */
declare function findMatchingPattern(modelName: string, tokensMap: Record<string, number> | EndpointTokenConfig): string | null;
/**
* Retrieves a token value for a given model name from a tokens map.
*
* @param modelName - The name of the model to look up.
* @param tokensMap - The map of model names to token values.
* @param [key='context'] - The key to look up in the tokens map.
* @returns The token value for the given model or undefined if no match is found.
*/
declare function getModelTokenValue(modelName: string, tokensMap?: EndpointTokenConfig | Record<string, number>, key?: keyof TokenConfig): number | undefined;
/**
* Retrieves the maximum tokens for a given model name.
*
* @param modelName - The name of the model to look up.
* @param endpoint - The endpoint (default is 'openAI').
* @param [endpointTokenConfig] - Token Config for current endpoint to use for max tokens lookup
* @returns The maximum tokens for the given model or undefined if no match is found.
*/
declare function getModelMaxTokens(modelName: string, endpoint?: EModelEndpoint, endpointTokenConfig?: EndpointTokenConfig): number | undefined;
/**
* Retrieves the maximum output tokens for a given model name.
*
* @param modelName - The name of the model to look up.
* @param endpoint - The endpoint (default is 'openAI').
* @param [endpointTokenConfig] - Token Config for current endpoint to use for max tokens lookup
* @returns The maximum output tokens for the given model or undefined if no match is found.
*/
declare function getModelMaxOutputTokens(modelName: string, endpoint?: EModelEndpoint, endpointTokenConfig?: EndpointTokenConfig): number | undefined;
/**
* Retrieves the model name key for a given model name input. If the exact model name isn't found,
* it searches for partial matches within the model name, checking keys in reverse order.
*
* @param modelName - The name of the model to look up.
* @param endpoint - The endpoint (default is 'openAI').
* @returns The model name key for the given model; returns input if no match is found and is string.
*
* @example
* matchModelName('gpt-4-32k-0613'); // Returns 'gpt-4-32k-0613'
* matchModelName('gpt-4-32k-unknown'); // Returns 'gpt-4-32k'
* matchModelName('unknown-model'); // Returns undefined
*/
declare function matchModelName(modelName: string, endpoint?: EModelEndpoint): string | undefined;
declare const modelSchema: z$1.ZodObject<{
  id: z$1.ZodString;
  pricing: z$1.ZodObject<{
    prompt: z$1.ZodString;
    completion: z$1.ZodString;
  }, "strip", z$1.ZodTypeAny, {
    prompt: string;
    completion: string;
  }, {
    prompt: string;
    completion: string;
  }>;
  context_length: z$1.ZodNumber;
}, "strip">;
declare const inputSchema: z$1.ZodObject<{
  data: z$1.ZodArray<z$1.ZodObject<{
    id: z$1.ZodString;
    pricing: z$1.ZodObject<{
      prompt: z$1.ZodString;
      completion: z$1.ZodString;
    }, "strip", z$1.ZodTypeAny, {
      prompt: string;
      completion: string;
    }, {
      prompt: string;
      completion: string;
    }>;
    context_length: z$1.ZodNumber;
  }, "strip", z$1.ZodTypeAny, {
    id: string;
    pricing: {
      prompt: string;
      completion: string;
    };
    context_length: number;
  }, {
    id: string;
    pricing: {
      prompt: string;
      completion: string;
    };
    context_length: number;
  }>, "many">;
}, "strip">;
/**
* Processes a list of model data from an API and organizes it into structured data based on URL and specifics of rates and context.
* @param {{ data: Array<z.infer<typeof modelSchema>> }} input The input object containing base URL and data fetched from the API.
* @returns {EndpointTokenConfig} The processed model data.
*/
declare function processModelData(input: z$1.infer<typeof inputSchema>): EndpointTokenConfig;
//#endregion
//#region src/utils/tokenMap.d.ts
/** Signature for a function that counts tokens in a LangChain message. */
type TokenCounter = (message: BaseMessage) => number;
/**
* Lazily fills missing token counts for formatted LangChain messages.
* Preserves precomputed counts and only computes undefined indices.
*
* This is used after `formatAgentMessages` to ensure every message index
* has a token count before passing `indexTokenCountMap` to the agent run.
*/
declare function hydrateMissingIndexTokenCounts({
  messages,
  indexTokenCountMap,
  tokenCounter
}: {
  messages: BaseMessage[];
  indexTokenCountMap: Record<number, number | undefined> | undefined;
  tokenCounter: TokenCounter;
}): Record<number, number>;
//#endregion
//#region src/utils/url.d.ts
/**
* Extracts a valid OpenAI baseURL from a given string, matching "url/v1," followed by an optional suffix.
* The suffix can be one of several predefined values (e.g., 'openai', 'azure-openai', etc.),
* accommodating different proxy patterns like Cloudflare, LiteLLM, etc.
* Returns the original URL if no valid pattern is found.
*
* Examples:
* - `https://open.ai/v1/chat` -> `https://open.ai/v1`
* - `https://open.ai/v1/chat/completions` -> `https://open.ai/v1`
* - `https://gateway.ai.cloudflare.com/v1/account/gateway/azure-openai/completions` -> `https://gateway.ai.cloudflare.com/v1/account/gateway/azure-openai`
* - `https://open.ai/v1/hi/openai` -> `https://open.ai/v1/hi/openai`
* - `https://api.example.com/v1/replicate` -> `https://api.example.com/v1/replicate`
*
* @param url - The URL to be processed.
* @returns The matched pattern or input if no match is found.
*/
declare function extractBaseURL(url: string): string | null | undefined;
/**
* Extracts the base URL (protocol + hostname + port) from the provided URL.
* Used primarily for Ollama endpoints to derive the host.
* @param fullURL - The full URL.
* @returns The base URL (protocol://hostname:port).
*/
declare function deriveBaseURL(fullURL: string): string;
//#endregion
//#region src/utils/message.d.ts
/** Minimal shape for request file entries (from `req.body.files`) */
type RequestFile = {
  file_id?: string;
};
type GetMessagesByParentId = (filter: {
  user: string;
  messageId: string;
  conversationId?: string;
}, select: "_id") => Promise<unknown[]>;
/** Fields to strip from files before client transmission */
declare const FILE_STRIP_FIELDS: readonly ["text", "_id", "__v"];
/** Fields to strip from messages before client transmission */
declare const MESSAGE_STRIP_FIELDS: readonly ["fileContext"];
/**
* Strips large/unnecessary fields from a file object before transmitting to client.
* Use this within existing loops when building file arrays to avoid extra iterations.
*
* @param file - The file object to sanitize
* @returns A new file object without the stripped fields
*
* @example
* // Use in existing file processing loop:
* for (const attachment of client.options.attachments) {
*   if (messageFiles.has(attachment.file_id)) {
*     userMessage.files.push(sanitizeFileForTransmit(attachment));
*   }
* }
*/
declare function sanitizeFileForTransmit<T extends Partial<TFile>>(file: T): Omit<T, (typeof FILE_STRIP_FIELDS)[number]>;
/** Filters attachments to those whose `file_id` appears in `requestFiles`, then sanitizes each. */
declare function buildMessageFiles<T extends Partial<TFile>>(requestFiles: RequestFile[], attachments: T[]): Omit<T, (typeof FILE_STRIP_FIELDS)[number]>[];
/**
* Sanitizes a message object before transmitting to client.
* Removes large fields like `fileContext` and strips `text` from embedded files.
*
* @param message - The message object to sanitize
* @returns A new message object safe for client transmission
*
* @example
* sendEvent(res, {
*   final: true,
*   requestMessage: sanitizeMessageForTransmit(userMessage),
*   responseMessage: response,
* });
*/
declare function sanitizeMessageForTransmit<T extends Partial<TMessage>>(message: T): Omit<T, (typeof MESSAGE_STRIP_FIELDS)[number]>;
declare function isPreliminaryMessageId(messageId: unknown): messageId is string;
declare function isUnpersistedPreliminaryParent({
  userId,
  conversationId,
  parentMessageId,
  getMessages
}: {
  userId: string;
  conversationId?: string | null;
  parentMessageId?: string | null;
  getMessages: GetMessagesByParentId;
}): Promise<boolean>;
/** Minimal message shape for thread traversal.
*
* Both `files` and `attachments` carry `file_id` references, but they
* land on different roles by convention: user-uploaded files live on
* `messages.files` (set when the user attaches a file in chat), while
* code-execution outputs live on `messages.attachments` (set by
* `processCodeOutput` when a tool call produces a file). The thread
* walk must visit both so the next turn's `tool_resources.execute_code.file_ids`
* picks up files the assistant generated, not just files the user
* uploaded. */
type ThreadMessage = {
  messageId: string;
  parentMessageId?: string | null;
  files?: Array<{
    file_id?: string;
  }>;
  attachments?: Array<{
    file_id?: string;
  }>;
};
/** Result of thread data extraction */
type ThreadData = {
  messageIds: string[];
  fileIds: string[];
};
/**
* Extracts thread message IDs and file IDs in a single O(n) pass.
* Builds a Map for O(1) lookups, then traverses the thread collecting both IDs.
*
* @param messages - All messages in the conversation (should be queried with select for efficiency)
* @param parentMessageId - The ID of the parent message to start traversal from
* @returns Object containing messageIds and fileIds arrays
*/
declare function getThreadData(messages: ThreadMessage[], parentMessageId: string | null | undefined): ThreadData;
//#endregion
//#region src/utils/quotes.d.ts
/** Max characters kept per quoted excerpt (defense-in-depth over the client cap). */
declare const QUOTE_MAX_LENGTH = 1500;
/** Max number of quoted excerpts merged into a single user turn. */
declare const QUOTE_MAX_COUNT = 10;
/**
* Normalizes the `quotes` field off a request body into a clean string array.
* Trims, drops empties/non-strings, caps each excerpt length and the overall
* count. Returns `null` when there is nothing usable so callers can skip the
* merge entirely.
*/
declare function getReferencedQuotes(raw: unknown): string[] | null;
/**
* Renders quoted excerpts as Markdown blockquote blocks, one block per excerpt
* separated by a blank line. Provider-agnostic (no bespoke tags). Returns an
* empty string when there are no quotes.
*/
declare function formatQuotesAsMarkdown(quotes: string[]): string;
/**
* Merges quoted excerpts into a body of text as Markdown blockquotes, prepended
* before the text so the excerpts read as part of the user turn. Returns the
* original text unchanged when there are no quotes.
*/
declare function mergeQuotedText(text: string, quotes: string[]): string;
//#endregion
//#region src/utils/tracing.d.ts
/**
* Runs `fn` outside the LangGraph/LangSmith tracing AsyncLocalStorage context
* so I/O handles (child processes, sockets, timers) created during `fn`
* do not permanently retain the RunTree → graph config → message data chain.
*
* Relies on the private symbol `ls:tracing_async_local_storage` from `@langchain/core`.
* If the symbol is absent, falls back to calling `fn()` directly.
*/
declare function runOutsideTracing<T>(fn: () => T): T;
//#endregion
//#region src/utils/tokenizer.d.ts
type EncodingName = "o200k_base" | "claude";
declare class Tokenizer {
  private tokenizersCache;
  private loadingPromises;
  /** Pre-loads an encoding so that subsequent getTokenCount calls are accurate. */
  initEncoding(encoding: EncodingName): Promise<void>;
  getTokenCount(text: string, encoding?: EncodingName): number;
}
declare const TokenizerSingleton: Tokenizer;
/**
* Counts the number of tokens in a given text using ai-tokenizer with o200k_base encoding.
* @param text - The text to count tokens in. Defaults to an empty string.
* @returns The number of tokens in the provided text.
*/
declare function countTokens(text?: string): Promise<number>;
//#endregion
//#region src/db/utils.d.ts
/**
* Ensures that a collection exists in the database.
* For DocumentDB compatibility, it tries multiple approaches.
* @param db - The MongoDB database instance
* @param collectionName - The name of the collection to ensure exists
*/
declare function ensureCollectionExists(db: mongo.Db, collectionName: string): Promise<void>;
/**
* Ensures that all required collections exist for the permission system.
* This includes aclentries, groups, accessroles, and any other collections
* needed for migrations and permission checks.
* @param db - The MongoDB database instance
*/
declare function ensureRequiredCollectionsExist(db: mongo.Db): Promise<void>;
//#endregion
//#region src/html/devtools.d.ts
declare const QUERY_DEVTOOLS_HEADER = "x-librechat-enable-query-devtools";
interface QueryDevtoolsRequest {
  get(header: string): string | undefined;
}
declare const shouldEnableQueryDevtools: (req: QueryDevtoolsRequest) => boolean;
declare const maybeInjectQueryDevtoolsBootstrap: (html: string, req: QueryDevtoolsRequest) => string;
//#endregion
//#region src/oauth/csrf.d.ts
declare const OAUTH_CSRF_COOKIE = "oauth_csrf";
declare const OAUTH_CSRF_MAX_AGE: number;
declare const OAUTH_SESSION_COOKIE = "oauth_session";
declare const OAUTH_SESSION_MAX_AGE: number;
declare const OAUTH_SESSION_COOKIE_PATH = "/api";
/**
* Determines if secure cookies should be used.
* SESSION_COOKIE_SECURE=true/false explicitly overrides the environment heuristic.
* Returns `true` in production unless DOMAIN_SERVER uses a localhost-style hostname.
* This allows cookies to work on localhost during local development
* even when `NODE_ENV=production` (common in Docker Compose setups).
*/
declare function shouldUseSecureCookie(): boolean;
/** Generates an HMAC-based token for OAuth CSRF protection */
declare function generateOAuthCsrfToken(flowId: string, secret?: string): string;
/** Sets a SameSite=Lax CSRF cookie bound to a specific OAuth flow */
declare function setOAuthCsrfCookie(res: Response$1, flowId: string, cookiePath: string): void;
/**
* Validates the per-flow CSRF cookie against the expected HMAC.
* Uses timing-safe comparison and always clears the cookie to prevent replay.
*/
declare function validateOAuthCsrf(req: Request, res: Response$1, flowId: string, cookiePath: string): boolean;
/**
* Express middleware that sets the OAuth session cookie after JWT authentication.
* Chain after requireJwtAuth on routes that precede an OAuth redirect (e.g., reinitialize, bind).
*/
declare function setOAuthSession(req: Request, res: Response$1, next: NextFunction): void;
/** Sets a SameSite=Lax session cookie that binds the browser to the authenticated userId */
declare function setOAuthSessionCookie(res: Response$1, userId: string): void;
/** Validates the session cookie against the expected userId using timing-safe comparison */
declare function validateOAuthSession(req: Request, userId: string): boolean;
//#endregion
//#region src/oauth/failure.d.ts
type OAuthFailureRequest = Pick<Request, "headers" | "method" | "path" | "originalUrl" | "query"> & {
  id?: string;
  requestId?: string;
  session?: {
    messages?: unknown[];
  };
};
type OAuthFailureLog = {
  provider: string;
  code?: string;
  name?: string;
  message?: string;
  cause_code?: string;
  cause_name?: string;
  cause_message?: string;
  has_code: boolean;
  has_state: boolean;
  query_error?: string;
  query_error_description?: string;
  method?: string;
  path?: string;
  request_id?: string;
  host?: string;
  forwarded_host?: string;
  forwarded_proto?: string;
  forwarded_for?: string;
  real_ip?: string;
  user_agent?: string;
};
type BuildOAuthFailureLogParams = {
  provider: string;
  req: OAuthFailureRequest;
  err?: unknown;
  info?: unknown;
  defaultMessage?: string;
};
declare function getOAuthFailureMessage(req: OAuthFailureRequest, defaultMessage?: string): string;
declare function buildOAuthFailureLog({
  provider,
  req,
  err,
  info,
  defaultMessage
}: BuildOAuthFailureLogParams): OAuthFailureLog;
declare function isOAuthProtocolFailure(err?: unknown, info?: unknown): boolean;
//#endregion
//#region src/oauth/callback.d.ts
type LoginFunction = (user: unknown, options: {
  session: false;
}, done: (err?: unknown) => void) => void;
type OpenIDCallbackRequest = OAuthFailureRequest & {
  logIn?: LoginFunction;
  user?: unknown;
};
type OpenIDCallback = (err: unknown, user: unknown, info: unknown) => void;
type PassportMiddleware = (req: OpenIDCallbackRequest, res: Response$1, next: NextFunction) => unknown;
type PassportLike = {
  authenticate: (strategy: "openid", options: {
    failureMessage: true;
    session: false;
  }, callback: OpenIDCallback) => PassportMiddleware;
};
type OAuthCallbackLogLevel = "warn" | "error";
type OAuthCallbackLogger = Record<OAuthCallbackLogLevel, (message: string, details: OAuthFailureLog) => void>;
type AuthFailureRedirectOptions = {
  clientDomain?: string;
  authFailedError: string;
};
type LogOpenIDCallbackFailureOptions = {
  logger: OAuthCallbackLogger;
  req: OAuthFailureRequest;
  err?: unknown;
  info?: unknown;
  level?: OAuthCallbackLogLevel;
};
type OpenIDCallbackAuthenticatorOptions = AuthFailureRedirectOptions & {
  logger: OAuthCallbackLogger;
  passport: PassportLike;
};
declare function redirectToAuthFailure(res: Response$1, {
  clientDomain,
  authFailedError
}: AuthFailureRedirectOptions): void;
declare function logOpenIDCallbackFailure({
  logger,
  req,
  err,
  info,
  level
}: LogOpenIDCallbackFailureOptions): void;
declare function createOpenIDCallbackAuthenticator({
  passport,
  logger,
  clientDomain,
  authFailedError
}: OpenIDCallbackAuthenticatorOptions): (req: OpenIDCallbackRequest, res: Response$1, next: NextFunction) => unknown;
//#endregion
//#region src/oauth/tokens.d.ts
declare function createHandleOAuthToken({
  findToken,
  updateToken,
  createToken
}: {
  findToken: TokenMethods["findToken"];
  updateToken: TokenMethods["updateToken"];
  createToken: TokenMethods["createToken"];
}): ({
  token,
  userId,
  identifier,
  expiresIn,
  metadata,
  type
}: {
  token: string;
  userId: string;
  identifier: string;
  expiresIn?: number | string | null;
  metadata?: Record<string, unknown>;
  type?: string;
}) => Promise<IToken | null>;
/**
* Refreshes the access token using the refresh token.
* @param fields
* @param fields.userId - The ID of the user.
* @param fields.client_url - The URL of the OAuth provider.
* @param fields.identifier - The identifier for the token.
* @param fields.refresh_token - The refresh token to use.
* @param fields.token_exchange_method - The token exchange method ('default_post' or 'basic_auth_header').
* @param fields.encrypted_oauth_client_id - The client ID for the OAuth provider.
* @param fields.encrypted_oauth_client_secret - The client secret for the OAuth provider.
*/
declare function refreshAccessToken({
  userId,
  client_url,
  identifier,
  refresh_token,
  token_exchange_method,
  encrypted_oauth_client_id,
  encrypted_oauth_client_secret,
  allowedAddresses
}: {
  userId: string;
  client_url: string;
  identifier: string;
  refresh_token: string;
  token_exchange_method: TokenExchangeMethodEnum;
  encrypted_oauth_client_id: string;
  encrypted_oauth_client_secret: string;
  allowedAddresses?: string[] | null;
}, {
  findToken,
  updateToken,
  createToken
}: {
  findToken: TokenMethods["findToken"];
  updateToken: TokenMethods["updateToken"];
  createToken: TokenMethods["createToken"];
}): Promise<{
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}>;
/**
* Handles the OAuth callback and exchanges the authorization code for tokens.
* @param {object} fields
* @param {string} fields.code - The authorization code returned by the provider.
* @param {string} fields.userId - The ID of the user.
* @param {string} fields.identifier - The identifier for the token.
* @param {string} fields.client_url - The URL of the OAuth provider.
* @param {string} fields.redirect_uri - The redirect URI for the OAuth provider.
* @param {string} fields.token_exchange_method - The token exchange method ('default_post' or 'basic_auth_header').
* @param {string} fields.encrypted_oauth_client_id - The client ID for the OAuth provider.
* @param {string} fields.encrypted_oauth_client_secret - The client secret for the OAuth provider.
*/
declare function getAccessToken({
  code,
  userId,
  identifier,
  client_url,
  redirect_uri,
  token_exchange_method,
  encrypted_oauth_client_id,
  encrypted_oauth_client_secret,
  allowedAddresses
}: {
  code: string;
  userId: string;
  identifier: string;
  client_url: string;
  redirect_uri: string;
  token_exchange_method: TokenExchangeMethodEnum;
  encrypted_oauth_client_id: string;
  encrypted_oauth_client_secret: string;
  allowedAddresses?: string[] | null;
}, {
  findToken,
  updateToken,
  createToken
}: {
  findToken: TokenMethods["findToken"];
  updateToken: TokenMethods["updateToken"];
  createToken: TokenMethods["createToken"];
}): Promise<{
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}>;
//#endregion
//#region src/oauth/validation.d.ts
type ActionOAuthEndpointField = "authorization_url" | "client_url";
interface ActionOAuthAuthMetadata {
  type?: AuthTypeEnum | string | null;
  authorization_url?: string | null;
  client_url?: string | null;
}
declare function validateActionOAuthEndpoint(url: string | null | undefined, fieldName: ActionOAuthEndpointField, allowedAddresses?: string[] | null): Promise<void>;
declare function validateActionOAuthMetadata(auth?: ActionOAuthAuthMetadata | null, allowedAddresses?: string[] | null): Promise<void>;
//#endregion
//#region src/mcp/oauth/OAuthReconnectionTracker.d.ts
declare class OAuthReconnectionTracker {
  private failedMeta;
  /** Map of userId -> Set of serverNames that are actively reconnecting */
  private active;
  /** Map of userId:serverName -> timestamp when reconnection started */
  private activeTimestamps;
  /** Maximum time (ms) a server can be in reconnecting state before auto-cleanup */
  private readonly RECONNECTION_TIMEOUT_MS;
  isFailed(userId: string, serverName: string): boolean;
  /** Check if server is in the active set (original simple check) */
  isActive(userId: string, serverName: string): boolean;
  /** Check if server is still reconnecting (considers timeout) */
  isStillReconnecting(userId: string, serverName: string): boolean;
  /** Clean up server if it has timed out - returns true if cleanup was performed */
  cleanupIfTimedOut(userId: string, serverName: string): boolean;
  setFailed(userId: string, serverName: string): void;
  setActive(userId: string, serverName: string): void;
  removeFailed(userId: string, serverName: string): void;
  removeActive(userId: string, serverName: string): void;
  /** Returns map sizes for diagnostics */
  getStats(): {
    usersWithFailedServers: number;
    usersWithActiveReconnections: number;
    activeTimestamps: number;
  };
}
//#endregion
//#region src/mcp/oauth/OAuthReconnectionManager.d.ts
declare class OAuthReconnectionManager {
  private static instance;
  protected readonly flowManager: FlowStateManager<MCPOAuthTokens | null>;
  protected readonly tokenMethods: TokenMethods;
  private readonly mcpManager;
  private readonly reconnectionsTracker;
  static getInstance(): OAuthReconnectionManager;
  static createInstance(flowManager: FlowStateManager<MCPOAuthTokens | null>, tokenMethods: TokenMethods, reconnections?: OAuthReconnectionTracker): Promise<OAuthReconnectionManager>;
  constructor(flowManager: FlowStateManager<MCPOAuthTokens | null>, tokenMethods: TokenMethods, reconnections?: OAuthReconnectionTracker);
  isReconnecting(userId: string, serverName: string): boolean;
  reconnectServers(userId: string): Promise<void>;
  /**
  * Fire-and-forget wrapper around {@link tryReconnect} that guarantees any
  * unexpected rejection is surfaced via the logger instead of propagating as
  * an unhandled promise rejection. Also runs the failed-reconnect cleanup so
  * the tracker does not get stuck in `active` state for the
  * `RECONNECTION_TIMEOUT_MS` window if an error escapes
  * {@link tryReconnect}'s internal try/catch.
  */
  private safeTryReconnect;
  private cleanupOnFailedReconnect;
  /**
  * Attempts to reconnect a single OAuth MCP server.
  * @returns true if reconnection succeeded, false otherwise.
  */
  reconnectServer(userId: string, serverName: string): Promise<boolean>;
  clearReconnection(userId: string, serverName: string): void;
  private tryReconnect;
  getTrackerStats(): {
    usersWithFailedServers: number;
    usersWithActiveReconnections: number;
    activeTimestamps: number;
  };
  private canReconnect;
}
//#endregion
//#region src/crypto/jwt.d.ts
/**
* Generate a short-lived JWT token
* @param {String} userId - The ID of the user
* @param {String} [expireIn='5m'] - The expiration time for the token (default is 5 minutes)
* @returns {String} - The generated JWT token
*/
declare const generateShortLivedToken: (userId: string, expireIn?: string) => string;
//#endregion
//#region src/middleware/access.d.ts
declare function skipAgentCheck(req?: Request): boolean;
interface CheckAccessParams {
  user: IUser;
  req?: Request;
  permissionType: PermissionTypes;
  permissions: Permissions[];
  bodyProps?: Record<Permissions, string[]>;
  checkObject?: object;
  /** If skipCheck function is provided and returns true, skip permission checking */
  skipCheck?: (req?: Request) => boolean;
  getRoleByName: (roleName: string, fieldsToSelect?: string | string[]) => Promise<IRole | null>;
}
type CheckAccessWithRequestCacheParams = Omit<CheckAccessParams, "bodyProps" | "checkObject" | "skipCheck">;
/**
* Core function to check if a user has one or more required permissions
* @param user - The user object
* @param permissionType - The type of permission to check
* @param permissions - The list of specific permissions to check
* @param bodyProps - An optional object where keys are permissions and values are arrays of properties to check
* @param checkObject - The object to check properties against
* @param skipCheck - An optional function that takes the checkObject and returns true to skip permission checking
* @returns Whether the user has the required permissions
*/
declare const checkAccess: ({
  req,
  user,
  permissionType,
  permissions,
  getRoleByName,
  bodyProps,
  checkObject,
  skipCheck
}: CheckAccessParams) => Promise<boolean>;
/**
* Checks simple role permissions using a per-request promise cache.
* Use this only for checks whose result is fully described by user, role, permission type, and permissions.
*/
declare const checkAccessWithRequestCache: (params: CheckAccessWithRequestCacheParams) => Promise<boolean>;
/**
* Middleware to check if a user has one or more required permissions, optionally based on `req.body` properties.
* @param permissionType - The type of permission to check.
* @param permissions - The list of specific permissions to check.
* @param bodyProps - An optional object where keys are permissions and values are arrays of `req.body` properties to check.
* @param skipCheck - An optional function that takes req.body and returns true to skip permission checking.
* @param getRoleByName - A function to get the role by name.
* @returns Express middleware function.
*/
declare const generateCheckAccess: ({
  permissionType,
  permissions,
  bodyProps,
  skipCheck,
  getRoleByName
}: {
  permissionType: PermissionTypes;
  permissions: Permissions[];
  bodyProps?: Record<Permissions, string[]>;
  skipCheck?: (req?: Request) => boolean;
  getRoleByName: (roleName: string, fieldsToSelect?: string | string[]) => Promise<IRole | null>;
}) => ((req: Request, res: Response$1, next: NextFunction) => Promise<unknown>);
//#endregion
//#region src/middleware/admin.d.ts
/**
* Middleware to check if authenticated user has admin role.
* Should be used AFTER authentication middleware (requireJwtAuth, requireLocalAuth, etc.)
*/
declare const requireAdmin: (req: ServerRequest, res: Response$1, next: NextFunction) => Response$1 | undefined;
//#endregion
//#region src/middleware/error.d.ts
declare const ErrorController: (err: Error | CustomError, req: Request, res: Response$1, next: NextFunction) => Response$1 | void;
//#endregion
//#region src/middleware/notFound.d.ts
declare function apiNotFound(req: Request, res: Response$1): void;
//#endregion
//#region src/middleware/balance.d.ts
interface BalanceMiddlewareOptions {
  getAppConfig: (options?: {
    role?: string;
    userId?: string;
    tenantId?: string;
    refresh?: boolean;
  }) => Promise<AppConfig>;
  findBalanceByUser: (userId: string) => Promise<IBalance | null>;
  upsertBalanceFields: (userId: string, fields: IBalanceUpdate) => Promise<IBalance | null>;
}
/**
* Factory function to create middleware that synchronizes user balance settings with current balance configuration.
* @param options - Options containing getBalanceConfig function and Balance model
* @returns Express middleware function
*/
declare function createSetBalanceConfig({
  getAppConfig,
  findBalanceByUser,
  upsertBalanceFields
}: BalanceMiddlewareOptions): (req: Request, res: Response$1, next: NextFunction) => Promise<void>;
//#endregion
//#region src/middleware/json.d.ts
/**
* Middleware to handle JSON parsing errors from express.json()
* Prevents user input from being reflected in error messages (XSS prevention)
*
* This middleware should be placed immediately after express.json() middleware.
*
* @param err - Error object from express.json()
* @param req - Express request object
* @param res - Express response object
* @param next - Express next function
*
* @example
* app.use(express.json({ limit: '3mb' }));
* app.use(handleJsonParseError);
*/
declare function handleJsonParseError(err: Error & {
  status?: number;
  body?: unknown;
}, req: Request, res: Response$1, next: NextFunction): void;
//#endregion
//#region src/middleware/auth.d.ts
type AuthLogValue = string | number | boolean | readonly string[];
type AuthLogHeaderValue = string | string[] | undefined;
type AuthRoutePath = string | RegExp | readonly (string | RegExp)[];
type AuthLogRequest = {
  headers?: Record<string, AuthLogHeaderValue>;
  method?: string;
  path?: string;
  originalUrl?: string;
  url?: string;
  baseUrl?: string;
  route?: {
    path?: AuthRoutePath;
  };
  id?: string;
  requestId?: string;
};
type AuthLogState = {
  tokenProvider?: string | null;
  openidReuseEnabled: boolean;
  openidJwtAvailable: boolean;
  hasOpenIdReuseUserId: boolean;
};
type AuthLogContext = Record<string, AuthLogValue>;
declare function getAuthFailureReason(err: unknown, info: unknown, fallback?: string): string;
declare function getAuthFailureErrorName(err: unknown, info: unknown): string | undefined;
declare function buildSafeAuthLogContext(req: AuthLogRequest, authState: AuthLogState, extra?: Record<string, unknown>): AuthLogContext;
declare function formatAuthLogMessage(message: string, context: AuthLogContext): string;
//#endregion
//#region src/middleware/tenant.d.ts
/**
* Express middleware that propagates the authenticated user's `tenantId` into
* the AsyncLocalStorage context used by the Mongoose tenant-isolation plugin
* and request-scoped logging.
*
* **Placement**: Chained automatically by `requireJwtAuth` after successful
* passport authentication (req.user is populated). Must NOT be registered at
* global `app.use()` scope — `req.user` is undefined at that stage.
*
* Behaviour:
* - Authenticated request with context → wraps downstream in `tenantStorage.run(context)`
* - Authenticated request **without** `tenantId`:
*   - Strict mode (`TENANT_ISOLATION_STRICT=true`) → responds 403
*   - Non-strict (default) → passes through with user/request context only
* - Unauthenticated request → propagates request context when available
*/
declare function tenantContextMiddleware(req: ServerRequest, res: Response$1, next: NextFunction): void;
type RequestTenantSource = {
  tenantId?: string;
  user?: {
    tenantId?: string;
  } | null;
};
declare function resolveRequestTenantId(req: RequestTenantSource): string | undefined;
/**
* Re-enters tenant ALS from the server-resolved request tenant.
*
* Use this after middleware that may cross async stream boundaries (for example
* multipart parsers) and before tenant-isolated model calls. The tenant source
* is restricted to authenticated/resolved request fields, never form data.
*/
declare function restoreTenantContextFromReq(req: ServerRequest, res: Response$1, next: NextFunction): void | Promise<void>;
//#endregion
//#region src/middleware/preAuthTenant.d.ts
declare function preAuthTenantMiddleware(req: Request, res: Response$1, next: NextFunction): void;
//#endregion
//#region src/middleware/concurrency.d.ts
interface PendingRequestResult {
  allowed: boolean;
  pendingRequests: number;
  limit: number;
}
interface ViolationInfo {
  type: string;
  limit: number;
  pendingRequests: number;
  score: number;
}
/**
* Check if a user can make a new concurrent request and increment the counter if allowed.
* This is designed for resumable streams where the HTTP response lifecycle doesn't match
* the actual request processing lifecycle.
*
* When Redis is available, uses atomic INCR to prevent race conditions.
* Falls back to non-atomic get/set for in-memory cache.
*
* @param userId - The user's ID
* @returns Object with `allowed` (boolean), `pendingRequests` (current count), and `limit`
*/
declare function checkAndIncrementPendingRequest(userId: string): Promise<PendingRequestResult>;
/**
* Decrement the pending request counter for a user.
* Should be called when a generation job completes, errors, or is aborted.
*
* This function handles errors internally and will never throw - it's a cleanup
* operation that should not interrupt the main flow if cache operations fail.
*
* When Redis is available, uses atomic DECR to prevent race conditions.
* Falls back to non-atomic get/set for in-memory cache.
*
* @param userId - The user's ID
*/
declare function decrementPendingRequest(userId: string): Promise<void>;
/**
* Get violation info for logging purposes when a user exceeds the concurrent request limit.
*/
declare function getViolationInfo(pendingRequests: number, limit: number): ViolationInfo;
/**
* Check if concurrent message limiting is enabled.
*/
declare function isConcurrentLimitEnabled(): boolean;
//#endregion
//#region src/middleware/checkBalance.d.ts
interface BalanceRecord {
  tokenCredits: number;
  autoRefillEnabled?: boolean;
  refillAmount?: number;
  lastRefill?: Date;
  refillIntervalValue?: number;
  refillIntervalUnit?: RefillIntervalUnit;
}
interface TxData {
  user: string;
  model?: string;
  endpoint?: string;
  valueKey?: string;
  tokenType?: string;
  amount: number;
  endpointTokenConfig?: unknown;
  generations?: unknown[];
}
interface CheckBalanceDeps {
  findBalanceByUser: (user: string) => Promise<BalanceRecord | null>;
  getMultiplier: (params: Record<string, unknown>) => number;
  createAutoRefillTransaction: (data: Record<string, unknown>) => Promise<{
    balance: number;
  } | undefined>;
  logViolation: (req: unknown, res: unknown, type: string, errorMessage: Record<string, unknown>, score: number) => Promise<void>;
  /** Balance config for lazy initialization when no record exists */
  balanceConfig?: BalanceConfig;
  /** Upsert function for lazy initialization when no record exists */
  upsertBalanceFields?: (userId: string, fields: IBalanceUpdate) => Promise<BalanceRecord | null>;
}
/**
* Checks balance for a user and logs a violation if they cannot spend.
* Throws an error with the balance info if insufficient funds.
*/
declare function checkBalance({
  req,
  res,
  txData
}: {
  req: ServerRequest;
  res: Response$1;
  txData: TxData;
}, deps: CheckBalanceDeps): Promise<boolean>;
//#endregion
//#region src/middleware/remoteAgentAuth.d.ts
interface RemoteAgentAuthDeps {
  apiKeyMiddleware: RequestHandler;
  findUser: UserMethods["findUser"];
  getRolesByNames: RoleMethods["findRolesByNames"];
  updateUser: UserMethods["updateUser"];
  getAppConfig: (options?: GetAppConfigOptions) => Promise<AppConfig>;
}
declare function clearRemoteAgentAuthCache(): void;
/**
* Factory for Remote Agent API auth middleware.
*
* Validates Bearer tokens against configured OIDC issuer via JWKS,
* falling back to API key auth when enabled. Stateless — no session dependency.
*
* ```yaml
* endpoints:
*   agents:
*     remoteApi:
*       auth:
*         apiKey:
*           enabled: false
*         oidc:
*           enabled: true
*           issuer: <issuer>
*           jwksUri: <jwksUri>
*           audience: <audience>
*           scope: <scope>
* ```
*/
declare function createRemoteAgentAuth({
  apiKeyMiddleware,
  findUser,
  getRolesByNames,
  updateUser,
  getAppConfig
}: RemoteAgentAuthDeps): RequestHandler;
//#endregion
//#region src/middleware/share.d.ts
type ShareResourcePermissions = Partial<Record<Permissions, boolean>>;
interface SharePermissionCache {
  cacheKey: string;
  resourcePerms: ShareResourcePermissions;
}
type ShareRequest = ServerRequest & {
  params: {
    resourceType?: string;
  };
  body: RequestBody & {
    public?: boolean;
    updated?: Array<{
      type?: string;
    }>;
  };
  sharePermissionContext?: SharePermissionCache;
};
interface SharePolicyDeps {
  getRoleByName: (roleName: string, fieldsToSelect?: string | string[]) => Promise<IRole | null>;
  hasCapability: HasCapabilityFn;
}
type ShareMiddleware = (req: ShareRequest, res: Response$1, next: NextFunction) => Promise<Response$1 | void>;
declare function createSharePolicyMiddleware({
  getRoleByName,
  hasCapability
}: SharePolicyDeps): {
  checkShareAccess: ShareMiddleware;
  checkSharePublicAccess: ShareMiddleware;
};
//#endregion
//#region src/middleware/messageFilterPii.d.ts
interface PiiMatch {
  id: string;
  label: string;
}
type ContentPart$1 = {
  type?: string;
  text?: string;
  [key: string]: unknown;
};
type ChatLikeMessage = {
  role?: string;
  content?: string | ContentPart$1[];
};
declare function findPiiMatchInMessages(messages: ChatLikeMessage[] | undefined, config: MessageFilterPiiConfig | undefined): PiiMatch | null;
interface CreateMessageFilterPiiOptions {
  getConfig: (req: Request) => MessageFilterPiiConfig | undefined;
}
declare function createMessageFilterPii(options: CreateMessageFilterPiiOptions): RequestHandler;
//#endregion
//#region src/modelSpecs/index.d.ts
declare const PRIVATE_MODEL_SPEC_PRESET_FIELDS: readonly ["promptPrefix", "instructions", "additional_instructions", "system", "context", "examples"];
type PrivateModelSpecPresetField = (typeof PRIVATE_MODEL_SPEC_PRESET_FIELDS)[number];
type ModelSpecParsedBody = Partial<TConversation | TPreset | TModelSpecPreset> & Record<string, unknown>;
declare const ENFORCED_MODEL_SPEC_REQUEST_FIELDS: readonly ["chatProjectId"];
type ApplyModelSpecPresetParams = {
  modelSpec: TModelSpec;
  parsedBody: ModelSpecParsedBody;
  endpoint?: string | null;
  endpointType?: string | null;
  defaultParamsEndpoint?: string | null;
  includePresetDefaults?: boolean;
};
type ApplyModelSpecPresetResult = {
  parsedBody: ModelSpecParsedBody;
  appliedPrivateFields: Set<PrivateModelSpecPresetField>;
};
declare function findModelSpecByName(modelSpecs: Pick<TSpecsConfig, "list"> | undefined, spec: string | null | undefined): TModelSpec | undefined;
declare function isModelSpecEndpointMatch(modelSpec: Pick<TModelSpec, "preset"> | undefined, endpoint: string | null | undefined): boolean;
declare function applyModelSpecPreset({
  modelSpec,
  parsedBody,
  endpoint,
  endpointType,
  defaultParamsEndpoint,
  includePresetDefaults
}: ApplyModelSpecPresetParams): ApplyModelSpecPresetResult;
declare function resolveModelSpecPromptPrefixVariables<T extends {
  promptPrefix?: string | null;
}>(parsedBody: T, user?: TUser | null, now?: string | number | Date): T;
declare function sanitizeModelSpecs<T extends Partial<TSpecsConfig> | null | undefined>(modelSpecs: T): T;
//#endregion
//#region src/agents/avatars.d.ts
declare const MAX_AVATAR_REFRESH_AGENTS = 1e3;
declare const AVATAR_REFRESH_BATCH_SIZE = 20;
type RefreshS3UrlFn = (avatar: AgentAvatar) => Promise<string | undefined>;
type UpdateAgentFn = (searchParams: {
  id: string;
}, updateData: {
  avatar: AgentAvatar;
}, options: {
  updatingUserId: string;
  skipVersioning: boolean;
}) => Promise<unknown>;
type RefreshListAvatarsParams = {
  agents: Agent[];
  userId: string;
  refreshS3Url: RefreshS3UrlFn;
  updateAgent: UpdateAgentFn;
};
type RefreshStats = {
  updated: number;
  not_s3: number;
  no_id: number;
  no_change: number;
  s3_error: number;
  persist_error: number; /** Maps agentId to the latest valid presigned filepath for re-application on cache hits */
  urlCache: Record<string, string>;
};
/**
* Opportunistically refreshes S3-backed avatars for agent list responses.
* Processes agents in batches to prevent database connection pool exhaustion.
* Only list responses are refreshed because they're the highest-traffic surface and
* the avatar URLs have a short-lived TTL. The refresh is cached per-user for 30 minutes
* so we refresh once per interval at most.
*
* Any user with VIEW access to an agent can refresh its avatar URL. This ensures
* avatars remain accessible even when the owner hasn't logged in recently.
* The agents array should already be filtered to only include agents the user can access.
*/
declare const refreshListAvatars: ({
  agents,
  userId,
  refreshS3Url,
  updateAgent
}: RefreshListAvatarsParams) => Promise<RefreshStats>;
//#endregion
//#region src/agents/attachments.d.ts
type FileWithId = {
  file_id?: string | null;
};
type AgentContextAttachmentCarrier<TFile extends FileWithId = IMongoFile> = {
  id?: string | null;
  agentContextAttachments?: TFile[] | null;
};
type AgentContextAttachmentsByAgentId<TFile extends FileWithId = IMongoFile> = Map<string, TFile[]> | Record<string, TFile[] | undefined> | null | undefined;
declare function collectFileIds<TFile extends FileWithId>(files?: Array<TFile | null | undefined> | null): Set<string>;
declare function buildAgentContextAttachmentsByAgentId<TFile extends FileWithId>(configs: Iterable<AgentContextAttachmentCarrier<TFile> | null | undefined>): Map<string, TFile[]>;
declare function getAgentContextAttachments<TFile extends FileWithId>({
  agentId,
  attachmentsByAgentId,
  excludeFileIds
}: {
  agentId: string;
  attachmentsByAgentId: AgentContextAttachmentsByAgentId<TFile>;
  excludeFileIds?: Set<string>;
}): TFile[];
declare function buildAgentScopedContext({
  agentIds,
  attachmentsByAgentId,
  sharedRunAttachmentIds,
  req,
  tokenCountFn
}: {
  agentIds: string[];
  attachmentsByAgentId: AgentContextAttachmentsByAgentId<IMongoFile>;
  sharedRunAttachmentIds?: Set<string>;
  req?: ServerRequest;
  tokenCountFn?: TokenCountFn;
}): Promise<Map<string, string>>;
//#endregion
//#region src/agents/chain.d.ts
/**
* Helper function to create sequential chain edges with buffer string prompts
*
* @deprecated Agent Chain helper
* @param agentIds - Array of agent IDs in order of execution
* @param promptTemplate - Optional prompt template string; defaults to a predefined template if not provided
* @returns Array of edges configured for sequential chain with buffer prompts
*/
declare function createSequentialChainEdges(agentIds: string[], promptTemplate?: string): Promise<GraphEdge$1[]>;
//#endregion
//#region src/agents/client.d.ts
declare const omitTitleOptions: Set<string>;
declare function payloadParser({
  req,
  endpoint
}: {
  req: ServerRequest;
  endpoint: string;
}): Record<string, unknown> | undefined;
/**
* Anthropic's API consistently reports ~10% more tokens than the local
* claude tokenizer due to internal message framing and content encoding.
* Verified empirically across content types via the count_tokens endpoint.
*/
declare const CLAUDE_TOKEN_CORRECTION = 1.1;
type FormattedMessageContentPart = {
  type?: string;
  text?: string;
  [key: string]: unknown;
};
type FormattedMessageWithContent = {
  content?: string | FormattedMessageContentPart[];
};
declare function prependFileContext(formattedMessage: FormattedMessageWithContent, fileContext?: string | null): void;
/**
* Prepends quoted excerpts (the "Add to chat" selections persisted on
* `message.quotes`) to a formatted message's content as Markdown blockquotes.
* Applied to every user message that carries quotes — current and historical —
* so the model durably receives the referenced context and the token count
* stays consistent with what was persisted. The stored `message.text` is left
* clean; the excerpts live on `message.quotes` for the UI.
*/
declare function prependQuotes(formattedMessage: FormattedMessageWithContent, quotes?: string[] | null): void;
/**
* Estimates token cost for image and document blocks in a message's
* content array. Covers: image_url, image, image_file, document, file.
*/
declare function estimateMediaTokensForMessage(content: unknown, isClaude: boolean, getTokenCount?: (text: string) => number): number;
/**
* Single-pass token counter for formatted messages (plain objects with role/content/name).
* Handles text, tool_call, image, and document content types in one iteration,
* then applies Claude correction when applicable.
*/
declare function countFormattedMessageTokens(message: Partial<Record<string, unknown>>, encoding: Parameters<typeof TokenizerSingleton.getTokenCount>[1]): number;
declare function createTokenCounter(encoding: Parameters<typeof TokenizerSingleton.getTokenCount>[1]): (message: BaseMessage) => number;
declare function logToolError(_graph: unknown, error: unknown, toolId: string): void;
/** Finds the primary agent ID within a set of agent IDs (no suffix or lowest suffix number) */
declare function findPrimaryAgentId(agentIds: Set<string>): string | null;
/**
* Creates a mapMethod for getMessagesForConversation that processes agent content.
* - Strips agentId/groupId metadata from all content
* - For parallel agents (addedConvo with groupId): filters each group to its primary agent
* - For handoffs (agentId without groupId): keeps all content from all agents
* - For multi-agent: applies agent labels to content
*
* The key distinction:
* - Parallel execution (addedConvo): Parts have both agentId AND groupId
* - Handoffs: Parts only have agentId, no groupId
*/
declare function createMultiAgentMapper(primaryAgent: Agent, agentConfigs?: Map<string, Agent>): (message: TMessage) => TMessage;
//#endregion
//#region src/agents/config.d.ts
/**
* Resolves the effective recursion limit for an agent run via a 3-step cascade:
* 1. YAML endpoint config default (falls back to 50)
* 2. Per-agent DB override (if set and positive)
* 3. Global max cap from YAML (if set and positive)
*/
declare function resolveRecursionLimit(agentsEConfig: TAgentsEndpoint | undefined, agent: {
  recursion_limit?: number;
} | undefined): number;
//#endregion
//#region src/agents/context.d.ts
/**
* Agent type with optional tools array that can contain DynamicStructuredTool or string.
* For context operations, we only require id and instructions, other Agent fields are optional.
*/
type AgentWithTools = Pick<Agent, "id"> & Partial<Omit<Agent, "id" | "tools">> & {
  tools?: Array<DynamicStructuredTool | string>; /** Serializable tool definitions for event-driven mode */
  toolDefinitions?: LCTool$1[];
};
/**
* Extracts unique MCP server names from an agent's tools or tool definitions.
* Supports both full tool instances (tools) and serializable definitions (toolDefinitions).
* @param agent - The agent with tools and/or tool definitions
* @returns Array of unique MCP server names
*/
declare function extractMCPServers(agent: AgentWithTools): string[];
/**
* Fetches MCP instructions for the given server names.
* @param {string[]} mcpServers - Array of MCP server names
* @param {MCPManager} mcpManager - MCP manager instance
* @param {Logger} [logger] - Optional logger instance
* @returns {Promise<string>} MCP instructions string, empty if none
*/
declare function getMCPInstructionsForServers(mcpServers: string[], mcpManager: MCPManager, logger?: Logger, configServers?: Record<string, ParsedServerConfig>): Promise<string>;
/**
* Builds stable instructions for an agent by combining agent-specific context and MCP context.
* Order: baseInstructions -> mcpInstructions
*
* @param {Object} params
* @param {string} [params.baseInstructions] - Agent's base instructions
* @param {string} [params.mcpInstructions] - Agent's MCP server instructions
* @returns {string | undefined} Combined instructions, or undefined if empty
*/
declare function buildAgentInstructions({
  baseInstructions,
  mcpInstructions
}: {
  baseInstructions?: string;
  mcpInstructions?: string;
}): string | undefined;
/**
* Builds dynamic system-tail instructions for an agent.
* Order: existing additional instructions -> shared run context.
*/
declare function buildAgentAdditionalInstructions({
  additionalInstructions,
  sharedRunContext
}: {
  additionalInstructions?: string;
  sharedRunContext?: string;
}): string | undefined;
/**
* Applies run context and MCP instructions to an agent's configuration.
* Mutates the agent object in place.
*
* @param {Object} params
* @param {Agent} params.agent - The agent to update
* @param {string} params.sharedRunContext - Run-level shared context
* @param {MCPManager} params.mcpManager - MCP manager instance
* @param {Object} [params.ephemeralAgent] - Ephemeral agent config (for MCP override)
* @param {string} [params.agentId] - Agent ID for logging
* @param {Logger} [params.logger] - Optional logger instance
* @returns {Promise<void>}
*/
declare function applyContextToAgent({
  agent,
  sharedRunContext,
  mcpManager,
  ephemeralAgent,
  agentId,
  logger,
  configServers
}: {
  agent: AgentWithTools;
  sharedRunContext: string;
  mcpManager: MCPManager;
  ephemeralAgent?: TEphemeralAgent;
  agentId?: string;
  logger?: Logger;
  configServers?: Record<string, ParsedServerConfig>;
}): Promise<void>;
//#endregion
//#region src/agents/skills.d.ts
/**
* Hard ceiling on skill names resolved per request via `$` popover or
* `always-apply`. The popover realistically surfaces only a few per turn;
* the cap is a defense-in-depth against a crafted payload fanning out into
* many concurrent `getSkillByName` DB lookups.
*/
declare const MAX_MANUAL_SKILLS = 10;
/**
* Hard ceiling on `always-apply` skills primed per turn. Larger than
* `MAX_MANUAL_SKILLS` because these are admin / author curated (not
* per-request user input), so the defensive-payload concern is weaker —
* but still bounded so a pathological team config can't push dozens of
* skill bodies into every turn.
*/
declare const MAX_ALWAYS_APPLY_SKILLS = 20;
/**
* Combined hard ceiling applied in `injectSkillPrimes`. When the total
* (manual + always-apply) exceeds this, always-apply gets truncated
* first — manual invocation is explicit user intent and should never
* be silently dropped.
*/
declare const MAX_PRIMED_SKILLS_PER_TURN = 30;
/**
* Hard ceiling on individual skill name length. Real skill names are
* short slugs (e.g. `pptx`, `brand-guidelines`); anything beyond this is
* a crafted payload. Filtered out before the DB round-trip so pathological
* strings can't reach `getSkillByName` / Mongo's query planner.
*/
declare const MAX_SKILL_NAME_LENGTH = 200;
/**
* Marker tagged onto every skill-primed message (as `additional_kwargs.source`
* on a LangChain `HumanMessage`, or as `source` on the `InjectedMessage` that
* `handleSkillToolCall` emits). Downstream filtering/telemetry keys off this,
* so both construction paths must agree — keep the literal exported from one
* place rather than repeated inline.
*/
declare const SKILL_MESSAGE_SOURCE = "skill";
/**
* Discriminator tag on a skill prime message that records *why* the skill
* was primed into the turn. Stored on `additional_kwargs.trigger` of the
* `HumanMessage` produced by `injectSkillPrimes`; surfaced on UI
* (pill variants) and accessible to downstream filtering / telemetry.
*/
declare const SKILL_TRIGGER_MANUAL = "manual";
/**
* Reserved for the model-invoked path (runtime catalog → tool-call
* resolution). Declared here so the `SkillTrigger` union and the pill
* UI already speak in terms of three sources rather than growing a
* fourth value later.
*/
declare const SKILL_TRIGGER_MODEL = "model";
declare const SKILL_TRIGGER_ALWAYS_APPLY = "always-apply";
type SkillTrigger = typeof SKILL_TRIGGER_MANUAL | typeof SKILL_TRIGGER_MODEL | typeof SKILL_TRIGGER_ALWAYS_APPLY;
/**
* Predicate that identifies a LangChain message as one we spliced in via
* `injectManualSkillPrimes` (or the equivalent model-invoked path). Callers
* like `runMemory` use this to strip synthetic skill content from windows
* that should only contain real user chat — without this filter, SKILL.md
* bodies pollute memory extraction and crowd out genuine turns.
*/
declare function isSkillPrimeMessage(msg: unknown): boolean;
/**
* Scopes user-accessible skill IDs to only those configured on the agent.
*
* Semantics (pinned by unit tests):
* - `undefined` / `null` → not configured, returns the full accessible catalog.
* - `[]` (empty array) → no allowlist, returns the full accessible catalog.
*   Removing all selected skills in the builder restores the default full-catalog
*   behavior while `skills_enabled` remains true.
* - non-empty array of skill `_id` hex strings → intersection of accessible IDs
*   and agent-configured IDs.
*
* @internal Building block for {@link resolveAgentScopedSkillIds}; runtime
* call sites should prefer the resolver so the activation predicate
* (`skillsCapabilityEnabled`, ephemeral toggle, persisted `skills_enabled`)
* is enforced uniformly.
*/
declare function scopeSkillIds(accessibleSkillIds: Types.ObjectId[], agentSkills: string[] | null | undefined): Types.ObjectId[];
interface ResolveModelSpecSkillIdsParams {
  /** Skill names configured on a model spec. */
  names: string[];
  /** Full VIEW-accessible skill IDs for this user before model-spec scoping. */
  accessibleSkillIds: Types.ObjectId[];
  /** DB lookup: name → skill doc constrained to the user's accessible IDs. */
  getSkillByName?: InitializeAgentDbMethods["getSkillByName"];
}
/**
* Resolves model-spec skill names against the current user's accessible skill
* set. Config is advisory: unrecognized, inaccessible, malformed, or errored
* names are skipped with a warning so a stale model-spec entry never blocks
* the actual chat request.
*/
declare function resolveModelSpecSkillIds({
  names,
  accessibleSkillIds,
  getSkillByName
}: ResolveModelSpecSkillIdsParams): Promise<Types.ObjectId[]>;
interface ResolveAgentScopedSkillIdsParams {
  /** Agent being initialized. Reads `id`, `skills`, and `skills_enabled`. */
  agent: Pick<Agent, "id" | "skills" | "skills_enabled">;
  /** Full set of skill IDs the user can VIEW (pre-scoped by ACL). */
  accessibleSkillIds: Types.ObjectId[];
  /** Admin capability: `AgentCapabilities.skills` on the agents endpoint. */
  skillsCapabilityEnabled: boolean;
  /** Per-conversation skills badge toggle (`req.body.ephemeralAgent.skills`). */
  ephemeralSkillsToggle: boolean;
}
/**
* Strict opt-in resolver for per-agent skill scope. Activation requires an
* explicit signal from the user or the agent author:
*  - Ephemeral agent  → model-spec `skills` wins when configured:
*    `true` = full accessible catalog, string list = scoped allowlist,
*    empty list / `false` = no skills. Otherwise the skills badge toggle
*    controls the full accessible catalog.
*  - Persisted agent  → the builder's `skills_enabled` master switch.
*    Enabled + empty allowlist = full catalog; enabled + non-empty
*    allowlist = narrow to those ids; disabled (or undefined) = no skills.
*
* When not activated, returns `[]` so `injectSkillCatalog`,
* `resolveManualSkills`, and `resolveAlwaysApplySkills` all no-op.
*
* Without this gate, an `agent.skills` of `undefined` on a persisted agent
* would fall through to the "full catalog" branch of `scopeSkillIds`,
* exposing the skill tool on runs where the author never opted in.
*/
declare function resolveAgentScopedSkillIds(params: ResolveAgentScopedSkillIdsParams): Types.ObjectId[];
interface ResolveSkillActiveParams {
  /** Skill being evaluated. Only `_id` and `author` matter for resolution. */
  skill: {
    _id: Types.ObjectId | string;
    author: Types.ObjectId | string;
    deployment?: boolean;
  };
  /** Per-user overrides: `{ [skillId]: boolean }`. Missing entries use the default. */
  skillStates?: Record<string, boolean>;
  /** Current user ID. When absent, the function fails closed for all non-overridden skills. */
  userId?: string;
  /** Admin-configured default for shared skills. `true` = shared skills auto-activate. */
  defaultActiveOnShare?: boolean;
}
/**
* Resolves whether a skill should be injected into the agent catalog for the
* current user. Precedence (pinned by unit tests):
*
* 1. Explicit override in `skillStates` wins above all.
* 2. Absent `userId` → fail closed. The caller lost user context, so we do
*    not fall back to ownership-based defaults that could leak shared skills.
* 3. Owned skills (author === userId) default to **active**.
* 4. Shared skills default to `defaultActiveOnShare` (admin-configured, default `false`).
*/
declare function resolveSkillActive(params: ResolveSkillActiveParams): boolean;
interface InjectSkillCatalogParams {
  agent: Agent;
  toolDefinitions: LCTool$1[] | undefined;
  toolRegistry: LCToolRegistry$1 | undefined;
  accessibleSkillIds: Types.ObjectId[];
  contextWindowTokens: number;
  listSkillsByAccess: InitializeAgentDbMethods["listSkillsByAccess"];
  /** When true, registers bash_tool alongside skill + read_file. */
  codeEnvAvailable?: boolean;
  /** Current user ID — used to determine skill ownership for active-state resolution. */
  userId?: string;
  /** Per-user skill overrides: `{ [skillId]: boolean }`. Missing entries use the default. */
  skillStates?: Record<string, boolean>;
  /** Admin-configured default for shared skills. `true` = shared skills auto-activate. */
  defaultActiveOnShare?: boolean;
  /** Admin-configured cap on the model-visible catalog. Defaults to 100. */
  maxCatalogSkills?: number;
}
interface InjectSkillCatalogResult {
  toolDefinitions: LCTool$1[] | undefined;
  skillCount: number;
  /**
  * IDs of skills the runtime is authorized to resolve via `getSkillByName`.
  * Includes `disable-model-invocation: true` skills even though they're
  * absent from the catalog text — the skill-tool handler needs to be able
  * to fetch the doc to fire the explicit "cannot be invoked by the model"
  * rejection (instead of a generic "not found"). Per-user deactivated
  * skills are still excluded — explicit user opt-out shouldn't be
  * resolvable.
  */
  activeSkillIds: Types.ObjectId[];
  /**
  * Names of skills the runtime can resolve, mirroring `activeSkillIds`.
  * Surfaced so host-side handlers (e.g. `read_file`) can decide whether a
  * `{firstSegment}/...` path is a real skill reference vs. a code-env path
  * (`/mnt/data/...`) that should be routed to the bash fallback — without
  * issuing an extra `getSkillByName` round-trip just to discover the name
  * doesn't resolve.
  */
  activeSkillNames: Set<string>;
}
/**
* Queries accessible skills, formats a budget-aware catalog, appends it to the
* agent's additional_instructions, and registers the SkillTool definition.
* Returns updated toolDefinitions and the skill count.
*
* No tool instance is created — SkillTool is event-driven only. The tool
* definition in toolDefinitions is sufficient for the LLM to see and call it;
* the host handler intercepts the call via ON_TOOL_EXECUTE.
*
* The caller is responsible for gating on the skills capability before calling.
*/
declare function injectSkillCatalog(params: InjectSkillCatalogParams): Promise<InjectSkillCatalogResult>;
/**
* Builds the meta user message that carries a skill's SKILL.md body into a
* turn's context. Shape mirrors what `handleSkillToolCall` emits when the
* model invokes the skill tool directly, so downstream message handling
* treats all three paths identically.
*
* Used by:
*  - Phase 3 manual invocation (`$skill-name` popover) — called at turn start.
*  - Phase 5 `always-apply` frontmatter — called at turn start.
*  - `handleSkillToolCall` for model-invoked skills — called from the tool
*    execution handler.
*/
declare function buildSkillPrimeMessage(skill: {
  name: string;
  body: string;
}): InjectedMessage;
interface ResolveManualSkillsParams {
  /** Skill names the user invoked (via `$` popover or `always-apply`). */
  names: string[];
  /** DB lookup: name → skill doc, constrained to ACL-accessible IDs.
  *
  * Resolver always passes `options.preferUserInvocable: true` so a
  * same-name newer `userInvocable: false` (model-only) duplicate can't
  * shadow the older user-invocable doc the popover surfaced. Disable-
  * model-invocation status is irrelevant for the manual path.
  */
  getSkillByName: (name: string, accessibleIds: Types.ObjectId[], options?: {
    preferUserInvocable?: boolean;
    preferModelInvocable?: boolean;
  }) => Promise<{
    _id: Types.ObjectId;
    name: string;
    body: string;
    author: Types.ObjectId | string;
    deployment?: boolean;
    /**
    * Skill-declared tool allowlist, forwarded verbatim from the skill doc.
    * Surfaced on `ResolvedManualSkill` so future runtime enforcement can
    * union it into the agent's effective tool set for the turn without
    * re-fetching the document. Populated by the DB method when available.
    */
    allowedTools?: string[];
    /**
    * When `false`, the skill author opted out of manual invocation. The
    * resolver skips with a warn log rather than priming SKILL.md.
    * Defaults to `true` when omitted.
    */
    userInvocable?: boolean;
  } | null>;
  /** ACL-accessible skill IDs for this user (already scoped by `scopeSkillIds`). */
  accessibleSkillIds: Types.ObjectId[];
  /** Current user ID — required for ownership-based active-state defaults. */
  userId?: string;
  /** Per-user skill active/inactive overrides. */
  skillStates?: Record<string, boolean>;
  /** Admin-configured default for shared skills. */
  defaultActiveOnShare?: boolean;
}
/**
* Canonical shape of a skill resolved into prime-ready form. Both
* manual-invocation (`$` popover) and `always-apply` resolvers emit this
* shape so downstream pipeline stages (`injectSkillPrimes`,
* `unionPrimeAllowedTools`, `buildSkillPrimedIdsByName`) can treat either
* source uniformly. The per-prime distinction lives on
* `additional_kwargs.trigger` of the spliced `HumanMessage` (see
* `SkillTrigger`), not on this resolver output.
*/
interface ResolvedSkillPrime {
  /**
  * `_id` of the exact doc that was primed. Plumbed to the runtime so the
  * `read_file` handler can constrain its name lookup to this id and avoid
  * resolving to a different same-name doc on collisions (which would
  * cause the model's reads to hit files from a different skill than the
  * body it sees).
  */
  _id: Types.ObjectId;
  name: string;
  body: string;
  /**
  * Skill-declared tool allowlist passed through from the skill doc. Present
  * only when the skill author declared `allowed-tools` in frontmatter.
  * Currently populated but not consumed — future runtime enforcement will
  * union these into the agent's effective tool set for the turn.
  */
  allowedTools?: string[];
}
/**
* Back-compat alias for manual-invocation primes (`$` popover). Semantic
* aliases over `ResolvedSkillPrime` keep the per-source naming at call
* sites (so `manualPrimes: ResolvedManualSkill[]` stays readable) without
* maintaining parallel interfaces.
*/
type ResolvedManualSkill = ResolvedSkillPrime;
/**
* Back-compat alias for always-apply primes (auto-applied every turn).
* See `ResolvedSkillPrime` for the canonical definition.
*/
type ResolvedAlwaysApplySkill = ResolvedSkillPrime;
/**
* Resolves user-provided skill names to `{ name, body }` pairs ready for
* priming. Filters out:
*  - names not backed by an accessible skill (ACL miss or typo),
*  - skills the user has toggled inactive (respects ownership-aware defaults).
*
* The active-state filter is intentional even for explicit `$` selections:
*  1. Phase 2 closes the loop on the UI side by hiding inactive skills from
*     the popover, so a deactivated skill shouldn't be reachable through the
*     normal flow in the first place.
*  2. For API-direct callers bypassing the popover, honoring the user's
*     own activation toggle is the safer default — an opt-out toggle that
*     stops working the moment someone crafts a raw payload isn't much of
*     a toggle.
*
* Silently skips unresolvable names with a warn log — a missing `$skill` must
* never block the user's actual message from going through.
*
* Preserves input order and drops duplicate names (first wins) so a user who
* types `$foo $foo` doesn't end up with the body primed twice.
*/
declare function resolveManualSkills(params: ResolveManualSkillsParams): Promise<ResolvedManualSkill[]>;
interface ResolveAlwaysApplySkillsParams {
  /**
  * Paginated DB lookup for accessible skills with `alwaysApply: true`,
  * eagerly loaded with `body` and optional `allowedTools`. Scoped to
  * `accessibleIds` (post-`scopeSkillIds`). The resolver pages until the
  * active-state budget is filled so inactive early rows cannot starve
  * the prime catalog.
  */
  listAlwaysApplySkills: (params: {
    accessibleIds: Types.ObjectId[];
    limit: number;
    cursor?: string | null;
  }) => Promise<{
    skills: Array<{
      _id: Types.ObjectId;
      name: string;
      body: string;
      author: Types.ObjectId | string;
      allowedTools?: string[];
      deployment?: boolean;
    }>;
    has_more?: boolean;
    after?: string | null;
  }>;
  /** ACL-accessible skill IDs for this user (already scoped by `scopeSkillIds`). */
  accessibleSkillIds: Types.ObjectId[];
  /** Current user ID — required for ownership-based active-state defaults. */
  userId?: string;
  /** Per-user skill active/inactive overrides. */
  skillStates?: Record<string, boolean>;
  /** Admin-configured default for shared skills. */
  defaultActiveOnShare?: boolean;
  /** Override cap on the number of always-apply primes to resolve. Defaults to `MAX_ALWAYS_APPLY_SKILLS`. */
  maxAlwaysApplySkills?: number;
}
/**
* Resolves accessible skills with `alwaysApply: true` into prime-ready
* form. Mirrors `resolveManualSkills`' contract on purpose so the two feed
* the same `injectSkillPrimes` + `unionPrimeAllowedTools` pipeline.
*
* Paginates the DB listing until the active budget is filled (or we hit
* `MAX_ALWAYS_APPLY_PAGES`). Applying the budget pre-filter would silently
* starve the prime catalog whenever early-sorted rows happen to be
* inactive for this user (e.g. shared skills with
* `defaultActiveOnShare: false`, or explicit `skillStates` overrides).
*
* Name-level dedup across pages — the schema's uniqueness index is
* `(name, author, tenantId)`, so two authors in the same tenant can
* ship skills with the same `name` shared with a third user. First
* occurrence wins (DB sort is `updatedAt` desc, so freshest definition).
*/
declare function resolveAlwaysApplySkills(params: ResolveAlwaysApplySkillsParams): Promise<ResolvedAlwaysApplySkill[]>;
interface InjectManualSkillPrimesParams {
  /** Formatted LangChain messages produced by `formatAgentMessages`. Mutated in place. */
  initialMessages: BaseMessage[];
  /** Per-index token count map returned by `formatAgentMessages`. */
  indexTokenCountMap: Record<number, number> | undefined;
  /**
  * Resolved skill primes to splice in. Only `name` and `body` are used
  * to construct the meta `HumanMessage`; widening the type to `Pick<...>`
  * lets tests pass minimal `{ name, body }` literals without inventing
  * `_id`s. The resolver always returns full primes in production.
  */
  manualSkillPrimes: Pick<ResolvedManualSkill, "name" | "body">[];
}
interface InjectManualSkillPrimesResult {
  /** Same array reference as input (mutated). */
  initialMessages: BaseMessage[];
  /** New token map with indices shifted; same reference as input when no-op. */
  indexTokenCountMap: Record<number, number> | undefined;
  /** Number of prime messages actually inserted (for logging by the caller). */
  inserted: number;
  /** Position where primes were inserted, or -1 when no-op. */
  insertIdx: number;
}
/**
* Splices skill prime messages into a formatted message array just before
* the latest user message, and shifts the `indexTokenCountMap` so downstream
* `hydrateMissingIndexTokenCounts` fills counts for the new positions
* without corrupting accounting for pre-existing ones.
*
* Insertion semantics:
*  - `insertIdx = initialMessages.length - 1`. Empty input → no-op.
*  - Single-message input → `insertIdx = 0`, primes appear before the lone message.
*  - Map shift: entries with `idx >= insertIdx` move forward by `numPrimes`.
*    Using `>=` (not `>`) is load-bearing: the message that was at `insertIdx`
*    is pushed to `insertIdx + numPrimes` by the splice, so its count must
*    follow it.
*
* Callers are responsible for scoping (e.g. single-agent runs only — see
* `AgentClient.chatCompletion`). This helper is agent-agnostic.
*
* @deprecated Use {@link injectSkillPrimes} instead. That function accepts
* both manual and always-apply primes, applies cross-list dedup, and
* enforces the combined `MAX_PRIMED_SKILLS_PER_TURN` ceiling. Retained here
* for backward compatibility with external consumers of
* `@librechat/api` that import the manual-only splicer directly.
*/
declare function injectManualSkillPrimes(params: InjectManualSkillPrimesParams): InjectManualSkillPrimesResult;
/**
* Collects the set of skill names primed fresh this turn — the union of manual
* ($-popover) and always-apply (frontmatter) primes. Passed to
* `formatAgentMessages` as `skipSkillBodyNames` so a skill that is BOTH primed
* this turn AND present in history (as a `skill` tool_call) has its SKILL.md
* body injected exactly once — by the fresh prime via `injectSkillPrimes` — and
* is NOT also reconstructed from history. Names absent from this set still
* reconstruct from history, preserving sticky manual re-priming across turns.
*/
declare function collectFreshSkillPrimeNames({
  manualSkillPrimes,
  alwaysApplySkillPrimes
}: {
  manualSkillPrimes?: Pick<ResolvedManualSkill, "name">[];
  alwaysApplySkillPrimes?: Pick<ResolvedAlwaysApplySkill, "name">[];
}): Set<string>;
interface InjectSkillPrimesParams {
  /** Formatted LangChain messages produced by `formatAgentMessages`. Mutated in place. */
  initialMessages: BaseMessage[];
  /** Per-index token count map returned by `formatAgentMessages`. */
  indexTokenCountMap: Record<number, number> | undefined;
  /** Resolved manual-invocation primes ($-popover). */
  manualSkillPrimes?: Pick<ResolvedManualSkill, "name" | "body">[];
  /** Resolved `always-apply` primes (frontmatter-driven, auto-applied every turn). */
  alwaysApplySkillPrimes?: Pick<ResolvedAlwaysApplySkill, "name" | "body">[];
  /**
  * Combined ceiling on primes per turn. Defaults to
  * `MAX_PRIMED_SKILLS_PER_TURN`. When the sum of `manualSkillPrimes` +
  * `alwaysApplySkillPrimes` exceeds the cap, always-apply primes are
  * truncated first — manual invocation is explicit user intent and must
  * never be silently dropped.
  */
  maxPrimesPerTurn?: number;
}
interface InjectSkillPrimesResult {
  initialMessages: BaseMessage[];
  indexTokenCountMap: Record<number, number> | undefined;
  inserted: number;
  insertIdx: number;
  alwaysApplyDropped: number;
  /**
  * Count of always-apply primes dropped because the same skill name already
  * appears in the manual list — dedup prevents the same SKILL.md body from
  * being spliced in twice in one turn.
  */
  alwaysApplyDedupedFromManual: number;
}
/**
* Splices manual + always-apply skill prime messages into a formatted
* message array just before the latest user message. Ordering: always-apply
* primes first (further from the user message, ambient context), then
* manual primes (closer to the user message, explicit user intent). More
* recent context gets more attention in most LLMs, so we want explicit `$`
* picks landing closest to the latest user turn and ambient priming
* sitting further back. Shifts `indexTokenCountMap` for the combined
* splice.
*
* Cross-list dedup: if a user `$`-invokes a skill that is also marked
* `always-apply`, the always-apply copy is dropped so the SKILL.md body
* is primed only once. Manual wins (drops the always-apply side) because
* manual primes sit closer to the user message and carry explicit intent.
*
* Enforces a combined ceiling (`maxPrimesPerTurn`, default
* `MAX_PRIMED_SKILLS_PER_TURN`) by truncating always-apply first so
* manual is never silently dropped. Dedup runs before the cap so the
* cap reflects the real prime count, not the pre-dedup total.
*/
declare function injectSkillPrimes(params: InjectSkillPrimesParams): InjectSkillPrimesResult;
interface SkillPrimeContentPart {
  type: "tool_call";
  tool_call: {
    id: string;
    name: string;
    args: string;
    output: string;
    progress: number;
    type: "tool_call";
  };
}
interface BuildSkillPrimeContentPartsParams {
  /** Run / response message ID. Used as a stable seed for synthetic tool_call IDs. */
  runId: string;
  /**
  * Optional index offset. When the primes are prepended to an existing
  * contentParts array, callers can leave this 0 (IDs still stay unique
  * within the message). Exposed for explicitness only.
  */
  startOffset?: number;
}
/**
* Build completed tool_call content parts for each manually-invoked skill.
*
* Matches the shape the aggregator produces for a model-invoked skill call
* on `ON_RUN_STEP_COMPLETED` — `{ type: 'tool_call', tool_call: { id, name,
* args, output, progress: 1, type: 'tool_call' } }` — so the existing
* `SkillCall` renderer on the frontend shows identical "Skill X loaded"
* cards without any new client work.
*
* Callers (e.g. `AgentClient.chatCompletion`) prepend these to
* `this.contentParts` after `runAgents` returns so the cards persist on
* the response message and appear ahead of the model's content — matching
* the semantic that priming ran before the LLM turn.
*
* ──────────────────────────────────────────────────────────────────────
* Intentional: sticky re-priming across turns.
* ──────────────────────────────────────────────────────────────────────
* Shape parity with model-invoked tool_calls means `extractInvokedSkills
* FromPayload` (packages/api/src/agents/run.ts) treats these as ordinary
* skill invocations when scanning history, so `primeInvokedSkills` re-
* prepares the files + body on every subsequent turn for the rest of
* the conversation. This is deliberate: the skill-card UX on the assistant
* message is the user's persistent visual cue that the skill is active,
* and re-priming keeps the LLM's view consistent with what the user sees
* (and matches how model-invoked skills behave — there is no separate
* "one-shot vs. conversation-scoped" mode). To opt out of a sticky skill,
* users need to start a new conversation or edit the originating user
* message to remove the pills and resubmit — regenerate alone preserves
* the picks (`useChatFunctions.regenerate` forwards them via
* `overrideManualSkills`). A future "one-shot manual prime" mode would
* need a distinct marker on the synthetic tool_call so the history
* scanner could skip it.
*/
declare function buildSkillPrimeContentParts(primes: Pick<ResolvedManualSkill, "name" | "body">[], {
  runId,
  startOffset
}: BuildSkillPrimeContentPartsParams): SkillPrimeContentPart[];
interface SkillPrimeWithTools {
  /** Skill name — used for log attribution only. */
  name: string;
  /** Author-declared `allowed-tools` from frontmatter, if any. */
  allowedTools?: string[];
}
interface UnionPrimeAllowedToolsParams {
  /**
  * Resolved skill primes (manual + always-apply once Phase 5 lands) that
  * may carry an `allowedTools` allowlist. Order is irrelevant — the union
  * is set-based — but stable iteration helps debug logs read consistently.
  */
  primes: SkillPrimeWithTools[];
  /** Tool names already configured on the agent. Skipped when computing extras. */
  agentToolNames: string[];
}
interface UnionPrimeAllowedToolsResult {
  /**
  * Tool names contributed by skill primes that aren't already on the
  * agent. Caller is responsible for actually loading these and merging
  * the resulting tool definitions into the agent's effective set; the
  * helper itself stays pure so it can be unit-tested in isolation and
  * reused for the always-apply path.
  */
  extraToolNames: string[];
  /**
  * Per-skill breakdown of which tool names that skill contributed to the
  * final union. Useful for the debug log when the runtime drops names
  * that the registry doesn't recognize — operators can see which skill
  * asked for the missing tool.
  */
  perSkillExtras: Map<string, string[]>;
}
/**
* Computes the union of `allowed-tools` declared by a turn's resolved skill
* primes, minus tools already configured on the agent. The agent-provided
* tools are the authoritative baseline; allowed-tools only ever ADDS to
* the surface, never replaces or removes.
*
* Tolerant of unknown tool names: validation against the runtime registry
* happens at the caller (in `initialize.ts`) so we can support skills
* authored against tools LibreChat hasn't implemented yet — the registry
* intersection silently drops them with a debug log, but the import path
* never rejects them.
*
* Pure function; returns set-style data so callers can dedupe across
* concurrent always-apply + manual paths without re-implementing the
* fold themselves.
*/
declare function unionPrimeAllowedTools(params: UnionPrimeAllowedToolsParams): UnionPrimeAllowedToolsResult;
/**
* Safely pulls `manualSkills` from an untyped request body.
*
* Accepts only string[] in practice: filters out non-string elements,
* empty strings, and pathologically long names so a crafted payload
* (numbers, objects, nulls, giga-strings) can't reach `getSkillByName`
* and waste DB round-trips, matching the TypeScript contract
* (`manualSkills?: string[]` on TPayload). Returns `undefined` for
* missing / non-array inputs OR for arrays that contain no valid strings —
* callers treat undefined as "no manual invocation this turn."
*/
declare function extractManualSkills(body: unknown): string[] | undefined;
//#endregion
//#region src/agents/resources.d.ts
/**
* Function type for retrieving files from the database
* @param filter - MongoDB filter query for files
* @param _sortOptions - Sorting options (currently unused)
* @param selectFields - Field selection options
* @returns Promise resolving to array of files
*/
type TGetFiles = (filter: FilterQuery<IMongoFile>, _sortOptions: ProjectionType<IMongoFile> | null | undefined, selectFields: QueryOptions<IMongoFile> | null | undefined) => Promise<Array<TFile>>;
/**
* Function type for filtering files by agent access permissions.
* Used to enforce that only files the user has access to (via ownership or agent attachment)
* are returned after a raw DB query.
*/
type TFilterFilesByAgentAccess = (params: {
  files: Array<TFile>;
  userId: string;
  role?: string;
  agentId: string;
}) => Promise<Array<TFile>>;
/**
* Primes resources for agent execution by processing attachments and tool resources
* This function:
* 1. Fetches context/OCR files (filtered by agent access control when available)
* 2. Processes attachment files
* 3. Categorizes files into appropriate tool resources
* 4. Prevents duplicate files across all sources
*
* @param params - Parameters object
* @param params.req - Express request object
* @param params.appConfig - Application configuration object
* @param params.getFiles - Function to retrieve files from database
* @param params.filterFiles - Optional function to enforce agent-based file access control
* @param params.requestFileSet - Set of file IDs from the current request
* @param params.attachments - Promise resolving to array of attachment files
* @param params.tool_resources - Existing tool resources for the agent
* @param params.agentId - Agent ID used for access control filtering
* @returns Promise resolving to processed attachments and updated tool resources
*/
declare const primeResources: ({
  req,
  appConfig,
  getFiles,
  filterFiles,
  requestFileSet,
  attachments: _attachments,
  tool_resources: _tool_resources,
  agentId
}: {
  req: Request & {
    user?: IUser;
  };
  appConfig?: AppConfig;
  requestFileSet: Set<string>;
  attachments: Promise<Array<TFile | null>> | undefined;
  tool_resources: AgentToolResources | undefined;
  getFiles: TGetFiles;
  filterFiles?: TFilterFilesByAgentAccess;
  agentId?: string;
}) => Promise<{
  attachments: Array<TFile | undefined> | undefined;
  requestAttachments: Array<TFile | undefined> | undefined;
  agentContextAttachments: Array<TFile | undefined> | undefined;
  tool_resources: AgentToolResources | undefined;
}>;
//#endregion
//#region src/agents/initialize.d.ts
/**
* Extended agent type with additional fields needed after initialization
*/
type InitializedAgent = Agent & {
  tools: GenericTool[]; /** @deprecated use requestAttachments or agentContextAttachments based on sharing semantics. */
  attachments: IMongoFile[]; /** Files attached to the current user message/run and safe to share across run agents. */
  requestAttachments: IMongoFile[]; /** Files attached to this agent's permanent context via tool_resources. */
  agentContextAttachments: IMongoFile[];
  toolContextMap: Record<string, unknown>;
  dynamicToolContextMap?: Record<string, unknown>;
  maxContextTokens: number; /** Pre-ratio context budget (agentMaxContextNum - maxOutputTokensNum). Used by createRun to apply a configurable reserve ratio. */
  baseContextTokens?: number;
  useLegacyContent: boolean;
  resendFiles: boolean;
  tool_resources?: AgentToolResources;
  userMCPAuthMap?: Record<string, Record<string, string>>; /** Tool map for ToolNode to use when executing tools (required for PTC) */
  toolMap?: ToolMap; /** Tool registry for PTC and tool search (only present when MCP tools with env classification exist) */
  toolRegistry?: LCToolRegistry$1; /** Run-scoped MCP tool definitions for request-scoped servers. */
  mcpAvailableTools?: Record<string, LCAvailableTools>; /** Run-scoped MCP connections for request-scoped servers. */
  requestScopedConnections?: RequestScopedMCPConnectionStore; /** Serializable tool definitions for event-driven execution */
  toolDefinitions?: LCTool$1[]; /** Precomputed flag indicating if any tools have defer_loading enabled (for efficient runtime checks) */
  hasDeferredTools?: boolean; /** Whether the actions capability is enabled (resolved during tool loading) */
  actionsEnabled?: boolean; /** Maximum characters allowed in a single tool result before truncation. */
  maxToolResultChars?: number; /** Response field to read model reasoning from for custom OpenAI-compatible endpoints. */
  reasoningKey?: ReasoningResponseKey; /** Whether to reconstruct `reasoning_content` from persisted history across turns (custom endpoint opt-in). */
  includeReasoningHistory?: boolean;
  /**
  * Whether the code-execution environment is available *for this agent*.
  * Narrower than the incoming `params.codeEnvAvailable` admin flag — this
  * is `admin_capability_enabled && agent.tools.includes('execute_code')`,
  * computed once here so downstream code (`injectSkillCatalog`,
  * `enrichWithSkillConfigurable`, `primeInvokedSkills`) doesn't have to
  * re-scan the tool list on every runtime handler invocation.
  * Authoritative for both persisted and ephemeral agents: the
  * ephemeral-agent toggle is reconciled into `agent.tools` upstream
  * (`packages/api/src/agents/added.ts`), so the check is uniform.
  */
  codeEnvAvailable: boolean; /** Whether host-side skill file authoring is available for this agent/run. */
  skillAuthoringAvailable: boolean; /** Host-side file authoring tool names registered for this run. */
  fileAuthoringToolNames?: Set<string>; /** Accessible skill IDs for ACL checking at execute time */
  accessibleSkillIds?: import("mongoose").Types.ObjectId[];
  /**
  * Names of skills the runtime can resolve, mirroring `accessibleSkillIds`.
  * Surfaced to the runtime so handlers like `read_file` can decide if a
  * `{firstSegment}/...` path refers to a real skill (vs. a code-env path
  * that should be routed to the bash fallback) without an extra DB lookup.
  */
  activeSkillNames?: Set<string>; /** Number of skills in the catalog (used to determine if SkillTool should be registered) */
  skillCount?: number;
  /**
  * Skills the user manually invoked for this turn via the `$` popover, resolved
  * to their SKILL.md bodies. The AgentClient injects these as meta user
  * messages right before the latest user message in the LLM's formatted
  * message array — deterministic priming without a tool roundtrip.
  */
  manualSkillPrimes?: ResolvedManualSkill[];
  /**
  * Skills auto-primed this turn because their `always-apply` frontmatter
  * flag is set. Resolved against the same `accessibleSkillIds` set and
  * subjected to the same active-state / ACL filters as the catalog, then
  * handed to the AgentClient for splicing alongside manual primes. Their
  * `allowedTools` entries also union into the agent's effective tool set
  * via `unionPrimeAllowedTools` (same pipeline as manual primes).
  */
  alwaysApplySkillPrimes?: ResolvedAlwaysApplySkill[];
  /**
  * Pre-uploaded code-env file refs from `tool_resources.execute_code`
  * (carries the conversation's prior-turn generated artifacts and any
  * user uploads). Captured by the `loadTools` callback; the AgentClient
  * merges these across all run agents into `Graph.sessions[EXECUTE_CODE]`
  * before run start so the very first `execute_code` / `bash_tool` call
  * sees them as `_injected_files`. Without this seed the agents-side
  * `CodeExecutor` falls back to `/files/{session_id}` — but `session_id`
  * is itself only populated by a previous successful execution, so on
  * call #1 the sandbox can't see the files at all.
  */
  primedCodeFiles?: import("@librechat/agents").CodeEnvFile[];
  /**
  * Resolved token/pricing config for this agent's endpoint (admin static
  * `tokenConfig` and/or fetched custom-endpoint config). Surfaced from the
  * provider `getOptions` result so the AgentClient bills, prices, and resolves
  * context limits with the same numbers the UI shows — not default rates.
  */
  endpointTokenConfig?: EndpointTokenConfig;
};
declare const DEFAULT_MAX_CONTEXT_TOKENS = 32e3;
/**
* Parameters for initializing an agent
* Matches the CJS signature from api/server/services/Endpoints/agents/agent.js
*/
interface InitializeAgentParams {
  /** Request object */
  req: ServerRequest;
  /** Response object */
  res: Response$1;
  /** Agent to initialize */
  agent: Agent;
  /** Conversation ID (optional) */
  conversationId?: string | null;
  /** Parent message ID for determining the current thread (optional) */
  parentMessageId?: string | null;
  /** Request files */
  requestFiles?: IMongoFile[];
  /** Function to load agent tools */
  loadTools?: (params: {
    req: ServerRequest;
    res: Response$1;
    provider: string;
    agentId: string;
    tools: string[];
    model: string | null;
    tool_options: AgentToolOptions | undefined;
    tool_resources: AgentToolResources | undefined;
  }) => Promise<{
    /** Full tool instances (only present when definitionsOnly=false) */tools?: GenericTool[];
    toolContextMap?: Record<string, unknown>;
    dynamicToolContextMap?: Record<string, unknown>;
    userMCPAuthMap?: Record<string, Record<string, string>>;
    toolRegistry?: LCToolRegistry$1;
    mcpAvailableTools?: Record<string, LCAvailableTools>;
    requestScopedConnections?: RequestScopedMCPConnectionStore; /** Serializable tool definitions for event-driven mode */
    toolDefinitions?: LCTool$1[];
    hasDeferredTools?: boolean;
    actionsEnabled?: boolean;
    /**
    * Pre-uploaded code-env file refs for the agent's
    * `tool_resources.execute_code`. Bubbled up so the run host can seed
    * `Graph.sessions[EXECUTE_CODE]` before the first tool call —
    * otherwise `_injected_files` is empty on call #1 and prior-turn
    * artifacts don't reach the sandbox.
    */
    primedCodeFiles?: import("@librechat/agents").CodeEnvFile[];
  } | null>;
  /** Endpoint option (contains model_parameters and endpoint info) */
  endpointOption?: Partial<TEndpointOption>;
  /** Set of allowed providers */
  allowedProviders: Set<string>;
  /** Whether this is the initial agent */
  isInitialAgent?: boolean;
  /** Accessible skill IDs for this user (pre-computed by the caller via ACL query) */
  accessibleSkillIds?: import("mongoose").Types.ObjectId[];
  /** Whether skill file authoring should be exposed even before a user has viewable skills. */
  skillAuthoringAvailable?: boolean;
  /** Whether the code execution environment is available (execute_code capability enabled) */
  codeEnvAvailable?: boolean;
  /** Per-user skill active/inactive overrides for filtering the skill catalog. */
  skillStates?: Record<string, boolean>;
  /** Admin-configured default for shared skills (`true` = shared skills auto-activate). */
  defaultActiveOnShare?: boolean;
  /**
  * Skill names the user invoked manually for this turn via the `$` popover.
  * Resolved here (ACL + active-state filtered) and attached to the returned
  * InitializedAgent as `manualSkillPrimes` for the AgentClient to inject as
  * meta user messages before the LLM call.
  */
  manualSkills?: string[];
}
/**
* Database methods required for agent initialization
* Most methods come from data-schemas via createMethods()
* getConvoFiles not yet in data-schemas but included here for consistency
*/
interface InitializeAgentDbMethods extends EndpointDbMethods {
  /** Update usage tracking for multiple files */
  updateFilesUsage: (files: Array<{
    file_id: string;
  }>, fileIds?: string[], options?: {
    user?: string;
    tenantId?: string | null;
  }) => Promise<unknown[]>;
  /** Get files from database */
  getFiles: (filter: unknown, sort: unknown, select: unknown) => Promise<unknown[]>;
  /** Filter files by agent access permissions (ownership or agent attachment) */
  filterFilesByAgentAccess?: TFilterFilesByAgentAccess;
  /** Get tool files by IDs (user-uploaded files only, code files handled separately) */
  getToolFilesByIds: (fileIds: string[], toolSet: Set<EToolResources>, ownerScope?: FileOwnerScope) => Promise<unknown[]>;
  /** Get conversation file IDs */
  getConvoFiles: (conversationId: string) => Promise<string[] | null>;
  /** Get code-generated files by conversation ID and the file_ids
  *  referenced from messages in the current thread (collected via
  *  `messages.files[].file_id` during thread walk). */
  getCodeGeneratedFiles?: (conversationId: string, threadFileIds?: string[], ownerScope?: FileOwnerScope) => Promise<unknown[]>;
  /** Get user-uploaded execute_code files by file IDs (from message.files in thread) */
  getUserCodeFiles?: (fileIds: string[], ownerScope: FileOwnerScope) => Promise<unknown[]>;
  /** Get messages for a conversation (supports select for field projection) */
  getMessages?: (filter: {
    conversationId: string;
  }, select?: string) => Promise<Array<{
    messageId: string;
    parentMessageId?: string;
    files?: Array<{
      file_id: string;
    }>;
  }> | null>;
  /** List skill summaries for catalog injection (paginated, omits body/frontmatter) */
  listSkillsByAccess?: (params: {
    accessibleIds: import("mongoose").Types.ObjectId[];
    limit: number;
    cursor?: string | null;
  }) => Promise<{
    skills: Array<{
      _id: import("mongoose").Types.ObjectId;
      name: string;
      description: string;
      author: import("mongoose").Types.ObjectId;
      /**
      * When `true`, the skill is excluded from the catalog injected into
      * the agent's additional_instructions and the model cannot invoke it
      * via the `skill` tool. Manual `$` invocation is unaffected.
      */
      disableModelInvocation?: boolean;
      /**
      * When `false`, the skill is hidden from the `$` popover and rejected
      * by the manual-invocation resolver. Defaults to `true`.
      */
      userInvocable?: boolean; /** True for deployment-directory skills that are loaded in memory. */
      deployment?: boolean;
    }>;
    has_more?: boolean;
    after?: string | null;
  }>;
  /**
  * Load a single skill by name, constrained to an ACL-accessible ID set.
  * Returns the full document (including `body`) so manual invocation can
  * prime SKILL.md without a second DB round-trip.
  *
  * `preferUserInvocable` (manual paths): on a same-name collision,
  * prefer the newest doc with `userInvocable !== false`.
  * `preferModelInvocable` (model paths — `skill` / `read_file`): on a
  * same-name collision, prefer the newest doc with
  * `disableModelInvocation !== true`. Both fall back to the newest match
  * so the explicit-rejection error paths still fire when only the
  * non-preferred variant exists.
  */
  getSkillByName?: (name: string, accessibleIds: import("mongoose").Types.ObjectId[], options?: {
    preferUserInvocable?: boolean;
    preferModelInvocable?: boolean;
  }) => Promise<{
    _id: import("mongoose").Types.ObjectId;
    name: string;
    body: string;
    author: import("mongoose").Types.ObjectId;
    /**
    * Skill-declared tool allowlist, forwarded verbatim from the skill doc.
    * Surfaced so the resolver can carry it onto `ResolvedManualSkill` for
    * future runtime enforcement without a second round-trip.
    */
    allowedTools?: string[];
    /**
    * Set when the skill was authored with `disable-model-invocation: true`.
    * The skill tool handler short-circuits on this so a model that names
    * such a skill (e.g. via hallucination or stale catalog) gets a clear
    * rejection instead of silently executing.
    */
    disableModelInvocation?: boolean;
    /**
    * Set when the skill was authored with `user-invocable: false`. The
    * manual-invocation resolver skips with a warn log so an API-direct
    * caller can't bypass the popover-side filter.
    */
    userInvocable?: boolean; /** True for deployment-directory skills that are loaded in memory. */
    deployment?: boolean;
  } | null>;
  /**
  * Load accessible skills with `alwaysApply: true`, eagerly including
  * `body` so the priming pipeline can splice at turn start without a
  * per-skill round-trip. Cursor-paginated so the resolver can fill its
  * active-state budget even when early-sorted rows are inactive for
  * the current user.
  */
  listAlwaysApplySkills?: (params: {
    accessibleIds: import("mongoose").Types.ObjectId[];
    limit: number;
    cursor?: string | null;
  }) => Promise<{
    skills: Array<{
      _id: import("mongoose").Types.ObjectId;
      name: string;
      body: string;
      author: import("mongoose").Types.ObjectId;
      allowedTools?: string[]; /** True for deployment-directory skills that are loaded in memory. */
      deployment?: boolean;
    }>;
    has_more?: boolean;
    after?: string | null;
  }>;
}
/**
* Initializes an agent for use in requests.
* Handles file processing, tool loading, provider configuration, and context token calculations.
*
* This function is exported from @librechat/api and replaces the CJS version from
* api/server/services/Endpoints/agents/agent.js
*
* @param params - Initialization parameters
* @param deps - Optional dependency injection for testing
* @returns Promise resolving to initialized agent with tools and configuration
* @throws Error if agent provider is not allowed or if required dependencies are missing
*/
declare function initializeAgent(params: InitializeAgentParams, db?: InitializeAgentDbMethods): Promise<InitializedAgent>;
//#endregion
//#region src/agents/validation.d.ts
/**
* Permissive Request alias used by {@link validateAgentModel}. Accepts either
* the default Express `Request` or the project-specific `ServerRequest`
* (see `~/types/http`), whose `params` type is widened to `unknown`.
*/
type LooseRequest = Request<unknown, unknown, unknown>;
/** Avatar schema shared between create and update */
declare const agentAvatarSchema: z.ZodObject<{
  filepath: z.ZodString;
  source: z.ZodString;
}, "strip">;
/** Base resource schema for tool resources */
declare const agentBaseResourceSchema: z.ZodObject<{
  file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
}, "strip">;
/** File resource schema extends base with vector_store_ids */
declare const agentFileResourceSchema: z.ZodObject<{
  file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
} & {
  vector_store_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip">;
/** Tool resources schema matching AgentToolResources interface */
declare const agentToolResourcesSchema: z.ZodOptional<z.ZodObject<{
  image_edit: z.ZodOptional<z.ZodObject<{
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
  }, "strip", z.ZodTypeAny, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  }, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  }>>;
  execute_code: z.ZodOptional<z.ZodObject<{
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
  }, "strip", z.ZodTypeAny, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  }, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  }>>;
  file_search: z.ZodOptional<z.ZodObject<{
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
  } & {
    vector_store_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strip", z.ZodTypeAny, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
    vector_store_ids?: string[] | undefined;
  }, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
    vector_store_ids?: string[] | undefined;
  }>>;
  context: z.ZodOptional<z.ZodObject<{
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
  }, "strip", z.ZodTypeAny, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  }, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  }>>; /** @deprecated Use context instead */
  ocr: z.ZodOptional<z.ZodObject<{
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
  }, "strip", z.ZodTypeAny, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  }, {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  }>>;
}, "strip", z.ZodTypeAny, {
  ocr?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  } | undefined;
  context?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  } | undefined;
  execute_code?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  } | undefined;
  file_search?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
    vector_store_ids?: string[] | undefined;
  } | undefined;
  image_edit?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  } | undefined;
}, {
  ocr?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  } | undefined;
  context?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  } | undefined;
  execute_code?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  } | undefined;
  file_search?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
    vector_store_ids?: string[] | undefined;
  } | undefined;
  image_edit?: {
    file_ids?: string[] | undefined;
    files?: unknown[] | undefined;
  } | undefined;
}>>;
/** Support contact schema for agent */
declare const agentSupportContactSchema: z.ZodOptional<z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
  email: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"">, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
  name?: string | undefined;
  email?: string | undefined;
}, {
  name?: string | undefined;
  email?: string | undefined;
}>>;
/** Graph edge schema for agent handoffs */
declare const graphEdgeSchema: z.ZodObject<{
  from: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
  to: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
  description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
  edgeType: z.ZodOptional<z.ZodEnum<["handoff", "direct"]>>;
  prompt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>]>>, string | ((...args: unknown[]) => unknown) | undefined, string | ((...args: unknown[]) => unknown) | undefined>;
  excludeResults: z.ZodOptional<z.ZodBoolean>;
  promptKey: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strip">;
/** Per-tool options schema (defer_loading, allowed_callers) */
declare const toolOptionsSchema: z.ZodObject<{
  defer_loading: z.ZodOptional<z.ZodBoolean>;
  allowed_callers: z.ZodOptional<z.ZodArray<z.ZodEnum<["direct", "code_execution"]>, "many">>;
}, "strip">;
/** Agent tool options - map of tool_id to tool options */
declare const agentToolOptionsSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
  defer_loading: z.ZodOptional<z.ZodBoolean>;
  allowed_callers: z.ZodOptional<z.ZodArray<z.ZodEnum<["direct", "code_execution"]>, "many">>;
}, "strip", z.ZodTypeAny, {
  defer_loading?: boolean | undefined;
  allowed_callers?: ("direct" | "code_execution")[] | undefined;
}, {
  defer_loading?: boolean | undefined;
  allowed_callers?: ("direct" | "code_execution")[] | undefined;
}>>>;
/**
* Subagent spawning configuration for an agent. `agent_ids` is capped at
* `Constants.MAX_SUBAGENTS` so a crafted API request cannot trigger hundreds
* of `processAgent` calls (DB lookup + permission check + tool loading).
* The UI enforces the same cap, so legitimate payloads never hit the bound.
*/
declare const agentSubagentsSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowSelf: z.ZodOptional<z.ZodBoolean>;
  agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
  enabled?: boolean | undefined;
  agent_ids?: string[] | undefined;
  allowSelf?: boolean | undefined;
}, {
  enabled?: boolean | undefined;
  agent_ids?: string[] | undefined;
  allowSelf?: boolean | undefined;
}>>;
/** Base agent schema with all common fields */
declare const agentBaseSchema: z.ZodObject<{
  name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  instructions: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  avatar: z.ZodOptional<z.ZodNullable<z.ZodObject<{
    filepath: z.ZodString;
    source: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    source: string;
    filepath: string;
  }, {
    source: string;
    filepath: string;
  }>>>;
  model_parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  skills_enabled: z.ZodOptional<z.ZodBoolean>; /** @deprecated Use edges instead */
  agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  edges: z.ZodOptional<z.ZodArray<z.ZodObject<{
    from: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    to: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    edgeType: z.ZodOptional<z.ZodEnum<["handoff", "direct"]>>;
    prompt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>]>>, string | ((...args: unknown[]) => unknown) | undefined, string | ((...args: unknown[]) => unknown) | undefined>;
    excludeResults: z.ZodOptional<z.ZodBoolean>;
    promptKey: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
  }, "strip", z.ZodTypeAny, {
    from: string | string[];
    to: string | string[];
    description?: string | undefined;
    prompt?: string | ((...args: unknown[]) => unknown) | undefined;
    edgeType?: "direct" | "handoff" | undefined;
    excludeResults?: boolean | undefined;
    promptKey?: string | undefined;
  }, {
    from: string | string[];
    to: string | string[];
    description?: string | undefined;
    prompt?: string | ((...args: unknown[]) => unknown) | undefined;
    edgeType?: "direct" | "handoff" | undefined;
    excludeResults?: boolean | undefined;
    promptKey?: string | undefined;
  }>, "many">>;
  end_after_tools: z.ZodOptional<z.ZodBoolean>;
  hide_sequential_outputs: z.ZodOptional<z.ZodBoolean>;
  artifacts: z.ZodOptional<z.ZodString>;
  recursion_limit: z.ZodOptional<z.ZodNumber>;
  conversation_starters: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  tool_resources: z.ZodOptional<z.ZodObject<{
    image_edit: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
    execute_code: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
    file_search: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    } & {
      vector_store_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    }>>;
    context: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>; /** @deprecated Use context instead */
    ocr: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
  }, "strip", z.ZodTypeAny, {
    ocr?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    context?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    execute_code?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    file_search?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    } | undefined;
    image_edit?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
  }, {
    ocr?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    context?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    execute_code?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    file_search?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    } | undefined;
    image_edit?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
  }>>;
  tool_options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    defer_loading: z.ZodOptional<z.ZodBoolean>;
    allowed_callers: z.ZodOptional<z.ZodArray<z.ZodEnum<["direct", "code_execution"]>, "many">>;
  }, "strip", z.ZodTypeAny, {
    defer_loading?: boolean | undefined;
    allowed_callers?: ("direct" | "code_execution")[] | undefined;
  }, {
    defer_loading?: boolean | undefined;
    allowed_callers?: ("direct" | "code_execution")[] | undefined;
  }>>>;
  subagents: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowSelf: z.ZodOptional<z.ZodBoolean>;
    agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
    agent_ids?: string[] | undefined;
    allowSelf?: boolean | undefined;
  }, {
    enabled?: boolean | undefined;
    agent_ids?: string[] | undefined;
    allowSelf?: boolean | undefined;
  }>>;
  support_contact: z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"">, z.ZodString]>>;
  }, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
  }, {
    name?: string | undefined;
    email?: string | undefined;
  }>>;
  category: z.ZodOptional<z.ZodString>;
}, "strip">;
/** Create schema extends base with required fields for creation */
declare const agentCreateSchema: z.ZodObject<{
  name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  instructions: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  avatar: z.ZodOptional<z.ZodNullable<z.ZodObject<{
    filepath: z.ZodString;
    source: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    source: string;
    filepath: string;
  }, {
    source: string;
    filepath: string;
  }>>>;
  model_parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  skills_enabled: z.ZodOptional<z.ZodBoolean>;
  agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  edges: z.ZodOptional<z.ZodArray<z.ZodObject<{
    from: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    to: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    edgeType: z.ZodOptional<z.ZodEnum<["handoff", "direct"]>>;
    prompt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>]>>, string | ((...args: unknown[]) => unknown) | undefined, string | ((...args: unknown[]) => unknown) | undefined>;
    excludeResults: z.ZodOptional<z.ZodBoolean>;
    promptKey: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
  }, "strip", z.ZodTypeAny, {
    from: string | string[];
    to: string | string[];
    description?: string | undefined;
    prompt?: string | ((...args: unknown[]) => unknown) | undefined;
    edgeType?: "direct" | "handoff" | undefined;
    excludeResults?: boolean | undefined;
    promptKey?: string | undefined;
  }, {
    from: string | string[];
    to: string | string[];
    description?: string | undefined;
    prompt?: string | ((...args: unknown[]) => unknown) | undefined;
    edgeType?: "direct" | "handoff" | undefined;
    excludeResults?: boolean | undefined;
    promptKey?: string | undefined;
  }>, "many">>;
  end_after_tools: z.ZodOptional<z.ZodBoolean>;
  hide_sequential_outputs: z.ZodOptional<z.ZodBoolean>;
  artifacts: z.ZodOptional<z.ZodString>;
  recursion_limit: z.ZodOptional<z.ZodNumber>;
  conversation_starters: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  tool_resources: z.ZodOptional<z.ZodObject<{
    image_edit: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
    execute_code: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
    file_search: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    } & {
      vector_store_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    }>>;
    context: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>; /** @deprecated Use context instead */
    ocr: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
  }, "strip", z.ZodTypeAny, {
    ocr?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    context?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    execute_code?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    file_search?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    } | undefined;
    image_edit?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
  }, {
    ocr?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    context?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    execute_code?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    file_search?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    } | undefined;
    image_edit?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
  }>>;
  tool_options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    defer_loading: z.ZodOptional<z.ZodBoolean>;
    allowed_callers: z.ZodOptional<z.ZodArray<z.ZodEnum<["direct", "code_execution"]>, "many">>;
  }, "strip", z.ZodTypeAny, {
    defer_loading?: boolean | undefined;
    allowed_callers?: ("direct" | "code_execution")[] | undefined;
  }, {
    defer_loading?: boolean | undefined;
    allowed_callers?: ("direct" | "code_execution")[] | undefined;
  }>>>;
  subagents: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowSelf: z.ZodOptional<z.ZodBoolean>;
    agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
    agent_ids?: string[] | undefined;
    allowSelf?: boolean | undefined;
  }, {
    enabled?: boolean | undefined;
    agent_ids?: string[] | undefined;
    allowSelf?: boolean | undefined;
  }>>;
  support_contact: z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"">, z.ZodString]>>;
  }, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
  }, {
    name?: string | undefined;
    email?: string | undefined;
  }>>;
  category: z.ZodOptional<z.ZodString>;
} & {
  provider: z.ZodString;
  model: z.ZodNullable<z.ZodString>;
  tools: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip">;
/** Update schema extends base with all fields optional and additional update-only fields */
declare const agentUpdateSchema: z.ZodObject<{
  name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  instructions: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  model_parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  skills_enabled: z.ZodOptional<z.ZodBoolean>;
  agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  edges: z.ZodOptional<z.ZodArray<z.ZodObject<{
    from: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    to: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    edgeType: z.ZodOptional<z.ZodEnum<["handoff", "direct"]>>;
    prompt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>]>>, string | ((...args: unknown[]) => unknown) | undefined, string | ((...args: unknown[]) => unknown) | undefined>;
    excludeResults: z.ZodOptional<z.ZodBoolean>;
    promptKey: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
  }, "strip", z.ZodTypeAny, {
    from: string | string[];
    to: string | string[];
    description?: string | undefined;
    prompt?: string | ((...args: unknown[]) => unknown) | undefined;
    edgeType?: "direct" | "handoff" | undefined;
    excludeResults?: boolean | undefined;
    promptKey?: string | undefined;
  }, {
    from: string | string[];
    to: string | string[];
    description?: string | undefined;
    prompt?: string | ((...args: unknown[]) => unknown) | undefined;
    edgeType?: "direct" | "handoff" | undefined;
    excludeResults?: boolean | undefined;
    promptKey?: string | undefined;
  }>, "many">>;
  end_after_tools: z.ZodOptional<z.ZodBoolean>;
  hide_sequential_outputs: z.ZodOptional<z.ZodBoolean>;
  artifacts: z.ZodOptional<z.ZodString>;
  recursion_limit: z.ZodOptional<z.ZodNumber>;
  conversation_starters: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  tool_resources: z.ZodOptional<z.ZodObject<{
    image_edit: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
    execute_code: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
    file_search: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    } & {
      vector_store_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    }>>;
    context: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>; /** @deprecated Use context instead */
    ocr: z.ZodOptional<z.ZodObject<{
      file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      files: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    }, "strip", z.ZodTypeAny, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }, {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    }>>;
  }, "strip", z.ZodTypeAny, {
    ocr?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    context?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    execute_code?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    file_search?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    } | undefined;
    image_edit?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
  }, {
    ocr?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    context?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    execute_code?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
    file_search?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
      vector_store_ids?: string[] | undefined;
    } | undefined;
    image_edit?: {
      file_ids?: string[] | undefined;
      files?: unknown[] | undefined;
    } | undefined;
  }>>;
  tool_options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    defer_loading: z.ZodOptional<z.ZodBoolean>;
    allowed_callers: z.ZodOptional<z.ZodArray<z.ZodEnum<["direct", "code_execution"]>, "many">>;
  }, "strip", z.ZodTypeAny, {
    defer_loading?: boolean | undefined;
    allowed_callers?: ("direct" | "code_execution")[] | undefined;
  }, {
    defer_loading?: boolean | undefined;
    allowed_callers?: ("direct" | "code_execution")[] | undefined;
  }>>>;
  subagents: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowSelf: z.ZodOptional<z.ZodBoolean>;
    agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
    agent_ids?: string[] | undefined;
    allowSelf?: boolean | undefined;
  }, {
    enabled?: boolean | undefined;
    agent_ids?: string[] | undefined;
    allowSelf?: boolean | undefined;
  }>>;
  support_contact: z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"">, z.ZodString]>>;
  }, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
  }, {
    name?: string | undefined;
    email?: string | undefined;
  }>>;
  category: z.ZodOptional<z.ZodString>;
} & {
  avatar: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
    filepath: z.ZodString;
    source: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    source: string;
    filepath: string;
  }, {
    source: string;
    filepath: string;
  }>, z.ZodNull]>>;
  provider: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip">;
interface ValidateAgentModelParams {
  req: LooseRequest;
  res: Response$1;
  agent: Agent;
  modelsConfig: TModelsConfig;
  logViolation: (req: LooseRequest, res: Response$1, type: string, errorMessage: Record<string, unknown>, score?: number | string) => Promise<void>;
}
interface ValidateAgentModelResult {
  isValid: boolean;
  error?: {
    message: string;
  };
}
/**
* Validates an agent's model against the available models configuration.
* This is a non-middleware version of validateModel that can be used
* in service initialization flows.
*
* @param params - Validation parameters
* @returns Object indicating whether the model is valid and any error details
*/
declare function validateAgentModel(params: ValidateAgentModelParams): Promise<ValidateAgentModelResult>;
//#endregion
//#region src/agents/discovery.d.ts
/**
* Callback invoked after a sub-agent is successfully initialized.
* Used by callers that need to track per-agent tool context (e.g., for
* the ON_TOOL_EXECUTE event handler closure).
*/
type OnAgentInitializedCallback = (agentId: string, agent: Agent, config: InitializedAgent) => void;
/**
* Minimal permission check signature used to verify VIEW access on a
* candidate sub-agent before it is loaded into the run.
*/
type CheckAgentPermission = (params: {
  userId: string;
  role?: string;
  resourceType: string;
  resourceId: unknown;
  requiredPermission: number;
}) => Promise<boolean>;
interface DiscoverConnectedAgentsParams {
  req: ServerRequest;
  res: Response$1;
  /** The already-initialized primary agent config (starting point for BFS). */
  primaryConfig: InitializedAgent;
  /**
  * Optional legacy chain: agent IDs to append as sequential direct edges.
  * Used by the deprecated Agent Chain feature.
  */
  agent_ids?: string[];
  endpointOption?: Partial<TEndpointOption>;
  allowedProviders: Set<string>;
  modelsConfig: TModelsConfig;
  loadTools: InitializeAgentParams["loadTools"];
  requestFiles?: InitializeAgentParams["requestFiles"];
  conversationId?: string | null;
  parentMessageId?: string | null;
  /**
  * ResourceType to check each sub-agent's access against. Defaults to
  * `AGENT` for the in-app chat flow. Callers whose entry-point gates on
  * a different resource type (e.g. the OpenAI-compat controllers gate on
  * `REMOTE_AGENT`) must pass the matching resource type so sub-agents
  * don't bypass the same sharing boundary enforced at the route.
  */
  resourceType?: string;
  /**
  * Optional per-sub-agent skill scoper. When provided, its return value
  * is forwarded to `initializeAgent` as `accessibleSkillIds` so each
  * handoff agent sees only the skills that match its own `skills`
  * allowlist (or the full accessible set when scoping is disabled).
  */
  computeAccessibleSkillIds?: (agent: Agent) => InitializeAgentParams["accessibleSkillIds"];
  /** Optional per-sub-agent skill authoring gate, paired with the scoped skill IDs. */
  computeSkillAuthoringAvailable?: (agent: Agent, accessibleSkillIds: InitializeAgentParams["accessibleSkillIds"]) => InitializeAgentParams["skillAuthoringAvailable"];
  /** Per-user skill active/inactive state, forwarded to each sub-agent. */
  skillStates?: InitializeAgentParams["skillStates"];
  /** Default active-on-share flag, forwarded to each sub-agent. */
  defaultActiveOnShare?: InitializeAgentParams["defaultActiveOnShare"];
  /**
  * Whether the `execute_code` capability is enabled for the run. Forwarded
  * verbatim to each handoff sub-agent so `registerCodeExecutionTools` can
  * expand `agent.tools: ['execute_code']` into the `bash_tool` + `read_file`
  * pair. Omitted (or `undefined`) → the expansion is skipped, matching the
  * primary-agent gate; callers that already resolved the capability set
  * for the primary SHOULD forward the same value here or sub-agents lose
  * code-execution tooling even though their parent had it.
  */
  codeEnvAvailable?: InitializeAgentParams["codeEnvAvailable"];
}
interface DiscoverConnectedAgentsDeps {
  /** Fetch an agent by string id from the database. */
  getAgent: (filter: {
    id: string;
  }) => Promise<Agent | null>;
  /** Permission check (typically a wrapper around PermissionService.checkPermission). */
  checkPermission: CheckAgentPermission;
  /** Violation logger passed through to validateAgentModel. */
  logViolation: ValidateAgentModelParams["logViolation"];
  /** DB methods consumed by initializeAgent for each sub-agent. */
  db: InitializeAgentDbMethods;
  /** Optional callback invoked after each sub-agent is initialized. */
  onAgentInitialized?: OnAgentInitializedCallback;
  /** Optional callback invoked when an agent id is skipped (missing or no access). */
  onAgentSkipped?: (agentId: string) => void;
  /**
  * Optional override for `initializeAgent`. Exists primarily so JS callers
  * can inject their test doubles via `jest.mock('@librechat/api')` — since
  * this module's own direct import would otherwise bypass that mock.
  */
  initializeAgent?: typeof initializeAgent;
  /** Optional override for `validateAgentModel` (same DI rationale). */
  validateAgentModel?: typeof validateAgentModel;
}
interface DiscoverConnectedAgentsResult {
  /** Map of agentId -> initialized config for every discovered sub-agent. */
  agentConfigs: Map<string, InitializedAgent>;
  /** Deduplicated, orphan-filtered edges across the primary and sub-agents. */
  edges: GraphEdge[];
  /** Agent ids that were requested but could not be loaded (missing or no access). */
  skippedAgentIds: Set<string>;
  /** Merged MCP auth map from the primary and all sub-agents. */
  userMCPAuthMap?: Record<string, Record<string, string>>;
}
/**
* Discovers and initializes all agents reachable from `primaryConfig.edges`
* via BFS. This is the shared graph-topology discovery logic that enables
* multi-agent handoffs (A -> B -> C) in both the primary chat flow and the
* OpenAI-compatible / Responses API controllers.
*
* Skips agents the caller cannot load (missing from DB or lacking VIEW
* permission) and filters out orphaned edges so `createRun` never sees an
* edge pointing at a missing node — which would otherwise trigger a
* `Found edge ending at unknown node` validation error from StateGraph.
*/
declare function discoverConnectedAgents(params: DiscoverConnectedAgentsParams, deps: DiscoverConnectedAgentsDeps): Promise<DiscoverConnectedAgentsResult>;
//#endregion
//#region src/agents/edges.d.ts
/**
* Creates a stable key for edge deduplication.
* Handles both single and array-based from/to values.
*/
declare function getEdgeKey(edge: GraphEdge): string;
/**
* Extracts all agent IDs referenced in an edge (both from and to).
*/
declare function getEdgeParticipants(edge: GraphEdge): string[];
/**
* Drops orphaned agents from edge endpoints, returning only the edges
* that still have at least one valid source and one valid destination.
*
* For multi-source / multi-destination edges, orphaned ids are stripped
* from the array rather than dropping the whole edge: `{ from: ['A','B'],
* to: 'C' }` with B skipped becomes `{ from: ['A'], to: 'C' }`. This
* matches the agents SDK's `MultiAgentGraph.createWorkflow`, which adds
* one LangGraph edge per source/destination pair (`builder.addEdge(src,
* dest)`), so losing one co-source (or one co-destination) doesn't
* invalidate the routes through the remaining members.
*
* An edge is dropped only when it has no surviving source OR no
* surviving destination — the SDK's per-source `addEdge` can't run if
* either side is empty, and any orphaned id left in place would still
* trigger `Found edge ending at unknown node` at compile time.
*/
declare function filterOrphanedEdges(edges: GraphEdge[], skippedAgentIds: Set<string>): GraphEdge[];
/** Collects all unique agent IDs referenced across an array of edges. */
declare function collectEdgeAgentIds(edges: GraphEdge[] | undefined): Set<string>;
/**
* Result of discovering and aggregating edges from connected agents.
*/
interface EdgeDiscoveryResult {
  /** Deduplicated edges from all discovered agents */
  edges: GraphEdge[];
  /** Agent IDs that were not found (orphaned references) */
  skippedAgentIds: Set<string>;
}
/**
* Collects and deduplicates edges, tracking new agents to process.
* Used for BFS discovery of connected agents.
*/
declare function createEdgeCollector(checkAgentInit: (agentId: string) => boolean, skippedAgentIds: Set<string>): {
  edgeMap: Map<string, GraphEdge>;
  agentsToProcess: Set<string>;
  collectEdges: (edgeList: GraphEdge[] | undefined) => void;
};
//#endregion
//#region src/agents/skillFiles.d.ts
interface SkillFileRecord {
  relativePath: string;
  filename: string;
  filepath: string;
  source: string;
  bytes: number;
  codeEnvRef?: CodeEnvRef;
}
interface PrimeSkillFilesParams {
  skill: {
    body: string;
    name: string;
    _id: Types.ObjectId | string;
    /** Monotonic counter on the skill record. Bumped on every edit
    *  (frontmatter / body / file upsert). Threaded into `codeEnvRef.version`
    *  so codeapi's sessionKey scopes the cache per-revision. */
    version: number;
  };
  skillFiles: SkillFileRecord[];
  req: ServerRequest;
  getStrategyFunctions: (source: string) => {
    getDownloadStream?: (req: ServerRequest, filepath: string) => Promise<NodeJS.ReadableStream>;
    [key: string]: unknown;
  };
  batchUploadCodeEnvFiles: (params: {
    req: ServerRequest;
    files: Array<{
      stream: NodeJS.ReadableStream;
      filename: string;
    }>;
    /** Resource kind that owns the batch's storage session. Drives codeapi's
    *  sessionKey derivation (`<tenant>:<kind>:<id>[:v:<version>]`). */
    kind: "skill" | "agent" | "user"; /** Resource id (skillId / agentId / userId). */
    id: string; /** Required when `kind === 'skill'`; forbidden otherwise. */
    version?: number;
    /** When true, codeapi tags every file in the batch as infrastructure
    *  (read-only inputs that must never surface as generated artifacts,
    *  even if sandboxed code mutates the bytes on disk). */
    read_only?: boolean;
  }) => Promise<{
    storage_session_id: string;
    files: Array<{
      fileId: string;
      filename: string;
    }>;
  }>;
  /** Checks if a code env file is still active. Returns lastModified timestamp or null. */
  getSessionInfo?: (ref: CodeEnvRef, req?: ServerRequest) => Promise<string | null>;
  /** 23-hour freshness check */
  checkIfActive?: (dateString: string) => boolean;
  /** Persists `codeEnvRef` on skill files after upload. Implementations
  *  warn-log on partial writes (matchedCount/modifiedCount mismatch)
  *  internally — caller can fire-and-forget without losing visibility. */
  updateSkillFileCodeEnvIds?: (updates: Array<{
    skillId: Types.ObjectId | string;
    relativePath: string;
    codeEnvRef: CodeEnvRef;
  }>) => Promise<{
    matchedCount: number;
    modifiedCount: number;
  } | void>;
}
interface PrimeSkillFilesResult {
  /** Representative storage session id (first file's). */
  storage_session_id: string;
  files: Array<{
    /** Storage file id (the per-file uuid file_server returned at upload). */id: string;
    /** Resource id — the entity that owns the storage session. For skill
    *  files this is `skill._id.toString()`. Distinct from `id`; codeapi
    *  derives the sessionKey from `resource_id` (shared cache scope) but
    *  validates upload presence under `id` (per-file storage key). */
    resource_id: string;
    storage_session_id: string;
    name: string;
    kind: "skill" | "agent" | "user";
    version?: number;
  }>;
}
/**
* Uploads skill files to the code execution environment.
*
* Smart re-upload: if skill files have existing codeEnvIdentifiers,
* checks session freshness first. If the session is still active,
* returns cached references. Otherwise batch-uploads everything.
*
* After upload, persists new codeEnvIdentifiers on the SkillFile
* documents for future freshness checks.
*/
declare function primeSkillFiles(params: PrimeSkillFilesParams): Promise<PrimeSkillFilesResult | null>;
interface PrimeInvokedSkillsDeps {
  req: ServerRequest;
  /** Raw message payload (before formatAgentMessages). Used to extract invoked skill names. */
  payload: Array<Partial<{
    role: string;
    content: unknown;
  }>>;
  accessibleSkillIds: Types.ObjectId[];
  /** `execute_code` capability flag for the run. When false, the batch-upload
  *  path is skipped entirely — skill bodies still reconstruct for history
  *  rebuilds, but no sandbox traffic is generated. */
  codeEnvAvailable: boolean;
  getSkillByName: (name: string, accessibleIds: Types.ObjectId[]) => Promise<{
    body: string;
    name: string;
    _id: Types.ObjectId;
    version: number;
    fileCount: number;
  } | null>;
  listSkillFiles: (skillId: Types.ObjectId | string) => Promise<SkillFileRecord[]>;
  getStrategyFunctions: PrimeSkillFilesParams["getStrategyFunctions"];
  batchUploadCodeEnvFiles: PrimeSkillFilesParams["batchUploadCodeEnvFiles"];
  getSessionInfo?: PrimeSkillFilesParams["getSessionInfo"];
  checkIfActive?: PrimeSkillFilesParams["checkIfActive"];
  updateSkillFileCodeEnvIds?: PrimeSkillFilesParams["updateSkillFileCodeEnvIds"];
}
interface PrimeInvokedSkillsResult {
  initialSessions?: ToolSessionMap;
  /** Pre-resolved skill bodies keyed by skill name. Passed to formatAgentMessages
  *  so it can reconstruct HumanMessages at the right position in the message sequence. */
  skills?: Map<string, string>;
}
/**
* Extracts previously invoked skills from message history, resolves their
* bodies from DB, and re-primes their files to the code env.
*
* Returns:
* - initialSessions: seeds Graph.sessions so ToolNode injects session_id into bash/code tools
* - skills: Map of skillName → body for formatAgentMessages to reconstruct HumanMessages
*/
declare function primeInvokedSkills(deps: PrimeInvokedSkillsDeps): Promise<PrimeInvokedSkillsResult>;
//#endregion
//#region src/agents/handlers.d.ts
interface ToolEndCallbackData {
  output: {
    name: string;
    tool_call_id: string;
    content: string | unknown;
    artifact?: unknown;
  };
}
interface ToolEndCallbackMetadata {
  run_id?: string;
  thread_id?: string;
  [key: string]: unknown;
}
type ToolEndCallback = (data: ToolEndCallbackData, metadata: ToolEndCallbackMetadata) => Promise<void>;
interface ToolExecuteOptions {
  /** Loads tools by name, using agentId to look up agent-specific context */
  loadTools: (toolNames: string[], agentId?: string) => Promise<{
    loadedTools: StructuredToolInterface[]; /** Additional configurable properties to merge (e.g., userMCPAuthMap) */
    configurable?: Record<string, unknown>;
  }>;
  /** Callback to process tool artifacts (code output files, file citations, etc.) */
  toolEndCallback?: ToolEndCallback;
  /**
  * Loads a skill by name with ACL constraint (returns full body for injection).
  *
  * `options.preferModelInvocable` (Phase 6): on a same-name collision,
  * prefer the newest `disableModelInvocation !== true` doc. Avoids a
  * newer disabled duplicate shadowing the cataloged model-invocable
  * skill the model actually targeted; falls back to newest match so
  * the explicit-rejection gate can still fire in the disabled-only case.
  */
  getSkillByName?: (name: string, accessibleIds: Types.ObjectId[], options?: {
    preferUserInvocable?: boolean;
    preferModelInvocable?: boolean;
  }) => Promise<{
    body: string;
    name: string;
    _id: Types.ObjectId;
    /** Monotonic counter on the skill record. Threaded into
    *  `codeEnvRef.version` so codeapi's sessionKey scopes the cache
    *  per-revision; bumping the version on edit invalidates the
    *  prior cache entry. */
    version: number;
    fileCount: number; /** True for deployment-directory skills that are loaded in memory. */
    deployment?: boolean;
    /**
    * Set when the skill author opted out of model invocation. The handler
    * rejects the call and returns an instructive error so the model knows
    * it can't reach the skill via the `skill` tool — manual `$` invocation
    * is still allowed and goes through `resolveManualSkills` instead.
    */
    disableModelInvocation?: boolean;
  } | null>;
  /**
  * Loads a skill by name when the current user is the author. This is a
  * narrow recovery path for freshly-authored skills whose runtime catalog
  * snapshot has not caught up yet; normal skill resolution still goes
  * through `accessibleSkillIds`.
  */
  getAuthorSkillByName?: (params: {
    req: ServerRequest;
    name: string;
  }) => Promise<{
    body: string;
    name: string;
    _id: Types.ObjectId;
    version: number;
    fileCount: number;
    disableModelInvocation?: boolean;
  } | null>;
  /** Creates a skill from a tool-authored SKILL.md body. */
  createSkill?: (data: {
    name: string;
    description: string;
    body: string;
    frontmatter?: Record<string, unknown>;
    author: Types.ObjectId;
    authorName: string;
    alwaysApply?: boolean;
    tenantId?: string;
  }) => Promise<{
    skill: {
      _id: Types.ObjectId;
      name: string;
      body: string;
      version: number;
    };
  }>;
  /** Updates a skill body and derived metadata from a tool-authored SKILL.md body. */
  updateSkill?: (params: {
    id: string;
    expectedVersion: number;
    update: {
      body?: string;
      description?: string;
      frontmatter?: Record<string, unknown>;
      alwaysApply?: boolean;
    };
  }) => Promise<{
    status: "updated";
    skill: {
      _id: Types.ObjectId;
      name: string;
      body: string;
      version: number;
    };
  } | {
    status: "conflict";
    current: {
      _id: Types.ObjectId;
      name: string;
      version: number;
    };
  } | {
    status: "not_found";
  }>;
  /** Checks role-level skill creation permission for the current user. */
  canCreateSkill?: (params: {
    req: ServerRequest;
  }) => Promise<boolean>;
  /** Checks resource-level edit permission for an existing skill. */
  canEditSkill?: (params: {
    req: ServerRequest;
    skillId: Types.ObjectId | string;
  }) => Promise<boolean>;
  /** Grants SKILL_OWNER to the current user after a tool-created skill is inserted. */
  grantSkillOwner?: (params: {
    req: ServerRequest;
    skillId: Types.ObjectId | string;
  }) => Promise<void>;
  /** Deletes a freshly-created skill if owner-permission setup fails. */
  deleteSkill?: (id: string) => Promise<{
    deleted: boolean;
  }>;
  /** Saves or replaces a bundled skill file in configured storage and metadata. */
  saveSkillFileContent?: (params: {
    req: ServerRequest;
    skillId: Types.ObjectId | string;
    relativePath: string;
    content: string;
    mimeType: string;
  }) => Promise<{
    bytes: number;
    relativePath: string;
  }>;
  /** Lists files bundled with a skill (for code env priming) */
  listSkillFiles?: (skillId: Types.ObjectId | string) => Promise<SkillFileRecord[]>;
  /** Storage strategy resolver for skill file streaming */
  getStrategyFunctions?: (source: string) => {
    getDownloadStream?: (req: ServerRequest, filepath: string) => Promise<NodeJS.ReadableStream>;
    [key: string]: unknown;
  };
  /** Batch uploads files to the code execution environment. `kind`/`id`/
  *  `version?` carry the resource identity codeapi uses to derive the
  *  sessionKey for the batch's storage bucket. */
  batchUploadCodeEnvFiles?: (params: {
    req: ServerRequest;
    files: Array<{
      stream: NodeJS.ReadableStream;
      filename: string;
    }>;
    kind: "skill" | "agent" | "user";
    id: string;
    version?: number;
    read_only?: boolean;
  }) => Promise<{
    storage_session_id: string;
    files: Array<{
      fileId: string;
      filename: string;
    }>;
  }>;
  /** Checks if a code env file is still active. Returns lastModified or null. */
  getSessionInfo?: (ref: CodeEnvRef, req?: ServerRequest) => Promise<string | null>;
  /** 23-hour freshness check */
  checkIfActive?: (dateString: string) => boolean;
  /** Persists `codeEnvRef` on skill files after upload */
  updateSkillFileCodeEnvIds?: (updates: Array<{
    skillId: Types.ObjectId | string;
    relativePath: string;
    codeEnvRef: CodeEnvRef;
  }>) => Promise<void>;
  /** Loads a skill file by path (for read_file tool) */
  getSkillFileByPath?: (skillId: Types.ObjectId | string, relativePath: string) => Promise<{
    content?: string;
    isBinary?: boolean;
    mimeType: string;
    bytes: number;
    filepath: string;
    source: string;
    relativePath: string;
  } | null>;
  /** Updates cached content on a skill file (lazy caching after first read) */
  updateSkillFileContent?: (skillId: Types.ObjectId | string, relativePath: string, update: {
    content?: string;
    isBinary?: boolean;
  }) => Promise<void>;
  /**
  * Reads a code-execution sandbox file by shelling `cat` through the
  * sandbox `/exec` endpoint. The host implementation supplies the
  * codeapi base URL + auth and forwards the seeded `session_id` and
  * `files` so the read lands in the same sandbox session that holds
  * the agent's prior-turn artifacts. Returns `null` when codeapi is
  * unavailable; throws on transport errors so the handler can surface
  * a meaningful error message to the model.
  */
  readSandboxFile?: (params: {
    file_path: string;
    session_id?: string;
    files?: Array<{
      id: string;
      name: string;
      session_id?: string;
      storage_session_id?: string;
    }>;
    req?: ServerRequest;
  }) => Promise<{
    content: string;
  } | null>;
  /**
  * Writes a UTF-8 text file into the code-execution sandbox via the
  * sandbox `/exec` endpoint. Mirrors `readSandboxFile` session forwarding
  * so host-side file-authoring tools can operate in the same sandbox
  * session as `bash_tool` / `read_file`.
  */
  writeSandboxFile?: (params: {
    file_path: string;
    content: string;
    session_id?: string;
    files?: Array<{
      id: string;
      name: string;
      session_id?: string;
      storage_session_id?: string;
    }>;
    req?: ServerRequest;
  }) => Promise<{
    stdout?: string;
    stderr?: string;
    session_id?: string;
    files?: Array<{
      id: string;
      name: string;
      storage_session_id?: string;
      session_id?: string;
    }>;
  } | null>;
}
/**
* Creates the ON_TOOL_EXECUTE handler for event-driven tool execution.
* This handler receives batched tool calls, loads the required tools,
* executes them in parallel, and resolves with the results.
*/
declare function createToolExecuteHandler(options: ToolExecuteOptions): EventHandler$1;
/**
* Creates a handlers object that includes ON_TOOL_EXECUTE.
* Can be merged with other handler objects.
*/
declare function createToolExecuteHandlers(options: ToolExecuteOptions): Record<string, EventHandler$1>;
//#endregion
//#region src/agents/legacy.d.ts
/**
* Converts OCR tool resource to context tool resource in place.
* This modifies the input object directly (used for updateData in the handler).
*
* @param data - Object containing tool_resources and/or tools to convert
* @returns void - modifies the input object directly
*/
declare function convertOcrToContextInPlace(data: {
  tool_resources?: AgentToolResources;
  tools?: string[];
}): void;
/**
* Merges tool resources from existing agent with incoming update data,
* converting OCR to context and handling deduplication.
* Used when existing agent has OCR that needs to be converted and merged with updateData.
*
* @param existingAgent - The existing agent data
* @param updateData - The incoming update data
* @returns Object with merged tool_resources and tools
*/
declare function mergeAgentOcrConversion(existingAgent: {
  tool_resources?: AgentToolResources;
  tools?: string[];
}, updateData: {
  tool_resources?: AgentToolResources;
  tools?: string[];
}): {
  tool_resources?: AgentToolResources;
  tools?: string[];
};
//#endregion
//#region src/agents/memory.d.ts
type RequiredMemoryMethods = Pick<MemoryMethods, "setMemory" | "deleteMemory" | "getFormattedMemories">;
interface MemoryConfig {
  validKeys?: string[];
  instructions?: string;
  llmConfig?: Partial<LLMConfig>;
  tokenLimit?: number;
}
declare const memoryInstructions = "The system automatically stores important user information and can update or delete memories based on user requests, enabling dynamic memory management.";
/**
* Creates a memory tool instance with user context
*/
declare const createMemoryTool: ({
  userId,
  setMemory,
  validKeys,
  tokenLimit,
  totalTokens
}: {
  userId: string | ObjectId;
  setMemory: MemoryMethods["setMemory"];
  validKeys?: string[];
  tokenLimit?: number;
  totalTokens?: number;
}) => DynamicStructuredTool;
declare class BasicToolEndHandler implements EventHandler$1 {
  private callback?;
  constructor(callback?: ToolEndCallback$1);
  handle(event: string, data: StreamEventData | undefined, metadata?: Record<string, unknown>): void;
}
declare function processMemory({
  res,
  userId,
  setMemory,
  deleteMemory,
  messages,
  memory,
  messageId,
  conversationId,
  validKeys,
  instructions,
  llmConfig,
  tokenLimit,
  totalTokens,
  streamId,
  user
}: {
  res: Response$1;
  setMemory: MemoryMethods["setMemory"];
  deleteMemory: MemoryMethods["deleteMemory"];
  userId: string | ObjectId;
  memory: string;
  messageId: string;
  conversationId: string;
  messages: BaseMessage[];
  validKeys?: string[];
  instructions: string;
  tokenLimit?: number;
  totalTokens?: number;
  llmConfig?: Partial<LLMConfig>;
  streamId?: string | null;
  user?: IUser;
}): Promise<(TAttachment | null)[] | undefined>;
declare function createMemoryProcessor({
  res,
  userId,
  messageId,
  memoryMethods,
  conversationId,
  config,
  streamId,
  user
}: {
  res: Response$1;
  messageId: string;
  conversationId: string;
  userId: string | ObjectId;
  memoryMethods: RequiredMemoryMethods;
  config?: MemoryConfig;
  streamId?: string | null;
  user?: IUser;
}): Promise<[string, (messages: BaseMessage[]) => Promise<(TAttachment | null)[] | undefined>]>;
/**
* Creates a memory callback for handling memory artifacts
* @param params - The parameters object
* @param params.res - The server response object
* @param params.artifactPromises - Array to collect artifact promises
* @param params.streamId - The stream ID for resumable mode, or null for standard mode
* @returns The memory callback function
*/
declare function createMemoryCallback({
  res,
  artifactPromises,
  streamId
}: {
  res: Response$1;
  artifactPromises: Promise<Partial<TAttachment> | null>[];
  streamId?: string | null;
}): ToolEndCallback$1;
//#endregion
//#region src/agents/orphans.d.ts
/**
* Every `EToolResources` member that can carry `file_ids` on an agent document.
* `code_interpreter` is intentionally omitted — it's part of `EToolResources`
* for the Assistants API but not a key of the agent-side `AgentToolResources`
* shape, so including it would be a type lie and generate dead MongoDB clauses.
*/
declare const TOOL_RESOURCE_KEYS: ReadonlyArray<keyof AgentToolResources>;
/**
* Collects every file_id referenced across all tool_resource categories.
* Duplicates are de-duplicated across categories.
*/
declare function collectToolResourceFileIds(tool_resources: AgentToolResources | undefined | null): string[];
/**
* Removes the given file_ids from every tool_resource category on the provided
* tool_resources object. Mutates in place and also returns the same reference
* for convenience. Returns the count of removed references.
*/
declare function stripFileIdsFromToolResources(tool_resources: AgentToolResources | undefined | null, idsToRemove: Iterable<string>): {
  tool_resources: AgentToolResources | undefined | null;
  removedCount: number;
};
//#endregion
//#region src/agents/migration.d.ts
interface MigrationCheckDbMethods {
  findRoleByIdentifier: AccessRoleMethods["findRoleByIdentifier"];
}
interface MigrationCheckParams {
  mongoose: Mongoose;
  methods: MigrationCheckDbMethods;
  AgentModel: Model<IAgent>;
}
interface MigrationCheckResult {
  totalToMigrate: number;
  globalEditAccess: number;
  globalViewAccess: number;
  privateAgents: number;
  details?: {
    globalEditAccess: Array<{
      name: string;
      id: string;
    }>;
    globalViewAccess: Array<{
      name: string;
      id: string;
    }>;
    privateAgents: Array<{
      name: string;
      id: string;
    }>;
  };
}
/**
* Check if agents need to be migrated to the new permission system
* This performs a dry-run check similar to the migration script
*/
declare function checkAgentPermissionsMigration({
  methods,
  mongoose,
  AgentModel
}: MigrationCheckParams): Promise<MigrationCheckResult>;
/**
* Log migration warning to console if agents need migration
*/
declare function logAgentMigrationWarning(result: MigrationCheckResult): void;
//#endregion
//#region src/agents/openai/types.d.ts
/**
* OpenAI-compatible types for the agent chat completions API.
* These types follow the OpenAI API spec for /v1/chat/completions.
*
* Note: This API uses agent_id as the "model" parameter per OpenAI spec.
* In the future, this will be extended to support the Responses API.
*/
/**
* Content part types for OpenAI format
*/
interface OpenAITextContentPart {
  type: "text";
  text: string;
}
interface OpenAIImageContentPart {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
}
type OpenAIContentPart = OpenAITextContentPart | OpenAIImageContentPart;
/**
* Tool call in OpenAI format
*/
interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}
/**
* OpenAI chat message format
*/
interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | OpenAIContentPart[] | null;
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}
/**
* OpenAI chat completion request
*/
interface ChatCompletionRequest {
  /** Agent ID to invoke (maps to model in OpenAI spec) */
  model: string;
  /** Conversation messages */
  messages: ChatMessage[];
  /** Whether to stream the response */
  stream?: boolean;
  /** Maximum tokens to generate */
  max_tokens?: number;
  /** Temperature for sampling */
  temperature?: number;
  /** Top-p sampling */
  top_p?: number;
  /** Frequency penalty */
  frequency_penalty?: number;
  /** Presence penalty */
  presence_penalty?: number;
  /** Stop sequences */
  stop?: string | string[];
  /** User identifier */
  user?: string;
  /** Conversation ID (LibreChat extension) */
  conversation_id?: string;
  /** Parent message ID (LibreChat extension) */
  parent_message_id?: string;
}
/**
* Token usage information
*/
interface CompletionUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  /** Detailed breakdown of output tokens (OpenRouter/OpenAI convention) */
  completion_tokens_details?: {
    reasoning_tokens?: number;
  };
}
/**
* Non-streaming choice
*/
interface ChatCompletionChoice {
  index: number;
  message: {
    role: "assistant";
    content: string | null; /** Reasoning/thinking content (OpenRouter convention) */
    reasoning?: string | null;
    tool_calls?: ToolCall[];
  };
  finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | null;
}
/**
* Non-streaming response
*/
interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: CompletionUsage;
}
/**
* Streaming choice delta
* Note: `reasoning` field follows OpenRouter convention for streaming reasoning/thinking content
*/
interface ChatCompletionChunkChoice {
  index: number;
  delta: {
    role?: "assistant";
    content?: string | null; /** Reasoning/thinking content (OpenRouter convention) */
    reasoning?: string | null;
    tool_calls?: Array<{
      index: number;
      id?: string;
      type?: "function";
      function?: {
        name?: string;
        arguments?: string;
      };
    }>;
  };
  finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | null;
}
/**
* Streaming response chunk
*/
interface ChatCompletionChunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: ChatCompletionChunkChoice[];
  /** Final chunk may include usage */
  usage?: CompletionUsage;
}
/**
* SSE event wrapper for streaming
*/
interface SSEEvent {
  data: ChatCompletionChunk | "[DONE]";
}
/**
* Context for building OpenAI responses
*/
interface OpenAIResponseContext {
  /** Request ID for the chat completion */
  requestId: string;
  /** Model/agent ID */
  model: string;
  /** Created timestamp */
  created: number;
}
/**
* Aggregated content for building final response
*/
interface AggregatedContent {
  text: string;
  toolCalls: ToolCall[];
}
/**
* Error response in OpenAI format
*/
interface OpenAIErrorResponse {
  error: {
    message: string;
    type: string;
    param: string | null;
    code: string | null;
  };
}
//#endregion
//#region src/agents/openai/handlers.d.ts
/**
* Create a chat completion chunk in OpenAI format
*/
declare function createChunk(context: OpenAIResponseContext, delta: ChatCompletionChunkChoice["delta"], finishReason?: ChatCompletionChunkChoice["finish_reason"], usage?: CompletionUsage): ChatCompletionChunk;
/**
* Write an SSE event to the response
*/
declare function writeSSE(res: Response$1, data: ChatCompletionChunk | string): void;
/**
* Lightweight tracker for streaming responses.
* Only tracks what's needed for finish_reason and usage - doesn't store content.
*/
interface OpenAIStreamTracker {
  /** Whether any text content was emitted */
  hasText: boolean;
  /** Whether any reasoning content was emitted */
  hasReasoning: boolean;
  /** Accumulated tool calls by index */
  toolCalls: Map<number, ToolCall>;
  /** Accumulated usage metadata */
  usage: {
    promptTokens: number;
    completionTokens: number;
    reasoningTokens: number;
  };
  /** Mark that text was emitted */
  addText: () => void;
  /** Mark that reasoning was emitted */
  addReasoning: () => void;
}
/**
* Create a lightweight stream tracker (doesn't store content)
*/
declare function createOpenAIStreamTracker(): OpenAIStreamTracker;
/**
* Content aggregator for non-streaming responses.
* Accumulates full text content, reasoning, and tool calls.
* Uses arrays for O(n) text accumulation instead of O(n²) string concatenation.
*/
interface OpenAIContentAggregator {
  /** Accumulated text chunks */
  textChunks: string[];
  /** Accumulated reasoning/thinking chunks */
  reasoningChunks: string[];
  /** Accumulated tool calls by index */
  toolCalls: Map<number, ToolCall>;
  /** Accumulated usage metadata */
  usage: {
    promptTokens: number;
    completionTokens: number;
    reasoningTokens: number;
  };
  /** Get accumulated text (joins chunks) */
  getText: () => string;
  /** Get accumulated reasoning (joins chunks) */
  getReasoning: () => string;
  /** Add text chunk */
  addText: (text: string) => void;
  /** Add reasoning chunk */
  addReasoning: (text: string) => void;
}
/**
* Create a content aggregator for non-streaming responses
*/
declare function createOpenAIContentAggregator(): OpenAIContentAggregator;
/**
* Handler configuration for OpenAI streaming
*/
interface OpenAIStreamHandlerConfig {
  res: Response$1;
  context: OpenAIResponseContext;
  tracker: OpenAIStreamTracker;
}
/**
* Graph event types from @librechat/agents
*/
declare const GraphEvents: {
  readonly CHAT_MODEL_END: "on_chat_model_end";
  readonly TOOL_END: "on_tool_end";
  readonly CHAT_MODEL_STREAM: "on_chat_model_stream";
  readonly ON_RUN_STEP: "on_run_step";
  readonly ON_RUN_STEP_DELTA: "on_run_step_delta";
  readonly ON_RUN_STEP_COMPLETED: "on_run_step_completed";
  readonly ON_MESSAGE_DELTA: "on_message_delta";
  readonly ON_REASONING_DELTA: "on_reasoning_delta";
  readonly ON_TOOL_EXECUTE: "on_tool_execute";
};
/**
* Step types from librechat-data-provider
*/
declare const StepTypes: {
  readonly MESSAGE_CREATION: "message_creation";
  readonly TOOL_CALLS: "tool_calls";
};
/**
* Event data interfaces
*/
interface MessageDeltaData {
  id?: string;
  content?: Array<{
    type: string;
    text?: string;
  }>;
}
interface RunStepDeltaData {
  id?: string;
  delta?: {
    type?: string;
    tool_calls?: Array<{
      index?: number;
      id?: string;
      type?: string;
      function?: {
        name?: string;
        arguments?: string;
      };
    }>;
  };
}
interface ToolEndData {
  output?: {
    name?: string;
    tool_call_id?: string;
    content?: string;
  };
}
interface ModelEndData {
  output?: {
    usage_metadata?: {
      input_tokens?: number;
      output_tokens?: number;
      model?: string;
      output_token_details?: {
        reasoning?: number;
        reasoning_tokens?: number;
      };
    };
  };
}
/**
* Event handler interface
*/
interface EventHandler {
  handle(event: string, data: unknown, metadata?: Record<string, unknown>, graph?: unknown): void | Promise<void>;
}
/**
* Handler for message delta events - streams text content
*/
declare class OpenAIMessageDeltaHandler implements EventHandler {
  private config;
  constructor(config: OpenAIStreamHandlerConfig);
  handle(_event: string, data: MessageDeltaData): void;
}
/**
* Handler for run step delta events - streams tool calls
*/
declare class OpenAIRunStepDeltaHandler implements EventHandler {
  private config;
  constructor(config: OpenAIStreamHandlerConfig);
  handle(_event: string, data: RunStepDeltaData): void;
}
/**
* Handler for run step events - sends initial tool call info
*/
declare class OpenAIRunStepHandler implements EventHandler {
  private config;
  constructor(config: OpenAIStreamHandlerConfig);
  handle(_event: string, data: {
    stepDetails?: {
      type?: string;
    };
  }): void;
}
/**
* Handler for model end events - captures usage
*/
declare class OpenAIModelEndHandler implements EventHandler {
  private config;
  constructor(config: OpenAIStreamHandlerConfig);
  handle(_event: string, data: ModelEndData): void;
}
/**
* Handler for chat model stream events
*/
declare class OpenAIChatModelStreamHandler implements EventHandler {
  handle(): void;
}
/**
* Handler for tool end events
*/
declare class OpenAIToolEndHandler implements EventHandler {
  handle(): void;
}
/**
* Handler for reasoning delta events.
* Streams reasoning/thinking content using the `delta.reasoning` field (OpenRouter convention).
*/
declare class OpenAIReasoningDeltaHandler implements EventHandler {
  private config;
  constructor(config: OpenAIStreamHandlerConfig);
  handle(_event: string, data: MessageDeltaData): void;
}
/**
* Create all handlers for OpenAI streaming format
*/
declare function createOpenAIHandlers(config: OpenAIStreamHandlerConfig, toolExecuteOptions?: ToolExecuteOptions): Record<string, EventHandler>;
/**
* Send the final chunk with finish_reason and optional usage
*/
declare function sendFinalChunk(config: OpenAIStreamHandlerConfig, finishReason?: ChatCompletionChunkChoice["finish_reason"]): void;
//#endregion
//#region src/agents/openai/service.d.ts
/**
* Dependencies for the chat completion service
*/
interface ChatCompletionDependencies {
  /** Get agent by ID */
  getAgent: (params: {
    id: string;
  }) => Promise<Agent$3 | null>;
  /** Initialize agent for use */
  initializeAgent: (params: InitializeAgentParams$1) => Promise<InitializedAgent$1>;
  /** Load agent tools */
  loadAgentTools?: LoadToolsFn;
  /** Get models config */
  getModelsConfig?: (req: Request) => Promise<unknown>;
  /** Validate agent model */
  validateAgentModel?: (params: unknown) => Promise<{
    isValid: boolean;
    error?: {
      message: string;
    };
  }>;
  /** Log violation */
  logViolation?: (req: Request, res: Response$1, type: string, info: unknown, score: number) => Promise<void>;
  /** Create agent run */
  createRun?: CreateRunFn;
  /**
  * App config. Optional, but required for agents with `execute_code` in
  * their tools: the helper derives `codeEnvAvailable` from
  * `appConfig?.endpoints?.agents?.capabilities` and forwards it into
  * `deps.initializeAgent`. When `appConfig` is omitted, the resolved
  * `codeEnvAvailable` is `undefined`, so `initializeAgent` skips the
  * `execute_code` → `bash_tool` + `read_file` expansion entirely and
  * code-requesting agents silently lose sandbox tools. Pass `appConfig`
  * (even a minimal shape with just `endpoints.agents.capabilities`) to
  * keep code execution working.
  */
  appConfig?: AppConfig$1;
  /** Tool execute options for event-driven tool execution */
  toolExecuteOptions?: ToolExecuteOptions;
}
/**
* Agent type from librechat-data-provider
*/
interface Agent$3 {
  id: string;
  name?: string;
  model?: string;
  provider: string;
  tools?: string[];
  instructions?: string;
  model_parameters?: Record<string, unknown>;
  tool_resources?: Record<string, unknown>;
  tool_options?: Record<string, unknown>;
  [key: string]: unknown;
}
/**
* Initialized agent type - note: after initialization, tools become structured tool objects
*/
interface InitializedAgent$1 {
  id: string;
  name?: string;
  model?: string;
  provider: string;
  /** After initialization, tools are structured tool objects, not strings */
  tools: unknown[];
  instructions?: string;
  model_parameters?: Record<string, unknown>;
  tool_resources?: Record<string, unknown>;
  tool_options?: Record<string, unknown>;
  attachments: unknown[];
  toolContextMap: Record<string, unknown>;
  maxContextTokens: number;
  userMCPAuthMap?: Record<string, Record<string, string>>;
  [key: string]: unknown;
}
/**
* Initialize agent params
*/
interface InitializeAgentParams$1 {
  req: Request;
  res: Response$1;
  agent: Agent$3;
  conversationId?: string | null;
  parentMessageId?: string | null;
  requestFiles?: unknown[];
  loadTools?: LoadToolsFn;
  endpointOption?: Record<string, unknown>;
  allowedProviders: Set<string>;
  isInitialAgent?: boolean;
  /**
  * Whether the `execute_code` capability is enabled for the run.
  * `initializeAgent` uses this to expand `agent.tools: ['execute_code']`
  * into the `bash_tool` + `read_file` pair — if the caller's injected
  * `initializeAgent` implementation consults this flag, agents configured
  * for code execution will keep working post-Phase-8. Absent / `undefined`
  * skips the expansion (same semantics as the in-repo controllers).
  */
  codeEnvAvailable?: boolean;
}
/**
* Tool loading function type
*/
type LoadToolsFn = (params: {
  req: Request;
  res: Response$1;
  provider: string;
  agentId: string;
  tools: string[];
  model: string | null;
  tool_options: unknown;
  tool_resources: unknown;
}) => Promise<{
  tools: unknown[];
  toolContextMap: Record<string, unknown>;
  userMCPAuthMap?: Record<string, Record<string, string>>;
} | null>;
/**
* Create run function type
*/
type CreateRunFn = (params: {
  agents: unknown[];
  messages: unknown[];
  runId: string;
  signal: AbortSignal;
  customHandlers: Record<string, EventHandler>;
  requestBody: Record<string, unknown>;
  user: Record<string, unknown>;
  tenantId?: string;
  tokenCounter?: (message: unknown) => number;
}) => Promise<{
  Graph?: unknown;
  processStream: (input: {
    messages: unknown[];
  }, config: Record<string, unknown>, options: Record<string, unknown>) => Promise<void>;
} | null>;
/**
* App config type
*/
interface AppConfig$1 {
  endpoints?: Record<string, unknown>;
  [key: string]: unknown;
}
/**
* Convert OpenAI messages to LibreChat format
*/
declare function convertMessages(messages: ChatMessage[]): unknown[];
/**
* Create an error response in OpenAI format
*/
declare function createErrorResponse(message: string, type?: string, code?: string | null): OpenAIErrorResponse;
/**
* Send an error response
*/
declare function sendErrorResponse(res: Response$1, statusCode: number, message: string, type?: string, code?: string | null): void;
/**
* Validation result types for chat completion requests
*/
type ChatCompletionValidationSuccess = {
  valid: true;
  request: ChatCompletionRequest;
};
type ChatCompletionValidationFailure = {
  valid: false;
  error: string;
};
type ChatCompletionValidationResult = ChatCompletionValidationSuccess | ChatCompletionValidationFailure;
/**
* Type guard for validation failure
*/
declare function isChatCompletionValidationFailure(result: ChatCompletionValidationResult): result is ChatCompletionValidationFailure;
/**
* Validate the chat completion request
*/
declare function validateRequest(body: unknown): ChatCompletionValidationResult;
/**
* Build a non-streaming response from aggregated content
*/
declare function buildNonStreamingResponse(context: OpenAIResponseContext, text: string, reasoning: string, toolCalls: Map<number, ToolCall>, usage: CompletionUsage): ChatCompletionResponse;
/**
* Main handler for OpenAI-compatible chat completions with agents.
*
* This function:
* 1. Validates the request
* 2. Looks up the agent by ID (model parameter)
* 3. Initializes the agent with tools
* 4. Runs the agent and streams/returns the response
*
* @param req - Express request object
* @param res - Express response object
* @param deps - Dependencies for the service
*/
declare function createAgentChatCompletion(req: Request, res: Response$1, deps: ChatCompletionDependencies): Promise<void>;
/**
* List available agents/models
*
* This provides a /v1/models compatible endpoint that lists available agents.
*/
declare function listAgentModels(_req: Request, res: Response$1, deps: {
  getAgents: (params: Record<string, unknown>) => Promise<Agent$3[]>;
}): Promise<void>;
//#endregion
//#region src/agents/transactions.d.ts
type TokenType = "prompt" | "completion";
interface GetMultiplierParams {
  valueKey?: string;
  tokenType?: TokenType;
  model?: string;
  endpointTokenConfig?: EndpointTokenConfig;
  inputTokenCount?: number;
}
interface GetCacheMultiplierParams {
  cacheType: "write" | "read";
  model?: string;
  endpointTokenConfig?: EndpointTokenConfig;
}
interface PricingFns {
  getMultiplier: (params: GetMultiplierParams) => number;
  getCacheMultiplier: (params: GetCacheMultiplierParams) => number | null;
}
interface PreparedEntry {
  doc: TransactionData;
  tokenValue: number;
  balance?: Partial<TCustomConfig["balance"]> | null;
}
interface TokenUsage {
  promptTokens?: number;
  completionTokens?: number;
}
interface StructuredPromptTokens {
  input?: number;
  write?: number;
  read?: number;
}
interface StructuredTokenUsage {
  promptTokens?: StructuredPromptTokens;
  completionTokens?: number;
}
interface TxMetadata {
  user: string;
  model?: string;
  context: string;
  messageId?: string;
  conversationId: string;
  balance?: Partial<TCustomConfig["balance"]> | null;
  transactions?: Partial<TTransactionsConfig>;
  endpointTokenConfig?: EndpointTokenConfig;
}
interface BulkWriteDeps {
  insertMany: (docs: TransactionData[]) => Promise<unknown>;
  updateBalance: (params: {
    user: string;
    incrementValue: number;
  }) => Promise<unknown>;
}
declare function prepareTokenSpend(txData: TxMetadata, tokenUsage: TokenUsage, pricing: PricingFns): PreparedEntry[];
declare function prepareStructuredTokenSpend(txData: TxMetadata, tokenUsage: StructuredTokenUsage, pricing: PricingFns): PreparedEntry[];
declare function bulkWriteTransactions({
  user,
  docs
}: {
  user: string;
  docs: PreparedEntry[];
}, dbOps: BulkWriteDeps): Promise<void>;
//#endregion
//#region src/stream/interfaces/IJobStore.d.ts
/**
* Job status enum
*/
type JobStatus = "running" | "complete" | "error" | "aborted";
/**
* Serializable job data - no object references, suitable for Redis/external storage
*/
interface SerializableJobData {
  streamId: string;
  userId: string;
  tenantId?: string;
  status: JobStatus;
  createdAt: number;
  completedAt?: number;
  conversationId?: string;
  error?: string;
  /** User message metadata */
  userMessage?: {
    messageId: string;
    parentMessageId?: string;
    conversationId?: string;
    text?: string;
    /** Quoted excerpts referenced on this turn, carried so resumable/aborted
    *  reconstructions of the user message keep their `MessageQuotes`. */
    quotes?: string[];
  };
  /** Response message ID for reconnection */
  responseMessageId?: string;
  /** Whether the user-message created event has been emitted */
  createdEventEmitted?: boolean;
  /** Sender name for UI display */
  sender?: string;
  /** Whether sync has been sent to a client */
  syncSent: boolean;
  /** Serialized final event for replay */
  finalEvent?: string;
  /** Serialized title event for replay during active-stream resume */
  titleEvent?: string;
  /** Serialized replay-only stream events for active-stream resume */
  replayEvents?: string;
  /** Serialized latest context usage snapshot for active-stream resume */
  contextUsage?: string;
  /** Serialized token usage events for active-stream resume (cross-replica safe) */
  tokenUsage?: string;
  /** Endpoint metadata for abort handling - avoids storing functions */
  endpoint?: string;
  iconURL?: string;
  model?: string;
  promptTokens?: number;
}
/**
* Usage metadata for token spending across different LLM providers.
*
* This interface supports two mutually exclusive cache token formats:
*
* **OpenAI format** (GPT-4, o1, etc.):
* - Uses `input_token_details.cache_creation` and `input_token_details.cache_read`
* - Cache tokens are nested under the `input_token_details` object
*
* **Anthropic format** (Claude models):
* - Uses `cache_creation_input_tokens` and `cache_read_input_tokens`
* - Cache tokens are top-level properties
*
* When processing usage data, check both formats:
* ```typescript
* const cacheCreation = usage.input_token_details?.cache_creation
*   || usage.cache_creation_input_tokens || 0;
* ```
*/
interface UsageMetadata {
  /** Logical usage bucket for accounting/reporting. Defaults to model response usage. */
  usage_type?: "message" | "summarization" | "subagent" | "sequential";
  /** Total input tokens (prompt tokens) */
  input_tokens?: number;
  /** Total output tokens (completion tokens) */
  output_tokens?: number;
  /** Total billed tokens when provided by the model/runtime */
  total_tokens?: number;
  /** Model identifier that generated this usage */
  model?: string;
  /** Provider identifier that generated this usage */
  provider?: string;
  /** Agent that produced this usage (graph agent id / subagent agent id). Lets
  *  multi-endpoint graphs price each call with its own endpoint token config. */
  agentId?: string;
  /**
  * OpenAI-style cache token details.
  * Present for OpenAI models (GPT-4, o1, etc.)
  */
  input_token_details?: {
    /** Tokens written to cache */cache_creation?: number; /** Tokens read from cache */
    cache_read?: number;
  };
  /**
  * Anthropic-style cache creation tokens.
  * Present for Claude models. Mutually exclusive with input_token_details.
  */
  cache_creation_input_tokens?: number;
  /**
  * Anthropic-style cache read tokens.
  * Present for Claude models. Mutually exclusive with input_token_details.
  */
  cache_read_input_tokens?: number;
  /**
  * Breakdown of output token counts. Per the LangChain core contract,
  * `output_tokens` is the sum of all output token types — these fields
  * are subsets of `output_tokens`, *not* additional charges.
  */
  output_token_details?: {
    /** Reasoning/thinking tokens generated as chain-of-thought (o1, Gemini thinking, etc.) */reasoning?: number;
    audio?: number;
  };
}
/**
* Result returned from aborting a job - contains all data needed
* for token spending and message saving without storing callbacks
*/
interface AbortResult {
  /** Whether the abort was successful */
  success: boolean;
  /** The job data at time of abort */
  jobData: SerializableJobData | null;
  /** Aggregated content from the stream */
  content: Agents.MessageContentComplex[];
  /** Final event to send to client */
  finalEvent: unknown;
  /** Concatenated text from all content parts for token counting fallback */
  text: string;
  /** Collected usage metadata from all models for token spending */
  collectedUsage: UsageMetadata[];
}
/**
* Interface for job storage backend.
* Implementations can use in-memory Map, Redis, KV store, etc.
*
* Content state is tied to jobs:
* - In-memory: Holds WeakRef to graph for live content/run steps access
* - Redis: Persists chunks, reconstructs content on reconnect
*
* This consolidates job metadata + content state into a single interface.
*/
interface IJobStore {
  /** Initialize the store (e.g., connect to Redis, start cleanup intervals) */
  initialize(): Promise<void>;
  /** Create a new job */
  createJob(streamId: string, userId: string, conversationId?: string, tenantId?: string): Promise<SerializableJobData>;
  /** Get a job by streamId (streamId === conversationId) */
  getJob(streamId: string): Promise<SerializableJobData | null>;
  /** Update job data */
  updateJob(streamId: string, updates: Partial<SerializableJobData>): Promise<void>;
  /** Delete a job */
  deleteJob(streamId: string): Promise<void>;
  /** Check if job exists */
  hasJob(streamId: string): Promise<boolean>;
  /** Get all running jobs (for cleanup) */
  getRunningJobs(): Promise<SerializableJobData[]>;
  /** Cleanup expired jobs */
  cleanup(): Promise<number>;
  /**
  * Record generation activity for a job (e.g. a chunk was emitted), refreshing
  * its "last active" timestamp so the stale-running-job failsafe does not reap a
  * stream that is still producing output.
  *
  * In-memory: updates an internal last-activity timestamp used by cleanup().
  * Redis: no-op — the running-job TTL is already refreshed on each appendChunk.
  *
  * @param streamId - The stream identifier
  */
  recordActivity?(streamId: string): void;
  /** Get total job count */
  getJobCount(): Promise<number>;
  /** Get job count by status */
  getJobCountByStatus(status: JobStatus): Promise<number>;
  /** Destroy the store and release resources */
  destroy(): Promise<void>;
  /**
  * Get active job IDs for a user.
  * Returns conversation IDs of running jobs belonging to the user.
  * Also performs self-healing cleanup of stale entries.
  *
  * @param userId - The user ID to query
  * @returns Array of conversation IDs with active jobs
  */
  getActiveJobIdsByUser(userId: string, tenantId?: string): Promise<string[]>;
  /**
  * Set the graph reference for a job (in-memory only).
  * The graph provides live access to contentParts and contentData (run steps).
  *
  * In-memory: Stores WeakRef to graph
  * Redis: No-op (graph not transferable, uses chunks instead)
  *
  * @param streamId - The stream identifier
  * @param graph - The StandardGraph instance
  */
  setGraph(streamId: string, graph: StandardGraph): void;
  /**
  * Set content parts reference for a job.
  *
  * In-memory: Stores direct reference to content array
  * Redis: No-op (content built from chunks)
  *
  * @param streamId - The stream identifier
  * @param contentParts - The content parts array
  */
  setContentParts(streamId: string, contentParts: Agents.MessageContentComplex[]): void;
  /**
  * Get aggregated content for a job.
  *
  * In-memory: Returns live content from graph.contentParts or stored reference
  * Redis: Reconstructs from stored chunks
  *
  * @param streamId - The stream identifier
  * @returns Content parts or null if not available
  */
  getContentParts(streamId: string): Promise<{
    content: Agents.MessageContentComplex[];
  } | null>;
  /**
  * Get run steps for a job (for resume state).
  *
  * In-memory: Returns live run steps from graph.contentData
  * Redis: Fetches from persistent storage
  *
  * @param streamId - The stream identifier
  * @returns Run steps or empty array
  */
  getRunSteps(streamId: string): Promise<Agents.RunStep[]>;
  /**
  * Append a streaming chunk for later reconstruction.
  *
  * In-memory: No-op (content available via graph reference)
  * Redis: Uses XADD for append-only log efficiency
  *
  * @param streamId - The stream identifier
  * @param event - The SSE event to append
  */
  appendChunk(streamId: string, event: unknown): Promise<void>;
  /**
  * Clear all content state for a job.
  * Called on job completion/cleanup.
  *
  * @param streamId - The stream identifier
  */
  clearContentState(streamId: string): void;
  /**
  * Save run steps to persistent storage.
  * In-memory: No-op (run steps accessed via graph reference)
  * Redis: Persists for resume across instances
  *
  * @param streamId - The stream identifier
  * @param runSteps - Run steps to save
  */
  saveRunSteps?(streamId: string, runSteps: Agents.RunStep[]): Promise<void>;
  /**
  * Set collected usage reference for a job.
  * This array accumulates token usage from all models during generation.
  *
  * @param streamId - The stream identifier
  * @param collectedUsage - Array of usage metadata from all models
  */
  setCollectedUsage(streamId: string, collectedUsage: UsageMetadata[]): void;
  /**
  * Get collected usage for a job.
  *
  * @param streamId - The stream identifier
  * @returns Array of usage metadata or empty array
  */
  getCollectedUsage(streamId: string): UsageMetadata[];
}
/**
* Interface for pub/sub event transport.
* Implementations can use EventEmitter, Redis Pub/Sub, etc.
*/
interface IEventTransport {
  /** Subscribe to events for a stream. `ready` resolves once the transport can receive messages. */
  subscribe(streamId: string, handlers: {
    onChunk: (event: unknown) => void;
    onDone?: (event: unknown) => void;
    onError?: (error: string) => void;
  }): {
    unsubscribe: () => void;
    ready?: Promise<void>;
  };
  /** Publish a chunk event - returns Promise in Redis mode for ordered delivery */
  emitChunk(streamId: string, event: unknown): void | Promise<void>;
  /** Publish a done event - returns Promise in Redis mode for ordered delivery */
  emitDone(streamId: string, event: unknown): void | Promise<void>;
  /** Publish an error event - returns Promise in Redis mode for ordered delivery */
  emitError(streamId: string, error: string): void | Promise<void>;
  /**
  * Publish an abort signal to all replicas (Redis mode).
  * Enables cross-replica abort: user aborts on Replica B,
  * generating Replica A receives signal and stops.
  * Optional - only implemented in Redis transport.
  */
  emitAbort?(streamId: string): void;
  /**
  * Register callback for abort signals from any replica (Redis mode).
  * Called when abort is triggered from any replica.
  * Optional - only implemented in Redis transport.
  */
  onAbort?(streamId: string, callback: () => void): void;
  /** Get subscriber count for a stream */
  getSubscriberCount(streamId: string): number;
  /** Check if this is the first subscriber (for ready signaling) */
  isFirstSubscriber(streamId: string): boolean;
  /** Listen for all subscribers leaving */
  onAllSubscribersLeft(streamId: string, callback: () => void): void;
  /**
  * Advance subscriber reorder buffer to match publisher sequence (cross-replica safe).
  * @param earlyReplayCount - Number of events replayed from earlyEventBuffer (same-replica).
  *   Pending entries with seq < earlyReplayCount are duplicates and are pruned; entries at or
  *   above are live chunks that arrived during the async GET window and are preserved.
  *   When 0/undefined (cross-replica), all pending entries are treated as live.
  */
  syncReorderBuffer?(streamId: string, earlyReplayCount?: number): void | Promise<void>;
  /** Cleanup transport resources for a specific stream */
  cleanup(streamId: string): void;
  /** Get all tracked stream IDs (for orphan cleanup) */
  getTrackedStreamIds(): string[];
  /** Destroy all transport resources */
  destroy(): void;
}
//#endregion
//#region src/agents/usage.d.ts
type SpendTokensFn = (txData: TxMetadata, tokenUsage: TokenUsage) => Promise<unknown>;
type SpendStructuredTokensFn = (txData: TxMetadata, tokenUsage: StructuredTokenUsage) => Promise<unknown>;
interface RecordUsageDeps {
  spendTokens: SpendTokensFn;
  spendStructuredTokens: SpendStructuredTokensFn;
  pricing?: PricingFns;
  bulkWriteOps?: BulkWriteDeps;
}
/**
* Authoritative USD cost of one model call. Reuses the exact billing
* functions (`prepareTokenSpend`/`prepareStructuredTokenSpend` → `getMultiplier`
* with `inputTokenCount` for premium tiers) so the figure emitted to the
* client matches what is charged against balance — the client must not
* re-derive pricing from base rates. `tokenValue` is credits (USD × 1e6).
*/
declare function computeUsageCostUSD(usage: UsageMetadata, pricing: PricingFns, endpointTokenConfig?: EndpointTokenConfig): number;
/**
* Aggregates the per-model-call `on_token_usage` payloads emitted for one
* response into a single rollup, persisted on `responseMessage.metadata.usage`.
*
* Each event is normalized into display units with the SAME logic the live
* client uses (`splitUsage`: input excludes cache, output is repaired) BEFORE
* summing, so the rollup reproduces the live branch/total usage exactly even
* when a turn mixes providers (e.g. a summarization or subagent call on a
* different provider than the primary). `cost` is the additive sum of the
* authoritative per-event cost, included only when at least one event carried
* it (i.e. `interface.contextCost` was on).
*/
declare function aggregateEmittedUsage(events: ReadonlyArray<TTokenUsageEvent>): TResponseUsage | null;
/**
* Projects the latest live context snapshot into the blob persisted on
* `responseMessage.metadata.contextUsage`. Reconciles the calibrated estimate to
* the final call's ACTUAL prompt tokens (the SDK multiplier over-inflates
* `messageTokens`, badly so when a provider injects server-side content like web
* search), so a reloaded turn shows the real context — not a several×-too-high
* number. Trims zero-valued per-tool counts (privacy/size) and records the final
* call's output as `completedOutputTokens` so rehydration adds the same
* post-snapshot delta the live gauge did. The client re-anchors the blob to the
* response message id on load.
*/
declare function buildPersistedContextUsage(snapshot: TContextUsageEvent, usageEvents?: ReadonlyArray<TTokenUsageEvent>): TContextUsageEvent;
/**
* Sum of this response's output tokens already folded into a later snapshot's
* pre-invoke baseline that the response message's `tokenCount` ALSO carries — the
* overlap `computeSummaryUsedTokens` subtracts from the marker so the live-path
* client estimate (`summaryBaseline + responseTokenCount`) doesn't double-count:
*  - earlier tool-loop PRIMARY calls: a multi-call turn's first output sits in the
*    kept-message context of the next call's snapshot AND in `tokenCount`.
*  - the SUMMARIZATION call's generated summary: it sits in the snapshot baseline
*    as `summaryTokens` AND in `tokenCount` (`recordCollectedUsage` folds
*    summarization completion into the reported output total; subagent/sequential
*    are kept out of that total, so they are excluded here too).
*
* Both are matched by `runId` and bounded by `beforeIndex` to the calls that
* preceded the snapshot. The summarize detour inherits the graph run id
* (`traceConfig` spreads `config.metadata.run_id`), so it shares the snapshot's
* `runId`; a parallel sibling run's summary carries a DIFFERENT `runId` and must
* NOT be subtracted (its summary lives in the sibling's baseline, not this one).
* Untagged events (older lib / resume) match any run for back-compat.
*
* Only the live path (which builds `tokenCount` via `recordCollectedUsage`) calls
* this; the abort path subtracts nothing — see {@link buildAbortedResponseMetadata}.
*/
declare function priorRunOutputTokens(events: ReadonlyArray<TTokenUsageEvent>, beforeIndex: number, runId?: string): number;
/**
* Pre-invoke compacted context size for a summarized turn (instructions +
* summary + kept messages), or `undefined` when the turn did not summarize.
* Persisted as the lightweight `summaryUsedTokens` marker so the client estimate
* fallback caps the discarded pre-summary history instead of re-summing it (the
* gauge otherwise reads 100% in perpetuity after a compaction). Pre-invoke, so
* it carries none of the `completedOutputTokens` ambiguity that keeps the full
* snapshot off some save paths. `summaryTokens` is a SEPARATE breakdown field, so
* the non-`remainingContextTokens` fallback adds it explicitly.
*
* `priorOutputTokens` (this response's earlier tool-loop outputs, see
* {@link priorRunOutputTokens}) is subtracted: those tokens are inside the
* baseline's kept messages AND in the response message's `tokenCount` the client
* adds on top, so leaving them in the marker double-counts them on a tool-loop
* summarized turn. Single-call turns pass 0 and are unaffected.
*/
declare function computeSummaryUsedTokens(snapshot: TContextUsageEvent | null | undefined, priorOutputTokens?: number): number | undefined;
/**
* Builds the response `metadata` for a STOPPED generation from the job's
* persisted emitted usage, so a stopped reply keeps its accurate cost rollup on
* reload (finding: stopped responses otherwise lose cost). Shared by every abort
* save path (agents abort route + legacy abort middleware).
*
* Deliberately omits the full `contextUsage`: unlike the live path, the abort
* path can't tell whether the FINAL call (the one the latest snapshot precedes)
* emitted usage — the job stores only the latest snapshot, not the snapshot
* count. If the final call emitted none, `completedOutputTokens` would reuse an
* earlier call's output the snapshot already counts → reload over-reports. So a
* stopped response falls back to the per-message gauge estimate on reload.
*
* It DOES persist the `summaryUsedTokens` marker when the stopped turn had
* summarized: that marker is pre-invoke (no `completedOutputTokens` ambiguity),
* and without it the fallback estimate re-sums the history the compaction
* discarded — leaving a stopped summarized turn pinned at 100%. Unlike the live
* path, the abort `tokenCount` comes from `countTokens(text)` (abortMiddleware) or
* is absent (agents abort route) — it does NOT fold in the summarization or
* earlier-call output the way `recordCollectedUsage` does. So the marker subtracts
* NOTHING: the full pre-invoke baseline is correct, and the client adds only the
* partial answer text on top (no overlap to cancel).
*/
declare function buildAbortedResponseMetadata(job: {
  tokenUsage?: string | null;
  contextUsage?: string | null;
} | null | undefined): {
  usage?: TResponseUsage;
  summaryUsedTokens?: number;
} | undefined;
/**
* Resolves the endpoint token config for a usage item by its producing agent.
* Multi-endpoint graphs tag each call with `agentId`; that agent's resolved
* config is authoritative — including `undefined`, which means "no configured
* rates, use built-in pricing" (e.g. a non-custom agent in a custom-primary
* graph). Only an untagged or unknown agent falls back to `fallback` (the
* primary config), so single-endpoint graphs are unchanged. `byAgentId` must
* hold an entry for every known agent (value may be `undefined`) so `has`
* distinguishes "known, no rates" from "unknown".
*/
declare function resolveAgentTokenConfig({
  agentId,
  byAgentId,
  fallback
}: {
  agentId?: string | null;
  byAgentId?: Map<string, EndpointTokenConfig | undefined>;
  fallback?: EndpointTokenConfig;
}): EndpointTokenConfig | undefined;
interface RecordUsageParams {
  user: string;
  conversationId: string;
  collectedUsage: UsageMetadata[];
  model?: string;
  context?: string;
  messageId?: string;
  balance?: Partial<TCustomConfig["balance"]> | null;
  transactions?: Partial<TTransactionsConfig>;
  endpointTokenConfig?: EndpointTokenConfig;
  /**
  * Per-usage endpoint token config resolver for multi-endpoint graphs. Called
  * with each usage item; when provided it is authoritative — its result prices
  * that item, including `undefined` (built-in pricing for a known agent with no
  * configured rates). It owns its own fallback to the primary config for
  * untagged/unknown agents (see {@link resolveAgentTokenConfig}). Single-config
  * callers (responses.js / openai.js) omit it and use `endpointTokenConfig`.
  */
  resolveEndpointTokenConfig?: (usage: UsageMetadata) => EndpointTokenConfig | undefined;
}
interface RecordUsageResult {
  input_tokens: number;
  output_tokens: number;
}
/**
* Records token usage for collected LLM calls and spends tokens against balance.
* This handles both sequential execution (tool calls) and parallel execution (multiple agents).
*
* When `pricing` and `bulkWriteOps` deps are provided, prepares all transaction documents
* in-memory first, then writes them in a single `insertMany` + one `updateBalance` call.
*/
declare function recordCollectedUsage(deps: RecordUsageDeps, params: RecordUsageParams): Promise<RecordUsageResult | undefined>;
/**
* Structural mirror of the agents SDK's `SubagentUsageEvent` (added after
* `@librechat/agents` 3.2.33). Defined locally so type-checking does not
* depend on the unreleased SDK — replace with
* `import type { SubagentUsageEvent } from '@librechat/agents'` once the
* dependency is bumped.
*/
interface SubagentUsageEvent {
  /** Usage metadata reported by the child's model call. */
  usage: UsageMetadata;
  /** Model that produced this usage (per-call, falls back to the child config's model). */
  model?: string;
  /** Provider enum value of the subagent's configured agent. */
  provider?: string;
  /** Subagent `type` identifier from the SubagentConfig. */
  subagentType: string;
  /** Child run ID (unique per subagent execution). */
  subagentRunId: string;
  /** Child agent ID assigned to this subagent execution. */
  subagentAgentId: string;
  /** Parent run ID under which the subagent was spawned. */
  runId: string;
}
/**
* Builds the host-side `subagentUsageSink` for `Run.create`. Subagent child
* graphs execute outside the run's `streamEvents` loop, so their model calls
* never reach the `CHAT_MODEL_END` handler (`ModelEndHandler`) — the SDK
* reports them through this sink instead. Each event is tagged
* `usage_type: 'subagent'` with the child's model/provider and pushed onto
* the same `collectedUsage` array the handler fills, so
* {@link recordCollectedUsage} bills child calls (transactions + balance)
* alongside the parent's.
*/
declare function createSubagentUsageSink(collectedUsage: UsageMetadata[], onUsage?: (usage: UsageMetadata) => void): (event: SubagentUsageEvent) => void;
//#endregion
//#region src/agents/responses/types.d.ts
/**
* Open Responses API Types
*
* Types following the Open Responses specification for building multi-provider,
* interoperable LLM interfaces. Items are the fundamental unit of context,
* and streaming uses semantic events rather than simple deltas.
*
* @see https://openresponses.org/specification
*/
/** Item status lifecycle */
type ItemStatus = "in_progress" | "incomplete" | "completed";
/** Response status lifecycle */
type ResponseStatus = "in_progress" | "completed" | "failed" | "incomplete";
/** Message roles */
type MessageRole = "user" | "assistant" | "system" | "developer";
/** Tool choice options */
type ToolChoiceValue = "none" | "auto" | "required";
/** Truncation options */
type TruncationValue = "auto" | "disabled";
/** Service tier options */
type ServiceTier = "auto" | "default" | "flex" | "priority";
/** Reasoning effort levels */
type ReasoningEffort = "none" | "low" | "medium" | "high" | "xhigh";
/** Reasoning summary options */
type ReasoningSummary = "concise" | "detailed" | "auto";
/** Text input content */
interface InputTextContent {
  type: "input_text";
  text: string;
}
/** Image input content */
interface InputImageContent {
  type: "input_image";
  image_url?: string;
  file_id?: string;
  detail?: "auto" | "low" | "high";
}
/** File input content */
interface InputFileContent {
  type: "input_file";
  file_id?: string;
  file_data?: string;
  filename?: string;
}
/** Union of all input content types */
type InputContent = InputTextContent | InputImageContent | InputFileContent;
/** Log probability for a token */
interface LogProb {
  token: string;
  logprob: number;
  bytes?: number[];
  top_logprobs?: TopLogProb[];
}
/** Top log probability entry */
interface TopLogProb {
  token: string;
  logprob: number;
  bytes?: number[];
}
/** Text output content */
interface OutputTextContent {
  type: "output_text";
  text: string;
  annotations: Annotation[];
  logprobs: LogProb[];
}
/** Refusal content */
interface RefusalContent {
  type: "refusal";
  refusal: string;
}
/** Union of model output content types */
type ModelContent = OutputTextContent | RefusalContent;
/** URL citation annotation */
interface UrlCitationAnnotation {
  type: "url_citation";
  url: string;
  title?: string;
  start_index: number;
  end_index: number;
}
/** File citation annotation */
interface FileCitationAnnotation {
  type: "file_citation";
  file_id: string;
  start_index: number;
  end_index: number;
}
/** Union of annotation types */
type Annotation = UrlCitationAnnotation | FileCitationAnnotation;
/** Reasoning text content */
interface ReasoningTextContent {
  type: "reasoning_text";
  text: string;
}
/** Summary text content */
interface SummaryTextContent {
  type: "summary_text";
  text: string;
}
/** Reasoning content union */
type ReasoningContent = ReasoningTextContent;
/** System message input item */
interface SystemMessageItemParam {
  type: "message";
  role: "system";
  content: string | InputContent[];
}
/** Developer message input item */
interface DeveloperMessageItemParam {
  type: "message";
  role: "developer";
  content: string | InputContent[];
}
/** User message input item */
interface UserMessageItemParam {
  type: "message";
  role: "user";
  content: string | InputContent[];
}
/** Assistant message input item */
interface AssistantMessageItemParam {
  type: "message";
  role: "assistant";
  content: string | ModelContent[];
}
/** Function call input item (for providing context) */
interface FunctionCallItemParam {
  type: "function_call";
  id: string;
  call_id: string;
  name: string;
  arguments: string;
  status?: ItemStatus;
}
/** Function call output input item (for providing tool results) */
interface FunctionCallOutputItemParam {
  type: "function_call_output";
  call_id: string;
  output: string;
  status?: ItemStatus;
}
/** Reasoning input item */
interface ReasoningItemParam {
  type: "reasoning";
  id?: string;
  content?: ReasoningContent[];
  encrypted_content?: string;
  summary?: SummaryTextContent[];
  status?: ItemStatus;
}
/** Item reference (for referencing existing items) */
interface ItemReferenceParam {
  type: "item_reference";
  id: string;
}
/** Union of all input item types */
type InputItem = SystemMessageItemParam | DeveloperMessageItemParam | UserMessageItemParam | AssistantMessageItemParam | FunctionCallItemParam | FunctionCallOutputItemParam | ReasoningItemParam | ItemReferenceParam;
/** Message output item */
interface MessageItem {
  type: "message";
  id: string;
  role: "assistant";
  status: ItemStatus;
  content: ModelContent[];
}
/** Function call output item */
interface FunctionCallItem {
  type: "function_call";
  id: string;
  call_id: string;
  name: string;
  arguments: string;
  status: ItemStatus;
}
/** Function call output result item (internal tool execution result) */
interface FunctionCallOutputItem {
  type: "function_call_output";
  id: string;
  call_id: string;
  output: string;
  status: ItemStatus;
}
/** Reasoning output item */
interface ReasoningItem {
  type: "reasoning";
  id: string;
  status?: ItemStatus;
  content?: ReasoningContent[];
  encrypted_content?: string;
  /** Required per Open Responses spec - summary content parts */
  summary: SummaryTextContent[];
}
/** Union of all output item types */
type OutputItem = MessageItem | FunctionCallItem | FunctionCallOutputItem | ReasoningItem;
/** Function tool definition */
interface FunctionTool {
  type: "function";
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
  strict?: boolean;
}
/** Hosted tool (provider-specific) */
interface HostedTool {
  type: string;
  [key: string]: unknown;
}
/** Union of tool types */
type Tool = FunctionTool | HostedTool;
/** Specific function tool choice */
interface FunctionToolChoice {
  type: "function";
  name: string;
}
/** Tool choice parameter */
type ToolChoice = ToolChoiceValue | FunctionToolChoice;
/** Reasoning configuration */
interface ReasoningConfig {
  effort?: ReasoningEffort;
  summary?: ReasoningSummary;
}
/** Text output configuration */
interface TextConfig {
  format?: {
    type: "text" | "json_object" | "json_schema";
    json_schema?: Record<string, unknown>;
  };
}
/** Stream options */
interface StreamOptions {
  include_usage?: boolean;
}
/** Metadata (key-value pairs) */
type Metadata = Record<string, string>;
/** Open Responses API Request */
interface ResponseRequest {
  /** Model/agent ID to use */
  model: string;
  /** Input context - string or array of items */
  input: string | InputItem[];
  /** Previous response ID for conversation continuation */
  previous_response_id?: string;
  /** Tools available to the model */
  tools?: Tool[];
  /** Tool choice configuration */
  tool_choice?: ToolChoice;
  /** Whether to stream the response */
  stream?: boolean;
  /** Stream options */
  stream_options?: StreamOptions;
  /** Additional instructions */
  instructions?: string;
  /** Maximum output tokens */
  max_output_tokens?: number;
  /** Maximum tool calls */
  max_tool_calls?: number;
  /** Sampling temperature */
  temperature?: number;
  /** Top-p sampling */
  top_p?: number;
  /** Presence penalty */
  presence_penalty?: number;
  /** Frequency penalty */
  frequency_penalty?: number;
  /** Reasoning configuration */
  reasoning?: ReasoningConfig;
  /** Text output configuration */
  text?: TextConfig;
  /** Truncation behavior */
  truncation?: TruncationValue;
  /** Service tier */
  service_tier?: ServiceTier;
  /** Whether to store the response */
  store?: boolean;
  /** Metadata */
  metadata?: Metadata;
  /** Whether model can call multiple tools in parallel */
  parallel_tool_calls?: boolean;
  /** User identifier for safety */
  user?: string;
}
/** Token usage details */
interface InputTokensDetails {
  cached_tokens: number;
}
/** Output tokens details */
interface OutputTokensDetails {
  reasoning_tokens: number;
}
/** Token usage statistics */
interface Usage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_tokens_details: InputTokensDetails;
  output_tokens_details: OutputTokensDetails;
}
/** Incomplete details */
interface IncompleteDetails {
  reason: "max_output_tokens" | "max_tool_calls" | "content_filter" | "other";
}
/** Error object */
interface ResponseError {
  type: "server_error" | "invalid_request" | "not_found" | "model_error" | "too_many_requests";
  code?: string;
  message: string;
  param?: string;
}
/** Text field configuration */
interface TextField {
  format?: {
    type: "text" | "json_object" | "json_schema";
    json_schema?: Record<string, unknown>;
  };
}
/** Open Responses API Response - All required fields per spec */
interface Response {
  /** Response ID */
  id: string;
  /** Object type - always "response" */
  object: "response";
  /** Creation timestamp (Unix seconds) */
  created_at: number;
  /** Completion timestamp (Unix seconds) - null if not completed */
  completed_at: number | null;
  /** Response status */
  status: ResponseStatus;
  /** Incomplete details - null if not incomplete */
  incomplete_details: IncompleteDetails | null;
  /** Model that generated the response */
  model: string;
  /** Previous response ID - null if not a continuation */
  previous_response_id: string | null;
  /** Instructions used - null if none */
  instructions: string | null;
  /** Output items */
  output: OutputItem[];
  /** Error - null if no error */
  error: ResponseError | null;
  /** Tools available */
  tools: Tool[];
  /** Tool choice setting */
  tool_choice: ToolChoice;
  /** Truncation setting used */
  truncation: TruncationValue;
  /** Whether parallel tool calls were allowed */
  parallel_tool_calls: boolean;
  /** Text configuration used */
  text: TextField;
  /** Temperature used */
  temperature: number;
  /** Top-p used */
  top_p: number;
  /** Presence penalty used */
  presence_penalty: number;
  /** Frequency penalty used */
  frequency_penalty: number;
  /** Top logprobs - number of most likely tokens to return */
  top_logprobs: number;
  /** Reasoning configuration - null if none */
  reasoning: ReasoningConfig | null;
  /** User identifier - null if none */
  user: string | null;
  /** Token usage - null if not available */
  usage: Usage | null;
  /** Max output tokens - null if not set */
  max_output_tokens: number | null;
  /** Max tool calls - null if not set */
  max_tool_calls: number | null;
  /** Whether response was stored */
  store: boolean;
  /** Whether request was run in background */
  background: boolean;
  /** Service tier used */
  service_tier: string;
  /** Metadata */
  metadata: Metadata;
  /** Safety identifier - null if none */
  safety_identifier: string | null;
  /** Prompt cache key - null if none */
  prompt_cache_key: string | null;
}
/** Base event structure */
interface BaseEvent {
  type: string;
  sequence_number: number;
}
/** Response created event (first event in stream) */
interface ResponseCreatedEvent extends BaseEvent {
  type: "response.created";
  response: Response;
}
/** Response in_progress event */
interface ResponseInProgressEvent extends BaseEvent {
  type: "response.in_progress";
  response: Response;
}
/** Response completed event */
interface ResponseCompletedEvent extends BaseEvent {
  type: "response.completed";
  response: Response;
}
/** Response failed event */
interface ResponseFailedEvent extends BaseEvent {
  type: "response.failed";
  response: Response;
}
/** Response incomplete event */
interface ResponseIncompleteEvent extends BaseEvent {
  type: "response.incomplete";
  response: Response;
}
/** Output item added event */
interface OutputItemAddedEvent extends BaseEvent {
  type: "response.output_item.added";
  output_index: number;
  item: OutputItem;
}
/** Output item done event */
interface OutputItemDoneEvent extends BaseEvent {
  type: "response.output_item.done";
  output_index: number;
  item: OutputItem;
}
/** Content part added event */
interface ContentPartAddedEvent extends BaseEvent {
  type: "response.content_part.added";
  item_id: string;
  output_index: number;
  content_index: number;
  part: ModelContent | ReasoningContent;
}
/** Content part done event */
interface ContentPartDoneEvent extends BaseEvent {
  type: "response.content_part.done";
  item_id: string;
  output_index: number;
  content_index: number;
  part: ModelContent | ReasoningContent;
}
/** Output text delta event */
interface OutputTextDeltaEvent extends BaseEvent {
  type: "response.output_text.delta";
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
  logprobs: LogProb[];
}
/** Output text done event */
interface OutputTextDoneEvent extends BaseEvent {
  type: "response.output_text.done";
  item_id: string;
  output_index: number;
  content_index: number;
  text: string;
  logprobs: LogProb[];
}
/** Refusal delta event */
interface RefusalDeltaEvent extends BaseEvent {
  type: "response.refusal.delta";
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}
/** Refusal done event */
interface RefusalDoneEvent extends BaseEvent {
  type: "response.refusal.done";
  item_id: string;
  output_index: number;
  content_index: number;
  refusal: string;
}
/** Function call arguments delta event */
interface FunctionCallArgumentsDeltaEvent extends BaseEvent {
  type: "response.function_call_arguments.delta";
  item_id: string;
  output_index: number;
  call_id: string;
  delta: string;
}
/** Function call arguments done event */
interface FunctionCallArgumentsDoneEvent extends BaseEvent {
  type: "response.function_call_arguments.done";
  item_id: string;
  output_index: number;
  call_id: string;
  arguments: string;
}
/** Reasoning delta event */
interface ReasoningDeltaEvent extends BaseEvent {
  type: "response.reasoning.delta";
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}
/** Reasoning done event */
interface ReasoningDoneEvent extends BaseEvent {
  type: "response.reasoning.done";
  item_id: string;
  output_index: number;
  content_index: number;
  text: string;
}
/** Error event */
interface ErrorEvent extends BaseEvent {
  type: "error";
  error: ResponseError;
}
/** Attachment content types for LibreChat extensions */
interface LibreChatAttachmentContent {
  /** File ID in LibreChat storage */
  file_id?: string;
  /** Original filename */
  filename?: string;
  /** MIME type */
  type?: string;
  /** URL to access the file */
  url?: string;
  /** Base64-encoded image data (for inline images) */
  image_url?: string;
  /** Width for images */
  width?: number;
  /** Height for images */
  height?: number;
  /** Associated tool call ID */
  tool_call_id?: string;
  /** Additional metadata */
  [key: string]: unknown;
}
/**
* LibreChat attachment event - custom streaming event for file/image attachments
* Follows Open Responses extension pattern with librechat: prefix
*/
interface LibreChatAttachmentEvent extends BaseEvent {
  type: "librechat:attachment";
  /** The attachment data */
  attachment: LibreChatAttachmentContent;
  /** Associated message ID */
  message_id?: string;
  /** Associated conversation ID */
  conversation_id?: string;
}
/** Union of all streaming events (including LibreChat extensions) */
type ResponseEvent = ResponseCreatedEvent | ResponseInProgressEvent | ResponseCompletedEvent | ResponseFailedEvent | ResponseIncompleteEvent | OutputItemAddedEvent | OutputItemDoneEvent | ContentPartAddedEvent | ContentPartDoneEvent | OutputTextDeltaEvent | OutputTextDoneEvent | RefusalDeltaEvent | RefusalDoneEvent | FunctionCallArgumentsDeltaEvent | FunctionCallArgumentsDoneEvent | ReasoningDeltaEvent | ReasoningDoneEvent | ErrorEvent | LibreChatAttachmentEvent;
/** Context for building responses */
interface ResponseContext {
  /** Response ID */
  responseId: string;
  /** Model/agent ID */
  model: string;
  /** Creation timestamp */
  createdAt: number;
  /** Previous response ID */
  previousResponseId?: string;
  /** Instructions */
  instructions?: string;
}
/** Validation result for requests */
interface RequestValidationResult {
  valid: boolean;
  request?: ResponseRequest;
  error?: string;
}
//#endregion
//#region src/agents/responses/handlers.d.ts
/**
* Tracks the state of a response during streaming.
* Manages items, sequence numbers, and accumulated content.
*/
interface ResponseTracker {
  /** Current sequence number (monotonically increasing) */
  sequenceNumber: number;
  /** Output items being built */
  items: OutputItem[];
  /** Current message item (if any) */
  currentMessage: MessageItem | null;
  /** Current message content index */
  currentContentIndex: number;
  /** Current reasoning item (if any) */
  currentReasoning: ReasoningItem | null;
  /** Current reasoning content index */
  currentReasoningContentIndex: number;
  /** Map of function call items by call_id */
  functionCalls: Map<string, FunctionCallItem>;
  /** Map of function call outputs by call_id */
  functionCallOutputs: Map<string, FunctionCallOutputItem>;
  /** Accumulated text for current message */
  accumulatedText: string;
  /** Accumulated reasoning text */
  accumulatedReasoningText: string;
  /** Accumulated function call arguments by call_id */
  accumulatedArguments: Map<string, string>;
  /** Token usage */
  usage: {
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    cachedTokens: number;
  };
  /** Response status */
  status: ResponseStatus;
  /** Get next sequence number */
  nextSequence: () => number;
}
/**
* Create a new response tracker
*/
declare function createResponseTracker(): ResponseTracker;
/**
* Write a semantic SSE event to the response.
* The `event:` field matches the `type` in the data payload.
*/
declare function writeEvent(res: Response$1, event: ResponseEvent): void;
/**
* Write the terminal [DONE] event
*/
declare function writeDone(res: Response$1): void;
/**
* Build a Response object from context and tracker
* Includes all required fields per Open Responses spec
*/
declare function buildResponse(context: ResponseContext, tracker: ResponseTracker, status?: ResponseStatus): Response;
/**
* Generate a unique item ID
*/
declare function generateItemId(prefix: string): string;
/**
* Create a new message item
*/
declare function createMessageItem(status?: ItemStatus): MessageItem;
/**
* Create a new function call item
*/
declare function createFunctionCallItem(callId: string, name: string, status?: ItemStatus): FunctionCallItem;
/**
* Create a new function call output item
*/
declare function createFunctionCallOutputItem(callId: string, output: string, status?: ItemStatus): FunctionCallOutputItem;
/**
* Create a new reasoning item
*/
declare function createReasoningItem(status?: ItemStatus): ReasoningItem;
/**
* Create output text content
*/
declare function createOutputTextContent(text?: string): OutputTextContent;
/**
* Create reasoning text content
*/
declare function createReasoningTextContent(text?: string): ReasoningTextContent;
interface StreamHandlerConfig {
  res: Response$1;
  context: ResponseContext;
  tracker: ResponseTracker;
}
/**
* Emit response.created event
* This is the first event emitted per the Open Responses spec
*/
declare function emitResponseCreated(config: StreamHandlerConfig): void;
/**
* Emit response.in_progress event
*/
declare function emitResponseInProgress(config: StreamHandlerConfig): void;
/**
* Emit response.completed event
*/
declare function emitResponseCompleted(config: StreamHandlerConfig): void;
/**
* Emit response.failed event
*/
declare function emitResponseFailed(config: StreamHandlerConfig, error: {
  type: string;
  message: string;
  code?: string;
}): void;
/**
* Emit response.output_item.added event for a message
*/
declare function emitMessageItemAdded(config: StreamHandlerConfig): MessageItem;
/**
* Emit response.output_item.done event for a message
*/
declare function emitMessageItemDone(config: StreamHandlerConfig): void;
/**
* Emit response.content_part.added for text content
*/
declare function emitTextContentPartAdded(config: StreamHandlerConfig): void;
/**
* Emit response.output_text.delta event
*/
declare function emitOutputTextDelta(config: StreamHandlerConfig, delta: string): void;
/**
* Emit response.output_text.done event
*/
declare function emitOutputTextDone(config: StreamHandlerConfig): void;
/**
* Emit response.content_part.done for text content
*/
declare function emitTextContentPartDone(config: StreamHandlerConfig): void;
/**
* Emit response.output_item.added for a function call
*/
declare function emitFunctionCallItemAdded(config: StreamHandlerConfig, callId: string, name: string): FunctionCallItem;
/**
* Emit response.function_call_arguments.delta event
*/
declare function emitFunctionCallArgumentsDelta(config: StreamHandlerConfig, callId: string, delta: string): void;
/**
* Emit response.function_call_arguments.done event
*/
declare function emitFunctionCallArgumentsDone(config: StreamHandlerConfig, callId: string): void;
/**
* Emit response.output_item.done for a function call
*/
declare function emitFunctionCallItemDone(config: StreamHandlerConfig, callId: string): void;
/**
* Emit function call output item (internal tool result)
*/
declare function emitFunctionCallOutputItem(config: StreamHandlerConfig, callId: string, output: string): void;
/**
* Emit response.output_item.added for reasoning
*/
declare function emitReasoningItemAdded(config: StreamHandlerConfig): ReasoningItem;
/**
* Emit response.content_part.added for reasoning
*/
declare function emitReasoningContentPartAdded(config: StreamHandlerConfig): void;
/**
* Emit response.reasoning.delta event
*/
declare function emitReasoningDelta(config: StreamHandlerConfig, delta: string): void;
/**
* Emit response.reasoning.done event
*/
declare function emitReasoningDone(config: StreamHandlerConfig): void;
/**
* Emit response.content_part.done for reasoning
*/
declare function emitReasoningContentPartDone(config: StreamHandlerConfig): void;
/**
* Emit response.output_item.done for reasoning
*/
declare function emitReasoningItemDone(config: StreamHandlerConfig): void;
/**
* Emit error event
*/
declare function emitError(config: StreamHandlerConfig, error: {
  type: string;
  message: string;
  code?: string;
}): void;
/**
* Attachment data for librechat:attachment events
*/
interface AttachmentData {
  /** File ID in LibreChat storage */
  file_id?: string;
  /** Original filename */
  filename?: string;
  /** MIME type */
  type?: string;
  /** URL to access the file */
  url?: string;
  /** Base64-encoded image data (for inline images) */
  image_url?: string;
  /** Width for images */
  width?: number;
  /** Height for images */
  height?: number;
  /** Associated tool call ID */
  tool_call_id?: string;
  /**
  * Inline text or sanitized HTML preview (sized to MAX_TEXT_CACHE_BYTES).
  * Populated by `extractCodeArtifactText` for tool-output files: raw text
  * for plain-text artifacts, sanitized rich HTML for office formats
  * (DOCX/XLSX/CSV/PPTX). The frontend feeds HTML through the Sandpack
  * `static` template via `index.html`. Null if extraction was unavailable
  * (binary, oversized, or unsupported).
  */
  text?: string | null;
  /**
  * Format of the `text` field — `'html'` if `text` is a complete
  * sanitized HTML document the client is permitted to inject into the
  * iframe via `index.html`, `'text'` if it's plain text. Clients MUST
  * gate office-bucket routing on `textFormat === 'html'`; legacy
  * attachments and RAG-extracted plain text don't have this set and
  * must default to safe (markdown-escaped) rendering. Codex P1 review
  * on PR #12934.
  */
  textFormat?: "html" | "text" | null;
  /** Additional metadata */
  [key: string]: unknown;
}
/**
* Emit librechat:attachment event for file/image attachments
* This is a LibreChat extension to the Open Responses streaming protocol.
* External clients can safely ignore these events.
*/
declare function emitAttachment(config: StreamHandlerConfig, attachment: AttachmentData, options?: {
  messageId?: string;
  conversationId?: string;
}): void;
/**
* Write attachment event directly to response (for use outside streaming context)
* Useful when attachment processing happens asynchronously
*/
declare function writeAttachmentEvent(res: Response$1, sequenceNumber: number, attachment: AttachmentData, options?: {
  messageId?: string;
  conversationId?: string;
}): void;
/**
* Build a complete non-streaming response
*/
declare function buildResponsesNonStreamingResponse(context: ResponseContext, tracker: ResponseTracker): Response;
/**
* Update tracker usage from collected data
*/
declare function updateTrackerUsage(tracker: ResponseTracker, usage: {
  promptTokens?: number;
  completionTokens?: number;
  reasoningTokens?: number;
  cachedTokens?: number;
}): void;
//#endregion
//#region src/agents/responses/service.d.ts
/**
* Validate a request body
*/
declare function validateResponseRequest(body: unknown): RequestValidationResult;
/**
* Check if validation failed
*/
declare function isValidationFailure(result: RequestValidationResult): result is {
  valid: false;
  error: string;
};
/** Internal message format (LibreChat-compatible) */
interface InternalMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | Array<{
    type: string;
    text?: string;
    image_url?: unknown;
  }>;
  name?: string;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
}
/**
* Convert Open Responses input to internal message format.
* Handles both string input and array of items.
*/
declare function convertInputToMessages(input: string | InputItem[]): InternalMessage[];
/**
* Merge previous conversation messages with new input
*/
declare function mergeMessagesWithInput(previousMessages: InternalMessage[], newInput: InternalMessage[]): InternalMessage[];
/**
* Send an error response in Open Responses format
*/
declare function sendResponsesErrorResponse(res: Response$1, statusCode: number, message: string, type?: string, code?: string): void;
/**
* Generate a unique response ID
*/
declare function generateResponseId(): string;
/**
* Create a response context from request
*/
declare function createResponseContext(request: ResponseRequest, responseId?: string): ResponseContext;
/**
* Set up streaming response headers
*/
declare function setupStreamingResponse(res: Response$1): void;
/**
* State for tracking streaming progress
*/
interface StreamState {
  messageStarted: boolean;
  messageContentStarted: boolean;
  reasoningStarted: boolean;
  reasoningContentStarted: boolean;
  activeToolCalls: Set<string>;
  completedToolCalls: Set<string>;
}
/**
* Create LibreChat event handlers that emit Open Responses events
*/
declare function createResponsesEventHandlers(config: StreamHandlerConfig): {
  handlers: Record<string, {
    handle: (event: string, data: unknown) => void;
  }>;
  state: StreamState;
  finalizeStream: () => void;
};
/**
* Aggregator for non-streaming responses
*/
interface ResponseAggregator {
  textChunks: string[];
  reasoningChunks: string[];
  toolCalls: Map<string, {
    id: string;
    name: string;
    arguments: string;
  }>;
  toolOutputs: Map<string, string>;
  usage: {
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    cachedTokens: number;
  };
  addText: (text: string) => void;
  addReasoning: (text: string) => void;
  getText: () => string;
  getReasoning: () => string;
}
/**
* Create an aggregator for non-streaming responses
*/
declare function createResponseAggregator(): ResponseAggregator;
/**
* Build a non-streaming response from aggregator
* Includes all required fields per Open Responses spec
*/
declare function buildAggregatedResponse(context: ResponseContext, aggregator: ResponseAggregator): Response;
/**
* Create event handlers for non-streaming aggregation
*/
declare function createAggregatorEventHandlers(aggregator: ResponseAggregator): Record<string, {
  handle: (event: string, data: unknown) => void;
}>;
//#endregion
//#region src/agents/skillConfigurable.d.ts
/**
* Augments a loadTools result with skill-specific configurable properties.
*
* `codeEnvAvailable` is threaded as a boolean (true when the agent's
* `execute_code` capability is enabled). Downstream skill consumers —
* the skill-tool handler (for file priming) and `primeInvokedSkills`
* (for history re-priming) — gate sandbox uploads on this flag so no
* sandbox traffic occurs for agents that lack code-execution capability.
*
* `skillPrimedIdsByName` maps each primed skill name (manual `$` or
* always-apply) to the `_id` of the exact doc whose body was primed
* into the turn. Skill-tool handlers consult it to:
*   1. Relax the `disable-model-invocation` gate on `read_file` for
*      any primed skill (so a `disable-model-invocation: true` skill
*      whose body is in context can still load its `references/*` /
*      `scripts/*` files). Without this, a user manually invoking —
*      or auto-priming — a disabled skill would get a body that
*      references files the model is forbidden to open.
*   2. Constrain the lookup to the primed `_id` on same-name
*      collisions, so `read_file` reads from the same doc whose body
*      got primed (otherwise a newer same-name duplicate could shadow
*      the resolver's pick and cause body/file mismatch within a
*      single turn).
* Empty/missing → no exception, the gate applies as normal and the
* lookup uses the full ACL set.
*/
interface SkillConfigurableContext {
  req: {
    user?: {
      id?: string;
    };
  };
  accessibleSkillIds?: unknown[];
  codeEnvAvailable: boolean;
  /**
  * `{ [skillName]: skillIdString }` for every skill primed this turn
  * (manual or always-apply). The id pins same-name collision lookups to
  * the exact doc the resolver primed and relaxes the disable-model gate.
  */
  skillPrimedIdsByName?: Record<string, string>;
  /**
  * Names of skills the runtime can resolve, captured at agent init by
  * `injectSkillCatalog`. Lets `read_file` decide whether a
  * `{firstSegment}/...` path is a real skill reference vs. a code-env path
  * that should fall back to bash, without an extra `getSkillByName`
  * round-trip just to discover the name doesn't resolve. Empty/undefined
  * ⇒ skills aren't effectively in scope for this agent (admin capability
  * off, ephemeral badge off, or persisted `skills_enabled !== true`),
  * which is the same signal as `accessibleSkillIds.length === 0`.
  */
  activeSkillNames?: Set<string>;
  /** True when skills/{skillName}/... write paths are enabled for this run. */
  skillAuthoringAvailable?: boolean;
  /** Host file-authoring names registered by initializeAgent for this run. */
  fileAuthoringToolNames?: Set<string>;
}
interface SkillConfigurableLoadResult {
  loadedTools: unknown[];
  configurable?: Record<string, unknown>;
}
interface EnrichWithSkillConfigurableParams {
  result: SkillConfigurableLoadResult;
  context: SkillConfigurableContext;
}
declare function enrichWithSkillConfigurable(params: EnrichWithSkillConfigurableParams): {
  loadedTools: unknown[];
  configurable: Record<string, unknown>;
};
declare function enrichWithSkillConfigurable(result: SkillConfigurableLoadResult, req: {
  user?: {
    id?: string;
  };
}, accessibleSkillIds: unknown[] | undefined, codeEnvAvailable: boolean, skillPrimedIdsByName?: Record<string, string>, activeSkillNames?: Set<string>, skillAuthoringAvailable?: boolean, fileAuthoringToolNames?: Set<string>): {
  loadedTools: unknown[];
  configurable: Record<string, unknown>;
};
//#endregion
//#region src/agents/codeFilesSession.d.ts
/**
* Minimal shape for an agent that may contribute primed code files to the
* run-wide sandbox seed. Both `InitializedAgent` and `RunAgent` satisfy it,
* and the recursive walk in {@link buildInitialToolSessions} traverses
* `subagentAgentConfigs` so nested subagents (which aren't in the top-level
* `agentConfigs` map after pure-subagent pruning) still contribute.
*/
interface CodeFilesAgent {
  primedCodeFiles?: CodeEnvFile[];
  subagentAgentConfigs?: CodeFilesAgent[];
}
/**
* Merges primed code-execution file references into a `ToolSessionMap` so the
* Graph's `ToolNode` can inject them into the very first `execute_code` tool
* call as `_injected_files`. Without this seed, `ToolNode.getCodeSessionContext`
* has no entry to read on call #1, and the agent-side `CodeExecutor` falls back
* to a `/files/{session_id}` fetch — but `session_id` itself is only populated
* after the first call returns one, so primed files were silently dropped.
*
* Files from `primeFiles` (api/server/services/Files/Code/process.js) carry
* per-file `storage_session_id`s (the long-lived storage bucket id). The
* map's representative top-level `session_id` is seeded from the first
* incoming file's `storage_session_id` (matching `primeInvokedSkills`),
* since no execution session exists yet at seed time. Per-file ids on the
* `files` array are what `ToolNode` actually uses
* (`file.storage_session_id ?? execSessionId`).
*
* When an entry already exists (e.g. seeded by `primeInvokedSkills` for skill
* files), incoming files are appended after the existing ones. The pre-existing
* representative `session_id` is preserved so a partial-cache/fresh-prime
* collision doesn't shift which session id `ToolNode` picks for the call.
*
* Files are deduplicated by `storage_session_id + id` as the stable
* identity key. Multiple agents in the same run commonly carry the same
* primed code-execution resources (shared conversation files), and without
* dedupe `_injected_files` would grow proportionally to agent count and
* inflate every `/exec` POST. First-seen wins so the original ordering /
* source is preserved.
*/
declare function seedCodeFilesIntoSessions(files: CodeEnvFile[] | undefined, existing: ToolSessionMap | undefined): ToolSessionMap | undefined;
/**
* Builds the run-wide initial `ToolSessionMap` for `Graph.sessions`,
* combining skill-priming output with code-resource files primed across
* every agent that may execute code in this run.
*
* **Why "run-wide" (not per-agent):** `Graph.sessions` is a single map
* shared by every `ToolNode` instance in the run by design — the
* agents-library treats the code-execution sandbox as a conversation-
* scoped workspace, not an agent-scoped one. Two agents that both have
* code-execution enabled (a primary + a handoff target, or a parent +
* a subagent) implicitly share session_id and file refs through this
* map. This helper makes that explicit at the seeding boundary: every
* reachable agent's `primedCodeFiles` flows into the same
* `EXECUTE_CODE` entry. If per-agent isolation is ever needed, that
* has to land in the agents library first (per-agent `AgentContext`
* sessions); changing only this helper would diverge from how the
* sandbox actually behaves at runtime.
*
* **Walk order:** primary first, then `agentConfigs` (handoff/addedConvo)
* in iteration order, then recurse into each config's
* `subagentAgentConfigs` breadth-first. Order matters because when no
* skill sessions exist, the FIRST agent's first file supplies the
* representative `session_id` written to `Graph.sessions[EXECUTE_CODE]`.
* `ToolNode` ultimately uses per-file `session_id`s for injection so
* the representative is informational rather than load-bearing, but
* primary-first keeps it predictable and matches the existing
* `loadSubagentsFor` walk pattern in `Endpoints/agents/initialize.js`.
*
* The visited set is keyed by object identity (`Set<CodeFilesAgent>`)
* so cycles in a malformed agent graph (a subagent that points back at
* its parent) can't infinite-loop the seed.
*
* @param skillSessions - Output of `primeInvokedSkills` — already
*   contains an `EXECUTE_CODE` entry when skill files were primed; new
*   files from this walk merge into it (representative `session_id`
*   from the skill side is preserved).
* @param agents - The complete set of code-execution-capable agents in
*   the run. Caller passes `[primaryConfig, ...agentConfigs.values()]`;
*   this function recurses into each one's `subagentAgentConfigs`.
*/
declare function buildInitialToolSessions(params: {
  skillSessions?: ToolSessionMap;
  agents: Iterable<CodeFilesAgent | undefined | null>;
}): ToolSessionMap | undefined;
//#endregion
//#region src/agents/run.d.ts
/**
* Extracts discovered tool names from message history by parsing tool_search results.
* When the LLM calls tool_search, the result contains tool names that were discovered.
* These tools should have defer_loading overridden to false on subsequent turns.
*
* Supports both:
* - New JSON format: { "tools": [{ "name": "tool_name" }] }
* - Legacy text format: "- tool_name (score: X.XX)"
*
* @param messages - The conversation message history
* @returns Set of tool names that were discovered via tool_search
*/
declare function extractDiscoveredToolsFromHistory(messages: BaseMessage[]): Set<string>;
/**
* Extracts skill names that were invoked in previous turns from raw message payload.
* Scans assistant messages for tool_call content parts where name === 'skill'.
* Works with TPayload (raw message objects) so it can run before formatAgentMessages.
*
* @param payload - The raw conversation message payload
* @returns Set of skill names that were previously invoked
*/
declare function extractInvokedSkillsFromPayload(payload: Array<Partial<{
  role: string;
  content: unknown;
}>>): Set<string>;
/**
* Overrides defer_loading to false for tools that were already discovered via tool_search.
* This prevents the LLM from having to re-discover tools on every turn.
*
* @param toolRegistry - The tool registry to modify (mutated in place)
* @param discoveredTools - Set of tool names that were previously discovered
* @returns Number of tools that had defer_loading overridden
*/
declare function overrideDeferLoadingForDiscoveredTools(toolRegistry: LCToolRegistry$1, discoveredTools: Set<string>): number;
type AgentReasoningKey = "reasoning_content" | "reasoning";
declare function getReasoningKey(provider: Providers, llmConfig: RunLLMConfig, agentEndpoint?: string | null, customReasoningKey?: ReasoningResponseKey): AgentReasoningKey;
/**
* Whether the (provider, model) pair targets DeepSeek's thinking-mode
* tool-calling contract, which requires `reasoning_content` to be replayed
* on every prior assistant message that emitted `tool_calls`.
* @see https://api-docs.deepseek.com/guides/thinking_mode#tool-calls
*/
declare function isDeepSeekReasoningProvider(provider: string | Providers | undefined | null, model?: string | null): boolean;
/**
* Whether prior assistant tool-call messages should have `reasoning_content`
* reconstructed when reformatting persisted history (cross-turn replay): either
* DeepSeek thinking-mode (#13366) or a custom OpenAI-compatible endpoint that
* opted in via `customParams.includeReasoningHistory` (e.g. Xiaomi MiMo, Kimi).
*/
declare function shouldReplayReasoningContent(agent?: {
  provider?: string | Providers | null;
  model?: string | null;
  model_parameters?: {
    model?: string | null;
  } | null;
  includeReasoningHistory?: boolean | null;
} | null): boolean;
type RunAgent = Omit<Agent, "tools"> & {
  tools?: GenericTool[];
  maxContextTokens?: number; /** Pre-ratio context budget from initializeAgent. */
  baseContextTokens?: number;
  useLegacyContent?: boolean;
  toolContextMap?: Record<string, unknown>;
  dynamicToolContextMap?: Record<string, unknown>;
  toolRegistry?: LCToolRegistry$1; /** Serializable tool definitions for event-driven execution */
  toolDefinitions?: LCTool$1[]; /** Precomputed flag indicating if any tools have defer_loading enabled */
  hasDeferredTools?: boolean;
  /**
  * Per-agent codeenv gate set by `initializeAgent`: admin-level
  * `execute_code` capability AND the agent actually requested
  * `execute_code` in its tools. Used here to enable
  * `RunConfig.toolOutputReferences` only on runs where the bash tool
  * is actually registered.
  */
  codeEnvAvailable?: boolean; /** Optional per-agent summarization overrides */
  summarization?: SummarizationConfig; /** Response field to read model reasoning from for custom OpenAI-compatible endpoints. */
  reasoningKey?: ReasoningResponseKey; /** Whether to reconstruct `reasoning_content` from persisted history across turns. */
  includeReasoningHistory?: boolean;
  /**
  * Maximum characters allowed in a single tool result before truncation.
  * Overrides the default computed from maxContextTokens.
  */
  maxToolResultChars?: number; /** Initialized subagent configs (loaded by initialize.js from agent.subagents.agent_ids). */
  subagentAgentConfigs?: RunAgent[]; /** Source subagent spawning configuration (enabled / allowSelf / agent_ids). */
  subagents?: AgentSubagentsConfig;
};
/**
* Whether any agent reachable in the run — primary, handoff/parallel, or a
* nested subagent — opts into cross-turn `reasoning_content` reconstruction.
* Walks `subagentAgentConfigs` like {@link anyAgentHasCodeEnv}, since an
* opted-in custom endpoint may appear only as a (possibly pruned) subagent.
*/
declare function anyAgentReplaysReasoningContent(agents: Array<RunAgent | null | undefined>): boolean;
/**
* Creates a new Run instance with custom handlers and configuration.
*
* @param options - The options for creating the Run instance.
* @param options.agents - The agents for this run.
* @param options.signal - The signal for this run.
* @param options.runId - Optional run ID; otherwise, a new run ID will be generated.
* @param options.customHandlers - Custom event handlers.
* @param options.streaming - Whether to use streaming.
* @param options.streamUsage - Whether to stream usage information.
* @param options.messages - Optional message history to extract discovered tools from.
*   When provided, tools that were previously discovered via tool_search will have
*   their defer_loading overridden to false, preventing redundant re-discovery.
* @returns {Promise<Run<IState>>} A promise that resolves to a new Run instance.
*/
declare function createRun({
  runId,
  signal,
  agents,
  messages,
  requestBody,
  user,
  tenantId,
  tokenCounter,
  customHandlers,
  indexTokenCountMap,
  initialSessions,
  summarizationConfig,
  initialSummary,
  calibrationRatio,
  appConfig,
  subagentUsageSink,
  streaming,
  streamUsage
}: {
  agents: RunAgent[];
  signal: AbortSignal;
  runId?: string;
  streaming?: boolean;
  streamUsage?: boolean;
  requestBody?: RequestBody;
  user?: IUser;
  tenantId?: string; /** Message history for extracting previously discovered tools */
  messages?: BaseMessage[];
  summarizationConfig?: SummarizationConfig; /** Cross-run summary from formatAgentMessages, forwarded to AgentContext */
  initialSummary?: {
    text: string;
    tokenCount: number;
  }; /** Calibration ratio from previous run's contextMeta, seeds the pruner EMA */
  calibrationRatio?: number;
  /**
  * Resolved app config. Used to translate custom-endpoint provider names
  * (e.g. "Ollama") in the summarization config to SDK-recognized providers.
  */
  appConfig?: AppConfig;
  /**
  * Receives per-model-call usage from subagent child runs so hosts can bill
  * them (child graphs execute outside the run's `streamEvents` loop, so
  * their usage never reaches `customHandlers`). Typed structurally — not as
  * `Pick<RunConfig, 'subagentUsageSink'>` — because the field ships in
  * `@librechat/agents` > 3.2.33; older SDK versions ignore it at runtime.
  * Switch to the `RunConfig` pick once the dependency is bumped.
  */
  subagentUsageSink?: (event: SubagentUsageEvent) => void;
} & Pick<RunConfig, "tokenCounter" | "customHandlers" | "indexTokenCountMap" | "initialSessions">): Promise<Run<IState>>;
//#endregion
//#region src/agents/testHook.d.ts
/**
* Context handed to a test run hook so it can shape fake-model behavior from
* the conversation and the agents' advertised tools.
*/
interface TestRunHookContext {
  messages?: BaseMessage[];
  agents: ReadonlyArray<{
    tools?: ReadonlyArray<{
      name: string;
    }>;
  }>;
}
type TestRunHook = (run: Run<IState>, context: TestRunHookContext) => void;
/**
* Env-gated extension point used only by the e2e harness. When
* `LIBRECHAT_TEST_RUN_HOOK` points at a module, it is loaded and invoked with
* the freshly created run so a test can swap in a fake model via
* `run.Graph.overrideTestModel(...)` instead of reaching a live provider. A
* no-op (returns immediately) in normal operation since the env var is unset.
*/
declare function applyTestRunHook(run: Run<IState>, context: TestRunHookContext): void;
//#endregion
//#region src/agents/tools.d.ts
declare const CREATE_FILE_TOOL_NAME = "create_file";
declare const EDIT_FILE_TOOL_NAME = "edit_file";
declare const HOST_FILE_AUTHORING_ARTIFACT_KEY = "__librechat_file_authoring";
declare const FILE_AUTHORING_TOOL_NAMES: ReadonlySet<string>;
declare function isCodeSessionToolName(name: string, hostFileAuthoringToolNames?: ReadonlySet<string>): boolean;
interface ToolDefLike {
  name: string;
  [key: string]: unknown;
}
interface ToolInstanceLike {
  name: string;
  [key: string]: unknown;
}
interface BuildToolSetConfig {
  toolDefinitions?: ToolDefLike[];
  tools?: (ToolInstanceLike | null | undefined)[];
}
/**
* Builds a Set of tool names for use with formatAgentMessages.
*
* In event-driven mode, tools are defined via toolDefinitions (which includes
* deferred tools like tool_search). In legacy mode, tools come from loaded
* tool instances.
*
* This ensures tool_search and other deferred tools are included in the toolSet,
* allowing their ToolMessages to be preserved in conversation history.
*/
declare function buildToolSet(agentConfig: BuildToolSetConfig | null | undefined): Set<string>;
interface RegisterCodeExecutionToolsParams {
  toolRegistry: LCToolRegistry$1 | undefined;
  toolDefinitions: LCTool$1[] | undefined;
  /**
  * When `true`, register `bash_tool` alongside `read_file`. When `false`,
  * register `read_file` only — manually-primed skills still need it to
  * load `references/*` files from storage even without a sandbox.
  *
  * Callers:
  * - `initializeAgent` passes `true` iff the `execute_code` capability
  *   is enabled for the run.
  * - `injectSkillCatalog` passes whatever `codeEnvAvailable` resolved to
  *   for the run.
  *
  * Both callers reach this helper in the same `initializeAgent` run
  * sequentially; the registry `.has()` check keeps the second call a
  * no-op so there is exactly one copy of each tool in `toolDefinitions`.
  */
  includeBash: boolean;
  /**
  * When `true`, `read_file` tells the model about skill-file paths
  * (`{skillName}/{path}`). When `false`, it is described only as a
  * code-execution sandbox reader so execute-code-only agents don't get
  * prompted to discover skills that are not enabled for the run.
  */
  includeSkillFileInstructions?: boolean;
  /**
  * When `true`, the registered `bash_tool` description includes the
  * LLM-facing `{{tool<idx>turn<turn>}}` reference syntax guide so the
  * model knows it can substitute prior tool outputs in subsequent
  * commands. Paired with `RunConfig.toolOutputReferences` in `createRun`.
  */
  enableToolOutputReferences?: boolean;
}
interface RegisterCodeExecutionToolsResult {
  toolDefinitions: LCTool$1[];
  /** Tool names newly registered (skipped names that already existed). */
  registered: string[];
}
type RegisterFileAuthoringToolsResult = RegisterCodeExecutionToolsResult;
interface RegisterFileAuthoringToolsParams {
  toolRegistry: LCToolRegistry$1 | undefined;
  toolDefinitions: LCTool$1[] | undefined;
  /**
  * When true, descriptions point the model at the skill file namespace
  * (`skills/{skillName}/...`) in addition to sandbox paths. When false,
  * descriptions stay focused on code-execution sandbox files.
  */
  includeSkillFileInstructions?: boolean;
}
declare function isFileAuthoringToolDefinition(def: LCTool$1 | undefined): boolean;
/**
* Idempotently registers the code-execution tool pair (`bash_tool` +
* `read_file`) into the run's tool registry and tool-definition list.
* `read_file` can be registered with a code-only description first and
* upgraded to the skill-aware description later in the same run if
* skills are actually injected.
*
* Replaces the legacy `CodeExecutionToolDefinition` / `execute_code`
* registration. `execute_code` as a capability name and as an
* `agent.tools` entry is preserved — it just expands into this tool
* pair at load time so there is only one code-execution tool path
* end-to-end (no same-run dedupe surprises for agents with both
* `execute_code` capability AND skills active).
*/
declare function registerCodeExecutionTools(params: RegisterCodeExecutionToolsParams): RegisterCodeExecutionToolsResult;
declare function registerFileAuthoringTools(params: RegisterFileAuthoringToolsParams): RegisterFileAuthoringToolsResult;
//#endregion
//#region src/agents/added.d.ts
declare const ADDED_AGENT_ID = "added_agent";
interface LoadAddedAgentDeps {
  getAgent: (searchParameter: {
    id: string;
  }) => Promise<Agent | null>;
  getMCPServerTools: (userId: string, serverName: string) => Promise<Record<string, unknown> | null>;
}
interface LoadAddedAgentParams {
  req: {
    user?: {
      id?: string;
    };
    config?: Record<string, unknown>;
  };
  conversation: TConversation | null;
  primaryAgent?: Agent | null;
}
/**
* Loads an agent from an added conversation (for multi-convo parallel agent execution).
* Returns the agent config as a plain object, or null if invalid.
*/
declare function loadAddedAgent({
  req,
  conversation,
  primaryAgent
}: LoadAddedAgentParams, deps: LoadAddedAgentDeps): Promise<Agent | null>;
//#endregion
//#region src/agents/load.d.ts
interface LoadAgentDeps {
  getAgent: (searchParameter: {
    id: string;
  }) => Promise<Agent | null>;
  getMCPServerTools: (userId: string, serverName: string) => Promise<Record<string, unknown> | null>;
}
interface LoadAgentParams {
  req: {
    user?: {
      id?: string;
    };
    config?: AppConfig;
    body?: {
      promptPrefix?: string;
      ephemeralAgent?: TEphemeralAgent;
    };
  };
  spec?: string;
  agent_id: string;
  endpoint: string;
  model_parameters?: AgentModelParameters & {
    model?: string;
  };
}
/**
* Load an ephemeral agent based on the request parameters.
*/
declare function loadEphemeralAgent({
  req,
  spec,
  endpoint,
  model_parameters: _m
}: Omit<LoadAgentParams, "agent_id">, deps: LoadAgentDeps): Promise<Agent | null>;
/**
* Load an agent based on the provided ID.
* For ephemeral agents, builds a synthetic agent from request parameters.
* For persistent agents, fetches from the database.
*/
declare function loadAgent(params: LoadAgentParams, deps: LoadAgentDeps): Promise<Agent | null>;
//#endregion
//#region src/actions/credentials.d.ts
type ActionMetadataUpdateResult = {
  metadata: ActionMetadata;
  targetChanged: boolean;
  requiresCredentialRefresh: boolean;
};
type ActionMetadataUpdateParams = {
  storedMetadata: ActionMetadata;
  incomingMetadata: ActionMetadata;
};
/**
* Preserves saved credentials only while an Action continues to point at the
* same request/auth boundary. A changed domain, OpenAPI server URL, or auth
* endpoint must come with fresh credentials or explicitly remove auth.
*/
declare function mergeActionMetadataForUpdate({
  storedMetadata,
  incomingMetadata
}: ActionMetadataUpdateParams): ActionMetadataUpdateResult;
//#endregion
//#region src/actions/tools.d.ts
type ActionToolLike = {
  function?: {
    name?: string;
  };
};
type MergeAgentActionToolsParams = {
  existingTools: string[];
  incomingFunctions: ActionToolLike[];
  encodedDomain: string;
  actionId: string;
  requestedActionId?: string;
  legacyDomain?: string;
  previousEncodedDomain?: string;
  previousLegacyDomain?: string;
  previousRawSpec?: string;
};
declare function mergeAgentActionTools({
  existingTools,
  incomingFunctions,
  encodedDomain,
  actionId,
  requestedActionId,
  legacyDomain,
  previousEncodedDomain,
  previousLegacyDomain,
  previousRawSpec
}: MergeAgentActionToolsParams): string[];
//#endregion
//#region src/actions/update.d.ts
declare const ACTION_CREDENTIAL_REFRESH_MESSAGE = "Action credentials must be re-entered when changing the domain, OpenAPI server URL, or authentication settings";
type StoredActionForUpdate = {
  metadata?: ActionMetadata | null;
};
type PlanAgentActionUpdateParams = {
  agentActions: string[];
  agentTools: string[];
  incomingFunctions: ActionToolLike[];
  incomingMetadata: ActionMetadata;
  actionId: string;
  requestedActionId?: string;
  encodedDomain: string;
  legacyDomain?: string;
  previousLegacyDomain?: string;
  storedAction?: StoredActionForUpdate | null;
};
type PlannedAgentActionUpdate = {
  actionId: string;
  metadata: ActionMetadata;
  actions: string[];
  tools: string[];
  targetChanged: boolean;
  requiresCredentialRefresh: boolean;
  deleteOAuthTokens: boolean;
};
type ActionOAuthTokenDeleteQuery = {
  type: "oauth" | "oauth_refresh";
  identifier: RegExp;
};
declare function legacyActionDomainEncode(domain?: string): string;
declare function buildActionOAuthTokenDeleteQueries(actionId: string): ActionOAuthTokenDeleteQuery[];
declare function planAgentActionUpdate({
  agentActions,
  agentTools,
  incomingFunctions,
  incomingMetadata,
  actionId,
  requestedActionId,
  encodedDomain,
  legacyDomain,
  previousLegacyDomain,
  storedAction
}: PlanAgentActionUpdateParams): PlannedAgentActionUpdate;
//#endregion
//#region src/prompts/artifacts/index.d.ts
/**
* Generates an artifacts prompt based on the endpoint and artifact mode
* @param params - Configuration parameters
* @param params.endpoint - The current endpoint
* @param params.artifacts - The current artifact mode
* @returns The artifacts prompt, or null if mode is CUSTOM
*/
declare function generateArtifactsPrompt(params: {
  endpoint: EModelEndpoint | string;
  artifacts: ArtifactModes;
}): string | null;
//#endregion
//#region src/prompts/format.d.ts
/**
* Formats prompt groups for the paginated /groups endpoint response
*/
declare function formatPromptGroupsResponse({
  promptGroups,
  pageNumber,
  pageSize,
  actualLimit,
  hasMore,
  after
}: {
  promptGroups: IPromptGroupDocument[];
  pageNumber?: string;
  pageSize?: string;
  actualLimit?: string | number;
  hasMore?: boolean;
  after?: string | null;
}): PromptGroupsListResponse;
/**
* Creates an empty response for the paginated /groups endpoint
*/
declare function createEmptyPromptGroupsResponse({
  pageNumber,
  pageSize,
  actualLimit
}: {
  pageNumber?: string;
  pageSize?: string;
  actualLimit?: string | number;
}): PromptGroupsListResponse;
/**
* Marks prompt groups as public based on the publicly accessible IDs
*/
declare function markPublicPromptGroups(promptGroups: IPromptGroupDocument[], publiclyAccessibleIds: Types.ObjectId[]): IPromptGroupDocument[];
/**
* Builds filter object for prompt group queries
*/
declare function buildPromptGroupFilter({
  name,
  category
}: {
  name?: string;
  category?: string;
}): {
  filter: Record<string, string | number | boolean | RegExp | undefined>;
  searchShared: boolean;
  searchSharedOnly: boolean;
};
/**
* Filters accessible IDs based on shared/public prompts logic.
*
* @param ownedPromptGroupIds - IDs of prompt groups authored by the current user.
*   Required for correct MY_PROMPTS and SHARED_PROMPTS filtering. When omitted the
*   function falls back to the legacy behaviour (public-only filtering).
*/
declare function filterAccessibleIdsBySharedLogic({
  accessibleIds,
  searchShared,
  searchSharedOnly,
  publicPromptGroupIds,
  ownedPromptGroupIds
}: {
  accessibleIds: Types.ObjectId[];
  searchShared: boolean;
  searchSharedOnly: boolean;
  publicPromptGroupIds?: Types.ObjectId[];
  ownedPromptGroupIds?: Types.ObjectId[];
}): Promise<Types.ObjectId[]>;
//#endregion
//#region src/prompts/migration.d.ts
interface PromptMigrationCheckDbMethods {
  findRoleByIdentifier: AccessRoleMethods["findRoleByIdentifier"];
}
interface PromptMigrationCheckParams {
  mongoose: Mongoose;
  methods: PromptMigrationCheckDbMethods;
  PromptGroupModel: Model<IPromptGroupDocument>;
}
interface PromptMigrationCheckResult {
  totalToMigrate: number;
  globalViewAccess: number;
  privateGroups: number;
  details?: {
    globalViewAccess: Array<{
      name: string;
      _id: string;
      category: string;
    }>;
    privateGroups: Array<{
      name: string;
      _id: string;
      category: string;
    }>;
  };
}
/**
* Check if prompt groups need to be migrated to the new permission system
* This performs a dry-run check similar to the migration script
*/
declare function checkPromptPermissionsMigration({
  methods,
  mongoose,
  PromptGroupModel
}: PromptMigrationCheckParams): Promise<PromptMigrationCheckResult>;
/**
* Log migration warning to console if prompt groups need migration
*/
declare function logPromptMigrationWarning(result: PromptMigrationCheckResult): void;
//#endregion
//#region src/prompts/schemas.d.ts
/**
* Schema for validating prompt group update payloads.
* Only allows fields that users should be able to modify.
* Sensitive fields like author, authorName, _id, productionId, etc. are excluded.
*/
declare const updatePromptGroupSchema: z.ZodObject<{
  /** The name of the prompt group */name: z.ZodOptional<z.ZodString>; /** Short description/oneliner for the prompt group */
  oneliner: z.ZodOptional<z.ZodString>; /** Category for organizing prompt groups */
  category: z.ZodOptional<z.ZodString>; /** Command shortcut for the prompt group */
  command: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strict">;
type TUpdatePromptGroupSchema = z.infer<typeof updatePromptGroupSchema>;
/**
* Validates and sanitizes a prompt group update payload.
* Returns only the allowed fields, stripping any sensitive fields.
* @param data - The raw request body to validate
* @returns The validated and sanitized payload
* @throws ZodError if validation fails
*/
declare function validatePromptGroupUpdate(data: unknown): TUpdatePromptGroupSchema;
/**
* Safely validates a prompt group update payload without throwing.
* @param data - The raw request body to validate
* @returns A SafeParseResult with either the validated data or validation errors
*/
declare function safeValidatePromptGroupUpdate(data: unknown): z.SafeParseReturnType<{
  name?: string | undefined;
  category?: string | undefined;
  command?: string | null | undefined;
  oneliner?: string | undefined;
}, {
  name?: string | undefined;
  category?: string | undefined;
  command?: string | null | undefined;
  oneliner?: string | undefined;
}>;
//#endregion
//#region src/projects/handlers.d.ts
interface ProjectUser {
  id: string;
  _id?: {
    toString(): string;
  };
}
interface ProjectRequest extends Request {
  user?: ProjectUser;
}
type ProjectHandlerDependencies = Pick<ChatProjectMethods, "listChatProjects" | "createChatProject" | "getChatProject" | "updateChatProject" | "deleteChatProject" | "assignConversationToProject">;
declare function createProjectHandlers(deps: ProjectHandlerDependencies): {
  listProjects: (req: ProjectRequest, res: Response$1) => Promise<Response$1>;
  createProject: (req: ProjectRequest, res: Response$1) => Promise<Response$1>;
  assignConversationToProject: (req: ProjectRequest, res: Response$1) => Promise<Response$1>;
  getProject: (req: ProjectRequest, res: Response$1) => Promise<Response$1>;
  updateProject: (req: ProjectRequest, res: Response$1) => Promise<Response$1>;
  deleteProject: (req: ProjectRequest, res: Response$1) => Promise<Response$1>;
};
//#endregion
//#region src/skills/binary.d.ts
/**
* Determine whether a buffer contains binary (non-text) content.
* Scans the first 8 KB for null bytes and non-printable character ratio.
*/
declare function isBinaryBuffer(buffer: Buffer): boolean;
//#endregion
//#region src/skills/handlers.d.ts
/**
* All dependencies required to serve skill HTTP requests. Every dep is resolved
* from the legacy api layer (`~/models`, `PermissionService`) so the TS handlers
* stay pure — no direct imports of mongoose, no direct filesystem I/O.
*/
interface SkillsHandlersDeps {
  /** Skill CRUD — from `@librechat/data-schemas` `createMethods` output. */
  createSkill: (data: CreateSkillInput) => Promise<CreateSkillResult>;
  getSkillById: (id: string | Types.ObjectId) => Promise<(ISkill & {
    _id: Types.ObjectId;
  }) | null>;
  listSkillsByAccess: (params: {
    accessibleIds: Types.ObjectId[];
    category?: string;
    search?: string;
    limit: number;
    cursor?: string | null;
  }) => Promise<ListSkillsByAccessResult>;
  updateSkill: (params: {
    id: string;
    expectedVersion: number;
    update: UpdateSkillInput;
  }) => Promise<UpdateSkillResult>;
  deleteSkill: (id: string) => Promise<{
    deleted: boolean;
  }>;
  listSkillFiles: (skillId: string | Types.ObjectId) => Promise<Array<ISkillFile & {
    _id: Types.ObjectId;
  }>>;
  deleteSkillFile: (skillId: string | Types.ObjectId, relativePath: string) => Promise<{
    deleted: boolean;
  }>;
  /** Access-control primitives from PermissionService. */
  findAccessibleResources: (params: {
    userId: string;
    role?: string | null;
    resourceType: string;
    requiredPermissions: number;
  }) => Promise<Types.ObjectId[]>;
  findPubliclyAccessibleResources: (params: {
    resourceType: string;
    requiredPermissions: number;
  }) => Promise<Types.ObjectId[]>;
  hasPublicPermission: (params: {
    resourceType: string;
    resourceId: string | Types.ObjectId;
    requiredPermissions: number;
  }) => Promise<boolean>;
  grantPermission: (params: {
    principalType: string;
    principalId: string | Types.ObjectId;
    resourceType: string;
    resourceId: string | Types.ObjectId;
    accessRoleId: string;
    grantedBy: string | Types.ObjectId;
  }) => Promise<unknown>;
  /** Single-file lookup + cache update for the download handler. */
  getSkillFileByPath: (skillId: string | Types.ObjectId, relativePath: string) => Promise<(ISkillFile & {
    _id: Types.ObjectId;
    content?: string;
    isBinary?: boolean;
  }) | null>;
  updateSkillFileContent: (skillId: string | Types.ObjectId, relativePath: string, update: {
    content?: string;
    isBinary?: boolean;
  }) => Promise<void>;
  /** Storage strategy resolver — returns stream/URL helpers keyed by source. */
  getStrategyFunctions: (source: string) => Partial<StrategyFunctions>;
  /** ObjectId validation helper from data-schemas. */
  isValidObjectIdString: (value: unknown) => boolean;
}
/**
* Factory for the typed Express handlers served at `/api/skills`.
* The legacy `api/server/routes/skills.js` imports this, passes in concrete
* deps from `~/models` + `PermissionService`, and wires the returned handlers
* onto the Express router.
*/
declare function createSkillsHandlers(deps: SkillsHandlersDeps): {
  list: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  create: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  get: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  patch: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  delete: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  listFiles: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
  downloadFile: (req: ServerRequest, res: Response$1) => Promise<Response$1 | undefined>;
  deleteFile: (req: ServerRequest, res: Response$1) => Promise<Response$1>;
};
type SkillsHandlers = ReturnType<typeof createSkillsHandlers>;
//#endregion
//#region src/skills/limits.d.ts
type ImportLimits = {
  maxZipBytes: number;
  maxDecompressedBytes: number;
  maxEntries: number;
  maxSingleFileBytes: number;
};
declare const DEFAULT_SKILL_IMPORT_LIMITS: ImportLimits;
//#endregion
//#region src/skills/import.d.ts
/**
* YAML frontmatter parser — extracts the first-class fields LibreChat
* persists as columns (`name`, `description`, `alwaysApply`) out of a
* SKILL.md file. Intentionally narrow: the full frontmatter validator in
* `packages/data-schemas/src/methods/skill.ts` covers the wire contract;
* this parser only needs to hand `createSkill` the columns it populates.
*
* When a known boolean field (currently `always-apply` plus the accepted
* `alwaysApply` alias) is present
* with a value that isn't recognizable as `true`/`false`, the parser
* records it on `invalidBooleans[]` so the import handler can surface
* a 400 instead of silently dropping the flag. Without this signal,
* authoring mistakes like `alwaysApply: yes` would be lossy-converted
* to "not always-applied" and the user would never learn their
* frontmatter was malformed.
*
* Exported for unit testing only — prefer `createImportHandler` at runtime.
*/
declare function parseFrontmatter(raw: string): {
  name: string;
  description: string;
  alwaysApply?: boolean; /** Keys that carried non-boolean values for fields that must be boolean. */
  invalidBooleans: string[];
  parseError?: string;
};
interface ImportSkillDeps {
  limits?: Partial<ImportLimits> | ((req: ServerRequest$1) => Partial<ImportLimits> | undefined);
  createSkill: (data: CreateSkillInput) => Promise<CreateSkillResult>;
  getSkillById: (id: string | Types.ObjectId) => Promise<(ISkill & {
    _id: Types.ObjectId;
  }) | null>;
  deleteSkill: (id: string) => Promise<{
    deleted: boolean;
  }>;
  upsertSkillFile: (row: UpsertSkillFileInput) => Promise<ISkillFile & {
    _id: Types.ObjectId;
  }>;
  saveBuffer: (req: Request, params: {
    userId: string;
    buffer: Buffer;
    fileName: string;
    basePath?: string;
    isImage?: boolean;
    tenantId?: string;
  }) => Promise<{
    filepath: string;
    source: string;
    storageKey?: string;
    storageRegion?: string;
  }>;
  deleteFile?: (req: Request, file: {
    filepath: string;
    source: string;
    [key: string]: unknown;
  }) => Promise<void>;
  grantPermission: (params: {
    principalType: string;
    principalId: string;
    resourceType: string;
    resourceId: Types.ObjectId;
    accessRoleId: string;
    grantedBy: string;
  }) => Promise<unknown>;
}
interface ServerRequest$1 extends Request {
  tenantId?: string;
  user: {
    id: string;
    _id: Types.ObjectId;
    name?: string;
    username?: string;
    tenantId?: string;
  };
  file?: Express.Multer.File;
}
/**
* `POST /api/skills/import`
*
* Accepts a single multipart file (.md, .zip, or .skill).
* Creates the skill, then processes additional files individually.
* Grants SKILL_OWNER to the uploader.
*/
declare function createImportHandler(deps: ImportSkillDeps): (req: ServerRequest$1, res: Response$1) => Promise<Response$1>;
declare function guessMimeType(filename: string): string;
//#endregion
//#region src/skills/parse.d.ts
type ParsedSkillMarkdown = {
  name: string;
  description: string;
  alwaysApply?: boolean;
  frontmatter?: Record<string, unknown>;
  invalidBooleans: string[];
  parseError?: string;
};
declare function parseSkillMarkdown(raw: string): ParsedSkillMarkdown;
//#endregion
//#region src/skills/skillStates.d.ts
/** Hard cap on explicit override entries stored on a user document. */
declare const MAX_SKILL_STATES = 200;
/** Max length of a skill-ID map key (matches ObjectId hex length with slack). */
declare const MAX_KEY_LENGTH = 64;
/**
* Generous upper bound on raw payload size to reject abusive inputs before
* we spend cycles validating or querying the DB for orphan cleanup.
*/
declare const MAX_RAW_PAYLOAD: number;
/** Map of skillId → explicit active state override. */
type SkillStatesRecord = Record<string, boolean>;
/**
* Converts a Mongoose Map (non-lean) or plain object (lean) into a
* `SkillStatesRecord`. Returns `{}` for any other shape.
*/
declare function toSkillStatesRecord(raw: Map<string, boolean> | Record<string, boolean> | null | undefined): SkillStatesRecord;
/**
* Reads `defaultActiveOnShare` out of the `interface.skills` config shape.
* The shape is a Zod union (boolean | object) so we handle both gracefully.
*/
declare function resolveDefaultActiveOnShare(skillsConfig: unknown): boolean;
/** Return shape from `loadSkillStates`. */
interface LoadedSkillStates {
  skillStates: SkillStatesRecord;
  defaultActiveOnShare: boolean;
}
interface LoadSkillStatesParams {
  userId: string;
  appConfig?: {
    interfaceConfig?: {
      skills?: unknown;
    };
  } | null;
  getUserById: (id: string, select: string) => Promise<{
    skillStates?: Map<string, boolean> | Record<string, boolean>;
  } | null | undefined>;
  /**
  * When provided and empty, the helper short-circuits to defaults without
  * issuing the user query. Lets every agent entry point skip the DB round
  * trip when no skills are accessible, without re-implementing the guard.
  */
  accessibleSkillIds?: ArrayLike<unknown>;
}
/**
* Loads a user's `skillStates` overrides and the admin-configured
* `defaultActiveOnShare` in one call. Used by every agent entry point so the
* same loading block is not duplicated across controllers.
*/
declare function loadSkillStates(params: LoadSkillStatesParams): Promise<LoadedSkillStates>;
interface SkillStatesValidationError {
  code?: string;
  message: string;
  limit?: number;
}
/**
* Validates a raw skill-states update payload. Returns `null` on success or
* a structured `SkillStatesValidationError` describing the first rejection
* reason. Caller maps the error to an HTTP 400 response.
*
* Rejects: non-object payloads, oversize payloads (sanity bound for abuse),
* non-string/empty/oversize keys, keys that are not valid ObjectIds, and
* non-boolean values. The strict 200-entry cap is enforced *after* orphan
* pruning, not here, so stale-client payloads near the cap do not get a
* false-positive rejection.
*/
declare function validateSkillStatesPayload(payload: unknown): SkillStatesValidationError | null;
interface PruneOrphansDeps {
  /** Returns the subset of the given IDs that exist as Skill documents. */
  findExistingSkillIds: (validIds: string[]) => Promise<string[]>;
  /** Returns IDs the current user has VIEW access to via ACL. */
  findAccessibleSkillIds: () => Promise<Array<Types.ObjectId | string>>;
}
/**
* Returns a copy of `skillStates` containing only entries that: are valid
* ObjectIds, point to a Skill that currently exists, AND the user still has
* VIEW access to. Self-heals three classes of orphan without cascade logic:
* malformed keys, deleted skills, and revoked shares.
*
* Deps are injected so the pure logic can be tested without Mongoose or ACL
* wiring. Callers in `/api` adapt their live model + permission service.
*/
declare function pruneOrphanSkillStates(skillStates: SkillStatesRecord, deps: PruneOrphansDeps): Promise<SkillStatesRecord>;
//#endregion
//#region src/skills/deployment.d.ts
declare const DEPLOYMENT_SKILLS_DIR_ENV = "DEPLOYMENT_SKILLS_DIR";
declare const DEFAULT_DEPLOYMENT_SKILLS_DIR = "skill";
declare const DEPLOYMENT_SKILL_SOURCE = "deployment";
declare const DEPLOYMENT_SKILL_FILE_SOURCE = "deployment";
type SkillId = Types.ObjectId | string;
type DeploymentSkillFile = {
  _id: Types.ObjectId;
  skillId: Types.ObjectId;
  relativePath: string;
  file_id: string;
  filename: string;
  filepath: string;
  source: typeof DEPLOYMENT_SKILL_FILE_SOURCE;
  mimeType: string;
  bytes: number;
  category: "script" | "reference" | "asset" | "other";
  isExecutable: boolean;
  author: Types.ObjectId;
  content?: string;
  isBinary?: boolean;
  codeEnvRef?: CodeEnvRef;
  createdAt: Date;
  updatedAt: Date;
};
type DeploymentSkill = {
  _id: Types.ObjectId;
  name: string;
  displayTitle?: string;
  description: string;
  body: string;
  frontmatter: Record<string, unknown>;
  category: string;
  disableModelInvocation?: boolean;
  userInvocable?: boolean;
  allowedTools?: string[];
  author: Types.ObjectId;
  authorName: string;
  version: number;
  source: typeof DEPLOYMENT_SKILL_SOURCE;
  sourceMetadata: {
    deployment: true;
    directory: string;
  };
  fileCount: number;
  alwaysApply: boolean;
  isPublic: true;
  deployment: true;
  files: DeploymentSkillFile[];
  createdAt: Date;
  updatedAt: Date;
};
type SkillLookupOptions = {
  preferUserInvocable?: boolean;
  preferModelInvocable?: boolean;
};
type SkillSummaryRow = {
  _id: Types.ObjectId;
  name: string;
  displayTitle?: string;
  description: string;
  category?: string;
  disableModelInvocation?: boolean;
  userInvocable?: boolean;
  allowedTools?: string[];
  author: Types.ObjectId;
  authorName?: string;
  version?: number;
  source?: string;
  sourceMetadata?: Record<string, unknown>;
  fileCount?: number;
  alwaysApply?: boolean;
  isPublic?: boolean;
  tenantId?: string;
  deployment?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
type SkillDetailRow = SkillSummaryRow & {
  body: string;
  frontmatter?: Record<string, unknown>;
  version: number;
  fileCount: number;
};
type AlwaysApplySkillRow = {
  _id: Types.ObjectId;
  name: string;
  body: string;
  author: Types.ObjectId | string;
  allowedTools?: string[];
  deployment?: boolean;
  updatedAt?: Date;
};
type ListSkillsByAccessParams = {
  accessibleIds: Types.ObjectId[];
  category?: string;
  search?: string;
  limit: number;
  cursor?: string | null;
};
type ListSkillsByAccessResult$1 = {
  skills: SkillSummaryRow[];
  has_more?: boolean;
  after?: string | null;
};
type ListAlwaysApplyParams = {
  accessibleIds: Types.ObjectId[];
  limit: number;
  cursor?: string | null;
};
type ListAlwaysApplyResult = {
  skills: AlwaysApplySkillRow[];
  has_more?: boolean;
  after?: string | null;
};
type SkillFileRow = Omit<DeploymentSkillFile, "codeEnvRef" | "content" | "isBinary"> & {
  storageKey?: string;
  storageRegion?: string;
  tenantId?: string;
};
type SkillFileContentRow = SkillFileRow & {
  codeEnvRef?: CodeEnvRef;
  content?: string;
  isBinary?: boolean;
};
type DeploymentSkillBaseMethods = {
  getSkillById?: (id: SkillId) => Promise<SkillDetailRow | null>;
  getSkillByName?: (name: string, accessibleIds: Types.ObjectId[], options?: SkillLookupOptions) => Promise<SkillDetailRow | null>;
  listSkillsByAccess?: (params: ListSkillsByAccessParams) => Promise<ListSkillsByAccessResult$1>;
  listAlwaysApplySkills?: (params: ListAlwaysApplyParams) => Promise<ListAlwaysApplyResult>;
  listSkillFiles?: (skillId: SkillId) => Promise<SkillFileRow[]>;
  getSkillFileByPath?: (skillId: SkillId, relativePath: string) => Promise<SkillFileContentRow | null>;
  updateSkillFileContent?: (skillId: SkillId, relativePath: string, update: {
    content?: string;
    isBinary?: boolean;
  }) => Promise<void>;
  updateSkillFileCodeEnvIds?: (updates: Array<{
    skillId: SkillId;
    relativePath: string;
    codeEnvRef: CodeEnvRef;
  }>) => Promise<{
    matchedCount: number;
    modifiedCount: number;
  } | void>;
};
type LoadDeploymentSkillsOptions = {
  projectRoot?: string;
  env?: NodeJS.ProcessEnv;
};
type DirectoryResolution = {
  directory: string;
  explicitlyConfigured: boolean;
};
declare class DeploymentSkillRegistry {
  private readonly directory;
  private readonly skillsById;
  private readonly skillsByName;
  private readonly filesByPath;
  constructor(directory: string | null, skills: DeploymentSkill[]);
  getDirectory(): string | null;
  list(): DeploymentSkill[];
  ids(): Types.ObjectId[];
  hasId(id: SkillId | undefined): boolean;
  getById(id: SkillId): DeploymentSkill | null;
  getByName(name: string, accessibleIds: Types.ObjectId[], _options?: SkillLookupOptions): DeploymentSkill | null;
  namesByAccess(accessibleIds: Types.ObjectId[]): Set<string>;
  listByAccess(params: ListSkillsByAccessParams): DeploymentSkill[];
  listAlwaysApply(params: ListAlwaysApplyParams): DeploymentSkill[];
  listFiles(skillId: SkillId): DeploymentSkillFile[] | null;
  getFileByPath(skillId: SkillId, relativePath: string): DeploymentSkillFile | null;
  hasFilePath(filepath: string): boolean;
  updateFileCodeEnvRefs(updates: Array<{
    skillId: SkillId;
    relativePath: string;
    codeEnvRef: CodeEnvRef;
  }>): Array<{
    skillId: SkillId;
    relativePath: string;
    codeEnvRef: CodeEnvRef;
  }>;
}
declare function getDeploymentSkillRegistry(): DeploymentSkillRegistry;
declare function getDeploymentSkillIds(): Types.ObjectId[];
declare function mergeDeploymentSkillIds(ids: Array<SkillId>): Types.ObjectId[];
declare function isDeploymentSkillId(id: SkillId | undefined): boolean;
declare function isDeploymentSkillFileSource(source: unknown): boolean;
declare function getDeploymentSkillById(id: SkillId): DeploymentSkill | null;
declare function isDeploymentSkillFilePath(filepath: string): boolean;
declare function getDeploymentSkillDownloadStream(filepath: string): Promise<NodeJS.ReadableStream>;
declare function updateDeploymentSkillFileCodeEnvRefs(updates: Array<{
  skillId: SkillId;
  relativePath: string;
  codeEnvRef: CodeEnvRef;
}>): Array<{
  skillId: SkillId;
  relativePath: string;
  codeEnvRef: CodeEnvRef;
}>;
declare function resolveDeploymentSkillDirectory(options?: LoadDeploymentSkillsOptions): DirectoryResolution;
declare function initializeDeploymentSkills(options?: LoadDeploymentSkillsOptions): Promise<DeploymentSkillRegistry>;
declare function loadDeploymentSkillsFromDirectory(directory: string, options?: {
  projectRoot?: string;
  explicitlyConfigured?: boolean;
}): Promise<DeploymentSkillRegistry>;
declare function createDeploymentSkillMethods<T extends DeploymentSkillBaseMethods>(base: T): T & Required<Pick<DeploymentSkillBaseMethods, "getSkillById">>;
//#endregion
//#region src/endpoints/anthropic/helpers.d.ts
declare const FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
declare function appendAnthropicBetaHeader(headers: Record<string, string> | undefined, beta: string): Record<string, string>;
/**
* @param {string} modelName
* @returns {boolean}
*/
declare function checkPromptCacheSupport(modelName: string): boolean;
/**
* Gets the appropriate headers for Claude models with cache control
* @param {string} model The model name
* @param {boolean} supportsCacheControl Whether the model supports cache control
* @returns {AnthropicClientOptions['extendedOptions']['defaultHeaders']|undefined} The headers object or undefined if not applicable
*/
declare function getClaudeHeaders(model: string, supportsCacheControl: boolean): Record<string, string> | undefined;
/**
* Configures reasoning-related options for Claude models.
* Models supporting adaptive thinking (Opus 4.6+, Sonnet 4.6+) use effort control instead of manual budget_tokens.
*/
declare function configureReasoning(anthropicInput: AnthropicClientOptions & {
  max_tokens?: number;
}, extendedOptions?: {
  thinking?: boolean;
  thinkingBudget?: number | null;
  effort?: AnthropicEffort | string | null;
  thinkingDisplay?: ThinkingDisplay | string | null;
}): AnthropicClientOptions & {
  max_tokens?: number;
};
//#endregion
//#region src/endpoints/anthropic/llm.d.ts
/** Known Anthropic parameters that map directly to the client config */
declare const knownAnthropicParams: Set<string>;
/**
* Generates configuration options for creating an Anthropic language model (LLM) instance.
* @param credentials - The API key for authentication with Anthropic, or credentials object for Vertex AI.
* @param options={} - Additional options for configuring the LLM.
* @returns Configuration options for creating an Anthropic LLM instance, with null and undefined values removed.
*/
declare function getLLMConfig(credentials: string | AnthropicCredentials | undefined, options?: AnthropicConfigOptions): AnthropicLLMConfigResult;
//#endregion
//#region src/endpoints/anthropic/vertex.d.ts
/**
* Options for loading Vertex AI credentials
*/
interface VertexCredentialOptions {
  /** Path to service account key file (overrides env var) */
  serviceKeyFile?: string;
  /** Project ID for Vertex AI */
  projectId?: string;
  /** Region for Vertex AI */
  region?: string;
}
/**
* Interface for Vertex AI configuration from YAML config.
* This matches the TVertexAISchema from librechat-data-provider.
*/
interface VertexAIConfigInput {
  enabled?: boolean;
  projectId?: string;
  region?: string;
  serviceKeyFile?: string;
  deploymentName?: string;
  models?: string[] | Record<string, boolean | {
    deploymentName?: string;
  }>;
}
/**
* Loads Google service account configuration for Vertex AI.
* Supports both YAML configuration and environment variables.
* @param options - Optional configuration from YAML or other sources
*/
declare function loadAnthropicVertexCredentials(options?: VertexCredentialOptions): Promise<AnthropicCredentials>;
/**
* Creates Vertex credential options from a Vertex AI configuration object.
* @param config - The Vertex AI configuration (from YAML config or other sources)
*/
declare function getVertexCredentialOptions(config?: VertexAIConfigInput): VertexCredentialOptions;
/**
* Checks if credentials are for Vertex AI (has service account key but no API key)
*/
declare function isAnthropicVertexCredentials(credentials: AnthropicCredentials): boolean;
/**
* Gets the deployment name for a given model name from the Vertex AI configuration.
* Maps visible model names to actual deployment names (model IDs).
* @param modelName - The visible model name (e.g., "Claude Opus 4.5")
* @param vertexConfig - The Vertex AI configuration with model mappings
* @returns The deployment name to use with the API (e.g., "claude-opus-4-5@20251101")
*/
declare function getVertexDeploymentName(modelName: string, vertexConfig?: VertexAIConfigInput): string;
/**
* Creates and configures a Vertex AI client for Anthropic.
* Supports both YAML configuration and environment variables for region/projectId.
* The projectId is automatically extracted from the service key if not explicitly provided.
* @param credentials - The Google service account credentials
* @param options - SDK client options
* @param vertexOptions - Vertex AI specific options (region, projectId) from YAML config
*/
declare function createAnthropicVertexClient(credentials: AnthropicCredentials, options?: ClientOptions$1, vertexOptions?: VertexAIClientOptions): AnthropicVertex;
//#endregion
//#region src/endpoints/anthropic/initialize.d.ts
/**
* Initializes Anthropic endpoint configuration.
* Supports both direct API key authentication and Google Cloud Vertex AI.
*
* @param params - Configuration parameters
* @returns Promise resolving to Anthropic configuration options
* @throws Error if API key is not provided (when not using Vertex AI)
*/
declare function initializeAnthropic({
  req,
  endpoint,
  model_parameters,
  db
}: BaseInitializeParams): Promise<InitializeResultBase>;
//#endregion
//#region src/endpoints/bedrock/initialize.d.ts
/**
* Initializes Bedrock endpoint configuration.
*
* This module handles configuration for AWS Bedrock endpoints, including support for
* HTTP/HTTPS proxies and reverse proxies.
*
* Proxy Support:
* - When proxy env vars are set, creates a custom BedrockRuntimeClient
*   with an HttpsProxyAgent to route Bedrock API calls through the resolved proxy
* - The custom client is fully configured with credentials, region, and endpoint,
*   and is passed directly to ChatBedrockConverse via the 'client' parameter
*
* Reverse Proxy Support:
* - When BEDROCK_REVERSE_PROXY is set, routes Bedrock API calls through a custom endpoint
* - Works with or without the PROXY setting
*
* Without Proxy:
* - Credentials and endpoint configuration are passed separately to ChatBedrockConverse,
*   which creates its own BedrockRuntimeClient internally
*
* @param params - Configuration parameters
* @returns Promise resolving to Bedrock configuration options
* @throws Error if credentials are not provided when required
*/
declare function initializeBedrock({
  req,
  endpoint,
  model_parameters,
  db
}: BaseInitializeParams): Promise<InitializeResultBase>;
//#endregion
//#region src/endpoints/config/endpoints.d.ts
type PartialEndpointEntry = Partial<TConfig> & Record<string, unknown>;
type DefaultEndpointsResult = Record<string, PartialEndpointEntry | false | null>;
interface EndpointsConfigDeps {
  getAppConfig: (params: {
    role?: string;
    userId?: string;
    tenantId?: string;
  }) => Promise<AppConfig>;
  loadDefaultEndpointsConfig: (appConfig: AppConfig) => Promise<DefaultEndpointsResult>;
  loadCustomEndpointsConfig?: (custom: unknown) => TCustomEndpointsConfig | undefined;
}
declare function createEndpointsConfigService(deps: EndpointsConfigDeps): {
  getEndpointsConfig: (req: ServerRequest) => Promise<TEndpointsConfig>;
  checkCapability: (req: ServerRequest, capability: AgentCapabilities) => Promise<boolean>;
};
//#endregion
//#region src/endpoints/models.d.ts
interface FetchModelsParams {
  /** User ID for API requests */
  user?: string;
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API */
  baseURL?: string;
  /** Whether the base URL came from a user-stored credential */
  baseURLIsUserProvided?: boolean;
  /** Admin-approved internal host:port exemptions for user-provided base URLs */
  allowedAddresses?: string[] | null;
  /** Endpoint name (defaults to 'openAI') */
  name?: string;
  /** Whether directEndpoint was configured */
  direct?: boolean;
  /** Whether to fetch from Azure */
  azure?: boolean;
  /** Whether to send user ID as query parameter */
  userIdQuery?: boolean;
  /** Whether to create token configuration from API response */
  createTokenConfig?: boolean;
  /** Cache key for token configuration (uses name if omitted) */
  tokenKey?: string;
  /** Optional headers for the request */
  headers?: Record<string, string> | null;
  /** Optional user object for header resolution */
  userObject?: Partial<IUser>;
  /** Skip MODEL_QUERIES cache (e.g., for user-provided keys) */
  skipCache?: boolean;
}
/**
* Splits a string by commas and trims each resulting value.
* @param input - The input string to split.
* @returns An array of trimmed values.
*/
declare function splitAndTrim(input: string | null | undefined): string[];
/**
* Fetches models from the specified base API path or Azure, based on the provided configuration.
*
* @param params - The parameters for fetching the models.
* @returns A promise that resolves to an array of model identifiers.
*/
declare function fetchModels({
  user,
  apiKey,
  baseURL: _baseURL,
  baseURLIsUserProvided,
  allowedAddresses,
  name,
  direct,
  azure,
  userIdQuery,
  createTokenConfig,
  tokenKey,
  headers,
  userObject,
  skipCache
}: FetchModelsParams): Promise<string[]>;
/** Options for fetching OpenAI models */
interface GetOpenAIModelsOptions {
  /** User ID for API requests */
  user?: string;
  /** Whether to fetch from Azure */
  azure?: boolean;
  /** Whether to fetch models for the Assistants endpoint */
  assistants?: boolean;
  /** OpenAI API key (if not using environment variable) */
  openAIApiKey?: string;
  /** Skip MODEL_QUERIES cache (e.g., for user-provided keys) */
  skipCache?: boolean;
  /** Configured custom headers forwarded to the (gateway-fronted) provider */
  headers?: Record<string, string> | null;
  /** User object for resolving header placeholders */
  userObject?: Partial<IUser>;
}
/**
* Fetches models from OpenAI or Azure based on the provided options.
* @param opts - Options for fetching models
* @param _models - Fallback models array
* @returns Promise resolving to array of model IDs
*/
declare function fetchOpenAIModels(opts: GetOpenAIModelsOptions, _models?: string[]): Promise<string[]>;
/**
* Loads the default models for OpenAI or Azure.
* @param opts - Options for getting models
* @returns Promise resolving to array of model IDs
*/
declare function getOpenAIModels(opts?: GetOpenAIModelsOptions): Promise<string[]>;
/**
* Fetches models from the Anthropic API.
* @param opts - Options for fetching models
* @param _models - Fallback models array
* @returns Promise resolving to array of model IDs
*/
declare function fetchAnthropicModels(opts?: {
  user?: string;
  skipCache?: boolean;
  headers?: Record<string, string> | null;
  userObject?: Partial<IUser>;
}, _models?: string[]): Promise<string[]>;
/**
* Gets Anthropic models from environment or API.
* @param opts - Options for fetching models
* @returns Promise resolving to array of model IDs
*/
declare function getAnthropicModels(opts?: {
  user?: string;
  vertexModels?: string[];
  headers?: Record<string, string> | null;
  userObject?: Partial<IUser>;
}): Promise<string[]>;
/**
* Gets Google models from environment or defaults.
* @returns Array of model IDs
*/
declare function getGoogleModels(): string[];
/**
* Gets Bedrock models from environment or defaults.
* @returns Array of model IDs
*/
declare function getBedrockModels(): string[];
//#endregion
//#region src/endpoints/config/models.d.ts
interface LoadConfigModelsDeps {
  getAppConfig: (params: {
    role?: string;
    userId?: string;
    tenantId?: string;
  }) => Promise<AppConfig>;
  getUserKeyValues: GetUserKeyValuesFunction;
  fetchModels?: (params: FetchModelsParams) => Promise<string[]>;
}
declare function createLoadConfigModels(deps: LoadConfigModelsDeps): (req: ServerRequest) => Promise<TModelsConfig>;
//#endregion
//#region src/endpoints/config/providers.d.ts
/**
* Type for initialize functions
*/
type InitializeFn = (params: BaseInitializeParams) => Promise<InitializeResultBase>;
/**
* Check if the provider is a known custom provider
* @param provider - The provider string
* @returns True if the provider is a known custom provider, false otherwise
*/
declare function isKnownCustomProvider(provider?: string): boolean;
/**
* Provider configuration map mapping providers to their initialization functions.
*
* `Providers.VERTEXAI` shares `initializeGoogle` because the runtime distinction
* is auth-only — the agent flow may resolve `agent.provider` to `vertexai` when
* a service account is configured, but summarization (and other downstream
* resolvers) get the same lowercase enum value passed back. Without this
* mapping `getProviderConfig` throws "Provider vertexai not supported" and
* summarization falls back to the raw provider, dropping client overrides.
*/
declare const providerConfigMap: Record<string, InitializeFn>;
type TitleTiming = "immediate" | "final";
/**
* Resolves when conversation titles are generated for a given endpoint.
*
* `endpoints.all.titleTiming`, when present, is the global override. Otherwise,
* endpoint candidates are checked in order so the public endpoint (for example
* `agents`) can override the backing provider, with provider/custom config used
* as a fallback. Resolving custom providers via `getProviderConfig` picks up its
* case-insensitive fallback for normalized provider names (e.g. `openrouter` →
* `OpenRouter`). Defaults to `immediate`.
*/
declare function resolveTitleTiming({
  appConfig,
  endpoint
}: {
  appConfig?: AppConfig;
  endpoint?: string | Array<string | undefined>;
}): TitleTiming;
/**
* Result from getProviderConfig
*/
interface ProviderConfigResult {
  /** The initialization function for this provider */
  getOptions: InitializeFn;
  /** The resolved provider name (may be different from input if normalized) */
  overrideProvider: string;
  /** Custom endpoint configuration (if applicable) */
  customEndpointConfig?: Partial<TEndpoint>;
}
/**
* Get the provider configuration and override endpoint based on the provider string
*
* @param params - Configuration parameters
* @param params.provider - The provider string
* @param params.appConfig - The application configuration
* @returns Provider configuration including getOptions function, override provider, and custom config
* @throws Error if provider is not supported
*/
declare function getProviderConfig({
  provider,
  appConfig
}: {
  provider: string;
  appConfig?: AppConfig;
}): ProviderConfigResult;
//#endregion
//#region src/endpoints/custom/config.d.ts
/**
* Load config endpoints from the cached configuration object
* @param customEndpointsConfig - The configuration object
*/
declare function loadCustomEndpointsConfig(customEndpoints?: TCustomEndpoints): TCustomEndpointsConfig | undefined;
//#endregion
//#region src/endpoints/custom/initialize.d.ts
/**
* Cache key for an endpoint's fetched token config. User-scoped when the
* model fetch can resolve per-user: user-provided key/URL, or header
* templates forwarded against an admin-trusted base URL — making the
* response, and therefore the derived token config, user-specific. Otherwise
* tenant-scoped when a tenant id is available because custom endpoint config
* is resolved per tenant.
*/
declare function getTokenConfigKey(endpointConfig: Partial<TEndpoint>, endpoint: string, userId: string, tenantId?: string | null): string;
/**
* Initializes a custom endpoint client configuration.
* This function handles custom endpoints defined in librechat.yaml, including
* user-provided API keys and URLs.
*
* @param params - Configuration parameters
* @returns Promise resolving to endpoint configuration options
* @throws Error if config is missing, API key is not provided, or base URL is missing
*/
declare function initializeCustom({
  req,
  endpoint,
  model_parameters,
  db
}: BaseInitializeParams): Promise<InitializeResultBase>;
//#endregion
//#region src/endpoints/google/llm.d.ts
/** Known Google/Vertex AI parameters that map directly to the client config */
declare const knownGoogleParams: Set<string>;
declare function getSafetySettings(model?: string): Array<{
  category: string;
  threshold: string;
}> | undefined;
/**
* Replicates core logic from GoogleClient's constructor and setOptions, plus client determination.
* Returns an object with the provider label and the final options that would be passed to createLLM.
*
* @param credentials - Either a JSON string or an object containing Google keys
* @param options - The same shape as the "GoogleClient" constructor options
*/
declare function getGoogleConfig(credentials: string | GoogleCredentials | undefined, options?: GoogleConfigOptions, acceptRawApiKey?: boolean): {
  /** @type {GoogleAIToolType[]} */tools: GoogleAIToolType[]; /** @type {Providers.GOOGLE | Providers.VERTEXAI} */
  provider: Providers.VERTEXAI | Providers.GOOGLE; /** @type {GoogleClientOptions | VertexAIClientOptions} */
  llmConfig: VertexAIClientOptions$1 | GoogleClientOptions;
};
//#endregion
//#region src/endpoints/google/initialize.d.ts
/**
* Initializes Google/Vertex AI endpoint configuration.
* Supports both API key authentication and service account credentials.
*
* @param params - Configuration parameters
* @returns Promise resolving to Google configuration options
* @throws Error if no valid credentials are provided
*/
declare function initializeGoogle({
  req,
  endpoint,
  model_parameters,
  db
}: BaseInitializeParams): Promise<InitializeResultBase>;
//#endregion
//#region src/endpoints/google/youtube.d.ts
/**
* Native YouTube -> Gemini video-understanding support for the Google `url_context` param.
*
* The Gemini URL Context tool does NOT support YouTube as a content type; YouTube must be
* passed as a video part (`fileData.fileUri`) via the video-understanding path. When
* `url_context` is enabled we detect YouTube URLs in the user's message and inject them as
* `{ type: 'media', fileUri }` content blocks, which the `@librechat/agents` Google content
* formatter converts into `fileData` parts. All other URLs keep flowing through the native
* `urlContext` tool.
*/
/** Per-message cap on auto-injected YouTube video parts for Gemini 2.5+ (the API allows up to 10). */
declare const DEFAULT_MAX_YOUTUBE_PARTS = 5;
/** A Gemini video-understanding content block (becomes a `fileData` part downstream). */
interface YouTubeVideoPart {
  type: "media";
  /**
  * Always present as a key so the agents `messageContentMedia` `'mimeType' in content` guard
  * passes. The Gemini Developer API omits it for YouTube (value `undefined`, dropped on JSON
  * serialization); Vertex samples set `video/mp4`.
  */
  mimeType?: string;
  fileUri: string;
}
/**
* Resolves provider/model-aware YouTube injection limits.
* - Vertex: every Vertex sample sets a `video/mp4` mimeType on YouTube fileData, and Vertex is
*   capped conservatively at a single YouTube URL per request.
* - Gemini Developer API: omits the mimeType; 2.5+ models accept multiple videos, earlier ones one.
*/
declare function resolveYouTubeInjectionConfig(params: {
  provider?: string;
  model?: string;
}): {
  max: number;
  mimeType?: string;
};
/**
* Extracts YouTube URLs from text, normalized to canonical `watch?v=<id>` form, de-duplicated
* by video id (first occurrence wins), and capped at `max` (default {@link DEFAULT_MAX_YOUTUBE_PARTS}).
*/
declare function extractYouTubeUrls(text?: string | null, max?: number): string[];
/** True when the resolved provider tool list contains the native Google `urlContext` tool. */
declare function hasUrlContextTool(tools: unknown): boolean;
/**
* Appends YouTube video parts to a message's content when `url_context` is enabled, and removes
* the matched YouTube URLs from the prompt text so the `urlContext` tool (which reads URLs from
* the text and cannot fetch YouTube) does not spend its URL budget on them. Non-YouTube URLs are
* left intact for the tool. No-ops when disabled, when no YouTube URLs are found, or when every
* URL is already present as a media part. A string content is upgraded to a parts array only when
* something is added.
*/
declare function appendYouTubeVideoParts(params: {
  enabled: boolean;
  text?: string | null;
  content: string | MessageContentComplex[];
  max?: number;
  mimeType?: string;
}): string | MessageContentComplex[];
//#endregion
//#region src/endpoints/openai/llm.d.ts
declare const knownOpenAIParams: Set<string>;
/**
* Extracts default parameters from customParams.paramDefinitions
* @param paramDefinitions - Array of parameter definitions with key and default values
* @returns Record of default parameters
*/
declare function extractDefaultParams(paramDefinitions?: Partial<SettingDefinition>[]): Record<string, unknown> | undefined;
/**
* Applies default parameters to the target object only if the field is undefined
* @param target - The target object to apply defaults to
* @param defaults - Record of default parameter values
*/
declare function applyDefaultParams(target: Record<string, unknown>, defaults: Record<string, unknown>): void;
declare function getOpenAILLMConfig({
  azure,
  apiKey,
  baseURL,
  endpoint,
  streaming,
  addParams,
  dropParams,
  defaultParams,
  useOpenRouter,
  reasoningFormat,
  modelOptions: _modelOptions
}: {
  apiKey: string;
  streaming: boolean;
  baseURL?: string | null;
  endpoint?: EModelEndpoint | string | null;
  modelOptions: Partial<OpenAIParameters>;
  addParams?: Record<string, unknown>;
  dropParams?: string[];
  defaultParams?: Record<string, unknown>;
  useOpenRouter?: boolean;
  reasoningFormat?: ReasoningParameterFormat;
  azure?: false | AzureOptions;
}): Pick<LLMConfigResult, "llmConfig" | "tools"> & {
  azure?: AzureOptions;
};
//#endregion
//#region src/endpoints/openai/config.d.ts
/**
* Generates configuration options for creating a language model (LLM) instance.
* @param apiKey - The API key for authentication.
* @param options - Additional options for configuring the LLM.
* @param endpoint - The endpoint name
* @returns Configuration options for creating an LLM instance.
*/
declare function getOpenAIConfig(apiKey: string, options?: OpenAIConfigOptions, endpoint?: string | null): OpenAIConfigResult;
//#endregion
//#region src/endpoints/openai/initialize.d.ts
/**
* Initializes OpenAI options for agent usage. This function always returns configuration
* options and never creates a client instance (equivalent to optionsOnly=true behavior).
*
* @param params - Configuration parameters
* @returns Promise resolving to OpenAI configuration options
* @throws Error if API key is missing or user key has expired
*/
declare function initializeOpenAI({
  req,
  endpoint,
  model_parameters,
  db
}: BaseInitializeParams): Promise<InitializeResultBase>;
//#endregion
//#region src/endpoints/pricing.d.ts
interface TokenomicsDeps {
  getValueKey: TxMethods["getValueKey"];
  getMultiplier: TxMethods["getMultiplier"];
  getCacheMultiplier: TxMethods["getCacheMultiplier"];
}
interface TokenConfigParams {
  /** endpoint → model list, from the resolved models config */
  modelsConfig: TModelsConfig;
  /** Per-endpoint overrides: fetched (e.g. OpenRouter) or yaml `tokenConfig` */
  endpointTokenConfigs?: Record<string, EndpointTokenConfig | undefined>;
  /** Include USD-per-1M rates; gated by `interface.contextCost` */
  includePricing?: boolean;
}
/**
* Resolves context windows (and optionally pricing) for every configured
* model, server-side, so the client never reimplements pattern matching.
*/
declare function buildTokenConfigMap(params: TokenConfigParams, deps: TokenomicsDeps): TTokenConfigMap;
//#endregion
//#region src/endpoints/projection.d.ts
interface ProjectionMessage {
  messageId: string;
  parentMessageId?: string | null;
  tokenCount?: number;
  isCreatedByUser?: boolean;
  text?: string;
  /** Quoted excerpts merged into the model-facing text by the live path; must be
  *  included here so the context gauge counts the same prompt the model sees. */
  quotes?: string[];
  /** Compaction marker written by the live path (`agents/usage.ts`); its
  *  presence means the next call sends the summary + tail, not this raw chain. */
  metadata?: {
    summaryUsedTokens?: number;
  };
}
interface ProjectionMessageFilter {
  conversationId: string;
  user?: string;
  messageId?: string | {
    $in: string[];
  };
}
interface ProjectionMessageQueryOptions {
  limit?: number;
  sort?: false;
}
interface ProjectionMessageTextStats {
  messageId: string;
  textBytes: number;
  quoteCount: number;
  quoteBytes: number;
  quoteLineCount: number;
  nonStringQuoteCount: number;
}
interface ProjectionMessageTextStatsOptions {
  limit?: number;
}
interface ContextProjectionDeps {
  /** Authenticated requester — branch lookups are scoped to this user. */
  userId?: string;
  getMessages: (filter: ProjectionMessageFilter, select?: string, options?: ProjectionMessageQueryOptions) => Promise<ProjectionMessage[]>;
  getMessageTextStats: (filter: ProjectionMessageFilter, options?: ProjectionMessageTextStatsOptions) => Promise<ProjectionMessageTextStats[]>;
}
/**
* Server-side context-usage projection: reconstructs the viewed branch and asks
* the agents SDK what the next call's context would be, WITHOUT invoking the
* model. Provider/model/window come from the (client-resolved) request — no
* agent or model-spec config is loaded here, so there is no cross-user config
* exposure. Reuses LibreChat's already-calibrated per-message `tokenCount`s (no
* re-tokenizing). Returns null when there is no resolvable context window.
* NOTE: this first cut targets message-windowing accuracy — instruction and
* tool-schema tokens (agent instructions, `promptPrefix`, model-spec presets,
* tool schemas) are NOT yet included; a follow-up will reuse the full
* `initializeAgent`/send path for exact overhead and proper access control.
*/
declare function resolveContextProjection(deps: ContextProjectionDeps, params: TContextProjectionRequest): Promise<TContextUsageEvent | null>;
//#endregion
//#region src/endpoints/tokenConfig.d.ts
interface ResolveTokenConfigParams {
  appConfig?: AppConfig;
  /** endpoint → model list, from the resolved models config */
  modelsConfig: TModelsConfig;
  userId: string;
  tenantId?: string | null;
}
/**
* Server-side token-config resolution for the `/endpoints/token-config`
* route. Gathers each custom endpoint's override — a static yaml `tokenConfig`
* or the cached fetched config — then resolves context windows (and pricing,
* when `interface.contextCost` is enabled) via {@link buildTokenConfigMap}.
* Lives in TypeScript so the `/api` controller stays a thin wrapper.
*/
declare function resolveTokenConfigMap({
  appConfig,
  modelsConfig,
  userId,
  tenantId
}: ResolveTokenConfigParams, deps: TokenomicsDeps): Promise<TTokenConfigMap>;
//#endregion
//#region src/files/agents/auth.d.ts
type AgentUploadAuthResult = {
  allowed: true;
} | {
  allowed: false;
  status: number;
  error: string;
  message: string;
};
interface AgentUploadAuthParams {
  userId: string;
  userRole: string;
  agentId?: string;
  toolResource?: string | null;
  messageFile?: boolean | string;
}
interface AgentUploadAuthDeps {
  getAgent: (params: {
    id: string;
  }) => Promise<{
    _id: string | Types.ObjectId;
    author?: string | Types.ObjectId | null;
  } | null>;
  checkPermission: (params: {
    userId: string;
    role: string;
    resourceType: ResourceType;
    resourceId: string | Types.ObjectId;
    requiredPermission: number;
  }) => Promise<boolean>;
}
declare function checkAgentUploadAuth(params: AgentUploadAuthParams, deps: AgentUploadAuthDeps): Promise<AgentUploadAuthResult>;
/** @returns true if denied (response already sent), false if allowed */
declare function verifyAgentUploadPermission({
  req,
  res,
  metadata,
  getAgent,
  checkPermission
}: {
  req: ServerRequest;
  res: Response$1;
  metadata: {
    agent_id?: string;
    tool_resource?: string | null;
    message_file?: boolean | string;
  };
  getAgent: AgentUploadAuthDeps["getAgent"];
  checkPermission: AgentUploadAuthDeps["checkPermission"];
}): Promise<boolean>;
//#endregion
//#region src/files/audio.d.ts
/**
* Processes audio files using Speech-to-Text (STT) service.
* @returns A promise that resolves to an object containing text and bytes.
*/
declare function processAudioFile({
  req,
  file,
  sttService
}: {
  req: ServerRequest;
  file: FileObject;
  sttService: STTService;
}): Promise<AudioProcessingResult>;
//#endregion
//#region src/files/code/classify.d.ts
type CodeArtifactCategory = "utf8-text" | "document" | "pptx" | "other";
/**
* Decide how to render a file produced by the code-execution sandbox.
* Extension wins over MIME for code/text files because content sniffing tends
* to label `.py`/`.json`/`.csv` as `application/octet-stream`.
*/
declare function classifyCodeArtifact(name: string, mimeType: string): CodeArtifactCategory;
//#endregion
//#region src/files/code/extract.d.ts
declare const MAX_TEXT_CACHE_BYTES: number;
/**
* Resolve the inline-preview extraction ceiling from
* `FILE_PREVIEW_MAX_EXTRACT_BYTES`, falling back to the 2 MB default when
* the value is missing, non-numeric, or non-positive. Raising it lets
* larger documents render an inline preview; the rendered HTML is still
* independently capped at {@link MAX_TEXT_CACHE_BYTES} (512 KB), so
* image-heavy files over that show the "too large" banner instead.
*/
declare function resolveMaxTextExtractBytes(value: string | undefined): number;
declare const MAX_TEXT_EXTRACT_BYTES: number;
/**
* Decide whether a buffer is a candidate for rich HTML preview. Wraps the
* shared `officeHtmlBucket` predicate from `~/files/documents/html` so the
* gate here stays in lock-step with what the dispatcher will actually
* route — including extensionless office files identified solely by MIME
* (e.g. a tool emitting `data` with `text/csv`, which would otherwise
* classify as `utf8-text`, skip the office gate, and ship raw CSV text
* to the client's SPREADSHEET bucket that expects full HTML).
*
* Exported so `processCodeOutput`'s deferred-preview flow can decide
* whether to mark a freshly-persisted file record as `status:
* 'pending'` (preview expected later) or skip the status field
* entirely (no preview ever expected).
*/
declare const hasOfficeHtmlPath: (name: string, mimeType: string) => boolean;
/**
* Classify the format of a string returned by `extractCodeArtifactText`
* so callers can persist it alongside the text and the client can gate
* "inject into iframe as HTML" on a trusted signal. Returns:
*   - `'html'` when the file went down the office-HTML producer path
*     (output is a complete sanitized HTML document)
*   - `'text'` for everything else (utf8 plain text, parseDocument
*     output for PDF/ODT, etc.)
*   - `null` when there's no text to format (caller should also skip
*     setting `textFormat` on the record)
*
* Inference is by extension/MIME via `officeHtmlBucket`, mirroring the
* dispatch logic inside `extractCodeArtifactText` exactly. Keeping the
* inference at the caller (rather than baking format into the
* extractor's return type) avoids breaking the existing function
* signature and its 30+ tests, while still giving downstream consumers
* a definitive trust signal.
*/
declare function getExtractedTextFormat(name: string, mimeType: string, text: string | null): "html" | "text" | null;
/**
* Extract a string representation of a code-execution artifact for inline
* rendering. Returns `null` for binary, oversized, or unsupported files; the
* caller should fall back to the standard download UI in that case.
*
* Office types (docx, xlsx/xls/ods, csv, pptx) are rendered as sanitized
* HTML by the producers in `~/files/documents/html`. The frontend feeds the
* HTML into the Sandpack `static` template via `index.html`. CSV is special-
* cased here — its category is `utf8-text` (raw CSV is text), but we want
* the styled-table preview when the file extension says CSV.
*
* - office (docx/xlsx/xls/ods/csv/pptx): sanitized HTML preview
* - utf8-text: decodes the buffer (with a binary safety net)
* - document: dispatches to the existing PDF/ODT parser
* - other: returns null (binary file, no inline preview)
*/
declare function extractCodeArtifactText(buffer: Buffer, name: string, mimeType: string, category: CodeArtifactCategory): Promise<string | null>;
//#endregion
//#region src/files/code/form.d.ts
interface CodeEnvFileOptions {
  filename: string;
  filepath?: string;
}
/**
* Uses `filepath` for nested names because `form-data` strips directories from
* the bare string filename overload before codeapi can preserve safe paths.
*/
declare function getCodeEnvFileOptions(filename: string): CodeEnvFileOptions;
declare function appendCodeEnvFile(form: FormData, stream: NodeJS.ReadableStream, filename: string): void;
//#endregion
//#region src/files/code/identity.d.ts
/**
* Resource identity required by codeapi's sessionKey resolver. The
* shape is symmetric across the upload form fields and the URL query
* params on download/freshness routes — codeapi normalizes both into
* the same `parseUploadSessionKeyInput`. Validation rules (closed
* kind set, `version` required for `'skill'` and forbidden otherwise)
* mirror codeapi's validator so a bad caller fails fast on the client
* instead of round-tripping a 400. See codeapi #1455 / Phase C.
*
* `id` is sessionKey-meaningful for `'skill'` / `'agent'` and
* informational-only for `'user'` (codeapi resolves user identity
* from auth context). It's required uniformly here for shape
* consistency with the runtime validator.
*/
interface CodeEnvIdentity {
  kind: CodeEnvKind;
  id: string;
  /** Required when `kind === 'skill'`; forbidden otherwise. */
  version?: number;
}
/**
* Append `kind`/`id`/`version?` form fields to a multipart upload.
* Used by `uploadCodeEnvFile` and `batchUploadCodeEnvFiles` so codeapi
* can route the upload to the correct sessionKey bucket
* (`<tenant>:<kind>:<id>[:v:<version>]` for shared kinds,
* `<tenant>:user:<authContext.userId>` for `'user'`).
*
* Mutates the form in place and throws synchronously on bad input.
*/
declare function appendCodeEnvFileIdentity(form: FormData, identity: CodeEnvIdentity): void;
/**
* Build the `?kind=...&id=...&version=...` query string codeapi's
* `sessionAuth` middleware requires on `/download/<session>/<file>`
* and `/sessions/<session>/objects/<file>` URLs. Without these,
* codeapi 400s with "kind must be one of: skill, agent, user" before
* serving the file.
*
* Returns a string with leading `?`; concatenate onto a path.
*/
declare function buildCodeEnvDownloadQuery(identity: CodeEnvIdentity): string;
//#endregion
//#region src/files/context.d.ts
/**
* Extracts text context from attachments and returns formatted text.
* This handles text that was already extracted from files (OCR, transcriptions, document text, etc.)
* @param params - The parameters object
* @param params.attachments - Array of file attachments
* @param params.req - Express request object for config access
* @param params.tokenCountFn - Function to count tokens in text
* @returns The formatted file context text, or undefined if no text found
*/
declare function extractFileContext({
  attachments,
  req,
  tokenCountFn
}: {
  attachments: IMongoFile[];
  req?: ServerRequest;
  tokenCountFn: TokenCountFn;
}): Promise<string | undefined>;
//#endregion
//#region src/files/documents/crud.d.ts
/**
* Parses an uploaded document and extracts its text content and metadata.
* Handled types must stay in sync with `documentParserMimeTypes` from data-provider.
*
* @throws {Error} if `file.mimetype` is not handled, file exceeds size limit, or no text is found.
*/
declare function parseDocument({
  file
}: {
  file: Express.Multer.File;
}): Promise<MistralOCRUploadResult>;
//#endregion
//#region src/files/encode/audio.d.ts
/**
* Encodes and formats audio files for different providers
* @param req - The request object
* @param files - Array of audio files
* @param params - Object containing provider and optional endpoint
* @param params.provider - The provider to format for (currently only google is supported)
* @param params.endpoint - Optional endpoint name for file config lookup
* @param getStrategyFunctions - Function to get strategy functions
* @returns Promise that resolves to audio and file metadata
*/
declare function encodeAndFormatAudios(req: ServerRequest, files: IMongoFile[], params: {
  provider: Providers;
  endpoint?: string;
}, getStrategyFunctions: (source: string) => StrategyFunctions): Promise<AudioResult>;
//#endregion
//#region src/files/encode/document.d.ts
/**
* Encodes and formats document files for various providers.
*
* Callers are responsible for pre-filtering `files` to types the endpoint accepts
* (e.g., via `supportedMimeTypes` in `processAttachments`). This function processes
* every file it receives and dispatches to the appropriate provider format:
* - **Bedrock**: Only encodes types in `bedrockDocumentFormats`; all others are skipped.
* - **PDF**: Validated via `validatePdf` before encoding.
* - **Generic types**: Encoded with a provider-specific size check.
*/
declare function encodeAndFormatDocuments(req: ServerRequest, files: IMongoFile[], params: {
  provider: Providers;
  endpoint?: string;
  useResponsesApi?: boolean;
  model?: string;
}, getStrategyFunctions: (source: string) => StrategyFunctions): Promise<DocumentResult>;
//#endregion
//#region src/files/encode/video.d.ts
/**
* Encodes and formats video files for different providers
* @param req - The request object
* @param files - Array of video files
* @param params - Object containing provider and optional endpoint
* @param params.provider - The provider to format for
* @param params.endpoint - Optional endpoint name for file config lookup
* @param getStrategyFunctions - Function to get strategy functions
* @returns Promise that resolves to videos and file metadata
*/
declare function encodeAndFormatVideos(req: ServerRequest, files: IMongoFile[], params: {
  provider: Providers;
  endpoint?: string;
}, getStrategyFunctions: (source: string) => StrategyFunctions): Promise<VideoResult>;
//#endregion
//#region src/files/filter.d.ts
/**
* Filters out files based on endpoint configuration including:
* - Disabled status
* - File size limits
* - MIME type restrictions
* - Total size limits
* @param req - The server request object containing config
* @param params - Object containing files, endpoint, and endpointType
* @param params.files - Array of processed file documents from MongoDB
* @param params.endpoint - The endpoint name to check configuration for
* @param params.endpointType - The endpoint type to check configuration for
* @returns Filtered array of files
*/
declare function filterFilesByEndpointConfig(req: ServerRequest, params: {
  files: IMongoFile[] | undefined;
  endpoint?: string | null;
  endpointType?: string | null;
}): IMongoFile[];
//#endregion
//#region src/files/mistral/crud.d.ts
/** Helper type for OCR request context */
interface OCRContext {
  req: ServerRequest;
  file: Express.Multer.File;
  loadAuthValues: (params: {
    userId: string;
    authFields: string[];
    optional?: Set<string>;
  }) => Promise<Record<string, string | undefined>>;
}
/**
* Uploads a document to Mistral API using file streaming to avoid loading the entire file into memory
* @param params Upload parameters
* @param params.filePath The path to the file on disk
* @param params.fileName Optional filename to use (defaults to the name from filePath)
* @param params.apiKey Mistral API key
* @param params.baseURL Mistral API base URL
* @returns The response from Mistral API
*/
declare function uploadDocumentToMistral({
  apiKey,
  filePath,
  baseURL,
  fileName
}: {
  apiKey: string;
  filePath: string;
  baseURL?: string;
  fileName?: string;
}): Promise<MistralFileUploadResponse>;
declare function getSignedUrl({
  apiKey,
  fileId,
  expiry,
  baseURL
}: {
  apiKey: string;
  fileId: string;
  expiry?: number;
  baseURL?: string;
}): Promise<MistralSignedUrlResponse>;
/**
* @param {Object} params
* @param {string} params.apiKey
* @param {string} params.url - The document or image URL
* @param {string} [params.documentType='document_url'] - 'document_url' or 'image_url'
* @param {string} [params.model]
* @param {string} [params.baseURL]
* @returns {Promise<OCRResult>}
*/
declare function performOCR({
  url,
  apiKey,
  model,
  baseURL,
  documentType
}: {
  url: string;
  apiKey: string;
  model?: string;
  baseURL?: string;
  documentType?: "document_url" | "image_url";
}): Promise<OCRResult>;
/**
* Deletes a file from Mistral API
* @param params Delete parameters
* @param params.fileId The file ID to delete
* @param params.apiKey Mistral API key
* @param params.baseURL Mistral API base URL
* @returns Promise that resolves when the file is deleted
*/
declare function deleteMistralFile({
  fileId,
  apiKey,
  baseURL
}: {
  fileId: string;
  apiKey: string;
  baseURL?: string;
}): Promise<void>;
/**
* Uploads a file to the Mistral OCR API and processes the OCR result.
*
* @param params - The params object.
* @param params.req - The request object from Express. It should have a `user` property with an `id`
*                       representing the user
* @param params.file - The file object, which is part of the request. The file object should
*                                     have a `mimetype` property that tells us the file type
* @param params.loadAuthValues - Function to load authentication values
* @returns - The result object containing the processed `text` and `images` (not currently used),
*                       along with the `filename` and `bytes` properties.
*/
declare const uploadMistralOCR: (context: OCRContext) => Promise<MistralOCRUploadResult>;
/**
* Use Azure Mistral OCR API to processe the OCR result.
*
* @param params - The params object.
* @param params.req - The request object from Express. It should have a `user` property with an `id`
*                       representing the user
* @param params.appConfig - Application configuration object
* @param params.file - The file object, which is part of the request. The file object should
*                                     have a `mimetype` property that tells us the file type
* @param params.loadAuthValues - Function to load authentication values
* @returns - The result object containing the processed `text` and `images` (not currently used),
*                       along with the `filename` and `bytes` properties.
*/
declare const uploadAzureMistralOCR: (context: OCRContext) => Promise<MistralOCRUploadResult>;
/**
* Use Google Vertex AI Mistral OCR API to process the OCR result.
*
* @param params - The params object.
* @param params.req - The request object from Express. It should have a `user` property with an `id`
*                       representing the user
* @param params.appConfig - Application configuration object
* @param params.file - The file object, which is part of the request. The file object should
*                                     have a `mimetype` property that tells us the file type
* @param params.loadAuthValues - Function to load authentication values
* @returns - The result object containing the processed `text` and `images` (not currently used),
*                       along with the `filename` and `bytes` properties.
*/
declare const uploadGoogleVertexMistralOCR: (context: OCRContext) => Promise<MistralOCRUploadResult>;
//#endregion
//#region src/files/ocr.d.ts
declare function loadOCRConfig(config?: TCustomConfig["ocr"]): TCustomConfig["ocr"] | undefined;
//#endregion
//#region src/files/parse.d.ts
/**
* Extracts the image basename from a given URL.
*
* @param urlString - The URL string from which the image basename is to be extracted.
* @returns The basename of the image file from the URL.
* Returns an empty string if the URL does not contain a valid image basename.
*/
declare function getImageBasename(urlString: string): string;
/**
* Extracts the basename of a file from a given URL.
*
* @param urlString - The URL string from which the file basename is to be extracted.
* @returns The basename of the file from the URL.
* Returns an empty string if the URL parsing fails.
*/
declare function getFileBasename(urlString: string): string;
//#endregion
//#region src/files/rag.d.ts
interface DeleteRagFileParams {
  /** The user ID. Required for authentication. If not provided, the function returns false and logs an error. */
  userId: string;
  /** The file object. Must have `embedded` and `file_id` properties. */
  file: {
    file_id: string;
    embedded?: boolean;
  };
}
/**
* Deletes embedded document(s) from the RAG API.
* This is a shared utility function used by all file storage strategies
* (S3, Azure, Firebase, Local) to delete RAG embeddings when a file is deleted.
*
* @param params - The parameters object.
* @param params.userId - The user ID for authentication.
* @param params.file - The file object. Must have `embedded` and `file_id` properties.
* @returns Returns true if deletion was successful or skipped, false if there was an error.
*/
declare function deleteRagFile({
  userId,
  file
}: DeleteRagFileParams): Promise<boolean>;
//#endregion
//#region src/files/retention.d.ts
type InterfaceConfig = AppConfig["interfaceConfig"];
type RetentionConversation = {
  expiredAt?: Date | string | number | null;
};
type RetentionRequest = {
  user?: {
    id?: string;
    tenantId?: string;
  };
  body?: {
    conversationId?: string;
    isTemporary?: boolean | string | null;
  };
  config?: {
    interfaceConfig?: InterfaceConfig;
  };
};
type RetentionExpiry = {
  expiredAt?: Date | null;
};
type AgentFileRetentionRequest = {
  req: RetentionRequest | null | undefined;
  messageAttachment?: boolean | null;
  toolResource?: string | null;
};
type RetentionLogger = {
  error: (message: string, error?: unknown) => void;
};
type RetentionDependencies = {
  getConvo: (userId: string, conversationId: string) => Promise<RetentionConversation | null | undefined>;
  createExpirationDate: (interfaceConfig?: InterfaceConfig) => Date;
  logger?: RetentionLogger;
};
type SharedLinkRetentionDependencies = {
  getConvo: (userId: string, conversationId: string) => Promise<RetentionConversation | null | undefined>;
  createExpirationDate: (interfaceConfig?: InterfaceConfig) => Date;
  logger?: RetentionLogger;
};
declare const isBooleanOrStringTrue: (value: unknown) => boolean;
declare const getConversationExpirationDate: (convo?: RetentionConversation | null) => Date | null;
declare const isActiveExpirationDate: (expiredAt: Date, now?: Date) => boolean;
declare function getRetentionExpiry(req: RetentionRequest | null | undefined, dependencies: RetentionDependencies): Promise<RetentionExpiry>;
declare function getAgentFileRetentionExpiry(params: AgentFileRetentionRequest, dependencies: RetentionDependencies): Promise<RetentionExpiry>;
/**
* Resolves the retention deadline for a shared link derived from a conversation.
*
* Return values are intentionally tri-state:
* - `undefined`: no decision can be made because the conversation id or row is missing.
* - `null`: the share should be stored without an expiration.
* - `Date`: the share should expire at that date; callers reject already-expired dates.
*/
declare function getSharedLinkExpiration({
  req,
  conversationId
}: {
  req: RetentionRequest | null | undefined;
  conversationId?: string | null;
}, dependencies: SharedLinkRetentionDependencies): Promise<Date | null | undefined>;
declare const createMinimalRetentionRequest: (req?: RetentionRequest | null) => RetentionRequest | undefined;
//#endregion
//#region src/files/sweep.d.ts
type ExpiredFile = {
  file_id: string;
  source?: string;
  user?: string | {
    toString?: () => string;
  };
  tenantId?: string;
};
type SweepRequest = {
  baseUrl: string;
  originalUrl: string;
  path: string;
  method: string;
  headers: Record<string, unknown>;
  query: Record<string, unknown>;
  params: Record<string, unknown>;
  config?: AppConfig;
  body: {
    endpoint: string;
    version: string;
  };
  user: {
    id: string;
    tenantId?: string;
  };
};
type SweepLogger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string, error?: unknown) => void;
};
type SweepDependencies = {
  getExpiredFiles: (limit: number) => Promise<ExpiredFile[] | null | undefined>;
  processDeleteRequest: (params: {
    req: SweepRequest;
    files: ExpiredFile[];
  }) => Promise<{
    deletedFileIds: string[];
    failedFileIds: string[];
  }>;
  logger: SweepLogger;
};
type StartSweepDependencies = {
  sweepExpiredFiles: (options?: ExpiredFileSweepOptions) => Promise<ExpiredFileSweepResult>;
  runAsSystem: <T>(fn: () => Promise<T>) => Promise<T>;
  logger: SweepLogger;
};
type ExpiredFileSweepOptions = {
  appConfig?: AppConfig;
  limit?: number;
  loadAppConfig?: () => Promise<AppConfig | undefined>;
};
type ExpiredFileSweepResult = {
  scanned: number;
  deleted: number;
  failed: number;
};
declare function getFileRetentionSweepInterval(interval?: string | undefined): number;
declare function getExpiredFileEndpoint(source?: string): string;
declare function hasExpiredFileEndpointConfig(appConfig: AppConfig | undefined, source?: string): boolean;
declare function getConfiguredExpiredFileAssistantVersion({
  appConfig,
  source,
  endpoint
}: {
  appConfig?: AppConfig;
  source?: string;
  endpoint: string;
}): unknown;
declare function getExpiredFileAssistantVersion({
  appConfig,
  source,
  endpoint
}: {
  appConfig?: AppConfig;
  source?: string;
  endpoint: string;
}): string;
declare function createExpiredFileSweepRequest({
  appConfig,
  file,
  userId
}: {
  appConfig?: AppConfig;
  file: ExpiredFile;
  userId: string;
}): SweepRequest;
declare function resolveExpiredFileSweepConfig({
  appConfig,
  file,
  loadAppConfig
}: {
  appConfig?: AppConfig;
  file: ExpiredFile;
  loadAppConfig?: () => Promise<AppConfig | undefined>;
}): Promise<AppConfig | undefined>;
declare function sweepExpiredFiles({
  appConfig,
  limit,
  loadAppConfig
}: ExpiredFileSweepOptions | undefined, {
  getExpiredFiles,
  processDeleteRequest,
  logger
}: SweepDependencies): Promise<ExpiredFileSweepResult>;
declare function startExpiredFileSweep(options: ExpiredFileSweepOptions | undefined, {
  sweepExpiredFiles,
  runAsSystem,
  logger
}: StartSweepDependencies): NodeJS.Timeout | null;
//#endregion
//#region src/files/validation.d.ts
interface ValidationResult {
  isValid: boolean;
  error?: string;
}
interface PDFValidationResult {
  isValid: boolean;
  error?: string;
}
interface VideoValidationResult {
  isValid: boolean;
  error?: string;
}
interface AudioValidationResult {
  isValid: boolean;
  error?: string;
}
interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}
declare function validatePdf(pdfBuffer: Buffer, fileSize: number, provider: Providers, configuredFileSizeLimit?: number, model?: string): Promise<PDFValidationResult>;
/**
* Validates a document against Bedrock size limits. The default limit is 4.5 MB,
* but Claude 4+ (PDF) and Nova (PDF/DOCX) models are exempt per AWS docs.
* When exempt, falls back to a 32 MB request-level limit as a reasonable upper bound.
* @param fileSize - The file size in bytes
* @param mimeType - The MIME type of the document
* @param fileBuffer - The file buffer (used for PDF header validation)
* @param configuredFileSizeLimit - Optional configured file size limit from fileConfig (in bytes)
* @param model - Optional Bedrock model identifier for model-specific limit exceptions
* @returns Promise that resolves to validation result
*/
declare function validateBedrockDocument(fileSize: number, mimeType: string, fileBuffer?: Buffer, configuredFileSizeLimit?: number, model?: string): Promise<ValidationResult>;
/**
* Validates video files for different providers
* @param videoBuffer - The video file as a buffer
* @param fileSize - The file size in bytes
* @param provider - The provider to validate for
* @param configuredFileSizeLimit - Optional configured file size limit from fileConfig (in bytes)
* @returns Promise that resolves to validation result
*/
declare function validateVideo(videoBuffer: Buffer, fileSize: number, provider: Providers, configuredFileSizeLimit?: number): Promise<VideoValidationResult>;
/**
* Validates audio files for different providers
* @param audioBuffer - The audio file as a buffer
* @param fileSize - The file size in bytes
* @param provider - The provider to validate for
* @param configuredFileSizeLimit - Optional configured file size limit from fileConfig (in bytes)
* @returns Promise that resolves to validation result
*/
declare function validateAudio(audioBuffer: Buffer, fileSize: number, provider: Providers, configuredFileSizeLimit?: number): Promise<AudioValidationResult>;
/**
* Validates image files for different providers
* @param imageBuffer - The image file as a buffer
* @param fileSize - The file size in bytes
* @param provider - The provider to validate for
* @param configuredFileSizeLimit - Optional configured file size limit from fileConfig (in bytes)
* @returns Promise that resolves to validation result
*/
declare function validateImage(imageBuffer: Buffer, fileSize: number, provider: Providers | string, configuredFileSizeLimit?: number): Promise<ImageValidationResult>;
//#endregion
//#region src/files/text.d.ts
/**
* Attempts to parse text using RAG API, falls back to native text parsing
* @param params - The parameters object
* @param params.req - The Express request object
* @param params.file - The uploaded file
* @param params.file_id - The file ID
* @returns
*/
declare function parseText({
  req,
  file,
  file_id
}: {
  req: ServerRequest;
  file: Express.Multer.File;
  file_id: string;
}): Promise<{
  text: string;
  bytes: number;
  source: string;
}>;
/**
* Native JavaScript text parsing fallback
* Simple text file reading - complex formats handled by RAG API
* @param file - The uploaded file
* @returns
*/
declare function parseTextNative(file: Express.Multer.File): Promise<{
  text: string;
  bytes: number;
  source: string;
}>;
//#endregion
//#region src/storage/cloudfront/crud.d.ts
interface CloudFrontURLParams extends GetURLParams {
  sign?: boolean;
}
/**
* Get CloudFront URL for a file.
* @param sign - If true, returns a signed URL. Caller (strategy) decides based on config.
*/
declare function getCloudFrontURL({
  userId,
  fileName,
  basePath,
  tenantId,
  storageRegion,
  includeRegionInPath,
  useInlinePath,
  sign
}: CloudFrontURLParams): Promise<string>;
/** Save buffer to S3 and return CloudFront URL. */
declare function saveBufferToCloudFront(params: SaveBufferParams & {
  sign?: boolean;
}): Promise<string>;
/** Save file from URL to S3 and return CloudFront URL. */
declare function saveURLToCloudFront(params: SaveURLParams & {
  sign?: boolean;
}): Promise<string>;
/** Save file from URL to S3 and return CloudFront URL with fetched metadata. */
declare function saveURLToCloudFrontWithMetadata(params: SaveURLParams & {
  sign?: boolean;
}): Promise<SaveURLResult>;
/** Upload file to S3 and return CloudFront URL. */
declare function uploadFileToCloudFront(params: UploadFileParams & {
  sign?: boolean;
}): Promise<UploadResult>;
/** Delete file from S3 and optionally invalidate CloudFront cache. */
declare function deleteFileFromCloudFront(req: ServerRequest, file: TFile): Promise<void>;
/** Get file stream from S3 storage. */
declare function getCloudFrontFileStream(req: ServerRequest, filePath: string): Promise<Readable>;
/** Get a signed CloudFront URL for an authorized file download. */
declare function getCloudFrontDownloadURL({
  file,
  customFilename,
  contentType
}: DownloadURLParams): Promise<string>;
//#endregion
//#region src/storage/s3/crud.d.ts
interface S3KeyBase {
  basePath: string;
  userId: string;
  fileName: string;
  includeRegionInPath?: boolean;
  useInlinePath?: boolean;
}
interface S3KeyParts extends S3KeyBase {
  storageRegion?: string;
  tenantId?: string;
  inlinePathPrefix?: string;
}
interface S3KeyOptions extends S3KeyBase {
  tenantId?: string | null;
  storageRegion?: string | null;
}
declare function getS3Key(options: S3KeyOptions): string;
declare function getS3Key(basePath: string, userId: string, fileName: string, tenantId?: string | null): string;
declare const parseS3Key: (key: string) => S3KeyParts | null;
declare function getStorageMetadataForKey(key: string): Pick<SaveURLResult, "storageKey" | "storageRegion">;
declare function resolveStoredS3Key(file: Pick<TFile, "filepath"> & {
  storageKey?: string | null;
}): string;
declare function getS3URL({
  userId,
  fileName,
  basePath,
  customFilename,
  contentType,
  tenantId,
  storageRegion,
  includeRegionInPath,
  useInlinePath
}: GetURLParams): Promise<string>;
declare function saveBufferToS3({
  userId,
  buffer,
  fileName,
  basePath,
  tenantId,
  storageRegion,
  includeRegionInPath,
  useInlinePath,
  urlBuilder
}: SaveBufferParams & {
  urlBuilder?: UrlBuilder;
}): Promise<string>;
declare function saveURLToS3WithMetadata({
  userId,
  URL,
  fileName,
  basePath,
  tenantId,
  storageRegion,
  includeRegionInPath,
  useInlinePath,
  urlBuilder
}: SaveURLParams & {
  urlBuilder?: UrlBuilder;
}): Promise<SaveURLResult>;
declare function saveURLToS3(params: SaveURLParams & {
  urlBuilder?: UrlBuilder;
}): Promise<string>;
declare function extractKeyFromS3Url(fileUrlOrKey: string): string;
declare function deleteFileFromS3(req: ServerRequest, file: TFile): Promise<void>;
declare function uploadFileToS3({
  req,
  file,
  file_id,
  basePath,
  tenantId,
  storageRegion,
  includeRegionInPath,
  useInlinePath,
  urlBuilder
}: UploadFileParams & {
  urlBuilder?: UrlBuilder;
}): Promise<UploadResult>;
declare function getS3FileStream(_req: ServerRequest, filePath: string): Promise<Readable>;
declare function getS3DownloadURL({
  file,
  customFilename,
  contentType
}: DownloadURLParams): Promise<string>;
declare function needsRefresh(signedUrl: string, bufferSeconds: number): boolean;
declare function getNewS3URL(currentURL: string, storageKey?: string | null): Promise<string | undefined>;
declare function refreshS3FileUrls(files: TFile[] | null | undefined, batchUpdateFiles: BatchUpdateFn, bufferSeconds?: number): Promise<TFile[]>;
declare function refreshS3Url$1(fileObj: S3FileRef, bufferSeconds?: number): Promise<string>;
//#endregion
//#region src/storage/images.d.ts
interface ImageServiceDeps {
  resizeImageBuffer: (buffer: Buffer, resolution: string, endpoint: string) => Promise<{
    buffer: Buffer;
    width: number;
    height: number;
  }>;
  updateUser: (userId: string, update: {
    avatar: string;
  }) => Promise<IUser | null>;
  updateFile: (params: {
    file_id: string;
  }) => Promise<TFile>;
}
interface ImageServiceConfig {
  /** If true, appends ?manual=... to avatar URLs (Firebase/Azure behavior) */
  appendManualParam?: boolean;
}
/**
* Unified image service for cloud storage strategies.
* Handles image uploads, URL preparation, and avatar processing
* via an injected `saveBuffer` function, enabling any storage backend
* (S3, CloudFront, Azure, Firebase, etc.) without subclassing.
*/
declare class ImageService {
  private saveBuffer;
  private deps;
  private config;
  /**
  * @param saveBuffer - Strategy-specific function that persists a buffer and returns a download URL.
  * @param deps - External dependencies (resize, user/file update callbacks).
  * @param config - Optional per-strategy configuration.
  */
  constructor(saveBuffer: SaveBufferFn, deps: ImageServiceDeps, config?: ImageServiceConfig);
  /**
  * Resizes, converts, and uploads an image file to cloud storage.
  * Deletes the local temp file after a successful upload.
  */
  uploadImage({
    req,
    file,
    file_id,
    endpoint,
    resolution,
    basePath
  }: UploadImageParams): Promise<ImageUploadResult>;
  prepareImageURL(file: {
    file_id: string;
    filepath: string;
  }): Promise<[TFile, string]>;
  /**
  * Processes and uploads an avatar image.
  * Detects GIF vs PNG, generates a timestamped filename, and optionally
  * persists the URL to the user record when `manual` is `'true'`.
  */
  processAvatar({
    buffer,
    userId,
    manual,
    agentId,
    basePath,
    tenantId
  }: ProcessAvatarParams): Promise<string>;
}
//#endregion
//#region src/storage/avatar.d.ts
type AvatarConfig = {
  fileStrategy?: string | null;
  fileStrategies?: {
    avatar?: string | null;
    default?: string | null;
  } | null;
} | null | undefined;
/**
* Resolves the storage strategy used for avatars. `fallbackStrategy` is usually
* `process.env.CDN_PROVIDER`; undefined is valid and falls back to local storage.
*/
declare function getAvatarFileStrategy(appConfig: AvatarConfig, fallbackStrategy?: string | null): string;
declare function getAvatarSaveParams<T extends SaveBufferParams>(fileStrategy: string, params: T): T;
//#endregion
//#region src/storage/metadata.d.ts
type StorageMetadataInput = {
  filepath?: string | null;
  source?: string | null;
  storageKey?: string | null;
  storageRegion?: string | null;
};
declare function getStorageMetadata({
  filepath,
  source,
  storageKey,
  storageRegion
}: StorageMetadataInput): Pick<SaveURLResult, "storageKey" | "storageRegion">;
//#endregion
//#region src/tools/format.d.ts
/**
* Filters out duplicate plugins from the list of plugins.
*
* @param plugins The list of plugins to filter.
* @returns The list of plugins with duplicates removed.
*/
declare const filterUniquePlugins: (plugins?: TPlugin[]) => TPlugin[];
/**
* Determines if a plugin is authenticated by checking if all required authentication fields have non-empty values.
* Supports alternate authentication fields, allowing validation against multiple possible environment variables.
*
* @param plugin The plugin object containing the authentication configuration.
* @returns True if the plugin is authenticated for all required fields, false otherwise.
*/
declare const checkPluginAuth: (plugin?: TPlugin) => boolean;
/**
* @param toolkits
* @param toolName
* @returns toolKey
*/
declare function getToolkitKey({
  toolkits,
  toolName
}: {
  toolkits: TPlugin[];
  toolName?: string;
}): string | undefined;
//#endregion
//#region src/tools/registry/definitions.d.ts
/** Extended JSON Schema type that includes standard validation keywords */
type ExtendedJsonSchema = {
  type?: "string" | "number" | "integer" | "float" | "boolean" | "array" | "object" | "null";
  enum?: (string | number | boolean | null)[];
  items?: ExtendedJsonSchema;
  properties?: Record<string, ExtendedJsonSchema>;
  required?: string[];
  description?: string;
  additionalProperties?: boolean | ExtendedJsonSchema;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
  pattern?: string;
  format?: string;
  default?: unknown;
  const?: unknown;
  oneOf?: ExtendedJsonSchema[];
  anyOf?: ExtendedJsonSchema[];
  allOf?: ExtendedJsonSchema[];
  $ref?: string;
  $defs?: Record<string, ExtendedJsonSchema>;
  definitions?: Record<string, ExtendedJsonSchema>;
};
interface ToolRegistryDefinition {
  name: string;
  description: string;
  schema: ExtendedJsonSchema;
  description_for_model?: string;
  responseFormat?: "content_and_artifact" | "content";
  toolType: "builtin" | "mcp" | "action" | "custom";
}
/** Google Search tool JSON schema */
declare const googleSearchSchema: ExtendedJsonSchema;
/** DALL-E 3 tool JSON schema */
declare const dalle3Schema: ExtendedJsonSchema;
/** Flux API tool JSON schema */
declare const fluxApiSchema: ExtendedJsonSchema;
/** OpenWeather tool JSON schema */
declare const openWeatherSchema: ExtendedJsonSchema;
/** Wolfram Alpha tool JSON schema */
declare const wolframSchema: ExtendedJsonSchema;
/** Stable Diffusion tool JSON schema */
declare const stableDiffusionSchema: ExtendedJsonSchema;
/** Azure AI Search tool JSON schema */
declare const azureAISearchSchema: ExtendedJsonSchema;
/** Traversaal Search tool JSON schema */
declare const traversaalSearchSchema: ExtendedJsonSchema;
/** Tavily Search Results tool JSON schema */
declare const tavilySearchSchema: ExtendedJsonSchema;
/** File Search tool JSON schema */
declare const fileSearchSchema: ExtendedJsonSchema;
/** Tool definitions registry - maps tool names to their definitions */
declare const toolDefinitions: Record<string, ToolRegistryDefinition>;
declare function getToolDefinition(toolName: string): ToolRegistryDefinition | undefined;
declare function getAllToolDefinitions(): ToolRegistryDefinition[];
declare function getToolSchema(toolName: string): ExtendedJsonSchema | undefined;
//#endregion
//#region src/tools/toolkits/gemini.d.ts
declare const geminiToolkit: {
  readonly gemini_image_gen: {
    readonly name: "gemini_image_gen";
    readonly description: string;
    readonly description_for_model: "Use this tool to generate images from text descriptions using Vertex AI Gemini.\n1. Prompts should be detailed and specific for best results.\n2. One image per function call. Create only 1 image per request.\n3. IMPORTANT: When user asks to \"edit\", \"modify\", \"change\", or \"swap\" elements in an existing image:\n   - ALWAYS include the original image ID in the image_ids array\n   - Describe the desired changes clearly in the prompt\n   - The tool will generate a new image based on the original image context + your prompt\n4. IMPORTANT: For editing requests, use DIRECT editing instructions:\n   - User says \"remove the gun\" → prompt should be \"remove the gun from this image\"\n   - User says \"make it blue\" → prompt should be \"make this image blue\"\n   - User says \"add sunglasses\" → prompt should be \"add sunglasses to this image\"\n   - DO NOT reconstruct or modify the original prompt - use the user's editing instruction directly\n   - ALWAYS include the image being edited in image_ids array\n5. OPTIONAL: Use image_ids to provide context images that will influence the generation:\n   - Include any relevant image IDs from the conversation in the image_ids array\n   - These images will be used as visual context/inspiration for the new generation\n   - For \"editing\" requests, always include the image being \"edited\"\n6. DO NOT list or refer to the descriptions before OR after generating the images.\n7. Always mention the image type (photo, oil painting, watercolor painting, illustration, cartoon, drawing, vector, render, etc.) at the beginning of the prompt.\n8. Use aspectRatio to control the shape of the image:\n   - 16:9 or 3:2 for landscape/wide images\n   - 9:16 or 2:3 for portrait/tall images\n   - 21:9 for ultra-wide/cinematic images\n   - 1:1 for square images (default)\n9. Use imageSize to control the resolution: 1K (standard), 2K (high), 4K (maximum quality).\n\nThe prompt should be a detailed paragraph describing every part of the image in concrete, objective detail.";
    readonly schema: ExtendedJsonSchema;
    readonly responseFormat: "content_and_artifact";
  };
};
type GeminiToolkit = typeof geminiToolkit;
//#endregion
//#region src/tools/toolkits/imageContext.d.ts
/**
* Builds tool context string for image generation tools based on available image files.
* @param params - The parameters for building image context
* @param params.imageFiles - Array of image file objects with file_id property
* @param params.toolName - The name of the tool (e.g., 'gemini_image_gen', 'image_edit_oai')
* @param params.contextDescription - Description of what the images are for (e.g., 'image context', 'image editing')
* @returns The tool context string or empty string if no images
*/
declare function buildImageToolContext({
  imageFiles,
  toolName,
  contextDescription
}: {
  imageFiles: Array<{
    file_id: string;
  }>;
  toolName: string;
  contextDescription?: string;
}): string;
//#endregion
//#region src/tools/toolkits/mapping.d.ts
/**
* Maps toolkit keys to additional tool names they contain.
* When a toolkit key appears in an agent's tool list,
* these extra tools should also be included.
*/
declare const toolkitExpansion: {
  readonly image_gen_oai: readonly ["image_edit_oai"];
};
/** Reverse mapping: maps child tool names to their parent toolkit key */
declare const toolkitParent: Readonly<Record<string, string>>;
//#endregion
//#region src/tools/toolkits/oai.d.ts
declare const oaiToolkit: {
  readonly image_gen_oai: {
    readonly name: "image_gen_oai";
    readonly description: string;
    readonly schema: ExtendedJsonSchema;
    readonly responseFormat: "content_and_artifact";
  };
  readonly image_edit_oai: {
    readonly name: "image_edit_oai";
    readonly description: string;
    readonly schema: ExtendedJsonSchema;
    readonly responseFormat: "content_and_artifact";
  };
};
//#endregion
//#region src/tools/toolkits/web.d.ts
/** Builds the web search tool context with citation format instructions. */
declare function buildWebSearchContext(): string;
/** Builds dynamic web search context scoped to the conversation anchor time. */
declare function buildWebSearchDynamicContext(now?: string | number | Date): string;
//#endregion
//#region src/tools/classification.d.ts
interface ToolDefinition {
  name: string;
  description?: string;
  parameters?: JsonSchemaType;
  /** MCP server name extracted from tool name */
  serverName?: string;
}
/**
* Extracts the MCP server name from a tool name.
* Tool names follow the pattern: toolName_mcp_ServerName
* @param toolName - The full tool name
* @returns The server name or undefined if not an MCP tool
*/
declare function getServerNameFromTool(toolName: string): string | undefined;
/**
* Builds a tool registry from agent-level tool_options.
*
* @param tools - Array of tool definitions
* @param agentToolOptions - Per-tool configuration from the agent
* @returns Map of tool name to tool definition with classification
*/
declare function buildToolRegistryFromAgentOptions(tools: ToolDefinition[], agentToolOptions: AgentToolOptions): LCToolRegistry;
interface MCPToolInstance {
  name: string;
  description?: string;
  mcp?: boolean;
  /** Original JSON schema attached at MCP tool creation time */
  mcpJsonSchema?: JsonSchemaType;
}
/**
* Extracts MCP tool definition from a loaded tool instance.
* MCP tools have the original JSON schema attached as `mcpJsonSchema` property.
*
* @param tool - The loaded tool instance
* @returns Tool definition
*/
declare function extractMCPToolDefinition(tool: MCPToolInstance): ToolDefinition;
/**
* Checks if a tool is an MCP tool based on its properties.
* @param tool - The tool to check (can be any object with potential mcp property)
* @returns Whether the tool is an MCP tool
*/
declare function isMCPTool(tool: unknown): tool is MCPToolInstance;
/**
* Cleans up the temporary mcpJsonSchema property from MCP tools after registry is populated.
* This property is only needed during registry building and can be safely removed afterward.
*
* @param tools - Array of tools to clean up
*/
declare function cleanupMCPToolSchemas(tools: MCPToolInstance[]): void;
/** Parameters for building tool classification and creating PTC/tool search tools */
interface BuildToolClassificationParams {
  /** All loaded tools (will be filtered for MCP tools) */
  loadedTools: GenericTool[];
  /** User ID for auth lookup */
  userId: string;
  /** Agent ID (used for logging and context) */
  agentId?: string;
  /** Per-tool configuration from the agent */
  agentToolOptions?: AgentToolOptions;
  /** Whether the deferred_tools capability is enabled (from agent config) */
  deferredToolsEnabled?: boolean;
  /** Whether the programmatic_tools capability is enabled (from agent config) */
  programmaticToolsEnabled?: boolean;
  /** Whether code execution is enabled and requested by this agent */
  codeExecutionEnabled?: boolean;
  /** When true, skip creating tool instances (for event-driven mode) */
  definitionsOnly?: boolean;
  /** Optional host-supplied Code API auth headers for remote programmatic execution. */
  authHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
}
/** Result from building tool classification */
interface BuildToolClassificationResult {
  /** Tool registry built from MCP tools (undefined if no MCP tools) */
  toolRegistry?: LCToolRegistry;
  /** Tool definitions array for event-driven execution (built simultaneously with registry) */
  toolDefinitions: LCTool[];
  /** Additional tools created (PTC and/or tool search) */
  additionalTools: GenericTool[];
  /** Whether any tools have defer_loading enabled (precomputed for efficiency) */
  hasDeferredTools: boolean;
}
/**
* Checks if an agent's tools have any that match PTC patterns (programmatic only or dual context).
* @param toolRegistry - The tool registry to check
* @returns Whether any tools are configured for programmatic calling
*/
declare function agentHasProgrammaticTools(toolRegistry: LCToolRegistry): boolean;
/**
* Checks if an agent's tools have any that are deferred.
* @param toolRegistry - The tool registry to check
* @returns Whether any tools are configured as deferred
*/
declare function agentHasDeferredTools(toolRegistry: LCToolRegistry): boolean;
/**
* Builds the tool registry from MCP tools and conditionally creates PTC and tool search tools.
*
* This function:
* 1. Filters loaded tools for MCP tools
* 2. Extracts tool definitions and builds the registry from agent's tool_options
* 3. Cleans up temporary mcpJsonSchema properties
* 4. Creates PTC tool only if capabilities allow the agent's programmatic tools
* 5. Creates tool search tool only if agent has deferred tools
*
* @param params - Parameters including loaded tools, userId, agentId, agentToolOptions, and dependencies
* @returns Tool registry and any additional tools created
*/
declare function buildToolClassification(params: BuildToolClassificationParams): Promise<BuildToolClassificationResult>;
//#endregion
//#region src/tools/definitions.d.ts
interface MCPServerTool {
  function?: {
    name?: string;
    description?: string;
    parameters?: JsonSchemaType$2;
  };
}
type MCPServerTools = Record<string, MCPServerTool>;
interface LoadToolDefinitionsParams {
  /** User ID for MCP server tool lookup */
  userId: string;
  /** Agent ID for tool classification */
  agentId: string;
  /** Agent's tool list (tool names/identifiers) */
  tools: string[];
  /** Agent-specific tool options */
  toolOptions?: AgentToolOptions;
  /** Whether deferred tools feature is enabled */
  deferredToolsEnabled?: boolean;
  /** Whether programmatic tool calling is enabled */
  programmaticToolsEnabled?: boolean;
  /** Whether code execution is enabled and requested by this agent */
  codeExecutionEnabled?: boolean;
  /** Agent provider — Gemini/Vertex tool schemas get union-flattened for compatibility */
  provider?: Providers;
}
interface ActionToolDefinition {
  name: string;
  description?: string;
  parameters?: JsonSchemaType$2;
}
interface LoadToolDefinitionsDeps {
  /** Gets MCP server tools - first checks cache, then initializes server if needed */
  getOrFetchMCPServerTools: (userId: string, serverName: string) => Promise<MCPServerTools | null>;
  /** Checks if a tool name is a known built-in tool */
  isBuiltInTool: (toolName: string) => boolean;
  /** Loads action tool definitions (schemas) from OpenAPI specs */
  getActionToolDefinitions?: (agentId: string, actionToolNames: string[]) => Promise<ActionToolDefinition[]>;
}
interface LoadToolDefinitionsResult {
  toolDefinitions: (ToolDefinition | LCTool$1)[];
  toolRegistry: LCToolRegistry$1;
  hasDeferredTools: boolean;
}
/**
* Loads tool definitions without creating tool instances.
* This is the efficient path for event-driven mode where tools are loaded on-demand.
*/
declare function loadToolDefinitions(params: LoadToolDefinitionsParams, deps: LoadToolDefinitionsDeps): Promise<LoadToolDefinitionsResult>;
//#endregion
//#region src/web/web.d.ts
declare function extractWebSearchEnvVars({
  keys,
  config
}: {
  keys: TWebSearchKeys[];
  config: TCustomConfig["webSearch"] | undefined;
}): string[];
/**
* Type for web search authentication result
*/
interface WebSearchAuthResult {
  /** Whether all required categories have at least one authenticated service */
  authenticated: boolean;
  /** Authentication type (user_provided or system_defined) by category */
  authTypes: [TWebSearchCategories, AuthType][];
  /** Original authentication values mapped to their respective keys */
  authResult: Partial<TWebSearchConfig>;
}
/**
* Loads and verifies web search authentication values
* @param params - Authentication parameters
* @returns Authentication result
*/
declare function loadWebSearchAuth({
  userId,
  webSearchConfig,
  loadAuthValues,
  throwError
}: {
  userId: string;
  webSearchConfig: TCustomConfig["webSearch"];
  loadAuthValues: (params: {
    userId: string;
    authFields: string[];
    optional?: Set<string>;
    throwError?: boolean;
  }) => Promise<Record<string, string>>;
  throwError?: boolean;
}): Promise<WebSearchAuthResult>;
//#endregion
//#region src/langfuse/feedback.d.ts
type LangfuseFeedback = {
  rating?: "thumbsUp" | "thumbsDown";
  tag?: string;
  text?: string;
};
type LangfuseFeedbackMetadata = Record<string, string | number | boolean | null | undefined>;
type SendFeedbackScoreParams = {
  traceId: string;
  feedback?: LangfuseFeedback | null;
  metadata?: LangfuseFeedbackMetadata;
  observationId?: string;
};
declare function sendFeedbackScore({
  traceId,
  feedback,
  metadata,
  observationId
}: SendFeedbackScoreParams): Promise<void>;
//#endregion
//#region src/langfuse/trace.d.ts
declare function traceIdForMessage(messageId: string): string;
//#endregion
//#region src/cache/cacheConfig.d.ts
declare const cacheConfig: {
  FORCED_IN_MEMORY_CACHE_NAMESPACES: string[];
  USE_REDIS: boolean;
  USE_REDIS_STREAMS: boolean;
  REDIS_URI: string | undefined;
  REDIS_USERNAME: string | undefined;
  REDIS_PASSWORD: string | undefined;
  REDIS_CA: string | null;
  REDIS_KEY_PREFIX: string;
  GLOBAL_PREFIX_SEPARATOR: string;
  REDIS_MAX_LISTENERS: number;
  REDIS_PING_INTERVAL: number; /** Max delay between reconnection attempts in ms */
  REDIS_RETRY_MAX_DELAY: number; /** Max number of reconnection attempts (0 = infinite) */
  REDIS_RETRY_MAX_ATTEMPTS: number; /** Connection timeout in ms */
  REDIS_CONNECT_TIMEOUT: number; /** Queue commands when disconnected */
  REDIS_ENABLE_OFFLINE_QUEUE: boolean;
  /** flag to modify redis connection by adding dnsLookup this is required when connecting to elasticache for ioredis
  * see "Special Note: Aws Elasticache Clusters with TLS" on this webpage:  https://www.npmjs.com/package/ioredis **/
  REDIS_USE_ALTERNATIVE_DNS_LOOKUP: boolean; /** Enable redis cluster without the need of multiple URIs */
  USE_REDIS_CLUSTER: boolean;
  /**
  * Force cluster-safe (key-by-key) deletion even when connecting as a single-node Redis instance.
  * Needed for managed services like ElastiCache Serverless that present a single endpoint
  * but shard keys internally, causing CROSSSLOT errors on multi-key DEL commands.
  * Has no effect when USE_REDIS_CLUSTER is already true.
  */
  REDIS_CLUSTER_SAFE_DELETE: boolean;
  CI: boolean;
  DEBUG_MEMORY_CACHE: boolean;
  BAN_DURATION: number;
  /**
  * Number of keys to delete in each batch during Redis DEL operations.
  * In cluster mode, keys are deleted individually in parallel chunks to avoid CROSSSLOT errors.
  * In single-node mode, keys are deleted in batches using DEL with arrays.
  * Lower values reduce memory usage but increase number of Redis calls.
  * @default 1000
  */
  REDIS_DELETE_CHUNK_SIZE: number;
  /**
  * Number of keys to update in each batch during Redis SET operations.
  * In cluster mode, keys are updated individually in parallel chunks to avoid CROSSSLOT errors.
  * In single-node mode, keys are updated in batches using transactions (multi/exec).
  * Lower values reduce memory usage but increase number of Redis calls.
  * @default 1000
  */
  REDIS_UPDATE_CHUNK_SIZE: number;
  /**
  * COUNT hint for Redis SCAN operations when scanning keys by pattern.
  * This is a hint to Redis about how many keys to scan in each iteration.
  * Higher values can reduce round trips but increase memory usage and latency per call.
  * Note: Redis may return more or fewer keys than this count depending on internal heuristics.
  * @default 1000
  */
  REDIS_SCAN_COUNT: number;
  /**
  * TTL in milliseconds for MCP registry caches. Used by both:
  * - `MCPServersRegistry` read-through caches (`readThroughCache`/`readThroughCacheAll`)
  * - `ServerConfigsCacheRedisAggregateKey` local snapshot (avoids redundant Redis GETs)
  *
  * Both layers use this value, so the effective max cross-instance staleness is up
  * to 2× this value in multi-instance deployments. Set to 0 to disable the local
  * snapshot entirely (every `getAll()` hits Redis directly).
  * @default 5000 (5 seconds)
  */
  MCP_REGISTRY_CACHE_TTL: number;
};
//#endregion
//#region src/cache/redisClients.d.ts
declare let ioredisClient: Redis | Cluster | null;
declare let keyvRedisClient: RedisClientType | RedisClusterType | null;
declare let keyvRedisClientReady: Promise<void> | Promise<RedisClientType<Record<string, never>, Record<string, never>, Record<string, never>>> | null;
//#endregion
//#region src/cache/keyvFiles.d.ts
declare const logFile: KeyvFile;
declare const violationFile: KeyvFile;
//#endregion
//#region src/cache/keyvMongo.d.ts
interface KeyvMongoOptions {
  url?: string;
  collection?: string;
  useGridFS?: boolean;
  readPreference?: ReadPreference;
}
declare class KeyvMongoCustom extends EventEmitter {
  private opts;
  ttlSupport: boolean;
  namespace?: string;
  constructor(options?: KeyvMongoOptions);
  private _getClient;
  get(key: string): Promise<unknown>;
  getMany(keys: string[]): Promise<unknown[]>;
  set(key: string, value: string, ttl?: number): Promise<unknown>;
  delete(key: string): Promise<boolean>;
  deleteMany(keys: string[]): Promise<boolean>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  disconnect(): Promise<boolean>;
  private isGridFSClient;
}
declare const keyvMongo: KeyvMongoCustom;
//#endregion
//#region src/cache/cacheFactory.d.ts
/**
* Creates a cache instance using Redis or a fallback store. Suitable for general caching needs.
*
* **In-memory mode** (no Redis, no custom fallbackStore): instances are memoized by
* namespace so that every call-site shares the same underlying `Map`. The first
* caller's TTL wins for a given namespace.
*
* @param namespace - The cache namespace.
* @param ttl - Time to live for cache entries.
* @param fallbackStore - Optional fallback store if Redis is not used.
* @returns Cache instance.
*/
declare const standardCache: (namespace: string, ttl?: number, fallbackStore?: object) => Keyv;
/** Convenience accessor for the TOKEN_CONFIG cache namespace. */
declare const tokenConfigCache: () => Keyv;
/**
* Creates a cache instance for storing violation data.
* Uses a file-based fallback store if Redis is not enabled.
* @param namespace - The cache namespace for violations.
* @param ttl - Time to live for cache entries.
* @returns Cache instance for violations.
*/
declare const violationCache: (namespace: string, ttl?: number) => Keyv;
/**
* Creates a session cache instance using Redis or in-memory store.
* @param namespace - The session namespace.
* @param ttl - Time to live for session entries.
* @returns Session store instance.
*/
declare const sessionCache: (namespace: string, ttl?: number) => MemoryStore | RedisStore$1;
/**
* Creates a rate limiter cache using Redis.
* @param prefix - The key prefix for rate limiting.
* @returns RedisStore instance or undefined if Redis is not used.
*/
declare const limiterCache: (prefix: string) => RedisStore | undefined;
//#endregion
//#region src/cache/redisUtils.d.ts
/**
* Efficiently deletes multiple Redis keys with support for both cluster and single-node modes.
*
* - Cluster mode: Deletes keys in parallel chunks to avoid CROSSSLOT errors
* - Single-node mode: Uses batch DEL commands for efficiency
*
* @param client - Redis client (node or cluster)
* @param keys - Array of keys to delete
* @param chunkSize - Optional chunk size (defaults to REDIS_DELETE_CHUNK_SIZE config)
* @returns Number of keys deleted
*
* @example
* ```typescript
* const deletedCount = await batchDeleteKeys(keyvRedisClient, ['key1', 'key2', 'key3']);
* console.log(`Deleted ${deletedCount} keys`);
* ```
*/
declare function batchDeleteKeys(client: RedisClientType | RedisClusterType, keys: string[], chunkSize?: number): Promise<number>;
/**
* Scans Redis for keys matching a pattern and collects them into an array.
* Uses Redis SCAN to avoid blocking the server.
*
* @param client - Redis client (node or cluster) with scanIterator support
* @param pattern - Pattern to match keys (e.g., 'user:*', 'session:*:active')
* @param count - Optional SCAN COUNT hint (defaults to REDIS_SCAN_COUNT config)
* @returns Array of matching keys
*
* @example
* ```typescript
* const userKeys = await scanKeys(keyvRedisClient, 'user:*');
* const sessionKeys = await scanKeys(keyvRedisClient, 'session:*:active', 500);
* ```
*/
declare function scanKeys(client: RedisClientType | RedisClusterType, pattern: string, count?: number): Promise<string[]>;
//#endregion
//#region src/acl/accessControlService.d.ts
declare class AccessControlService {
  private _dbMethods;
  constructor(mongoose: typeof import("mongoose"));
  /**
  * Grant a permission to a principal for a resource using a role
  * @param {Object} params - Parameters for granting role-based permission
  * @param {string} params.principalType - PrincipalType.USER, PrincipalType.GROUP, or PrincipalType.PUBLIC
  * @param {string|mongoose.Types.ObjectId|null} params.principalId - The ID of the principal (null for PrincipalType.PUBLIC)
  * @param {string} params.resourceType - Type of resource (e.g., 'agent')
  * @param {string|mongoose.Types.ObjectId} params.resourceId - The ID of the resource
  * @param {string} params.accessRoleId - The ID of the role (e.g., AccessRoleIds.AGENT_VIEWER, AccessRoleIds.AGENT_EDITOR)
  * @param {Types.ObjectId} params.grantedBy - User ID granting the permission
  * @param {ClientSession} [params.session] - Optional MongoDB session for transactions
  * @param {Date} [params.expiredAt] - Optional expiration for resource-tied permissions
  * @returns {Promise<IAclEntry>} The created or updated ACL entry
  */
  grantPermission(args: {
    principalType: PrincipalType;
    principalId: string | Types.ObjectId | null;
    resourceType: string;
    resourceId: string | Types.ObjectId;
    accessRoleId: AccessRoleIds;
    grantedBy?: string | Types.ObjectId;
    session?: ClientSession;
    roleId?: string | Types.ObjectId;
    expiredAt?: Date;
  }): Promise<IAclEntry | null>;
  /**
  * Find all resources of a specific type that a user has access to with specific permission bits
  * @param {Object} params - Parameters for finding accessible resources
  * @param {string | Types.ObjectId} params.userId - The ID of the user
  * @param {string} [params.role] - Optional user role (if not provided, will query from DB)
  * @param {string} params.resourceType - Type of resource (e.g., 'agent')
  * @param {number} params.requiredPermissions - The minimum permission bits required (e.g., 1 for VIEW, 3 for VIEW+EDIT)
  * @returns {Promise<Array>} Array of resource IDs
  */
  findAccessibleResources({
    userId,
    role,
    resourceType,
    requiredPermissions
  }: {
    userId: string | Types.ObjectId;
    role?: string;
    resourceType: string;
    requiredPermissions: number;
  }): Promise<Types.ObjectId[]>;
  getUserPrincipals({
    userId,
    role
  }: {
    userId: string | Types.ObjectId;
    role?: string;
  }): Promise<ResolvedPrincipal[]>;
  findAccessibleResourcesForPrincipals({
    principalsList,
    resourceType,
    requiredPermissions
  }: {
    principalsList: ResolvedPrincipal[];
    resourceType: string;
    requiredPermissions: number;
  }): Promise<Types.ObjectId[]>;
  /**
  * Find all publicly accessible resources of a specific type
  * @param {Object} params - Parameters for finding publicly accessible resources
  * @param {ResourceType} params.resourceType - Type of resource (e.g., 'agent')
  * @param {number} params.requiredPermissions - The minimum permission bits required (e.g., 1 for VIEW, 3 for VIEW+EDIT)
  * @returns {Promise<Types.ObjectId[]>} Array of resource IDs
  */
  findPubliclyAccessibleResources({
    resourceType,
    requiredPermissions
  }: {
    resourceType: ResourceType;
    requiredPermissions: number;
  }): Promise<Types.ObjectId[]>;
  /**
  * Get effective permissions for multiple resources in a batch operation
  * Returns map of resourceId → effectivePermissionBits
  *
  * @param {Object} params - Parameters
  * @param {string|mongoose.Types.ObjectId} params.userId - User ID
  * @param {string} [params.role] - User role (for group membership)
  * @param {string} params.resourceType - Resource type (must be valid ResourceType)
  * @param {Array<mongoose.Types.ObjectId>} params.resourceIds - Array of resource IDs
  * @returns {Promise<Map<string, number>>} Map of resourceId string → permission bits
  * @throws {Error} If resourceType is invalid
  */
  getResourcePermissionsMap({
    userId,
    role,
    resourceType,
    resourceIds
  }: {
    userId: string | Types.ObjectId;
    role: string;
    resourceType: ResourceType;
    resourceIds: (string | Types.ObjectId)[];
  }): Promise<Map<string, number>>;
  /**
  * Remove all permissions for a resource (cleanup when resource is deleted)
  * @param {Object} params - Parameters for removing all permissions
  * @param {string} params.resourceType - Type of resource (e.g., 'agent', 'prompt')
  * @param {string|mongoose.Types.ObjectId} params.resourceId - The ID of the resource
  * @returns {Promise<DeleteResult>} Result of the deletion operation
  */
  removeAllPermissions({
    resourceType,
    resourceId
  }: {
    resourceType: ResourceType;
    resourceId: string | Types.ObjectId;
  }): Promise<DeleteResult>;
  /**
  * Check if a user has specific permission bits on a resource
  * @param {Object} params - Parameters for checking permissions
  * @param {string|mongoose.Types.ObjectId} params.userId - The ID of the user
  * @param {string} [params.role] - Optional user role (if not provided, will query from DB)
  * @param {string} params.resourceType - Type of resource (e.g., 'agent')
  * @param {string|mongoose.Types.ObjectId} params.resourceId - The ID of the resource
  * @param {number} params.requiredPermissions - The permission bits required (e.g., 1 for VIEW, 3 for VIEW+EDIT)
  * @returns {Promise<boolean>} Whether the user has the required permission bits
  */
  checkPermission({
    userId,
    role,
    resourceType,
    resourceId,
    requiredPermission
  }: {
    userId: string;
    role?: string;
    resourceType: ResourceType;
    resourceId: string | Types.ObjectId;
    requiredPermission: number;
  }): Promise<boolean>;
  /**
  * Check if a resource has a PUBLIC AclEntry (accessible to everyone).
  * Unlike checkPermission, this does not require a user context.
  */
  hasPublicAccess({
    resourceType,
    resourceId
  }: {
    resourceType: ResourceType;
    resourceId: string | Types.ObjectId;
  }): Promise<boolean>;
  /**
  * Validates that the resourceType is one of the supported enum values
  * @param {string} resourceType - The resource type to validate
  * @throws {Error} If resourceType is not valid
  */
  private validateResourceType;
}
//#endregion
//#region src/shared-links/access.d.ts
interface SharedLinkAccessDeps {
  mongoose: typeof import("mongoose");
  aclService?: AccessControlService;
}
declare function createSharedLinkAccessMiddleware(deps: SharedLinkAccessDeps): (req: Request, res: Response$1, next: NextFunction) => Promise<void>;
//#endregion
//#region src/shared-links/service.d.ts
interface RawSharedLink {
  _id?: Types.ObjectId;
  conversationId: string;
  title?: string;
  user?: string;
  shareId?: string;
  tenantId?: string;
  isPublic?: boolean;
  expiredAt?: Date;
}
declare function autoMigrateLegacyLink(share: RawSharedLink): Promise<void>;
declare function grantCreationPermissions(sharedLinkId: string | Types.ObjectId, userId: string, grantPublic?: boolean, expiredAt?: Date | null): Promise<void>;
declare function ensureLinkPermissions(sharedLinkId: string | Types.ObjectId, userId: string): Promise<void>;
declare function cleanupSharedLinkPermissions(resourceId: string | Types.ObjectId): Promise<DeleteResult>;
declare function cleanupBulkSharedLinkPermissions(resourceIds: (string | Types.ObjectId)[]): Promise<DeleteResult>;
declare function updateSharedLinkPermissionsExpiration(resourceId: string | Types.ObjectId, expiredAt: Date | null): Promise<void>;
declare function deleteSharedLinkWithCleanup(user: string, shareId: string): Promise<{
  _id?: string;
  success: boolean;
  shareId: string;
  message: string;
} | null>;
declare function deleteConvoSharedLinksWithCleanup(user: string, conversationId: string): Promise<{
  message: string;
  deletedCount: number;
}>;
declare function deleteAllSharedLinksWithCleanup(user: string): Promise<{
  message: string;
  deletedCount: number;
}>;
//#endregion
//#region src/shared-links/config.d.ts
type SharedLinkStartupEnv = NodeJS.ProcessEnv;
/**
* Whether shared links should snapshot the files referenced by the shared chat
* snapshot. The `SHARED_LINKS_SNAPSHOT_FILES` env var overrides the yaml
* `interface.sharedLinks.snapshotFiles` value; both default to enabled.
*/
declare function isFileSnapshotEnabled(appConfig?: AppConfig): boolean;
/**
* Viewer-independent global kill switch for serving shared-link files. Reading
* and serving must NOT depend on the viewer's resolved config (per-role/user
* overrides) — only on the link's own stored choice plus this global env switch.
* Active only when `SHARED_LINKS_SNAPSHOT_FILES` is explicitly set to a disabled
* value; the creator's yaml choice is already captured per-link at share time.
*/
declare function isFileSnapshotKillSwitchActive(): boolean;
declare function buildSharedLinkStartupPayload(appConfig?: AppConfig | null, env?: SharedLinkStartupEnv): TSharedLinkStartupConfig;
//#endregion
//#region src/stream/GenerationJobManager.d.ts
/**
* Configuration options for GenerationJobManager
*/
interface GenerationJobManagerOptions {
  jobStore?: IJobStore;
  eventTransport?: IEventTransport;
  /**
  * If true, cleans up event transport immediately when job completes.
  * If false, keeps EventEmitters until periodic cleanup for late reconnections.
  * Default: true (immediate cleanup to save memory)
  */
  cleanupOnComplete?: boolean;
}
/**
* Manages generation jobs for resumable LLM streams.
*
* Architecture: Composes two pluggable services via dependency injection:
* - jobStore: Job metadata + content state (InMemory → Redis for horizontal scaling)
* - eventTransport: Pub/sub events (InMemory → Redis Pub/Sub for horizontal scaling)
*
* Content state is tied to jobs:
* - In-memory: jobStore holds WeakRef to graph for live content/run steps access
* - Redis: jobStore persists chunks, reconstructs content on demand
*
* All storage methods are async to support both in-memory and external stores (Redis, etc.).
*
* @example Redis injection:
* ```ts
* const manager = new GenerationJobManagerClass({
*   jobStore: new RedisJobStore(redisClient),
*   eventTransport: new RedisPubSubTransport(redisClient),
* });
* ```
*/
declare class GenerationJobManagerClass {
  /** Job metadata + content state storage - swappable for Redis, etc. */
  private jobStore;
  /** Event pub/sub transport - swappable for Redis Pub/Sub, etc. */
  private eventTransport;
  /** Runtime state - always in-memory, not serializable */
  private runtimeState;
  /** Jobs actively generating in this process. */
  private runningJobs;
  /** Serializes replay-event read/modify/write updates per stream. */
  private replayEventWriteQueues;
  /** Serializes token-usage read/modify/write updates per stream. */
  private tokenUsageWriteQueues;
  private cleanupInterval;
  /** Whether we're using Redis stores */
  private _isRedis;
  /** Whether to cleanup event transport immediately on job completion */
  private _cleanupOnComplete;
  constructor(options?: GenerationJobManagerOptions);
  /**
  * Initialize the job manager with periodic cleanup.
  * Call this once at application startup.
  */
  initialize(): void;
  /**
  * Configure the manager with custom stores.
  * Call this BEFORE initialize() to use Redis or other stores.
  *
  * @example Using Redis
  * ```ts
  * import { createStreamServicesFromCache } from '~/stream/createStreamServices';
  * import { cacheConfig, ioredisClient } from '~/cache';
  *
  * const services = createStreamServicesFromCache({ cacheConfig, ioredisClient });
  * GenerationJobManager.configure(services);
  * GenerationJobManager.initialize();
  * ```
  */
  configure(services: {
    jobStore: IJobStore;
    eventTransport: IEventTransport;
    isRedis?: boolean;
    cleanupOnComplete?: boolean;
  }): void;
  /**
  * Check if using Redis stores.
  */
  get isRedis(): boolean;
  private get storeLabel();
  private syncRunningJobMetrics;
  /**
  * Get the job store instance (for advanced use cases).
  */
  getJobStore(): IJobStore;
  /**
  * Create a new generation job.
  *
  * This sets up:
  * 1. Serializable job data in the job store
  * 2. Runtime state including readyPromise (resolves when first SSE client connects)
  * 3. allSubscribersLeft callback for handling client disconnections
  *
  * The readyPromise mechanism ensures generation doesn't start before the client
  * is ready to receive events. The controller awaits this promise (with a short timeout)
  * before starting LLM generation.
  *
  * @param streamId - Unique identifier for this stream
  * @param userId - User who initiated the request
  * @param conversationId - Optional conversation ID for lookup
  * @returns A facade object for the GenerationJob
  */
  createJob(streamId: string, userId: string, conversationId?: string): Promise<GenerationJob>;
  /**
  * Build a GenerationJob facade from composed services.
  *
  * This facade provides a unified API (job.emitter, job.abortController, etc.)
  * while internally delegating to the injected services (jobStore, eventTransport,
  * contentState). This allows swapping implementations (e.g., Redis) without
  * changing consumer code.
  *
  * IMPORTANT: The emitterProxy.on('allSubscribersLeft') handler registration
  * does NOT use eventTransport.subscribe(). This is intentional:
  *
  * If we used subscribe() for internal handlers, those handlers would count
  * as subscribers. When the real SSE client connects, isFirstSubscriber()
  * would return false (because internal handler was "first"), and readyPromise
  * would never resolve - causing a 5-second timeout delay before generation starts.
  *
  * Instead, allSubscribersLeft handlers are stored in runtime.allSubscribersLeftHandlers
  * and called directly from the onAllSubscribersLeft callback in createJob().
  *
  * @param streamId - The stream identifier
  * @param jobData - Serializable job metadata from job store
  * @param runtime - Non-serializable runtime state (abort controller, promises, etc.)
  * @returns A GenerationJob facade object
  */
  private buildJobFacade;
  /**
  * Get or create runtime state for a job.
  *
  * This enables cross-replica support in Redis mode:
  * - If runtime exists locally (same replica), return it
  * - If job exists in Redis but not locally (cross-replica), create minimal runtime
  *
  * The lazily-created runtime state is sufficient for:
  * - Subscribing to events (via Redis pub/sub)
  * - Getting resume state
  * - Handling reconnections
  * - Receiving cross-replica abort signals (via Redis pub/sub)
  *
  * @param streamId - The stream identifier
  * @returns Runtime state or null if job doesn't exist anywhere
  */
  private getOrCreateRuntimeState;
  /**
  * Get a job by streamId.
  */
  getJob(streamId: string): Promise<GenerationJob | undefined>;
  /**
  * Check if a job exists.
  */
  hasJob(streamId: string): Promise<boolean>;
  /**
  * Get job status.
  */
  getJobStatus(streamId: string): Promise<GenerationJobStatus | undefined>;
  /**
  * Mark job as complete.
  * If cleanupOnComplete is true (default), immediately cleans up job resources.
  * Exception: Jobs with errors are NOT immediately deleted to allow late-connecting
  * clients to receive the error (race condition where error occurs before client connects).
  * Note: eventTransport is NOT cleaned up here to allow the final event to be
  * fully transmitted. It will be cleaned up when subscribers disconnect or
  * by the periodic cleanup job.
  */
  completeJob(streamId: string, error?: string): Promise<void>;
  /**
  * Abort a job (user-initiated).
  * Returns all data needed for token spending and message saving.
  *
  * Cross-replica support (Redis mode):
  * - Emits abort signal via Redis pub/sub
  * - The replica running generation receives signal and aborts its AbortController
  */
  abortJob(streamId: string): Promise<AbortResult>;
  /**
  * Subscribe to a job's event stream.
  *
  * This is called when an SSE client connects to /chat/stream/:streamId.
  * On first subscription:
  * - Resolves readyPromise (legacy, for API compatibility)
  * - Replays any buffered early events (e.g., 'created' event)
  *
  * Supports cross-replica reconnection in Redis mode:
  * - If job exists in Redis but not locally, creates minimal runtime state
  * - Events are delivered via Redis pub/sub, not in-memory EventEmitter
  *
  * @param streamId - The stream to subscribe to
  * @param onChunk - Handler for chunk events (streamed tokens, run steps, etc.)
  * @param onDone - Handler for completion event (includes final message)
  * @param onError - Handler for error events
  * @param options - Subscription configuration
  * @param options.skipBufferReplay - When true, skips replaying the earlyEventBuffer.
  *   Use this when a sync event was already sent (resume), since the sync's
  *   aggregatedContent already includes all buffered events.
  * @returns Subscription object with unsubscribe function, or null if job not found
  */
  subscribe(streamId: string, onChunk: ChunkHandler, onDone?: DoneHandler, onError?: ErrorHandler, options?: SubscribeOptions): Promise<{
    unsubscribe: UnsubscribeFn;
  } | null>;
  /**
  * Atomic resume + subscribe: snapshots resume state and drains the early event buffer
  * in one synchronous step, then subscribes with skipBufferReplay.
  *
  * Closes the timing gap between separate `getResumeState()` and `subscribe()` calls
  * where events could arrive in earlyEventBuffer after the snapshot but before subscribe
  * clears the buffer.
  *
  * In-memory mode: drained buffer events are returned as `pendingEvents` since
  * they exist nowhere else. The caller must deliver them after the sync payload.
  * Redis mode: `pendingEvents` is empty — chunks are persisted via appendChunk
  * and will appear in aggregatedContent on the next resume.
  */
  subscribeWithResume(streamId: string, onChunk: ChunkHandler, onDone?: DoneHandler, onError?: ErrorHandler): Promise<SubscribeWithResumeResult>;
  /**
  * Emit a chunk event to all subscribers.
  * Uses runtime state check for performance (avoids async job store lookup per token).
  *
  * If no subscriber has connected yet, buffers the event for replay when they do.
  * This ensures early events (like 'created') aren't lost due to race conditions.
  *
  * In Redis mode, awaits the publish to guarantee event ordering.
  * This is critical for streaming deltas (tool args, message content) to arrive in order.
  */
  emitChunk(streamId: string, event: ServerSentEvent): Promise<void>;
  /**
  * Extract and save run step from event data.
  * The data is already the run step object from the event payload.
  */
  private saveRunStepFromEvent;
  /**
  * Accumulate run steps for a stream (Redis mode only).
  * Uses a simple in-memory buffer that gets flushed to Redis.
  * Not used in in-memory mode - run steps come from live graph via WeakRef.
  */
  private runStepBuffers;
  private accumulateRunStep;
  /**
  * Persist the last title event so resume sync can replay it. Content
  * aggregation only reconstructs message parts, so UI-only events need their
  * own metadata slot.
  */
  private trackTitleEvent;
  /**
  * Persist the latest context usage snapshot (one per model call) so a
  * resuming client can restore the context gauge without waiting for the
  * next model call.
  */
  private trackContextUsage;
  /**
  * Chains a read/modify/write job update onto the stream's queue so
  * concurrent writers can't clobber each other's merged state.
  */
  private queueJobWrite;
  /**
  * Persist replay-only stream events that are needed to reconstruct active
  * UI state on resume but are not represented by aggregated message content.
  */
  private trackReplayEvent;
  /**
  * Persist per-model-call token usage so resuming clients can rebuild
  * usage totals on any replica (the live collectedUsage array only exists
  * on the generating instance).
  */
  private trackTokenUsage;
  private persistTokenUsage;
  private persistReplayEvent;
  /**
  * Persist user message metadata from the created event.
  * Awaited in emitChunk so the HSET commits before the PUBLISH,
  * guaranteeing any cross-replica getJob() after the pub/sub window
  * finds userMessage in Redis.
  */
  private trackUserMessage;
  /**
  * Update job metadata.
  */
  updateMetadata(streamId: string, metadata: Partial<GenerationJobMetadata>): Promise<void>;
  /**
  * Set reference to the graph's contentParts array.
  */
  setContentParts(streamId: string, contentParts: Agents.MessageContentComplex[]): void;
  /**
  * Set reference to the collectedUsage array.
  * This array accumulates token usage from all models during generation.
  */
  setCollectedUsage(streamId: string, collectedUsage: UsageMetadata[]): void;
  /**
  * Set reference to the graph instance.
  */
  setGraph(streamId: string, graph: StandardGraph): void;
  /**
  * Get resume state for reconnecting clients.
  */
  getResumeState(streamId: string): Promise<ResumeState | null>;
  /**
  * Mark that sync has been sent.
  * Persists to Redis for cross-replica consistency.
  */
  markSyncSent(streamId: string): void;
  /**
  * Check if sync has been sent.
  * Checks local runtime first, then falls back to Redis for cross-replica scenarios.
  */
  wasSyncSent(streamId: string): Promise<boolean>;
  /**
  * Emit a done event.
  * Persists finalEvent to Redis for cross-replica access.
  */
  emitDone(streamId: string, event: ServerSentEvent): Promise<void>;
  /**
  * Emit an error event.
  * Stores the error for late-connecting subscribers (race condition where error
  * occurs before client connects to SSE stream).
  */
  emitError(streamId: string, error: string): Promise<void>;
  /**
  * Cleanup expired jobs.
  * Also cleans up any orphaned runtime state, buffers, and event transport entries.
  */
  private cleanup;
  /**
  * Get stream info for status endpoint.
  */
  getStreamInfo(streamId: string): Promise<{
    active: boolean;
    status: GenerationJobStatus;
    aggregatedContent?: Agents.MessageContentComplex[];
    createdAt: number;
  } | null>;
  /**
  * Get total job count.
  */
  getJobCount(): Promise<number>;
  /** Returns sizes of internal runtime maps for diagnostics */
  getRuntimeStats(): {
    runtimeStateSize: number;
    runStepBufferSize: number;
    eventTransportStreams: number;
  };
  /**
  * Get job count by status.
  */
  getJobCountByStatus(): Promise<Record<GenerationJobStatus, number>>;
  /**
  * Get active job IDs for a user.
  * Returns conversation IDs of running jobs belonging to the user.
  * Performs self-healing cleanup of stale entries.
  *
  * @param userId - The user ID to query
  * @returns Array of conversation IDs with active jobs
  */
  getActiveJobIdsForUser(userId: string, tenantId?: string): Promise<string[]>;
  /**
  * Destroy the manager.
  * Cleans up all resources including runtime state, buffers, and stores.
  */
  destroy(): Promise<void>;
}
declare const GenerationJobManager: GenerationJobManagerClass;
//#endregion
//#region src/stream/createStreamServices.d.ts
/**
* Configuration for stream services (optional overrides)
*/
interface StreamServicesConfig {
  /**
  * Override Redis detection. If not provided, uses cacheConfig.USE_REDIS.
  */
  useRedis?: boolean;
  /**
  * Override Redis client. If not provided, uses ioredisClient from cache.
  */
  redisClient?: Redis | Cluster | null;
  /**
  * Dedicated Redis client for pub/sub subscribing.
  * If not provided, will duplicate the main client.
  */
  redisSubscriber?: Redis | Cluster | null;
  /**
  * Options for in-memory job store
  */
  inMemoryOptions?: {
    ttlAfterComplete?: number;
    maxJobs?: number;
    staleJobTimeout?: number;
  };
}
/**
* Stream services result
*/
interface StreamServices {
  jobStore: IJobStore;
  eventTransport: IEventTransport;
  isRedis: boolean;
}
/**
* Create stream services (job store + event transport).
*
* Automatically detects Redis from cacheConfig.USE_REDIS_STREAMS and uses
* the existing ioredisClient. Falls back to in-memory if Redis
* is not configured or not available.
*
* USE_REDIS_STREAMS defaults to USE_REDIS if not explicitly set,
* allowing users to disable Redis for streams while keeping it for other caches.
*
* @example Auto-detect (uses cacheConfig)
* ```ts
* const services = createStreamServices();
* // Uses Redis if USE_REDIS_STREAMS=true (defaults to USE_REDIS), otherwise in-memory
* ```
*
* @example Force in-memory
* ```ts
* const services = createStreamServices({ useRedis: false });
* ```
*/
declare function createStreamServices(config?: StreamServicesConfig): StreamServices;
//#endregion
//#region src/stream/abortContent.d.ts
type PersistableAbortContentPart = Agents.MessageContentComplex | TMessageContentParts;
declare function hasPersistableAbortContent(content: unknown): boolean;
declare function filterPersistableAbortContent(content: unknown): PersistableAbortContentPart[];
//#endregion
//#region src/stream/implementations/InMemoryJobStore.d.ts
/**
* In-memory implementation of IJobStore.
* Suitable for single-instance deployments.
* For horizontal scaling, use RedisJobStore.
*
* Content state is tied to jobs:
* - Uses WeakRef to graph for live access to contentParts and contentData (run steps)
* - No chunk persistence needed - same instance handles generation and reconnects
*/
declare class InMemoryJobStore implements IJobStore {
  private jobs;
  private contentState;
  private cleanupInterval;
  /** Maps userId -> Set of streamIds (conversationIds) for active jobs */
  private userJobMap;
  /**
  * Maps streamId -> last generation-activity timestamp. Refreshed via
  * recordActivity() on each emitted chunk so the stale-job failsafe reaps on
  * inactivity (a hung generation) rather than age (a long but live stream).
  */
  private lastActivity;
  /** Time to keep completed jobs before cleanup (0 = immediate) */
  private ttlAfterComplete;
  /** Maximum number of concurrent jobs */
  private maxJobs;
  /**
  * Failsafe timeout (ms) for jobs stuck in "running" status. Mirrors
  * RedisJobStore's running-job TTL: a crashed or hung generation that never
  * reaches a terminal state would otherwise retain its content state forever,
  * leaking the full message context until the process runs out of memory.
  * 0 disables the failsafe. Default: 20 minutes.
  */
  private staleJobTimeout;
  constructor(options?: {
    ttlAfterComplete?: number;
    maxJobs?: number;
    staleJobTimeout?: number;
  });
  initialize(): Promise<void>;
  createJob(streamId: string, userId: string, conversationId?: string, tenantId?: string): Promise<SerializableJobData>;
  getJob(streamId: string): Promise<SerializableJobData | null>;
  updateJob(streamId: string, updates: Partial<SerializableJobData>): Promise<void>;
  deleteJob(streamId: string): Promise<void>;
  /**
  * Refresh a job's last-activity timestamp (called on each emitted chunk) so the
  * stale-job failsafe in cleanup() reaps on inactivity rather than total age,
  * mirroring RedisJobStore refreshing the running TTL on each appendChunk.
  */
  recordActivity(streamId: string): void;
  hasJob(streamId: string): Promise<boolean>;
  getRunningJobs(): Promise<SerializableJobData[]>;
  cleanup(): Promise<number>;
  private evictOldest;
  /** Get job count (for monitoring) */
  getJobCount(): Promise<number>;
  /** Get job count by status (for monitoring) */
  getJobCountByStatus(status: JobStatus): Promise<number>;
  destroy(): Promise<void>;
  /**
  * Get active job IDs for a user.
  * Returns conversation IDs of running jobs belonging to the user.
  * Also performs self-healing cleanup: removes stale entries for jobs that no longer exist.
  */
  getActiveJobIdsByUser(userId: string, tenantId?: string): Promise<string[]>;
  /**
  * Set the graph reference for a job.
  * Uses WeakRef to allow garbage collection when graph is no longer needed.
  */
  setGraph(streamId: string, graph: StandardGraph): void;
  /**
  * Set content parts reference for a job.
  */
  setContentParts(streamId: string, contentParts: Agents.MessageContentComplex[]): void;
  /**
  * Set collected usage reference for a job.
  */
  setCollectedUsage(streamId: string, collectedUsage: UsageMetadata[]): void;
  /**
  * Get collected usage for a job.
  */
  getCollectedUsage(streamId: string): UsageMetadata[];
  /**
  * Get content parts for a job.
  * Returns live content from stored reference.
  */
  getContentParts(streamId: string): Promise<{
    content: Agents.MessageContentComplex[];
  } | null>;
  /**
  * Get run steps for a job from graph.contentData.
  * Uses WeakRef - may return empty if graph has been GC'd.
  */
  getRunSteps(streamId: string): Promise<Agents.RunStep[]>;
  /**
  * No-op for in-memory - content available via graph reference.
  */
  appendChunk(): Promise<void>;
  /**
  * Clear content state for a job.
  */
  clearContentState(streamId: string): void;
}
//#endregion
//#region src/stream/implementations/InMemoryEventTransport.d.ts
/**
* In-memory event transport using Node.js EventEmitter.
* For horizontal scaling, replace with RedisEventTransport.
*/
declare class InMemoryEventTransport implements IEventTransport {
  private streams;
  private getOrCreateStream;
  subscribe(streamId: string, handlers: {
    onChunk: (event: unknown) => void;
    onDone?: (event: unknown) => void;
    onError?: (error: string) => void;
  }): {
    unsubscribe: () => void;
    ready?: Promise<void>;
  };
  emitChunk(streamId: string, event: unknown): void;
  emitDone(streamId: string, event: unknown): void;
  emitError(streamId: string, error: string): void;
  getSubscriberCount(streamId: string): number;
  onAllSubscribersLeft(streamId: string, callback: () => void): void;
  /**
  * Check if this is the first subscriber (for ready signaling)
  */
  isFirstSubscriber(streamId: string): boolean;
  /**
  * Cleanup a stream's event emitter
  */
  cleanup(streamId: string): void;
  /**
  * Get count of tracked streams (for monitoring)
  */
  getStreamCount(): number;
  /**
  * Get all tracked stream IDs (for orphan cleanup)
  */
  getTrackedStreamIds(): string[];
  destroy(): void;
}
//#endregion
//#region src/stream/implementations/RedisJobStore.d.ts
/**
* Redis implementation of IJobStore.
* Enables horizontal scaling with multi-instance deployments.
*
* Storage strategy:
* - Job metadata: Redis Hash (fast field access)
* - Chunks: Redis Streams (append-only, efficient for streaming)
* - Run steps: Redis String (JSON serialized)
*
* Note: streamId === conversationId, so getJob(conversationId) works directly.
*
* @example
* ```ts
* import { ioredisClient } from '~/cache';
* const store = new RedisJobStore(ioredisClient);
* await store.initialize();
* ```
*/
/**
* Configuration options for RedisJobStore
*/
interface RedisJobStoreOptions {
  /** TTL for completed jobs in seconds (default: 300 = 5 minutes) */
  completedTtl?: number;
  /** TTL for running jobs/chunks in seconds (default: 1200 = 20 minutes) */
  runningTtl?: number;
  /** TTL for chunks after completion in seconds (default: 0 = delete immediately) */
  chunksAfterCompleteTtl?: number;
  /** TTL for run steps after completion in seconds (default: 0 = delete immediately) */
  runStepsAfterCompleteTtl?: number;
  /** TTL for per-user job tracking sets in seconds (default: 86400 = 24 hours). 0 = no TTL. */
  userJobsSetTtl?: number;
}
declare class RedisJobStore implements IJobStore {
  private redis;
  private cleanupInterval;
  private ttl;
  /** Whether Redis client is in cluster mode (affects pipeline usage) */
  private isCluster;
  /**
  * Local cache for graph references on THIS instance.
  * Enables fast reconnects when client returns to the same server.
  * Uses WeakRef to allow garbage collection when graph is no longer needed.
  */
  private localGraphCache;
  /**
  * Local cache for collectedUsage arrays.
  * Generation happens on a single instance, so collectedUsage is only available locally.
  * For cross-replica abort, the abort handler falls back to text-based token counting.
  */
  private localCollectedUsageCache;
  /** Cleanup interval in ms (1 minute) */
  private cleanupIntervalMs;
  constructor(redis: Redis | Cluster, options?: RedisJobStoreOptions);
  initialize(): Promise<void>;
  createJob(streamId: string, userId: string, conversationId?: string, tenantId?: string): Promise<SerializableJobData>;
  getJob(streamId: string): Promise<SerializableJobData | null>;
  updateJob(streamId: string, updates: Partial<SerializableJobData>): Promise<void>;
  deleteJob(streamId: string): Promise<void>;
  private deleteJobInternal;
  hasJob(streamId: string): Promise<boolean>;
  getRunningJobs(): Promise<SerializableJobData[]>;
  cleanup(): Promise<number>;
  getJobCount(): Promise<number>;
  getJobCountByStatus(status: JobStatus): Promise<number>;
  /**
  * Get active job IDs for a user.
  * Returns conversation IDs of running jobs belonging to the user.
  * Also performs self-healing cleanup: removes stale entries for jobs that no longer exist.
  *
  * @param userId - The user ID to query
  * @returns Array of conversation IDs with active jobs
  */
  getActiveJobIdsByUser(userId: string, tenantId?: string): Promise<string[]>;
  destroy(): Promise<void>;
  /**
  * Store graph reference in local cache.
  * This enables fast reconnects when client returns to the same instance.
  * Falls back to Redis chunk reconstruction for cross-instance reconnects.
  *
  * @param streamId - The stream identifier
  * @param graph - The graph instance (stored as WeakRef)
  */
  setGraph(streamId: string, graph: StandardGraph): void;
  /**
  * No-op for Redis - content parts are reconstructed from chunks.
  * Metadata (agentId, groupId) is embedded directly on content parts by the agent runtime.
  */
  setContentParts(): void;
  /**
  * Store collectedUsage reference in local cache.
  * This is used for abort handling to spend tokens for all models.
  * Note: Only available on the generating instance; cross-replica abort uses fallback.
  */
  setCollectedUsage(streamId: string, collectedUsage: UsageMetadata[]): void;
  /**
  * Get collected usage for a job.
  * Only available if this is the generating instance.
  */
  getCollectedUsage(streamId: string): UsageMetadata[];
  /**
  * Get aggregated content - tries local cache first, falls back to Redis reconstruction.
  *
  * Optimization: If this instance has the live graph (same-instance reconnect),
  * we return the content directly without Redis round-trip.
  * For cross-instance reconnects, we reconstruct from Redis Streams.
  *
  * @param streamId - The stream identifier
  * @returns Content parts array or null if not found
  */
  getContentParts(streamId: string): Promise<{
    content: Agents.MessageContentComplex[];
  } | null>;
  /**
  * Get run steps - tries local cache first, falls back to Redis.
  *
  * Optimization: If this instance has the live graph, we get run steps
  * directly without Redis round-trip.
  *
  * @param streamId - The stream identifier
  * @returns Run steps array
  */
  getRunSteps(streamId: string): Promise<Agents.RunStep[]>;
  /**
  * Clear content state for a job.
  * Removes both local cache and Redis data.
  */
  clearContentState(streamId: string): void;
  /**
  * Clear content state async.
  */
  private clearContentStateAsync;
  /**
  * Append a streaming chunk to Redis Stream.
  * Uses XADD for efficient append-only storage.
  * Sets TTL on first chunk to ensure cleanup if job crashes.
  */
  appendChunk(streamId: string, event: unknown): Promise<void>;
  /**
  * Get all chunks from Redis Stream.
  */
  private getChunks;
  /**
  * Save run steps for resume state.
  */
  saveRunSteps(streamId: string, runSteps: Agents.RunStep[]): Promise<void>;
  /**
  * Create a consumer group for a stream.
  * Used to track which chunks a client has already received.
  *
  * @param streamId - The stream identifier
  * @param groupName - Unique name for the consumer group (e.g., session ID)
  * @param startFrom - Where to start reading ('0' = from beginning, '$' = only new)
  */
  createConsumerGroup(streamId: string, groupName: string, startFrom?: "0" | "$"): Promise<void>;
  /**
  * Read chunks from a consumer group (only unseen chunks).
  * This is the key to the resumable stream pattern.
  *
  * @param streamId - The stream identifier
  * @param groupName - Consumer group name
  * @param consumerName - Name of the consumer within the group
  * @param count - Maximum number of chunks to read (default: all available)
  * @returns Array of { id, event } where id is the Redis stream entry ID
  */
  readChunksFromGroup(streamId: string, groupName: string, consumerName?: string, count?: number): Promise<Array<{
    id: string;
    event: unknown;
  }>>;
  /**
  * Acknowledge that chunks have been processed.
  * This tells Redis we've successfully delivered these chunks to the client.
  *
  * @param streamId - The stream identifier
  * @param groupName - Consumer group name
  * @param messageIds - Array of Redis stream entry IDs to acknowledge
  */
  acknowledgeChunks(streamId: string, groupName: string, messageIds: string[]): Promise<void>;
  /**
  * Delete a consumer group.
  * Called when a client disconnects and won't reconnect.
  *
  * @param streamId - The stream identifier
  * @param groupName - Consumer group name to delete
  */
  deleteConsumerGroup(streamId: string, groupName: string): Promise<void>;
  /**
  * Get pending chunks for a consumer (chunks delivered but not acknowledged).
  * Useful for recovering from crashes.
  *
  * @param streamId - The stream identifier
  * @param groupName - Consumer group name
  * @param consumerName - Consumer name
  */
  getPendingChunks(streamId: string, groupName: string, consumerName?: string): Promise<Array<{
    id: string;
    event: unknown;
  }>>;
  /**
  * Serialize job data for Redis hash storage.
  * Converts complex types to strings.
  */
  private serializeJob;
  /**
  * Deserialize job data from Redis hash.
  */
  private deserializeJob;
}
//#endregion
//#region src/stream/implementations/RedisEventTransport.d.ts
/**
* Redis Pub/Sub implementation of IEventTransport.
* Enables real-time event delivery across multiple instances.
*
* Architecture (inspired by https://upstash.com/blog/resumable-llm-streams):
* - Publisher: Emits events to Redis channel when chunks arrive
* - Subscriber: Listens to Redis channel and forwards to SSE clients
* - Decoupled: Generator and consumer don't need direct connection
*
* Note: Requires TWO Redis connections - one for publishing, one for subscribing.
* This is a Redis limitation: a client in subscribe mode can't publish.
*
* @example
* ```ts
* const transport = new RedisEventTransport(publisherClient, subscriberClient);
* transport.subscribe(streamId, { onChunk: (e) => res.write(e) });
* transport.emitChunk(streamId, { text: 'Hello' });
* ```
*/
declare class RedisEventTransport implements IEventTransport {
  /** Redis client for publishing events */
  private publisher;
  /** Redis client for subscribing to events (separate connection required) */
  private subscriber;
  /** Track subscribers per stream */
  private streams;
  /** Track channel subscription state: resolved promise = active, pending = in-flight */
  private channelSubscriptions;
  /** Counter for generating unique subscriber IDs */
  private subscriberIdCounter;
  /**
  * Create a new Redis event transport.
  *
  * @param publisher - Redis client for publishing (can be shared)
  * @param subscriber - Redis client for subscribing (must be dedicated)
  */
  constructor(publisher: Redis | Cluster, subscriber: Redis | Cluster);
  /** Safety-net TTL (seconds) set once on first INCR. Not refreshed — prevents mid-stream resets. */
  private static readonly SEQUENCE_TTL_SECONDS;
  /**
  * Get next sequence number for a stream (0-indexed, backed by Redis INCR).
  * A 24-hour TTL is set on the first INCR only (val === 1) as a safety net
  * for orphaned keys from crashed processes. It is never refreshed, so an
  * active stream cannot have its counter reset mid-generation.
  * Keys are also deleted explicitly by cleanup() on normal stream teardown.
  */
  private getNextSequence;
  /** Reset subscriber reorder buffer state to initial values */
  private resetReorderBuffer;
  /**
  * Advance subscriber reorder buffer to the authoritative Redis sequence counter (cross-replica safe).
  *
  * @param earlyReplayCount - Number of events replayed from earlyEventBuffer (same-replica).
  *   Pending entries with seq < earlyReplayCount are duplicates and are pruned; entries at or
  *   above are live chunks from ongoing generation that arrived during the async GET window.
  *   Using the replay count (not the Redis counter) as the prune cutoff is critical: INCR can
  *   advance the counter past a live chunk's seq during the GET window, so currentSeq is not
  *   a safe proxy for "already delivered via earlyEventBuffer."
  *   When 0/undefined (cross-replica), all pending entries are treated as live and preserved.
  */
  syncReorderBuffer(streamId: string, earlyReplayCount?: number): Promise<void>;
  /**
  * Handle incoming pub/sub message with reordering support for Redis Cluster
  */
  private handleMessage;
  /**
  * Handle terminal events (done/error) with sequence-based ordering.
  * Buffers the terminal event and delivers after all preceding chunks arrive.
  */
  private handleTerminalEvent;
  /**
  * Handle chunk messages with sequence-based reordering.
  * Buffers out-of-order messages and delivers them in sequence.
  */
  private handleOrderedChunk;
  /** Deliver consecutive pending messages */
  private flushPendingMessages;
  /** Force-flush all pending messages in order (used on timeout or overflow) */
  private forceFlushBuffer;
  /** Schedule a timeout to force-flush if gaps aren't filled */
  private scheduleFlushTimeout;
  /** Deliver a message to all handlers */
  private deliverMessage;
  /**
  * Subscribe to events for a stream.
  *
  * On first subscriber for a stream, subscribes to the Redis channel.
  * Returns unsubscribe function that cleans up when last subscriber leaves.
  */
  subscribe(streamId: string, handlers: {
    onChunk: (event: unknown) => void;
    onDone?: (event: unknown) => void;
    onError?: (error: string) => void;
  }): {
    unsubscribe: () => void;
    ready?: Promise<void>;
  };
  /**
  * Publish a chunk event to all subscribers across all instances.
  * Includes sequence number for ordered delivery in Redis Cluster mode.
  *
  * Performance: each emit requires two sequential Redis round-trips (INCR + PUBLISH).
  * This is the unavoidable cost of cross-replica sequence coordination.
  */
  emitChunk(streamId: string, event: unknown): Promise<void>;
  /**
  * Publish a done event to all subscribers.
  * Includes sequence number to ensure delivery after all chunks.
  */
  emitDone(streamId: string, event: unknown): Promise<void>;
  /**
  * Publish an error event to all subscribers.
  * Includes sequence number to ensure delivery after all chunks.
  */
  emitError(streamId: string, error: string): Promise<void>;
  /**
  * Get subscriber count for a stream (local instance only).
  *
  * Note: In a multi-instance setup, this only returns local subscriber count.
  * For global count, would need to track in Redis (e.g., with a counter key).
  */
  getSubscriberCount(streamId: string): number;
  /**
  * Check if this is the first subscriber (local instance only).
  */
  isFirstSubscriber(streamId: string): boolean;
  /**
  * Register callback for when all subscribers leave.
  */
  onAllSubscribersLeft(streamId: string, callback: () => void): void;
  /**
  * Publish an abort signal to all replicas.
  * This enables cross-replica abort: when a user aborts on Replica B,
  * the generating Replica A receives the signal and stops.
  */
  emitAbort(streamId: string): void;
  /**
  * Register callback for abort signals from any replica.
  * Called when abort is triggered on any replica (including this one).
  *
  * @param streamId - The stream identifier
  * @param callback - Called when abort signal is received
  */
  onAbort(streamId: string, callback: () => void): void;
  /**
  * Get all tracked stream IDs (for orphan cleanup)
  */
  getTrackedStreamIds(): string[];
  /**
  * Cleanup resources for a specific stream.
  */
  cleanup(streamId: string): void;
  /**
  * Destroy all resources.
  */
  destroy(): void;
}
//#endregion
//#region src/utils/memory.d.ts
type ConnectionStats = ReturnType<InstanceType<typeof MCPManager>["getConnectionStats"]>;
type TrackerStats = ReturnType<InstanceType<typeof OAuthReconnectionManager>["getTrackerStats"]>;
type RuntimeStats = ReturnType<(typeof GenerationJobManager)["getRuntimeStats"]>;
interface MemorySnapshot {
  ts: number;
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  mcpConnections: ConnectionStats | null;
  oauthTracker: TrackerStats | null;
  generationJobs: RuntimeStats | null;
}
declare function collectSnapshot(): void;
declare function forceGC(): boolean;
declare function getSnapshots(): readonly MemorySnapshot[];
declare function start(): void;
declare function stop(): void;
declare const memoryDiagnostics: {
  start: typeof start;
  stop: typeof stop;
  forceGC: typeof forceGC;
  getSnapshots: typeof getSnapshots;
  collectSnapshot: typeof collectSnapshot;
};
//#endregion
//#region src/rum/proxy.d.ts
declare function getRumProxyClientUrl(): string;
declare function getRumProxyBodyLimit(): string;
declare function getRumProxyTimeoutMs(): number;
declare function getRumProxyTargetBaseUrl(): URL | undefined;
declare function isRumProxyEnabled(): boolean;
declare function resolveRumProxyTarget(path: string): string | undefined;
declare function proxyRumRequest(req: Request, res: Response$1): Promise<void>;
//#endregion
export { ACTION_CREDENTIAL_REFRESH_MESSAGE, ADDED_AGENT_ID, ARTIFACT_END, ARTIFACT_START, AVATAR_REFRESH_BATCH_SIZE, type AbortResult, type AccessiblePromptGroupsResult, ActionMetadataUpdateParams, ActionMetadataUpdateResult, ActionOAuthTokenDeleteQuery, ActionToolDefinition, ActionToolLike, type AddServerResult, type AdminAuditLogDeps, type AdminConfigDeps, AdminExchangeData, AdminExchangeResponse, AdminExchangeUser, type AdminGrantsDeps, type AdminGroupsDeps, AdminRefreshDeps, AdminRefreshError, AdminRefreshOptions, type AdminRolesDeps, type AdminSkillSyncAccessDeps, type AdminSkillSyncDeps, type AdminUsersDeps, AgentApiKeyService, AgentContextAttachmentCarrier, AgentContextAttachmentsByAgentId, AgentFileRetentionRequest, AgentUploadAuthDeps, AgentUploadAuthParams, AgentUploadAuthResult, AgentWithTools, AggregatedContent, type AllowedCaller, type Annotation, type AnthropicConfigOptions, type AnthropicCredentials, type AnthropicDocumentBlock, type AnthropicLLMConfigResult, type AnthropicModelOptions, type AnthropicParameters, ApiKeyAuthDependencies, ApiKeyAuthRequest, ApiKeyHandlerDependencies, ApiKeyServiceDependencies, AppConfigService, AppConfigServiceDeps, ApplyModelSpecPresetParams, ApplyModelSpecPresetResult, ArtifactBoundary, type Artifacts, type AssistantMessageItemParam, type AttachmentData, type AudioBlock, type AudioContent, type AudioFileInfo, type AudioProcessingResult, type AudioResult, AudioValidationResult, AuthFailureRedirectOptions, AuthLogContext, AuthLogRequest, AuthLogState, type AzureOptions, BalanceMiddlewareOptions, type BalanceUpdateFields, type BaseEvent, type BaseInitializeParams, type BasicConnectionOptions, BasicToolEndHandler, BatchUpdateFn, type BedrockConfigOptions, type BedrockCredentials, type BedrockDocumentBlock, type BedrockLLMConfigResult, type BedrockUserCredentials, type BuildInfo, BuildOAuthFailureLogParams, BuildSkillPrimeContentPartsParams, BuildToolClassificationParams, BuildToolClassificationResult, BuildToolSetConfig, BulkWriteDeps, CLAUDE_TOKEN_CORRECTION, CLOUDFRONT_SCOPE_COOKIE, CREATE_FILE_TOOL_NAME, CapabilityUser, ChatCompletionChoice, ChatCompletionChunk, ChatCompletionChunkChoice, type ChatCompletionDependencies, ChatCompletionRequest, ChatCompletionResponse, type ChatCompletionValidationFailure, type ChatCompletionValidationResult, type ChatCompletionValidationSuccess, ChatMessage, CheckAccessParams, CheckAccessWithRequestCacheParams, CheckAgentPermission, CheckBalanceDeps, type ChunkHandler, CloudFrontAuthCookieRefreshResult, CloudFrontCookieScope, CloudFrontFullConfig, CloudFrontURLParams, CodeArtifactCategory, CodeEnvFileOptions, CodeEnvIdentity, CodeFilesAgent, ComparePasswordDeps, CompletionUsage, type ConnectionState, type ContentPart, type ContentPartAddedEvent, type ContentPartDoneEvent, ContextProjectionDeps, CreateMessageFilterPiiOptions, type CreatedEvent, type CustomError, DEFAULT_DEPLOYMENT_SKILLS_DIR, DEFAULT_GRAPH_SCOPES, DEFAULT_IMPORT_MAX_FILE_SIZE, DEFAULT_MAX_CONTEXT_TOKENS, DEFAULT_MAX_YOUTUBE_PARTS, DEFAULT_OVERRIDE_CACHE_TTL, DEFAULT_SKILL_IMPORT_LIMITS, DEFAULT_TITLE_FALLBACK, DEPLOYMENT_SKILLS_DIR_ENV, DEPLOYMENT_SKILL_FILE_SOURCE, DEPLOYMENT_SKILL_SOURCE, DeploymentSkill, DeploymentSkillBaseMethods, DeploymentSkillFile, DeploymentSkillRegistry, type DeveloperMessageItemParam, DiscoverConnectedAgentsDeps, DiscoverConnectedAgentsParams, DiscoverConnectedAgentsResult, type DocumentBlock, type DocumentResult, type DoneHandler, DownloadURLParams, EDIT_FILE_TOOL_NAME, ENFORCED_MODEL_SPEC_REQUEST_FIELDS, EdgeDiscoveryResult, type EmbeddedResource, type EncodingName, type EndpointDbMethods, type EndpointTokenConfig, type EndpointsConfigDeps, EnrichResult, EnrichWithSkillConfigurableParams, EnricherDependencies, ErrorController, type ErrorEvent, type ErrorHandler, EventHandler, ExpiredFileSweepOptions, ExpiredFileSweepResult, ExtendedJsonSchema, ExtendedOAuthTokens, FILE_AUTHORING_TOOL_NAMES, FINE_GRAINED_TOOL_STREAMING_BETA, FetchModelsParams, type FileCitationAnnotation, type FileObject, type FileSearchSource, type FinalEvent, type FinalMessageFields, type FlowManagerOptions, type FlowMetadata, type FlowState, FlowStateManager, type FlowStatus, type FormattedContent, type FormattedContentResult, FormattedMessageContentPart, FormattedMessageWithContent, type FormattedToolResponse, type FunctionCallArgumentsDeltaEvent, type FunctionCallArgumentsDoneEvent, type FunctionCallItem, type FunctionCallItemParam, type FunctionCallOutputItem, type FunctionCallOutputItemParam, type FunctionTool, type FunctionToolChoice, GITHUB_FINE_GRAINED_TOKEN_RECOMMENDATION, GRAPH_TOKEN_PLACEHOLDER, GeminiToolkit, type GenerationJob, GenerationJobManager, GenerationJobManagerClass, type GenerationJobManagerOptions, type GenerationJobMetadata, GenerationJobResult, type GenerationJobStatus, GenerationJobStore, GenerationStreamSubscriptionResult, GenerationStreamSubscriptionType, type GenericClient, GetAppConfigOptions, GetOpenAIModelsOptions, GetRemoteAgentPermissionsDeps, GetRolePermissions, GetURLParams, type GetUserKeyFunction, type GetUserKeyValuesFunction, GetUserRoleByAuthorId, GitHubSkillSyncDeps, GitHubSkillSyncRunResult, GitHubSkillSyncRunner, GitHubSkillSyncScheduler, GitHubSkillSyncStatus, type GoogleAudioBlock, type GoogleConfigOptions, type GoogleCredentials, type GoogleDocumentBlock, type GoogleParameters, GoogleServiceKey, type GoogleVideoBlock, type GrantPrincipalType, GraphEvents, GraphTokenOptions, GraphTokenResolver, GraphTokenResponse, type GuardrailConfiguration, HOST_FILE_AUTHORING_ARTIFACT_KEY, HasCapabilityFn, HasConfigCapabilityFn, type HostedTool, type IEventTransport, type IJobStore, type ImageContent, type ImageFormatter, ImageService, ImageServiceConfig, ImageServiceDeps, ImageUploadResult, ImageValidationResult, ImportLimits, ImportSkillDeps, InMemoryEventTransport, InMemoryJobStore, type IncompleteDetails, type InferenceProfileConfig, InitializeAgentDbMethods, InitializeAgentParams, InitializeFn, type InitializeResultBase, InitializedAgent, InjectManualSkillPrimesParams, InjectManualSkillPrimesResult, InjectSkillCatalogParams, InjectSkillCatalogResult, InjectSkillPrimesParams, InjectSkillPrimesResult, type InputContent, type InputFileContent, type InputImageContent, type InputItem, type InputTextContent, type InputTokensDetails, type InternalMessage, InviteDeps, type ItemReferenceParam, type ItemStatus, type JobStatus, type JsonSchemaType, type LCAvailableTools, type LCFunctionTool, type LCManifestTool, type LCTool, type LCToolManifest, type LCToolRegistry, type LLMConfigResult, LangfuseFeedback, LangfuseFeedbackMetadata, type LibreChatAttachmentContent, type LibreChatAttachmentEvent, LoadAddedAgentDeps, LoadAgentDeps, LoadAgentParams, type LoadConfigModelsDeps, LoadSkillStatesParams, LoadToolDefinitionsDeps, LoadToolDefinitionsParams, LoadToolDefinitionsResult, LoadedSkillStates, LogOpenIDCallbackFailureOptions, type LogProb, MAX_ALWAYS_APPLY_SKILLS, MAX_AVATAR_REFRESH_AGENTS, MAX_KEY_LENGTH, MAX_MANUAL_SKILLS, MAX_PRIMED_SKILLS_PER_TURN, MAX_RAW_PAYLOAD, MAX_SKILL_NAME_LENGTH, MAX_SKILL_STATES, MAX_TEXT_CACHE_BYTES, MAX_TEXT_EXTRACT_BYTES, MAX_TITLE_LENGTH, MCPAllowlistContext, MCPAllowlistResolver, MCPConnection, MCPDomainNotAllowedError, MCPErrorCode, MCPErrorCodes, MCPInspectionFailedError, MCPManager, MCPOAuthFlowMetadata, MCPOAuthHandler, MCPOAuthState, MCPOAuthTokens, type MCPOptions, type MCPPrompt, MCPRequestContext, MCPRequestContextOptions, type MCPResource, type MCPServerSource, MCPServerTool, MCPServerTools, type MCPServers, MCPServersRegistry, MCPTokenStorage, type MCPTool, MCPToolCacheDeps, MCPToolCacheService, type MCPToolCallResponse, MCPToolInput, type MCPToolListResponse, MemoryConfig, MergeAgentActionToolsParams, MessageDeltaData, type MessageItem, type MessageRole, type Metadata, MigrationCheckDbMethods, MigrationCheckParams, MigrationCheckResult, MintedToken, type MistralFileUploadResponse, type MistralOCRError, type MistralOCRRequest, type MistralOCRUploadResult, type MistralSignedUrlResponse, type ModelContent, ModelEndData, ModelSpecParsedBody, type MongoServerError, type OAIClientOptions, OAUTH_CSRF_COOKIE, OAUTH_CSRF_MAX_AGE, OAUTH_SESSION_COOKIE, OAUTH_SESSION_COOKIE_PATH, OAUTH_SESSION_MAX_AGE, OAuthClientInformation, type OAuthConnectionOptions, OAuthDetectionResult, OAuthFailureLog, OAuthFailureRequest, OAuthMetadata, OAuthPromptOptions, OAuthProtectedResourceMetadata, OAuthReconnectionManager, type OAuthStartHandler, type OAuthStartOptions, OAuthStoredClientMetadata, OAuthToolCall, type OCRImage, type OCRResult, type OCRResultPage, type OCRUsageInfo, OboConfig, OboTokenResolutionError, OboTokenResolutionReason, OboTokenResolver, OboTrustChecker, OnAgentInitializedCallback, OpenAIChatModelStreamHandler, type OpenAIConfigOptions, type OpenAIConfigResult, type OpenAIConfiguration, OpenAIContentAggregator, OpenAIContentPart, OpenAIErrorResponse, type OpenAIFileBlock, OpenAIImageContentPart, type OpenAIInputFileBlock, OpenAIMessageDeltaHandler, OpenAIModelEndHandler, type OpenAIModelOptions, type OpenAIParameters, OpenAIReasoningDeltaHandler, OpenAIResponseContext, OpenAIRunStepDeltaHandler, OpenAIRunStepHandler, OpenAIStreamHandlerConfig, OpenAIStreamTracker, OpenAITextContentPart, OpenAIToolEndHandler, OpenIDCallbackAuthenticatorOptions, OpenIDCallbackRequest, OpenIDRefreshParams, OpenIDTokenInfo, OpenIDUserLookupResult, OpenIdEmailClaims, OpenIdIssuerSource, OpenIdRoleSyncClaimSource, OpenIdRoleSyncOptions, OpenIdRoleSyncSelectionResult, type OpenRouterAudioBlock, type OpenRouterVideoBlock, type OutputItem, type OutputItemAddedEvent, type OutputItemDoneEvent, type OutputTextContent, type OutputTextDeltaEvent, type OutputTextDoneEvent, type OutputTokensDetails, PDFValidationResult, PENDING_STALE_MS, PKCE_CHALLENGE_PATTERN, PKCE_CHALLENGE_TTL, PRIVATE_MODEL_SPEC_PRESET_FIELDS, type PageDimensions, type ParsedServerConfig, ParsedSkillMarkdown, PendingOAuthStart, PendingRequestResult, PiiMatch, PkceStrippableRequest, PlanAgentActionUpdateParams, PlannedAgentActionUpdate, PreparedEntry, PricingFns, PrimeInvokedSkillsDeps, PrimeInvokedSkillsResult, PrimeSkillFilesParams, PrimeSkillFilesResult, Principal, PrivateModelSpecPresetField, ProcessAvatarParams, type ProcessedFile, PrometheusMetrics, type PromptGroupsAllResponse, type PromptGroupsListResponse, PromptMigrationCheckDbMethods, PromptMigrationCheckParams, PromptMigrationCheckResult, type Provider, ProviderConfigResult, ProxyEnvConfig, PruneOrphansDeps, QUERY_DEVTOOLS_HEADER, QUOTE_MAX_COUNT, QUOTE_MAX_LENGTH, QueryDevtoolsRequest, ReadFileOptions, ReadFileResult, type ReasoningConfig, type ReasoningContent, type ReasoningDeltaEvent, type ReasoningDoneEvent, type ReasoningEffort, type ReasoningItem, type ReasoningItemParam, type ReasoningSummary, type ReasoningTextContent, ReauthenticationRequiredError, RecordUsageDeps, RecordUsageParams, RecordUsageResult, RedisEventTransport, RedisJobStore, RefreshListAvatarsParams, RefreshS3UrlFn, RefreshStats, RefreshTokenset, type RefusalContent, type RefusalDeltaEvent, type RefusalDoneEvent, RegisterCodeExecutionToolsParams, RegisterCodeExecutionToolsResult, RegisterFileAuthoringToolsParams, RegisterFileAuthoringToolsResult, RemoteAgentAccessDependencies, RemoteAgentAccessRequest, RemoteAgentAccessResult, RemoteAgentAuthDeps, ReplayablePendingMCPOAuthStartOptions, type RequestBody, type RequestScopedMCPConnectionStore, type RequestValidationResult, RequireCapabilityFn, ResolveAgentScopedSkillIdsParams, ResolveAlwaysApplySkillsParams, ResolveManualSkillsParams, ResolveModelSpecSkillIdsParams, ResolveSkillActiveParams, ResolveTokenConfigParams, ResolvedAlwaysApplySkill, ResolvedManualSkill, type ResolvedPrincipal, ResolvedSkillPrime, type Response, type ResponseAggregator, type ResponseCompletedEvent, type ResponseContext, type ResponseCreatedEvent, type ResponseError, type ResponseEvent, type ResponseFailedEvent, type ResponseInProgressEvent, type ResponseIncompleteEvent, type ResponseRequest, type ResponseStatus, type ResponseTracker, type ResumeState, RetentionConversation, RetentionDependencies, RetentionExpiry, RetentionLogger, RetentionRequest, RumProxyEndpoint, RumProxyResult, type RunLLMConfig, RunStepDeltaData, S3FileRef, S3KeyOptions, S3KeyParts, SKILL_MESSAGE_SOURCE, SKILL_SYNC_MAX_TIMER_INTERVAL_MINUTES, SKILL_TRIGGER_ALWAYS_APPLY, SKILL_TRIGGER_MANUAL, SKILL_TRIGGER_MODEL, SSEEvent, type SSEOptions, type STTService, SaveBufferFn, SaveBufferParams, SaveURLParams, SaveURLResult, SendFeedbackScoreParams, type SerializableJobData, type ServerRequest, type ServerSentEvent, type ServiceTier, SharePolicyDeps, SharedLinkAccessDeps, SharedLinkRetentionDependencies, SkillConfigurableContext, SkillConfigurableLoadResult, SkillFileRecord, SkillPrimeContentPart, SkillPrimeWithTools, SkillStatesRecord, SkillStatesValidationError, SkillSyncAppConfigLike, SkillSyncRequestLike, SkillSyncRequestUser, SkillSyncTriggerOrchestrator, SkillSyncTriggerOrchestratorDeps, SkillSyncTriggerRunnerFactoryInput, SkillTrigger, SkillsHandlers, SkillsHandlersDeps, type StdioOptions, StepTypes, type StrategyFunctions, type StreamEvent, type StreamHandlerConfig, type StreamOptions, type StreamServices, type StreamServicesConfig, type StreamableHTTPOptions, StructuredPromptTokens, StructuredTokenUsage, SubagentUsageEvent, type SubscribeOptions, type SubscribeWithResumeResult, type SummaryTextContent, type SystemMessageItemParam, type TCustomEndpointsConfig, TFilterFilesByAgentAccess, TGetFiles, TOOL_RESOURCE_KEYS, TUpdatePromptGroupSchema, TestRunHook, TestRunHookContext, type TextConfig, type TextContent, type TextField, type ThinkingConfigAdaptive, type ThinkingConfigDisabled, type ThinkingConfigEnabled, type ThinkingConfigParam, ThreadData, TitleTiming, type TokenConfig, TokenConfigParams, TokenCountFn, TokenCounter, TokenUsage, TokenizerSingleton as Tokenizer, TokenomicsDeps, type Tool, ToolCall, type ToolChoice, type ToolChoiceValue, type ToolContentPart, ToolDefinition, type ToolDiscoveryOptions, type ToolDiscoveryResult, ToolEndCallback, ToolEndCallbackData, ToolEndCallbackMetadata, ToolEndData, ToolExecuteOptions, ToolRegistryDefinition, type TopLogProb, type TruncationValue, TxMetadata, UnionPrimeAllowedToolsParams, UnionPrimeAllowedToolsResult, type UnsubscribeFn, UpdateAgentFn, UploadFileParams, UploadImageParams, UploadResult, UrlBuilder, type UrlCitationAnnotation, type Usage, type UsageMetadata, type UserConnectionContext, type UserKeyValues, type UserMCPConnectionOptions, type UserMessageItemParam, ValidateAgentModelParams, type ValidationError, ValidationResult, type VertexAIClientOptions, VertexAIConfigInput, VertexCredentialOptions, type VideoBlock, type VideoResult, VideoValidationResult, ViolationInfo, WebSearchAuthResult, type WebSocketOptions, YouTubeVideoPart, __resetShutdownStateForTests, _resetOverrideStrictCache, agentAvatarSchema, agentBaseResourceSchema, agentBaseSchema, agentCreateSchema, agentFileResourceSchema, agentHasDeferredTools, agentHasProgrammaticTools, agentSubagentsSchema, agentSupportContactSchema, agentToolOptionsSchema, agentToolResourcesSchema, agentUpdateSchema, aggregateEmittedUsage, anyAgentReplaysReasoningContent, apiNotFound, appendAnthropicBetaHeader, appendCodeEnvFile, appendCodeEnvFileIdentity, appendYouTubeVideoParts, applyAdminRefresh, applyAxiosProxyConfig, applyContextToAgent, applyDefaultParams, applyModelSpecPreset, applyTestRunHook, autoMigrateLegacyLink, azureAISearchSchema, backfillRemoteAgentPermissions, batchDeleteKeys, buildAbortedResponseMetadata, buildActionOAuthTokenDeleteQueries, buildAgentAdditionalInstructions, buildAgentContextAttachmentsByAgentId, buildAgentInstructions, buildAgentScopedContext, buildAggregatedResponse, buildCodeEnvDownloadQuery, buildImageToolContext, buildInitialToolSessions, buildMCPAuthRunStepCompletedEvent, buildMCPAuthRunStepDeltaEvent, buildMCPAuthRunStepEndDeltaEvent, buildMCPAuthRunStepEvent, buildMCPAuthStepId, buildMCPAuthToolCall, buildMessageFiles, buildNonStreamingResponse, buildOAuthFailureLog, buildOAuthToolCallName, buildOpenIDRefreshParams, buildPersistedContextUsage, buildPromptGroupFilter, buildResponse, buildResponsesNonStreamingResponse, buildSafeAuthLogContext, buildSharedLinkStartupPayload, buildSkillPrimeContentParts, buildSkillPrimeMessage, buildTokenConfigMap, buildToolClassification, buildToolRegistryFromAgentOptions, buildToolSet, buildWebSearchContext, buildWebSearchDynamicContext, bulkWriteTransactions, cacheConfig, capabilityContextMiddleware, capabilityStore, checkAccess, checkAccessWithRequestCache, checkAgentPermissionsMigration, checkAgentUploadAuth, checkAndIncrementPendingRequest, checkBalance, checkConfig, checkEmailConfig, checkHealth, checkInterfaceConfig, checkPluginAuth, checkPromptCacheSupport, checkPromptPermissionsMigration, checkRemoteAgentAccess, checkUserKeyExpiry, checkVariables, checkWebSearchConfig, classifyCodeArtifact, cleanupBulkSharedLinkPermissions, cleanupMCPRequestContext, cleanupMCPRequestContextForReq, cleanupMCPToolSchemas, cleanupSharedLinkPermissions, clearCloudFrontCookies, clearMcpConfigCache, clearRemoteAgentAuthCache, codeServerHttpAgent, codeServerHttpsAgent, collectEdgeAgentIds, collectFileIds, collectFreshSkillPrimeNames, collectToolResourceFileIds, comparePassword, computeSummaryUsedTokens, computeUsageCostUSD, configureReasoning, conflictingAzureVariables, constructAzureURL, containsGraphTokenPlaceholder, convertInputToMessages, convertJsonSchemaToZod, convertMessages, convertOcrToContextInPlace, convertWithResolvedRefs, countFormattedMessageTokens, countTokens, createAdminAuditLogHandlers, createAdminConfigHandlers, createAdminGrantsHandlers, createAdminGroupsHandlers, createAdminRolesHandlers, createAdminSkillsSyncAccess, createAdminSkillsSyncHandlers, createAdminUsersHandlers, createAgentChatCompletion, createAggregatorEventHandlers, createAnthropicVertexClient, createApiKeyHandlers, createApiKeyServiceDependencies, createAppConfigService, createAxiosInstance, createBearerAuthHeader, createCheckRemoteAgentAccess, createChunk, createConcurrencyLimiter, createDeploymentSkillMethods, createEdgeCollector, createEmptyPromptGroupsResponse, createEndpointsConfigService, createErrorResponse, createExpiredFileSweepRequest, createFetch, createFunctionCallItem, createFunctionCallOutputItem, createGitHubSkillSyncRunner, createHandleLLMNewToken, createHandleOAuthToken, createImportHandler, createInvite, createLoadConfigModels, createMCPRequestContext, createMCPToolCacheService, createMemoryCallback, createMemoryProcessor, createMemoryTool, createMessageFilterPii, createMessageItem, createMetrics, createMinimalRetentionRequest, createMultiAgentMapper, createOpenAIContentAggregator, createOpenAIHandlers, createOpenAIStreamTracker, createOpenIDCallbackAuthenticator, createOutputTextContent, createProjectHandlers, createReasoningItem, createReasoningTextContent, createRemoteAgentAuth, createRequireApiKeyAuth, createResponseAggregator, createResponseContext, createResponseTracker, createResponsesEventHandlers, createRun, createSSRFSafeAgents, createSSRFSafeUndiciConnect, createSafeUser, createSequentialChainEdges, createSetBalanceConfig, createSharePolicyMiddleware, createSharedLinkAccessMiddleware, createSkillSyncTriggerOrchestrator, createSkillsHandlers, createStreamEventHandlers, createStreamServices, createSubagentUsageSink, createTokenCounter, createToolExecuteHandler, createToolExecuteHandlers, dalle3Schema, decrementPendingRequest, decrypt, decryptV2, decryptV3, deleteAllSharedLinksWithCleanup, deleteConvoSharedLinksWithCleanup, deleteFileFromCloudFront, deleteFileFromS3, deleteMistralFile, deleteRagFile, deleteSharedLinkWithCleanup, deprecatedAzureVariables, deriveBaseURL, detectOAuthRequirement, discoverConnectedAgents, emitAttachment, emitError, emitFunctionCallArgumentsDelta, emitFunctionCallArgumentsDone, emitFunctionCallItemAdded, emitFunctionCallItemDone, emitFunctionCallOutputItem, emitMessageItemAdded, emitMessageItemDone, emitOutputTextDelta, emitOutputTextDone, emitReasoningContentPartAdded, emitReasoningContentPartDone, emitReasoningDelta, emitReasoningDone, emitReasoningItemAdded, emitReasoningItemDone, emitResponseCompleted, emitResponseCreated, emitResponseFailed, emitResponseInProgress, emitTextContentPartAdded, emitTextContentPartDone, encodeAndFormatAudios, encodeAndFormatDocuments, encodeAndFormatVideos, encodeHeaderValue, encrypt, encryptV2, encryptV3, enrichRemoteAgentPrincipals, enrichWithSkillConfigurable, ensureCollectionExists, ensureLinkPermissions, ensureRequiredCollectionsExist, escapeRegex, estimateMediaTokensForMessage, exchangeAdminCode, extractBaseURL, extractCodeArtifactText, extractDefaultParams, extractDiscoveredToolsFromHistory, extractFileContext, extractInvokedSkillsFromPayload, extractKeyFromS3Url, extractLibreChatParams, extractMCPServerDomain, extractMCPServers, extractMCPToolDefinition, extractManualSkills, extractOpenIDTokenInfo, extractWebSearchEnvVars, extractYouTubeUrls, fetchAnthropicModels, fetchModels, fetchOpenAIModels, fileSearchSchema, filterAccessibleIdsBySharedLogic, filterFilesByEndpointConfig, filterMalformedContentParts, filterOrphanedEdges, filterPersistableAbortContent, filterUniquePlugins, findAllArtifacts, findMatchingPattern, findModelSpecByName, findOpenIDUser, findPiiMatchInMessages, findPrimaryAgentId, flattenArtifactPath, fluxApiSchema, forceRefreshCloudFrontAuthCookies, formatAuthLogMessage, formatPromptGroupsResponse, formatQuotesAsMarkdown, geminiToolkit, genAzureChatCompletion, genAzureEndpoint, generateAdminExchangeCode, generateArtifactsPrompt, generateCapabilityCheck, generateCheckAccess, generateItemId, generateOAuthCsrfToken, generateResponseId, generateServerNameFromTitle, generateShortLivedToken, getAccessToken, getAdminPanelUrl, getAgentContextAttachments, getAgentFileRetentionExpiry, getAllToolDefinitions, getAnthropicModels, getAuthFailureErrorName, getAuthFailureReason, getAvatarFileStrategy, getAvatarSaveParams, getAzureContainerClient, getAzureCredentials, getBalanceConfig, getBasePath, getBedrockModels, getCachedPrincipals, getClaudeHeaders, getCloudFrontConfig, getCloudFrontCookieRefreshWindowSec, getCloudFrontCookieTiming, getCloudFrontDownloadURL, getCloudFrontFileStream, getCloudFrontURL, getCodeApiAuthHeaders, getCodeEnvFileOptions, getConfiguredExpiredFileAssistantVersion, getConversationExpirationDate, getCustomEndpointConfig, getDeploymentSkillById, getDeploymentSkillDownloadStream, getDeploymentSkillIds, getDeploymentSkillRegistry, getEdgeKey, getEdgeParticipants, getEnvProxyDispatcher, getExpiredFileAssistantVersion, getExpiredFileEndpoint, getExtractedTextFormat, getFileBasename, getFileRetentionSweepInterval, getFirebaseStorage, getForcedTokenEndpointAuthMethod, getGoogleConfig, getGoogleModels, getHttpsProxyAgent, getImageBasename, getInvite, getIssuerBoundConditions, getLLMConfig, getLibreChatRolesForOpenIdSync, getMCPInstructionsForServers, getMCPRequestContext, getMCPServerNamesFromTools, getMissingCustomUserVars, getMissingRuntimeBodyPlaceholderFields, getModelMaxOutputTokens, getModelMaxTokens, getModelTokenValue, getNewS3URL, getOAuthFailureMessage, getOAuthPromptExpiresAt, getOpenAIConfig, getOpenAILLMConfig, getOpenAIModels, getOpenIdEmail, getOpenIdIssuer, getOpenIdProxyDispatcher, getOpenIdRoleSyncOptions, getOpenIdRolesForOpenIdSync, getProviderConfig, getProxyDispatcher, getProxyEnvConfig, getProxyUrlForUrl, getRandomValues, getReasoningKey, getReferencedQuotes, getRemoteAgentPermissions, getReplayablePendingMCPOAuthStart, getReplayablePendingMCPOAuthStartFromFlow, getRetentionExpiry, getRumProxyBodyLimit, getRumProxyClientUrl, getRumProxyTargetBaseUrl, getRumProxyTimeoutMs, getRuntimeBodyPlaceholderFields, getS3DownloadURL, getS3FileStream, getS3Key, getS3URL, getSafetySettings, getServerNameFromTool, getSharedLinkExpiration, getSignedUrl, getStorageMetadata, getStorageMetadataForKey, getThreadData, getTokenConfigKey, getToolDefinition, getToolSchema, getToolkitKey, getTransactionsConfig, getUserMCPAuthMap, getVertexCredentialOptions, getVertexDeploymentName, getViolationInfo, googleSearchSchema, grantCreationPermissions, graphEdgeSchema, guessMimeType, handleError, handleJsonParseError, hasCustomUserVars, hasExpiredFileEndpointConfig, hasOfficeHtmlPath, hasPersistableAbortContent, hasRuntimeBodyPlaceholders, hasRuntimeContextPlaceholders, hasRuntimeUrlPlaceholders, hasUrlContextTool, hashBackupCode, hydrateMissingIndexTokenCounts, inferClientAuthMethod, initializeAgent, initializeAnthropic, initializeAzureBlobService, initializeBedrock, initializeCloudFront, initializeCustom, initializeDeploymentSkills, initializeFileStorage, initializeFirebase, initializeGoogle, initializeOpenAI, initializeS3, injectManualSkillPrimes, injectSkillCatalog, injectSkillPrimes, inputSchema, instrumentMongooseQueryMetrics, ioredisClient, isActionDomainAllowed, isActiveExpirationDate, isAddressAllowed, isAdminPanelRedirect, isAnthropicVertexCredentials, isBinaryBuffer, isBooleanOrStringTrue, isChatCompletionValidationFailure, isClientRejectionMessage, isCodeApiJwtAuthEnabled, isCodeSessionToolName, isConcurrentLimitEnabled, isDeepSeekReasoningProvider, isDeploymentSkillFilePath, isDeploymentSkillFileSource, isDeploymentSkillId, isEmailDomainAllowed, isEnabled, isFileAuthoringToolDefinition, isFileSnapshotEnabled, isFileSnapshotKillSwitchActive, isInvalidClientMessage, isKnownCustomProvider, isMCPDomainAllowed, isMCPDomainNotAllowedError, isMCPInspectionFailedError, isMCPTool, isMemoryAgentEnabled, isMemoryEnabled, isMetricsConfigured, isModelSpecEndpointMatch, isOAuthProtocolFailure, isOAuthServer, isOAuthUrlAllowed, isOboConfigStillTrusted, isOpenIDAvailable, isOpenIDTokenValid, isPreliminaryMessageId, isPrivateIP, isRumProxyEnabled, isSSRFTarget, isSkillPrimeMessage, isUnpersistedPreliminaryParent, isUserIssuerAllowed, isUserProvided, isUserSourced, isValidationFailure, keyvMongo, keyvRedisClient, keyvRedisClientReady, knownAnthropicParams, knownGoogleParams, knownOpenAIParams, legacyActionDomainEncode, limiterCache, listAgentModels, loadAddedAgent, loadAgent, loadAnthropicVertexCredentials, loadCustomEndpointsConfig, loadDeploymentSkillsFromDirectory, loadEphemeralAgent, loadMemoryConfig, loadOCRConfig, loadServiceKey, loadSkillStates, loadToolDefinitions, loadWebSearchAuth, loadYaml, logAgentMigrationWarning, logAxiosError, logFile, logHeaders, logOpenIDCallbackFailure, logPromptMigrationWarning, logToolError, markPublicPromptGroups, matchModelName, math, maxOutputTokensMap, maxTokensMap, maybeInjectQueryDevtoolsBootstrap, maybeRefreshCloudFrontAuthCookies, maybeRefreshCloudFrontAuthCookiesMiddleware, mcpConfig, mcpOptionsContainGraphTokenPlaceholder, mcpToolPattern, memoryDiagnostics, memoryInstructions, mergeActionMetadataForUpdate, mergeAgentActionTools, mergeAgentOcrConversion, mergeDeploymentSkillIds, mergeHeaders, mergeMessagesWithInput, mergeQuotedText, mintCodeApiToken, modelMaxOutputs, modelSchema, needsRefresh, normalizeExpiresAt, normalizeHttpError, normalizeJsonSchema, normalizeOpenIdIssuer, normalizePath, normalizeServerName, oaiToolkit, omitTitleOptions, openWeatherSchema, optionalChainWithEmptyCheck, overrideDeferLoadingForDiscoveredTools, parseCloudFrontCookieScope, parseDocument, parseFrontmatter, parseS3Key, parseSkillMarkdown, parseText, parseTextNative, payloadParser, performOCR, performStartupChecks, planAgentActionUpdate, preAuthTenantMiddleware, preProcessGraphTokens, prepareStructuredTokenSpend, prepareTokenSpend, prependFileContext, prependQuotes, primeInvokedSkills, primeResources, primeSkillFiles, priorRunOutputTokens, processAudioFile, processMCPEnv, processMemory, processModelData, processOpenIDPlaceholders, processTextWithTokenLimit, providerConfigMap, proxyRumRequest, pruneOrphanSkillStates, readFileAsBuffer, readFileAsString, readJsonFile, recordCollectedUsage, recordContainsGraphTokenPlaceholder, recordGenerationJob, recordGenerationStreamResumePendingEvents, recordGenerationStreamSubscription, recordMongooseQuery, recordOpenIDUserLookup, recordRumProxyRequest, redactAllServerSecrets, redactServerSecrets, redirectToAuthFailure, refreshAccessToken, refreshListAvatars, refreshS3FileUrls, refreshS3Url$1 as refreshS3Url, registerCodeExecutionTools, registerFileAuthoringTools, registerShutdownTask, removePorts, replaceArtifactContent, requireAdmin, requiresEphemeralUserConnection, requiresOAuthMachinery, requiresUserScopedConnection, resolveAgentScopedSkillIds, resolveAgentTokenConfig, resolveAlwaysApplySkills, resolveAppConfigForUser, resolveBuildInfo, resolveCloudFrontCookieScope, resolveConfigHeaders, resolveContextProjection, resolveDefaultActiveOnShare, resolveDeploymentSkillDirectory, resolveExpiredFileSweepConfig, resolveGraphTokenPlaceholder, resolveGraphTokensInRecord, resolveHeaders, resolveHostnameSSRF, resolveImportMaxFileSize, resolveJsonSchemaRefs, resolveManualSkills, resolveMaxTextExtractBytes, resolveModelSpecPromptPrefixVariables, resolveModelSpecSkillIds, resolveNestedObject, resolveOboToken, resolveRecursionLimit, resolveRequestTenantId, resolveRumProxyTarget, resolveSkillActive, resolveStoredS3Key, resolveTitleTiming, resolveTokenConfigMap, resolveTokenEndpointAuthMethod, resolveUploadErrorMessage, resolveYouTubeInjectionConfig, restoreTenantContextFromReq, runOutsideTracing, safeStringify, safeValidatePromptGroupUpdate, sanitizeArtifactPath, sanitizeFileForTransmit, sanitizeFilename, sanitizeGeminiSchema, sanitizeMessageForTransmit, sanitizeModelName, sanitizeModelSpecs, sanitizeTitle, sanitizeUrlForLogging, saveBufferToCloudFront, saveBufferToS3, saveURLToCloudFront, saveURLToCloudFrontWithMetadata, saveURLToS3, saveURLToS3WithMetadata, scanKeys, scopeSkillIds, seedCodeFilesIntoSessions, selectOpenIdRole, selectRegistrationAuthMethod, sendErrorResponse, sendEvent, sendFeedbackScore, sendFinalChunk, sendResponsesErrorResponse, serializeUserForExchange, sessionCache, setCloudFrontCookies, setGenerationJobsInFlight, setOAuthCsrfCookie, setOAuthSession, setOAuthSessionCookie, setupGracefulShutdown, setupStreamingResponse, shouldBypassProxy, shouldEnableQueryDevtools, shouldReplayReasoningContent, shouldUseSecureCookie, skipAgentCheck, splitAndTrim, stableDiffusionSchema, standardCache, startExpiredFileSweep, startGitHubSkillSyncScheduler, storeAndStripChallenge, stripCodeChallenge, stripFileIdsFromToolResources, supportsAdaptiveThinking, sweepExpiredFiles, tavilySearchSchema, tenantContextMiddleware, toSkillStatesRecord, tokenConfigCache, toolDefinitions, toolOptionsSchema, toolkitExpansion, toolkitParent, traceIdForMessage, traversaalSearchSchema, unescapeLaTeX, unionPrimeAllowedTools, updateDeploymentSkillFileCodeEnvRefs, updateInterfacePermissions, updatePromptGroupSchema, updateSharedLinkPermissionsExpiration, updateTrackerUsage, uploadAzureMistralOCR, uploadDocumentToMistral, uploadFileToCloudFront, uploadFileToS3, uploadGoogleVertexMistralOCR, uploadMistralOCR, validateActionOAuthEndpoint, validateActionOAuthMetadata, validateAgentModel, validateAudio, validateBedrockDocument, validateEndpointURL, validateImage, validateOAuthCsrf, validateOAuthSession, validatePdf, validatePromptGroupUpdate, validateRequest, validateResponseRequest, validateSkillStatesPayload, validateVideo, verifyAgentUploadPermission, verifyCodeChallenge, violationCache, violationFile, withTimeout, wolframSchema, writeAttachmentEvent, writeDone, writeEvent, writeSSE };
//# sourceMappingURL=index.d.cts.map