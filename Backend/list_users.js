import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './models/userModel.js';

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const users = await userModel.find({}, 'name email isAdmin');
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log(`\nName: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
    });

  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

listUsers(); 