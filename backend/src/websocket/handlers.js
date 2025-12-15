const Canvas = require("../models/Canvas");
const Project = require("../models/Project");
const User = require("../models/User");
const canvasService = require("../services/canvasService");

module.exports = (io, socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a canvas/project room
  socket.on("join-canvas", async (data) => {
    try {
      const { canvasId, userId } = data;

      // Verify user has access to canvas
      const canvas = await Canvas.findById(canvasId).populate("project");

      if (!canvas) {
        socket.emit("error", { message: "Canvas not found" });
        return;
      }

      // Join the room
      socket.join(canvasId);

      // Add user to active users
      await canvasService.addActiveUser(canvasId, userId, socket.id);

      // Get updated active users list
      const updatedCanvas = await Canvas.findById(canvasId).populate(
        "activeUsers.user",
        "name email avatar"
      );

      // Notify all users in the room
      io.to(canvasId).emit("user-joined", {
        userId,
        activeUsers: updatedCanvas.activeUsers,
      });

      console.log(`User ${userId} joined canvas ${canvasId}`);
    } catch (error) {
      console.error("Error joining canvas:", error);
      socket.emit("error", { message: "Failed to join canvas" });
    }
  });

  // Leave a canvas/project room
  socket.on("leave-canvas", async (data) => {
    try {
      const { canvasId, userId } = data;

      socket.leave(canvasId);

      // Remove user from active users
      await canvasService.removeActiveUser(canvasId, socket.id);

      // Notify other users
      io.to(canvasId).emit("user-left", { userId, socketId: socket.id });

      console.log(`User ${userId} left canvas ${canvasId}`);
    } catch (error) {
      console.error("Error leaving canvas:", error);
    }
  });

  // Canvas update (drawing, moving objects, etc.)
  socket.on("canvas-update", async (data) => {
    try {
      const { canvasId, objects, userId, action } = data;

      // Update canvas in database
      await canvasService.updateCanvasObjects(canvasId, objects, userId);

      // Broadcast to all users in the room except sender
      socket.to(canvasId).emit("canvas-update", {
        objects,
        userId,
        action,
        timestamp: Date.now(),
      });

      console.log(`Canvas ${canvasId} updated by user ${userId}`);
    } catch (error) {
      console.error("Error updating canvas:", error);
      socket.emit("error", { message: "Failed to update canvas" });
    }
  });

  // Real-time cursor movement
  socket.on("cursor-move", async (data) => {
    try {
      const { canvasId, userId, cursor } = data;

      // Update cursor position in database
      await canvasService.updateCursorPosition(canvasId, socket.id, cursor);

      // Broadcast cursor position to other users
      socket.to(canvasId).emit("cursor-update", {
        userId,
        socketId: socket.id,
        cursor,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error updating cursor:", error);
    }
  });

  // Object selection
  socket.on("object-selected", (data) => {
    const { canvasId, objectId, userId } = data;

    socket.to(canvasId).emit("object-selected", {
      objectId,
      userId,
      socketId: socket.id,
    });
  });

  // Object deselection
  socket.on("object-deselected", (data) => {
    const { canvasId, objectId, userId } = data;

    socket.to(canvasId).emit("object-deselected", {
      objectId,
      userId,
    });
  });

  // Add new object
  socket.on("object-added", async (data) => {
    try {
      const { canvasId, object, userId } = data;

      await canvasService.addObject(canvasId, object, userId);

      socket.to(canvasId).emit("object-added", {
        object,
        userId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error adding object:", error);
      socket.emit("error", { message: "Failed to add object" });
    }
  });

  // Delete object
  socket.on("object-deleted", async (data) => {
    try {
      const { canvasId, objectId, userId } = data;

      await canvasService.deleteObject(canvasId, objectId, userId);

      socket.to(canvasId).emit("object-deleted", {
        objectId,
        userId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error deleting object:", error);
      socket.emit("error", { message: "Failed to delete object" });
    }
  });

  // Update object properties
  socket.on("object-updated", (data) => {
    const { canvasId, objectId, properties, userId } = data;

    socket.to(canvasId).emit("object-updated", {
      objectId,
      properties,
      userId,
      timestamp: Date.now(),
    });
  });

  // Typing indicator for comments
  socket.on("typing-start", (data) => {
    const { canvasId, userId, userName } = data;

    socket.to(canvasId).emit("user-typing", {
      userId,
      userName,
    });
  });

  socket.on("typing-stop", (data) => {
    const { canvasId, userId } = data;

    socket.to(canvasId).emit("user-stopped-typing", {
      userId,
    });
  });

  // New comment notification
  socket.on("new-comment", (data) => {
    const { canvasId, comment, userId } = data;

    socket.to(canvasId).emit("comment-added", {
      comment,
      userId,
      timestamp: Date.now(),
    });
  });

  // Comment resolved
  socket.on("comment-resolved", (data) => {
    const { canvasId, commentId, userId } = data;

    socket.to(canvasId).emit("comment-resolved", {
      commentId,
      userId,
      timestamp: Date.now(),
    });
  });

  // Undo/Redo operations
  socket.on("undo", (data) => {
    const { canvasId, userId } = data;

    socket.to(canvasId).emit("undo-performed", {
      userId,
      timestamp: Date.now(),
    });
  });

  socket.on("redo", (data) => {
    const { canvasId, userId } = data;

    socket.to(canvasId).emit("redo-performed", {
      userId,
      timestamp: Date.now(),
    });
  });

  // Zoom change
  socket.on("zoom-change", (data) => {
    const { canvasId, zoom, userId } = data;

    socket.to(canvasId).emit("zoom-changed", {
      zoom,
      userId,
    });
  });

  // Pan change
  socket.on("pan-change", (data) => {
    const { canvasId, pan, userId } = data;

    socket.to(canvasId).emit("pan-changed", {
      pan,
      userId,
    });
  });

  // Handle disconnection
  socket.on("disconnect", async () => {
    try {
      console.log(`User disconnected: ${socket.id}`);

      // Find all canvases where this socket was active and remove the user
      const canvases = await Canvas.find({
        "activeUsers.socketId": socket.id,
      });

      for (const canvas of canvases) {
        const user = canvas.activeUsers.find((u) => u.socketId === socket.id);

        if (user) {
          await canvasService.removeActiveUser(canvas._id, socket.id);

          // Notify other users
          io.to(canvas._id.toString()).emit("user-left", {
            userId: user.user,
            socketId: socket.id,
          });
        }
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
};
