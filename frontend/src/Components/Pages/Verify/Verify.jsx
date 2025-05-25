import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../../Context/StoreContext';
import axios from 'axios';
import './Verify.css';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, setToken, loadCartData, clearCart, url } = useContext(StoreContext);
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const initializeVerification = async () => {
      // Log the URL parameters and token status
      console.log('Verification Status:', {
        success,
        orderId,
        hasToken: !!token,
        fullUrl: window.location.href
      });

      // Ensure token is still in localStorage
      const storedToken = localStorage.getItem('token');
      if (storedToken && !token) {
        console.log('Restoring token from localStorage');
        setToken(storedToken);
      }

      const currentToken = storedToken || token;

      try {
        if (success === 'true') {
          console.log('Payment successful, clearing cart...');
          
          // Clear cart in backend first
          try {
            await axios.post(`${url}/api/cart/clear`, {}, {
              headers: {
                Authorization: `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
              }
            });
            console.log('Backend cart cleared successfully');
          } catch (error) {
            console.error('Error clearing backend cart:', error);
          }

          // Clear frontend cart
          clearCart();
          
          setTimeout(() => {
            console.log('Payment successful, navigating to home...');
            navigate('/');
          }, 3000);
        } else {
          console.log('Payment cancelled/failed, restoring cart...');
          // Just reload cart data from backend to restore state
          try {
            const cartResponse = await axios.post(`${url}/api/cart/get`, {}, {
              headers: {
                Authorization: `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
              }
            });
            console.log('Cart data restored:', cartResponse.data);
            
            setTimeout(() => {
              navigate('/cart');
            }, 3000);
          } catch (error) {
            console.error('Error restoring cart:', error);
            setTimeout(() => {
              navigate('/cart');
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Error during verification:', error);
        // If there's an error, try to restore cart and redirect
        try {
          await loadCartData(currentToken);
        } catch (loadError) {
          console.error('Error loading cart data:', loadError);
        }
        setTimeout(() => {
          navigate(success === 'true' ? '/' : '/cart');
        }, 3000);
      }
    };

    initializeVerification();
  }, [success, navigate, orderId, token, setToken, loadCartData, clearCart, url]);

  return (
    <div className="verify-container">
      {!success || !orderId ? (
        <div className="verify-failed">
          <h2>Invalid Verification</h2>
          <p>Missing required parameters.</p>
          <p>Redirecting back to cart...</p>
        </div>
      ) : success === 'true' ? (
        <div className="verify-success">
          <h2>Payment Successful!</h2>
          <p>Your order has been placed successfully.</p>
          <p>Order ID: {orderId}</p>
          <p>Redirecting to home page...</p>
        </div>
      ) : (
        <div className="verify-failed">
          <h2>Payment Cancelled</h2>
          <p>Your payment was cancelled.</p>
          <p>Your cart has been preserved.</p>
          <p>Redirecting back to cart...</p>
        </div>
      )}
    </div>
  );
};

export default Verify; 