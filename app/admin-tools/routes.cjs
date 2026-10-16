'use strict';
require("module-alias").addAlias("~", "/app/api");
const db = require("~/models");
const { createInvite, getInvite } = require("@librechat/api");
const { sendEmail } = require("~/server/utils");
const { deleteAdminUserController } = require("~/server/controllers/UserController");
const { makeHandlers } = require("./core.cjs");
module.exports = makeHandlers({
  getUser: id => id ? db.getUserById(String(id)) : null,
  findUser: email => db.findUser({ email }, "_id"),
  createInvite: email => createInvite(email, { createToken: db.createToken, findToken: db.findToken }),
  domain: () => process.env.DOMAIN_CLIENT,
  send: (email, inviteLink) => sendEmail({ email, subject: "Welcome to Tryfind.Me — set up your account", template: "inviteUser.handlebars", payload: { name: email, appName: "Tryfind.Me", inviteLink, year: String(new Date().getFullYear()) } }),
  revoke: async (email, token) => { const row = await getInvite(token, email, { findToken: db.findToken }); if (row?.token) await db.deleteTokens({ token: row.token, email }); },
  remove: async (req, res, target) => {
    const child = Object.create(req);
    child.user = { ...target, id: String(target._id), _id: target._id };
    child.body = {};
    await deleteAdminUserController(child, res);
  }
});
