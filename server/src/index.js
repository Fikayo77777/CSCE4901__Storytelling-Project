const { createClassesRouter } = require('./classes');
const { createLobbyRouter } = require('./lobby');
const { createSocketAuth } = require('./socketAuth');
const {
  createRequireStudent,
  createRequireTeacher,
  createRequireUser,
  createSupabaseAuthMiddleware,
} = require('./auth');

module.exports = {
  createClassesRouter,
  createLobbyRouter,
  createSocketAuth,
  createRequireStudent,
  createRequireTeacher,
  createRequireUser,
  createSupabaseAuthMiddleware,
};
