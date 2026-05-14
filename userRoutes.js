const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  getMyProfile,
  updateMyProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// ── Student routes (own profile only) ──────────────────────
// GET  /api/users/profile/me  — view own profile
// PUT  /api/users/profile/me  — update own profile
// Note: these must be defined BEFORE /:id to avoid route conflicts
router.get('/profile/me', protect, getMyProfile);
router.put('/profile/me', protect, updateMyProfile);

// ── Admin-only routes ───────────────────────────────────────
// GET    /api/users      — list all users
// GET    /api/users/:id  — get user by ID
// DELETE /api/users/:id  — delete a user
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
