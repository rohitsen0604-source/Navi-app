const mongoose = require('mongoose');

// Never buffer commands when MongoDB is disconnected
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/naavi_db';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected to ${mongoURI}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Local MongoDB (127.0.0.1:27017) not reachable.`);
    console.warn(`[Database] In-memory mode active: All Auth, Ghats, Drivers, and Booking features work instantly without setup!`);
  }
};

module.exports = connectDB;
module.exports.isDbConnected = () => isConnected;
