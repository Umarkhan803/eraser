const Comment = require("../models/Comment");
const Canvas = require("../models/Canvas");
const Notification = require("../models/Notification");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all comments for a canvas
// @route   GET /api/comments/canvas/:canvasId
// @access  Private
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ canvas: req.params.canvasId })
    .populate("user", "name email avatar")
    .populate("replies.user", "name email avatar")
    .populate("resolvedBy", "name email avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

// @desc    Create comment
// @route   POST /api/comments/canvas/:canvasId
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  const canvas = await Canvas.findById(req.params.canvasId);

  if (!canvas) {
    return res.status(404).json({
      success: false,
      message: "Canvas not found",
    });
  }

  const comment = await Comment.create({
    canvas: req.params.canvasId,
    user: req.user.id,
    content: req.body.content,
    position: req.body.position,
    objectId: req.body.objectId,
  });

  await comment.populate("user", "name email avatar");

  // Emit comment to other users via WebSocket
  const io = req.app.get("io");
  io.to(canvas.project.toString()).emit("new-comment", comment);

  res.status(201).json({
    success: true,
    data: comment,
  });
});

// @desc    Update comment
// @route   PUT /api/comments
//:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }
  // Check if user is comment owner
  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this comment",
    });
  }
  comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content },
    { new: true, runValidators: true }
  ).populate("user", "name email avatar");
  res.status(200).json({
    success: true,
    data: comment,
  });
});
// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }
  // Check if user is comment owner
  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this comment",
    });
  }
  await comment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
// @desc    Add reply to comment
// @route   POST /api/comments/:id/replies
// @access  Private
exports.addReply = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }
  comment.replies.push({
    user: req.user.id,
    content: req.body.content,
  });
  await comment.save();
  await comment.populate("replies.user", "name email avatar");
  res.status(200).json({
    success: true,
    data: comment,
  });
});
// @desc    Delete reply
// @route   DELETE /api/comments/:id/replies/:replyId
// @access  Private
exports.deleteReply = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }
  const reply = comment.replies.id(req.params.replyId);
  if (!reply) {
    return res.status(404).json({
      success: false,
      message: "Reply not found",
    });
  }
  // Check if user is reply owner
  if (reply.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this reply",
    });
  }
  reply.deleteOne();
  await comment.save();
  res.status(200).json({
    success: true,
    message: "Reply deleted successfully",
  });
});
// @desc    Resolve comment
// @route   PUT /api/comments/:id/resolve
// @access  Private
exports.resolveComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }
  comment.isResolved = !comment.isResolved;
  comment.resolvedBy = comment.isResolved ? req.user.id : null;
  comment.resolvedAt = comment.isResolved ? Date.now() : null;
  await comment.save();
  res.status(200).json({
    success: true,
    data: comment,
  });
});
// @desc    Add reaction to comment
// @route   POST /api/comments/:id/reactions
// @access  Private
exports.addReaction = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }
  const { emoji } = req.body;
  // Check if user already reacted with this emoji
  const existingReaction = comment.reactions.find(
    (reaction) =>
      reaction.user.toString() === req.user.id && reaction.emoji === emoji
  );
  if (existingReaction) {
    return res.status(400).json({
      success: false,
      message: "You have already reacted with this emoji",
    });
  }
  comment.reactions.push({
    user: req.user.id,
    emoji,
  });
  await comment.save();
  res.status(200).json({
    success: true,
    data: comment,
  });
});
// @desc    Remove reaction from comment
// @route   DELETE /api/comments/:id/reactions/:emoji
// @access  Private
exports.removeReaction = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }
  comment.reactions = comment.reactions.filter(
    (reaction) =>
      !(
        reaction.user.toString() === req.user.id &&
        reaction.emoji === req.params.emoji
      )
  );
  await comment.save();
  res.status(200).json({
    success: true,
    message: "Reaction removed successfully",
  });
});
