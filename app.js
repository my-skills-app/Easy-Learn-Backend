const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const result = dotenv.config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Serve static files
app.use(express.static('public'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling for static files
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        next();
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/course-storage', require('./routes/courseStorageRoutes'));
app.use('/api/admin/users', require('./routes/adminUserRoutes'));
app.use('/api/admin/courses', require('./routes/adminCourseRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

// Not found middleware
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

module.exports = {
    app,
    connectDB
};
