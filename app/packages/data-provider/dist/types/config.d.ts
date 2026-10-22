import { z } from 'zod';
import type { ZodError } from 'zod';
import type { TEndpointsConfig, TModelsConfig, TConfig } from './types';
import { EModelEndpoint } from './schemas';
import { ComponentTypes, SettingTypes, OptionTypes } from './generate';
import { TSpecsConfig } from './models';
import { FileSources } from './types/files';
export { MAX_SUBAGENTS } from './limits';
export declare const defaultSocialLogins: string[];
export declare const BASE_ONLY_CONFIG_SECTIONS: readonly [];
export declare const defaultRetrievalModels: string[];
export declare const excludedKeys: Set<string>;
export declare enum SettingsViews {
    default = "default",
    advanced = "advanced"
}
/** Validates any FileSources value — use for file metadata, DB records, and upload routing. */
export declare const fileSourceSchema: z.ZodNativeEnum<typeof FileSources>;
export declare const allowedAddressesSchema: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, "many">>;
export declare const fileStorageSchema: z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>;
export type FileStorage = z.infer<typeof fileStorageSchema>;
export declare const fileStrategiesSchema: z.ZodOptional<z.ZodObject<{
    default: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
    avatar: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
    image: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
    document: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
    skills: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
}, "strip", z.ZodTypeAny, {
    avatar?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    default?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    skills?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    image?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    document?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
}, {
    avatar?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    default?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    skills?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    image?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    document?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
}>>;
export declare const cloudfrontConfigSchema: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
    domain: z.ZodString;
    distributionId: z.ZodOptional<z.ZodString>;
    invalidateOnDelete: z.ZodDefault<z.ZodBoolean>;
    imageSigning: z.ZodDefault<z.ZodEnum<["none", "cookies", "url"]>>;
    urlExpiry: z.ZodDefault<z.ZodNumber>;
    cookieExpiry: z.ZodDefault<z.ZodNumber>;
    cookieDomain: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    storageRegion: z.ZodOptional<z.ZodString>;
    includeRegionInPath: z.ZodDefault<z.ZodBoolean>;
    requireSignedAccess: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    domain: string;
    invalidateOnDelete: boolean;
    imageSigning: "none" | "url" | "cookies";
    urlExpiry: number;
    cookieExpiry: number;
    includeRegionInPath: boolean;
    requireSignedAccess: boolean;
    distributionId?: string | undefined;
    cookieDomain?: string | undefined;
    storageRegion?: string | undefined;
}, {
    domain: string;
    distributionId?: string | undefined;
    invalidateOnDelete?: boolean | undefined;
    imageSigning?: "none" | "url" | "cookies" | undefined;
    urlExpiry?: number | undefined;
    cookieExpiry?: number | undefined;
    cookieDomain?: string | undefined;
    storageRegion?: string | undefined;
    includeRegionInPath?: boolean | undefined;
    requireSignedAccess?: boolean | undefined;
}>, {
    domain: string;
    invalidateOnDelete: boolean;
    imageSigning: "none" | "url" | "cookies";
    urlExpiry: number;
    cookieExpiry: number;
    includeRegionInPath: boolean;
    requireSignedAccess: boolean;
    distributionId?: string | undefined;
    cookieDomain?: string | undefined;
    storageRegion?: string | undefined;
}, {
    domain: string;
    distributionId?: string | undefined;
    invalidateOnDelete?: boolean | undefined;
    imageSigning?: "none" | "url" | "cookies" | undefined;
    urlExpiry?: number | undefined;
    cookieExpiry?: number | undefined;
    cookieDomain?: string | undefined;
    storageRegion?: string | undefined;
    includeRegionInPath?: boolean | undefined;
    requireSignedAccess?: boolean | undefined;
}>, {
    domain: string;
    invalidateOnDelete: boolean;
    imageSigning: "none" | "url" | "cookies";
    urlExpiry: number;
    cookieExpiry: number;
    includeRegionInPath: boolean;
    requireSignedAccess: boolean;
    distributionId?: string | undefined;
    cookieDomain?: string | undefined;
    storageRegion?: string | undefined;
}, {
    domain: string;
    distributionId?: string | undefined;
    invalidateOnDelete?: boolean | undefined;
    imageSigning?: "none" | "url" | "cookies" | undefined;
    urlExpiry?: number | undefined;
    cookieExpiry?: number | undefined;
    cookieDomain?: string | undefined;
    storageRegion?: string | undefined;
    includeRegionInPath?: boolean | undefined;
    requireSignedAccess?: boolean | undefined;
}>, {
    domain: string;
    invalidateOnDelete: boolean;
    imageSigning: "none" | "url" | "cookies";
    urlExpiry: number;
    cookieExpiry: number;
    includeRegionInPath: boolean;
    requireSignedAccess: boolean;
    distributionId?: string | undefined;
    cookieDomain?: string | undefined;
    storageRegion?: string | undefined;
}, {
    domain: string;
    distributionId?: string | undefined;
    invalidateOnDelete?: boolean | undefined;
    imageSigning?: "none" | "url" | "cookies" | undefined;
    urlExpiry?: number | undefined;
    cookieExpiry?: number | undefined;
    cookieDomain?: string | undefined;
    storageRegion?: string | undefined;
    includeRegionInPath?: boolean | undefined;
    requireSignedAccess?: boolean | undefined;
}>>;
export type CloudFrontConfig = z.infer<typeof cloudfrontConfigSchema>;
export declare const SKILL_SYNC_MIN_INTERVAL_MINUTES = 5;
export declare const SKILL_SYNC_MAX_INTERVAL_MINUTES: number;
export declare const SKILL_SYNC_DEFAULT_DISCOVERY_DEPTH = 2;
export declare const SKILL_SYNC_MAX_DISCOVERY_DEPTH = 10;
export declare const skillSyncGitHubSourceSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    owner: z.ZodString;
    repo: z.ZodString;
    ref: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, string, string>>;
    paths: z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, "many">;
    skillDiscoveryDepth: z.ZodOptional<z.ZodNumber>;
    credentialKey: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    tenantId: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
}, "strip", z.ZodTypeAny, {
    owner: string;
    id: string;
    repo: string;
    ref: string;
    paths: string[];
    token?: string | undefined;
    skillDiscoveryDepth?: number | undefined;
    credentialKey?: string | undefined;
    tenantId?: string | undefined;
}, {
    owner: string;
    id: string;
    repo: string;
    paths: string[];
    token?: string | undefined;
    ref?: string | undefined;
    skillDiscoveryDepth?: number | undefined;
    credentialKey?: string | undefined;
    tenantId?: string | undefined;
}>, {
    owner: string;
    id: string;
    repo: string;
    ref: string;
    paths: string[];
    token?: string | undefined;
    skillDiscoveryDepth?: number | undefined;
    credentialKey?: string | undefined;
    tenantId?: string | undefined;
}, {
    owner: string;
    id: string;
    repo: string;
    paths: string[];
    token?: string | undefined;
    ref?: string | undefined;
    skillDiscoveryDepth?: number | undefined;
    credentialKey?: string | undefined;
    tenantId?: string | undefined;
}>;
export declare const skillSyncConfigSchema: z.ZodOptional<z.ZodObject<{
    github: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        intervalMinutes: z.ZodDefault<z.ZodNumber>;
        runOnStartup: z.ZodDefault<z.ZodBoolean>;
        sources: z.ZodDefault<z.ZodArray<z.ZodEffects<z.ZodObject<{
            id: z.ZodString;
            owner: z.ZodString;
            repo: z.ZodString;
            ref: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, string, string>>;
            paths: z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, "many">;
            skillDiscoveryDepth: z.ZodOptional<z.ZodNumber>;
            credentialKey: z.ZodOptional<z.ZodString>;
            token: z.ZodOptional<z.ZodString>;
            tenantId: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        }, "strip", z.ZodTypeAny, {
            owner: string;
            id: string;
            repo: string;
            ref: string;
            paths: string[];
            token?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }, {
            owner: string;
            id: string;
            repo: string;
            paths: string[];
            token?: string | undefined;
            ref?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }>, {
            owner: string;
            id: string;
            repo: string;
            ref: string;
            paths: string[];
            token?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }, {
            owner: string;
            id: string;
            repo: string;
            paths: string[];
            token?: string | undefined;
            ref?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        intervalMinutes: number;
        runOnStartup: boolean;
        sources: {
            owner: string;
            id: string;
            repo: string;
            ref: string;
            paths: string[];
            token?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }[];
    }, {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        runOnStartup?: boolean | undefined;
        sources?: {
            owner: string;
            id: string;
            repo: string;
            paths: string[];
            token?: string | undefined;
            ref?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }[] | undefined;
    }>, {
        enabled: boolean;
        intervalMinutes: number;
        runOnStartup: boolean;
        sources: {
            owner: string;
            id: string;
            repo: string;
            ref: string;
            paths: string[];
            token?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }[];
    }, {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        runOnStartup?: boolean | undefined;
        sources?: {
            owner: string;
            id: string;
            repo: string;
            paths: string[];
            token?: string | undefined;
            ref?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    github?: {
        enabled: boolean;
        intervalMinutes: number;
        runOnStartup: boolean;
        sources: {
            owner: string;
            id: string;
            repo: string;
            ref: string;
            paths: string[];
            token?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }[];
    } | undefined;
}, {
    github?: {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        runOnStartup?: boolean | undefined;
        sources?: {
            owner: string;
            id: string;
            repo: string;
            paths: string[];
            token?: string | undefined;
            ref?: string | undefined;
            skillDiscoveryDepth?: number | undefined;
            credentialKey?: string | undefined;
            tenantId?: string | undefined;
        }[] | undefined;
    } | undefined;
}>>;
export type SkillSyncConfig = z.infer<typeof skillSyncConfigSchema>;
export type SkillSyncGitHubSourceConfig = z.infer<typeof skillSyncGitHubSourceSchema>;
type SchemaShape<T> = T extends z.ZodObject<infer U> ? U : never;
type DefaultValue<T> = T extends z.ZodDefault<z.ZodTypeAny> ? ReturnType<T['_def']['defaultValue']> : undefined;
type ExtractDefaults<T> = {
    [P in keyof T]: DefaultValue<T[P]>;
};
export type SchemaDefaults<T> = ExtractDefaults<SchemaShape<T>>;
export type TConfigDefaults = SchemaDefaults<typeof configSchema>;
export declare function getSchemaDefaults<Schema extends z.AnyZodObject>(schema: Schema): ExtractDefaults<SchemaShape<Schema>>;
export declare const modelConfigSchema: z.ZodUnion<[z.ZodObject<{
    deploymentName: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    assistants: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    assistants?: boolean | undefined;
    version?: string | undefined;
    deploymentName?: string | undefined;
}, {
    assistants?: boolean | undefined;
    version?: string | undefined;
    deploymentName?: string | undefined;
}>, z.ZodBoolean]>;
export type TAzureModelConfig = z.infer<typeof modelConfigSchema>;
export declare const azureBaseSchema: z.ZodObject<{
    apiKey: z.ZodString;
    serverless: z.ZodOptional<z.ZodBoolean>;
    instanceName: z.ZodOptional<z.ZodString>;
    deploymentName: z.ZodOptional<z.ZodString>;
    assistants: z.ZodOptional<z.ZodBoolean>;
    addParams: z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>;
    dropParams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    version: z.ZodOptional<z.ZodString>;
    baseURL: z.ZodOptional<z.ZodString>;
    additionalHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    assistants?: boolean | undefined;
    version?: string | undefined;
    baseURL?: string | undefined;
    instanceName?: string | undefined;
    deploymentName?: string | undefined;
    serverless?: boolean | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    additionalHeaders?: Record<string, string> | undefined;
}, {
    apiKey: string;
    assistants?: boolean | undefined;
    version?: string | undefined;
    baseURL?: string | undefined;
    instanceName?: string | undefined;
    deploymentName?: string | undefined;
    serverless?: boolean | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    additionalHeaders?: Record<string, string> | undefined;
}>;
export type TAzureBaseSchema = z.infer<typeof azureBaseSchema>;
export declare const azureGroupSchema: z.ZodIntersection<z.ZodObject<{
    group: z.ZodString;
    models: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        deploymentName: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        assistants: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        assistants?: boolean | undefined;
        version?: string | undefined;
        deploymentName?: string | undefined;
    }, {
        assistants?: boolean | undefined;
        version?: string | undefined;
        deploymentName?: string | undefined;
    }>, z.ZodBoolean]>>;
}, "strip", z.ZodTypeAny, {
    group: string;
    models: Record<string, boolean | {
        assistants?: boolean | undefined;
        version?: string | undefined;
        deploymentName?: string | undefined;
    }>;
}, {
    group: string;
    models: Record<string, boolean | {
        assistants?: boolean | undefined;
        version?: string | undefined;
        deploymentName?: string | undefined;
    }>;
}>, z.ZodObject<{
    apiKey: z.ZodString;
    serverless: z.ZodOptional<z.ZodBoolean>;
    instanceName: z.ZodOptional<z.ZodString>;
    deploymentName: z.ZodOptional<z.ZodString>;
    assistants: z.ZodOptional<z.ZodBoolean>;
    addParams: z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>;
    dropParams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    version: z.ZodOptional<z.ZodString>;
    baseURL: z.ZodOptional<z.ZodString>;
    additionalHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    assistants?: boolean | undefined;
    version?: string | undefined;
    baseURL?: string | undefined;
    instanceName?: string | undefined;
    deploymentName?: string | undefined;
    serverless?: boolean | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    additionalHeaders?: Record<string, string> | undefined;
}, {
    apiKey: string;
    assistants?: boolean | undefined;
    version?: string | undefined;
    baseURL?: string | undefined;
    instanceName?: string | undefined;
    deploymentName?: string | undefined;
    serverless?: boolean | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    additionalHeaders?: Record<string, string> | undefined;
}>>;
export declare const azureGroupConfigsSchema: z.ZodArray<z.ZodIntersection<z.ZodObject<{
    group: z.ZodString;
    models: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        deploymentName: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        assistants: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        assistants?: boolean | undefined;
        version?: string | undefined;
        deploymentName?: string | undefined;
    }, {
        assistants?: boolean | undefined;
        version?: string | undefined;
        deploymentName?: string | undefined;
    }>, z.ZodBoolean]>>;
}, "strip", z.ZodTypeAny, {
    group: string;
    models: Record<string, boolean | {
        assistants?: boolean | undefined;
        version?: string | undefined;
        deploymentName?: string | undefined;
    }>;
}, {
    group: string;
    models: Record<string, boolean | {
        assistants?: boolean | undefined;
        version?: string | undefined;
        deploymentName?: string | undefined;
    }>;
}>, z.ZodObject<{
    apiKey: z.ZodString;
    serverless: z.ZodOptional<z.ZodBoolean>;
    instanceName: z.ZodOptional<z.ZodString>;
    deploymentName: z.ZodOptional<z.ZodString>;
    assistants: z.ZodOptional<z.ZodBoolean>;
    addParams: z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>;
    dropParams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    version: z.ZodOptional<z.ZodString>;
    baseURL: z.ZodOptional<z.ZodString>;
    additionalHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    assistants?: boolean | undefined;
    version?: string | undefined;
    baseURL?: string | undefined;
    instanceName?: string | undefined;
    deploymentName?: string | undefined;
    serverless?: boolean | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    additionalHeaders?: Record<string, string> | undefined;
}, {
    apiKey: string;
    assistants?: boolean | undefined;
    version?: string | undefined;
    baseURL?: string | undefined;
    instanceName?: string | undefined;
    deploymentName?: string | undefined;
    serverless?: boolean | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    additionalHeaders?: Record<string, string> | undefined;
}>>, "many">;
export type TAzureGroup = z.infer<typeof azureGroupSchema>;
export type TAzureGroups = z.infer<typeof azureGroupConfigsSchema>;
export type TAzureModelMapSchema = {
    group: string;
};
export type TAzureModelGroupMap = Record<string, TAzureModelMapSchema | undefined>;
export type TAzureGroupMap = Record<string, (TAzureBaseSchema & {
    models: Record<string, TAzureModelConfig | undefined>;
}) | undefined>;
export type TValidatedAzureConfig = {
    modelNames: string[];
    groupMap: TAzureGroupMap;
    assistantModels?: string[];
    assistantGroups?: string[];
    modelGroupMap: TAzureModelGroupMap;
};
export type TAzureConfigValidationResult = TValidatedAzureConfig & {
    isValid: boolean;
    errors: (ZodError | string)[];
};
export declare enum Capabilities {
    code_interpreter = "code_interpreter",
    image_vision = "image_vision",
    retrieval = "retrieval",
    actions = "actions",
    tools = "tools"
}
export declare enum AgentCapabilities {
    hide_sequential_outputs = "hide_sequential_outputs",
    programmatic_tools = "programmatic_tools",
    end_after_tools = "end_after_tools",
    deferred_tools = "deferred_tools",
    execute_code = "execute_code",
    file_search = "file_search",
    web_search = "web_search",
    artifacts = "artifacts",
    subagents = "subagents",
    actions = "actions",
    context = "context",
    skills = "skills",
    tools = "tools",
    chain = "chain",
    ocr = "ocr"
}
export declare const defaultAssistantsVersion: {
    assistants: number;
    azureAssistants: number;
};
export declare const baseEndpointSchema: z.ZodObject<{
    streamRate: z.ZodOptional<z.ZodNumber>;
    baseURL: z.ZodOptional<z.ZodString>;
    /**
     * Custom request headers forwarded to the provider on every request. Values
     * support the same placeholder resolution as custom endpoints — env vars
     * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
     * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
     * providers through an AI gateway / reverse proxy that consumes metadata
     * headers (provider-native request shaping is preserved).
     */
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    titlePrompt: z.ZodOptional<z.ZodString>;
    titleModel: z.ZodOptional<z.ZodString>;
    titleConvo: z.ZodOptional<z.ZodBoolean>;
    titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
    titleEndpoint: z.ZodOptional<z.ZodString>;
    titlePromptTemplate: z.ZodOptional<z.ZodString>;
    /**
     * When conversation titles are generated. `immediate` (default) generates the
     * title as soon as the request is made, in parallel with the response, from the
     * user's first message. `final` defers generation until the full response
     * completes (legacy behavior).
     */
    titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
    /** Maximum characters allowed in a single tool result before truncation. */
    maxToolResultChars: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
}, {
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
}>;
export type TBaseEndpoint = z.infer<typeof baseEndpointSchema>;
export declare const bedrockGuardrailConfigSchema: z.ZodObject<{
    guardrailIdentifier: z.ZodString;
    guardrailVersion: z.ZodString;
    trace: z.ZodOptional<z.ZodEnum<["enabled", "disabled", "enabled_full"]>>;
    streamProcessingMode: z.ZodOptional<z.ZodEnum<["sync", "async"]>>;
}, "strip", z.ZodTypeAny, {
    guardrailIdentifier: string;
    guardrailVersion: string;
    trace?: "enabled" | "disabled" | "enabled_full" | undefined;
    streamProcessingMode?: "sync" | "async" | undefined;
}, {
    guardrailIdentifier: string;
    guardrailVersion: string;
    trace?: "enabled" | "disabled" | "enabled_full" | undefined;
    streamProcessingMode?: "sync" | "async" | undefined;
}>;
export declare const bedrockEndpointSchema: z.ZodObject<{
    streamRate: z.ZodOptional<z.ZodNumber>;
    baseURL: z.ZodOptional<z.ZodString>;
    /**
     * Custom request headers forwarded to the provider on every request. Values
     * support the same placeholder resolution as custom endpoints — env vars
     * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
     * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
     * providers through an AI gateway / reverse proxy that consumes metadata
     * headers (provider-native request shaping is preserved).
     */
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    titlePrompt: z.ZodOptional<z.ZodString>;
    titleModel: z.ZodOptional<z.ZodString>;
    titleConvo: z.ZodOptional<z.ZodBoolean>;
    titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
    titleEndpoint: z.ZodOptional<z.ZodString>;
    titlePromptTemplate: z.ZodOptional<z.ZodString>;
    /**
     * When conversation titles are generated. `immediate` (default) generates the
     * title as soon as the request is made, in parallel with the response, from the
     * user's first message. `final` defers generation until the full response
     * completes (legacy behavior).
     */
    titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
    /** Maximum characters allowed in a single tool result before truncation. */
    maxToolResultChars: z.ZodOptional<z.ZodNumber>;
} & {
    availableRegions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    models: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    guardrailConfig: z.ZodOptional<z.ZodObject<{
        guardrailIdentifier: z.ZodString;
        guardrailVersion: z.ZodString;
        trace: z.ZodOptional<z.ZodEnum<["enabled", "disabled", "enabled_full"]>>;
        streamProcessingMode: z.ZodOptional<z.ZodEnum<["sync", "async"]>>;
    }, "strip", z.ZodTypeAny, {
        guardrailIdentifier: string;
        guardrailVersion: string;
        trace?: "enabled" | "disabled" | "enabled_full" | undefined;
        streamProcessingMode?: "sync" | "async" | undefined;
    }, {
        guardrailIdentifier: string;
        guardrailVersion: string;
        trace?: "enabled" | "disabled" | "enabled_full" | undefined;
        streamProcessingMode?: "sync" | "async" | undefined;
    }>>;
    inferenceProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    models?: string[] | undefined;
    availableRegions?: string[] | undefined;
    guardrailConfig?: {
        guardrailIdentifier: string;
        guardrailVersion: string;
        trace?: "enabled" | "disabled" | "enabled_full" | undefined;
        streamProcessingMode?: "sync" | "async" | undefined;
    } | undefined;
    inferenceProfiles?: Record<string, string> | undefined;
}, {
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    models?: string[] | undefined;
    availableRegions?: string[] | undefined;
    guardrailConfig?: {
        guardrailIdentifier: string;
        guardrailVersion: string;
        trace?: "enabled" | "disabled" | "enabled_full" | undefined;
        streamProcessingMode?: "sync" | "async" | undefined;
    } | undefined;
    inferenceProfiles?: Record<string, string> | undefined;
}>;
export declare const assistantEndpointSchema: z.ZodObject<{
    streamRate: z.ZodOptional<z.ZodNumber>;
    baseURL: z.ZodOptional<z.ZodString>;
    titlePrompt: z.ZodOptional<z.ZodString>;
    titleModel: z.ZodOptional<z.ZodString>;
    titleConvo: z.ZodOptional<z.ZodBoolean>;
    titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
    titleEndpoint: z.ZodOptional<z.ZodString>;
    titlePromptTemplate: z.ZodOptional<z.ZodString>;
    titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
    maxToolResultChars: z.ZodOptional<z.ZodNumber>;
} & {
    disableBuilder: z.ZodOptional<z.ZodBoolean>;
    pollIntervalMs: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    version: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    supportedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    excludedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    privateAssistants: z.ZodOptional<z.ZodBoolean>;
    retrievalModels: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    capabilities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof Capabilities>, "many">>>;
    apiKey: z.ZodOptional<z.ZodString>;
    models: z.ZodOptional<z.ZodObject<{
        default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description?: string | undefined;
        }, {
            name: string;
            description?: string | undefined;
        }>]>, "many">;
        fetch: z.ZodOptional<z.ZodBoolean>;
        userIdQuery: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    }, {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    }>>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    version: string | number;
    retrievalModels: string[];
    capabilities: Capabilities[];
    apiKey?: string | undefined;
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    models?: {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    } | undefined;
    disableBuilder?: boolean | undefined;
    pollIntervalMs?: number | undefined;
    timeoutMs?: number | undefined;
    supportedIds?: string[] | undefined;
    excludedIds?: string[] | undefined;
    privateAssistants?: boolean | undefined;
}, {
    version?: string | number | undefined;
    apiKey?: string | undefined;
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    models?: {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    } | undefined;
    disableBuilder?: boolean | undefined;
    pollIntervalMs?: number | undefined;
    timeoutMs?: number | undefined;
    supportedIds?: string[] | undefined;
    excludedIds?: string[] | undefined;
    privateAssistants?: boolean | undefined;
    retrievalModels?: string[] | undefined;
    capabilities?: Capabilities[] | undefined;
}>;
export type TAssistantEndpoint = z.infer<typeof assistantEndpointSchema>;
export declare const defaultAgentCapabilities: AgentCapabilities[];
export declare function isRemoteOidcUrlAllowed(value: string): boolean;
export declare const agentsEndpointSchema: z.ZodDefault<z.ZodObject<Omit<{
    streamRate: z.ZodOptional<z.ZodNumber>;
    baseURL: z.ZodOptional<z.ZodString>;
    /**
     * Custom request headers forwarded to the provider on every request. Values
     * support the same placeholder resolution as custom endpoints — env vars
     * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
     * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
     * providers through an AI gateway / reverse proxy that consumes metadata
     * headers (provider-native request shaping is preserved).
     */
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    titlePrompt: z.ZodOptional<z.ZodString>;
    titleModel: z.ZodOptional<z.ZodString>;
    titleConvo: z.ZodOptional<z.ZodBoolean>;
    titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
    titleEndpoint: z.ZodOptional<z.ZodString>;
    titlePromptTemplate: z.ZodOptional<z.ZodString>;
    /**
     * When conversation titles are generated. `immediate` (default) generates the
     * title as soon as the request is made, in parallel with the response, from the
     * user's first message. `final` defers generation until the full response
     * completes (legacy behavior).
     */
    titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
    /** Maximum characters allowed in a single tool result before truncation. */
    maxToolResultChars: z.ZodOptional<z.ZodNumber>;
}, "baseURL"> & {
    recursionLimit: z.ZodOptional<z.ZodNumber>;
    disableBuilder: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    maxRecursionLimit: z.ZodOptional<z.ZodNumber>;
    maxCitations: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    maxCitationsPerFile: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    minRelevanceScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    allowedProviders: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>, "many">>;
    capabilities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof AgentCapabilities>, "many">>>;
    skills: z.ZodOptional<z.ZodObject<{
        maxCatalogSkills: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxCatalogSkills?: number | undefined;
    }, {
        maxCatalogSkills?: number | undefined;
    }>>;
    remoteApi: z.ZodOptional<z.ZodObject<{
        auth: z.ZodOptional<z.ZodObject<{
            apiKey: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                enabled: boolean;
            }, {
                enabled?: boolean | undefined;
            }>>;
            oidc: z.ZodOptional<z.ZodEffects<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                issuer: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                audience: z.ZodOptional<z.ZodString>;
                jwksUri: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                scope: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            }, "strip", z.ZodTypeAny, {
                enabled: boolean;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            }, {
                enabled?: boolean | undefined;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            }>, {
                enabled: boolean;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            }, {
                enabled?: boolean | undefined;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            apiKey?: {
                enabled: boolean;
            } | undefined;
            oidc?: {
                enabled: boolean;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            } | undefined;
        }, {
            apiKey?: {
                enabled?: boolean | undefined;
            } | undefined;
            oidc?: {
                enabled?: boolean | undefined;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        auth?: {
            apiKey?: {
                enabled: boolean;
            } | undefined;
            oidc?: {
                enabled: boolean;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            } | undefined;
        } | undefined;
    }, {
        auth?: {
            apiKey?: {
                enabled?: boolean | undefined;
            } | undefined;
            oidc?: {
                enabled?: boolean | undefined;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            } | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    disableBuilder: boolean;
    capabilities: AgentCapabilities[];
    maxCitations: number;
    maxCitationsPerFile: number;
    minRelevanceScore: number;
    skills?: {
        maxCatalogSkills?: number | undefined;
    } | undefined;
    headers?: Record<string, string> | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    recursionLimit?: number | undefined;
    maxRecursionLimit?: number | undefined;
    allowedProviders?: string[] | undefined;
    remoteApi?: {
        auth?: {
            apiKey?: {
                enabled: boolean;
            } | undefined;
            oidc?: {
                enabled: boolean;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    skills?: {
        maxCatalogSkills?: number | undefined;
    } | undefined;
    headers?: Record<string, string> | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    disableBuilder?: boolean | undefined;
    capabilities?: AgentCapabilities[] | undefined;
    recursionLimit?: number | undefined;
    maxRecursionLimit?: number | undefined;
    maxCitations?: number | undefined;
    maxCitationsPerFile?: number | undefined;
    minRelevanceScore?: number | undefined;
    allowedProviders?: string[] | undefined;
    remoteApi?: {
        auth?: {
            apiKey?: {
                enabled?: boolean | undefined;
            } | undefined;
            oidc?: {
                enabled?: boolean | undefined;
                scope?: string | undefined;
                audience?: string | undefined;
                issuer?: string | undefined;
                jwksUri?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
}>>;
export type TAgentsEndpoint = z.infer<typeof agentsEndpointSchema>;
export declare const paramDefinitionSchema: z.ZodObject<{
    key: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof SettingTypes>>;
    default: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    showLabel: z.ZodOptional<z.ZodBoolean>;
    showDefault: z.ZodOptional<z.ZodBoolean>;
    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    range: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
        step: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max: number;
        min: number;
        step?: number | undefined;
    }, {
        max: number;
        min: number;
        step?: number | undefined;
    }>>;
    enumMappings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString]>>>;
    component: z.ZodOptional<z.ZodNativeEnum<typeof ComponentTypes>>;
    optionType: z.ZodOptional<z.ZodNativeEnum<typeof OptionTypes>>;
    columnSpan: z.ZodOptional<z.ZodNumber>;
    columns: z.ZodOptional<z.ZodNumber>;
    label: z.ZodOptional<z.ZodString>;
    placeholder: z.ZodOptional<z.ZodString>;
    labelCode: z.ZodOptional<z.ZodBoolean>;
    placeholderCode: z.ZodOptional<z.ZodBoolean>;
    descriptionCode: z.ZodOptional<z.ZodBoolean>;
    minText: z.ZodOptional<z.ZodNumber>;
    maxText: z.ZodOptional<z.ZodNumber>;
    minTags: z.ZodOptional<z.ZodNumber>;
    maxTags: z.ZodOptional<z.ZodNumber>;
    includeInput: z.ZodOptional<z.ZodBoolean>;
    descriptionSide: z.ZodOptional<z.ZodEnum<["top", "right", "bottom", "left"]>>;
    searchPlaceholder: z.ZodOptional<z.ZodString>;
    selectPlaceholder: z.ZodOptional<z.ZodString>;
    searchPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
    selectPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    key: string;
    type?: SettingTypes | undefined;
    options?: string[] | undefined;
    description?: string | undefined;
    label?: string | undefined;
    component?: ComponentTypes | undefined;
    default?: string | number | boolean | string[] | undefined;
    range?: {
        max: number;
        min: number;
        step?: number | undefined;
    } | undefined;
    minText?: number | undefined;
    maxText?: number | undefined;
    minTags?: number | undefined;
    maxTags?: number | undefined;
    columns?: number | undefined;
    showLabel?: boolean | undefined;
    showDefault?: boolean | undefined;
    enumMappings?: Record<string, string | number | boolean> | undefined;
    optionType?: OptionTypes | undefined;
    columnSpan?: number | undefined;
    placeholder?: string | undefined;
    labelCode?: boolean | undefined;
    placeholderCode?: boolean | undefined;
    descriptionCode?: boolean | undefined;
    includeInput?: boolean | undefined;
    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
    searchPlaceholder?: string | undefined;
    selectPlaceholder?: string | undefined;
    searchPlaceholderCode?: boolean | undefined;
    selectPlaceholderCode?: boolean | undefined;
}, {
    key: string;
    type?: SettingTypes | undefined;
    options?: string[] | undefined;
    description?: string | undefined;
    label?: string | undefined;
    component?: ComponentTypes | undefined;
    default?: string | number | boolean | string[] | undefined;
    range?: {
        max: number;
        min: number;
        step?: number | undefined;
    } | undefined;
    minText?: number | undefined;
    maxText?: number | undefined;
    minTags?: number | undefined;
    maxTags?: number | undefined;
    columns?: number | undefined;
    showLabel?: boolean | undefined;
    showDefault?: boolean | undefined;
    enumMappings?: Record<string, string | number | boolean> | undefined;
    optionType?: OptionTypes | undefined;
    columnSpan?: number | undefined;
    placeholder?: string | undefined;
    labelCode?: boolean | undefined;
    placeholderCode?: boolean | undefined;
    descriptionCode?: boolean | undefined;
    includeInput?: boolean | undefined;
    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
    searchPlaceholder?: string | undefined;
    selectPlaceholder?: string | undefined;
    searchPlaceholderCode?: boolean | undefined;
    selectPlaceholderCode?: boolean | undefined;
}>;
export declare const endpointSchema: z.ZodObject<{
    streamRate: z.ZodOptional<z.ZodNumber>;
    titlePrompt: z.ZodOptional<z.ZodString>;
    titleModel: z.ZodOptional<z.ZodString>;
    titleConvo: z.ZodOptional<z.ZodBoolean>;
    titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
    titleEndpoint: z.ZodOptional<z.ZodString>;
    titlePromptTemplate: z.ZodOptional<z.ZodString>;
    titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
    maxToolResultChars: z.ZodOptional<z.ZodNumber>;
} & {
    name: z.ZodEffects<z.ZodString, string, string>;
    apiKey: z.ZodString;
    baseURL: z.ZodString;
    models: z.ZodObject<{
        default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description?: string | undefined;
        }, {
            name: string;
            description?: string | undefined;
        }>]>, "many">;
        fetch: z.ZodOptional<z.ZodBoolean>;
        userIdQuery: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    }, {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    }>;
    iconURL: z.ZodOptional<z.ZodString>;
    modelDisplayLabel: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodLiteral<EModelEndpoint.anthropic>>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    addParams: z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>;
    dropParams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    customParams: z.ZodOptional<z.ZodObject<{
        defaultParamsEndpoint: z.ZodDefault<z.ZodString>;
        reasoningFormat: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningParameterFormat>>;
        reasoningKey: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningResponseKey>>;
        /** Replays `reasoning_content` within a run's tool-call turns (e.g. Xiaomi MiMo, Kimi). */
        includeReasoningContent: z.ZodOptional<z.ZodBoolean>;
        /** Also reconstructs `reasoning_content` from persisted history across turns (implies `includeReasoningContent`). */
        includeReasoningHistory: z.ZodOptional<z.ZodBoolean>;
        paramDefinitions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodNativeEnum<typeof SettingTypes>>;
            default: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            showLabel: z.ZodOptional<z.ZodBoolean>;
            showDefault: z.ZodOptional<z.ZodBoolean>;
            options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            range: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
                step: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                max: number;
                min: number;
                step?: number | undefined;
            }, {
                max: number;
                min: number;
                step?: number | undefined;
            }>>;
            enumMappings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString]>>>;
            component: z.ZodOptional<z.ZodNativeEnum<typeof ComponentTypes>>;
            optionType: z.ZodOptional<z.ZodNativeEnum<typeof OptionTypes>>;
            columnSpan: z.ZodOptional<z.ZodNumber>;
            columns: z.ZodOptional<z.ZodNumber>;
            label: z.ZodOptional<z.ZodString>;
            placeholder: z.ZodOptional<z.ZodString>;
            labelCode: z.ZodOptional<z.ZodBoolean>;
            placeholderCode: z.ZodOptional<z.ZodBoolean>;
            descriptionCode: z.ZodOptional<z.ZodBoolean>;
            minText: z.ZodOptional<z.ZodNumber>;
            maxText: z.ZodOptional<z.ZodNumber>;
            minTags: z.ZodOptional<z.ZodNumber>;
            maxTags: z.ZodOptional<z.ZodNumber>;
            includeInput: z.ZodOptional<z.ZodBoolean>;
            descriptionSide: z.ZodOptional<z.ZodEnum<["top", "right", "bottom", "left"]>>;
            searchPlaceholder: z.ZodOptional<z.ZodString>;
            selectPlaceholder: z.ZodOptional<z.ZodString>;
            searchPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
            selectPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }, {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        defaultParamsEndpoint: string;
        reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
        reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
        includeReasoningContent?: boolean | undefined;
        includeReasoningHistory?: boolean | undefined;
        paramDefinitions?: {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }[] | undefined;
    }, {
        defaultParamsEndpoint?: string | undefined;
        reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
        reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
        includeReasoningContent?: boolean | undefined;
        includeReasoningHistory?: boolean | undefined;
        paramDefinitions?: {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }[] | undefined;
    }>>;
    directEndpoint: z.ZodOptional<z.ZodBoolean>;
    titleMessageRole: z.ZodOptional<z.ZodEnum<["system", "user", "assistant"]>>;
    tokenConfig: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        prompt: z.ZodNumber;
        completion: z.ZodNumber;
        context: z.ZodNumber;
        cacheRead: z.ZodOptional<z.ZodNumber>;
        cacheWrite: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        context: number;
        prompt: number;
        completion: number;
        cacheRead?: number | undefined;
        cacheWrite?: number | undefined;
    }, {
        context: number;
        prompt: number;
        completion: number;
        cacheRead?: number | undefined;
        cacheWrite?: number | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    apiKey: string;
    baseURL: string;
    models: {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    };
    iconURL?: string | undefined;
    headers?: Record<string, string> | undefined;
    provider?: EModelEndpoint.anthropic | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    modelDisplayLabel?: string | undefined;
    customParams?: {
        defaultParamsEndpoint: string;
        reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
        reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
        includeReasoningContent?: boolean | undefined;
        includeReasoningHistory?: boolean | undefined;
        paramDefinitions?: {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }[] | undefined;
    } | undefined;
    directEndpoint?: boolean | undefined;
    titleMessageRole?: "user" | "system" | "assistant" | undefined;
    tokenConfig?: Record<string, {
        context: number;
        prompt: number;
        completion: number;
        cacheRead?: number | undefined;
        cacheWrite?: number | undefined;
    }> | undefined;
}, {
    name: string;
    apiKey: string;
    baseURL: string;
    models: {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    };
    iconURL?: string | undefined;
    headers?: Record<string, string> | undefined;
    provider?: EModelEndpoint.anthropic | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    modelDisplayLabel?: string | undefined;
    customParams?: {
        defaultParamsEndpoint?: string | undefined;
        reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
        reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
        includeReasoningContent?: boolean | undefined;
        includeReasoningHistory?: boolean | undefined;
        paramDefinitions?: {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }[] | undefined;
    } | undefined;
    directEndpoint?: boolean | undefined;
    titleMessageRole?: "user" | "system" | "assistant" | undefined;
    tokenConfig?: Record<string, {
        context: number;
        prompt: number;
        completion: number;
        cacheRead?: number | undefined;
        cacheWrite?: number | undefined;
    }> | undefined;
}>;
export type TEndpoint = z.infer<typeof endpointSchema>;
export declare const azureEndpointSchema: z.ZodIntersection<z.ZodObject<{
    groups: z.ZodArray<z.ZodIntersection<z.ZodObject<{
        group: z.ZodString;
        models: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
            deploymentName: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            assistants: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            assistants?: boolean | undefined;
            version?: string | undefined;
            deploymentName?: string | undefined;
        }, {
            assistants?: boolean | undefined;
            version?: string | undefined;
            deploymentName?: string | undefined;
        }>, z.ZodBoolean]>>;
    }, "strip", z.ZodTypeAny, {
        group: string;
        models: Record<string, boolean | {
            assistants?: boolean | undefined;
            version?: string | undefined;
            deploymentName?: string | undefined;
        }>;
    }, {
        group: string;
        models: Record<string, boolean | {
            assistants?: boolean | undefined;
            version?: string | undefined;
            deploymentName?: string | undefined;
        }>;
    }>, z.ZodObject<{
        apiKey: z.ZodString;
        serverless: z.ZodOptional<z.ZodBoolean>;
        instanceName: z.ZodOptional<z.ZodString>;
        deploymentName: z.ZodOptional<z.ZodString>;
        assistants: z.ZodOptional<z.ZodBoolean>;
        addParams: z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>;
        dropParams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        version: z.ZodOptional<z.ZodString>;
        baseURL: z.ZodOptional<z.ZodString>;
        additionalHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        apiKey: string;
        assistants?: boolean | undefined;
        version?: string | undefined;
        baseURL?: string | undefined;
        instanceName?: string | undefined;
        deploymentName?: string | undefined;
        serverless?: boolean | undefined;
        addParams?: Record<string, unknown> | undefined;
        dropParams?: string[] | undefined;
        additionalHeaders?: Record<string, string> | undefined;
    }, {
        apiKey: string;
        assistants?: boolean | undefined;
        version?: string | undefined;
        baseURL?: string | undefined;
        instanceName?: string | undefined;
        deploymentName?: string | undefined;
        serverless?: boolean | undefined;
        addParams?: Record<string, unknown> | undefined;
        dropParams?: string[] | undefined;
        additionalHeaders?: Record<string, string> | undefined;
    }>>, "many">;
    assistants: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    groups: ({
        group: string;
        models: Record<string, boolean | {
            assistants?: boolean | undefined;
            version?: string | undefined;
            deploymentName?: string | undefined;
        }>;
    } & {
        apiKey: string;
        assistants?: boolean | undefined;
        version?: string | undefined;
        baseURL?: string | undefined;
        instanceName?: string | undefined;
        deploymentName?: string | undefined;
        serverless?: boolean | undefined;
        addParams?: Record<string, unknown> | undefined;
        dropParams?: string[] | undefined;
        additionalHeaders?: Record<string, string> | undefined;
    })[];
    assistants?: boolean | undefined;
}, {
    groups: ({
        group: string;
        models: Record<string, boolean | {
            assistants?: boolean | undefined;
            version?: string | undefined;
            deploymentName?: string | undefined;
        }>;
    } & {
        apiKey: string;
        assistants?: boolean | undefined;
        version?: string | undefined;
        baseURL?: string | undefined;
        instanceName?: string | undefined;
        deploymentName?: string | undefined;
        serverless?: boolean | undefined;
        addParams?: Record<string, unknown> | undefined;
        dropParams?: string[] | undefined;
        additionalHeaders?: Record<string, string> | undefined;
    })[];
    assistants?: boolean | undefined;
}>, z.ZodObject<{
    streamRate: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    titlePrompt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    titleModel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    titleConvo: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    titleMethod: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>>;
    titlePromptTemplate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    titleTiming: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>>;
}, "strip", z.ZodTypeAny, {
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
}, {
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
}>>;
export type TAzureConfig = Omit<z.infer<typeof azureEndpointSchema>, 'groups'> & TAzureConfigValidationResult;
/**
 * Vertex AI model configuration - similar to Azure model config
 * Allows specifying deployment name for each model
 */
export declare const vertexModelConfigSchema: z.ZodUnion<[z.ZodObject<{
    /** The actual model ID/deployment name used by Vertex AI API */
    deploymentName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    deploymentName?: string | undefined;
}, {
    deploymentName?: string | undefined;
}>, z.ZodBoolean]>;
export type TVertexModelConfig = z.infer<typeof vertexModelConfigSchema>;
/**
 * Vertex AI configuration schema for Anthropic models served via Google Cloud Vertex AI.
 * Similar to Azure configuration, this allows running Anthropic models through Google Cloud.
 */
export declare const vertexAISchema: z.ZodObject<{
    /** Enable Vertex AI mode for Anthropic (defaults to true when vertex config is present) */
    enabled: z.ZodOptional<z.ZodBoolean>;
    /** Google Cloud Project ID (optional - auto-detected from service key file if not provided) */
    projectId: z.ZodOptional<z.ZodString>;
    /** Vertex AI region (e.g., 'us-east5', 'europe-west1') */
    region: z.ZodDefault<z.ZodString>;
    /** Optional: Path to service account key file */
    serviceKeyFile: z.ZodOptional<z.ZodString>;
    /** Optional: Default deployment name for all models (can be overridden per model) */
    deploymentName: z.ZodOptional<z.ZodString>;
    /** Optional: Available models - can be string array or object with deploymentName mapping */
    models: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        /** The actual model ID/deployment name used by Vertex AI API */
        deploymentName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        deploymentName?: string | undefined;
    }, {
        deploymentName?: string | undefined;
    }>, z.ZodBoolean]>>]>>;
}, "strip", z.ZodTypeAny, {
    region: string;
    enabled?: boolean | undefined;
    projectId?: string | undefined;
    deploymentName?: string | undefined;
    serviceKeyFile?: string | undefined;
    models?: string[] | Record<string, boolean | {
        deploymentName?: string | undefined;
    }> | undefined;
}, {
    region?: string | undefined;
    enabled?: boolean | undefined;
    projectId?: string | undefined;
    deploymentName?: string | undefined;
    serviceKeyFile?: string | undefined;
    models?: string[] | Record<string, boolean | {
        deploymentName?: string | undefined;
    }> | undefined;
}>;
export type TVertexAISchema = z.infer<typeof vertexAISchema>;
export type TVertexModelMap = Record<string, string>;
/**
 * Validated Vertex AI configuration result
 */
