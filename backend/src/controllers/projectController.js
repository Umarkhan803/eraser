const Project = require("../models/Project");
const Canvas = require("../models/Canvas");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    folder,
    isFavorite,
    status,
  } = req.query;

  const query = {
    $or: [{ owner: req.user.id }, { "collaborators.user": req.user.id }],
  };

  // Add filters
  if (search) {
    query.$text = { $search: search };
  }
  if (folder) {
    query.folder = folder;
  }
  if (isFavorite !== undefined) {
    query.isFavorite = isFavorite === "true";
  }
  if (status) {
    query.status = status;
  }

  const projects = await Project.find(query)
    .populate("owner", "name email avatar")
    .populate("collaborators.user", "name email avatar")
    .sort({ lastAccessed: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Project.countDocuments(query);

  res.status(200).json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: projects,
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email avatar")
    .populate("collaborators.user", "name email avatar")
    .populate("canvas");

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // Check if user has access
  const hasAccess =
    project.owner._id.toString() === req.user.id ||
    project.collaborators.some(
      (collab) => collab.user._id.toString() === req.user.id
    ) ||
    project.isPublic;

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this project",
    });
  }

  // Update last accessed
  project.lastAccessed = Date.now();
  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add user as owner
  req.body.owner = req.user.id;

  // Create canvas for the project
  const canvas = await Canvas.create({
    project: null, // Will update after project creation
    objects: [],
    background: "#ffffff",
  });

  // Create project
  const project = await Project.create({
    ...req.body,
    canvas: canvas._id,
  });

  // Update canvas with project reference
  canvas.project = project._id;
  await canvas.save();

  // Populate project data
  await project.populate("owner", "name email avatar");

  res.status(201).json({
    success: true,
    data: project,
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // Check if user is owner
  if (project.owner.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this project",
    });
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("owner", "name email avatar");

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // Check if user is owner
  if (project.owner.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this project",
    });
  }

  // Delete associated canvas
  await Canvas.findByIdAndDelete(project.canvas);

  // Delete project
  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

// @desc    Duplicate project
// @route   POST /api/projects/:id/duplicate
// @access  Private
exports.duplicateProject = asyncHandler(async (req, res, next) => {
  const originalProject = await Project.findById(req.params.id);

  if (!originalProject) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // Get original canvas
  const originalCanvas = await Canvas.findById(originalProject.canvas);

  // Create new canvas
  const newCanvas = await Canvas.create({
    project: null,
    objects: originalCanvas.objects,
    background: originalCanvas.background,
    width: originalCanvas.width,
    height: originalCanvas.height,
  });

  // Create new project
  const newProject = await Project.create({
    title: `${originalProject.title} (Copy)`,
    description: originalProject.description,
    owner: req.user.id,
    canvas: newCanvas._id,
    tags: originalProject.tags,
  });

  // Update canvas with project reference
  newCanvas.project = newProject._id;
  await newCanvas.save();

  await newProject.populate("owner", "name email avatar");

  res.status(201).json({
    success: true,
    data: newProject,
  });
});

// @desc    Toggle favorite status
// @route   PUT /api/projects/:id/favorite
// @access  Private
exports.toggleFavorite = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // Toggle favorite
  project.isFavorite = !project.isFavorite;
  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Get shared projects
// @route   GET /api/projects/shared/all
// @access  Private
exports.getSharedProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({
    "collaborators.user": req.user.id,
  })
    .populate("owner", "name email avatar")
    .populate("collaborators.user", "name email avatar")
    .sort({ lastAccessed: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

// @desc    Update project thumbnail
// @route   PUT /api/projects/:id/thumbnail
// @access  Private
exports.updateProjectThumbnail = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  project.thumbnail = req.body.thumbnail;
  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});
