const Project = require("../models/Project");
const Canvas = require("../models/Canvas");
const canvasService = require("./canvasService");

class ProjectService {
  // Create project with canvas
  async createProject(userId, projectData) {
    // Create canvas first
    const canvas = await canvasService.createCanvas(
      null,
      projectData.canvasData
    );

    // Create project
    const project = await Project.create({
      title: projectData.title,
      description: projectData.description,
      owner: userId,
      canvas: canvas._id,
      tags: projectData.tags || [],
      folder: projectData.folder || "Uncategorized",
    });

    // Update canvas with project reference
    canvas.project = project._id;
    await canvas.save();

    return await project.populate("owner", "name email avatar");
  }

  // Get user projects
  async getUserProjects(userId, filters = {}) {
    const query = {
      $or: [{ owner: userId }, { "collaborators.user": userId }],
    };

    if (filters.folder) {
      query.folder = filters.folder;
    }

    if (filters.isFavorite !== undefined) {
      query.isFavorite = filters.isFavorite;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    return await Project.find(query)
      .populate("owner", "name email avatar")
      .populate("collaborators.user", "name email avatar")
      .sort({ lastAccessed: -1 });
  }

  // Duplicate project
  async duplicateProject(projectId, userId) {
    const original = await Project.findById(projectId);

    if (!original) {
      throw new Error("Project not found");
    }

    // Duplicate canvas
    const newCanvas = await canvasService.duplicateCanvas(
      original.canvas,
      null
    );

    // Create new project
    const newProject = await Project.create({
      title: `${original.title} (Copy)`,
      description: original.description,
      owner: userId,
      canvas: newCanvas._id,
      tags: original.tags,
      folder: original.folder,
    });

    // Update canvas project reference
    newCanvas.project = newProject._id;
    await newCanvas.save();

    return newProject;
  }

  // Check user access to project
  async checkAccess(projectId, userId) {
    const project = await Project.findById(projectId);

    if (!project) {
      return { hasAccess: false, permission: null };
    }

    // Check if owner
    if (project.owner.toString() === userId.toString()) {
      return { hasAccess: true, permission: "admin" };
    }

    // Check if collaborator
    const collaborator = project.collaborators.find(
      (c) => c.user.toString() === userId.toString()
    );

    if (collaborator) {
      return { hasAccess: true, permission: collaborator.permission };
    }

    // Check if public
    if (project.isPublic) {
      return { hasAccess: true, permission: "view" };
    }

    return { hasAccess: false, permission: null };
  }

  // Update last accessed
  async updateLastAccessed(projectId) {
    await Project.findByIdAndUpdate(projectId, { lastAccessed: Date.now() });
  }

  // Get project statistics
  async getProjectStats(userId) {
    const ownedCount = await Project.countDocuments({
      owner: userId,
      status: "active",
    });
    const sharedCount = await Project.countDocuments({
      "collaborators.user": userId,
      status: "active",
    });
    const favoriteCount = await Project.countDocuments({
      $or: [{ owner: userId }, { "collaborators.user": userId }],
      isFavorite: true,
      status: "active",
    });

    return {
      ownedProjects: ownedCount,
      sharedProjects: sharedCount,
      favoriteProjects: favoriteCount,
      totalProjects: ownedCount + sharedCount,
    };
  }
}

module.exports = new ProjectService();
