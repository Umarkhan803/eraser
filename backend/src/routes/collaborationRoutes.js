const express = require("express");
const router = express.Router();
const {
  inviteCollaborator,
  getCollaborators,
  updateCollaboratorPermission,
  removeCollaborator,
  acceptInvitation,
  rejectInvitation,
  getPendingInvitations,
  leaveProject,
} = require("../controllers/collaborationController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Collaboration management
router.post("/:projectId/invite", inviteCollaborator);
router.get("/:projectId/collaborators", getCollaborators);
router.put("/:projectId/collaborators/:userId", updateCollaboratorPermission);
router.delete("/:projectId/collaborators/:userId", removeCollaborator);

// Invitation management
router.get("/invitations/pending", getPendingInvitations);
router.post("/invitations/:invitationId/accept", acceptInvitation);
router.post("/invitations/:invitationId/reject", rejectInvitation);

// Leave project
router.post("/:projectId/leave", leaveProject);

module.exports = router;
