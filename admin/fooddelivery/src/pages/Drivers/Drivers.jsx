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
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleType: 'bike',
    licenseNumber: ''
  });
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
      const response = await axios.get(`${url}/api/order/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        // Filter orders that can be assigned to drivers (processing, pending, or confirmed, no driver assigned)
        const availableOrders = response.data.orders.filter(order =>
          (order.status === 'processing' || order.status === 'pending' || order.status === 'confirmed') && !order.driverId
        );
        setOrders(availableOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };  const handleAssignOrder = async () => {
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

  const handleCreateDriver = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${url}/api/driver/create`, newDriver, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Driver created successfully');
        setNewDriver({
          name: '',
          email: '',
          phone: '',
          password: '',
          vehicleType: 'bike',
          licenseNumber: ''
        });
        setShowAddDriverModal(false);
        fetchDrivers();
      } else {
        alert(response.data.message || 'Failed to create driver');
      }
    } catch (error) {
      console.error('Error creating driver:', error);
      alert('Failed to create driver');
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
        <div className="header-top">
          <h2>Driver Management</h2>
          <button className="add-driver-btn" onClick={() => setShowAddDriverModal(true)}>
            + Add New Driver
          </button>
        </div>
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
            <p>Orders Awaiting Drivers</p>
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
                  <div className="info-cards">
                    <div className="info-card">
                      <div className="info-icon">📧</div>
                      <div className="info-content">
                        <div className="info-label">Email</div>
                        <div className="info-value">{driver.email}</div>
                      </div>
                    </div>
                    <div className="info-card">
                      <div className="info-icon">📱</div>
                      <div className="info-content">
                        <div className="info-label">Phone</div>
                        <div className="info-value">{driver.phone}</div>
                      </div>
                    </div>
                    <div className="info-card">
                      <div className="info-icon">🚗</div>
                      <div className="info-content">
                        <div className="info-label">Vehicle</div>
                        <div className="info-value">{driver.vehicleType}</div>
                      </div>
                    </div>
                    <div className="info-card">
                      <div className="info-icon">📋</div>
                      <div className="info-content">
                        <div className="info-label">License</div>
                        <div className="info-value">{driver.licenseNumber}</div>
                      </div>
                    </div>
                    <div className="info-card">
                      <div className="info-icon">📦</div>
                      <div className="info-content">
                        <div className="info-label">Deliveries</div>
                        <div className="info-value">{driver.totalDeliveries}</div>
                      </div>
                    </div>
                    <div className="info-card">
                      <div className="info-icon">⭐</div>
                      <div className="info-content">
                        <div className="info-label">Rating</div>
                        <div className="info-value">{driver.rating}/5</div>
                      </div>
                    </div>
                  </div>
                </div>

                {driver.currentLocation && typeof driver.currentLocation.latitude === 'number' && typeof driver.currentLocation.longitude === 'number' && (
                  <div className="driver-location">
                    <p><strong>Current Location:</strong></p>
                    <p>Lat: {driver.currentLocation.latitude.toFixed(4)}</p>
                    <p>Lng: {driver.currentLocation.longitude.toFixed(4)}</p>
                    <p className="location-time">
                      Last updated: {driver.currentLocation.lastUpdated ? new Date(driver.currentLocation.lastUpdated).toLocaleString() : 'Unknown'}
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
              <h4>Orders Awaiting Driver Assignment</h4>
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
                        <span className={`order-status ${order.status}`}>
                          {order.status === 'processing' ? 'Needs Confirmation' : order.status === 'pending' ? 'Pending' : 'Ready for Driver'}
                        </span>
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

      {showAddDriverModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Driver</h3>
              <button className="close-btn" onClick={() => setShowAddDriverModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateDriver} className="driver-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={newDriver.password}
                  onChange={(e) => setNewDriver({...newDriver, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vehicle Type:</label>
                <select
                  value={newDriver.vehicleType}
                  onChange={(e) => setNewDriver({...newDriver, vehicleType: e.target.value})}
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="car">Car</option>
                </select>
              </div>
              <div className="form-group">
                <label>License Number:</label>
                <input
                  type="text"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddDriverModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;