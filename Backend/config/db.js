import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);  // <- add this line

    const conn = await mongoose.connect(process.env.MONGO_URI); // 👈 This must not be undefined
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
