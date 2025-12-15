const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables
dotenv.config();

// Import configurations
const connectDB = require("./config/database");
const initializeWebSocket = require("./config/websocket");

// Import middleware
const corsMiddleware = require("./middleware/cors");
const {
  apiLimiter,
  authLimiter,
  canvasLimiter,
  uploadLimiter,
} = require("./middleware/rateLimiter");
const { requestLogger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const { handleMulterError } = require("./middleware/upload");

// Import routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const canvasRoutes = require("./routes/canvasRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const templateRoutes = require("./routes/templateRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Import WebSocket handlers
const socketHandlers = require("./websocket/handlers");
const EVENTS = require("./websocket/events");

// Import utilities
const logger = require("./utils/logger");
const { formatBytes } = require("./utils/helpers");

// Initialize Express app
const app = express();
let io;

// Connect to Database
connectDB();

// Trust proxy (for rate limiting behind reverse proxies)
app.set("trust proxy", 1);

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Middleware
app.use(corsMiddleware);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie Parser Middleware
app.use(cookieParser());

// Request Logger Middleware
if (process.env.NODE_ENV === "development") {
  app.use(requestLogger);
}

// Static files - Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Info endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Eraser.io Clone API",
    version: "1.0.0",
    status: "active",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      projects: "/api/projects",
      canvas: "/api/canvas",
      collaboration: "/api/collaboration",
      comments: "/api/comments",
      users: "/api/users",
      templates: "/api/templates",
      notifications: "/api/notifications",
    },
    documentation: "/api/docs",
    websocket: {
      enabled: true,
      endpoint: process.env.CLIENT_URL || "http://localhost:5173",
    },
  });
});

// API Routes with rate limiting

// Auth routes with stricter rate limiting
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth", authRoutes);

// Canvas routes with moderate rate limiting
app.use("/api/canvas", canvasLimiter);
app.use("/api/canvas", canvasRoutes);

// General API rate limiting
app.use("/api/", apiLimiter);

// Other API routes
app.use("/api/projects", projectRoutes);
app.use("/api/collaboration", collaborationRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/notifications", notificationRoutes);

// Multer error handling middleware
app.use(handleMulterError);

// WebSocket connection handling
io.on(EVENTS.CONNECTION, (socket) => {
  const userId = socket.user?.id;
  const userName = socket.user?.name;

  logger.info(`User connected: ${userName} (${userId}) - Socket: ${socket.id}`);

  // Initialize socket handlers
  socketHandlers(io, socket);

  // Handle socket errors
  socket.on(EVENTS.ERROR, (error) => {
    logger.error(`Socket error for ${socket.id}:`, error);
  });

  // Handle disconnection
  socket.on(EVENTS.DISCONNECT, (reason) => {
    logger.info(
      `User disconnected: ${userName} (${userId}) - Reason: ${reason}`
    );
  });
});

// WebSocket error handling
io.engine.on("connection_error", (err) => {
  logger.error("WebSocket connection error:", {
    code: err.code,
    message: err.message,
    context: err.context,
  });
});

// 404 handler - Must be after all routes
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.url,
    method: req.method,
  });
});

// Global Error Handler - Must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

httpServer.listen(PORT, HOST, () => {
  logger.info(`Server running on port https://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);

  if (process.env.NODE_ENV === "production") {
    // In production, gracefully shutdown
    logger.error("Shutting down server due to unhandled rejection...");
    httpServer.close(() => {
      process.exit(1);
    });
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);

  // Exit process in production
  if (process.env.NODE_ENV === "production") {
    logger.error("Shutting down server due to uncaught exception...");
    process.exit(1);
  }
});

// Handle SIGTERM signal (graceful shutdown)
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  httpServer.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

// Handle SIGINT signal (Ctrl+C)
process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  httpServer.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

// Periodic cleanup tasks (run every hour)
if (process.env.NODE_ENV === "production") {
  const storageService = require("./services/storageService");
  const canvasService = require("./services/canvasService");
  const notificationService = require("./services/notificationService");

  setInterval(async () => {
    try {
      logger.info("Running periodic cleanup tasks...");

      // Clean up old files (older than 30 days)
      await storageService.cleanupOldFiles(30);

      // Clean up old notifications (older than 30 days)
      const deletedCount = await notificationService.cleanupOldNotifications(
        30
      );
      logger.info(`Cleaned up ${deletedCount} old notifications`);

      // Get storage stats
      const stats = await storageService.getStorageStats();
      logger.info(
        `Storage stats: ${stats.fileCount} files, ${stats.totalSizeMB} MB`
      );

      logger.info("Periodic cleanup tasks completed");
    } catch (error) {
      logger.error("Error running cleanup tasks:", error);
    }
  }, 60 * 60 * 1000); // Run every hour
}

// Export for testing
module.exports = { app, httpServer, io };
