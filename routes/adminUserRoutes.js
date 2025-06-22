const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { auth, admin } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(auth, admin);

// Get all users
router.get('/', adminUserController.getAllUsers);

// Get single user
router.get('/:id', adminUserController.getUserById);

// Update user role
router.put('/:id/role', adminUserController.updateUserRole);

// Delete user
router.delete('/:id', adminUserController.deleteUser);

module.exports = router;
