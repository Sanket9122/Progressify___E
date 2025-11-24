const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Loads .env file contents into process.env

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true // Recommended to add this option
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; // Export the function so it can be used elsewhere
