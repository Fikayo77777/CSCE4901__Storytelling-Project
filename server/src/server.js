const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { supabase } = require('./supabase');
const { createRequireStudent, createRequireTeacher, createRequireUser } = require('./auth');
const { createClassesRouter, createLobbyRouter, createSocketAuth } = require('./');

const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET;
if (typeof jwtSecret !== 'string' || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

const requireUser = createRequireUser(supabase);
const requireTeacher = createRequireTeacher(supabase);
const requireStudent = createRequireStudent(supabase);
const app = express();
const server = http.createServer(app);
let io;

app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/profile', requireUser, (req, res) => res.json({
  id: req.user.uid,
  role: req.user.role,
  displayName: req.user.displayName,
}));
app.use(createClassesRouter({ supabase, requireTeacher, getIo: () => io }));
app.use(createLobbyRouter({
  supabase,
  requireTeacher,
  requireStudent,
  jwtSecret,
  getIo: () => io,
}));
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error('API request failed:', error);
  return res.status(500).json({ error: 'Internal server error' });
});

io = new Server(server, {
  cors: { origin: process.env.WEB_ORIGIN || 'http://localhost:3000' },
});
io.use(createSocketAuth({ supabase, jwtSecret }));

server.listen(port, '0.0.0.0', () => {
  console.log(`Storytelling API and Socket.IO listening on http://localhost:${port}`);
});
