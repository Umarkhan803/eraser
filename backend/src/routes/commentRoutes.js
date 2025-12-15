const express = require("express");
const router = express.Router();
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  addReply,
  deleteReply,
  resolveComment,
  addReaction,
  removeReaction,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Comment CRUD operations
router.route("/canvas/:canvasId").get(getComments).post(createComment);

router.route("/:id").put(updateComment).delete(deleteComment);

// Comment replies
router.post("/:id/replies", addReply);
router.delete("/:id/replies/:replyId", deleteReply);

// Comment actions
router.put("/:id/resolve", resolveComment);
router.post("/:id/reactions", addReaction);
router.delete("/:id/reactions/:emoji", removeReaction);

module.exports = router;
