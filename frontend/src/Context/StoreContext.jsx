import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItem] = useState({});
  const url = "http://localhost:4001";
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);

  // Modified token setter to always update localStorage
  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  // Clear cart items
  const clearCart = () => {
    setCartItem({});
    localStorage.removeItem('savedCartItems');
    localStorage.removeItem('savedOrderData');
  };

  const addToCart = (itemId) => {
    setCartItem((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItem((prev) => {
      const newCount = (prev[itemId] || 0) - 1;
      return {
        ...prev,
        [itemId]: newCount > 0 ? newCount : 0,
      };
    });
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((item) => item._id === itemId);
        if (item) {
          total += item.price * cartItems[itemId];
        }
      }
    }
    return total;
  };

  const fetchFoodlist = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("❌ Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    if (!token) {
      clearCart();
      return;
    }

    // Check for saved cart state first
    const savedCartItems = localStorage.getItem('savedCartItems');
    if (savedCartItems) {
      console.log('Restoring saved cart state');
      setCartItem(JSON.parse(savedCartItems));
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      console.log("Cart data response:", response.data);
      if (response.data.success) {
        const cartData = response.data.cartData || {};
        console.log("Setting cart data:", cartData);
        setCartItem(cartData);
      } else {
        console.error("Failed to load cart:", response.data.message);
        clearCart();
      }
    } catch (error) {
      console.error("❌ Error loading cart:", error);
      clearCart();
    }
  };

  // Check token validity on mount and token change
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        updateToken("");
        return;
      }

      try {
        // Make a request to verify the token
        await axios.get(`${url}/api/food/list`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        updateToken(storedToken);
      } catch (error) {
        if (error.response?.status === 401) {
          updateToken("");
        }
      }
    };

    validateToken();
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchFoodlist();
      await loadCartData(token);
    };

    loadInitialData();
  }, [token]);

  const contextValue = {
    food_list,
    fetchFoodlist,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken: updateToken,
    clearCart,
    loadCartData
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
