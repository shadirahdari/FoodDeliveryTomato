import React, { useState, useEffect } from 'react';
import './Drivers.css';
import axios from 'axios';
import config from '../../config';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const url = config.apiUrl;

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/driver/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setDrivers(response.data.drivers);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      alert('Failed to load drivers');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/order/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        // Filter orders that are confirmed but not yet assigned to a driver
        const availableOrders = response.data.data.filter(order =>
          order.status === 'confirmed' && !order.driverId
        );
        setOrders(availableOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAssignOrder = async () => {
    if (!selectedDriver || !selectedOrder) {
      alert('Please select both a driver and an order');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${url}/api/driver/assign-order`, {
        orderId: selectedOrder._id,
        driverId: selectedDriver._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Order assigned to driver successfully');
        setSelectedDriver(null);
        setSelectedOrder(null);
        fetchDrivers();
        fetchOrders();
      }
    } catch (error) {
      console.error('Error assigning order:', error);
      alert('Failed to assign order');
    }
  };

  const toggleDriverStatus = async (driverId, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      // Note: This would require a backend endpoint to update driver status
      // For now, we'll just show a message
      alert(`Driver status update functionality would be implemented here`);
    } catch (error) {
      console.error('Error updating driver status:', error);
      alert('Failed to update driver status');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchDrivers(), fetchOrders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="drivers-loading">Loading drivers...</div>;
  }

  return (
    <div className="drivers-container">
      <div className="drivers-header">
        <h2>Driver Management</h2>
        <div className="drivers-stats">
          <div className="stat-card">
            <h3>{drivers.length}</h3>
            <p>Total Drivers</p>
          </div>
          <div className="stat-card">
            <h3>{drivers.filter(d => d.isActive).length}</h3>
            <p>Active Drivers</p>
          </div>
          <div className="stat-card">
            <h3>{orders.length}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
      </div>

      <div className="drivers-content">
        <div className="drivers-list">
          <h3>Available Drivers</h3>
          <div className="drivers-grid">
            {drivers.map(driver => (
              <div
                key={driver._id}
                className={`driver-card ${selectedDriver?._id === driver._id ? 'selected' : ''}`}
                onClick={() => setSelectedDriver(driver)}
              >
                <div className="driver-header">
                  <h4>{driver.name}</h4>
                  <span className={`status ${driver.isActive ? 'active' : 'inactive'}`}>
                    {driver.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="driver-info">
                  <p><strong>Email:</strong> {driver.email}</p>
                  <p><strong>Phone:</strong> {driver.phone}</p>
                  <p><strong>Vehicle:</strong> {driver.vehicleType}</p>
                  <p><strong>License:</strong> {driver.licenseNumber}</p>
                  <p><strong>Total Deliveries:</strong> {driver.totalDeliveries}</p>
                  <p><strong>Rating:</strong> ⭐{driver.rating}/5</p>
                </div>

                {driver.currentLocation && (
                  <div className="driver-location">
                    <p><strong>Current Location:</strong></p>
                    <p>Lat: {driver.currentLocation.latitude.toFixed(4)}</p>
                    <p>Lng: {driver.currentLocation.longitude.toFixed(4)}</p>
                    <p className="location-time">
                      Last updated: {new Date(driver.currentLocation.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="driver-actions">
                  <button
                    className={`status-btn ${driver.isActive ? 'deactivate' : 'activate'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDriverStatus(driver._id, driver.isActive);
                    }}
                  >
                    {driver.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="assignment-panel">
          <h3>Assign Orders to Drivers</h3>

          <div className="assignment-section">
            <div className="order-selection">
              <h4>Available Orders</h4>
              <div className="orders-list">
                {orders.length === 0 ? (
                  <p className="no-orders">No pending orders available</p>
                ) : (
                  orders.map(order => (
                    <div
                      key={order._id}
                      className={`order-item ${selectedOrder?._id === order._id ? 'selected' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="order-header">
                        <span className="order-id">#{order._id.slice(-6)}</span>
                        <span className="order-amount">${order.amount}</span>
                      </div>
                      <div className="order-details">
                        <p><strong>Customer:</strong> {order.address?.firstName} {order.address?.lastName}</p>
                        <p><strong>Items:</strong> {order.items?.length || 0}</p>
                        <p><strong>Address:</strong> {order.address?.street}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="assignment-controls">
              <div className="selected-info">
                {selectedDriver && (
                  <div className="selected-driver">
                    <h4>Selected Driver:</h4>
                    <p>{selectedDriver.name} ({selectedDriver.vehicleType})</p>
                  </div>
                )}

                {selectedOrder && (
                  <div className="selected-order">
                    <h4>Selected Order:</h4>
                    <p>Order #{selectedOrder._id.slice(-6)} - ${selectedOrder.amount}</p>
                  </div>
                )}
              </div>

              <button
                className="assign-btn"
                onClick={handleAssignOrder}
                disabled={!selectedDriver || !selectedOrder}
              >
                Assign Order to Driver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;