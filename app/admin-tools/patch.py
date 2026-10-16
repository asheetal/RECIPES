from pathlib import Path
import sys, shutil
B = Path(__file__).resolve().parent
work = Path(sys.argv[1])
api = work / "api" / "server"
ui = work / "client" / "src"

def edit(p, a, b):
    s = p.read_text()
    if b in s or ("AdminTools" in b and "<AdminTools />" in s) or ("inviteEmail" in b and "inviteEmail" in s):
        return
    assert s.count(a) == 1, f"Unexpected source: {p} / {a[:60]}"
    p.write_text(s.replace(a, b))

# 1. Copy the unified AdminTools.tsx into the client source
shutil.copy2(B / "AdminTools.tsx", ui / "components" / "UnifiedSidebar" / "AdminTools.tsx")

# 2. Patch ExpandedPanel.tsx to mount AdminTools
p = ui / "components" / "UnifiedSidebar" / "ExpandedPanel.tsx"
edit(p, "import store from \x27~/store\x27;", "import store from \x27~/store\x27;\nimport AdminTools from \x27./AdminTools\x27;")
edit(p, "\x27<div className=\"mt-auto\">\x27".strip("\x27"), "<div className=\"mt-auto\">\n        <AdminTools />")

# 3. Patch Registration.tsx for invite pre-fill
p = ui / "components" / "Auth" / "Registration.tsx"
edit(p, "useContext, useState", "useContext, useState, useEffect")
edit(p, "    watch,", "    watch,\n    setValue,")
edit(p, "  const token = queryParams.get(\x27token\x27);",
     "  const token = queryParams.get(\x27token\x27);\n  const inviteEmail = queryParams.get(\x27email\x27);\n  useEffect(() => { if (token && inviteEmail) setValue(\x27email\x27, inviteEmail); }, [token, inviteEmail, setValue]);")

# 4. Rewrite routes/admin/users.js with all admin routes wired
p = api / "routes" / "admin" / "users.js"
p.write_text("""const express = require(\x27express\x27);
const { createAdminUsersHandlers } = require(\x27@librechat/api\x27);
const { SystemCapabilities } = require(\x27@librechat/data-schemas\x27);
const { requireCapability } = require(\x27~/server/middleware/roles/capabilities\x27);
const { requireJwtAuth } = require(\x27~/server/middleware\x27);
const db = require(\x27~/models\x27);

const router = express.Router();

const requireAdminAccess = requireCapability(SystemCapabilities.ACCESS_ADMIN);
const requireReadUsers = requireCapability(SystemCapabilities.READ_USERS);
const requireManageUsers = requireCapability(SystemCapabilities.MANAGE_USERS);

const handlers = createAdminUsersHandlers({
  findUsers: db.findUsers,
  countUsers: db.countUsers,
  deleteUserById: db.deleteUserById,
  deleteConfig: db.deleteConfig,
  deleteAclEntries: db.deleteAclEntries,
});

const labAdmin = require(\x27/app/admin-tools/routes.cjs\x27);
const ext = require(\x27/app/admin-tools/routes-ext.cjs\x27);

router.use(requireJwtAuth, requireAdminAccess, labAdmin.admin);

router.get(\x27/\x27, requireReadUsers, handlers.listUsers);
router.get(\x27/search\x27, requireReadUsers, handlers.searchUsers);
router.post(\x27/invite\x27, requireManageUsers, labAdmin.invite);
router.post(\x27/:id/delete\x27, requireManageUsers, labAdmin.remove);

router.get(\x27/model-access\x27, requireManageUsers, ext.modelAccess.get);
router.post(\x27/model-access/apis\x27, requireManageUsers, ext.modelAccess.saveAPI);
router.post(\x27/model-access/models\x27, requireManageUsers, ext.modelAccess.saveModel);
router.post(\x27/model-access/models/:id/test\x27, requireManageUsers, ext.modelAccess.retestModel);
router.post(\x27/model-access/models/:id/delete\x27, requireManageUsers, ext.modelAccess.deleteModel);

router.get(\x27/llm-roles\x27, requireManageUsers, ext.llmRoles.get);
router.post(\x27/llm-roles\x27, requireManageUsers, ext.llmRoles.save);

router.get(\x27/friends\x27, requireManageUsers, ext.friends.list);
router.post(\x27/friends/codes\x27, requireManageUsers, ext.friends.generate);
router.post(\x27/friends/codes/:codeId/revoke\x27, requireManageUsers, ext.friends.revoke);
router.post(\x27/friends/:id/convert\x27, requireManageUsers, ext.friends.convert);
router.post(\x27/friends/:id/delete\x27, requireManageUsers, ext.friends.remove);

router.get(\x27/compression\x27, requireManageUsers, ext.compression.get);
router.post(\x27/compression\x27, requireManageUsers, ext.compression.save);

router.get(\x27/project-upload\x27, requireManageUsers, ext.projectUpload.get);
router.post(\x27/project-upload\x27, requireManageUsers, ext.projectUpload.save);

module.exports = router;
""")

