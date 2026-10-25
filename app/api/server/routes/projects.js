const express = require('express');
const { createProjectHandlers } = require('@librechat/api');
const requireJwtAuth = require('~/server/middleware/requireJwtAuth');
const db = require('~/models');

const router = express.Router();
const handlers = createProjectHandlers({
  listChatProjects: db.listChatProjects,
  createChatProject: db.createChatProject,
  getChatProject: db.getChatProject,
  updateChatProject: db.updateChatProject,
  deleteChatProject: db.deleteChatProject,
  assignConversationToProject: db.assignConversationToProject,
});

router.use(requireJwtAuth);
const projectFiles = require('/app/project-files-feature/project-files.cjs');
projectFiles.registerRoutes(router);
const helloWorld = require('/app/hello-world-feature/hello-world.cjs');
helloWorld.registerRoutes(router, projectFiles.service());
const aspSem = require('/app/asp-feature/automated-sem.cjs');
aspSem.registerRoutes(router, projectFiles.service());

router.get('/', handlers.listProjects);
router.post('/', handlers.createProject);
router.put('/conversations/:conversationId', handlers.assignConversationToProject);
router.get('/:projectId', handlers.getProject);
router.patch('/:projectId', handlers.updateProject);
router.delete('/:projectId', projectFiles.deletionHandler(db.deleteChatProject));

module.exports = router;
