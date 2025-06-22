const { app, connectDB } = require('./app');
const PORT = process.env.PORT || 4000;  // Changed from 3000 to 4000

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
