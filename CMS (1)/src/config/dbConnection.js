const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
