import express from "express"
import { loginUser,registerUser } from "../controllers/userController.js"
import { verifyToken } from "../middleware/auth.js"
import { isAdmin } from "../middleware/admin.js"
import userModel from "../models/userModel.js"


const  userRouter= express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

// Enhanced verify-token endpoint
userRouter.get("/verify-token", verifyToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found",
        tokenValid: true,
        isAdmin: false
      });
    }
    
    res.json({ 
      success: true, 
      message: user.isAdmin ? "Token is valid and user is admin" : "Token is valid but user is not admin",
      tokenValid: true,
      isAdmin: user.isAdmin,
      email: user.email
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error verifying token",
      error: error.message
    });
  }
});

export default userRouter;