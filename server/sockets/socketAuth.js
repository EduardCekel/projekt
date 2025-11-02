// sockets/socketAuth.js
const jwt = require('jsonwebtoken');
const log = require("../utils/logger");

module.exports = function registerSocketAuth(io) {
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token;

      if (!token) {
        const err = new Error('unauthorized');
        err.data = { code: 401, message: 'Missing token' };
        return next(err);
      }

      // Verify JWT and extract payload
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { userid, role } = (decoded && decoded.UserInfo) || {};

      if (!userid) {
        const err = new Error('unauthorized');
        err.data = { code: 401, message: 'Invalid token structure' };
        return next(err);
      }

      // Store info about the user
      socket.data.userId = userid;
      socket.data.role = role ?? null;      

      socket.join(`user:${userid}`);

      if (role !== undefined && role !== null) {
        socket.join(`role:${role}`);
      }

      return next();
    } catch (e) {
      const err = new Error('unauthorized');
      err.data = { code: 401, message: 'Invalid or expired token' };
      return next(err);
    }
  });

  io.on('connection', (socket) => {
    log.info(`Socket connected: user=${socket.data.userId}`);
    socket.emit('connected', { socketId: socket.id });
  });
};
