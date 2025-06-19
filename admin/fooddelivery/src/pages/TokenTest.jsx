import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TokenTest = () => {
  const [tokenInfo, setTokenInfo] = useState({
    status: 'Checking token...',
    isValid: false,
    isAdmin: false,
    email: '',
    error: null
  });
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://fooddeliverytomato-2.onrender.com/api/user/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setTokenInfo({
        status: response.data.message,
        isValid: response.data.tokenValid,
        isAdmin: response.data.isAdmin,
        email: response.data.email,
        error: null
      });
    } catch (error) {
      console.error('Token verification error:', error);
      let status = 'Unknown error occurred';
      if (error.response?.status === 401) {
        status = 'Token is invalid or expired';
      } else if (error.response?.status === 403) {
        status = 'Token is valid but you do not have admin access';
      } else if (error.response?.status === 404) {
        status = 'User not found';
      } else {
        status = error.response?.data?.message || error.message;
      }
      
      setTokenInfo({
        status,
        isValid: false,
        isAdmin: false,
        email: '',
        error: error.response?.data?.error || error.message
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Token Test</h2>
      <div>
        <strong>Current Token:</strong>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-all',
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          {token || 'No token found'}
        </pre>
      </div>
      <div style={{ marginTop: '20px' }}>
        <strong>Status:</strong>
        <p>{tokenInfo.status}</p>
        
        <strong>Token Details:</strong>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          <li>✓ Token Present: {token ? 'Yes' : 'No'}</li>
          <li>✓ Token Valid: {tokenInfo.isValid ? 'Yes' : 'No'}</li>
          <li>✓ Admin Access: {tokenInfo.isAdmin ? 'Yes' : 'No'}</li>
          {tokenInfo.email && <li>✓ Email: {tokenInfo.email}</li>}
        </ul>
        
        {tokenInfo.error && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            background: '#fff3f3', 
            border: '1px solid #ffcdd2',
            borderRadius: '4px'
          }}>
            <strong>Error Details:</strong>
            <p style={{ margin: '5px 0 0 0', color: '#d32f2f' }}>{tokenInfo.error}</p>
          </div>
        )}
      </div>
      <button 
        onClick={checkToken}
        style={{
          marginTop: '20px',
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Check Token Again
      </button>
    </div>
  );
};

export default TokenTest; 