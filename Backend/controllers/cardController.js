import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from auth middleware
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId is required"
      });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Added To Cart",
      cartData
    });

  } catch (error) {
    console.error("🔥 ERROR in addToCart:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message
    });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from auth middleware
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId is required"
      });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }

      await userModel.findByIdAndUpdate(userId, { cartData });
    }

    res.json({
      success: true,
      message: "Removed from Cart",
      cartData
    });

  } catch (error) {
    console.error("🔥 ERROR in removeFromCart:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message
    });
  }
};

// Clear user cart
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Clearing cart for user:", userId);

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log("Cart cleared successfully for user:", userId);

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cartData: {}
    });
  } catch (error) {
    console.error("🔥 ERROR in clearCart:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message
    });
  }
};

// Get user cart data
const getCart = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from auth middleware
    console.log("Getting cart for user:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    const userData = await userModel.findById(userId);
    console.log("User data found:", userData ? "yes" : "no");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const cartData = userData.cartData || {};
    console.log("Cart data:", cartData);

    res.json({
      success: true,
      cartData: cartData
    });

  } catch (error) {
    console.error("🔥 ERROR in getCart:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message
    });
  }
};

export { addToCart, removeFromCart, getCart, clearCart };
