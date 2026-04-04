import jwt from "jsonwebtoken";
import driverModel from "../models/driverModel.js";

const driverAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is a driver
    if (decoded.role !== 'driver') {
      return res.status(403).json({ success: false, message: "Access denied. Driver role required." });
    }

    // Verify driver exists and is active
    const driver = await driverModel.findById(decoded.id);
    if (!driver || !driver.isActive) {
      return res.status(401).json({ success: false, message: "Driver account inactive or not found." });
    }

    req.driverId = decoded.id;
    next();
  } catch (error) {
    console.log("❌ Invalid Driver Token:", error);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default driverAuthMiddleware;