export type TVertexAIConfig = TVertexAISchema & {
    isValid: boolean;
    errors: string[];
    modelNames?: string[];
    modelDeploymentMap?: TVertexModelMap;
};
/**
 * Anthropic endpoint schema with optional Vertex AI configuration.
 * Extends baseEndpointSchema with Vertex AI support.
 */
export declare const anthropicEndpointSchema: z.ZodObject<{
    streamRate: z.ZodOptional<z.ZodNumber>;
    baseURL: z.ZodOptional<z.ZodString>;
    /**
     * Custom request headers forwarded to the provider on every request. Values
     * support the same placeholder resolution as custom endpoints — env vars
     * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
     * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
     * providers through an AI gateway / reverse proxy that consumes metadata
     * headers (provider-native request shaping is preserved).
     */
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    titlePrompt: z.ZodOptional<z.ZodString>;
    titleModel: z.ZodOptional<z.ZodString>;
    titleConvo: z.ZodOptional<z.ZodBoolean>;
    titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
    titleEndpoint: z.ZodOptional<z.ZodString>;
    titlePromptTemplate: z.ZodOptional<z.ZodString>;
    /**
     * When conversation titles are generated. `immediate` (default) generates the
     * title as soon as the request is made, in parallel with the response, from the
     * user's first message. `final` defers generation until the full response
     * completes (legacy behavior).
     */
    titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
    /** Maximum characters allowed in a single tool result before truncation. */
    maxToolResultChars: z.ZodOptional<z.ZodNumber>;
} & {
    /** Vertex AI configuration for running Anthropic models on Google Cloud */
    vertex: z.ZodOptional<z.ZodObject<{
        /** Enable Vertex AI mode for Anthropic (defaults to true when vertex config is present) */
        enabled: z.ZodOptional<z.ZodBoolean>;
        /** Google Cloud Project ID (optional - auto-detected from service key file if not provided) */
        projectId: z.ZodOptional<z.ZodString>;
        /** Vertex AI region (e.g., 'us-east5', 'europe-west1') */
        region: z.ZodDefault<z.ZodString>;
        /** Optional: Path to service account key file */
        serviceKeyFile: z.ZodOptional<z.ZodString>;
        /** Optional: Default deployment name for all models (can be overridden per model) */
        deploymentName: z.ZodOptional<z.ZodString>;
        /** Optional: Available models - can be string array or object with deploymentName mapping */
        models: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
            /** The actual model ID/deployment name used by Vertex AI API */
            deploymentName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            deploymentName?: string | undefined;
        }, {
            deploymentName?: string | undefined;
        }>, z.ZodBoolean]>>]>>;
    }, "strip", z.ZodTypeAny, {
        region: string;
        enabled?: boolean | undefined;
        projectId?: string | undefined;
        deploymentName?: string | undefined;
        serviceKeyFile?: string | undefined;
        models?: string[] | Record<string, boolean | {
            deploymentName?: string | undefined;
        }> | undefined;
    }, {
        region?: string | undefined;
        enabled?: boolean | undefined;
        projectId?: string | undefined;
        deploymentName?: string | undefined;
        serviceKeyFile?: string | undefined;
        models?: string[] | Record<string, boolean | {
            deploymentName?: string | undefined;
        }> | undefined;
    }>>;
    /** Optional: List of available models */
    models: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    models?: string[] | undefined;
    vertex?: {
        region: string;
        enabled?: boolean | undefined;
        projectId?: string | undefined;
        deploymentName?: string | undefined;
        serviceKeyFile?: string | undefined;
        models?: string[] | Record<string, boolean | {
            deploymentName?: string | undefined;
        }> | undefined;
    } | undefined;
}, {
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    models?: string[] | undefined;
    vertex?: {
        region?: string | undefined;
        enabled?: boolean | undefined;
        projectId?: string | undefined;
        deploymentName?: string | undefined;
        serviceKeyFile?: string | undefined;
        models?: string[] | Record<string, boolean | {
            deploymentName?: string | undefined;
        }> | undefined;
    } | undefined;
}>;
export type TAnthropicEndpoint = z.infer<typeof anthropicEndpointSchema>;
declare const ttsOpenaiSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodString;
    model: z.ZodString;
    voices: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    model: string;
    apiKey: string;
    voices: string[];
    url?: string | undefined;
}, {
    model: string;
    apiKey: string;
    voices: string[];
    url?: string | undefined;
}>;
declare const ttsElevenLabsSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    websocketUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodString;
    model: z.ZodString;
    voices: z.ZodArray<z.ZodString, "many">;
    voice_settings: z.ZodOptional<z.ZodObject<{
        similarity_boost: z.ZodOptional<z.ZodNumber>;
        stability: z.ZodOptional<z.ZodNumber>;
        style: z.ZodOptional<z.ZodNumber>;
        use_speaker_boost: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        style?: number | undefined;
        similarity_boost?: number | undefined;
        stability?: number | undefined;
        use_speaker_boost?: boolean | undefined;
    }, {
        style?: number | undefined;
        similarity_boost?: number | undefined;
        stability?: number | undefined;
        use_speaker_boost?: boolean | undefined;
    }>>;
    pronunciation_dictionary_locators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    model: string;
    apiKey: string;
    voices: string[];
    url?: string | undefined;
    websocketUrl?: string | undefined;
    voice_settings?: {
        style?: number | undefined;
        similarity_boost?: number | undefined;
        stability?: number | undefined;
        use_speaker_boost?: boolean | undefined;
    } | undefined;
    pronunciation_dictionary_locators?: string[] | undefined;
}, {
    model: string;
    apiKey: string;
    voices: string[];
    url?: string | undefined;
    websocketUrl?: string | undefined;
    voice_settings?: {
        style?: number | undefined;
        similarity_boost?: number | undefined;
        stability?: number | undefined;
        use_speaker_boost?: boolean | undefined;
    } | undefined;
    pronunciation_dictionary_locators?: string[] | undefined;
}>;
declare const ttsLocalaiSchema: z.ZodObject<{
    url: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
    voices: z.ZodArray<z.ZodString, "many">;
    backend: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    voices: string[];
    backend: string;
    apiKey?: string | undefined;
}, {
    url: string;
    voices: string[];
    backend: string;
    apiKey?: string | undefined;
}>;
export declare enum RateLimitPrefix {
    FILE_UPLOAD = "FILE_UPLOAD",
    IMPORT = "IMPORT",
    TTS = "TTS",
    STT = "STT"
}
export declare const rateLimitSchema: z.ZodObject<{
    fileUploads: z.ZodOptional<z.ZodObject<{
        ipMax: z.ZodOptional<z.ZodNumber>;
        ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        userMax: z.ZodOptional<z.ZodNumber>;
        userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    }, {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    }>>;
    conversationsImport: z.ZodOptional<z.ZodObject<{
        ipMax: z.ZodOptional<z.ZodNumber>;
        ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        userMax: z.ZodOptional<z.ZodNumber>;
        userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    }, {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    }>>;
    tts: z.ZodOptional<z.ZodObject<{
        ipMax: z.ZodOptional<z.ZodNumber>;
        ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        userMax: z.ZodOptional<z.ZodNumber>;
        userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    }, {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    }>>;
    stt: z.ZodOptional<z.ZodObject<{
        ipMax: z.ZodOptional<z.ZodNumber>;
        ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        userMax: z.ZodOptional<z.ZodNumber>;
        userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    }, {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    tts?: {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    } | undefined;
    stt?: {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    } | undefined;
    fileUploads?: {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    } | undefined;
    conversationsImport?: {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    } | undefined;
}, {
    tts?: {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    } | undefined;
    stt?: {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    } | undefined;
    fileUploads?: {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    } | undefined;
    conversationsImport?: {
        ipMax?: number | undefined;
        ipWindowInMinutes?: number | undefined;
        userMax?: number | undefined;
        userWindowInMinutes?: number | undefined;
    } | undefined;
}>;
export declare enum EImageOutputType {
    PNG = "png",
    WEBP = "webp",
    JPEG = "jpeg"
}
declare const termsOfServiceSchema: z.ZodObject<{
    externalUrl: z.ZodOptional<z.ZodString>;
    openNewTab: z.ZodOptional<z.ZodBoolean>;
    modalAcceptance: z.ZodOptional<z.ZodBoolean>;
    modalTitle: z.ZodOptional<z.ZodString>;
    modalContent: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
}, "strip", z.ZodTypeAny, {
    externalUrl?: string | undefined;
    openNewTab?: boolean | undefined;
    modalAcceptance?: boolean | undefined;
    modalTitle?: string | undefined;
    modalContent?: string | string[] | undefined;
}, {
    externalUrl?: string | undefined;
    openNewTab?: boolean | undefined;
    modalAcceptance?: boolean | undefined;
    modalTitle?: string | undefined;
    modalContent?: string | string[] | undefined;
}>;
export type TTermsOfService = z.infer<typeof termsOfServiceSchema>;
declare const localizedStringSchema: z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>;
export type LocalizedString = z.infer<typeof localizedStringSchema>;
declare const mcpServersSchema: z.ZodOptional<z.ZodObject<{
    placeholder: z.ZodOptional<z.ZodString>;
    use: z.ZodOptional<z.ZodBoolean>;
    create: z.ZodOptional<z.ZodBoolean>;
    share: z.ZodOptional<z.ZodBoolean>;
    public: z.ZodOptional<z.ZodBoolean>;
    configureObo: z.ZodOptional<z.ZodBoolean>;
    trustCheckbox: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
        subLabel: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
    }, "strip", z.ZodTypeAny, {
        label?: string | Record<string, string> | undefined;
        subLabel?: string | Record<string, string> | undefined;
    }, {
        label?: string | Record<string, string> | undefined;
        subLabel?: string | Record<string, string> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    public?: boolean | undefined;
    placeholder?: string | undefined;
    share?: boolean | undefined;
    use?: boolean | undefined;
    create?: boolean | undefined;
    configureObo?: boolean | undefined;
    trustCheckbox?: {
        label?: string | Record<string, string> | undefined;
        subLabel?: string | Record<string, string> | undefined;
    } | undefined;
}, {
    public?: boolean | undefined;
    placeholder?: string | undefined;
    share?: boolean | undefined;
    use?: boolean | undefined;
    create?: boolean | undefined;
    configureObo?: boolean | undefined;
    trustCheckbox?: {
        label?: string | Record<string, string> | undefined;
        subLabel?: string | Record<string, string> | undefined;
    } | undefined;
}>>;
export type TMcpServersConfig = z.infer<typeof mcpServersSchema>;
export declare enum RetentionMode {
    ALL = "all",
    TEMPORARY = "temporary"
}
export declare const interfaceSchema: z.ZodDefault<z.ZodObject<{
    privacyPolicy: z.ZodOptional<z.ZodObject<{
        externalUrl: z.ZodOptional<z.ZodString>;
        openNewTab: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        externalUrl?: string | undefined;
        openNewTab?: boolean | undefined;
    }, {
        externalUrl?: string | undefined;
        openNewTab?: boolean | undefined;
    }>>;
    termsOfService: z.ZodOptional<z.ZodObject<{
        externalUrl: z.ZodOptional<z.ZodString>;
        openNewTab: z.ZodOptional<z.ZodBoolean>;
        modalAcceptance: z.ZodOptional<z.ZodBoolean>;
        modalTitle: z.ZodOptional<z.ZodString>;
        modalContent: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    }, "strip", z.ZodTypeAny, {
        externalUrl?: string | undefined;
        openNewTab?: boolean | undefined;
        modalAcceptance?: boolean | undefined;
        modalTitle?: string | undefined;
        modalContent?: string | string[] | undefined;
    }, {
        externalUrl?: string | undefined;
        openNewTab?: boolean | undefined;
        modalAcceptance?: boolean | undefined;
        modalTitle?: string | undefined;
        modalContent?: string | string[] | undefined;
    }>>;
    customWelcome: z.ZodOptional<z.ZodString>;
    mcpServers: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        placeholder: z.ZodOptional<z.ZodString>;
        use: z.ZodOptional<z.ZodBoolean>;
        create: z.ZodOptional<z.ZodBoolean>;
        share: z.ZodOptional<z.ZodBoolean>;
        public: z.ZodOptional<z.ZodBoolean>;
        configureObo: z.ZodOptional<z.ZodBoolean>;
        trustCheckbox: z.ZodOptional<z.ZodObject<{
            label: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
            subLabel: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
        }, "strip", z.ZodTypeAny, {
            label?: string | Record<string, string> | undefined;
            subLabel?: string | Record<string, string> | undefined;
        }, {
            label?: string | Record<string, string> | undefined;
            subLabel?: string | Record<string, string> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        public?: boolean | undefined;
        placeholder?: string | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
        configureObo?: boolean | undefined;
        trustCheckbox?: {
            label?: string | Record<string, string> | undefined;
            subLabel?: string | Record<string, string> | undefined;
        } | undefined;
    }, {
        public?: boolean | undefined;
        placeholder?: string | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
        configureObo?: boolean | undefined;
        trustCheckbox?: {
            label?: string | Record<string, string> | undefined;
            subLabel?: string | Record<string, string> | undefined;
        } | undefined;
    }>>>;
    modelSelect: z.ZodOptional<z.ZodBoolean>;
    parameters: z.ZodOptional<z.ZodBoolean>;
    multiConvo: z.ZodOptional<z.ZodBoolean>;
    bookmarks: z.ZodOptional<z.ZodBoolean>;
    memories: z.ZodOptional<z.ZodBoolean>;
    presets: z.ZodOptional<z.ZodBoolean>;
    prompts: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
        use: z.ZodOptional<z.ZodBoolean>;
        create: z.ZodOptional<z.ZodBoolean>;
        share: z.ZodOptional<z.ZodBoolean>;
        public: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    }, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    }>]>>;
    agents: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
        use: z.ZodOptional<z.ZodBoolean>;
        create: z.ZodOptional<z.ZodBoolean>;
        share: z.ZodOptional<z.ZodBoolean>;
        public: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    }, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    }>]>>;
    temporaryChat: z.ZodOptional<z.ZodBoolean>;
    temporaryChatRetention: z.ZodOptional<z.ZodNumber>;
    autoSubmitFromUrl: z.ZodOptional<z.ZodBoolean>;
    retentionMode: z.ZodDefault<z.ZodNativeEnum<typeof RetentionMode>>;
    retainAgentFiles: z.ZodOptional<z.ZodBoolean>;
    runCode: z.ZodOptional<z.ZodBoolean>;
    webSearch: z.ZodOptional<z.ZodBoolean>;
    contextUsage: z.ZodOptional<z.ZodBoolean>;
    contextCost: z.ZodOptional<z.ZodBoolean>;
    currency: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        rate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        code: string;
        rate: number;
    }, {
        code: string;
        rate: number;
    }>>;
    peoplePicker: z.ZodOptional<z.ZodObject<{
        users: z.ZodOptional<z.ZodBoolean>;
        groups: z.ZodOptional<z.ZodBoolean>;
        roles: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        users?: boolean | undefined;
        groups?: boolean | undefined;
        roles?: boolean | undefined;
    }, {
        users?: boolean | undefined;
        groups?: boolean | undefined;
        roles?: boolean | undefined;
    }>>;
    marketplace: z.ZodOptional<z.ZodObject<{
        use: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        use?: boolean | undefined;
    }, {
        use?: boolean | undefined;
    }>>;
    fileSearch: z.ZodOptional<z.ZodBoolean>;
    fileCitations: z.ZodOptional<z.ZodBoolean>;
    /** Tool keys (and `'mcp'` or an MCP server name) pinned to the prompt bar by default */
    defaultPinnedTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    buildInfo: z.ZodOptional<z.ZodBoolean>;
    remoteAgents: z.ZodOptional<z.ZodObject<{
        use: z.ZodOptional<z.ZodBoolean>;
        create: z.ZodOptional<z.ZodBoolean>;
        share: z.ZodOptional<z.ZodBoolean>;
        public: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    }, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    }>>;
    skills: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
        use: z.ZodOptional<z.ZodBoolean>;
        create: z.ZodOptional<z.ZodBoolean>;
        share: z.ZodOptional<z.ZodBoolean>;
        public: z.ZodOptional<z.ZodBoolean>;
        defaultActiveOnShare: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
        defaultActiveOnShare?: boolean | undefined;
    }, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
        defaultActiveOnShare?: boolean | undefined;
    }>]>>;
    sharedLinks: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
        create: z.ZodOptional<z.ZodBoolean>;
        share: z.ZodOptional<z.ZodBoolean>;
        public: z.ZodOptional<z.ZodBoolean>;
        snapshotFiles: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        create?: boolean | undefined;
        snapshotFiles?: boolean | undefined;
    }, {
        public?: boolean | undefined;
        share?: boolean | undefined;
        create?: boolean | undefined;
        snapshotFiles?: boolean | undefined;
    }>]>>;
}, "strip", z.ZodTypeAny, {
    retentionMode: RetentionMode;
    agents?: boolean | {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    } | undefined;
    webSearch?: boolean | undefined;
    fileSearch?: boolean | undefined;
    mcpServers?: {
        public?: boolean | undefined;
        placeholder?: string | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
        configureObo?: boolean | undefined;
        trustCheckbox?: {
            label?: string | Record<string, string> | undefined;
            subLabel?: string | Record<string, string> | undefined;
        } | undefined;
    } | undefined;
    skills?: boolean | {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
        defaultActiveOnShare?: boolean | undefined;
    } | undefined;
    parameters?: boolean | undefined;
    privacyPolicy?: {
        externalUrl?: string | undefined;
        openNewTab?: boolean | undefined;
    } | undefined;
    termsOfService?: {
        externalUrl?: string | undefined;
        openNewTab?: boolean | undefined;
        modalAcceptance?: boolean | undefined;
        modalTitle?: string | undefined;
        modalContent?: string | string[] | undefined;
    } | undefined;
    customWelcome?: string | undefined;
    modelSelect?: boolean | undefined;
    multiConvo?: boolean | undefined;
    bookmarks?: boolean | undefined;
    memories?: boolean | undefined;
    presets?: boolean | undefined;
    prompts?: boolean | {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    } | undefined;
    temporaryChat?: boolean | undefined;
    temporaryChatRetention?: number | undefined;
    autoSubmitFromUrl?: boolean | undefined;
    retainAgentFiles?: boolean | undefined;
    runCode?: boolean | undefined;
    contextUsage?: boolean | undefined;
    contextCost?: boolean | undefined;
    currency?: {
        code: string;
        rate: number;
    } | undefined;
    peoplePicker?: {
        users?: boolean | undefined;
        groups?: boolean | undefined;
        roles?: boolean | undefined;
    } | undefined;
    marketplace?: {
        use?: boolean | undefined;
    } | undefined;
    fileCitations?: boolean | undefined;
    defaultPinnedTools?: string[] | undefined;
    buildInfo?: boolean | undefined;
    remoteAgents?: {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    } | undefined;
    sharedLinks?: boolean | {
        public?: boolean | undefined;
        share?: boolean | undefined;
        create?: boolean | undefined;
        snapshotFiles?: boolean | undefined;
    } | undefined;
}, {
    agents?: boolean | {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    } | undefined;
    webSearch?: boolean | undefined;
    fileSearch?: boolean | undefined;
    mcpServers?: {
        public?: boolean | undefined;
        placeholder?: string | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
        configureObo?: boolean | undefined;
        trustCheckbox?: {
            label?: string | Record<string, string> | undefined;
            subLabel?: string | Record<string, string> | undefined;
        } | undefined;
    } | undefined;
    skills?: boolean | {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
        defaultActiveOnShare?: boolean | undefined;
    } | undefined;
    parameters?: boolean | undefined;
    privacyPolicy?: {
        externalUrl?: string | undefined;
        openNewTab?: boolean | undefined;
    } | undefined;
    termsOfService?: {
        externalUrl?: string | undefined;
        openNewTab?: boolean | undefined;
        modalAcceptance?: boolean | undefined;
        modalTitle?: string | undefined;
        modalContent?: string | string[] | undefined;
    } | undefined;
    customWelcome?: string | undefined;
    modelSelect?: boolean | undefined;
    multiConvo?: boolean | undefined;
    bookmarks?: boolean | undefined;
    memories?: boolean | undefined;
    presets?: boolean | undefined;
    prompts?: boolean | {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    } | undefined;
    temporaryChat?: boolean | undefined;
    temporaryChatRetention?: number | undefined;
    autoSubmitFromUrl?: boolean | undefined;
    retentionMode?: RetentionMode | undefined;
    retainAgentFiles?: boolean | undefined;
    runCode?: boolean | undefined;
    contextUsage?: boolean | undefined;
    contextCost?: boolean | undefined;
    currency?: {
        code: string;
        rate: number;
    } | undefined;
    peoplePicker?: {
        users?: boolean | undefined;
        groups?: boolean | undefined;
        roles?: boolean | undefined;
    } | undefined;
    marketplace?: {
        use?: boolean | undefined;
    } | undefined;
    fileCitations?: boolean | undefined;
    defaultPinnedTools?: string[] | undefined;
    buildInfo?: boolean | undefined;
    remoteAgents?: {
        public?: boolean | undefined;
        share?: boolean | undefined;
        use?: boolean | undefined;
        create?: boolean | undefined;
    } | undefined;
    sharedLinks?: boolean | {
        public?: boolean | undefined;
        share?: boolean | undefined;
        create?: boolean | undefined;
        snapshotFiles?: boolean | undefined;
    } | undefined;
}>>;
export type TInterfaceConfig = z.infer<typeof interfaceSchema>;
export type TBalanceConfig = z.infer<typeof balanceSchema>;
export type TTransactionsConfig = z.infer<typeof transactionsSchema>;
export declare const turnstileOptionsSchema: z.ZodDefault<z.ZodObject<{
    language: z.ZodDefault<z.ZodString>;
    size: z.ZodDefault<z.ZodEnum<["normal", "compact", "flexible", "invisible"]>>;
}, "strip", z.ZodTypeAny, {
    language: string;
    size: "normal" | "compact" | "flexible" | "invisible";
}, {
    language?: string | undefined;
    size?: "normal" | "compact" | "flexible" | "invisible" | undefined;
}>>;
export declare const turnstileSchema: z.ZodObject<{
    siteKey: z.ZodString;
    options: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        language: z.ZodDefault<z.ZodString>;
        size: z.ZodDefault<z.ZodEnum<["normal", "compact", "flexible", "invisible"]>>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        size: "normal" | "compact" | "flexible" | "invisible";
    }, {
        language?: string | undefined;
        size?: "normal" | "compact" | "flexible" | "invisible" | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    siteKey: string;
    options?: {
        language: string;
        size: "normal" | "compact" | "flexible" | "invisible";
    } | undefined;
}, {
    siteKey: string;
    options?: {
        language?: string | undefined;
        size?: "normal" | "compact" | "flexible" | "invisible" | undefined;
    } | undefined;
}>;
export type TTurnstileConfig = z.infer<typeof turnstileSchema>;
export type TRumConfig = {
    provider: 'hyperdx';
    enabled: boolean;
    url: string;
    serviceName: string;
    authMode: 'publicToken' | 'proxy';
    publicToken?: string;
    tracePropagationTargets?: string[];
    consoleCapture?: boolean;
    disableReplay?: boolean;
    advancedNetworkCapture?: boolean;
    sampleRate?: number;
    environment?: string;
};
export type StartupConfigContext = 'share';
export type TStartupConfig = {
    appTitle: string;
    socialLogins?: string[];
    interface?: TInterfaceConfig;
    turnstile?: TTurnstileConfig;
    balance?: TBalanceConfig;
    transactions?: TTransactionsConfig;
    discordLoginEnabled: boolean;
    facebookLoginEnabled: boolean;
    githubLoginEnabled: boolean;
    googleLoginEnabled: boolean;
    openidLoginEnabled: boolean;
    appleLoginEnabled: boolean;
    samlLoginEnabled: boolean;
    openidLabel: string;
    openidImageUrl: string;
    openidAutoRedirect: boolean;
    samlLabel: string;
    samlImageUrl: string;
    /** LDAP Auth Configuration */
    ldap?: {
        /** LDAP enabled */
        enabled: boolean;
        /** Whether LDAP uses username vs. email */
        username?: boolean;
    };
    serverDomain: string;
    emailLoginEnabled: boolean;
    registrationEnabled: boolean;
    socialLoginEnabled: boolean;
    passwordResetEnabled: boolean;
    emailEnabled: boolean;
    showBirthdayIcon: boolean;
    helpAndFaqURL: string;
    customFooter?: string;
    modelSpecs?: TSpecsConfig;
    modelDescriptions?: Record<string, Record<string, string>>;
    sharedLinksEnabled: boolean;
    publicSharedLinksEnabled: boolean;
    /** Whether shared links snapshot conversation files (gates the per-link "share files" checkbox). */
    sharedLinksSnapshotFilesEnabled?: boolean;
    /** Effective default timing for when conversation titles become fetchable.
     * `immediate` = fetch in parallel with the active stream (default);
     * `final` = fetch only after the stream completes (legacy). */
    titleGenerationTiming?: 'immediate' | 'final';
    analyticsGtmId?: string;
    rum?: TRumConfig;
    bundlerURL?: string;
    staticBundlerURL?: string;
    sharePointFilePickerEnabled?: boolean;
    sharePointBaseUrl?: string;
    sharePointPickerGraphScope?: string;
    sharePointPickerSharePointScope?: string;
    openidReuseTokens?: boolean;
    allowAccountDeletion: boolean;
    minPasswordLength?: number;
    webSearch?: {
        searchProvider?: SearchProviders;
        scraperProvider?: ScraperProviders;
        rerankerType?: RerankerTypes;
    };
    cloudFront?: {
        cookieRefresh?: {
            endpoint: string;
            domain: string;
        };
    };
    mcpServers?: Record<string, {
        customUserVars: Record<string, {
            title: string;
            description: string;
        }>;
        chatMenu?: boolean;
        isOAuth?: boolean;
        startup?: boolean;
        iconPath?: string;
    }>;
    mcpPlaceholder?: string;
    conversationImportMaxFileSize?: number;
    buildInfo?: {
        commit?: string | null;
        commitShort?: string | null;
        branch?: string | null;
        buildDate?: string | null;
    };
};
export type TSharedLinkStartupInterface = Pick<Partial<TInterfaceConfig>, 'privacyPolicy' | 'termsOfService'>;
export type TSharedLinkStartupConfig = Pick<TStartupConfig, 'appTitle'> & Pick<Partial<TStartupConfig>, 'analyticsGtmId' | 'bundlerURL' | 'customFooter' | 'staticBundlerURL'> & {
    interface?: TSharedLinkStartupInterface;
};
export declare enum OCRStrategy {
    MISTRAL_OCR = "mistral_ocr",
    CUSTOM_OCR = "custom_ocr",
    AZURE_MISTRAL_OCR = "azure_mistral_ocr",
    VERTEXAI_MISTRAL_OCR = "vertexai_mistral_ocr",
    DOCUMENT_PARSER = "document_parser"
}
export declare enum SearchCategories {
    PROVIDERS = "providers",
    SCRAPERS = "scrapers",
    RERANKERS = "rerankers"
}
export declare enum SearchProviders {
    SERPER = "serper",
    SEARXNG = "searxng",
    TAVILY = "tavily"
}
export declare enum ScraperProviders {
    FIRECRAWL = "firecrawl",
    SERPER = "serper",
    TAVILY = "tavily"
}
export declare enum RerankerTypes {
    JINA = "jina",
    COHERE = "cohere",
    NONE = "none"
}
export declare enum SafeSearchTypes {
    OFF = 0,
    MODERATE = 1,
    STRICT = 2
}
export declare const webSearchSchema: z.ZodObject<{
    serperApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    searxngInstanceUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    searxngApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    firecrawlApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    firecrawlApiUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    firecrawlVersion: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    tavilyApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    tavilySearchUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    tavilyExtractUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    jinaApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    jinaApiUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    cohereApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    searchProvider: z.ZodOptional<z.ZodNativeEnum<typeof SearchProviders>>;
    scraperProvider: z.ZodOptional<z.ZodNativeEnum<typeof ScraperProviders>>;
    rerankerType: z.ZodOptional<z.ZodNativeEnum<typeof RerankerTypes>>;
    scraperTimeout: z.ZodOptional<z.ZodNumber>;
    safeSearch: z.ZodDefault<z.ZodNativeEnum<typeof SafeSearchTypes>>;
    firecrawlOptions: z.ZodOptional<z.ZodObject<{
        formats: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        includeTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        excludeTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        waitFor: z.ZodOptional<z.ZodNumber>;
        timeout: z.ZodOptional<z.ZodNumber>;
        maxAge: z.ZodOptional<z.ZodNumber>;
        mobile: z.ZodOptional<z.ZodBoolean>;
        skipTlsVerification: z.ZodOptional<z.ZodBoolean>;
        blockAds: z.ZodOptional<z.ZodBoolean>;
        removeBase64Images: z.ZodOptional<z.ZodBoolean>;
        parsePDF: z.ZodOptional<z.ZodBoolean>;
        storeInCache: z.ZodOptional<z.ZodBoolean>;
        zeroDataRetention: z.ZodOptional<z.ZodBoolean>;
        location: z.ZodOptional<z.ZodObject<{
            country: z.ZodOptional<z.ZodString>;
            languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            country?: string | undefined;
            languages?: string[] | undefined;
        }, {
            country?: string | undefined;
            languages?: string[] | undefined;
        }>>;
        onlyMainContent: z.ZodOptional<z.ZodBoolean>;
        changeTrackingOptions: z.ZodOptional<z.ZodObject<{
            modes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            prompt: z.ZodOptional<z.ZodString>;
            tag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            tag?: string | null | undefined;
            prompt?: string | undefined;
            modes?: string[] | undefined;
            schema?: Record<string, unknown> | undefined;
        }, {
            tag?: string | null | undefined;
            prompt?: string | undefined;
            modes?: string[] | undefined;
            schema?: Record<string, unknown> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timeout?: number | undefined;
        headers?: Record<string, string> | undefined;
        formats?: string[] | undefined;
        includeTags?: string[] | undefined;
        excludeTags?: string[] | undefined;
        waitFor?: number | undefined;
        maxAge?: number | undefined;
        mobile?: boolean | undefined;
        skipTlsVerification?: boolean | undefined;
        blockAds?: boolean | undefined;
        removeBase64Images?: boolean | undefined;
        parsePDF?: boolean | undefined;
        storeInCache?: boolean | undefined;
        zeroDataRetention?: boolean | undefined;
        location?: {
            country?: string | undefined;
            languages?: string[] | undefined;
        } | undefined;
        onlyMainContent?: boolean | undefined;
        changeTrackingOptions?: {
            tag?: string | null | undefined;
            prompt?: string | undefined;
            modes?: string[] | undefined;
            schema?: Record<string, unknown> | undefined;
        } | undefined;
    }, {
        timeout?: number | undefined;
        headers?: Record<string, string> | undefined;
        formats?: string[] | undefined;
        includeTags?: string[] | undefined;
        excludeTags?: string[] | undefined;
        waitFor?: number | undefined;
        maxAge?: number | undefined;
        mobile?: boolean | undefined;
        skipTlsVerification?: boolean | undefined;
        blockAds?: boolean | undefined;
        removeBase64Images?: boolean | undefined;
        parsePDF?: boolean | undefined;
        storeInCache?: boolean | undefined;
        zeroDataRetention?: boolean | undefined;
        location?: {
            country?: string | undefined;
            languages?: string[] | undefined;
        } | undefined;
        onlyMainContent?: boolean | undefined;
        changeTrackingOptions?: {
            tag?: string | null | undefined;
            prompt?: string | undefined;
            modes?: string[] | undefined;
            schema?: Record<string, unknown> | undefined;
        } | undefined;
    }>>;
    tavilySearchOptions: z.ZodOptional<z.ZodObject<{
        searchDepth: z.ZodOptional<z.ZodEnum<["basic", "advanced", "fast", "ultra-fast"]>>;
        maxResults: z.ZodOptional<z.ZodNumber>;
        includeImages: z.ZodOptional<z.ZodBoolean>;
        includeAnswer: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["basic", "advanced"]>]>>;
        includeRawContent: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["markdown", "text"]>]>>;
        includeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        excludeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        topic: z.ZodOptional<z.ZodEnum<["general", "news", "finance"]>>;
        timeRange: z.ZodOptional<z.ZodEnum<["day", "week", "month", "year", "d", "w", "m", "y"]>>;
        includeImageDescriptions: z.ZodOptional<z.ZodBoolean>;
        includeFavicon: z.ZodOptional<z.ZodBoolean>;
        chunksPerSource: z.ZodOptional<z.ZodNumber>;
        safeSearch: z.ZodOptional<z.ZodBoolean>;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        timeout?: number | undefined;
        safeSearch?: boolean | undefined;
        searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
        maxResults?: number | undefined;
        includeImages?: boolean | undefined;
        includeAnswer?: boolean | "basic" | "advanced" | undefined;
        includeRawContent?: boolean | "text" | "markdown" | undefined;
        includeDomains?: string[] | undefined;
        excludeDomains?: string[] | undefined;
        topic?: "general" | "news" | "finance" | undefined;
        timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
        includeImageDescriptions?: boolean | undefined;
        includeFavicon?: boolean | undefined;
        chunksPerSource?: number | undefined;
    }, {
        timeout?: number | undefined;
        safeSearch?: boolean | undefined;
        searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
        maxResults?: number | undefined;
        includeImages?: boolean | undefined;
        includeAnswer?: boolean | "basic" | "advanced" | undefined;
        includeRawContent?: boolean | "text" | "markdown" | undefined;
        includeDomains?: string[] | undefined;
        excludeDomains?: string[] | undefined;
        topic?: "general" | "news" | "finance" | undefined;
        timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
        includeImageDescriptions?: boolean | undefined;
        includeFavicon?: boolean | undefined;
        chunksPerSource?: number | undefined;
    }>>;
    tavilyScraperOptions: z.ZodOptional<z.ZodObject<{
        extractDepth: z.ZodOptional<z.ZodEnum<["basic", "advanced"]>>;
        includeImages: z.ZodOptional<z.ZodBoolean>;
        includeFavicon: z.ZodOptional<z.ZodBoolean>;
        format: z.ZodOptional<z.ZodEnum<["markdown", "text"]>>;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        timeout?: number | undefined;
        includeImages?: boolean | undefined;
        includeFavicon?: boolean | undefined;
        extractDepth?: "basic" | "advanced" | undefined;
        format?: "text" | "markdown" | undefined;
    }, {
        timeout?: number | undefined;
        includeImages?: boolean | undefined;
        includeFavicon?: boolean | undefined;
        extractDepth?: "basic" | "advanced" | undefined;
        format?: "text" | "markdown" | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    serperApiKey: string;
    searxngInstanceUrl: string;
    searxngApiKey: string;
    firecrawlApiKey: string;
    firecrawlApiUrl: string;
    firecrawlVersion: string;
    tavilyApiKey: string;
    tavilySearchUrl: string;
    tavilyExtractUrl: string;
    jinaApiKey: string;
    jinaApiUrl: string;
    cohereApiKey: string;
    safeSearch: SafeSearchTypes;
    searchProvider?: SearchProviders | undefined;
    scraperProvider?: ScraperProviders | undefined;
    rerankerType?: RerankerTypes | undefined;
    scraperTimeout?: number | undefined;
    firecrawlOptions?: {
        timeout?: number | undefined;
        headers?: Record<string, string> | undefined;
        formats?: string[] | undefined;
        includeTags?: string[] | undefined;
        excludeTags?: string[] | undefined;
        waitFor?: number | undefined;
        maxAge?: number | undefined;
        mobile?: boolean | undefined;
        skipTlsVerification?: boolean | undefined;
        blockAds?: boolean | undefined;
        removeBase64Images?: boolean | undefined;
        parsePDF?: boolean | undefined;
        storeInCache?: boolean | undefined;
        zeroDataRetention?: boolean | undefined;
        location?: {
            country?: string | undefined;
            languages?: string[] | undefined;
        } | undefined;
        onlyMainContent?: boolean | undefined;
        changeTrackingOptions?: {
            tag?: string | null | undefined;
            prompt?: string | undefined;
            modes?: string[] | undefined;
            schema?: Record<string, unknown> | undefined;
        } | undefined;
    } | undefined;
    tavilySearchOptions?: {
        timeout?: number | undefined;
        safeSearch?: boolean | undefined;
        searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
        maxResults?: number | undefined;
        includeImages?: boolean | undefined;
        includeAnswer?: boolean | "basic" | "advanced" | undefined;
        includeRawContent?: boolean | "text" | "markdown" | undefined;
        includeDomains?: string[] | undefined;
        excludeDomains?: string[] | undefined;
        topic?: "general" | "news" | "finance" | undefined;
        timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
        includeImageDescriptions?: boolean | undefined;
        includeFavicon?: boolean | undefined;
        chunksPerSource?: number | undefined;
    } | undefined;
    tavilyScraperOptions?: {
        timeout?: number | undefined;
        includeImages?: boolean | undefined;
        includeFavicon?: boolean | undefined;
        extractDepth?: "basic" | "advanced" | undefined;
        format?: "text" | "markdown" | undefined;
    } | undefined;
}, {
    serperApiKey?: string | undefined;
    searxngInstanceUrl?: string | undefined;
    searxngApiKey?: string | undefined;
    firecrawlApiKey?: string | undefined;
    firecrawlApiUrl?: string | undefined;
    firecrawlVersion?: string | undefined;
    tavilyApiKey?: string | undefined;
    tavilySearchUrl?: string | undefined;
    tavilyExtractUrl?: string | undefined;
    jinaApiKey?: string | undefined;
    jinaApiUrl?: string | undefined;
    cohereApiKey?: string | undefined;
    searchProvider?: SearchProviders | undefined;
    scraperProvider?: ScraperProviders | undefined;
    rerankerType?: RerankerTypes | undefined;
    scraperTimeout?: number | undefined;
    safeSearch?: SafeSearchTypes | undefined;
    firecrawlOptions?: {
        timeout?: number | undefined;
        headers?: Record<string, string> | undefined;
        formats?: string[] | undefined;
        includeTags?: string[] | undefined;
        excludeTags?: string[] | undefined;
        waitFor?: number | undefined;
        maxAge?: number | undefined;
        mobile?: boolean | undefined;
        skipTlsVerification?: boolean | undefined;
        blockAds?: boolean | undefined;
        removeBase64Images?: boolean | undefined;
        parsePDF?: boolean | undefined;
        storeInCache?: boolean | undefined;
        zeroDataRetention?: boolean | undefined;
        location?: {
            country?: string | undefined;
            languages?: string[] | undefined;
        } | undefined;
        onlyMainContent?: boolean | undefined;
        changeTrackingOptions?: {
            tag?: string | null | undefined;
            prompt?: string | undefined;
            modes?: string[] | undefined;
            schema?: Record<string, unknown> | undefined;
        } | undefined;
    } | undefined;
    tavilySearchOptions?: {
        timeout?: number | undefined;
        safeSearch?: boolean | undefined;
        searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
        maxResults?: number | undefined;
        includeImages?: boolean | undefined;
        includeAnswer?: boolean | "basic" | "advanced" | undefined;
        includeRawContent?: boolean | "text" | "markdown" | undefined;
        includeDomains?: string[] | undefined;
        excludeDomains?: string[] | undefined;
        topic?: "general" | "news" | "finance" | undefined;
        timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
        includeImageDescriptions?: boolean | undefined;
        includeFavicon?: boolean | undefined;
        chunksPerSource?: number | undefined;
    } | undefined;
    tavilyScraperOptions?: {
        timeout?: number | undefined;
        includeImages?: boolean | undefined;
        includeFavicon?: boolean | undefined;
        extractDepth?: "basic" | "advanced" | undefined;
        format?: "text" | "markdown" | undefined;
    } | undefined;
}>;
export type TWebSearchConfig = DeepPartial<z.infer<typeof webSearchSchema>>;
export declare const ocrSchema: z.ZodObject<{
    mistralModel: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    baseURL: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    strategy: z.ZodDefault<z.ZodNativeEnum<typeof OCRStrategy>>;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    baseURL: string;
    strategy: OCRStrategy;
    mistralModel?: string | undefined;
}, {
    apiKey?: string | undefined;
    mistralModel?: string | undefined;
    baseURL?: string | undefined;
    strategy?: OCRStrategy | undefined;
}>;
export declare const balanceSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    startBalance: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    autoRefillEnabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    refillIntervalValue: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    refillIntervalUnit: z.ZodDefault<z.ZodOptional<z.ZodEnum<["seconds", "minutes", "hours", "days", "weeks", "months"]>>>;
    refillAmount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    startBalance: number;
    autoRefillEnabled: boolean;
    refillIntervalValue: number;
    refillIntervalUnit: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months";
    refillAmount: number;
}, {
    enabled?: boolean | undefined;
    startBalance?: number | undefined;
    autoRefillEnabled?: boolean | undefined;
    refillIntervalValue?: number | undefined;
    refillIntervalUnit?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | undefined;
    refillAmount?: number | undefined;
}>;
export declare const transactionsSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
}, {
    enabled?: boolean | undefined;
}>;
export declare const DEFAULT_MEMORY_MAX_INPUT_TOKENS = 12000;
export declare const memorySchema: z.ZodObject<{
    disabled: z.ZodOptional<z.ZodBoolean>;
    validKeys: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tokenLimit: z.ZodOptional<z.ZodNumber>;
    charLimit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    maxInputTokens: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    personalize: z.ZodDefault<z.ZodBoolean>;
    messageWindowSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    agent: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        enabled?: boolean | undefined;
    }, {
        id: string;
        enabled?: boolean | undefined;
    }>, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        provider: z.ZodString;
        model: z.ZodString;
        instructions: z.ZodOptional<z.ZodString>;
        model_parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    }, "strip", z.ZodTypeAny, {
        model: string;
        provider: string;
        instructions?: string | undefined;
        enabled?: boolean | undefined;
        model_parameters?: Record<string, string | number | boolean> | undefined;
    }, {
        model: string;
        provider: string;
        instructions?: string | undefined;
        enabled?: boolean | undefined;
        model_parameters?: Record<string, string | number | boolean> | undefined;
    }>]>>;
}, "strip", z.ZodTypeAny, {
    charLimit: number;
    maxInputTokens: number;
    personalize: boolean;
    messageWindowSize: number;
    agent?: {
        id: string;
        enabled?: boolean | undefined;
    } | {
        model: string;
        provider: string;
        instructions?: string | undefined;
        enabled?: boolean | undefined;
        model_parameters?: Record<string, string | number | boolean> | undefined;
    } | undefined;
    disabled?: boolean | undefined;
    validKeys?: string[] | undefined;
    tokenLimit?: number | undefined;
}, {
    agent?: {
        id: string;
        enabled?: boolean | undefined;
    } | {
        model: string;
        provider: string;
        instructions?: string | undefined;
        enabled?: boolean | undefined;
        model_parameters?: Record<string, string | number | boolean> | undefined;
    } | undefined;
    disabled?: boolean | undefined;
    validKeys?: string[] | undefined;
    tokenLimit?: number | undefined;
    charLimit?: number | undefined;
    maxInputTokens?: number | undefined;
    personalize?: boolean | undefined;
    messageWindowSize?: number | undefined;
}>;
export type TMemoryConfig = DeepPartial<z.infer<typeof memorySchema>>;
export declare const summarizationTriggerSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"token_ratio">;
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "token_ratio";
    value: number;
}, {
    type: "token_ratio";
    value: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"remaining_tokens">;
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "remaining_tokens";
    value: number;
}, {
    type: "remaining_tokens";
    value: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"messages_to_refine">;
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "messages_to_refine";
    value: number;
}, {
    type: "messages_to_refine";
    value: number;
}>]>;
export declare const contextPruningSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    keepLastAssistants: z.ZodOptional<z.ZodNumber>;
    softTrimRatio: z.ZodOptional<z.ZodNumber>;
    hardClearRatio: z.ZodOptional<z.ZodNumber>;
    minPrunableToolChars: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
    keepLastAssistants?: number | undefined;
    softTrimRatio?: number | undefined;
    hardClearRatio?: number | undefined;
    minPrunableToolChars?: number | undefined;
}, {
    enabled?: boolean | undefined;
    keepLastAssistants?: number | undefined;
    softTrimRatio?: number | undefined;
    hardClearRatio?: number | undefined;
    minPrunableToolChars?: number | undefined;
}>;
export declare const summarizationConfigSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
    trigger: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"token_ratio">;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "token_ratio";
        value: number;
    }, {
        type: "token_ratio";
        value: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"remaining_tokens">;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "remaining_tokens";
        value: number;
    }, {
        type: "remaining_tokens";
        value: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"messages_to_refine">;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "messages_to_refine";
        value: number;
    }, {
        type: "messages_to_refine";
        value: number;
    }>]>>;
    prompt: z.ZodOptional<z.ZodString>;
    updatePrompt: z.ZodOptional<z.ZodString>;
    reserveRatio: z.ZodOptional<z.ZodNumber>;
    maxSummaryTokens: z.ZodOptional<z.ZodNumber>;
    contextPruning: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        keepLastAssistants: z.ZodOptional<z.ZodNumber>;
        softTrimRatio: z.ZodOptional<z.ZodNumber>;
        hardClearRatio: z.ZodOptional<z.ZodNumber>;
        minPrunableToolChars: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
        keepLastAssistants?: number | undefined;
        softTrimRatio?: number | undefined;
        hardClearRatio?: number | undefined;
        minPrunableToolChars?: number | undefined;
    }, {
        enabled?: boolean | undefined;
        keepLastAssistants?: number | undefined;
        softTrimRatio?: number | undefined;
        hardClearRatio?: number | undefined;
        minPrunableToolChars?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    model?: string | undefined;
    prompt?: string | undefined;
    enabled?: boolean | undefined;
    provider?: string | undefined;
    parameters?: Record<string, string | number | boolean | null> | undefined;
    trigger?: {
        type: "token_ratio";
        value: number;
    } | {
        type: "remaining_tokens";
        value: number;
    } | {
        type: "messages_to_refine";
        value: number;
    } | undefined;
    updatePrompt?: string | undefined;
    reserveRatio?: number | undefined;
    maxSummaryTokens?: number | undefined;
    contextPruning?: {
        enabled?: boolean | undefined;
        keepLastAssistants?: number | undefined;
        softTrimRatio?: number | undefined;
        hardClearRatio?: number | undefined;
        minPrunableToolChars?: number | undefined;
    } | undefined;
}, {
    model?: string | undefined;
    prompt?: string | undefined;
    enabled?: boolean | undefined;
    provider?: string | undefined;
    parameters?: Record<string, string | number | boolean | null> | undefined;
    trigger?: {
        type: "token_ratio";
        value: number;
    } | {
        type: "remaining_tokens";
        value: number;
    } | {
        type: "messages_to_refine";
        value: number;
    } | undefined;
    updatePrompt?: string | undefined;
    reserveRatio?: number | undefined;
    maxSummaryTokens?: number | undefined;
    contextPruning?: {
        enabled?: boolean | undefined;
        keepLastAssistants?: number | undefined;
        softTrimRatio?: number | undefined;
        hardClearRatio?: number | undefined;
        minPrunableToolChars?: number | undefined;
    } | undefined;
}>;
export type SummarizationConfig = z.infer<typeof summarizationConfigSchema>;
declare const customEndpointsSchema: z.ZodOptional<z.ZodArray<z.ZodObject<{
    streamRate: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    titlePrompt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    titleModel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    titleConvo: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    titleMethod: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>>;
    titleEndpoint: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    titlePromptTemplate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    titleTiming: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>>;
    maxToolResultChars: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    name: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    apiKey: z.ZodOptional<z.ZodString>;
    baseURL: z.ZodOptional<z.ZodString>;
    models: z.ZodOptional<z.ZodObject<{
        default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description?: string | undefined;
        }, {
            name: string;
            description?: string | undefined;
        }>]>, "many">;
        fetch: z.ZodOptional<z.ZodBoolean>;
        userIdQuery: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    }, {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    }>>;
    iconURL: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    modelDisplayLabel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    provider: z.ZodOptional<z.ZodOptional<z.ZodLiteral<EModelEndpoint.anthropic>>>;
    headers: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
    addParams: z.ZodOptional<z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>>;
    dropParams: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    customParams: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        defaultParamsEndpoint: z.ZodDefault<z.ZodString>;
        reasoningFormat: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningParameterFormat>>;
        reasoningKey: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningResponseKey>>;
        /** Replays `reasoning_content` within a run's tool-call turns (e.g. Xiaomi MiMo, Kimi). */
        includeReasoningContent: z.ZodOptional<z.ZodBoolean>;
        /** Also reconstructs `reasoning_content` from persisted history across turns (implies `includeReasoningContent`). */
        includeReasoningHistory: z.ZodOptional<z.ZodBoolean>;
        paramDefinitions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodNativeEnum<typeof SettingTypes>>;
            default: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            showLabel: z.ZodOptional<z.ZodBoolean>;
            showDefault: z.ZodOptional<z.ZodBoolean>;
            options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            range: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
                step: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                max: number;
                min: number;
                step?: number | undefined;
            }, {
                max: number;
                min: number;
                step?: number | undefined;
            }>>;
            enumMappings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString]>>>;
            component: z.ZodOptional<z.ZodNativeEnum<typeof ComponentTypes>>;
            optionType: z.ZodOptional<z.ZodNativeEnum<typeof OptionTypes>>;
            columnSpan: z.ZodOptional<z.ZodNumber>;
            columns: z.ZodOptional<z.ZodNumber>;
            label: z.ZodOptional<z.ZodString>;
            placeholder: z.ZodOptional<z.ZodString>;
            labelCode: z.ZodOptional<z.ZodBoolean>;
            placeholderCode: z.ZodOptional<z.ZodBoolean>;
            descriptionCode: z.ZodOptional<z.ZodBoolean>;
            minText: z.ZodOptional<z.ZodNumber>;
            maxText: z.ZodOptional<z.ZodNumber>;
            minTags: z.ZodOptional<z.ZodNumber>;
            maxTags: z.ZodOptional<z.ZodNumber>;
            includeInput: z.ZodOptional<z.ZodBoolean>;
            descriptionSide: z.ZodOptional<z.ZodEnum<["top", "right", "bottom", "left"]>>;
            searchPlaceholder: z.ZodOptional<z.ZodString>;
            selectPlaceholder: z.ZodOptional<z.ZodString>;
            searchPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
            selectPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }, {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        defaultParamsEndpoint: string;
        reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
        reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
        includeReasoningContent?: boolean | undefined;
        includeReasoningHistory?: boolean | undefined;
        paramDefinitions?: {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }[] | undefined;
    }, {
        defaultParamsEndpoint?: string | undefined;
        reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
        reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
        includeReasoningContent?: boolean | undefined;
        includeReasoningHistory?: boolean | undefined;
        paramDefinitions?: {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }[] | undefined;
    }>>>;
    directEndpoint: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    titleMessageRole: z.ZodOptional<z.ZodOptional<z.ZodEnum<["system", "user", "assistant"]>>>;
    tokenConfig: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        prompt: z.ZodNumber;
        completion: z.ZodNumber;
        context: z.ZodNumber;
        cacheRead: z.ZodOptional<z.ZodNumber>;
        cacheWrite: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        context: number;
        prompt: number;
        completion: number;
        cacheRead?: number | undefined;
        cacheWrite?: number | undefined;
    }, {
        context: number;
        prompt: number;
        completion: number;
        cacheRead?: number | undefined;
        cacheWrite?: number | undefined;
    }>>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    iconURL?: string | undefined;
    apiKey?: string | undefined;
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    provider?: EModelEndpoint.anthropic | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    models?: {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    } | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    modelDisplayLabel?: string | undefined;
    customParams?: {
        defaultParamsEndpoint: string;
        reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
        reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
        includeReasoningContent?: boolean | undefined;
        includeReasoningHistory?: boolean | undefined;
        paramDefinitions?: {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }[] | undefined;
    } | undefined;
    directEndpoint?: boolean | undefined;
    titleMessageRole?: "user" | "system" | "assistant" | undefined;
    tokenConfig?: Record<string, {
        context: number;
        prompt: number;
        completion: number;
        cacheRead?: number | undefined;
        cacheWrite?: number | undefined;
    }> | undefined;
}, {
    name?: string | undefined;
    iconURL?: string | undefined;
    apiKey?: string | undefined;
    headers?: Record<string, string> | undefined;
    baseURL?: string | undefined;
    provider?: EModelEndpoint.anthropic | undefined;
    streamRate?: number | undefined;
    titlePrompt?: string | undefined;
    titleModel?: string | undefined;
    titleConvo?: boolean | undefined;
    titleMethod?: "completion" | "functions" | "structured" | undefined;
    titleEndpoint?: string | undefined;
    titlePromptTemplate?: string | undefined;
    titleTiming?: "immediate" | "final" | undefined;
    maxToolResultChars?: number | undefined;
    models?: {
        default: (string | {
            name: string;
            description?: string | undefined;
        })[];
        fetch?: boolean | undefined;
        userIdQuery?: boolean | undefined;
    } | undefined;
    addParams?: Record<string, unknown> | undefined;
    dropParams?: string[] | undefined;
    modelDisplayLabel?: string | undefined;
    customParams?: {
        defaultParamsEndpoint?: string | undefined;
        reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
        reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
        includeReasoningContent?: boolean | undefined;
        includeReasoningHistory?: boolean | undefined;
        paramDefinitions?: {
            key: string;
            type?: SettingTypes | undefined;
            options?: string[] | undefined;
            description?: string | undefined;
            label?: string | undefined;
            component?: ComponentTypes | undefined;
            default?: string | number | boolean | string[] | undefined;
            range?: {
                max: number;
                min: number;
                step?: number | undefined;
            } | undefined;
            minText?: number | undefined;
            maxText?: number | undefined;
            minTags?: number | undefined;
            maxTags?: number | undefined;
            columns?: number | undefined;
            showLabel?: boolean | undefined;
            showDefault?: boolean | undefined;
            enumMappings?: Record<string, string | number | boolean> | undefined;
            optionType?: OptionTypes | undefined;
            columnSpan?: number | undefined;
            placeholder?: string | undefined;
            labelCode?: boolean | undefined;
            placeholderCode?: boolean | undefined;
            descriptionCode?: boolean | undefined;
            includeInput?: boolean | undefined;
            descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
            searchPlaceholder?: string | undefined;
            selectPlaceholder?: string | undefined;
            searchPlaceholderCode?: boolean | undefined;
            selectPlaceholderCode?: boolean | undefined;
        }[] | undefined;
    } | undefined;
    directEndpoint?: boolean | undefined;
    titleMessageRole?: "user" | "system" | "assistant" | undefined;
    tokenConfig?: Record<string, {
        context: number;
        prompt: number;
        completion: number;
        cacheRead?: number | undefined;
        cacheWrite?: number | undefined;
    }> | undefined;
}>, "many">>;
export declare const messageFilterPiiSchema: z.ZodObject<{
    starterPatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    customPatterns: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        regex: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        regex: string;
    }, {
        id: string;
        label: string;
        regex: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    starterPatterns?: string[] | undefined;
    customPatterns?: {
        id: string;
        label: string;
        regex: string;
    }[] | undefined;
}, {
    starterPatterns?: string[] | undefined;
    customPatterns?: {
        id: string;
        label: string;
        regex: string;
    }[] | undefined;
}>;
export type MessageFilterPiiConfig = z.infer<typeof messageFilterPiiSchema>;
export declare const messageFilterSchema: z.ZodObject<{
    pii: z.ZodOptional<z.ZodObject<{
        starterPatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        customPatterns: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            regex: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            label: string;
            regex: string;
        }, {
            id: string;
            label: string;
            regex: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        starterPatterns?: string[] | undefined;
        customPatterns?: {
            id: string;
            label: string;
            regex: string;
        }[] | undefined;
    }, {
        starterPatterns?: string[] | undefined;
        customPatterns?: {
            id: string;
            label: string;
            regex: string;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    pii?: {
        starterPatterns?: string[] | undefined;
        customPatterns?: {
            id: string;
            label: string;
            regex: string;
        }[] | undefined;
    } | undefined;
}, {
    pii?: {
        starterPatterns?: string[] | undefined;
        customPatterns?: {
            id: string;
            label: string;
            regex: string;
        }[] | undefined;
    } | undefined;
}>;
export type MessageFilterConfig = z.infer<typeof messageFilterSchema>;
export declare const configSchema: z.ZodObject<{
    version: z.ZodString;
    cache: z.ZodDefault<z.ZodBoolean>;
    ocr: z.ZodOptional<z.ZodObject<{
        mistralModel: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        baseURL: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        strategy: z.ZodDefault<z.ZodNativeEnum<typeof OCRStrategy>>;
    }, "strip", z.ZodTypeAny, {
        apiKey: string;
        baseURL: string;
        strategy: OCRStrategy;
        mistralModel?: string | undefined;
    }, {
        apiKey?: string | undefined;
        mistralModel?: string | undefined;
        baseURL?: string | undefined;
        strategy?: OCRStrategy | undefined;
    }>>;
    webSearch: z.ZodOptional<z.ZodObject<{
        serperApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        searxngInstanceUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        searxngApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        firecrawlApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        firecrawlApiUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        firecrawlVersion: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        tavilyApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        tavilySearchUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        tavilyExtractUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        jinaApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        jinaApiUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        cohereApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        searchProvider: z.ZodOptional<z.ZodNativeEnum<typeof SearchProviders>>;
        scraperProvider: z.ZodOptional<z.ZodNativeEnum<typeof ScraperProviders>>;
        rerankerType: z.ZodOptional<z.ZodNativeEnum<typeof RerankerTypes>>;
        scraperTimeout: z.ZodOptional<z.ZodNumber>;
        safeSearch: z.ZodDefault<z.ZodNativeEnum<typeof SafeSearchTypes>>;
        firecrawlOptions: z.ZodOptional<z.ZodObject<{
            formats: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            includeTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            excludeTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            waitFor: z.ZodOptional<z.ZodNumber>;
            timeout: z.ZodOptional<z.ZodNumber>;
            maxAge: z.ZodOptional<z.ZodNumber>;
            mobile: z.ZodOptional<z.ZodBoolean>;
            skipTlsVerification: z.ZodOptional<z.ZodBoolean>;
            blockAds: z.ZodOptional<z.ZodBoolean>;
            removeBase64Images: z.ZodOptional<z.ZodBoolean>;
            parsePDF: z.ZodOptional<z.ZodBoolean>;
            storeInCache: z.ZodOptional<z.ZodBoolean>;
            zeroDataRetention: z.ZodOptional<z.ZodBoolean>;
            location: z.ZodOptional<z.ZodObject<{
                country: z.ZodOptional<z.ZodString>;
                languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                country?: string | undefined;
                languages?: string[] | undefined;
            }, {
                country?: string | undefined;
                languages?: string[] | undefined;
            }>>;
            onlyMainContent: z.ZodOptional<z.ZodBoolean>;
            changeTrackingOptions: z.ZodOptional<z.ZodObject<{
                modes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                prompt: z.ZodOptional<z.ZodString>;
                tag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            }, {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        }, {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        }>>;
        tavilySearchOptions: z.ZodOptional<z.ZodObject<{
            searchDepth: z.ZodOptional<z.ZodEnum<["basic", "advanced", "fast", "ultra-fast"]>>;
            maxResults: z.ZodOptional<z.ZodNumber>;
            includeImages: z.ZodOptional<z.ZodBoolean>;
            includeAnswer: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["basic", "advanced"]>]>>;
            includeRawContent: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["markdown", "text"]>]>>;
            includeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            excludeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            topic: z.ZodOptional<z.ZodEnum<["general", "news", "finance"]>>;
            timeRange: z.ZodOptional<z.ZodEnum<["day", "week", "month", "year", "d", "w", "m", "y"]>>;
            includeImageDescriptions: z.ZodOptional<z.ZodBoolean>;
            includeFavicon: z.ZodOptional<z.ZodBoolean>;
            chunksPerSource: z.ZodOptional<z.ZodNumber>;
            safeSearch: z.ZodOptional<z.ZodBoolean>;
            timeout: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        }, {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        }>>;
        tavilyScraperOptions: z.ZodOptional<z.ZodObject<{
            extractDepth: z.ZodOptional<z.ZodEnum<["basic", "advanced"]>>;
            includeImages: z.ZodOptional<z.ZodBoolean>;
            includeFavicon: z.ZodOptional<z.ZodBoolean>;
            format: z.ZodOptional<z.ZodEnum<["markdown", "text"]>>;
            timeout: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        }, {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        serperApiKey: string;
        searxngInstanceUrl: string;
        searxngApiKey: string;
        firecrawlApiKey: string;
        firecrawlApiUrl: string;
        firecrawlVersion: string;
        tavilyApiKey: string;
        tavilySearchUrl: string;
        tavilyExtractUrl: string;
        jinaApiKey: string;
        jinaApiUrl: string;
        cohereApiKey: string;
        safeSearch: SafeSearchTypes;
        searchProvider?: SearchProviders | undefined;
        scraperProvider?: ScraperProviders | undefined;
        rerankerType?: RerankerTypes | undefined;
        scraperTimeout?: number | undefined;
        firecrawlOptions?: {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        } | undefined;
        tavilySearchOptions?: {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        } | undefined;
        tavilyScraperOptions?: {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        } | undefined;
    }, {
        serperApiKey?: string | undefined;
        searxngInstanceUrl?: string | undefined;
        searxngApiKey?: string | undefined;
        firecrawlApiKey?: string | undefined;
        firecrawlApiUrl?: string | undefined;
        firecrawlVersion?: string | undefined;
        tavilyApiKey?: string | undefined;
        tavilySearchUrl?: string | undefined;
        tavilyExtractUrl?: string | undefined;
        jinaApiKey?: string | undefined;
        jinaApiUrl?: string | undefined;
        cohereApiKey?: string | undefined;
        searchProvider?: SearchProviders | undefined;
        scraperProvider?: ScraperProviders | undefined;
        rerankerType?: RerankerTypes | undefined;
        scraperTimeout?: number | undefined;
        safeSearch?: SafeSearchTypes | undefined;
        firecrawlOptions?: {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        } | undefined;
        tavilySearchOptions?: {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        } | undefined;
        tavilyScraperOptions?: {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        } | undefined;
    }>>;
    memory: z.ZodOptional<z.ZodObject<{
        disabled: z.ZodOptional<z.ZodBoolean>;
        validKeys: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tokenLimit: z.ZodOptional<z.ZodNumber>;
        charLimit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxInputTokens: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        personalize: z.ZodDefault<z.ZodBoolean>;
        messageWindowSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        agent: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            enabled?: boolean | undefined;
        }, {
            id: string;
            enabled?: boolean | undefined;
        }>, z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            provider: z.ZodString;
            model: z.ZodString;
            instructions: z.ZodOptional<z.ZodString>;
            model_parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        }, "strip", z.ZodTypeAny, {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        }, {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        }>]>>;
    }, "strip", z.ZodTypeAny, {
        charLimit: number;
        maxInputTokens: number;
        personalize: boolean;
        messageWindowSize: number;
        agent?: {
            id: string;
            enabled?: boolean | undefined;
        } | {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        } | undefined;
        disabled?: boolean | undefined;
        validKeys?: string[] | undefined;
        tokenLimit?: number | undefined;
    }, {
        agent?: {
            id: string;
            enabled?: boolean | undefined;
        } | {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        } | undefined;
        disabled?: boolean | undefined;
        validKeys?: string[] | undefined;
        tokenLimit?: number | undefined;
        charLimit?: number | undefined;
        maxInputTokens?: number | undefined;
        personalize?: boolean | undefined;
        messageWindowSize?: number | undefined;
    }>>;
    summarization: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
        trigger: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"token_ratio">;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: "token_ratio";
            value: number;
        }, {
            type: "token_ratio";
            value: number;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"remaining_tokens">;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: "remaining_tokens";
            value: number;
        }, {
            type: "remaining_tokens";
            value: number;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"messages_to_refine">;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: "messages_to_refine";
            value: number;
        }, {
            type: "messages_to_refine";
            value: number;
        }>]>>;
        prompt: z.ZodOptional<z.ZodString>;
        updatePrompt: z.ZodOptional<z.ZodString>;
        reserveRatio: z.ZodOptional<z.ZodNumber>;
        maxSummaryTokens: z.ZodOptional<z.ZodNumber>;
        contextPruning: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            keepLastAssistants: z.ZodOptional<z.ZodNumber>;
            softTrimRatio: z.ZodOptional<z.ZodNumber>;
            hardClearRatio: z.ZodOptional<z.ZodNumber>;
            minPrunableToolChars: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        }, {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        prompt?: string | undefined;
        enabled?: boolean | undefined;
        provider?: string | undefined;
        parameters?: Record<string, string | number | boolean | null> | undefined;
        trigger?: {
            type: "token_ratio";
            value: number;
        } | {
            type: "remaining_tokens";
            value: number;
        } | {
            type: "messages_to_refine";
            value: number;
        } | undefined;
        updatePrompt?: string | undefined;
        reserveRatio?: number | undefined;
        maxSummaryTokens?: number | undefined;
        contextPruning?: {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        } | undefined;
    }, {
        model?: string | undefined;
        prompt?: string | undefined;
        enabled?: boolean | undefined;
        provider?: string | undefined;
        parameters?: Record<string, string | number | boolean | null> | undefined;
        trigger?: {
            type: "token_ratio";
            value: number;
        } | {
            type: "remaining_tokens";
            value: number;
        } | {
            type: "messages_to_refine";
            value: number;
        } | undefined;
        updatePrompt?: string | undefined;
        reserveRatio?: number | undefined;
        maxSummaryTokens?: number | undefined;
        contextPruning?: {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        } | undefined;
    }>>;
    skillSync: z.ZodOptional<z.ZodObject<{
        github: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            intervalMinutes: z.ZodDefault<z.ZodNumber>;
            runOnStartup: z.ZodDefault<z.ZodBoolean>;
            sources: z.ZodDefault<z.ZodArray<z.ZodEffects<z.ZodObject<{
                id: z.ZodString;
                owner: z.ZodString;
                repo: z.ZodString;
                ref: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, string, string>>;
                paths: z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, "many">;
                skillDiscoveryDepth: z.ZodOptional<z.ZodNumber>;
                credentialKey: z.ZodOptional<z.ZodString>;
                token: z.ZodOptional<z.ZodString>;
                tenantId: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            }, "strip", z.ZodTypeAny, {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }, {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }>, {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }, {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            intervalMinutes: number;
            runOnStartup: boolean;
            sources: {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[];
        }, {
            enabled?: boolean | undefined;
            intervalMinutes?: number | undefined;
            runOnStartup?: boolean | undefined;
            sources?: {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[] | undefined;
        }>, {
            enabled: boolean;
            intervalMinutes: number;
            runOnStartup: boolean;
            sources: {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[];
        }, {
            enabled?: boolean | undefined;
            intervalMinutes?: number | undefined;
            runOnStartup?: boolean | undefined;
            sources?: {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        github?: {
            enabled: boolean;
            intervalMinutes: number;
            runOnStartup: boolean;
            sources: {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[];
        } | undefined;
    }, {
        github?: {
            enabled?: boolean | undefined;
            intervalMinutes?: number | undefined;
            runOnStartup?: boolean | undefined;
            sources?: {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[] | undefined;
        } | undefined;
    }>>;
    secureImageLinks: z.ZodOptional<z.ZodBoolean>;
    imageOutputType: z.ZodDefault<z.ZodNativeEnum<typeof EImageOutputType>>;
    includedTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    filteredTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    mcpServers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        startup: z.ZodOptional<z.ZodBoolean>;
        iconPath: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        sseReadTimeout: z.ZodOptional<z.ZodNumber>;
        initTimeout: z.ZodOptional<z.ZodNumber>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        requiresOAuth: z.ZodOptional<z.ZodBoolean>;
        oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            client_id: z.ZodOptional<z.ZodString>;
            client_secret: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
            redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof import(".").TokenExchangeMethodEnum>>;
            grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
            audience: z.ZodOptional<z.ZodString>;
            forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
            revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>>;
        oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiKey: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            source: z.ZodEnum<["admin", "user"]>;
            authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
            custom_header: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }>>;
        customUserVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }>>>;
    } & {
        type: z.ZodDefault<z.ZodLiteral<"stdio">>;
        obo: z.ZodOptional<z.ZodUndefined>;
        command: z.ZodString;
        args: z.ZodArray<z.ZodString, "many">;
        env: z.ZodEffects<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>, Record<string, string> | undefined, Record<string, string> | undefined>;
        stderr: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["pipe", "ignore", "inherit"]>, z.ZodNumber]>>;
    }, "strip", z.ZodTypeAny, {
        type: "stdio";
        command: string;
        args: string[];
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        env?: Record<string, string> | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
        stderr?: number | "pipe" | "ignore" | "inherit" | undefined;
    }, {
        command: string;
        args: string[];
        type?: "stdio" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        env?: Record<string, string> | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
        stderr?: number | "pipe" | "ignore" | "inherit" | undefined;
    }>, z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        startup: z.ZodOptional<z.ZodBoolean>;
        iconPath: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        sseReadTimeout: z.ZodOptional<z.ZodNumber>;
        initTimeout: z.ZodOptional<z.ZodNumber>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        requiresOAuth: z.ZodOptional<z.ZodBoolean>;
        oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            client_id: z.ZodOptional<z.ZodString>;
            client_secret: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
            redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof import(".").TokenExchangeMethodEnum>>;
            grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
            audience: z.ZodOptional<z.ZodString>;
            forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
            revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>>;
        oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiKey: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            source: z.ZodEnum<["admin", "user"]>;
            authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
            custom_header: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }>>;
        customUserVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }>>>;
    } & {
        type: z.ZodDefault<z.ZodLiteral<"websocket">>;
        obo: z.ZodOptional<z.ZodUndefined>;
        url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
    }, "strip", z.ZodTypeAny, {
        type: "websocket";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
    }, {
        url: string;
        type?: "websocket" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
    }>, z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        startup: z.ZodOptional<z.ZodBoolean>;
        iconPath: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        sseReadTimeout: z.ZodOptional<z.ZodNumber>;
        initTimeout: z.ZodOptional<z.ZodNumber>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        requiresOAuth: z.ZodOptional<z.ZodBoolean>;
        oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            client_id: z.ZodOptional<z.ZodString>;
            client_secret: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
            redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof import(".").TokenExchangeMethodEnum>>;
            grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
            audience: z.ZodOptional<z.ZodString>;
            forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
            revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>>;
        oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiKey: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            source: z.ZodEnum<["admin", "user"]>;
            authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
            custom_header: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }>>;
        customUserVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }>>>;
    } & {
        type: z.ZodDefault<z.ZodLiteral<"sse">>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        obo: z.ZodOptional<z.ZodObject<{
            scopes: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            scopes: string;
        }, {
            scopes: string;
        }>>;
        proxy: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
    }, "strip", z.ZodTypeAny, {
        type: "sse";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }, {
        url: string;
        type?: "sse" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }>, z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        startup: z.ZodOptional<z.ZodBoolean>;
        iconPath: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        sseReadTimeout: z.ZodOptional<z.ZodNumber>;
        initTimeout: z.ZodOptional<z.ZodNumber>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        requiresOAuth: z.ZodOptional<z.ZodBoolean>;
        oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            client_id: z.ZodOptional<z.ZodString>;
            client_secret: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
            redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof import(".").TokenExchangeMethodEnum>>;
            grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
            audience: z.ZodOptional<z.ZodString>;
            forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
            revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>>;
        oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiKey: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            source: z.ZodEnum<["admin", "user"]>;
            authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
            custom_header: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }>>;
        customUserVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }>>>;
    } & {
        type: z.ZodUnion<[z.ZodLiteral<"streamable-http">, z.ZodLiteral<"http">]>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        obo: z.ZodOptional<z.ZodObject<{
            scopes: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            scopes: string;
        }, {
            scopes: string;
        }>>;
        proxy: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
    }, "strip", z.ZodTypeAny, {
        type: "streamable-http" | "http";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }, {
        type: "streamable-http" | "http";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }>]>>>;
    mcpSettings: z.ZodOptional<z.ZodObject<{
        allowedDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        allowedAddresses: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, "many">>;
    }, "strip", z.ZodTypeAny, {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    }, {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    }>>;
    interface: z.ZodDefault<z.ZodObject<{
        privacyPolicy: z.ZodOptional<z.ZodObject<{
            externalUrl: z.ZodOptional<z.ZodString>;
            openNewTab: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        }, {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        }>>;
        termsOfService: z.ZodOptional<z.ZodObject<{
            externalUrl: z.ZodOptional<z.ZodString>;
            openNewTab: z.ZodOptional<z.ZodBoolean>;
            modalAcceptance: z.ZodOptional<z.ZodBoolean>;
            modalTitle: z.ZodOptional<z.ZodString>;
            modalContent: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        }, {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        }>>;
        customWelcome: z.ZodOptional<z.ZodString>;
        mcpServers: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            placeholder: z.ZodOptional<z.ZodString>;
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
            configureObo: z.ZodOptional<z.ZodBoolean>;
            trustCheckbox: z.ZodOptional<z.ZodObject<{
                label: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
                subLabel: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
            }, "strip", z.ZodTypeAny, {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            }, {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        }, {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        }>>>;
        modelSelect: z.ZodOptional<z.ZodBoolean>;
        parameters: z.ZodOptional<z.ZodBoolean>;
        multiConvo: z.ZodOptional<z.ZodBoolean>;
        bookmarks: z.ZodOptional<z.ZodBoolean>;
        memories: z.ZodOptional<z.ZodBoolean>;
        presets: z.ZodOptional<z.ZodBoolean>;
        prompts: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }>]>>;
        agents: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }>]>>;
        temporaryChat: z.ZodOptional<z.ZodBoolean>;
        temporaryChatRetention: z.ZodOptional<z.ZodNumber>;
        autoSubmitFromUrl: z.ZodOptional<z.ZodBoolean>;
        retentionMode: z.ZodDefault<z.ZodNativeEnum<typeof RetentionMode>>;
        retainAgentFiles: z.ZodOptional<z.ZodBoolean>;
        runCode: z.ZodOptional<z.ZodBoolean>;
        webSearch: z.ZodOptional<z.ZodBoolean>;
        contextUsage: z.ZodOptional<z.ZodBoolean>;
        contextCost: z.ZodOptional<z.ZodBoolean>;
        currency: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            rate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            code: string;
            rate: number;
        }, {
            code: string;
            rate: number;
        }>>;
        peoplePicker: z.ZodOptional<z.ZodObject<{
            users: z.ZodOptional<z.ZodBoolean>;
            groups: z.ZodOptional<z.ZodBoolean>;
            roles: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        }, {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        }>>;
        marketplace: z.ZodOptional<z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            use?: boolean | undefined;
        }, {
            use?: boolean | undefined;
        }>>;
        fileSearch: z.ZodOptional<z.ZodBoolean>;
        fileCitations: z.ZodOptional<z.ZodBoolean>;
        /** Tool keys (and `'mcp'` or an MCP server name) pinned to the prompt bar by default */
        defaultPinnedTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        buildInfo: z.ZodOptional<z.ZodBoolean>;
        remoteAgents: z.ZodOptional<z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }>>;
        skills: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
            defaultActiveOnShare: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        }>]>>;
        sharedLinks: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
            snapshotFiles: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        }>]>>;
    }, "strip", z.ZodTypeAny, {
        retentionMode: RetentionMode;
        agents?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        webSearch?: boolean | undefined;
        fileSearch?: boolean | undefined;
        mcpServers?: {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        } | undefined;
        skills?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        } | undefined;
        parameters?: boolean | undefined;
        privacyPolicy?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        } | undefined;
        termsOfService?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        } | undefined;
        customWelcome?: string | undefined;
        modelSelect?: boolean | undefined;
        multiConvo?: boolean | undefined;
        bookmarks?: boolean | undefined;
        memories?: boolean | undefined;
        presets?: boolean | undefined;
        prompts?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        temporaryChat?: boolean | undefined;
        temporaryChatRetention?: number | undefined;
        autoSubmitFromUrl?: boolean | undefined;
        retainAgentFiles?: boolean | undefined;
        runCode?: boolean | undefined;
        contextUsage?: boolean | undefined;
        contextCost?: boolean | undefined;
        currency?: {
            code: string;
            rate: number;
        } | undefined;
        peoplePicker?: {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        } | undefined;
        marketplace?: {
            use?: boolean | undefined;
        } | undefined;
        fileCitations?: boolean | undefined;
        defaultPinnedTools?: string[] | undefined;
        buildInfo?: boolean | undefined;
        remoteAgents?: {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        sharedLinks?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        } | undefined;
    }, {
        agents?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        webSearch?: boolean | undefined;
        fileSearch?: boolean | undefined;
        mcpServers?: {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        } | undefined;
        skills?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        } | undefined;
        parameters?: boolean | undefined;
        privacyPolicy?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        } | undefined;
        termsOfService?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        } | undefined;
        customWelcome?: string | undefined;
        modelSelect?: boolean | undefined;
        multiConvo?: boolean | undefined;
        bookmarks?: boolean | undefined;
        memories?: boolean | undefined;
        presets?: boolean | undefined;
        prompts?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        temporaryChat?: boolean | undefined;
        temporaryChatRetention?: number | undefined;
        autoSubmitFromUrl?: boolean | undefined;
        retentionMode?: RetentionMode | undefined;
        retainAgentFiles?: boolean | undefined;
        runCode?: boolean | undefined;
        contextUsage?: boolean | undefined;
        contextCost?: boolean | undefined;
        currency?: {
            code: string;
            rate: number;
        } | undefined;
        peoplePicker?: {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        } | undefined;
        marketplace?: {
            use?: boolean | undefined;
        } | undefined;
        fileCitations?: boolean | undefined;
        defaultPinnedTools?: string[] | undefined;
        buildInfo?: boolean | undefined;
        remoteAgents?: {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        sharedLinks?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        } | undefined;
    }>>;
    turnstile: z.ZodOptional<z.ZodObject<{
        siteKey: z.ZodString;
        options: z.ZodOptional<z.ZodDefault<z.ZodObject<{
            language: z.ZodDefault<z.ZodString>;
            size: z.ZodDefault<z.ZodEnum<["normal", "compact", "flexible", "invisible"]>>;
        }, "strip", z.ZodTypeAny, {
            language: string;
            size: "normal" | "compact" | "flexible" | "invisible";
        }, {
            language?: string | undefined;
            size?: "normal" | "compact" | "flexible" | "invisible" | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        siteKey: string;
        options?: {
            language: string;
            size: "normal" | "compact" | "flexible" | "invisible";
        } | undefined;
    }, {
        siteKey: string;
        options?: {
            language?: string | undefined;
            size?: "normal" | "compact" | "flexible" | "invisible" | undefined;
        } | undefined;
    }>>;
    fileStrategy: z.ZodDefault<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
    fileStrategies: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
        avatar: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
        image: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
        document: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
        skills: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
    }, "strip", z.ZodTypeAny, {
        avatar?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        default?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        skills?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        image?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        document?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    }, {
        avatar?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        default?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        skills?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        image?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        document?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    }>>;
    cloudfront: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
        domain: z.ZodString;
        distributionId: z.ZodOptional<z.ZodString>;
        invalidateOnDelete: z.ZodDefault<z.ZodBoolean>;
        imageSigning: z.ZodDefault<z.ZodEnum<["none", "cookies", "url"]>>;
        urlExpiry: z.ZodDefault<z.ZodNumber>;
        cookieExpiry: z.ZodDefault<z.ZodNumber>;
        cookieDomain: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        storageRegion: z.ZodOptional<z.ZodString>;
        includeRegionInPath: z.ZodDefault<z.ZodBoolean>;
        requireSignedAccess: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    }, {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    }>, {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    }, {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    }>, {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    }, {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    }>, {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    }, {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    }>>;
    actions: z.ZodOptional<z.ZodObject<{
        allowedDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        allowedAddresses: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, "many">>;
    }, "strip", z.ZodTypeAny, {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    }, {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    }>>;
    registration: z.ZodDefault<z.ZodObject<{
        socialLogins: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        allowedDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        allowedDomains?: string[] | undefined;
        socialLogins?: string[] | undefined;
    }, {
        allowedDomains?: string[] | undefined;
        socialLogins?: string[] | undefined;
    }>>;
    balance: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        startBalance: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        autoRefillEnabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        refillIntervalValue: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        refillIntervalUnit: z.ZodDefault<z.ZodOptional<z.ZodEnum<["seconds", "minutes", "hours", "days", "weeks", "months"]>>>;
        refillAmount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        startBalance: number;
        autoRefillEnabled: boolean;
        refillIntervalValue: number;
        refillIntervalUnit: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months";
        refillAmount: number;
    }, {
        enabled?: boolean | undefined;
        startBalance?: number | undefined;
        autoRefillEnabled?: boolean | undefined;
        refillIntervalValue?: number | undefined;
        refillIntervalUnit?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | undefined;
        refillAmount?: number | undefined;
    }>>;
    transactions: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
    }, {
        enabled?: boolean | undefined;
    }>>;
    speech: z.ZodOptional<z.ZodObject<{
        tts: z.ZodOptional<z.ZodObject<{
            openai: z.ZodOptional<z.ZodObject<{
                url: z.ZodOptional<z.ZodString>;
                apiKey: z.ZodString;
                model: z.ZodString;
                voices: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            }, {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            }>>;
            azureOpenAI: z.ZodOptional<z.ZodObject<{
                instanceName: z.ZodString;
                apiKey: z.ZodString;
                deploymentName: z.ZodString;
                apiVersion: z.ZodString;
                model: z.ZodString;
                voices: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            }, {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            }>>;
            elevenlabs: z.ZodOptional<z.ZodObject<{
                url: z.ZodOptional<z.ZodString>;
                websocketUrl: z.ZodOptional<z.ZodString>;
                apiKey: z.ZodString;
                model: z.ZodString;
                voices: z.ZodArray<z.ZodString, "many">;
                voice_settings: z.ZodOptional<z.ZodObject<{
                    similarity_boost: z.ZodOptional<z.ZodNumber>;
                    stability: z.ZodOptional<z.ZodNumber>;
                    style: z.ZodOptional<z.ZodNumber>;
                    use_speaker_boost: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                }, {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                }>>;
                pronunciation_dictionary_locators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            }, {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            }>>;
            localai: z.ZodOptional<z.ZodObject<{
                url: z.ZodString;
                apiKey: z.ZodOptional<z.ZodString>;
                voices: z.ZodArray<z.ZodString, "many">;
                backend: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            }, {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        }, {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        }>>;
        stt: z.ZodOptional<z.ZodObject<{
            openai: z.ZodOptional<z.ZodObject<{
                url: z.ZodOptional<z.ZodString>;
                apiKey: z.ZodString;
                model: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                model: string;
                apiKey: string;
                url?: string | undefined;
            }, {
                model: string;
                apiKey: string;
                url?: string | undefined;
            }>>;
            azureOpenAI: z.ZodOptional<z.ZodObject<{
                instanceName: z.ZodString;
                apiKey: z.ZodString;
                deploymentName: z.ZodString;
                apiVersion: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            }, {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        }, {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        }>>;
        speechTab: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            conversationMode: z.ZodOptional<z.ZodBoolean>;
            advancedMode: z.ZodOptional<z.ZodBoolean>;
            speechToText: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodBoolean>, z.ZodObject<{
                /** Keep in sync with STTProviders enum (defined below — cannot reference due to eval order) */
                engineSTT: z.ZodOptional<z.ZodEnum<["openai", "azureOpenAI"]>>;
                languageSTT: z.ZodOptional<z.ZodString>;
                autoTranscribeAudio: z.ZodOptional<z.ZodBoolean>;
                decibelValue: z.ZodOptional<z.ZodNumber>;
                autoSendText: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            }, {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            }>]>>;
            textToSpeech: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodBoolean>, z.ZodObject<{
                /** Keep in sync with TTSProviders enum (defined below — cannot reference due to eval order) */
                engineTTS: z.ZodOptional<z.ZodEnum<["openai", "azureOpenAI", "elevenlabs", "localai"]>>;
                voice: z.ZodOptional<z.ZodString>;
                languageTTS: z.ZodOptional<z.ZodString>;
                automaticPlayback: z.ZodOptional<z.ZodBoolean>;
                playbackRate: z.ZodOptional<z.ZodNumber>;
                cacheTTS: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            }, {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            }>]>>;
        }, "strip", z.ZodTypeAny, {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        }, {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        tts?: {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        } | undefined;
        stt?: {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        } | undefined;
        speechTab?: {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        } | undefined;
    }, {
        tts?: {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        } | undefined;
        stt?: {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        } | undefined;
        speechTab?: {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        } | undefined;
    }>>;
    rateLimits: z.ZodOptional<z.ZodObject<{
        fileUploads: z.ZodOptional<z.ZodObject<{
            ipMax: z.ZodOptional<z.ZodNumber>;
            ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
            userMax: z.ZodOptional<z.ZodNumber>;
            userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }>>;
        conversationsImport: z.ZodOptional<z.ZodObject<{
            ipMax: z.ZodOptional<z.ZodNumber>;
            ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
            userMax: z.ZodOptional<z.ZodNumber>;
            userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }>>;
        tts: z.ZodOptional<z.ZodObject<{
            ipMax: z.ZodOptional<z.ZodNumber>;
            ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
            userMax: z.ZodOptional<z.ZodNumber>;
            userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }>>;
        stt: z.ZodOptional<z.ZodObject<{
            ipMax: z.ZodOptional<z.ZodNumber>;
            ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
            userMax: z.ZodOptional<z.ZodNumber>;
            userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        tts?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        stt?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        fileUploads?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        conversationsImport?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
    }, {
        tts?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        stt?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        fileUploads?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        conversationsImport?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
    }>>;
    fileConfig: z.ZodOptional<z.ZodObject<{
        endpoints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            disabled: z.ZodOptional<z.ZodBoolean>;
            fileLimit: z.ZodOptional<z.ZodNumber>;
            fileSizeLimit: z.ZodOptional<z.ZodNumber>;
            totalSizeLimit: z.ZodOptional<z.ZodNumber>;
            supportedMimeTypes: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }>>>;
        skills: z.ZodOptional<z.ZodObject<{
            fileSizeLimit: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            fileSizeLimit?: number | undefined;
        }, {
            fileSizeLimit?: number | undefined;
        }>>;
        serverFileSizeLimit: z.ZodOptional<z.ZodNumber>;
        avatarSizeLimit: z.ZodOptional<z.ZodNumber>;
        fileTokenLimit: z.ZodOptional<z.ZodNumber>;
        imageGeneration: z.ZodOptional<z.ZodObject<{
            percentage: z.ZodOptional<z.ZodNumber>;
            px: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            percentage?: number | undefined;
            px?: number | undefined;
        }, {
            percentage?: number | undefined;
            px?: number | undefined;
        }>>;
        clientImageResize: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            maxHeight: z.ZodOptional<z.ZodNumber>;
            quality: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        }, {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        }>>;
        ocr: z.ZodOptional<z.ZodObject<{
            supportedMimeTypes: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            supportedMimeTypes?: string[] | undefined;
        }, {
            supportedMimeTypes?: string[] | undefined;
        }>>;
        text: z.ZodOptional<z.ZodObject<{
            supportedMimeTypes: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            supportedMimeTypes?: string[] | undefined;
        }, {
            supportedMimeTypes?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        fileTokenLimit?: number | undefined;
        text?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
        skills?: {
            fileSizeLimit?: number | undefined;
        } | undefined;
        endpoints?: Record<string, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }> | undefined;
        serverFileSizeLimit?: number | undefined;
        avatarSizeLimit?: number | undefined;
        imageGeneration?: {
            percentage?: number | undefined;
            px?: number | undefined;
        } | undefined;
        clientImageResize?: {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        } | undefined;
        ocr?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
    }, {
        fileTokenLimit?: number | undefined;
        text?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
        skills?: {
            fileSizeLimit?: number | undefined;
        } | undefined;
        endpoints?: Record<string, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }> | undefined;
        serverFileSizeLimit?: number | undefined;
        avatarSizeLimit?: number | undefined;
        imageGeneration?: {
            percentage?: number | undefined;
            px?: number | undefined;
        } | undefined;
        clientImageResize?: {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        } | undefined;
        ocr?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
    }>>;
    modelSpecs: z.ZodOptional<z.ZodObject<{
        enforce: z.ZodDefault<z.ZodBoolean>;
        prioritize: z.ZodDefault<z.ZodBoolean>;
        list: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodString;
            preset: z.ZodObject<Omit<{
                user: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                endpointType: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof EModelEndpoint>>>;
                isArchived: z.ZodOptional<z.ZodBoolean>;
                pinned: z.ZodOptional<z.ZodBoolean>;
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
                thinkingLevel: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ThinkingLevel>>;
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
                resendFiles: z.ZodOptional<z.ZodBoolean>;
                file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                imageDetail: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ImageDetail>>;
                reasoning_effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningEffort>>>;
                reasoning_summary: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningSummary>>>;
                verbosity: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").Verbosity>>>;
                useResponsesApi: z.ZodOptional<z.ZodBoolean>;
                effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").AnthropicEffort>>>;
                thinkingDisplay: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ThinkingDisplay>>>;
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
            } & {
                conversationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                presetId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                defaultPreset: z.ZodOptional<z.ZodBoolean>;
                order: z.ZodOptional<z.ZodNumber>;
                endpoint: z.ZodNullable<z.ZodUnion<[z.ZodNativeEnum<typeof EModelEndpoint>, z.ZodString]>>;
            }, "user" | "tags" | "conversationId" | "isArchived" | "title" | "messages" | "parentMessageId" | "file_ids" | "presetOverride" | "spec" | "expiredAt" | "resendImages" | "chatGptLabel" | "presetId" | "defaultPreset" | "order">, "strip", z.ZodTypeAny, {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: number | null | undefined;
                maxContextTokens?: number | undefined;
                max_tokens?: number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: number | undefined;
            }, {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: string | number | null | undefined;
                maxContextTokens?: string | number | undefined;
                max_tokens?: string | number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: string | number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: string | number | undefined;
            }>;
            order: z.ZodOptional<z.ZodNumber>;
            default: z.ZodOptional<z.ZodBoolean>;
            softDefault: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            group: z.ZodOptional<z.ZodString>;
            groupIcon: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>>;
            showIconInMenu: z.ZodOptional<z.ZodBoolean>;
            showIconInHeader: z.ZodOptional<z.ZodBoolean>;
            showOnLanding: z.ZodOptional<z.ZodBoolean>;
            conversation_starters: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            iconURL: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>>;
            authType: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").AuthType>>;
            hideBadgeRow: z.ZodOptional<z.ZodBoolean>;
            webSearch: z.ZodOptional<z.ZodBoolean>;
            fileSearch: z.ZodOptional<z.ZodBoolean>;
            executeCode: z.ZodOptional<z.ZodBoolean>;
            artifacts: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
            mcpServers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skills: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            subagents: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodOptional<z.ZodBoolean>;
                allowSelf: z.ZodOptional<z.ZodBoolean>;
                agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            }, {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: number | null | undefined;
                maxContextTokens?: number | undefined;
                max_tokens?: number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }, {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: string | number | null | undefined;
                maxContextTokens?: string | number | undefined;
                max_tokens?: string | number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: string | number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: string | number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }>, "many">>;
        addedEndpoints: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        enforce: boolean;
        prioritize: boolean;
        list: {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: number | null | undefined;
                maxContextTokens?: number | undefined;
                max_tokens?: number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }[];
        addedEndpoints?: string[] | undefined;
    }, {
        enforce?: boolean | undefined;
        prioritize?: boolean | undefined;
        list?: {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: string | number | null | undefined;
                maxContextTokens?: string | number | undefined;
                max_tokens?: string | number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: string | number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: string | number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }[] | undefined;
        addedEndpoints?: string[] | undefined;
    }>>;
    messageFilter: z.ZodOptional<z.ZodObject<{
        pii: z.ZodOptional<z.ZodObject<{
            starterPatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            customPatterns: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                regex: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                label: string;
                regex: string;
            }, {
                id: string;
                label: string;
                regex: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        }, {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        pii?: {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        } | undefined;
    }, {
        pii?: {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        } | undefined;
    }>>;
    endpoints: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        allowedAddresses: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, "many">>;
        all: z.ZodOptional<z.ZodObject<Omit<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        }, "baseURL">, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }>>;
        openAI: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }>>;
        google: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }>>;
        anthropic: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        } & {
            /** Vertex AI configuration for running Anthropic models on Google Cloud */
            vertex: z.ZodOptional<z.ZodObject<{
                /** Enable Vertex AI mode for Anthropic (defaults to true when vertex config is present) */
                enabled: z.ZodOptional<z.ZodBoolean>;
                /** Google Cloud Project ID (optional - auto-detected from service key file if not provided) */
                projectId: z.ZodOptional<z.ZodString>;
                /** Vertex AI region (e.g., 'us-east5', 'europe-west1') */
                region: z.ZodDefault<z.ZodString>;
                /** Optional: Path to service account key file */
                serviceKeyFile: z.ZodOptional<z.ZodString>;
                /** Optional: Default deployment name for all models (can be overridden per model) */
                deploymentName: z.ZodOptional<z.ZodString>;
                /** Optional: Available models - can be string array or object with deploymentName mapping */
                models: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
                    /** The actual model ID/deployment name used by Vertex AI API */
                    deploymentName: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    deploymentName?: string | undefined;
                }, {
                    deploymentName?: string | undefined;
                }>, z.ZodBoolean]>>]>>;
            }, "strip", z.ZodTypeAny, {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            }, {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            }>>;
            /** Optional: List of available models */
            models: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        }>>;
        azureOpenAI: z.ZodOptional<z.ZodIntersection<z.ZodObject<{
            groups: z.ZodArray<z.ZodIntersection<z.ZodObject<{
                group: z.ZodString;
                models: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
                    deploymentName: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    assistants: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }, {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>, z.ZodBoolean]>>;
            }, "strip", z.ZodTypeAny, {
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            }, {
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            }>, z.ZodObject<{
                apiKey: z.ZodString;
                serverless: z.ZodOptional<z.ZodBoolean>;
                instanceName: z.ZodOptional<z.ZodString>;
                deploymentName: z.ZodOptional<z.ZodString>;
                assistants: z.ZodOptional<z.ZodBoolean>;
                addParams: z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>;
                dropParams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                version: z.ZodOptional<z.ZodString>;
                baseURL: z.ZodOptional<z.ZodString>;
                additionalHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            }, {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            }>>, "many">;
            assistants: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        }, {
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        }>, z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
            titlePrompt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleModel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleConvo: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            titleMethod: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>>;
            titlePromptTemplate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleTiming: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>>;
        }, "strip", z.ZodTypeAny, {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }, {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }>>>;
        azureAssistants: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        } & {
            disableBuilder: z.ZodOptional<z.ZodBoolean>;
            pollIntervalMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            version: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            supportedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            excludedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            privateAssistants: z.ZodOptional<z.ZodBoolean>;
            retrievalModels: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            capabilities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof Capabilities>, "many">>>;
            apiKey: z.ZodOptional<z.ZodString>;
            models: z.ZodOptional<z.ZodObject<{
                default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    description?: string | undefined;
                }, {
                    name: string;
                    description?: string | undefined;
                }>]>, "many">;
                fetch: z.ZodOptional<z.ZodBoolean>;
                userIdQuery: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        }, {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        }>>;
        assistants: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        } & {
            disableBuilder: z.ZodOptional<z.ZodBoolean>;
            pollIntervalMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            version: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            supportedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            excludedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            privateAssistants: z.ZodOptional<z.ZodBoolean>;
            retrievalModels: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            capabilities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof Capabilities>, "many">>>;
            apiKey: z.ZodOptional<z.ZodString>;
            models: z.ZodOptional<z.ZodObject<{
                default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    description?: string | undefined;
                }, {
                    name: string;
                    description?: string | undefined;
                }>]>, "many">;
                fetch: z.ZodOptional<z.ZodBoolean>;
                userIdQuery: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        }, {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        }>>;
        agents: z.ZodOptional<z.ZodDefault<z.ZodObject<Omit<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        }, "baseURL"> & {
            recursionLimit: z.ZodOptional<z.ZodNumber>;
            disableBuilder: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            maxRecursionLimit: z.ZodOptional<z.ZodNumber>;
            maxCitations: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            maxCitationsPerFile: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            minRelevanceScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            allowedProviders: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>, "many">>;
            capabilities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof AgentCapabilities>, "many">>>;
            skills: z.ZodOptional<z.ZodObject<{
                maxCatalogSkills: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                maxCatalogSkills?: number | undefined;
            }, {
                maxCatalogSkills?: number | undefined;
            }>>;
            remoteApi: z.ZodOptional<z.ZodObject<{
                auth: z.ZodOptional<z.ZodObject<{
                    apiKey: z.ZodOptional<z.ZodObject<{
                        enabled: z.ZodDefault<z.ZodBoolean>;
                    }, "strip", z.ZodTypeAny, {
                        enabled: boolean;
                    }, {
                        enabled?: boolean | undefined;
                    }>>;
                    oidc: z.ZodOptional<z.ZodEffects<z.ZodObject<{
                        enabled: z.ZodDefault<z.ZodBoolean>;
                        issuer: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                        audience: z.ZodOptional<z.ZodString>;
                        jwksUri: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                        scope: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                    }, "strip", z.ZodTypeAny, {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    }, {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    }>, {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    }, {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    }>>;
                }, "strip", z.ZodTypeAny, {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                }, {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            }, {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            disableBuilder: boolean;
            capabilities: AgentCapabilities[];
            maxCitations: number;
            maxCitationsPerFile: number;
            minRelevanceScore: number;
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        }, {
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            disableBuilder?: boolean | undefined;
            capabilities?: AgentCapabilities[] | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            maxCitations?: number | undefined;
            maxCitationsPerFile?: number | undefined;
            minRelevanceScore?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        }>>>;
        custom: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
            titlePrompt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleModel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleConvo: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            titleMethod: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>>;
            titleEndpoint: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titlePromptTemplate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleTiming: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>>;
            maxToolResultChars: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
            name: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            apiKey: z.ZodOptional<z.ZodString>;
            baseURL: z.ZodOptional<z.ZodString>;
            models: z.ZodOptional<z.ZodObject<{
                default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    description?: string | undefined;
                }, {
                    name: string;
                    description?: string | undefined;
                }>]>, "many">;
                fetch: z.ZodOptional<z.ZodBoolean>;
                userIdQuery: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }>>;
            iconURL: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            modelDisplayLabel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            provider: z.ZodOptional<z.ZodOptional<z.ZodLiteral<EModelEndpoint.anthropic>>>;
            headers: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
            addParams: z.ZodOptional<z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>>;
            dropParams: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            customParams: z.ZodOptional<z.ZodOptional<z.ZodObject<{
                defaultParamsEndpoint: z.ZodDefault<z.ZodString>;
                reasoningFormat: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningParameterFormat>>;
                reasoningKey: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningResponseKey>>;
                /** Replays `reasoning_content` within a run's tool-call turns (e.g. Xiaomi MiMo, Kimi). */
                includeReasoningContent: z.ZodOptional<z.ZodBoolean>;
                /** Also reconstructs `reasoning_content` from persisted history across turns (implies `includeReasoningContent`). */
                includeReasoningHistory: z.ZodOptional<z.ZodBoolean>;
                paramDefinitions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    key: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    type: z.ZodOptional<z.ZodNativeEnum<typeof SettingTypes>>;
                    default: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                    showLabel: z.ZodOptional<z.ZodBoolean>;
                    showDefault: z.ZodOptional<z.ZodBoolean>;
                    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    range: z.ZodOptional<z.ZodObject<{
                        min: z.ZodNumber;
                        max: z.ZodNumber;
                        step: z.ZodOptional<z.ZodNumber>;
                    }, "strip", z.ZodTypeAny, {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    }, {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    }>>;
                    enumMappings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString]>>>;
                    component: z.ZodOptional<z.ZodNativeEnum<typeof ComponentTypes>>;
                    optionType: z.ZodOptional<z.ZodNativeEnum<typeof OptionTypes>>;
                    columnSpan: z.ZodOptional<z.ZodNumber>;
                    columns: z.ZodOptional<z.ZodNumber>;
                    label: z.ZodOptional<z.ZodString>;
                    placeholder: z.ZodOptional<z.ZodString>;
                    labelCode: z.ZodOptional<z.ZodBoolean>;
                    placeholderCode: z.ZodOptional<z.ZodBoolean>;
                    descriptionCode: z.ZodOptional<z.ZodBoolean>;
                    minText: z.ZodOptional<z.ZodNumber>;
                    maxText: z.ZodOptional<z.ZodNumber>;
                    minTags: z.ZodOptional<z.ZodNumber>;
                    maxTags: z.ZodOptional<z.ZodNumber>;
                    includeInput: z.ZodOptional<z.ZodBoolean>;
                    descriptionSide: z.ZodOptional<z.ZodEnum<["top", "right", "bottom", "left"]>>;
                    searchPlaceholder: z.ZodOptional<z.ZodString>;
                    selectPlaceholder: z.ZodOptional<z.ZodString>;
                    searchPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
                    selectPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }, {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }>, "many">>;
            }, "strict", z.ZodTypeAny, {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            }, {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            }>>>;
            directEndpoint: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            titleMessageRole: z.ZodOptional<z.ZodOptional<z.ZodEnum<["system", "user", "assistant"]>>>;
            tokenConfig: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                prompt: z.ZodNumber;
                completion: z.ZodNumber;
                context: z.ZodNumber;
                cacheRead: z.ZodOptional<z.ZodNumber>;
                cacheWrite: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }>>>>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }, {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }>, "many">>>;
        bedrock: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        } & {
            availableRegions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            models: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            guardrailConfig: z.ZodOptional<z.ZodObject<{
                guardrailIdentifier: z.ZodString;
                guardrailVersion: z.ZodString;
                trace: z.ZodOptional<z.ZodEnum<["enabled", "disabled", "enabled_full"]>>;
                streamProcessingMode: z.ZodOptional<z.ZodEnum<["sync", "async"]>>;
            }, "strip", z.ZodTypeAny, {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            }, {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            }>>;
            inferenceProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        azureAssistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        agents?: {
            disableBuilder: boolean;
            capabilities: AgentCapabilities[];
            maxCitations: number;
            maxCitationsPerFile: number;
            minRelevanceScore: number;
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    }, {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        azureAssistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        agents?: {
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            disableBuilder?: boolean | undefined;
            capabilities?: AgentCapabilities[] | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            maxCitations?: number | undefined;
            maxCitationsPerFile?: number | undefined;
            minRelevanceScore?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    }>, {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        azureAssistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        agents?: {
            disableBuilder: boolean;
            capabilities: AgentCapabilities[];
            maxCitations: number;
            maxCitationsPerFile: number;
            minRelevanceScore: number;
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    }, {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        azureAssistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        agents?: {
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            disableBuilder?: boolean | undefined;
            capabilities?: AgentCapabilities[] | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            maxCitations?: number | undefined;
            maxCitationsPerFile?: number | undefined;
            minRelevanceScore?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    version: string;
    cache: boolean;
    imageOutputType: EImageOutputType;
    interface: {
        retentionMode: RetentionMode;
        agents?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        webSearch?: boolean | undefined;
        fileSearch?: boolean | undefined;
        mcpServers?: {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        } | undefined;
        skills?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        } | undefined;
        parameters?: boolean | undefined;
        privacyPolicy?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        } | undefined;
        termsOfService?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        } | undefined;
        customWelcome?: string | undefined;
        modelSelect?: boolean | undefined;
        multiConvo?: boolean | undefined;
        bookmarks?: boolean | undefined;
        memories?: boolean | undefined;
        presets?: boolean | undefined;
        prompts?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        temporaryChat?: boolean | undefined;
        temporaryChatRetention?: number | undefined;
        autoSubmitFromUrl?: boolean | undefined;
        retainAgentFiles?: boolean | undefined;
        runCode?: boolean | undefined;
        contextUsage?: boolean | undefined;
        contextCost?: boolean | undefined;
        currency?: {
            code: string;
            rate: number;
        } | undefined;
        peoplePicker?: {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        } | undefined;
        marketplace?: {
            use?: boolean | undefined;
        } | undefined;
        fileCitations?: boolean | undefined;
        defaultPinnedTools?: string[] | undefined;
        buildInfo?: boolean | undefined;
        remoteAgents?: {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        sharedLinks?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        } | undefined;
    };
    fileStrategy: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront;
    registration: {
        allowedDomains?: string[] | undefined;
        socialLogins?: string[] | undefined;
    };
    summarization?: {
        model?: string | undefined;
        prompt?: string | undefined;
        enabled?: boolean | undefined;
        provider?: string | undefined;
        parameters?: Record<string, string | number | boolean | null> | undefined;
        trigger?: {
            type: "token_ratio";
            value: number;
        } | {
            type: "remaining_tokens";
            value: number;
        } | {
            type: "messages_to_refine";
            value: number;
        } | undefined;
        updatePrompt?: string | undefined;
        reserveRatio?: number | undefined;
        maxSummaryTokens?: number | undefined;
        contextPruning?: {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        } | undefined;
    } | undefined;
    webSearch?: {
        serperApiKey: string;
        searxngInstanceUrl: string;
        searxngApiKey: string;
        firecrawlApiKey: string;
        firecrawlApiUrl: string;
        firecrawlVersion: string;
        tavilyApiKey: string;
        tavilySearchUrl: string;
        tavilyExtractUrl: string;
        jinaApiKey: string;
        jinaApiUrl: string;
        cohereApiKey: string;
        safeSearch: SafeSearchTypes;
        searchProvider?: SearchProviders | undefined;
        scraperProvider?: ScraperProviders | undefined;
        rerankerType?: RerankerTypes | undefined;
        scraperTimeout?: number | undefined;
        firecrawlOptions?: {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        } | undefined;
        tavilySearchOptions?: {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        } | undefined;
        tavilyScraperOptions?: {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        } | undefined;
    } | undefined;
    mcpServers?: Record<string, {
        type: "stdio";
        command: string;
        args: string[];
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        env?: Record<string, string> | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
        stderr?: number | "pipe" | "ignore" | "inherit" | undefined;
    } | {
        type: "websocket";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
    } | {
        type: "sse";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    } | {
        type: "streamable-http" | "http";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }> | undefined;
    cloudfront?: {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    } | undefined;
    endpoints?: {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        azureAssistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        agents?: {
            disableBuilder: boolean;
            capabilities: AgentCapabilities[];
            maxCitations: number;
            maxCitationsPerFile: number;
            minRelevanceScore: number;
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    } | undefined;
    ocr?: {
        apiKey: string;
        baseURL: string;
        strategy: OCRStrategy;
        mistralModel?: string | undefined;
    } | undefined;
    fileConfig?: {
        fileTokenLimit?: number | undefined;
        text?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
        skills?: {
            fileSizeLimit?: number | undefined;
        } | undefined;
        endpoints?: Record<string, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }> | undefined;
        serverFileSizeLimit?: number | undefined;
        avatarSizeLimit?: number | undefined;
        imageGeneration?: {
            percentage?: number | undefined;
            px?: number | undefined;
        } | undefined;
        clientImageResize?: {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        } | undefined;
        ocr?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
    } | undefined;
    memory?: {
        charLimit: number;
        maxInputTokens: number;
        personalize: boolean;
        messageWindowSize: number;
        agent?: {
            id: string;
            enabled?: boolean | undefined;
        } | {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        } | undefined;
        disabled?: boolean | undefined;
        validKeys?: string[] | undefined;
        tokenLimit?: number | undefined;
    } | undefined;
    skillSync?: {
        github?: {
            enabled: boolean;
            intervalMinutes: number;
            runOnStartup: boolean;
            sources: {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[];
        } | undefined;
    } | undefined;
    secureImageLinks?: boolean | undefined;
    includedTools?: string[] | undefined;
    filteredTools?: string[] | undefined;
    mcpSettings?: {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    } | undefined;
    turnstile?: {
        siteKey: string;
        options?: {
            language: string;
            size: "normal" | "compact" | "flexible" | "invisible";
        } | undefined;
    } | undefined;
    fileStrategies?: {
        avatar?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        default?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        skills?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        image?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        document?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    } | undefined;
    actions?: {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    } | undefined;
    balance?: {
        enabled: boolean;
        startBalance: number;
        autoRefillEnabled: boolean;
        refillIntervalValue: number;
        refillIntervalUnit: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months";
        refillAmount: number;
    } | undefined;
    transactions?: {
        enabled: boolean;
    } | undefined;
    speech?: {
        tts?: {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        } | undefined;
        stt?: {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        } | undefined;
        speechTab?: {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    rateLimits?: {
        tts?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        stt?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        fileUploads?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        conversationsImport?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
    } | undefined;
    modelSpecs?: {
        enforce: boolean;
        prioritize: boolean;
        list: {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: number | null | undefined;
                maxContextTokens?: number | undefined;
                max_tokens?: number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }[];
        addedEndpoints?: string[] | undefined;
    } | undefined;
    messageFilter?: {
        pii?: {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        } | undefined;
    } | undefined;
}, {
    version: string;
    summarization?: {
        model?: string | undefined;
        prompt?: string | undefined;
        enabled?: boolean | undefined;
        provider?: string | undefined;
        parameters?: Record<string, string | number | boolean | null> | undefined;
        trigger?: {
            type: "token_ratio";
            value: number;
        } | {
            type: "remaining_tokens";
            value: number;
        } | {
            type: "messages_to_refine";
            value: number;
        } | undefined;
        updatePrompt?: string | undefined;
        reserveRatio?: number | undefined;
        maxSummaryTokens?: number | undefined;
        contextPruning?: {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        } | undefined;
    } | undefined;
    webSearch?: {
        serperApiKey?: string | undefined;
        searxngInstanceUrl?: string | undefined;
        searxngApiKey?: string | undefined;
        firecrawlApiKey?: string | undefined;
        firecrawlApiUrl?: string | undefined;
        firecrawlVersion?: string | undefined;
        tavilyApiKey?: string | undefined;
        tavilySearchUrl?: string | undefined;
        tavilyExtractUrl?: string | undefined;
        jinaApiKey?: string | undefined;
        jinaApiUrl?: string | undefined;
        cohereApiKey?: string | undefined;
        searchProvider?: SearchProviders | undefined;
        scraperProvider?: ScraperProviders | undefined;
        rerankerType?: RerankerTypes | undefined;
        scraperTimeout?: number | undefined;
        safeSearch?: SafeSearchTypes | undefined;
        firecrawlOptions?: {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        } | undefined;
        tavilySearchOptions?: {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        } | undefined;
        tavilyScraperOptions?: {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        } | undefined;
    } | undefined;
    mcpServers?: Record<string, {
        command: string;
        args: string[];
        type?: "stdio" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        env?: Record<string, string> | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
        stderr?: number | "pipe" | "ignore" | "inherit" | undefined;
    } | {
        url: string;
        type?: "websocket" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
    } | {
        url: string;
        type?: "sse" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    } | {
        type: "streamable-http" | "http";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }> | undefined;
    cloudfront?: {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    } | undefined;
    endpoints?: {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        azureAssistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        agents?: {
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            disableBuilder?: boolean | undefined;
            capabilities?: AgentCapabilities[] | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            maxCitations?: number | undefined;
            maxCitationsPerFile?: number | undefined;
            minRelevanceScore?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    } | undefined;
    ocr?: {
        apiKey?: string | undefined;
        mistralModel?: string | undefined;
        baseURL?: string | undefined;
        strategy?: OCRStrategy | undefined;
    } | undefined;
    fileConfig?: {
        fileTokenLimit?: number | undefined;
        text?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
        skills?: {
            fileSizeLimit?: number | undefined;
        } | undefined;
        endpoints?: Record<string, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }> | undefined;
        serverFileSizeLimit?: number | undefined;
        avatarSizeLimit?: number | undefined;
        imageGeneration?: {
            percentage?: number | undefined;
            px?: number | undefined;
        } | undefined;
        clientImageResize?: {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        } | undefined;
        ocr?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
    } | undefined;
    cache?: boolean | undefined;
    memory?: {
        agent?: {
            id: string;
            enabled?: boolean | undefined;
        } | {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        } | undefined;
        disabled?: boolean | undefined;
        validKeys?: string[] | undefined;
        tokenLimit?: number | undefined;
        charLimit?: number | undefined;
        maxInputTokens?: number | undefined;
        personalize?: boolean | undefined;
        messageWindowSize?: number | undefined;
    } | undefined;
    skillSync?: {
        github?: {
            enabled?: boolean | undefined;
            intervalMinutes?: number | undefined;
            runOnStartup?: boolean | undefined;
            sources?: {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[] | undefined;
        } | undefined;
    } | undefined;
    secureImageLinks?: boolean | undefined;
    imageOutputType?: EImageOutputType | undefined;
    includedTools?: string[] | undefined;
    filteredTools?: string[] | undefined;
    mcpSettings?: {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    } | undefined;
    interface?: {
        agents?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        webSearch?: boolean | undefined;
        fileSearch?: boolean | undefined;
        mcpServers?: {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        } | undefined;
        skills?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        } | undefined;
        parameters?: boolean | undefined;
        privacyPolicy?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        } | undefined;
        termsOfService?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        } | undefined;
        customWelcome?: string | undefined;
        modelSelect?: boolean | undefined;
        multiConvo?: boolean | undefined;
        bookmarks?: boolean | undefined;
        memories?: boolean | undefined;
        presets?: boolean | undefined;
        prompts?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        temporaryChat?: boolean | undefined;
        temporaryChatRetention?: number | undefined;
        autoSubmitFromUrl?: boolean | undefined;
        retentionMode?: RetentionMode | undefined;
        retainAgentFiles?: boolean | undefined;
        runCode?: boolean | undefined;
        contextUsage?: boolean | undefined;
        contextCost?: boolean | undefined;
        currency?: {
            code: string;
            rate: number;
        } | undefined;
        peoplePicker?: {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        } | undefined;
        marketplace?: {
            use?: boolean | undefined;
        } | undefined;
        fileCitations?: boolean | undefined;
        defaultPinnedTools?: string[] | undefined;
        buildInfo?: boolean | undefined;
        remoteAgents?: {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        sharedLinks?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        } | undefined;
    } | undefined;
    turnstile?: {
        siteKey: string;
        options?: {
            language?: string | undefined;
            size?: "normal" | "compact" | "flexible" | "invisible" | undefined;
        } | undefined;
    } | undefined;
    fileStrategy?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    fileStrategies?: {
        avatar?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        default?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        skills?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        image?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        document?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    } | undefined;
    actions?: {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    } | undefined;
    registration?: {
        allowedDomains?: string[] | undefined;
        socialLogins?: string[] | undefined;
    } | undefined;
    balance?: {
        enabled?: boolean | undefined;
        startBalance?: number | undefined;
        autoRefillEnabled?: boolean | undefined;
        refillIntervalValue?: number | undefined;
        refillIntervalUnit?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | undefined;
        refillAmount?: number | undefined;
    } | undefined;
    transactions?: {
        enabled?: boolean | undefined;
    } | undefined;
    speech?: {
        tts?: {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        } | undefined;
        stt?: {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        } | undefined;
        speechTab?: {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    rateLimits?: {
        tts?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        stt?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        fileUploads?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        conversationsImport?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
    } | undefined;
    modelSpecs?: {
        enforce?: boolean | undefined;
        prioritize?: boolean | undefined;
        list?: {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: string | number | null | undefined;
                maxContextTokens?: string | number | undefined;
                max_tokens?: string | number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: string | number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: string | number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }[] | undefined;
        addedEndpoints?: string[] | undefined;
    } | undefined;
    messageFilter?: {
        pii?: {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        } | undefined;
    } | undefined;
}>;
/**
 * Recursively makes all properties of T optional, including nested objects.
 * Handles arrays, primitives, functions, and Date objects correctly.
 */
export type DeepPartial<T> = T extends (infer U)[] ? DeepPartial<U>[] : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends Function ? T : T extends Date ? T : T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export declare const getConfigDefaults: () => ExtractDefaults<{
    version: z.ZodString;
    cache: z.ZodDefault<z.ZodBoolean>;
    ocr: z.ZodOptional<z.ZodObject<{
        mistralModel: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        baseURL: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        strategy: z.ZodDefault<z.ZodNativeEnum<typeof OCRStrategy>>;
    }, "strip", z.ZodTypeAny, {
        apiKey: string;
        baseURL: string;
        strategy: OCRStrategy;
        mistralModel?: string | undefined;
    }, {
        apiKey?: string | undefined;
        mistralModel?: string | undefined;
        baseURL?: string | undefined;
        strategy?: OCRStrategy | undefined;
    }>>;
    webSearch: z.ZodOptional<z.ZodObject<{
        serperApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        searxngInstanceUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        searxngApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        firecrawlApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        firecrawlApiUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        firecrawlVersion: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        tavilyApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        tavilySearchUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        tavilyExtractUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        jinaApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        jinaApiUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        cohereApiKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        searchProvider: z.ZodOptional<z.ZodNativeEnum<typeof SearchProviders>>;
        scraperProvider: z.ZodOptional<z.ZodNativeEnum<typeof ScraperProviders>>;
        rerankerType: z.ZodOptional<z.ZodNativeEnum<typeof RerankerTypes>>;
        scraperTimeout: z.ZodOptional<z.ZodNumber>;
        safeSearch: z.ZodDefault<z.ZodNativeEnum<typeof SafeSearchTypes>>;
        firecrawlOptions: z.ZodOptional<z.ZodObject<{
            formats: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            includeTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            excludeTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            waitFor: z.ZodOptional<z.ZodNumber>;
            timeout: z.ZodOptional<z.ZodNumber>;
            maxAge: z.ZodOptional<z.ZodNumber>;
            mobile: z.ZodOptional<z.ZodBoolean>;
            skipTlsVerification: z.ZodOptional<z.ZodBoolean>;
            blockAds: z.ZodOptional<z.ZodBoolean>;
            removeBase64Images: z.ZodOptional<z.ZodBoolean>;
            parsePDF: z.ZodOptional<z.ZodBoolean>;
            storeInCache: z.ZodOptional<z.ZodBoolean>;
            zeroDataRetention: z.ZodOptional<z.ZodBoolean>;
            location: z.ZodOptional<z.ZodObject<{
                country: z.ZodOptional<z.ZodString>;
                languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                country?: string | undefined;
                languages?: string[] | undefined;
            }, {
                country?: string | undefined;
                languages?: string[] | undefined;
            }>>;
            onlyMainContent: z.ZodOptional<z.ZodBoolean>;
            changeTrackingOptions: z.ZodOptional<z.ZodObject<{
                modes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                prompt: z.ZodOptional<z.ZodString>;
                tag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            }, {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        }, {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        }>>;
        tavilySearchOptions: z.ZodOptional<z.ZodObject<{
            searchDepth: z.ZodOptional<z.ZodEnum<["basic", "advanced", "fast", "ultra-fast"]>>;
            maxResults: z.ZodOptional<z.ZodNumber>;
            includeImages: z.ZodOptional<z.ZodBoolean>;
            includeAnswer: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["basic", "advanced"]>]>>;
            includeRawContent: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["markdown", "text"]>]>>;
            includeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            excludeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            topic: z.ZodOptional<z.ZodEnum<["general", "news", "finance"]>>;
            timeRange: z.ZodOptional<z.ZodEnum<["day", "week", "month", "year", "d", "w", "m", "y"]>>;
            includeImageDescriptions: z.ZodOptional<z.ZodBoolean>;
            includeFavicon: z.ZodOptional<z.ZodBoolean>;
            chunksPerSource: z.ZodOptional<z.ZodNumber>;
            safeSearch: z.ZodOptional<z.ZodBoolean>;
            timeout: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        }, {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        }>>;
        tavilyScraperOptions: z.ZodOptional<z.ZodObject<{
            extractDepth: z.ZodOptional<z.ZodEnum<["basic", "advanced"]>>;
            includeImages: z.ZodOptional<z.ZodBoolean>;
            includeFavicon: z.ZodOptional<z.ZodBoolean>;
            format: z.ZodOptional<z.ZodEnum<["markdown", "text"]>>;
            timeout: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        }, {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        serperApiKey: string;
        searxngInstanceUrl: string;
        searxngApiKey: string;
        firecrawlApiKey: string;
        firecrawlApiUrl: string;
        firecrawlVersion: string;
        tavilyApiKey: string;
        tavilySearchUrl: string;
        tavilyExtractUrl: string;
        jinaApiKey: string;
        jinaApiUrl: string;
        cohereApiKey: string;
        safeSearch: SafeSearchTypes;
        searchProvider?: SearchProviders | undefined;
        scraperProvider?: ScraperProviders | undefined;
        rerankerType?: RerankerTypes | undefined;
        scraperTimeout?: number | undefined;
        firecrawlOptions?: {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        } | undefined;
        tavilySearchOptions?: {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        } | undefined;
        tavilyScraperOptions?: {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        } | undefined;
    }, {
        serperApiKey?: string | undefined;
        searxngInstanceUrl?: string | undefined;
        searxngApiKey?: string | undefined;
        firecrawlApiKey?: string | undefined;
        firecrawlApiUrl?: string | undefined;
        firecrawlVersion?: string | undefined;
        tavilyApiKey?: string | undefined;
        tavilySearchUrl?: string | undefined;
        tavilyExtractUrl?: string | undefined;
        jinaApiKey?: string | undefined;
        jinaApiUrl?: string | undefined;
        cohereApiKey?: string | undefined;
        searchProvider?: SearchProviders | undefined;
        scraperProvider?: ScraperProviders | undefined;
        rerankerType?: RerankerTypes | undefined;
        scraperTimeout?: number | undefined;
        safeSearch?: SafeSearchTypes | undefined;
        firecrawlOptions?: {
            timeout?: number | undefined;
            headers?: Record<string, string> | undefined;
            formats?: string[] | undefined;
            includeTags?: string[] | undefined;
            excludeTags?: string[] | undefined;
            waitFor?: number | undefined;
            maxAge?: number | undefined;
            mobile?: boolean | undefined;
            skipTlsVerification?: boolean | undefined;
            blockAds?: boolean | undefined;
            removeBase64Images?: boolean | undefined;
            parsePDF?: boolean | undefined;
            storeInCache?: boolean | undefined;
            zeroDataRetention?: boolean | undefined;
            location?: {
                country?: string | undefined;
                languages?: string[] | undefined;
            } | undefined;
            onlyMainContent?: boolean | undefined;
            changeTrackingOptions?: {
                tag?: string | null | undefined;
                prompt?: string | undefined;
                modes?: string[] | undefined;
                schema?: Record<string, unknown> | undefined;
            } | undefined;
        } | undefined;
        tavilySearchOptions?: {
            timeout?: number | undefined;
            safeSearch?: boolean | undefined;
            searchDepth?: "basic" | "advanced" | "fast" | "ultra-fast" | undefined;
            maxResults?: number | undefined;
            includeImages?: boolean | undefined;
            includeAnswer?: boolean | "basic" | "advanced" | undefined;
            includeRawContent?: boolean | "text" | "markdown" | undefined;
            includeDomains?: string[] | undefined;
            excludeDomains?: string[] | undefined;
            topic?: "general" | "news" | "finance" | undefined;
            timeRange?: "d" | "m" | "day" | "week" | "month" | "year" | "w" | "y" | undefined;
            includeImageDescriptions?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            chunksPerSource?: number | undefined;
        } | undefined;
        tavilyScraperOptions?: {
            timeout?: number | undefined;
            includeImages?: boolean | undefined;
            includeFavicon?: boolean | undefined;
            extractDepth?: "basic" | "advanced" | undefined;
            format?: "text" | "markdown" | undefined;
        } | undefined;
    }>>;
    memory: z.ZodOptional<z.ZodObject<{
        disabled: z.ZodOptional<z.ZodBoolean>;
        validKeys: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tokenLimit: z.ZodOptional<z.ZodNumber>;
        charLimit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxInputTokens: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        personalize: z.ZodDefault<z.ZodBoolean>;
        messageWindowSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        agent: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            enabled?: boolean | undefined;
        }, {
            id: string;
            enabled?: boolean | undefined;
        }>, z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            provider: z.ZodString;
            model: z.ZodString;
            instructions: z.ZodOptional<z.ZodString>;
            model_parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        }, "strip", z.ZodTypeAny, {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        }, {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        }>]>>;
    }, "strip", z.ZodTypeAny, {
        charLimit: number;
        maxInputTokens: number;
        personalize: boolean;
        messageWindowSize: number;
        agent?: {
            id: string;
            enabled?: boolean | undefined;
        } | {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        } | undefined;
        disabled?: boolean | undefined;
        validKeys?: string[] | undefined;
        tokenLimit?: number | undefined;
    }, {
        agent?: {
            id: string;
            enabled?: boolean | undefined;
        } | {
            model: string;
            provider: string;
            instructions?: string | undefined;
            enabled?: boolean | undefined;
            model_parameters?: Record<string, string | number | boolean> | undefined;
        } | undefined;
        disabled?: boolean | undefined;
        validKeys?: string[] | undefined;
        tokenLimit?: number | undefined;
        charLimit?: number | undefined;
        maxInputTokens?: number | undefined;
        personalize?: boolean | undefined;
        messageWindowSize?: number | undefined;
    }>>;
    summarization: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
        trigger: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"token_ratio">;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: "token_ratio";
            value: number;
        }, {
            type: "token_ratio";
            value: number;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"remaining_tokens">;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: "remaining_tokens";
            value: number;
        }, {
            type: "remaining_tokens";
            value: number;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"messages_to_refine">;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: "messages_to_refine";
            value: number;
        }, {
            type: "messages_to_refine";
            value: number;
        }>]>>;
        prompt: z.ZodOptional<z.ZodString>;
        updatePrompt: z.ZodOptional<z.ZodString>;
        reserveRatio: z.ZodOptional<z.ZodNumber>;
        maxSummaryTokens: z.ZodOptional<z.ZodNumber>;
        contextPruning: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            keepLastAssistants: z.ZodOptional<z.ZodNumber>;
            softTrimRatio: z.ZodOptional<z.ZodNumber>;
            hardClearRatio: z.ZodOptional<z.ZodNumber>;
            minPrunableToolChars: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        }, {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        prompt?: string | undefined;
        enabled?: boolean | undefined;
        provider?: string | undefined;
        parameters?: Record<string, string | number | boolean | null> | undefined;
        trigger?: {
            type: "token_ratio";
            value: number;
        } | {
            type: "remaining_tokens";
            value: number;
        } | {
            type: "messages_to_refine";
            value: number;
        } | undefined;
        updatePrompt?: string | undefined;
        reserveRatio?: number | undefined;
        maxSummaryTokens?: number | undefined;
        contextPruning?: {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        } | undefined;
    }, {
        model?: string | undefined;
        prompt?: string | undefined;
        enabled?: boolean | undefined;
        provider?: string | undefined;
        parameters?: Record<string, string | number | boolean | null> | undefined;
        trigger?: {
            type: "token_ratio";
            value: number;
        } | {
            type: "remaining_tokens";
            value: number;
        } | {
            type: "messages_to_refine";
            value: number;
        } | undefined;
        updatePrompt?: string | undefined;
        reserveRatio?: number | undefined;
        maxSummaryTokens?: number | undefined;
        contextPruning?: {
            enabled?: boolean | undefined;
            keepLastAssistants?: number | undefined;
            softTrimRatio?: number | undefined;
            hardClearRatio?: number | undefined;
            minPrunableToolChars?: number | undefined;
        } | undefined;
    }>>;
    skillSync: z.ZodOptional<z.ZodObject<{
        github: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            intervalMinutes: z.ZodDefault<z.ZodNumber>;
            runOnStartup: z.ZodDefault<z.ZodBoolean>;
            sources: z.ZodDefault<z.ZodArray<z.ZodEffects<z.ZodObject<{
                id: z.ZodString;
                owner: z.ZodString;
                repo: z.ZodString;
                ref: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, string, string>>;
                paths: z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, "many">;
                skillDiscoveryDepth: z.ZodOptional<z.ZodNumber>;
                credentialKey: z.ZodOptional<z.ZodString>;
                token: z.ZodOptional<z.ZodString>;
                tenantId: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            }, "strip", z.ZodTypeAny, {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }, {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }>, {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }, {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            intervalMinutes: number;
            runOnStartup: boolean;
            sources: {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[];
        }, {
            enabled?: boolean | undefined;
            intervalMinutes?: number | undefined;
            runOnStartup?: boolean | undefined;
            sources?: {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[] | undefined;
        }>, {
            enabled: boolean;
            intervalMinutes: number;
            runOnStartup: boolean;
            sources: {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[];
        }, {
            enabled?: boolean | undefined;
            intervalMinutes?: number | undefined;
            runOnStartup?: boolean | undefined;
            sources?: {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        github?: {
            enabled: boolean;
            intervalMinutes: number;
            runOnStartup: boolean;
            sources: {
                owner: string;
                id: string;
                repo: string;
                ref: string;
                paths: string[];
                token?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[];
        } | undefined;
    }, {
        github?: {
            enabled?: boolean | undefined;
            intervalMinutes?: number | undefined;
            runOnStartup?: boolean | undefined;
            sources?: {
                owner: string;
                id: string;
                repo: string;
                paths: string[];
                token?: string | undefined;
                ref?: string | undefined;
                skillDiscoveryDepth?: number | undefined;
                credentialKey?: string | undefined;
                tenantId?: string | undefined;
            }[] | undefined;
        } | undefined;
    }>>;
    secureImageLinks: z.ZodOptional<z.ZodBoolean>;
    imageOutputType: z.ZodDefault<z.ZodNativeEnum<typeof EImageOutputType>>;
    includedTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    filteredTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    mcpServers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        startup: z.ZodOptional<z.ZodBoolean>;
        iconPath: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        sseReadTimeout: z.ZodOptional<z.ZodNumber>;
        initTimeout: z.ZodOptional<z.ZodNumber>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        requiresOAuth: z.ZodOptional<z.ZodBoolean>;
        oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            client_id: z.ZodOptional<z.ZodString>;
            client_secret: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
            redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof import(".").TokenExchangeMethodEnum>>;
            grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
            audience: z.ZodOptional<z.ZodString>;
            forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
            revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>>;
        oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiKey: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            source: z.ZodEnum<["admin", "user"]>;
            authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
            custom_header: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }>>;
        customUserVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }>>>;
    } & {
        type: z.ZodDefault<z.ZodLiteral<"stdio">>;
        obo: z.ZodOptional<z.ZodUndefined>;
        command: z.ZodString;
        args: z.ZodArray<z.ZodString, "many">;
        env: z.ZodEffects<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>, Record<string, string> | undefined, Record<string, string> | undefined>;
        stderr: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["pipe", "ignore", "inherit"]>, z.ZodNumber]>>;
    }, "strip", z.ZodTypeAny, {
        type: "stdio";
        command: string;
        args: string[];
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        env?: Record<string, string> | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
        stderr?: number | "pipe" | "ignore" | "inherit" | undefined;
    }, {
        command: string;
        args: string[];
        type?: "stdio" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        env?: Record<string, string> | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
        stderr?: number | "pipe" | "ignore" | "inherit" | undefined;
    }>, z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        startup: z.ZodOptional<z.ZodBoolean>;
        iconPath: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        sseReadTimeout: z.ZodOptional<z.ZodNumber>;
        initTimeout: z.ZodOptional<z.ZodNumber>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        requiresOAuth: z.ZodOptional<z.ZodBoolean>;
        oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            client_id: z.ZodOptional<z.ZodString>;
            client_secret: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
            redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof import(".").TokenExchangeMethodEnum>>;
            grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
            audience: z.ZodOptional<z.ZodString>;
            forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
            revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>>;
        oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiKey: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            source: z.ZodEnum<["admin", "user"]>;
            authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
            custom_header: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }>>;
        customUserVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }>>>;
    } & {
        type: z.ZodDefault<z.ZodLiteral<"websocket">>;
        obo: z.ZodOptional<z.ZodUndefined>;
        url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
    }, "strip", z.ZodTypeAny, {
        type: "websocket";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
    }, {
        url: string;
        type?: "websocket" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: undefined;
    }>, z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        startup: z.ZodOptional<z.ZodBoolean>;
        iconPath: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        sseReadTimeout: z.ZodOptional<z.ZodNumber>;
        initTimeout: z.ZodOptional<z.ZodNumber>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        requiresOAuth: z.ZodOptional<z.ZodBoolean>;
        oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            client_id: z.ZodOptional<z.ZodString>;
            client_secret: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
            redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof import(".").TokenExchangeMethodEnum>>;
            grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
            audience: z.ZodOptional<z.ZodString>;
            forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
            revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>>;
        oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiKey: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            source: z.ZodEnum<["admin", "user"]>;
            authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
            custom_header: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }>>;
        customUserVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }>>>;
    } & {
        type: z.ZodDefault<z.ZodLiteral<"sse">>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        obo: z.ZodOptional<z.ZodObject<{
            scopes: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            scopes: string;
        }, {
            scopes: string;
        }>>;
        proxy: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
    }, "strip", z.ZodTypeAny, {
        type: "sse";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }, {
        url: string;
        type?: "sse" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }>, z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        startup: z.ZodOptional<z.ZodBoolean>;
        iconPath: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        sseReadTimeout: z.ZodOptional<z.ZodNumber>;
        initTimeout: z.ZodOptional<z.ZodNumber>;
        chatMenu: z.ZodOptional<z.ZodBoolean>;
        serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        requiresOAuth: z.ZodOptional<z.ZodBoolean>;
        oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            client_id: z.ZodOptional<z.ZodString>;
            client_secret: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
            redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof import(".").TokenExchangeMethodEnum>>;
            grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
            audience: z.ZodOptional<z.ZodString>;
            forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
            revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
            revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }, {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        }>>;
        oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiKey: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            source: z.ZodEnum<["admin", "user"]>;
            authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
            custom_header: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }, {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        }>>;
        customUserVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            sensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }>>>;
    } & {
        type: z.ZodUnion<[z.ZodLiteral<"streamable-http">, z.ZodLiteral<"http">]>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        obo: z.ZodOptional<z.ZodObject<{
            scopes: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            scopes: string;
        }, {
            scopes: string;
        }>>;
        proxy: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
    }, "strip", z.ZodTypeAny, {
        type: "streamable-http" | "http";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }, {
        type: "streamable-http" | "http";
        url: string;
        description?: string | undefined;
        title?: string | undefined;
        chatMenu?: boolean | undefined;
        startup?: boolean | undefined;
        iconPath?: string | undefined;
        timeout?: number | undefined;
        sseReadTimeout?: number | undefined;
        initTimeout?: number | undefined;
        serverInstructions?: string | boolean | undefined;
        requiresOAuth?: boolean | undefined;
        oauth?: {
            authorization_url?: string | undefined;
            token_url?: string | undefined;
            client_id?: string | undefined;
            client_secret?: string | undefined;
            scope?: string | undefined;
            redirect_uri?: string | undefined;
            token_exchange_method?: import(".").TokenExchangeMethodEnum | undefined;
            grant_types_supported?: string[] | undefined;
            token_endpoint_auth_methods_supported?: string[] | undefined;
            response_types_supported?: string[] | undefined;
            code_challenge_methods_supported?: string[] | undefined;
            skip_code_challenge_check?: boolean | undefined;
            audience?: string | undefined;
            forward_audience_on_refresh?: boolean | undefined;
            revocation_endpoint?: string | undefined;
            revocation_endpoint_auth_methods_supported?: string[] | undefined;
        } | undefined;
        oauth_headers?: Record<string, string> | undefined;
        apiKey?: {
            source: "user" | "admin";
            authorization_type: "custom" | "basic" | "bearer";
            key?: string | undefined;
            custom_header?: string | undefined;
        } | undefined;
        customUserVars?: Record<string, {
            description: string;
            title: string;
            sensitive?: boolean | undefined;
        }> | undefined;
        obo?: {
            scopes: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        proxy?: string | undefined;
    }>]>>>;
    mcpSettings: z.ZodOptional<z.ZodObject<{
        allowedDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        allowedAddresses: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, "many">>;
    }, "strip", z.ZodTypeAny, {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    }, {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    }>>;
    interface: z.ZodDefault<z.ZodObject<{
        privacyPolicy: z.ZodOptional<z.ZodObject<{
            externalUrl: z.ZodOptional<z.ZodString>;
            openNewTab: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        }, {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        }>>;
        termsOfService: z.ZodOptional<z.ZodObject<{
            externalUrl: z.ZodOptional<z.ZodString>;
            openNewTab: z.ZodOptional<z.ZodBoolean>;
            modalAcceptance: z.ZodOptional<z.ZodBoolean>;
            modalTitle: z.ZodOptional<z.ZodString>;
            modalContent: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        }, {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        }>>;
        customWelcome: z.ZodOptional<z.ZodString>;
        mcpServers: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            placeholder: z.ZodOptional<z.ZodString>;
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
            configureObo: z.ZodOptional<z.ZodBoolean>;
            trustCheckbox: z.ZodOptional<z.ZodObject<{
                label: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
                subLabel: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
            }, "strip", z.ZodTypeAny, {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            }, {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        }, {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        }>>>;
        modelSelect: z.ZodOptional<z.ZodBoolean>;
        parameters: z.ZodOptional<z.ZodBoolean>;
        multiConvo: z.ZodOptional<z.ZodBoolean>;
        bookmarks: z.ZodOptional<z.ZodBoolean>;
        memories: z.ZodOptional<z.ZodBoolean>;
        presets: z.ZodOptional<z.ZodBoolean>;
        prompts: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }>]>>;
        agents: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }>]>>;
        temporaryChat: z.ZodOptional<z.ZodBoolean>;
        temporaryChatRetention: z.ZodOptional<z.ZodNumber>;
        autoSubmitFromUrl: z.ZodOptional<z.ZodBoolean>;
        retentionMode: z.ZodDefault<z.ZodNativeEnum<typeof RetentionMode>>;
        retainAgentFiles: z.ZodOptional<z.ZodBoolean>;
        runCode: z.ZodOptional<z.ZodBoolean>;
        webSearch: z.ZodOptional<z.ZodBoolean>;
        contextUsage: z.ZodOptional<z.ZodBoolean>;
        contextCost: z.ZodOptional<z.ZodBoolean>;
        currency: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            rate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            code: string;
            rate: number;
        }, {
            code: string;
            rate: number;
        }>>;
        peoplePicker: z.ZodOptional<z.ZodObject<{
            users: z.ZodOptional<z.ZodBoolean>;
            groups: z.ZodOptional<z.ZodBoolean>;
            roles: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        }, {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        }>>;
        marketplace: z.ZodOptional<z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            use?: boolean | undefined;
        }, {
            use?: boolean | undefined;
        }>>;
        fileSearch: z.ZodOptional<z.ZodBoolean>;
        fileCitations: z.ZodOptional<z.ZodBoolean>;
        /** Tool keys (and `'mcp'` or an MCP server name) pinned to the prompt bar by default */
        defaultPinnedTools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        buildInfo: z.ZodOptional<z.ZodBoolean>;
        remoteAgents: z.ZodOptional<z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        }>>;
        skills: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
            use: z.ZodOptional<z.ZodBoolean>;
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
            defaultActiveOnShare: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        }>]>>;
        sharedLinks: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
            create: z.ZodOptional<z.ZodBoolean>;
            share: z.ZodOptional<z.ZodBoolean>;
            public: z.ZodOptional<z.ZodBoolean>;
            snapshotFiles: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        }, {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        }>]>>;
    }, "strip", z.ZodTypeAny, {
        retentionMode: RetentionMode;
        agents?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        webSearch?: boolean | undefined;
        fileSearch?: boolean | undefined;
        mcpServers?: {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        } | undefined;
        skills?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        } | undefined;
        parameters?: boolean | undefined;
        privacyPolicy?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        } | undefined;
        termsOfService?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        } | undefined;
        customWelcome?: string | undefined;
        modelSelect?: boolean | undefined;
        multiConvo?: boolean | undefined;
        bookmarks?: boolean | undefined;
        memories?: boolean | undefined;
        presets?: boolean | undefined;
        prompts?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        temporaryChat?: boolean | undefined;
        temporaryChatRetention?: number | undefined;
        autoSubmitFromUrl?: boolean | undefined;
        retainAgentFiles?: boolean | undefined;
        runCode?: boolean | undefined;
        contextUsage?: boolean | undefined;
        contextCost?: boolean | undefined;
        currency?: {
            code: string;
            rate: number;
        } | undefined;
        peoplePicker?: {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        } | undefined;
        marketplace?: {
            use?: boolean | undefined;
        } | undefined;
        fileCitations?: boolean | undefined;
        defaultPinnedTools?: string[] | undefined;
        buildInfo?: boolean | undefined;
        remoteAgents?: {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        sharedLinks?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        } | undefined;
    }, {
        agents?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        webSearch?: boolean | undefined;
        fileSearch?: boolean | undefined;
        mcpServers?: {
            public?: boolean | undefined;
            placeholder?: string | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            configureObo?: boolean | undefined;
            trustCheckbox?: {
                label?: string | Record<string, string> | undefined;
                subLabel?: string | Record<string, string> | undefined;
            } | undefined;
        } | undefined;
        skills?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
            defaultActiveOnShare?: boolean | undefined;
        } | undefined;
        parameters?: boolean | undefined;
        privacyPolicy?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
        } | undefined;
        termsOfService?: {
            externalUrl?: string | undefined;
            openNewTab?: boolean | undefined;
            modalAcceptance?: boolean | undefined;
            modalTitle?: string | undefined;
            modalContent?: string | string[] | undefined;
        } | undefined;
        customWelcome?: string | undefined;
        modelSelect?: boolean | undefined;
        multiConvo?: boolean | undefined;
        bookmarks?: boolean | undefined;
        memories?: boolean | undefined;
        presets?: boolean | undefined;
        prompts?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        temporaryChat?: boolean | undefined;
        temporaryChatRetention?: number | undefined;
        autoSubmitFromUrl?: boolean | undefined;
        retentionMode?: RetentionMode | undefined;
        retainAgentFiles?: boolean | undefined;
        runCode?: boolean | undefined;
        contextUsage?: boolean | undefined;
        contextCost?: boolean | undefined;
        currency?: {
            code: string;
            rate: number;
        } | undefined;
        peoplePicker?: {
            users?: boolean | undefined;
            groups?: boolean | undefined;
            roles?: boolean | undefined;
        } | undefined;
        marketplace?: {
            use?: boolean | undefined;
        } | undefined;
        fileCitations?: boolean | undefined;
        defaultPinnedTools?: string[] | undefined;
        buildInfo?: boolean | undefined;
        remoteAgents?: {
            public?: boolean | undefined;
            share?: boolean | undefined;
            use?: boolean | undefined;
            create?: boolean | undefined;
        } | undefined;
        sharedLinks?: boolean | {
            public?: boolean | undefined;
            share?: boolean | undefined;
            create?: boolean | undefined;
            snapshotFiles?: boolean | undefined;
        } | undefined;
    }>>;
    turnstile: z.ZodOptional<z.ZodObject<{
        siteKey: z.ZodString;
        options: z.ZodOptional<z.ZodDefault<z.ZodObject<{
            language: z.ZodDefault<z.ZodString>;
            size: z.ZodDefault<z.ZodEnum<["normal", "compact", "flexible", "invisible"]>>;
        }, "strip", z.ZodTypeAny, {
            language: string;
            size: "normal" | "compact" | "flexible" | "invisible";
        }, {
            language?: string | undefined;
            size?: "normal" | "compact" | "flexible" | "invisible" | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        siteKey: string;
        options?: {
            language: string;
            size: "normal" | "compact" | "flexible" | "invisible";
        } | undefined;
    }, {
        siteKey: string;
        options?: {
            language?: string | undefined;
            size?: "normal" | "compact" | "flexible" | "invisible" | undefined;
        } | undefined;
    }>>;
    fileStrategy: z.ZodDefault<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
    fileStrategies: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
        avatar: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
        image: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
        document: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
        skills: z.ZodOptional<z.ZodEnum<[FileSources.local, FileSources.firebase, FileSources.s3, FileSources.azure_blob, FileSources.cloudfront]>>;
    }, "strip", z.ZodTypeAny, {
        avatar?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        default?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        skills?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        image?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        document?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    }, {
        avatar?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        default?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        skills?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        image?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
        document?: FileSources.local | FileSources.firebase | FileSources.azure_blob | FileSources.s3 | FileSources.cloudfront | undefined;
    }>>;
    cloudfront: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
        domain: z.ZodString;
        distributionId: z.ZodOptional<z.ZodString>;
        invalidateOnDelete: z.ZodDefault<z.ZodBoolean>;
        imageSigning: z.ZodDefault<z.ZodEnum<["none", "cookies", "url"]>>;
        urlExpiry: z.ZodDefault<z.ZodNumber>;
        cookieExpiry: z.ZodDefault<z.ZodNumber>;
        cookieDomain: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        storageRegion: z.ZodOptional<z.ZodString>;
        includeRegionInPath: z.ZodDefault<z.ZodBoolean>;
        requireSignedAccess: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    }, {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    }>, {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    }, {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    }>, {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    }, {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    }>, {
        domain: string;
        invalidateOnDelete: boolean;
        imageSigning: "none" | "url" | "cookies";
        urlExpiry: number;
        cookieExpiry: number;
        includeRegionInPath: boolean;
        requireSignedAccess: boolean;
        distributionId?: string | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
    }, {
        domain: string;
        distributionId?: string | undefined;
        invalidateOnDelete?: boolean | undefined;
        imageSigning?: "none" | "url" | "cookies" | undefined;
        urlExpiry?: number | undefined;
        cookieExpiry?: number | undefined;
        cookieDomain?: string | undefined;
        storageRegion?: string | undefined;
        includeRegionInPath?: boolean | undefined;
        requireSignedAccess?: boolean | undefined;
    }>>;
    actions: z.ZodOptional<z.ZodObject<{
        allowedDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        allowedAddresses: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, "many">>;
    }, "strip", z.ZodTypeAny, {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    }, {
        allowedDomains?: string[] | undefined;
        allowedAddresses?: string[] | undefined;
    }>>;
    registration: z.ZodDefault<z.ZodObject<{
        socialLogins: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        allowedDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        allowedDomains?: string[] | undefined;
        socialLogins?: string[] | undefined;
    }, {
        allowedDomains?: string[] | undefined;
        socialLogins?: string[] | undefined;
    }>>;
    balance: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        startBalance: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        autoRefillEnabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        refillIntervalValue: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        refillIntervalUnit: z.ZodDefault<z.ZodOptional<z.ZodEnum<["seconds", "minutes", "hours", "days", "weeks", "months"]>>>;
        refillAmount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        startBalance: number;
        autoRefillEnabled: boolean;
        refillIntervalValue: number;
        refillIntervalUnit: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months";
        refillAmount: number;
    }, {
        enabled?: boolean | undefined;
        startBalance?: number | undefined;
        autoRefillEnabled?: boolean | undefined;
        refillIntervalValue?: number | undefined;
        refillIntervalUnit?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | undefined;
        refillAmount?: number | undefined;
    }>>;
    transactions: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
    }, {
        enabled?: boolean | undefined;
    }>>;
    speech: z.ZodOptional<z.ZodObject<{
        tts: z.ZodOptional<z.ZodObject<{
            openai: z.ZodOptional<z.ZodObject<{
                url: z.ZodOptional<z.ZodString>;
                apiKey: z.ZodString;
                model: z.ZodString;
                voices: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            }, {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            }>>;
            azureOpenAI: z.ZodOptional<z.ZodObject<{
                instanceName: z.ZodString;
                apiKey: z.ZodString;
                deploymentName: z.ZodString;
                apiVersion: z.ZodString;
                model: z.ZodString;
                voices: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            }, {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            }>>;
            elevenlabs: z.ZodOptional<z.ZodObject<{
                url: z.ZodOptional<z.ZodString>;
                websocketUrl: z.ZodOptional<z.ZodString>;
                apiKey: z.ZodString;
                model: z.ZodString;
                voices: z.ZodArray<z.ZodString, "many">;
                voice_settings: z.ZodOptional<z.ZodObject<{
                    similarity_boost: z.ZodOptional<z.ZodNumber>;
                    stability: z.ZodOptional<z.ZodNumber>;
                    style: z.ZodOptional<z.ZodNumber>;
                    use_speaker_boost: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                }, {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                }>>;
                pronunciation_dictionary_locators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            }, {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            }>>;
            localai: z.ZodOptional<z.ZodObject<{
                url: z.ZodString;
                apiKey: z.ZodOptional<z.ZodString>;
                voices: z.ZodArray<z.ZodString, "many">;
                backend: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            }, {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        }, {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        }>>;
        stt: z.ZodOptional<z.ZodObject<{
            openai: z.ZodOptional<z.ZodObject<{
                url: z.ZodOptional<z.ZodString>;
                apiKey: z.ZodString;
                model: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                model: string;
                apiKey: string;
                url?: string | undefined;
            }, {
                model: string;
                apiKey: string;
                url?: string | undefined;
            }>>;
            azureOpenAI: z.ZodOptional<z.ZodObject<{
                instanceName: z.ZodString;
                apiKey: z.ZodString;
                deploymentName: z.ZodString;
                apiVersion: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            }, {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        }, {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        }>>;
        speechTab: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            conversationMode: z.ZodOptional<z.ZodBoolean>;
            advancedMode: z.ZodOptional<z.ZodBoolean>;
            speechToText: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodBoolean>, z.ZodObject<{
                /** Keep in sync with STTProviders enum (defined below — cannot reference due to eval order) */
                engineSTT: z.ZodOptional<z.ZodEnum<["openai", "azureOpenAI"]>>;
                languageSTT: z.ZodOptional<z.ZodString>;
                autoTranscribeAudio: z.ZodOptional<z.ZodBoolean>;
                decibelValue: z.ZodOptional<z.ZodNumber>;
                autoSendText: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            }, {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            }>]>>;
            textToSpeech: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodBoolean>, z.ZodObject<{
                /** Keep in sync with TTSProviders enum (defined below — cannot reference due to eval order) */
                engineTTS: z.ZodOptional<z.ZodEnum<["openai", "azureOpenAI", "elevenlabs", "localai"]>>;
                voice: z.ZodOptional<z.ZodString>;
                languageTTS: z.ZodOptional<z.ZodString>;
                automaticPlayback: z.ZodOptional<z.ZodBoolean>;
                playbackRate: z.ZodOptional<z.ZodNumber>;
                cacheTTS: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            }, {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            }>]>>;
        }, "strip", z.ZodTypeAny, {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        }, {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        tts?: {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        } | undefined;
        stt?: {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        } | undefined;
        speechTab?: {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        } | undefined;
    }, {
        tts?: {
            azureOpenAI?: {
                model: string;
                apiKey: string;
                voices: string[];
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
            } | undefined;
            elevenlabs?: {
                model: string;
                apiKey: string;
                voices: string[];
                url?: string | undefined;
                websocketUrl?: string | undefined;
                voice_settings?: {
                    style?: number | undefined;
                    similarity_boost?: number | undefined;
                    stability?: number | undefined;
                    use_speaker_boost?: boolean | undefined;
                } | undefined;
                pronunciation_dictionary_locators?: string[] | undefined;
            } | undefined;
            localai?: {
                url: string;
                voices: string[];
                backend: string;
                apiKey?: string | undefined;
            } | undefined;
        } | undefined;
        stt?: {
            azureOpenAI?: {
                apiKey: string;
                instanceName: string;
                deploymentName: string;
                apiVersion: string;
            } | undefined;
            openai?: {
                model: string;
                apiKey: string;
                url?: string | undefined;
            } | undefined;
        } | undefined;
        speechTab?: {
            conversationMode?: boolean | undefined;
            advancedMode?: boolean | undefined;
            speechToText?: boolean | {
                engineSTT?: "azureOpenAI" | "openai" | undefined;
                languageSTT?: string | undefined;
                autoTranscribeAudio?: boolean | undefined;
                decibelValue?: number | undefined;
                autoSendText?: number | undefined;
            } | undefined;
            textToSpeech?: boolean | {
                engineTTS?: "azureOpenAI" | "openai" | "elevenlabs" | "localai" | undefined;
                voice?: string | undefined;
                languageTTS?: string | undefined;
                automaticPlayback?: boolean | undefined;
                playbackRate?: number | undefined;
                cacheTTS?: boolean | undefined;
            } | undefined;
        } | undefined;
    }>>;
    rateLimits: z.ZodOptional<z.ZodObject<{
        fileUploads: z.ZodOptional<z.ZodObject<{
            ipMax: z.ZodOptional<z.ZodNumber>;
            ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
            userMax: z.ZodOptional<z.ZodNumber>;
            userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }>>;
        conversationsImport: z.ZodOptional<z.ZodObject<{
            ipMax: z.ZodOptional<z.ZodNumber>;
            ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
            userMax: z.ZodOptional<z.ZodNumber>;
            userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }>>;
        tts: z.ZodOptional<z.ZodObject<{
            ipMax: z.ZodOptional<z.ZodNumber>;
            ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
            userMax: z.ZodOptional<z.ZodNumber>;
            userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }>>;
        stt: z.ZodOptional<z.ZodObject<{
            ipMax: z.ZodOptional<z.ZodNumber>;
            ipWindowInMinutes: z.ZodOptional<z.ZodNumber>;
            userMax: z.ZodOptional<z.ZodNumber>;
            userWindowInMinutes: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }, {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        tts?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        stt?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        fileUploads?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        conversationsImport?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
    }, {
        tts?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        stt?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        fileUploads?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
        conversationsImport?: {
            ipMax?: number | undefined;
            ipWindowInMinutes?: number | undefined;
            userMax?: number | undefined;
            userWindowInMinutes?: number | undefined;
        } | undefined;
    }>>;
    fileConfig: z.ZodOptional<z.ZodObject<{
        endpoints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            disabled: z.ZodOptional<z.ZodBoolean>;
            fileLimit: z.ZodOptional<z.ZodNumber>;
            fileSizeLimit: z.ZodOptional<z.ZodNumber>;
            totalSizeLimit: z.ZodOptional<z.ZodNumber>;
            supportedMimeTypes: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }>>>;
        skills: z.ZodOptional<z.ZodObject<{
            fileSizeLimit: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            fileSizeLimit?: number | undefined;
        }, {
            fileSizeLimit?: number | undefined;
        }>>;
        serverFileSizeLimit: z.ZodOptional<z.ZodNumber>;
        avatarSizeLimit: z.ZodOptional<z.ZodNumber>;
        fileTokenLimit: z.ZodOptional<z.ZodNumber>;
        imageGeneration: z.ZodOptional<z.ZodObject<{
            percentage: z.ZodOptional<z.ZodNumber>;
            px: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            percentage?: number | undefined;
            px?: number | undefined;
        }, {
            percentage?: number | undefined;
            px?: number | undefined;
        }>>;
        clientImageResize: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            maxWidth: z.ZodOptional<z.ZodNumber>;
            maxHeight: z.ZodOptional<z.ZodNumber>;
            quality: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        }, {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        }>>;
        ocr: z.ZodOptional<z.ZodObject<{
            supportedMimeTypes: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            supportedMimeTypes?: string[] | undefined;
        }, {
            supportedMimeTypes?: string[] | undefined;
        }>>;
        text: z.ZodOptional<z.ZodObject<{
            supportedMimeTypes: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            supportedMimeTypes?: string[] | undefined;
        }, {
            supportedMimeTypes?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        fileTokenLimit?: number | undefined;
        text?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
        skills?: {
            fileSizeLimit?: number | undefined;
        } | undefined;
        endpoints?: Record<string, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }> | undefined;
        serverFileSizeLimit?: number | undefined;
        avatarSizeLimit?: number | undefined;
        imageGeneration?: {
            percentage?: number | undefined;
            px?: number | undefined;
        } | undefined;
        clientImageResize?: {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        } | undefined;
        ocr?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
    }, {
        fileTokenLimit?: number | undefined;
        text?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
        skills?: {
            fileSizeLimit?: number | undefined;
        } | undefined;
        endpoints?: Record<string, {
            disabled?: boolean | undefined;
            fileLimit?: number | undefined;
            fileSizeLimit?: number | undefined;
            totalSizeLimit?: number | undefined;
            supportedMimeTypes?: string[] | undefined;
        }> | undefined;
        serverFileSizeLimit?: number | undefined;
        avatarSizeLimit?: number | undefined;
        imageGeneration?: {
            percentage?: number | undefined;
            px?: number | undefined;
        } | undefined;
        clientImageResize?: {
            enabled?: boolean | undefined;
            maxWidth?: number | undefined;
            maxHeight?: number | undefined;
            quality?: number | undefined;
        } | undefined;
        ocr?: {
            supportedMimeTypes?: string[] | undefined;
        } | undefined;
    }>>;
    modelSpecs: z.ZodOptional<z.ZodObject<{
        enforce: z.ZodDefault<z.ZodBoolean>;
        prioritize: z.ZodDefault<z.ZodBoolean>;
        list: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodString;
            preset: z.ZodObject<Omit<{
                user: z.ZodOptional<z.ZodString>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                endpointType: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof EModelEndpoint>>>;
                isArchived: z.ZodOptional<z.ZodBoolean>;
                pinned: z.ZodOptional<z.ZodBoolean>;
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
                thinkingLevel: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ThinkingLevel>>;
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
                resendFiles: z.ZodOptional<z.ZodBoolean>;
                file_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                imageDetail: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ImageDetail>>;
                reasoning_effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningEffort>>>;
                reasoning_summary: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningSummary>>>;
                verbosity: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").Verbosity>>>;
                useResponsesApi: z.ZodOptional<z.ZodBoolean>;
                effort: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").AnthropicEffort>>>;
                thinkingDisplay: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ThinkingDisplay>>>;
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
            } & {
                conversationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                presetId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                defaultPreset: z.ZodOptional<z.ZodBoolean>;
                order: z.ZodOptional<z.ZodNumber>;
                endpoint: z.ZodNullable<z.ZodUnion<[z.ZodNativeEnum<typeof EModelEndpoint>, z.ZodString]>>;
            }, "user" | "tags" | "conversationId" | "isArchived" | "title" | "messages" | "parentMessageId" | "file_ids" | "presetOverride" | "spec" | "expiredAt" | "resendImages" | "chatGptLabel" | "presetId" | "defaultPreset" | "order">, "strip", z.ZodTypeAny, {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: number | null | undefined;
                maxContextTokens?: number | undefined;
                max_tokens?: number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: number | undefined;
            }, {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: string | number | null | undefined;
                maxContextTokens?: string | number | undefined;
                max_tokens?: string | number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: string | number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: string | number | undefined;
            }>;
            order: z.ZodOptional<z.ZodNumber>;
            default: z.ZodOptional<z.ZodBoolean>;
            softDefault: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            group: z.ZodOptional<z.ZodString>;
            groupIcon: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>>;
            showIconInMenu: z.ZodOptional<z.ZodBoolean>;
            showIconInHeader: z.ZodOptional<z.ZodBoolean>;
            showOnLanding: z.ZodOptional<z.ZodBoolean>;
            conversation_starters: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            iconURL: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>>;
            authType: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").AuthType>>;
            hideBadgeRow: z.ZodOptional<z.ZodBoolean>;
            webSearch: z.ZodOptional<z.ZodBoolean>;
            fileSearch: z.ZodOptional<z.ZodBoolean>;
            executeCode: z.ZodOptional<z.ZodBoolean>;
            artifacts: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
            mcpServers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skills: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            subagents: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodOptional<z.ZodBoolean>;
                allowSelf: z.ZodOptional<z.ZodBoolean>;
                agent_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            }, {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: number | null | undefined;
                maxContextTokens?: number | undefined;
                max_tokens?: number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }, {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: string | number | null | undefined;
                maxContextTokens?: string | number | undefined;
                max_tokens?: string | number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: string | number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: string | number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }>, "many">>;
        addedEndpoints: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        enforce: boolean;
        prioritize: boolean;
        list: {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: number | null | undefined;
                maxContextTokens?: number | undefined;
                max_tokens?: number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }[];
        addedEndpoints?: string[] | undefined;
    }, {
        enforce?: boolean | undefined;
        prioritize?: boolean | undefined;
        list?: {
            name: string;
            label: string;
            preset: {
                endpoint: string | null;
                model?: string | null | undefined;
                endpointType?: EModelEndpoint | null | undefined;
                pinned?: boolean | undefined;
                tools?: string[] | {
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
                }[] | undefined;
                modelLabel?: string | null | undefined;
                userLabel?: string | undefined;
                promptPrefix?: string | null | undefined;
                temperature?: number | null | undefined;
                topP?: number | undefined;
                topK?: number | undefined;
                top_p?: number | undefined;
                frequency_penalty?: number | undefined;
                presence_penalty?: number | undefined;
                maxOutputTokens?: string | number | null | undefined;
                maxContextTokens?: string | number | undefined;
                max_tokens?: string | number | undefined;
                promptCache?: boolean | undefined;
                promptCacheTtl?: "5m" | "1h" | undefined;
                system?: string | undefined;
                thinking?: boolean | undefined;
                thinkingBudget?: string | number | undefined;
                thinkingLevel?: import("./schemas").ThinkingLevel | undefined;
                stream?: boolean | undefined;
                artifacts?: string | undefined;
                context?: string | null | undefined;
                examples?: {
                    input: {
                        content: string;
                    };
                    output: {
                        content: string;
                    };
                }[] | undefined;
                resendFiles?: boolean | undefined;
                imageDetail?: import("./schemas").ImageDetail | undefined;
                reasoning_effort?: import("./schemas").ReasoningEffort | null | undefined;
                reasoning_summary?: import("./schemas").ReasoningSummary | null | undefined;
                verbosity?: import("./schemas").Verbosity | null | undefined;
                useResponsesApi?: boolean | undefined;
                effort?: import("./schemas").AnthropicEffort | null | undefined;
                thinkingDisplay?: import("./schemas").ThinkingDisplay | null | undefined;
                web_search?: boolean | undefined;
                url_context?: boolean | undefined;
                disableStreaming?: boolean | undefined;
                assistant_id?: string | undefined;
                agent_id?: string | undefined;
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
                instructions?: string | undefined;
                additional_instructions?: string | undefined;
                append_current_datetime?: boolean | undefined;
                stop?: string[] | undefined;
                greeting?: string | undefined;
                iconURL?: string | null | undefined;
                isTemporary?: boolean | undefined;
                fileTokenLimit?: string | number | undefined;
            };
            group?: string | undefined;
            description?: string | undefined;
            artifacts?: string | boolean | undefined;
            iconURL?: string | undefined;
            order?: number | undefined;
            default?: boolean | undefined;
            softDefault?: boolean | undefined;
            groupIcon?: string | undefined;
            showIconInMenu?: boolean | undefined;
            showIconInHeader?: boolean | undefined;
            showOnLanding?: boolean | undefined;
            conversation_starters?: string[] | undefined;
            authType?: import("./schemas").AuthType | undefined;
            hideBadgeRow?: boolean | undefined;
            webSearch?: boolean | undefined;
            fileSearch?: boolean | undefined;
            executeCode?: boolean | undefined;
            mcpServers?: string[] | undefined;
            skills?: boolean | string[] | undefined;
            subagents?: {
                enabled?: boolean | undefined;
                allowSelf?: boolean | undefined;
                agent_ids?: string[] | undefined;
            } | undefined;
        }[] | undefined;
        addedEndpoints?: string[] | undefined;
    }>>;
    messageFilter: z.ZodOptional<z.ZodObject<{
        pii: z.ZodOptional<z.ZodObject<{
            starterPatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            customPatterns: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                regex: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                label: string;
                regex: string;
            }, {
                id: string;
                label: string;
                regex: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        }, {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        pii?: {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        } | undefined;
    }, {
        pii?: {
            starterPatterns?: string[] | undefined;
            customPatterns?: {
                id: string;
                label: string;
                regex: string;
            }[] | undefined;
        } | undefined;
    }>>;
    endpoints: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        allowedAddresses: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, "many">>;
        all: z.ZodOptional<z.ZodObject<Omit<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        }, "baseURL">, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }>>;
        openAI: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }>>;
        google: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        }>>;
        anthropic: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        } & {
            /** Vertex AI configuration for running Anthropic models on Google Cloud */
            vertex: z.ZodOptional<z.ZodObject<{
                /** Enable Vertex AI mode for Anthropic (defaults to true when vertex config is present) */
                enabled: z.ZodOptional<z.ZodBoolean>;
                /** Google Cloud Project ID (optional - auto-detected from service key file if not provided) */
                projectId: z.ZodOptional<z.ZodString>;
                /** Vertex AI region (e.g., 'us-east5', 'europe-west1') */
                region: z.ZodDefault<z.ZodString>;
                /** Optional: Path to service account key file */
                serviceKeyFile: z.ZodOptional<z.ZodString>;
                /** Optional: Default deployment name for all models (can be overridden per model) */
                deploymentName: z.ZodOptional<z.ZodString>;
                /** Optional: Available models - can be string array or object with deploymentName mapping */
                models: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
                    /** The actual model ID/deployment name used by Vertex AI API */
                    deploymentName: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    deploymentName?: string | undefined;
                }, {
                    deploymentName?: string | undefined;
                }>, z.ZodBoolean]>>]>>;
            }, "strip", z.ZodTypeAny, {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            }, {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            }>>;
            /** Optional: List of available models */
            models: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        }>>;
        azureOpenAI: z.ZodOptional<z.ZodIntersection<z.ZodObject<{
            groups: z.ZodArray<z.ZodIntersection<z.ZodObject<{
                group: z.ZodString;
                models: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
                    deploymentName: z.ZodOptional<z.ZodString>;
                    version: z.ZodOptional<z.ZodString>;
                    assistants: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }, {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>, z.ZodBoolean]>>;
            }, "strip", z.ZodTypeAny, {
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            }, {
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            }>, z.ZodObject<{
                apiKey: z.ZodString;
                serverless: z.ZodOptional<z.ZodBoolean>;
                instanceName: z.ZodOptional<z.ZodString>;
                deploymentName: z.ZodOptional<z.ZodString>;
                assistants: z.ZodOptional<z.ZodBoolean>;
                addParams: z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>;
                dropParams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                version: z.ZodOptional<z.ZodString>;
                baseURL: z.ZodOptional<z.ZodString>;
                additionalHeaders: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            }, {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            }>>, "many">;
            assistants: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        }, {
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        }>, z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
            titlePrompt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleModel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleConvo: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            titleMethod: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>>;
            titlePromptTemplate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleTiming: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>>;
        }, "strip", z.ZodTypeAny, {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }, {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }>>>;
        azureAssistants: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        } & {
            disableBuilder: z.ZodOptional<z.ZodBoolean>;
            pollIntervalMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            version: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            supportedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            excludedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            privateAssistants: z.ZodOptional<z.ZodBoolean>;
            retrievalModels: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            capabilities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof Capabilities>, "many">>>;
            apiKey: z.ZodOptional<z.ZodString>;
            models: z.ZodOptional<z.ZodObject<{
                default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    description?: string | undefined;
                }, {
                    name: string;
                    description?: string | undefined;
                }>]>, "many">;
                fetch: z.ZodOptional<z.ZodBoolean>;
                userIdQuery: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        }, {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        }>>;
        assistants: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        } & {
            disableBuilder: z.ZodOptional<z.ZodBoolean>;
            pollIntervalMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            version: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            supportedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            excludedIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            privateAssistants: z.ZodOptional<z.ZodBoolean>;
            retrievalModels: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            capabilities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof Capabilities>, "many">>>;
            apiKey: z.ZodOptional<z.ZodString>;
            models: z.ZodOptional<z.ZodObject<{
                default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    description?: string | undefined;
                }, {
                    name: string;
                    description?: string | undefined;
                }>]>, "many">;
                fetch: z.ZodOptional<z.ZodBoolean>;
                userIdQuery: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        }, {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        }>>;
        agents: z.ZodOptional<z.ZodDefault<z.ZodObject<Omit<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        }, "baseURL"> & {
            recursionLimit: z.ZodOptional<z.ZodNumber>;
            disableBuilder: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            maxRecursionLimit: z.ZodOptional<z.ZodNumber>;
            maxCitations: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            maxCitationsPerFile: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            minRelevanceScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            allowedProviders: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNativeEnum<typeof EModelEndpoint>]>, "many">>;
            capabilities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof AgentCapabilities>, "many">>>;
            skills: z.ZodOptional<z.ZodObject<{
                maxCatalogSkills: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                maxCatalogSkills?: number | undefined;
            }, {
                maxCatalogSkills?: number | undefined;
            }>>;
            remoteApi: z.ZodOptional<z.ZodObject<{
                auth: z.ZodOptional<z.ZodObject<{
                    apiKey: z.ZodOptional<z.ZodObject<{
                        enabled: z.ZodDefault<z.ZodBoolean>;
                    }, "strip", z.ZodTypeAny, {
                        enabled: boolean;
                    }, {
                        enabled?: boolean | undefined;
                    }>>;
                    oidc: z.ZodOptional<z.ZodEffects<z.ZodObject<{
                        enabled: z.ZodDefault<z.ZodBoolean>;
                        issuer: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                        audience: z.ZodOptional<z.ZodString>;
                        jwksUri: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                        scope: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                    }, "strip", z.ZodTypeAny, {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    }, {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    }>, {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    }, {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    }>>;
                }, "strip", z.ZodTypeAny, {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                }, {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            }, {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            disableBuilder: boolean;
            capabilities: AgentCapabilities[];
            maxCitations: number;
            maxCitationsPerFile: number;
            minRelevanceScore: number;
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        }, {
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            disableBuilder?: boolean | undefined;
            capabilities?: AgentCapabilities[] | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            maxCitations?: number | undefined;
            maxCitationsPerFile?: number | undefined;
            minRelevanceScore?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        }>>>;
        custom: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
            titlePrompt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleModel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleConvo: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            titleMethod: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>>;
            titleEndpoint: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titlePromptTemplate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            titleTiming: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>>;
            maxToolResultChars: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
            name: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            apiKey: z.ZodOptional<z.ZodString>;
            baseURL: z.ZodOptional<z.ZodString>;
            models: z.ZodOptional<z.ZodObject<{
                default: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    description?: string | undefined;
                }, {
                    name: string;
                    description?: string | undefined;
                }>]>, "many">;
                fetch: z.ZodOptional<z.ZodBoolean>;
                userIdQuery: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }, {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            }>>;
            iconURL: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            modelDisplayLabel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            provider: z.ZodOptional<z.ZodOptional<z.ZodLiteral<EModelEndpoint.anthropic>>>;
            headers: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
            addParams: z.ZodOptional<z.ZodOptional<z.ZodType<Record<string, unknown>, z.ZodTypeDef, Record<string, unknown>>>>;
            dropParams: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            customParams: z.ZodOptional<z.ZodOptional<z.ZodObject<{
                defaultParamsEndpoint: z.ZodDefault<z.ZodString>;
                reasoningFormat: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningParameterFormat>>;
                reasoningKey: z.ZodOptional<z.ZodNativeEnum<typeof import("./schemas").ReasoningResponseKey>>;
                /** Replays `reasoning_content` within a run's tool-call turns (e.g. Xiaomi MiMo, Kimi). */
                includeReasoningContent: z.ZodOptional<z.ZodBoolean>;
                /** Also reconstructs `reasoning_content` from persisted history across turns (implies `includeReasoningContent`). */
                includeReasoningHistory: z.ZodOptional<z.ZodBoolean>;
                paramDefinitions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    key: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    type: z.ZodOptional<z.ZodNativeEnum<typeof SettingTypes>>;
                    default: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                    showLabel: z.ZodOptional<z.ZodBoolean>;
                    showDefault: z.ZodOptional<z.ZodBoolean>;
                    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    range: z.ZodOptional<z.ZodObject<{
                        min: z.ZodNumber;
                        max: z.ZodNumber;
                        step: z.ZodOptional<z.ZodNumber>;
                    }, "strip", z.ZodTypeAny, {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    }, {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    }>>;
                    enumMappings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString]>>>;
                    component: z.ZodOptional<z.ZodNativeEnum<typeof ComponentTypes>>;
                    optionType: z.ZodOptional<z.ZodNativeEnum<typeof OptionTypes>>;
                    columnSpan: z.ZodOptional<z.ZodNumber>;
                    columns: z.ZodOptional<z.ZodNumber>;
                    label: z.ZodOptional<z.ZodString>;
                    placeholder: z.ZodOptional<z.ZodString>;
                    labelCode: z.ZodOptional<z.ZodBoolean>;
                    placeholderCode: z.ZodOptional<z.ZodBoolean>;
                    descriptionCode: z.ZodOptional<z.ZodBoolean>;
                    minText: z.ZodOptional<z.ZodNumber>;
                    maxText: z.ZodOptional<z.ZodNumber>;
                    minTags: z.ZodOptional<z.ZodNumber>;
                    maxTags: z.ZodOptional<z.ZodNumber>;
                    includeInput: z.ZodOptional<z.ZodBoolean>;
                    descriptionSide: z.ZodOptional<z.ZodEnum<["top", "right", "bottom", "left"]>>;
                    searchPlaceholder: z.ZodOptional<z.ZodString>;
                    selectPlaceholder: z.ZodOptional<z.ZodString>;
                    searchPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
                    selectPlaceholderCode: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }, {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }>, "many">>;
            }, "strict", z.ZodTypeAny, {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            }, {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            }>>>;
            directEndpoint: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            titleMessageRole: z.ZodOptional<z.ZodOptional<z.ZodEnum<["system", "user", "assistant"]>>>;
            tokenConfig: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                prompt: z.ZodNumber;
                completion: z.ZodNumber;
                context: z.ZodNumber;
                cacheRead: z.ZodOptional<z.ZodNumber>;
                cacheWrite: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }>>>>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }, {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }>, "many">>>;
        bedrock: z.ZodOptional<z.ZodObject<{
            streamRate: z.ZodOptional<z.ZodNumber>;
            baseURL: z.ZodOptional<z.ZodString>;
            /**
             * Custom request headers forwarded to the provider on every request. Values
             * support the same placeholder resolution as custom endpoints — env vars
             * (`${VAR}`), user fields (`{{LIBRECHAT_USER_*}}`), and request-body fields
             * (`{{LIBRECHAT_BODY_CONVERSATIONID}}`). Primarily for routing built-in
             * providers through an AI gateway / reverse proxy that consumes metadata
             * headers (provider-native request shaping is preserved).
             */
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            titlePrompt: z.ZodOptional<z.ZodString>;
            titleModel: z.ZodOptional<z.ZodString>;
            titleConvo: z.ZodOptional<z.ZodBoolean>;
            titleMethod: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"completion">, z.ZodLiteral<"functions">, z.ZodLiteral<"structured">]>>;
            titleEndpoint: z.ZodOptional<z.ZodString>;
            titlePromptTemplate: z.ZodOptional<z.ZodString>;
            /**
             * When conversation titles are generated. `immediate` (default) generates the
             * title as soon as the request is made, in parallel with the response, from the
             * user's first message. `final` defers generation until the full response
             * completes (legacy behavior).
             */
            titleTiming: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"immediate">, z.ZodLiteral<"final">]>>;
            /** Maximum characters allowed in a single tool result before truncation. */
            maxToolResultChars: z.ZodOptional<z.ZodNumber>;
        } & {
            availableRegions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            models: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            guardrailConfig: z.ZodOptional<z.ZodObject<{
                guardrailIdentifier: z.ZodString;
                guardrailVersion: z.ZodString;
                trace: z.ZodOptional<z.ZodEnum<["enabled", "disabled", "enabled_full"]>>;
                streamProcessingMode: z.ZodOptional<z.ZodEnum<["sync", "async"]>>;
            }, "strip", z.ZodTypeAny, {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            }, {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            }>>;
            inferenceProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        }, {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        azureAssistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        agents?: {
            disableBuilder: boolean;
            capabilities: AgentCapabilities[];
            maxCitations: number;
            maxCitationsPerFile: number;
            minRelevanceScore: number;
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    }, {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        azureAssistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        agents?: {
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            disableBuilder?: boolean | undefined;
            capabilities?: AgentCapabilities[] | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            maxCitations?: number | undefined;
            maxCitationsPerFile?: number | undefined;
            minRelevanceScore?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    }>, {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region: string;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        azureAssistants?: {
            version: string | number;
            retrievalModels: string[];
            capabilities: Capabilities[];
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
        } | undefined;
        agents?: {
            disableBuilder: boolean;
            capabilities: AgentCapabilities[];
            maxCitations: number;
            maxCitationsPerFile: number;
            minRelevanceScore: number;
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled: boolean;
                    } | undefined;
                    oidc?: {
                        enabled: boolean;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint: string;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    }, {
        azureOpenAI?: ({
            groups: ({
                group: string;
                models: Record<string, boolean | {
                    assistants?: boolean | undefined;
                    version?: string | undefined;
                    deploymentName?: string | undefined;
                }>;
            } & {
                apiKey: string;
                assistants?: boolean | undefined;
                version?: string | undefined;
                baseURL?: string | undefined;
                instanceName?: string | undefined;
                deploymentName?: string | undefined;
                serverless?: boolean | undefined;
                addParams?: Record<string, unknown> | undefined;
                dropParams?: string[] | undefined;
                additionalHeaders?: Record<string, string> | undefined;
            })[];
            assistants?: boolean | undefined;
        } & {
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
        }) | undefined;
        openAI?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        google?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
        anthropic?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            vertex?: {
                region?: string | undefined;
                enabled?: boolean | undefined;
                projectId?: string | undefined;
                deploymentName?: string | undefined;
                serviceKeyFile?: string | undefined;
                models?: string[] | Record<string, boolean | {
                    deploymentName?: string | undefined;
                }> | undefined;
            } | undefined;
        } | undefined;
        assistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        azureAssistants?: {
            version?: string | number | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            disableBuilder?: boolean | undefined;
            pollIntervalMs?: number | undefined;
            timeoutMs?: number | undefined;
            supportedIds?: string[] | undefined;
            excludedIds?: string[] | undefined;
            privateAssistants?: boolean | undefined;
            retrievalModels?: string[] | undefined;
            capabilities?: Capabilities[] | undefined;
        } | undefined;
        agents?: {
            skills?: {
                maxCatalogSkills?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            disableBuilder?: boolean | undefined;
            capabilities?: AgentCapabilities[] | undefined;
            recursionLimit?: number | undefined;
            maxRecursionLimit?: number | undefined;
            maxCitations?: number | undefined;
            maxCitationsPerFile?: number | undefined;
            minRelevanceScore?: number | undefined;
            allowedProviders?: string[] | undefined;
            remoteApi?: {
                auth?: {
                    apiKey?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                    oidc?: {
                        enabled?: boolean | undefined;
                        scope?: string | undefined;
                        audience?: string | undefined;
                        issuer?: string | undefined;
                        jwksUri?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        custom?: {
            name?: string | undefined;
            iconURL?: string | undefined;
            apiKey?: string | undefined;
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            provider?: EModelEndpoint.anthropic | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: {
                default: (string | {
                    name: string;
                    description?: string | undefined;
                })[];
                fetch?: boolean | undefined;
                userIdQuery?: boolean | undefined;
            } | undefined;
            addParams?: Record<string, unknown> | undefined;
            dropParams?: string[] | undefined;
            modelDisplayLabel?: string | undefined;
            customParams?: {
                defaultParamsEndpoint?: string | undefined;
                reasoningFormat?: import("./schemas").ReasoningParameterFormat | undefined;
                reasoningKey?: import("./schemas").ReasoningResponseKey | undefined;
                includeReasoningContent?: boolean | undefined;
                includeReasoningHistory?: boolean | undefined;
                paramDefinitions?: {
                    key: string;
                    type?: SettingTypes | undefined;
                    options?: string[] | undefined;
                    description?: string | undefined;
                    label?: string | undefined;
                    component?: ComponentTypes | undefined;
                    default?: string | number | boolean | string[] | undefined;
                    range?: {
                        max: number;
                        min: number;
                        step?: number | undefined;
                    } | undefined;
                    minText?: number | undefined;
                    maxText?: number | undefined;
                    minTags?: number | undefined;
                    maxTags?: number | undefined;
                    columns?: number | undefined;
                    showLabel?: boolean | undefined;
                    showDefault?: boolean | undefined;
                    enumMappings?: Record<string, string | number | boolean> | undefined;
                    optionType?: OptionTypes | undefined;
                    columnSpan?: number | undefined;
                    placeholder?: string | undefined;
                    labelCode?: boolean | undefined;
                    placeholderCode?: boolean | undefined;
                    descriptionCode?: boolean | undefined;
                    includeInput?: boolean | undefined;
                    descriptionSide?: "top" | "right" | "bottom" | "left" | undefined;
                    searchPlaceholder?: string | undefined;
                    selectPlaceholder?: string | undefined;
                    searchPlaceholderCode?: boolean | undefined;
                    selectPlaceholderCode?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            directEndpoint?: boolean | undefined;
            titleMessageRole?: "user" | "system" | "assistant" | undefined;
            tokenConfig?: Record<string, {
                context: number;
                prompt: number;
                completion: number;
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
            }> | undefined;
        }[] | undefined;
        bedrock?: {
            headers?: Record<string, string> | undefined;
            baseURL?: string | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
            models?: string[] | undefined;
            availableRegions?: string[] | undefined;
            guardrailConfig?: {
                guardrailIdentifier: string;
                guardrailVersion: string;
                trace?: "enabled" | "disabled" | "enabled_full" | undefined;
                streamProcessingMode?: "sync" | "async" | undefined;
            } | undefined;
            inferenceProfiles?: Record<string, string> | undefined;
        } | undefined;
        allowedAddresses?: string[] | undefined;
        all?: {
            headers?: Record<string, string> | undefined;
            streamRate?: number | undefined;
            titlePrompt?: string | undefined;
            titleModel?: string | undefined;
            titleConvo?: boolean | undefined;
            titleMethod?: "completion" | "functions" | "structured" | undefined;
            titleEndpoint?: string | undefined;
            titlePromptTemplate?: string | undefined;
            titleTiming?: "immediate" | "final" | undefined;
            maxToolResultChars?: number | undefined;
        } | undefined;
    }>>;
}>;
export type TCustomConfig = DeepPartial<z.infer<typeof configSchema>>;
export type TCustomEndpoints = z.infer<typeof customEndpointsSchema>;
export type TProviderSchema = z.infer<typeof ttsOpenaiSchema> | z.infer<typeof ttsElevenLabsSchema> | z.infer<typeof ttsLocalaiSchema> | undefined;
export declare enum KnownEndpoints {
    anyscale = "anyscale",
    apipie = "apipie",
    cohere = "cohere",
    fireworks = "fireworks",
    deepseek = "deepseek",
    moonshot = "moonshot",
    groq = "groq",
    helicone = "helicone",
    huggingface = "huggingface",
    mistral = "mistral",
    mlx = "mlx",
    ollama = "ollama",
    openrouter = "openrouter",
    perplexity = "perplexity",
    shuttleai = "shuttleai",
    'together.ai' = "together.ai",
    unify = "unify",
    vercel = "vercel",
    xai = "xai"
}
export declare enum FetchTokenConfig {
    openrouter = "openrouter",
    helicone = "helicone"
}
export declare const defaultEndpoints: EModelEndpoint[];
export declare const alternateName: {
    openAI: string;
    assistants: string;
    agents: string;
    azureAssistants: string;
    azureOpenAI: string;
    google: string;
    anthropic: string;
    custom: string;
    bedrock: string;
    ollama: string;
    deepseek: string;
    moonshot: string;
    xai: string;
    vercel: string;
    helicone: string;
};
export declare const bedrockModels: string[];
export declare const defaultModels: {
    azureAssistants: string[];
    assistants: string[];
    agents: string[];
    google: string[];
    anthropic: string[];
    openAI: string[];
    bedrock: string[];
};
export declare const initialModelsConfig: TModelsConfig;
export declare const EndpointURLs: {
    readonly assistants: `${string}/api/assistants/v2/chat`;
    readonly azureAssistants: `${string}/api/assistants/v1/chat`;
    readonly agents: `${string}/api/agents/chat`;
};
export declare const modularEndpoints: Set<string>;
export declare const supportsBalanceCheck: {
    custom: boolean;
    openAI: boolean;
    anthropic: boolean;
    assistants: boolean;
    agents: boolean;
    azureAssistants: boolean;
    azureOpenAI: boolean;
    bedrock: boolean;
    google: boolean;
};
export declare const visionModels: string[];
export declare enum VisionModes {
    generative = "generative",
    agents = "agents"
}
export declare function validateVisionModel({ model, additionalModels, availableModels, }: {
    model: string;
    additionalModels?: string[];
    availableModels?: string[];
}): boolean;
export declare const imageGenTools: Set<string>;
/**
 * Enum for collections using infinite queries
 */
export declare enum InfiniteCollections {
    /**
     * Collection for Prompt Groups
     */
    PROMPT_GROUPS = "promptGroups",
    /**
     * Collection for Shared Links
     */
    SHARED_LINKS = "sharedLinks"
}
/**
 * Enum for time intervals
 */
export declare enum Time {
    ONE_DAY = 86400000,
    TWELVE_HOURS = 43200000,
    ONE_HOUR = 3600000,
    THIRTY_MINUTES = 1800000,
    TEN_MINUTES = 600000,
    FIVE_MINUTES = 300000,
    THREE_MINUTES = 180000,
    TWO_MINUTES = 120000,
    ONE_MINUTE = 60000,
    THIRTY_SECONDS = 30000
}
/**
 * Enum for cache keys.
 */
export declare enum CacheKeys {
    /**
     * Key for the config store namespace.
     */
    CONFIG_STORE = "CONFIG_STORE",
    /**
     * Key for the tool cache namespace (plugins, MCP tools, tool definitions).
     */
    TOOL_CACHE = "TOOL_CACHE",
    /**
     * Key for the roles cache.
     */
    ROLES = "ROLES",
    /**
     * Key for the title generation cache.
     */
    GEN_TITLE = "GEN_TITLE",
    /**
     * Key for the tools cache.
     */
    TOOLS = "TOOLS",
    /**
     * Key for the model config cache.
     */
    MODELS_CONFIG = "MODELS_CONFIG",
    /**
     * Key for the model queries cache.
     */
    MODEL_QUERIES = "MODEL_QUERIES",
    /**
     * Key for the default startup config cache.
     */
    STARTUP_CONFIG = "STARTUP_CONFIG",
    /**
     * Key for the default endpoint config cache.
     */
    ENDPOINT_CONFIG = "ENDPOINT_CONFIG",
    /**
     * Key for accessing the model token config cache.
     */
    TOKEN_CONFIG = "TOKEN_CONFIG",
    /**
     * Key for the app config namespace.
     */
    APP_CONFIG = "APP_CONFIG",
    /**
     * Key for accessing Abort Keys
     */
    ABORT_KEYS = "ABORT_KEYS",
    /**
     * Key for the bans cache.
     */
    BANS = "BANS",
    /**
     * Key for the encoded domains cache.
     * Used by Azure OpenAI Assistants.
     */
    ENCODED_DOMAINS = "ENCODED_DOMAINS",
    /**
     * Key for the cached audio run Ids.
     */
    AUDIO_RUNS = "AUDIO_RUNS",
    /**
     * Key for in-progress messages.
     */
    MESSAGES = "MESSAGES",
    /**
     * Key for in-progress flow states.
     */
    FLOWS = "FLOWS",
    /**
     * Key for pending chat requests (concurrency check)
     */
    PENDING_REQ = "PENDING_REQ",
    /**
     * Key for s3 check intervals per user
     */
    S3_EXPIRY_INTERVAL = "S3_EXPIRY_INTERVAL",
    /**
     * key for open id exchanged tokens
     */
    OPENID_EXCHANGED_TOKENS = "OPENID_EXCHANGED_TOKENS",
    /**
     * Key for OpenID session.
     */
    OPENID_SESSION = "OPENID_SESSION",
    /**
     * Key for SAML session.
     */
    SAML_SESSION = "SAML_SESSION",
    /**
     * Key for admin panel OAuth exchange codes (one-time-use, short TTL).
     */
    ADMIN_OAUTH_EXCHANGE = "ADMIN_OAUTH_EXCHANGE"
}
/**
 * Enum for violation types, used to identify, log, and cache violations.
 */
export declare enum ViolationTypes {
    /**
     * File Upload Violations (exceeding limit).
     */
    FILE_UPLOAD_LIMIT = "file_upload_limit",
    /**
     * Illegal Model Request (not available).
     */
    ILLEGAL_MODEL_REQUEST = "illegal_model_request",
    /**
     * Token Limit Violation.
     */
    TOKEN_BALANCE = "token_balance",
    /**
     * An issued ban.
     */
    BAN = "ban",
    /**
     * TTS Request Limit Violation.
     */
    TTS_LIMIT = "tts_limit",
    /**
     * STT Request Limit Violation.
     */
    STT_LIMIT = "stt_limit",
    /**
     * Reset Password Limit Violation.
     */
    RESET_PASSWORD_LIMIT = "reset_password_limit",
    /**
     * Verify Email Limit Violation.
     */
    VERIFY_EMAIL_LIMIT = "verify_email_limit",
    /**
     * Verify Conversation Access violation.
     */
    CONVO_ACCESS = "convo_access",
    /**
     * Tool Call Limit Violation.
     */
    TOOL_CALL_LIMIT = "tool_call_limit",
    /**
     * General violation (catch-all).
     */
    GENERAL = "general",
    /**
     * Login attempt violations.
     */
    LOGINS = "logins",
    /**
     * Concurrent request violations.
     */
    CONCURRENT = "concurrent",
    /**
     * Non-browser access violations.
     */
    NON_BROWSER = "non_browser",
    /**
     * Message limit violations.
     */
    MESSAGE_LIMIT = "message_limit",
    /**
     * Registration violations.
     */
    REGISTRATIONS = "registrations"
}
/**
 * Enum for error message types that are not "violations" as above, used to identify client-facing errors.
 */
export declare enum ErrorTypes {
    /**
     * No User-provided Key.
     */
    NO_USER_KEY = "no_user_key",
    /**
     * Expired User-provided Key.
     */
    EXPIRED_USER_KEY = "expired_user_key",
    /**
     * Invalid User-provided Key.
     */
    INVALID_USER_KEY = "invalid_user_key",
    /**
     * No Base URL Provided.
     */
    NO_BASE_URL = "no_base_url",
    /**
     * Base URL targets a restricted or invalid address (SSRF protection).
     */
    INVALID_BASE_URL = "invalid_base_url",
    /**
     * Moderation error
     */
    MODERATION = "moderation",
    /**
     * Prompt exceeds max length
     */
    INPUT_LENGTH = "INPUT_LENGTH",
    /**
     * Invalid request error, API rejected request
     */
    INVALID_REQUEST = "invalid_request_error",
    /**
     * Invalid action request error, likely not on list of allowed domains
     */
    INVALID_ACTION = "invalid_action_error",
    /**
     * Invalid request error, API rejected request
     */
    NO_SYSTEM_MESSAGES = "no_system_messages",
    /**
     * Google provider returned an error
     */
    GOOGLE_ERROR = "google_error",
    /**
     * Google provider does not allow custom tools with built-in tools
     */
    GOOGLE_TOOL_CONFLICT = "google_tool_conflict",
    /**
     * Invalid Agent Provider (excluded by Admin)
     */
    INVALID_AGENT_PROVIDER = "invalid_agent_provider",
    /**
     * Missing model selection
     */
    MISSING_MODEL = "missing_model",
    /**
     * Models configuration not loaded
     */
    MODELS_NOT_LOADED = "models_not_loaded",
    /**
     * Endpoint models not loaded
     */
    ENDPOINT_MODELS_NOT_LOADED = "endpoint_models_not_loaded",
    /**
     * Generic Authentication failure
     */
    AUTH_FAILED = "auth_failed",
    /**
     * Model refused to respond (content policy violation)
     */
    REFUSAL = "refusal",
    /**
     * SSE stream 404 — job completed, expired, or was deleted before the subscriber connected
     */
    STREAM_EXPIRED = "stream_expired"
}
/**
 * Enum for authentication keys.
 */
export declare enum AuthKeys {
    /**
     * Key for the Service Account to use Vertex AI.
     */
    GOOGLE_SERVICE_KEY = "GOOGLE_SERVICE_KEY",
    /**
     * API key to use Google Generative AI.
     *
     * Note: this is not for Environment Variables, but to access encrypted object values.
     */
    GOOGLE_API_KEY = "GOOGLE_API_KEY",
    /**
     * API key to use Anthropic.
     *
     * Note: this is not for Environment Variables, but to access encrypted object values.
     */
    ANTHROPIC_API_KEY = "ANTHROPIC_API_KEY"
}
/**
 * Enum for Image Detail Cost.
 *
 * **Low Res Fixed Cost:** `85`
 *
 * **High Res Calculation:**
 *
 * Number of `512px` Tiles * `170` + `85` (Additional Cost)
 */
export declare enum ImageDetailCost {
    /**
     * Low resolution is a fixed value.
     */
    LOW = 85,
    /**
     * High resolution Cost Per Tile
     */
    HIGH = 170,
    /**
     * Additional Cost added to High Resolution Total Cost
     */
    ADDITIONAL = 85
}
/**
 * Tab values for Settings Dialog
 */
export declare enum SettingsTabValues {
    /**
     * Tab for General Settings
     */
    GENERAL = "general",
    /**
     * Tab for Chat Settings
     */
    CHAT = "chat",
    /**
     * Tab for Speech Settings
     */
    SPEECH = "speech",
    /**
     * Tab for Beta Features
     */
    BETA = "beta",
    /**
     * Tab for Data Controls
     */
    DATA = "data",
    /**
     * Tab for Balance Settings
     */
    BALANCE = "balance",
    /**
     * Tab for Account Settings
     */
    ACCOUNT = "account",
    /**
     * Chat input commands
     */
    COMMANDS = "commands",
    /**
     * Tab for Personalization Settings
     */
    PERSONALIZATION = "personalization",
    /**
     * Tab for About / Build Info
     */
    ABOUT = "about"
}
export declare enum STTProviders {
    /**
     * Provider for OpenAI STT
     */
    OPENAI = "openai",
    /**
     * Provider for Microsoft Azure STT
     */
    AZURE_OPENAI = "azureOpenAI"
}
export declare enum TTSProviders {
    /**
     * Provider for OpenAI TTS
     */
    OPENAI = "openai",
    /**
     * Provider for Microsoft Azure OpenAI TTS
     */
    AZURE_OPENAI = "azureOpenAI",
    /**
     * Provider for ElevenLabs TTS
     */
    ELEVENLABS = "elevenlabs",
    /**
     * Provider for LocalAI TTS
     */
    LOCALAI = "localai"
}
/** Enum for app-wide constants */
export declare enum Constants {
    /**
     * Key for the app's version. The placeholder `__LIBRECHAT_VERSION__` is
     * swapped in by `@rollup/plugin-replace` during `npm run build:data-provider`
     * using the value of the root `package.json`'s `version` field. Consumers
     * always import this via the built dist bundle (see `main` field in
     * `packages/data-provider/package.json`), so production and UI code get the
     * substituted value. Only tests that import the TypeScript source directly
     * would observe the raw placeholder.
     */
    VERSION = "__LIBRECHAT_VERSION__",
    /** Key for the Custom Config's version (librechat.yaml). */
    CONFIG_VERSION = "1.3.13",
    /** Standard value for the first message's `parentMessageId` value, to indicate no parent exists. */
    NO_PARENT = "00000000-0000-0000-0000-000000000000",
    /** Standard value to use whatever the submission prelim. `responseMessageId` is */
    USE_PRELIM_RESPONSE_MESSAGE_ID = "USE_PRELIM_RESPONSE_MESSAGE_ID",
    /** Standard value for the initial conversationId before a request is sent */
    NEW_CONVO = "new",
    /** Standard value for the temporary conversationId after a request is sent and before the server responds */
    PENDING_CONVO = "PENDING",
    /** Standard value for the conversationId used for search queries */
    SEARCH = "search",
    /** Fixed, encoded domain length for Azure OpenAI Assistants Function name parsing. */
    ENCODED_DOMAIN_LENGTH = 10,
    /** Identifier for using current_model in multi-model requests. */
    CURRENT_MODEL = "current_model",
    /** Common divider for text values */
    COMMON_DIVIDER = "__",
    /** Max length for commands */
    COMMANDS_MAX_LENGTH = 56,
    /** Default Stream Rate (ms) */
    DEFAULT_STREAM_RATE = 1,
    /** Saved Tag */
    SAVED_TAG = "Saved",
    /** Max number of Conversation starters for Agents/Assistants */
    MAX_CONVO_STARTERS = 4,
    /** Delimiter for MCP tools */
    mcp_delimiter = "_mcp_",
    /** Prefix for MCP plugins */
    mcp_prefix = "mcp_",
    /** Unique value to indicate all MCP servers. For backend use only. */
    mcp_all = "sys__all__sys",
    /** Unique value to indicate clearing MCP servers from UI state. For frontend use only. */
    mcp_clear = "sys__clear__sys",
    /** Key suffix for non-spec user default tool storage */
    spec_defaults_key = "__defaults__",
    /**
     * Unique value to indicate the MCP tool was added to an agent.
     * This helps inform the UI if the mcp server was previously added.
     * */
    mcp_server = "sys__server__sys",
    /**
     * Handoff Tool Name Prefix
     */
    LC_TRANSFER_TO_ = "lc_transfer_to_",
    /** Placeholder Agent ID for Ephemeral Agents */
    EPHEMERAL_AGENT_ID = "ephemeral",
    /** Programmatic Tool Calling tool name */
    PROGRAMMATIC_TOOL_CALLING = "run_tools_with_code",
    /** Bash Programmatic Tool Calling tool name */
    BASH_PROGRAMMATIC_TOOL_CALLING = "run_tools_with_bash",
    /** Subagent spawn tool name (must match `@librechat/agents` `Constants.SUBAGENT`). */
    SUBAGENT = "subagent"
}
/** Maximum explicit subagent hops allowed from any root agent at runtime. */
export declare const MAX_SUBAGENT_DEPTH = 5;
/** Maximum unique explicit subagent targets that may be loaded at runtime. */
export declare const MAX_SUBAGENT_GRAPH_NODES = 50;
/** Maximum expanded SubagentConfig entries embedded into one run request. */
export declare const MAX_SUBAGENT_RUN_CONFIGS = 100;
export declare enum LocalStorageKeys {
    /** Key for the admin defined App Title */
    APP_TITLE = "appTitle",
    /** Key for the last conversation setup. */
    LAST_CONVO_SETUP = "lastConversationSetup",
    /** Key for the last selected model. */
    LAST_MODEL = "lastSelectedModel",
    /** Key for the last selected tools. */
    LAST_TOOLS = "lastSelectedTools",
    /** Key for the last selected spec by name*/
    LAST_SPEC = "lastSelectedSpec",
    /** Key for temporary files to delete */
    FILES_TO_DELETE = "filesToDelete",
    /** Prefix key for the last selected assistant ID by index */
    ASST_ID_PREFIX = "assistant_id__",
    /** Prefix key for the last selected agent ID by index */
    AGENT_ID_PREFIX = "agent_id__",
    /** Key for the last selected fork setting */
    FORK_SETTING = "forkSetting",
    /** Key for remembering the last selected option, instead of manually selecting */
    REMEMBER_FORK_OPTION = "rememberDefaultFork",
    /** Key for remembering the split at target fork option modifier */
    FORK_SPLIT_AT_TARGET = "splitAtTarget",
    /** Key for saving text drafts */
    TEXT_DRAFT = "textDraft_",
    /** Key for saving file drafts */
    FILES_DRAFT = "filesDraft_",
    /** Key for last Selected Prompt Category */
    LAST_PROMPT_CATEGORY = "lastPromptCategory",
    /** Key for rendering User Messages as Markdown */
    ENABLE_USER_MSG_MARKDOWN = "enableUserMsgMarkdown",
    /** Key for auto-expanding tool call details */
    AUTO_EXPAND_TOOLS = "autoExpandTools",
    /** Last selected MCP values per conversation ID */
    LAST_MCP_ = "LAST_MCP_",
    /** Last checked toggle for Code Interpreter API per conversation ID */
    LAST_CODE_TOGGLE_ = "LAST_CODE_TOGGLE_",
    /** Last checked toggle for Web Search per conversation ID */
    LAST_WEB_SEARCH_TOGGLE_ = "LAST_WEB_SEARCH_TOGGLE_",
    /** Last checked toggle for File Search per conversation ID */
    LAST_FILE_SEARCH_TOGGLE_ = "LAST_FILE_SEARCH_TOGGLE_",
    /** Last checked toggle for Artifacts per conversation ID */
    LAST_ARTIFACTS_TOGGLE_ = "LAST_ARTIFACTS_TOGGLE_",
    /** Last checked toggle for Skills per conversation ID */
    LAST_SKILLS_TOGGLE_ = "LAST_SKILLS_TOGGLE_",
    /** Key for the last selected agent provider */
    LAST_AGENT_PROVIDER = "lastAgentProvider",
    /** Key for the last selected agent model */
    LAST_AGENT_MODEL = "lastAgentModel",
    /** Pin state for MCP tools per conversation ID */
    PIN_MCP_ = "PIN_MCP_",
    /** Pin state for Web Search per conversation ID */
    PIN_WEB_SEARCH_ = "PIN_WEB_SEARCH_",
    /** Pin state for Code Interpreter per conversation ID */
    PIN_CODE_INTERPRETER_ = "PIN_CODE_INTERPRETER_"
}
export declare enum ForkOptions {
    /** Key for direct path option */
    DIRECT_PATH = "directPath",
    /** Key for including branches */
    INCLUDE_BRANCHES = "includeBranches",
    /** Key for target level fork (default) */
    TARGET_LEVEL = "targetLevel",
    /** Default option */
    DEFAULT = "default"
}
/**
 * Enum for Cohere related constants
 */
export declare enum CohereConstants {
    /**
     * Cohere API Endpoint, for special handling
     */
    API_URL = "https://api.cohere.ai/v1",
    /**
     * Role for "USER" messages
     */
    ROLE_USER = "USER",
    /**
     * Role for "SYSTEM" messages
     */
    ROLE_SYSTEM = "SYSTEM",
    /**
     * Role for "CHATBOT" messages
     */
    ROLE_CHATBOT = "CHATBOT",
    /**
     * Title message as required by Cohere
     */
    TITLE_MESSAGE = "TITLE:"
}
export declare enum SystemCategories {
    ALL = "sys__all__sys",
    MY_PROMPTS = "sys__my__prompts__sys",
    NO_CATEGORY = "sys__no__category__sys",
    SHARED_PROMPTS = "sys__shared__prompts__sys"
}
export declare const providerEndpointMap: {
    openAI: EModelEndpoint;
    bedrock: EModelEndpoint;
    anthropic: EModelEndpoint;
    azureOpenAI: EModelEndpoint;
};
export declare const specialVariables: {
    current_date: boolean;
    current_user: boolean;
    iso_datetime: boolean;
    current_datetime: boolean;
};
export type TSpecialVarLabel = `com_ui_special_var_${keyof typeof specialVariables}`;
/**
 * Retrieves a specific field from the endpoints configuration for a given endpoint key.
 * Does not infer or default any endpoint type when absent.
 */
export declare function getEndpointField<K extends TConfig[keyof TConfig] extends never ? never : keyof TConfig>(endpointsConfig: TEndpointsConfig | undefined | null, endpoint: EModelEndpoint | string | null | undefined, property: K): TConfig[K] | undefined;
/**
 * Resolves the effective endpoint type:
 * - Non-agents endpoint: config.type || endpoint
 * - Agents + provider: config[provider].type || provider
 * - Agents, no provider: EModelEndpoint.agents
 *
 * Returns `undefined` when endpoint is null/undefined.
 */
export declare function resolveEndpointType(endpointsConfig: TEndpointsConfig | undefined | null, endpoint: string | null | undefined, agentProvider?: string | null): EModelEndpoint | string | undefined;
/** Resolves the `defaultParamsEndpoint` for a given endpoint from its custom params config */
export declare function getDefaultParamsEndpoint(endpointsConfig: TEndpointsConfig | undefined | null, endpoint: string | null | undefined): string | undefined;
