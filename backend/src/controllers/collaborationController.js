const Project = require("../models/Project");
const User = require("../models/User");
const Notification = require("../models/Notification");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Invite collaborator to project
// @route   POST /api/collaboration/:projectId/invite
// @access  Private
exports.inviteCollaborator = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

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
      message: "Only project owner can invite collaborators",
    });
  }

  const { email, permission = "edit" } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with that email",
    });
  }

  // Check if user is already a collaborator
  const isCollaborator = project.collaborators.some(
    (collab) => collab.user.toString() === user._id.toString()
  );

  if (isCollaborator) {
    return res.status(400).json({
      success: false,
      message: "User is already a collaborator",
    });
  }

  // Add collaborator
  project.collaborators.push({
    user: user._id,
    permission,
  });

  await project.save();

  // Create notification
  await Notification.create({
    recipient: user._id,
    sender: req.user.id,
    type: "invite",
    message: `${req.user.name} invited you to collaborate on "${project.title}"`,
    relatedProject: project._id,
    link: `/projects/${project._id}`,
  });

  await project.populate("collaborators.user", "name email avatar");

  res.status(200).json({
    success: true,
    message: "Collaborator invited successfully",
    data: project,
  });
});

// @desc    Get all collaborators for a project
// @route   GET /api/collaboration/:projectId/collaborators
// @access  Private
exports.getCollaborators = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId)
    .populate("owner", "name email avatar")
    .populate("collaborators.user", "name email avatar");

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      owner: project.owner,
      collaborators: project.collaborators,
    },
  });
});

// @desc    Update collaborator permission
// @route   PUT /api/collaboration/:projectId/collaborators/:userId
// @access  Private
exports.updateCollaboratorPermission = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

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
      message: "Only project owner can update permissions",
    });
  }

  const { permission } = req.body;

  // Find and update collaborator
  const collaborator = project.collaborators.find(
    (collab) => collab.user.toString() === req.params.userId
  );

  if (!collaborator) {
    return res.status(404).json({
      success: false,
      message: "Collaborator not found",
    });
  }

  collaborator.permission = permission;
  await project.save();

  res.status(200).json({
    success: true,
    message: "Permission updated successfully",
    data: project,
  });
});

// @desc    Remove collaborator from project
// @route   DELETE /api/collaboration/:projectId/collaborators/:userId
// @access  Private
exports.removeCollaborator = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

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
      message: "Only project owner can remove collaborators",
    });
  }

  // Remove collaborator
  project.collaborators = project.collaborators.filter(
    (collab) => collab.user.toString() !== req.params.userId
  );

  await project.save();

  res.status(200).json({
    success: true,
    message: "Collaborator removed successfully",
  });
});

// @desc    Accept invitation
// @route   POST /api/collaboration/invitations/:invitationId/accept
// @access  Private
exports.acceptInvitation = asyncHandler(async (req, res, next) => {
  // Implementation depends on your invitation system
  res.status(200).json({
    success: true,
    message: "Invitation accepted",
  });
});

// @desc    Reject invitation
// @route   POST /api/collaboration/invitations/:invitationId/reject
// @access  Private
exports.rejectInvitation = asyncHandler(async (req, res, next) => {
  // Implementation depends on your invitation system
  res.status(200).json({
    success: true,
    message: "Invitation rejected",
  });
});

// @desc    Get pending invitations
// @route   GET /api/collaboration/invitations/pending
// @access  Private
exports.getPendingInvitations = asyncHandler(async (req, res, next) => {
  const invitations = await Notification.find({
    recipient: req.user.id,
    type: "invite",
    isRead: false,
  })
    .populate("sender", "name email avatar")
    .populate("relatedProject", "title description")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: invitations.length,
    data: invitations,
  });
});

// @desc    Leave project
// @route   POST /api/collaboration/:projectId/leave
// @access  Private
exports.leaveProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // Check if user is owner
  if (project.owner.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "Project owner cannot leave the project",
    });
  }

  // Remove user from collaborators
  project.collaborators = project.collaborators.filter(
    (collab) => collab.user.toString() !== req.user.id
  );

  await project.save();

  res.status(200).json({
    success: true,
    message: "You have left the project",
  });
});
