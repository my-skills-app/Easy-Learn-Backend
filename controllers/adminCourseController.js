const Course = require('../models/Course');

// Update course thumbnail
const updateCourseThumbnail = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { thumbnail } = req.body;

        // Validate inputs
        if (!courseId || !thumbnail) {
            return res.status(400).json({
                status: 'error',
                message: 'Course ID and thumbnail URL are required'
            });
        }

        // Find and update course
        const course = await Course.findByIdAndUpdate(
            courseId,
            { thumbnail },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: course
        });
    } catch (error) {
        console.error('Error updating course thumbnail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

module.exports = {
    updateCourseThumbnail
};
