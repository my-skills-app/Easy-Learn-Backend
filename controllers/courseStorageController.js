const Course = require('../models/Course');

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({
            status: 'success',
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }
        res.json({
            status: 'success',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Create new course
const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({
            status: 'success',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Update course
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }
        res.json({
            status: 'success',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Delete course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }
        res.json({
            status: 'success',
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};
