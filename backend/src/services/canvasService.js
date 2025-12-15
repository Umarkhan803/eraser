const Canvas = require("../models/Canvas");
const Project = require("../models/Project");

class CanvasService {
  // Create new canvas
  async createCanvas(projectId, initialData = {}) {
    const canvas = await Canvas.create({
      project: projectId,
      objects: initialData.objects || [],
      background: initialData.background || "#ffffff",
      width: initialData.width || 1920,
      height: initialData.height || 1080,
      zoom: initialData.zoom || 1,
    });

    return canvas;
  }

  // Get canvas by ID
  async getCanvasById(canvasId) {
    return await Canvas.findById(canvasId)
      .populate("project")
      .populate("activeUsers.user", "name email avatar");
  }

  // Get canvas by project ID
  async getCanvasByProjectId(projectId) {
    return await Canvas.findOne({ project: projectId });
  }

  // Update canvas objects
  async updateCanvasObjects(canvasId, objects, userId) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    canvas.objects = objects;
    canvas.version += 1;

    // Add to history
    canvas.history.push({
      objects: objects,
      user: userId,
      action: "update",
      timestamp: Date.now(),
    });

    await canvas.save();
    return canvas;
  }

  // Add object to canvas
  async addObject(canvasId, object, userId) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    canvas.objects.push(object);
    canvas.version += 1;

    // Add to history
    canvas.history.push({
      objects: canvas.objects,
      user: userId,
      action: "create",
      timestamp: Date.now(),
    });

    await canvas.save();
    return canvas;
  }

  // Delete object from canvas
  async deleteObject(canvasId, objectId, userId) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    canvas.objects = canvas.objects.filter((obj) => obj.id !== objectId);
    canvas.version += 1;

    // Add to history
    canvas.history.push({
      objects: canvas.objects,
      user: userId,
      action: "delete",
      timestamp: Date.now(),
    });

    await canvas.save();
    return canvas;
  }

  // Update canvas settings
  async updateSettings(canvasId, settings) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    if (settings.background) canvas.background = settings.background;
    if (settings.zoom) canvas.zoom = settings.zoom;
    if (settings.width) canvas.width = settings.width;
    if (settings.height) canvas.height = settings.height;
    if (settings.gridEnabled !== undefined)
      canvas.gridEnabled = settings.gridEnabled;
    if (settings.snapToGrid !== undefined)
      canvas.snapToGrid = settings.snapToGrid;
    if (settings.gridSize) canvas.gridSize = settings.gridSize;

    await canvas.save();
    return canvas;
  }

  // Save canvas version
  async saveVersion(canvasId, userId, action = "manual_save") {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    canvas.history.push({
      objects: canvas.objects,
      user: userId,
      action: action,
      timestamp: Date.now(),
    });

    await canvas.save();
    return canvas.history[canvas.history.length - 1];
  }

  // Get canvas history
  async getHistory(canvasId, limit = 50) {
    const canvas = await Canvas.findById(canvasId)
      .populate("history.user", "name email avatar")
      .select("history");

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    return canvas.history.slice(-limit).reverse();
  }

  // Restore canvas to specific version
  async restoreVersion(canvasId, versionId, userId) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    const version = canvas.history.id(versionId);

    if (!version) {
      throw new Error("Version not found");
    }

    // Save current state before restoring
    canvas.history.push({
      objects: canvas.objects,
      user: userId,
      action: "before_restore",
      timestamp: Date.now(),
    });

    canvas.objects = version.objects;
    canvas.version += 1;

    await canvas.save();
    return canvas;
  }

  // Add active user to canvas
  async addActiveUser(canvasId, userId, socketId, cursor = { x: 0, y: 0 }) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    // Remove existing entry for this user
    canvas.activeUsers = canvas.activeUsers.filter(
      (user) => user.user.toString() !== userId.toString()
    );

    // Add new entry
    canvas.activeUsers.push({
      user: userId,
      socketId: socketId,
      cursor: cursor,
      lastActive: Date.now(),
    });

    await canvas.save();
    return canvas;
  }

  // Remove active user from canvas
  async removeActiveUser(canvasId, socketId) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      return;
    }

    canvas.activeUsers = canvas.activeUsers.filter(
      (user) => user.socketId !== socketId
    );

    await canvas.save();
    return canvas;
  }

  // Update user cursor position
  async updateCursorPosition(canvasId, socketId, cursor) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      return;
    }

    const activeUser = canvas.activeUsers.find(
      (user) => user.socketId === socketId
    );

    if (activeUser) {
      activeUser.cursor = cursor;
      activeUser.lastActive = Date.now();
      await canvas.save();
    }

    return canvas;
  }

  // Export canvas data
  async exportCanvas(canvasId, format = "json") {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    const exportData = {
      objects: canvas.objects,
      background: canvas.background,
      width: canvas.width,
      height: canvas.height,
      version: canvas.version,
    };

    switch (format) {
      case "json":
        return JSON.stringify(exportData, null, 2);

      case "svg":
        // In production, convert canvas to SVG
        return this.convertToSVG(exportData);

      case "png":
        // In production, convert canvas to PNG
        return this.convertToPNG(exportData);

      default:
        return exportData;
    }
  }

  // Helper: Convert to SVG (placeholder)
  convertToSVG(canvasData) {
    // In production, implement actual SVG conversion
    return `<svg width="${canvasData.width}" height="${canvasData.height}"></svg>`;
  }

  // Helper: Convert to PNG (placeholder)
  convertToPNG(canvasData) {
    // In production, implement actual PNG conversion using libraries like sharp or canvas
    return "PNG conversion not implemented";
  }

  // Duplicate canvas
  async duplicateCanvas(canvasId, newProjectId) {
    const originalCanvas = await Canvas.findById(canvasId);

    if (!originalCanvas) {
      throw new Error("Canvas not found");
    }

    const newCanvas = await Canvas.create({
      project: newProjectId,
      objects: originalCanvas.objects,
      background: originalCanvas.background,
      width: originalCanvas.width,
      height: originalCanvas.height,
      zoom: originalCanvas.zoom,
      gridEnabled: originalCanvas.gridEnabled,
      snapToGrid: originalCanvas.snapToGrid,
      gridSize: originalCanvas.gridSize,
    });

    return newCanvas;
  }

  // Clear canvas
  async clearCanvas(canvasId, userId) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    // Save to history before clearing
    canvas.history.push({
      objects: canvas.objects,
      user: userId,
      action: "before_clear",
      timestamp: Date.now(),
    });

    canvas.objects = [];
    canvas.version += 1;

    await canvas.save();
    return canvas;
  }

  // Clean up old history entries
  async cleanupHistory(canvasId, keepLast = 50) {
    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    if (canvas.history.length > keepLast) {
      canvas.history = canvas.history.slice(-keepLast);
      await canvas.save();
    }

    return canvas;
  }
}

module.exports = new CanvasService();
