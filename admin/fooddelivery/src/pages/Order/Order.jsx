import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Order.css';
import config from '../../config';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const url = config.apiUrl;

  useEffect(() => {
    fetchOrders();
    fetchDrivers();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/order/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("📦 Response data:", response.data);
      
      // Check if response.data has orders or data property
      const orderData = response.data.orders || response.data.data || [];
      console.log(`✅ Found ${orderData.length} orders`);
      
      setOrders(orderData);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      console.error('Response:', err.response?.data);
      console.error('Status:', err.response?.status);
      
      let errorMessage = 'Failed to fetch orders';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to view orders.';
      } else if (!err.response) {
        errorMessage = 'Could not connect to the server. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (err) {
      console.error('❌ Error fetching drivers:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      console.log('Updating order status:', { orderId, newStatus, token });
      await axios.patch(`${url}/api/order/${orderId}/status`, 
        { status: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error('Error updating order status:', err);
      console.error('Response:', err.response?.data);
      console.error('Status:', err.response?.status);
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${url}/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(orders.filter(order => order._id !== orderId));
      alert('Order deleted successfully');
    } catch (err) {
      console.error('Error deleting order:', err);
      alert(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const assignDriverToOrder = async (orderId, driverId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${url}/api/driver/assign-order`, {
        orderId,
        driverId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Driver assigned to order successfully');
        fetchOrders(); // Refresh orders
        fetchDrivers(); // Refresh drivers
      }
    } catch (err) {
      console.error('Error assigning driver:', err);
      alert(err.response?.data?.message || 'Failed to assign driver');
    }
  };

  const unassignDriverFromOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to unassign the driver from this order?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${url}/api/driver/unassign-order`, {
        orderId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Driver unassigned from order successfully');
        fetchOrders(); // Refresh orders
        fetchDrivers(); // Refresh drivers
      }
    } catch (err) {
      console.error('Error unassigning driver:', err);
      alert(err.response?.data?.message || 'Failed to unassign driver');
    }
  };

  const getDriverName = (driverId) => {
    if (!driverId) return 'Not Assigned';
    const driver = drivers.find(d => d._id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'out-for-delivery':
        return 'status-delivering';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-processing';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  if (loading) return <div className="orders-loading">Loading orders...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Order Management</h2>
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="out-for-delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Payment Method</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id.slice(-8)}</td>
                <td>
                  {order.paymentDetails?.customerName || 'N/A'}
                  <br />
                  <small>{order.paymentDetails?.customerEmail || 'N/A'}</small>
                </td>
                <td>€{(order.amount / 100).toFixed(2)}</td>
                <td className={getStatusColor(order.status)}>
                  {order.Payment ? 'Paid' : 'Pending'}
                </td>
                <td>{order.paymentDetails?.paymentMethod || 'N/A'}</td>
                <td>{formatDate(order.date)}</td>
                <td className={getStatusColor(order.status)}>
                  {order.status}
                </td>
                <td>
                  <div className="driver-info">
                    <span className={order.driverId ? 'assigned-driver' : 'no-driver'}>
                      {getDriverName(order.driverId)}
                    </span>
                    {order.driverId ? (
                      <button 
                        onClick={() => unassignDriverFromOrder(order._id)}
                        className="unassign-driver-btn"
                        title="Unassign Driver"
                      >
                        ✕
                      </button>
                    ) : (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            assignDriverToOrder(order._id, e.target.value);
                            e.target.value = ''; // Reset select
                          }
                        }}
                        className="assign-driver-select"
                        defaultValue=""
                      >
                        <option value="" disabled>Assign Driver</option>
                        {drivers.filter(driver => driver.isActive).map(driver => (
                          <option key={driver._id} value={driver._id}>
                            {driver.name} ({driver.vehicleType})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <select
                      value={order.status.toLowerCase()}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                      onClick={() => deleteOrder(order._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
