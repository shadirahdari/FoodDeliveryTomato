import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';

const List = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:4001";

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${url}/api/food/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setItems(items.filter(item => item._id !== id));
        alert('Item deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return <div className="list-loading">Loading...</div>;
  }

  return (
    <div className="list-container">
      <h2>Food Items List</h2>
      <div className="items-grid">
        {items.map(item => (
          <div key={item._id} className="item-card">
            <img 
              src={`${url}/images/${item.image}`} 
              alt={item.name}
              className="item-image"
            />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <p className="item-category">Category: {item.category}</p>
              <p className="item-price">Price: ${item.price}</p>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List; 