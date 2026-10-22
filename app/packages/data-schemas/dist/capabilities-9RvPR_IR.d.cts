import { PrincipalModel, PrincipalType, ResourceType, TCustomConfig } from "librechat-data-provider";

//#region src/types/admin.d.ts
/** Base capabilities derived from the SystemCapabilities constant. */
type BaseSystemCapability = (typeof SystemCapabilities)[keyof typeof SystemCapabilities];
/** Principal types that can receive config overrides. */
type ConfigAssignTarget = "user" | "group" | "role";
/** Top-level keys of the configSchema from librechat.yaml. */
type ConfigSection = string & keyof TCustomConfig;
/** Section-level config capabilities derived from configSchema keys. */
type ConfigSectionCapability = `manage:configs:${ConfigSection}` | `read:configs:${ConfigSection}`;
/** Principal-scoped config assignment capabilities. */
type ConfigAssignCapability = `assign:configs:${ConfigAssignTarget}`;
/**
* Union of all valid capability strings:
* - Base capabilities from SystemCapabilities
* - Section-level config capabilities (manage:configs:<section>, read:configs:<section>)
* - Config assignment capabilities (assign:configs:<user|group|role>)
*/
type SystemCapability = BaseSystemCapability | ConfigSectionCapability | ConfigAssignCapability;
/** UI grouping of capabilities for the admin panel's capability editor. */
type CapabilityCategory = {
  key: string;
  labelKey: string;
  capabilities: BaseSystemCapability[];
};
/** Config document as returned by the admin API (no Mongoose internals). */
type AdminConfig = {
  _id: string;
  principalType: PrincipalType;
  principalId: string;
  principalModel: PrincipalModel;
  priority: number;
  overrides: Partial<TCustomConfig>;
  isActive: boolean;
  configVersion: number;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
};
type AdminConfigListResponse = {
  configs: AdminConfig[];
};
type AdminConfigResponse = {
  config: AdminConfig;
};
type AdminConfigDeleteResponse = {
  success: boolean;
};
/**
* High-level domains an audit entry can belong to. The audit log is a
* general-purpose, append-only compliance record; new domains (agent runs,
* tool/MCP calls, config and permission changes, approvals) are added here as
* the surface grows, without reshaping the record.
*/
declare const AUDIT_CATEGORIES: readonly ["grant", "agent_run", "tool_call", "mcp", "config", "permission", "auth", "approval"];
type AuditCategory = (typeof AUDIT_CATEGORIES)[number];
/**
* Single source of truth for the audit-action enum. Actions are namespaced
* `<category>.<verb>` so the registry stays readable as it grows and every
* action maps unambiguously to a category. The Mongoose schema enum and the
* HTTP handler's whitelist both consume this constant so they cannot drift.
*/
declare const AUDIT_ACTIONS: readonly ["grant.assigned", "grant.removed"];
type AuditAction = (typeof AUDIT_ACTIONS)[number];
/** Maps each action to its category so writers never pass both. */
declare const AUDIT_ACTION_CATEGORY: Record<AuditAction, AuditCategory>;
/** Result of the audited operation. Kept first-class instead of being encoded
* into the action so `allowed` vs `denied` vs `failed` is queryable. */
declare const AUDIT_OUTCOMES: readonly ["success", "failure", "denied", "pending"];
type AuditOutcome = (typeof AUDIT_OUTCOMES)[number];
/** Coarse severity for SIEM routing and alerting. */
declare const AUDIT_SEVERITIES: readonly ["info", "warning", "critical"];
type AuditSeverity = (typeof AUDIT_SEVERITIES)[number];
/**
* Who initiated the action. Non-human actors are first-class: a scheduled job,
* an agent acting autonomously, an internal service, or a webhook are all
* representable without forcing a `User` id.
*/
declare const AUDIT_ACTOR_TYPES: readonly ["user", "system", "agent", "service", "schedule", "webhook", "api"];
type AuditActorType = (typeof AUDIT_ACTOR_TYPES)[number];
/** Primitive metadata values; event-specific payload is a flat string-keyed map
* (e.g. `{ capability }` for grants, `{ runId, triggerType }` for agent runs). */
type AuditMetadataValue = string | number | boolean | null;
type AuditMetadata = Record<string, AuditMetadataValue>;
/** Denormalized actor identity captured at write time. */
type AuditActor = {
  type: AuditActorType;
  /** Stable id (user id, service-account id, agent id); absent for anonymous
  * system events. */
  id?: string;
  /** Display name captured at write time so the record stays readable after the
  * underlying principal is renamed or deleted. */
  name: string;
};
/** Generic target of the action — not principal-locked, so it can describe a
* role, agent, MCP server, config section, etc. */
type AuditTarget = {
  type: string;
  id?: string;
  name?: string;
};
/** Request context for forensic joins and SIEM correlation. */
type AuditContext = {
  /** Correlation id (`x-request-id` / `x-correlation-id`). */requestId?: string;
  ip?: string;
  userAgent?: string;
  sessionId?: string;
};
/** Per-entry tamper-evidence surfaced to readers. The full chain is verifiable
* via the verify endpoint. */
type AuditIntegrity = {
  /** Monotonic per-chain sequence number (1-based). */seq: number; /** SHA-256 of this entry's canonical content linked to `prevHash`. */
  hash: string; /** Hash of the previous entry in the chain (genesis links to a zero hash). */
  prevHash: string;
};
/** SystemGrant document as returned by the admin API. */
type AdminSystemGrant = {
  id: string;
  principalType: PrincipalType;
  principalId: string;
  capability: string;
  grantedBy?: string;
  grantedAt: string;
  expiresAt?: string;
};
/** Audit log entry as returned by the admin API. */
type AdminAuditLogEntry = {
  id: string;
  schemaVersion: number;
  category: AuditCategory;
  action: AuditAction;
  outcome: AuditOutcome;
  severity: AuditSeverity;
  actor: AuditActor;
  target: AuditTarget;
  metadata?: AuditMetadata;
  context?: AuditContext; /** Absent = platform-operator entry; present = tenant-scoped entry. */
  tenantId?: string;
  integrity: AuditIntegrity; /** `createdAt` as an ISO 8601 string. */
  timestamp: string;
};
/** Group as returned by the admin API. */
type AdminGroup = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  topMembers: {
    name: string;
  }[];
  isActive: boolean;
};
/** Member entry as returned by the admin API for group/role membership lists. */
type AdminMember = {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAt?: string;
};
/** Full user info returned by the admin user list endpoint. */
type AdminUserListItem = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  provider: string;
  createdAt?: string;
  updatedAt?: string;
};
/** Minimal user info returned by user search endpoints. */
type AdminUserSearchResult = {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatarUrl?: string;
};
//#endregion
//#region src/admin/capabilities.d.ts
/**
* The canonical set of base system capabilities.
*
* These are used by the admin panel and LibreChat API to gate access to
* admin features. Config-section-derived capabilities (e.g.
* `manage:configs:endpoints`) are built on top of these where the
* configSchema is available.
*/
declare const SystemCapabilities: {
  readonly ACCESS_ADMIN: "access:admin";
  readonly READ_USERS: "read:users";
  readonly MANAGE_USERS: "manage:users";
  readonly READ_GROUPS: "read:groups";
  readonly MANAGE_GROUPS: "manage:groups";
  readonly READ_ROLES: "read:roles";
  readonly MANAGE_ROLES: "manage:roles";
  readonly READ_CONFIGS: "read:configs";
  readonly MANAGE_CONFIGS: "manage:configs";
  readonly ASSIGN_CONFIGS: "assign:configs";
  readonly READ_USAGE: "read:usage";
  readonly READ_AGENTS: "read:agents";
  readonly MANAGE_AGENTS: "manage:agents";
  readonly MANAGE_MCP_SERVERS: "manage:mcpservers";
  readonly READ_PROMPTS: "read:prompts";
  readonly MANAGE_PROMPTS: "manage:prompts";
  readonly READ_SKILLS: "read:skills";
  readonly MANAGE_SKILLS: "manage:skills";
  readonly READ_SHARED_LINKS: "read:sharedlinks";
  readonly MANAGE_SHARED_LINKS: "manage:sharedlinks"; /** Reserved — not yet enforced by any middleware. */
  readonly READ_ASSISTANTS: "read:assistants";
  readonly MANAGE_ASSISTANTS: "manage:assistants";
  /**
  * Required to list, view, and CSV-export the SystemGrant audit log. Append-only
  * by design, so there is no MANAGE counterpart — modifying historical entries
  * would defeat the forensic guarantee.
  */
  readonly READ_AUDIT_LOG: "read:audit_log";
};
/**
* Capabilities that are implied by holding a broader capability.
* e.g. `MANAGE_USERS` implies `READ_USERS`.
*/
declare const CapabilityImplications: Partial<Record<BaseSystemCapability, BaseSystemCapability[]>>;
/**
* Runtime validator for the full `SystemCapability` union:
* base capabilities, section-level config capabilities, and config assignment capabilities.
*/
declare function isValidCapability(value: string): boolean;
/**
* Check whether a set of held capabilities satisfies a required capability,
* accounting for the manage→read implication hierarchy.
*/
declare function hasImpliedCapability(held: string[], required: string): boolean;
/**
* Given a set of directly-held capabilities, compute the full set including
* all implied capabilities.
*/
declare function expandImplications(directCaps: string[]): string[];
/**
* Maps each ACL ResourceType to the SystemCapability that grants
* unrestricted management access. Typed as `Record<ResourceType, …>`
* so adding a new ResourceType variant causes a compile error until a
* capability is assigned here.
*/
declare const ResourceCapabilityMap: Record<ResourceType, SystemCapability>;
/**
* Derives a section-level config management capability from a configSchema key.
* @example configCapability('endpoints') → 'manage:configs:endpoints'
*
* TODO: Section-level config capabilities are scaffolded but not yet active.
* To activate delegated config management:
*  1. Expose POST/DELETE /api/admin/grants endpoints (wiring grantCapability/revokeCapability)
*  2. Seed section-specific grants for delegated admin roles via those endpoints
*  3. Guard config write handlers with hasConfigCapability(user, section)
*/
declare function configCapability(section: ConfigSection): `manage:configs:${ConfigSection}`;
/**
* Derives a section-level config read capability from a configSchema key.
* @example readConfigCapability('endpoints') → 'read:configs:endpoints'
*/
declare function readConfigCapability(section: ConfigSection): `read:configs:${ConfigSection}`;
/** Reserved principalId for the DB base config (overrides YAML defaults). */
declare const BASE_CONFIG_PRINCIPAL_ID = "__base__";
/** Pre-defined UI categories for grouping capabilities in the admin panel. */
declare const CAPABILITY_CATEGORIES: CapabilityCategory[];
//#endregion
export { AuditCategory as A, ConfigAssignTarget as B, AdminMember as C, AuditAction as D, AdminUserSearchResult as E, AuditOutcome as F, SystemCapability as H, AuditSeverity as I, AuditTarget as L, AuditIntegrity as M, AuditMetadata as N, AuditActor as O, AuditMetadataValue as P, BaseSystemCapability as R, AdminGroup as S, AdminUserListItem as T, ConfigSection as V, AdminAuditLogEntry as _, SystemCapabilities as a, AdminConfigListResponse as b, hasImpliedCapability as c, AUDIT_ACTIONS as d, AUDIT_ACTION_CATEGORY as f, AUDIT_SEVERITIES as g, AUDIT_OUTCOMES as h, ResourceCapabilityMap as i, AuditContext as j, AuditActorType as k, isValidCapability as l, AUDIT_CATEGORIES as m, CAPABILITY_CATEGORIES as n, configCapability as o, AUDIT_ACTOR_TYPES as p, CapabilityImplications as r, expandImplications as s, BASE_CONFIG_PRINCIPAL_ID as t, readConfigCapability as u, AdminConfig as v, AdminSystemGrant as w, AdminConfigResponse as x, AdminConfigDeleteResponse as y, CapabilityCategory as z };
//# sourceMappingURL=capabilities-9RvPR_IR.d.cts.map