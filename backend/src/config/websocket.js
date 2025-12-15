const { Server } = require("socket.io");
const { authenticateSocket } = require("../websocket/middleware");

const initializeWebSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply authentication middleware
  io.use(authenticateSocket);

  // Handle errors
  io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });

  return io;
};

module.exports = initializeWebSocket;
