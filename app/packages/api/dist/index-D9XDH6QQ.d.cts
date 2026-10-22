import { AppConfig, IMongoFile, IPromptGroup, IUser } from "@librechat/data-schemas";
import { Error as Error$1, Types } from "mongoose";
import { AgentModelParameters, Agents, AuthKeys, BedrockConverseInput, BedrockDocumentFormat, PrincipalType, RefillIntervalUnit, TConfig, TConversation, TEndpointOption, TFile, TVertexAISchema, ThinkingDisplayWireValue, anthropicSchema, googleBaseSchema, openAISchema } from "librechat-data-provider";
import { Request } from "express";
import { Dispatcher } from "undici";
import { z } from "zod";
import { AnthropicClientOptions, ClientOptions, OpenAIClientOptions, Providers } from "@librechat/agents";
import { BindToolsInput } from "@librechat/agents/langchain/language_models/chat_models";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import { Readable } from "stream";
import { EventEmitter } from "events";

//#region src/types/principal.d.ts
interface ResolvedPrincipal {
  principalType: PrincipalType;
  principalId?: string | Types.ObjectId;
}
//#endregion
//#region src/types/http.d.ts
/**
* LibreChat-specific request body type that extends Express Request body
* (have to use type alias because you can't extend indexed access types like Request['body'])
*/
type RequestBody = {
  messageId?: string;
  fileTokenLimit?: number;
  conversationId?: string;
  parentMessageId?: string;
  endpoint?: string;
  endpointType?: string;
  model?: string;
  key?: string;
  endpointOption?: Partial<TEndpointOption>; /** Browser IANA timezone used to resolve local-time prompt variables (e.g. `{{current_datetime}}`). */
  timezone?: string;
};
type ServerRequest = Request<unknown, unknown, RequestBody> & {
  user?: IUser;
  config?: AppConfig; /** Server-captured conversation creation time used to anchor dynamic prompt variables. */
  conversationCreatedAt?: string; /** Conversation loaded while resolving the prompt timestamp anchor, reused by save logic. */
  resolvedConversation?: Partial<TConversation> | null; /** Passport strategy that populated req.user for this request. */
  authStrategy?: string;
};
//#endregion
//#region src/utils/key.d.ts
interface GoogleServiceKey {
  type?: string;
  project_id?: string;
  private_key_id?: string;
  private_key?: string;
  client_email?: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
  [key: string]: unknown;
}
/**
* Load Google service key from file path, URL, or stringified JSON
* @param keyPath - The path to the service key file, URL to fetch it from, or stringified JSON
* @returns The parsed service key object or null if failed
*/
declare function loadServiceKey(keyPath: string): Promise<GoogleServiceKey | null>;
/**
* Checks if a user key has expired based on the provided expiration date and endpoint.
* If the key has expired, it throws an Error with details including the type of error,
* the expiration date, and the endpoint.
*
* @param expiresAt - The expiration date of the user key in a format that can be parsed by the Date constructor
* @param endpoint - The endpoint associated with the user key to be checked
* @throws Error if the user key has expired. The error message is a stringified JSON object
* containing the type of error (`ErrorTypes.EXPIRED_USER_KEY`), the expiration date in the local string format, and the endpoint.
*/
declare function checkUserKeyExpiry(expiresAt: string, endpoint: string): void;
//#endregion
//#region src/types/azure.d.ts
/**
* Azure OpenAI configuration interface
*/
interface AzureOptions {
  azureOpenAIApiKey?: string;
  azureOpenAIApiInstanceName?: string;
  azureOpenAIApiDeploymentName?: string;
  azureOpenAIApiVersion?: string;
  azureOpenAIBasePath?: string;
}
/**
* Client with azure property for setting deployment name
*/
interface GenericClient {
  azure: {
    azureOpenAIApiDeploymentName?: string;
  };
}
//#endregion
//#region src/types/openai.d.ts
type OpenAIParameters = z.infer<typeof openAISchema>;
type OpenAIModelOptions = Partial<OpenAIParameters>;
/**
* Configuration options for the getLLMConfig function
*/
interface OpenAIConfigOptions {
  modelOptions?: OpenAIModelOptions;
  directEndpoint?: boolean;
  reverseProxyUrl?: string | null;
  baseURLIsUserProvided?: boolean;
  allowedAddresses?: string[] | null;
  defaultQuery?: Record<string, string | undefined>;
  headers?: Record<string, string>;
  proxy?: string | null;
  azure?: false | AzureOptions;
  streaming?: boolean;
  addParams?: Record<string, unknown>;
  dropParams?: string[];
  customParams?: Partial<TConfig["customParams"]>;
}
type OpenAIConfiguration = OpenAIClientOptions["configuration"];
type OAIClientOptions = Omit<OpenAIClientOptions, "verbosity"> & {
  include_reasoning?: boolean; /** Replays `reasoning_content` on tool-bearing turns (DeepSeek thinking-mode, #13366). */
  includeReasoningContent?: boolean;
  promptCache?: boolean;
  promptCacheTtl?: "5m" | "1h";
  _lc_stream_delay?: number;
  verbosity?: string | null;
};
/**
* Return type for getLLMConfig function
*/
interface LLMConfigResult<T = OAIClientOptions> {
  llmConfig: T;
  provider?: Providers;
  tools?: BindToolsInput[];
}
type OpenAIConfigResult = LLMConfigResult<OAIClientOptions> & {
  configOptions?: OpenAIConfiguration;
};
//#endregion
//#region src/types/anthropic.d.ts
type AnthropicParameters = z.infer<typeof anthropicSchema>;
type AnthropicCredentials = {
  [AuthKeys.GOOGLE_SERVICE_KEY]?: GoogleServiceKey;
  [AuthKeys.ANTHROPIC_API_KEY]?: string;
};
/**
* Vertex AI client options for configuring the Anthropic Vertex client.
* These options are typically loaded from the YAML config or environment variables.
*/
interface VertexAIClientOptions$1 {
  /** Google Cloud region for Vertex AI (e.g., 'us-east5', 'europe-west1') */
  region?: string;
  /** Google Cloud Project ID */
  projectId?: string;
}
interface ThinkingConfigDisabled {
  type: "disabled";
}
interface ThinkingConfigEnabled {
  /**
  * Determines how many tokens Claude can use for its internal reasoning process.
  * Larger budgets can enable more thorough analysis for complex problems, improving
  * response quality.
  *
  * Must be ≥1024 and less than `max_tokens`.
  *
  * See
  * [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
  * for details.
  */
  budget_tokens: number;
  type: "enabled";
}
interface ThinkingConfigAdaptive {
  type: "adaptive";
  display?: ThinkingDisplayWireValue;
}
/**
* Configuration for enabling Claude's extended thinking.
*
* When enabled, responses include `thinking` content blocks showing Claude's
* thinking process before the final answer. Requires a minimum budget of 1,024
* tokens and counts towards your `max_tokens` limit.
*
* See
* [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
* for details.
*/
type ThinkingConfigParam = ThinkingConfigEnabled | ThinkingConfigDisabled | ThinkingConfigAdaptive;
type AnthropicModelOptions = Partial<Omit<AnthropicParameters, "thinking">> & {
  thinking?: AnthropicParameters["thinking"] | null;
  user?: string;
};
/**
* Configuration options for the getLLMConfig function
*/
interface AnthropicConfigOptions {
  modelOptions?: AnthropicModelOptions;
  /** Proxy server URL */
  proxy?: string | null;
  /** URL for a reverse proxy, if used */
  reverseProxyUrl?: string | null;
  /** Whether the reverse proxy URL came from a user-stored credential */
  baseURLIsUserProvided?: boolean;
  /** Admin-approved internal host:port exemptions for user-provided base URLs */
  allowedAddresses?: string[] | null;
  /** Default parameters to apply only if fields are undefined */
  defaultParams?: Record<string, unknown>;
  /** Additional parameters to add to the configuration */
  addParams?: Record<string, unknown>;
  /** Parameters to drop/exclude from the configuration */
  dropParams?: string[];
  /**
  * Admin-configured custom request headers (with unresolved placeholders).
  * Merged beneath provider-managed headers and resolved at request time.
  */
  headers?: Record<string, string>;
  /** Vertex AI specific options for Google Cloud configuration */
  vertexOptions?: VertexAIClientOptions$1;
  /** Full Vertex AI configuration including model mappings from YAML config */
  vertexConfig?: TVertexAISchema;
}
/**
* Return type for getLLMConfig function
*/
type AnthropicLLMConfigResult = LLMConfigResult<AnthropicClientOptions & {
  clientOptions?: {
    fetchOptions?: {
      dispatcher?: Dispatcher;
      redirect?: RequestRedirect;
    };
  };
  stream?: boolean;
}>;
//#endregion
//#region src/types/balance.d.ts
interface BalanceUpdateFields {
  user?: string;
  tokenCredits?: number;
  autoRefillEnabled?: boolean;
  refillIntervalValue?: number;
  refillIntervalUnit?: RefillIntervalUnit;
  refillAmount?: number;
  lastRefill?: Date;
}
//#endregion
//#region src/types/bedrock.d.ts
/**
* AWS credentials for Bedrock
* Extends AWS AwsCredentialIdentity to ensure compatibility
*/
type BedrockCredentials = Partial<AwsCredentialIdentity>;
/**
* User-provided Bedrock credentials can be either AWS credentials or an API key.
*/
type BedrockUserCredentials = BedrockCredentials & {
  bearerToken?: string;
};
/**
* AWS Bedrock Guardrail configuration
* @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_GuardrailConfiguration.html
*/
interface GuardrailConfiguration {
  /** The identifier for the guardrail (ID or ARN) */
  guardrailIdentifier: string;
  /** The version of the guardrail (version number or "DRAFT") */
  guardrailVersion: string;
  /** The trace behavior for the guardrail */
  trace?: "enabled" | "disabled" | "enabled_full";
  /** The processing mode for guardrail; 'sync' is the default guardrail behavior if unset */
  streamProcessingMode?: "sync" | "async";
}
/**
* AWS Bedrock Inference Profile configuration
* Maps model IDs to their inference profile ARNs
* @see https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles.html
*/
type InferenceProfileConfig = Record<string, string>;
/**
* Configuration options for Bedrock LLM
*/
interface BedrockConfigOptions {
  modelOptions?: Partial<BedrockConverseInput>;
  /** AWS region for Bedrock */
  region?: string;
  /** Optional pre-configured Bedrock client (used with proxy) */
  client?: BedrockRuntimeClient;
  /** AWS credentials */
  credentials?: BedrockCredentials;
  /** AWS shared config profile for the SDK credential provider chain */
  profile?: string;
  /** Custom endpoint host for reverse proxy */
  endpointHost?: string;
  /** Guardrail configuration for content filtering */
  guardrailConfig?: GuardrailConfiguration;
  /** Inference profile ARNs keyed by model ID / friendly name */
  inferenceProfiles?: InferenceProfileConfig;
}
/**
* Return type for Bedrock getOptions function
*/
interface BedrockLLMConfigResult {
  llmConfig: BedrockConverseInput & {
    region?: string;
    client?: BedrockRuntimeClient;
    credentials?: BedrockCredentials;
    profile?: string;
    endpointHost?: string;
    guardrailConfig?: GuardrailConfiguration;
    applicationInferenceProfile?: string;
  };
  configOptions: Record<string, unknown>;
}
//#endregion
//#region src/types/endpoints.d.ts
type TCustomEndpointsConfig = Partial<{
  [key: string]: Omit<TConfig, "order">;
}>;
/**
* Interface for user key values retrieved from the database
*/
interface UserKeyValues {
  apiKey?: string;
  baseURL?: string;
}
/**
* Function type for getting user key (single decrypted value)
*/
type GetUserKeyFunction = (params: {
  userId: string;
  name: string;
}) => Promise<string>;
/**
* Function type for getting user key values (parsed JSON object with apiKey/baseURL)
*/
type GetUserKeyValuesFunction = (params: {
  userId: string;
  name: string;
}) => Promise<UserKeyValues>;
/**
* Database methods required for endpoint initialization
* These are passed in at invocation time to allow for dependency injection
*/
interface EndpointDbMethods {
  /** Get single decrypted key value (used for simple API keys) */
  getUserKey: GetUserKeyFunction;
  /** Get parsed key values object (used for apiKey + baseURL combinations) */
  getUserKeyValues: GetUserKeyValuesFunction;
}
/**
* Base parameters for all endpoint initialization functions
*/
interface BaseInitializeParams {
  /** Request data containing user and body information (includes req.config) */
  req: ServerRequest;
  /** The endpoint name/identifier (e.g., 'openAI', 'anthropic', 'custom-endpoint-name') */
  endpoint: string;
  /** Model parameters from the request (includes model, temperature, topP, etc.) */
  model_parameters?: Record<string, unknown>;
  /** Database methods for user key operations */
  db: EndpointDbMethods;
}
/**
* Base result type that all initialize functions return
* Using a more permissive type to accommodate different provider-specific results
*/
interface InitializeResultBase {
  llmConfig: ClientOptions;
  configOptions?: OpenAIClientOptions["configuration"];
  endpointTokenConfig?: EndpointTokenConfig;
  useLegacyContent?: boolean;
  provider?: string;
  tools?: unknown[];
}
//#endregion
//#region src/types/error.d.ts
/** MongoDB duplicate key error interface */
interface MongoServerError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
  errmsg?: string;
}
/** Mongoose validation error interface */
interface ValidationError extends Error$1 {
  name: "ValidationError";
  errors: Record<string, {
    message: string;
    path?: string;
  }>;
}
/** Custom error with status code and body */
interface CustomError extends Error {
  statusCode?: number;
  body?: unknown;
  code?: string | number;
}
//#endregion
//#region src/types/events.d.ts
/** SSE streaming event (on_run_step, on_message_delta, etc.) */
type StreamEvent = {
  event: string;
  data: string | Record<string, unknown>;
};
/** Control event emitted when user message is created and generation starts */
type CreatedEvent = {
  created: true;
  message: {
    messageId: string;
    parentMessageId?: string;
    conversationId?: string;
    text?: string;
    sender: string;
    isCreatedByUser: boolean;
    /** Quoted excerpts referenced on this turn, carried through resumable job
    *  metadata so reconstructed user messages keep their `MessageQuotes`. */
    quotes?: string[];
  };
  streamId: string;
};
type FinalMessageFields = {
  messageId?: string;
  parentMessageId?: string;
  conversationId?: string;
  text?: string;
  content?: unknown[];
  sender?: string;
  isCreatedByUser?: boolean;
  unfinished?: boolean; /** Per-message error flag — matches TMessage.error (boolean or error text) */
  error?: boolean | string;
  [key: string]: unknown;
};
/** Terminal event emitted when generation completes or is aborted */
type FinalEvent = {
  final: true;
  requestMessage?: FinalMessageFields | null;
  responseMessage?: FinalMessageFields | null;
  conversation?: {
    conversationId?: string;
    [key: string]: unknown;
  } | null;
  title?: string;
  aborted?: boolean;
  earlyAbort?: boolean;
  runMessages?: FinalMessageFields[]; /** Top-level event error (abort-during-completion edge case) */
  error?: {
    message: string;
  };
};
type ServerSentEvent = StreamEvent | CreatedEvent | FinalEvent;
//#endregion
//#region src/storage/types.d.ts
interface SaveBufferParams {
  userId: string;
  buffer: Buffer;
  fileName: string;
  basePath?: string;
  tenantId?: string | null;
  storageRegion?: string | null;
  includeRegionInPath?: boolean;
  useInlinePath?: boolean;
}
interface GetURLParams {
  userId: string;
  fileName: string;
  basePath?: string;
  customFilename?: string | null;
  contentType?: string | null;
  tenantId?: string | null;
  storageRegion?: string | null;
  includeRegionInPath?: boolean;
  useInlinePath?: boolean;
}
interface SaveURLParams {
  userId: string;
  URL: string;
  fileName: string;
  basePath?: string;
  tenantId?: string | null;
  storageRegion?: string | null;
  includeRegionInPath?: boolean;
  useInlinePath?: boolean;
}
interface SaveURLResult {
  filepath: string;
  storageKey?: string;
  storageRegion?: string;
  bytes?: number;
  type?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
}
interface UploadFileParams {
  req: ServerRequest;
  file: Express.Multer.File;
  file_id: string;
  basePath?: string;
  tenantId?: string | null;
  storageRegion?: string | null;
  includeRegionInPath?: boolean;
  useInlinePath?: boolean;
}
interface DownloadURLParams {
  req?: ServerRequest;
  file: TFile;
  customFilename?: string | null;
  contentType?: string | null;
}
interface UploadImageParams extends UploadFileParams {
  endpoint: string;
  resolution?: string;
}
interface UploadResult {
  filepath: string;
  storageKey?: string;
  storageRegion?: string;
  bytes: number;
}
interface ImageUploadResult extends UploadResult {
  width: number;
  height: number;
}
interface ProcessAvatarParams {
  buffer: Buffer;
  userId: string;
  manual: string;
  agentId?: string;
  basePath?: string;
  tenantId?: string | null;
}
interface S3FileRef {
  filepath: string;
  storageKey?: string;
  storageRegion?: string;
  source: string;
}
type SaveBufferFn = (params: SaveBufferParams) => Promise<string>;
type BatchUpdateFn = (files: Array<{
  file_id: string;
  filepath: string;
  storageKey?: string;
  storageRegion?: string;
}>) => Promise<void>;
type UrlBuilder = (params: GetURLParams) => Promise<string>;
//#endregion
//#region src/types/files.d.ts
interface STTService {
  getInstance(): Promise<STTService>;
  getProviderSchema(req: ServerRequest): Promise<[string, object]>;
  sttRequest(provider: string, schema: object, params: {
    audioBuffer: Buffer;
    audioFile: AudioFileInfo;
  }): Promise<string>;
}
interface AudioFileInfo {
  originalname: string;
  mimetype: string;
  size: number;
}
interface FileObject {
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}
interface AudioProcessingResult {
  text: string;
  bytes: number;
}
/** Google video block format */
interface GoogleVideoBlock {
  type: "media";
  mimeType: string;
  data: string;
}
/** OpenRouter video block format */
interface OpenRouterVideoBlock {
  type: "video_url";
  video_url: {
    url: string;
  };
}
type VideoBlock = GoogleVideoBlock | OpenRouterVideoBlock;
interface VideoResult {
  videos: VideoBlock[];
  files: Array<{
    file_id?: string;
    temp_file_id?: string;
    filepath: string;
    source?: string;
    filename: string;
    type: string;
  }>;
}
/** Anthropic document block format */
interface AnthropicDocumentBlock {
  type: "document";
  source: {
    type: string;
    media_type: string;
    data: string;
  };
  context?: string;
  title?: string;
  cache_control?: {
    type: string;
  };
  citations?: {
    enabled: boolean;
  };
}
/** Google document block format */
interface GoogleDocumentBlock {
  type: "media";
  mimeType: string;
  data: string;
}
/** OpenAI file block format */
interface OpenAIFileBlock {
  type: "file";
  file: {
    filename: string;
    file_data: string;
  };
}
/** OpenAI Responses API file format */
interface OpenAIInputFileBlock {
  type: "input_file";
  filename: string;
  file_data: string;
}
/** Bedrock Converse API document block (passthrough via @langchain/aws) */
interface BedrockDocumentBlock {
  type: "document";
  document: {
    name: string;
    format: BedrockDocumentFormat;
    source: {
      bytes: Buffer;
    };
  };
}
type DocumentBlock = AnthropicDocumentBlock | GoogleDocumentBlock | OpenAIFileBlock | OpenAIInputFileBlock | BedrockDocumentBlock;
interface DocumentResult {
  documents: DocumentBlock[];
  files: Array<{
    file_id?: string;
    temp_file_id?: string;
    filepath: string;
    source?: string;
    filename: string;
    type: string;
  }>;
}
/** Google audio block format */
interface GoogleAudioBlock {
  type: "media";
  mimeType: string;
  data: string;
}
/** OpenRouter audio block format */
interface OpenRouterAudioBlock {
  type: "input_audio";
  input_audio: {
    data: string;
    format: string;
  };
}
type AudioBlock = GoogleAudioBlock | OpenRouterAudioBlock;
interface AudioResult {
  audios: AudioBlock[];
  files: Array<{
    file_id?: string;
    temp_file_id?: string;
    filepath: string;
    source?: string;
    filename: string;
    type: string;
  }>;
}
interface ProcessedFile {
  file: IMongoFile;
  content: string;
  metadata: {
    file_id: string;
    temp_file_id?: string;
    filepath: string;
    source?: string;
    filename: string;
    type: string;
  };
}
/** Subset of storage strategy functions needed by download and delete access flows. */
interface StrategyFunctions {
  getDownloadStream: (req: ServerRequest, filepath: string) => Promise<Readable>;
  getDownloadURL?: (params: DownloadURLParams) => Promise<string>;
  deleteFile?: (req: ServerRequest, file: {
    filepath: string;
    storageKey?: string | null;
    storageRegion?: string | null;
    user?: string;
    tenantId?: string | null;
  }) => Promise<void>;
}
//#endregion
//#region src/types/google.d.ts
type GoogleParameters = z.infer<typeof googleBaseSchema>;
type GoogleCredentials = {
  [AuthKeys.GOOGLE_SERVICE_KEY]?: string | Record<string, unknown>;
  [AuthKeys.GOOGLE_API_KEY]?: string;
};
/**
* Configuration options for the getLLMConfig function
*/
interface GoogleConfigOptions {
  modelOptions?: Partial<GoogleParameters>;
  reverseProxyUrl?: string;
  defaultQuery?: Record<string, string | undefined>;
  headers?: Record<string, string>;
  proxy?: string;
  streaming?: boolean;
  authHeader?: boolean;
  /** Default parameters to apply only if fields are undefined */
  defaultParams?: Record<string, unknown>;
  addParams?: Record<string, unknown>;
  dropParams?: string[];
  /** Stream rate delay for controlling token streaming speed */
  streamRate?: number;
  /** Model to use for title generation */
  titleModel?: string;
  /** Force Vertex AI auth semantics even when a Google API key is configured */
  forceVertex?: boolean;
  /** GCP project id for Vertex AI ADC/service-account authentication */
  projectId?: string;
}
//#endregion
//#region src/types/mistral.d.ts
/**
* Mistral OCR API Types
* Based on https://docs.mistral.ai/api/#tag/ocr/operation/ocr_v1_ocr_post
*/
interface MistralFileUploadResponse {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
}
interface MistralSignedUrlResponse {
  url: string;
  expires_at: number;
}
interface OCRImage {
  id: string;
  top_left_x: number;
  top_left_y: number;
  bottom_right_x: number;
  bottom_right_y: number;
  image_base64: string;
  image_annotation?: string;
}
interface PageDimensions {
  dpi: number;
  height: number;
  width: number;
}
interface OCRResultPage {
  index: number;
  markdown: string;
  images: OCRImage[];
  dimensions: PageDimensions;
}
interface OCRUsageInfo {
  pages_processed: number;
  doc_size_bytes: number;
}
interface OCRResult {
  pages: OCRResultPage[];
  model: string;
  document_annotation?: string | null;
  usage_info: OCRUsageInfo;
}
interface MistralOCRRequest {
  model: string;
  image_limit?: number;
  include_image_base64?: boolean;
  document: {
    type: "document_url" | "image_url";
    document_url?: string;
    image_url?: string;
  };
}
interface MistralOCRError {
  detail?: string;
  message?: string;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}
