const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authenticate socket connection
exports.authenticateSocket = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};

// Rate limiting for socket events
exports.rateLimitSocket = (eventsPerMinute = 60) => {
  const limits = new Map();

  return (socket, next) => {
    const socketId = socket.id;
    const now = Date.now();
    const windowMs = 60000; // 1 minute

    if (!limits.has(socketId)) {
      limits.set(socketId, { count: 0, resetTime: now + windowMs });
    }

    const limit = limits.get(socketId);

    if (now > limit.resetTime) {
      limit.count = 0;
      limit.resetTime = now + windowMs;
    }

    if (limit.count >= eventsPerMinute) {
      return next(new Error("Rate limit exceeded"));
    }

    limit.count++;
    next();
  };
};

// Clean up on disconnect
exports.cleanupOnDisconnect = (socket) => {
  socket.on("disconnect", () => {
    // Clean up any socket-specific data
    console.log(`Cleaning up socket: ${socket.id}`);
  });
};
