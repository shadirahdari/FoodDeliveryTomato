import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ 
      name, 
      email, 
      password: hashedPassword,
      isAdmin: isAdmin || false 
    });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.json({ success: false, message: "Registration failed" });
  }
};

// ✅ Login User — FIXED
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Check if user is admin for admin panel login
    if (req.headers['x-admin-request'] === 'true' && !user.isAdmin) {
      return res.json({ success: false, message: "Access denied. Admin only." });
    }

    const token = createToken(user._id);
    res.json({ success: true, token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.json({ success: false, message: "Login failed" });
  }
};

export { registerUser, loginUser };
