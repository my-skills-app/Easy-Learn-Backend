const Course = require('../models/Course');

// 1. Sabhi Courses Dekhna
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({
            status: 'success',
            data: courses
        });
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// 2. Ek Course Ki Detail Dekhna
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
        console.error('Error getting course:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// 3. Naya Course Add Karna
const createCourse = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['title', 'description', 'instructor', 'duration', 'price'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            instructor: req.body.instructor,
            duration: req.body.duration,
            price: req.body.price,
            thumbnail: req.body.thumbnail || '', // Optional thumbnail field
            batchLink: req.body.batchLink || 'nobatch' // Optional batch link field
        });
        await course.save();
        res.status(201).json({
            status: 'success',
            message: 'Course created successfully',
            data: course
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// 4. Course Update Karna
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                instructor: req.body.instructor,
                duration: req.body.duration,
                price: req.body.price
            },
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
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// 5. Course Delete Karna
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
        console.error('Error deleting course:', error);
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
