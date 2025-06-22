const express = require('express');
const { body } = require('express-validator');
const { register, login, getMyCourses } = require('../controllers/authController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], login);

// Get my courses (protected route)
router.get('/my-courses', auth, getMyCourses);

module.exports = router;
