const asyncHandler = require("../middleware/asyncHandler");
const Template = require("../models/Template");
const { createNotification } = require("../services/notificationService");

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
const getTemplates = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const category = req.query.category;
  const search = req.query.search;

  let query = { isPublic: true };

  if (category && category !== "all") {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const templates = await Template.find(query)
    .populate("createdBy", "name avatar")
    .sort({ usageCount: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-objects"); // Don't send canvas objects in list

  const total = await Template.countDocuments(query);

  res.status(200).json({
    success: true,
    data: templates,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Public
const getTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id).populate(
    "createdBy",
    "name avatar"
  );

  if (!template) {
    return res.status(404).json({
      success: false,
      message: "Template not found",
    });
  }

  // Increment usage count
  template.usageCount += 1;
  await template.save();

  res.status(200).json({
    success: true,
    data: template,
  });
});

// @desc    Create template
// @route   POST /api/templates
// @access  Private/Admin
const createTemplate = asyncHandler(async (req, res) => {
  const { title, description, category, objects, isPremium, isPublic, tags } =
    req.body;

  const template = await Template.create({
    title,
    description,
    category,
    objects,
    isPremium: isPremium || false,
    isPublic: isPublic !== undefined ? isPublic : true,
    tags,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: template,
  });
});

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private/Admin
const updateTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return res.status(404).json({
      success: false,
      message: "Template not found",
    });
  }

  const { title, description, category, objects, isPremium, isPublic, tags } =
    req.body;

  template.title = title || template.title;
  template.description = description || template.description;
  template.category = category || template.category;
  template.objects = objects || template.objects;
  template.isPremium = isPremium !== undefined ? isPremium : template.isPremium;
  template.isPublic = isPublic !== undefined ? isPublic : template.isPublic;
  template.tags = tags || template.tags;

  await template.save();

  res.status(200).json({
    success: true,
    data: template,
  });
});

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private/Admin
const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return res.status(404).json({
      success: false,
      message: "Template not found",
    });
  }

  await template.remove();

  res.status(200).json({
    success: true,
    message: "Template deleted",
  });
});

// @desc    Use template (create project from template)
// @route   POST /api/templates/:id/use
// @access  Private
const useTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return res.status(404).json({
      success: false,
      message: "Template not found",
    });
  }

  // Check if premium template and user has access
  if (template.isPremium && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Premium template access required",
    });
  }

  // Here you would typically create a new project/canvas with the template objects
  // For now, just return the template data
  res.status(200).json({
    success: true,
    data: {
      template: template._id,
      objects: template.objects,
      title: template.title,
    },
  });
});

// @desc    Get templates by category
// @route   GET /api/templates/category/:category
// @access  Public
const getTemplatesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  const templates = await Template.find({
    category,
    isPublic: true,
  })
    .populate("createdBy", "name avatar")
    .sort({ usageCount: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-objects");

  const total = await Template.countDocuments({
    category,
    isPublic: true,
  });

  res.status(200).json({
    success: true,
    data: templates,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

module.exports = {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  useTemplate,
  getTemplatesByCategory,
};
