const mongoose = require('mongoose');

const connectDB = async () => {
  const RETRY_DELAY_MS = 5000;

  while (true) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return; // Connected successfully — exit the loop
    } catch (error) {
      console.error(`MongoDB connection failed: ${error.message}`);
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

module.exports = connectDB;
