Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_shutdown = require("./shutdown-C00qNl6b.cjs");
let node_http = require("node:http");
let _opentelemetry_sdk_node = require("@opentelemetry/sdk-node");
let _opentelemetry_resources = require("@opentelemetry/resources");
let _opentelemetry_instrumentation_http = require("@opentelemetry/instrumentation-http");
let _opentelemetry_instrumentation_undici = require("@opentelemetry/instrumentation-undici");
let _opentelemetry_instrumentation_ioredis = require("@opentelemetry/instrumentation-ioredis");
let _opentelemetry_instrumentation_express = require("@opentelemetry/instrumentation-express");
let _opentelemetry_instrumentation_mongodb = require("@opentelemetry/instrumentation-mongodb");
let _opentelemetry_instrumentation_mongoose = require("@opentelemetry/instrumentation-mongoose");
let _opentelemetry_semantic_conventions = require("@opentelemetry/semantic-conventions");
let _opentelemetry_api = require("@opentelemetry/api");
let node_perf_hooks = require("node:perf_hooks");
//#region src/telemetry/config.ts
const DEFAULT_SERVICE_NAME = "librechat";
const DEFAULT_HEALTH_PATH = "/health";
function isTruthy(value) {
	if (typeof value === "boolean") return value;
	if (typeof value === "string") return value.trim().toLowerCase() === "true";
	return false;
}
function normalizeEnvValue(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
function getTelemetryConfig(env = process.env) {
	const sdkDisabled = isTruthy(env.OTEL_SDK_DISABLED);
	const enabled = isTruthy(env.OTEL_TRACING_ENABLED) && !sdkDisabled;
	const serviceName = normalizeEnvValue(env.OTEL_SERVICE_NAME) ?? DEFAULT_SERVICE_NAME;
	const serviceVersion = normalizeEnvValue(env.OTEL_SERVICE_VERSION) ?? normalizeEnvValue(env.npm_package_version);
	return {
		enabled,
		serviceName,
		ioredisTracingEnabled: isTruthy(env.OTEL_IOREDIS_TRACING_ENABLED),
		sdkDisabled,
		serviceVersion,
		healthPath: DEFAULT_HEALTH_PATH
	};
}
//#endregion
//#region src/telemetry/sdk.ts
const WARNING_CODE = "LIBRECHAT_OTEL";
const REDACTED_QUERY_VALUE = "[REDACTED]";
const SIGNAL_SHUTDOWN_TIMEOUT_MS = 5e3;
let activeSdk;
let pendingSdk;
let startPromise;
let shutdownPromise;
let status = "stopped";
let shutdownTaskRegistered = false;
let requestSpans = /* @__PURE__ */ new WeakMap();
function isBunRuntime() {
	return Reflect.get(globalThis, "Bun") != null;
}
function shouldIgnoreIncomingRequest(request, healthPath) {
	return request.url === healthPath || request.url?.startsWith(`${healthPath}?`) === true;
}
function getIncomingUrlInfo(request) {
	const rawUrl = request.url ?? "/";
	try {
		const parsedUrl = new URL(rawUrl, "http://localhost");
		return {
			hasQuery: parsedUrl.search.length > 1,
			pathname: parsedUrl.pathname || "/"
		};
	} catch {
		const queryIndex = rawUrl.indexOf("?");
		return {
			hasQuery: queryIndex >= 0 && queryIndex < rawUrl.length - 1,
			pathname: queryIndex >= 0 ? rawUrl.slice(0, queryIndex) || "/" : rawUrl || "/"
		};
	}
}
function getLowCardinalityUrlPath(pathname, healthPath) {
	if (pathname === healthPath) return healthPath;
	if (pathname === "/api" || pathname.startsWith("/api/")) return "/api/*";
	return "spa_fallback";
}
function getSanitizedIncomingUrlAttributes(request, healthPath) {
	const { hasQuery, pathname } = getIncomingUrlInfo(request);
	const safePath = getLowCardinalityUrlPath(pathname, healthPath);
	const safeTarget = hasQuery ? `${safePath}?${REDACTED_QUERY_VALUE}` : safePath;
	const attributes = {
		"http.target": safeTarget,
		"http.url": safeTarget,
		"url.full": safeTarget,
		"url.path": safePath
	};
	if (hasQuery) attributes["url.query"] = REDACTED_QUERY_VALUE;
	return attributes;
}
function getStringValue(value) {
	if (value == null) return;
	return String(value).trim() || void 0;
}
function getRedactedQuery(search) {
	const query = search.startsWith("?") ? search.slice(1) : search;
	if (!query) return;
	return query.split("&").map((part) => {
		const separatorIndex = part.indexOf("=");
		if (separatorIndex < 0) return REDACTED_QUERY_VALUE;
		const key = part.slice(0, separatorIndex);
		if (!key) return REDACTED_QUERY_VALUE;
		return `${key}=${REDACTED_QUERY_VALUE}`;
	}).join("&");
}
function getSanitizedUrlAttributesFromParts(origin, pathname, search) {
	const path = pathname || "/";
	const redactedQuery = getRedactedQuery(search);
	const target = redactedQuery ? `${path}?${redactedQuery}` : path;
	const fullUrl = origin ? `${origin}${target}` : target;
	const attributes = {
		"http.target": target,
		"http.url": fullUrl,
		"url.full": fullUrl,
		"url.path": path
	};
	if (redactedQuery) attributes["url.query"] = redactedQuery;
	return attributes;
}
function getFallbackUrlParts(rawUrl) {
	const queryIndex = rawUrl.indexOf("?");
	if (queryIndex < 0) return {
		pathname: rawUrl || "/",
		search: ""
	};
	return {
		pathname: rawUrl.slice(0, queryIndex) || "/",
		search: rawUrl.slice(queryIndex)
	};
}
function getSanitizedOutgoingUrlAttributes(rawUrl, origin) {
	const hasOrigin = /^[a-z][a-z\d+\-.]*:\/\//i.test(rawUrl);
	try {
		const parsedUrl = new URL(rawUrl, origin ?? "http://localhost");
		return getSanitizedUrlAttributesFromParts(hasOrigin || origin ? parsedUrl.origin : void 0, parsedUrl.pathname, parsedUrl.search);
	} catch {
		const { pathname, search } = getFallbackUrlParts(rawUrl);
		return getSanitizedUrlAttributesFromParts(origin, pathname, search);
	}
}
function normalizeProtocol(protocol) {
	return protocol.endsWith(":") ? protocol : `${protocol}:`;
}
function getRequestAgentProtocol(request) {
	const { agent } = request;
	if (!agent || typeof agent === "boolean") return;
	return getStringValue(agent.protocol);
}
function getOutgoingHttpProtocol(request) {
	const protocol = getStringValue(request.protocol) ?? getRequestAgentProtocol(request);
	if (!protocol) return "http:";
	return normalizeProtocol(protocol);
}
function getUrlAuthorityHost(host) {
	try {
		return new URL(`http://${host}`).host;
	} catch {
		if (host.includes(":") && !host.startsWith("[")) return `[${host}]`;
	}
	return host;
}
function getHostWithPort(host, port) {
	const authorityHost = getUrlAuthorityHost(host);
	if (!port) return authorityHost;
	try {
		if (new URL(`http://${authorityHost}`).port) return authorityHost;
	} catch {
		return authorityHost;
	}
	return `${authorityHost}:${port}`;
}
function getOutgoingHttpOrigin(request) {
	const protocol = getOutgoingHttpProtocol(request);
	const host = getStringValue(request.host);
	const port = getStringValue(request.port);
	if (host) return `${protocol}//${getHostWithPort(host, port)}`;
	return `${protocol}//${getHostWithPort(getStringValue(request.hostname) ?? "localhost", port)}`;
}
function getOutgoingHttpUrl(request) {
	if (request.path) return request.path;
	if (request.href) return request.href;
	const pathname = request.pathname || "/";
	if (!request.search) return pathname;
	return `${pathname}${request.search.startsWith("?") ? request.search : `?${request.search}`}`;
}
function getSanitizedOutgoingHttpUrlAttributes(request) {
	return getSanitizedOutgoingUrlAttributes(getOutgoingHttpUrl(request), getOutgoingHttpOrigin(request));
}
function getSanitizedUndiciUrlAttributes(request) {
	return getSanitizedOutgoingUrlAttributes(request.path ?? "/", request.origin);
}
function getResourceAttributes(config) {
	const attributes = { [_opentelemetry_semantic_conventions.ATTR_SERVICE_NAME]: config.serviceName };
	if (config.serviceVersion) attributes[_opentelemetry_semantic_conventions.ATTR_SERVICE_VERSION] = config.serviceVersion;
	return attributes;
}
function createSdk(config) {
	const instrumentations = [
		new _opentelemetry_instrumentation_http.HttpInstrumentation({
			headersToSpanAttributes: {
				client: {
					requestHeaders: [],
					responseHeaders: []
				},
				server: {
					requestHeaders: [],
					responseHeaders: []
				}
			},
			requestHook: (span, request) => {
				if (request instanceof node_http.IncomingMessage) requestSpans.set(request, span);
			},
			startIncomingSpanHook: (request) => getSanitizedIncomingUrlAttributes(request, config.healthPath),
			startOutgoingSpanHook: (request) => getSanitizedOutgoingHttpUrlAttributes(request),
			ignoreIncomingRequestHook: (request) => shouldIgnoreIncomingRequest(request, config.healthPath)
		}),
		new _opentelemetry_instrumentation_express.ExpressInstrumentation(),
		new _opentelemetry_instrumentation_mongodb.MongoDBInstrumentation(),
		new _opentelemetry_instrumentation_mongoose.MongooseInstrumentation(),
		new _opentelemetry_instrumentation_undici.UndiciInstrumentation({ startSpanHook: (request) => getSanitizedUndiciUrlAttributes(request) })
	];
	if (config.ioredisTracingEnabled) instrumentations.push(new _opentelemetry_instrumentation_ioredis.IORedisInstrumentation());
	return new _opentelemetry_sdk_node.NodeSDK({
		resource: (0, _opentelemetry_resources.resourceFromAttributes)(getResourceAttributes(config)),
		instrumentations
	});
}
function getTelemetryRequestSpan(request) {
	return requestSpans.get(request);
}
/**
* NodeSDK.start has been synchronous in some supported OpenTelemetry versions
* and promise-returning in others, so the lifecycle wrapper accepts either form.
*/
function startSdk(sdk) {
	return sdk.start();
}
function emitWarning(message) {
	process.emitWarning(message, { code: WARNING_CODE });
}
function getErrorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
function isControllerEnabled() {
	return status === "starting" || status === "started";
}
function makeController() {
	return {
		get enabled() {
			return isControllerEnabled();
		},
		get status() {
			return status;
		},
		shutdown: shutdownTelemetry
	};
}
function ensureShutdownTaskRegistered() {
	if (shutdownTaskRegistered) return;
	shutdownTaskRegistered = true;
	require_shutdown.registerShutdownTask("telemetry", () => withTimeout(shutdownTelemetry(), SIGNAL_SHUTDOWN_TIMEOUT_MS).catch((error) => {
		emitWarning(`OpenTelemetry shutdown failed: ${getErrorMessage(error)}`);
	}));
}
function withTimeout(promise, timeoutMs) {
	let timeout;
	const timeoutPromise = new Promise((_, reject) => {
		timeout = setTimeout(() => {
			reject(/* @__PURE__ */ new Error(`timed out after ${timeoutMs}ms`));
		}, timeoutMs);
		timeout.unref?.();
	});
	return Promise.race([promise, timeoutPromise]).finally(() => {
		if (timeout) clearTimeout(timeout);
	});
}
function initializeTelemetry(env = process.env) {
	if (activeSdk || pendingSdk) return makeController();
	const config = getTelemetryConfig(env);
	if (!config.enabled || isBunRuntime()) {
		status = "disabled";
		return makeController();
	}
	try {
		const sdk = createSdk(config);
		const result = startSdk(sdk);
		if (result) {
			pendingSdk = sdk;
			status = "starting";
			const pendingStart = result.then(() => {
				if (pendingSdk === sdk) {
					pendingSdk = void 0;
					activeSdk = sdk;
					status = "started";
					ensureShutdownTaskRegistered();
				}
			}).catch((error) => {
				if (pendingSdk === sdk) {
					pendingSdk = void 0;
					status = "failed";
					emitWarning(`OpenTelemetry initialization failed: ${getErrorMessage(error)}`);
				}
			});
			startPromise = pendingStart;
			pendingStart.finally(() => {
				if (startPromise === pendingStart) startPromise = void 0;
			});
			return makeController();
		}
		activeSdk = sdk;
		status = "started";
		ensureShutdownTaskRegistered();
		return makeController();
	} catch (error) {
		status = "failed";
		emitWarning(`OpenTelemetry initialization failed: ${getErrorMessage(error)}`);
		return makeController();
	}
}
async function performShutdownTelemetry() {
	if (startPromise) await startPromise;
	if (!activeSdk) {
		status = status === "started" ? "stopped" : status;
		return;
	}
	const sdk = activeSdk;
	try {
		await sdk.shutdown();
		activeSdk = void 0;
		status = "stopped";
	} catch (error) {
		status = "started";
		throw error;
	}
}
function shutdownTelemetry() {
	if (!shutdownPromise) shutdownPromise = performShutdownTelemetry().finally(() => {
		shutdownPromise = void 0;
	});
	return shutdownPromise;
}
//#endregion
//#region src/telemetry/middleware.ts
const CLIENT_CLOSED_REQUEST_STATUS_CODE = 499;
function getUserId(req) {
	return req.user?.id;
}
function getTenantId(req) {
	return req.user?.tenantId;
}
function isHealthPath(req) {
	return req.path === DEFAULT_HEALTH_PATH;
}
function isApiPath(req) {
	return req.path === "/api" || req.path.startsWith("/api/");
}
function getRoutePath(req) {
	const routePath = req.route?.path;
	if (typeof routePath === "string") return `${req.baseUrl}${routePath}`;
	if (isHealthPath(req)) return "/health";
	if (isApiPath(req)) return "/api/*";
	return "spa_fallback";
}
function setIdentityAttributes(span, req) {
	const userId = getUserId(req);
	const tenantId = getTenantId(req);
	if (!userId && !tenantId) return;
	const attributes = {};
	if (userId) attributes["enduser.id"] = userId;
	if (tenantId) attributes["librechat.tenant.id"] = tenantId;
	span.setAttributes(attributes);
}
function setCompletionAttributes(span, req, res, aborted = false) {
	const statusCode = aborted ? CLIENT_CLOSED_REQUEST_STATUS_CODE : res.statusCode;
	const attributes = {
		"http.route": getRoutePath(req),
		"http.response.status_code": statusCode
	};
	if (aborted) attributes["librechat.request.aborted"] = true;
	setIdentityAttributes(span, req);
	span.setAttributes(attributes);
	if (aborted || statusCode >= 500) span.setStatus({ code: _opentelemetry_api.SpanStatusCode.ERROR });
}
function telemetryMiddleware(req, res, next) {
	if (isHealthPath(req)) {
		next();
		return;
	}
	const span = getTelemetryRequestSpan(req) ?? _opentelemetry_api.trace.getActiveSpan();
	if (!span) {
		next();
		return;
	}
	span.setAttributes({ "http.request.method": req.method });
	let completed = false;
	const complete = () => {
		if (completed) return;
		completed = true;
		setCompletionAttributes(span, req, res);
	};
	const close = () => {
		if (completed) return;
		completed = true;
		setCompletionAttributes(span, req, res, !res.writableEnded);
	};
	res.once("finish", complete);
	res.once("close", close);
	next();
}
function telemetryErrorMiddleware(err, req, _res, next) {
	const span = getTelemetryRequestSpan(req) ?? _opentelemetry_api.trace.getActiveSpan();
	if (span) {
		const routePath = getRoutePath(req);
		if (err) span.recordException(err instanceof Error ? err : String(err));
		span.setStatus({ code: _opentelemetry_api.SpanStatusCode.ERROR });
		setIdentityAttributes(span, req);
		span.setAttributes({
			"error.type": getErrorType(err),
			"http.route": routePath
		});
	}
	next(err);
}
function getErrorType(err) {
	if (err instanceof Error) return err.name || err.constructor.name;
	if (err === null) return "null";
	return typeof err;
}
//#endregion
//#region src/telemetry/stream.ts
const STREAM_SPAN_NAME = "librechat.sse.stream";
const STREAM_ROUTE = "/api/agents/chat/stream/:streamId";
var SseStreamSpanTelemetry = class {
	constructor({ isResume, req, res, streamId }) {
		this.startTimeMs = node_perf_hooks.performance.now();
		this.bytesSent = 0;
		this.chunksCount = 0;
		this.ended = false;
		this.errorEventEmitted = false;
		this.finalEventEmitted = false;
		this.finalEventWritten = false;
		this.span = _opentelemetry_api.trace.getTracer("librechat.telemetry").startSpan(STREAM_SPAN_NAME, {
			kind: _opentelemetry_api.SpanKind.INTERNAL,
			attributes: {
				"http.request.method": req.method,
				"http.route": STREAM_ROUTE,
				"librechat.stream.id": streamId,
				"librechat.stream.resume": isResume,
				"librechat.stream.route": STREAM_ROUTE
			}
		}, _opentelemetry_api.context.active());
		res.once("finish", () => {
			this.end(this.plannedEndReason ?? (this.errorEventEmitted ? "server_error" : "done"));
		});
		res.once("close", () => {
			if (res.writableEnded) {
				this.end(this.plannedEndReason ?? (this.errorEventEmitted ? "server_error" : "done"));
				return;
			}
			this.span.addEvent("client_aborted");
			this.end("client_aborted");
		});
	}
	recordHeadersFlushed() {
		this.span.addEvent("headers_flushed");
		this.span.setAttribute("librechat.stream.headers_flushed", true);
	}
	recordWrite(payload, options) {
		if (this.ended) return;
		this.chunksCount += 1;
		this.bytesSent += Buffer.byteLength(payload);
		if (this.firstChunkMs === void 0) {
			this.firstChunkMs = node_perf_hooks.performance.now() - this.startTimeMs;
			this.span.addEvent("first_chunk");
			this.span.setAttribute("librechat.stream.time_to_first_chunk_ms", this.firstChunkMs);
		}
		if (options?.final) {
			this.finalEventWritten = true;
			this.span.addEvent("final_event_written");
		}
	}
	recordFinalEventEmitted() {
		this.finalEventEmitted = true;
		this.plannedEndReason = "done";
		this.span.addEvent("final_event_emitted");
	}
	recordErrorEventEmitted() {
		this.errorEventEmitted = true;
		this.plannedEndReason ??= "server_error";
		this.span.addEvent("error_event_emitted");
	}
	recordSubscribeFailed() {
		this.plannedEndReason = "subscribe_failed";
		this.span.addEvent("subscribe_failed");
	}
	end(reason) {
		if (this.ended) return;
		this.ended = true;
		const attributes = {
			"http.response.body.size": this.bytesSent,
			"librechat.stream.bytes.sent": this.bytesSent,
			"librechat.stream.chunks.count": this.chunksCount,
			"librechat.stream.completed": reason === "done",
			"librechat.stream.duration_ms": node_perf_hooks.performance.now() - this.startTimeMs,
			"librechat.stream.end_reason": reason,
			"librechat.stream.error_event_emitted": this.errorEventEmitted,
			"librechat.stream.final_event_emitted": this.finalEventEmitted,
			"librechat.stream.final_event_written": this.finalEventWritten
		};
		if (this.firstChunkMs !== void 0) attributes["librechat.stream.time_to_first_chunk_ms"] = this.firstChunkMs;
		this.span.setAttributes(attributes);
		if (reason !== "done") {
			this.span.setStatus({ code: _opentelemetry_api.SpanStatusCode.ERROR });
			this.span.setAttribute("error.type", reason);
		}
		this.span.end();
	}
};
function createSseStreamTelemetry(options) {
	return new SseStreamSpanTelemetry(options);
}
//#endregion
exports.createSseStreamTelemetry = createSseStreamTelemetry;
exports.getTelemetryConfig = getTelemetryConfig;
exports.initializeTelemetry = initializeTelemetry;
exports.shutdownTelemetry = shutdownTelemetry;
exports.telemetryErrorMiddleware = telemetryErrorMiddleware;
exports.telemetryMiddleware = telemetryMiddleware;

//# sourceMappingURL=telemetry.cjs.map