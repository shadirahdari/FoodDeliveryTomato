import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Order.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      console.log("🔍 Fetching orders with token:", token);
      const response = await axios.get('http://localhost:4001/api/order/all', {
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

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      console.log('Updating order status:', { orderId, newStatus, token });
      await axios.patch(`http://localhost:4001/api/order/${orderId}/status`, 
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
      await axios.delete(`http://localhost:4001/api/order/${orderId}`, {
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
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
