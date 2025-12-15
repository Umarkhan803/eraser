const Canvas = require("../models/Canvas");
const Project = require("../models/Project");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get canvas by ID
// @route   GET /api/canvas/:id
// @access  Private
exports.getCanvas = asyncHandler(async (req, res, next) => {
  const canvas = await Canvas.findById(req.params.id)
    .populate("project")
    .populate("activeUsers.user", "name email avatar");

  if (!canvas) {
    return res.status(404).json({
      success: false,
      message: "Canvas not found",
    });
  }

  res.status(200).json({
    success: true,
    data: canvas,
  });
});

// @desc    Update canvas
// @route   PUT /api/canvas/:id
// @access  Private
exports.updateCanvas = asyncHandler(async (req, res, next) => {
  let canvas = await Canvas.findById(req.params.id);

  if (!canvas) {
    return res.status(404).json({
      success: false,
      message: "Canvas not found",
    });
  }

  const { objects, background, zoom, width, height } = req.body;

  // Update canvas
  if (objects !== undefined) canvas.objects = objects;
  if (background) canvas.background = background;
  if (zoom) canvas.zoom = zoom;
  if (width) canvas.width = width;
  if (height) canvas.height = height;

  canvas.version += 1;
  await canvas.save();

  // Emit update to other users via WebSocket
  const io = req.app.get("io");
  io.to(canvas.project.toString()).emit("canvas-updated", {
    canvasId: canvas._id,
    updatedBy: req.user.id,
    version: canvas.version,
  });

  res.status(200).json({
    success: true,
    data: canvas,
  });
});

// @desc    Save canvas version
// @route   POST /api/canvas/:id/save-version
// @access  Private
exports.saveCanvasVersion = asyncHandler(async (req, res, next) => {
  const canvas = await Canvas.findById(req.params.id);

  if (!canvas) {
    return res.status(404).json({
      success: false,
      message: "Canvas not found",
    });
  }

  // Add to history
  canvas.history.push({
    objects: canvas.objects,
    user: req.user.id,
    action: req.body.action || "update",
    timestamp: Date.now(),
  });

  await canvas.save();

  res.status(200).json({
    success: true,
    message: "Version saved successfully",
    data: canvas,
  });
});

// @desc    Get canvas history
// @route   GET /api/canvas/:id/history
// @access  Private
exports.getCanvasHistory = asyncHandler(async (req, res, next) => {
  const canvas = await Canvas.findById(req.params.id)
    .populate("history.user", "name email avatar")
    .select("history");

  if (!canvas) {
    return res.status(404).json({
      success: false,
      message: "Canvas not found",
    });
  }

  res.status(200).json({
    success: true,
    data: canvas.history,
  });
});

// @desc    Restore canvas version
// @route   PUT /api/canvas/:id/restore/:versionId
// @access  Private
exports.restoreCanvasVersion = asyncHandler(async (req, res, next) => {
  const canvas = await Canvas.findById(req.params.id);

  if (!canvas) {
    return res.status(404).json({
      success: false,
      message: "Canvas not found",
    });
  }

  const version = canvas.history.id(req.params.versionId);

  if (!version) {
    return res.status(404).json({
      success: false,
      message: "Version not found",
    });
  }

  // Restore objects from version
  canvas.objects = version.objects;
  canvas.version += 1;
  await canvas.save();

  res.status(200).json({
    success: true,
    message: "Canvas restored successfully",
    data: canvas,
  });
});

// @desc    Export canvas
// @route   POST /api/canvas/:id/export
// @access  Private
exports.exportCanvas = asyncHandler(async (req, res, next) => {
  const canvas = await Canvas.findById(req.params.id);

  if (!canvas) {
    return res.status(404).json({
      success: false,
      message: "Canvas not found",
    });
  }

  const { format = "json" } = req.body;

  // Return canvas data for export
  // In production, you'd generate actual image files here
  res.status(200).json({
    success: true,
    format,
    data: {
      objects: canvas.objects,
      background: canvas.background,
      width: canvas.width,
      height: canvas.height,
    },
  });
});

// @desc    Update canvas settings
// @route   PUT /api/canvas/:id/settings
// @access  Private
exports.updateCanvasSettings = asyncHandler(async (req, res, next) => {
  const canvas = await Canvas.findById(req.params.id);

  if (!canvas) {
    return res.status(404).json({
      success: false,
      message: "Canvas not found",
    });
  }

  const { gridEnabled, snapToGrid, gridSize } = req.body;

  if (gridEnabled !== undefined) canvas.gridEnabled = gridEnabled;
  if (snapToGrid !== undefined) canvas.snapToGrid = snapToGrid;
  if (gridSize) canvas.gridSize = gridSize;

  await canvas.save();

  res.status(200).json({
    success: true,
    data: canvas,
  });
});
