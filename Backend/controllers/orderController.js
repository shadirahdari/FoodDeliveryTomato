import dotenv from "dotenv";
dotenv.config();
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:3002";

  try {
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 200, // 2 EUR
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString(),
        customerName: `${req.body.address.firstName} ${req.body.address.lastName}`
      },
      customer_email: req.body.address.email
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("❌ Error placing order:", error.message);
    if (error.type === 'StripeError') {
      return res.status(500).json({ 
        success: false, 
        message: "Payment processing failed", 
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Order creation failed", 
      error: error.message 
    });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Error getting order:", error);
    res.status(500).json({ success: false, message: "Error getting order", error: error.message });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error getting user orders:", error);
    res.status(500).json({ success: false, message: "Error getting orders", error: error.message });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    console.log("📦 Fetching all orders...");
    const orders = await orderModel.find().sort({ date: -1 });
    console.log(`✅ Found ${orders.length} orders:`, JSON.stringify(orders, null, 2));
    
    if (orders.length === 0) {
      // Add a test order if no orders exist
      const testOrder = new orderModel({
        userId: "test-user-id",
        items: [{
          _id: "test-item-1",
          name: "Test Pizza",
          price: 15.99,
          quantity: 2
        }],
        amount: 31.98,
        address: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipcode: "12345",
          country: "Test Country"
        },
        status: "Food Processing",
        Payment: true,
        paymentDetails: {
          customerName: "John Doe",
          customerEmail: "john@example.com",
          paymentMethod: "card",
          paymentStatus: "paid"
        }
      });
      
      await testOrder.save();
      console.log("✅ Added test order");
      orders.push(testOrder);
    }
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error getting all orders:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error getting orders", 
      error: error.message,
      stack: error.stack 
    });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status. Must be one of: " + validStatuses.join(', ') 
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ success: false, message: "Error updating order status", error: error.message });
  }
};

// Track order
const trackOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if the user is authorized to track this order
    if (order.userId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to track this order" });
    }

    // Map the order status to tracking steps
    const getStepStatus = (currentStep) => {
      const statusOrder = ['pending', 'processing', 'out-for-delivery', 'delivered'];
      const currentStatusIndex = statusOrder.indexOf(order.status);
      const stepIndex = currentStep - 1;

      if (order.status === 'cancelled') {
        return stepIndex === 0 ? 'completed' : 'cancelled';
      }

      if (stepIndex < currentStatusIndex) return 'completed';
      if (stepIndex === currentStatusIndex) return 'current';
      return 'pending';
    };

    // Return order with tracking information
    res.json({ 
      success: true, 
      order: {
        ...order.toObject(),
        trackingSteps: [
          {
            step: 1,
            status: getStepStatus(1),
            title: 'Order Placed',
            description: 'Your order has been placed successfully'
          },
          {
            step: 2,
            status: getStepStatus(2),
            title: 'Processing',
            description: 'Restaurant is preparing your food'
          },
          {
            step: 3,
            status: getStepStatus(3),
            title: 'Out for Delivery',
            description: 'Your order is on the way'
          },
          {
            step: 4,
            status: getStepStatus(4),
            title: 'Delivered',
            description: 'Enjoy your meal!'
          }
        ]
      }
    });
  } catch (error) {
    console.error("❌ Error tracking order:", error);
    res.status(500).json({ success: false, message: "Error tracking order", error: error.message });
  }
};

// Admin: Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await orderModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ success: false, message: "Error deleting order", error: error.message });
  }
};

export { placeOrder, getOrder, getUserOrders, getAllOrders, updateOrderStatus, trackOrder, deleteOrder };
