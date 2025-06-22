const express = require('express');
const router = express.Router();
const courseStorageController = require('../controllers/courseStorageController');
const { auth, admin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', courseStorageController.getAllCourses);
router.get('/:id', courseStorageController.getCourseById);

// Admin routes
router.post('/', auth, admin, courseStorageController.createCourse);
router.put('/:id', auth, admin, courseStorageController.updateCourse);
router.delete('/:id', auth, admin, courseStorageController.deleteCourse);

module.exports = router;
