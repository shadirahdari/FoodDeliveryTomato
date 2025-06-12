import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './models/userModel.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await userModel.findOne({ email: 'admin@example.com' });
    console.log('\nAdmin user details:');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Is Admin:', admin.isAdmin);
    console.log('ID:', admin._id);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkAdmin(); 