interface MistralOCRUploadResult {
  filename: string;
  bytes: number;
  filepath: string;
  text: string;
  images: string[];
}
//#endregion
//#region src/types/prompts.d.ts
interface PromptGroupsListResponse {
  promptGroups: IPromptGroup[];
  pageNumber: string;
  pageSize: string;
  pages: string;
  has_more: boolean;
  after: string | null;
}
interface PromptGroupsAllResponse {
  data: IPromptGroup[];
}
interface AccessiblePromptGroupsResult {
  object: "list";
  data: IPromptGroup[];
  first_id: Types.ObjectId | null;
  last_id: Types.ObjectId | null;
  has_more: boolean;
  after: string | null;
}
//#endregion
//#region src/types/run.d.ts
type RunLLMConfig = {
  provider: Providers;
  streaming: boolean;
  streamUsage: boolean;
  usage?: boolean;
  configuration?: OpenAIConfiguration;
} & AgentModelParameters & ClientOptions;
//#endregion
//#region src/types/tokens.d.ts
interface TokenConfig {
  [key: string]: number;
  prompt: number;
  completion: number;
  context: number;
}
/** An endpoint's config object mapping model keys to their respective prompt, completion rates, and context limit */
type EndpointTokenConfig = Record<string, TokenConfig>;
//#endregion
//#region src/types/stream.d.ts
interface GenerationJobMetadata {
  userId: string;
  tenantId?: string;
  conversationId?: string;
  /** User message data for rebuilding submission on reconnect */
  userMessage?: Agents.UserMessageMeta;
  /** Response message ID for tracking */
  responseMessageId?: string;
  /** Sender label for the response (e.g., "GPT-4.1", "Claude") */
  sender?: string;
  /** Endpoint identifier for abort handling */
  endpoint?: string;
  /** Icon URL for UI display */
  iconURL?: string;
  /** Model name for token tracking */
  model?: string;
  /** Prompt token count for abort token spending */
  promptTokens?: number;
}
type GenerationJobStatus = "running" | "complete" | "error" | "aborted";
interface GenerationJob {
  streamId: string;
  emitter: EventEmitter;
  status: GenerationJobStatus;
  createdAt: number;
  completedAt?: number;
  abortController: AbortController;
  error?: string;
  metadata: GenerationJobMetadata;
  readyPromise: Promise<void>;
  resolveReady: () => void;
  /** Final event when job completes */
  finalEvent?: ServerSentEvent;
  /** Flag to indicate if a sync event was already sent (prevent duplicate replays) */
  syncSent?: boolean;
}
type ContentPart = Agents.ContentPart;
type ResumeState = Agents.ResumeState;
type ChunkHandler = (event: ServerSentEvent) => void;
type DoneHandler = (event: ServerSentEvent) => void;
type ErrorHandler = (error: string) => void;
type UnsubscribeFn = () => void;
/** Options for subscribing to a job event stream */
interface SubscribeOptions {
  /**
  * When true, skips replaying the earlyEventBuffer.
  * Use for resume connections after a sync event has been sent.
  */
  skipBufferReplay?: boolean;
}
/** Result of an atomic subscribe-with-resume operation */
interface SubscribeWithResumeResult {
  subscription: {
    unsubscribe: UnsubscribeFn;
  } | null;
  resumeState: ResumeState | null;
  /**
  * Events that arrived between the resume snapshot and the subscribe call.
  * In-memory mode: drained from earlyEventBuffer (only place they exist).
  * Redis mode: empty — chunks are persisted to the store and appear in aggregatedContent on next resume.
  */
  pendingEvents: ServerSentEvent[];
}
//#endregion
export { DownloadURLParams as $, GoogleServiceKey as $t, GoogleParameters as A, BedrockUserCredentials as At, GoogleAudioBlock as B, ThinkingConfigDisabled as Bt, OCRImage as C, GetUserKeyValuesFunction as Ct, PageDimensions as D, BedrockConfigOptions as Dt, OCRUsageInfo as E, UserKeyValues as Et, AudioResult as F, AnthropicCredentials as Ft, OpenRouterAudioBlock as G, OAIClientOptions as Gt, GoogleVideoBlock as H, ThinkingConfigParam as Ht, BedrockDocumentBlock as I, AnthropicLLMConfigResult as It, STTService as J, OpenAIConfiguration as Jt, OpenRouterVideoBlock as K, OpenAIConfigOptions as Kt, DocumentBlock as L, AnthropicModelOptions as Lt, AudioBlock as M, InferenceProfileConfig as Mt, AudioFileInfo as N, BalanceUpdateFields as Nt, GoogleConfigOptions as O, BedrockCredentials as Ot, AudioProcessingResult as P, AnthropicConfigOptions as Pt, BatchUpdateFn as Q, GenericClient as Qt, DocumentResult as R, AnthropicParameters as Rt, MistralSignedUrlResponse as S, GetUserKeyFunction as St, OCRResultPage as T, TCustomEndpointsConfig as Tt, OpenAIFileBlock as U, VertexAIClientOptions$1 as Ut, GoogleDocumentBlock as V, ThinkingConfigEnabled as Vt, OpenAIInputFileBlock as W, LLMConfigResult as Wt, VideoBlock as X, OpenAIParameters as Xt, StrategyFunctions as Y, OpenAIModelOptions as Yt, VideoResult as Z, AzureOptions as Zt, PromptGroupsListResponse as _, CustomError as _t, GenerationJob as a, SaveBufferParams as at, MistralOCRRequest as b, BaseInitializeParams as bt, ResumeState as c, UploadFileParams as ct, UnsubscribeFn as d, UrlBuilder as dt, checkUserKeyExpiry as en, GetURLParams as et, EndpointTokenConfig as f, CreatedEvent as ft, PromptGroupsAllResponse as g, StreamEvent as gt, AccessiblePromptGroupsResult as h, ServerSentEvent as ht, ErrorHandler as i, ResolvedPrincipal as in, SaveBufferFn as it, AnthropicDocumentBlock as j, GuardrailConfiguration as jt, GoogleCredentials as k, BedrockLLMConfigResult as kt, SubscribeOptions as l, UploadImageParams as lt, RunLLMConfig as m, FinalMessageFields as mt, ContentPart as n, RequestBody as nn, ProcessAvatarParams as nt, GenerationJobMetadata as o, SaveURLParams as ot, TokenConfig as p, FinalEvent as pt, ProcessedFile as q, OpenAIConfigResult as qt, DoneHandler as r, ServerRequest as rn, S3FileRef as rt, GenerationJobStatus as s, SaveURLResult as st, ChunkHandler as t, loadServiceKey as tn, ImageUploadResult as tt, SubscribeWithResumeResult as u, UploadResult as ut, MistralFileUploadResponse as v, MongoServerError as vt, OCRResult as w, InitializeResultBase as wt, MistralOCRUploadResult as x, EndpointDbMethods as xt, MistralOCRError as y, ValidationError as yt, FileObject as z, ThinkingConfigAdaptive as zt };
//# sourceMappingURL=index-D9XDH6QQ.d.cts.map