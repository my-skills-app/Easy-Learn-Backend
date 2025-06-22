const express = require('express');
const { updateCourseThumbnail } = require('../controllers/adminCourseController');
const { auth, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// 1. Course thumbnail update (Admin only)
router.put('/thumbnail/:courseId', auth, admin, updateCourseThumbnail);

module.exports = router;
