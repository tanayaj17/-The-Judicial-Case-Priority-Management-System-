const express = require('express');
const connectDB = require('./config/dbConnection');
require('dotenv').config();  // Load environment variables

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Define routes
app.use('/v1/', require('./routes/route'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