# 5. Patch checkInviteUser.js
p = api / "middleware" / "checkInviteUser.js"
edit(p, "    await deleteTokens({ token: invite.token });",
"""    if (!invite.expiresAt || new Date(invite.expiresAt).getTime() <= Date.now()) {
      return res.status(400).json({ message: \x27Invitation expired. Ask the administrator for a new link.\x27 });
    }
    const { registerSchema } = require(\x27~/strategies/validators\x27);
    if (!registerSchema.safeParse(req.body).success) {
      return res.status(400).json({ message: \x27Check your name, email, and password, then try again.\x27 });
    }
    const consumed = await deleteTokens({ token: invite.token, email: req.body.email });
    if (consumed.deletedCount !== 1) {
      return res.status(400).json({ message: \x27Invitation already used. Ask the administrator for a new link.\x27 });
    }""")

print("Patch applied: AdminTools, ExpandedPanel, Registration, users.js (full routes), checkInviteUser.")


# --- LAB CONTEXT SNAPSHOT ROUTE ---
p = api / 'routes' / 'messages.js'
if p.exists():
    s = p.read_text()
    if 'context-snapshot' not in s:
        anchor = 'router.post(' + repr('/:conversationId') + ', validateMessageReq'
        block = "router.get('/:conversationId/context-snapshot', validateMessageReq, async (req, res) => {\n  try {\n    const { conversationId } = req.params;\n    const raw = await db.getMessages({ conversationId, user: req.user.id });\n    let uiChars = 0, summaryChars = 0, compressionChars = 0;\n    for (const m of (raw || [])) {\n      const txt = Array.isArray(m.content) && m.content[0] && m.content[0].text ? m.content[0].text : (m.text || '');\n      const len = txt.length;\n      if (m.metadata && m.metadata.labTriageSummary) { summaryChars += len; continue; }\n      uiChars += len;\n      if (m.metadata && m.metadata.labPromptCompression && m.metadata.labPromptCompression.summary) {\n        compressionChars += String(m.metadata.labPromptCompression.summary).length;\n      }\n    }\n    const rate = 0.25;\n    const uiTokens = Math.round(uiChars * rate);\n    const summaryTokens = Math.round(summaryChars * rate);\n    const compressionTokens = Math.round(compressionChars * rate);\n    const totalTokens = uiTokens + summaryTokens + compressionTokens;\n    res.status(200).json({\n      uiTokens, summaryTokens, compressionTokens, totalTokens,\n      maxTokens: 902500,\n      percent: Math.min(Math.round((totalTokens / 902500) * 100), 100),\n    });\n  } catch (error) {\n    logger.error('Error fetching context snapshot:', error);\n    res.status(500).json({ error: 'Internal server error' });\n  }\n});\n\n"
        if anchor in s:
            s = s.replace(anchor, block + anchor, 1)
            p.write_text(s)
            print('injected context-snapshot route into messages.js')
        else:
            print('WARN: anchor not found in messages.js')
    else:
        print('messages.js already has context-snapshot')
else:
    print('WARN: messages.js not in work tree')
