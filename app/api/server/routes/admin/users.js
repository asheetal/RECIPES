const express = require('express');
const { createAdminUsersHandlers } = require('@librechat/api');
const { SystemCapabilities } = require('@librechat/data-schemas');
const { requireCapability } = require('~/server/middleware/roles/capabilities');
const { requireJwtAuth } = require('~/server/middleware');
const db = require('~/models');

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

const labAdmin = require('/app/admin-tools/routes.cjs');
const ext = require('/app/admin-tools/routes-ext.cjs');

router.use(requireJwtAuth, requireAdminAccess, labAdmin.admin);

router.get('/', requireReadUsers, handlers.listUsers);
router.get('/search', requireReadUsers, handlers.searchUsers);
router.post('/invite', requireManageUsers, labAdmin.invite);
router.post('/:id/delete', requireManageUsers, labAdmin.remove);

router.get('/model-access', requireManageUsers, ext.modelAccess.get);
router.post('/model-access/apis', requireManageUsers, ext.modelAccess.saveAPI);
router.post('/model-access/models', requireManageUsers, ext.modelAccess.saveModel);
router.post('/model-access/models/:id/test', requireManageUsers, ext.modelAccess.retestModel);
router.post('/model-access/models/:id/delete', requireManageUsers, ext.modelAccess.deleteModel);

router.get('/llm-roles', requireManageUsers, ext.llmRoles.get);
router.post('/llm-roles', requireManageUsers, ext.llmRoles.save);

router.get('/friends', requireManageUsers, ext.friends.list);
router.post('/friends/codes', requireManageUsers, ext.friends.generate);
router.post('/friends/codes/:codeId/revoke', requireManageUsers, ext.friends.revoke);
router.post('/friends/:id/convert', requireManageUsers, ext.friends.convert);
router.post('/friends/:id/delete', requireManageUsers, ext.friends.remove);

router.get('/compression', requireManageUsers, ext.compression.get);
router.post('/compression', requireManageUsers, ext.compression.save);

router.get('/project-upload', requireManageUsers, ext.projectUpload.get);
router.post('/project-upload', requireManageUsers, ext.projectUpload.save);

module.exports = router;
