import jwt from 'jsonwebtoken';
import userModel from './models/userModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function debugAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test token
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDAyNDY1ZGViYjU3MDlhNDZmNDc4MSIsImlhdCI6MTc3NTMxNDYyNiwiZXhwIjoxNzc1NTczODI2fQ.kYcI-goTAHDqf-3U6OipE6NusxPr2uH0ZHFltiQYmKk';

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await userModel.findById(decoded.id);
    console.log('User found:', user ? 'YES' : 'NO');
    if (user) {
      console.log('User details:', {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } else {
      // List all users
      const allUsers = await userModel.find({});
      console.log('All users in DB:', allUsers.map(u => ({ id: u._id, email: u.email, isAdmin: u.isAdmin })));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

debugAdmin();