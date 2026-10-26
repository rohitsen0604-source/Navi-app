const mongoose = require('mongoose');

// Never buffer commands when MongoDB is disconnected
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/naavi_db';
    
    // Validate URI scheme (Mongoose only supports mongodb:// or mongodb+srv://)
    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      console.warn(`[Database] Notice: The provided database URI is not a MongoDB connection string (e.g. PostgreSQL/NeonDB).`);
      console.warn(`[Database] Naavi backend uses Mongoose (MongoDB). Running in full In-Memory fallback mode.`);
      console.warn(`[Database] All Auth, Ghats, Drivers, and Booking features work immediately for testing!`);
      return;
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected successfully`);
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] MongoDB not reachable (${error.message}).`);
    console.warn(`[Database] In-memory mode active: All Auth, Ghats, Drivers, and Booking features work instantly without setup!`);
  }
};

module.exports = connectDB;
module.exports.isDbConnected = () => isConnected;
