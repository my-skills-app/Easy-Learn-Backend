const Course = require('../models/Course');
const User = require('../models/User');

// Create course with batch link
const createCourse = async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            batchLink: req.body.batchLink || 'nobatch'
        });
        await course.save();
        res.status(201).json({
            status: 'success',
            data: course
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Get all courses with user-specific batch links
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        const userId = req.user?.userId;

        // If user is authenticated, check their enrollment status
        if (userId) {
            const user = await User.findById(userId);
            const enrolledCourses = user?.enrolledCourses || [];

            const coursesWithBatchLinks = courses.map(course => ({
                ...course.toObject(),
                batchLink: enrolledCourses.includes(course._id) 
                    ? course.batchLink 
                    : 'nobatch'
            }));

            res.json({
                status: 'success',
                data: coursesWithBatchLinks
            });
        } else {
            // For non-authenticated users, show 'nobatch' for all courses
            const coursesWithBatchLinks = courses.map(course => ({
                ...course.toObject(),
                batchLink: 'nobatch'
            }));

            res.json({
                status: 'success',
                data: coursesWithBatchLinks
            });
        }
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Get course details with user-specific batch link
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        const userId = req.user?.userId;
        let batchLink = 'nobatch';

        if (userId) {
            const user = await User.findById(userId);
            if (user?.enrolledCourses.includes(course._id)) {
                batchLink = course.batchLink;
            }
        }

        res.json({
            status: 'success',
            data: {
                ...course.toObject(),
                batchLink
            }
        });
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Update course batch link
const updateBatchLink = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        course.batchLink = req.body.batchLink || 'nobatch';
        await course.save();

        res.json({
            status: 'success',
            data: course
        });
    } catch (error) {
        console.error('Error updating batch link:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Assign course with batch link
const assignCourse = async (req, res) => {
    try {
        const { courseId, userId } = req.body;
        
        // Find course and user
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        if (!course || !user) {
            return res.status(404).json({
                status: 'error',
                message: 'Course or user not found'
            });
        }

        // Check if user is already enrolled
        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({
                status: 'error',
                message: 'User is already enrolled in this course'
            });
        }

        // Add course to user's enrolled courses
        user.enrolledCourses.push(courseId);
        await user.save();

        // Add user to course's enrolled students
        course.enrolledStudents.push(userId);
        await course.save();

        res.json({
            status: 'success',
            message: 'Course assigned successfully',
            data: {
                batchLink: course.batchLink
            }
        });
    } catch (error) {
        console.error('Error assigning course:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

const getMyCourses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('enrolledCourses');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Get only the courses that user is enrolled in
        const enrolledCourses = user.enrolledCourses.map(course => ({
            ...course.toObject(),
            batchLink: course.batchLink
        }));

        res.json({
            status: 'success',
            data: enrolledCourses
        });
    } catch (error) {
        console.error('Error getting user courses:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Get user's purchased batches
const getPurchasedBatches = async (req, res) => {
    try {
        console.log('Request received for purchased batches');
        console.log('User object:', req.user);
        
        if (!req.user || !req.user.userId) {
            console.log('No user ID found in request');
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - No user information found'
            });
        }

        const userId = req.user.userId;
        console.log('Looking for user with ID:', userId);

        const user = await User.findById(userId).populate('purchasedCourses');
        console.log('User found:', !!user);

        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        console.log('User has purchased courses:', user.purchasedCourses);

        if (!user.purchasedCourses || user.purchasedCourses.length === 0) {
            console.log('No purchased courses found for user');
            return res.json({
                status: 'success',
                message: 'No purchased courses found',
                data: []
            });
        }

        const courses = user.purchasedCourses.map(course => ({
            ...course.toObject(),
            batchLink: course.batchLink
        }));

        console.log('Successfully retrieved courses:', courses.length);
        res.json({
            status: 'success',
            data: courses
        });
    } catch (error) {
        console.error('Error in getPurchasedBatches:', error);
        console.error('Error stack:', error.stack);
        
        // Return more specific error messages based on error type
        if (error.name === 'CastError') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID format'
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Server error - ' + error.message
        });
    }
}

// Purchase course
const purchaseCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.userId;

        // Find course and user
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if user has already purchased this course
        if (user.purchasedCourses.includes(courseId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Course already purchased'
            });
        }

        // Add course to user's purchased courses
        user.purchasedCourses.push(courseId);
        await user.save();

        // Add user to course's purchased students
        course.purchasedStudents.push(userId);
        await course.save();

        res.json({
            status: 'success',
            message: 'Course purchased successfully',
            data: {
                batchLink: course.batchLink
            }
        });
    } catch (error) {
        console.error('Error purchasing course:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateBatchLink,
    assignCourse,
    getMyCourses,
    getPurchasedBatches,
    purchaseCourse
};
