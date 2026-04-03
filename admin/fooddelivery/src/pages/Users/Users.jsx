import React, { useState, useEffect } from 'react';
import './Users.css';
import axios from 'axios';
import config from '../../config';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = config.apiUrl;

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/user/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    try {
      // Note: You might need to add a delete user endpoint in the backend
      const response = await axios.delete(`${url}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUsers(users.filter(user => user._id !== id));
        alert('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="users-loading">Loading...</div>;
  }

  return (
    <div className="users-container">
      <h2>Users Management</h2>
      <div className="users-grid">
        {users.map(user => (
          <div key={user._id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <p className="user-role">Role: {user.isAdmin ? 'Admin' : 'Customer'}</p>
              <p className="user-date">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(user._id)}
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

export default Users;