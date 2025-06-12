import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import userModel from './models/userModel.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food-delivery';

const resetPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the user
    const user = await userModel.findOne({ email: 'shadii@example.com' });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    // Generate new password hash
    const salt = await bcrypt.genSalt(10);
    const newPassword = 'newpassword123'; // This will be the new password
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password reset successfully');
    console.log('New password: newpassword123');

  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await mongoose.connection.close();
  }
};

resetPassword(); 