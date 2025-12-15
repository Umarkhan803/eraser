const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    isVerified: req.body.isVerified,
    avatar: req.body.avatar,
  };

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// @desc    Search users by name/email
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q || "";

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  })
    .select("name email avatar role")
    .limit(10);

  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Upload or update avatar
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarUrl },
    { new: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    data: user,
  });
});
