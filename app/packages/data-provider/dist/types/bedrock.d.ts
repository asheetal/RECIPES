import { z } from 'zod';
import * as s from './schemas';
export declare const BEDROCK_OUTPUT_128K_BETA = "output-128k-2025-02-19";
export declare const BEDROCK_FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
export declare function resolveThinkingDisplay(model: string, explicit?: s.ThinkingDisplay | string | null): s.ThinkingDisplayWireValue | undefined;
/**
 * Mythos-class detection (Claude Fable / Mythos) lives in `schemas.ts` as
 * `isMythosClassModel` — the single source of truth for the family names.
 * The helpers below OR it in alongside the `opus`/`sonnet` version parsers.
 */
/** Checks if a model supports adaptive thinking (Opus 4.6+, Sonnet 4.6+, Fable/Mythos) */
export declare function supportsAdaptiveThinking(model: string): boolean;
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
export declare function omitsThinkingByDefault(model: string): boolean;
export declare function omitsSamplingParameters(model: string): boolean;
/** Checks if a model has a 1M context window (Sonnet 4.6+, Opus 4.6+, Opus 5+, Fable/Mythos) */
export declare function supportsContext1m(model: string): boolean;
export declare const bedrockInputSchema: z.ZodCatch<z.ZodEffects<z.ZodObject<Pick<{
    conversationId: z.ZodNullable<z.ZodString>;
    endpoint: z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>;
    endpointType: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>>;
    isArchived: z.ZodOptional<z.ZodBoolean>;
    pinned: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodDefault<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"New Chat">]>>;
    user: z.ZodOptional<z.ZodString>;
    messages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tools: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        pluginKey: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        authConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
            authField: z.ZodString;
            label: z.ZodString;
            description: z.ZodString;
            optional: z.ZodOptional<z.ZodBoolean>;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }>, "many">>;
        authenticated: z.ZodOptional<z.ZodBoolean>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        isButton: z.ZodOptional<z.ZodBoolean>;
        toolkit: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }>, "many">, z.ZodArray<z.ZodString, "many">]>>;
    modelLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userLabel: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    promptPrefix: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    temperature: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    topP: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodOptional<z.ZodNumber>;
    presence_penalty: z.ZodOptional<z.ZodNumber>;
    parentMessageId: z.ZodOptional<z.ZodString>;
    maxOutputTokens: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>>;
    maxContextTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    max_tokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    promptCache: z.ZodOptional<z.ZodBoolean>;
    promptCacheTtl: z.ZodOptional<z.ZodEnum<["5m", "1h"]>>;
    system: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodBoolean>;
    thinkingBudget: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    thinkingLevel: z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingLevel>>;
    stream: z.ZodOptional<z.ZodBoolean>;
    artifacts: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    examples: z.ZodOptional<z.ZodArray<z.ZodObject<{
        input: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
        output: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    chatProjectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    resendFiles: z.ZodOptional<z.ZodBoolean>;
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    imageDetail: z.ZodOptional<z.ZodNativeEnum<typeof s.ImageDetail>>;
    reasoning_effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningEffort>>>;
    reasoning_summary: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningSummary>>>;
    verbosity: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.Verbosity>>>;
    useResponsesApi: z.ZodOptional<z.ZodBoolean>;
    effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.AnthropicEffort>>>;
    thinkingDisplay: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingDisplay>>>;
    web_search: z.ZodOptional<z.ZodBoolean>;
    url_context: z.ZodOptional<z.ZodBoolean>;
    disableStreaming: z.ZodOptional<z.ZodBoolean>;
    assistant_id: z.ZodOptional<z.ZodString>;
    agent_id: z.ZodOptional<z.ZodString>;
    region: z.ZodOptional<z.ZodString>;
    maxTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    additionalModelRequestFields: z.ZodOptional<z.ZodType<string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null, z.ZodTypeDef, string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null>>;
    instructions: z.ZodOptional<z.ZodString>;
    additional_instructions: z.ZodOptional<z.ZodString>;
    append_current_datetime: z.ZodOptional<z.ZodBoolean>;
    presetOverride: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    greeting: z.ZodOptional<z.ZodString>;
    spec: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    iconURL: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expiredAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isTemporary: z.ZodOptional<z.ZodBoolean>;
    fileTokenLimit: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    resendImages: z.ZodOptional<z.ZodBoolean>;
    chatGptLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "model" | "modelLabel" | "promptPrefix" | "temperature" | "topP" | "topK" | "maxOutputTokens" | "maxContextTokens" | "promptCache" | "promptCacheTtl" | "system" | "thinking" | "thinkingBudget" | "artifacts" | "chatProjectId" | "resendFiles" | "reasoning_effort" | "effort" | "thinkingDisplay" | "region" | "maxTokens" | "additionalModelRequestFields" | "stop" | "greeting" | "spec" | "iconURL">, "strip", z.ZodTypeAny, {
    model?: string | null | undefined;
    modelLabel?: string | null | undefined;
    promptPrefix?: string | null | undefined;
    temperature?: number | null | undefined;
    topP?: number | undefined;
    topK?: number | undefined;
    maxOutputTokens?: number | null | undefined;
    maxContextTokens?: number | undefined;
    promptCache?: boolean | undefined;
    promptCacheTtl?: "5m" | "1h" | undefined;
    system?: string | undefined;
    thinking?: boolean | undefined;
    thinkingBudget?: number | undefined;
    artifacts?: string | undefined;
    chatProjectId?: string | null | undefined;
    resendFiles?: boolean | undefined;
    reasoning_effort?: s.ReasoningEffort | null | undefined;
    effort?: s.AnthropicEffort | null | undefined;
    thinkingDisplay?: s.ThinkingDisplay | null | undefined;
    region?: string | undefined;
    maxTokens?: number | undefined;
    additionalModelRequestFields?: (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null) | undefined;
    stop?: string[] | undefined;
    greeting?: string | undefined;
    spec?: string | null | undefined;
    iconURL?: string | null | undefined;
}, {
    model?: string | null | undefined;
    modelLabel?: string | null | undefined;
    promptPrefix?: string | null | undefined;
    temperature?: number | null | undefined;
    topP?: number | undefined;
    topK?: number | undefined;
    maxOutputTokens?: string | number | null | undefined;
    maxContextTokens?: string | number | undefined;
    promptCache?: boolean | undefined;
    promptCacheTtl?: "5m" | "1h" | undefined;
    system?: string | undefined;
    thinking?: boolean | undefined;
    thinkingBudget?: string | number | undefined;
    artifacts?: string | undefined;
    chatProjectId?: string | null | undefined;
    resendFiles?: boolean | undefined;
    reasoning_effort?: s.ReasoningEffort | null | undefined;
    effort?: s.AnthropicEffort | null | undefined;
    thinkingDisplay?: s.ThinkingDisplay | null | undefined;
    region?: string | undefined;
    maxTokens?: string | number | undefined;
    additionalModelRequestFields?: (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null) | undefined;
    stop?: string[] | undefined;
    greeting?: string | undefined;
    spec?: string | null | undefined;
    iconURL?: string | null | undefined;
}>, Partial<{
    model?: string | null | undefined;
    modelLabel?: string | null | undefined;
    promptPrefix?: string | null | undefined;
    temperature?: number | null | undefined;
    topP?: number | undefined;
    topK?: number | undefined;
    maxOutputTokens?: number | null | undefined;
    maxContextTokens?: number | undefined;
    promptCache?: boolean | undefined;
    promptCacheTtl?: "5m" | "1h" | undefined;
    system?: string | undefined;
    thinking?: boolean | undefined;
    thinkingBudget?: number | undefined;
    artifacts?: string | undefined;
    chatProjectId?: string | null | undefined;
    resendFiles?: boolean | undefined;
    reasoning_effort?: s.ReasoningEffort | null | undefined;
    effort?: s.AnthropicEffort | null | undefined;
    thinkingDisplay?: s.ThinkingDisplay | null | undefined;
    region?: string | undefined;
    maxTokens?: number | undefined;
    additionalModelRequestFields?: (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null) | undefined;
    stop?: string[] | undefined;
    greeting?: string | undefined;
    spec?: string | null | undefined;
    iconURL?: string | null | undefined;
}>, {
    model?: string | null | undefined;
    modelLabel?: string | null | undefined;
    promptPrefix?: string | null | undefined;
    temperature?: number | null | undefined;
    topP?: number | undefined;
    topK?: number | undefined;
    maxOutputTokens?: string | number | null | undefined;
    maxContextTokens?: string | number | undefined;
    promptCache?: boolean | undefined;
    promptCacheTtl?: "5m" | "1h" | undefined;
    system?: string | undefined;
    thinking?: boolean | undefined;
    thinkingBudget?: string | number | undefined;
    artifacts?: string | undefined;
    chatProjectId?: string | null | undefined;
    resendFiles?: boolean | undefined;
    reasoning_effort?: s.ReasoningEffort | null | undefined;
    effort?: s.AnthropicEffort | null | undefined;
    thinkingDisplay?: s.ThinkingDisplay | null | undefined;
    region?: string | undefined;
    maxTokens?: string | number | undefined;
    additionalModelRequestFields?: (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null) | undefined;
    stop?: string[] | undefined;
    greeting?: string | undefined;
    spec?: string | null | undefined;
    iconURL?: string | null | undefined;
}>>;
export type BedrockConverseInput = z.infer<typeof bedrockInputSchema>;
export declare const bedrockInputParser: z.ZodCatch<z.ZodEffects<z.ZodObject<Pick<{
    conversationId: z.ZodNullable<z.ZodString>;
    endpoint: z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>;
    endpointType: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>>;
    isArchived: z.ZodOptional<z.ZodBoolean>;
    pinned: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodDefault<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"New Chat">]>>;
    user: z.ZodOptional<z.ZodString>;
    messages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tools: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        pluginKey: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        authConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
            authField: z.ZodString;
            label: z.ZodString;
            description: z.ZodString;
            optional: z.ZodOptional<z.ZodBoolean>;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }>, "many">>;
        authenticated: z.ZodOptional<z.ZodBoolean>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        isButton: z.ZodOptional<z.ZodBoolean>;
        toolkit: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }>, "many">, z.ZodArray<z.ZodString, "many">]>>;
    modelLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userLabel: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    promptPrefix: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    temperature: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    topP: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodOptional<z.ZodNumber>;
    presence_penalty: z.ZodOptional<z.ZodNumber>;
    parentMessageId: z.ZodOptional<z.ZodString>;
    maxOutputTokens: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>>;
    maxContextTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    max_tokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    promptCache: z.ZodOptional<z.ZodBoolean>;
    promptCacheTtl: z.ZodOptional<z.ZodEnum<["5m", "1h"]>>;
    system: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodBoolean>;
    thinkingBudget: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    thinkingLevel: z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingLevel>>;
    stream: z.ZodOptional<z.ZodBoolean>;
    artifacts: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    examples: z.ZodOptional<z.ZodArray<z.ZodObject<{
        input: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
        output: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    chatProjectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    resendFiles: z.ZodOptional<z.ZodBoolean>;
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    imageDetail: z.ZodOptional<z.ZodNativeEnum<typeof s.ImageDetail>>;
    reasoning_effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningEffort>>>;
    reasoning_summary: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningSummary>>>;
    verbosity: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.Verbosity>>>;
    useResponsesApi: z.ZodOptional<z.ZodBoolean>;
    effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.AnthropicEffort>>>;
    thinkingDisplay: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingDisplay>>>;
    web_search: z.ZodOptional<z.ZodBoolean>;
    url_context: z.ZodOptional<z.ZodBoolean>;
    disableStreaming: z.ZodOptional<z.ZodBoolean>;
    assistant_id: z.ZodOptional<z.ZodString>;
    agent_id: z.ZodOptional<z.ZodString>;
    region: z.ZodOptional<z.ZodString>;
    maxTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    additionalModelRequestFields: z.ZodOptional<z.ZodType<string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null, z.ZodTypeDef, string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null>>;
    instructions: z.ZodOptional<z.ZodString>;
    additional_instructions: z.ZodOptional<z.ZodString>;
    append_current_datetime: z.ZodOptional<z.ZodBoolean>;
    presetOverride: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    greeting: z.ZodOptional<z.ZodString>;
    spec: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    iconURL: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expiredAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isTemporary: z.ZodOptional<z.ZodBoolean>;
    fileTokenLimit: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    resendImages: z.ZodOptional<z.ZodBoolean>;
    chatGptLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "model" | "modelLabel" | "promptPrefix" | "temperature" | "topP" | "topK" | "maxOutputTokens" | "maxContextTokens" | "promptCache" | "promptCacheTtl" | "thinking" | "thinkingBudget" | "artifacts" | "chatProjectId" | "resendFiles" | "reasoning_effort" | "effort" | "thinkingDisplay" | "region" | "maxTokens" | "additionalModelRequestFields" | "stop" | "greeting" | "spec" | "iconURL">, "strip", z.ZodAny, z.objectOutputType<Pick<{
    conversationId: z.ZodNullable<z.ZodString>;
    endpoint: z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>;
    endpointType: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>>;
    isArchived: z.ZodOptional<z.ZodBoolean>;
    pinned: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodDefault<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"New Chat">]>>;
    user: z.ZodOptional<z.ZodString>;
    messages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tools: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        pluginKey: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        authConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
            authField: z.ZodString;
            label: z.ZodString;
            description: z.ZodString;
            optional: z.ZodOptional<z.ZodBoolean>;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }>, "many">>;
        authenticated: z.ZodOptional<z.ZodBoolean>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        isButton: z.ZodOptional<z.ZodBoolean>;
        toolkit: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }>, "many">, z.ZodArray<z.ZodString, "many">]>>;
    modelLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userLabel: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    promptPrefix: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    temperature: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    topP: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodOptional<z.ZodNumber>;
    presence_penalty: z.ZodOptional<z.ZodNumber>;
    parentMessageId: z.ZodOptional<z.ZodString>;
    maxOutputTokens: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>>;
    maxContextTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    max_tokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    promptCache: z.ZodOptional<z.ZodBoolean>;
    promptCacheTtl: z.ZodOptional<z.ZodEnum<["5m", "1h"]>>;
    system: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodBoolean>;
    thinkingBudget: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    thinkingLevel: z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingLevel>>;
    stream: z.ZodOptional<z.ZodBoolean>;
    artifacts: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    examples: z.ZodOptional<z.ZodArray<z.ZodObject<{
        input: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
        output: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    chatProjectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    resendFiles: z.ZodOptional<z.ZodBoolean>;
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    imageDetail: z.ZodOptional<z.ZodNativeEnum<typeof s.ImageDetail>>;
    reasoning_effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningEffort>>>;
    reasoning_summary: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningSummary>>>;
    verbosity: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.Verbosity>>>;
    useResponsesApi: z.ZodOptional<z.ZodBoolean>;
    effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.AnthropicEffort>>>;
    thinkingDisplay: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingDisplay>>>;
    web_search: z.ZodOptional<z.ZodBoolean>;
    url_context: z.ZodOptional<z.ZodBoolean>;
    disableStreaming: z.ZodOptional<z.ZodBoolean>;
    assistant_id: z.ZodOptional<z.ZodString>;
    agent_id: z.ZodOptional<z.ZodString>;
    region: z.ZodOptional<z.ZodString>;
    maxTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    additionalModelRequestFields: z.ZodOptional<z.ZodType<string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null, z.ZodTypeDef, string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null>>;
    instructions: z.ZodOptional<z.ZodString>;
    additional_instructions: z.ZodOptional<z.ZodString>;
    append_current_datetime: z.ZodOptional<z.ZodBoolean>;
    presetOverride: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    greeting: z.ZodOptional<z.ZodString>;
    spec: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    iconURL: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expiredAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isTemporary: z.ZodOptional<z.ZodBoolean>;
    fileTokenLimit: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    resendImages: z.ZodOptional<z.ZodBoolean>;
    chatGptLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "model" | "modelLabel" | "promptPrefix" | "temperature" | "topP" | "topK" | "maxOutputTokens" | "maxContextTokens" | "promptCache" | "promptCacheTtl" | "thinking" | "thinkingBudget" | "artifacts" | "chatProjectId" | "resendFiles" | "reasoning_effort" | "effort" | "thinkingDisplay" | "region" | "maxTokens" | "additionalModelRequestFields" | "stop" | "greeting" | "spec" | "iconURL">, z.ZodAny, "strip">, z.objectInputType<Pick<{
    conversationId: z.ZodNullable<z.ZodString>;
    endpoint: z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>;
    endpointType: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>>;
    isArchived: z.ZodOptional<z.ZodBoolean>;
    pinned: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodDefault<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"New Chat">]>>;
    user: z.ZodOptional<z.ZodString>;
    messages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tools: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        pluginKey: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        authConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
            authField: z.ZodString;
            label: z.ZodString;
            description: z.ZodString;
            optional: z.ZodOptional<z.ZodBoolean>;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }>, "many">>;
        authenticated: z.ZodOptional<z.ZodBoolean>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        isButton: z.ZodOptional<z.ZodBoolean>;
        toolkit: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }>, "many">, z.ZodArray<z.ZodString, "many">]>>;
    modelLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userLabel: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    promptPrefix: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    temperature: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    topP: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodOptional<z.ZodNumber>;
    presence_penalty: z.ZodOptional<z.ZodNumber>;
    parentMessageId: z.ZodOptional<z.ZodString>;
    maxOutputTokens: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>>;
    maxContextTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    max_tokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    promptCache: z.ZodOptional<z.ZodBoolean>;
    promptCacheTtl: z.ZodOptional<z.ZodEnum<["5m", "1h"]>>;
    system: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodBoolean>;
    thinkingBudget: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    thinkingLevel: z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingLevel>>;
    stream: z.ZodOptional<z.ZodBoolean>;
    artifacts: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    examples: z.ZodOptional<z.ZodArray<z.ZodObject<{
        input: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
        output: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    chatProjectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    resendFiles: z.ZodOptional<z.ZodBoolean>;
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    imageDetail: z.ZodOptional<z.ZodNativeEnum<typeof s.ImageDetail>>;
    reasoning_effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningEffort>>>;
    reasoning_summary: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningSummary>>>;
    verbosity: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.Verbosity>>>;
    useResponsesApi: z.ZodOptional<z.ZodBoolean>;
    effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.AnthropicEffort>>>;
    thinkingDisplay: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingDisplay>>>;
    web_search: z.ZodOptional<z.ZodBoolean>;
    url_context: z.ZodOptional<z.ZodBoolean>;
    disableStreaming: z.ZodOptional<z.ZodBoolean>;
    assistant_id: z.ZodOptional<z.ZodString>;
    agent_id: z.ZodOptional<z.ZodString>;
    region: z.ZodOptional<z.ZodString>;
    maxTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    additionalModelRequestFields: z.ZodOptional<z.ZodType<string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null, z.ZodTypeDef, string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null>>;
    instructions: z.ZodOptional<z.ZodString>;
    additional_instructions: z.ZodOptional<z.ZodString>;
    append_current_datetime: z.ZodOptional<z.ZodBoolean>;
    presetOverride: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    greeting: z.ZodOptional<z.ZodString>;
    spec: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    iconURL: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expiredAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isTemporary: z.ZodOptional<z.ZodBoolean>;
    fileTokenLimit: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    resendImages: z.ZodOptional<z.ZodBoolean>;
    chatGptLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "model" | "modelLabel" | "promptPrefix" | "temperature" | "topP" | "topK" | "maxOutputTokens" | "maxContextTokens" | "promptCache" | "promptCacheTtl" | "thinking" | "thinkingBudget" | "artifacts" | "chatProjectId" | "resendFiles" | "reasoning_effort" | "effort" | "thinkingDisplay" | "region" | "maxTokens" | "additionalModelRequestFields" | "stop" | "greeting" | "spec" | "iconURL">, z.ZodAny, "strip">>, Partial<{
    model?: string | null | undefined;
    modelLabel?: string | null | undefined;
    promptPrefix?: string | null | undefined;
    temperature?: number | null | undefined;
    topP?: number | undefined;
    topK?: number | undefined;
    maxOutputTokens?: number | null | undefined;
    maxContextTokens?: number | undefined;
    promptCache?: boolean | undefined;
    promptCacheTtl?: "5m" | "1h" | undefined;
    system?: string | undefined;
    thinking?: boolean | undefined;
    thinkingBudget?: number | undefined;
    artifacts?: string | undefined;
    chatProjectId?: string | null | undefined;
    resendFiles?: boolean | undefined;
    reasoning_effort?: s.ReasoningEffort | null | undefined;
    effort?: s.AnthropicEffort | null | undefined;
    thinkingDisplay?: s.ThinkingDisplay | null | undefined;
    region?: string | undefined;
    maxTokens?: number | undefined;
    additionalModelRequestFields?: (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null) | undefined;
    stop?: string[] | undefined;
    greeting?: string | undefined;
    spec?: string | null | undefined;
    iconURL?: string | null | undefined;
}>, z.objectInputType<Pick<{
    conversationId: z.ZodNullable<z.ZodString>;
    endpoint: z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>;
    endpointType: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof s.EModelEndpoint>>>;
    isArchived: z.ZodOptional<z.ZodBoolean>;
    pinned: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodDefault<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"New Chat">]>>;
    user: z.ZodOptional<z.ZodString>;
    messages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tools: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        pluginKey: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        authConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
            authField: z.ZodString;
            label: z.ZodString;
            description: z.ZodString;
            optional: z.ZodOptional<z.ZodBoolean>;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }>, "many">>;
        authenticated: z.ZodOptional<z.ZodBoolean>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        isButton: z.ZodOptional<z.ZodBoolean>;
        toolkit: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }, {
        name: string;
        pluginKey: string;
        description?: string | undefined;
        icon?: string | undefined;
        authConfig?: {
            description: string;
            authField: string;
            label: string;
            optional?: boolean | undefined;
            sensitive?: boolean | undefined;
        }[] | undefined;
        authenticated?: boolean | undefined;
        chatMenu?: boolean | undefined;
        isButton?: boolean | undefined;
        toolkit?: boolean | undefined;
    }>, "many">, z.ZodArray<z.ZodString, "many">]>>;
    modelLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userLabel: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    promptPrefix: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    temperature: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    topP: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodOptional<z.ZodNumber>;
    presence_penalty: z.ZodOptional<z.ZodNumber>;
    parentMessageId: z.ZodOptional<z.ZodString>;
    maxOutputTokens: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>>;
    maxContextTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    max_tokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    promptCache: z.ZodOptional<z.ZodBoolean>;
    promptCacheTtl: z.ZodOptional<z.ZodEnum<["5m", "1h"]>>;
    system: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodBoolean>;
    thinkingBudget: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    thinkingLevel: z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingLevel>>;
    stream: z.ZodOptional<z.ZodBoolean>;
    artifacts: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    examples: z.ZodOptional<z.ZodArray<z.ZodObject<{
        input: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
        output: z.ZodObject<{
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
        }, {
            content: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }, {
        input: {
            content: string;
        };
        output: {
            content: string;
        };
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    chatProjectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    resendFiles: z.ZodOptional<z.ZodBoolean>;
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    imageDetail: z.ZodOptional<z.ZodNativeEnum<typeof s.ImageDetail>>;
    reasoning_effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningEffort>>>;
    reasoning_summary: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ReasoningSummary>>>;
    verbosity: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.Verbosity>>>;
    useResponsesApi: z.ZodOptional<z.ZodBoolean>;
    effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.AnthropicEffort>>>;
    thinkingDisplay: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof s.ThinkingDisplay>>>;
    web_search: z.ZodOptional<z.ZodBoolean>;
    url_context: z.ZodOptional<z.ZodBoolean>;
    disableStreaming: z.ZodOptional<z.ZodBoolean>;
    assistant_id: z.ZodOptional<z.ZodString>;
    agent_id: z.ZodOptional<z.ZodString>;
    region: z.ZodOptional<z.ZodString>;
    maxTokens: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    additionalModelRequestFields: z.ZodOptional<z.ZodType<string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null, z.ZodTypeDef, string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null)[] | {
        [key: string]: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null)[] | /*elided*/ any | null;
    } | null>>;
    instructions: z.ZodOptional<z.ZodString>;
    additional_instructions: z.ZodOptional<z.ZodString>;
    append_current_datetime: z.ZodOptional<z.ZodBoolean>;
    presetOverride: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    greeting: z.ZodOptional<z.ZodString>;
    spec: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    iconURL: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expiredAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isTemporary: z.ZodOptional<z.ZodBoolean>;
    fileTokenLimit: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, number | undefined, string | number>>;
    resendImages: z.ZodOptional<z.ZodBoolean>;
    chatGptLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "model" | "modelLabel" | "promptPrefix" | "temperature" | "topP" | "topK" | "maxOutputTokens" | "maxContextTokens" | "promptCache" | "promptCacheTtl" | "thinking" | "thinkingBudget" | "artifacts" | "chatProjectId" | "resendFiles" | "reasoning_effort" | "effort" | "thinkingDisplay" | "region" | "maxTokens" | "additionalModelRequestFields" | "stop" | "greeting" | "spec" | "iconURL">, z.ZodAny, "strip">>>;
export declare const bedrockOutputParser: (data: Record<string, unknown>) => Record<string, unknown>;
