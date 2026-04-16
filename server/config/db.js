/**
 * Database Configuration
 * MongoDB connection with error handling
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Mongoose 8+ doesn't need these options but keeping for compatibility
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB Error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB Disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
