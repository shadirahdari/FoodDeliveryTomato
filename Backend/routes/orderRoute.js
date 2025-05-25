import express from "express";
import { placeOrder, getOrder, getUserOrders, getAllOrders, updateOrderStatus, trackOrder, deleteOrder } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

// Admin routes - place these BEFORE the parameterized routes
router.get("/all", verifyToken, isAdmin, getAllOrders);
router.patch("/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.delete("/:id", verifyToken, isAdmin, deleteOrder);

// User routes
router.post("/place", verifyToken, placeOrder);
router.get("/user", verifyToken, getUserOrders);
router.get("/track/:id", verifyToken, trackOrder);
router.get("/:id", verifyToken, getOrder);

export default router;
