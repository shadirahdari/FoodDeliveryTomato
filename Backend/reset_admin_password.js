import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from './models/userModel.js';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await userModel.findOne({ email: 'admin@example.com' });
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    // Reset password
    const salt = await bcrypt.genSalt(10);
    const newPassword = 'admin12345';
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and ensure admin status
    admin.password = hashedPassword;
    admin.isAdmin = true;
    await admin.save();

    console.log('✅ Admin password reset successfully');
    console.log('Email:', admin.email);
    console.log('New password:', newPassword);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

resetAdminPassword(); 