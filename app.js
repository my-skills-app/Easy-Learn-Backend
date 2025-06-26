const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables (optional in production)
try {
    dotenv.config({ path: path.join(__dirname, '.env') });
} catch (error) {
    console.log('No .env file found - using environment variables directly');
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
        // Hardcoded MongoDB URI
        const MONGO_URI = 'mongodb+srv://applearyan620501:ARyan620501@cluster0.kaqui2n.mongodb.net/course-app?retryWrites=true&w=majority';
        
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', MONGO_URI.replace(/\/\/.*\@/, '//***@')); // Mask credentials
        
        // Set up MongoDB Atlas connection options
        const mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 100,
            minPoolSize: 1,
            maxIdleTimeMS: 60000,
            waitQueueTimeoutMS: 30000,
            heartbeatFrequencyMS: 10000
        };

        // Add retry logic for MongoDB connection
        let retries = 5;
        while (retries > 0) {
            try {
                // Add connection event listeners
                mongoose.connection.on('connected', () => {
                    console.log('MongoDB connection established successfully');
                });

                mongoose.connection.on('error', (err) => {
                    console.error('MongoDB connection error:', err);
                });

                mongoose.connection.on('disconnected', () => {
                    console.log('MongoDB connection disconnected');
                });

                // Connect directly with the hardcoded URI
                await mongoose.connect(MONGO_URI, {
                    ...mongoOptions
                });
                
                console.log('MongoDB connected successfully');
                break;
            } catch (err) {
                console.error(`MongoDB connection attempt ${6 - retries} failed:`);
                console.error('Error details:', {
                    code: err.code,
                    message: err.message,
                    name: err.name,
                    stack: err.stack
                });
                retries--;
                if (retries === 0) {
                    console.error('All connection attempts failed. Exiting...');
                    throw err;
                }
                console.log(`Retrying in 5 seconds... (${retries} attempts remaining)`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
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

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        console.log(`Starting server on port ${PORT}`);
        
        // Initialize MongoDB connection
        await connectDB();
        
        // Start the server
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
        
        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            process.exit(1);
        });
        
        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        });
        
        process.on('SIGINT', () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
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
