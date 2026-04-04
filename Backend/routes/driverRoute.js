import express from "express";
import {
  driverLogin,
  updateDriverLocation,
  getDriverProfile,
  getAssignedOrders,
  updateOrderStatus,
  getAllDrivers,
  assignOrderToDriver,
  unassignOrderFromDriver
} from "../controllers/driverController.js";
import driverAuthMiddleware from "../middleware/driverAuth.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const driverRouter = express.Router();

// Driver authentication
driverRouter.post("/login", driverLogin);

// Driver protected routes
driverRouter.post("/update-location", driverAuthMiddleware, updateDriverLocation);
driverRouter.get("/profile", driverAuthMiddleware, getDriverProfile);
driverRouter.get("/orders", driverAuthMiddleware, getAssignedOrders);
driverRouter.post("/update-order-status", driverAuthMiddleware, updateOrderStatus);

// Admin routes for driver management
driverRouter.get("/all", verifyToken, isAdmin, getAllDrivers);
driverRouter.post("/assign-order", verifyToken, isAdmin, assignOrderToDriver);
driverRouter.post("/unassign-order", verifyToken, isAdmin, unassignOrderFromDriver);

export default driverRouter;