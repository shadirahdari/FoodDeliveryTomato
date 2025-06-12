import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import userModel from './models/userModel.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food-delivery';

const createUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name: 'Shadii',
      email: 'shadii@example.com',
      password: hashedPassword,
      cartData: {},
      isAdmin: false
    });

    // Save the user
    await newUser.save();

    console.log('✅ User created successfully');
    console.log('User details:');
    console.log('Name:', newUser.name);
    console.log('Email:', newUser.email);
    console.log('Password:', password);

  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createUser(); 