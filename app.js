const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const result = dotenv.config({ path: path.join(__dirname, '.env') });
if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// MongoDB connection
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }
        
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
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
app.use('/api/admin/users', require('./routes/adminUserRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('API Error:', {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message,
        stack: err.stack
    });
    
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        data: null
    });
});

// Fallback route for API
app.use('/api/*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'API endpoint not found',
        data: null
    });
});

// Default route for static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Default route for static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
const startServer = async () => {
    try {
        // Check if server is already running
        const isPortInUse = await new Promise((resolve) => {
            const testServer = require('net').createServer().listen(PORT, () => {
                testServer.close(() => resolve(false));
            }).on('error', () => resolve(true));
        });
        

        if (isPortInUse) {
            console.error(`Port ${PORT} is already in use. Please stop any existing server instances.`);
            process.exit(1);
        }

        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        
        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please stop any existing server instances.`);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Default route for static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
