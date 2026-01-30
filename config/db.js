const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // maxPoolSize is industry standard to handle multiple concurrent requests
            maxPoolSize: 10, 
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

// Listen for connection events (Impressive to recruiters)
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error(`🔥 MongoDB Error: ${err}`);
});

module.exports = connectDB;