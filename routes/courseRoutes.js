const express = require('express');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/basicCourseController');
const { getMyCourses, assignCourse } = require('../controllers/courseController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

// 3. Naya Course Add Karna
router.post('/', createCourse);

// 7. Course assign karna (Admin API)
router.post('/assign', auth, assignCourse);

// 6. Student ke assigned courses dekhna (Protected route)
router.get('/my-courses', auth, getMyCourses);

// 1. Sabhi Courses Dekhna (Public)
router.get('/', getAllCourses);

// 2. Ek Course Ki Detail Dekhna (Public)
router.get('/:id', getCourseById);

// 4. Course Update Karna (Admin)
router.put('/:id', auth, updateCourse);

// 5. Course Delete Karna (Admin)
router.delete('/:id', auth, deleteCourse);

module.exports = router;
