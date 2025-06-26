const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

async function makeAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        
        // Find the user you want to make admin
        const user = await User.findOne({ email: 'admin@example.com' });
        if (!user) {
            console.log('User not found');
            return;
        }

        // Update user role to admin
        user.role = 'admin';
        await user.save();
        
        console.log('User updated to admin role successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    
    }
}

makeAdmin();
