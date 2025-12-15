const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
      error: error.message,
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user owns the resource or is admin
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // Check if user is owner or admin
      if (
        resource.owner.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this resource",
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking ownership",
        error: error.message,
      });
    }
  };
};

// Check if user has permission to edit project
exports.checkProjectPermission = async (req, res, next) => {
  try {
    const Project = require("../models/Project");
    const project = await Project.findById(
      req.params.projectId || req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner
    if (project.owner.toString() === req.user.id) {
      req.project = project;
      req.userPermission = "admin";
      return next();
    }

    // Check if user is collaborator
    const collaborator = project.collaborators.find(
      (collab) => collab.user.toString() === req.user.id
    );

    if (!collaborator) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this project",
      });
    }

    req.project = project;
    req.userPermission = collaborator.permission;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking project permission",
      error: error.message,
    });
  }
};
