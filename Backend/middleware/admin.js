import userModel from '../models/userModel.js';

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: "Server error in admin verification" });
  }
}; 