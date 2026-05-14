const User = require('../models/User');

// ─────────────────────────────────────────────
//  ADMIN-ONLY CONTROLLERS
// ─────────────────────────────────────────────

// @desc    Get all users
// @route   GET /api/users
// @access  Private — Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching users.' });
  }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private — Admin only
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user.' });
  }
};

// @desc    Delete any user
// @route   DELETE /api/users/:id
// @access  Private — Admin only
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: `User '${user.name}' has been deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting user.' });
  }
};

// ─────────────────────────────────────────────
//  STUDENT CONTROLLERS (own profile only)
// ─────────────────────────────────────────────

// @desc    Get own profile
// @route   GET /api/users/profile/me
// @access  Private — Student & Admin
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};

// @desc    Update own profile (name, bio, enrolledCourses)
// @route   PUT /api/users/profile/me
// @access  Private — Student & Admin
const updateMyProfile = async (req, res) => {
  try {
    // Only allow safe fields to be updated
    const allowedFields = ['name', 'bio', 'enrolledCourses'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update. Allowed: name, bio, enrolledCourses.',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
