import React, { useState } from 'react'
import './navbar.css'
import { assets } from '../../assets/asset'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const ProfileOrders = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4001/api/order/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        setError('Failed to fetch your orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  return (
    <div className="profile-orders-modal">
      <div className="profile-orders-content">
        <div className="profile-orders-header">
          <h2>My Orders</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        {loading && <div className="profile-orders-loading">Loading orders...</div>}
        {error && <div className="profile-orders-error">{error}</div>}
        
        {!loading && !error && (
          <div className="profile-orders-list">
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="profile-order-item">
                  <div className="order-header">
                    <span className="order-id">Order #{order._id.slice(-6)}</span>
                    <span className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                    <p>Amount: €{(order.amount / 100).toFixed(2)}</p>
                    <p>Payment: {order.Payment ? 'Paid' : 'Pending'}</p>
                  </div>
                  <div className="order-items">
                    <strong>Items:</strong>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x {item.quantity} - €{(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileDropdown = ({ onLogout, onViewOrders }) => {
  return (
    <div className="profile-dropdown">
      <div className="dropdown-item" onClick={onViewOrders}>
        <img src={assets.order_icon} alt="Orders" className="dropdown-icon" />
        Orders
      </div>
      <div className="dropdown-item" onClick={onLogout}>
        <img src={assets.logout_icon} alt="Logout" className="dropdown-icon" />
        Logout
      </div>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowDropdown(false);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleViewOrders = () => {
    setShowOrders(true);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <p className='text'>Admin Panel</p>
      <div className="nav-right">
        {token ? (
          <div className="profile-section">
            <div className="profile-container">
              <img 
                className='profile' 
                src={assets.profile_icon} 
                alt="" 
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <ProfileDropdown 
                  onLogout={handleLogout}
                  onViewOrders={handleViewOrders}
                />
              )}
            </div>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLogin}>Login</button>
        )}
      </div>
      {showOrders && <ProfileOrders onClose={() => setShowOrders(false)} />}
    </div>
  )
}

export default Navbar
