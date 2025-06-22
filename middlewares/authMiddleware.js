const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Set both the decoded token data and the user object
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            user: user
        };
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};

const admin = async (req, res, next) => {
    try {
        await auth(req, res, next);
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Admin access required'
            });
        }
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({
            status: 'error',
            message: 'Authentication failed'
        });
    }
};

module.exports = { auth, admin };
