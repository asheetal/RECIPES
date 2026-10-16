const { getInvite: getInviteFn } = require('@librechat/api');
const { createToken, findToken, deleteTokens } = require('~/models');

const getInvite = (encodedToken, email) =>
  getInviteFn(encodedToken, email, { createToken, findToken });

async function checkInviteUser(req, res, next) {
  const token = req.body.token;

  if (!token || token === 'undefined') {
    next();
    return;
  }

  try {
    const invite = await getInvite(token, req.body.email);

    if (!invite || invite.error === true) {
      return res.status(400).json({ message: 'Invalid invite token' });
    }

    if (!invite.expiresAt || new Date(invite.expiresAt).getTime() <= Date.now()) {
      return res.status(400).json({ message: 'Invitation expired. Ask the administrator for a new link.' });
    }
    const { registerSchema } = require('~/strategies/validators');
    if (!registerSchema.safeParse(req.body).success) {
      return res.status(400).json({ message: 'Check your name, email, and password, then try again.' });
    }
    const consumed = await deleteTokens({ token: invite.token, email: req.body.email });
    if (consumed.deletedCount !== 1) {
      return res.status(400).json({ message: 'Invitation already used. Ask the administrator for a new link.' });
    }
    req.invite = invite;
    next();
  } catch (error) {
    return res.status(429).json({ message: error.message });
  }
}

module.exports = checkInviteUser;
