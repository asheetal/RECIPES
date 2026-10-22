import { BASE_CONFIG_PRINCIPAL_ID, CAPABILITY_CATEGORIES, CapabilityImplications, ResourceCapabilityMap, SystemCapabilities, configCapability, expandImplications, hasImpliedCapability, isValidCapability, readConfigCapability } from "./admin/capabilities.mjs";
import { createRequire } from "node:module";
import { AccessRoleIds, BASE_ONLY_CONFIG_SECTIONS, CacheKeys, Capabilities, Constants, DEFAULT_MEMORY_MAX_INPUT_TOKENS, EModelEndpoint, EToolResources, ErrorTypes, FileContext, FileSources, INTERFACE_PERMISSION_FIELDS, OCRStrategy, PERMISSION_SUB_KEYS, PermissionBits, PermissionTypes, Permissions, PrincipalModel, PrincipalType, REFILL_INTERVAL_UNITS, ResourceType, RetentionMode, SKILL_BODY_MAX_LENGTH, SKILL_DESCRIPTION_MAX_LENGTH, SKILL_DESCRIPTION_SHORT_THRESHOLD, SKILL_DISPLAY_TITLE_MAX_LENGTH, SKILL_NAME_MAX_LENGTH, SKILL_NAME_PATTERN, SafeSearchTypes, SystemCategories, SystemRoles, actionDelimiter, agentsEndpointSchema, assistantEndpointSchema, defaultAssistantsVersion, envVarRegex, extractEnvVariable, getConfigDefaults, isActionTool, mapModelToAzureConfig, memorySchema, normalizeEndpointName, parseTextParts, permissionsSchema, removeNullishValues, roleDefaults, skillSyncConfigSchema, summarizationConfigSchema, validateAzureGroups } from "librechat-data-provider";
import winston from "winston";
import "winston-daily-rotate-file";
import { klona } from "klona";
import { AsyncLocalStorage } from "async_hooks";
import path from "path";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import crypto, { createHash as createHash$1 } from "node:crypto";
import mongoose, { Schema, Types } from "mongoose";
import _ from "lodash";
import { MeiliSearch, MeiliSearchTimeOutError } from "meilisearch";
import { nanoid } from "nanoid";
//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);
//#endregion
//#region src/app/agents.ts
/**
* Sets up the Agents configuration from the config (`librechat.yaml`) file.
* If no agents config is defined, uses the provided defaults or parses empty object.
*
* @param config - The loaded custom configuration.
* @param [defaultConfig] - Default configuration from getConfigDefaults.
* @returns The Agents endpoint configuration.
*/
function agentsConfigSetup(config, defaultConfig) {
	const agentsConfig = config?.endpoints?.[EModelEndpoint.agents];
	if (!agentsConfig) return defaultConfig || agentsEndpointSchema.parse({});
	return agentsEndpointSchema.parse(agentsConfig);
}
//#endregion
//#region src/config/tenantContext.ts
/** Sentinel value for deliberate cross-tenant system operations */
const SYSTEM_TENANT_ID = "__SYSTEM__";
/**
* AsyncLocalStorage instance for propagating tenant context.
* Callbacks passed to `tenantStorage.run()` must be `async` for the context to propagate
* through Mongoose query execution. Sync callbacks returning a Mongoose thenable will lose context.
*/
const tenantStorage = new AsyncLocalStorage();
/** Returns the current tenant ID from async context, or undefined if none is set */
function getTenantId() {
	return tenantStorage.getStore()?.tenantId;
}
/** Returns the current user ID from async context, or undefined if none is set */
function getUserId() {
	return tenantStorage.getStore()?.userId;
}
/** Returns the current request ID from async context, or undefined if none is set */
function getRequestId() {
	return tenantStorage.getStore()?.requestId;
}
/**
* Runs a function in an explicit cross-tenant system context (bypasses tenant filtering).
* The callback MUST be async — sync callbacks returning Mongoose thenables will lose context.
*/
function runAsSystem(fn) {
	const { requestId, userId } = tenantStorage.getStore() ?? {};
	return tenantStorage.run({
		tenantId: SYSTEM_TENANT_ID,
		requestId,
		userId
	}, fn);
}
/**
* Appends `:${tenantId}` to a cache key when a non-system tenant context is active.
* Returns the base key unchanged when no ALS context is set or when running
* inside `runAsSystem()` (SYSTEM_TENANT_ID context).
*/
function scopedCacheKey(baseKey) {
	const tenantId = getTenantId();
	if (!tenantId || tenantId === "__SYSTEM__") return baseKey;
	return `${baseKey}:${tenantId}`;
}
//#endregion
//#region src/utils/object-traverse.ts
const DEFAULT_MAX_NODES = 2500;
const DEFAULT_MAX_DEPTH = 5;
function isObject(value) {
	if (value === null || typeof value !== "object") return false;
	if (value instanceof Date) return false;
	if (value instanceof RegExp) return false;
	if (value instanceof Error) return false;
	if (value instanceof URL) return false;
	if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) return false;
	if (ArrayBuffer.isView(value)) return false;
	if (value instanceof ArrayBuffer) return false;
	if (value instanceof SharedArrayBuffer) return false;
	if (value instanceof Promise) return false;
	if (value instanceof WeakMap) return false;
	if (value instanceof WeakSet) return false;
	if (value instanceof Map) return false;
	if (value instanceof Set) return false;
	const stringTag = Object.prototype.toString.call(value);
	if (stringTag === "[object Boolean]" || stringTag === "[object Number]" || stringTag === "[object String]") return false;
	return true;
}
function setProperty(obj, key, value) {
	if (Array.isArray(obj) && typeof key === "number") obj[key] = value;
	else if (!Array.isArray(obj) && typeof key === "string") obj[key] = value;
	else if (!Array.isArray(obj) && typeof key === "number") obj[key] = value;
}
function deleteProperty(obj, key) {
	if (Array.isArray(obj) && typeof key === "number") return;
	if (!Array.isArray(obj)) delete obj[key];
}
function hasOwnEnumerable(node) {
	for (const key in node) if (Object.prototype.hasOwnProperty.call(node, key)) return true;
	return false;
}
function forEach(obj, callback, options) {
	const maxNodes = options?.maxNodes ?? DEFAULT_MAX_NODES;
	const maxDepth = options?.maxDepth ?? DEFAULT_MAX_DEPTH;
	let visitedCount = 0;
	const ancestors = [];
	function findAncestorCycle(node) {
		for (let i = ancestors.length - 1; i >= 0; i--) if (ancestors[i].node === node) return ancestors[i].context;
		return null;
	}
	function walk(node, path = [], parent) {
		if (visitedCount >= maxNodes) return;
		let circular = null;
		if (isObject(node)) {
			circular = findAncestorCycle(node);
			if (circular) return;
		}
		const key = path.length > 0 ? path[path.length - 1] : void 0;
		const isRoot = path.length === 0;
		const level = path.length;
		const isLeaf = level >= maxDepth || !isObject(node) || (Array.isArray(node) ? node.length === 0 : !hasOwnEnumerable(node));
		const context = {
			node,
			path: [...path],
			parent,
			key,
			isLeaf,
			notLeaf: !isLeaf,
			isRoot,
			notRoot: !isRoot,
			level,
			circular,
			update(value) {
				if (!isRoot && parent && key !== void 0 && isObject(parent.node)) setProperty(parent.node, key, value);
				this.node = value;
			},
			remove() {
				if (!isRoot && parent && key !== void 0 && isObject(parent.node)) if (Array.isArray(parent.node) && typeof key === "number") parent.node.splice(key, 1);
				else deleteProperty(parent.node, key);
			}
		};
		visitedCount++;
		callback.call(context, node);
		if (isObject(node) && !isLeaf) {
			ancestors.push({
				node,
				context
			});
			if (Array.isArray(node)) for (let i = 0; i < node.length; i++) {
				if (visitedCount >= maxNodes) break;
				walk(node[i], [...path, i], context);
			}
			else for (const childKey in node) {
				if (!Object.prototype.hasOwnProperty.call(node, childKey)) continue;
				if (visitedCount >= maxNodes) break;
				walk(node[childKey], [...path, childKey], context);
			}
			ancestors.pop();
		}
	}
	walk(obj);
}
function traverse(obj, options) {
	return { forEach(callback) {
		forEach(obj, callback, options);
	} };
}
//#endregion
//#region src/config/parsers.ts
const SPLAT_SYMBOL = Symbol.for("splat");
const MESSAGE_SYMBOL = Symbol.for("message");
const CONSOLE_JSON_STRING_LENGTH = parseInt(process.env.CONSOLE_JSON_STRING_LENGTH || "", 10) || 255;
const DEBUG_MESSAGE_LENGTH = parseInt(process.env.DEBUG_MESSAGE_LENGTH || "", 10) || 150;
const LOG_CONTEXT_KEYS$1 = [
	"tenantId",
	"userId",
	"requestId"
];
const REDACTED_VALUE = "[REDACTED]";
const REDACTION_TRUNCATED_KEY = "__redaction_truncated__";
const MAX_REDACTION_DEPTH = 8;
const MAX_REDACTION_ENTRIES = 50;
const MAX_REDACTION_STRING_LENGTH = Math.max(CONSOLE_JSON_STRING_LENGTH, 8192);
const MAX_REDACTION_BUFFER_BYTES = MAX_REDACTION_STRING_LENGTH;
const sensitiveKeys = [
	/\b(sk-)[a-zA-Z0-9_-]+/g,
	/\b(Bearer )[^\s"']+/g,
	/\b(api-key:? )[^\s"']+/gi,
	/\b(api_key=)[^\s"'&]+/gi,
	/\b(key=)[^\s"'&]+/g
];
const sensitiveMetadataKey = /^(authorization|proxy-authorization|x-api-key|api[-_]?key|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password)$/i;
const errorStringProperties = new Set([
	"name",
	"message",
	"stack"
]);
/**
* Redacts sensitive information from a console message and trims it to a specified length if provided.
* @param str - The console message to be redacted.
* @param trimLength - The optional length at which to trim the redacted message.
* @returns The redacted and optionally trimmed console message.
*/
function redactMessage(str, trimLength) {
	if (!str) return "";
	const redacted = sensitiveKeys.reduce((currentMessage, pattern) => currentMessage.replace(pattern, "$1[REDACTED]"), str);
	if (trimLength !== void 0 && redacted.length > trimLength) return `${redacted.substring(0, trimLength)}...`;
	return redacted;
}
function redactLogString(str) {
	if (str.length <= MAX_REDACTION_STRING_LENGTH) return redactMessage(str);
	return `${redactMessage(str.substring(0, MAX_REDACTION_STRING_LENGTH))}... [truncated ${str.length - MAX_REDACTION_STRING_LENGTH} chars]`;
}
function isPlainRecord(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function isSensitiveMetadataKey(key) {
	return sensitiveMetadataKey.test(key);
}
function redactRecordValue(key, value, seen, depth) {
	return isSensitiveMetadataKey(key) ? REDACTED_VALUE : redactLogValue(value, seen, depth);
}
function defineRedactedErrorProperty(error, key, value) {
	if (value === void 0) return;
	Object.defineProperty(error, key, {
		value: redactLogString(value),
		writable: true,
		enumerable: false,
		configurable: true
	});
}
function defineRedactedDescriptor(target, key, descriptor, seen, depth) {
	if (!("value" in descriptor)) {
		Object.defineProperty(target, key, descriptor);
		return;
	}
	Object.defineProperty(target, key, {
		...descriptor,
		value: typeof key === "string" ? redactRecordValue(key, descriptor.value, seen, depth) : redactLogValue(descriptor.value, seen, depth)
	});
}
function redactErrorValue(error, seen, depth) {
	const redacted = Object.create(Object.getPrototypeOf(error));
	seen.set(error, redacted);
	defineRedactedErrorProperty(redacted, "name", error.name);
	defineRedactedErrorProperty(redacted, "message", error.message);
	defineRedactedErrorProperty(redacted, "stack", error.stack);
	Reflect.ownKeys(error).forEach((key) => {
		if (typeof key === "string" && errorStringProperties.has(key)) return;
		const descriptor = Object.getOwnPropertyDescriptor(error, key);
		if (descriptor === void 0) return;
		defineRedactedDescriptor(redacted, key, descriptor, seen, depth + 1);
	});
	return redacted;
}
function isBufferValue(value) {
	return typeof Buffer !== "undefined" && Buffer.isBuffer(value);
}
function getJsonValue(value) {
	const toJSON = value.toJSON;
	if (typeof toJSON !== "function") return;
	try {
		const jsonValue = toJSON.call(value);
		return jsonValue === value ? void 0 : jsonValue;
	} catch {
		return;
	}
}
function getCustomStringValue(value) {
	const toString = value.toString;
	if (typeof toString !== "function" || toString === Object.prototype.toString) return;
	try {
		const stringValue = toString.call(value);
		return typeof stringValue === "string" ? stringValue : void 0;
	} catch {
		return;
	}
}
function redactMapValue(value, seen, depth) {
	const redacted = /* @__PURE__ */ new Map();
	seen.set(value, redacted);
	let count = 0;
	for (const [mapKey, mapValue] of value) {
		if (count >= MAX_REDACTION_ENTRIES) {
			redacted.set(REDACTION_TRUNCATED_KEY, "Additional map entries omitted");
			break;
		}
		redacted.set(mapKey, typeof mapKey === "string" ? redactRecordValue(mapKey, mapValue, seen, depth + 1) : redactLogValue(mapValue, seen, depth + 1));
		count += 1;
	}
	return redacted;
}
function redactSetValue(value, seen, depth) {
	const redacted = /* @__PURE__ */ new Set();
	seen.set(value, redacted);
	let count = 0;
	for (const setValue of value) {
		if (count >= MAX_REDACTION_ENTRIES) {
			redacted.add("Additional set values omitted");
			break;
		}
		redacted.add(redactLogValue(setValue, seen, depth + 1));
		count += 1;
	}
	return redacted;
}
function redactObjectEntries(value, seen, depth) {
	const record = value;
	let redacted;
	let count = 0;
	for (const key in record) {
		if (!Object.prototype.hasOwnProperty.call(record, key)) continue;
		if (redacted === void 0) {
			redacted = {};
			seen.set(value, redacted);
		}
		if (count >= MAX_REDACTION_ENTRIES) {
			redacted[REDACTION_TRUNCATED_KEY] = "Additional object properties omitted";
			break;
		}
		redacted[key] = redactRecordValue(key, record[key], seen, depth + 1);
		count += 1;
	}
	return redacted;
}
function redactNonPlainValue(value, seen, depth) {
	if (isBufferValue(value)) return value.length > MAX_REDACTION_BUFFER_BYTES ? `[REDACTED Buffer ${value.length} bytes]` : redactLogString(value.toString("utf8"));
	if (value instanceof URL || value instanceof URLSearchParams) return redactLogString(value.toString());
	if (value instanceof Map) return redactMapValue(value, seen, depth);
	if (value instanceof Set) return redactSetValue(value, seen, depth);
	const jsonValue = getJsonValue(value);
	if (jsonValue !== void 0) return redactLogValue(jsonValue, seen, depth + 1);
	const redactedEntries = redactObjectEntries(value, seen, depth);
	if (redactedEntries !== void 0) return redactedEntries;
	const stringValue = getCustomStringValue(value);
	return stringValue !== void 0 ? redactLogString(stringValue) : value;
}
function redactLogValue(value, seen = /* @__PURE__ */ new WeakMap(), depth = 0) {
	if (typeof value === "string") return redactLogString(value);
	if (value === null || typeof value !== "object") return value;
	const cached = seen.get(value);
	if (cached !== void 0) return cached;
	if (depth >= MAX_REDACTION_DEPTH) return REDACTED_VALUE;
	if (Array.isArray(value)) {
		const redacted = [];
		seen.set(value, redacted);
		const length = Math.min(value.length, MAX_REDACTION_ENTRIES);
		for (let index = 0; index < length; index++) redacted.push(redactLogValue(value[index], seen, depth + 1));
		if (value.length > MAX_REDACTION_ENTRIES) redacted.push("Additional array values omitted");
		return redacted;
	}
	if (value instanceof Error) return redactErrorValue(value, seen, depth);
	if (!isPlainRecord(value)) return redactNonPlainValue(value, seen, depth);
	return redactObjectEntries(value, seen, depth) ?? {};
}
/**
* Redacts sensitive information from log messages at every level.
* Note: Intentionally mutates the object.
* @param info - The log information object.
* @returns The modified log information object.
*/
const redactFormat = winston.format((info) => {
	const infoRecord = info;
	if (info.message !== void 0) info.message = redactLogValue(info.message);
	const symbolValue = infoRecord[MESSAGE_SYMBOL];
	if (symbolValue !== void 0) infoRecord[MESSAGE_SYMBOL] = redactLogValue(symbolValue);
	if (infoRecord[SPLAT_SYMBOL] !== void 0) infoRecord[SPLAT_SYMBOL] = redactLogValue(infoRecord[SPLAT_SYMBOL]);
	return info;
});
/**
* Truncates long strings, especially base64 image data, within log messages.
*
* @param value - The value to be inspected and potentially truncated.
* @param length - The length at which to truncate the value. Default: 100.
* @returns The truncated or original value.
*/
const truncateLongStrings = (value, length = 100) => {
	if (typeof value === "string") return value.length > length ? value.substring(0, length) + "... [truncated]" : value;
	return value;
};
/**
* An array mapping function that truncates long strings (objects converted to JSON strings).
* @param item - The item to be condensed.
* @returns The condensed item.
*/
const condenseArray = (item) => {
	if (typeof item === "string") return truncateLongStrings(JSON.stringify(item));
	else if (typeof item === "object") return truncateLongStrings(JSON.stringify(item));
	return item;
};
function formatRequestContext$1(metadata) {
	const context = {};
	LOG_CONTEXT_KEYS$1.forEach((key) => {
		const value = metadata[key];
		if (key === "tenantId" && value === "__SYSTEM__") return;
		if (typeof value === "string" && value) context[key] = value;
	});
	return Object.keys(context).length > 0 ? JSON.stringify(context) : "";
}
function appendRequestContext$1(line, metadata) {
	const context = formatRequestContext$1(metadata);
	return context ? `${line} ${context}` : line;
}
/**
* Formats log messages for debugging purposes.
* - Truncates long strings within log messages.
* - Condenses arrays by truncating long strings and objects as strings within array items.
* - Message redaction is applied by redactFormat before this formatter.
* - Converts log information object to a formatted string.
*
* @param options - The options for formatting log messages.
* @returns The formatted log message.
*/
const debugTraverse = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
	if (!message) return `${timestamp} ${level}`;
	if (typeof message !== "string" || !message.trim) return `${timestamp} ${level}: ${JSON.stringify(message)}`;
	const msgParts = [`${timestamp} ${level}: ${truncateLongStrings(message.trim(), DEBUG_MESSAGE_LENGTH)}`];
	try {
		if (level !== "debug") return appendRequestContext$1(msgParts[0], metadata);
		if (!metadata) return msgParts[0];
		const splatArray = metadata[SPLAT_SYMBOL];
		const debugValue = Array.isArray(splatArray) ? splatArray[0] : void 0;
		if (!debugValue) return appendRequestContext$1(msgParts[0], metadata);
		if (debugValue && Array.isArray(debugValue)) {
			msgParts.push(`\n${JSON.stringify(debugValue.map(condenseArray))}`);
			return appendRequestContext$1(msgParts.join(""), metadata);
		}
		if (typeof debugValue !== "object") {
			msgParts.push(` ${debugValue}`);
			return appendRequestContext$1(msgParts.join(""), metadata);
		}
		msgParts.push("\n{");
		const copy = klona(metadata);
		if (copy.tenantId === "__SYSTEM__") delete copy.tenantId;
		try {
			traverse(copy).forEach(function(value) {
				if (typeof this?.key === "symbol") return;
				let _parentKey = "";
				const parent = this.parent;
				if (typeof parent?.key !== "symbol" && parent?.key !== void 0) _parentKey = String(parent.key);
				const parentKey = `${parent && parent.notRoot ? _parentKey + "." : ""}`;
				const tabs = `${parent && parent.notRoot ? "    " : "  "}`;
				const currentKey = this?.key ?? "unknown";
				if (this.isLeaf && typeof value === "string") {
					const truncatedText = truncateLongStrings(value);
					msgParts.push(`\n${tabs}${parentKey}${currentKey}: ${JSON.stringify(truncatedText)},`);
				} else if (this.notLeaf && Array.isArray(value) && value.length > 0) {
					const currentMessage = `\n${tabs}// ${value.length} ${String(currentKey).replace(/s$/, "")}(s)`;
					this.update(currentMessage);
					msgParts.push(currentMessage);
					const stringifiedArray = value.map(condenseArray);
					msgParts.push(`\n${tabs}${parentKey}${currentKey}: [${stringifiedArray}],`);
				} else if (this.isLeaf && typeof value === "function") msgParts.push(`\n${tabs}${parentKey}${currentKey}: function,`);
				else if (this.isLeaf) msgParts.push(`\n${tabs}${parentKey}${currentKey}: ${value},`);
			});
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : "Unknown error";
			msgParts.push(`\n[LOGGER TRAVERSAL ERROR] ${errorMessage}`);
		}
		msgParts.push("\n}");
		return msgParts.join("");
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : "Unknown error";
		msgParts.push(`\n[LOGGER PARSING ERROR] ${errorMessage}`);
		return msgParts.join("");
	}
});
/**
* Truncates long string values in JSON log objects.
* Prevents outputting extremely long values (e.g., base64, blobs).
*/
const jsonTruncateFormat = winston.format((info) => {
	const truncateLongStrings = (str, maxLength) => str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
	const seen = /* @__PURE__ */ new WeakSet();
	const truncateObject = (obj) => {
		if (typeof obj !== "object" || obj === null) return obj;
		if (seen.has(obj)) return "[Circular]";
		seen.add(obj);
		if (Array.isArray(obj)) return obj.map((item) => truncateObject(item));
		const objectRecord = obj;
		const newObj = {};
		Object.entries(objectRecord).forEach(([key, value]) => {
			if (typeof value === "string") newObj[key] = truncateLongStrings(value, CONSOLE_JSON_STRING_LENGTH);
			else newObj[key] = truncateObject(value);
		});
		return newObj;
	};
	return truncateObject(info);
});
//#endregion
//#region src/config/utils.ts
/**
* Determine the log directory in a cross-compatible way.
* Priority:
* 1. LIBRECHAT_LOG_DIR environment variable
* 2. If running within LibreChat monorepo (when cwd ends with /api), use api/logs
* 3. If api/logs exists relative to cwd, use that (for running from project root)
* 4. Otherwise, use logs directory relative to process.cwd()
*
* This avoids using __dirname which is not available in ESM modules
*/
const getLogDirectory = () => {
	if (process.env.LIBRECHAT_LOG_DIR) return process.env.LIBRECHAT_LOG_DIR;
	const cwd = process.cwd();
	if (cwd.endsWith("/api") || cwd.endsWith("\\api")) return path.join(cwd, "logs");
	const apiLogsPath = path.join(cwd, "api", "logs");
	if (cwd.includes("LibreChat")) return apiLogsPath;
	return path.join(cwd, "logs");
};
//#endregion
//#region src/config/winston.ts
const { NODE_ENV: NODE_ENV$1, DEBUG_LOGGING: DEBUG_LOGGING$1, CONSOLE_JSON, DEBUG_CONSOLE, LOG_TO_FILE: LOG_TO_FILE$1 } = process.env;
const useConsoleJson = typeof CONSOLE_JSON === "string" && CONSOLE_JSON.toLowerCase() === "true";
const useDebugConsole = typeof DEBUG_CONSOLE === "string" && DEBUG_CONSOLE.toLowerCase() === "true";
const useDebugLogging$1 = typeof DEBUG_LOGGING$1 === "string" && DEBUG_LOGGING$1.toLowerCase() === "true";
const useFileLogging$1 = typeof LOG_TO_FILE$1 !== "string" || LOG_TO_FILE$1.toLowerCase() !== "false";
const levels$1 = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	activity: 6,
	silly: 7
};
const LOG_CONTEXT_KEYS = [
	"tenantId",
	"userId",
	"requestId"
];
function getLogTenantId() {
	const tenantId = getTenantId();
	return tenantId === "__SYSTEM__" ? void 0 : tenantId;
}
const requestContextFormat = winston.format((info) => {
	if (info.tenantId === "__SYSTEM__") delete info.tenantId;
	const context = {
		tenantId: getLogTenantId(),
		userId: getUserId(),
		requestId: getRequestId()
	};
	LOG_CONTEXT_KEYS.forEach((key) => {
		if (context[key] && info[key] == null) info[key] = context[key];
	});
	return info;
});
function formatRequestContext(info) {
	const context = {};
	LOG_CONTEXT_KEYS.forEach((key) => {
		const value = info[key];
		if (key === "tenantId" && value === "__SYSTEM__") return;
		if (typeof value === "string" && value) context[key] = value;
	});
	return Object.keys(context).length > 0 ? JSON.stringify(context) : "";
}
function appendRequestContext(line, info) {
	const context = formatRequestContext(info);
	return context ? `${line} ${context}` : line;
}
winston.addColors({
	info: "green",
	warn: "italic yellow",
	error: "red",
	debug: "blue"
});
const level$1 = () => {
	return (NODE_ENV$1 || "development") === "development" ? "debug" : "warn";
};
const fileFormat$1 = winston.format.combine(redactFormat(), winston.format.timestamp({ format: () => (/* @__PURE__ */ new Date()).toISOString() }), winston.format.errors({ stack: true }), winston.format.splat(), requestContextFormat());
const transports$1 = [];
if (useFileLogging$1) {
	const logDir = getLogDirectory();
	transports$1.push(new winston.transports.DailyRotateFile({
		level: "error",
		filename: `${logDir}/error-%DATE%.log`,
		datePattern: "YYYY-MM-DD",
		zippedArchive: true,
		maxSize: "20m",
		maxFiles: "14d",
		format: winston.format.combine(fileFormat$1, winston.format.json())
	}));
	if (useDebugLogging$1) transports$1.push(new winston.transports.DailyRotateFile({
		level: "debug",
		filename: `${logDir}/debug-%DATE%.log`,
		datePattern: "YYYY-MM-DD",
		zippedArchive: true,
		maxSize: "20m",
		maxFiles: "14d",
		format: winston.format.combine(fileFormat$1, debugTraverse)
	}));
}
const consoleFormat$1 = winston.format.combine(redactFormat(), requestContextFormat(), winston.format.colorize({ all: true }), winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.printf((info) => {
	const line = appendRequestContext(`${info.timestamp} ${info.level}: ${info.message}`, info);
	return info.level.includes("error") ? redactMessage(line) : line;
}));
let consoleLogLevel = "info";
if (useDebugConsole) consoleLogLevel = "debug";
if (useDebugConsole) transports$1.push(new winston.transports.Console({
	level: consoleLogLevel,
	format: useConsoleJson ? winston.format.combine(fileFormat$1, jsonTruncateFormat(), winston.format.json()) : winston.format.combine(fileFormat$1, debugTraverse)
}));
else if (useConsoleJson) transports$1.push(new winston.transports.Console({
	level: consoleLogLevel,
	format: winston.format.combine(fileFormat$1, jsonTruncateFormat(), winston.format.json())
}));
else transports$1.push(new winston.transports.Console({
	level: consoleLogLevel,
	format: consoleFormat$1
}));
const logger = winston.createLogger({
	level: level$1(),
	levels: levels$1,
	transports: transports$1
});
//#endregion
//#region src/app/memory.ts
const hasValidAgent = (agent) => !!agent && ("id" in agent && !!agent.id || "provider" in agent && "model" in agent && !!agent.provider && !!agent.model);
const isDisabled = (config) => !config || config.disabled === true;
function loadMemoryConfig(config) {
	if (!config) return void 0;
	if (isDisabled(config)) return config;
	if (hasValidAgent(config.agent) && config.agent?.enabled == null) logger.warn("[memory] Agent config detected without explicit `enabled: true`. Automatic memory extraction is now opt-in. Add `memory.agent.enabled: true` to keep automatic memory updates.");
	const charLimit = memorySchema.shape.charLimit.safeParse(config.charLimit).data ?? 1e4;
	const maxInputTokens = memorySchema.shape.maxInputTokens.safeParse(config.maxInputTokens).data ?? DEFAULT_MEMORY_MAX_INPUT_TOKENS;
	return {
		...config,
		charLimit,
		maxInputTokens
	};
}
function isMemoryEnabled(config) {
	return !isDisabled(config);
}
function isMemoryAgentEnabled(config) {
	if (!isMemoryEnabled(config)) return false;
	return config?.agent?.enabled === true && hasValidAgent(config.agent);
}
//#endregion
//#region src/app/interface.ts
/**
* Loads the default interface object.
* @param params - The loaded custom configuration.
* @param params.config - The loaded custom configuration.
* @param params.configDefaults - The custom configuration default values.
* @returns default interface object.
*/
async function loadDefaultInterface({ config, configDefaults }) {
	const { interface: interfaceConfig } = config ?? {};
	const { interface: defaults } = configDefaults;
	const hasModelSpecs = (config?.modelSpecs?.list?.length ?? 0) > 0;
	const includesAddedEndpoints = (config?.modelSpecs?.addedEndpoints?.length ?? 0) > 0;
	const memoryConfig = config?.memory;
	const memoryEnabled = isMemoryEnabled(memoryConfig);
	/** Only disable memories if memory config is present and explicitly disabled */
	const shouldDisableMemories = memoryConfig && !memoryEnabled;
	return removeNullishValues({
		modelSelect: interfaceConfig?.modelSelect ?? (hasModelSpecs ? includesAddedEndpoints : defaults.modelSelect),
		parameters: interfaceConfig?.parameters ?? (hasModelSpecs ? false : defaults.parameters),
		presets: interfaceConfig?.presets ?? (hasModelSpecs ? false : defaults.presets),
		privacyPolicy: interfaceConfig?.privacyPolicy ?? defaults.privacyPolicy,
		termsOfService: interfaceConfig?.termsOfService ?? defaults.termsOfService,
		mcpServers: interfaceConfig?.mcpServers ?? defaults.mcpServers,
		customWelcome: interfaceConfig?.customWelcome ?? defaults.customWelcome,
		autoSubmitFromUrl: interfaceConfig?.autoSubmitFromUrl ?? defaults.autoSubmitFromUrl,
		buildInfo: interfaceConfig?.buildInfo ?? defaults.buildInfo,
		contextUsage: interfaceConfig?.contextUsage ?? defaults.contextUsage,
		contextCost: interfaceConfig?.contextCost ?? defaults.contextCost,
		currency: interfaceConfig?.currency ?? defaults.currency,
		bookmarks: interfaceConfig?.bookmarks,
		memories: shouldDisableMemories ? false : interfaceConfig?.memories,
		prompts: interfaceConfig?.prompts,
		multiConvo: interfaceConfig?.multiConvo,
		agents: interfaceConfig?.agents,
		temporaryChat: interfaceConfig?.temporaryChat,
		temporaryChatRetention: interfaceConfig?.temporaryChatRetention,
		retentionMode: interfaceConfig?.retentionMode,
		retainAgentFiles: interfaceConfig?.retainAgentFiles,
		runCode: interfaceConfig?.runCode,
		webSearch: interfaceConfig?.webSearch,
		fileSearch: interfaceConfig?.fileSearch,
		fileCitations: interfaceConfig?.fileCitations,
		defaultPinnedTools: interfaceConfig?.defaultPinnedTools,
		peoplePicker: interfaceConfig?.peoplePicker,
		marketplace: interfaceConfig?.marketplace,
		remoteAgents: interfaceConfig?.remoteAgents,
		skills: interfaceConfig?.skills,
		sharedLinks: interfaceConfig?.sharedLinks
	});
}
//#endregion
//#region src/app/turnstile.ts
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
function loadTurnstileConfig(config, configDefaults) {
	const { turnstile: customTurnstile } = config ?? {};
	const { turnstile: defaults } = configDefaults;
	const loadedTurnstile = removeNullishValues({
		siteKey: customTurnstile?.siteKey ?? defaults?.siteKey,
		options: customTurnstile?.options ?? defaults?.options
	});
	if (Boolean(loadedTurnstile.siteKey)) logger.debug("Turnstile is ENABLED with configuration:\n" + JSON.stringify(loadedTurnstile, null, 2));
	else logger.debug("Turnstile is DISABLED (no siteKey provided).");
	return loadedTurnstile;
}
//#endregion
//#region src/app/web.ts
const webSearchAuth = {
	providers: {
		serper: { serperApiKey: 1 },
		searxng: {
			searxngInstanceUrl: 1,
			/** Optional (0) */
			searxngApiKey: 0
		},
		tavily: {
			tavilyApiKey: 1,
			tavilySearchUrl: 0
		}
	},
	scrapers: {
		firecrawl: {
			firecrawlApiKey: 1,
			/** Optional (0) */
			firecrawlApiUrl: 0,
			firecrawlVersion: 0
		},
		serper: { serperApiKey: 1 },
		tavily: {
			tavilyApiKey: 1,
			tavilyExtractUrl: 0
		}
	},
	rerankers: {
		jina: {
			jinaApiKey: 1,
			/** Optional (0) */
			jinaApiUrl: 0
		},
		cohere: { cohereApiKey: 1 }
	}
};
/**
* Extracts all unique API keys from the webSearchAuth configuration object
*/
function getWebSearchKeys() {
	const keysSet = /* @__PURE__ */ new Set();
	for (const category of Object.keys(webSearchAuth)) {
		const categoryObj = webSearchAuth[category];
		for (const service of Object.keys(categoryObj)) {
			const serviceObj = categoryObj[service];
			for (const key of Object.keys(serviceObj)) keysSet.add(key);
		}
	}
	return Array.from(keysSet);
}
const webSearchKeys = getWebSearchKeys();
function loadWebSearchConfig(config) {
	const serperApiKey = config?.serperApiKey ?? "${SERPER_API_KEY}";
	const searxngInstanceUrl = config?.searxngInstanceUrl ?? "${SEARXNG_INSTANCE_URL}";
	const searxngApiKey = config?.searxngApiKey ?? "${SEARXNG_API_KEY}";
	const firecrawlApiKey = config?.firecrawlApiKey ?? "${FIRECRAWL_API_KEY}";
	const firecrawlApiUrl = config?.firecrawlApiUrl ?? "${FIRECRAWL_API_URL}";
	const firecrawlVersion = config?.firecrawlVersion ?? "${FIRECRAWL_VERSION}";
	const tavilyApiKey = config?.tavilyApiKey ?? "${TAVILY_API_KEY}";
	const tavilySearchUrl = config?.tavilySearchUrl ?? "${TAVILY_SEARCH_URL}";
	const tavilyExtractUrl = config?.tavilyExtractUrl ?? "${TAVILY_EXTRACT_URL}";
	const jinaApiKey = config?.jinaApiKey ?? "${JINA_API_KEY}";
	const jinaApiUrl = config?.jinaApiUrl ?? "${JINA_API_URL}";
	const cohereApiKey = config?.cohereApiKey ?? "${COHERE_API_KEY}";
	const safeSearch = config?.safeSearch ?? SafeSearchTypes.MODERATE;
	const rerankerType = config?.rerankerType;
	return {
		...config,
		safeSearch,
		jinaApiKey,
		jinaApiUrl,
		cohereApiKey,
		serperApiKey,
		searxngApiKey,
		tavilyApiKey,
		tavilySearchUrl,
		tavilyExtractUrl,
		firecrawlApiKey,
		firecrawlApiUrl,
		firecrawlVersion,
		searxngInstanceUrl,
		rerankerType
	};
}
//#endregion
//#region src/app/specs.ts
/**
* Sets up Model Specs from the config (`librechat.yaml`) file.
* @param [endpoints] - The loaded custom configuration for endpoints.
* @param [modelSpecs] - The loaded custom configuration for model specs.
* @param [interfaceConfig] - The loaded interface configuration.
* @returns The processed model specs, if any.
*/
function processModelSpecs(endpoints, _modelSpecs, interfaceConfig) {
	if (!_modelSpecs) return;
	const list = _modelSpecs.list;
	const modelSpecs = [];
	const customEndpoints = endpoints?.[EModelEndpoint.custom] ?? [];
	if (interfaceConfig?.modelSelect !== true && (_modelSpecs.addedEndpoints?.length ?? 0) > 0) logger.warn(`To utilize \`addedEndpoints\`, which allows provider/model selections alongside model specs, set \`modelSelect: true\` in the interface configuration.

      Example:
      \`\`\`yaml
      interface:
        modelSelect: true
      \`\`\`
      `);
	if (!list || list.length === 0) {
		if (_modelSpecs.enforce) logger.warn("modelSpecs.enforce is true but list is empty — enforcement disabled at runtime.");
		return;
	}
	for (const spec of list) {
		const currentEndpoint = spec.preset?.endpoint;
		if (!currentEndpoint) {
			logger.warn("A model spec is missing the `endpoint` field within its `preset`. Skipping model spec...");
			continue;
		}
		if (EModelEndpoint[currentEndpoint] && currentEndpoint !== EModelEndpoint.custom) {
			modelSpecs.push(spec);
			continue;
		} else if (currentEndpoint === EModelEndpoint.custom) {
			logger.warn(`Model Spec with endpoint "${currentEndpoint}" is not supported. You must specify the name of the custom endpoint (case-sensitive, as defined in your config). Skipping model spec...`);
			continue;
		}
		const normalizedName = normalizeEndpointName(currentEndpoint);
		if (!customEndpoints.find((customEndpoint) => normalizedName === normalizeEndpointName(customEndpoint.name))) {
			logger.warn(`Model spec with endpoint "${currentEndpoint}" was skipped: Endpoint not found in configuration. The \`endpoint\` value must exactly match either a system-defined endpoint or a custom endpoint defined by the user.

For more information, see the documentation at https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/model_specs#endpoint`);
			continue;
		}
		modelSpecs.push({
			...spec,
			preset: {
				...spec.preset,
				endpoint: normalizedName
			}
		});
	}
	return {
		..._modelSpecs,
		list: modelSpecs
	};
}
//#endregion
//#region src/app/assistants.ts
/**
* Sets up the minimum, default Assistants configuration if Azure OpenAI Assistants option is enabled.
* @returns The Assistants endpoint configuration.
*/
function azureAssistantsDefaults() {
	return {
		capabilities: [
			Capabilities.tools,
			Capabilities.actions,
			Capabilities.code_interpreter
		],
		version: defaultAssistantsVersion.azureAssistants
	};
}
/**
* Sets up the Assistants configuration from the config (`librechat.yaml`) file.
* @param config - The loaded custom configuration.
* @param assistantsEndpoint - The Assistants endpoint name.
* - The previously loaded assistants configuration from Azure OpenAI Assistants option.
* @param [prevConfig]
* @returns The Assistants endpoint configuration.
*/
function assistantsConfigSetup(config, assistantsEndpoint, prevConfig = {}) {
	const assistantsConfig = config.endpoints?.[assistantsEndpoint];
	const parsedConfig = assistantEndpointSchema.parse(assistantsConfig);
	if (assistantsConfig?.supportedIds?.length && assistantsConfig.excludedIds?.length) logger.warn(`Configuration conflict: The '${assistantsEndpoint}' endpoint has both 'supportedIds' and 'excludedIds' defined. The 'excludedIds' will be ignored.`);
	if (assistantsConfig?.privateAssistants && (assistantsConfig.supportedIds?.length || assistantsConfig.excludedIds?.length)) logger.warn(`Configuration conflict: The '${assistantsEndpoint}' endpoint has both 'privateAssistants' and 'supportedIds' or 'excludedIds' defined. The 'supportedIds' and 'excludedIds' will be ignored.`);
	return {
		...prevConfig,
		version: assistantsConfig?.version != null ? parsedConfig.version : prevConfig.version ?? parsedConfig.version,
		retrievalModels: parsedConfig.retrievalModels,
		disableBuilder: parsedConfig.disableBuilder,
		pollIntervalMs: parsedConfig.pollIntervalMs,
		supportedIds: parsedConfig.supportedIds,
		capabilities: parsedConfig.capabilities,
		excludedIds: parsedConfig.excludedIds,
		privateAssistants: parsedConfig.privateAssistants,
		timeoutMs: parsedConfig.timeoutMs,
		streamRate: parsedConfig.streamRate,
		titlePrompt: parsedConfig.titlePrompt,
		titleMethod: parsedConfig.titleMethod,
		titleModel: parsedConfig.titleModel,
		titleEndpoint: parsedConfig.titleEndpoint,
		titlePromptTemplate: parsedConfig.titlePromptTemplate
	};
}
//#endregion
//#region src/app/vertex.ts
/**
* Default Vertex AI models available through Google Cloud
* These are the standard Anthropic model names as served by Vertex AI
*/
const defaultVertexModels = [
	"claude-sonnet-4-6",
	"claude-3-7-sonnet-20250219",
	"claude-3-5-sonnet-v2@20241022",
	"claude-3-5-sonnet@20240620",
	"claude-3-5-haiku@20241022",
	"claude-3-opus@20240229",
	"claude-3-haiku@20240307"
];
/**
* Processes models configuration and creates deployment name mapping
* Similar to Azure's model mapping logic
* @param models - The models configuration (can be array or object)
* @param defaultDeploymentName - Optional default deployment name
* @returns Object containing modelNames array and modelDeploymentMap
*/
function processVertexModels(models, defaultDeploymentName) {
	const modelNames = [];
	const modelDeploymentMap = {};
	if (!models) {
		for (const model of defaultVertexModels) {
			modelNames.push(model);
			modelDeploymentMap[model] = model;
		}
		return {
			modelNames,
			modelDeploymentMap
		};
	}
	if (Array.isArray(models)) for (const modelName of models) {
		modelNames.push(modelName);
		modelDeploymentMap[modelName] = defaultDeploymentName || modelName;
	}
	else for (const [modelName, modelConfig] of Object.entries(models)) {
		modelNames.push(modelName);
		if (typeof modelConfig === "boolean") modelDeploymentMap[modelName] = defaultDeploymentName || modelName;
		else if (modelConfig?.deploymentName) modelDeploymentMap[modelName] = modelConfig.deploymentName;
		else modelDeploymentMap[modelName] = defaultDeploymentName || modelName;
	}
	return {
		modelNames,
		modelDeploymentMap
	};
}
/**
* Validates and processes Vertex AI configuration
* @param vertexConfig - The Vertex AI configuration object
* @returns Validated configuration with errors if any
*/
function validateVertexConfig(vertexConfig) {
	if (!vertexConfig) return null;
	const errors = [];
	const projectId = vertexConfig.projectId ? extractEnvVariable(vertexConfig.projectId) : void 0;
	const region = extractEnvVariable(vertexConfig.region || "us-east5");
	const serviceKeyFile = vertexConfig.serviceKeyFile ? extractEnvVariable(vertexConfig.serviceKeyFile) : void 0;
	const defaultDeploymentName = vertexConfig.deploymentName ? extractEnvVariable(vertexConfig.deploymentName) : void 0;
	if (projectId && envVarRegex.test(projectId)) errors.push(`Vertex AI projectId environment variable "${vertexConfig.projectId}" was not found.`);
	if (envVarRegex.test(region)) errors.push(`Vertex AI region environment variable "${vertexConfig.region}" was not found.`);
	if (serviceKeyFile && envVarRegex.test(serviceKeyFile)) errors.push(`Vertex AI serviceKeyFile environment variable "${vertexConfig.serviceKeyFile}" was not found.`);
	if (defaultDeploymentName && envVarRegex.test(defaultDeploymentName)) errors.push(`Vertex AI deploymentName environment variable "${vertexConfig.deploymentName}" was not found.`);
	const { modelNames, modelDeploymentMap } = processVertexModels(vertexConfig.models, defaultDeploymentName);
	const isValid = errors.length === 0;
	return {
		enabled: vertexConfig.enabled !== false,
		projectId,
		region,
		serviceKeyFile,
		deploymentName: defaultDeploymentName,
		models: vertexConfig.models,
		modelNames,
		modelDeploymentMap,
		isValid,
		errors
	};
}
/**
* Sets up the Vertex AI configuration from the config (`librechat.yaml`) file.
* Similar to azureConfigSetup, this processes and validates the Vertex AI configuration.
* @param config - The loaded custom configuration.
* @returns The validated Vertex AI configuration or null if not configured.
*/
function vertexConfigSetup(config) {
	const anthropicConfig = config.endpoints?.[EModelEndpoint.anthropic];
	if (!anthropicConfig?.vertex) return null;
	const vertexConfig = anthropicConfig.vertex;
	if (vertexConfig.enabled === false) return null;
	const validatedConfig = validateVertexConfig(vertexConfig);
	if (!validatedConfig) return null;
	if (!validatedConfig.isValid) {
		const errorMessage = "Invalid Vertex AI configuration:\n" + validatedConfig.errors.join("\n");
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}
	logger.info("Vertex AI configuration loaded successfully", {
		projectId: validatedConfig.projectId,
		region: validatedConfig.region,
		modelCount: validatedConfig.modelNames?.length || 0,
		models: validatedConfig.modelNames
	});
	return validatedConfig;
}
//#endregion
//#region src/app/azure.ts
/**
* Sets up the Azure OpenAI configuration from the config (`librechat.yaml`) file.
* @param config - The loaded custom configuration.
* @returns The Azure OpenAI configuration.
*/
function azureConfigSetup(config) {
	const azureConfig = config.endpoints?.[EModelEndpoint.azureOpenAI];
	if (!azureConfig) throw new Error("Azure OpenAI configuration is missing.");
	const { groups, ...azureConfiguration } = azureConfig;
	const { isValid, modelNames, modelGroupMap, groupMap, errors } = validateAzureGroups(groups);
	if (!isValid) {
		const errorMessage = "Invalid Azure OpenAI configuration:\n" + errors.join("\n");
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}
	const assistantModels = [];
	const assistantGroups = /* @__PURE__ */ new Set();
	for (const modelName of modelNames) {
		mapModelToAzureConfig({
			modelName,
			modelGroupMap,
			groupMap
		});
		const groupName = modelGroupMap?.[modelName]?.group;
		const modelGroup = groupMap?.[groupName];
		if (modelGroup?.assistants || modelGroup?.[modelName]?.assistants) {
			assistantModels.push(modelName);
			if (!assistantGroups.has(groupName)) assistantGroups.add(groupName);
		}
	}
	if (azureConfiguration.assistants && assistantModels.length === 0) throw new Error("No Azure models are configured to support assistants. Please remove the `assistants` field or configure at least one model to support assistants.");
	if (azureConfiguration.assistants && process.env.ENDPOINTS && !process.env.ENDPOINTS.includes(EModelEndpoint.azureAssistants)) logger.warn(`Azure Assistants are configured, but the endpoint will not be accessible as it's not included in the ENDPOINTS environment variable.
      Please add the value "${EModelEndpoint.azureAssistants}" to the ENDPOINTS list if expected.`);
	return {
		errors,
		isValid,
		groupMap,
		modelNames,
		modelGroupMap,
		assistantModels,
		assistantGroups: Array.from(assistantGroups),
		...azureConfiguration
	};
}
//#endregion
//#region src/app/endpoints.ts
/**
* Loads custom config endpoints
* @param [config]
* @param [agentsDefaults]
*/
const loadEndpoints = (config, agentsDefaults) => {
	const loadedEndpoints = {};
	const endpoints = config?.endpoints;
	if (endpoints?.[EModelEndpoint.azureOpenAI]) loadedEndpoints[EModelEndpoint.azureOpenAI] = azureConfigSetup(config);
	if (endpoints?.[EModelEndpoint.azureOpenAI]?.assistants) loadedEndpoints[EModelEndpoint.azureAssistants] = azureAssistantsDefaults();
	if (endpoints?.[EModelEndpoint.azureAssistants]) loadedEndpoints[EModelEndpoint.azureAssistants] = assistantsConfigSetup(config, EModelEndpoint.azureAssistants, loadedEndpoints[EModelEndpoint.azureAssistants]);
	if (endpoints?.[EModelEndpoint.assistants]) loadedEndpoints[EModelEndpoint.assistants] = assistantsConfigSetup(config, EModelEndpoint.assistants, loadedEndpoints[EModelEndpoint.assistants]);
	loadedEndpoints[EModelEndpoint.agents] = agentsConfigSetup(config, agentsDefaults);
	if (endpoints?.[EModelEndpoint.anthropic]) {
		const anthropicConfig = endpoints[EModelEndpoint.anthropic];
		const vertexConfig = vertexConfigSetup(config);
		loadedEndpoints[EModelEndpoint.anthropic] = {
			...anthropicConfig,
			...vertexConfig?.modelNames && { models: vertexConfig.modelNames },
			...vertexConfig && { vertexConfig }
		};
	}
	[
		EModelEndpoint.openAI,
		EModelEndpoint.google,
		EModelEndpoint.custom,
		EModelEndpoint.bedrock
	].forEach((key) => {
		const currentKey = key;
		if (endpoints?.[currentKey]) loadedEndpoints[currentKey] = endpoints[currentKey];
	});
	if (endpoints?.all)
 /**
	* `DeepPartial<TCustomConfig>` widens record values to `string | undefined`
	* (e.g. `headers`), so cast to the concrete endpoint type — mirrors the
	* `anthropicConfig as TAnthropicEndpoint` cast above.
	*/
	loadedEndpoints.all = endpoints.all;
	if (endpoints?.allowedAddresses) loadedEndpoints.allowedAddresses = endpoints.allowedAddresses;
	return loadedEndpoints;
};
//#endregion
//#region src/app/ocr.ts
function loadOCRConfig(config) {
	if (!config) return;
	const baseURL = config?.baseURL ?? "";
	return {
		apiKey: config?.apiKey ?? "",
		baseURL,
		mistralModel: config?.mistralModel ?? "",
		strategy: config?.strategy ?? OCRStrategy.MISTRAL_OCR
	};
}
//#endregion
//#region src/app/service.ts
function loadSummarizationConfig(config) {
	const raw = config.summarization;
	if (!raw || typeof raw !== "object") return;
	if (raw.trigger && typeof raw.trigger === "object" && raw.trigger.type === "token_count") {
		logger.warn("[AppService] `summarization.trigger.type: 'token_count'` is no longer supported. Use 'token_ratio' (0-1), 'remaining_tokens' (positive integer), or 'messages_to_refine' (positive integer). Your `summarization` config will be ignored and summarization will fall back to self-summarize defaults (the agent's own provider/model, fires on every pruning event) until this is corrected.");
		return;
	}
	const parsed = summarizationConfigSchema.safeParse(raw);
	if (!parsed.success) {
		logger.warn("[AppService] Invalid summarization config", parsed.error.flatten());
		return;
	}
	return {
		...parsed.data,
		enabled: parsed.data.enabled !== false
	};
}
function loadSkillSyncConfig(config) {
	const raw = config.skillSync;
	if (!raw || typeof raw !== "object") return;
	const parsed = skillSyncConfigSchema.safeParse(raw);
	if (!parsed.success) {
		logger.warn("[AppService] Invalid skill sync config", parsed.error.flatten());
		return;
	}
	return parsed.data;
}
/**
* Loads custom config and initializes app-wide variables.
* @function AppService
*/
const AppService = async (params) => {
	const { config, paths, systemTools } = params || {};
	if (!config) throw new Error("Config is required");
	const configDefaults = getConfigDefaults();
	const ocr = loadOCRConfig(config.ocr);
	const webSearch = loadWebSearchConfig(config.webSearch);
	const memory = loadMemoryConfig(config.memory);
	const summarization = loadSummarizationConfig(config);
	const skillSync = loadSkillSyncConfig(config);
	const filteredTools = config.filteredTools;
	const includedTools = config.includedTools;
	const fileStrategy = config.fileStrategy ?? configDefaults.fileStrategy;
	const startBalance = process.env.START_BALANCE;
	const balance = config.balance ?? {
		enabled: process.env.CHECK_BALANCE?.toLowerCase().trim() === "true",
		startBalance: startBalance ? parseInt(startBalance, 10) : void 0
	};
	const transactions = config.transactions ?? configDefaults.transactions;
	const imageOutputType = config?.imageOutputType ?? configDefaults.imageOutputType;
	process.env.CDN_PROVIDER = fileStrategy;
	const availableTools = systemTools;
	const mcpServersConfig = config.mcpServers || null;
	const mcpSettings = config.mcpSettings || null;
	const actions = config.actions;
	const registration = config.registration ?? configDefaults.registration;
	const interfaceConfig = await loadDefaultInterface({
		config,
		configDefaults
	});
	const turnstileConfig = loadTurnstileConfig(config, configDefaults);
	const defaultConfig = {
		ocr,
		paths,
		config,
		memory,
		speech: config.speech,
		actions,
		balance,
		skillSync,
		webSearch,
		mcpSettings,
		fileStrategy,
		registration,
		transactions,
		filteredTools,
		includedTools,
		messageFilter: config.messageFilter,
		summarization,
		availableTools,
		imageOutputType,
		interfaceConfig,
		turnstileConfig,
		mcpConfig: mcpServersConfig,
		fileStrategies: config.fileStrategies,
		cloudfront: config.cloudfront
	};
	const agentsDefaults = agentsConfigSetup(config);
	if (!Object.keys(config).length) return {
		...defaultConfig,
		endpoints: { [EModelEndpoint.agents]: agentsDefaults }
	};
	const loadedEndpoints = loadEndpoints(config, agentsDefaults);
	return {
		...defaultConfig,
		fileConfig: config?.fileConfig,
		secureImageLinks: config?.secureImageLinks,
		modelSpecs: processModelSpecs(config?.endpoints, config.modelSpecs, interfaceConfig),
		endpoints: loadedEndpoints
	};
};
//#endregion
//#region src/app/resolution.ts
const MAX_MERGE_DEPTH = 10;
const UNSAFE_KEYS = new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
const BASE_ONLY_OVERRIDE_SECTIONS = new Set(BASE_ONLY_CONFIG_SECTIONS);
/**
* Paths within the config tree where arrays of objects should be merged by
* a key field rather than replaced wholesale. `deepMerge` matches items by
* the given key, deep-merges matching pairs, preserves unmatched base items,
* and appends new override-only items.
*
* Paths use AppConfig key names (post-OVERRIDE_KEY_MAP remapping),
* not YAML-level key names. E.g. use `interfaceConfig.x`, not `interface.x`.
*/
const ARRAY_MERGE_KEYS = { "endpoints.custom": "name" };
/**
* Maps YAML-level override keys (TCustomConfig) to their AppConfig equivalents.
* Overrides are stored with YAML keys but merged into the already-processed AppConfig
* where some fields have been renamed by AppService.
*
* When AppService renames a field, add the mapping here. Map entries are
* type-checked: keys must be valid TCustomConfig fields, values must be
* valid AppConfig fields. The runtime lookup casts string keys to satisfy
* strict indexing — unknown keys safely fall through via the ?? fallback.
*/
const OVERRIDE_KEY_MAP = {
	mcpServers: "mcpConfig",
	interface: "interfaceConfig",
	turnstile: "turnstileConfig"
};
function isSafePath(path) {
	const segments = path.split(".");
	if (path.length === 0 || path.startsWith(".") || path.endsWith(".") || path.includes("..") || segments.some((segment) => segment.length === 0 || UNSAFE_KEYS.has(segment))) return false;
	return true;
}
function remapOverridePath(path) {
	const [first, ...rest] = path.split(".");
	return [OVERRIDE_KEY_MAP[first] ?? first, ...rest].join(".");
}
function deletePath(target, path) {
	if (!isSafePath(path)) return target;
	const segments = path.split(".");
	const result = { ...target };
	let cursor = result;
	for (let index = 0; index < segments.length - 1; index++) {
		const segment = segments[index];
		const value = cursor[segment];
		if (value == null || typeof value !== "object" || Array.isArray(value)) return result;
		const cloned = { ...value };
		cursor[segment] = cloned;
		cursor = cloned;
	}
	delete cursor[segments[segments.length - 1]];
	return result;
}
function mergeArrayByKey(target, source, keyField, depth, path) {
	const sourceByKey = /* @__PURE__ */ new Map();
	for (const item of source) if (item != null && typeof item === "object") {
		const key = item[keyField];
		if (key != null) sourceByKey.set(key, item);
	}
	const result = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of target) if (item != null && typeof item === "object") {
		const key = item[keyField];
		const override = key != null ? sourceByKey.get(key) : void 0;
		if (override) {
			result.push(deepMerge(item, override, depth + 1, path));
			seen.add(key);
		} else result.push({ ...item });
	} else result.push(item);
	for (const key of sourceByKey.keys()) if (!seen.has(key)) result.push(deepMerge({}, sourceByKey.get(key), depth + 1, path));
	return result;
}
function deepMerge(target, source, depth = 0, path = "") {
	const result = { ...target };
	for (const key of Object.keys(source)) {
		if (UNSAFE_KEYS.has(key)) continue;
		const currentPath = path ? `${path}.${key}` : key;
		const sourceVal = source[key];
		const targetVal = result[key];
		if (depth < MAX_MERGE_DEPTH && sourceVal != null && typeof sourceVal === "object" && !Array.isArray(sourceVal) && targetVal != null && typeof targetVal === "object" && !Array.isArray(targetVal)) result[key] = deepMerge(targetVal, sourceVal, depth + 1, currentPath);
		else if (depth < MAX_MERGE_DEPTH && Array.isArray(sourceVal) && Array.isArray(targetVal) && ARRAY_MERGE_KEYS[currentPath]) result[key] = mergeArrayByKey(targetVal, sourceVal, ARRAY_MERGE_KEYS[currentPath], depth, currentPath);
		else result[key] = sourceVal;
	}
	return result;
}
/**
* Merge DB config overrides into a base AppConfig.
*
* Configs are sorted by priority ascending (lowest first, highest wins).
* Each config's `overrides` is deep-merged into the base config in order.
*/
function mergeConfigOverrides(baseConfig, configs) {
	if (!configs || configs.length === 0) return baseConfig;
	const sorted = [...configs].sort((a, b) => a.priority - b.priority);
	let merged = { ...baseConfig };
	for (const config of sorted) {
		if (Array.isArray(config.tombstones)) {
			for (const path of config.tombstones) if (typeof path === "string") merged = deletePath(merged, remapOverridePath(path));
		}
		if (config.overrides && typeof config.overrides === "object") {
			const remapped = {};
			for (const [key, value] of Object.entries(config.overrides)) {
				if (BASE_ONLY_OVERRIDE_SECTIONS.has(key)) continue;
				const mappedKey = OVERRIDE_KEY_MAP[key] ?? key;
				if (key === "interface" && value != null && typeof value === "object" && !Array.isArray(value)) {
					const filtered = {};
					for (const [field, fieldVal] of Object.entries(value)) if (!INTERFACE_PERMISSION_FIELDS.has(field)) filtered[field] = fieldVal;
					else if (fieldVal != null && typeof fieldVal === "object" && !Array.isArray(fieldVal)) {
						const uiOnly = {};
						for (const [sub, subVal] of Object.entries(fieldVal)) if (!PERMISSION_SUB_KEYS.has(sub)) uiOnly[sub] = subVal;
						if (Object.keys(uiOnly).length > 0) filtered[field] = uiOnly;
					}
					if (Object.keys(filtered).length > 0) remapped[mappedKey] = filtered;
				} else remapped[mappedKey] = value;
			}
			merged = deepMerge(merged, remapped);
		}
	}
	return merged;
}
//#endregion
//#region src/common/enum.ts
/**
* Common role combinations. Values mirror unions of `PermissionBits` flags;
* literals are required by `--isolatedDeclarations` (cross-file enum refs
* aren't computable). The guard below fails fast on any drift.
*/
let RoleBits = /* @__PURE__ */ function(RoleBits) {
	/** VIEW */
	RoleBits[RoleBits["VIEWER"] = 1] = "VIEWER";
	/** VIEW | EDIT */
	RoleBits[RoleBits["EDITOR"] = 3] = "EDITOR";
	/** VIEW | EDIT | DELETE */
	RoleBits[RoleBits["MANAGER"] = 7] = "MANAGER";
	/** VIEW | EDIT | DELETE | SHARE */
	RoleBits[RoleBits["OWNER"] = 15] = "OWNER";
	return RoleBits;
}({});
if (1 !== PermissionBits.VIEW || 3 !== (PermissionBits.VIEW | PermissionBits.EDIT) || 7 !== (PermissionBits.VIEW | PermissionBits.EDIT | PermissionBits.DELETE) || 15 !== (PermissionBits.VIEW | PermissionBits.EDIT | PermissionBits.DELETE | PermissionBits.SHARE)) throw new Error("RoleBits is out of sync with PermissionBits");
//#endregion
//#region src/common/permissions.ts
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
const MAX_PERM_BITS = Object.values(PermissionBits).filter((v) => typeof v === "number").reduce((acc, v) => acc | v, 0);
/**
* Fails loudly at module load if `PermissionBits` is ever refactored to a
* `const` object, string enum, or all-string shape — any of those would make
* `Object.values(...).filter(isNumber)` return `[]`, producing
* `MAX_PERM_BITS === 0`. That would silently make the schema reject every
* non-zero write AND make `permissionBitSupersets` return `[0]` for every
* input, denying every permission check. Crashing at startup is strictly
* better than either silent failure mode.
*/
if (MAX_PERM_BITS === 0) throw new Error("MAX_PERM_BITS is 0 — `PermissionBits` did not yield any numeric members. This typically means the enum was refactored to a `const` object, a string enum, or an all-string shape; rewrite the reducer above to extract the numeric bits from the new shape, or give `permissionBitSupersets` an explicit bit-width parameter.");
/**
* `permissionBitSupersets` enumerates `[0, MAX_PERM_BITS]` — size `2^n` where
* `n` is the number of permission bits. At 4 bits that's 16 values; at 8 bits
* 256; at 16 bits 65,536. Above a few hundred the resulting `$in` list would
* degrade query plans and balloon document transfer, so fail loudly if the
* enum grows past a safe ceiling. Lifting this limit requires a different
* bit-matching strategy (e.g. `$expr` with `$bitAnd` where supported).
*/
if (MAX_PERM_BITS > 255) throw new Error(`MAX_PERM_BITS=${MAX_PERM_BITS} exceeds the $in-enumeration ceiling of 255. The current permissionBitSupersets approach would emit more than 256 candidates, degrading query plans. Replace the enumeration strategy before raising this limit.`);
//#endregion
//#region ../../node_modules/dotenv/package.json
var require_package = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"name": "dotenv",
		"version": "16.4.7",
		"description": "Loads environment variables from .env file",
		"main": "lib/main.js",
		"types": "lib/main.d.ts",
		"exports": {
			".": {
				"types": "./lib/main.d.ts",
				"require": "./lib/main.js",
				"default": "./lib/main.js"
			},
			"./config": "./config.js",
			"./config.js": "./config.js",
			"./lib/env-options": "./lib/env-options.js",
			"./lib/env-options.js": "./lib/env-options.js",
			"./lib/cli-options": "./lib/cli-options.js",
			"./lib/cli-options.js": "./lib/cli-options.js",
			"./package.json": "./package.json"
		},
		"scripts": {
			"dts-check": "tsc --project tests/types/tsconfig.json",
			"lint": "standard",
			"pretest": "npm run lint && npm run dts-check",
			"test": "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
			"test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
			"prerelease": "npm test",
			"release": "standard-version"
		},
		"repository": {
			"type": "git",
			"url": "git://github.com/motdotla/dotenv.git"
		},
		"funding": "https://dotenvx.com",
		"keywords": [
			"dotenv",
			"env",
			".env",
			"environment",
			"variables",
			"config",
			"settings"
		],
		"readmeFilename": "README.md",
		"license": "BSD-2-Clause",
		"devDependencies": {
			"@types/node": "^18.11.3",
			"decache": "^4.6.2",
			"sinon": "^14.0.1",
			"standard": "^17.0.0",
			"standard-version": "^9.5.0",
			"tap": "^19.2.0",
			"typescript": "^4.8.4"
		},
		"engines": { "node": ">=12" },
		"browser": { "fs": false }
	};
}));
//#endregion
//#region ../../node_modules/dotenv/lib/main.js
var require_main = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fs = __require("fs");
	const path$1 = __require("path");
	const os = __require("os");
	const crypto$1 = __require("crypto");
	const version = require_package().version;
	const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		const vaultPath = _vaultPath(options);
		const result = DotenvModule.configDotenv({ path: vaultPath });
		if (!result.parsed) {
			const err = /* @__PURE__ */ new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const attrs = _instructions(result, keys[i].trim());
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _log(message) {
		console.log(`[dotenv@${version}][INFO] ${message}`);
	}
	function _warn(message) {
		console.log(`[dotenv@${version}][WARN] ${message}`);
	}
	function _debug(message) {
		console.log(`[dotenv@${version}][DEBUG] ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = /* @__PURE__ */ new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) {
			for (const filepath of options.path) if (fs.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
		} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		else possibleVaultPath = path$1.resolve(process.cwd(), ".env.vault");
		if (fs.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path$1.join(os.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		_log("Loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path$1.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		const debug = Boolean(options && options.debug);
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("No encoding is specified. UTF-8 is used by default");
		let optionPaths = [dotenvPath];
		if (options && options.path) if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
		else {
			optionPaths = [];
			for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
		}
		let lastError;
		const parsedAll = {};
		for (const path of optionPaths) try {
			const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`Failed to load ${path} ${e.message}`);
			lastError = e;
		}
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsedAll, options);
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto$1.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = /* @__PURE__ */ new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		if (typeof parsed !== "object") {
			const err = /* @__PURE__ */ new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) processEnv[key] = parsed[key];
			if (debug) if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
			else _debug(`"${key}" is already defined and was NOT overwritten`);
		} else processEnv[key] = parsed[key];
	}
	const DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
}));
//#endregion
//#region ../../node_modules/dotenv/lib/env-options.js
var require_env_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const options = {};
	if (process.env.DOTENV_CONFIG_ENCODING != null) options.encoding = process.env.DOTENV_CONFIG_ENCODING;
	if (process.env.DOTENV_CONFIG_PATH != null) options.path = process.env.DOTENV_CONFIG_PATH;
	if (process.env.DOTENV_CONFIG_DEBUG != null) options.debug = process.env.DOTENV_CONFIG_DEBUG;
	if (process.env.DOTENV_CONFIG_OVERRIDE != null) options.override = process.env.DOTENV_CONFIG_OVERRIDE;
	if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
	module.exports = options;
}));
//#endregion
//#region ../../node_modules/dotenv/lib/cli-options.js
var require_cli_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const re = /^dotenv_config_(encoding|path|debug|override|DOTENV_KEY)=(.+)$/;
	module.exports = function optionMatcher(args) {
		return args.reduce(function(acc, cur) {
			const matches = cur.match(re);
			if (matches) acc[matches[1]] = matches[2];
			return acc;
		}, {});
	};
}));
//#endregion
//#region ../../node_modules/dotenv/config.js
(function() {
	require_main().config(Object.assign({}, require_env_options(), require_cli_options()(process.argv)));
})();
//#endregion
//#region src/crypto/index.ts
const { webcrypto } = crypto;
/** Use hex decoding for both key and IV for legacy methods */
const key = Buffer.from(process.env.CREDS_KEY ?? "", "hex");
const iv = Buffer.from(process.env.CREDS_IV ?? "", "hex");
const algorithm = "AES-CBC";
async function signPayload({ payload, secret, expirationTime }) {
	return jwt.sign(payload, secret, { expiresIn: expirationTime });
}
async function hashToken(str) {
	const data = new TextEncoder().encode(str);
	const hashBuffer = await webcrypto.subtle.digest("SHA-256", data);
	return Buffer.from(hashBuffer).toString("hex");
}
/** --- Legacy v1/v2 Setup: AES-CBC with fixed key and IV --- */
/**
* Encrypts a value using AES-CBC
* @param value - The plaintext to encrypt
* @returns The encrypted string in hex format
*/
async function encrypt(value) {
	const cryptoKey = await webcrypto.subtle.importKey("raw", key, { name: algorithm }, false, ["encrypt"]);
	const data = new TextEncoder().encode(value);
	const encryptedBuffer = await webcrypto.subtle.encrypt({
		name: algorithm,
		iv
	}, cryptoKey, data);
	return Buffer.from(encryptedBuffer).toString("hex");
}
/**
* Decrypts an encrypted value using AES-CBC
* @param encryptedValue - The encrypted string in hex format
* @returns The decrypted plaintext
*/
async function decrypt(encryptedValue) {
	const cryptoKey = await webcrypto.subtle.importKey("raw", key, { name: algorithm }, false, ["decrypt"]);
	const encryptedBuffer = Buffer.from(encryptedValue, "hex");
	const decryptedBuffer = await webcrypto.subtle.decrypt({
		name: algorithm,
		iv
	}, cryptoKey, encryptedBuffer);
	return new TextDecoder().decode(decryptedBuffer);
}
/** --- v2: AES-CBC with a random IV per encryption --- */
/**
* Encrypts a value using AES-CBC with a random IV per encryption
* @param value - The plaintext to encrypt
* @returns The encrypted string with IV prepended (iv:ciphertext format)
*/
async function encryptV2(value) {
	const gen_iv = webcrypto.getRandomValues(new Uint8Array(16));
	const cryptoKey = await webcrypto.subtle.importKey("raw", key, { name: algorithm }, false, ["encrypt"]);
	const data = new TextEncoder().encode(value);
	const encryptedBuffer = await webcrypto.subtle.encrypt({
		name: algorithm,
		iv: gen_iv
	}, cryptoKey, data);
	return Buffer.from(gen_iv).toString("hex") + ":" + Buffer.from(encryptedBuffer).toString("hex");
}
/**
* Decrypts an encrypted value using AES-CBC with random IV
* @param encryptedValue - The encrypted string in iv:ciphertext format
* @returns The decrypted plaintext
*/
async function decryptV2(encryptedValue) {
	const parts = encryptedValue.split(":");
	if (parts.length === 1) return parts[0];
	const gen_iv = Buffer.from(parts.shift() ?? "", "hex");
	const encrypted = parts.join(":");
	const cryptoKey = await webcrypto.subtle.importKey("raw", key, { name: algorithm }, false, ["decrypt"]);
	const encryptedBuffer = Buffer.from(encrypted, "hex");
	const decryptedBuffer = await webcrypto.subtle.decrypt({
		name: algorithm,
		iv: gen_iv
	}, cryptoKey, encryptedBuffer);
	return new TextDecoder().decode(decryptedBuffer);
}
/** --- v3: AES-256-CTR using Node's crypto functions --- */
const algorithm_v3 = "aes-256-ctr";
/**
* Encrypts a value using AES-256-CTR.
* Note: AES-256 requires a 32-byte key. Ensure that process.env.CREDS_KEY is a 64-character hex string.
* @param value - The plaintext to encrypt.
* @returns The encrypted string with a "v3:" prefix.
*/
function encryptV3(value) {
	if (key.length !== 32) throw new Error(`Invalid key length: expected 32 bytes, got ${key.length} bytes`);
	const iv_v3 = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm_v3, key, iv_v3);
	const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
	return `v3:${iv_v3.toString("hex")}:${encrypted.toString("hex")}`;
}
/**
* Decrypts an encrypted value using AES-256-CTR.
* @param encryptedValue - The encrypted string with "v3:" prefix.
* @returns The decrypted plaintext.
*/
function decryptV3(encryptedValue) {
	const parts = encryptedValue.split(":");
	if (parts[0] !== "v3") throw new Error("Not a v3 encrypted value");
	const iv_v3 = Buffer.from(parts[1], "hex");
	const encryptedText = Buffer.from(parts.slice(2).join(":"), "hex");
	const decipher = crypto.createDecipheriv(algorithm_v3, key, iv_v3);
	return Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString("utf8");
}
/**
* Generates random values as a hex string
* @param length - The number of random bytes to generate
* @returns The random values as a hex string
*/
async function getRandomValues(length) {
	if (!Number.isInteger(length) || length <= 0) throw new Error("Length must be a positive integer");
	const randomValues = new Uint8Array(length);
	webcrypto.getRandomValues(randomValues);
	return Buffer.from(randomValues).toString("hex");
}
/**
* Computes SHA-256 hash for the given input.
* @param input - The input to hash.
* @returns The SHA-256 hash of the input.
*/
async function hashBackupCode(input) {
	const data = new TextEncoder().encode(input);
	const hashBuffer = await webcrypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
//#endregion
//#region src/schema/action.ts
const AuthSchema = new Schema({
	authorization_type: { type: String },
	custom_auth_header: { type: String },
	type: {
		type: String,
		enum: [
			"service_http",
			"oauth",
			"none"
		]
	},
	authorization_content_type: { type: String },
	authorization_url: { type: String },
	client_url: { type: String },
	scope: { type: String },
	token_exchange_method: {
		type: String,
		enum: [
			"default_post",
			"basic_auth_header",
			null
		]
	}
}, { _id: false });
const Action = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		index: true,
		required: true
	},
	action_id: {
		type: String,
		index: true,
		required: true
	},
	type: {
		type: String,
		default: "action_prototype"
	},
	settings: Schema.Types.Mixed,
	agent_id: String,
	assistant_id: String,
	metadata: {
		api_key: String,
		auth: AuthSchema,
		domain: {
			type: String,
			required: true
		},
		privacy_policy_url: String,
		raw_spec: String,
		oauth_client_id: String,
		oauth_client_secret: String
	},
	tenantId: {
		type: String,
		index: true
	}
});
//#endregion
//#region src/schema/agent.ts
const agentSchema = new Schema({
	id: {
		type: String,
		required: true
	},
	name: { type: String },
	description: { type: String },
	instructions: { type: String },
	avatar: {
		type: Schema.Types.Mixed,
		default: void 0
	},
	provider: {
		type: String,
		required: true
	},
	model: {
		type: String,
		required: true
	},
	model_parameters: { type: Object },
	artifacts: { type: String },
	access_level: { type: Number },
	recursion_limit: { type: Number },
	tools: {
		type: [String],
		default: void 0
	},
	skills: {
		type: [String],
		default: void 0
	},
	skills_enabled: {
		type: Boolean,
		default: void 0
	},
	tool_kwargs: { type: [{ type: Schema.Types.Mixed }] },
	actions: {
		type: [String],
		default: void 0
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	authorName: {
		type: String,
		default: void 0
	},
	hide_sequential_outputs: { type: Boolean },
	end_after_tools: { type: Boolean },
	/** @deprecated Use edges instead */
	agent_ids: { type: [String] },
	edges: {
		type: [{ type: Schema.Types.Mixed }],
		default: []
	},
	conversation_starters: {
		type: [String],
		default: []
	},
	tool_resources: {
		type: Schema.Types.Mixed,
		default: {}
	},
	versions: {
		type: [Schema.Types.Mixed],
		default: []
	},
	category: {
		type: String,
		trim: true,
		index: true,
		default: "general"
	},
	support_contact: {
		type: Schema.Types.Mixed,
		default: void 0
	},
	is_promoted: {
		type: Boolean,
		default: false,
		index: true
	},
	/** MCP server names extracted from tools for efficient querying */
	mcpServerNames: {
		type: [String],
		default: [],
		index: true
	},
	/** Per-tool configuration (defer_loading, allowed_callers) */
	tool_options: {
		type: Schema.Types.Mixed,
		default: void 0
	},
	/** Subagent spawning configuration — isolated-context child agents. */
	subagents: {
		type: Schema.Types.Mixed,
		default: void 0
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
agentSchema.index({
	id: 1,
	tenantId: 1
}, { unique: true });
agentSchema.index({
	updatedAt: -1,
	_id: 1
});
agentSchema.index({ "edges.to": 1 });
//#endregion
//#region src/schema/agentApiKey.ts
const agentApiKeySchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true
	},
	name: {
		type: String,
		required: true,
		trim: true,
		maxlength: 100
	},
	keyHash: {
		type: String,
		required: true,
		select: false,
		index: true
	},
	keyPrefix: {
		type: String,
		required: true,
		index: true
	},
	lastUsedAt: { type: Date },
	expiresAt: { type: Date },
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
agentApiKeySchema.index({
	userId: 1,
	name: 1,
	tenantId: 1
});
/**
* TTL index for automatic cleanup of expired keys.
* MongoDB deletes documents when expiresAt passes (expireAfterSeconds: 0 means immediate).
* Note: Expired keys are permanently removed, not soft-deleted.
* If audit trails are needed, remove this index and check expiration programmatically.
*/
agentApiKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//#endregion
//#region src/schema/agentCategory.ts
const agentCategorySchema = new Schema({
	value: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		index: true
	},
	label: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		trim: true,
		default: ""
	},
	order: {
		type: Number,
		default: 0,
		index: true
	},
	isActive: {
		type: Boolean,
		default: true,
		index: true
	},
	custom: {
		type: Boolean,
		default: false
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
agentCategorySchema.index({
	value: 1,
	tenantId: 1
}, { unique: true });
agentCategorySchema.index({
	isActive: 1,
	order: 1
});
agentCategorySchema.index({
	order: 1,
	label: 1
});
//#endregion
//#region src/schema/assistant.ts
const assistantSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	assistant_id: {
		type: String,
		index: true,
		required: true
	},
	avatar: {
		type: Schema.Types.Mixed,
		default: void 0
	},
	conversation_starters: {
		type: [String],
		default: []
	},
	access_level: { type: Number },
	file_ids: {
		type: [String],
		default: void 0
	},
	actions: {
		type: [String],
		default: void 0
	},
	append_current_datetime: {
		type: Boolean,
		default: false
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
//#endregion
//#region src/schema/balance.ts
const balanceSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		index: true,
		required: true
	},
	tokenCredits: {
		type: Number,
		default: 0
	},
	autoRefillEnabled: {
		type: Boolean,
		default: false
	},
	refillIntervalValue: {
		type: Number,
		default: 30
	},
	refillIntervalUnit: {
		type: String,
		enum: REFILL_INTERVAL_UNITS,
		default: "days"
	},
	lastRefill: {
		type: Date,
		default: Date.now
	},
	refillAmount: {
		type: Number,
		default: 0
	},
	tenantId: {
		type: String,
		index: true
	}
});
//#endregion
//#region src/schema/banner.ts
const bannerSchema = new Schema({
	bannerId: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	displayFrom: {
		type: Date,
		required: true,
		default: Date.now
	},
	displayTo: { type: Date },
	type: {
		type: String,
		enum: ["banner", "popup"],
		default: "banner"
	},
	isPublic: {
		type: Boolean,
		default: false
	},
	persistable: {
		type: Boolean,
		default: false
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
//#endregion
//#region src/schema/categories.ts
const categoriesSchema = new Schema({
	label: {
		type: String,
		required: true
	},
	value: {
		type: String,
		required: true
	},
	tenantId: {
		type: String,
		index: true
	}
});
categoriesSchema.index({
	label: 1,
	tenantId: 1
}, { unique: true });
categoriesSchema.index({
	value: 1,
	tenantId: 1
}, { unique: true });
//#endregion
//#region src/schema/chatProject.ts
const chatProjectSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		maxlength: 100,
		index: true
	},
	description: {
		type: String,
		default: "",
		trim: true,
		maxlength: 1e3
	},
	user: {
		type: String,
		required: true,
		index: true
	},
	conversationCount: {
		type: Number,
		default: 0,
		min: 0
	},
	lastConversationAt: {
		type: Date,
		default: null,
		index: true
	},
	lastConversationId: {
		type: String,
		default: null
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
chatProjectSchema.index({
	user: 1,
	name: 1,
	_id: 1
});
chatProjectSchema.index({
	user: 1,
	createdAt: -1,
	_id: -1
});
chatProjectSchema.index({
	user: 1,
	lastConversationAt: -1,
	_id: -1
});
//#endregion
//#region src/schema/conversationTag.ts
const conversationTag = new Schema({
	tag: {
		type: String,
		index: true
	},
	user: {
		type: String,
		index: true
	},
	description: {
		type: String,
		index: true
	},
	count: {
		type: Number,
		default: 0
	},
	position: {
		type: Number,
		default: 0,
		index: true
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
conversationTag.index({
	tag: 1,
	user: 1,
	tenantId: 1
}, { unique: true });
//#endregion
//#region src/schema/defaults.ts
const conversationPreset = {
	endpoint: {
		type: String,
		default: null,
		required: true
	},
	endpointType: { type: String },
	model: {
		type: String,
		required: false
	},
	region: {
		type: String,
		required: false
	},
	chatGptLabel: {
		type: String,
		required: false
	},
	examples: {
		type: [{ type: Schema.Types.Mixed }],
		default: void 0
	},
	modelLabel: {
		type: String,
		required: false
	},
	promptPrefix: {
		type: String,
		required: false
	},
	temperature: {
		type: Number,
		required: false
	},
	top_p: {
		type: Number,
		required: false
	},
	topP: {
		type: Number,
		required: false
	},
	topK: {
		type: Number,
		required: false
	},
	maxOutputTokens: {
		type: Number,
		required: false
	},
	maxTokens: {
		type: Number,
		required: false
	},
	presence_penalty: {
		type: Number,
		required: false
	},
	frequency_penalty: {
		type: Number,
		required: false
	},
	file_ids: {
		type: [{ type: String }],
		default: void 0
	},
	resendImages: { type: Boolean },
	promptCache: { type: Boolean },
	promptCacheTtl: { type: String },
	thinking: { type: Boolean },
	thinkingBudget: { type: Number },
	thinkingLevel: { type: String },
	effort: { type: String },
	system: { type: String },
	resendFiles: { type: Boolean },
	imageDetail: { type: String },
	agent_id: { type: String },
	assistant_id: { type: String },
	instructions: { type: String },
	stop: {
		type: [{ type: String }],
		default: void 0
	},
	isArchived: {
		type: Boolean,
		default: false
	},
	iconURL: { type: String },
	greeting: { type: String },
	spec: { type: String },
	tags: {
		type: [String],
		default: []
	},
	tools: {
		type: [{ type: String }],
		default: void 0
	},
	maxContextTokens: { type: Number },
	max_tokens: { type: Number },
	useResponsesApi: { type: Boolean },
	/** OpenAI Responses API / Anthropic API / Google API */
	web_search: { type: Boolean },
	/** Google API: URL Context tool (+ native YouTube video understanding) */
	url_context: { type: Boolean },
	disableStreaming: { type: Boolean },
	fileTokenLimit: { type: Number },
	/** Reasoning models only */
	reasoning_effort: { type: String },
	reasoning_summary: { type: String },
	/** Verbosity control */
	verbosity: { type: String }
};
//#endregion
//#region src/schema/convo.ts
const convoSchema = new Schema({
	conversationId: {
		type: String,
		required: true,
		index: true,
		meiliIndex: true
	},
	title: {
		type: String,
		default: "New Chat",
		meiliIndex: true
	},
	user: {
		type: String,
		index: true,
		meiliIndex: true
	},
	messages: [{
		type: Schema.Types.ObjectId,
		ref: "Message"
	}],
	isTemporary: {
		type: Boolean,
		default: false
	},
	...conversationPreset,
	agent_id: { type: String },
	tags: {
		type: [String],
		default: [],
		meiliIndex: true
	},
	chatProjectId: {
		type: String,
		default: null,
		index: true
	},
	files: { type: [String] },
	expiredAt: { type: Date },
	tenantId: {
		type: String,
		index: true
	},
	pinned: { type: Boolean }
}, { timestamps: true });
convoSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
convoSchema.index({
	createdAt: 1,
	updatedAt: 1
});
convoSchema.index({
	conversationId: 1,
	user: 1,
	tenantId: 1
}, { unique: true });
convoSchema.index({
	user: 1,
	chatProjectId: 1,
	updatedAt: -1,
	_id: -1
});
convoSchema.index({
	user: 1,
	chatProjectId: 1,
	createdAt: -1,
	_id: -1
});
convoSchema.index({
	user: 1,
	isTemporary: 1,
	expiredAt: 1
});
convoSchema.index({
	_meiliIndex: 1,
	isTemporary: 1,
	expiredAt: 1
});
//#endregion
//#region src/schema/file.ts
const file = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		index: true,
		required: true
	},
	conversationId: {
		type: String,
		ref: "Conversation",
		index: true
	},
	messageId: {
		type: String,
		index: true
	},
	file_id: {
		type: String,
		index: true,
		required: true
	},
	temp_file_id: { type: String },
	bytes: {
		type: Number,
		required: true
	},
	filename: {
		type: String,
		required: true
	},
	filepath: {
		type: String,
		required: true
	},
	storageKey: { type: String },
	storageRegion: { type: String },
	object: {
		type: String,
		required: true,
		default: "file"
	},
	embedded: { type: Boolean },
	type: {
		type: String,
		required: true
	},
	text: { type: String },
	textFormat: {
		type: String,
		enum: ["html", "text"]
	},
	status: {
		type: String,
		enum: [
			"pending",
			"ready",
			"failed"
		],
		index: true
	},
	previewError: {
		type: String,
		maxlength: 200
	},
	previewRevision: { type: String },
	context: { type: String },
	usage: {
		type: Number,
		required: true,
		default: 0
	},
	source: {
		type: String,
		default: FileSources.local
	},
	model: { type: String },
	width: Number,
	height: Number,
	metadata: { codeEnvRef: {
		type: new Schema({
			kind: {
				type: String,
				enum: [
					"skill",
					"agent",
					"user"
				],
				required: true
			},
			id: {
				type: String,
				required: true
			},
			storage_session_id: {
				type: String,
				required: true
			},
			file_id: {
				type: String,
				required: true
			},
			version: { type: Number }
		}, { _id: false }),
		default: void 0
	} },
	expiresAt: {
		type: Date,
		expires: 3600
	},
	tenantId: {
		type: String,
		index: true
	},
	expiredAt: { type: Date }
}, { timestamps: true });
file.index({ expiredAt: 1 });
file.index({
	createdAt: 1,
	updatedAt: 1
});
file.index({
	filename: 1,
	conversationId: 1,
	context: 1,
	tenantId: 1
}, {
	unique: true,
	partialFilterExpression: { context: FileContext.execute_code }
});
//#endregion
//#region src/schema/key.ts
const keySchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	name: {
		type: String,
		required: true
	},
	value: {
		type: String,
		required: true
	},
	expiresAt: { type: Date },
	tenantId: {
		type: String,
		index: true
	}
});
keySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//#endregion
//#region src/schema/message.ts
const messageSchema = new Schema({
	messageId: {
		type: String,
		required: true,
		index: true,
		meiliIndex: true
	},
	conversationId: {
		type: String,
		index: true,
		required: true,
		meiliIndex: true
	},
	user: {
		type: String,
		index: true,
		required: true,
		default: null,
		meiliIndex: true
	},
	model: {
		type: String,
		default: null
	},
	endpoint: { type: String },
	conversationSignature: { type: String },
	clientId: { type: String },
	invocationId: { type: Number },
	parentMessageId: { type: String },
	tokenCount: { type: Number },
	summaryTokenCount: { type: Number },
	sender: {
		type: String,
		meiliIndex: true
	},
	text: {
		type: String,
		meiliIndex: true
	},
	summary: { type: String },
	isCreatedByUser: {
		type: Boolean,
		required: true,
		default: false
	},
	isTemporary: {
		type: Boolean,
		default: false
	},
	unfinished: {
		type: Boolean,
		default: false
	},
	error: {
		type: Boolean,
		default: false
	},
	finish_reason: { type: String },
	feedback: {
		type: {
			rating: {
				type: String,
				enum: ["thumbsUp", "thumbsDown"],
				required: true
			},
			tag: {
				type: mongoose.Schema.Types.Mixed,
				required: false
			},
			text: {
				type: String,
				required: false
			}
		},
		default: void 0,
		required: false
	},
	_meiliIndex: {
		type: Boolean,
		required: false,
		select: false,
		default: false
	},
	files: {
		type: [{ type: mongoose.Schema.Types.Mixed }],
		default: void 0
	},
	content: {
		type: [{ type: mongoose.Schema.Types.Mixed }],
		default: void 0,
		meiliIndex: true
	},
	thread_id: { type: String },
	iconURL: { type: String },
	metadata: { type: mongoose.Schema.Types.Mixed },
	contextMeta: {
		type: {
			calibrationRatio: { type: Number },
			encoding: { type: String }
		},
		_id: false,
		default: void 0
	},
	attachments: {
		type: [{ type: mongoose.Schema.Types.Mixed }],
		default: void 0
	},
	/**
	* Skill names the user invoked manually via the `$` popover on this turn.
	* UI metadata only — `SkillPills` on the frontend renders these on
	* the user message bubble so the selection persists through reload and
	* shows in history. Runtime skill resolution lives separately on the
	* request body, not on the message itself.
	*/
	manualSkills: {
		type: [String],
		default: void 0
	},
	/**
	* Skill names auto-primed on this turn because their frontmatter declares
	* `always-apply: true`. Persisted at turn time (not reconstructed on
	* render) because `Skill.alwaysApply` is mutable — if an admin flips the
	* flag off later, historical turns must still show the pinned badges on
	* the user bubble to preserve the audit trail of what actually ran.
	*/
	alwaysAppliedSkills: {
		type: [String],
		default: void 0
	},
	/**
	* Verbatim excerpts the user quoted (via the "Add to chat" selection
	* popup) to reference on this turn. UI metadata only — `MessageQuotes`
	* renders these on the user bubble so the references persist through
	* reload and history. The excerpts are merged into the user message text
	* sent to the model at request time (counted in the user message token
	* count), so they are not duplicated into the stored `text`.
	*/
	quotes: {
		type: [String],
		default: void 0
	},
	expiredAt: { type: Date },
	addedConvo: {
		type: Boolean,
		default: void 0
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
messageSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
messageSchema.index({ createdAt: 1 });
messageSchema.index({
	messageId: 1,
	user: 1,
	tenantId: 1
}, { unique: true });
messageSchema.index({
	_meiliIndex: 1,
	isTemporary: 1,
	expiredAt: 1
});
//#endregion
//#region src/schema/pluginAuth.ts
const pluginAuthSchema = new Schema({
	authField: {
		type: String,
		required: true
	},
	value: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	pluginKey: { type: String },
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
//#endregion
//#region src/schema/preset.ts
const presetSchema = new Schema({
	presetId: {
		type: String,
		required: true,
		index: true
	},
	title: {
		type: String,
		default: "New Chat",
		meiliIndex: true
	},
	user: {
		type: String,
		default: null
	},
	defaultPreset: { type: Boolean },
	order: { type: Number },
	...conversationPreset,
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
presetSchema.index({
	presetId: 1,
	tenantId: 1
}, { unique: true });
//#endregion
//#region src/schema/prompt.ts
const promptSchema = new Schema({
	groupId: {
		type: Schema.Types.ObjectId,
		ref: "PromptGroup",
		required: true,
		index: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true
	},
	prompt: {
		type: String,
		required: true
	},
	type: {
		type: String,
		enum: ["text", "chat"],
		required: true
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
promptSchema.index({
	createdAt: 1,
	updatedAt: 1
});
//#endregion
//#region src/schema/promptGroup.ts
const promptGroupSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: true
	},
	numberOfGenerations: {
		type: Number,
		default: 0
	},
	oneliner: {
		type: String,
		default: ""
	},
	category: {
		type: String,
		default: "",
		index: true
	},
	productionId: {
		type: Schema.Types.ObjectId,
		ref: "Prompt",
		required: true,
		index: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true
	},
	authorName: {
		type: String,
		required: true
	},
	command: {
		type: String,
		index: true,
		validate: {
			validator: function(v) {
				return v === void 0 || v === null || v === "" || /^[a-z0-9-]+$/.test(v);
			},
			message: (props) => `${props?.value ?? "Value"} is not a valid command. Only lowercase alphanumeric characters and hyphens are allowed.`
		},
		maxlength: [Constants.COMMANDS_MAX_LENGTH, `Command cannot be longer than ${Constants.COMMANDS_MAX_LENGTH} characters`]
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
promptGroupSchema.index({
	numberOfGenerations: -1,
	updatedAt: -1,
	_id: 1
});
//#endregion
//#region src/schema/role.ts
/**
* Uses a sub-schema for permissions. Notice we disable `_id` for this subdocument.
*/
const rolePermissionsSchema = new Schema({
	[PermissionTypes.BOOKMARKS]: { [Permissions.USE]: { type: Boolean } },
	[PermissionTypes.PROMPTS]: {
		[Permissions.USE]: { type: Boolean },
		[Permissions.CREATE]: { type: Boolean },
		[Permissions.SHARE]: { type: Boolean },
		[Permissions.SHARE_PUBLIC]: { type: Boolean }
	},
	[PermissionTypes.MEMORIES]: {
		[Permissions.USE]: { type: Boolean },
		[Permissions.CREATE]: { type: Boolean },
		[Permissions.UPDATE]: { type: Boolean },
		[Permissions.READ]: { type: Boolean },
		[Permissions.OPT_OUT]: { type: Boolean }
	},
	[PermissionTypes.AGENTS]: {
		[Permissions.USE]: { type: Boolean },
		[Permissions.CREATE]: { type: Boolean },
		[Permissions.SHARE]: { type: Boolean },
		[Permissions.SHARE_PUBLIC]: { type: Boolean }
	},
	[PermissionTypes.MULTI_CONVO]: { [Permissions.USE]: { type: Boolean } },
	[PermissionTypes.TEMPORARY_CHAT]: { [Permissions.USE]: { type: Boolean } },
	[PermissionTypes.RUN_CODE]: { [Permissions.USE]: { type: Boolean } },
	[PermissionTypes.WEB_SEARCH]: { [Permissions.USE]: { type: Boolean } },
	[PermissionTypes.PEOPLE_PICKER]: {
		[Permissions.VIEW_USERS]: { type: Boolean },
		[Permissions.VIEW_GROUPS]: { type: Boolean },
		[Permissions.VIEW_ROLES]: { type: Boolean }
	},
	[PermissionTypes.MARKETPLACE]: { [Permissions.USE]: { type: Boolean } },
	[PermissionTypes.FILE_SEARCH]: { [Permissions.USE]: { type: Boolean } },
	[PermissionTypes.FILE_CITATIONS]: { [Permissions.USE]: { type: Boolean } },
	[PermissionTypes.MCP_SERVERS]: {
		[Permissions.USE]: { type: Boolean },
		[Permissions.CREATE]: { type: Boolean },
		[Permissions.SHARE]: { type: Boolean },
		[Permissions.SHARE_PUBLIC]: { type: Boolean },
		[Permissions.CONFIGURE_OBO]: { type: Boolean }
	},
	[PermissionTypes.REMOTE_AGENTS]: {
		[Permissions.USE]: { type: Boolean },
		[Permissions.CREATE]: { type: Boolean },
		[Permissions.SHARE]: { type: Boolean },
		[Permissions.SHARE_PUBLIC]: { type: Boolean }
	},
	[PermissionTypes.SKILLS]: {
		[Permissions.USE]: { type: Boolean },
		[Permissions.CREATE]: { type: Boolean },
		[Permissions.SHARE]: { type: Boolean },
		[Permissions.SHARE_PUBLIC]: { type: Boolean }
	},
	[PermissionTypes.SHARED_LINKS]: {
		[Permissions.CREATE]: { type: Boolean },
		[Permissions.SHARE]: { type: Boolean },
		[Permissions.SHARE_PUBLIC]: { type: Boolean }
	}
}, { _id: false });
const roleSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: true
	},
	description: {
		type: String,
		default: ""
	},
	permissions: { type: rolePermissionsSchema },
	tenantId: {
		type: String,
		index: true
	}
});
roleSchema.index({
	name: 1,
	tenantId: 1
}, { unique: true });
//#endregion
//#region src/schema/session.ts
const sessionSchema = new Schema({
	refreshTokenHash: {
		type: String,
		required: true
	},
	expiration: {
		type: Date,
		required: true,
		expires: 0
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	tenantId: {
		type: String,
		index: true
	}
});
//#endregion
//#region src/schema/share.ts
/**
* Immutable file snapshot embedded on a shared link. Captures the metadata the
* share-scoped file routes need to stream/preview each referenced file without
* consulting the original owner's live file ACL. References the original stored
* object (no byte copy).
*/
const fileSnapshotSchema = new Schema({
	file_id: {
		type: String,
		required: true
	},
	source: { type: String },
	storageKey: { type: String },
	filepath: { type: String },
	type: { type: String },
	filename: { type: String },
	bytes: { type: Number },
	width: { type: Number },
	height: { type: Number },
	model: { type: String },
	previewRevision: { type: String },
	tenantId: { type: String }
}, { _id: false });
const shareSchema = new Schema({
	conversationId: {
		type: String,
		required: true
	},
	title: {
		type: String,
		index: true
	},
	user: {
		type: String,
		index: true
	},
	messages: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Message"
	}],
	shareId: {
		type: String,
		index: true
	},
	targetMessageId: {
		type: String,
		required: false,
		index: true
	},
	tenantId: {
		type: String,
		index: true
	},
	expiredAt: { type: Date },
	snapshotFiles: { type: Boolean },
	fileSnapshots: {
		type: [fileSnapshotSchema],
		default: void 0
	}
}, { timestamps: true });
shareSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
shareSchema.index({
	conversationId: 1,
	user: 1,
	targetMessageId: 1,
	tenantId: 1
});
//#endregion
//#region src/schema/skillSyncCredential.ts
const skillSyncCredentialSchema = new Schema({
	provider: {
		type: String,
		enum: ["github"],
		required: true,
		index: true
	},
	credentialKey: {
		type: String,
		required: true,
		maxlength: 64,
		match: /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
		index: true
	},
	encryptedToken: {
		type: String,
		required: true,
		select: false
	},
	tokenHash: {
		type: String,
		required: true,
		select: false
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	updatedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
}, { timestamps: true });
skillSyncCredentialSchema.index({
	provider: 1,
	credentialKey: 1
}, { unique: true });
//#endregion
//#region src/schema/skillSyncStatus.ts
const skillSyncStatusSchema = new Schema({
	provider: {
		type: String,
		enum: ["github"],
		required: true,
		index: true
	},
	sourceId: {
		type: String,
		required: true,
		maxlength: 128,
		index: true
	},
	tenantId: {
		type: String,
		index: true
	},
	status: {
		type: String,
		enum: [
			"idle",
			"running",
			"succeeded",
			"failed",
			"skipped"
		],
		default: "idle",
		required: true
	},
	credentialKey: { type: String },
	owner: { type: String },
	repo: { type: String },
	ref: { type: String },
	paths: {
		type: [String],
		default: void 0
	},
	startedAt: { type: Date },
	finishedAt: { type: Date },
	lastSuccessAt: { type: Date },
	lastFailureAt: { type: Date },
	errorCode: { type: String },
	errorMessage: { type: String },
	syncedSkillCount: {
		type: Number,
		default: 0,
		min: 0
	},
	syncedFileCount: {
		type: Number,
		default: 0,
		min: 0
	},
	deletedSkillCount: {
		type: Number,
		default: 0,
		min: 0
	},
	deletedFileCount: {
		type: Number,
		default: 0,
		min: 0
	},
	lockOwner: { type: String },
	lockExpiresAt: {
		type: Date,
		index: true
	}
}, { timestamps: true });
skillSyncStatusSchema.index({
	provider: 1,
	sourceId: 1,
	tenantId: 1
}, { unique: true });
//#endregion
//#region src/schema/token.ts
const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user"
	},
	email: { type: String },
	type: { type: String },
	identifier: { type: String },
	token: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	expiresAt: {
		type: Date,
		required: true
	},
	metadata: {
		type: Map,
		of: Schema.Types.Mixed
	},
	tenantId: {
		type: String,
		index: true
	}
});
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//#endregion
//#region src/schema/toolCall.ts
const toolCallSchema = new Schema({
	conversationId: {
		type: String,
		required: true
	},
	messageId: {
		type: String,
		required: true
	},
	toolId: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	result: { type: mongoose.Schema.Types.Mixed },
	attachments: { type: mongoose.Schema.Types.Mixed },
	blockIndex: { type: Number },
	partIndex: { type: Number },
	tenantId: {
		type: String,
		index: true
	},
	expiredAt: { type: Date }
}, { timestamps: true });
toolCallSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
toolCallSchema.index({
	messageId: 1,
	user: 1,
	tenantId: 1
});
toolCallSchema.index({
	conversationId: 1,
	user: 1,
	tenantId: 1
});
//#endregion
//#region src/schema/transaction.ts
const transactionSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		index: true,
		required: true
	},
	conversationId: {
		type: String,
		ref: "Conversation",
		index: true
	},
	tokenType: {
		type: String,
		enum: [
			"prompt",
			"completion",
			"credits"
		],
		required: true
	},
	model: {
		type: String,
		index: true
	},
	context: { type: String },
	valueKey: { type: String },
	rate: Number,
	rawAmount: Number,
	tokenValue: Number,
	inputTokens: { type: Number },
	writeTokens: { type: Number },
	readTokens: { type: Number },
	messageId: { type: String },
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
//#endregion
//#region src/schema/user.ts
const SessionSchema = new Schema({ refreshToken: {
	type: String,
	default: ""
} }, { _id: false });
const BackupCodeSchema = new Schema({
	codeHash: {
		type: String,
		required: true
	},
	used: {
		type: Boolean,
		default: false
	},
	usedAt: {
		type: Date,
		default: null
	}
}, { _id: false });
const userSchema = new Schema({
	name: { type: String },
	username: {
		type: String,
		lowercase: true,
		default: ""
	},
	email: {
		type: String,
		required: [true, "can't be blank"],
		lowercase: true,
		match: [/\S+@\S+\.\S+/, "is invalid"],
		index: true
	},
	emailVerified: {
		type: Boolean,
		required: true,
		default: false
	},
	password: {
		type: String,
		trim: true,
		minlength: 8,
		maxlength: 128,
		select: false
	},
	avatar: {
		type: String,
		required: false
	},
	provider: {
		type: String,
		required: true,
		default: "local"
	},
	role: {
		type: String,
		default: SystemRoles.USER
	},
	googleId: { type: String },
	facebookId: { type: String },
	openidId: { type: String },
	openidIssuer: { type: String },
	samlId: { type: String },
	ldapId: { type: String },
	githubId: { type: String },
	discordId: { type: String },
	appleId: { type: String },
	plugins: { type: Array },
	twoFactorEnabled: {
		type: Boolean,
		default: false
	},
	totpSecret: {
		type: String,
		select: false
	},
	backupCodes: {
		type: [BackupCodeSchema],
		select: false
	},
	pendingTotpSecret: {
		type: String,
		select: false
	},
	pendingBackupCodes: {
		type: [BackupCodeSchema],
		select: false,
		default: void 0
	},
	refreshToken: { type: [SessionSchema] },
	expiresAt: {
		type: Date,
		expires: 604800
	},
	termsAccepted: {
		type: Boolean,
		default: false
	},
	personalization: {
		type: { memories: {
			type: Boolean,
			default: true
		} },
		default: {}
	},
	favorites: {
		type: [{
			_id: false,
			agentId: {
				type: String,
				maxlength: 256
			},
			model: {
				type: String,
				maxlength: 256
			},
			endpoint: {
				type: String,
				maxlength: 256
			},
			spec: {
				type: String,
				maxlength: 256
			}
		}],
		default: []
	},
	skillStates: {
		type: Map,
		of: Boolean,
		default: () => /* @__PURE__ */ new Map()
	},
	/** Field for external source identification (for consistency with TPrincipal schema) */
	idOnTheSource: {
		type: String,
		sparse: true
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
userSchema.index({
	email: 1,
	tenantId: 1
}, { unique: true });
userSchema.index({
	role: 1,
	tenantId: 1
});
userSchema.index({
	idOnTheSource: 1,
	openidIssuer: 1,
	tenantId: 1
});
for (const field of [
	"googleId",
	"facebookId",
	"openidId",
	"samlId",
	"ldapId",
	"githubId",
	"discordId",
	"appleId"
]) {
	if (field === "openidId") {
		userSchema.index({
			openidId: 1,
			openidIssuer: 1,
			tenantId: 1
		}, {
			unique: true,
			partialFilterExpression: { openidId: { $exists: true } }
		});
		continue;
	}
	userSchema.index({
		[field]: 1,
		tenantId: 1
	}, {
		unique: true,
		partialFilterExpression: { [field]: { $exists: true } }
	});
}
//#endregion
//#region src/schema/memory.ts
const MemoryEntrySchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		index: true,
		required: true
	},
	key: {
		type: String,
		required: true,
		validate: {
			validator: (v) => /^[a-z_]+$/.test(v),
			message: "Key must only contain lowercase letters and underscores"
		}
	},
	value: {
		type: String,
		required: true
	},
	tokenCount: {
		type: Number,
		default: 0
	},
	updated_at: {
		type: Date,
		default: Date.now
	},
	tenantId: {
		type: String,
		index: true
	}
});
//#endregion
//#region src/schema/group.ts
const groupSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: true
	},
	description: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: false,
		index: true
	},
	avatar: {
		type: String,
		required: false
	},
	memberIds: [{
		type: String,
		required: false
	}],
	source: {
		type: String,
		enum: ["local", "entra"],
		default: "local"
	},
	/** External ID (e.g., Entra ID) */
	idOnTheSource: {
		type: String,
		sparse: true,
		index: true,
		required: function() {
			return this.source !== "local";
		}
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
groupSchema.index({
	idOnTheSource: 1,
	source: 1,
	tenantId: 1
}, {
	unique: true,
	partialFilterExpression: { idOnTheSource: { $exists: true } }
});
groupSchema.index({ memberIds: 1 });
//#endregion
//#region src/schema/systemGrant.ts
const systemGrantSchema = new Schema({
	principalType: {
		type: String,
		enum: Object.values(PrincipalType),
		required: true
	},
	principalId: {
		type: Schema.Types.Mixed,
		required: true
	},
	capability: {
		type: String,
		required: true,
		validate: {
			validator: isValidCapability,
			message: "Invalid capability string: \"{VALUE}\""
		}
	},
	/**
	* Platform-level grants MUST omit this field entirely — never set it to null.
	* Queries for platform-level grants use `{ tenantId: { $exists: false } }`, which
	* matches absent fields but NOT `null`. A document stored with `{ tenantId: null }`
	* would silently match neither platform-level nor tenant-scoped queries.
	*/
	tenantId: {
		type: String,
		required: false,
		validate: {
			validator: (v) => v !== null && v !== "",
			message: "tenantId must be a non-empty string or omitted entirely — never null or empty"
		}
	},
	grantedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	grantedAt: {
		type: Date,
		default: Date.now
	},
	/** Reserved for future TTL enforcement — time-bounded / temporary grants. Not enforced yet. */
	expiresAt: {
		type: Date,
		required: false
	}
}, { timestamps: true });
systemGrantSchema.index({
	principalType: 1,
	principalId: 1,
	capability: 1,
	tenantId: 1
}, { unique: true });
systemGrantSchema.index({
	capability: 1,
	tenantId: 1
});
systemGrantSchema.index({
	principalType: 1,
	capability: 1,
	tenantId: 1
});
//#endregion
//#region src/types/admin.ts
/**
* High-level domains an audit entry can belong to. The audit log is a
* general-purpose, append-only compliance record; new domains (agent runs,
* tool/MCP calls, config and permission changes, approvals) are added here as
* the surface grows, without reshaping the record.
*/
const AUDIT_CATEGORIES = [
	"grant",
	"agent_run",
	"tool_call",
	"mcp",
	"config",
	"permission",
	"auth",
	"approval"
];
/**
* Single source of truth for the audit-action enum. Actions are namespaced
* `<category>.<verb>` so the registry stays readable as it grows and every
* action maps unambiguously to a category. The Mongoose schema enum and the
* HTTP handler's whitelist both consume this constant so they cannot drift.
*/
const AUDIT_ACTIONS = ["grant.assigned", "grant.removed"];
/** Maps each action to its category so writers never pass both. */
const AUDIT_ACTION_CATEGORY = {
	"grant.assigned": "grant",
	"grant.removed": "grant"
};
/** Result of the audited operation. Kept first-class instead of being encoded
* into the action so `allowed` vs `denied` vs `failed` is queryable. */
const AUDIT_OUTCOMES = [
	"success",
	"failure",
	"denied",
	"pending"
];
/** Coarse severity for SIEM routing and alerting. */
const AUDIT_SEVERITIES = [
	"info",
	"warning",
	"critical"
];
/**
* Who initiated the action. Non-human actors are first-class: a scheduled job,
* an agent acting autonomously, an internal service, or a webhook are all
* representable without forcing a `User` id.
*/
const AUDIT_ACTOR_TYPES = [
	"user",
	"system",
	"agent",
	"service",
	"schedule",
	"webhook",
	"api"
];
//#endregion
//#region src/schema/auditLog.ts
/** Sentinel `chainKey` for platform-level (non-tenant) audit entries. */
const PLATFORM_CHAIN_KEY = "__platform__";
/** Genesis link: the `prevHash` of the first entry in any chain. */
const GENESIS_HASH = "0".repeat(64);
const actorSchema = new Schema({
	type: {
		type: String,
		enum: [...AUDIT_ACTOR_TYPES],
		required: true,
		immutable: true
	},
	id: {
		type: String,
		required: false,
		immutable: true
	},
	name: {
		type: String,
		required: true,
		immutable: true
	}
}, { _id: false });
const targetSchema = new Schema({
	type: {
		type: String,
		required: true,
		immutable: true
	},
	id: {
		type: String,
		required: false,
		immutable: true
	},
	name: {
		type: String,
		required: false,
		immutable: true
	}
}, { _id: false });
const contextSchema = new Schema({
	requestId: {
		type: String,
		required: false,
		immutable: true
	},
	ip: {
		type: String,
		required: false,
		immutable: true
	},
	userAgent: {
		type: String,
		required: false,
		immutable: true
	},
	sessionId: {
		type: String,
		required: false,
		immutable: true
	}
}, { _id: false });
/**
* Append-only by schema contract: every field is `immutable`, every
* update-style operation is short-circuited in the pre-hooks below, and there
* is no `updatedAt` — a mutable timestamp would imply mutation is allowed.
* `createdAt` is set explicitly by the writer (not by `timestamps`) so it is
* covered by the per-entry hash. Tamper-evidence beyond these app-layer guards
* comes from the hash chain (`prevHash`/`hash`/`seq`) maintained in
* `~/methods/auditLog`.
*/
const auditLogSchema = new Schema({
	schemaVersion: {
		type: Number,
		required: true,
		immutable: true
	},
	category: {
		type: String,
		enum: [...AUDIT_CATEGORIES],
		required: true,
		immutable: true
	},
	action: {
		type: String,
		enum: [...AUDIT_ACTIONS],
		required: true,
		immutable: true
	},
	outcome: {
		type: String,
		enum: [...AUDIT_OUTCOMES],
		required: true,
		immutable: true
	},
	severity: {
		type: String,
		enum: [...AUDIT_SEVERITIES],
		required: true,
		immutable: true
	},
	actor: {
		type: actorSchema,
		required: true,
		immutable: true
	},
	target: {
		type: targetSchema,
		required: true,
		immutable: true
	},
	/** Event-specific payload (e.g. `{ capability }` for grants). Open by design;
	* never store raw prompts, secrets, or full tool outputs here. */
	metadata: {
		type: Schema.Types.Mixed,
		required: false,
		immutable: true
	},
	context: {
		type: contextSchema,
		required: false,
		immutable: true
	},
	/**
	* Platform-level entries MUST omit this field entirely — never set it to null.
	* Tenant-scoped queries derive `chainKey` from `tenantId`; absence here maps
	* to the platform chain.
	*/
	tenantId: {
		type: String,
		required: false,
		immutable: true,
		validate: {
			validator: (v) => typeof v === "string" && v.trim().length > 0,
			message: "tenantId must be a non-empty string or omitted entirely — never null, empty, or a non-string value"
		}
	},
	chainKey: {
		type: String,
		required: true,
		immutable: true
	},
	seq: {
		type: Number,
		required: true,
		immutable: true
	},
	prevHash: {
		type: String,
		required: true,
		immutable: true
	},
	hash: {
		type: String,
		required: true,
		immutable: true
	},
	createdAt: {
		type: Date,
		required: true,
		immutable: true
	}
});
const APPEND_ONLY_MESSAGE = "AuditLog is append-only — updates and deletes are forbidden";
/** Block every query-level update path. */
auditLogSchema.pre([
	"updateOne",
	"updateMany",
	"findOneAndUpdate",
	"findOneAndReplace",
	"replaceOne"
], function(next) {
	next(/* @__PURE__ */ new Error(APPEND_ONLY_MESSAGE));
});
/** Block every query-level delete path. */
auditLogSchema.pre([
	"deleteOne",
	"deleteMany",
	"findOneAndDelete"
], function(next) {
	next(/* @__PURE__ */ new Error(APPEND_ONLY_MESSAGE));
});
/**
* Mongoose registers `deleteOne` / `updateOne` pre-hooks as query middleware
* by default, leaving `Document.prototype.deleteOne()` and
* `Document.prototype.updateOne()` as escape hatches: a caller holding a loaded
* doc could invoke either on the instance and bypass the query-level hooks.
* The explicit `{ document: true, query: false }` registrations close both.
*/
auditLogSchema.pre("deleteOne", {
	document: true,
	query: false
}, function(next) {
	next(/* @__PURE__ */ new Error(APPEND_ONLY_MESSAGE));
});
auditLogSchema.pre("updateOne", {
	document: true,
	query: false
}, function(next) {
	next(/* @__PURE__ */ new Error(APPEND_ONLY_MESSAGE));
});
/** Document-level `save` is allowed for new docs only; a second save mutates. */
auditLogSchema.pre("save", function(next) {
	if (!this.isNew) {
		next(/* @__PURE__ */ new Error(APPEND_ONLY_MESSAGE));
		return;
	}
	next();
});
/**
* `Model.bulkWrite()` dispatches update/delete operations through the raw driver
* and skips the query/document middleware above. Block it wholesale: audit rows
* are only ever written via `recordAuditEntry` (`Model.create`), and a bulk
* insert would also break the sequential hash chain, so there is no legitimate
* bulkWrite path. The privileged retention purge uses `Model.collection` and is
* unaffected by this hook.
*/
auditLogSchema.pre("bulkWrite", function(next) {
	next(/* @__PURE__ */ new Error(APPEND_ONLY_MESSAGE));
});
/**
* `Model.insertMany()` is another bulk path that skips the document `save`
* hook, so it could insert rows with attacker-chosen `seq`/`prevHash`/`hash`
* and poison the chain. Entries are only ever written one-at-a-time via
* `recordAuditEntry` (`Model.create`), so block bulk inserts outright.
*/
auditLogSchema.pre("insertMany", function(next) {
	next(/* @__PURE__ */ new Error(APPEND_ONLY_MESSAGE));
});
/**
* Unique per-chain sequence. This is both the keyset-pagination key and the
* integrity backstop: concurrent appends race to claim the next `seq`, one wins,
* and the losers retry — so the chain can never fork.
*/
auditLogSchema.index({
	chainKey: 1,
	seq: 1
}, { unique: true });
/** Primary listing: newest-first within a chain, bounded by a date window. */
auditLogSchema.index({
	chainKey: 1,
	createdAt: -1,
	seq: -1
});
/** Faceted reads. */
auditLogSchema.index({
	chainKey: 1,
	category: 1,
	createdAt: -1
});
auditLogSchema.index({
	chainKey: 1,
	"target.type": 1,
	"target.id": 1,
	createdAt: -1
});
//#endregion
//#region src/schema/config.ts
const configSchema = new Schema({
	principalType: {
		type: String,
		enum: Object.values(PrincipalType),
		required: true,
		index: true
	},
	principalId: {
		type: String,
		refPath: "principalModel",
		required: true,
		index: true
	},
	principalModel: {
		type: String,
		enum: Object.values(PrincipalModel),
		required: true
	},
	priority: {
		type: Number,
		required: true,
		index: true
	},
	overrides: {
		type: Schema.Types.Mixed,
		default: {}
	},
	tombstones: {
		type: [String],
		default: []
	},
	isActive: {
		type: Boolean,
		default: true,
		index: true
	},
	configVersion: {
		type: Number,
		default: 0
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
configSchema.index({
	principalType: 1,
	principalId: 1,
	tenantId: 1
}, { unique: true });
configSchema.index({
	principalType: 1,
	principalId: 1,
	isActive: 1,
	tenantId: 1
});
configSchema.index({
	priority: 1,
	isActive: 1,
	tenantId: 1
});
//#endregion
//#region src/utils/principal.ts
/**
* Normalizes a principalId to the correct type for MongoDB queries and storage.
* USER and GROUP principals are stored as ObjectIds; ROLE principals are strings.
* Ensures a string caller ID is cast to ObjectId so it matches documents written
* by `grantCapability` — which always stores user/group IDs as ObjectIds to match
* what `getUserPrincipals` returns.
*/
const normalizePrincipalId = (principalId, principalType) => {
	if (typeof principalId === "string" && principalType !== PrincipalType.ROLE) {
		if (!Types.ObjectId.isValid(principalId)) throw new TypeError(`Invalid ObjectId string for ${principalType}: "${principalId}"`);
		return new Types.ObjectId(principalId);
	}
	return principalId;
};
//#endregion
//#region src/utils/string.ts
/**
* Escapes special regex characters in a string.
*/
function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//#endregion
//#region src/utils/tempChatRetention.ts
/**
* Default retention period for temporary chats in hours
*/
const DEFAULT_RETENTION_HOURS = 720;
/**
* Minimum allowed retention period in hours
*/
const MIN_RETENTION_HOURS = 1;
/**
* Maximum allowed retention period in hours (1 year = 8760 hours)
*/
const MAX_RETENTION_HOURS = 8760;
/**
* Gets the temporary chat retention period from environment variables or config
* @param interfaceConfig - The custom configuration object
* @returns The retention period in hours
*/
function getTempChatRetentionHours(interfaceConfig) {
	let retentionHours = 720;
	if (process.env.TEMP_CHAT_RETENTION_HOURS) {
		const envValue = parseInt(process.env.TEMP_CHAT_RETENTION_HOURS, 10);
		if (!isNaN(envValue)) retentionHours = envValue;
		else logger.warn(`Invalid TEMP_CHAT_RETENTION_HOURS environment variable: ${process.env.TEMP_CHAT_RETENTION_HOURS}. Using default: 720 hours.`);
	}
	if (interfaceConfig?.temporaryChatRetention !== void 0) {
		const configValue = interfaceConfig.temporaryChatRetention;
		if (typeof configValue === "number" && !isNaN(configValue)) retentionHours = configValue;
		else logger.warn(`Invalid temporaryChatRetention in config: ${configValue}. Using ${retentionHours} hours.`);
	}
	if (retentionHours < 1) {
		logger.warn(`Temporary chat retention period ${retentionHours} is below minimum 1 hours. Using minimum value.`);
		retentionHours = 1;
	} else if (retentionHours > 8760) {
		logger.warn(`Temporary chat retention period ${retentionHours} exceeds maximum ${MAX_RETENTION_HOURS} hours. Using maximum value.`);
		retentionHours = MAX_RETENTION_HOURS;
	}
	return retentionHours;
}
/**
* Creates an expiration date for temporary chats
* @param interfaceConfig - The custom configuration object
* @returns The expiration date
*/
function createTempChatExpirationDate(interfaceConfig) {
	const retentionHours = getTempChatRetentionHours(interfaceConfig);
	return new Date(Date.now() + retentionHours * 60 * 60 * 1e3);
}
//#endregion
//#region src/utils/retention.ts
const activeExpirationFilter = () => ({ $or: [{ expiredAt: null }, { expiredAt: { $gt: /* @__PURE__ */ new Date() } }] });
const legacyPermanentExpirationFilter = () => ({ expiredAt: null });
const buildRetentionVisibilityFilter = () => ({ $or: [
	{
		isTemporary: false,
		expiredAt: null
	},
	{
		isTemporary: false,
		expiredAt: { $gt: /* @__PURE__ */ new Date() }
	},
	{
		isTemporary: null,
		expiredAt: null
	}
] });
const createFallbackRetentionDate = (now = Date.now()) => new Date(now + 720 * 60 * 60 * 1e3);
//#endregion
//#region src/utils/tenantBulkWrite.ts
let _strictMode$1;
function isStrict$1() {
	return _strictMode$1 ??= process.env.TENANT_ISOLATION_STRICT === "true";
}
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
async function tenantSafeBulkWrite(model, ops, options) {
	const tenantId = getTenantId();
	const sanitized = ops.map(sanitizeBulkOp).filter((op) => op != null);
	if (!tenantId) {
		if (isStrict$1()) throw new Error(`[TenantIsolation] bulkWrite on ${model.modelName} attempted without tenant context in strict mode`);
		return sanitized.length > 0 ? model.bulkWrite(sanitized, options) : EMPTY_BULK_RESULT;
	}
	if (tenantId === "__SYSTEM__") return sanitized.length > 0 ? model.bulkWrite(sanitized, options) : EMPTY_BULK_RESULT;
	const injected = sanitized.map((op) => injectTenantId(op, tenantId));
	return injected.length > 0 ? model.bulkWrite(injected, options) : EMPTY_BULK_RESULT;
}
/** Returned when all ops are dropped after sanitization. Single shared instance. */
const EMPTY_BULK_RESULT = Object.freeze({
	insertedCount: 0,
	matchedCount: 0,
	modifiedCount: 0,
	deletedCount: 0,
	upsertedCount: 0,
	upsertedIds: {},
	insertedIds: {}
});
/** Strips tenantId from update documents. Returns null if the op becomes empty. */
function sanitizeBulkOp(op) {
	if ("updateOne" in op) {
		const { update, ...rest } = op.updateOne;
		const stripped = stripTenantIdFromUpdate(update);
		return Object.keys(stripped).length === 0 ? null : { updateOne: {
			...rest,
			update: stripped
		} };
	}
	if ("updateMany" in op) {
		const { update, ...rest } = op.updateMany;
		const stripped = stripTenantIdFromUpdate(update);
		return Object.keys(stripped).length === 0 ? null : { updateMany: {
			...rest,
			update: stripped
		} };
	}
	return op;
}
/**
* Injects tenantId into every operation's filter and document.
* Assumes update payloads have already been sanitized by `sanitizeBulkOp`.
* Returns a new operation object — does not mutate the original.
*/
function injectTenantId(op, tenantId) {
	if ("insertOne" in op) return { insertOne: { document: {
		...op.insertOne.document,
		tenantId
	} } };
	if ("updateOne" in op) {
		const { filter, ...rest } = op.updateOne;
		return { updateOne: {
			...rest,
			filter: {
				...filter,
				tenantId
			}
		} };
	}
	if ("updateMany" in op) {
		const { filter, ...rest } = op.updateMany;
		return { updateMany: {
			...rest,
			filter: {
				...filter,
				tenantId
			}
		} };
	}
	if ("deleteOne" in op) {
		const { filter, ...rest } = op.deleteOne;
		return { deleteOne: {
			...rest,
			filter: {
				...filter,
				tenantId
			}
		} };
	}
	if ("deleteMany" in op) {
		const { filter, ...rest } = op.deleteMany;
		return { deleteMany: {
			...rest,
			filter: {
				...filter,
				tenantId
			}
		} };
	}
	if ("replaceOne" in op) {
		const { filter, replacement, ...rest } = op.replaceOne;
		return { replaceOne: {
			...rest,
			filter: {
				...filter,
				tenantId
			},
			replacement: {
				...replacement,
				tenantId
			}
		} };
	}
	if (isStrict$1()) throw new Error("[TenantIsolation] Unknown bulkWrite operation type in strict mode — refusing to pass through without tenant injection");
	logger.warn("[tenantSafeBulkWrite] Unknown bulk op type, passing through without tenant injection");
	return op;
}
const MUTATION_OPS = [
	"$set",
	"$unset",
	"$setOnInsert",
	"$rename"
];
/**
* Strips `tenantId` from a bulk-write update document — both top-level
* and inside mutation operators. Allocates only when stripping is needed.
*/
function stripTenantIdFromUpdate(update) {
	let result = null;
	if ("tenantId" in update) {
		const { tenantId: _tenantId, ...rest } = update;
		result = rest;
	}
	for (const op of MUTATION_OPS) {
		const payload = (result ?? update)[op];
		if (payload && "tenantId" in payload) {
			if (!result) result = { ...update };
			const { tenantId: _tenantId, ...rest } = payload;
			if (Object.keys(rest).length > 0) result[op] = rest;
			else delete result[op];
		}
	}
	return result ?? update;
}
//#endregion
//#region src/utils/transactions.ts
const CANCEL_RATE = 1.15;
/**
* Checks if the connected MongoDB deployment supports transactions
* This requires a MongoDB replica set configuration
*
* @returns True if transactions are supported, false otherwise
*/
const supportsTransactions = async (mongoose) => {
	try {
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			await mongoose.connection.db?.collection("__transaction_test__").findOne({}, { session });
			await session.commitTransaction();
			logger.debug("MongoDB transactions are supported");
			return true;
		} catch (transactionError) {
			try {
				await session.abortTransaction();
			} catch (transactionError) {
				/** best-effort abort */
				logger.error(`[supportsTransactions] Error aborting transaction:`, transactionError);
			}
			logger.debug("MongoDB transactions not supported (transaction error):", transactionError?.message || "Unknown error");
			return false;
		} finally {
			await session.endSession();
		}
	} catch (error) {
		logger.debug("MongoDB transactions not supported (session error):", error?.message || "Unknown error");
		return false;
	}
};
/**
* Gets whether the current MongoDB deployment supports transactions
* Caches the result for performance
*
* @returns True if transactions are supported, false otherwise
*/
const getTransactionSupport = async (mongoose, transactionSupportCache) => {
	let transactionsSupported = false;
	if (transactionSupportCache === null) transactionsSupported = await supportsTransactions(mongoose);
	return transactionsSupported;
};
//#endregion
//#region src/utils/objectId.ts
/** Returns true when `id` is a 24-character hex string (MongoDB ObjectId format). */
const isValidObjectIdString = (id) => /^[a-f\d]{24}$/i.test(id);
//#endregion
//#region src/utils/yaml.ts
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
function stripYamlTrailingComment(value) {
	if (value.trimStart().startsWith("#")) return "";
	const match = value.match(/^(.*?)\s+#.*$/);
	return match ? match[1] : value;
}
//#endregion
//#region src/models/skillSyncCredential.ts
function createSkillSyncCredentialModel(mongoose) {
	return mongoose.models.SkillSyncCredential || mongoose.model("SkillSyncCredential", skillSyncCredentialSchema);
}
//#endregion
//#region src/models/skillSyncStatus.ts
function createSkillSyncStatusModel(mongoose) {
	return mongoose.models.SkillSyncStatus || mongoose.model("SkillSyncStatus", skillSyncStatusSchema);
}
//#endregion
//#region src/models/plugins/tenantIsolation.ts
let _strictMode;
function isStrict() {
	return _strictMode ??= process.env.TENANT_ISOLATION_STRICT === "true";
}
if (process.env.TENANT_ISOLATION_STRICT && process.env.TENANT_ISOLATION_STRICT !== "true" && process.env.TENANT_ISOLATION_STRICT !== "false") logger.warn(`[TenantIsolation] TENANT_ISOLATION_STRICT="${process.env.TENANT_ISOLATION_STRICT}" is not "true" or "false"; defaulting to non-strict mode.`);
const TENANT_ISOLATION_APPLIED = Symbol.for("librechat:tenantIsolation");
const VALUE_OPERATORS = ["$set", "$setOnInsert"];
const STRIP_OPERATORS = ["$unset", "$rename"];
/**
* Strips `tenantId` from update payloads when it matches the current tenant
* (or no context is active). Throws on cross-tenant mutations.
*
* `$unset`/`$rename` always strip — unsetting/renaming tenantId is never valid.
* Empty operator objects are removed after stripping to avoid MongoDB errors.
*/
function sanitizeTenantIdMutation(update) {
	if (!update) return;
	const currentTenantId = getTenantId();
	for (const op of VALUE_OPERATORS) {
		const payload = update[op];
		if (payload && "tenantId" in payload) {
			if (currentTenantId && payload.tenantId !== currentTenantId) throw new Error("[TenantIsolation] Cross-tenant tenantId mutation is not allowed");
			delete payload.tenantId;
			if (Object.keys(payload).length === 0) delete update[op];
		}
	}
	for (const op of STRIP_OPERATORS) {
		const payload = update[op];
		if (payload && "tenantId" in payload) {
			delete payload.tenantId;
			if (Object.keys(payload).length === 0) delete update[op];
		}
	}
	if ("tenantId" in update) {
		if (currentTenantId && update.tenantId !== currentTenantId) throw new Error("[TenantIsolation] Cross-tenant tenantId mutation is not allowed");
		delete update.tenantId;
	}
}
/**
* Mongoose schema plugin that enforces tenant-level data isolation.
*
* - `tenantId` present in async context -> injected into every query filter.
* - `tenantId` is `SYSTEM_TENANT_ID` -> skips injection (explicit cross-tenant op).
* - `tenantId` absent + `TENANT_ISOLATION_STRICT=true` -> throws (fail-closed).
* - `tenantId` absent + strict mode off -> passes through (transitional/pre-tenancy).
* - Update and replace operations that modify `tenantId` are blocked unless running as system.
*/
function applyTenantIsolation(schema) {
	const s = schema;
	if (s[TENANT_ISOLATION_APPLIED]) return;
	s[TENANT_ISOLATION_APPLIED] = true;
	const queryMiddleware = function() {
		const tenantId = getTenantId();
		if (!tenantId && isStrict()) throw new Error("[TenantIsolation] Query attempted without tenant context in strict mode");
		if (!tenantId || tenantId === "__SYSTEM__") return;
		this.where({ tenantId });
	};
	const updateGuard = function() {
		if (getTenantId() === "__SYSTEM__") return;
		sanitizeTenantIdMutation(this.getUpdate());
		const update = this.getUpdate();
		if (update && Object.keys(update).length === 0) {
			this.where({ _id: { $in: [] } });
			this.setOptions({ upsert: false });
		}
	};
	const replaceGuard = function() {
		const tenantId = getTenantId();
		if (tenantId === "__SYSTEM__") return;
		const replacement = this.getUpdate();
		if (!replacement) return;
		if ("tenantId" in replacement && replacement.tenantId !== tenantId) throw new Error("[TenantIsolation] Modifying tenantId via replacement is not allowed");
		if (tenantId && !("tenantId" in replacement)) replacement.tenantId = tenantId;
	};
	schema.pre("find", queryMiddleware);
	schema.pre("findOne", queryMiddleware);
	schema.pre("distinct", queryMiddleware);
	schema.pre("findOneAndUpdate", queryMiddleware);
	schema.pre("findOneAndDelete", queryMiddleware);
	schema.pre("findOneAndReplace", queryMiddleware);
	schema.pre("updateOne", queryMiddleware);
	schema.pre("updateMany", queryMiddleware);
	schema.pre("deleteOne", queryMiddleware);
	schema.pre("deleteMany", queryMiddleware);
	schema.pre("countDocuments", queryMiddleware);
	schema.pre("replaceOne", queryMiddleware);
	schema.pre("findOneAndUpdate", updateGuard);
	schema.pre("updateOne", updateGuard);
	schema.pre("updateMany", updateGuard);
	schema.pre("replaceOne", replaceGuard);
	schema.pre("findOneAndReplace", replaceGuard);
	schema.pre("aggregate", function() {
		const tenantId = getTenantId();
		if (!tenantId && isStrict()) throw new Error("[TenantIsolation] Aggregate attempted without tenant context in strict mode");
		if (!tenantId || tenantId === "__SYSTEM__") return;
		this.pipeline().unshift({ $match: { tenantId } });
	});
	schema.pre("save", function() {
		const tenantId = getTenantId();
		if (!tenantId && isStrict()) throw new Error("[TenantIsolation] Save attempted without tenant context in strict mode");
		if (tenantId && tenantId !== "__SYSTEM__") {
			if (!this.tenantId) this.tenantId = tenantId;
			else if (isStrict() && this.tenantId !== tenantId) throw new Error("[TenantIsolation] Document tenantId does not match current tenant context");
		}
	});
	schema.pre("insertMany", function(next, docs) {
		const tenantId = getTenantId();
		if (!tenantId && isStrict()) return next(/* @__PURE__ */ new Error("[TenantIsolation] insertMany attempted without tenant context in strict mode"));
		if (tenantId && tenantId !== "__SYSTEM__" && Array.isArray(docs)) {
			for (const doc of docs) if (!doc.tenantId) doc.tenantId = tenantId;
			else if (isStrict() && doc.tenantId !== tenantId) return next(/* @__PURE__ */ new Error("[TenantIsolation] Document tenantId does not match current tenant context"));
		}
		next();
	});
}
//#endregion
//#region src/models/conversationTag.ts
function createConversationTagModel(mongoose) {
	applyTenantIsolation(conversationTag);
	return mongoose.models.ConversationTag || mongoose.model("ConversationTag", conversationTag);
}
//#endregion
//#region src/models/agentCategory.ts
function createAgentCategoryModel(mongoose) {
	applyTenantIsolation(agentCategorySchema);
	return mongoose.models.AgentCategory || mongoose.model("AgentCategory", agentCategorySchema);
}
//#endregion
//#region src/models/chatProject.ts
function createChatProjectModel(mongoose) {
	applyTenantIsolation(chatProjectSchema);
	return mongoose.models.ChatProject || mongoose.model("ChatProject", chatProjectSchema, "chatprojects");
}
//#endregion
//#region src/models/agentApiKey.ts
function createAgentApiKeyModel(mongoose) {
	applyTenantIsolation(agentApiKeySchema);
	return mongoose.models.AgentApiKey || mongoose.model("AgentApiKey", agentApiKeySchema);
}
//#endregion
//#region src/models/transaction.ts
function createTransactionModel(mongoose) {
	applyTenantIsolation(transactionSchema);
	return mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
}
//#endregion
//#region src/models/promptGroup.ts
function createPromptGroupModel(mongoose) {
	applyTenantIsolation(promptGroupSchema);
	return mongoose.models.PromptGroup || mongoose.model("PromptGroup", promptGroupSchema);
}
//#endregion
//#region src/models/systemGrant.ts
/**
* SystemGrant is a cross-tenant control plane — its query logic in systemGrant methods
* explicitly handles tenantId conditions (platform-level vs tenant-scoped grants).
* Do NOT apply tenant isolation plugin here; it would inject a hard tenantId equality
* filter that conflicts with the $and/$or logic in hasCapabilityForPrincipals.
*/
function createSystemGrantModel(mongoose) {
	return mongoose.models.SystemGrant || mongoose.model("SystemGrant", systemGrantSchema);
}
//#endregion
//#region src/models/pluginAuth.ts
function createPluginAuthModel(mongoose) {
	applyTenantIsolation(pluginAuthSchema);
	return mongoose.models.PluginAuth || mongoose.model("PluginAuth", pluginAuthSchema);
}
//#endregion
//#region src/models/sharedLink.ts
function createSharedLinkModel(mongoose) {
	applyTenantIsolation(shareSchema);
	return mongoose.models.SharedLink || mongoose.model("SharedLink", shareSchema);
}
//#endregion
//#region src/schema/accessRole.ts
const accessRoleSchema = new Schema({
	accessRoleId: {
		type: String,
		required: true,
		index: true
	},
	name: {
		type: String,
		required: true
	},
	description: String,
	resourceType: {
		type: String,
		enum: [
			"agent",
			"project",
			"file",
			"promptGroup",
			"mcpServer",
			"remoteAgent",
			"skill",
			"sharedLink"
		],
		required: true,
		default: "agent"
	},
	permBits: {
		type: Number,
		required: true
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
accessRoleSchema.index({
	accessRoleId: 1,
	tenantId: 1
}, { unique: true });
//#endregion
//#region src/models/accessRole.ts
function createAccessRoleModel(mongoose) {
	applyTenantIsolation(accessRoleSchema);
	return mongoose.models.AccessRole || mongoose.model("AccessRole", accessRoleSchema);
}
//#endregion
//#region src/schema/mcpServer.ts
const mcpServerSchema = new Schema({
	serverName: {
		type: String,
		index: true,
		required: true
	},
	config: {
		type: Schema.Types.Mixed,
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
mcpServerSchema.index({
	serverName: 1,
	tenantId: 1
}, { unique: true });
mcpServerSchema.index({
	updatedAt: -1,
	_id: 1
});
//#endregion
//#region src/models/mcpServer.ts
function createMCPServerModel(mongoose) {
	applyTenantIsolation(mcpServerSchema);
	return mongoose.models.MCPServer || mongoose.model("MCPServer", mcpServerSchema);
}
//#endregion
//#region src/models/assistant.ts
function createAssistantModel(mongoose) {
	applyTenantIsolation(assistantSchema);
	return mongoose.models.Assistant || mongoose.model("Assistant", assistantSchema);
}
//#endregion
//#region src/schema/skillFile.ts
/** Max length for a skill file's relative path (e.g. "scripts/parse.sh"). */
const SKILL_FILE_PATH_MAX_LENGTH = 500;
/** Pattern for valid path characters — conservative allowlist. */
const relativePathCharPattern = /^[a-zA-Z0-9._\-/]+$/;
const skillFileSchema = new Schema({
	skillId: {
		type: Schema.Types.ObjectId,
		ref: "Skill",
		required: true,
		index: true
	},
	relativePath: {
		type: String,
		required: true,
		maxlength: [SKILL_FILE_PATH_MAX_LENGTH, `Relative path cannot exceed ${SKILL_FILE_PATH_MAX_LENGTH} characters`],
		validate: {
			validator: function(value) {
				if (!value || value.length === 0) return false;
				if (value.startsWith("/") || value.startsWith("\\")) return false;
				if (!relativePathCharPattern.test(value)) return false;
				const segments = value.split("/");
				if (segments.some((s) => s === "" || s === "." || s === "..")) return false;
				if (value === "SKILL.md" || segments[0] === "SKILL.md") return false;
				return true;
			},
			message: "Relative path must be relative, cannot contain \"..\" or absolute paths, and cannot be SKILL.md."
		}
	},
	file_id: {
		type: String,
		required: true,
		index: true
	},
	filename: {
		type: String,
		required: true
	},
	filepath: {
		type: String,
		required: true
	},
	storageKey: { type: String },
	storageRegion: { type: String },
	source: {
		type: String,
		required: true
	},
	sourceMetadata: { type: Schema.Types.Mixed },
	mimeType: {
		type: String,
		required: true
	},
	bytes: {
		type: Number,
		required: true,
		min: 0
	},
	category: {
		type: String,
		enum: [
			"script",
			"reference",
			"asset",
			"other"
		],
		default: "other"
	},
	isExecutable: {
		type: Boolean,
		default: false
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	tenantId: {
		type: String,
		index: true
	},
	content: { type: String },
	isBinary: { type: Boolean },
	codeEnvRef: {
		type: new Schema({
			kind: {
				type: String,
				enum: [
					"skill",
					"agent",
					"user"
				],
				required: true
			},
			id: {
				type: String,
				required: true
			},
			storage_session_id: {
				type: String,
				required: true
			},
			file_id: {
				type: String,
				required: true
			},
			version: { type: Number }
		}, { _id: false }),
		default: void 0
	}
}, { timestamps: true });
skillFileSchema.index({
	skillId: 1,
	relativePath: 1
}, { unique: true });
skillFileSchema.index({
	skillId: 1,
	category: 1
});
//#endregion
//#region src/models/skillFile.ts
function createSkillFileModel(mongoose) {
	applyTenantIsolation(skillFileSchema);
	return mongoose.models.SkillFile || mongoose.model("SkillFile", skillFileSchema);
}
//#endregion
//#region src/config/meiliLogger.ts
const { NODE_ENV, DEBUG_LOGGING = "false", LOG_TO_FILE } = process.env;
const useDebugLogging = typeof DEBUG_LOGGING === "string" && DEBUG_LOGGING.toLowerCase() === "true" || DEBUG_LOGGING === "true";
const useFileLogging = typeof LOG_TO_FILE !== "string" || LOG_TO_FILE.toLowerCase() !== "false";
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	activity: 6,
	silly: 7
};
winston.addColors({
	info: "green",
	warn: "italic yellow",
	error: "red",
	debug: "blue"
});
const level = () => {
	return (NODE_ENV || "development") === "development" ? "debug" : "warn";
};
const fileFormat = winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.errors({ stack: true }), winston.format.splat());
const logLevel = useDebugLogging ? "debug" : "error";
const transports = [];
if (useFileLogging) {
	const logDir = getLogDirectory();
	transports.push(new winston.transports.DailyRotateFile({
		level: logLevel,
		filename: `${logDir}/meiliSync-%DATE%.log`,
		datePattern: "YYYY-MM-DD",
		zippedArchive: true,
		maxSize: "20m",
		maxFiles: "14d",
		format: fileFormat
	}));
}
const consoleFormat = winston.format.combine(winston.format.colorize({ all: true }), winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
transports.push(new winston.transports.Console({
	level: "info",
	format: consoleFormat
}));
const logger$1 = winston.createLogger({
	level: level(),
	levels,
	transports
});
//#endregion
//#region src/models/plugins/mongoMeili.ts
/**
* Flag to indicate if search is enabled based on environment variables.
*/
const searchEnabled = process.env.SEARCH != null && process.env.SEARCH.toLowerCase() === "true";
/**
* Flag to indicate if MeiliSearch is enabled based on required environment variables.
*/
const meiliEnabled = process.env.MEILI_HOST != null && process.env.MEILI_MASTER_KEY != null && searchEnabled;
/**
* Get sync configuration from environment variables
*/
const getSyncConfig = () => ({
	batchSize: parseInt(process.env.MEILI_SYNC_BATCH_SIZE || "100", 10),
	delayMs: parseInt(process.env.MEILI_SYNC_DELAY_MS || "100", 10)
});
const hasSchemaPath = (schema, path) => Object.prototype.hasOwnProperty.call(schema.obj, path);
const explicitTemporaryFlagKey = "meiliExplicitTemporaryFlag";
const buildIndexableQuery = (schema) => {
	if (!hasSchemaPath(schema, "isTemporary")) return hasSchemaPath(schema, "expiredAt") ? legacyPermanentExpirationFilter() : {};
	return buildRetentionVisibilityFilter();
};
const hasActiveExpiration = (expiredAt) => _.isNil(expiredAt) || new Date(expiredAt).getTime() > Date.now();
/**
* `isTemporary` defaults to `false` on the schema, so hydrated legacy documents
* can appear non-temporary even when the field is absent from MongoDB. `$isDefault`
* lets us distinguish that schema default from an explicit stored flag, and
* `$locals` carries the pre-save answer into post hooks after Mongoose mutates
* document state.
*/
const hasExplicitTemporaryFlag = (doc) => typeof doc.$locals?.[explicitTemporaryFlagKey] === "boolean" ? doc.$locals[explicitTemporaryFlagKey] : doc.isTemporary != null && !doc.$isDefault("isTemporary");
const captureExplicitTemporaryFlag = (doc) => {
	doc.$locals[explicitTemporaryFlagKey] = doc.isTemporary != null && !doc.$isDefault("isTemporary");
};
/**
* Index only retained non-temporary records whose flag was explicitly stored,
* plus legacy permanent records that have no retention deadline. Legacy records
* with an expiration are treated as temporary and stay out of search.
*/
const isIndexableDocument = (doc) => doc.isTemporary === false && hasExplicitTemporaryFlag(doc) && hasActiveExpiration(doc.expiredAt) || !hasExplicitTemporaryFlag(doc) && _.isNil(doc.expiredAt);
/**
* Validates the required options for configuring the mongoMeili plugin.
*/
const validateOptions = (options) => {
	[
		"host",
		"apiKey",
		"indexName",
		"primaryKey"
	].forEach((key) => {
		if (!options[key]) throw new Error(`Missing mongoMeili Option: ${key}`);
	});
};
/**
* Helper function to process documents in batches with rate limiting
*/
const processBatch = async (items, batchSize, delayMs, processor) => {
	for (let i = 0; i < items.length; i += batchSize) {
		await processor(items.slice(i, i + batchSize));
		if (i + batchSize < items.length && delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
	}
};
/**
* Factory function to create a MeiliMongooseModel class which extends a Mongoose model.
* This class contains static and instance methods to synchronize and manage the MeiliSearch index
* corresponding to the MongoDB collection.
*
* @param config - Configuration object.
* @param config.index - The MeiliSearch index object.
* @param config.attributesToIndex - List of attributes to index.
* @param config.primaryKey - The primary key field for MeiliSearch document operations.
* @param config.syncOptions - Sync configuration options.
* @returns A class definition that will be loaded into the Mongoose schema.
*/
const createMeiliMongooseModel = ({ index, getIndexableQuery, attributesToIndex, primaryKey, syncOptions }) => {
	const syncConfig = {
		...getSyncConfig(),
		...syncOptions
	};
	class MeiliMongooseModel {
		/**
		* Get the current sync progress
		*/
		static async getSyncProgress() {
			const indexableQuery = getIndexableQuery();
			const totalDocuments = await this.countDocuments(indexableQuery);
			const indexedDocuments = await this.countDocuments({
				...indexableQuery,
				_meiliIndex: true
			});
			return {
				totalProcessed: indexedDocuments,
				totalDocuments,
				isComplete: indexedDocuments === totalDocuments
			};
		}
		/**
		* Synchronizes data between the MongoDB collection and the MeiliSearch index by
		* incrementally indexing only non-temporary documents where `_meiliIndex` is not `true`.
		* */
		static async syncWithMeili() {
			const startTime = Date.now();
			const { batchSize, delayMs } = syncConfig;
			const collectionName = primaryKey === "messageId" ? "messages" : "conversations";
			logger$1.info(`[syncWithMeili] Starting sync for ${collectionName} with batch size ${batchSize}`);
			const approxTotalCount = await this.estimatedDocumentCount();
			logger$1.info(`[syncWithMeili] Approximate total number of all ${collectionName}: ${approxTotalCount}`);
			try {
				logger$1.info(`[syncWithMeili] Starting cleanup of Meili index ${index.uid} before sync`);
				await this.cleanupMeiliIndex(index, primaryKey, batchSize, delayMs);
				logger$1.info(`[syncWithMeili] Completed cleanup of Meili index: ${index.uid}`);
			} catch (error) {
				logger$1.error("[syncWithMeili] Error during cleanup Meili before sync:", error);
				throw error;
			}
			let processedCount = 0;
			let hasMore = true;
			while (hasMore) {
				const query = {
					...getIndexableQuery(),
					_meiliIndex: { $ne: true }
				};
				try {
					const documents = await this.find(query).select(attributesToIndex.join(" ") + " _meiliIndex").limit(batchSize).lean();
					if (documents.length === 0) {
						logger$1.info("[syncWithMeili] No more documents to process");
						break;
					}
					await this.processSyncBatch(index, documents);
					processedCount += documents.length;
					logger$1.info(`[syncWithMeili] Processed: ${processedCount}`);
					if (documents.length < batchSize) hasMore = false;
					if (hasMore && delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
				} catch (error) {
					logger$1.error("[syncWithMeili] Error processing documents batch:", error);
					throw error;
				}
			}
			const duration = Date.now() - startTime;
			logger$1.info(`[syncWithMeili] Completed sync for ${collectionName}. Processed ${processedCount} documents in ${duration}ms`);
		}
		/**
		* Process a batch of documents for syncing
		*/
		static async processSyncBatch(index, documents) {
			if (documents.length === 0) return;
			const formattedDocs = documents.map((doc) => _.omitBy(_.pick(doc, attributesToIndex), (_v, k) => k.startsWith("$")));
			try {
				await index.addDocumentsInBatches(formattedDocs, void 0, { primaryKey });
				const docsIds = documents.map((doc) => doc._id);
				await this.updateMany({ _id: { $in: docsIds } }, { $set: { _meiliIndex: true } }, { timestamps: false });
			} catch (error) {
				logger$1.error("[processSyncBatch] Error processing batch:", error);
				throw error;
			}
		}
		/**
		* Clean up documents in MeiliSearch that no longer exist in MongoDB
		*/
		static async cleanupMeiliIndex(index, primaryKey, batchSize, delayMs) {
			try {
				let offset = 0;
				let moreDocuments = true;
				while (moreDocuments) {
					const batch = await index.getDocuments({
						limit: batchSize,
						offset
					});
					if (batch.results.length === 0) {
						moreDocuments = false;
						break;
					}
					const meiliIds = batch.results.map((doc) => doc[primaryKey]);
					const query = {};
					query[primaryKey] = { $in: meiliIds };
					const existingDocs = await this.find({
						...query,
						...getIndexableQuery()
					}).select(primaryKey).lean();
					const existingIds = new Set(existingDocs.map((doc) => doc[primaryKey]));
					const toDelete = meiliIds.filter((id) => !existingIds.has(id));
					if (toDelete.length > 0) {
						await index.deleteDocuments(toDelete.map(String));
						logger$1.debug(`[cleanupMeiliIndex] Deleted ${toDelete.length} orphaned documents`);
					}
					if (batch.results.length < batchSize) break;
					offset += batchSize - toDelete.length;
					if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
				}
			} catch (error) {
				logger$1.error("[cleanupMeiliIndex] Error during cleanup:", error);
			}
		}
		/**
		* Updates settings for the MeiliSearch index
		*/
		static async setMeiliIndexSettings(settings) {
			return await index.updateSettings(settings);
		}
		/**
		* Searches the MeiliSearch index and optionally populates results
		*/
		static async meiliSearch(q, params, populate) {
			const data = await index.search(q, params);
			if (populate) {
				const query = {};
				query[primaryKey] = _.map(data.hits, (hit) => hit[primaryKey]);
				const projection = Object.keys(this.schema.obj).reduce((results, key) => {
					if (!key.startsWith("$")) results[key] = 1;
					return results;
				}, {
					_id: 1,
					__v: 1
				});
				const hitsFromMongoose = await this.find(query, projection).lean();
				data.hits = data.hits.map((hit) => {
					const queryObj = {};
					queryObj[primaryKey] = hit[primaryKey];
					const originalHit = _.find(hitsFromMongoose, (item) => {
						return item[primaryKey] === hit[primaryKey];
					});
					return {
						...originalHit && typeof originalHit === "object" ? originalHit : {},
						...hit
					};
				});
			}
			return data;
		}
		/**
		* Preprocesses the current document for indexing
		*/
		preprocessObjectForIndex() {
			const object = _.omitBy(_.pick(this.toJSON(), attributesToIndex), (v, k) => k.startsWith("$"));
			if (object.conversationId && typeof object.conversationId === "string" && object.conversationId.includes("|")) object.conversationId = object.conversationId.replace(/\|/g, "--");
			if (object.content && Array.isArray(object.content)) {
				object.text = parseTextParts(object.content);
				delete object.content;
			}
			return object;
		}
		/**
		* Adds the current document to the MeiliSearch index with retry logic
		*/
		async addObjectToMeili(next) {
			if (!isIndexableDocument(this)) return next();
			const object = this.preprocessObjectForIndex();
			const maxRetries = 3;
			let retryCount = 0;
			while (retryCount < maxRetries) try {
				await index.addDocuments([object], { primaryKey });
				break;
			} catch (error) {
				retryCount++;
				if (retryCount >= maxRetries) {
					logger$1.error("[addObjectToMeili] Error adding document to Meili after retries:", error);
					return next();
				}
				await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount) * 1e3));
			}
			try {
				await this.collection.updateOne({ _id: this._id }, { $set: { _meiliIndex: true } });
			} catch (error) {
				logger$1.error("[addObjectToMeili] Error updating _meiliIndex field:", error);
				return next();
			}
			next();
		}
		/**
		* Updates the current document in the MeiliSearch index
		*/
		async updateObjectToMeili(next) {
			try {
				if (!isIndexableDocument(this)) {
					await index.deleteDocument(String(this[primaryKey]));
					await this.constructor.updateOne({ _id: this._id }, { $set: { _meiliIndex: false } });
					return next();
				}
				const object = this.preprocessObjectForIndex();
				await index.updateDocuments([object], { primaryKey });
				next();
			} catch (error) {
				logger$1.error("[updateObjectToMeili] Error updating document in Meili:", error);
				return next();
			}
		}
		/**
		* Deletes the current document from the MeiliSearch index.
		*
		* @returns {Promise<void>}
		*/
		async deleteObjectFromMeili(next) {
			try {
				await index.deleteDocument(String(this[primaryKey]));
				next();
			} catch (error) {
				logger$1.error("[deleteObjectFromMeili] Error deleting document from Meili:", error);
				return next();
			}
		}
		/**
		* Post-save hook to synchronize the document with MeiliSearch.
		*
		* If the document is already indexed (i.e. `_meiliIndex` is true), it updates it;
		* otherwise, it adds the document to the index.
		*/
		postSaveHook(next) {
			if (this._meiliIndex) this.updateObjectToMeili(next);
			else this.addObjectToMeili(next);
		}
		/**
		* Post-update hook to update the document in MeiliSearch.
		*
		* This hook is triggered after a document update, ensuring that changes are
		* propagated to the MeiliSearch index if the document is indexed.
		*/
		postUpdateHook(next) {
			if (this._meiliIndex) this.updateObjectToMeili(next);
			else next();
		}
		/**
		* Post-remove hook to delete the document from MeiliSearch.
		*
		* This hook is triggered after a document is removed, ensuring that the document
		* is also removed from the MeiliSearch index if it was previously indexed.
		*/
		postRemoveHook(next) {
			if (this._meiliIndex) this.deleteObjectFromMeili(next);
			else next();
		}
	}
	return MeiliMongooseModel;
};
/**
* Mongoose plugin to synchronize MongoDB collections with a MeiliSearch index.
*
* This plugin:
*   - Validates the provided options.
*   - Adds a `_meiliIndex` field to the schema to track indexing status.
*   - Sets up a MeiliSearch client and creates an index if it doesn't already exist.
*   - Loads class methods for syncing, searching, and managing documents in MeiliSearch.
*   - Registers Mongoose hooks (post-save, post-update, post-remove, etc.) to maintain index consistency.
*
* @param schema - The Mongoose schema to which the plugin is applied.
* @param options - Configuration options.
* @param options.host - The MeiliSearch host.
* @param options.apiKey - The MeiliSearch API key.
* @param options.indexName - The name of the MeiliSearch index.
* @param options.primaryKey - The primary key field for indexing.
* @param options.syncBatchSize - Batch size for sync operations.
* @param options.syncDelayMs - Delay between batches in milliseconds.
*/
function mongoMeili(schema, options) {
	const mongoose = options.mongoose;
	validateOptions(options);
	schema.add({ _meiliIndex: {
		type: Boolean,
		required: false,
		select: false,
		default: false
	} });
	const { host, apiKey, indexName, primaryKey } = options;
	const syncOptions = {
		batchSize: options.syncBatchSize || getSyncConfig().batchSize,
		delayMs: options.syncDelayMs || getSyncConfig().delayMs
	};
	const client = new MeiliSearch({
		host,
		apiKey
	});
	/** Create index only if it doesn't exist */
	const index = client.index(indexName);
	(async () => {
		try {
			await index.getRawInfo();
			logger$1.debug(`[mongoMeili] Index ${indexName} already exists`);
		} catch (error) {
			if (error?.code === "index_not_found") try {
				logger$1.info(`[mongoMeili] Creating new index: ${indexName}`);
				const enqueued = await client.createIndex(indexName, { primaryKey });
				const task = await client.waitForTask(enqueued.taskUid, {
					timeOutMs: 1e4,
					intervalMs: 100
				});
				logger$1.debug(`[mongoMeili] Index ${indexName} creation task:`, task);
				if (task.status !== "succeeded") {
					const taskError = task.error;
					if (taskError?.code === "index_already_exists") logger$1.debug(`[mongoMeili] Index ${indexName} was created by another instance`);
					else logger$1.warn(`[mongoMeili] Index ${indexName} creation failed:`, taskError);
				} else logger$1.info(`[mongoMeili] Successfully created index: ${indexName}`);
			} catch (createError) {
				if (createError instanceof MeiliSearchTimeOutError) logger$1.warn(`[mongoMeili] Timed out waiting for index ${indexName} creation`);
				else logger$1.warn(`[mongoMeili] Error creating index ${indexName}:`, createError);
			}
			else logger$1.error(`[mongoMeili] Error checking index ${indexName}:`, error);
		}
		try {
			await index.updateSettings({ filterableAttributes: ["user"] });
			logger$1.debug(`[mongoMeili] Updated index ${indexName} settings to make 'user' filterable`);
		} catch (settingsError) {
			logger$1.error(`[mongoMeili] Error updating index settings for ${indexName}:`, settingsError);
		}
	})();
	const attributesToIndex = [...Object.entries(schema.obj).reduce((results, [key, value]) => {
		return value.meiliIndex ? [...results, key] : results;
	}, [])];
	if (schema.obj.user && !attributesToIndex.includes("user")) {
		attributesToIndex.push("user");
		logger$1.debug(`[mongoMeili] Added 'user' field to ${indexName} index attributes`);
	}
	schema.loadClass(createMeiliMongooseModel({
		index,
		getIndexableQuery: () => buildIndexableQuery(schema),
		attributesToIndex,
		primaryKey,
		syncOptions
	}));
	schema.pre("save", function(next) {
		if (hasSchemaPath(schema, "isTemporary")) captureExplicitTemporaryFlag(this);
		next();
	});
	schema.post("save", function(doc, next) {
		doc.postSaveHook?.(next);
	});
	schema.post("updateOne", function(doc, next) {
		doc.postUpdateHook?.(next);
	});
	schema.post("deleteOne", function(doc, next) {
		doc.postRemoveHook?.(next);
	});
	schema.pre("deleteMany", async function(next) {
		if (!meiliEnabled) return next();
		try {
			const conditions = this.getQuery();
			const { batchSize, delayMs } = syncOptions;
			if (Object.prototype.hasOwnProperty.call(schema.obj, "messages")) {
				const convoIndex = client.index("convos");
				await processBatch(await mongoose.model("Conversation").find(conditions).select("conversationId").lean(), batchSize, delayMs, async (batch) => {
					const promises = batch.map((convo) => convoIndex.deleteDocument(convo.conversationId));
					await Promise.all(promises);
				});
			}
			if (Object.prototype.hasOwnProperty.call(schema.obj, "messageId")) {
				const messageIndex = client.index("messages");
				await processBatch(await mongoose.model("Message").find(conditions).select("messageId").lean(), batchSize, delayMs, async (batch) => {
					const promises = batch.map((message) => messageIndex.deleteDocument(message.messageId));
					await Promise.all(promises);
				});
			}
			return next();
		} catch (error) {
			if (meiliEnabled) logger$1.error("[MeiliMongooseModel.deleteMany] There was an issue deleting conversation indexes upon deletion. Next startup may trigger syncing.", error);
			return next();
		}
	});
	schema.post("findOneAndUpdate", async function(doc, next) {
		if (!meiliEnabled) return next();
		if (doc.unfinished) return next();
		let meiliDoc;
		if (doc.messages) try {
			meiliDoc = await client.index("convos").getDocument(doc.conversationId);
		} catch (error) {
			logger$1.debug("[MeiliMongooseModel.findOneAndUpdate] Convo not found in MeiliSearch and will index " + doc.conversationId, error);
		}
		if (meiliDoc && meiliDoc.title === doc.title) return next();
		doc.postSaveHook?.(next);
	});
}
//#endregion
//#region src/models/convo.ts
function createConversationModel(mongoose) {
	applyTenantIsolation(convoSchema);
	if (process.env.MEILI_HOST && process.env.MEILI_MASTER_KEY) convoSchema.plugin(mongoMeili, {
		mongoose,
		host: process.env.MEILI_HOST,
		apiKey: process.env.MEILI_MASTER_KEY,
		/** Note: Will get created automatically if it doesn't exist already */
		indexName: "convos",
		primaryKey: "conversationId"
	});
	return mongoose.models.Conversation || mongoose.model("Conversation", convoSchema);
}
//#endregion
//#region src/models/toolCall.ts
function createToolCallModel(mongoose) {
	applyTenantIsolation(toolCallSchema);
	return mongoose.models.ToolCall || mongoose.model("ToolCall", toolCallSchema);
}
//#endregion
//#region src/schema/aclEntry.ts
const aclEntrySchema = new Schema({
	principalType: {
		type: String,
		enum: Object.values(PrincipalType),
		required: true
	},
	principalId: {
		type: Schema.Types.Mixed,
		refPath: "principalModel",
		required: function() {
			return this.principalType !== PrincipalType.PUBLIC;
		},
		index: true
	},
	principalModel: {
		type: String,
		enum: Object.values(PrincipalModel),
		required: function() {
			return this.principalType !== PrincipalType.PUBLIC;
		}
	},
	resourceType: {
		type: String,
		enum: Object.values(ResourceType),
		required: true
	},
	resourceId: {
		type: Schema.Types.ObjectId,
		required: true,
		index: true
	},
	permBits: {
		type: Number,
		default: 1,
		min: 0,
		max: MAX_PERM_BITS,
		validate: {
			validator: Number.isInteger,
			message: "`permBits` must be an integer"
		}
	},
	roleId: {
		type: Schema.Types.ObjectId,
		ref: "AccessRole"
	},
	inheritedFrom: {
		type: Schema.Types.ObjectId,
		sparse: true,
		index: true
	},
	grantedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	grantedAt: {
		type: Date,
		default: Date.now
	},
	expiredAt: { type: Date },
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
aclEntrySchema.index({
	principalId: 1,
	principalType: 1,
	resourceType: 1,
	resourceId: 1,
	tenantId: 1
});
aclEntrySchema.index({
	resourceId: 1,
	principalType: 1,
	principalId: 1,
	tenantId: 1
});
aclEntrySchema.index({
	principalId: 1,
	permBits: 1,
	resourceType: 1,
	tenantId: 1
});
/** Covers `findPublicResourceIds` and the public branch of `findAccessibleResources`. */
aclEntrySchema.index({
	principalType: 1,
	resourceType: 1,
	permBits: 1,
	resourceId: 1
});
aclEntrySchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
//#endregion
//#region src/models/aclEntry.ts
function createAclEntryModel(mongoose) {
	applyTenantIsolation(aclEntrySchema);
	return mongoose.models.AclEntry || mongoose.model("AclEntry", aclEntrySchema);
}
//#endregion
//#region src/models/auditLog.ts
/**
* AuditLog is an append-only, hash-chained compliance record.
*
* Like SystemGrant, the tenant-isolation plugin is intentionally not applied:
* every query is scoped by `chainKey` (the JWT-resolved tenantId, or the
* platform sentinel for admin operations outside any tenant), which is also the
* serialization key for the per-tenant hash chain.
*/
function createAuditLogModel(mongoose) {
	return mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
}
//#endregion
//#region src/models/session.ts
function createSessionModel(mongoose) {
	applyTenantIsolation(sessionSchema);
	return mongoose.models.Session || mongoose.model("Session", sessionSchema);
}
//#endregion
//#region src/models/balance.ts
function createBalanceModel(mongoose) {
	applyTenantIsolation(balanceSchema);
	return mongoose.models.Balance || mongoose.model("Balance", balanceSchema);
}
//#endregion
//#region src/models/message.ts
function createMessageModel(mongoose) {
	applyTenantIsolation(messageSchema);
	if (process.env.MEILI_HOST && process.env.MEILI_MASTER_KEY) messageSchema.plugin(mongoMeili, {
		mongoose,
		host: process.env.MEILI_HOST,
		apiKey: process.env.MEILI_MASTER_KEY,
		indexName: "messages",
		primaryKey: "messageId"
	});
	return mongoose.models.Message || mongoose.model("Message", messageSchema);
}
//#endregion
//#region src/models/action.ts
function createActionModel(mongoose) {
	applyTenantIsolation(Action);
	return mongoose.models.Action || mongoose.model("Action", Action);
}
//#endregion
//#region src/models/banner.ts
function createBannerModel(mongoose) {
	applyTenantIsolation(bannerSchema);
	return mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
}
//#endregion
//#region src/models/preset.ts
function createPresetModel(mongoose) {
	applyTenantIsolation(presetSchema);
	return mongoose.models.Preset || mongoose.model("Preset", presetSchema);
}
//#endregion
//#region src/models/prompt.ts
function createPromptModel(mongoose) {
	applyTenantIsolation(promptSchema);
	return mongoose.models.Prompt || mongoose.model("Prompt", promptSchema);
}
//#endregion
//#region src/models/memory.ts
function createMemoryModel(mongoose) {
	applyTenantIsolation(MemoryEntrySchema);
	return mongoose.models.MemoryEntry || mongoose.model("MemoryEntry", MemoryEntrySchema);
}
//#endregion
//#region src/models/config.ts
function createConfigModel(mongoose) {
	applyTenantIsolation(configSchema);
	return mongoose.models.Config || mongoose.model("Config", configSchema);
}
//#endregion
//#region src/models/token.ts
function createTokenModel(mongoose) {
	applyTenantIsolation(tokenSchema);
	return mongoose.models.Token || mongoose.model("Token", tokenSchema);
}
//#endregion
//#region src/models/agent.ts
function createAgentModel(mongoose) {
	applyTenantIsolation(agentSchema);
	return mongoose.models.Agent || mongoose.model("Agent", agentSchema);
}
//#endregion
//#region src/schema/skill.ts
/** Max length for a skill `name` (kebab-case identifier). */
const SKILL_NAME_MAX_LENGTH$1 = 64;
/** Max length for a skill `description`. */
const SKILL_DESCRIPTION_MAX_LENGTH$1 = 1024;
/** Max length for the skill `body` (the SKILL.md content). */
const SKILL_BODY_MAX_LENGTH$1 = 1e5;
/** Max length for the human-friendly `displayTitle`. */
const SKILL_DISPLAY_TITLE_MAX_LENGTH$1 = 128;
const skillNamePattern = /^[a-z0-9][a-z0-9-]*$/;
/**
* Brand namespaces reserved for first-party skills. Matched as prefixes —
* `anthropic-helper` is rejected but `my-helper` is fine. Keep this in sync
* with `RESERVED_NAME_PREFIXES` in `methods/skill.ts`.
*/
const RESERVED_NAME_PREFIXES$1 = ["anthropic-", "claude-"];
/**
* Slash-command names that collide with LibreChat / Claude Code CLI commands.
* Matched exactly against the full skill name. Keep this in sync with
* `RESERVED_NAME_WORDS` in `methods/skill.ts`.
*/
const RESERVED_NAME_WORDS$1 = new Set([
	"help",
	"clear",
	"compact",
	"model",
	"exit",
	"quit",
	"settings",
	"anthropic",
	"claude"
]);
const skillSchema = new Schema({
	/**
	* Machine-readable identifier. Kebab-case, max 64 chars, unique per
	* (author, tenantId). This is what Claude sees in its system prompt when
	* deciding to trigger the skill, and what slash-command integrations key
	* off — so it must be stable, concise, and ASCII-friendly. User-facing
	* labels live on `displayTitle` instead.
	*/
	name: {
		type: String,
		required: true,
		index: true,
		maxlength: [SKILL_NAME_MAX_LENGTH$1, `Name cannot exceed ${SKILL_NAME_MAX_LENGTH$1} characters`],
		validate: {
			validator: function(value) {
				if (!skillNamePattern.test(value)) return false;
				const lowered = value.toLowerCase();
				if (RESERVED_NAME_PREFIXES$1.some((prefix) => lowered.startsWith(prefix))) return false;
				if (RESERVED_NAME_WORDS$1.has(lowered)) return false;
				return true;
			},
			message: "Name must be kebab-case (lowercase letters, digits, hyphens), cannot start with \"anthropic-\" or \"claude-\", and cannot be a reserved CLI word."
		}
	},
	/**
	* Human-readable label shown in the LibreChat UI (skill list, detail
	* header, sharing dialogs). NOT sent to Claude and NOT used to trigger
	* the skill — `name` + `description` drive triggering. Purely cosmetic:
	* useful when the author wants a prettier label than the kebab-case
	* identifier while keeping the identifier stable.
	*/
	displayTitle: {
		type: String,
		maxlength: [SKILL_DISPLAY_TITLE_MAX_LENGTH$1, `Display title cannot exceed ${SKILL_DISPLAY_TITLE_MAX_LENGTH$1} characters`]
	},
	/**
	* "When to use this skill" sentence that Claude reads from the system
	* prompt to decide whether to invoke the skill. This is the highest-
	* leverage field for triggering accuracy — a vague description causes
	* undertriggering. Denormalized from the YAML frontmatter for indexed
	* querying.
	*/
	description: {
		type: String,
		required: true,
		maxlength: [SKILL_DESCRIPTION_MAX_LENGTH$1, `Description cannot exceed ${SKILL_DESCRIPTION_MAX_LENGTH$1} characters`]
	},
	/** The SKILL.md body (markdown after the YAML frontmatter). */
	body: {
		type: String,
		default: "",
		maxlength: [SKILL_BODY_MAX_LENGTH$1, `Body cannot exceed ${SKILL_BODY_MAX_LENGTH$1} characters`]
	},
	/**
	* Structured YAML frontmatter bag (everything except `name`/`description`,
	* which live as first-class columns). Validated in strict mode against
	* `validateSkillFrontmatter` before write — unknown keys are rejected
	* so any expansion of the allowed set is an explicit code change.
	*/
	frontmatter: {
		type: Schema.Types.Mixed,
		default: {}
	},
	/**
	* When `true`, the model cannot invoke this skill via the `skill` tool
	* and the skill is excluded from the catalog injected into the agent's
	* additional_instructions. Manual `$` invocation is unaffected. Mirrors
	* the `disable-model-invocation` frontmatter field. Filtering currently
	* happens application-side after `listSkillsByAccess` returns, so no
	* index — add one if/when a query starts filtering by this column at
	* the DB level.
	*/
	disableModelInvocation: {
		type: Boolean,
		default: false
	},
	/**
	* When `false`, the skill is hidden from the `$` popover and rejected
	* by the manual-invocation resolver. Defaults to `true` so existing
	* skills remain user-invocable without a migration. Mirrors the
	* `user-invocable` frontmatter field.
	*/
	userInvocable: {
		type: Boolean,
		default: true
	},
	/**
	* Skill-declared tool allowlist forwarded verbatim from frontmatter.
	* Surfaced on resolved skill primes so the agent's effective tool set
	* for the turn can union these in alongside the agent-configured tools.
	* `default: undefined` (not `[]`) preserves the distinction between
	* "author declared no extras" and "author explicitly declared none".
	*
	* Phase 6 wires this in for **manually-primed** skills (Phase 5's
	* always-apply primes will pass through the same union once that
	* resolver lands). Model-invoked skills (via the `skill` tool
	* mid-turn) do NOT trigger tool union at execution time — adding a
	* tool partway through a turn would require a graph rebuild that
	* isn't worth the complexity for v1. If the author wants the model
	* to have access to extra tools when the model picks the skill, they
	* should add those tools to the agent directly.
	*/
	allowedTools: {
		type: [String],
		default: void 0
	},
	category: {
		type: String,
		default: "",
		index: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true
	},
	authorName: {
		type: String,
		required: true
	},
	version: {
		type: Number,
		default: 1,
		min: 1
	},
	/**
	* Provenance of this skill's canonical definition.
	*
	* - `inline` — authored directly inside LibreChat.
	* - `github` — mirrored from a configured GitHub skill sync source.
	* - `notion` — reserved for future external sync integrations.
	*/
	source: {
		type: String,
		enum: [
			"inline",
			"github",
			"notion"
		],
		default: "inline"
	},
	/**
	* Arbitrary JSON provenance payload keyed by `source`. GitHub sync stores
	* source id, upstream path, commit/blob SHAs, and sync status here.
	*/
	sourceMetadata: { type: Schema.Types.Mixed },
	fileCount: {
		type: Number,
		default: 0,
		min: 0
	},
	/**
	* When `true`, the skill's SKILL.md body is auto-primed into every turn
	* without user `$` invocation or model discretion. Mirrors the
	* always-apply YAML frontmatter field and is kept as a first-class
	* column so the `listAlwaysApplySkills` query at the top of every
	* request is an indexed lookup, not a frontmatter scan.
	*/
	alwaysApply: {
		type: Boolean,
		default: false,
		index: true
	},
	tenantId: {
		type: String,
		index: true
	}
}, { timestamps: true });
skillSchema.index({
	author: 1,
	tenantId: 1
});
skillSchema.index({
	category: 1,
	updatedAt: -1
});
skillSchema.index({
	updatedAt: -1,
	_id: 1
});
skillSchema.index({
	name: 1,
	author: 1,
	tenantId: 1
}, { unique: true });
skillSchema.index({
	source: 1,
	"sourceMetadata.upstreamId": 1,
	tenantId: 1
});
skillSchema.index({
	source: 1,
	"sourceMetadata.sourceId": 1,
	tenantId: 1
});
//#endregion
//#region src/models/skill.ts
function createSkillModel(mongoose) {
	applyTenantIsolation(skillSchema);
	return mongoose.models.Skill || mongoose.model("Skill", skillSchema);
}
//#endregion
//#region src/models/group.ts
function createGroupModel(mongoose) {
	applyTenantIsolation(groupSchema);
	return mongoose.models.Group || mongoose.model("Group", groupSchema);
}
//#endregion
//#region src/models/user.ts
function createUserModel(mongoose) {
	applyTenantIsolation(userSchema);
	return mongoose.models.User || mongoose.model("User", userSchema);
}
//#endregion
//#region src/models/role.ts
function createRoleModel(mongoose) {
	applyTenantIsolation(roleSchema);
	return mongoose.models.Role || mongoose.model("Role", roleSchema);
}
//#endregion
//#region src/models/file.ts
function createFileModel(mongoose) {
	applyTenantIsolation(file);
	return mongoose.models.File || mongoose.model("File", file);
}
//#endregion
//#region src/models/key.ts
function createKeyModel(mongoose) {
	applyTenantIsolation(keySchema);
	return mongoose.models.Key || mongoose.model("Key", keySchema);
}
//#endregion
//#region src/models/index.ts
/**
* Creates all database models for all collections
*/
function createModels(mongoose) {
	return {
		User: createUserModel(mongoose),
		Token: createTokenModel(mongoose),
		Session: createSessionModel(mongoose),
		Balance: createBalanceModel(mongoose),
		Conversation: createConversationModel(mongoose),
		ChatProject: createChatProjectModel(mongoose),
		Message: createMessageModel(mongoose),
		Agent: createAgentModel(mongoose),
		AgentApiKey: createAgentApiKeyModel(mongoose),
		AgentCategory: createAgentCategoryModel(mongoose),
		MCPServer: createMCPServerModel(mongoose),
		Role: createRoleModel(mongoose),
		Action: createActionModel(mongoose),
		Assistant: createAssistantModel(mongoose),
		File: createFileModel(mongoose),
		Banner: createBannerModel(mongoose),
		Key: createKeyModel(mongoose),
		PluginAuth: createPluginAuthModel(mongoose),
		Transaction: createTransactionModel(mongoose),
		Preset: createPresetModel(mongoose),
		Prompt: createPromptModel(mongoose),
		PromptGroup: createPromptGroupModel(mongoose),
		Skill: createSkillModel(mongoose),
		SkillFile: createSkillFileModel(mongoose),
		SkillSyncCredential: createSkillSyncCredentialModel(mongoose),
		SkillSyncStatus: createSkillSyncStatusModel(mongoose),
		ConversationTag: createConversationTagModel(mongoose),
		SharedLink: createSharedLinkModel(mongoose),
		ToolCall: createToolCallModel(mongoose),
		MemoryEntry: createMemoryModel(mongoose),
		AccessRole: createAccessRoleModel(mongoose),
		AclEntry: createAclEntryModel(mongoose),
		SystemGrant: createSystemGrantModel(mongoose),
		AuditLog: createAuditLogModel(mongoose),
		Group: createGroupModel(mongoose),
		Config: createConfigModel(mongoose)
	};
}
//#endregion
//#region src/methods/session.ts
var SessionError = class extends Error {
	constructor(message, code = "SESSION_ERROR") {
		super(message);
		this.name = "SessionError";
		this.code = code;
	}
};
/** Default refresh token expiry: 7 days in milliseconds */
const DEFAULT_REFRESH_TOKEN_EXPIRY = 1e3 * 60 * 60 * 24 * 7;
function createSessionMethods(mongoose) {
	/**
	* Creates a new session for a user
	*/
	async function createSession(userId, options = {}) {
		if (!userId) throw new SessionError("User ID is required", "INVALID_USER_ID");
		const expiresIn = options.expiresIn ?? 6048e5;
		try {
			const Session = mongoose.models.Session;
			const currentSession = new Session({
				user: userId,
				expiration: options.expiration || new Date(Date.now() + expiresIn)
			});
			return {
				session: currentSession,
				refreshToken: await generateRefreshToken(currentSession)
			};
		} catch (error) {
			logger.error("[createSession] Error creating session:", error);
			throw new SessionError("Failed to create session", "CREATE_SESSION_FAILED");
		}
	}
	/**
	* Finds a session by various parameters
	*/
	async function findSession(params, options = { lean: true }) {
		try {
			const Session = mongoose.models.Session;
			const query = {};
			if (!params.refreshToken && !params.userId && !params.sessionId) throw new SessionError("At least one search parameter is required", "INVALID_SEARCH_PARAMS");
			if (params.refreshToken) query.refreshTokenHash = await hashToken(params.refreshToken);
			if (params.userId) query.user = params.userId;
			if (params.sessionId) {
				const sessionId = typeof params.sessionId === "object" && params.sessionId !== null && "sessionId" in params.sessionId ? params.sessionId.sessionId : params.sessionId;
				if (!mongoose.Types.ObjectId.isValid(sessionId)) throw new SessionError("Invalid session ID format", "INVALID_SESSION_ID");
				query._id = sessionId;
			}
			query.expiration = { $gt: /* @__PURE__ */ new Date() };
			const sessionQuery = Session.findOne(query);
			if (options.lean) return await sessionQuery.lean();
			return await sessionQuery.exec();
		} catch (error) {
			logger.error("[findSession] Error finding session:", error);
			throw new SessionError("Failed to find session", "FIND_SESSION_FAILED");
		}
	}
	/**
	* Updates session expiration
	*/
	async function updateExpiration(session, newExpiration, options = {}) {
		const expiresIn = options.expiresIn ?? 6048e5;
		try {
			const Session = mongoose.models.Session;
			const sessionDoc = typeof session === "string" ? await Session.findById(session) : session;
			if (!sessionDoc) throw new SessionError("Session not found", "SESSION_NOT_FOUND");
			sessionDoc.expiration = newExpiration || new Date(Date.now() + expiresIn);
			return await sessionDoc.save();
		} catch (error) {
			logger.error("[updateExpiration] Error updating session:", error);
			throw new SessionError("Failed to update session expiration", "UPDATE_EXPIRATION_FAILED");
		}
	}
	/**
	* Deletes a session by refresh token or session ID
	*/
	async function deleteSession(params) {
		try {
			const Session = mongoose.models.Session;
			if (!params.refreshToken && !params.sessionId) throw new SessionError("Either refreshToken or sessionId is required", "INVALID_DELETE_PARAMS");
			const query = {};
			if (params.refreshToken) query.refreshTokenHash = await hashToken(params.refreshToken);
			if (params.sessionId) query._id = params.sessionId;
			const result = await Session.deleteOne(query);
			if (result.deletedCount === 0) logger.warn("[deleteSession] No session found to delete");
			return result;
		} catch (error) {
			logger.error("[deleteSession] Error deleting session:", error);
			throw new SessionError("Failed to delete session", "DELETE_SESSION_FAILED");
		}
	}
	/**
	* Deletes all sessions for a user
	*/
	async function deleteAllUserSessions(userId, options = {}) {
		try {
			const Session = mongoose.models.Session;
			if (!userId) throw new SessionError("User ID is required", "INVALID_USER_ID");
			const userIdString = typeof userId === "object" && userId !== null ? userId.userId : userId;
			if (!mongoose.Types.ObjectId.isValid(userIdString)) throw new SessionError("Invalid user ID format", "INVALID_USER_ID_FORMAT");
			const query = { user: userIdString };
			if (options.excludeCurrentSession && options.currentSessionId) query._id = { $ne: options.currentSessionId };
			const result = await Session.deleteMany(query);
			if (result.deletedCount && result.deletedCount > 0) logger.debug(`[deleteAllUserSessions] Deleted ${result.deletedCount} sessions for user ${userIdString}.`);
			return result;
		} catch (error) {
			logger.error("[deleteAllUserSessions] Error deleting user sessions:", error);
			throw new SessionError("Failed to delete user sessions", "DELETE_ALL_SESSIONS_FAILED");
		}
	}
	/**
	* Generates a refresh token for a session
	*/
	async function generateRefreshToken(session) {
		if (!session || !session.user) throw new SessionError("Invalid session object", "INVALID_SESSION");
		try {
			const expiresIn = session.expiration ? session.expiration.getTime() : Date.now() + DEFAULT_REFRESH_TOKEN_EXPIRY;
			if (!session.expiration) session.expiration = new Date(expiresIn);
			const refreshToken = await signPayload({
				payload: {
					id: session.user,
					sessionId: session._id
				},
				secret: process.env.JWT_REFRESH_SECRET,
				expirationTime: Math.floor((expiresIn - Date.now()) / 1e3)
			});
			session.refreshTokenHash = await hashToken(refreshToken);
			await session.save();
			return refreshToken;
		} catch (error) {
			logger.error("[generateRefreshToken] Error generating refresh token:", error);
			throw new SessionError("Failed to generate refresh token", "GENERATE_TOKEN_FAILED");
		}
	}
	/**
	* Counts active sessions for a user
	*/
	async function countActiveSessions(userId) {
		try {
			const Session = mongoose.models.Session;
			if (!userId) throw new SessionError("User ID is required", "INVALID_USER_ID");
			return await Session.countDocuments({
				user: userId,
				expiration: { $gt: /* @__PURE__ */ new Date() }
			});
		} catch (error) {
			logger.error("[countActiveSessions] Error counting active sessions:", error);
			throw new SessionError("Failed to count active sessions", "COUNT_SESSIONS_FAILED");
		}
	}
	return {
		findSession,
		SessionError,
		deleteSession,
		createSession,
		updateExpiration,
		countActiveSessions,
		generateRefreshToken,
		deleteAllUserSessions
	};
}
//#endregion
//#region src/methods/user.ts
/** Default JWT session expiry: 15 minutes in milliseconds */
const DEFAULT_SESSION_EXPIRY = 1e3 * 60 * 15;
/** Factory function that takes mongoose instance and returns the methods */
function createUserMethods(mongoose) {
	/**
	* Normalizes email fields in search criteria to lowercase and trimmed.
	* Handles both direct email fields and $or arrays containing email conditions.
	*/
	function normalizeEmailInCriteria(criteria) {
		const normalized = { ...criteria };
		if (typeof normalized.email === "string") normalized.email = normalized.email.trim().toLowerCase();
		if (Array.isArray(normalized.$or)) normalized.$or = normalized.$or.map((condition) => {
			if (typeof condition.email === "string") return {
				...condition,
				email: condition.email.trim().toLowerCase()
			};
			return condition;
		});
		return normalized;
	}
	/**
	* Search for a single user based on partial data and return matching user document as plain object.
	* Email fields in searchCriteria are automatically normalized to lowercase for case-insensitive matching.
	*/
	async function findUser(searchCriteria, fieldsToSelect) {
		const User = mongoose.models.User;
		const normalizedCriteria = normalizeEmailInCriteria(searchCriteria);
		const query = User.findOne(normalizedCriteria);
		if (fieldsToSelect) query.select(fieldsToSelect);
		return await query.lean();
	}
	async function findUsers(searchCriteria, fieldsToSelect, options) {
		const User = mongoose.models.User;
		const normalizedCriteria = normalizeEmailInCriteria(searchCriteria);
		const query = User.find(normalizedCriteria);
		if (fieldsToSelect) query.select(fieldsToSelect);
		if (options?.sort != null) query.sort(options.sort);
		if (options?.offset != null) query.skip(options.offset);
		if (options?.limit != null && options.limit > 0) query.limit(options.limit);
		return await query.lean();
	}
	/**
	* Count the number of user documents in the collection based on the provided filter.
	*/
	async function countUsers(filter = {}) {
		return await mongoose.models.User.countDocuments(filter);
	}
	/**
	* Creates a new user, optionally with a TTL of 1 week.
	*/
	async function createUser(data, balanceConfig, disableTTL = true, returnUser = false) {
		const User = mongoose.models.User;
		const Balance = mongoose.models.Balance;
		const userData = {
			...data,
			expiresAt: disableTTL ? void 0 : new Date(Date.now() + 604800 * 1e3)
		};
		if (disableTTL) delete userData.expiresAt;
		const user = await User.create(userData);
		if (balanceConfig?.enabled && balanceConfig?.startBalance) {
			const update = { $inc: { tokenCredits: balanceConfig.startBalance } };
			if (balanceConfig.autoRefillEnabled && balanceConfig.refillIntervalValue != null && balanceConfig.refillIntervalUnit != null && balanceConfig.refillAmount != null) update.$set = {
				autoRefillEnabled: true,
				refillIntervalValue: balanceConfig.refillIntervalValue,
				refillIntervalUnit: balanceConfig.refillIntervalUnit,
				refillAmount: balanceConfig.refillAmount
			};
			await Balance.findOneAndUpdate({ user: user._id }, update, {
				upsert: true,
				new: true
			}).lean();
		}
		if (returnUser) return user.toObject();
		return user._id;
	}
	/**
	* Update a user with new data without overwriting existing properties.
	*/
	async function updateUser(userId, updateData) {
		const User = mongoose.models.User;
		const updateOperation = {
			$set: updateData,
			$unset: { expiresAt: "" }
		};
		return await User.findByIdAndUpdate(userId, updateOperation, {
			new: true,
			runValidators: true
		}).lean();
	}
	/**
	* Retrieve a user by ID and convert the found user document to a plain object.
	*/
	async function getUserById(userId, fieldsToSelect) {
		const query = mongoose.models.User.findById(userId);
		if (fieldsToSelect) query.select(fieldsToSelect);
		return await query.lean();
	}
	/**
	* Delete a user by their unique ID.
	*/
	async function deleteUserById(userId) {
		try {
			const result = await mongoose.models.User.deleteOne({ _id: userId });
			if (result.deletedCount === 0) return {
				deletedCount: 0,
				message: "No user found with that ID."
			};
			return {
				deletedCount: result.deletedCount,
				message: "User was deleted successfully."
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error("Error deleting user: " + errorMessage);
		}
	}
	/**
	* Generates a JWT token for a given user.
	* @param user - The user object
	* @param expiresIn - Optional expiry time in milliseconds. Default: 15 minutes
	*/
	async function generateToken(user, expiresIn) {
		if (!user) throw new Error("No user provided");
		const expires = expiresIn ?? 9e5;
		return await signPayload({
			payload: {
				id: user._id,
				username: user.username,
				provider: user.provider,
				email: user.email
			},
			secret: process.env.JWT_SECRET,
			expirationTime: expires / 1e3
		});
	}
	/**
	* Update a user's personalization memories setting.
	* Handles the edge case where the personalization object doesn't exist.
	*/
	async function toggleUserMemories(userId, memoriesEnabled) {
		const User = mongoose.models.User;
		if (!await User.findById(userId)) return null;
		const updateOperation = { $set: { "personalization.memories": memoriesEnabled } };
		return await User.findByIdAndUpdate(userId, updateOperation, {
			new: true,
			runValidators: true
		}).lean();
	}
	/**
	* Search for users by pattern matching on name, email, or username (case-insensitive)
	* @param searchPattern - The pattern to search for
	* @param limit - Maximum number of results to return
	* @param fieldsToSelect - The fields to include or exclude in the returned documents
	* @returns Array of matching user documents
	*/
	const searchUsers = async function({ searchPattern, limit = 20, fieldsToSelect = null }) {
		if (!searchPattern || searchPattern.trim().length === 0) return [];
		const trimmedPattern = searchPattern.trim();
		const regex = new RegExp(escapeRegExp(trimmedPattern), "i");
		const query = mongoose.models.User.find({ $or: [
			{ email: regex },
			{ name: regex },
			{ username: regex }
		] }).limit(limit * 2);
		if (fieldsToSelect) query.select(fieldsToSelect);
		const users = await query.lean();
		const startsWithPattern = trimmedPattern.toLowerCase();
		/** Top results sorted by relevance */
		return users.map((user) => {
			const searchableFields = [
				user.name,
				user.email,
				user.username
			].filter((field) => typeof field === "string" && field.length > 0);
			let maxScore = 0;
			for (const field of searchableFields) {
				const fieldLower = field.toLowerCase();
				let score = 0;
				if (fieldLower === startsWithPattern) score = 100;
				else if (fieldLower.startsWith(startsWithPattern)) score = 80;
				else if (fieldLower.includes(startsWithPattern)) score = 50;
				else score = 10;
				maxScore = Math.max(maxScore, score);
			}
			return {
				...user,
				_searchScore: maxScore
			};
		}).sort((a, b) => b._searchScore - a._searchScore).slice(0, limit).map((user) => {
			const { _searchScore, ...userWithoutScore } = user;
			return userWithoutScore;
		});
	};
	/**
	* Updates the plugins for a user based on the action specified (install/uninstall).
	* @param userId - The user ID whose plugins are to be updated
	* @param plugins - The current plugins array
	* @param pluginKey - The key of the plugin to install or uninstall
	* @param action - The action to perform, 'install' or 'uninstall'
	* @returns The result of the update operation or null if action is invalid
	*/
	async function updateUserPlugins(userId, plugins, pluginKey, action) {
		const userPlugins = plugins ?? [];
		if (action === "install") return updateUser(userId, { plugins: [...userPlugins, pluginKey] });
		if (action === "uninstall") return updateUser(userId, { plugins: userPlugins.filter((plugin) => plugin !== pluginKey) });
		return null;
	}
	return {
		findUser,
		findUsers,
		countUsers,
		createUser,
		updateUser,
		searchUsers,
		getUserById,
		generateToken,
		deleteUserById,
		updateUserPlugins,
		toggleUserMemories
	};
}
//#endregion
//#region src/methods/file.ts
function withOwnerScope(filter, ownerScope) {
	if (!ownerScope) return filter;
	const scopedFilter = {
		...filter,
		user: ownerScope.userId
	};
	if (ownerScope.tenantId) scopedFilter.tenantId = ownerScope.tenantId;
	return scopedFilter;
}
/** Factory function that takes mongoose instance and returns the file methods */
function createFileMethods(mongoose) {
	/**
	* Finds a file by its file_id with additional query options.
	* @param file_id - The unique identifier of the file
	* @param options - Query options for filtering, projection, etc.
	* @returns A promise that resolves to the file document or null
	*/
	async function findFileById(file_id, options = {}) {
		return mongoose.models.File.findOne({
			file_id,
			...options
		}).lean();
	}
	/**
	* Retrieves files matching a given filter, sorted by the most recently updated.
	* @param filter - The filter criteria to apply
	* @param _sortOptions - Optional sort parameters
	* @param selectFields - Fields to include/exclude in the query results. Default excludes the 'text' field
	* @param options - Additional query options (userId, agentId for ACL)
	* @returns A promise that resolves to an array of file documents
	*/
	async function getFiles(filter, _sortOptions, selectFields) {
		const File = mongoose.models.File;
		const sortOptions = {
			updatedAt: -1,
			..._sortOptions
		};
		const query = File.find(filter);
		if (selectFields != null) query.select(selectFields);
		else query.select({ text: 0 });
		return await query.sort(sortOptions).lean();
	}
	async function getExpiredFiles(limit = 100, now = /* @__PURE__ */ new Date()) {
		return await mongoose.models.File.find({ expiredAt: {
			$ne: null,
			$lte: now
		} }).sort({ expiredAt: 1 }).limit(limit).lean();
	}
	/**
	* Retrieves tool files (files that are embedded or have a fileIdentifier) from an array of file IDs.
	* Note: execute_code files are handled separately by getCodeGeneratedFiles.
	* @param fileIds - Array of file_id strings to search for
	* @param toolResourceSet - Optional filter for tool resources
	* @returns Files that match the criteria
	*/
	async function getToolFilesByIds(fileIds, toolResourceSet, ownerScope) {
		if (!fileIds || !fileIds.length || !toolResourceSet?.size) return [];
		try {
			const orConditions = [];
			if (toolResourceSet.has(EToolResources.context)) orConditions.push({
				text: {
					$exists: true,
					$ne: null
				},
				context: FileContext.agents
			});
			if (toolResourceSet.has(EToolResources.file_search)) orConditions.push({ embedded: true });
			if (orConditions.length === 0) return [];
			return await getFiles(withOwnerScope({
				file_id: { $in: fileIds },
				context: { $ne: FileContext.execute_code },
				$or: orConditions
			}, ownerScope), { updatedAt: -1 }, { text: 0 }) ?? [];
		} catch (error) {
			logger.error("[getToolFilesByIds] Error retrieving tool files:", error);
			throw new Error("Error retrieving tool files");
		}
	}
	/**
	* Retrieves files generated by code execution for a given conversation.
	* These files are stored locally with `metadata.codeEnvRef` for code env re-upload.
	*
	* Filtered by `file_id IN threadFileIds` (the file_ids referenced from
	* messages in the current thread's `files` arrays) rather than by
	* `messageId IN threadMessageIds` (the File record's own creator id).
	* This mirrors `getUserCodeFiles` and fixes the branched-conversation
	* case where:
	*   1. Sibling A creates `output.csv` via processCodeOutput → File
	*      record persists with `messageId = A`.
	*   2. Sibling N (a regeneration of A's parent) recreates `output.csv`.
	*      `claimCodeFile` is keyed by `(filename, conversationId, context)`
	*      and finds A's record; `processCodeOutput` deliberately preserves
	*      A's `messageId` to keep file→original-creator provenance intact.
	*   3. Turn N+1's user message has `parentMessageId = N` (sibling of A).
	*      `getThreadData` walks back from N: thread = [N, root]. A is
	*      NOT in that thread, so a `messageId IN [N, root]` filter
	*      excludes the file.
	* The message at N references the file via `messages.files = [...]`,
	* so `threadFileIds` (collected from that array during thread walk)
	* DOES include the file_id. Filtering by that key reaches the right
	* file regardless of which sibling first created it.
	*
	* @param conversationId - The conversation ID to search for
	* @param threadFileIds - Array of file_ids referenced by messages in
	*   the current thread (collected from `messages.files[].file_id`).
	*   While technically optional, this function returns empty if not
	*   provided — code-generated files must be filtered by thread to
	*   avoid pulling in files from other branches of a conversation.
	* @returns Files generated by code execution in the conversation,
	*   filtered to those referenced by the current thread.
	*/
	async function getCodeGeneratedFiles(conversationId, threadFileIds, ownerScope) {
		if (!conversationId) return [];
		/**
		* Return early if threadFileIds not provided — same rationale as
		* the messageIds-based predecessor: code-generated files must be
		* filtered by thread to ensure we only return files relevant to
		* the current conversation branch, not orphaned files from other
		* branches or deleted messages.
		*/
		if (!threadFileIds || threadFileIds.length === 0) return [];
		try {
			return await getFiles(withOwnerScope({
				conversationId,
				context: FileContext.execute_code,
				file_id: { $in: threadFileIds },
				"metadata.codeEnvRef": { $exists: true }
			}, ownerScope), { createdAt: 1 }, { text: 0 }) ?? [];
		} catch (error) {
			logger.error("[getCodeGeneratedFiles] Error retrieving code generated files:", error);
			return [];
		}
	}
	/**
	* Retrieves user-uploaded execute_code files (not code-generated) by their file IDs.
	* These are files with fileIdentifier metadata but context is NOT execute_code (e.g., agents or message_attachment).
	* File IDs should be collected from message.files arrays in the current thread.
	* @param fileIds - Array of file IDs to fetch (from message.files in the thread)
	* @param ownerScope - Authenticated owner scope used to constrain historical refs
	* @returns User-uploaded execute_code files
	*/
	async function getUserCodeFiles(fileIds, ownerScope) {
		if (!fileIds || fileIds.length === 0) return [];
		try {
			return await getFiles(withOwnerScope({
				file_id: { $in: fileIds },
				context: { $ne: FileContext.execute_code },
				"metadata.codeEnvRef": { $exists: true }
			}, ownerScope), { createdAt: 1 }, { text: 0 }) ?? [];
		} catch (error) {
			logger.error("[getUserCodeFiles] Error retrieving user code files:", error);
			return [];
		}
	}
	/**
	* Atomically claims a file_id for a code-execution output by compound key.
	* Uses $setOnInsert so concurrent calls for the same (filename, conversationId)
	* converge on a single record instead of creating duplicates.
	*/
	async function claimCodeFile(data) {
		const File = mongoose.models.File;
		const tenantFilter = data.tenantId ? { tenantId: data.tenantId } : { tenantId: null };
		const insertData = data.tenantId ? {
			file_id: data.file_id,
			user: data.user,
			tenantId: data.tenantId
		} : {
			file_id: data.file_id,
			user: data.user
		};
		const result = await File.findOneAndUpdate({
			filename: data.filename,
			conversationId: data.conversationId,
			context: FileContext.execute_code,
			...tenantFilter
		}, { $setOnInsert: insertData }, {
			upsert: true,
			new: true
		}).lean();
		if (!result) throw new Error(`[claimCodeFile] Failed to claim file "${data.filename}" for conversation ${data.conversationId}`);
		return result;
	}
	/**
	* Creates a new file with a TTL of 1 hour.
	* @param data - The file data to be created, must contain file_id
	* @param disableTTL - Whether to disable the TTL
	* @returns A promise that resolves to the created file document
	*/
	async function createFile(data, disableTTL) {
		const File = mongoose.models.File;
		const fileData = {
			...data,
			expiresAt: new Date(Date.now() + 3600 * 1e3)
		};
		if (disableTTL) delete fileData.expiresAt;
		return File.findOneAndUpdate({ file_id: data.file_id }, fileData, {
			new: true,
			upsert: true
		}).lean();
	}
	/**
	* Updates a file identified by file_id with new data and removes the TTL.
	*
	* `extraFilter` extends the by-id query with additional conditions
	* (e.g. `{ previewRevision: '<expected uuid>' }`). When provided, the
	* update is conditional — it commits only if the document still
	* matches the extra filter, returning `null` otherwise. Used by the
	* deferred-preview render to guard against an older render of the
	* same `file_id` overwriting a newer turn's record on cross-turn
	* filename reuse.
	*
	* @param data - The data to update, must contain file_id
	* @param extraFilter - Optional extra equality filter merged into the query.
	* @returns A promise that resolves to the updated file document, or
	*   null if the conditional filter excluded it (or the file was
	*   deleted).
	*/
	async function updateFile(data, extraFilter) {
		const File = mongoose.models.File;
		const { file_id, ...update } = data;
		const updateOperation = {
			$set: update,
			$unset: { expiresAt: "" }
		};
		const query = extraFilter ? {
			file_id,
			...extraFilter
		} : { file_id };
		return File.findOneAndUpdate(query, updateOperation, { new: true }).lean();
	}
	/**
	* Increments the usage of a file identified by file_id.
	* @param data - The data to update, must contain file_id and the increment value for usage
	* @returns A promise that resolves to the updated file document
	*/
	async function updateFileUsage(data) {
		const File = mongoose.models.File;
		const { file_id, inc = 1, user, tenantId } = data;
		const updateOperation = {
			$inc: { usage: inc },
			$unset: {
				expiresAt: "",
				temp_file_id: ""
			}
		};
		const query = user ? withOwnerScope({ file_id }, {
			userId: user,
			tenantId
		}) : { file_id };
		return File.findOneAndUpdate(query, updateOperation, { new: true }).lean();
	}
	/**
	* Deletes a file identified by file_id.
	* @param file_id - The unique identifier of the file to delete
	* @returns A promise that resolves to the deleted file document or null
	*/
	async function deleteFile(file_id) {
		return mongoose.models.File.findOneAndDelete({ file_id }).lean();
	}
	/**
	* Deletes a file identified by a filter.
	* @param filter - The filter criteria to apply
	* @returns A promise that resolves to the deleted file document or null
	*/
	async function deleteFileByFilter(filter) {
		return mongoose.models.File.findOneAndDelete(filter).lean();
	}
	/**
	* Deletes multiple files identified by an array of file_ids.
	* @param file_ids - The unique identifiers of the files to delete
	* @param user - Optional user ID to filter by
	* @returns A promise that resolves to the result of the deletion operation
	*/
	async function deleteFiles(file_ids, user) {
		const File = mongoose.models.File;
		let deleteQuery = { file_id: { $in: file_ids } };
		if (user) deleteQuery = { user };
		return File.deleteMany(deleteQuery);
	}
	/**
	* Batch updates files with new signed URLs in MongoDB
	* @param updates - Array of updates in the format { file_id, filepath, storageKey?, storageRegion? }
	*/
	async function batchUpdateFiles(updates) {
		if (!updates || updates.length === 0) return;
		const File = mongoose.models.File;
		const result = await tenantSafeBulkWrite(File, updates.map((update) => ({ updateOne: {
			filter: { file_id: update.file_id },
			update: { $set: {
				filepath: update.filepath,
				...update.storageKey ? { storageKey: update.storageKey } : {},
				...update.storageRegion ? { storageRegion: update.storageRegion } : {}
			} }
		} })));
		logger.info(`Updated ${result.modifiedCount} files with new S3 URLs`);
	}
	/**
	* Updates usage tracking for multiple files.
	* Processes files and optional fileIds, updating their usage count in the database.
	*
	* @param files - Array of file objects to process
	* @param fileIds - Optional array of file IDs to process
	* @returns Array of updated file documents (with null results filtered out)
	*/
	async function updateFilesUsage(files, fileIds, options) {
		const promises = [];
		const seen = /* @__PURE__ */ new Set();
		const user = options?.user;
		const tenantId = options?.tenantId;
		for (const file of files) {
			const { file_id } = file;
			if (seen.has(file_id)) continue;
			seen.add(file_id);
			promises.push(updateFileUsage({
				file_id,
				user,
				tenantId
			}));
		}
		if (!fileIds) return (await Promise.all(promises)).filter((result) => result != null);
		for (const file_id of fileIds) {
			if (seen.has(file_id)) continue;
			seen.add(file_id);
			promises.push(updateFileUsage({
				file_id,
				user,
				tenantId
			}));
		}
		return (await Promise.all(promises)).filter((result) => result != null);
	}
	/**
	* Mark stale `status: 'pending'` file records as `'failed'` with
	* `previewError: 'orphaned'`. Recovers from the one case the
	* in-process deferred-preview render can't handle on its own: a
	* backend restart mid-render loses the in-memory promise, leaving
	* the record stuck pending forever.
	*
	* Cheap to run on boot — the `status` field is indexed and the typical
	* cutoff (5 min) bounds the candidate set to whatever was in flight at
	* the prior shutdown. The 60s render timeout means anything older
	* than a few minutes that's still pending is definitively orphaned.
	*
	* @param maxAgeMs - Cutoff in milliseconds; records whose `updatedAt`
	*   is older than `now - maxAgeMs` are marked failed. Defaults to 5
	*   minutes (well above the 60s render ceiling).
	* @returns Number of records updated.
	*/
	async function sweepOrphanedPreviews(maxAgeMs = 300 * 1e3) {
		const File = mongoose.models.File;
		const cutoff = new Date(Date.now() - maxAgeMs);
		const result = await File.updateMany({
			status: "pending",
			updatedAt: { $lt: cutoff }
		}, { $set: {
			status: "failed",
			previewError: "orphaned"
		} });
		if (result.modifiedCount > 0) logger.info(`[sweepOrphanedPreviews] Marked ${result.modifiedCount} stale 'pending' files as 'failed' (cutoff: ${cutoff.toISOString()})`);
		return result.modifiedCount ?? 0;
	}
	return {
		findFileById,
		getFiles,
		getExpiredFiles,
		getToolFilesByIds,
		getCodeGeneratedFiles,
		getUserCodeFiles,
		claimCodeFile,
		createFile,
		updateFile,
		updateFileUsage,
		deleteFile,
		deleteFiles,
		deleteFileByFilter,
		batchUpdateFiles,
		updateFilesUsage,
		sweepOrphanedPreviews
	};
}
//#endregion
//#region src/methods/token.ts
function createTokenMethods(mongoose) {
	/**
	* Creates a new Token instance.
	*/
	async function createToken(tokenData) {
		try {
			const Token = mongoose.models.Token;
			const currentTime = /* @__PURE__ */ new Date();
			const expiresAt = new Date(currentTime.getTime() + tokenData.expiresIn * 1e3);
			const newTokenData = {
				...tokenData,
				createdAt: currentTime,
				expiresAt
			};
			return await Token.create(newTokenData);
		} catch (error) {
			logger.debug("An error occurred while creating token:", error);
			throw error;
		}
	}
	/**
	* Updates a Token document that matches the provided query.
	*/
	async function updateToken(query, updateData) {
		try {
			const Token = mongoose.models.Token;
			const dataToUpdate = { ...updateData };
			if (updateData?.expiresIn !== void 0) dataToUpdate.expiresAt = new Date(Date.now() + updateData.expiresIn * 1e3);
			return await Token.findOneAndUpdate(query, dataToUpdate, { new: true });
		} catch (error) {
			logger.debug("An error occurred while updating token:", error);
			throw error;
		}
	}
	/** Deletes all Token documents matching every provided field (AND semantics). */
	async function deleteTokens(query) {
		try {
			const Token = mongoose.models.Token;
			const conditions = [];
			if (query.userId !== void 0) conditions.push({ userId: query.userId });
			if (query.token !== void 0) conditions.push({ token: query.token });
			if (query.email !== void 0) {
				const email = query.email === null ? null : query.email.trim().toLowerCase();
				conditions.push({ email });
			}
			if (query.type !== void 0) conditions.push({ type: query.type });
			if (query.identifier !== void 0) conditions.push({ identifier: query.identifier });
			if (conditions.length === 0) throw new Error("At least one query parameter must be provided");
			return await Token.deleteMany({ $and: conditions });
		} catch (error) {
			logger.debug("An error occurred while deleting tokens:", error);
			throw error;
		}
	}
	/**
	* Finds a Token document that matches the provided query.
	* Email is automatically normalized to lowercase for case-insensitive matching.
	*/
	async function findToken(query, options) {
		try {
			const Token = mongoose.models.Token;
			const conditions = [];
			if (query.userId) conditions.push({ userId: query.userId });
			if (query.token) conditions.push({ token: query.token });
			if (query.email !== void 0) {
				const email = query.email === null ? null : query.email.trim().toLowerCase();
				conditions.push({ email });
			}
			if (query.type !== void 0) conditions.push({ type: query.type });
			if (query.identifier !== void 0) conditions.push({ identifier: query.identifier });
			return await Token.findOne({ $and: conditions }, null, options).lean();
		} catch (error) {
			logger.debug("An error occurred while finding token:", error);
			throw error;
		}
	}
	return {
		findToken,
		createToken,
		updateToken,
		deleteTokens
	};
}
//#endregion
//#region src/methods/role.ts
const systemRoleValues = new Set(Object.values(SystemRoles));
/** Case-insensitive check — the legacy roles route uppercases params. */
function isSystemRoleName(name) {
	return systemRoleValues.has(name.toUpperCase());
}
var RoleConflictError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "RoleConflictError";
	}
};
function createRoleMethods(mongoose, deps = {}) {
	/**
	* Initialize default roles in the system.
	* Creates the default roles (ADMIN, USER) if they don't exist in the database.
	* Updates existing roles with new permission types if they're missing.
	*/
	async function initializeRoles() {
		const Role = mongoose.models.Role;
		for (const roleName of [SystemRoles.ADMIN, SystemRoles.USER]) {
			let role = await Role.findOne({ name: roleName });
			const defaultPerms = roleDefaults[roleName].permissions;
			if (!role) role = new Role({
				...roleDefaults[roleName],
				description: ""
			});
			else {
				if (role.description == null) role.description = "";
				const permissions = role.toObject()?.permissions ?? {};
				role.permissions = role.permissions || {};
				for (const permType of Object.keys(defaultPerms)) if (permissions[permType] == null || Object.keys(permissions[permType]).length === 0) role.permissions[permType] = defaultPerms[permType];
			}
			await role.save();
		}
	}
	/**
	* List all roles in the system. Returns only name and description (projected).
	*/
	async function listRoles(options) {
		const Role = mongoose.models.Role;
		const limit = options?.limit ?? 50;
		const offset = options?.offset ?? 0;
		return await Role.find({}).select("name description").sort({ name: 1 }).skip(offset).limit(limit).lean();
	}
	async function countRoles() {
		return await mongoose.models.Role.countDocuments({});
	}
	/**
	* Retrieve a role by name and convert the found role document to a plain object.
	* If the role with the given name doesn't exist and the name is a system defined role,
	* create it and return the lean version.
	*/
	async function getRoleByName(roleName, fieldsToSelect = null) {
		const cache = deps.getCache?.(CacheKeys.ROLES);
		try {
			if (cache) {
				const cachedRole = await cache.get(scopedCacheKey(roleName));
				if (cachedRole) return cachedRole;
			}
			const Role = mongoose.models.Role;
			let query = Role.findOne({ name: roleName });
			if (fieldsToSelect) query = query.select(fieldsToSelect);
			const role = await query.lean().exec();
			if (!role && systemRoleValues.has(roleName)) {
				const newRole = await new Role(roleDefaults[roleName]).save();
				if (cache) await cache.set(scopedCacheKey(roleName), newRole);
				return newRole.toObject();
			}
			if (cache) await cache.set(scopedCacheKey(roleName), role);
			return role;
		} catch (error) {
			throw new Error(`Failed to retrieve or create role: ${error.message}`);
		}
	}
	/**
	* Find roles by name without using or populating the shared role-name cache.
	* Use this for tenant-scoped authorization lookups where the active ALS tenant context must control the query.
	*
	* When a non-system tenant context is active, the tenant-isolation plugin scopes the
	* query to that tenant. When no tenant context is active (base/global users), the lookup
	* runs under an explicit system context — so strict-mode isolation does not reject the
	* context-less query — while an explicit base-role filter (`tenantId` unset) ensures a
	* base user cannot match, and be assigned, a role that only exists within some tenant.
	*/
	async function findRolesByNames(roleNames, fieldsToSelect = null) {
		try {
			const uniqueRoleNames = [...new Set(roleNames.map((roleName) => roleName.trim()).filter(Boolean))];
			if (uniqueRoleNames.length === 0) return [];
			const Role = mongoose.models.Role;
			const nameFilter = { $or: uniqueRoleNames.map((roleName) => ({ name: new RegExp(`^${escapeRegExp(roleName)}$`, "i") })) };
			const runQuery = (filter) => {
				let query = Role.find(filter);
				if (fieldsToSelect) query = query.select(fieldsToSelect);
				return query.lean().exec();
			};
			const tenantId = getTenantId();
			if (tenantId && tenantId !== "__SYSTEM__") return await runQuery(nameFilter);
			return await runAsSystem(() => runQuery({
				...nameFilter,
				tenantId: { $in: [null, void 0] }
			}));
		} catch (error) {
			throw new Error(`Failed to retrieve roles: ${error.message}`);
		}
	}
	/**
	* Update role values by name.
	*/
	async function updateRoleByName(roleName, updates) {
		const cache = deps.getCache?.(CacheKeys.ROLES);
		try {
			const role = await mongoose.models.Role.findOneAndUpdate({ name: roleName }, { $set: updates }, { new: true }).select("-__v").lean().exec();
			if (cache) if (updates.name && updates.name !== roleName) await Promise.all([cache.set(scopedCacheKey(roleName), null), cache.set(scopedCacheKey(updates.name), role)]);
			else await cache.set(scopedCacheKey(roleName), role);
			return role;
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === 11e3) throw new RoleConflictError(`Role "${updates.name ?? roleName}" already exists`);
			const updateError = /* @__PURE__ */ new Error(`Failed to update role: ${error.message}`);
			updateError.cause = error;
			throw updateError;
		}
	}
	/**
	* Updates access permissions for a specific role and multiple permission types.
	*/
	async function updateAccessPermissions(roleName, permissionsUpdate, roleData) {
		const updates = {};
		for (const [permissionType, permissions] of Object.entries(permissionsUpdate)) if (permissionsSchema.shape && permissionsSchema.shape[permissionType]) updates[permissionType] = removeNullishValues(permissions);
		if (!Object.keys(updates).length) return;
		try {
			const role = roleData ?? await getRoleByName(roleName);
			if (!role) return;
			const currentPermissions = role.permissions || {};
			const updatedPermissions = { ...currentPermissions };
			let hasChanges = false;
			const unsetFields = {};
			const permissionTypes = Object.keys(permissionsSchema.shape || {});
			for (const permType of permissionTypes) if (role[permType] && typeof role[permType] === "object") {
				logger.info(`Migrating '${roleName}' role from old schema: found '${permType}' at top level`);
				updatedPermissions[permType] = {
					...updatedPermissions[permType],
					...role[permType]
				};
				unsetFields[permType] = 1;
				hasChanges = true;
			}
			const legacySharedGlobalTypes = ["PROMPTS", "AGENTS"];
			for (const legacyPermType of legacySharedGlobalTypes) {
				const existingTypePerms = currentPermissions[legacyPermType];
				if (existingTypePerms && "SHARED_GLOBAL" in existingTypePerms && !("SHARE" in existingTypePerms) && updates[legacyPermType] && !("SHARE" in updates[legacyPermType])) {
					const inheritedValue = existingTypePerms["SHARED_GLOBAL"];
					updates[legacyPermType]["SHARE"] = inheritedValue;
					logger.info(`Migrating '${roleName}' role ${legacyPermType}.SHARED_GLOBAL=${inheritedValue} → SHARE`);
				}
			}
			for (const [permissionType, permissions] of Object.entries(updates)) {
				const currentTypePermissions = currentPermissions[permissionType] || {};
				updatedPermissions[permissionType] = { ...currentTypePermissions };
				for (const [permission, value] of Object.entries(permissions)) if (currentTypePermissions[permission] !== value) {
					updatedPermissions[permissionType][permission] = value;
					hasChanges = true;
					logger.info(`Updating '${roleName}' role permission '${permissionType}' '${permission}' from ${currentTypePermissions[permission]} to: ${value}`);
				}
			}
			for (const legacyPermType of legacySharedGlobalTypes) {
				const existingTypePerms = currentPermissions[legacyPermType];
				if (existingTypePerms && "SHARED_GLOBAL" in existingTypePerms) {
					if (!updates[legacyPermType]) {
						updatedPermissions[legacyPermType] = { ...existingTypePerms };
						if (!("SHARE" in existingTypePerms)) {
							updatedPermissions[legacyPermType]["SHARE"] = existingTypePerms["SHARED_GLOBAL"];
							logger.info(`Migrating '${roleName}' role ${legacyPermType}.SHARED_GLOBAL=${existingTypePerms["SHARED_GLOBAL"]} → SHARE`);
						}
					}
					delete updatedPermissions[legacyPermType]["SHARED_GLOBAL"];
					hasChanges = true;
					logger.info(`Removed legacy SHARED_GLOBAL field from '${roleName}' role ${legacyPermType} permissions`);
				}
			}
			if (hasChanges) {
				const Role = mongoose.models.Role;
				const updateObj = { permissions: updatedPermissions };
				if (Object.keys(unsetFields).length > 0) {
					logger.info(`Unsetting old schema fields for '${roleName}' role: ${Object.keys(unsetFields).join(", ")}`);
					try {
						await Role.updateOne({ name: roleName }, {
							$set: updateObj,
							$unset: unsetFields
						});
						const cache = deps.getCache?.(CacheKeys.ROLES);
						const updatedRole = await Role.findOne({ name: roleName }).select("-__v").lean().exec();
						if (cache) await cache.set(scopedCacheKey(roleName), updatedRole);
						logger.info(`Updated role '${roleName}' and removed old schema fields`);
					} catch (updateError) {
						logger.error(`Error during role migration update: ${updateError.message}`);
						throw updateError;
					}
				} else await updateRoleByName(roleName, updateObj);
				logger.info(`Updated '${roleName}' role permissions`);
			} else logger.info(`No changes needed for '${roleName}' role permissions`);
		} catch (error) {
			logger.error(`Failed to update ${roleName} role permissions:`, error);
		}
	}
	/**
	* Migrates roles from old schema to new schema structure.
	*/
	async function migrateRoleSchema(roleName) {
		try {
			const Role = mongoose.models.Role;
			let roles;
			if (roleName) {
				const role = await Role.findOne({ name: roleName });
				roles = role ? [role] : [];
			} else roles = await Role.find({});
			logger.info(`Migrating ${roles.length} roles to new schema structure`);
			let migratedCount = 0;
			for (const role of roles) {
				const permissionTypes = Object.keys(permissionsSchema.shape || {});
				const unsetFields = {};
				let hasOldSchema = false;
				for (const permType of permissionTypes) if (role[permType] && typeof role[permType] === "object") {
					hasOldSchema = true;
					role.permissions = role.permissions || {};
					role.permissions[permType] = {
						...role.permissions[permType],
						...role[permType]
					};
					unsetFields[permType] = 1;
				}
				if (hasOldSchema) try {
					logger.info(`Migrating role '${role.name}' from old schema structure`);
					await Role.updateOne({ _id: role._id }, {
						$set: { permissions: role.permissions },
						$unset: unsetFields
					});
					const cache = deps.getCache?.(CacheKeys.ROLES);
					if (cache) {
						const updatedRole = await Role.findById(role._id).lean().exec();
						await cache.set(scopedCacheKey(role.name), updatedRole);
					}
					migratedCount++;
					logger.info(`Migrated role '${role.name}'`);
				} catch (error) {
					logger.error(`Failed to migrate role '${role.name}': ${error.message}`);
				}
			}
			logger.info(`Migration complete: ${migratedCount} roles migrated`);
			return migratedCount;
		} catch (error) {
			logger.error(`Role schema migration failed: ${error.message}`);
			throw error;
		}
	}
	/** Rejects names that match system roles. */
	async function createRoleByName(roleData) {
		const { name } = roleData;
		if (!name || typeof name !== "string" || !name.trim()) throw new Error("Role name is required");
		const trimmed = name.trim();
		if (isSystemRoleName(trimmed)) throw new RoleConflictError(`Cannot create role with reserved system name: ${name}`);
		const Role = mongoose.models.Role;
		if (await Role.findOne({ name: trimmed }).lean()) throw new RoleConflictError(`Role "${trimmed}" already exists`);
		let role;
		try {
			role = await new Role({
				...roleData,
				name: trimmed
			}).save();
		} catch (err) {
			/**
			* The compound unique index `{ name: 1, tenantId: 1 }` on the role schema
			* (roleSchema.index in schema/role.ts) triggers error 11000 when a concurrent
			* request races past the findOne check above. This catch converts it into
			* the same user-facing message as the application-level duplicate check.
			*/
			if (err && typeof err === "object" && "code" in err && err.code === 11e3) throw new RoleConflictError(`Role "${trimmed}" already exists`);
			throw err;
		}
		try {
			const cache = deps.getCache?.(CacheKeys.ROLES);
			if (cache) await cache.set(scopedCacheKey(role.name), role.toObject());
		} catch (cacheError) {
			logger.error(`[createRoleByName] cache set failed for "${role.name}":`, cacheError);
		}
		return role.toObject();
	}
	/**
	* Guards against deleting system roles. Reassigns affected users back to USER.
	*
	* No existence pre-check is performed: for a nonexistent role the `updateMany`
	* is a harmless no-op and `findOneAndDelete` returns null. This makes the
	* function idempotent — a retry after a partial failure will still clean up
	* orphaned user references and cache entries.
	*
	* Without a MongoDB transaction the two writes are non-atomic — if the delete
	* fails after the reassignment, users will already have been moved to USER
	* while the role document still exists. Recovery requires the caller to retry
	* the delete call, which will succeed since the `updateMany` is a no-op on
	* the second pass.
	*/
	async function deleteRoleByName(roleName) {
		if (isSystemRoleName(roleName)) throw new Error(`Cannot delete system role: ${roleName}`);
		const Role = mongoose.models.Role;
		await mongoose.models.User.updateMany({ role: roleName }, { $set: { role: SystemRoles.USER } });
		const deleted = await Role.findOneAndDelete({ name: roleName }).lean();
		try {
			const cache = deps.getCache?.(CacheKeys.ROLES);
			if (cache) await cache.set(scopedCacheKey(roleName), null);
		} catch (cacheError) {
			logger.error(`[deleteRoleByName] cache invalidation failed for "${roleName}":`, cacheError);
		}
		return deleted;
	}
	async function updateUsersByRole(oldRole, newRole) {
		await mongoose.models.User.updateMany({ role: oldRole }, { $set: { role: newRole } });
	}
	async function findUserIdsByRole(roleName) {
		return (await mongoose.models.User.find({ role: roleName }).select("_id").lean()).map((u) => u._id.toString());
	}
	async function updateUsersRoleByIds(userIds, newRole) {
		if (userIds.length === 0) return;
		await mongoose.models.User.updateMany({ _id: { $in: userIds } }, { $set: { role: newRole } });
	}
	async function listUsersByRole(roleName, options) {
		const User = mongoose.models.User;
		const limit = options?.limit ?? 50;
		const offset = options?.offset ?? 0;
		return await User.find({ role: roleName }).select("_id name email avatar").sort({ _id: 1 }).skip(offset).limit(limit).lean();
	}
	async function countUsersByRole(roleName) {
		return await mongoose.models.User.countDocuments({ role: roleName });
	}
	return {
		listRoles,
		countRoles,
		initializeRoles,
		getRoleByName,
		findRolesByNames,
		updateRoleByName,
		updateAccessPermissions,
		migrateRoleSchema,
		createRoleByName,
		deleteRoleByName,
		updateUsersByRole,
		findUserIdsByRole,
		updateUsersRoleByIds,
		listUsersByRole,
		countUsersByRole
	};
}
//#endregion
//#region src/methods/key.ts
/** Factory function that takes mongoose instance and returns the key methods */
function createKeyMethods(mongoose) {
	/**
	* Retrieves and decrypts the key value for a given user identified by userId and identifier name.
	* @param params - The parameters object
	* @param params.userId - The unique identifier for the user
	* @param params.name - The name associated with the key
	* @returns The decrypted key value
	* @throws Error if the key is not found or if there is a problem during key retrieval
	* @description This function searches for a user's key in the database using their userId and name.
	*              If found, it decrypts the value of the key and returns it. If no key is found, it throws
	*              an error indicating that there is no user key available.
	*/
	async function getUserKey(params) {
		const { userId, name } = params;
		const keyValue = await mongoose.models.Key.findOne({
			userId,
			name
		}).lean();
		if (!keyValue) throw new Error(JSON.stringify({ type: ErrorTypes.NO_USER_KEY }));
		return await decrypt(keyValue.value);
	}
	/**
	* Retrieves, decrypts, and parses the key values for a given user identified by userId and name.
	* @param params - The parameters object
	* @param params.userId - The unique identifier for the user
	* @param params.name - The name associated with the key
	* @returns The decrypted and parsed key values
	* @throws Error if the key is invalid or if there is a problem during key value parsing
	* @description This function retrieves a user's encrypted key using their userId and name, decrypts it,
	*              and then attempts to parse the decrypted string into a JSON object. If the parsing fails,
	*              it throws an error indicating that the user key is invalid.
	*/
	async function getUserKeyValues(params) {
		const { userId, name } = params;
		const userValues = await getUserKey({
			userId,
			name
		});
		try {
			return JSON.parse(userValues);
		} catch (e) {
			logger.error("[getUserKeyValues]", e);
			throw new Error(JSON.stringify({ type: ErrorTypes.INVALID_USER_KEY }));
		}
	}
	/**
	* Retrieves the expiry information of a user's key identified by userId and name.
	* @param params - The parameters object
	* @param params.userId - The unique identifier for the user
	* @param params.name - The name associated with the key
	* @returns The expiry date of the key or null if the key doesn't exist
	* @description This function fetches a user's key from the database using their userId and name and
	*              returns its expiry date. If the key is not found, it returns null for the expiry date.
	*/
	async function getUserKeyExpiry(params) {
		const { userId, name } = params;
		const keyValue = await mongoose.models.Key.findOne({
			userId,
			name
		}).lean();
		if (!keyValue) return { expiresAt: null };
		return { expiresAt: keyValue.expiresAt || "never" };
	}
	/**
	* Updates or inserts a new key for a given user identified by userId and name, with a specified value and expiry date.
	* @param params - The parameters object
	* @param params.userId - The unique identifier for the user
	* @param params.name - The name associated with the key
	* @param params.value - The value to be encrypted and stored as the key's value
	* @param params.expiresAt - The expiry date for the key [optional]
	* @returns The updated or newly inserted key document
	* @description This function either updates an existing user key or inserts a new one into the database,
	*              after encrypting the provided value. It sets the provided expiry date for the key (or unsets for no expiry).
	*/
	async function updateUserKey(params) {
		const { userId, name, value, expiresAt = null } = params;
		const Key = mongoose.models.Key;
		const updateObject = {
			userId,
			name,
			value: await encrypt(value)
		};
		const updateQuery = { $set: updateObject };
		if (expiresAt) updateObject.expiresAt = new Date(expiresAt);
		else updateQuery.$unset = { expiresAt: "" };
		return await Key.findOneAndUpdate({
			userId,
			name
		}, updateQuery, {
			upsert: true,
			new: true
		}).lean();
	}
	/**
	* Deletes a key or all keys for a given user identified by userId, optionally based on a specified name.
	* @param params - The parameters object
	* @param params.userId - The unique identifier for the user
	* @param params.name - The name associated with the key to delete. If not provided and all is true, deletes all keys
	* @param params.all - Whether to delete all keys for the user
	* @returns The result of the deletion operation
	* @description This function deletes a specific key or all keys for a user from the database.
	*              If a name is provided and all is false, it deletes only the key with that name.
	*              If all is true, it ignores the name and deletes all keys for the user.
	*/
	async function deleteUserKey(params) {
		const { userId, name, all = false } = params;
		const Key = mongoose.models.Key;
		if (all) return await Key.deleteMany({ userId });
		return await Key.findOneAndDelete({
			userId,
			name
		}).lean();
	}
	return {
		getUserKey,
		updateUserKey,
		deleteUserKey,
		getUserKeyValues,
		getUserKeyExpiry
	};
}
//#endregion
//#region src/methods/memory.ts
/**
* Formats a date in YYYY-MM-DD format
*/
const formatDate = (date) => {
	return date.toISOString().split("T")[0];
};
function createMemoryMethods(mongoose) {
	/**
	* Creates a new memory entry for a user
	* Throws an error if a memory with the same key already exists
	*/
	async function createMemory({ userId, key, value, tokenCount = 0 }) {
		try {
			if (key?.toLowerCase() === "nothing") return { ok: false };
			const MemoryEntry = mongoose.models.MemoryEntry;
			if (await MemoryEntry.findOne({
				userId,
				key
			})) throw new Error("Memory with this key already exists");
			await MemoryEntry.create({
				userId,
				key,
				value,
				tokenCount,
				updated_at: /* @__PURE__ */ new Date()
			});
			return { ok: true };
		} catch (error) {
			throw new Error(`Failed to create memory: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	/**
	* Sets or updates a memory entry for a user
	*/
	async function setMemory({ userId, key, value, tokenCount = 0 }) {
		try {
			if (key?.toLowerCase() === "nothing") return { ok: false };
			await mongoose.models.MemoryEntry.findOneAndUpdate({
				userId,
				key
			}, {
				value,
				tokenCount,
				updated_at: /* @__PURE__ */ new Date()
			}, {
				upsert: true,
				new: true
			});
			return { ok: true };
		} catch (error) {
			throw new Error(`Failed to set memory: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	/**
	* Deletes a specific memory entry for a user
	*/
	async function deleteMemory({ userId, key }) {
		try {
			return { ok: !!await mongoose.models.MemoryEntry.findOneAndDelete({
				userId,
				key
			}) };
		} catch (error) {
			throw new Error(`Failed to delete memory: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	/**
	* Gets all memory entries for a user
	*/
	async function getAllUserMemories(userId) {
		try {
			return await mongoose.models.MemoryEntry.find({ userId }).lean();
		} catch (error) {
			throw new Error(`Failed to get all memories: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	/**
	* Gets and formats all memories for a user in two different formats
	*/
	async function getFormattedMemories({ userId }) {
		try {
			const memories = await getAllUserMemories(userId);
			if (!memories || memories.length === 0) return {
				withKeys: "",
				withoutKeys: "",
				totalTokens: 0
			};
			const sortedMemories = memories.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
			const totalTokens = sortedMemories.reduce((sum, memory) => {
				return sum + (memory.tokenCount || 0);
			}, 0);
			return {
				withKeys: sortedMemories.map((memory, index) => {
					const date = formatDate(new Date(memory.updated_at));
					const tokenInfo = memory.tokenCount ? ` [${memory.tokenCount} tokens]` : "";
					return `${index + 1}. [${date}]. ["key": "${memory.key}"]${tokenInfo}. ["value": "${memory.value}"]`;
				}).join("\n\n"),
				withoutKeys: sortedMemories.map((memory, index) => {
					const date = formatDate(new Date(memory.updated_at));
					return `${index + 1}. [${date}]. ${memory.value}`;
				}).join("\n\n"),
				totalTokens
			};
		} catch (error) {
			logger.error("Failed to get formatted memories:", error);
			return {
				withKeys: "",
				withoutKeys: "",
				totalTokens: 0
			};
		}
	}
	/**
	* Deletes all memory entries for a user
	*/
	async function deleteAllUserMemories(userId) {
		try {
			return (await mongoose.models.MemoryEntry.deleteMany({ userId })).deletedCount;
		} catch (error) {
			throw new Error(`Failed to delete all user memories: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	return {
		setMemory,
		createMemory,
		deleteMemory,
		getAllUserMemories,
		getFormattedMemories,
		deleteAllUserMemories
	};
}
//#endregion
//#region src/methods/agentCategory.ts
function createAgentCategoryMethods(mongoose) {
	/**
	* Get all active categories sorted by order
	* @returns Array of active categories
	*/
	async function getActiveCategories() {
		return await mongoose.models.AgentCategory.find({ isActive: true }).sort({
			order: 1,
			label: 1
		}).lean();
	}
	/**
	* Get categories with agent counts
	* @returns Categories with agent counts
	*/
	async function getCategoriesWithCounts() {
		const categoryCounts = await mongoose.models.Agent.aggregate([{ $match: { category: {
			$exists: true,
			$ne: null
		} } }, { $group: {
			_id: "$category",
			count: { $sum: 1 }
		} }]);
		const countMap = new Map(categoryCounts.map((c) => [c._id, c.count]));
		return (await getActiveCategories()).map((category) => ({
			...category,
			agentCount: countMap.get(category.value) || 0
		}));
	}
	/**
	* Get valid category values for Agent model validation
	* @returns Array of valid category values
	*/
	async function getValidCategoryValues() {
		return await mongoose.models.AgentCategory.find({ isActive: true }).distinct("value").lean();
	}
	/**
	* Seed initial categories from existing constants
	* @param categories - Array of category data to seed
	* @returns Bulk write result
	*/
	async function seedCategories(categories) {
		const AgentCategory = mongoose.models.AgentCategory;
		return await tenantSafeBulkWrite(AgentCategory, categories.map((category, index) => ({ updateOne: {
			filter: { value: category.value },
			update: { $setOnInsert: {
				value: category.value,
				label: category.label || category.value,
				description: category.description || "",
				order: category.order || index,
				isActive: true,
				custom: category.custom || false
			} },
			upsert: true
		} })));
	}
	/**
	* Find a category by value
	* @param value - The category value to search for
	* @returns The category document or null
	*/
	async function findCategoryByValue(value) {
		return await mongoose.models.AgentCategory.findOne({ value }).lean();
	}
	/**
	* Create a new category
	* @param categoryData - The category data to create
	* @returns The created category
	*/
	async function createCategory(categoryData) {
		return (await mongoose.models.AgentCategory.create(categoryData)).toObject();
	}
	/**
	* Update a category by value
	* @param value - The category value to update
	* @param updateData - The data to update
	* @returns The updated category or null
	*/
	async function updateCategory(value, updateData) {
		return await mongoose.models.AgentCategory.findOneAndUpdate({ value }, { $set: updateData }, {
			new: true,
			runValidators: true
		}).lean();
	}
	/**
	* Delete a category by value
	* @param value - The category value to delete
	* @returns Whether the deletion was successful
	*/
	async function deleteCategory(value) {
		return (await mongoose.models.AgentCategory.deleteOne({ value })).deletedCount > 0;
	}
	/**
	* Find a category by ID
	* @param id - The category ID to search for
	* @returns The category document or null
	*/
	async function findCategoryById(id) {
		return await mongoose.models.AgentCategory.findById(id).lean();
	}
	/**
	* Get all categories (active and inactive)
	* @returns Array of all categories
	*/
	async function getAllCategories() {
		return await mongoose.models.AgentCategory.find({}).sort({
			order: 1,
			label: 1
		}).lean();
	}
	/**
	* Ensure default categories exist and update them if they don't have localization keys
	* @returns Promise<boolean> - true if categories were created/updated, false if no changes
	*/
	async function ensureDefaultCategories() {
		const AgentCategory = mongoose.models.AgentCategory;
		const defaultCategories = [
			{
				value: "general",
				label: "com_agents_category_general",
				description: "com_agents_category_general_description",
				order: 0
			},
			{
				value: "hr",
				label: "com_agents_category_hr",
				description: "com_agents_category_hr_description",
				order: 1
			},
			{
				value: "rd",
				label: "com_agents_category_rd",
				description: "com_agents_category_rd_description",
				order: 2
			},
			{
				value: "finance",
				label: "com_agents_category_finance",
				description: "com_agents_category_finance_description",
				order: 3
			},
			{
				value: "it",
				label: "com_agents_category_it",
				description: "com_agents_category_it_description",
				order: 4
			},
			{
				value: "sales",
				label: "com_agents_category_sales",
				description: "com_agents_category_sales_description",
				order: 5
			},
			{
				value: "aftersales",
				label: "com_agents_category_aftersales",
				description: "com_agents_category_aftersales_description",
				order: 6
			}
		];
		const existingCategories = await getAllCategories();
		const existingCategoryMap = new Map(existingCategories.map((cat) => [cat.value, cat]));
		const updates = [];
		let created = 0;
		for (const defaultCategory of defaultCategories) {
			const existingCategory = existingCategoryMap.get(defaultCategory.value);
			if (existingCategory) {
				const isNotCustom = !existingCategory.custom;
				const needsLocalization = !existingCategory.label.startsWith("com_");
				if (isNotCustom && needsLocalization) updates.push({
					value: defaultCategory.value,
					label: defaultCategory.label,
					description: defaultCategory.description
				});
			} else {
				await createCategory({
					...defaultCategory,
					isActive: true,
					custom: false
				});
				created++;
			}
		}
		if (updates.length > 0) await tenantSafeBulkWrite(AgentCategory, updates.map((update) => ({ updateOne: {
			filter: {
				value: update.value,
				custom: { $ne: true }
			},
			update: { $set: {
				label: update.label,
				description: update.description
			} }
		} })), { ordered: false });
		return updates.length > 0 || created > 0;
	}
	return {
		getActiveCategories,
		getCategoriesWithCounts,
		getValidCategoryValues,
		seedCategories,
		findCategoryByValue,
		createCategory,
		updateCategory,
		deleteCategory,
		findCategoryById,
		getAllCategories,
		ensureDefaultCategories
	};
}
//#endregion
//#region src/methods/agentApiKey.ts
const API_KEY_PREFIX = "sk-";
const API_KEY_LENGTH = 32;
function createAgentApiKeyMethods(mongoose) {
	async function generateApiKey() {
		const key = `${API_KEY_PREFIX}${await getRandomValues(API_KEY_LENGTH)}`;
		return {
			key,
			keyHash: await hashToken(key),
			keyPrefix: key.slice(0, 8)
		};
	}
	async function createAgentApiKey(data) {
		try {
			const AgentApiKey = mongoose.models.AgentApiKey;
			const { key, keyHash, keyPrefix } = await generateApiKey();
			const apiKeyDoc = await AgentApiKey.create({
				userId: data.userId,
				name: data.name,
				keyHash,
				keyPrefix,
				expiresAt: data.expiresAt || void 0
			});
			return {
				id: apiKeyDoc._id.toString(),
				name: apiKeyDoc.name,
				keyPrefix,
				key,
				createdAt: apiKeyDoc.createdAt,
				expiresAt: apiKeyDoc.expiresAt
			};
		} catch (error) {
			logger.error("[createAgentApiKey] Error creating API key:", error);
			throw error;
		}
	}
	async function validateAgentApiKey(apiKey) {
		try {
			const AgentApiKey = mongoose.models.AgentApiKey;
			const keyHash = await hashToken(apiKey);
			const keyDoc = await AgentApiKey.findOne({ keyHash }).lean();
			if (!keyDoc) return null;
			if (keyDoc.expiresAt && new Date(keyDoc.expiresAt) < /* @__PURE__ */ new Date()) return null;
			await AgentApiKey.updateOne({ _id: keyDoc._id }, { $set: { lastUsedAt: /* @__PURE__ */ new Date() } });
			return {
				userId: keyDoc.userId,
				keyId: keyDoc._id
			};
		} catch (error) {
			logger.error("[validateAgentApiKey] Error validating API key:", error);
			return null;
		}
	}
	async function listAgentApiKeys(userId) {
		try {
			return (await mongoose.models.AgentApiKey.find({ userId }).sort({ createdAt: -1 }).lean()).map((key) => ({
				id: key._id.toString(),
				name: key.name,
				keyPrefix: key.keyPrefix,
				lastUsedAt: key.lastUsedAt,
				expiresAt: key.expiresAt,
				createdAt: key.createdAt
			}));
		} catch (error) {
			logger.error("[listAgentApiKeys] Error listing API keys:", error);
			throw error;
		}
	}
	async function deleteAgentApiKey(keyId, userId) {
		try {
			return (await mongoose.models.AgentApiKey.deleteOne({
				_id: keyId,
				userId
			})).deletedCount > 0;
		} catch (error) {
			logger.error("[deleteAgentApiKey] Error deleting API key:", error);
			throw error;
		}
	}
	async function deleteAllAgentApiKeys(userId) {
		try {
			return (await mongoose.models.AgentApiKey.deleteMany({ userId })).deletedCount;
		} catch (error) {
			logger.error("[deleteAllAgentApiKeys] Error deleting all API keys:", error);
			throw error;
		}
	}
	async function getAgentApiKeyById(keyId, userId) {
		try {
			const keyDoc = await mongoose.models.AgentApiKey.findOne({
				_id: keyId,
				userId
			}).lean();
			if (!keyDoc) return null;
			return {
				id: keyDoc._id.toString(),
				name: keyDoc.name,
				keyPrefix: keyDoc.keyPrefix,
				lastUsedAt: keyDoc.lastUsedAt,
				expiresAt: keyDoc.expiresAt,
				createdAt: keyDoc.createdAt
			};
		} catch (error) {
			logger.error("[getAgentApiKeyById] Error getting API key:", error);
			throw error;
		}
	}
	return {
		createAgentApiKey,
		validateAgentApiKey,
		listAgentApiKeys,
		deleteAgentApiKey,
		deleteAllAgentApiKeys,
		getAgentApiKeyById
	};
}
//#endregion
//#region src/methods/mcpServer.ts
const NORMALIZED_LIMIT_DEFAULT = 20;
const MAX_CREATE_RETRIES = 5;
const RETRY_BASE_DELAY_MS = 25;
/**
* Helper to check if an error is a MongoDB duplicate key error.
* Since serverName is the only unique index on MCPServer, any E11000 error
* during creation is necessarily a serverName collision.
*/
function isDuplicateKeyError$1(error) {
	if (error && typeof error === "object" && "code" in error) return error.code === 11e3;
	return false;
}
/**
* Escapes special regex characters in a string so they are treated literally.
*/
function escapeRegex$1(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
* Generates a URL-friendly server name from a title.
* Converts to lowercase, replaces spaces with hyphens, removes special characters.
*/
function generateServerNameFromTitle(title) {
	return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "mcp-server";
}
function createMCPServerMethods(mongoose) {
	/**
	* Finds the next available server name by checking DB and reserved-name collisions.
	* If baseName is taken or reserved, returns baseName-2, baseName-3, etc.
	*/
	async function findNextAvailableServerName(baseName, reservedServerNames = /* @__PURE__ */ new Set()) {
		const MCPServer = mongoose.models.MCPServer;
		const escapedBaseName = escapeRegex$1(baseName);
		const matchingNamePattern = new RegExp(`^${escapedBaseName}(-\\d+)?$`);
		const existing = await MCPServer.find({ serverName: { $regex: matchingNamePattern } }).select("serverName").lean();
		const existingNames = new Set([...existing.map((server) => server.serverName), ...Array.from(reservedServerNames).filter((serverName) => matchingNamePattern.test(serverName))]);
		if (existingNames.size === 0) return baseName;
		const numbers = Array.from(existingNames).map((serverName) => {
			const match = serverName.match(/-(\d+)$/);
			return match ? parseInt(match[1], 10) : 1;
		});
		return `${baseName}-${Math.max(...numbers) + 1}`;
	}
	/**
	* Create a new MCP server with retry logic for handling race conditions.
	* When multiple requests try to create servers with the same title simultaneously,
	* they may get the same serverName from findNextAvailableServerName() before any
	* creates the record (TOCTOU race condition). This is handled by retrying with
	* exponential backoff when a duplicate key error occurs.
	* @param data - Object containing config (with title, description, url, etc.) and author
	* @returns The created MCP server document
	*/
	async function createMCPServer(data) {
		const MCPServer = mongoose.models.MCPServer;
		let lastError;
		const reservedServerNames = new Set(data.reservedServerNames ?? []);
		for (let attempt = 0; attempt < MAX_CREATE_RETRIES; attempt++) try {
			let serverName;
			if (data.config.title) serverName = await findNextAvailableServerName(generateServerNameFromTitle(data.config.title), reservedServerNames);
			else serverName = `mcp-${nanoid(16)}`;
			return (await MCPServer.create({
				serverName,
				config: data.config,
				author: data.author
			})).toObject();
		} catch (error) {
			lastError = error;
			if (isDuplicateKeyError$1(error) && attempt < MAX_CREATE_RETRIES - 1) {
				const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
				logger.debug(`[createMCPServer] Duplicate serverName detected, retrying (attempt ${attempt + 2}/${MAX_CREATE_RETRIES}) after ${delay}ms`);
				await new Promise((resolve) => setTimeout(resolve, delay));
				continue;
			}
			throw error;
		}
		throw lastError;
	}
	/**
	* Find an MCP server by serverName
	* @param serverName - The unique server name identifier
	* @returns The MCP server document or null
	*/
	async function findMCPServerByServerName(serverName) {
		return await mongoose.models.MCPServer.findOne({ serverName }).lean();
	}
	/**
	* Find an MCP server by MongoDB ObjectId
	* @param _id - The MongoDB ObjectId
	* @returns The MCP server document or null
	*/
	async function findMCPServerByObjectId(_id) {
		return await mongoose.models.MCPServer.findById(_id).lean();
	}
	/**
	* Find MCP servers by author
	* @param authorId - The author's ObjectId or string
	* @returns Array of MCP server documents
	*/
	async function findMCPServersByAuthor(authorId) {
		return await mongoose.models.MCPServer.find({ author: authorId }).sort({ updatedAt: -1 }).lean();
	}
	/**
	* Get a paginated list of MCP servers by IDs with filtering and search
	* @param ids - Array of ObjectIds to include
	* @param otherParams - Additional filter parameters (e.g., search)
	* @param limit - Page size limit (null for no pagination)
	* @param after - Cursor for pagination
	* @returns Paginated list of MCP servers
	*/
	async function getListMCPServersByIds({ ids = [], otherParams = {}, limit = null, after = null }) {
		const MCPServer = mongoose.models.MCPServer;
		const normalizedLimit = limit !== null && limit !== void 0 ? Math.min(Math.max(1, parseInt(String(limit)) || NORMALIZED_LIMIT_DEFAULT), 100) : null;
		const baseQuery = {
			...otherParams,
			_id: { $in: ids }
		};
		if (after) try {
			const { updatedAt, _id } = JSON.parse(Buffer.from(after, "base64").toString("utf8"));
			const cursorCondition = { $or: [{ updatedAt: { $lt: new Date(updatedAt) } }, {
				updatedAt: new Date(updatedAt),
				_id: { $gt: new mongoose.Types.ObjectId(_id) }
			}] };
			if (Object.keys(baseQuery).length > 0) {
				baseQuery.$and = [{ ...baseQuery }, cursorCondition];
				Object.keys(baseQuery).forEach((key) => {
					if (key !== "$and") delete baseQuery[key];
				});
			}
		} catch (error) {
			logger.warn("[getListMCPServersByIds] Invalid cursor provided", error);
		}
		if (normalizedLimit === null) return {
			data: await MCPServer.find(baseQuery).sort({
				updatedAt: -1,
				_id: 1
			}).lean(),
			has_more: false,
			after: null
		};
		const servers = await MCPServer.find(baseQuery).sort({
			updatedAt: -1,
			_id: 1
		}).limit(normalizedLimit + 1).lean();
		const hasMore = servers.length > normalizedLimit;
		const data = hasMore ? servers.slice(0, normalizedLimit) : servers;
		let nextCursor = null;
		if (hasMore && data.length > 0) {
			const lastItem = data[data.length - 1];
			nextCursor = Buffer.from(JSON.stringify({
				updatedAt: lastItem.updatedAt,
				_id: lastItem._id
			})).toString("base64");
		}
		return {
			data,
			has_more: hasMore,
			after: nextCursor
		};
	}
	/**
	* Update an MCP server
	* @param serverName - The MCP server ID
	* @param updateData - Object containing config to update
	* @returns The updated MCP server document or null
	*/
	async function updateMCPServer(serverName, updateData) {
		return await mongoose.models.MCPServer.findOneAndUpdate({ serverName }, { $set: updateData }, {
			new: true,
			runValidators: true
		}).lean();
	}
	/**
	* Delete an MCP server
	* @param serverName - The MCP server ID
	* @returns The deleted MCP server document or null
	*/
	async function deleteMCPServer(serverName) {
		return await mongoose.models.MCPServer.findOneAndDelete({ serverName }).lean();
	}
	/**
	* Get MCP servers by their serverName strings
	* @param names - Array of serverName strings to fetch
	* @returns Object containing array of MCP server documents
	*/
	async function getListMCPServersByNames({ names = [] }) {
		if (names.length === 0) return { data: [] };
		return { data: await mongoose.models.MCPServer.find({ serverName: { $in: names } }).lean() };
	}
	return {
		createMCPServer,
		findMCPServerByServerName,
		findMCPServerByObjectId,
		findMCPServersByAuthor,
		getListMCPServersByIds,
		getListMCPServersByNames,
		updateMCPServer,
		deleteMCPServer
	};
}
//#endregion
//#region src/methods/pluginAuth.ts
function createPluginAuthMethods(mongoose) {
	/**
	* Finds a single plugin auth entry by userId and authField (and optionally pluginKey)
	*/
	async function findOnePluginAuth({ userId, authField, pluginKey }) {
		try {
			return await mongoose.models.PluginAuth.findOne({
				userId,
				authField,
				...pluginKey && { pluginKey }
			}).lean();
		} catch (error) {
			throw new Error(`Failed to find plugin auth: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	/**
	* Finds multiple plugin auth entries by userId and pluginKeys
	*/
	async function findPluginAuthsByKeys({ userId, pluginKeys }) {
		try {
			if (!pluginKeys || pluginKeys.length === 0) return [];
			return await mongoose.models.PluginAuth.find({
				userId,
				pluginKey: { $in: pluginKeys }
			}).lean();
		} catch (error) {
			throw new Error(`Failed to find plugin auths: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	/**
	* Updates or creates a plugin auth entry
	*/
	async function updatePluginAuth({ userId, authField, pluginKey, value }) {
		try {
			const PluginAuth = mongoose.models.PluginAuth;
			if (await PluginAuth.findOne({
				userId,
				pluginKey,
				authField
			}).lean()) return await PluginAuth.findOneAndUpdate({
				userId,
				pluginKey,
				authField
			}, { $set: { value } }, {
				new: true,
				upsert: true
			}).lean();
			else {
				const newPluginAuth = await new PluginAuth({
					userId,
					authField,
					value,
					pluginKey
				});
				await newPluginAuth.save();
				return newPluginAuth.toObject();
			}
		} catch (error) {
			throw new Error(`Failed to update plugin auth: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	/**
	* Deletes plugin auth entries based on provided parameters
	*/
	async function deletePluginAuth({ userId, authField, pluginKey, all = false }) {
		try {
			const PluginAuth = mongoose.models.PluginAuth;
			if (all) {
				const filter = { userId };
				if (pluginKey) filter.pluginKey = pluginKey;
				return await PluginAuth.deleteMany(filter);
			}
			if (!authField) throw new Error("authField is required when all is false");
			return await PluginAuth.deleteOne({
				userId,
				authField
			});
		} catch (error) {
			throw new Error(`Failed to delete plugin auth: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	/**
	* Deletes all plugin auth entries for a user
	*/
	async function deleteAllUserPluginAuths(userId) {
		try {
			return await mongoose.models.PluginAuth.deleteMany({ userId });
		} catch (error) {
			throw new Error(`Failed to delete all user plugin auths: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	return {
		findOnePluginAuth,
		findPluginAuthsByKeys,
		updatePluginAuth,
		deletePluginAuth,
		deleteAllUserPluginAuths
	};
}
//#endregion
//#region src/methods/accessRole.ts
function createAccessRoleMethods(mongoose) {
	/**
	* Find an access role by its ID
	* @param roleId - The role ID
	* @returns The role document or null if not found
	*/
	async function findRoleById(roleId) {
		return await mongoose.models.AccessRole.findById(roleId).lean();
	}
	/**
	* Find an access role by its unique identifier
	* @param accessRoleId - The unique identifier (e.g., "agent_viewer")
	* @returns The role document or null if not found
	*/
	async function findRoleByIdentifier(accessRoleId) {
		return await mongoose.models.AccessRole.findOne({ accessRoleId }).lean();
	}
	/**
	* Find all access roles for a specific resource type
	* @param resourceType - The type of resource ('agent', 'project', 'file')
	* @returns Array of role documents
	*/
	async function findRolesByResourceType(resourceType) {
		return await mongoose.models.AccessRole.find({ resourceType }).lean();
	}
	/**
	* Find an access role by resource type and permission bits
	* @param resourceType - The type of resource
	* @param permBits - The permission bits (use PermissionBits or RoleBits enum)
	* @returns The role document or null if not found
	*/
	async function findRoleByPermissions(resourceType, permBits) {
		return await mongoose.models.AccessRole.findOne({
			resourceType,
			permBits
		}).lean();
	}
	/**
	* Create a new access role
	* @param roleData - Role data (accessRoleId, name, description, resourceType, permBits)
	* @returns The created role document
	*/
	async function createRole(roleData) {
		return await mongoose.models.AccessRole.create(roleData);
	}
	/**
	* Update an existing access role
	* @param accessRoleId - The unique identifier of the role to update
	* @param updateData - Data to update
	* @returns The updated role document or null if not found
	*/
	async function updateRole(accessRoleId, updateData) {
		return await mongoose.models.AccessRole.findOneAndUpdate({ accessRoleId }, { $set: updateData }, { new: true }).lean();
	}
	/**
	* Delete an access role
	* @param accessRoleId - The unique identifier of the role to delete
	* @returns The result of the delete operation
	*/
	async function deleteRole(accessRoleId) {
		return await mongoose.models.AccessRole.deleteOne({ accessRoleId });
	}
	/**
	* Get all predefined roles
	* @returns Array of all role documents
	*/
	async function getAllRoles() {
		return await mongoose.models.AccessRole.find().lean();
	}
	/**
	* Seed default roles if they don't exist
	* @returns Object containing created roles
	*/
	async function seedDefaultRoles() {
		const AccessRole = mongoose.models.AccessRole;
		const defaultRoles = [
			{
				accessRoleId: AccessRoleIds.AGENT_VIEWER,
				name: "com_ui_role_viewer",
				description: "com_ui_role_viewer_desc",
				resourceType: ResourceType.AGENT,
				permBits: 1
			},
			{
				accessRoleId: AccessRoleIds.AGENT_EDITOR,
				name: "com_ui_role_editor",
				description: "com_ui_role_editor_desc",
				resourceType: ResourceType.AGENT,
				permBits: 3
			},
			{
				accessRoleId: AccessRoleIds.AGENT_OWNER,
				name: "com_ui_role_owner",
				description: "com_ui_role_owner_desc",
				resourceType: ResourceType.AGENT,
				permBits: 15
			},
			{
				accessRoleId: AccessRoleIds.PROMPTGROUP_VIEWER,
				name: "com_ui_role_viewer",
				description: "com_ui_role_viewer_desc",
				resourceType: ResourceType.PROMPTGROUP,
				permBits: 1
			},
			{
				accessRoleId: AccessRoleIds.PROMPTGROUP_EDITOR,
				name: "com_ui_role_editor",
				description: "com_ui_role_editor_desc",
				resourceType: ResourceType.PROMPTGROUP,
				permBits: 3
			},
			{
				accessRoleId: AccessRoleIds.PROMPTGROUP_OWNER,
				name: "com_ui_role_owner",
				description: "com_ui_role_owner_desc",
				resourceType: ResourceType.PROMPTGROUP,
				permBits: 15
			},
			{
				accessRoleId: AccessRoleIds.MCPSERVER_VIEWER,
				name: "com_ui_mcp_server_role_viewer",
				description: "com_ui_mcp_server_role_viewer_desc",
				resourceType: ResourceType.MCPSERVER,
				permBits: 1
			},
			{
				accessRoleId: AccessRoleIds.MCPSERVER_EDITOR,
				name: "com_ui_mcp_server_role_editor",
				description: "com_ui_mcp_server_role_editor_desc",
				resourceType: ResourceType.MCPSERVER,
				permBits: 3
			},
			{
				accessRoleId: AccessRoleIds.MCPSERVER_OWNER,
				name: "com_ui_mcp_server_role_owner",
				description: "com_ui_mcp_server_role_owner_desc",
				resourceType: ResourceType.MCPSERVER,
				permBits: 15
			},
			{
				accessRoleId: AccessRoleIds.REMOTE_AGENT_VIEWER,
				name: "com_ui_remote_agent_role_viewer",
				description: "com_ui_remote_agent_role_viewer_desc",
				resourceType: ResourceType.REMOTE_AGENT,
				permBits: 1
			},
			{
				accessRoleId: AccessRoleIds.REMOTE_AGENT_EDITOR,
				name: "com_ui_remote_agent_role_editor",
				description: "com_ui_remote_agent_role_editor_desc",
				resourceType: ResourceType.REMOTE_AGENT,
				permBits: 3
			},
			{
				accessRoleId: AccessRoleIds.REMOTE_AGENT_OWNER,
				name: "com_ui_remote_agent_role_owner",
				description: "com_ui_remote_agent_role_owner_desc",
				resourceType: ResourceType.REMOTE_AGENT,
				permBits: 15
			},
			{
				accessRoleId: AccessRoleIds.SKILL_VIEWER,
				name: "com_ui_role_viewer",
				description: "com_ui_role_viewer_desc",
				resourceType: ResourceType.SKILL,
				permBits: 1
			},
			{
				accessRoleId: AccessRoleIds.SKILL_EDITOR,
				name: "com_ui_role_editor",
				description: "com_ui_role_editor_desc",
				resourceType: ResourceType.SKILL,
				permBits: 3
			},
			{
				accessRoleId: AccessRoleIds.SKILL_OWNER,
				name: "com_ui_role_owner",
				description: "com_ui_role_owner_desc",
				resourceType: ResourceType.SKILL,
				permBits: 15
			},
			{
				accessRoleId: AccessRoleIds.SHARED_LINK_VIEWER,
				name: "com_ui_role_viewer",
				description: "com_ui_role_viewer_desc",
				resourceType: ResourceType.SHARED_LINK,
				permBits: 1
			},
			{
				accessRoleId: AccessRoleIds.SHARED_LINK_OWNER,
				name: "com_ui_role_owner",
				description: "com_ui_role_owner_desc",
				resourceType: ResourceType.SHARED_LINK,
				permBits: 15
			}
		];
		const result = {};
		for (const role of defaultRoles) {
			const upsertedRole = await AccessRole.findOneAndUpdate({ accessRoleId: role.accessRoleId }, { $setOnInsert: role }, {
				upsert: true,
				new: true
			}).lean();
			if (upsertedRole) result[role.accessRoleId] = upsertedRole;
		}
		return result;
	}
	/**
	* Helper to get the appropriate role for a set of permissions
	* @param resourceType - The type of resource
	* @param permBits - The permission bits
	* @returns The matching role or null if none found
	*/
	async function getRoleForPermissions(resourceType, permBits) {
		const AccessRole = mongoose.models.AccessRole;
		const exactMatch = await AccessRole.findOne({
			resourceType,
			permBits
		}).lean();
		if (exactMatch) return exactMatch;
		return (await AccessRole.find({ resourceType }).sort({ permBits: -1 }).lean()).find((role) => (role.permBits & permBits) === role.permBits) || null;
	}
	return {
		createRole,
		updateRole,
		deleteRole,
		getAllRoles,
		findRoleById,
		seedDefaultRoles,
		findRoleByIdentifier,
		getRoleForPermissions,
		findRoleByPermissions,
		findRolesByResourceType
	};
}
//#endregion
//#region src/methods/userGroup.ts
function createUserGroupMethods(mongoose) {
	/**
	* Find a group by its ID
	* @param groupId - The group ID
	* @param projection - Optional projection of fields to return
	* @param session - Optional MongoDB session for transactions
	* @returns The group document or null if not found
	*/
	async function findGroupById(groupId, projection = {}, session) {
		const query = mongoose.models.Group.findOne({ _id: groupId }, projection);
		if (session) query.session(session);
		return await query.lean();
	}
	/**
	* Find a group by its external ID (e.g., Entra ID)
	* @param idOnTheSource - The external ID
	* @param source - The source ('entra' or 'local')
	* @param projection - Optional projection of fields to return
	* @param session - Optional MongoDB session for transactions
	* @returns The group document or null if not found
	*/
	async function findGroupByExternalId(idOnTheSource, source = "entra", projection = {}, session) {
		const query = mongoose.models.Group.findOne({
			idOnTheSource,
			source
		}, projection);
		if (session) query.session(session);
		return await query.lean();
	}
	/**
	* Find multiple groups by their external IDs (e.g., Entra IDs) in a single query
	* @param idsOnTheSource - Array of external IDs
	* @param source - The source ('entra' or 'local')
	* @param session - Optional MongoDB session for transactions
	* @returns Array of group documents
	*/
	async function findGroupsByExternalIds(idsOnTheSource, source = "entra", session) {
		const query = mongoose.models.Group.find({
			idOnTheSource: { $in: idsOnTheSource },
			source
		}, {
			idOnTheSource: 1,
			_id: 0
		});
		if (session) query.session(session);
		return await query.lean();
	}
	/**
	* Find groups by name pattern (case-insensitive partial match)
	* @param namePattern - The name pattern to search for
	* @param source - Optional source filter ('entra', 'local', or null for all)
	* @param limit - Maximum number of results to return
	* @param session - Optional MongoDB session for transactions
	* @returns Array of matching groups
	*/
	async function findGroupsByNamePattern(namePattern, source = null, limit = 20, session) {
		const Group = mongoose.models.Group;
		const regex = new RegExp(escapeRegExp(namePattern), "i");
		const query = { $or: [
			{ name: regex },
			{ email: regex },
			{ description: regex }
		] };
		if (source) query.source = source;
		const dbQuery = Group.find(query).limit(limit);
		if (session) dbQuery.session(session);
		return await dbQuery.lean();
	}
	/**
	* Find all groups a user is a member of by their ID or idOnTheSource
	* @param userId - The user ID
	* @param session - Optional MongoDB session for transactions
	* @returns Array of groups the user is a member of
	*/
	async function findGroupsByMemberId(userId, session) {
		const User = mongoose.models.User;
		const Group = mongoose.models.Group;
		const userQuery = User.findById(userId, "idOnTheSource");
		if (session) userQuery.session(session);
		const user = await userQuery.lean();
		if (!user) return [];
		const userIdOnTheSource = user.idOnTheSource || userId.toString();
		const query = Group.find({ memberIds: userIdOnTheSource });
		if (session) query.session(session);
		return await query.lean();
	}
	/**
	* Create a new group
	* @param groupData - Group data including name, source, and optional idOnTheSource
	* @param session - Optional MongoDB session for transactions
	* @returns The created group
	*/
	async function createGroup(groupData, session) {
		const Group = mongoose.models.Group;
		const options = session ? { session } : {};
		return await Group.create([groupData], options).then((groups) => groups[0]);
	}
	/**
	* Update or create a group by external ID
	* @param idOnTheSource - The external ID
	* @param source - The source ('entra' or 'local')
	* @param updateData - Data to update or set if creating
	* @param session - Optional MongoDB session for transactions
	* @returns The updated or created group
	*/
	async function upsertGroupByExternalId(idOnTheSource, source, updateData, session) {
		const Group = mongoose.models.Group;
		const options = {
			new: true,
			upsert: true,
			...session ? { session } : {}
		};
		return await Group.findOneAndUpdate({
			idOnTheSource,
			source
		}, { $set: updateData }, options);
	}
	/**
	* Add a user to a group
	* Only updates Group.memberIds (one-way relationship)
	* Note: memberIds stores idOnTheSource values, not ObjectIds
	*
	* @param userId - The user ID
	* @param groupId - The group ID to add
	* @param session - Optional MongoDB session for transactions
	* @returns The user and updated group documents
	*/
	async function addUserToGroup(userId, groupId, session) {
		const User = mongoose.models.User;
		const Group = mongoose.models.Group;
		const options = {
			new: true,
			...session ? { session } : {}
		};
		const user = await User.findById(userId, "idOnTheSource", options).lean();
		if (!user) throw new Error(`User not found: ${userId}`);
		const userIdOnTheSource = user.idOnTheSource || userId.toString();
		return {
			user,
			group: await Group.findByIdAndUpdate(groupId, { $addToSet: { memberIds: userIdOnTheSource } }, options).lean()
		};
	}
	/**
	* Remove a user from a group
	* Only updates Group.memberIds (one-way relationship)
	* Note: memberIds stores idOnTheSource values, not ObjectIds
	*
	* @param userId - The user ID
	* @param groupId - The group ID to remove
	* @param session - Optional MongoDB session for transactions
	* @returns The user and updated group documents
	*/
	async function removeUserFromGroup(userId, groupId, session) {
		const User = mongoose.models.User;
		const Group = mongoose.models.Group;
		const options = {
			new: true,
			...session ? { session } : {}
		};
		const user = await User.findById(userId, "idOnTheSource", options).lean();
		if (!user) throw new Error(`User not found: ${userId}`);
		const userIdOnTheSource = user.idOnTheSource || userId.toString();
		return {
			user,
			group: await Group.findByIdAndUpdate(groupId, { $pullAll: { memberIds: [userIdOnTheSource] } }, options).lean()
		};
	}
	/**
	* Get all groups a user is a member of
	* @param userId - The user ID
	* @param session - Optional MongoDB session for transactions
	* @returns Array of group documents
	*/
	async function getUserGroups(userId, session) {
		return await findGroupsByMemberId(userId, session);
	}
	/**
	* Get a list of all principal identifiers for a user (user ID + group IDs + public).
	* For use in permission checks.
	*
	* Tenant filtering for group memberships is handled automatically by the
	* `applyTenantIsolation` Mongoose plugin on the Group schema. The
	* `tenantContextMiddleware` (chained by `requireJwtAuth` after passport auth)
	* sets the ALS context, so `getUserGroups()` → `findGroupsByMemberId()` queries
	* are scoped to the requesting tenant. No explicit tenantId parameter is needed.
	*
	* IMPORTANT: This relies on the ALS tenant context being active. If this
	* function is called outside a request context (e.g. startup, background jobs),
	* group queries will be unscoped. In strict mode, the Mongoose plugin will
	* reject such queries.
	*
	* Ref: #12091 (resolved by tenant context middleware in requireJwtAuth)
	*
	* @param params - Parameters object
	* @param params.userId - The user ID
	* @param params.role - Optional user role (if not provided, will query from DB)
	* @param session - Optional MongoDB session for transactions
	* @returns Array of principal objects with type and id
	*/
	async function getUserPrincipals(params, session) {
		const { userId, role } = params;
		/** `userId` must be an `ObjectId` for USER principal since ACL entries store `ObjectId`s */
		const userObjectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
		const principals = [{
			principalType: PrincipalType.USER,
			principalId: userObjectId
		}];
		let userRole = role;
		if (userRole === void 0) {
			const query = mongoose.models.User.findById(userId).select("role");
			if (session) query.session(session);
			userRole = (await query.lean())?.role;
		}
		if (userRole && userRole.trim()) principals.push({
			principalType: PrincipalType.ROLE,
			principalId: userRole
		});
		const userGroups = await getUserGroups(userId, session);
		if (userGroups && userGroups.length > 0) userGroups.forEach((group) => {
			principals.push({
				principalType: PrincipalType.GROUP,
				principalId: group._id
			});
		});
		principals.push({ principalType: PrincipalType.PUBLIC });
		return principals;
	}
	/**
	* Sync a user's Entra ID group memberships
	* @param userId - The user ID
	* @param entraGroups - Array of Entra groups with id and name
	* @param session - Optional MongoDB session for transactions
	* @returns The updated user with new group memberships
	*/
	async function syncUserEntraGroups(userId, entraGroups, session) {
		const User = mongoose.models.User;
		const Group = mongoose.models.Group;
		const query = User.findById(userId, { idOnTheSource: 1 });
		if (session) query.session(session);
		const user = await query.lean();
		if (!user) throw new Error(`User not found: ${userId}`);
		/** Get user's idOnTheSource for storing in group.memberIds */
		const userIdOnTheSource = user.idOnTheSource || userId.toString();
		const entraIdMap = /* @__PURE__ */ new Map();
		const addedGroups = [];
		const removedGroups = [];
		for (const entraGroup of entraGroups) {
			entraIdMap.set(entraGroup.id, true);
			let group = await findGroupByExternalId(entraGroup.id, "entra", {}, session);
			if (!group) {
				group = await createGroup({
					name: entraGroup.name,
					description: entraGroup.description,
					email: entraGroup.email,
					idOnTheSource: entraGroup.id,
					source: "entra",
					memberIds: [userIdOnTheSource]
				}, session);
				addedGroups.push(group);
			} else if (!group.memberIds?.includes(userIdOnTheSource)) {
				const { group: updatedGroup } = await addUserToGroup(userId, group._id, session);
				if (updatedGroup) addedGroups.push(updatedGroup);
			}
		}
		const groupsQuery = Group.find({
			source: "entra",
			memberIds: userIdOnTheSource
		}, {
			_id: 1,
			idOnTheSource: 1
		});
		if (session) groupsQuery.session(session);
		const existingGroups = await groupsQuery.lean();
		for (const group of existingGroups) if (group.idOnTheSource && !entraIdMap.has(group.idOnTheSource)) {
			const { group: removedGroup } = await removeUserFromGroup(userId, group._id, session);
			if (removedGroup) removedGroups.push(removedGroup);
		}
		const userQuery = User.findById(userId);
		if (session) userQuery.session(session);
		const updatedUser = await userQuery.lean();
		if (!updatedUser) throw new Error(`User not found after update: ${userId}`);
		return {
			user: updatedUser,
			addedGroups,
			removedGroups
		};
	}
	/**
	* Calculate relevance score for a search result
	* @param item - The search result item
	* @param searchPattern - The search pattern
	* @returns Relevance score (0-100)
	*/
	function calculateRelevanceScore(item, searchPattern) {
		const normalizedPattern = searchPattern.toLowerCase();
		/** Get searchable text based on type */
		const searchableFields = item.type === PrincipalType.USER ? [
			item.name,
			item.email,
			item.username
		].filter(Boolean) : [
			item.name,
			item.email,
			item.description
		].filter(Boolean);
		let maxScore = 0;
		for (const field of searchableFields) {
			if (!field) continue;
			const fieldLower = field.toLowerCase();
			let score = 0;
			/** Exact match gets highest score */
			if (fieldLower === normalizedPattern) score = 100;
			else if (fieldLower.startsWith(normalizedPattern))
 /** Starts with query gets high score */
			score = 80;
			else if (fieldLower.includes(normalizedPattern))
 /** Contains query gets medium score */
			score = 50;
			else
 /** Default score for database match */
			score = 10;
			maxScore = Math.max(maxScore, score);
		}
		return maxScore;
	}
	/**
	* Sort principals by relevance score and type priority
	* @param results - Array of results with _searchScore property
	* @returns Sorted array
	*/
	function sortPrincipalsByRelevance(results) {
		return results.sort((a, b) => {
			if (b._searchScore !== a._searchScore) return (b._searchScore || 0) - (a._searchScore || 0);
			if (a.type !== b.type) return a.type === PrincipalType.USER ? -1 : 1;
			const aName = a.name || a.email || "";
			const bName = b.name || b.email || "";
			return aName.localeCompare(bName);
		});
	}
	/**
	* Transform user object to TPrincipalSearchResult format
	* @param user - User object from database
	* @returns Transformed user result
	*/
	function transformUserToTPrincipalSearchResult(user) {
		return {
			id: user.id,
			type: PrincipalType.USER,
			name: user.name || user.email,
			email: user.email,
			username: user.username,
			avatar: user.avatar,
			provider: user.provider,
			source: "local",
			idOnTheSource: user.idOnTheSource || user.id
		};
	}
	/**
	* Transform group object to TPrincipalSearchResult format
	* @param group - Group object from database
	* @returns Transformed group result
	*/
	function transformGroupToTPrincipalSearchResult(group) {
		return {
			id: group._id?.toString(),
			type: PrincipalType.GROUP,
			name: group.name,
			email: group.email,
			avatar: group.avatar,
			description: group.description,
			source: group.source || "local",
			memberCount: group.memberIds ? group.memberIds.length : 0,
			idOnTheSource: group.idOnTheSource || group._id?.toString()
		};
	}
	/**
	* Search for principals (users and groups) by pattern matching on name/email
	* Returns combined results in TPrincipalSearchResult format without sorting
	* @param searchPattern - The pattern to search for
	* @param limitPerType - Maximum number of results to return
	* @param typeFilter - Optional array of types to filter by, or null for all types
	* @param session - Optional MongoDB session for transactions
	* @returns Array of principals in TPrincipalSearchResult format
	*/
	async function searchPrincipals(searchPattern, limitPerType = 10, typeFilter = null, session) {
		if (!searchPattern || searchPattern.trim().length === 0) return [];
		const trimmedPattern = searchPattern.trim();
		const escapedPattern = escapeRegExp(trimmedPattern);
		const promises = [];
		if (!typeFilter || typeFilter.includes(PrincipalType.USER)) {
			/** Note: searchUsers is imported from ~/models and needs to be passed in or implemented */
			const userFields = "name email username avatar provider idOnTheSource";
			/** For now, we'll use a direct query instead of searchUsers */
			const User = mongoose.models.User;
			const regex = new RegExp(escapedPattern, "i");
			const userQuery = User.find({ $or: [
				{ name: regex },
				{ email: regex },
				{ username: regex }
			] }).select(userFields).limit(limitPerType);
			if (session) userQuery.session(session);
			promises.push(userQuery.lean().then((users) => users.map((user) => {
				const userWithId = user;
				return transformUserToTPrincipalSearchResult({
					id: userWithId._id?.toString() || "",
					name: userWithId.name,
					email: userWithId.email,
					username: userWithId.username,
					avatar: userWithId.avatar,
					provider: userWithId.provider
				});
			})));
		} else promises.push(Promise.resolve([]));
		if (!typeFilter || typeFilter.includes(PrincipalType.GROUP)) promises.push(findGroupsByNamePattern(trimmedPattern, null, limitPerType, session).then((groups) => groups.map(transformGroupToTPrincipalSearchResult)));
		else promises.push(Promise.resolve([]));
		if (!typeFilter || typeFilter.includes(PrincipalType.ROLE)) {
			const Role = mongoose.models.Role;
			if (Role) {
				const regex = new RegExp(escapedPattern, "i");
				const roleQuery = Role.find({ name: regex }).select("name").limit(limitPerType);
				if (session) roleQuery.session(session);
				promises.push(roleQuery.lean().then((roles) => roles.map((role) => ({
					/** Role name as ID */
					id: role.name,
					type: PrincipalType.ROLE,
					name: role.name,
					source: "local",
					idOnTheSource: role.name
				}))));
			}
		} else promises.push(Promise.resolve([]));
		return (await Promise.all(promises)).flat();
	}
	/**
	* Removes a user from all groups they belong to.
	* @param userId - The user ID (or ObjectId) of the member to remove
	*/
	async function removeUserFromAllGroups(userId) {
		await mongoose.models.Group.updateMany({ memberIds: userId }, { $pullAll: { memberIds: [userId] } });
	}
	/**
	* Finds a single group matching the given filter.
	* @param filter - MongoDB filter query
	*/
	async function findGroupByQuery(filter, session) {
		const query = mongoose.models.Group.findOne(filter);
		if (session) query.session(session);
		return query.lean();
	}
	/**
	* Updates a group by its ID.
	* @param groupId - The group's ObjectId
	* @param data - Fields to set via $set
	*/
	async function updateGroupById(groupId, data, session) {
		const Group = mongoose.models.Group;
		const options = {
			new: true,
			...session ? { session } : {}
		};
		return Group.findByIdAndUpdate(groupId, { $set: data }, options).lean();
	}
	/**
	* Bulk-updates groups matching a filter.
	* @param filter - MongoDB filter query
	* @param update - Update operations
	* @param options - Optional query options (e.g., { session })
	*/
	async function bulkUpdateGroups(filter, update, options) {
		return mongoose.models.Group.updateMany(filter, update, options || {});
	}
	function buildGroupQuery(filter) {
		const query = {};
		if (filter.source) query.source = filter.source;
		if (filter.search) {
			const regex = new RegExp(escapeRegExp(filter.search), "i");
			query.$or = [
				{ name: regex },
				{ email: regex },
				{ description: regex }
			];
		}
		return query;
	}
	/**
	* List groups with optional source, search, and pagination filters.
	* Results are sorted by name.
	* @param filter - Optional filter with source, search, limit, and offset fields
	* @param session - Optional MongoDB session for transactions
	*/
	async function listGroups(filter = {}, session) {
		const Group = mongoose.models.Group;
		const query = buildGroupQuery(filter);
		const limit = filter.limit ?? 50;
		const offset = filter.offset ?? 0;
		return await Group.find(query).sort({ name: 1 }).skip(offset).limit(limit).session(session ?? null).lean();
	}
	/**
	* Count groups matching optional source and search filters.
	* @param filter - Optional filter with source and search fields
	* @param session - Optional MongoDB session for transactions
	*/
	async function countGroups(filter = {}, session) {
		const Group = mongoose.models.Group;
		const query = buildGroupQuery(filter);
		return await Group.countDocuments(query).session(session ?? null);
	}
	/**
	* Delete a group by its ID.
	* @param groupId - The group's ObjectId
	* @param session - Optional MongoDB session for transactions
	*/
	async function deleteGroup(groupId, session) {
		const Group = mongoose.models.Group;
		const options = session ? { session } : {};
		return await Group.findByIdAndDelete(groupId, options).lean();
	}
	/**
	* Remove a member from a group by raw memberId string ($pull from memberIds).
	* Unlike removeUserFromGroup, this does not look up the user first.
	* @param groupId - The group's ObjectId
	* @param memberId - The raw memberId string to remove (ObjectId or idOnTheSource)
	* @param session - Optional MongoDB session for transactions
	*/
	async function removeMemberById(groupId, memberId, session) {
		const Group = mongoose.models.Group;
		const options = {
			new: true,
			...session ? { session } : {}
		};
		return await Group.findByIdAndUpdate(groupId, { $pull: { memberIds: memberId } }, options).lean();
	}
	return {
		findGroupById,
		findGroupByExternalId,
		findGroupsByExternalIds,
		findGroupsByNamePattern,
		findGroupsByMemberId,
		createGroup,
		upsertGroupByExternalId,
		addUserToGroup,
		removeUserFromGroup,
		removeUserFromAllGroups,
		findGroupByQuery,
		updateGroupById,
		bulkUpdateGroups,
		getUserGroups,
		getUserPrincipals,
		syncUserEntraGroups,
		searchPrincipals,
		calculateRelevanceScore,
		sortPrincipalsByRelevance,
		listGroups,
		countGroups,
		deleteGroup,
		removeMemberById
	};
}
//#endregion
//#region src/methods/aclEntry.ts
/**
* Empty frozen array shared by every rejection path. Returning a single
* instance keeps the hot path allocation-free and freezes a known-safe value
* so it can never mutate into a "match everything" list.
*/
const EMPTY_SUPERSETS = Object.freeze([]);
const supersetCache = /* @__PURE__ */ new Map();
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
function permissionBitSupersets(requiredBits) {
	if (!Number.isInteger(requiredBits) || requiredBits < 0 || requiredBits > MAX_PERM_BITS || (requiredBits & ~MAX_PERM_BITS) !== 0) return EMPTY_SUPERSETS;
	const cached = supersetCache.get(requiredBits);
	if (cached !== void 0) return cached;
	const supersets = [];
	for (let v = 0; v <= MAX_PERM_BITS; v++) if ((v & requiredBits) === requiredBits) supersets.push(v);
	/**
	* Freeze the cached array so a future caller cannot mutate the shared cache
	* entry. All current callers only forward this to Mongoose's `$in`, which
	* does not mutate — freezing is cheap and prevents silent corruption.
	*/
	const frozen = Object.freeze(supersets);
	supersetCache.set(requiredBits, frozen);
	return frozen;
}
function createAclEntryMethods(mongoose) {
	/**
	* Find ACL entries for a specific principal (user or group)
	* @param principalType - The type of principal ('user', 'group')
	* @param principalId - The ID of the principal
	* @param resourceType - Optional filter by resource type
	* @returns Array of ACL entries
	*/
	async function findEntriesByPrincipal(principalType, principalId, resourceType) {
		const AclEntry = mongoose.models.AclEntry;
		const query = {
			principalType,
			principalId
		};
		if (resourceType) query.resourceType = resourceType;
		return await AclEntry.find(query).lean();
	}
	/**
	* Find ACL entries for a specific resource
	* @param resourceType - The type of resource ('agent', 'project', 'file')
	* @param resourceId - The ID of the resource
	* @returns Array of ACL entries
	*/
	async function findEntriesByResource(resourceType, resourceId) {
		return await mongoose.models.AclEntry.find({
			resourceType,
			resourceId
		}).lean();
	}
	/**
	* Find all ACL entries for a set of principals (including public)
	* @param principalsList - List of principals, each containing { principalType, principalId }
	* @param resourceType - The type of resource
	* @param resourceId - The ID of the resource
	* @returns Array of matching ACL entries
	*/
	async function findEntriesByPrincipalsAndResource(principalsList, resourceType, resourceId) {
		const AclEntry = mongoose.models.AclEntry;
		const principalsQuery = principalsList.map((p) => ({
			principalType: p.principalType,
			...p.principalType !== PrincipalType.PUBLIC && { principalId: p.principalId }
		}));
		return await AclEntry.find({
			$or: principalsQuery,
			resourceType,
			resourceId
		}).lean();
	}
	/**
	* Check if a set of principals has a specific permission on a resource.
	* See {@link permissionBitSupersets} for the Cosmos-compatible bit filter.
	* @param principalsList - List of principals, each containing { principalType, principalId }
	* @param resourceType - The type of resource
	* @param resourceId - The ID of the resource
	* @param permissionBit - The permission bit to check (use PermissionBits enum)
	* @returns Whether any of the principals has the permission
	*/
	async function hasPermission(principalsList, resourceType, resourceId, permissionBit) {
		const AclEntry = mongoose.models.AclEntry;
		const principalsQuery = principalsList.map((p) => ({
			principalType: p.principalType,
			...p.principalType !== PrincipalType.PUBLIC && { principalId: p.principalId }
		}));
		return !!await AclEntry.findOne({
			$or: principalsQuery,
			resourceType,
			resourceId,
			permBits: { $in: permissionBitSupersets(permissionBit) }
		}).select("_id").lean();
	}
	/**
	* Get the combined effective permissions for a set of principals on a resource
	* @param principalsList - List of principals, each containing { principalType, principalId }
	* @param resourceType - The type of resource
	* @param resourceId - The ID of the resource
	* @returns {Promise<number>} Effective permission bitmask
	*/
	async function getEffectivePermissions(principalsList, resourceType, resourceId) {
		const aclEntries = await findEntriesByPrincipalsAndResource(principalsList, resourceType, resourceId);
		let effectiveBits = 0;
		for (const entry of aclEntries) effectiveBits |= entry.permBits;
		return effectiveBits;
	}
	/**
	* Get effective permissions for multiple resources in a single query (BATCH)
	* Returns a map of resourceId → effectivePermissionBits
	*
	* @param principalsList - List of principals (user + groups + public)
	* @param resourceType - The type of resource ('MCPSERVER', 'AGENT', etc.)
	* @param resourceIds - Array of resource IDs to check
	* @returns {Promise<Map<string, number>>} Map of resourceId → permission bits
	*
	* @example
	* const principals = await getUserPrincipals({ userId, role });
	* const serverIds = [id1, id2, id3];
	* const permMap = await getEffectivePermissionsForResources(
	*   principals,
	*   ResourceType.MCPSERVER,
	*   serverIds
	* );
	* // permMap.get(id1.toString()) → 7 (VIEW|EDIT|DELETE)
	*/
	async function getEffectivePermissionsForResources(principalsList, resourceType, resourceIds) {
		if (!Array.isArray(resourceIds) || resourceIds.length === 0) return /* @__PURE__ */ new Map();
		const AclEntry = mongoose.models.AclEntry;
		const principalsQuery = principalsList.map((p) => ({
			principalType: p.principalType,
			...p.principalType !== PrincipalType.PUBLIC && { principalId: p.principalId }
		}));
		const aclEntries = await AclEntry.find({
			$or: principalsQuery,
			resourceType,
			resourceId: { $in: resourceIds }
		}).lean();
		const permissionsMap = /* @__PURE__ */ new Map();
		for (const entry of aclEntries) {
			const rid = entry.resourceId.toString();
			const currentBits = permissionsMap.get(rid) || 0;
			permissionsMap.set(rid, currentBits | entry.permBits);
		}
		return permissionsMap;
	}
	/**
	* Grant permission to a principal for a resource
	* @param principalType - The type of principal ('user', 'group', 'public')
	* @param principalId - The ID of the principal (null for 'public')
	* @param resourceType - The type of resource
	* @param resourceId - The ID of the resource
	* @param permBits - The permission bits to grant
	* @param grantedBy - The ID of the user granting the permission
	* @param session - Optional MongoDB session for transactions
	* @param roleId - Optional role ID to associate with this permission
	* @returns The created or updated ACL entry
	*/
	async function grantPermission(principalType, principalId, resourceType, resourceId, permBits, grantedBy, session, roleId, expiredAt) {
		const AclEntry = mongoose.models.AclEntry;
		const query = {
			principalType,
			resourceType,
			resourceId
		};
		if (principalType !== PrincipalType.PUBLIC) {
			query.principalId = typeof principalId === "string" && principalType !== PrincipalType.ROLE ? new Types.ObjectId(principalId) : principalId;
			if (principalType === PrincipalType.USER) query.principalModel = PrincipalModel.USER;
			else if (principalType === PrincipalType.GROUP) query.principalModel = PrincipalModel.GROUP;
			else if (principalType === PrincipalType.ROLE) query.principalModel = PrincipalModel.ROLE;
		}
		const update = { $set: {
			permBits,
			grantedAt: /* @__PURE__ */ new Date(),
			...grantedBy && { grantedBy },
			...roleId && { roleId },
			...expiredAt && { expiredAt }
		} };
		const options = {
			upsert: true,
			new: true,
			...session ? { session } : {}
		};
		return await AclEntry.findOneAndUpdate(query, update, options);
	}
	/**
	* Revoke permissions from a principal for a resource
	* @param principalType - The type of principal ('user', 'group', 'public')
	* @param principalId - The ID of the principal (null for 'public')
	* @param resourceType - The type of resource
	* @param resourceId - The ID of the resource
	* @param session - Optional MongoDB session for transactions
	* @returns The result of the delete operation
	*/
	async function revokePermission(principalType, principalId, resourceType, resourceId, session) {
		const AclEntry = mongoose.models.AclEntry;
		const query = {
			principalType,
			resourceType,
			resourceId
		};
		if (principalType !== PrincipalType.PUBLIC) query.principalId = typeof principalId === "string" && principalType !== PrincipalType.ROLE ? new Types.ObjectId(principalId) : principalId;
		const options = session ? { session } : {};
		return await AclEntry.deleteOne(query, options);
	}
	/**
	* Modify existing permission bits for a principal on a resource
	* @param principalType - The type of principal ('user', 'group', 'public')
	* @param principalId - The ID of the principal (null for 'public')
	* @param resourceType - The type of resource
	* @param resourceId - The ID of the resource
	* @param addBits - Permission bits to add
	* @param removeBits - Permission bits to remove
	* @param session - Optional MongoDB session for transactions
	* @returns The updated ACL entry
	*/
	async function modifyPermissionBits(principalType, principalId, resourceType, resourceId, addBits, removeBits, session) {
		const AclEntry = mongoose.models.AclEntry;
		const query = {
			principalType,
			resourceType,
			resourceId
		};
		if (principalType !== PrincipalType.PUBLIC) query.principalId = typeof principalId === "string" && principalType !== PrincipalType.ROLE ? new Types.ObjectId(principalId) : principalId;
		const update = {};
		if (addBits) update.$bit = { permBits: { or: addBits } };
		if (removeBits) {
			if (!update.$bit) update.$bit = {};
			const bitUpdate = update.$bit;
			bitUpdate.permBits = {
				...bitUpdate.permBits,
				and: ~removeBits
			};
		}
		const options = {
			new: true,
			...session ? { session } : {}
		};
		return await AclEntry.findOneAndUpdate(query, update, options);
	}
	/**
	* Find all resources of a specific type that a set of principals has access to.
	* See {@link permissionBitSupersets} for the Cosmos-compatible bit filter.
	* @param principalsList - List of principals, each containing { principalType, principalId }
	* @param resourceType - The type of resource
	* @param requiredPermBit - Required permission bit (use PermissionBits enum)
	* @returns Array of resource IDs
	*/
	async function findAccessibleResources(principalsList, resourceType, requiredPermBit) {
		const AclEntry = mongoose.models.AclEntry;
		const principalsQuery = principalsList.map((p) => ({
			principalType: p.principalType,
			...p.principalType !== PrincipalType.PUBLIC && { principalId: p.principalId }
		}));
		return await AclEntry.find({
			$or: principalsQuery,
			resourceType,
			permBits: { $in: permissionBitSupersets(requiredPermBit) }
		}).distinct("resourceId");
	}
	/**
	* Deletes ACL entries matching the given filter.
	* @param filter - MongoDB filter query
	* @param options - Optional query options (e.g., { session })
	*/
	async function deleteAclEntries(filter, options) {
		return mongoose.models.AclEntry.deleteMany(filter, options || {});
	}
	/**
	* Performs a bulk write operation on ACL entries.
	* @param ops - Array of bulk write operations
	* @param options - Optional query options (e.g., { session })
	*/
	async function bulkWriteAclEntries(ops, options) {
		const AclEntry = mongoose.models.AclEntry;
		return tenantSafeBulkWrite(AclEntry, ops, options || {});
	}
	/**
	* Finds all publicly accessible resource IDs for a given resource type.
	* See {@link permissionBitSupersets} for the Cosmos-compatible bit filter.
	* @param resourceType - The type of resource
	* @param requiredPermissions - Required permission bits
	*/
	async function findPublicResourceIds(resourceType, requiredPermissions) {
		return await mongoose.models.AclEntry.find({
			principalType: PrincipalType.PUBLIC,
			resourceType,
			permBits: { $in: permissionBitSupersets(requiredPermissions) }
		}).distinct("resourceId");
	}
	/**
	* Runs an aggregation pipeline on the AclEntry collection.
	* @param pipeline - MongoDB aggregation pipeline stages
	*/
	async function aggregateAclEntries(pipeline) {
		return mongoose.models.AclEntry.aggregate(pipeline);
	}
	/**
	* Returns resource IDs solely owned by the given user (no other principals
	* hold DELETE on the same resource). Handles both single and array resource types.
	* See {@link permissionBitSupersets} for the Cosmos-compatible bit filter.
	*/
	async function getSoleOwnedResourceIds(userObjectId, resourceTypes) {
		const AclEntry = mongoose.models.AclEntry;
		const types = Array.isArray(resourceTypes) ? resourceTypes : [resourceTypes];
		const deleteSupersets = permissionBitSupersets(PermissionBits.DELETE);
		const ownedEntries = await AclEntry.find({
			principalType: PrincipalType.USER,
			principalId: userObjectId,
			resourceType: { $in: types },
			permBits: { $in: deleteSupersets }
		}).select("resourceId").lean();
		if (ownedEntries.length === 0) return [];
		const ownedIds = ownedEntries.map((e) => e.resourceId);
		const otherOwners = await AclEntry.aggregate([{ $match: {
			resourceType: { $in: types },
			resourceId: { $in: ownedIds },
			permBits: { $in: deleteSupersets },
			$or: [{ principalId: { $ne: userObjectId } }, { principalType: { $ne: PrincipalType.USER } }]
		} }, { $group: { _id: "$resourceId" } }]);
		const multiOwnerIds = new Set(otherOwners.map((doc) => doc._id.toString()));
		return ownedIds.filter((id) => !multiOwnerIds.has(id.toString()));
	}
	return {
		findEntriesByPrincipal,
		findEntriesByResource,
		findEntriesByPrincipalsAndResource,
		hasPermission,
		getEffectivePermissions,
		getEffectivePermissionsForResources,
		grantPermission,
		revokePermission,
		modifyPermissionBits,
		findAccessibleResources,
		deleteAclEntries,
		bulkWriteAclEntries,
		findPublicResourceIds,
		aggregateAclEntries,
		getSoleOwnedResourceIds
	};
}
//#endregion
//#region src/methods/systemGrant.ts
const reverseImplications = {};
for (const [broad, implied] of Object.entries(CapabilityImplications)) for (const cap of implied) (reverseImplications[cap] ??= []).push(broad);
const baseCapabilityValues = new Set(Object.values(SystemCapabilities));
/**
* For a section/assignment capability like `manage:configs:endpoints` or
* `assign:configs:user`, returns all base capabilities that subsume it:
* the direct parent (`manage:configs`) plus any that imply the parent
* via `reverseImplications` (`manage:configs` has no reverse, but
* `read:configs` is implied by `manage:configs`—so `read:configs:endpoints`
* is satisfied by holding `manage:configs`).
*/
function getParentCapabilities(capability) {
	const lastColon = capability.lastIndexOf(":");
	if (lastColon === -1) return [];
	const parent = capability.slice(0, lastColon);
	if (!baseCapabilityValues.has(parent)) return [];
	const parents = [parent];
	const implied = reverseImplications[parent];
	if (implied) parents.push(...implied);
	return parents;
}
function createSystemGrantMethods(mongoose) {
	function tenantCondition(tenantId) {
		return tenantId != null ? { $and: [{ $or: [{ tenantId }, { tenantId: { $exists: false } }] }] } : { tenantId: { $exists: false } };
	}
	/**
	* Check if any of the given principals holds a specific capability.
	* Follows the same principal-resolution pattern as AclEntry:
	* getUserPrincipals → $or query.
	*
	* @param principals - Resolved principal list from getUserPrincipals
	* @param capability - The capability to check
	* @param tenantId  - If present, checks tenant-scoped grant; if absent, checks platform-level
	*/
	async function hasCapabilityForPrincipals({ principals, capability, tenantId }) {
		const SystemGrant = mongoose.models.SystemGrant;
		const principalsQuery = principals.filter((p) => p.principalType !== PrincipalType.PUBLIC && p.principalId != null).map((p) => ({
			principalType: p.principalType,
			principalId: normalizePrincipalId(p.principalId, p.principalType)
		}));
		if (!principalsQuery.length) return false;
		const impliedBy = reverseImplications[capability] ?? [];
		const parents = getParentCapabilities(capability);
		const allMatches = [
			capability,
			...impliedBy,
			...parents
		];
		const query = {
			$or: principalsQuery,
			capability: allMatches.length > 1 ? { $in: allMatches } : capability,
			...tenantCondition(tenantId)
		};
		return await SystemGrant.exists(query) != null;
	}
	/**
	* Returns the subset of `capabilities` that any of the given principals hold.
	* Single DB round-trip — replaces N parallel `hasCapabilityForPrincipals` calls.
	*/
	async function getHeldCapabilities({ principals, capabilities, tenantId }) {
		const SystemGrant = mongoose.models.SystemGrant;
		const principalsQuery = principals.filter((p) => p.principalType !== PrincipalType.PUBLIC && p.principalId != null).map((p) => ({
			principalType: p.principalType,
			principalId: normalizePrincipalId(p.principalId, p.principalType)
		}));
		if (!principalsQuery.length || !capabilities.length) return /* @__PURE__ */ new Set();
		const allCaps = new Set([
			...capabilities,
			...capabilities.flatMap((cap) => reverseImplications[cap] ?? []),
			...capabilities.flatMap(getParentCapabilities)
		]);
		const docs = await SystemGrant.find({
			$or: principalsQuery,
			capability: { $in: [...allCaps] },
			...tenantCondition(tenantId)
		}, {
			capability: 1,
			_id: 0
		}).lean();
		const held = new Set(docs.map((d) => d.capability));
		const result = /* @__PURE__ */ new Set();
		for (const cap of capabilities) {
			if (held.has(cap)) {
				result.add(cap);
				continue;
			}
			if (reverseImplications[cap]?.some((imp) => held.has(imp))) {
				result.add(cap);
				continue;
			}
			if (getParentCapabilities(cap).some((p) => held.has(p))) result.add(cap);
		}
		return result;
	}
	/**
	* Grant a capability to a principal. Upsert — idempotent.
	*/
	async function grantCapability({ principalType, principalId, capability, tenantId, grantedBy }, session) {
		const SystemGrant = mongoose.models.SystemGrant;
		const normalizedPrincipalId = normalizePrincipalId(principalId, principalType);
		const filter = {
			principalType,
			principalId: normalizedPrincipalId,
			capability,
			tenantId: tenantId != null ? tenantId : { $exists: false }
		};
		/**
		* Insert-only: re-asserting an existing grant is a true no-op (no field is
		* mutated), so `created === false` reliably means "nothing changed" and the
		* caller can safely skip audit emission. `grantedAt`/`grantedBy` therefore
		* record the original grant, not the last re-assert.
		*/
		const update = { $setOnInsert: {
			principalType,
			principalId: normalizedPrincipalId,
			capability,
			grantedAt: /* @__PURE__ */ new Date(),
			...grantedBy != null && { grantedBy },
			...tenantId != null && { tenantId }
		} };
		try {
			/** `includeResultMetadata` surfaces `lastErrorObject.upserted` so callers
			* (audit emission) can tell a brand-new grant from an idempotent re-assert
			* atomically, without a racy pre-read. Passed inline so the metadata
			* overload is selected. */
			const result = await SystemGrant.findOneAndUpdate(filter, update, {
				upsert: true,
				new: true,
				includeResultMetadata: true,
				session
			});
			return {
				grant: result.value,
				created: result.lastErrorObject?.upserted != null
			};
		} catch (err) {
			if (err.code === 11e3) return {
				grant: await SystemGrant.findOne(filter).lean(),
				created: false
			};
			throw err;
		}
	}
	/**
	* Revoke a capability from a principal. Returns the deletion result so
	* callers (e.g. audit emission) can distinguish a real revoke from a
	* no-op against a grant that didn't exist.
	*/
	async function revokeCapability({ principalType, principalId, capability, tenantId }, session) {
		const SystemGrant = mongoose.models.SystemGrant;
		const filter = {
			principalType,
			principalId: normalizePrincipalId(principalId, principalType),
			capability,
			tenantId: tenantId != null ? tenantId : { $exists: false }
		};
		const options = session ? { session } : {};
		return { deletedCount: (await SystemGrant.deleteOne(filter, options)).deletedCount ?? 0 };
	}
	/**
	* List all capabilities held by a principal — used by the capabilities
	* introspection endpoint.
	*/
	async function getCapabilitiesForPrincipal({ principalType, principalId, tenantId }) {
		const SystemGrant = mongoose.models.SystemGrant;
		const filter = {
			principalType,
			principalId: normalizePrincipalId(principalId, principalType),
			...tenantCondition(tenantId)
		};
		return await SystemGrant.find(filter).lean();
	}
	const GRANTS_DEFAULT_LIMIT = 50;
	const GRANTS_MAX_LIMIT = 200;
	async function listGrants(options) {
		const SystemGrant = mongoose.models.SystemGrant;
		const limit = Math.min(GRANTS_MAX_LIMIT, Math.max(1, options?.limit ?? GRANTS_DEFAULT_LIMIT));
		const offset = options?.offset ?? 0;
		const filter = {
			...options?.principalTypes?.length && { principalType: { $in: options.principalTypes } },
			...tenantCondition(options?.tenantId)
		};
		return SystemGrant.find(filter).sort({
			principalType: 1,
			capability: 1
		}).skip(offset).limit(limit).lean();
	}
	async function countGrants(options) {
		const SystemGrant = mongoose.models.SystemGrant;
		const filter = {
			...options?.principalTypes?.length && { principalType: { $in: options.principalTypes } },
			...tenantCondition(options?.tenantId)
		};
		return SystemGrant.countDocuments(filter);
	}
	async function getCapabilitiesForPrincipals({ principals, tenantId }) {
		if (!principals.length) return [];
		const SystemGrant = mongoose.models.SystemGrant;
		const principalsQuery = principals.filter((p) => p.principalType !== PrincipalType.PUBLIC).map((p) => ({
			principalType: p.principalType,
			principalId: normalizePrincipalId(p.principalId, p.principalType)
		}));
		if (!principalsQuery.length) return [];
		const filter = {
			$or: principalsQuery,
			...tenantCondition(tenantId)
		};
		return await SystemGrant.find(filter).lean();
	}
	/**
	* Seed the ADMIN role with all system capabilities.
	* Context-agnostic: caller provides tenant context (e.g., `runAsSystem()` for
	* startup, `tenantStorage.run()` for future per-tenant provisioning).
	* Idempotent and concurrency-safe: uses bulkWrite with ordered:false so parallel
	* server instances (K8s rolling deploy, PM2 cluster) do not race on E11000.
	* Retries up to 3 times with exponential backoff on transient failures.
	*/
	async function seedSystemGrants() {
		const maxRetries = 3;
		for (let attempt = 1; attempt <= maxRetries; attempt++) try {
			const SystemGrant = mongoose.models.SystemGrant;
			const now = /* @__PURE__ */ new Date();
			await tenantSafeBulkWrite(SystemGrant, Object.values(SystemCapabilities).map((capability) => ({ updateOne: {
				filter: {
					principalType: PrincipalType.ROLE,
					principalId: SystemRoles.ADMIN,
					capability,
					tenantId: { $exists: false }
				},
				update: { $setOnInsert: {
					principalType: PrincipalType.ROLE,
					principalId: SystemRoles.ADMIN,
					capability,
					grantedAt: now
				} },
				upsert: true
			} })), { ordered: false });
			return;
		} catch (err) {
			if (attempt < maxRetries) {
				const delay = 1e3 * Math.pow(2, attempt - 1);
				logger.warn(`[seedSystemGrants] Attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms: ${err.message ?? String(err)}`);
				await new Promise((resolve) => setTimeout(resolve, delay));
			} else logger.error("[seedSystemGrants] Failed to seed capabilities after all retries. Admin panel access requires these grants. Manual recovery: db.systemgrants.insertMany([...]) with ADMIN role grants for each capability.", err);
		}
	}
	/**
	* Delete system grants for a principal.
	* Used for cascade cleanup when a principal (group, role) is deleted.
	*
	* When `tenantId` is provided, only grants scoped to **exactly** that
	* tenant are removed — platform-level grants (no tenantId) are left
	* intact so they continue to serve other tenants.
	* When `tenantId` is omitted, ALL grants for the principal are removed
	* regardless of tenant scope.
	*/
	async function deleteGrantsForPrincipal(principalType, principalId, options) {
		const SystemGrant = mongoose.models.SystemGrant;
		const filter = {
			principalType,
			principalId: normalizePrincipalId(principalId, principalType),
			...options?.tenantId != null && { tenantId: options.tenantId }
		};
		const queryOptions = options?.session ? { session: options.session } : {};
		/** Read the matching grants before deleting so cascade callers (e.g. role
		* deletion) can emit a `grant.removed` audit entry for each one. */
		const removed = await SystemGrant.find(filter, null, queryOptions).lean();
		await SystemGrant.deleteMany(filter, queryOptions);
		return removed;
	}
	return {
		grantCapability,
		seedSystemGrants,
		revokeCapability,
		hasCapabilityForPrincipals,
		getHeldCapabilities,
		listGrants,
		countGrants,
		getCapabilitiesForPrincipal,
		getCapabilitiesForPrincipals,
		deleteGrantsForPrincipal
	};
}
//#endregion
//#region src/methods/auditLog.ts
const DEFAULT_LIMIT = 100;
const MAX_AUDIT_LOG_LIMIT = 500;
/**
* Upper bound on rows emitted by the CSV export stream. At 100k rows per tenant
* per export request, a careless admin script (or a hostile auditor) can keep a
* cursor and a Node worker busy without saturating either; beyond that, exports
* should be sliced by `from`/`to`.
*/
const MAX_AUDIT_EXPORT_ROWS = 1e5;
/**
* Upper bound on rows verified in a single HTTP-triggered integrity check. Full
* offline jobs can pass a larger value explicitly when needed.
*/
const MAX_AUDIT_VERIFY_ROWS = 1e5;
/** Record-format version stamped on every new entry. */
const AUDIT_SCHEMA_VERSION = 1;
const MAX_SEARCH_LENGTH = 200;
/**
* Retries when concurrent appends race for the same `seq`. Generous because a
* lost append on the default fail-open path means a silently missing audit row;
* with jittered backoff this resolves contention well beyond any realistic burst
* of parallel admin writes.
*/
const MAX_APPEND_RETRIES = 12;
/** Base unit (ms) for jittered backoff between duplicate-key retries. */
const APPEND_BACKOFF_MS = 5;
const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function escapeRegex(input) {
	return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function regexFilter(value) {
	return {
		$regex: escapeRegex(value),
		$options: "i"
	};
}
function oneOrIn(values) {
	return values.length === 1 ? values[0] : { $in: values };
}
function idToString(id) {
	return typeof id === "string" ? id : id.toString();
}
function isDuplicateKeyError(err) {
	return typeof err === "object" && err !== null && err.code === 11e3;
}
/** Distinguishes tenant chains from the platform chain so a tenant whose id is
* literally the platform sentinel cannot share the platform's audit chain. */
const TENANT_CHAIN_PREFIX = "tenant:";
/** Tenant scope → chain key. Blank/whitespace tenant is the platform chain;
* tenant ids are namespaced so they can never collide with `PLATFORM_CHAIN_KEY`. */
function auditChainKey(tenantId) {
	return typeof tenantId === "string" && tenantId.trim().length > 0 ? `${TENANT_CHAIN_PREFIX}${tenantId}` : PLATFORM_CHAIN_KEY;
}
function normalizeTenantId(tenantId) {
	return typeof tenantId === "string" && tenantId.trim().length > 0 ? tenantId : void 0;
}
/** Drop undefined values; collapse an empty map to `undefined` so the field is
* omitted entirely (and hashes identically on read-back). */
function normalizeMetadata(metadata) {
	if (!metadata) return void 0;
	const out = {};
	for (const [key, value] of Object.entries(metadata)) if (value !== void 0) out[key] = value;
	return Object.keys(out).length > 0 ? out : void 0;
}
function normalizeContext(context) {
	if (!context) return void 0;
	const out = {};
	if (context.requestId) out.requestId = context.requestId;
	if (context.ip) out.ip = context.ip;
	if (context.userAgent) out.userAgent = context.userAgent;
	if (context.sessionId) out.sessionId = context.sessionId;
	return Object.keys(out).length > 0 ? out : void 0;
}
/** Deterministic JSON: object keys sorted recursively so two semantically equal
* entries always serialize to the same string. */
function stableStringify(value) {
	if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}
function computeEntryHash(entry) {
	const canonical = {
		v: entry.schemaVersion,
		category: entry.category,
		action: entry.action,
		outcome: entry.outcome,
		severity: entry.severity,
		actor: {
			type: entry.actor.type,
			id: entry.actor.id ?? null,
			name: entry.actor.name
		},
		target: {
			type: entry.target.type,
			id: entry.target.id ?? null,
			name: entry.target.name ?? null
		},
		metadata: entry.metadata ?? null,
		context: entry.context ? {
			requestId: entry.context.requestId ?? null,
			ip: entry.context.ip ?? null,
			userAgent: entry.context.userAgent ?? null,
			sessionId: entry.context.sessionId ?? null
		} : null,
		tenantId: entry.tenantId ?? null,
		chainKey: entry.chainKey,
		seq: entry.seq,
		prevHash: entry.prevHash,
		createdAt: entry.createdAt.toISOString()
	};
	return createHash$1("sha256").update(stableStringify(canonical)).digest("hex");
}
function toWire(doc) {
	const entry = {
		id: doc._id.toString(),
		schemaVersion: doc.schemaVersion,
		category: doc.category,
		action: doc.action,
		outcome: doc.outcome,
		severity: doc.severity,
		actor: {
			type: doc.actor.type,
			name: doc.actor.name,
			...doc.actor.id != null ? { id: doc.actor.id } : {}
		},
		target: {
			type: doc.target.type,
			...doc.target.id != null ? { id: doc.target.id } : {},
			...doc.target.name != null ? { name: doc.target.name } : {}
		},
		integrity: {
			seq: doc.seq,
			hash: doc.hash,
			prevHash: doc.prevHash
		},
		timestamp: doc.createdAt.toISOString()
	};
	if (doc.metadata != null) entry.metadata = doc.metadata;
	const context = normalizeContext(doc.context);
	if (context) entry.context = context;
	if (doc.tenantId != null) entry.tenantId = doc.tenantId;
	return entry;
}
function clampLimit(limit) {
	if (!limit || Number.isNaN(limit) || limit < 1) return DEFAULT_LIMIT;
	return Math.min(Math.floor(limit), 500);
}
/**
* Builds the Mongo `find` filter for audit-log queries. Chain scoping is always
* applied first and uses the compound `{ chainKey, ... }` indexes. The substring
* regex filters (`actor.name`, `target.name`, `metadata.capability`, `search`)
* are case-insensitive and cannot use a B-tree index: within the chain slice
* they degrade to a partition scan. The primary listing combines `chainKey` with
* `seq`/`createdAt` pagination, so the scan stays bounded by the date window.
*/
function buildFilter(chainKey, filters) {
	const query = { chainKey };
	if (filters.category && filters.category.length > 0) query.category = oneOrIn(filters.category);
	if (filters.action && filters.action.length > 0) query.action = oneOrIn(filters.action);
	if (filters.outcome && filters.outcome.length > 0) query.outcome = oneOrIn(filters.outcome);
	if (filters.severity && filters.severity.length > 0) query.severity = oneOrIn(filters.severity);
	if (filters.actorType) query["actor.type"] = filters.actorType;
	if (filters.actorQuery) query["actor.name"] = regexFilter(filters.actorQuery);
	if (filters.targetType) query["target.type"] = filters.targetType;
	if (filters.targetQuery) query["target.name"] = regexFilter(filters.targetQuery);
	if (filters.capability) query["metadata.capability"] = regexFilter(filters.capability);
	if (filters.from || filters.to) {
		const createdAt = {};
		if (filters.from) createdAt.$gte = filters.from;
		if (filters.to) createdAt.$lte = filters.to;
		query.createdAt = createdAt;
	}
	if (filters.search && filters.search.length > 0) {
		const safe = regexFilter(filters.search.slice(0, MAX_SEARCH_LENGTH));
		query.$or = [
			{ "actor.name": safe },
			{ "target.name": safe },
			{ action: safe },
			{ "metadata.capability": safe }
		];
	}
	return query;
}
function createAuditLogMethods(mongoose) {
	function model() {
		return mongoose.models.AuditLog;
	}
	/**
	* The read-then-create append only serializes concurrent writers when the
	* unique `{ chainKey, seq }` index exists. With `MONGO_AUTO_INDEX=false`, or
	* during the startup window before a background build finishes, two writers
	* could insert the same `seq` with no duplicate-key error and silently fork
	* the chain. Build the indexes once before the first append so serialization
	* never depends on a background build. Memoized; reset on failure so a later
	* write retries.
	*/
	let indexPromise = null;
	function ensureIndexes() {
		if (!indexPromise) indexPromise = model().createIndexes().catch((err) => {
			indexPromise = null;
			throw err;
		});
		return indexPromise;
	}
	async function recordAuditEntry(input, options) {
		const AuditLog = model();
		const tenantId = normalizeTenantId(input.tenantId);
		const chainKey = auditChainKey(input.tenantId);
		const category = input.category ?? AUDIT_ACTION_CATEGORY[input.action];
		const outcome = input.outcome ?? "success";
		const severity = input.severity ?? (outcome === "failure" || outcome === "denied" ? "warning" : "info");
		const actor = {
			type: input.actor.type,
			name: input.actor.name,
			...input.actor.id != null ? { id: idToString(input.actor.id) } : {}
		};
		const target = {
			type: input.target.type,
			...input.target.id != null ? { id: idToString(input.target.id) } : {},
			...input.target.name != null ? { name: input.target.name } : {}
		};
		const metadata = normalizeMetadata(input.metadata);
		const context = normalizeContext(input.context);
		for (let attempt = 0; attempt < MAX_APPEND_RETRIES; attempt++) try {
			/** Guarantee the unique seq index exists before serializing on it. */
			await ensureIndexes();
			const last = await AuditLog.findOne({ chainKey }).sort({ seq: -1 }).select("seq hash").lean();
			const prevSeq = last?.seq ?? 0;
			const prevHash = last?.hash ?? GENESIS_HASH;
			const seq = prevSeq + 1;
			const createdAt = /* @__PURE__ */ new Date();
			const hash = computeEntryHash({
				schemaVersion: 1,
				category,
				action: input.action,
				outcome,
				severity,
				actor,
				target,
				metadata,
				context,
				tenantId,
				chainKey,
				seq,
				prevHash,
				createdAt
			});
			return await AuditLog.create({
				schemaVersion: 1,
				category,
				action: input.action,
				outcome,
				severity,
				actor,
				target,
				...metadata !== void 0 && { metadata },
				...context !== void 0 && { context },
				...tenantId !== void 0 && { tenantId },
				chainKey,
				seq,
				prevHash,
				hash,
				createdAt
			});
		} catch (err) {
			if (isDuplicateKeyError(err) && attempt < MAX_APPEND_RETRIES - 1) {
				/** Jittered backoff de-correlates racing writers before they recompute
				* the tail `seq`, so the next attempt is very unlikely to collide. */
				await sleep(Math.floor(Math.random() * APPEND_BACKOFF_MS * (attempt + 1)));
				continue;
			}
			/**
			* Fail-open by default: a failed write must never block the privileged
			* operation, so it returns null and leaves a structured forensic trail.
			* Callers that require a durable record pass `failClosed` to surface the
			* failure instead.
			*/
			logger.error("[auditLog] failed to record audit entry", {
				action: input.action,
				category,
				outcome,
				chainKey,
				tenantId,
				actorId: actor.id ?? null,
				actorType: actor.type,
				targetType: target.type,
				targetId: target.id ?? null,
				err
			});
			if (options?.failClosed) throw err instanceof Error ? err : /* @__PURE__ */ new Error("Failed to record audit entry");
			return null;
		}
		return null;
	}
	async function listAuditLogPage(tenantId, filters) {
		const AuditLog = model();
		const chainKey = auditChainKey(tenantId);
		const limit = clampLimit(filters.limit);
		const base = buildFilter(chainKey, filters);
		const cursorSeq = typeof filters.cursor === "number" && Number.isFinite(filters.cursor) ? filters.cursor : void 0;
		const paged = cursorSeq !== void 0 ? {
			...base,
			seq: { $lt: cursorSeq }
		} : base;
		const offset = cursorSeq === void 0 && filters.offset && filters.offset > 0 ? Math.floor(filters.offset) : 0;
		let pageQuery = AuditLog.find(paged).sort({ seq: -1 }).limit(limit + 1);
		if (offset > 0) pageQuery = pageQuery.skip(offset);
		const [rowsPlusOne, total] = await Promise.all([pageQuery.lean(), AuditLog.countDocuments(base)]);
		const hasMore = rowsPlusOne.length > limit;
		const rows = hasMore ? rowsPlusOne.slice(0, limit) : rowsPlusOne;
		const nextCursor = hasMore && rows.length > 0 ? rows[rows.length - 1].seq : null;
		return {
			entries: rows.map(toWire),
			total,
			nextCursor
		};
	}
	async function findAuditLogEntry(tenantId, id) {
		if (!OBJECT_ID_RE.test(id)) return null;
		const AuditLog = model();
		const query = {
			_id: id,
			chainKey: auditChainKey(tenantId)
		};
		const doc = await AuditLog.findOne(query).lean();
		return doc ? toWire(doc) : null;
	}
	async function streamAuditLogEntries(tenantId, filters, onEntry, options) {
		const AuditLog = model();
		const query = buildFilter(auditChainKey(tenantId), filters);
		const cursor = AuditLog.find(query).sort({ seq: -1 }).lean().cursor({ batchSize: 500 });
		const isCancelled = options?.isCancelled;
		const maxRows = options?.maxRows;
		let count = 0;
		let truncated = false;
		try {
			for await (const doc of cursor) {
				if (isCancelled?.()) {
					await cursor.close();
					break;
				}
				if (maxRows != null && count >= maxRows) {
					/** The cap fired only because at least one more row exists beyond it,
					* so this is a genuine truncation — an exact-cap match exhausts the
					* cursor naturally and never reaches here. */
					truncated = true;
					await cursor.close();
					break;
				}
				await onEntry(toWire(doc));
				count++;
			}
		} finally {
			await cursor.close().catch(() => void 0);
		}
		return {
			count,
			truncated
		};
	}
	async function verifyAuditChain(tenantId, options) {
		const AuditLog = model();
		const chainKey = auditChainKey(tenantId);
		const cursor = AuditLog.find({ chainKey }).sort({ seq: 1 }).lean().cursor({ batchSize: 500 });
		const trustedCheckpoint = options?.trustedCheckpoint;
		const isCancelled = options?.isCancelled;
		const maxRows = options?.maxRows;
		let prevHash = GENESIS_HASH;
		let expectedSeq = null;
		let firstSeq = null;
		let lastSeq = 0;
		let checked = 0;
		try {
			for await (const doc of cursor) {
				if (isCancelled?.()) {
					await cursor.close();
					return {
						ok: false,
						chainKey,
						checked,
						reason: "verification cancelled",
						range: firstSeq !== null ? {
							firstSeq,
							lastSeq
						} : void 0
					};
				}
				if (maxRows != null && checked >= maxRows) {
					await cursor.close();
					return {
						ok: false,
						chainKey,
						checked,
						brokenAt: doc.seq,
						reason: `verification row limit exceeded (${maxRows})`,
						range: firstSeq !== null ? {
							firstSeq,
							lastSeq
						} : {
							firstSeq: doc.seq,
							lastSeq: doc.seq
						}
					};
				}
				if (firstSeq === null) {
					firstSeq = doc.seq;
					expectedSeq = doc.seq;
					/**
					* A non-genesis start (firstSeq > 1) means a prefix is gone. Only a
					* matching trusted checkpoint proves it was an authorized retention
					* purge; otherwise this is an attacker deleting the oldest rows, so we
					* must NOT silently trust the first row's prevHash.
					*/
					if (doc.seq === 1) prevHash = GENESIS_HASH;
					else if (trustedCheckpoint && trustedCheckpoint.throughSeq === doc.seq - 1 && trustedCheckpoint.prevHash === doc.prevHash) prevHash = doc.prevHash;
					else {
						await cursor.close();
						return {
							ok: false,
							chainKey,
							checked,
							brokenAt: doc.seq,
							reason: trustedCheckpoint ? "checkpoint mismatch: purged prefix does not match the trusted checkpoint" : `non-genesis start at seq ${doc.seq}: prefix purged or deleted (supply a trusted checkpoint to verify)`,
							range: {
								firstSeq,
								lastSeq: doc.seq
							}
						};
					}
				}
				if (doc.seq !== expectedSeq) return {
					ok: false,
					chainKey,
					checked,
					brokenAt: expectedSeq ?? doc.seq,
					reason: `sequence gap: expected ${expectedSeq}, found ${doc.seq}`,
					range: {
						firstSeq,
						lastSeq
					}
				};
				if (doc.prevHash !== prevHash) return {
					ok: false,
					chainKey,
					checked,
					brokenAt: doc.seq,
					reason: "broken hash link",
					range: {
						firstSeq,
						lastSeq
					}
				};
				if (computeEntryHash(doc) !== doc.hash) return {
					ok: false,
					chainKey,
					checked,
					brokenAt: doc.seq,
					reason: "hash mismatch",
					range: {
						firstSeq,
						lastSeq
					}
				};
				prevHash = doc.hash;
				lastSeq = doc.seq;
				expectedSeq = doc.seq + 1;
				checked++;
			}
		} finally {
			await cursor.close().catch(() => void 0);
		}
		return {
			ok: true,
			chainKey,
			checked,
			range: firstSeq !== null ? {
				firstSeq,
				lastSeq
			} : void 0
		};
	}
	async function purgeAuditLogEntries(tenantId, options) {
		if (!options.confirm) return { deletedCount: 0 };
		if (!(options.before instanceof Date) || Number.isNaN(options.before.getTime())) throw new Error("purgeAuditLogEntries: `before` must be a valid Date");
		const AuditLog = model();
		const chainKey = auditChainKey(tenantId);
		/**
		* Translate the date intent into a contiguous `seq` boundary before deleting.
		* `createdAt` is app-generated, so under multi-instance clock skew a later
		* `seq` can carry an earlier timestamp; a raw date delete could then remove
		* an interior row and permanently break verification. Instead, find the
		* earliest entry that must be retained (the first by `seq` whose `createdAt`
		* is on/after `before`) and delete only the strictly-lower `seq` prefix. This
		* never deletes past a retained entry, so the remaining chain stays
		* contiguous even with skew (it may retain a few old rows, which is safe).
		*/
		const firstRetained = await AuditLog.findOne({
			chainKey,
			createdAt: { $gte: options.before }
		}).sort({ seq: 1 }).select("seq").lean();
		const deleteFilter = firstRetained ? {
			chainKey,
			seq: { $lt: firstRetained.seq }
		} : { chainKey };
		const deletedCount = (await AuditLog.collection.deleteMany(deleteFilter)).deletedCount ?? 0;
		logger.warn("[auditLog] retention purge executed", {
			chainKey,
			before: options.before.toISOString(),
			deletedCount
		});
		/**
		* Only a purge that actually removed rows may mint a trust boundary. A no-op
		* purge returning a checkpoint for the current first entry would let a caller
		* legitimize a prefix this purge never authorized (e.g. one an attacker
		* deleted), so `verifyAuditChain` could be tricked into accepting it.
		*/
		if (deletedCount === 0) return { deletedCount: 0 };
		const newFirst = await AuditLog.findOne({ chainKey }).sort({ seq: 1 }).select("seq prevHash").lean();
		return {
			deletedCount,
			/** Boundary for `verifyAuditChain`: the new earliest entry resumes the
			* chain at `seq`, so the purged prefix ran through `seq - 1` and its last
			* hash is this entry's `prevHash`. Callers persist this to later prove the
			* purge was authorized. */
			checkpoint: newFirst ? {
				throughSeq: newFirst.seq - 1,
				prevHash: newFirst.prevHash
			} : void 0
		};
	}
	return {
		recordAuditEntry,
		listAuditLogPage,
		findAuditLogEntry,
		streamAuditLogEntries,
		verifyAuditChain,
		purgeAuditLogEntries
	};
}
//#endregion
//#region src/methods/share.ts
var ShareServiceError = class extends Error {
	constructor(message, code) {
		super(message);
		this.name = "ShareServiceError";
		this.code = code;
	}
};
function memoizedAnonymizeId(prefix) {
	const memo = /* @__PURE__ */ new Map();
	return (id) => {
		if (!memo.has(id)) memo.set(id, `${prefix}_${nanoid()}`);
		return memo.get(id);
	};
}
const anonymizeConvoId = memoizedAnonymizeId("convo");
const anonymizeAssistantId = memoizedAnonymizeId("a");
const anonymizeMessageId = (id) => id === Constants.NO_PARENT ? id : memoizedAnonymizeId("msg")(id);
function anonymizeConvo(conversation) {
	if (!conversation) return null;
	const newConvo = { ...conversation };
	if (newConvo.assistant_id) newConvo.assistant_id = anonymizeAssistantId(newConvo.assistant_id);
	return newConvo;
}
/**
* Storage- and identity-internal fields that must never be exposed through a
* public shared link. Everything else on a file/attachment — including the
* `filepath`/`preview` render URLs, dimensions, and tool-call payloads such as
* `toolCallId` and search results — is render data the shared view needs, so it
* is preserved. (`storageKey` is the raw object key and is dropped; `filepath`
* is the URL the share renderer actually loads, so it is kept.)
*/
const SENSITIVE_SHARED_FILE_FIELDS = new Set([
	"_id",
	"__v",
	"user",
	"tenantId",
	"storageRegion",
	"storageKey",
	"temp_file_id",
	"message",
	"source",
	"filterSource",
	"context",
	"embedded",
	"usage",
	"metadata"
]);
/**
* Strip storage/identity-internal fields from a file or attachment while keeping
* render-relevant data (including tool-call payloads keyed by tool name).
*/
function sanitizeSharedFile(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const result = {};
	for (const [key, fieldValue] of Object.entries(value)) if (!SENSITIVE_SHARED_FILE_FIELDS.has(key)) result[key] = fieldValue;
	return Object.keys(result).length > 0 ? result : null;
}
function sanitizeSharedFiles(files) {
	if (!Array.isArray(files)) return;
	const sanitized = files.map(sanitizeSharedFile).filter((file) => file != null);
	return sanitized.length > 0 ? sanitized : void 0;
}
/**
* Sources backed by a durable stored object that the share-scoped routes can
* stream with only `storageKey`/`filepath` + the request. Sources requiring
* owner-specific credentials (openai/azure assistants, execute_code, vectordb,
* OCR/parser pipelines) are skipped — those files degrade to a 404 in the share
* view. `FileSources.text` is intentionally excluded: its `filepath` is a Multer
* temp path that the upload route deletes, so there is nothing durable to stream.
*/
const SNAPSHOT_STREAMABLE_SOURCES = new Set([
	FileSources.local,
	FileSources.s3,
	FileSources.cloudfront,
	FileSources.azure_blob,
	FileSources.firebase
]);
/** Collect `file_id`s from a message's `files`/`attachments` array into `target`. */
function collectFileIds(items, target) {
	if (!Array.isArray(items)) return;
	for (const item of items) if (item && typeof item === "object") {
		const fileId = item.file_id;
		if (typeof fileId === "string" && fileId) target.add(fileId);
	}
}
/**
* Build the per-share file snapshot from the messages being shared. Captures only
* the metadata the share-scoped routes need to stream each file; references the
* original stored object (no byte copy). The lookup is scoped to the sharing
* user's own files so a message referencing another user's `file_id` can never
* widen access to it. Preview text/status is intentionally NOT embedded — it is
* read live from the file record so snapshots stay small and never go stale.
*/
async function buildFileSnapshots(mongoose, messages, ownerId) {
	if (!ownerId) return [];
	const fileIds = /* @__PURE__ */ new Set();
	for (const message of messages) {
		collectFileIds(message.files, fileIds);
		collectFileIds(message.attachments, fileIds);
	}
	if (fileIds.size === 0) return [];
	const files = await mongoose.models.File.find({
		file_id: { $in: Array.from(fileIds) },
		user: ownerId
	}).lean();
	const snapshots = [];
	for (const file of files) {
		const source = file.source ?? FileSources.local;
		if (!SNAPSHOT_STREAMABLE_SOURCES.has(source)) continue;
		snapshots.push({
			file_id: file.file_id,
			source,
			storageKey: file.storageKey,
			filepath: file.filepath,
			type: file.type,
			filename: file.filename,
			bytes: file.bytes,
			width: file.width,
			height: file.height,
			model: file.model,
			previewRevision: file.previewRevision,
			tenantId: file.tenantId
		});
	}
	return snapshots;
}
/** Share-scoped file route that serves a snapshotted file independent of owner ACL. */
function shareFileRoute(shareId, fileId) {
	return `/api/share/${shareId}/files/${encodeURIComponent(fileId)}`;
}
/**
* Point a snapshotted file's render URLs at the share-scoped route so viewers load
* it through the authorized share path (and the owner's storage path is not leaked).
*/
function applyShareFileRoute(file, shareId, snapshotIds) {
	const fileId = file.file_id;
	if (typeof fileId === "string" && snapshotIds.has(fileId)) {
		const route = shareFileRoute(shareId, fileId);
		const next = {
			...file,
			filepath: route
		};
		if (file.preview !== void 0) next.preview = route;
		return next;
	}
	const next = { ...file };
	delete next.filepath;
	delete next.preview;
	return next;
}
/**
* Only surface a model name when it is an (already-anonymized) assistant id;
* otherwise omit it so the underlying provider/model is not disclosed.
*/
function anonymizeSharedModel(model) {
	if (!model?.startsWith("asst_")) return;
	return anonymizeAssistantId(model);
}
/**
* Build the public, anonymized view of shared messages. An allowlist of
* render-relevant fields keeps internal message fields (endpoint,
* conversationSignature, clientId, plugin(s), metadata, etc.) out of the
* payload, while user files and tool-call attachments are sanitized field by
* field so render data (uploaded files, `toolCallId`, search results, generated
* outputs) is preserved without leaking storage internals.
*/
function anonymizeMessages(messages, newConvoId, shareId, snapshotIds, includeFiles) {
	if (!Array.isArray(messages)) return [];
	const idMap = /* @__PURE__ */ new Map();
	return messages.map((message) => {
		const newMessageId = anonymizeMessageId(message.messageId);
		idMap.set(message.messageId, newMessageId);
		const attachments = includeFiles ? sanitizeSharedFiles(message.attachments)?.map((attachment) => applyShareFileRoute({
			...attachment,
			messageId: newMessageId,
			conversationId: newConvoId
		}, shareId, snapshotIds)) : void 0;
		const files = includeFiles ? sanitizeSharedFiles(message.files)?.map((file) => applyShareFileRoute({
			...file,
			...file.conversationId !== void 0 && { conversationId: newConvoId },
			...file.messageId !== void 0 && { messageId: newMessageId }
		}, shareId, snapshotIds)) : void 0;
		const model = anonymizeSharedModel(message.model);
		return {
			messageId: newMessageId,
			parentMessageId: idMap.get(message.parentMessageId || "") || anonymizeMessageId(message.parentMessageId || ""),
			conversationId: newConvoId,
			sender: message.sender,
			text: message.text,
			content: message.content,
			...message.iconURL && { iconURL: message.iconURL },
			...model && { model },
			isCreatedByUser: message.isCreatedByUser,
			createdAt: message.createdAt,
			updatedAt: message.updatedAt,
			tokenCount: message.tokenCount,
			unfinished: message.unfinished,
			error: message.error,
			finish_reason: message.finish_reason,
			...message.manualSkills && { manualSkills: message.manualSkills },
			...message.alwaysAppliedSkills && { alwaysAppliedSkills: message.alwaysAppliedSkills },
			...message.quotes && { quotes: message.quotes },
			...files && { files },
			...attachments && { attachments }
		};
	});
}
/**
* Filter messages up to and including the target message (branch-specific)
* Similar to getMessagesUpToTargetLevel from fork utilities
*/
function getMessagesUpToTarget(messages, targetMessageId) {
	if (!messages || messages.length === 0) return [];
	if (messages.length === 1 && messages[0]?.messageId === targetMessageId) return messages;
	const parentToChildrenMap = /* @__PURE__ */ new Map();
	for (const message of messages) {
		const parentId = message.parentMessageId || Constants.NO_PARENT;
		if (!parentToChildrenMap.has(parentId)) parentToChildrenMap.set(parentId, []);
		parentToChildrenMap.get(parentId)?.push(message);
	}
	const targetMessage = messages.find((msg) => msg.messageId === targetMessageId);
	if (!targetMessage) return messages;
	const visited = /* @__PURE__ */ new Set();
	const rootMessages = parentToChildrenMap.get(Constants.NO_PARENT) || [];
	let currentLevel = rootMessages.length > 0 ? [...rootMessages] : [targetMessage];
	const results = new Set(currentLevel);
	if (currentLevel.some((msg) => msg.messageId === targetMessageId) && targetMessage.parentMessageId === Constants.NO_PARENT) return Array.from(results);
	let targetFound = false;
	while (!targetFound && currentLevel.length > 0) {
		const nextLevel = [];
		for (const node of currentLevel) {
			if (visited.has(node.messageId)) continue;
			visited.add(node.messageId);
			const children = parentToChildrenMap.get(node.messageId) || [];
			for (const child of children) {
				if (visited.has(child.messageId)) continue;
				nextLevel.push(child);
				results.add(child);
				if (child.messageId === targetMessageId) targetFound = true;
			}
		}
		currentLevel = nextLevel;
	}
	return Array.from(results);
}
/** Factory function that takes mongoose instance and returns the methods */
function createShareMethods(mongoose) {
	/**
	* Get shared messages for a share link
	*/
	async function getSharedMessages(shareId, shareObjectId, options) {
		try {
			const SharedLink = mongoose.models.SharedLink;
			const share = await (shareObjectId ? SharedLink.findOne({
				_id: shareObjectId,
				...activeExpirationFilter()
			}) : SharedLink.findOne({
				shareId,
				...activeExpirationFilter()
			})).populate({
				path: "messages",
				select: "-_id -__v -user"
			}).select("-__v").lean();
			if (!share?.conversationId) return null;
			/** Filtered messages based on targetMessageId if present (branch-specific sharing) */
			let messagesToShare = share.messages;
			if (share.targetMessageId) messagesToShare = getMessagesUpToTarget(share.messages, share.targetMessageId);
			const newConvoId = anonymizeConvoId(share.conversationId);
			const resolvedShareId = share.shareId || shareId;
			/**
			* Files are included only when the admin feature is enabled (options) AND the
			* link's own choice wasn't opted out (`snapshotFiles === false`). When
			* excluded, files/attachments are stripped from the payload so nothing leaks
			* through the owner's original paths. Legacy links (no per-link choice and no
			* snapshot yet) are backfilled here so their first view rewrites correctly.
			*/
			const adminEnabled = options?.snapshotFiles !== false;
			const perLinkEnabled = share.snapshotFiles !== false;
			const includeFiles = adminEnabled && perLinkEnabled;
			let fileSnapshots = share.fileSnapshots;
			if (includeFiles && fileSnapshots === void 0 && share._id) {
				fileSnapshots = await buildFileSnapshots(mongoose, messagesToShare, share.user);
				await SharedLink.updateOne({ _id: share._id }, { $set: { fileSnapshots } });
			}
			const snapshotIds = includeFiles ? new Set((fileSnapshots ?? []).map((snapshot) => snapshot.file_id)) : /* @__PURE__ */ new Set();
			return {
				shareId: resolvedShareId,
				title: share.title,
				createdAt: share.createdAt,
				updatedAt: share.updatedAt,
				conversationId: newConvoId,
				messages: anonymizeMessages(messagesToShare, newConvoId, resolvedShareId, snapshotIds, includeFiles)
			};
		} catch (error) {
			logger.error("[getSharedMessages] Error getting share link", {
				error: error instanceof Error ? error.message : "Unknown error",
				shareId
			});
			throw new ShareServiceError("Error getting share link", "SHARE_FETCH_ERROR");
		}
	}
	/**
	* Get shared links for a specific user with pagination and search
	*/
	async function getSharedLinks(user, pageParam, pageSize = 10, sortBy = "createdAt", sortDirection = "desc", search) {
		try {
			const SharedLink = mongoose.models.SharedLink;
			const Conversation = mongoose.models.Conversation;
			const query = {
				user,
				...activeExpirationFilter()
			};
			if (pageParam) if (sortDirection === "desc") query[sortBy] = { $lt: pageParam };
			else query[sortBy] = { $gt: pageParam };
			if (search && search.trim()) try {
				const searchResults = await Conversation.meiliSearch(search, { filter: `user = "${user}"` });
				if (!searchResults?.hits?.length) return {
					links: [],
					nextCursor: void 0,
					hasNextPage: false
				};
				query["conversationId"] = { $in: searchResults.hits.map((hit) => hit.conversationId) };
			} catch (searchError) {
				logger.error("[getSharedLinks] Meilisearch error", {
					error: searchError instanceof Error ? searchError.message : "Unknown error",
					user
				});
				return {
					links: [],
					nextCursor: void 0,
					hasNextPage: false
				};
			}
			const sort = {};
			sort[sortBy] = sortDirection === "desc" ? -1 : 1;
			const sharedLinks = await SharedLink.find(query).sort(sort).limit(pageSize + 1).select("-__v -user").lean();
			const hasNextPage = sharedLinks.length > pageSize;
			const links = sharedLinks.slice(0, pageSize);
			const nextCursor = hasNextPage ? links[links.length - 1][sortBy] : void 0;
			return {
				links: links.map((link) => ({
					shareId: link.shareId || "",
					title: link?.title || "Untitled",
					createdAt: link.createdAt || /* @__PURE__ */ new Date(),
					conversationId: link.conversationId
				})),
				nextCursor,
				hasNextPage
			};
		} catch (error) {
			logger.error("[getSharedLinks] Error getting shares", {
				error: error instanceof Error ? error.message : "Unknown error",
				user
			});
			throw new ShareServiceError("Error getting shares", "SHARES_FETCH_ERROR");
		}
	}
	/**
	* Delete all shared links for a user
	*/
	async function deleteAllSharedLinks(user) {
		try {
			const SharedLink = mongoose.models.SharedLink;
			const ids = (await SharedLink.find({ user }).select("_id").lean()).map((l) => l._id.toString());
			return {
				message: "All shared links deleted successfully",
				deletedCount: (await SharedLink.deleteMany({ user })).deletedCount,
				deletedIds: ids
			};
		} catch (error) {
			logger.error("[deleteAllSharedLinks] Error deleting shared links", {
				error: error instanceof Error ? error.message : "Unknown error",
				user
			});
			throw new ShareServiceError("Error deleting shared links", "BULK_DELETE_ERROR");
		}
	}
	/**
	* Delete shared links by conversation ID
	*/
	async function deleteConvoSharedLink(user, conversationId) {
		if (!user || !conversationId) throw new ShareServiceError("Missing required parameters", "INVALID_PARAMS");
		try {
			const SharedLink = mongoose.models.SharedLink;
			const ids = (await SharedLink.find({
				user,
				conversationId
			}).select("_id").lean()).map((l) => l._id.toString());
			return {
				message: "Shared links deleted successfully",
				deletedCount: (await SharedLink.deleteMany({
					user,
					conversationId
				})).deletedCount,
				deletedIds: ids
			};
		} catch (error) {
			logger.error("[deleteConvoSharedLink] Error deleting shared links", {
				error: error instanceof Error ? error.message : "Unknown error",
				user,
				conversationId
			});
			throw new ShareServiceError("Error deleting shared links", "SHARE_DELETE_ERROR");
		}
	}
	/**
	* Create a new shared link for a conversation
	*/
	async function createSharedLink(user, conversationId, targetMessageId, expiredAt, snapshotFiles = true) {
		if (!user || !conversationId) throw new ShareServiceError("Missing required parameters", "INVALID_PARAMS");
		try {
			const Message = mongoose.models.Message;
			const SharedLink = mongoose.models.SharedLink;
			const Conversation = mongoose.models.Conversation;
			const [existingShare, conversationMessages] = await Promise.all([SharedLink.findOne({
				conversationId,
				user,
				...activeExpirationFilter(),
				...targetMessageId && { targetMessageId }
			}).select("-_id -__v -user").lean(), Message.find({
				conversationId,
				user
			}).sort({ createdAt: 1 }).lean()]);
			if (existingShare) {
				logger.error("[createSharedLink] Share already exists", {
					user,
					conversationId,
					targetMessageId
				});
				throw new ShareServiceError("Share already exists", "SHARE_EXISTS");
			}
			const conversation = await Conversation.findOne({
				conversationId,
				user
			}).lean();
			if (!conversation) throw new ShareServiceError("Conversation not found or access denied", "CONVERSATION_NOT_FOUND");
			if (!conversationMessages || conversationMessages.length === 0) throw new ShareServiceError("No messages to share", "NO_MESSAGES");
			const title = conversation.title || "Untitled";
			const messagesForSnapshot = conversationMessages;
			const fileSnapshots = snapshotFiles ? await buildFileSnapshots(mongoose, targetMessageId ? getMessagesUpToTarget(messagesForSnapshot, targetMessageId) : messagesForSnapshot, user) : [];
			const shareId = nanoid();
			return {
				_id: (await SharedLink.create({
					shareId,
					conversationId,
					messages: conversationMessages,
					title,
					user,
					snapshotFiles,
					...targetMessageId && { targetMessageId },
					...expiredAt && { expiredAt },
					...snapshotFiles && { fileSnapshots }
				}))._id.toString(),
				shareId,
				conversationId,
				targetMessageId
			};
		} catch (error) {
			if (error instanceof ShareServiceError) throw error;
			logger.error("[createSharedLink] Error creating shared link", {
				error: error instanceof Error ? error.message : "Unknown error",
				user,
				conversationId,
				targetMessageId
			});
			throw new ShareServiceError("Error creating shared link", "SHARE_CREATE_ERROR");
		}
	}
	/**
	* Get a shared link for a conversation
	*/
	async function getSharedLink(user, conversationId) {
		if (!user || !conversationId) throw new ShareServiceError("Missing required parameters", "INVALID_PARAMS");
		try {
			const share = await mongoose.models.SharedLink.findOne({
				conversationId,
				user,
				...activeExpirationFilter()
			}).select("shareId targetMessageId snapshotFiles _id").sort({ updatedAt: -1 }).lean();
			if (!share) return {
				shareId: null,
				success: false
			};
			return {
				_id: share._id?.toString(),
				shareId: share.shareId || null,
				targetMessageId: share.targetMessageId,
				snapshotFiles: share.snapshotFiles,
				success: true
			};
		} catch (error) {
			logger.error("[getSharedLink] Error getting shared link", {
				error: error instanceof Error ? error.message : "Unknown error",
				user,
				conversationId
			});
			throw new ShareServiceError("Error getting shared link", "SHARE_FETCH_ERROR");
		}
	}
	/**
	* Update a shared link with new messages
	*/
	async function updateSharedLink(user, shareId, targetMessageId, expiredAt, snapshotFiles = true) {
		if (!user || !shareId) throw new ShareServiceError("Missing required parameters", "INVALID_PARAMS");
		try {
			const SharedLink = mongoose.models.SharedLink;
			const Message = mongoose.models.Message;
			const share = await SharedLink.findOne({
				shareId,
				user
			}).select("-_id -__v -user").lean();
			if (!share) throw new ShareServiceError("Share not found", "SHARE_NOT_FOUND");
			const updatedMessages = await Message.find({
				conversationId: share.conversationId,
				user
			}).sort({ createdAt: 1 }).lean();
			const newShareId = nanoid();
			const hasNewExpiration = expiredAt instanceof Date;
			const resolvedTargetMessageId = targetMessageId ?? share.targetMessageId;
			const messagesForSnapshot = updatedMessages;
			const fileSnapshots = snapshotFiles ? await buildFileSnapshots(mongoose, resolvedTargetMessageId ? getMessagesUpToTarget(messagesForSnapshot, resolvedTargetMessageId) : messagesForSnapshot, user) : [];
			const unset = {
				...expiredAt === null ? { expiredAt: 1 } : {},
				...snapshotFiles ? {} : { fileSnapshots: 1 }
			};
			const update = {
				$set: {
					messages: updatedMessages,
					user,
					shareId: newShareId,
					snapshotFiles,
					...resolvedTargetMessageId && { targetMessageId: resolvedTargetMessageId },
					...hasNewExpiration && { expiredAt },
					...snapshotFiles && { fileSnapshots }
				},
				...Object.keys(unset).length > 0 ? { $unset: unset } : {}
			};
			const updatedShare = await SharedLink.findOneAndUpdate({
				shareId,
				user
			}, update, {
				new: true,
				upsert: false,
				runValidators: true
			}).lean();
			if (!updatedShare) throw new ShareServiceError("Share update failed", "SHARE_UPDATE_ERROR");
			anonymizeConvo(updatedShare);
			return {
				_id: updatedShare._id?.toString(),
				shareId: newShareId,
				conversationId: updatedShare.conversationId,
				targetMessageId: updatedShare.targetMessageId
			};
		} catch (error) {
			logger.error("[updateSharedLink] Error updating shared link", {
				error: error instanceof Error ? error.message : "Unknown error",
				user,
				shareId
			});
			throw new ShareServiceError(error instanceof ShareServiceError ? error.message : "Error updating shared link", error instanceof ShareServiceError ? error.code : "SHARE_UPDATE_ERROR");
		}
	}
	/**
	* Delete a shared link
	*/
	async function deleteSharedLink(user, shareId) {
		if (!user || !shareId) throw new ShareServiceError("Missing required parameters", "INVALID_PARAMS");
		try {
			const result = await mongoose.models.SharedLink.findOneAndDelete({
				shareId,
				user
			}).lean();
			if (!result) return null;
			return {
				_id: result._id?.toString(),
				success: true,
				shareId,
				message: "Share deleted successfully"
			};
		} catch (error) {
			logger.error("[deleteSharedLink] Error deleting shared link", {
				error: error instanceof Error ? error.message : "Unknown error",
				user,
				shareId
			});
			throw new ShareServiceError("Error deleting shared link", "SHARE_DELETE_ERROR");
		}
	}
	/**
	* Resolve a single file snapshot entry for a shared link, used by the
	* share-scoped file routes to authorize a file without the owner's ACL.
	* `hasSnapshots` distinguishes a legacy share (field absent → caller may
	* backfill) from an ordinary miss (field present but file not in it → 404,
	* no rebuild). `optedOut` is the per-link "share files" choice — when true the
	* route must 404 and never backfill, so an opted-out link can't expose files.
	*/
	async function getSharedLinkFile(shareId, fileId) {
		const share = await mongoose.models.SharedLink.findOne({
			shareId,
			...activeExpirationFilter()
		}).select("fileSnapshots snapshotFiles").lean();
		if (!share) return {
			file: null,
			hasSnapshots: false,
			optedOut: false
		};
		const hasSnapshots = share.fileSnapshots !== void 0;
		const optedOut = share.snapshotFiles === false;
		return {
			file: share.fileSnapshots?.find((snapshot) => snapshot.file_id === fileId) ?? null,
			hasSnapshots,
			optedOut
		};
	}
	/**
	* Lazily build and persist the file snapshot for a legacy shared link that
	* predates the feature. Mirrors the lazy migration done for legacy ACL grants.
	* Returns the requested entry (or the full snapshot when no fileId is given).
	*/
	async function backfillSharedLinkFiles(shareId, fileId) {
		try {
			const SharedLink = mongoose.models.SharedLink;
			const share = await SharedLink.findOne({
				shareId,
				...activeExpirationFilter()
			}).populate({
				path: "messages",
				select: "-_id -__v -user"
			}).lean();
			if (!share) return null;
			let messages = share.messages ?? [];
			if (share.targetMessageId) messages = getMessagesUpToTarget(messages, share.targetMessageId);
			const fileSnapshots = await buildFileSnapshots(mongoose, messages, share.user);
			await SharedLink.updateOne({ shareId }, { $set: { fileSnapshots } });
			if (fileId) return fileSnapshots.find((snapshot) => snapshot.file_id === fileId) ?? null;
			return fileSnapshots;
		} catch (error) {
			logger.error("[backfillSharedLinkFiles] Error backfilling file snapshots", {
				error: error instanceof Error ? error.message : "Unknown error",
				shareId
			});
			return null;
		}
	}
	return {
		getSharedLink,
		getSharedLinks,
		createSharedLink,
		updateSharedLink,
		deleteSharedLink,
		getSharedMessages,
		getSharedLinkFile,
		backfillSharedLinkFiles,
		deleteAllSharedLinks,
		deleteConvoSharedLink
	};
}
//#endregion
//#region src/methods/action.ts
const sensitiveFields = [
	"api_key",
	"oauth_client_id",
	"oauth_client_secret"
];
function createActionMethods(mongoose) {
	/**
	* Update an action with new data without overwriting existing properties,
	* or create a new action if it doesn't exist.
	*/
	async function updateAction(searchParams, updateData) {
		return await mongoose.models.Action.findOneAndUpdate(searchParams, updateData, {
			new: true,
			upsert: true
		}).lean();
	}
	/**
	* Retrieves all actions that match the given search parameters.
	*/
	async function getActions(searchParams, includeSensitive = false) {
		const actions = await mongoose.models.Action.find(searchParams).lean();
		if (!includeSensitive) for (let i = 0; i < actions.length; i++) {
			const metadata = actions[i].metadata;
			if (!metadata) continue;
			for (const field of sensitiveFields) if (metadata[field]) delete metadata[field];
		}
		return actions;
	}
	/**
	* Deletes an action by params.
	*/
	async function deleteAction(searchParams) {
		return await mongoose.models.Action.findOneAndDelete(searchParams).lean();
	}
	/**
	* Deletes actions by params.
	*/
	async function deleteActions(searchParams) {
		return (await mongoose.models.Action.deleteMany(searchParams)).deletedCount;
	}
	return {
		getActions,
		updateAction,
		deleteAction,
		deleteActions
	};
}
//#endregion
//#region src/methods/assistant.ts
function createAssistantMethods(mongoose) {
	/**
	* Update an assistant with new data without overwriting existing properties,
	* or create a new assistant if it doesn't exist.
	*/
	async function updateAssistantDoc(searchParams, updateData) {
		return await mongoose.models.Assistant.findOneAndUpdate(searchParams, updateData, {
			new: true,
			upsert: true
		}).lean();
	}
	/**
	* Retrieves an assistant document based on the provided search params.
	*/
	async function getAssistant(searchParams) {
		return await mongoose.models.Assistant.findOne(searchParams).lean();
	}
	/**
	* Retrieves all assistants that match the given search parameters.
	*/
	async function getAssistants(searchParams, select = null) {
		const query = mongoose.models.Assistant.find(searchParams);
		return await (select ? query.select(select) : query).lean();
	}
	/**
	* Deletes an assistant based on the provided search params.
	*/
	async function deleteAssistant(searchParams) {
		return await mongoose.models.Assistant.findOneAndDelete(searchParams);
	}
	/**
	* Deletes all assistants matching the given search parameters.
	*/
	async function deleteAssistants(searchParams) {
		return (await mongoose.models.Assistant.deleteMany(searchParams)).deletedCount;
	}
	return {
		updateAssistantDoc,
		deleteAssistant,
		deleteAssistants,
		getAssistants,
		getAssistant
	};
}
//#endregion
//#region src/methods/banner.ts
function createBannerMethods(mongoose) {
	/**
	* Retrieves the current active banner.
	*/
	async function getBanner(user) {
		try {
			const Banner = mongoose.models.Banner;
			const now = /* @__PURE__ */ new Date();
			const banner = await Banner.findOne({
				displayFrom: { $lte: now },
				$or: [{ displayTo: { $gte: now } }, { displayTo: null }],
				type: "banner"
			}).lean();
			if (!banner || banner.isPublic || user != null) return banner;
			return null;
		} catch (error) {
			logger.error("[getBanners] Error getting banners", error);
			throw new Error("Error getting banners");
		}
	}
	return { getBanner };
}
//#endregion
//#region src/methods/toolCall.ts
function createToolCallMethods(mongoose) {
	/**
	* Create a new tool call
	*/
	async function createToolCall(toolCallData) {
		try {
			return await mongoose.models.ToolCall.create(toolCallData);
		} catch (error) {
			throw new Error(`Error creating tool call: ${error.message}`);
		}
	}
	/**
	* Get a tool call by ID
	*/
	async function getToolCallById(id) {
		try {
			return await mongoose.models.ToolCall.findById(id).lean();
		} catch (error) {
			throw new Error(`Error fetching tool call: ${error.message}`);
		}
	}
	/**
	* Get tool calls by message ID and user
	*/
	async function getToolCallsByMessage(messageId, userId) {
		try {
			return await mongoose.models.ToolCall.find({
				messageId,
				user: userId
			}).lean();
		} catch (error) {
			throw new Error(`Error fetching tool calls: ${error.message}`);
		}
	}
	/**
	* Get tool calls by conversation ID and user
	*/
	async function getToolCallsByConvo(conversationId, userId) {
		try {
			return await mongoose.models.ToolCall.find({
				conversationId,
				user: userId
			}).lean();
		} catch (error) {
			throw new Error(`Error fetching tool calls: ${error.message}`);
		}
	}
	/**
	* Update a tool call
	*/
	async function updateToolCall(id, updateData) {
		try {
			return await mongoose.models.ToolCall.findByIdAndUpdate(id, updateData, { new: true }).lean();
		} catch (error) {
			throw new Error(`Error updating tool call: ${error.message}`);
		}
	}
	/**
	* Delete tool calls by user and optionally conversation
	*/
	async function deleteToolCalls(userId, conversationId) {
		try {
			const ToolCall = mongoose.models.ToolCall;
			const query = { user: userId };
			if (conversationId) query.conversationId = conversationId;
			return await ToolCall.deleteMany(query);
		} catch (error) {
			throw new Error(`Error deleting tool call: ${error.message}`);
		}
	}
	return {
		createToolCall,
		updateToolCall,
		deleteToolCalls,
		getToolCallById,
		getToolCallsByConvo,
		getToolCallsByMessage
	};
}
//#endregion
//#region src/methods/categories.ts
const options = [
	{
		label: "com_ui_idea",
		value: "idea"
	},
	{
		label: "com_ui_travel",
		value: "travel"
	},
	{
		label: "com_ui_teach_or_explain",
		value: "teach_or_explain"
	},
	{
		label: "com_ui_write",
		value: "write"
	},
	{
		label: "com_ui_shop",
		value: "shop"
	},
	{
		label: "com_ui_code",
		value: "code"
	},
	{
		label: "com_ui_misc",
		value: "misc"
	},
	{
		label: "com_ui_roleplay",
		value: "roleplay"
	},
	{
		label: "com_ui_finance",
		value: "finance"
	}
];
function createCategoriesMethods(_mongoose) {
	/**
	* Retrieves the categories.
	*/
	async function getCategories() {
		try {
			return [...options];
		} catch (error) {
			logger.error("Error getting categories", error);
			return [];
		}
	}
	return { getCategories };
}
//#endregion
//#region src/methods/preset.ts
function createPresetMethods(mongoose) {
	/**
	* Retrieves a single preset by user and presetId.
	*/
	async function getPreset(user, presetId) {
		try {
			return await mongoose.models.Preset.findOne({
				user,
				presetId
			}).lean();
		} catch (error) {
			logger.error("[getPreset] Error getting single preset", error);
			return { message: "Error getting single preset" };
		}
	}
	/**
	* Retrieves all presets for a user, sorted by order then updatedAt.
	*/
	async function getPresets(user, filter = {}) {
		try {
			const presets = await mongoose.models.Preset.find({
				...filter,
				user
			}).lean();
			const defaultValue = 1e4;
			presets.sort((a, b) => {
				const orderA = a.order !== void 0 ? a.order : defaultValue;
				const orderB = b.order !== void 0 ? b.order : defaultValue;
				if (orderA !== orderB) return orderA - orderB;
				return new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime();
			});
			return presets;
		} catch (error) {
			logger.error("[getPresets] Error getting presets", error);
			return { message: "Error retrieving presets" };
		}
	}
	/**
	* Saves a preset. Handles default preset logic and tool normalization.
	*/
	async function savePreset(user, { presetId, newPresetId, defaultPreset, ...preset }) {
		try {
			const Preset = mongoose.models.Preset;
			const setter = { $set: {} };
			const { user: _unusedUser, ...cleanPreset } = preset;
			const update = {
				presetId,
				...cleanPreset
			};
			if (preset.tools && Array.isArray(preset.tools)) update.tools = preset.tools.map((tool) => typeof tool === "object" && tool?.pluginKey ? tool.pluginKey : tool).filter((toolName) => typeof toolName === "string") ?? [];
			if (newPresetId) update.presetId = newPresetId;
			if (defaultPreset) {
				update.defaultPreset = defaultPreset;
				update.order = 0;
				const currentDefault = await Preset.findOne({
					defaultPreset: true,
					user
				});
				if (currentDefault && currentDefault.presetId !== presetId) await Preset.findByIdAndUpdate(currentDefault._id, { $unset: {
					defaultPreset: "",
					order: ""
				} });
			} else if (defaultPreset === false) {
				update.defaultPreset = void 0;
				update.order = void 0;
				setter["$unset"] = {
					defaultPreset: "",
					order: ""
				};
			}
			setter.$set = update;
			return await Preset.findOneAndUpdate({
				presetId,
				user
			}, setter, {
				new: true,
				upsert: true
			});
		} catch (error) {
			logger.error("[savePreset] Error saving preset", error);
			return { message: "Error saving preset" };
		}
	}
	/**
	* Deletes presets matching the given filter for a user.
	*/
	async function deletePresets(user, filter = {}) {
		return await mongoose.models.Preset.deleteMany({
			...filter,
			user
		});
	}
	return {
		getPreset,
		getPresets,
		savePreset,
		deletePresets
	};
}
//#endregion
//#region src/methods/conversationTag.ts
/**
* Atomically decrements tag counts for a user. Each entry in `tags` counts as a
* single decrement, so callers must dedupe tags per conversation before flattening
* to avoid double-decrementing a conversation's duplicate tag entries. Counts are
* clamped at zero to tolerate any pre-existing drift.
*/
async function decrementTagCounts(mongoose, user, tags) {
	if (!tags.length) return;
	const decrementByTag = /* @__PURE__ */ new Map();
	for (const tag of tags) {
		if (!tag) continue;
		decrementByTag.set(tag, (decrementByTag.get(tag) ?? 0) + 1);
	}
	if (decrementByTag.size === 0) return;
	try {
		const ConversationTag = mongoose.models.ConversationTag;
		await tenantSafeBulkWrite(ConversationTag, [...decrementByTag.entries()].map(([tag, amount]) => ({ updateOne: {
			filter: {
				user,
				tag
			},
			update: [{ $set: { count: { $max: [0, { $subtract: [{ $ifNull: ["$count", 0] }, amount] }] } } }]
		} })));
	} catch (error) {
		logger.error("[decrementTagCounts] Error decrementing tag counts", error);
	}
}
function createConversationTagMethods(mongoose) {
	/**
	* Retrieves all conversation tags for a user.
	*/
	async function getConversationTags(user) {
		try {
			return await mongoose.models.ConversationTag.find({ user }).sort({ position: 1 }).lean();
		} catch (error) {
			logger.error("[getConversationTags] Error getting conversation tags", error);
			throw new Error("Error getting conversation tags");
		}
	}
	/**
	* Creates a new conversation tag.
	*/
	async function createConversationTag(user, data) {
		try {
			const ConversationTag = mongoose.models.ConversationTag;
			const Conversation = mongoose.models.Conversation;
			const { tag, description, addToConversation, conversationId } = data;
			const existingTag = await ConversationTag.findOne({
				user,
				tag
			}).lean();
			if (existingTag) return existingTag;
			const position = ((await ConversationTag.findOne({ user }).sort("-position").lean())?.position || 0) + 1;
			const newTag = await ConversationTag.findOneAndUpdate({
				tag,
				user
			}, {
				tag,
				user,
				count: addToConversation ? 1 : 0,
				position,
				description,
				$setOnInsert: { createdAt: /* @__PURE__ */ new Date() }
			}, {
				new: true,
				upsert: true,
				lean: true
			});
			if (addToConversation && conversationId) await Conversation.findOneAndUpdate({
				user,
				conversationId
			}, { $addToSet: { tags: tag } }, { new: true });
			return newTag;
		} catch (error) {
			logger.error("[createConversationTag] Error creating conversation tag", error);
			throw new Error("Error creating conversation tag");
		}
	}
	/**
	* Adjusts positions of tags when a tag's position is changed.
	*/
	async function adjustPositions(user, oldPosition, newPosition) {
		if (oldPosition === newPosition) return;
		const ConversationTag = mongoose.models.ConversationTag;
		const update = oldPosition < newPosition ? { $inc: { position: -1 } } : { $inc: { position: 1 } };
		const position = oldPosition < newPosition ? {
			$gt: Math.min(oldPosition, newPosition),
			$lte: Math.max(oldPosition, newPosition)
		} : {
			$gte: Math.min(oldPosition, newPosition),
			$lt: Math.max(oldPosition, newPosition)
		};
		await ConversationTag.updateMany({
			user,
			position
		}, update);
	}
	/**
	* Updates an existing conversation tag.
	*/
	async function updateConversationTag(user, oldTag, data) {
		try {
			const ConversationTag = mongoose.models.ConversationTag;
			const Conversation = mongoose.models.Conversation;
			const { tag: newTag, description, position } = data;
			const existingTag = await ConversationTag.findOne({
				user,
				tag: oldTag
			}).lean();
			if (!existingTag) return null;
			if (newTag && newTag !== oldTag) {
				if (await ConversationTag.findOne({
					user,
					tag: newTag
				}).lean()) throw new Error("Tag already exists");
				await Conversation.updateMany({
					user,
					tags: oldTag
				}, { $set: { "tags.$": newTag } });
			}
			const updateData = {};
			if (newTag) updateData.tag = newTag;
			if (description !== void 0) updateData.description = description;
			if (position !== void 0) {
				await adjustPositions(user, existingTag.position, position);
				updateData.position = position;
			}
			return await ConversationTag.findOneAndUpdate({
				user,
				tag: oldTag
			}, updateData, {
				new: true,
				lean: true
			});
		} catch (error) {
			logger.error("[updateConversationTag] Error updating conversation tag", error);
			throw new Error("Error updating conversation tag");
		}
	}
	/**
	* Deletes a conversation tag.
	*/
	async function deleteConversationTag(user, tag) {
		try {
			const ConversationTag = mongoose.models.ConversationTag;
			const Conversation = mongoose.models.Conversation;
			const deletedTag = await ConversationTag.findOneAndDelete({
				user,
				tag
			}).lean();
			if (!deletedTag) return null;
			await Conversation.updateMany({
				user,
				tags: tag
			}, { $pullAll: { tags: [tag] } });
			await ConversationTag.updateMany({
				user,
				position: { $gt: deletedTag.position }
			}, { $inc: { position: -1 } });
			return deletedTag;
		} catch (error) {
			logger.error("[deleteConversationTag] Error deleting conversation tag", error);
			throw new Error("Error deleting conversation tag");
		}
	}
	/**
	* Updates tags for a specific conversation.
	*/
	async function updateTagsForConversation(user, conversationId, tags) {
		try {
			const ConversationTag = mongoose.models.ConversationTag;
			const Conversation = mongoose.models.Conversation;
			const conversation = await Conversation.findOne({
				user,
				conversationId
			}).lean();
			if (!conversation) throw new Error("Conversation not found");
			const oldTags = new Set(conversation.tags ?? []);
			const newTags = new Set(tags);
			const addedTags = [...newTags].filter((tag) => !oldTags.has(tag));
			const removedTags = [...oldTags].filter((tag) => !newTags.has(tag));
			const bulkOps = [];
			for (const tag of addedTags) bulkOps.push({ updateOne: {
				filter: {
					user,
					tag
				},
				update: { $inc: { count: 1 } },
				upsert: true
			} });
			for (const tag of removedTags) bulkOps.push({ updateOne: {
				filter: {
					user,
					tag
				},
				update: { $inc: { count: -1 } }
			} });
			if (bulkOps.length > 0) await tenantSafeBulkWrite(ConversationTag, bulkOps);
			return (await Conversation.findOneAndUpdate({
				user,
				conversationId
			}, { $set: { tags: [...newTags] } }, { new: true })).toObject().tags;
		} catch (error) {
			logger.error("[updateTagsForConversation] Error updating tags", error);
			throw new Error("Error updating tags for conversation");
		}
	}
	/**
	* Increments tag counts for existing tags only.
	*/
	async function bulkIncrementTagCounts(user, tags) {
		if (!tags || tags.length === 0) return;
		try {
			const ConversationTag = mongoose.models.ConversationTag;
			const uniqueTags = [...new Set(tags.filter(Boolean))];
			if (uniqueTags.length === 0) return;
			const result = await tenantSafeBulkWrite(ConversationTag, uniqueTags.map((tag) => ({ updateOne: {
				filter: {
					user,
					tag
				},
				update: { $inc: { count: 1 } }
			} })));
			if (result && result.modifiedCount > 0) logger.debug(`user: ${user} | Incremented tag counts - modified ${result.modifiedCount} tags`);
		} catch (error) {
			logger.error("[bulkIncrementTagCounts] Error incrementing tag counts", error);
		}
	}
	/**
	* Deletes all conversation tags matching the given filter.
	*/
	async function deleteConversationTags(filter) {
		try {
			return (await mongoose.models.ConversationTag.deleteMany(filter)).deletedCount;
		} catch (error) {
			logger.error("[deleteConversationTags] Error deleting conversation tags", error);
			throw new Error("Error deleting conversation tags");
		}
	}
	return {
		getConversationTags,
		createConversationTag,
		updateConversationTag,
		deleteConversationTag,
		deleteConversationTags,
		bulkIncrementTagCounts,
		updateTagsForConversation
	};
}
//#endregion
//#region src/methods/message.ts
/** Simple UUID v4 regex to replace zod validation */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function createMessageMethods(mongoose) {
	/**
	* Saves a message in the database.
	*/
	async function saveMessage({ userId, isTemporary, interfaceConfig }, params, metadata) {
		if (!userId) throw new Error("User not authenticated");
		const conversationId = params.conversationId;
		if (!conversationId || !UUID_REGEX.test(conversationId)) {
			logger.warn(`Invalid conversation ID: ${conversationId} (context: ${metadata?.context ?? "n/a"})`);
			return;
		}
		try {
			const Message = mongoose.models.Message;
			const update = {
				...params,
				user: userId,
				messageId: params.newMessageId || params.messageId
			};
			if (interfaceConfig?.retentionMode === RetentionMode.ALL) {
				if (typeof isTemporary === "boolean") update.isTemporary = isTemporary;
				try {
					update.expiredAt = createTempChatExpirationDate(interfaceConfig);
				} catch (err) {
					logger.error("Error creating temporary chat expiration date:", err);
					logger.info(`---\`saveMessage\` context: ${metadata?.context}`);
					update.expiredAt = createFallbackRetentionDate();
				}
			} else if (isTemporary === true) {
				update.isTemporary = true;
				try {
					update.expiredAt = createTempChatExpirationDate(interfaceConfig);
				} catch (err) {
					logger.error("Error creating temporary chat expiration date:", err);
					logger.info(`---\`saveMessage\` context: ${metadata?.context}`);
					update.expiredAt = createFallbackRetentionDate();
				}
			} else if (isTemporary === false) {
				update.isTemporary = false;
				update.expiredAt = null;
			}
			if (update.tokenCount != null && isNaN(update.tokenCount)) {
				logger.warn(`Resetting invalid \`tokenCount\` for message \`${params.messageId}\`: ${update.tokenCount}`);
				logger.info(`---\`saveMessage\` context: ${metadata?.context}`);
				update.tokenCount = 0;
			}
			const message = await Message.findOneAndUpdate({
				messageId: params.messageId,
				user: userId
			}, update, {
				upsert: true,
				new: true
			});
			if (interfaceConfig?.retentionMode === RetentionMode.ALL && typeof isTemporary !== "boolean" && (message.isTemporary == null || message.isTemporary === false && message.$isDefault("isTemporary"))) {
				await Message.updateOne({
					_id: message._id,
					isTemporary: { $ne: false }
				}, { $set: { isTemporary: false } });
				message.isTemporary = false;
			}
			return message.toObject();
		} catch (err) {
			logger.error("Error saving message:", err);
			logger.info(`---\`saveMessage\` context: ${metadata?.context}`);
			const mongoErr = err;
			if (mongoErr.code === 11e3 && mongoErr.message?.includes("duplicate key error")) {
				logger.warn(`Duplicate messageId detected: ${params.messageId}. Continuing execution.`);
				try {
					const existingMessage = await mongoose.models.Message.findOne({
						messageId: params.messageId,
						user: userId
					});
					if (existingMessage) return existingMessage.toObject();
					return;
				} catch (findError) {
					logger.warn(`Could not retrieve existing message with ID ${params.messageId}: ${findError.message}`);
					return;
				}
			}
			throw err;
		}
	}
	/**
	* Saves multiple messages in bulk.
	*/
	async function bulkSaveMessages(messages, overrideTimestamp = false) {
		try {
			const Message = mongoose.models.Message;
			return await tenantSafeBulkWrite(Message, messages.map((message) => ({ updateOne: {
				filter: { messageId: message.messageId },
				update: message,
				timestamps: !overrideTimestamp,
				upsert: true
			} })));
		} catch (err) {
			logger.error("Error saving messages in bulk:", err);
			throw err;
		}
	}
	/**
	* Records a message in the database (no UUID validation).
	*/
	async function recordMessage({ user, endpoint, messageId, conversationId, parentMessageId, ...rest }) {
		try {
			const Message = mongoose.models.Message;
			const message = {
				user,
				endpoint,
				messageId,
				conversationId,
				parentMessageId,
				...rest
			};
			return await Message.findOneAndUpdate({
				user,
				messageId
			}, message, {
				upsert: true,
				new: true
			});
		} catch (err) {
			logger.error("Error recording message:", err);
			throw err;
		}
	}
	/**
	* Updates the text of a message.
	*/
	async function updateMessageText(userId, { messageId, text }) {
		try {
			await mongoose.models.Message.updateOne({
				messageId,
				user: userId
			}, { text });
		} catch (err) {
			logger.error("Error updating message text:", err);
			throw err;
		}
	}
	/**
	* Updates a message and returns sanitized fields.
	*/
	async function updateMessage(userId, message, metadata) {
		try {
			const Message = mongoose.models.Message;
			const { messageId, ...update } = message;
			const updatedMessage = await Message.findOneAndUpdate({
				messageId,
				user: userId
			}, update, { new: true });
			if (!updatedMessage) throw new Error("Message not found or user not authorized.");
			return {
				messageId: updatedMessage.messageId,
				conversationId: updatedMessage.conversationId,
				parentMessageId: updatedMessage.parentMessageId,
				sender: updatedMessage.sender,
				text: updatedMessage.text,
				isCreatedByUser: updatedMessage.isCreatedByUser,
				tokenCount: updatedMessage.tokenCount,
				feedback: updatedMessage.feedback,
				endpoint: updatedMessage.endpoint
			};
		} catch (err) {
			logger.error("Error updating message:", err);
			if (metadata?.context) logger.info(`---\`updateMessage\` context: ${metadata.context}`);
			throw err;
		}
	}
	/**
	* Deletes messages in a conversation since a specific message.
	*/
	async function deleteMessagesSince(userId, { messageId, conversationId }) {
		try {
			const Message = mongoose.models.Message;
			const message = await Message.findOne({
				messageId,
				user: userId
			}).lean();
			if (message) return await Message.find({
				conversationId,
				user: userId
			}).deleteMany({ createdAt: { $gt: message.createdAt } });
			return;
		} catch (err) {
			logger.error("Error deleting messages:", err);
			throw err;
		}
	}
	/**
	* Retrieves messages from the database.
	*/
	async function getMessages(filter, select, options = {}) {
		try {
			const query = mongoose.models.Message.find(filter);
			if (select) query.select(select);
			if (options.sort !== false) query.sort(options.sort ?? { createdAt: 1 });
			if (options.limit != null && options.limit > 0) query.limit(options.limit);
			return await query.lean();
		} catch (err) {
			logger.error("Error getting messages:", err);
			throw err;
		}
	}
	async function getMessageTextStats(filter, options = {}) {
		try {
			const Message = mongoose.models.Message;
			const pipeline = [{ $match: filter }];
			if (options.limit != null && options.limit > 0) pipeline.push({ $limit: options.limit });
			pipeline.push({ $project: {
				_id: 0,
				messageId: 1,
				textBytes: { $cond: [
					{ $eq: [{ $type: "$text" }, "string"] },
					{ $strLenBytes: "$text" },
					0
				] },
				quoteCount: { $cond: [
					{ $isArray: "$quotes" },
					{ $size: "$quotes" },
					0
				] },
				quoteBytes: { $cond: [
					{ $isArray: "$quotes" },
					{ $sum: { $map: {
						input: "$quotes",
						as: "quote",
						in: { $cond: [
							{ $eq: [{ $type: "$$quote" }, "string"] },
							{ $strLenBytes: "$$quote" },
							0
						] }
					} } },
					0
				] },
				quoteLineCount: { $cond: [
					{ $isArray: "$quotes" },
					{ $sum: { $map: {
						input: "$quotes",
						as: "quote",
						in: { $cond: [
							{ $eq: [{ $type: "$$quote" }, "string"] },
							{ $size: { $split: ["$$quote", "\n"] } },
							0
						] }
					} } },
					0
				] },
				nonStringQuoteCount: { $cond: [
					{ $isArray: "$quotes" },
					{ $size: { $filter: {
						input: "$quotes",
						as: "quote",
						cond: { $ne: [{ $type: "$$quote" }, "string"] }
					} } },
					0
				] }
			} });
			return await Message.aggregate(pipeline);
		} catch (err) {
			logger.error("Error getting message text stats:", err);
			throw err;
		}
	}
	/**
	* Retrieves a single message from the database.
	*/
	async function getMessage({ user, messageId }) {
		try {
			return await mongoose.models.Message.findOne({
				user,
				messageId
			}).lean();
		} catch (err) {
			logger.error("Error getting message:", err);
			throw err;
		}
	}
	/**
	* Deletes messages from the database.
	*/
	async function deleteMessages(filter) {
		try {
			return await mongoose.models.Message.deleteMany(filter);
		} catch (err) {
			logger.error("Error deleting messages:", err);
			throw err;
		}
	}
	/**
	* Retrieves paginated messages with custom sorting and cursor support.
	*/
	async function getMessagesByCursor(filter, options = {}) {
		const Message = mongoose.models.Message;
		const { sortField = "createdAt", sortOrder = -1, limit = 25, cursor } = options;
		const queryFilter = { ...filter };
		if (cursor) queryFilter[sortField] = sortOrder === 1 ? { $gt: cursor } : { $lt: cursor };
		const messages = await Message.find(queryFilter).sort({ [sortField]: sortOrder }).limit(limit + 1).lean();
		let nextCursor = null;
		if (messages.length > limit) {
			messages.pop();
			const last = messages[messages.length - 1];
			const cursorValue = sortField === "createdAt" ? last.createdAt : last[sortField];
			nextCursor = String(cursorValue ?? "");
		}
		return {
			messages,
			nextCursor
		};
	}
	/**
	* Performs a MeiliSearch query on the Message collection.
	* Requires the meilisearch plugin to be registered on the Message model.
	*/
	async function searchMessages(query, searchOptions, hydrate) {
		const Message = mongoose.models.Message;
		if (typeof Message.meiliSearch !== "function") throw new Error("MeiliSearch plugin not registered on Message model");
		return Message.meiliSearch(query, searchOptions, hydrate);
	}
	return {
		saveMessage,
		bulkSaveMessages,
		recordMessage,
		updateMessageText,
		updateMessage,
		deleteMessagesSince,
		getMessages,
		getMessageTextStats,
		getMessage,
		getMessagesByCursor,
		searchMessages,
		deleteMessages
	};
}
//#endregion
//#region src/methods/chatProject.ts
const VALID_SORT_FIELDS = new Set([
	"name",
	"createdAt",
	"lastConversationAt"
]);
function normalizeSortBy(sortBy) {
	return VALID_SORT_FIELDS.has(sortBy) ? sortBy : "lastConversationAt";
}
function normalizeSortDirection(sortDirection) {
	return sortDirection === "asc" ? "asc" : "desc";
}
function normalizeLimit(limit) {
	if (!Number.isFinite(limit) || !limit) return 25;
	return Math.min(Math.max(Math.floor(limit), 1), 100);
}
function sanitizeProjectInput(input) {
	return {
		name: input.name.trim().slice(0, 100),
		description: input.description?.trim().slice(0, 1e3) ?? ""
	};
}
function parseCursor(cursor) {
	if (!cursor) return null;
	try {
		const decoded = JSON.parse(Buffer.from(cursor, "base64").toString());
		if (!decoded.id || !isValidObjectIdString(decoded.id)) return null;
		return {
			primary: decoded.primary ?? null,
			id: decoded.id
		};
	} catch {
		logger.warn("[listChatProjects] Invalid cursor format, starting from beginning");
		return null;
	}
}
function encodeCursor(project, sortBy) {
	let primary = null;
	if (sortBy === "name") primary = project.name;
	else {
		const date = project[sortBy];
		primary = date instanceof Date ? date.toISOString() : null;
	}
	return Buffer.from(JSON.stringify({
		primary,
		id: project._id.toString()
	})).toString("base64");
}
function cursorPrimaryValue(primary, sortBy) {
	if (primary == null) return sortBy === "lastConversationAt" ? null : void 0;
	if (sortBy === "name") return primary;
	const date = new Date(primary);
	return Number.isNaN(date.getTime()) ? void 0 : date;
}
function createCursorFilter(mongoose, cursor, sortBy, sortDirection) {
	if (!cursor) return null;
	const op = sortDirection === "asc" ? "$gt" : "$lt";
	const id = new mongoose.Types.ObjectId(cursor.id);
	const primary = cursorPrimaryValue(cursor.primary, sortBy);
	if (primary === void 0) {
		logger.warn("[listChatProjects] Invalid cursor primary value, starting from beginning");
		return null;
	}
	const branches = [{ [sortBy]: { [op]: primary } }, {
		[sortBy]: primary,
		_id: { [op]: id }
	}];
	/**
	* Projects with no conversations have `lastConversationAt: null`, which sorts
	* after all dated projects in descending order. A `$lt: <date>` predicate does
	* not match null, so once the cursor moves past the dated projects we must
	* include the null bucket explicitly, otherwise empty projects never paginate.
	*/
	if (sortBy === "lastConversationAt" && sortDirection === "desc" && primary instanceof Date) branches.push({ lastConversationAt: null });
	return { $or: branches };
}
function visibleProjectConversationFilter(user, projectId) {
	return { $and: [
		{
			user,
			chatProjectId: projectId
		},
		{ $or: [{ isArchived: false }, { isArchived: { $exists: false } }] },
		buildRetentionVisibilityFilter()
	] };
}
async function refreshChatProjectStatsForUser(mongoose, user, projectId) {
	if (!isValidObjectIdString(projectId)) return null;
	const ChatProject = mongoose.models.ChatProject;
	const Conversation = mongoose.models.Conversation;
	const projectFilter = {
		_id: new mongoose.Types.ObjectId(projectId),
		user
	};
	const conversationFilter = visibleProjectConversationFilter(user, projectId);
	const [conversationCount, latestConversation] = await Promise.all([Conversation.countDocuments(conversationFilter), Conversation.findOne(conversationFilter).select("conversationId updatedAt createdAt").sort({
		updatedAt: -1,
		_id: -1
	}).lean()]);
	return await ChatProject.findOneAndUpdate(projectFilter, { $set: {
		conversationCount,
		lastConversationAt: latestConversation?.updatedAt ?? latestConversation?.createdAt ?? null,
		lastConversationId: latestConversation?.conversationId ?? null
	} }, { new: true }).lean();
}
async function updateChatProjectLastConversationForUser(mongoose, user, projectId, conversation, incrementCount = false) {
	if (!isValidObjectIdString(projectId) || !conversation.conversationId) return;
	const update = { $set: {
		lastConversationAt: conversation.updatedAt ?? conversation.createdAt ?? /* @__PURE__ */ new Date(),
		lastConversationId: conversation.conversationId
	} };
	if (incrementCount) update.$inc = { conversationCount: 1 };
	await mongoose.models.ChatProject.updateOne({
		_id: new mongoose.Types.ObjectId(projectId),
		user
	}, update);
}
function createChatProjectMethods(mongoose) {
	async function createChatProject(user, input) {
		const ChatProject = mongoose.models.ChatProject;
		const sanitized = sanitizeProjectInput(input);
		if (!sanitized.name) throw new Error("Project name is required");
		return (await ChatProject.create({
			...sanitized,
			user,
			conversationCount: 0,
			lastConversationAt: null,
			lastConversationId: null
		})).toObject();
	}
	async function getChatProject(user, projectId) {
		if (!isValidObjectIdString(projectId)) return null;
		return await mongoose.models.ChatProject.findOne({
			_id: new mongoose.Types.ObjectId(projectId),
			user
		}).lean();
	}
	async function listChatProjects(user, options = {}) {
		const ChatProject = mongoose.models.ChatProject;
		const limit = normalizeLimit(options.limit);
		const sortBy = normalizeSortBy(options.sortBy);
		const sortDirection = normalizeSortDirection(options.sortDirection);
		const sortOrder = sortDirection === "asc" ? 1 : -1;
		const filters = [{ user }];
		if (options.search?.trim()) filters.push({ name: {
			$regex: escapeRegExp(options.search.trim()),
			$options: "i"
		} });
		const cursorFilter = createCursorFilter(mongoose, parseCursor(options.cursor), sortBy, sortDirection);
		if (cursorFilter) filters.push(cursorFilter);
		const query = filters.length === 1 ? filters[0] : { $and: filters };
		const projects = await ChatProject.find(query).sort({
			[sortBy]: sortOrder,
			_id: sortOrder
		}).limit(limit + 1).lean();
		let nextCursor = null;
		if (projects.length > limit) {
			projects.pop();
			const lastProject = projects[projects.length - 1];
			if (lastProject) nextCursor = encodeCursor(lastProject, sortBy);
		}
		return {
			projects,
			nextCursor
		};
	}
	async function updateChatProject(user, projectId, input) {
		if (!isValidObjectIdString(projectId)) return null;
		const ChatProject = mongoose.models.ChatProject;
		const update = {};
		if (typeof input.name === "string") {
			const name = input.name.trim().slice(0, 100);
			if (!name) throw new Error("Project name is required");
			update.name = name;
		}
		if (input.description !== void 0) update.description = input.description?.trim().slice(0, 1e3) ?? "";
		return await ChatProject.findOneAndUpdate({
			_id: new mongoose.Types.ObjectId(projectId),
			user
		}, { $set: update }, {
			new: true,
			runValidators: true
		}).lean();
	}
	async function deleteChatProject(user, projectId) {
		if (!isValidObjectIdString(projectId)) return {
			deletedCount: 0,
			modifiedCount: 0
		};
		const ChatProject = mongoose.models.ChatProject;
		const Conversation = mongoose.models.Conversation;
		const projectFilter = {
			_id: new mongoose.Types.ObjectId(projectId),
			user
		};
		if (!await ChatProject.findOne(projectFilter).select("_id").lean()) return {
			deletedCount: 0,
			modifiedCount: 0
		};
		const [conversationResult, deleteResult] = await Promise.all([Conversation.updateMany({
			user,
			chatProjectId: projectId
		}, { $unset: { chatProjectId: "" } }), ChatProject.deleteOne(projectFilter)]);
		return {
			deletedCount: deleteResult.deletedCount ?? 0,
			modifiedCount: conversationResult.modifiedCount ?? 0
		};
	}
	async function assignConversationToProject(user, conversationId, projectId) {
		const ChatProject = mongoose.models.ChatProject;
		const Conversation = mongoose.models.Conversation;
		const conversation = await Conversation.findOne({
			user,
			conversationId
		}).lean();
		if (!conversation) return null;
		const normalizedProjectId = projectId || null;
		if (normalizedProjectId) {
			if (!isValidObjectIdString(normalizedProjectId)) throw new Error("Project not found");
			if (!await ChatProject.findOne({
				_id: new mongoose.Types.ObjectId(normalizedProjectId),
				user
			}).select("_id").lean()) throw new Error("Project not found");
		}
		const previousProjectId = conversation.chatProjectId ?? null;
		const update = normalizedProjectId == null ? { $unset: { chatProjectId: "" } } : { $set: { chatProjectId: normalizedProjectId } };
		const updatedConversation = await Conversation.findOneAndUpdate({
			user,
			conversationId
		}, update, { new: true }).lean();
		if (!updatedConversation) return null;
		const projectIds = new Set([previousProjectId, normalizedProjectId].filter((id) => Boolean(id)));
		await Promise.all([...projectIds].map((id) => refreshChatProjectStatsForUser(mongoose, user, id)));
		return {
			conversation: updatedConversation,
			previousProjectId,
			projectId: normalizedProjectId
		};
	}
	async function refreshChatProjectStats(user, projectId) {
		return await refreshChatProjectStatsForUser(mongoose, user, projectId);
	}
	return {
		createChatProject,
		getChatProject,
		listChatProjects,
		updateChatProject,
		deleteChatProject,
		assignConversationToProject,
		refreshChatProjectStats
	};
}
//#endregion
//#region src/methods/conversation.ts
function createConversationMethods(mongoose, messageMethods) {
	function getMessageMethods() {
		if (!messageMethods) throw new Error("Message methods not injected into conversation methods");
		return messageMethods;
	}
	function getVisibleConversationRetentionFilter() {
		return buildRetentionVisibilityFilter();
	}
	/**
	* Searches for a conversation by conversationId and returns a lean document with only conversationId and user.
	*/
	async function searchConversation(conversationId) {
		try {
			return await mongoose.models.Conversation.findOne({ conversationId }, "conversationId user").lean();
		} catch (error) {
			logger.error("[searchConversation] Error searching conversation", error);
			throw new Error("Error searching conversation");
		}
	}
	/**
	* Retrieves a single conversation for a given user and conversation ID.
	*/
	async function getConvo(user, conversationId) {
		try {
			return await mongoose.models.Conversation.findOne({
				user,
				conversationId
			}).lean();
		} catch (error) {
			logger.error("[getConvo] Error getting single conversation", error);
			throw new Error("Error getting single conversation");
		}
	}
	/**
	* Retrieves only the retention deadline for a conversation.
	*/
	async function getConvoRetention(user, conversationId) {
		try {
			return await mongoose.models.Conversation.findOne({
				user,
				conversationId
			}, "expiredAt").lean();
		} catch (error) {
			logger.error("[getConvoRetention] Error getting conversation retention fields", error);
			throw new Error("Error getting conversation retention fields");
		}
	}
	/**
	* Deletes conversations and messages with null or empty IDs.
	*/
	async function deleteNullOrEmptyConversations() {
		try {
			const Conversation = mongoose.models.Conversation;
			const { deleteMessages } = getMessageMethods();
			const filter = { $or: [
				{ conversationId: null },
				{ conversationId: "" },
				{ conversationId: { $exists: false } }
			] };
			const result = await Conversation.deleteMany(filter);
			const messageDeleteResult = await deleteMessages(filter);
			logger.info(`[deleteNullOrEmptyConversations] Deleted ${result.deletedCount} conversations and ${messageDeleteResult.deletedCount} messages`);
			return {
				conversations: result,
				messages: messageDeleteResult
			};
		} catch (error) {
			logger.error("[deleteNullOrEmptyConversations] Error deleting conversations", error);
			throw new Error("Error deleting conversations with null or empty conversationId");
		}
	}
	/**
	* Searches for a conversation by conversationId and returns associated file ids.
	*/
	async function getConvoFiles(conversationId) {
		try {
			return (await mongoose.models.Conversation.findOne({ conversationId }, "files").lean())?.files ?? [];
		} catch (error) {
			logger.error("[getConvoFiles] Error getting conversation files", error);
			throw new Error("Error getting conversation files");
		}
	}
	/**
	* Saves a conversation to the database.
	*/
	async function saveConvo({ userId, isTemporary, interfaceConfig }, { conversationId, newConversationId, ...convo }, metadata) {
		try {
			const Conversation = mongoose.models.Conversation;
			const { getMessages } = getMessageMethods();
			if (metadata?.context) logger.debug(`[saveConvo] ${metadata.context}`);
			const messages = await getMessages({
				conversationId,
				user: userId
			}, "_id");
			const update = {
				...convo,
				messages,
				user: userId
			};
			const unsetFields = { ...metadata?.unsetFields ?? {} };
			if (Object.prototype.hasOwnProperty.call(update, "chatProjectId") && update.chatProjectId) {
				const chatProjectId = typeof update.chatProjectId === "string" ? update.chatProjectId : "";
				let isValidChatProject = isValidObjectIdString(chatProjectId);
				if (isValidChatProject) isValidChatProject = await mongoose.models.ChatProject.exists({
					_id: new mongoose.Types.ObjectId(chatProjectId),
					user: userId
				}) != null;
				if (!isValidChatProject) {
					delete update.chatProjectId;
					unsetFields.chatProjectId = 1;
				}
			}
			const mayChangeProjectMembership = Object.prototype.hasOwnProperty.call(update, "chatProjectId") || Object.prototype.hasOwnProperty.call(unsetFields, "chatProjectId");
			let previousChatProjectId = null;
			if (mayChangeProjectMembership) previousChatProjectId = (await Conversation.findOne({
				conversationId,
				user: userId
			}, "chatProjectId").lean())?.chatProjectId ?? null;
			if (newConversationId) update.conversationId = newConversationId;
			if (interfaceConfig?.retentionMode === RetentionMode.ALL) {
				if (typeof isTemporary === "boolean") update.isTemporary = isTemporary;
				try {
					update.expiredAt = createTempChatExpirationDate(interfaceConfig);
				} catch (err) {
					logger.error("Error creating temporary chat expiration date:", err);
					logger.info(`---\`saveConvo\` context: ${metadata?.context}`);
					update.expiredAt = createFallbackRetentionDate();
				}
			} else if (isTemporary === true) {
				update.isTemporary = true;
				try {
					update.expiredAt = createTempChatExpirationDate(interfaceConfig);
				} catch (err) {
					logger.error("Error creating temporary chat expiration date:", err);
					logger.info(`---\`saveConvo\` context: ${metadata?.context}`);
					update.expiredAt = createFallbackRetentionDate();
				}
			} else if (isTemporary === false) {
				update.isTemporary = false;
				update.expiredAt = null;
			}
			const createdAtOnInsert = metadata?.createdAtOnInsert instanceof Date && !Number.isNaN(metadata.createdAtOnInsert.getTime()) ? metadata.createdAtOnInsert : void 0;
			if (createdAtOnInsert) update.updatedAt = /* @__PURE__ */ new Date();
			const updateOperation = { $set: update };
			if (Object.keys(unsetFields).length > 0) updateOperation.$unset = unsetFields;
			if (createdAtOnInsert) updateOperation.$setOnInsert = { createdAt: createdAtOnInsert };
			const conversationResult = await Conversation.findOneAndUpdate({
				conversationId,
				user: userId
			}, updateOperation, {
				new: true,
				upsert: metadata?.noUpsert !== true,
				includeResultMetadata: true,
				...createdAtOnInsert ? { timestamps: false } : {}
			});
			const conversation = conversationResult.value;
			if (!conversation) {
				logger.debug("[saveConvo] Conversation not found, skipping update");
				return null;
			}
			if (interfaceConfig?.retentionMode === RetentionMode.ALL && typeof isTemporary !== "boolean" && (conversation.isTemporary == null || conversation.isTemporary === false && conversation.$isDefault("isTemporary"))) {
				await Conversation.updateOne({
					_id: conversation._id,
					isTemporary: { $ne: false }
				}, { $set: { isTemporary: false } });
				conversation.isTemporary = false;
			}
			const newChatProjectId = conversation.chatProjectId ?? null;
			const projectMembershipChanged = previousChatProjectId !== newChatProjectId;
			/**
			* A chat that moved between projects (e.g. a stale tab re-submitting an
			* older project id) must fully recompute the stats of the project it left;
			* the incremental path only ever touches the project it now belongs to.
			*/
			if (projectMembershipChanged && previousChatProjectId) await refreshChatProjectStatsForUser(mongoose, userId, previousChatProjectId);
			if (conversation.chatProjectId) {
				const isRetentionVisibilityUpdate = typeof update.isTemporary === "boolean" || Object.prototype.hasOwnProperty.call(convo, "expiredAt") || Object.prototype.hasOwnProperty.call(unsetFields, "isTemporary") || Object.prototype.hasOwnProperty.call(unsetFields, "expiredAt");
				/**
				* Saving a conversation that is itself archived or retention-hidden (e.g.
				* renaming or title generation on an archived project chat) must recompute
				* stats rather than take the incremental fast path, otherwise the project's
				* lastConversationAt/Id would point at a chat the project workspace hides.
				*/
				const isConversationHidden = conversation.isArchived === true || conversation.isTemporary === true || conversation.expiredAt != null && new Date(conversation.expiredAt).getTime() <= Date.now();
				if (projectMembershipChanged || typeof update.isArchived === "boolean" || Object.prototype.hasOwnProperty.call(unsetFields, "isArchived") || isRetentionVisibilityUpdate || isConversationHidden) await refreshChatProjectStatsForUser(mongoose, userId, conversation.chatProjectId);
				else await updateChatProjectLastConversationForUser(mongoose, userId, conversation.chatProjectId, conversation, conversationResult.lastErrorObject?.updatedExisting === false);
			}
			return conversation.toObject();
		} catch (error) {
			logger.error("[saveConvo] Error saving conversation", error);
			if (metadata?.context) logger.info(`[saveConvo] ${metadata.context}`);
			return { message: "Error saving conversation" };
		}
	}
	/**
	* Saves multiple conversations in bulk.
	*/
	async function bulkSaveConvos(conversations) {
		try {
			const Conversation = mongoose.models.Conversation;
			const ChatProject = mongoose.models.ChatProject;
			/**
			* Validate project ownership before persisting (mirrors saveConvo). Bulk
			* paths like import/duplicate/fork can carry a chatProjectId that does not
			* belong to the user; persisting it would create an orphan assignment that
			* is hidden from both the project and the unassigned filter.
			*/
			const candidatePairs = /* @__PURE__ */ new Map();
			for (const convo of conversations) if (typeof convo.user === "string" && typeof convo.chatProjectId === "string" && isValidObjectIdString(convo.chatProjectId)) candidatePairs.set(`${convo.user}:${convo.chatProjectId}`, {
				user: convo.user,
				projectId: convo.chatProjectId
			});
			const ownedProjects = /* @__PURE__ */ new Set();
			if (candidatePairs.size > 0) {
				const owned = await ChatProject.find({ $or: [...candidatePairs.values()].map(({ user, projectId }) => ({
					_id: new mongoose.Types.ObjectId(projectId),
					user
				})) }).select("_id user").lean();
				for (const project of owned) ownedProjects.add(`${project.user}:${project._id.toString()}`);
			}
			/**
			* Capture each conversation's existing project so a bulk move (import that
			* overwrites an existing (user, conversationId), duplicate/fork) also refreshes
			* the project it leaves, not just the one it joins. One batched read keeps this
			* O(1) in round-trips regardless of batch size.
			*/
			const previousProjectByConversation = /* @__PURE__ */ new Map();
			const conversationPairs = conversations.filter((c) => typeof c.user === "string" && typeof c.conversationId === "string").map((c) => ({
				user: c.user,
				conversationId: c.conversationId
			}));
			if (conversationPairs.length > 0) {
				const existing = await Conversation.find({ $or: conversationPairs }, "user conversationId chatProjectId").lean();
				for (const doc of existing) if (doc.chatProjectId) previousProjectByConversation.set(`${doc.user}:${doc.conversationId}`, doc.chatProjectId);
			}
			const affectedProjectStats = /* @__PURE__ */ new Map();
			const result = await tenantSafeBulkWrite(Conversation, conversations.map((convo) => {
				const sanitized = { ...convo };
				if (typeof sanitized.user === "string" && typeof sanitized.chatProjectId === "string") if (ownedProjects.has(`${sanitized.user}:${sanitized.chatProjectId}`)) affectedProjectStats.set(`${sanitized.user}:${sanitized.chatProjectId}`, {
					user: sanitized.user,
					projectId: sanitized.chatProjectId
				});
				else sanitized.chatProjectId = null;
				if (typeof sanitized.user === "string" && typeof sanitized.conversationId === "string") {
					const previousProjectId = previousProjectByConversation.get(`${sanitized.user}:${sanitized.conversationId}`);
					const newProjectId = typeof sanitized.chatProjectId === "string" ? sanitized.chatProjectId : null;
					if (previousProjectId && previousProjectId !== newProjectId) affectedProjectStats.set(`${sanitized.user}:${previousProjectId}`, {
						user: sanitized.user,
						projectId: previousProjectId
					});
				}
				return { updateOne: {
					filter: {
						conversationId: sanitized.conversationId,
						user: sanitized.user
					},
					update: sanitized,
					upsert: true,
					timestamps: false
				} };
			}));
			await Promise.all([...affectedProjectStats.values()].map(({ user, projectId }) => refreshChatProjectStatsForUser(mongoose, user, projectId)));
			return result;
		} catch (error) {
			logger.error("[bulkSaveConvos] Error saving conversations in bulk", error);
			throw new Error("Failed to save conversations in bulk.");
		}
	}
	/**
	* Retrieves conversations using cursor-based pagination.
	*/
	async function getConvosByCursor(user, { cursor, limit = 25, isArchived = false, tags, search, sortBy = "updatedAt", sortDirection = "desc", projectId } = {}) {
		const Conversation = mongoose.models.Conversation;
		const filters = [{ user }];
		if (isArchived) filters.push({ isArchived: true });
		else filters.push({ $or: [{ isArchived: false }, { isArchived: { $exists: false } }] });
		if (Array.isArray(tags) && tags.length > 0) filters.push({ tags: { $in: tags } });
		if (projectId === "unassigned") filters.push({ $or: [{ chatProjectId: null }, { chatProjectId: { $exists: false } }] });
		else if (projectId) filters.push({ chatProjectId: projectId });
		filters.push(getVisibleConversationRetentionFilter());
		if (search) try {
			const meiliResults = await Conversation.meiliSearch(search, { filter: `user = "${user}"` });
			const matchingIds = Array.isArray(meiliResults.hits) ? meiliResults.hits.map((result) => result.conversationId) : [];
			if (!matchingIds.length) return {
				conversations: [],
				nextCursor: null
			};
			filters.push({ conversationId: { $in: matchingIds } });
		} catch (error) {
			logger.error("[getConvosByCursor] Error during meiliSearch", error);
			throw new Error("Error during meiliSearch");
		}
		const validSortFields = [
			"title",
			"createdAt",
			"updatedAt"
		];
		if (!validSortFields.includes(sortBy)) throw new Error(`Invalid sortBy field: ${sortBy}. Must be one of ${validSortFields.join(", ")}`);
		const finalSortBy = sortBy;
		const finalSortDirection = sortDirection === "asc" ? "asc" : "desc";
		let cursorFilter = null;
		if (cursor) {
			try {
				const { primary, secondary } = JSON.parse(Buffer.from(cursor, "base64").toString());
				const primaryValue = finalSortBy === "title" ? primary : new Date(primary);
				const secondaryValue = new Date(secondary);
				const op = finalSortDirection === "asc" ? "$gt" : "$lt";
				cursorFilter = { $or: [{ [finalSortBy]: { [op]: primaryValue } }, {
					[finalSortBy]: primaryValue,
					updatedAt: { [op]: secondaryValue }
				}] };
			} catch {
				logger.warn("[getConvosByCursor] Invalid cursor format, starting from beginning");
			}
			if (cursorFilter) filters.push(cursorFilter);
		}
		const query = filters.length === 1 ? filters[0] : { $and: filters };
		try {
			const sortOrder = finalSortDirection === "asc" ? 1 : -1;
			const sortObj = { [finalSortBy]: sortOrder };
			if (finalSortBy !== "updatedAt") sortObj.updatedAt = sortOrder;
			const convos = await Conversation.find(query).select("conversationId endpoint title createdAt updatedAt user model agent_id assistant_id spec iconURL chatProjectId pinned").sort(sortObj).limit(limit + 1).lean();
			let nextCursor = null;
			if (convos.length > limit) {
				convos.pop();
				const lastReturned = convos[convos.length - 1];
				let primaryValue = lastReturned.updatedAt;
				if (finalSortBy === "title") primaryValue = lastReturned.title;
				else if (finalSortBy === "createdAt") primaryValue = lastReturned.createdAt;
				const composite = {
					primary: finalSortBy === "title" ? primaryValue : new Date(primaryValue ?? 0).toISOString(),
					secondary: new Date(lastReturned.updatedAt ?? 0).toISOString()
				};
				nextCursor = Buffer.from(JSON.stringify(composite)).toString("base64");
			}
			return {
				conversations: convos,
				nextCursor
			};
		} catch (error) {
			logger.error("[getConvosByCursor] Error getting conversations", error);
			throw new Error("Error getting conversations");
		}
	}
	/**
	* Fetches specific conversations by ID array with pagination.
	*/
	async function getConvosQueried(user, convoIds, cursor = null, limit = 25) {
		try {
			const Conversation = mongoose.models.Conversation;
			if (!convoIds?.length) return {
				conversations: [],
				nextCursor: null,
				convoMap: {}
			};
			const conversationIds = convoIds.map((convo) => convo.conversationId);
			const results = await Conversation.find({
				user,
				conversationId: { $in: conversationIds },
				...getVisibleConversationRetentionFilter()
			}).lean();
			results.sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());
			let filtered = results;
			if (cursor && cursor !== "start") {
				const cursorDate = new Date(cursor);
				filtered = results.filter((convo) => new Date(convo.updatedAt ?? 0) < cursorDate);
			}
			const limited = filtered.slice(0, limit + 1);
			let nextCursor = null;
			if (limited.length > limit) {
				limited.pop();
				nextCursor = limited[limited.length - 1].updatedAt.toISOString();
			}
			const convoMap = {};
			limited.forEach((convo) => {
				convoMap[convo.conversationId] = convo;
			});
			return {
				conversations: limited,
				nextCursor,
				convoMap
			};
		} catch (error) {
			logger.error("[getConvosQueried] Error getting conversations", error);
			throw new Error("Error fetching conversations");
		}
	}
	/**
	* Gets conversation title, returning 'New Chat' as default.
	*/
	async function getConvoTitle(user, conversationId) {
		try {
			const convo = await getConvo(user, conversationId);
			if (convo && !convo.title) return null;
			else return convo?.title || "New Chat";
		} catch (error) {
			logger.error("[getConvoTitle] Error getting conversation title", error);
			throw new Error("Error getting conversation title");
		}
	}
	/**
	* Deletes conversations and their associated messages for a given user and filter.
	*/
	async function deleteConvos(user, filter) {
		try {
			const Conversation = mongoose.models.Conversation;
			const { deleteMessages } = getMessageMethods();
			const userFilter = {
				...filter,
				user
			};
			const conversations = await Conversation.find(userFilter).select("conversationId chatProjectId tags");
			const conversationIds = conversations.map((c) => c.conversationId);
			const projectIds = new Set(conversations.map((conversation) => conversation.chatProjectId).filter((projectId) => Boolean(projectId)));
			/**
			* One entry per (conversation, tag) association: each conversation's tags are
			* deduped so a duplicate tag entry within a single conversation only decrements
			* the bookmark count once.
			*/
			const tagDecrements = [];
			for (const conversation of conversations) {
				if (!conversation.tags?.length) continue;
				for (const tag of new Set(conversation.tags)) tagDecrements.push(tag);
			}
			if (!conversationIds.length) throw new Error("Conversation not found or already deleted.");
			const deleteConvoResult = await Conversation.deleteMany(userFilter);
			const deleted = deleteConvoResult.deletedCount > 0;
			/**
			* Reconcile bookmark counts from the deletion before message cleanup: if
			* `deleteMessages` later throws, the conversation is already gone and a retry
			* finds nothing, so the count must be reconciled here or it would stay stale.
			* The decrement is best-effort and never throws, so it cannot block message
			* cleanup. The `deletedCount` guard skips a losing concurrent delete whose
			* pre-delete snapshot would otherwise decrement a conversation it did not
			* actually remove.
			*/
			if (deleted) await decrementTagCounts(mongoose, user, tagDecrements);
			const deleteMessagesResult = await deleteMessages({
				conversationId: { $in: conversationIds },
				user
			});
			/**
			* Refresh project stats after message cleanup so a stats-refresh error cannot
			* prevent `deleteMessages` from running, which would orphan the deleted
			* conversations' messages.
			*/
			if (deleted && projectIds.size > 0) await Promise.all([...projectIds].map((projectId) => refreshChatProjectStatsForUser(mongoose, user, projectId)));
			return {
				...deleteConvoResult,
				messages: deleteMessagesResult
			};
		} catch (error) {
			logger.error("[deleteConvos] Error deleting conversations and messages", error);
			throw error;
		}
	}
	return {
		getConvoFiles,
		searchConversation,
		deleteNullOrEmptyConversations,
		saveConvo,
		bulkSaveConvos,
		getConvosByCursor,
		getConvosQueried,
		getConvo,
		getConvoRetention,
		getConvoTitle,
		deleteConvos
	};
}
//#endregion
//#region src/methods/tx.ts
const defaultRate = 6;
/**
* Mapping of model token sizes to their respective multipliers for prompt and completion.
* The rates are 1 USD per 1M tokens.
*/
const tokenValues = Object.assign({
	"8k": {
		prompt: 30,
		completion: 60
	},
	"32k": {
		prompt: 60,
		completion: 120
	},
	"4k": {
		prompt: 1.5,
		completion: 2
	},
	"16k": {
		prompt: 3,
		completion: 4
	},
	"claude-": {
		prompt: .8,
		completion: 2.4
	},
	deepseek: {
		prompt: .28,
		completion: .42
	},
	command: {
		prompt: .38,
		completion: .38
	},
	gemma: {
		prompt: .02,
		completion: .04
	},
	gemini: {
		prompt: .5,
		completion: 1.5
	},
	"gpt-oss": {
		prompt: .05,
		completion: .2
	},
	"gpt-3.5-turbo-1106": {
		prompt: 1,
		completion: 2
	},
	"gpt-3.5-turbo-0125": {
		prompt: .5,
		completion: 1.5
	},
	"gpt-4-1106": {
		prompt: 10,
		completion: 30
	},
	"gpt-4.1": {
		prompt: 2,
		completion: 8
	},
	"gpt-4.1-nano": {
		prompt: .1,
		completion: .4
	},
	"gpt-4.1-mini": {
		prompt: .4,
		completion: 1.6
	},
	"gpt-4.5": {
		prompt: 75,
		completion: 150
	},
	"gpt-4o": {
		prompt: 2.5,
		completion: 10
	},
	"gpt-4o-2024-05-13": {
		prompt: 5,
		completion: 15
	},
	"gpt-4o-mini": {
		prompt: .15,
		completion: .6
	},
	"gpt-5": {
		prompt: 1.25,
		completion: 10
	},
	"gpt-5.1": {
		prompt: 1.25,
		completion: 10
	},
	"gpt-5.2": {
		prompt: 1.75,
		completion: 14
	},
	"gpt-5.3": {
		prompt: 1.75,
		completion: 14
	},
	"gpt-5.4": {
		prompt: 2.5,
		completion: 15
	},
	"gpt-5.4-pro": {
		prompt: 30,
		completion: 180
	},
	"gpt-5.4-mini": {
		prompt: .75,
		completion: 4.5
	},
	"gpt-5.4-nano": {
		prompt: .2,
		completion: 1.25
	},
	"gpt-5.5": {
		prompt: 5,
		completion: 30
	},
	"gpt-5.5-pro": {
		prompt: 30,
		completion: 180
	},
	"chat-latest": {
		prompt: 5,
		completion: 30
	},
	"gpt-5-chat-latest": {
		prompt: 1.25,
		completion: 10
	},
	"gpt-5.1-chat-latest": {
		prompt: 1.25,
		completion: 10
	},
	"gpt-5.2-chat-latest": {
		prompt: 1.75,
		completion: 14
	},
	"gpt-5.3-chat-latest": {
		prompt: 1.75,
		completion: 14
	},
	"gpt-5-nano": {
		prompt: .05,
		completion: .4
	},
	"gpt-5-mini": {
		prompt: .25,
		completion: 2
	},
	"gpt-5-pro": {
		prompt: 15,
		completion: 120
	},
	"gpt-5.2-pro": {
		prompt: 21,
		completion: 168
	},
	o1: {
		prompt: 15,
		completion: 60
	},
	"o1-mini": {
		prompt: 1.1,
		completion: 4.4
	},
	"o1-preview": {
		prompt: 15,
		completion: 60
	},
	o3: {
		prompt: 2,
		completion: 8
	},
	"o3-mini": {
		prompt: 1.1,
		completion: 4.4
	},
	"o4-mini": {
		prompt: 1.1,
		completion: 4.4
	},
	"claude-instant": {
		prompt: .8,
		completion: 2.4
	},
	"claude-2": {
		prompt: 8,
		completion: 24
	},
	"claude-2.1": {
		prompt: 8,
		completion: 24
	},
	"claude-3-haiku": {
		prompt: .25,
		completion: 1.25
	},
	"claude-3-sonnet": {
		prompt: 3,
		completion: 15
	},
	"claude-3-opus": {
		prompt: 15,
		completion: 75
	},
	"claude-3-5-haiku": {
		prompt: .8,
		completion: 4
	},
	"claude-3.5-haiku": {
		prompt: .8,
		completion: 4
	},
	"claude-3-5-sonnet": {
		prompt: 3,
		completion: 15
	},
	"claude-3.5-sonnet": {
		prompt: 3,
		completion: 15
	},
	"claude-3-7-sonnet": {
		prompt: 3,
		completion: 15
	},
	"claude-3.7-sonnet": {
		prompt: 3,
		completion: 15
	},
	"claude-haiku-4-5": {
		prompt: 1,
		completion: 5
	},
	"claude-opus-4": {
		prompt: 15,
		completion: 75
	},
	"claude-opus-4-5": {
		prompt: 5,
		completion: 25
	},
	"claude-opus-4-6": {
		prompt: 5,
		completion: 25
	},
	"claude-opus-4-7": {
		prompt: 5,
		completion: 25
	},
	"claude-opus-4-8": {
		prompt: 5,
		completion: 25
	},
	"claude-fable-5": {
		prompt: 10,
		completion: 50
	},
	"claude-mythos-5": {
		prompt: 10,
		completion: 50
	},
	"claude-sonnet-4": {
		prompt: 3,
		completion: 15
	},
	"claude-sonnet-4-5": {
		prompt: 3,
		completion: 15
	},
	"claude-sonnet-4-6": {
		prompt: 3,
		completion: 15
	},
	"command-r": {
		prompt: .5,
		completion: 1.5
	},
	"command-r-plus": {
		prompt: 3,
		completion: 15
	},
	"command-text": {
		prompt: 1.5,
		completion: 2
	},
	"deepseek-chat": {
		prompt: .28,
		completion: .42
	},
	"deepseek-reasoner": {
		prompt: .28,
		completion: .42
	},
	"deepseek-r1": {
		prompt: .4,
		completion: 2
	},
	"deepseek-v3": {
		prompt: .2,
		completion: .8
	},
	"gemma-2": {
		prompt: .01,
		completion: .03
	},
	"gemma-3": {
		prompt: .02,
		completion: .04
	},
	"gemma-3-27b": {
		prompt: .09,
		completion: .16
	},
	"gemini-1.5": {
		prompt: 2.5,
		completion: 10
	},
	"gemini-1.5-flash": {
		prompt: .15,
		completion: .6
	},
	"gemini-1.5-flash-8b": {
		prompt: .075,
		completion: .3
	},
	"gemini-2.0": {
		prompt: .1,
		completion: .4
	},
	"gemini-2.0-flash": {
		prompt: .1,
		completion: .4
	},
	"gemini-2.0-flash-lite": {
		prompt: .075,
		completion: .3
	},
	"gemini-2.5": {
		prompt: .3,
		completion: 2.5
	},
	"gemini-2.5-flash": {
		prompt: .3,
		completion: 2.5
	},
	"gemini-2.5-flash-lite": {
		prompt: .1,
		completion: .4
	},
	"gemini-2.5-pro": {
		prompt: 1.25,
		completion: 10
	},
	"gemini-2.5-flash-image": {
		prompt: .15,
		completion: 30
	},
	"gemini-3": {
		prompt: 2,
		completion: 12
	},
	"gemini-3-pro-image": {
		prompt: 2,
		completion: 120
	},
	"gemini-3.1": {
		prompt: 2,
		completion: 12
	},
	"gemini-3.1-flash-lite": {
		prompt: .25,
		completion: 1.5
	},
	"gemini-3.5-flash": {
		prompt: 1.5,
		completion: 9
	},
	"gemini-pro-vision": {
		prompt: .5,
		completion: 1.5
	},
	grok: {
		prompt: 2,
		completion: 10
	},
	"grok-beta": {
		prompt: 5,
		completion: 15
	},
	"grok-vision-beta": {
		prompt: 5,
		completion: 15
	},
	"grok-2": {
		prompt: 2,
		completion: 10
	},
	"grok-2-1212": {
		prompt: 2,
		completion: 10
	},
	"grok-2-latest": {
		prompt: 2,
		completion: 10
	},
	"grok-2-vision": {
		prompt: 2,
		completion: 10
	},
	"grok-2-vision-1212": {
		prompt: 2,
		completion: 10
	},
	"grok-2-vision-latest": {
		prompt: 2,
		completion: 10
	},
	"grok-3": {
		prompt: 3,
		completion: 15
	},
	"grok-3-fast": {
		prompt: 5,
		completion: 25
	},
	"grok-3-mini": {
		prompt: .3,
		completion: .5
	},
	"grok-3-mini-fast": {
		prompt: .6,
		completion: 4
	},
	"grok-4": {
		prompt: 3,
		completion: 15
	},
	"grok-4-fast": {
		prompt: .2,
		completion: .5
	},
	"grok-4-1-fast": {
		prompt: .2,
		completion: .5
	},
	"grok-code-fast": {
		prompt: .2,
		completion: 1.5
	},
	codestral: {
		prompt: .3,
		completion: .9
	},
	devstral: {
		prompt: .4,
		completion: 2
	},
	"mistral-medium": {
		prompt: 1.5,
		completion: 7.5
	},
	voxtral: {
		prompt: .1,
		completion: .4
	},
	holo2: {
		prompt: .3,
		completion: .7
	},
	"ministral-3b": {
		prompt: .04,
		completion: .04
	},
	"ministral-8b": {
		prompt: .1,
		completion: .1
	},
	"mistral-nemo": {
		prompt: .15,
		completion: .15
	},
	"mistral-saba": {
		prompt: .2,
		completion: .6
	},
	"pixtral-large": {
		prompt: 2,
		completion: 6
	},
	"mistral-large": {
		prompt: 2,
		completion: 6
	},
	"mixtral-8x22b": {
		prompt: .65,
		completion: .65
	},
	kimi: {
		prompt: .6,
		completion: 2.5
	},
	moonshot: {
		prompt: 2,
		completion: 5
	},
	"kimi-latest": {
		prompt: .2,
		completion: 2
	},
	"kimi-k2": {
		prompt: .6,
		completion: 2.5
	},
	"kimi-k2.5": {
		prompt: .6,
		completion: 3
	},
	"kimi-k2-turbo": {
		prompt: 1.15,
		completion: 8
	},
	"kimi-k2-turbo-preview": {
		prompt: 1.15,
		completion: 8
	},
	"kimi-k2-0905": {
		prompt: .6,
		completion: 2.5
	},
	"kimi-k2-0905-preview": {
		prompt: .6,
		completion: 2.5
	},
	"kimi-k2-0711": {
		prompt: .6,
		completion: 2.5
	},
	"kimi-k2-0711-preview": {
		prompt: .6,
		completion: 2.5
	},
	"kimi-k2-thinking": {
		prompt: .6,
		completion: 2.5
	},
	"kimi-k2-thinking-turbo": {
		prompt: 1.15,
		completion: 8
	},
	"moonshot-v1": {
		prompt: 2,
		completion: 5
	},
	"moonshot-v1-auto": {
		prompt: 2,
		completion: 5
	},
	"moonshot-v1-8k": {
		prompt: .2,
		completion: 2
	},
	"moonshot-v1-8k-vision": {
		prompt: .2,
		completion: 2
	},
	"moonshot-v1-8k-vision-preview": {
		prompt: .2,
		completion: 2
	},
	"moonshot-v1-32k": {
		prompt: 1,
		completion: 3
	},
	"moonshot-v1-32k-vision": {
		prompt: 1,
		completion: 3
	},
	"moonshot-v1-32k-vision-preview": {
		prompt: 1,
		completion: 3
	},
	"moonshot-v1-128k": {
		prompt: 2,
		completion: 5
	},
	"moonshot-v1-128k-vision": {
		prompt: 2,
		completion: 5
	},
	"moonshot-v1-128k-vision-preview": {
		prompt: 2,
		completion: 5
	},
	"gpt-oss:20b": {
		prompt: .05,
		completion: .2
	},
	"gpt-oss-20b": {
		prompt: .05,
		completion: .2
	},
	"gpt-oss:120b": {
		prompt: .15,
		completion: .6
	},
	"gpt-oss-120b": {
		prompt: .15,
		completion: .6
	},
	glm4: {
		prompt: .1,
		completion: .1
	},
	"glm-4": {
		prompt: .1,
		completion: .1
	},
	"glm-4-32b": {
		prompt: .1,
		completion: .1
	},
	"glm-4.5": {
		prompt: .35,
		completion: 1.55
	},
	"glm-4.5-air": {
		prompt: .14,
		completion: .86
	},
	"glm-4.5v": {
		prompt: .6,
		completion: 1.8
	},
	"glm-4.6": {
		prompt: .5,
		completion: 1.75
	},
	qwen: {
		prompt: .08,
		completion: .33
	},
	"qwen2.5": {
		prompt: .08,
		completion: .33
	},
	"qwen-turbo": {
		prompt: .05,
		completion: .2
	},
	"qwen-plus": {
		prompt: .4,
		completion: 1.2
	},
	"qwen-max": {
		prompt: 1.6,
		completion: 6.4
	},
	"qwq-32b": {
		prompt: .15,
		completion: .4
	},
	qwen3: {
		prompt: .035,
		completion: .138
	},
	"qwen3-8b": {
		prompt: .035,
		completion: .138
	},
	"qwen3-14b": {
		prompt: .05,
		completion: .22
	},
	"qwen3-30b-a3b": {
		prompt: .06,
		completion: .22
	},
	"qwen3-32b": {
		prompt: .05,
		completion: .2
	},
	"qwen3-235b-a22b": {
		prompt: .08,
		completion: .55
	},
	"qwen3-vl-8b-thinking": {
		prompt: .18,
		completion: 2.1
	},
	"qwen3-vl-8b-instruct": {
		prompt: .18,
		completion: .69
	},
	"qwen3-vl-30b-a3b": {
		prompt: .29,
		completion: 1
	},
	"qwen3-vl-235b-a22b": {
		prompt: .3,
		completion: 1.2
	},
	"qwen3-max": {
		prompt: 1.2,
		completion: 6
	},
	"qwen3-coder": {
		prompt: .22,
		completion: .95
	},
	"qwen3-coder-30b-a3b": {
		prompt: .06,
		completion: .25
	},
	"qwen3-coder-plus": {
		prompt: 1,
		completion: 5
	},
	"qwen3-coder-flash": {
		prompt: .3,
		completion: 1.5
	},
	"qwen3-next-80b-a3b": {
		prompt: .1,
		completion: .8
	}
}, {
	llama2: {
		prompt: .75,
		completion: 1
	},
	"llama-2": {
		prompt: .75,
		completion: 1
	},
	"llama2-13b": {
		prompt: .75,
		completion: 1
	},
	"llama2:70b": {
		prompt: 1.95,
		completion: 2.56
	},
	"llama2-70b": {
		prompt: 1.95,
		completion: 2.56
	},
	llama3: {
		prompt: .3,
		completion: .6
	},
	"llama-3": {
		prompt: .3,
		completion: .6
	},
	"llama3-8b": {
		prompt: .3,
		completion: .6
	},
	"llama3:8b": {
		prompt: .3,
		completion: .6
	},
	"llama3-70b": {
		prompt: 2.65,
		completion: 3.5
	},
	"llama3:70b": {
		prompt: 2.65,
		completion: 3.5
	},
	"llama3-1": {
		prompt: .22,
		completion: .22
	},
	"llama3-1-8b": {
		prompt: .22,
		completion: .22
	},
	"llama3-1-70b": {
		prompt: .72,
		completion: .72
	},
	"llama3-1-405b": {
		prompt: 2.4,
		completion: 2.4
	},
	"llama3-2": {
		prompt: .1,
		completion: .1
	},
	"llama3-2-1b": {
		prompt: .1,
		completion: .1
	},
	"llama3-2-3b": {
		prompt: .15,
		completion: .15
	},
	"llama3-2-11b": {
		prompt: .16,
		completion: .16
	},
	"llama3-2-90b": {
		prompt: .72,
		completion: .72
	},
	"llama3-3": {
		prompt: 2.65,
		completion: 3.5
	},
	"llama3-3-70b": {
		prompt: 2.65,
		completion: 3.5
	},
	"llama3.1": {
		prompt: .22,
		completion: .22
	},
	"llama3.1:8b": {
		prompt: .22,
		completion: .22
	},
	"llama3.1:70b": {
		prompt: .72,
		completion: .72
	},
	"llama3.1:405b": {
		prompt: 2.4,
		completion: 2.4
	},
	"llama3.2": {
		prompt: .1,
		completion: .1
	},
	"llama3.2:1b": {
		prompt: .1,
		completion: .1
	},
	"llama3.2:3b": {
		prompt: .15,
		completion: .15
	},
	"llama3.2:11b": {
		prompt: .16,
		completion: .16
	},
	"llama3.2:90b": {
		prompt: .72,
		completion: .72
	},
	"llama3.3": {
		prompt: 2.65,
		completion: 3.5
	},
	"llama3.3:70b": {
		prompt: 2.65,
		completion: 3.5
	},
	"llama-3.1": {
		prompt: .22,
		completion: .22
	},
	"llama-3.1-8b": {
		prompt: .22,
		completion: .22
	},
	"llama-3.1-70b": {
		prompt: .72,
		completion: .72
	},
	"llama-3.1-405b": {
		prompt: 2.4,
		completion: 2.4
	},
	"llama-3.2": {
		prompt: .1,
		completion: .1
	},
	"llama-3.2-1b": {
		prompt: .1,
		completion: .1
	},
	"llama-3.2-3b": {
		prompt: .15,
		completion: .15
	},
	"llama-3.2-11b": {
		prompt: .16,
		completion: .16
	},
	"llama-3.2-90b": {
		prompt: .72,
		completion: .72
	},
	"llama-3.3": {
		prompt: 2.65,
		completion: 3.5
	},
	"llama-3.3-70b": {
		prompt: 2.65,
		completion: 3.5
	},
	"mistral-7b": {
		prompt: .15,
		completion: .2
	},
	"mistral-small": {
		prompt: .15,
		completion: .2
	},
	"mixtral-8x7b": {
		prompt: .45,
		completion: .7
	},
	"mistral-large-2402": {
		prompt: 4,
		completion: 12
	},
	"mistral-large-2407": {
		prompt: 3,
		completion: 9
	},
	"command-text": {
		prompt: 1.5,
		completion: 2
	},
	"command-light": {
		prompt: .3,
		completion: .6
	},
	"j2-mid": {
		prompt: 12.5,
		completion: 12.5
	},
	"j2-ultra": {
		prompt: 18.8,
		completion: 18.8
	},
	"jamba-instruct": {
		prompt: .5,
		completion: .7
	},
	"titan-text-lite": {
		prompt: .15,
		completion: .2
	},
	"titan-text-express": {
		prompt: .2,
		completion: .6
	},
	"titan-text-premier": {
		prompt: .5,
		completion: 1.5
	},
	"nova-micro": {
		prompt: .035,
		completion: .14
	},
	"nova-lite": {
		prompt: .06,
		completion: .24
	},
	"nova-pro": {
		prompt: .8,
		completion: 3.2
	},
	"nova-premier": {
		prompt: 2.5,
		completion: 12.5
	},
	"deepseek.r1": {
		prompt: 1.35,
		completion: 5.4
	},
	"moonshot.kimi": {
		prompt: .6,
		completion: 2.5
	},
	"moonshot.kimi-k2": {
		prompt: .6,
		completion: 2.5
	},
	"moonshot.kimi-k2.5": {
		prompt: .6,
		completion: 3
	},
	"moonshot.kimi-k2-thinking": {
		prompt: .6,
		completion: 2.5
	}
});
/**
* Mapping of model token sizes to their respective multipliers for cached input, read and write.
* The rates are 1 USD per 1M tokens.
*/
const cacheTokenValues = {
	"claude-3.7-sonnet": {
		write: 3.75,
		read: .3
	},
	"claude-3-7-sonnet": {
		write: 3.75,
		read: .3
	},
	"claude-3.5-sonnet": {
		write: 3.75,
		read: .3
	},
	"claude-3-5-sonnet": {
		write: 3.75,
		read: .3
	},
	"claude-3.5-haiku": {
		write: 1,
		read: .08
	},
	"claude-3-5-haiku": {
		write: 1,
		read: .08
	},
	"claude-3-haiku": {
		write: .3,
		read: .03
	},
	"claude-haiku-4-5": {
		write: 1.25,
		read: .1
	},
	"claude-sonnet-4": {
		write: 3.75,
		read: .3
	},
	"claude-sonnet-4-5": {
		write: 3.75,
		read: .3
	},
	"claude-sonnet-4-6": {
		write: 3.75,
		read: .3
	},
	"claude-opus-4": {
		write: 18.75,
		read: 1.5
	},
	"claude-opus-4-5": {
		write: 6.25,
		read: .5
	},
	"claude-opus-4-6": {
		write: 6.25,
		read: .5
	},
	"claude-opus-4-7": {
		write: 6.25,
		read: .5
	},
	"claude-opus-4-8": {
		write: 6.25,
		read: .5
	},
	"claude-fable-5": {
		write: 12.5,
		read: 1
	},
	"claude-mythos-5": {
		write: 12.5,
		read: 1
	},
	"gpt-4o": {
		write: 2.5,
		read: 1.25
	},
	"gpt-4o-mini": {
		write: .15,
		read: .075
	},
	"gpt-4.1": {
		write: 2,
		read: .5
	},
	"gpt-4.1-mini": {
		write: .4,
		read: .1
	},
	"gpt-4.1-nano": {
		write: .1,
		read: .025
	},
	"gpt-5": {
		write: 1.25,
		read: .125
	},
	"gpt-5.1": {
		write: 1.25,
		read: .125
	},
	"gpt-5.2": {
		write: 1.75,
		read: .175
	},
	"gpt-5.3": {
		write: 1.75,
		read: .175
	},
	"gpt-5.4": {
		write: 2.5,
		read: .25
	},
	"gpt-5.4-mini": {
		write: .75,
		read: .075
	},
	"gpt-5.4-nano": {
		write: .2,
		read: .02
	},
	"gpt-5.5": {
		write: 5,
		read: .5
	},
	"chat-latest": {
		write: 5,
		read: .5
	},
	"gpt-5-chat-latest": {
		write: 1.25,
		read: .125
	},
	"gpt-5.1-chat-latest": {
		write: 1.25,
		read: .125
	},
	"gpt-5.2-chat-latest": {
		write: 1.75,
		read: .175
	},
	"gpt-5.3-chat-latest": {
		write: 1.75,
		read: .175
	},
	"gpt-5-mini": {
		write: .25,
		read: .025
	},
	"gpt-5-nano": {
		write: .05,
		read: .005
	},
	o1: {
		write: 15,
		read: 7.5
	},
	"o1-mini": {
		write: 1.1,
		read: .55
	},
	"o1-preview": {
		write: 15,
		read: 7.5
	},
	o3: {
		write: 2,
		read: .5
	},
	"o3-mini": {
		write: 1.1,
		read: .275
	},
	"o4-mini": {
		write: 1.1,
		read: .275
	},
	deepseek: {
		write: .28,
		read: .028
	},
	"deepseek-chat": {
		write: .28,
		read: .028
	},
	"deepseek-reasoner": {
		write: .28,
		read: .028
	},
	kimi: {
		write: .6,
		read: .15
	},
	"kimi-k2": {
		write: .6,
		read: .15
	},
	"kimi-k2.5": {
		write: .6,
		read: .1
	},
	"kimi-k2-turbo": {
		write: 1.15,
		read: .15
	},
	"kimi-k2-turbo-preview": {
		write: 1.15,
		read: .15
	},
	"kimi-k2-0905": {
		write: .6,
		read: .15
	},
	"kimi-k2-0905-preview": {
		write: .6,
		read: .15
	},
	"kimi-k2-0711": {
		write: .6,
		read: .15
	},
	"kimi-k2-0711-preview": {
		write: .6,
		read: .15
	},
	"kimi-k2-thinking": {
		write: .6,
		read: .15
	},
	"kimi-k2-thinking-turbo": {
		write: 1.15,
		read: .15
	},
	"gemini-3.1": {
		write: 2,
		read: .2
	},
	"gemini-3.1-flash-lite": {
		write: .25,
		read: .025
	},
	"gemini-3.5-flash": {
		write: 1.5,
		read: .15
	}
};
/**
* Premium (tiered) pricing for models whose rates change based on prompt size.
*/
const premiumTokenValues = {
	"gemini-3.1": {
		threshold: 2e5,
		prompt: 4,
		completion: 18
	},
	"gpt-5.4": {
		threshold: 272e3,
		prompt: 5,
		completion: 22.5
	},
	"gpt-5.4-pro": {
		threshold: 272e3,
		prompt: 60,
		completion: 270
	},
	"gpt-5.5": {
		threshold: 272e3,
		prompt: 10,
		completion: 45
	},
	"gpt-5.5-pro": {
		threshold: 272e3,
		prompt: 60,
		completion: 270
	}
};
function createTxMethods(_mongoose, txDeps) {
	const { matchModelName, findMatchingPattern } = txDeps;
	/**
	* Retrieves the key associated with a given model name.
	*/
	function getValueKey(model, endpoint) {
		if (!model || typeof model !== "string") return;
		if (!endpoint || typeof endpoint === "string" && !tokenValues[endpoint]) {
			const matchedKey = findMatchingPattern(model, tokenValues);
			if (matchedKey) return matchedKey;
		}
		const modelName = matchModelName(model, endpoint);
		if (!modelName) return;
		if (modelName.includes("gpt-3.5-turbo-16k")) return "16k";
		else if (modelName.includes("gpt-3.5")) return "4k";
		else if (modelName.includes("gpt-4-vision")) return "gpt-4-1106";
		else if (modelName.includes("gpt-4-0125")) return "gpt-4-1106";
		else if (modelName.includes("gpt-4-turbo")) return "gpt-4-1106";
		else if (modelName.includes("gpt-4-32k")) return "32k";
		else if (modelName.includes("gpt-4")) return "8k";
	}
	/**
	* Checks if premium (tiered) pricing applies and returns the premium rate.
	*/
	function getPremiumRate(valueKey, tokenType, inputTokenCount) {
		if (inputTokenCount == null) return null;
		const premiumEntry = premiumTokenValues[valueKey];
		if (!premiumEntry || inputTokenCount <= premiumEntry.threshold) return null;
		return premiumEntry[tokenType] ?? null;
	}
	/**
	* Retrieves the multiplier for a given value key and token type.
	*/
	function getMultiplier({ model, valueKey, endpoint, tokenType, inputTokenCount, endpointTokenConfig }) {
		if (endpointTokenConfig && model) {
			const modelConfig = endpointTokenConfig[model];
			/** A partial override only prices the models it lists; others fall
			*  through to the standard tables so billing matches the advertised
			*  token config instead of charging defaultRate */
			if (modelConfig) return modelConfig[tokenType] ?? 6;
		}
		if (valueKey && tokenType) {
			const premiumRate = getPremiumRate(valueKey, tokenType, inputTokenCount);
			if (premiumRate != null) return premiumRate;
			return tokenValues[valueKey]?.[tokenType] ?? 6;
		}
		if (!tokenType || !model) return 1;
		valueKey = getValueKey(model, endpoint);
		if (!valueKey) return 6;
		const premiumRate = getPremiumRate(valueKey, tokenType, inputTokenCount);
		if (premiumRate != null) return premiumRate;
		return tokenValues[valueKey]?.[tokenType] ?? 6;
	}
	/**
	* Retrieves the cache multiplier for a given value key and token type.
	*/
	function getCacheMultiplier({ valueKey, cacheType, model, endpoint, endpointTokenConfig }) {
		if (endpointTokenConfig && model) {
			const modelConfig = endpointTokenConfig[model];
			/** Models absent from a partial override fall through to standard
			*  cache rates rather than reporting no cache pricing */
			if (modelConfig) return modelConfig[cacheType] ?? null;
		}
		if (valueKey && cacheType) return cacheTokenValues[valueKey]?.[cacheType] ?? null;
		if (!cacheType || !model) return null;
		valueKey = getValueKey(model, endpoint);
		if (!valueKey) return null;
		return cacheTokenValues[valueKey]?.[cacheType] ?? null;
	}
	return {
		tokenValues,
		premiumTokenValues,
		getValueKey,
		getMultiplier,
		getPremiumRate,
		getCacheMultiplier,
		defaultRate: 6,
		cacheTokenValues
	};
}
//#endregion
//#region src/methods/transaction.ts
const cancelRate = 1.15;
function createTransactionMethods(mongoose, txMethods) {
	/** Calculate and set the tokenValue for a transaction */
	function calculateTokenValue(txn) {
		const { valueKey, tokenType, model, endpointTokenConfig, inputTokenCount } = txn;
		const multiplier = Math.abs(txMethods.getMultiplier({
			valueKey,
			tokenType,
			model,
			endpointTokenConfig: endpointTokenConfig ?? void 0,
			inputTokenCount
		}));
		txn.rate = multiplier;
		txn.tokenValue = (txn.rawAmount ?? 0) * multiplier;
		if (txn.context && txn.tokenType === "completion" && txn.context === "incomplete") {
			txn.tokenValue = Math.ceil((txn.tokenValue ?? 0) * cancelRate);
			txn.rate = (txn.rate ?? 0) * cancelRate;
		}
	}
	/** Calculate token value for structured tokens */
	function calculateStructuredTokenValue(txn) {
		if (!txn.tokenType) {
			txn.tokenValue = txn.rawAmount;
			return;
		}
		const { model, endpointTokenConfig, inputTokenCount } = txn;
		const etConfig = endpointTokenConfig ?? void 0;
		if (txn.tokenType === "prompt") {
			const inputMultiplier = txMethods.getMultiplier({
				tokenType: "prompt",
				model,
				endpointTokenConfig: etConfig,
				inputTokenCount
			});
			const writeMultiplier = txMethods.getCacheMultiplier({
				cacheType: "write",
				model,
				endpointTokenConfig: etConfig
			}) ?? inputMultiplier;
			const readMultiplier = txMethods.getCacheMultiplier({
				cacheType: "read",
				model,
				endpointTokenConfig: etConfig
			}) ?? inputMultiplier;
			txn.rateDetail = {
				input: inputMultiplier,
				write: writeMultiplier,
				read: readMultiplier
			};
			const totalPromptTokens = Math.abs(txn.inputTokens ?? 0) + Math.abs(txn.writeTokens ?? 0) + Math.abs(txn.readTokens ?? 0);
			if (totalPromptTokens > 0) txn.rate = (Math.abs(inputMultiplier * (txn.inputTokens ?? 0)) + Math.abs(writeMultiplier * (txn.writeTokens ?? 0)) + Math.abs(readMultiplier * (txn.readTokens ?? 0))) / totalPromptTokens;
			else txn.rate = Math.abs(inputMultiplier);
			txn.tokenValue = -(Math.abs(txn.inputTokens ?? 0) * inputMultiplier + Math.abs(txn.writeTokens ?? 0) * writeMultiplier + Math.abs(txn.readTokens ?? 0) * readMultiplier);
			txn.rawAmount = -totalPromptTokens;
		} else if (txn.tokenType === "completion") {
			const multiplier = txMethods.getMultiplier({
				tokenType: txn.tokenType,
				model,
				endpointTokenConfig: etConfig,
				inputTokenCount
			});
			txn.rate = Math.abs(multiplier);
			txn.tokenValue = -Math.abs(txn.rawAmount ?? 0) * multiplier;
			txn.rawAmount = -Math.abs(txn.rawAmount ?? 0);
		}
		if (txn.context && txn.tokenType === "completion" && txn.context === "incomplete") {
			txn.tokenValue = Math.ceil((txn.tokenValue ?? 0) * cancelRate);
			txn.rate = (txn.rate ?? 0) * cancelRate;
			if (txn.rateDetail) txn.rateDetail = Object.fromEntries(Object.entries(txn.rateDetail).map(([k, v]) => [k, v * cancelRate]));
		}
	}
	/**
	* Updates a user's token balance using optimistic concurrency control.
	* Always returns an IBalance or throws after exhausting retries.
	*/
	async function updateBalance({ user, incrementValue, setValues }) {
		const Balance = mongoose.models.Balance;
		const maxRetries = 10;
		let delay = 50;
		let lastError = null;
		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			let currentBalanceDoc;
			try {
				currentBalanceDoc = await Balance.findOne({ user }).lean();
				const currentCredits = currentBalanceDoc ? currentBalanceDoc.tokenCredits : 0;
				const potentialNewCredits = currentCredits + incrementValue;
				const updatePayload = { $set: {
					tokenCredits: Math.max(0, potentialNewCredits),
					...setValues ?? {}
				} };
				let updatedBalance = null;
				if (currentBalanceDoc) {
					updatedBalance = await Balance.findOneAndUpdate({
						user,
						tokenCredits: currentCredits
					}, updatePayload, { new: true }).lean();
					if (updatedBalance) return updatedBalance;
					lastError = /* @__PURE__ */ new Error(`Concurrency conflict for user ${user} on attempt ${attempt}.`);
				} else try {
					updatedBalance = await Balance.findOneAndUpdate({ user }, updatePayload, {
						upsert: true,
						new: true
					}).lean();
					if (updatedBalance) return updatedBalance;
					lastError = /* @__PURE__ */ new Error(`Upsert race condition suspected for user ${user} on attempt ${attempt}.`);
				} catch (error) {
					if (error instanceof Error && "code" in error && error.code === 11e3) lastError = error;
					else throw error;
				}
			} catch (error) {
				logger.error(`[updateBalance] Error during attempt ${attempt} for user ${user}:`, error);
				lastError = error instanceof Error ? error : new Error(String(error));
			}
			if (attempt < maxRetries) {
				const jitter = Math.random() * delay * .5;
				await new Promise((resolve) => setTimeout(resolve, delay + jitter));
				delay = Math.min(delay * 2, 2e3);
			}
		}
		logger.error(`[updateBalance] Failed to update balance for user ${user} after ${maxRetries} attempts.`);
		throw lastError ?? /* @__PURE__ */ new Error(`Failed to update balance for user ${user} after maximum retries due to persistent conflicts.`);
	}
	/**
	* Creates an auto-refill transaction that also updates balance.
	*/
	async function createAutoRefillTransaction(txData) {
		if (txData.rawAmount != null && isNaN(txData.rawAmount)) return;
		const Transaction = mongoose.models.Transaction;
		const transaction = new Transaction(txData);
		transaction.endpointTokenConfig = txData.endpointTokenConfig;
		transaction.inputTokenCount = txData.inputTokenCount;
		calculateTokenValue(transaction);
		await transaction.save();
		const balanceResponse = await updateBalance({
			user: transaction.user,
			incrementValue: txData.rawAmount ?? 0,
			setValues: { lastRefill: /* @__PURE__ */ new Date() }
		});
		const result = {
			rate: transaction.rate,
			user: transaction.user.toString(),
			balance: balanceResponse.tokenCredits,
			transaction
		};
		logger.debug("[Balance.check] Auto-refill performed", result);
		return result;
	}
	/**
	* Creates a transaction and updates the balance.
	*/
	async function createTransaction(_txData) {
		const { balance, transactions, ...txData } = _txData;
		if (txData.rawAmount != null && isNaN(txData.rawAmount)) return;
		if (transactions?.enabled === false) return;
		const Transaction = mongoose.models.Transaction;
		const transaction = new Transaction(txData);
		transaction.endpointTokenConfig = txData.endpointTokenConfig;
		transaction.inputTokenCount = txData.inputTokenCount;
		calculateTokenValue(transaction);
		await transaction.save();
		if (!balance?.enabled) return;
		const incrementValue = transaction.tokenValue;
		const balanceResponse = await updateBalance({
			user: transaction.user,
			incrementValue
		});
		return {
			rate: transaction.rate,
			user: transaction.user.toString(),
			balance: balanceResponse.tokenCredits,
			[transaction.tokenType]: incrementValue
		};
	}
	/**
	* Creates a structured transaction and updates the balance.
	*/
	async function createStructuredTransaction(_txData) {
		const { balance, transactions, ...txData } = _txData;
		if (transactions?.enabled === false) return;
		const Transaction = mongoose.models.Transaction;
		const transaction = new Transaction(txData);
		transaction.endpointTokenConfig = txData.endpointTokenConfig;
		transaction.inputTokenCount = txData.inputTokenCount;
		calculateStructuredTokenValue(transaction);
		await transaction.save();
		if (!balance?.enabled) return;
		const incrementValue = transaction.tokenValue;
		const balanceResponse = await updateBalance({
			user: transaction.user,
			incrementValue
		});
		return {
			rate: transaction.rate,
			user: transaction.user.toString(),
			balance: balanceResponse.tokenCredits,
			[transaction.tokenType]: incrementValue
		};
	}
	/**
	* Queries and retrieves transactions based on a given filter.
	*/
	async function getTransactions(filter) {
		try {
			return await mongoose.models.Transaction.find(filter).lean();
		} catch (error) {
			logger.error("Error querying transactions:", error);
			throw error;
		}
	}
	/** Retrieves a user's balance record. */
	async function findBalanceByUser(user) {
		return mongoose.models.Balance.findOne({ user }).lean();
	}
	/** Upserts balance fields for a user. */
	async function upsertBalanceFields(user, fields) {
		return mongoose.models.Balance.findOneAndUpdate({ user }, { $set: fields }, {
			upsert: true,
			new: true
		}).lean();
	}
	/** Deletes transactions matching a filter. */
	async function deleteTransactions(filter) {
		return mongoose.models.Transaction.deleteMany(filter);
	}
	/** Deletes balance records matching a filter. */
	async function deleteBalances(filter) {
		return mongoose.models.Balance.deleteMany(filter);
	}
	async function bulkInsertTransactions(docs) {
		if (!docs.length) return;
		try {
			await mongoose.models.Transaction.insertMany(docs);
		} catch (error) {
			logger.error("[bulkInsertTransactions] Error inserting transaction docs:", error);
			throw error;
		}
	}
	return {
		updateBalance,
		bulkInsertTransactions,
		findBalanceByUser,
		upsertBalanceFields,
		getTransactions,
		deleteTransactions,
		deleteBalances,
		createTransaction,
		createAutoRefillTransaction,
		createStructuredTransaction
	};
}
//#endregion
//#region src/methods/spendTokens.ts
function createSpendTokensMethods(_mongoose, transactionMethods) {
	/**
	* Creates up to two transactions to record the spending of tokens.
	*/
	async function spendTokens(txData, tokenUsage) {
		const { promptTokens, completionTokens } = tokenUsage;
		logger.debug(`[spendTokens] conversationId: ${txData.conversationId}${txData?.context ? ` | Context: ${txData?.context}` : ""} | Token usage: `, {
			promptTokens,
			completionTokens
		});
		let prompt, completion;
		const normalizedPromptTokens = Math.max(promptTokens ?? 0, 0);
		try {
			if (promptTokens !== void 0) prompt = await transactionMethods.createTransaction({
				...txData,
				tokenType: "prompt",
				rawAmount: promptTokens === 0 ? 0 : -normalizedPromptTokens,
				inputTokenCount: normalizedPromptTokens
			});
			if (completionTokens !== void 0) completion = await transactionMethods.createTransaction({
				...txData,
				tokenType: "completion",
				rawAmount: completionTokens === 0 ? 0 : -Math.max(completionTokens, 0),
				inputTokenCount: normalizedPromptTokens
			});
			if (prompt || completion) logger.debug("[spendTokens] Transaction data record against balance:", {
				user: txData.user,
				prompt: prompt?.prompt,
				promptRate: prompt?.rate,
				completion: completion?.completion,
				completionRate: completion?.rate,
				balance: completion?.balance ?? prompt?.balance
			});
			else logger.debug("[spendTokens] No transactions incurred against balance");
		} catch (err) {
			logger.error("[spendTokens]", err);
		}
	}
	/**
	* Creates transactions to record the spending of structured tokens.
	*/
	async function spendStructuredTokens(txData, tokenUsage) {
		const { promptTokens, completionTokens } = tokenUsage;
		logger.debug(`[spendStructuredTokens] conversationId: ${txData.conversationId}${txData?.context ? ` | Context: ${txData?.context}` : ""} | Token usage: `, {
			promptTokens,
			completionTokens
		});
		let prompt, completion;
		try {
			if (promptTokens) {
				const input = Math.max(promptTokens.input ?? 0, 0);
				const write = Math.max(promptTokens.write ?? 0, 0);
				const read = Math.max(promptTokens.read ?? 0, 0);
				const totalInputTokens = input + write + read;
				prompt = await transactionMethods.createStructuredTransaction({
					...txData,
					tokenType: "prompt",
					inputTokens: -input,
					writeTokens: -write,
					readTokens: -read,
					inputTokenCount: totalInputTokens
				});
			}
			if (completionTokens) {
				const totalInputTokens = promptTokens ? Math.max(promptTokens.input ?? 0, 0) + Math.max(promptTokens.write ?? 0, 0) + Math.max(promptTokens.read ?? 0, 0) : void 0;
				completion = await transactionMethods.createTransaction({
					...txData,
					tokenType: "completion",
					rawAmount: -Math.max(completionTokens, 0),
					inputTokenCount: totalInputTokens
				});
			}
			if (prompt || completion) logger.debug("[spendStructuredTokens] Transaction data record against balance:", {
				user: txData.user,
				prompt: prompt?.prompt,
				promptRate: prompt?.rate,
				completion: completion?.completion,
				completionRate: completion?.rate,
				balance: completion?.balance ?? prompt?.balance
			});
			else logger.debug("[spendStructuredTokens] No transactions incurred against balance");
		} catch (err) {
			logger.error("[spendStructuredTokens]", err);
		}
		return {
			prompt,
			completion
		};
	}
	return {
		spendTokens,
		spendStructuredTokens
	};
}
//#endregion
//#region src/methods/prompt.ts
function createPromptMethods(mongoose, deps) {
	const { getSoleOwnedResourceIds } = deps;
	const { ObjectId } = mongoose.Types;
	/**
	* Batch-fetches production prompts for an array of prompt groups
	* and attaches them as `productionPrompt` field.
	*/
	async function attachProductionPrompts(groups) {
		const Prompt = mongoose.models.Prompt;
		const uniqueIds = [...new Set(groups.map((g) => g.productionId?.toString()).filter(Boolean))];
		if (uniqueIds.length === 0) return groups.map((g) => ({
			...g,
			productionPrompt: null
		}));
		const prompts = await Prompt.find({ _id: { $in: uniqueIds } }).select("prompt").lean();
		const promptMap = new Map(prompts.map((p) => [p._id.toString(), p]));
		return groups.map((g) => ({
			...g,
			productionPrompt: g.productionId ? promptMap.get(g.productionId.toString()) ?? null : null
		}));
	}
	/**
	* Get all prompt groups with filters (no pagination).
	*/
	async function getAllPromptGroups(filter) {
		try {
			const PromptGroup = mongoose.models.PromptGroup;
			const { name, ...query } = filter;
			if (name) query.name = new RegExp(escapeRegExp(name), "i");
			if (!query.category) delete query.category;
			else if (query.category === SystemCategories.MY_PROMPTS) delete query.category;
			else if (query.category === SystemCategories.NO_CATEGORY) query.category = "";
			else if (query.category === SystemCategories.SHARED_PROMPTS) delete query.category;
			return await attachProductionPrompts(await PromptGroup.find(query).sort({
				numberOfGenerations: -1,
				updatedAt: -1,
				_id: 1
			}).select("name numberOfGenerations oneliner category author authorName createdAt updatedAt command productionId").lean());
		} catch (error) {
			logger.error("Error getting all prompt groups", error);
			return { message: "Error getting all prompt groups" };
		}
	}
	/**
	* Get prompt groups with pagination and filters.
	*/
	async function getPromptGroups(filter) {
		try {
			const PromptGroup = mongoose.models.PromptGroup;
			const { pageNumber = 1, pageSize = 10, name, ...query } = filter;
			const validatedPageNumber = Math.max(parseInt(String(pageNumber), 10), 1);
			const validatedPageSize = Math.max(parseInt(String(pageSize), 10), 1);
			if (name) query.name = new RegExp(escapeRegExp(name), "i");
			if (!query.category) delete query.category;
			else if (query.category === SystemCategories.MY_PROMPTS) delete query.category;
			else if (query.category === SystemCategories.NO_CATEGORY) query.category = "";
			else if (query.category === SystemCategories.SHARED_PROMPTS) delete query.category;
			const skip = (validatedPageNumber - 1) * validatedPageSize;
			const limit = validatedPageSize;
			const [groups, totalPromptGroups] = await Promise.all([PromptGroup.find(query).sort({
				numberOfGenerations: -1,
				updatedAt: -1,
				_id: 1
			}).skip(skip).limit(limit).select("name numberOfGenerations oneliner category productionId author authorName createdAt updatedAt").lean(), PromptGroup.countDocuments(query)]);
			return {
				promptGroups: await attachProductionPrompts(groups),
				pageNumber: validatedPageNumber.toString(),
				pageSize: validatedPageSize.toString(),
				pages: Math.ceil(totalPromptGroups / validatedPageSize).toString()
			};
		} catch (error) {
			logger.error("Error getting prompt groups", error);
			return { message: "Error getting prompt groups" };
		}
	}
	/**
	* Delete a prompt group and its prompts, cleaning up ACL permissions.
	*
	* **Authorization is enforced upstream.** This method performs no ownership
	* check — it deletes any group by ID. Callers must gate access via
	* `canAccessPromptGroupResource` middleware before invoking this.
	*/
	async function deletePromptGroup({ _id }) {
		const PromptGroup = mongoose.models.PromptGroup;
		const Prompt = mongoose.models.Prompt;
		const query = { _id };
		const groupQuery = { groupId: new ObjectId(_id) };
		const response = await PromptGroup.deleteOne(query);
		if (!response || response.deletedCount === 0) throw new Error("Prompt group not found");
		await Prompt.deleteMany(groupQuery);
		try {
			await deps.removeAllPermissions({
				resourceType: ResourceType.PROMPTGROUP,
				resourceId: _id
			});
		} catch (error) {
			logger.error("Error removing promptGroup permissions:", error);
		}
		return { message: "Prompt group deleted successfully" };
	}
	/**
	* Get prompt groups by accessible IDs with optional cursor-based pagination.
	*/
	async function getListPromptGroupsByAccess({ accessibleIds = [], otherParams = {}, limit = null, after = null }) {
		const PromptGroup = mongoose.models.PromptGroup;
		const isPaginated = limit !== null && limit !== void 0;
		const normalizedLimit = isPaginated ? Math.min(Math.max(1, parseInt(String(limit)) || 20), 100) : null;
		const baseQuery = {
			...otherParams,
			_id: { $in: accessibleIds }
		};
		let matchQuery = baseQuery;
		if (after && typeof after === "string" && after !== "undefined" && after !== "null") try {
			const { numberOfGenerations = 0, updatedAt, _id } = JSON.parse(Buffer.from(after, "base64").toString("utf8"));
			if (typeof numberOfGenerations !== "number" || !Number.isFinite(numberOfGenerations) || typeof updatedAt !== "string" || Number.isNaN(new Date(updatedAt).getTime()) || typeof _id !== "string" || !isValidObjectIdString(_id)) logger.warn("[getListPromptGroupsByAccess] Invalid cursor fields, skipping cursor condition");
			else {
				const cursorCondition = { $or: [
					{ numberOfGenerations: { $lt: numberOfGenerations } },
					{
						numberOfGenerations,
						updatedAt: { $lt: new Date(updatedAt) }
					},
					{
						numberOfGenerations,
						updatedAt: new Date(updatedAt),
						_id: { $gt: new ObjectId(_id) }
					}
				] };
				matchQuery = Object.keys(baseQuery).length > 0 ? { $and: [baseQuery, cursorCondition] } : cursorCondition;
			}
		} catch (error) {
			logger.warn("Invalid cursor:", error.message);
		}
		const findQuery = PromptGroup.find(matchQuery).sort({
			numberOfGenerations: -1,
			updatedAt: -1,
			_id: 1
		}).select("name numberOfGenerations oneliner category productionId author authorName createdAt updatedAt");
		if (isPaginated && normalizedLimit) findQuery.limit(normalizedLimit + 1);
		const promptGroups = await attachProductionPrompts(await findQuery.lean());
		const hasMore = isPaginated && normalizedLimit ? promptGroups.length > normalizedLimit : false;
		const data = (isPaginated && normalizedLimit ? promptGroups.slice(0, normalizedLimit) : promptGroups).map((group) => {
			if (group.author) group.author = group.author.toString();
			return group;
		});
		let nextCursor = null;
		if (isPaginated && hasMore && data.length > 0 && normalizedLimit) {
			const lastGroup = promptGroups[normalizedLimit - 1];
			nextCursor = Buffer.from(JSON.stringify({
				numberOfGenerations: lastGroup.numberOfGenerations,
				updatedAt: lastGroup.updatedAt.toISOString(),
				_id: lastGroup._id.toString()
			})).toString("base64");
		}
		return {
			object: "list",
			data,
			first_id: data.length > 0 ? data[0]._id.toString() : null,
			last_id: data.length > 0 ? data[data.length - 1]._id.toString() : null,
			has_more: hasMore,
			after: nextCursor
		};
	}
	/**
	* Increment the numberOfGenerations counter for a prompt group.
	*/
	async function incrementPromptGroupUsage(groupId) {
		if (!isValidObjectIdString(groupId)) throw new Error("Invalid groupId");
		const result = await mongoose.models.PromptGroup.findByIdAndUpdate(groupId, { $inc: { numberOfGenerations: 1 } }, {
			new: true,
			select: "numberOfGenerations"
		}).lean();
		if (!result) throw new Error("Prompt group not found");
		return { numberOfGenerations: result.numberOfGenerations };
	}
	/**
	* Create a prompt and its respective group.
	*/
	async function createPromptGroup(saveData) {
		try {
			const PromptGroup = mongoose.models.PromptGroup;
			const Prompt = mongoose.models.Prompt;
			const { prompt, group, author, authorName } = saveData;
			let newPromptGroup = await PromptGroup.findOneAndUpdate({
				...group,
				author,
				authorName,
				productionId: null
			}, { $setOnInsert: {
				...group,
				author,
				authorName,
				productionId: null
			} }, {
				new: true,
				upsert: true
			}).lean().select("-__v").exec();
			const newPrompt = await Prompt.findOneAndUpdate({
				...prompt,
				author,
				groupId: newPromptGroup._id
			}, { $setOnInsert: {
				...prompt,
				author,
				groupId: newPromptGroup._id
			} }, {
				new: true,
				upsert: true
			}).lean().select("-__v").exec();
			newPromptGroup = await PromptGroup.findByIdAndUpdate(newPromptGroup._id, { productionId: newPrompt._id }, { new: true }).lean().select("-__v").exec();
			return {
				prompt: newPrompt,
				group: {
					...newPromptGroup,
					productionPrompt: { prompt: newPrompt.prompt }
				}
			};
		} catch (error) {
			logger.error("Error saving prompt group", error);
			throw new Error("Error saving prompt group");
		}
	}
	/**
	* Save a prompt.
	*/
	async function savePrompt(saveData) {
		try {
			const Prompt = mongoose.models.Prompt;
			const { prompt, author } = saveData;
			const newPromptData = {
				...prompt,
				author
			};
			let newPrompt;
			try {
				newPrompt = await Prompt.create(newPromptData);
			} catch (error) {
				if (error?.message?.includes("groupId_1_version_1")) await Prompt.db.collection("prompts").dropIndex("groupId_1_version_1");
				else throw error;
				newPrompt = await Prompt.create(newPromptData);
			}
			return { prompt: newPrompt };
		} catch (error) {
			logger.error("Error saving prompt", error);
			return { message: "Error saving prompt" };
		}
	}
	/**
	* Get prompts by filter.
	*/
	async function getPrompts(filter) {
		try {
			return await mongoose.models.Prompt.find(filter).sort({ createdAt: -1 }).lean();
		} catch (error) {
			logger.error("Error getting prompts", error);
			return { message: "Error getting prompts" };
		}
	}
	/**
	* Get a single prompt by filter.
	*/
	async function getPrompt(filter) {
		try {
			const Prompt = mongoose.models.Prompt;
			if (filter.groupId) filter.groupId = new ObjectId(filter.groupId);
			return await Prompt.findOne(filter).lean();
		} catch (error) {
			logger.error("Error getting prompt", error);
			return { message: "Error getting prompt" };
		}
	}
	/**
	* Get random prompt groups from distinct categories.
	*/
	async function getRandomPromptGroups(filter) {
		try {
			const PromptGroup = mongoose.models.PromptGroup;
			const categories = await PromptGroup.distinct("category", { category: { $ne: "" } });
			for (let i = categories.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[categories[i], categories[j]] = [categories[j], categories[i]];
			}
			const skip = +filter.skip;
			const limit = +filter.limit;
			const selectedCategories = categories.slice(skip, skip + limit);
			if (selectedCategories.length === 0) return { prompts: [] };
			const groups = await PromptGroup.find({ category: { $in: selectedCategories } }).lean();
			const groupByCategory = /* @__PURE__ */ new Map();
			for (const group of groups) if (!groupByCategory.has(group.category)) groupByCategory.set(group.category, group);
			return { prompts: selectedCategories.map((cat) => groupByCategory.get(cat)).filter(Boolean) };
		} catch (error) {
			logger.error("Error getting prompt groups", error);
			return { message: "Error getting prompt groups" };
		}
	}
	/**
	* Get prompt groups with populated prompts.
	*/
	async function getPromptGroupsWithPrompts(filter) {
		try {
			return await mongoose.models.PromptGroup.findOne(filter).populate({
				path: "prompts",
				select: "-_id -__v -user"
			}).select("-_id -__v -user").lean();
		} catch (error) {
			logger.error("Error getting prompt groups", error);
			return { message: "Error getting prompt groups" };
		}
	}
	/**
	* Get a single prompt group by filter, with productionPrompt populated via $lookup.
	*/
	async function getPromptGroup(filter) {
		try {
			const PromptGroup = mongoose.models.PromptGroup;
			const matchFilter = { ...filter };
			if (typeof matchFilter._id === "string") matchFilter._id = new ObjectId(matchFilter._id);
			const tenantId = getTenantId();
			const useTenantFilter = tenantId && tenantId !== "__SYSTEM__";
			const group = (await PromptGroup.aggregate([
				{ $match: matchFilter },
				{ $lookup: {
					from: "prompts",
					localField: "productionId",
					foreignField: "_id",
					as: "productionPrompt"
				} },
				{ $unwind: {
					path: "$productionPrompt",
					preserveNullAndEmptyArrays: true
				} }
			]))[0] || null;
			if (group?.productionPrompt && useTenantFilter && group.productionPrompt.tenantId !== tenantId) group.productionPrompt = null;
			if (group?.author) group.author = group.author.toString();
			return group;
		} catch (error) {
			logger.error("Error getting prompt group", error);
			return null;
		}
	}
	/**
	* Returns the _id values of all prompt groups authored by the given user.
	* Used by the "Shared Prompts" and "My Prompts" filters to distinguish
	* owned prompts from prompts shared with the user.
	*/
	async function getOwnedPromptGroupIds(author) {
		try {
			const PromptGroup = mongoose.models.PromptGroup;
			if (!author || !ObjectId.isValid(author)) {
				logger.warn("getOwnedPromptGroupIds called with invalid author", { author });
				return [];
			}
			return (await PromptGroup.find({ author: new ObjectId(author) }, { _id: 1 }).lean()).map((g) => g._id);
		} catch (error) {
			logger.error("Error getting owned prompt group IDs", error);
			return [];
		}
	}
	/**
	* Delete a prompt, potentially removing the group if it's the last prompt.
	*
	* **Authorization is enforced upstream.** This method performs no ownership
	* check — it deletes any prompt by ID. Callers must gate access via
	* `canAccessPromptViaGroup` middleware before invoking this.
	*/
	async function deletePrompt({ promptId, groupId }) {
		const Prompt = mongoose.models.Prompt;
		const PromptGroup = mongoose.models.PromptGroup;
		const query = {
			_id: promptId,
			groupId
		};
		const { deletedCount } = await Prompt.deleteOne(query);
		if (deletedCount === 0) throw new Error("Failed to delete the prompt");
		const remainingPrompts = await Prompt.find({ groupId }).select("_id").sort({ createdAt: 1 }).lean();
		if (remainingPrompts.length === 0) {
			try {
				await deps.removeAllPermissions({
					resourceType: ResourceType.PROMPTGROUP,
					resourceId: groupId
				});
			} catch (error) {
				logger.error("Error removing promptGroup permissions:", error);
			}
			await PromptGroup.deleteOne({ _id: groupId });
			return {
				prompt: "Prompt deleted successfully",
				promptGroup: {
					message: "Prompt group deleted successfully",
					id: groupId
				}
			};
		} else {
			const promptGroup = await PromptGroup.findById(groupId).lean();
			if (promptGroup && promptGroup.productionId?.toString() === promptId.toString()) await PromptGroup.updateOne({ _id: groupId }, { productionId: remainingPrompts[remainingPrompts.length - 1]._id });
			return { prompt: "Prompt deleted successfully" };
		}
	}
	/**
	* Delete all prompts and prompt groups created by a specific user.
	*/
	/**
	* Deletes prompt groups solely owned by the user and cleans up their prompts/ACLs.
	* Groups with other owners are left intact; the caller is responsible for
	* removing the user's own ACL principal entries separately.
	*
	* Also handles legacy (pre-ACL) prompt groups that only have the author field set,
	* ensuring they are not orphaned if the permission migration has not been run.
	*/
	async function deleteUserPrompts(userId) {
		try {
			const PromptGroup = mongoose.models.PromptGroup;
			const Prompt = mongoose.models.Prompt;
			const AclEntry = mongoose.models.AclEntry;
			const userObjectId = new ObjectId(userId);
			const soleOwnedIds = await getSoleOwnedResourceIds(userObjectId, ResourceType.PROMPTGROUP);
			const authoredGroupIds = (await PromptGroup.find({ author: userObjectId }).select("_id").lean()).map((g) => g._id);
			const migratedEntries = authoredGroupIds.length > 0 ? await AclEntry.find({
				resourceType: ResourceType.PROMPTGROUP,
				resourceId: { $in: authoredGroupIds }
			}).select("resourceId").lean() : [];
			const migratedIds = new Set(migratedEntries.map((e) => e.resourceId.toString()));
			const legacyGroupIds = authoredGroupIds.filter((id) => !migratedIds.has(id.toString()));
			const allGroupIdsToDelete = [...soleOwnedIds, ...legacyGroupIds];
			if (allGroupIdsToDelete.length === 0) return;
			await AclEntry.deleteMany({
				resourceType: ResourceType.PROMPTGROUP,
				resourceId: { $in: allGroupIdsToDelete }
			});
			await PromptGroup.deleteMany({ _id: { $in: allGroupIdsToDelete } });
			await Prompt.deleteMany({ groupId: { $in: allGroupIdsToDelete } });
		} catch (error) {
			logger.error("[deleteUserPrompts] General error:", error);
		}
	}
	/**
	* Update a prompt group.
	*/
	async function updatePromptGroup(filter, data) {
		try {
			const PromptGroup = mongoose.models.PromptGroup;
			const updateOps = {};
			const updateData = {
				...data,
				...updateOps
			};
			const updatedDoc = await PromptGroup.findOneAndUpdate(filter, updateData, {
				new: true,
				upsert: false
			});
			if (!updatedDoc) throw new Error("Prompt group not found");
			return updatedDoc;
		} catch (error) {
			logger.error("Error updating prompt group", error);
			return { message: "Error updating prompt group" };
		}
	}
	/**
	* Make a prompt the production prompt for its group.
	*/
	async function makePromptProduction(promptId) {
		try {
			const Prompt = mongoose.models.Prompt;
			const PromptGroup = mongoose.models.PromptGroup;
			const prompt = await Prompt.findById(promptId).lean();
			if (!prompt) throw new Error("Prompt not found");
			await PromptGroup.findByIdAndUpdate(prompt.groupId, { productionId: prompt._id }, { new: true }).lean().exec();
			return { message: "Prompt production made successfully" };
		} catch (error) {
			logger.error("Error making prompt production", error);
			return { message: "Error making prompt production" };
		}
	}
	/**
	* Update prompt labels.
	*/
	async function updatePromptLabels(_id, labels) {
		try {
			if ((await mongoose.models.Prompt.updateOne({ _id }, { $set: { labels } })).matchedCount === 0) return { message: "Prompt not found" };
			return { message: "Prompt labels updated successfully" };
		} catch (error) {
			logger.error("Error updating prompt labels", error);
			return { message: "Error updating prompt labels" };
		}
	}
	return {
		getPromptGroups,
		deletePromptGroup,
		getAllPromptGroups,
		getListPromptGroupsByAccess,
		incrementPromptGroupUsage,
		createPromptGroup,
		savePrompt,
		getPrompts,
		getPrompt,
		getRandomPromptGroups,
		getPromptGroupsWithPrompts,
		getPromptGroup,
		getOwnedPromptGroupIds,
		deletePrompt,
		deleteUserPrompts,
		updatePromptGroup,
		makePromptProduction,
		updatePromptLabels
	};
}
//#endregion
//#region src/methods/skill.ts
/** Partition an issue list into blocking errors and non-blocking warnings. */
function partitionIssues(issues) {
	const errors = [];
	const warnings = [];
	for (const issue of issues) if (issue.severity === "warning") warnings.push(issue);
	else errors.push(issue);
	return {
		errors,
		warnings
	};
}
const SKILL_NAME_MAX = SKILL_NAME_MAX_LENGTH;
const SKILL_DESCRIPTION_MAX = SKILL_DESCRIPTION_MAX_LENGTH;
const SKILL_DESCRIPTION_SHORT_THRESHOLD$1 = SKILL_DESCRIPTION_SHORT_THRESHOLD;
const SKILL_DISPLAY_TITLE_MAX = SKILL_DISPLAY_TITLE_MAX_LENGTH;
const SKILL_BODY_MAX = SKILL_BODY_MAX_LENGTH;
const SKILL_FILE_PATH_MAX = 500;
const SKILL_NAME_PATTERN$1 = SKILL_NAME_PATTERN;
const RELATIVE_PATH_CHARS = /^[a-zA-Z0-9._\-/]+$/;
/**
* Brand namespaces reserved for Anthropic-published skills and first-party
* bundles. Matched as prefixes, so `anthropic-helper` is rejected but
* `research-anthropic-helper` is fine.
*/
const RESERVED_NAME_PREFIXES = ["anthropic-", "claude-"];
/**
* Slash-command names that collide with LibreChat / Claude Code CLI commands.
* A skill with one of these names would shadow a real command in any
* slash-command UI. Matched exactly (not as prefix).
*/
const RESERVED_NAME_WORDS = new Set([
	"help",
	"clear",
	"compact",
	"model",
	"exit",
	"quit",
	"settings",
	"anthropic",
	"claude"
]);
function validateSkillName(name) {
	const issues = [];
	if (typeof name !== "string" || name.length === 0) {
		issues.push({
			field: "name",
			code: "REQUIRED",
			message: "Name is required"
		});
		return issues;
	}
	if (name.length > SKILL_NAME_MAX) issues.push({
		field: "name",
		code: "TOO_LONG",
		message: `Name must be ${SKILL_NAME_MAX} characters or less`
	});
	if (!SKILL_NAME_PATTERN$1.test(name)) issues.push({
		field: "name",
		code: "INVALID_FORMAT",
		message: "Name must be kebab-case: start with a lowercase letter or digit and contain only lowercase letters, digits, and hyphens"
	});
	const lowered = name.toLowerCase();
	if (RESERVED_NAME_PREFIXES.some((prefix) => lowered.startsWith(prefix))) issues.push({
		field: "name",
		code: "RESERVED_PREFIX",
		message: `Name cannot start with ${RESERVED_NAME_PREFIXES.map((p) => `"${p}"`).join(" or ")}`
	});
	if (RESERVED_NAME_WORDS.has(lowered)) issues.push({
		field: "name",
		code: "RESERVED_WORD",
		message: `"${name}" is a reserved name`
	});
	return issues;
}
function validateSkillDescription(description) {
	const issues = [];
	if (typeof description !== "string" || description.trim().length === 0) {
		issues.push({
			field: "description",
			code: "REQUIRED",
			message: "Description is required"
		});
		return issues;
	}
	if (description.length > SKILL_DESCRIPTION_MAX) issues.push({
		field: "description",
		code: "TOO_LONG",
		message: `Description must be ${SKILL_DESCRIPTION_MAX} characters or less`
	});
	if (description.trim().length < SKILL_DESCRIPTION_SHORT_THRESHOLD$1) issues.push({
		field: "description",
		code: "TOO_SHORT",
		severity: "warning",
		message: "Short descriptions may cause Claude to miss triggering opportunities — aim for a concrete \"when to use this skill\" sentence."
	});
	return issues;
}
function validateSkillBody(body) {
	const issues = [];
	if (body !== void 0 && typeof body !== "string") {
		issues.push({
			field: "body",
			code: "INVALID_TYPE",
			message: "Body must be a string"
		});
		return issues;
	}
	if (typeof body === "string" && body.length > SKILL_BODY_MAX) issues.push({
		field: "body",
		code: "TOO_LONG",
		message: `Body must be ${SKILL_BODY_MAX} characters or less`
	});
	return issues;
}
function validateSkillDisplayTitle(displayTitle) {
	if (displayTitle === void 0 || displayTitle === null) return [];
	if (typeof displayTitle !== "string") return [{
		field: "displayTitle",
		code: "INVALID_TYPE",
		message: "Display title must be a string"
	}];
	if (displayTitle.length > SKILL_DISPLAY_TITLE_MAX) return [{
		field: "displayTitle",
		code: "TOO_LONG",
		message: `Display title must be ${SKILL_DISPLAY_TITLE_MAX} characters or less`
	}];
	return [];
}
/**
* Validate the top-level `alwaysApply` column input. Mirrors the boolean
* check on `frontmatter['always-apply']` so a loosely-typed API caller
* sending `{"alwaysApply": "false"}` (string) gets a clean 400 at the
* validation boundary instead of relying on Mongoose casting quirks to
* coerce the value.
*
* `undefined` is the only pass-through value (meaning "don't touch this
* field"). `null` is rejected: PATCH forwards any non-`undefined` value
* straight into `$set`, so a `null` payload would persist `null` in a
* boolean column, leaving the skill in a state that is neither "on" nor
* "off" while `listAlwaysApplySkills` only matches `true`.
*/
function validateAlwaysApply(alwaysApply) {
	if (alwaysApply === void 0) return [];
	if (typeof alwaysApply !== "boolean") return [{
		field: "alwaysApply",
		code: "INVALID_TYPE",
		message: "alwaysApply must be a boolean"
	}];
	return [];
}
/**
* Known fields allowed inside a skill's YAML frontmatter. Anything else is
* rejected in strict mode. The list is derived from Anthropic's Agent Skills
* spec plus the fields LibreChat needs to pass through (`name`/`description`
* are duplicated from the top-level columns because real `SKILL.md` files
* include them in their frontmatter block).
*/
const ALLOWED_FRONTMATTER_KEYS = new Set([
	"name",
	"description",
	"when-to-use",
	"allowed-tools",
	"arguments",
	"argument-hint",
	"user-invocable",
	"disable-model-invocation",
	"always-apply",
	"alwaysApply",
	"model",
	"effort",
	"context",
	"agent",
	"paths",
	"shell",
	"hooks",
	"version",
	"license",
	"metadata"
]);
const FRONTMATTER_MAX_STRING = 2e3;
const FRONTMATTER_MAX_ARRAY = 100;
const FRONTMATTER_MAX_DEPTH = 4;
const FRONTMATTER_KIND = {
	name: "string",
	description: "string",
	"when-to-use": "string",
	"allowed-tools": ["string", "stringArray"],
	arguments: ["string", "stringArray"],
	"argument-hint": "string",
	"user-invocable": "boolean",
	"disable-model-invocation": "boolean",
	"always-apply": "boolean",
	alwaysApply: "boolean",
	model: "string",
	effort: ["string", "number"],
	context: "string",
	agent: "string",
	paths: ["string", "stringArray"],
	shell: "string",
	version: "string",
	license: "string"
};
function isPlainObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStringArray(value) {
	return Array.isArray(value) && value.length <= FRONTMATTER_MAX_ARRAY && value.every((v) => typeof v === "string" && v.length <= FRONTMATTER_MAX_STRING);
}
function matchesKind(value, kind) {
	if (kind === "string") return typeof value === "string" && value.length <= FRONTMATTER_MAX_STRING;
	if (kind === "number") return typeof value === "number" && Number.isFinite(value);
	if (kind === "boolean") return typeof value === "boolean";
	return isStringArray(value);
}
/**
* Shallow structural sanity check for `hooks`/`metadata` objects. We don't
* know their full schema yet, so we just verify they are plain objects with
* JSON-serializable leaf values up to a max depth — enough to block pathological
* payloads without constraining legitimate frontmatter extensions.
*/
function isJsonSafe(value, depth) {
	if (depth > FRONTMATTER_MAX_DEPTH) return false;
	if (value === null) return true;
	const t = typeof value;
	if (t === "string") return value.length <= FRONTMATTER_MAX_STRING;
	if (t === "number") return Number.isFinite(value);
	if (t === "boolean") return true;
	if (Array.isArray(value)) {
		if (value.length > FRONTMATTER_MAX_ARRAY) return false;
		return value.every((v) => isJsonSafe(v, depth + 1));
	}
	if (isPlainObject(value)) return Object.values(value).every((v) => isJsonSafe(v, depth + 1));
	return false;
}
/**
* Validate a skill's structured YAML frontmatter. Strict mode: unknown keys
* are rejected so any expansion of the allowed set is an intentional code
* change. Known keys are type-checked against `FRONTMATTER_KIND`; `hooks` and
* `metadata` fall back to a shallow JSON-safety check because their full
* schemas live outside this module.
*/
function validateSkillFrontmatter(frontmatter) {
	if (frontmatter === void 0 || frontmatter === null) return [];
	if (!isPlainObject(frontmatter)) return [{
		field: "frontmatter",
		code: "INVALID_TYPE",
		message: "Frontmatter must be a plain object"
	}];
	const issues = [];
	for (const [key, value] of Object.entries(frontmatter)) {
		if (!ALLOWED_FRONTMATTER_KEYS.has(key)) {
			issues.push({
				field: `frontmatter.${key}`,
				code: "UNKNOWN_KEY",
				message: `"${key}" is not a recognized frontmatter key`
			});
			continue;
		}
		if (key === "hooks" || key === "metadata") {
			if (!isPlainObject(value) || !isJsonSafe(value, 0)) issues.push({
				field: `frontmatter.${key}`,
				code: "INVALID_SHAPE",
				message: `"${key}" must be a plain JSON-safe object (max depth ${FRONTMATTER_MAX_DEPTH}, max string ${FRONTMATTER_MAX_STRING})`
			});
			continue;
		}
		const expected = FRONTMATTER_KIND[key];
		if (!expected) continue;
		const kinds = Array.isArray(expected) ? expected : [expected];
		if (!kinds.some((kind) => matchesKind(value, kind))) issues.push({
			field: `frontmatter.${key}`,
			code: "INVALID_TYPE",
			message: `"${key}" must be ${kinds.join(" or ")}`
		});
	}
	return issues;
}
function validateRelativePath(relativePath) {
	const issues = [];
	if (typeof relativePath !== "string" || relativePath.length === 0) {
		issues.push({
			field: "relativePath",
			code: "REQUIRED",
			message: "Relative path is required"
		});
		return issues;
	}
	if (relativePath.length > SKILL_FILE_PATH_MAX) issues.push({
		field: "relativePath",
		code: "TOO_LONG",
		message: `Relative path must be ${SKILL_FILE_PATH_MAX} characters or less`
	});
	if (relativePath.startsWith("/") || relativePath.startsWith("\\")) issues.push({
		field: "relativePath",
		code: "ABSOLUTE_PATH",
		message: "Relative path must not start with a slash"
	});
	if (!RELATIVE_PATH_CHARS.test(relativePath)) issues.push({
		field: "relativePath",
		code: "INVALID_CHARS",
		message: "Relative path contains invalid characters"
	});
	const segments = relativePath.split("/");
	if (segments.some((s) => s === "" || s === "." || s === "..")) issues.push({
		field: "relativePath",
		code: "TRAVERSAL",
		message: "Relative path cannot contain empty segments or \".\" / \"..\""
	});
	if (relativePath === "SKILL.md" || segments[0] === "SKILL.md") issues.push({
		field: "relativePath",
		code: "RESERVED",
		message: "SKILL.md is managed via the skill body, not file uploads"
	});
	return issues;
}
function inferSkillFileCategory(relativePath) {
	const [top] = relativePath.split("/");
	if (top === "scripts") return "script";
	if (top === "references") return "reference";
	if (top === "assets") return "asset";
	return "other";
}
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
function deriveStructuredFrontmatterFields(frontmatter) {
	if (!frontmatter || typeof frontmatter !== "object") return {};
	const derived = {};
	const disableModelInvocationRaw = frontmatter["disable-model-invocation"];
	if (typeof disableModelInvocationRaw === "boolean") derived.disableModelInvocation = disableModelInvocationRaw;
	const userInvocableRaw = frontmatter["user-invocable"];
	if (typeof userInvocableRaw === "boolean") derived.userInvocable = userInvocableRaw;
	const allowedToolsRaw = frontmatter["allowed-tools"];
	if (typeof allowedToolsRaw === "string") {
		/**
		* YAML scalars like `allowed-tools: web_search` are parsed as a single
		* string. Wrap into a one-element array; we deliberately do NOT split
		* on commas — the validator already accepts string-array form and
		* trying to "be helpful" by splitting `"web_search, file_search"`
		* would silently invent semantics the spec doesn't promise.
		*/
		if (allowedToolsRaw.length > 0) derived.allowedTools = [allowedToolsRaw];
	} else if (Array.isArray(allowedToolsRaw)) derived.allowedTools = allowedToolsRaw.filter((entry) => typeof entry === "string" && entry.length > 0);
	return derived;
}
/**
* Read-time fallback for skills authored before the structured columns
* existed: if the column is unset but the matching key is present in
* `frontmatter`, fill the column in on the returned object so downstream
* runtime checks (`skill.userInvocable === false`,
* `skill.disableModelInvocation === true`, `skill.allowedTools`) behave
* the same way they would for a freshly-created skill.
*
* Side-effect-free w.r.t. the DB (no writes), but mutates its argument
* in place and returns the same reference. Callers passing a `lean()`
* doc this is fine — the doc is a fresh JS object owned by the caller.
* When the skill is next updated, `updateSkill` re-derives and persists
* the columns naturally, so this fallback gradually becomes a no-op.
*
* Skills with the columns already populated short-circuit to no-op.
*/
function backfillDerivedFromFrontmatter(skill) {
	if (!skill || !skill.frontmatter) return skill;
	const derived = deriveStructuredFrontmatterFields(skill.frontmatter);
	if (skill.disableModelInvocation === void 0 && derived.disableModelInvocation !== void 0) skill.disableModelInvocation = derived.disableModelInvocation;
	if (skill.userInvocable === void 0 && derived.userInvocable !== void 0) skill.userInvocable = derived.userInvocable;
	if (skill.allowedTools === void 0 && derived.allowedTools !== void 0) skill.allowedTools = derived.allowedTools;
	return skill;
}
function getAlwaysApplyFrontmatterValue(frontmatter) {
	const canonical = frontmatter?.["always-apply"];
	if (typeof canonical === "boolean") return canonical;
	const camelAlias = frontmatter?.alwaysApply;
	if (typeof camelAlias === "boolean") return camelAlias;
}
/**
* Extractor for the `always-apply` / `alwaysApply` flag sitting inside a SKILL.md body's
* YAML frontmatter block. The REST edit flow lets users rewrite the full
* SKILL.md text via `update.body` without a structured `frontmatter`
* object, so this is the only signal we have for "user flipped
* `always-apply:` or `alwaysApply:` inline in their editor".
*
* Returns a discriminated union so callers can tell:
*  - `absent` — no always-apply key (leave column alone; could be
*    "user removed the flag" or "user hasn't written it yet" — both
*    resolve to no-op). An empty value (`always-apply:` with nothing
*    after the colon) is also treated as absent to allow mid-edit
*    placeholder states without rejecting a save.
*  - `valid` — parsed cleanly as `true` / `false` (case-insensitive,
*    quote-tolerant, YAML inline-comment-tolerant).
*  - `invalid` — key is present with a non-empty value that isn't a
*    recognizable boolean (e.g. `tru`, `yes`, `1`). Validation rejects
*    this rather than silently ignoring so `always-apply: tru` typos
*    surface as 400s instead of drifting the column from what the
*    saved SKILL.md text says. When both forms are present, the canonical
*    `always-apply` form wins because existing files may already rely on it.
*/
function extractAlwaysApplyFromBody(body) {
	if (typeof body !== "string" || body.length === 0) return { status: "absent" };
	const trimmed = body.trim();
	if (!trimmed.startsWith("---")) return { status: "absent" };
	const after = trimmed.slice(3);
	const closingIdx = after.indexOf("\n---");
	if (closingIdx === -1) return { status: "absent" };
	const block = after.slice(0, closingIdx);
	let aliasResult;
	for (const line of block.split("\n")) {
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		const normalizedKey = line.slice(0, colon).trim().toLowerCase();
		if (normalizedKey !== "always-apply" && normalizedKey !== "alwaysapply") continue;
		let value = stripYamlTrailingComment(line.slice(colon + 1).trim()).trim();
		if (value === "") {
			const result = { status: "absent" };
			if (normalizedKey === "always-apply") return result;
			aliasResult = result;
			continue;
		}
		if (value.length >= 2 && (value[0] === "\"" && value[value.length - 1] === "\"" || value[0] === "'" && value[value.length - 1] === "'")) value = value.slice(1, -1);
		value = value.trim();
		if (value === "") {
			const result = { status: "absent" };
			if (normalizedKey === "always-apply") return result;
			aliasResult = result;
			continue;
		}
		const lowered = value.toLowerCase();
		let result;
		if (lowered === "true") result = {
			status: "valid",
			value: true
		};
		else if (lowered === "false") result = {
			status: "valid",
			value: false
		};
		else result = { status: "invalid" };
		if (normalizedKey === "always-apply") return result;
		aliasResult = result;
	}
	return aliasResult ?? { status: "absent" };
}
/**
* Resolve the effective `alwaysApply` boolean for a create/update call.
*
* The indexed `alwaysApply` column is the source of truth for auto-priming
* queries; it can also be carried inline inside the SKILL.md `body` or in
* the structured `frontmatter` bag. All three surfaces must stay in sync
* or a skill edit that flips `always-apply:` in the body would leave the
* column stale and the UI / auto-priming query would use the old value.
*
* Precedence:
*  1. An explicit top-level `alwaysApply` wins (caller overrides).
*  2. Otherwise, derive from `frontmatter['always-apply']` or the accepted
*     alias `frontmatter.alwaysApply` when either is a strict boolean.
*  3. Otherwise, parse `always-apply:` / `alwaysApply:` out of the SKILL.md body
*     frontmatter block (covers the UI edit flow that sends only
*     `body` without a structured `frontmatter` object).
*  4. Otherwise, return `fallback` (typically `false` on create, or the
*     current column value on update so an update that doesn't touch
*     any of the three sources leaves the column alone).
*/
function resolveAlwaysApplyFromInput(explicit, frontmatter, body, fallback, precomputedBody) {
	if (typeof explicit === "boolean") return explicit;
	const fromFrontmatter = getAlwaysApplyFrontmatterValue(frontmatter);
	if (typeof fromFrontmatter === "boolean") return fromFrontmatter;
	const fromBody = precomputedBody ?? extractAlwaysApplyFromBody(body);
	if (fromBody.status === "valid") return fromBody.value;
	return fallback;
}
/**
* Narrows candidate skill ids to those backed by an existing Skill doc.
* Existence-only check (no ACL) so pruning an agent allowlist never drops
* skills the saving user merely can't view. Preserves input order, dedupes,
* and drops malformed ids — they can't reference anything. Candidates are
* lowercased before comparison: `isValidObjectIdString` accepts uppercase
* hex, but `_id.toString()` is always lowercase, and a casing mismatch
* would silently drop a valid id (and an emptied allowlist means the full
* catalog — the opposite of the configured scope).
*/
async function filterExistingSkillIds(mongoose, skillIds) {
	const candidates = [...new Set(skillIds.filter(isValidObjectIdString).map((id) => id.toLowerCase()))];
	if (candidates.length === 0) return [];
	const docs = await mongoose.models.Skill.find({ _id: { $in: candidates.map((id) => new mongoose.Types.ObjectId(id)) } }, { _id: 1 }).lean();
	const existing = new Set(docs.map((doc) => doc._id.toString()));
	return candidates.filter((id) => existing.has(id));
}
function createSkillMethods(mongoose, deps) {
	const { ObjectId } = mongoose.Types;
	function buildSkillFilter(params) {
		const filter = { _id: { $in: params.accessibleIds } };
		if (params.category && params.category.length > 0) filter.category = params.category;
		if (params.search && params.search.length > 0) {
			const rx = new RegExp(escapeRegExp(params.search), "i");
			filter.$or = [
				{ name: rx },
				{ description: rx },
				{ displayTitle: rx }
			];
		}
		return filter;
	}
	function decodeCursor(cursor) {
		if (!cursor || cursor === "undefined" || cursor === "null") return null;
		try {
			const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
			if (!decoded.updatedAt || !decoded._id || Number.isNaN(new Date(decoded.updatedAt).getTime()) || !isValidObjectIdString(decoded._id)) return null;
			return {
				updatedAt: new Date(decoded.updatedAt),
				_id: new ObjectId(decoded._id)
			};
		} catch (error) {
			logger.warn(`[skill.decodeCursor] Invalid cursor: ${error.message}`);
			return null;
		}
	}
	function encodeCursor(row) {
		return Buffer.from(JSON.stringify({
			updatedAt: row.updatedAt.toISOString(),
			_id: row._id.toString()
		})).toString("base64");
	}
	async function createSkill(data) {
		const bodyAlwaysApply = data.body !== void 0 ? extractAlwaysApplyFromBody(data.body) : void 0;
		const issues = [
			...validateSkillName(data.name),
			...validateSkillDescription(data.description),
			...validateSkillBody(data.body),
			...validateSkillDisplayTitle(data.displayTitle),
			...validateSkillFrontmatter(data.frontmatter),
			...validateAlwaysApply(data.alwaysApply)
		];
		if (bodyAlwaysApply?.status === "invalid" && typeof data.alwaysApply !== "boolean" && getAlwaysApplyFrontmatterValue(data.frontmatter) === void 0) issues.push({
			field: "body.frontmatter.alwaysApply",
			code: "INVALID_TYPE",
			message: "\"always-apply\" or \"alwaysApply\" in SKILL.md frontmatter must be a boolean (true or false)"
		});
		const { errors, warnings } = partitionIssues(issues);
		if (errors.length > 0) {
			const error = /* @__PURE__ */ new Error("Skill validation failed");
			error.issues = errors;
			error.code = "SKILL_VALIDATION_FAILED";
			throw error;
		}
		const Skill = mongoose.models.Skill;
		if (await Skill.findOne({
			name: data.name,
			author: data.author,
			tenantId: data.tenantId ?? null
		}).select("_id").lean()) {
			const error = /* @__PURE__ */ new Error(`A skill with name "${data.name}" already exists for this author`);
			error.code = 11e3;
			throw error;
		}
		const derived = deriveStructuredFrontmatterFields(data.frontmatter);
		return {
			skill: (await Skill.create({
				name: data.name,
				displayTitle: data.displayTitle,
				description: data.description,
				body: data.body ?? "",
				frontmatter: data.frontmatter ?? {},
				category: data.category ?? "",
				author: data.author,
				authorName: data.authorName,
				version: 1,
				source: data.source ?? "inline",
				sourceMetadata: data.sourceMetadata,
				fileCount: 0,
				alwaysApply: resolveAlwaysApplyFromInput(data.alwaysApply, data.frontmatter, data.body, false, bodyAlwaysApply),
				tenantId: data.tenantId,
				...derived
			})).toObject(),
			warnings
		};
	}
	async function getSkillById(id) {
		if (typeof id === "string" && !isValidObjectIdString(id)) return null;
		return await mongoose.models.Skill.findById(id).lean() ?? null;
	}
	async function getSkillByName(name, accessibleIds, options) {
		const Skill = mongoose.models.Skill;
		const preferUserInvocable = options?.preferUserInvocable === true;
		const preferModelInvocable = options?.preferModelInvocable === true;
		if (!preferUserInvocable && !preferModelInvocable) return backfillDerivedFromFrontmatter(await Skill.findOne({
			name,
			_id: { $in: accessibleIds }
		}).sort({ updatedAt: -1 }).lean() ?? null);
		const docs = await Skill.find({
			name,
			_id: { $in: accessibleIds }
		}).sort({ updatedAt: -1 }).lean();
		if (docs.length === 0) return null;
		for (const doc of docs) backfillDerivedFromFrontmatter(doc);
		return docs.find((d) => {
			if (preferUserInvocable && d.userInvocable === false) return false;
			if (preferModelInvocable && d.disableModelInvocation === true) return false;
			return true;
		}) ?? docs[0];
	}
	async function getAuthorSkillByName(params) {
		return backfillDerivedFromFrontmatter(await mongoose.models.Skill.findOne({
			name: params.name,
			author: params.author,
			tenantId: params.tenantId ?? null
		}).sort({ updatedAt: -1 }).lean() ?? null);
	}
	async function listSkillsByAccess(params) {
		const Skill = mongoose.models.Skill;
		const limit = Math.min(Math.max(1, params.limit || 20), 100);
		const baseFilter = buildSkillFilter(params);
		const cursor = decodeCursor(params.cursor);
		let filter = baseFilter;
		if (cursor) filter = { $and: [baseFilter, { $or: [{ updatedAt: { $lt: cursor.updatedAt } }, {
			updatedAt: cursor.updatedAt,
			_id: { $gt: cursor._id }
		}] }] };
		const rows = await Skill.find(filter).sort({
			updatedAt: -1,
			_id: 1
		}).limit(limit + 1).select("name displayTitle description category author authorName version source sourceMetadata fileCount alwaysApply tenantId disableModelInvocation userInvocable allowedTools createdAt updatedAt").lean();
		for (const row of rows) backfillDerivedFromFrontmatter(row);
		const has_more = rows.length > limit;
		const sliced = has_more ? rows.slice(0, limit) : rows;
		const last = sliced[sliced.length - 1];
		return {
			skills: sliced,
			has_more,
			after: has_more && last ? encodeCursor({
				updatedAt: last.updatedAt,
				_id: last._id
			}) : null
		};
	}
	async function listAlwaysApplySkills(params) {
		const Skill = mongoose.models.Skill;
		if (!params.accessibleIds.length) return {
			skills: [],
			has_more: false,
			after: null
		};
		const limit = Math.min(Math.max(1, params.limit || 20), 100);
		const baseFilter = {
			_id: { $in: params.accessibleIds },
			alwaysApply: true
		};
		const cursor = decodeCursor(params.cursor);
		let filter = baseFilter;
		if (cursor) filter = { $and: [baseFilter, { $or: [{ updatedAt: { $lt: cursor.updatedAt } }, {
			updatedAt: cursor.updatedAt,
			_id: { $gt: cursor._id }
		}] }] };
		const rows = await Skill.find(filter).sort({
			updatedAt: -1,
			_id: 1
		}).limit(limit + 1).select("name body author updatedAt allowedTools").lean();
		const has_more = rows.length > limit;
		const sliced = has_more ? rows.slice(0, limit) : rows;
		const last = sliced[sliced.length - 1];
		const after = has_more && last ? encodeCursor({
			updatedAt: last.updatedAt,
			_id: last._id
		}) : null;
		return {
			skills: sliced.map((row) => {
				const result = {
					_id: row._id,
					name: row.name,
					body: row.body ?? "",
					author: row.author
				};
				if (row.allowedTools !== void 0) result.allowedTools = row.allowedTools;
				return result;
			}),
			has_more,
			after
		};
	}
	async function updateSkill(params) {
		const { id, expectedVersion, update } = params;
		if (!isValidObjectIdString(id)) return { status: "not_found" };
		const bodyAlwaysApply = update.body !== void 0 ? extractAlwaysApplyFromBody(update.body) : void 0;
		const issues = [];
		if (update.name !== void 0) issues.push(...validateSkillName(update.name));
		if (update.description !== void 0) issues.push(...validateSkillDescription(update.description));
		if (update.body !== void 0) issues.push(...validateSkillBody(update.body));
		if (update.displayTitle !== void 0) issues.push(...validateSkillDisplayTitle(update.displayTitle));
		if (update.frontmatter !== void 0) issues.push(...validateSkillFrontmatter(update.frontmatter));
		if (update.alwaysApply !== void 0) issues.push(...validateAlwaysApply(update.alwaysApply));
		if (bodyAlwaysApply?.status === "invalid" && update.alwaysApply === void 0 && getAlwaysApplyFrontmatterValue(update.frontmatter) === void 0) issues.push({
			field: "body.frontmatter.alwaysApply",
			code: "INVALID_TYPE",
			message: "\"always-apply\" or \"alwaysApply\" in SKILL.md frontmatter must be a boolean (true or false)"
		});
		const { errors, warnings } = partitionIssues(issues);
		if (errors.length > 0) {
			const error = /* @__PURE__ */ new Error("Skill validation failed");
			error.issues = errors;
			error.code = "SKILL_VALIDATION_FAILED";
			throw error;
		}
		const Skill = mongoose.models.Skill;
		const setPayload = {};
		const unsetPayload = {};
		if (update.name !== void 0) setPayload.name = update.name;
		if (update.displayTitle !== void 0) setPayload.displayTitle = update.displayTitle;
		if (update.description !== void 0) setPayload.description = update.description;
		if (update.body !== void 0) setPayload.body = update.body;
		if (update.source !== void 0) setPayload.source = update.source;
		if (update.sourceMetadata !== void 0) setPayload.sourceMetadata = update.sourceMetadata;
		if (update.frontmatter !== void 0) {
			setPayload.frontmatter = update.frontmatter;
			/**
			* Derived columns track frontmatter — when frontmatter changes, the
			* derived view must follow. Fields the new frontmatter omits are
			* unset (back to schema default) so removing `disable-model-invocation`
			* from a SKILL.md re-enables model invocation on the next save.
			*/
			const derived = deriveStructuredFrontmatterFields(update.frontmatter);
			for (const key of [
				"disableModelInvocation",
				"userInvocable",
				"allowedTools"
			]) if (derived[key] !== void 0) setPayload[key] = derived[key];
			else unsetPayload[key] = "";
		}
		if (update.category !== void 0) setPayload.category = update.category;
		/**
		* Keep the indexed `alwaysApply` column in sync with whatever the update
		* is carrying: an explicit top-level `alwaysApply` always wins; a
		* structured `frontmatter` with `always-apply: true/false` or the
		* accepted `alwaysApply` alias is next; and a `body` update is scanned last for an inline `always-apply:` line
		* inside the SKILL.md frontmatter block. The body path is load-bearing
		* for the REST edit flow — the current UI sends `body` without a
		* parallel `frontmatter` object, so inline edits to `always-apply:` / `alwaysApply:`
		* would otherwise leave the column stale and auto-priming / pin
		* badges would keep using the old value.
		*
		* When a `body` is submitted with NO `always-apply:` line (e.g. the
		* user removed the line from SKILL.md), that counts as a positive
		* declaration of "not always-apply" — the column flips to `false`.
		* Leaving it untouched would leave a skill that was once always-apply
		* silently auto-priming even after its own SKILL.md no longer
		* declares the flag.
		*
		* Important: the gates key off the *presence of an always-apply value*
		* at each level, not the presence of the parent field. An API caller
		* that sends both `body` and an unrelated `frontmatter` bag (e.g.
		* editing category + rewriting SKILL.md in one PATCH) still gets the
		* body-inline flag respected because no structured always-apply key
		* is absent in that payload.
		*/
		let derivedAlwaysApply;
		if (update.alwaysApply !== void 0) derivedAlwaysApply = update.alwaysApply;
		if (derivedAlwaysApply === void 0 && update.frontmatter !== void 0) {
			const fromFrontmatter = getAlwaysApplyFrontmatterValue(update.frontmatter);
			if (typeof fromFrontmatter === "boolean") derivedAlwaysApply = fromFrontmatter;
		}
		if (derivedAlwaysApply === void 0 && bodyAlwaysApply !== void 0) {
			if (bodyAlwaysApply.status === "valid") derivedAlwaysApply = bodyAlwaysApply.value;
			else if (bodyAlwaysApply.status === "absent") derivedAlwaysApply = false;
		}
		if (derivedAlwaysApply !== void 0) setPayload.alwaysApply = derivedAlwaysApply;
		const updateOps = {
			$set: setPayload,
			$inc: { version: 1 }
		};
		if (Object.keys(unsetPayload).length > 0) updateOps.$unset = unsetPayload;
		const result = await Skill.findOneAndUpdate({
			_id: new ObjectId(id),
			version: expectedVersion
		}, updateOps, { new: true }).lean();
		if (result) return {
			status: "updated",
			skill: result,
			warnings
		};
		const current = await Skill.findById(id).lean();
		if (!current) return { status: "not_found" };
		return {
			status: "conflict",
			current
		};
	}
	/**
	* Removes deleted skill ids from every agent's `skills` allowlist. A dangling
	* id is invisible in the builder yet keeps the allowlist non-empty, so the
	* runtime scopes the catalog to an empty intersection and the agent silently
	* loses all skills. Direct `updateMany` on purpose: hygiene, not an authored
	* edit — no version entry, timestamps untouched.
	*
	* Ids are lowercased first: allowlists store canonical `_id.toString()`
	* values, and an uppercase-but-valid id would delete the Skill doc yet
	* leave the dangling entry behind.
	*
	* Agents whose ENTIRE allowlist is being deleted fail closed instead:
	* an emptied allowlist with `skills_enabled: true` means the full
	* accessible catalog at runtime, so a plain `$pull` would silently widen
	* a deliberately restricted agent. Disabling skills preserves the
	* restriction until an author makes a new explicit choice.
	*/
	async function removeSkillsFromAgentAllowlists(skillIds) {
		if (skillIds.length === 0) return;
		const ids = skillIds.map((id) => id.toLowerCase());
		const Agent = mongoose.models.Agent;
		try {
			await Agent.updateMany({ skills: {
				$in: ids,
				$not: { $elemMatch: { $nin: ids } }
			} }, { $set: {
				skills: [],
				skills_enabled: false
			} }, { timestamps: false });
			await Agent.updateMany({ skills: { $in: ids } }, { $pull: { skills: { $in: ids } } }, { timestamps: false });
		} catch (error) {
			logger.error("[removeSkillsFromAgentAllowlists] Error pruning agent skill allowlists:", error);
		}
	}
	async function deleteSkill(id) {
		if (!isValidObjectIdString(id)) return { deleted: false };
		const Skill = mongoose.models.Skill;
		const SkillFile = mongoose.models.SkillFile;
		const objectId = new ObjectId(id);
		if (!(await Skill.deleteOne({ _id: objectId })).deletedCount) return { deleted: false };
		/** Prune allowlists immediately after the Skill row is gone: if the
		*  SkillFile cleanup below throws, a retry exits early on
		*  `deletedCount === 0` and would never reach a later prune. */
		await removeSkillsFromAgentAllowlists([id]);
		await SkillFile.deleteMany({ skillId: objectId });
		try {
			await deps.removeAllPermissions({
				resourceType: ResourceType.SKILL,
				resourceId: id
			});
		} catch (error) {
			logger.error(`[deleteSkill] Error removing permissions for ${id}:`, error);
		}
		return { deleted: true };
	}
	async function deleteUserSkills(userId) {
		const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
		const Skill = mongoose.models.Skill;
		const soleOwned = await deps.getSoleOwnedResourceIds(userObjectId, ResourceType.SKILL);
		if (soleOwned.length === 0) return 0;
		await mongoose.models.SkillFile.deleteMany({ skillId: { $in: soleOwned } });
		const res = await Skill.deleteMany({ _id: { $in: soleOwned } });
		await removeSkillsFromAgentAllowlists(soleOwned.map((rid) => rid.toString()));
		await Promise.allSettled(soleOwned.map((rid) => deps.removeAllPermissions({
			resourceType: ResourceType.SKILL,
			resourceId: rid.toString()
		}).catch((error) => logger.error(`[deleteUserSkills] Error removing permissions for ${rid}:`, error))));
		return res.deletedCount ?? 0;
	}
	async function findSkillBySourceIdentity(params) {
		const Skill = mongoose.models.Skill;
		const tenantFilter = params.tenantId ? { tenantId: params.tenantId } : { $or: [{ tenantId: { $exists: false } }, { tenantId: null }] };
		return await Skill.findOne({
			source: params.source,
			"sourceMetadata.upstreamId": params.upstreamId,
			...tenantFilter
		}).lean() ?? null;
	}
	async function listSkillsBySource(params) {
		return await mongoose.models.Skill.find({
			source: params.source,
			"sourceMetadata.sourceId": params.sourceId
		}).lean();
	}
	/**
	* Atomically bumps `Skill.version` and adjusts `fileCount` by `delta`.
	* `delta` is `+1` when a new file is inserted, `-1` when one is deleted, and
	* `0` when an existing file is replaced in place.
	*
	* NOTE on consistency: this runs as a **separate** MongoDB operation from
	* the `upsertSkillFile` / `deleteSkillFile` that triggers it. MongoDB only
	* provides multi-document ACID via transactions (which require a replica
	* set), and LibreChat does not currently require that deployment shape. In
	* the rare case where a SkillFile write succeeds but the subsequent
	* `findByIdAndUpdate` here fails (connection drop, primary failover mid-
	* request), the `fileCount` on the parent Skill will drift from the true
	* row count until the next successful upsert/delete corrects it. Options if
	* this ever shows up in practice:
	*   - wrap both ops in a transaction (requires a replica set)
	*   - periodic reconciliation: `fileCount = count(skill_files where skillId = ?)`
	*   - treat `fileCount` as advisory and recompute on read when accuracy
	*     matters
	* For phase 1, skill files are stubbed at the upload boundary, so the risk
	* window doesn't open in practice.
	*/
	async function bumpSkillVersionAndAdjustFileCount(skillId, delta) {
		const Skill = mongoose.models.Skill;
		const updateOps = { $inc: { version: 1 } };
		if (delta !== 0) updateOps.$inc.fileCount = delta;
		await Skill.findByIdAndUpdate(skillId, updateOps);
	}
	async function listSkillFiles(skillId) {
		return await mongoose.models.SkillFile.find({ skillId }).select("-content").sort({ relativePath: 1 }).lean();
	}
	async function upsertSkillFile(row) {
		const issues = validateRelativePath(row.relativePath);
		if (issues.length > 0) {
			const error = /* @__PURE__ */ new Error("Skill file validation failed");
			error.issues = issues;
			error.code = "SKILL_FILE_VALIDATION_FAILED";
			throw error;
		}
		const SkillFile = mongoose.models.SkillFile;
		const category = inferSkillFileCategory(row.relativePath);
		const result = await SkillFile.findOneAndUpdate({
			skillId: row.skillId,
			relativePath: row.relativePath
		}, {
			$set: {
				skillId: row.skillId,
				relativePath: row.relativePath,
				file_id: row.file_id,
				filename: row.filename,
				filepath: row.filepath,
				storageKey: row.storageKey,
				storageRegion: row.storageRegion,
				source: row.source,
				sourceMetadata: row.sourceMetadata,
				mimeType: row.mimeType,
				bytes: row.bytes,
				category,
				isExecutable: row.isExecutable ?? false,
				author: row.author,
				tenantId: row.tenantId
			},
			$unset: {
				content: "",
				isBinary: "",
				codeEnvRef: ""
			}
		}, {
			new: true,
			upsert: true,
			includeResultMetadata: true
		}).lean();
		const current = result.value;
		if (!current) {
			const error = /* @__PURE__ */ new Error("Skill file upsert failed to read the saved file row");
			error.code = "SKILL_FILE_UPSERT_NOT_FOUND";
			throw error;
		}
		const delta = result.lastErrorObject?.updatedExisting === false ? 1 : 0;
		await bumpSkillVersionAndAdjustFileCount(row.skillId, delta);
		return current;
	}
	async function deleteSkillFile(skillId, relativePath) {
		if (!(await mongoose.models.SkillFile.deleteOne({
			skillId,
			relativePath
		})).deletedCount) return { deleted: false };
		await bumpSkillVersionAndAdjustFileCount(skillId, -1);
		return { deleted: true };
	}
	async function getSkillFileByPath(skillId, relativePath) {
		return await mongoose.models.SkillFile.findOne({
			skillId,
			relativePath
		}).lean();
	}
	async function updateSkillFileContent(skillId, relativePath, update) {
		await mongoose.models.SkillFile.updateOne({
			skillId,
			relativePath
		}, { $set: update });
	}
	async function updateSkillFileCodeEnvIds(updates) {
		if (updates.length === 0) return {
			matchedCount: 0,
			modifiedCount: 0
		};
		const SkillFile = mongoose.models.SkillFile;
		/**
		* The returned `{matchedCount, modifiedCount}` lets callers warn on
		* partial writes — a silent miss here turns every subsequent prime
		* into a fresh upload (massive egress at scale). If the wrapper's
		* tenant injection ends up dropping rows, the warn log makes it
		* visible instead of failing closed.
		*/
		const result = await tenantSafeBulkWrite(SkillFile, updates.map((u) => ({ updateOne: {
			filter: {
				skillId: u.skillId,
				relativePath: u.relativePath
			},
			update: { $set: { codeEnvRef: u.codeEnvRef } }
		} })));
		if (result.modifiedCount < updates.length) logger.warn(`[updateSkillFileCodeEnvIds] Persisted ${result.modifiedCount}/${updates.length} codeEnvRefs (matched ${result.matchedCount}). Subsequent primes for unmatched files will re-upload.`);
		return {
			matchedCount: result.matchedCount,
			modifiedCount: result.modifiedCount
		};
	}
	return {
		createSkill,
		getSkillById,
		getSkillByName,
		getAuthorSkillByName,
		listSkillsByAccess,
		listAlwaysApplySkills,
		updateSkill,
		deleteSkill,
		deleteUserSkills,
		findSkillBySourceIdentity,
		listSkillsBySource,
		listSkillFiles,
		upsertSkillFile,
		deleteSkillFile,
		getSkillFileByPath,
		updateSkillFileContent,
		updateSkillFileCodeEnvIds
	};
}
//#endregion
//#region src/methods/skillSync.ts
const LOCK_SOURCE_ID = "__global_lock__";
function hashToken$1(token) {
	return createHash("sha256").update(token).digest("hex");
}
function tenantStatusCondition(tenantId) {
	return tenantId ? { tenantId } : { tenantId: { $exists: false } };
}
function summarizeCredential(credential) {
	return {
		provider: credential.provider,
		credentialKey: credential.credentialKey,
		credentialPresent: true,
		tokenFingerprint: credential.tokenHash.slice(0, 12),
		createdAt: credential.createdAt,
		updatedAt: credential.updatedAt
	};
}
function createSkillSyncMethods(mongoose) {
	async function upsertSkillSyncCredential(input) {
		const Credential = mongoose.models.SkillSyncCredential;
		const update = {
			$set: {
				encryptedToken: await encryptV2(input.token),
				tokenHash: hashToken$1(input.token),
				updatedBy: input.userId
			},
			$setOnInsert: {
				provider: input.provider,
				credentialKey: input.credentialKey,
				createdBy: input.userId
			}
		};
		return summarizeCredential(await Credential.findOneAndUpdate({
			provider: input.provider,
			credentialKey: input.credentialKey
		}, update, {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true
		}).select("+tokenHash").lean());
	}
	async function deleteSkillSyncCredential(provider, credentialKey) {
		return { deleted: ((await mongoose.models.SkillSyncCredential.deleteOne({
			provider,
			credentialKey
		})).deletedCount ?? 0) > 0 };
	}
	async function listSkillSyncCredentials(provider) {
		return (await mongoose.models.SkillSyncCredential.find({ provider }).select("+tokenHash").sort({ credentialKey: 1 }).lean()).map((row) => summarizeCredential(row));
	}
	async function getSkillSyncCredentialToken(provider, credentialKey) {
		const credential = await mongoose.models.SkillSyncCredential.findOne({
			provider,
			credentialKey
		}).select("+encryptedToken").lean();
		if (!credential) return null;
		return decryptV2(credential.encryptedToken);
	}
	async function getSkillSyncCredentialSummary(provider, credentialKey) {
		const credential = await mongoose.models.SkillSyncCredential.findOne({
			provider,
			credentialKey
		}).select("+tokenHash").lean();
		if (!credential) return null;
		return summarizeCredential(credential);
	}
	async function listSkillSyncStatuses(provider) {
		return await mongoose.models.SkillSyncStatus.find({
			provider,
			sourceId: { $ne: LOCK_SOURCE_ID }
		}).sort({ sourceId: 1 }).lean();
	}
	async function getSkillSyncStatus(provider, sourceId, tenantId) {
		return await mongoose.models.SkillSyncStatus.findOne({
			provider,
			sourceId,
			...tenantStatusCondition(tenantId)
		}).lean() ?? null;
	}
	async function upsertSkillSyncStatus(input) {
		const Status = mongoose.models.SkillSyncStatus;
		const now = /* @__PURE__ */ new Date();
		const success = input.status === "succeeded";
		const failure = input.status === "failed";
		const setPayload = {
			status: input.status,
			credentialKey: input.credentialKey,
			owner: input.owner,
			repo: input.repo,
			ref: input.ref,
			paths: input.paths,
			startedAt: input.startedAt,
			finishedAt: input.finishedAt,
			syncedSkillCount: input.syncedSkillCount ?? 0,
			syncedFileCount: input.syncedFileCount ?? 0,
			deletedSkillCount: input.deletedSkillCount ?? 0,
			deletedFileCount: input.deletedFileCount ?? 0,
			...success ? { lastSuccessAt: input.finishedAt ?? now } : {},
			...failure ? { lastFailureAt: input.finishedAt ?? now } : {}
		};
		if (failure) {
			setPayload.errorCode = input.errorCode;
			setPayload.errorMessage = input.errorMessage;
		}
		const unsetPayload = failure ? {} : {
			errorCode: "",
			errorMessage: ""
		};
		return await Status.findOneAndUpdate({
			provider: input.provider,
			sourceId: input.sourceId,
			...tenantStatusCondition(input.tenantId)
		}, {
			$set: setPayload,
			...failure ? {} : { $unset: unsetPayload },
			$setOnInsert: {
				provider: input.provider,
				sourceId: input.sourceId,
				...input.tenantId ? { tenantId: input.tenantId } : {}
			}
		}, {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true
		}).lean();
	}
	async function tryAcquireSkillSyncLock(params) {
		const Status = mongoose.models.SkillSyncStatus;
		const now = /* @__PURE__ */ new Date();
		const lockExpiresAt = new Date(now.getTime() + params.leaseMs);
		const existing = await Status.findOne({
			provider: params.provider,
			sourceId: LOCK_SOURCE_ID,
			...tenantStatusCondition(params.tenantId)
		}).lean();
		if (existing?.lockOwner && existing.lockExpiresAt && existing.lockExpiresAt > now) return false;
		if (!existing) try {
			await Status.create({
				provider: params.provider,
				sourceId: LOCK_SOURCE_ID,
				...params.tenantId ? { tenantId: params.tenantId } : {},
				status: "running",
				lockOwner: params.lockOwner,
				lockExpiresAt,
				startedAt: now
			});
			return true;
		} catch (error) {
			if (error.code === 11e3) return false;
			throw error;
		}
		try {
			return (await Status.findOneAndUpdate({
				provider: params.provider,
				sourceId: LOCK_SOURCE_ID,
				...tenantStatusCondition(params.tenantId),
				$or: [{ lockExpiresAt: { $exists: false } }, { lockExpiresAt: { $lte: now } }]
			}, {
				$set: {
					status: "running",
					lockOwner: params.lockOwner,
					lockExpiresAt,
					startedAt: now
				},
				$setOnInsert: {
					provider: params.provider,
					sourceId: LOCK_SOURCE_ID,
					...params.tenantId ? { tenantId: params.tenantId } : {}
				}
			}, {
				upsert: true,
				new: true,
				setDefaultsOnInsert: true
			}).lean())?.lockOwner === params.lockOwner;
		} catch (error) {
			if (error.code === 11e3) return false;
			throw error;
		}
	}
	async function refreshSkillSyncLock(params) {
		const Status = mongoose.models.SkillSyncStatus;
		const now = /* @__PURE__ */ new Date();
		const row = await Status.findOneAndUpdate({
			provider: params.provider,
			sourceId: LOCK_SOURCE_ID,
			...tenantStatusCondition(params.tenantId),
			lockOwner: params.lockOwner,
			lockExpiresAt: { $gt: now }
		}, { $set: {
			status: "running",
			lockExpiresAt: new Date(now.getTime() + params.leaseMs)
		} }, { new: true }).lean();
		return Boolean(row);
	}
	async function releaseSkillSyncLock(params) {
		await mongoose.models.SkillSyncStatus.updateOne({
			provider: params.provider,
			sourceId: LOCK_SOURCE_ID,
			...tenantStatusCondition(params.tenantId),
			lockOwner: params.lockOwner
		}, {
			$set: {
				status: "idle",
				finishedAt: /* @__PURE__ */ new Date()
			},
			$unset: {
				lockOwner: "",
				lockExpiresAt: ""
			}
		});
	}
	return {
		upsertSkillSyncCredential,
		deleteSkillSyncCredential,
		listSkillSyncCredentials,
		getSkillSyncCredentialToken,
		getSkillSyncCredentialSummary,
		listSkillSyncStatuses,
		getSkillSyncStatus,
		upsertSkillSyncStatus,
		tryAcquireSkillSyncLock,
		refreshSkillSyncLock,
		releaseSkillSyncLock
	};
}
//#endregion
//#region src/methods/agent.ts
const { mcp_delimiter } = Constants;
/**
* Mirrors `TOOL_RESOURCE_KEYS` in `@librechat/api` — the subset of
* `EToolResources` that actually carries `file_ids` on an agent document.
* `code_interpreter` is excluded (it belongs to the Assistants API, not
* `AgentToolResources`) to avoid emitting dead MongoDB clauses.
*/
const TOOL_RESOURCE_KEYS = [
	EToolResources.execute_code,
	EToolResources.file_search,
	EToolResources.image_edit,
	EToolResources.context,
	EToolResources.ocr
];
/**
* Extracts unique MCP server names from tools array.
* Tools format: "toolName_mcp_serverName" or "sys__server__sys_mcp_serverName"
*/
function extractMCPServerNames(tools) {
	if (!tools || !Array.isArray(tools)) return [];
	const serverNames = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		if (!tool || !tool.includes(mcp_delimiter) || isActionTool(tool)) continue;
		const parts = tool.split(mcp_delimiter);
		if (parts.length >= 2) serverNames.add(parts[parts.length - 1]);
	}
	return Array.from(serverNames);
}
/**
* Check if a version already exists in the versions array, excluding timestamp and author fields.
*/
function isDuplicateVersion(updateData, currentData, versions, actionsHash = null) {
	if (!versions || versions.length === 0) return null;
	const excludeFields = [
		"_id",
		"id",
		"createdAt",
		"updatedAt",
		"author",
		"updatedBy",
		"created_at",
		"updated_at",
		"__v",
		"versions",
		"actionsHash"
	];
	const { $push: _$push, $pull: _$pull, $addToSet: _$addToSet, ...directUpdates } = updateData;
	if (Object.keys(directUpdates).length === 0 && !actionsHash) return null;
	const wouldBeVersion = {
		...currentData,
		...directUpdates
	};
	const lastVersion = versions[versions.length - 1];
	if (actionsHash && lastVersion.actionsHash !== actionsHash) return null;
	const allFields = new Set([...Object.keys(wouldBeVersion), ...Object.keys(lastVersion)]);
	const importantFields = Array.from(allFields).filter((field) => !excludeFields.includes(field));
	let isMatch = true;
	for (const field of importantFields) {
		const wouldBeValue = wouldBeVersion[field];
		const lastVersionValue = lastVersion[field];
		if (!wouldBeValue && !lastVersionValue) continue;
		if (Array.isArray(wouldBeValue) || Array.isArray(lastVersionValue)) {
			let wouldBeArr;
			if (Array.isArray(wouldBeValue)) wouldBeArr = wouldBeValue;
			else if (wouldBeValue == null) wouldBeArr = [];
			else wouldBeArr = [wouldBeValue];
			let lastVersionArr;
			if (Array.isArray(lastVersionValue)) lastVersionArr = lastVersionValue;
			else if (lastVersionValue == null) lastVersionArr = [];
			else lastVersionArr = [lastVersionValue];
			if (wouldBeArr.length !== lastVersionArr.length) {
				isMatch = false;
				break;
			}
			if (wouldBeArr.length > 0 && typeof wouldBeArr[0] === "object" && wouldBeArr[0] !== null) {
				const sortedWouldBe = [...wouldBeArr].map((item) => JSON.stringify(item)).sort();
				const sortedVersion = [...lastVersionArr].map((item) => JSON.stringify(item)).sort();
				if (!sortedWouldBe.every((item, i) => item === sortedVersion[i])) {
					isMatch = false;
					break;
				}
			} else {
				const sortedWouldBe = [...wouldBeArr].sort();
				const sortedVersion = [...lastVersionArr].sort();
				if (!sortedWouldBe.every((item, i) => item === sortedVersion[i])) {
					isMatch = false;
					break;
				}
			}
		} else if (typeof wouldBeValue === "object" && wouldBeValue !== null) {
			const lastVersionObj = typeof lastVersionValue === "object" && lastVersionValue !== null ? lastVersionValue : {};
			const wouldBeKeys = Object.keys(wouldBeValue);
			const lastVersionKeys = Object.keys(lastVersionObj);
			if (wouldBeKeys.length === 0 && lastVersionKeys.length === 0) continue;
			if (JSON.stringify(wouldBeValue) !== JSON.stringify(lastVersionObj)) {
				isMatch = false;
				break;
			}
		} else if (wouldBeValue !== lastVersionValue) {
			if (typeof wouldBeValue === "boolean" && wouldBeValue === false && lastVersionValue === void 0) continue;
			if (typeof wouldBeValue === "string" && wouldBeValue === "" && lastVersionValue === void 0) continue;
			isMatch = false;
			break;
		}
	}
	return isMatch ? lastVersion : null;
}
/**
* Generates a hash of action metadata for version comparison.
*/
async function generateActionMetadataHash(actionIds, actions) {
	if (!actionIds || actionIds.length === 0) return "";
	const actionMap = /* @__PURE__ */ new Map();
	actions.forEach((action) => {
		actionMap.set(action.action_id, action.metadata);
	});
	const metadataString = [...actionIds].sort().map((actionFullId) => {
		const actionId = actionFullId.split(actionDelimiter)[1];
		const metadata = actionMap.get(actionId);
		if (!metadata) return `${actionId}:null`;
		return `${actionId}:{${Object.keys(metadata).sort().map((key) => `${key}:${JSON.stringify(metadata[key])}`).join(",")}}`;
	}).join(";");
	const data = new TextEncoder().encode(metadataString);
	const hashBuffer = await crypto.webcrypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function createAgentMethods(mongoose, deps) {
	const { removeAllPermissions, getActions, getSoleOwnedResourceIds } = deps;
	/**
	* Create an agent with the provided data.
	*/
	async function createAgent(agentData) {
		const Agent = mongoose.models.Agent;
		if (Array.isArray(agentData.skills) && agentData.skills.length > 0) {
			const prunedSkills = await filterExistingSkillIds(mongoose, agentData.skills);
			agentData.skills = prunedSkills;
			/** Fail closed when pruning empties a non-empty allowlist — empty +
			*  enabled means the full catalog, and hygiene must never widen scope. */
			if (prunedSkills.length === 0) agentData.skills_enabled = false;
		}
		const { author: _author, ...versionData } = agentData;
		const timestamp = /* @__PURE__ */ new Date();
		const initialAgentData = {
			...agentData,
			versions: [{
				...versionData,
				createdAt: timestamp,
				updatedAt: timestamp
			}],
			category: agentData.category || "general",
			mcpServerNames: extractMCPServerNames(agentData.tools)
		};
		return (await Agent.create(initialAgentData)).toObject();
	}
	/**
	* Get an agent document based on the provided search parameter.
	*/
	async function getAgent(searchParameter) {
		return await mongoose.models.Agent.findOne(searchParameter).lean();
	}
	/**
	* Get multiple agent documents based on the provided search parameters.
	*/
	async function getAgents(searchParameter) {
		return await mongoose.models.Agent.find(searchParameter).lean();
	}
	async function hasAgentWithMCPServerName({ agentIds, serverName }) {
		if (agentIds.length === 0) return false;
		return await mongoose.models.Agent.exists({
			_id: { $in: agentIds },
			mcpServerNames: serverName
		}) !== null;
	}
	async function getMCPServerNamesByAgentIds(agentIds) {
		if (agentIds.length === 0) return [];
		const agents = await mongoose.models.Agent.find({
			_id: { $in: agentIds },
			mcpServerNames: {
				$exists: true,
				$not: { $size: 0 }
			}
		}, { mcpServerNames: 1 }).lean();
		const serverNames = /* @__PURE__ */ new Set();
		for (const agent of agents) for (const serverName of agent.mcpServerNames ?? []) serverNames.add(serverName);
		return Array.from(serverNames);
	}
	/**
	* Update an agent with new data without overwriting existing properties,
	* or create a new agent if it doesn't exist.
	* When an agent is updated, a copy of the current state will be saved to the versions array.
	*/
	async function updateAgent(searchParameter, updateData, options = {}) {
		const Agent = mongoose.models.Agent;
		const { updatingUserId = null, forceVersion = false, skipVersioning = false } = options;
		const mongoOptions = {
			new: true,
			upsert: false
		};
		const currentAgent = await Agent.findOne(searchParameter);
		if (currentAgent) {
			const { __v, _id, id: __id, versions, author: _author, ...versionData } = currentAgent.toObject();
			const { $push, $pull, $addToSet, ...directUpdates } = updateData;
			/** Self-heal: drop allowlist ids whose skill doc no longer exists.
			*  A dangling id keeps the allowlist non-empty while scoping the
			*  runtime catalog to an empty intersection — silently disabling
			*  skills for the agent. When pruning empties a non-empty allowlist,
			*  fail closed and disable skills: empty + enabled means the full
			*  catalog, and hygiene must never widen scope. (An explicit user
			*  `skills: []` submission skips this branch and keeps the
			*  full-catalog semantics.) */
			if (Array.isArray(directUpdates.skills) && directUpdates.skills.length > 0) {
				const prunedSkills = await filterExistingSkillIds(mongoose, directUpdates.skills);
				directUpdates.skills = prunedSkills;
				updateData.skills = prunedSkills;
				if (prunedSkills.length === 0) {
					directUpdates.skills_enabled = false;
					updateData.skills_enabled = false;
				}
			}
			if (directUpdates.tools !== void 0) {
				const mcpServerNames = extractMCPServerNames(directUpdates.tools);
				directUpdates.mcpServerNames = mcpServerNames;
				updateData.mcpServerNames = mcpServerNames;
			}
			let actionsHash = null;
			if (currentAgent.actions && currentAgent.actions.length > 0) {
				const actionIds = currentAgent.actions.map((action) => {
					return action.split(actionDelimiter)[1];
				}).filter(Boolean);
				if (actionIds.length > 0) try {
					const actions = await getActions({ action_id: { $in: actionIds } }, true);
					actionsHash = await generateActionMetadataHash(currentAgent.actions, actions);
				} catch (error) {
					logger.error("Error fetching actions for hash generation:", error);
				}
			}
			const shouldCreateVersion = !skipVersioning && (forceVersion || Object.keys(directUpdates).length > 0 || $push || $pull || $addToSet);
			if (shouldCreateVersion) {
				if (isDuplicateVersion(updateData, versionData, versions, actionsHash) && !forceVersion) {
					const agentObj = currentAgent.toObject();
					agentObj.version = versions.length;
					return agentObj;
				}
			}
			const versionEntry = {
				...versionData,
				...directUpdates,
				updatedAt: /* @__PURE__ */ new Date()
			};
			if (actionsHash) versionEntry.actionsHash = actionsHash;
			if (updatingUserId) versionEntry.updatedBy = new mongoose.Types.ObjectId(updatingUserId);
			if (shouldCreateVersion) updateData.$push = {
				...$push || {},
				versions: versionEntry
			};
		}
		return await Agent.findOneAndUpdate(searchParameter, updateData, mongoOptions).lean();
	}
	/**
	* Modifies an agent with the resource file id.
	*/
	async function addAgentResourceFile({ agent_id, tool_resource, file_id, updatingUserId }) {
		const Agent = mongoose.models.Agent;
		const searchParameter = { id: agent_id };
		if (!await getAgent(searchParameter)) throw new Error("Agent not found for adding resource file");
		const fileIdsPath = `tool_resources.${tool_resource}.file_ids`;
		await Agent.updateOne({
			id: agent_id,
			[`${fileIdsPath}`]: { $exists: false }
		}, { $set: { [`${fileIdsPath}`]: [] } });
		const updatedAgent = await updateAgent(searchParameter, { $addToSet: {
			tools: tool_resource,
			[fileIdsPath]: file_id
		} }, { updatingUserId });
		if (updatedAgent) return updatedAgent;
		else throw new Error("Agent not found for adding resource file");
	}
	/**
	* Removes multiple resource files from an agent using atomic operations.
	*/
	async function removeAgentResourceFiles({ agent_id, files }) {
		const Agent = mongoose.models.Agent;
		const searchParameter = { id: agent_id };
		const filesByResource = files.reduce((acc, { tool_resource, file_id }) => {
			if (!acc[tool_resource]) acc[tool_resource] = [];
			acc[tool_resource].push(file_id);
			return acc;
		}, {});
		const pullAllOps = {};
		for (const [resource, fileIds] of Object.entries(filesByResource)) {
			const fileIdsPath = `tool_resources.${resource}.file_ids`;
			pullAllOps[fileIdsPath] = fileIds;
		}
		const updatePullData = { $pullAll: pullAllOps };
		const agentAfterPull = await Agent.findOneAndUpdate(searchParameter, updatePullData, { new: true }).lean();
		if (!agentAfterPull) {
			if (!await getAgent(searchParameter)) throw new Error("Agent not found for removing resource files");
			throw new Error("Failed to update agent during file removal (pull step)");
		}
		return agentAfterPull;
	}
	/**
	* Removes the given file_ids from every agent's `tool_resources.*.file_ids`
	* so file deletion cannot leave orphaned stubs behind (see issue #12776).
	*/
	async function removeAgentResourceFilesFromAllAgents({ file_ids }) {
		if (!file_ids || file_ids.length === 0) return {
			matchedCount: 0,
			modifiedCount: 0
		};
		const Agent = mongoose.models.Agent;
		const orQuery = TOOL_RESOURCE_KEYS.map((key) => ({ [`tool_resources.${key}.file_ids`]: { $in: file_ids } }));
		const pullAllOps = TOOL_RESOURCE_KEYS.reduce((acc, key) => {
			acc[`tool_resources.${key}.file_ids`] = file_ids;
			return acc;
		}, {});
		const result = await Agent.updateMany({ $or: orQuery }, { $pullAll: pullAllOps });
		return {
			matchedCount: result.matchedCount ?? 0,
			modifiedCount: result.modifiedCount ?? 0
		};
	}
	/**
	* Deletes an agent based on the provided search parameter.
	*/
	async function deleteAgent(searchParameter) {
		const Agent = mongoose.models.Agent;
		const User = mongoose.models.User;
		const agent = await Agent.findOneAndDelete(searchParameter);
		if (agent) {
			await Promise.all([removeAllPermissions({
				resourceType: ResourceType.AGENT,
				resourceId: agent._id
			}), removeAllPermissions({
				resourceType: ResourceType.REMOTE_AGENT,
				resourceId: agent._id
			})]);
			try {
				await Agent.updateMany({ "edges.to": agent.id }, { $pull: { edges: { to: agent.id } } });
			} catch (error) {
				logger.error("[deleteAgent] Error removing agent from handoff edges", error);
			}
			try {
				await User.updateMany({ "favorites.agentId": agent.id }, { $pull: { favorites: { agentId: agent.id } } });
			} catch (error) {
				logger.error("[deleteAgent] Error removing agent from user favorites", error);
			}
		}
		return agent ? agent.toObject() : null;
	}
	/**
	* Deletes agents solely owned by the user and cleans up their ACLs.
	* Agents with other owners are left intact; the caller is responsible for
	* removing the user's own ACL principal entries separately.
	*
	* Also handles legacy (pre-ACL) agents that only have the author field set,
	* ensuring they are not orphaned if no permission migration has been run.
	*/
	async function deleteUserAgents(userId) {
		const Agent = mongoose.models.Agent;
		const AclEntry = mongoose.models.AclEntry;
		const User = mongoose.models.User;
		try {
			const userObjectId = new mongoose.Types.ObjectId(userId);
			const soleOwnedObjectIds = await getSoleOwnedResourceIds(userObjectId, [ResourceType.AGENT, ResourceType.REMOTE_AGENT]);
			const authoredAgents = await Agent.find({ author: userObjectId }).select("id _id").lean();
			const migratedEntries = authoredAgents.length > 0 ? await AclEntry.find({
				resourceType: { $in: [ResourceType.AGENT, ResourceType.REMOTE_AGENT] },
				resourceId: { $in: authoredAgents.map((a) => a._id) }
			}).select("resourceId").lean() : [];
			const migratedIds = new Set(migratedEntries.map((e) => e.resourceId.toString()));
			const legacyAgents = authoredAgents.filter((a) => !migratedIds.has(a._id.toString()));
			const allAgents = [...soleOwnedObjectIds.length > 0 ? await Agent.find({ _id: { $in: soleOwnedObjectIds } }).select("id _id").lean() : [], ...legacyAgents];
			if (allAgents.length === 0) return;
			const agentIds = allAgents.map((agent) => agent.id);
			const agentObjectIds = allAgents.map((agent) => agent._id);
			await AclEntry.deleteMany({
				resourceType: { $in: [ResourceType.AGENT, ResourceType.REMOTE_AGENT] },
				resourceId: { $in: agentObjectIds }
			});
			try {
				await Agent.updateMany({ "edges.to": { $in: agentIds } }, { $pull: { edges: { to: { $in: agentIds } } } });
			} catch (error) {
				logger.error("[deleteUserAgents] Error removing agents from handoff edges", error);
			}
			try {
				await User.updateMany({ "favorites.agentId": { $in: agentIds } }, { $pull: { favorites: { agentId: { $in: agentIds } } } });
			} catch (error) {
				logger.error("[deleteUserAgents] Error removing agents from user favorites", error);
			}
			await Agent.deleteMany({ _id: { $in: agentObjectIds } });
		} catch (error) {
			logger.error("[deleteUserAgents] General error:", error);
		}
	}
	/**
	* Get agents by accessible IDs with cursor pagination. Defaults to a 100-page
	* limit (max 1000); pass `limit: null` to opt out entirely.
	*/
	async function getListAgentsByAccess({ accessibleIds = [], otherParams = {}, limit = 100, after = null, includeSkillConfig = false }) {
		const Agent = mongoose.models.Agent;
		const isPaginated = limit !== null && limit !== void 0;
		const normalizedLimit = isPaginated ? Math.min(Math.max(1, parseInt(String(limit)) || 20), 1e3) : null;
		const baseQuery = {
			...otherParams,
			_id: { $in: accessibleIds }
		};
		if (after) try {
			const { updatedAt, _id } = JSON.parse(Buffer.from(after, "base64").toString("utf8"));
			const cursorCondition = { $or: [{ updatedAt: { $lt: new Date(updatedAt) } }, {
				updatedAt: new Date(updatedAt),
				_id: { $gt: new mongoose.Types.ObjectId(_id) }
			}] };
			if (Object.keys(baseQuery).length > 0) {
				baseQuery.$and = [{ ...baseQuery }, cursorCondition];
				Object.keys(baseQuery).forEach((key) => {
					if (key !== "$and") delete baseQuery[key];
				});
			} else Object.assign(baseQuery, cursorCondition);
		} catch (error) {
			logger.warn("Invalid cursor:", error.message);
		}
		const projection = {
			id: 1,
			_id: 1,
			name: 1,
			avatar: 1,
			author: 1,
			description: 1,
			updatedAt: 1,
			category: 1,
			support_contact: 1,
			is_promoted: 1
		};
		if (includeSkillConfig) {
			projection.skills = 1;
			projection.skills_enabled = 1;
		}
		let query = Agent.find(baseQuery, projection).sort({
			updatedAt: -1,
			_id: 1
		});
		if (isPaginated && normalizedLimit) query = query.limit(normalizedLimit + 1);
		const agents = await query.lean();
		const hasMore = isPaginated && normalizedLimit ? agents.length > normalizedLimit : false;
		const data = (isPaginated && normalizedLimit ? agents.slice(0, normalizedLimit) : agents).map((agent) => {
			if (agent.author) agent.author = agent.author.toString();
			return agent;
		});
		let nextCursor = null;
		if (isPaginated && hasMore && data.length > 0 && normalizedLimit) {
			const lastAgent = agents[normalizedLimit - 1];
			nextCursor = Buffer.from(JSON.stringify({
				updatedAt: lastAgent.updatedAt.toISOString(),
				_id: lastAgent._id.toString()
			})).toString("base64");
		}
		return {
			object: "list",
			data,
			first_id: data.length > 0 ? data[0].id : null,
			last_id: data.length > 0 ? data[data.length - 1].id : null,
			has_more: hasMore,
			after: nextCursor
		};
	}
	/**
	* Reverts an agent to a specific version in its version history.
	*/
	async function revertAgentVersion(searchParameter, versionIndex) {
		const Agent = mongoose.models.Agent;
		const agent = await Agent.findOne(searchParameter);
		if (!agent) throw new Error("Agent not found");
		if (!agent.versions || !agent.versions[versionIndex]) throw new Error(`Version ${versionIndex} not found`);
		const revertToVersion = { ...agent.versions[versionIndex] };
		delete revertToVersion._id;
		delete revertToVersion.id;
		delete revertToVersion.versions;
		delete revertToVersion.author;
		delete revertToVersion.updatedBy;
		/** Version snapshots can predate skill deletions; restoring one verbatim
		*  would resurrect dangling allowlist ids that scope the catalog to
		*  nothing. Same self-heal (and fail-closed-on-empty rule) as
		*  `createAgent`/`updateAgent`. */
		if (Array.isArray(revertToVersion.skills) && revertToVersion.skills.length > 0) {
			const prunedSkills = await filterExistingSkillIds(mongoose, revertToVersion.skills);
			revertToVersion.skills = prunedSkills;
			if (prunedSkills.length === 0) revertToVersion.skills_enabled = false;
		}
		const revertedAgent = await Agent.findOneAndUpdate(searchParameter, revertToVersion, { new: true }).lean();
		if (!revertedAgent) throw new Error("Agent not found");
		return revertedAgent;
	}
	/**
	* Counts the number of promoted agents.
	*/
	async function countPromotedAgents() {
		return await mongoose.models.Agent.countDocuments({ is_promoted: true });
	}
	/** Removes an agent from the favorites of specified users. */
	async function removeAgentFromUserFavorites(resourceId, userIds) {
		const Agent = mongoose.models.Agent;
		const User = mongoose.models.User;
		const agent = await Agent.findOne({ _id: resourceId }, { id: 1 }).lean();
		if (!agent) return;
		await User.updateMany({
			_id: { $in: userIds },
			"favorites.agentId": agent.id
		}, { $pull: { favorites: { agentId: agent.id } } });
	}
	return {
		getAgent,
		getAgents,
		createAgent,
		hasAgentWithMCPServerName,
		getMCPServerNamesByAgentIds,
		updateAgent,
		deleteAgent,
		deleteUserAgents,
		revertAgentVersion,
		countPromotedAgents,
		addAgentResourceFile,
		getListAgentsByAccess,
		removeAgentResourceFiles,
		generateActionMetadataHash,
		removeAgentFromUserFavorites,
		removeAgentResourceFilesFromAllAgents
	};
}
//#endregion
//#region src/methods/config.ts
function getTombstonePathsToClear(fieldPath) {
	const parts = fieldPath.split(".");
	if (parts.length <= 1) return [fieldPath];
	return parts.slice(1).map((_, index) => parts.slice(0, index + 2).join("."));
}
function getPathAndDescendantsRegex(fieldPath) {
	return new RegExp(`^${escapeRegExp(fieldPath)}(?:\\.|$)`);
}
function createConfigMethods(mongoose) {
	async function findConfigByPrincipal(principalType, principalId, options, session) {
		const Config = mongoose.models.Config;
		const filter = {
			principalType,
			principalId: principalId.toString()
		};
		if (!options?.includeInactive) filter.isActive = true;
		return await Config.findOne(filter).session(session ?? null).lean();
	}
	async function listAllConfigs(filter, session) {
		const Config = mongoose.models.Config;
		const where = {};
		if (filter?.isActive !== void 0) where.isActive = filter.isActive;
		return await Config.find(where).sort({ priority: 1 }).session(session ?? null).lean();
	}
	async function getApplicableConfigs(principals, session) {
		const Config = mongoose.models.Config;
		const principalsQuery = [{
			principalType: PrincipalType.ROLE,
			principalId: BASE_CONFIG_PRINCIPAL_ID
		}];
		if (principals && principals.length > 0) {
			for (const p of principals) if (p.principalId !== void 0) principalsQuery.push({
				principalType: p.principalType,
				principalId: p.principalId.toString()
			});
		}
		return await Config.find({
			$or: principalsQuery,
			isActive: true
		}).sort({ priority: 1 }).session(session ?? null).lean();
	}
	async function upsertConfig(principalType, principalId, principalModel, overrides, priority, session, options) {
		const Config = mongoose.models.Config;
		const query = {
			principalType,
			principalId: principalId.toString()
		};
		if (options?.expectEmpty) query.$and = [{ $or: [{ overrides: { $eq: {} } }, { overrides: { $exists: false } }] }, { $or: [{ tombstones: { $size: 0 } }, { tombstones: { $exists: false } }] }];
		const update = {
			$set: {
				principalModel,
				overrides,
				...options?.preservePriority ? {} : { priority },
				isActive: true
			},
			...options?.preservePriority ? { $setOnInsert: { priority } } : {},
			$inc: { configVersion: 1 }
		};
		const mongoOptions = {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true,
			...session ? { session } : {}
		};
		try {
			return await Config.findOneAndUpdate(query, update, mongoOptions);
		} catch (err) {
			if (err.code === 11e3) {
				if (options?.expectEmpty) return null;
				return await Config.findOneAndUpdate({
					principalType,
					principalId: principalId.toString()
				}, {
					$set: update.$set,
					$inc: update.$inc
				}, {
					new: true,
					...session ? { session } : {}
				});
			}
			throw err;
		}
	}
	async function patchConfigFields(principalType, principalId, principalModel, fields, priority, session) {
		const Config = mongoose.models.Config;
		const setPayload = {
			principalModel,
			priority
		};
		for (const [path, value] of Object.entries(fields)) setPayload[`overrides.${path}`] = value;
		const tombstonesToClear = [...new Set(Object.keys(fields).flatMap(getTombstonePathsToClear))];
		const options = {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true,
			...session ? { session } : {}
		};
		const update = {
			$set: setPayload,
			$inc: { configVersion: 1 }
		};
		if (tombstonesToClear.length > 0) update.$pull = { tombstones: { $in: tombstonesToClear } };
		return await Config.findOneAndUpdate({
			principalType,
			principalId: principalId.toString()
		}, update, options);
	}
	async function tombstoneConfigField(principalType, principalId, principalModel, fieldPath, priority, session) {
		const Config = mongoose.models.Config;
		const options = {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true,
			...session ? { session } : {}
		};
		return await Config.findOneAndUpdate({
			principalType,
			principalId: principalId.toString()
		}, {
			$set: {
				principalModel,
				priority
			},
			$unset: { [`overrides.${fieldPath}`]: "" },
			$addToSet: { tombstones: fieldPath },
			$inc: { configVersion: 1 }
		}, options);
	}
	async function unsetConfigField(principalType, principalId, fieldPath, session) {
		const Config = mongoose.models.Config;
		const options = {
			new: true,
			...session ? { session } : {}
		};
		return await Config.findOneAndUpdate({
			principalType,
			principalId: principalId.toString()
		}, {
			$unset: { [`overrides.${fieldPath}`]: "" },
			$pull: { tombstones: { $regex: getPathAndDescendantsRegex(fieldPath) } },
			$inc: { configVersion: 1 }
		}, options);
	}
	async function deleteConfig(principalType, principalId, session, options) {
		const Config = mongoose.models.Config;
		const filter = {
			principalType,
			principalId: principalId.toString()
		};
		if (options?.expectEmpty) filter.$and = [{ $or: [{ overrides: { $eq: {} } }, { overrides: { $exists: false } }] }, { $or: [{ tombstones: { $size: 0 } }, { tombstones: { $exists: false } }] }];
		return await Config.findOneAndDelete(filter).session(session ?? null);
	}
	async function toggleConfigActive(principalType, principalId, isActive, session, options) {
		const Config = mongoose.models.Config;
		const filter = {
			principalType,
			principalId: principalId.toString()
		};
		if (options?.expectEmpty) filter.$and = [{ $or: [{ overrides: { $eq: {} } }, { overrides: { $exists: false } }] }, { $or: [{ tombstones: { $size: 0 } }, { tombstones: { $exists: false } }] }];
		return await Config.findOneAndUpdate(filter, { $set: { isActive } }, {
			new: true,
			...session ? { session } : {}
		});
	}
	return {
		listAllConfigs,
		findConfigByPrincipal,
		getApplicableConfigs,
		upsertConfig,
		patchConfigFields,
		tombstoneConfigField,
		unsetConfigField,
		deleteConfig,
		toggleConfigActive
	};
}
//#endregion
//#region src/methods/index.ts
/**
* Creates all database methods for all collections
* @param mongoose - Mongoose instance
* @param deps - Optional dependencies injected from the api layer
*/
function createMethods(mongoose, deps = {}) {
	const txMethods = createTxMethods(mongoose, {
		matchModelName: deps.matchModelName ?? (() => void 0),
		findMatchingPattern: deps.findMatchingPattern ?? (() => void 0)
	});
	const transactionMethods = createTransactionMethods(mongoose, {
		getMultiplier: txMethods.getMultiplier,
		getCacheMultiplier: txMethods.getCacheMultiplier
	});
	const spendTokensMethods = createSpendTokensMethods(mongoose, {
		createTransaction: transactionMethods.createTransaction,
		createStructuredTransaction: transactionMethods.createStructuredTransaction
	});
	const messageMethods = createMessageMethods(mongoose);
	const conversationMethods = createConversationMethods(mongoose, {
		getMessages: messageMethods.getMessages,
		deleteMessages: messageMethods.deleteMessages
	});
	const aclEntryMethods = createAclEntryMethods(mongoose);
	const systemGrantMethods = createSystemGrantMethods(mongoose);
	const removeAllPermissions = deps.removeAllPermissions ?? (async ({ resourceType, resourceId }) => {
		await aclEntryMethods.deleteAclEntries({
			resourceType,
			resourceId
		});
	});
	const promptMethods = createPromptMethods(mongoose, {
		removeAllPermissions,
		getSoleOwnedResourceIds: aclEntryMethods.getSoleOwnedResourceIds
	});
	const skillMethods = createSkillMethods(mongoose, {
		removeAllPermissions,
		getSoleOwnedResourceIds: aclEntryMethods.getSoleOwnedResourceIds
	});
	const roleMethods = createRoleMethods(mongoose, { getCache: deps.getCache });
	const actionMethods = createActionMethods(mongoose);
	const agentMethods = createAgentMethods(mongoose, {
		removeAllPermissions,
		getActions: actionMethods.getActions,
		getSoleOwnedResourceIds: aclEntryMethods.getSoleOwnedResourceIds
	});
	return {
		...createUserMethods(mongoose),
		...createSessionMethods(mongoose),
		...createTokenMethods(mongoose),
		...roleMethods,
		...createKeyMethods(mongoose),
		...createFileMethods(mongoose),
		...createMemoryMethods(mongoose),
		...createAgentCategoryMethods(mongoose),
		...createAgentApiKeyMethods(mongoose),
		...createMCPServerMethods(mongoose),
		...createAccessRoleMethods(mongoose),
		...createUserGroupMethods(mongoose),
		...aclEntryMethods,
		...systemGrantMethods,
		...createAuditLogMethods(mongoose),
		...createShareMethods(mongoose),
		...createPluginAuthMethods(mongoose),
		...actionMethods,
		...createAssistantMethods(mongoose),
		...createBannerMethods(mongoose),
		...createToolCallMethods(mongoose),
		...createCategoriesMethods(mongoose),
		...createPresetMethods(mongoose),
		...createConversationTagMethods(mongoose),
		...messageMethods,
		...conversationMethods,
		...createChatProjectMethods(mongoose),
		...txMethods,
		...transactionMethods,
		...spendTokensMethods,
		...promptMethods,
		...skillMethods,
		...createSkillSyncMethods(mongoose),
		...agentMethods,
		...createConfigMethods(mongoose)
	};
}
//#endregion
//#region src/migrations/tenantIndexes.ts
/**
* Indexes that were superseded by compound tenant-scoped indexes.
* Each entry maps a collection name to the old index names that must be dropped
* before multi-tenancy can function (old unique indexes enforce global uniqueness,
* blocking same-value-different-tenant writes).
*
* These are only the indexes whose uniqueness constraints conflict with multi-tenancy.
* Non-unique indexes that were extended with tenantId are harmless (queries still work,
* just with slightly less optimal plans) and are not included here.
*/
const SUPERSEDED_INDEXES = {
	users: [
		"email_1",
		"googleId_1",
		"facebookId_1",
		"openidId_1",
		"openidId_1_tenantId_1",
		"samlId_1",
		"ldapId_1",
		"githubId_1",
		"discordId_1",
		"appleId_1"
	],
	roles: ["name_1"],
	agents: ["id_1"],
	conversations: ["conversationId_1", "conversationId_1_user_1"],
	messages: ["messageId_1", "messageId_1_user_1"],
	presets: ["presetId_1"],
	agentcategories: ["value_1"],
	accessroles: ["accessRoleId_1"],
	conversationtags: ["tag_1_user_1"],
	mcpservers: ["serverName_1"],
	files: ["filename_1_conversationId_1_context_1"],
	groups: ["idOnTheSource_1_source_1"],
	skillsyncstatuses: ["provider_1_sourceId_1"]
};
/**
* Drops superseded unique indexes that block multi-tenant operation.
* Idempotent — skips indexes that don't exist. Safe to run on fresh databases.
*
* Call this before enabling multi-tenant middleware on an existing deployment.
* On a fresh database (no pre-existing data), this is a no-op.
*/
async function dropSupersededTenantIndexes(connection) {
	const result = {
		dropped: [],
		skipped: [],
		errors: []
	};
	for (const [collectionName, indexNames] of Object.entries(SUPERSEDED_INDEXES)) {
		const collection = connection.db.collection(collectionName);
		let existingIndexes;
		try {
			existingIndexes = await collection.indexes();
		} catch {
			result.skipped.push(...indexNames.map((idx) => `${collectionName}.${idx} (collection does not exist)`));
			continue;
		}
		const existingNames = new Set(existingIndexes.map((idx) => idx.name));
		for (const indexName of indexNames) {
			if (!existingNames.has(indexName)) {
				result.skipped.push(`${collectionName}.${indexName}`);
				continue;
			}
			try {
				await collection.dropIndex(indexName);
				result.dropped.push(`${collectionName}.${indexName}`);
				logger.info(`[TenantMigration] Dropped superseded index: ${collectionName}.${indexName}`);
			} catch (err) {
				const msg = `${collectionName}.${indexName}: ${err.message}`;
				result.errors.push(msg);
				logger.error(`[TenantMigration] Failed to drop index: ${msg}`);
			}
		}
	}
	if (result.dropped.length > 0) logger.info(`[TenantMigration] Migration complete. Dropped ${result.dropped.length} superseded indexes.`);
	else logger.info("[TenantMigration] No superseded indexes found — database is already migrated or fresh.");
	return result;
}
//#endregion
//#region src/migrations/promptGroupIndexes.ts
/**
* Old promptGroup indexes that were replaced:
*   { createdAt: 1, updatedAt: 1 } → { numberOfGenerations: -1, updatedAt: -1, _id: 1 }
*
* Mongoose creates new indexes on startup but does NOT drop old ones.
* This migration removes the superseded index to avoid wasted storage and write overhead.
*/
const SUPERSEDED_PROMPT_GROUP_INDEXES = ["createdAt_1_updatedAt_1"];
async function dropSupersededPromptGroupIndexes(connection) {
	const result = {
		dropped: [],
		skipped: [],
		errors: []
	};
	const collectionName = "promptgroups";
	let collection;
	try {
		collection = connection.db.collection(collectionName);
	} catch {
		result.skipped.push(...SUPERSEDED_PROMPT_GROUP_INDEXES.map((idx) => `${collectionName}.${idx} (collection does not exist)`));
		return result;
	}
	let existingIndexes;
	try {
		existingIndexes = await collection.indexes();
	} catch {
		result.skipped.push(...SUPERSEDED_PROMPT_GROUP_INDEXES.map((idx) => `${collectionName}.${idx} (could not list indexes)`));
		return result;
	}
	const existingNames = new Set(existingIndexes.map((idx) => idx.name));
	for (const indexName of SUPERSEDED_PROMPT_GROUP_INDEXES) {
		if (!existingNames.has(indexName)) {
			result.skipped.push(`${collectionName}.${indexName}`);
			continue;
		}
		try {
			await collection.dropIndex(indexName);
			result.dropped.push(`${collectionName}.${indexName}`);
			logger.info(`[PromptGroupMigration] Dropped superseded index: ${collectionName}.${indexName}`);
		} catch (err) {
			const msg = `${collectionName}.${indexName}: ${err.message}`;
			result.errors.push(msg);
			logger.error(`[PromptGroupMigration] Failed to drop index: ${msg}`);
		}
	}
	return result;
}
//#endregion
export { AUDIT_ACTIONS, AUDIT_ACTION_CATEGORY, AUDIT_ACTOR_TYPES, AUDIT_CATEGORIES, AUDIT_OUTCOMES, AUDIT_SCHEMA_VERSION, AUDIT_SEVERITIES, AppService, BASE_CONFIG_PRINCIPAL_ID, CANCEL_RATE, CAPABILITY_CATEGORIES, CapabilityImplications, DEFAULT_REFRESH_TOKEN_EXPIRY, DEFAULT_RETENTION_HOURS, DEFAULT_SESSION_EXPIRY, GENESIS_HASH, MAX_AUDIT_EXPORT_ROWS, MAX_AUDIT_LOG_LIMIT, MAX_AUDIT_VERIFY_ROWS, MAX_PERM_BITS, MAX_RETENTION_HOURS, MIN_RETENTION_HOURS, PLATFORM_CHAIN_KEY, ResourceCapabilityMap, RoleBits, RoleConflictError, SYSTEM_TENANT_ID, SystemCapabilities, Action as actionSchema, activeExpirationFilter, agentApiKeySchema, agentCategorySchema, agentSchema, agentsConfigSetup, assistantSchema, auditLogSchema, balanceSchema, bannerSchema, buildRetentionVisibilityFilter, cacheTokenValues, categoriesSchema, chatProjectSchema, configCapability, configSchema, conversationTag as conversationTagSchema, convoSchema, createFallbackRetentionDate, createMethods, createModels, createTempChatExpirationDate, createTxMethods, decrypt, decryptV2, decryptV3, defaultRate, defaultVertexModels, deriveStructuredFrontmatterFields, dropSupersededPromptGroupIndexes, dropSupersededTenantIndexes, encrypt, encryptV2, encryptV3, escapeRegExp, expandImplications, file as fileSchema, getRandomValues, getRequestId, getTempChatRetentionHours, getTenantId, getTransactionSupport, getUserId, getWebSearchKeys, groupSchema, hasImpliedCapability, hashBackupCode, hashToken, inferSkillFileCategory, isMemoryAgentEnabled, isMemoryEnabled, isValidCapability, isValidObjectIdString, keySchema, legacyPermanentExpirationFilter, loadDefaultInterface, loadMemoryConfig, loadSkillSyncConfig, loadSummarizationConfig, loadTurnstileConfig, loadWebSearchConfig, logger, logger$1 as meiliLogger, MemoryEntrySchema as memorySchema, mergeConfigOverrides, messageSchema, normalizePrincipalId, partitionIssues, permissionBitSupersets, pluginAuthSchema, premiumTokenValues, presetSchema, processModelSpecs, promptGroupSchema, promptSchema, readConfigCapability, redactMessage, roleSchema, runAsSystem, scopedCacheKey, sessionSchema, shareSchema, signPayload, skillSyncCredentialSchema, skillSyncStatusSchema, stripYamlTrailingComment, supportsTransactions, systemGrantSchema, tenantSafeBulkWrite, tenantStorage, tokenSchema, tokenValues, toolCallSchema, transactionSchema, userSchema, validateRelativePath, validateSkillBody, validateSkillDescription, validateSkillFrontmatter, validateSkillName, validateVertexConfig, vertexConfigSetup, webSearchAuth, webSearchKeys };

//# sourceMappingURL=index.mjs.map