import driverModel from "../models/driverModel.js";
import orderModel from "../models/orderModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Driver login
const driverLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await driverModel.findOne({ email });
    if (!driver) {
      return res.json({ success: false, message: "Driver not found" });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: driver._id, role: 'driver' }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        vehicleType: driver.vehicleType
      }
    });
  } catch (error) {
    console.error("Driver login error:", error);
    res.json({ success: false, message: "Login failed" });
  }
};

// Update driver location
const updateDriverLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const driverId = req.driverId; // From auth middleware

  try {
    await driverModel.findByIdAndUpdate(driverId, {
      currentLocation: {
        latitude,
        longitude,
        lastUpdated: new Date()
      }
    });

    res.json({ success: true, message: "Location updated successfully" });
  } catch (error) {
    console.error("Update location error:", error);
    res.json({ success: false, message: "Failed to update location" });
  }
};

// Get driver profile
const getDriverProfile = async (req, res) => {
  const driverId = req.driverId;

  try {
    const driver = await driverModel.findById(driverId).select('-password');
    if (!driver) {
      return res.json({ success: false, message: "Driver not found" });
    }

    res.json({ success: true, driver });
  } catch (error) {
    console.error("Get driver profile error:", error);
    res.json({ success: false, message: "Failed to get profile" });
  }
};

// Get assigned orders
const getAssignedOrders = async (req, res) => {
  const driverId = req.driverId;

  try {
    const orders = await orderModel.find({ driverId })
      .populate('userId', 'name')
      .sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get assigned orders error:", error);
    res.json({ success: false, message: "Failed to get orders" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { orderId, status, latitude, longitude } = req.body;
  const driverId = req.driverId;

  try {
    // Verify the order is assigned to this driver
    const order = await orderModel.findOne({ _id: orderId, driverId });
    if (!order) {
      return res.json({ success: false, message: "Order not found or not assigned to you" });
    }

    // Update order status
    const updateData = { status };
    if (status === 'delivered') {
      updateData.actualDeliveryTime = new Date();
    }

    // Add tracking update
    const trackingUpdate = {
      status,
      timestamp: new Date(),
      message: getStatusMessage(status)
    };

    if (latitude && longitude) {
      trackingUpdate.location = { latitude, longitude };
    }

    await orderModel.findByIdAndUpdate(orderId, {
      ...updateData,
      $push: { trackingUpdates: trackingUpdate }
    });

    // If delivered, update driver stats
    if (status === 'delivered') {
      await driverModel.findByIdAndUpdate(driverId, {
        $inc: { totalDeliveries: 1 },
        $pull: { assignedOrders: orderId }
      });
    }

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Update order status error:", error);
    res.json({ success: false, message: "Failed to update order status" });
  }
};

// Helper function for status messages
const getStatusMessage = (status) => {
  const messages = {
    'confirmed': 'Order confirmed',
    'preparing': 'Food is being prepared',
    'ready': 'Food is ready for pickup',
    'picked_up': 'Order picked up by driver',
    'out_for_delivery': 'Out for delivery',
    'delivered': 'Order delivered successfully'
  };
  return messages[status] || 'Status updated';
};

// Get all drivers (for admin)
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await driverModel.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, drivers });
  } catch (error) {
    console.error("Get all drivers error:", error);
    res.json({ success: false, message: "Failed to get drivers" });
  }
};

// Assign order to driver (admin function)
const assignOrderToDriver = async (req, res) => {
  const { orderId, driverId } = req.body;

  try {
    // Check if driver exists and is active
    const driver = await driverModel.findById(driverId);
    if (!driver || !driver.isActive) {
      return res.json({ success: false, message: "Driver not found or inactive" });
    }

    // Update order
    await orderModel.findByIdAndUpdate(orderId, {
      driverId,
      status: 'confirmed',
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      $push: {
        trackingUpdates: {
          status: 'confirmed',
          timestamp: new Date(),
          message: 'Driver assigned to your order'
        }
      }
    });

    // Add order to driver's assigned orders
    await driverModel.findByIdAndUpdate(driverId, {
      $push: { assignedOrders: orderId }
    });

    res.json({ success: true, message: "Order assigned to driver successfully" });
  } catch (error) {
    console.error("Assign order error:", error);
    res.json({ success: false, message: "Failed to assign order" });
  }
};

// Unassign order from driver (admin function)
const unassignOrderFromDriver = async (req, res) => {
  const { orderId } = req.body;

  try {
    // Get the order to find the driver
    const order = await orderModel.findById(orderId);
    if (!order || !order.driverId) {
      return res.json({ success: false, message: "Order not found or no driver assigned" });
    }

    const driverId = order.driverId;

    // Update order - remove driver and set status back to processing
    await orderModel.findByIdAndUpdate(orderId, {
      driverId: null,
      status: 'processing',
      estimatedDeliveryTime: null,
      $push: {
        trackingUpdates: {
          status: 'processing',
          timestamp: new Date(),
          message: 'Driver unassigned from order'
        }
      }
    });

    // Remove order from driver's assigned orders
    await driverModel.findByIdAndUpdate(driverId, {
      $pull: { assignedOrders: orderId }
    });

    res.json({ success: true, message: "Order unassigned from driver successfully" });
  } catch (error) {
    console.error("Unassign order error:", error);
    res.json({ success: false, message: "Failed to unassign order" });
  }
};

export {
  driverLogin,
  updateDriverLocation,
  getDriverProfile,
  getAssignedOrders,
  updateOrderStatus,
  getAllDrivers,
  assignOrderToDriver,
  unassignOrderFromDriver
};