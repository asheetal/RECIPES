Admin tools for Tryfind.Me

Install from /home/sheetal/librechat with bash admin-tools-feature/install.sh.
The installer builds the interface in an isolated container, preserves existing
styles and mounts, then deploys through lab-data-guard. No sandbox image rebuild.
No real invitations or user deletions occur during installation/tests.

Admin-only shield icon opens invitation email + Send and a paginated user list.
Invites use LibreChat's existing seven-day, email-bound invitation token and SMTP
signature. The /ai/ prefix comes from DOMAIN_CLIENT. Invite links open the native
registration form with email prefilled, where the recipient sets a password.
Native email verification may follow. Public-registration settings are unchanged.
Expired/reused tokens are rejected; invalid registration forms do not consume them.

Deleting requires typing the selected email. All ADMIN accounts are protected.
Authenticated server-side capability and current-role checks protect mutations.
Deletion reuses native user cleanup, plus project GridFS data and custom memory.
Self-service deletion retains its existing two-factor authentication requirement.
Account deletion is irreversible; a failed cascade may need administrator repair.

Local validation: handler permission/confirmation/SMTP-failure tests, invitation
expiry/replay tests, source patch and Node syntax checks. The installer builds
and checks the real frontend and verifies unauthenticated admin access is denied.
