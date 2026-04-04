import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Navbar.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import SearchModal from '../SearchModal/SearchModal';

const OrdersModal = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, url } = useContext(StoreContext);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingInterval, setTrackingInterval] = useState(null);

  const handleTrackOrder = async (orderId) => {
    try {
      const response = await axios.get(`${url}/api/order/track/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setTrackingOrder(response.data.order);
        // Start polling for updates
        const interval = setInterval(async () => {
          try {
            const updateResponse = await axios.get(`${url}/api/order/track/${orderId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            if (updateResponse.data.success) {
              setTrackingOrder(updateResponse.data.order);
            }
          } catch (err) {
            console.error('Error updating tracking:', err);
          }
        }, 10000); // Poll every 10 seconds
        setTrackingInterval(interval);
      } else {
        throw new Error(response.data.message || 'Failed to track order');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      alert(err.response?.data?.message || err.message || 'Failed to track order');
    }
  };

  const closeTrackingModal = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
    setTrackingOrder(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${url}/api/order/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, url]);

  useEffect(() => {
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

  // Order tracking modal
  if (trackingOrder) {
    return (
      <div className="orders-modal" onClick={(e) => {
        if (e.target.className === 'orders-modal') closeTrackingModal();
      }}>
        <div className="orders-content tracking-modal">
          <div className="orders-header">
            <h2>Track Order #{trackingOrder._id.slice(-6)}</h2>
            <button onClick={closeTrackingModal} className="close-btn">&times;</button>
          </div>
          
          <div className="tracking-timeline">
            {trackingOrder.trackingSteps.map((step) => (
              <div key={step.step} className={`tracking-step ${step.status}`}>
                <div className="step-icon">{step.step}</div>
                <div className="step-info">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="tracking-details">
            <h3>Delivery Details</h3>
            <p><strong>Delivery Address:</strong> {trackingOrder.address.firstName} {trackingOrder.address.lastName}, {trackingOrder.address.street}, {trackingOrder.address.city}, {trackingOrder.address.state} {trackingOrder.address.zipcode}</p>
            <p><strong>Order Date:</strong> {new Date(trackingOrder.date).toLocaleString()}</p>
            <p><strong>Status:</strong> <span className={`order-status ${trackingOrder.status}`}>{trackingOrder.status}</span></p>
            {trackingOrder.driverId && (
              <div className="driver-info">
                <p><strong>Delivery Driver:</strong></p>
                <p>Name: {trackingOrder.driverId.name}</p>
                <p>Phone: {trackingOrder.driverId.phone}</p>
                <p>Vehicle: {trackingOrder.driverId.vehicleType}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-modal" onClick={(e) => {
      if (e.target.className === 'orders-modal') onClose();
    }}>
      <div className="orders-content">
        <div className="orders-header">
          <h2>My Orders</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        {loading && <div className="orders-loading">Loading your orders...</div>}
        {error && <div className="orders-error">{error}</div>}
        
        {!loading && !error && (
          <div className="orders-list">
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>No orders found</p>
                <span>Start your first order to see it here!</span>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="order-card">
                  {/* Order Header */}
                  <div className="order-card-header">
                    <div className="order-main-info">
                      <h3 className="order-id">Order #{order._id.slice(-6)}</h3>
                      <p className="order-amount">€{order.amount.toFixed(2)}</p>
                    </div>
                    <span className={`order-status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Order Meta */}
                  <div className="order-meta">
                    <div className="meta-item">
                      <span className="meta-label">Date:</span>
                      <span className="meta-value">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Payment:</span>
                      <span className="meta-value">{order.Payment ? 'Paid' : 'Pending'}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="order-items-section">
                    <h4 className="section-title">Items</h4>
                    <div className="items-list">
                      {order.items.map((item, index) => (
                        <div key={index} className="item-row">
                          <span className="item-name">{item.name} × {item.quantity}</span>
                          <span className="item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Driver Info */}
                  {order.driverId && (
                    <div className="driver-section">
                      <h4 className="section-title">Delivery Driver</h4>
                      <div className="driver-details">
                        <div className="driver-row">
                          <span className="driver-label">Name:</span>
                          <span className="driver-value">{order.driverId.name}</span>
                        </div>
                        <div className="driver-row">
                          <span className="driver-label">Phone:</span>
                          <span className="driver-value">{order.driverId.phone}</span>
                        </div>
                        <div className="driver-row">
                          <span className="driver-label">Vehicle:</span>
                          <span className="driver-value">{order.driverId.vehicleType}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {order.status !== 'cancelled' && (
                    <button 
                      className="track-order-btn"
                      onClick={() => handleTrackOrder(order._id)}
                    >
                      Track Order
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [showOrders, setShowOrders] = useState(false);
  const profileRef = useRef();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  const handleViewOrders = () => {
    setShowOrders(true);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log("🔐 Navbar sees token:", token);
  console.log("🔑 token value in Navbar:", token, typeof token);

  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="logo" className="logo" /></Link>

      <ul className="navbar-menu">
        <li onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li onClick={() => {
          setMenu("Menu");
          const element = document.getElementById('food-display');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            navigate('/', { state: { scrollToMenu: true } });
          }
        }} className={menu === "Menu" ? "active" : ""}>
          <span>Menu</span>
        </li>
        <li onClick={() => {
          setMenu("Mobile-App");
          const element = document.getElementById('app-download');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            navigate('/', { state: { scrollToApp: true } });
          }
        }} className={menu === "Mobile-App" ? "active" : ""}>
          <span>Mobile App</span>
        </li>
        <li onClick={() => setMenu("Contact-Us")} className={menu === "Contact-Us" ? "active" : ""}>
          <Link to="/contact">Contact Us</Link>
        </li>
      </ul>

      <div className="navbar-right">
        <img 
          src={assets.search_icon} 
          alt="search" 
          onClick={() => setShowSearch(true)}
          style={{ cursor: 'pointer' }}
        />
        <div className="navbar-search-icon">
          <Link to='/Cart'> <img src={assets.basket_icon} alt="basket" /></Link>
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </div>

        {token && token !== "null" && token !== "undefined" && token.trim() !== "" ? (
          <div className='navbar-profile' ref={profileRef}>
            <img 
              src={assets.profile_icon} 
              alt="profile" 
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <ul className="nav-profile-dropdown">
                <li onClick={handleViewOrders}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        )}
      </div>

      {showOrders && <OrdersModal onClose={() => setShowOrders(false)} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
};

export default Navbar;
