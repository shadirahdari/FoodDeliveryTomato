import React, { useEffect, useContext, useState } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeVerification = async () => {
      try {
        // Log the URL parameters and token status
        console.log('Verification Status:', {
          success,
          orderId,
          hasToken: !!token,
          fullUrl: window.location.href
        });

        // Ensure token is still in localStorage and context
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
          console.log('Restoring token from localStorage');
          setToken(storedToken);
          // Wait a bit for the token to be set in context
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const currentToken = storedToken || token;
        if (!currentToken) {
          throw new Error('No authentication token found');
        }

        if (success === 'true') {
          console.log('Payment successful, clearing cart...');
          
          // Set payment success flag before clearing cart
          localStorage.setItem('paymentSuccess', 'true');
          
          // Clear cart in backend first
          try {
            await axios.post(`${url}/api/cart/clear`, {}, {
              headers: {
                Authorization: `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
              }
            });
            console.log('Backend cart cleared successfully');
            
            // Clear frontend cart
            clearCart();
            
            // Update order status to processing
            await axios.patch(`${url}/api/order/${orderId}/status`, 
              { status: 'processing' },
              {
                headers: {
                  Authorization: `Bearer ${currentToken}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            setTimeout(() => {
              setIsProcessing(false);
              navigate('/');
            }, 3000);
          } catch (error) {
            console.error('Error in success flow:', error);
            setError(error.message);
            setIsProcessing(false);
          }
        } else {
          console.log('Payment cancelled/failed, restoring cart...');
          try {
            await loadCartData(currentToken);
            setTimeout(() => {
              setIsProcessing(false);
              navigate('/cart');
            }, 3000);
          } catch (error) {
            console.error('Error restoring cart:', error);
            setError(error.message);
            setIsProcessing(false);
          }
        }
      } catch (error) {
        console.error('Error during verification:', error);
        setError(error.message);
        setIsProcessing(false);
        setTimeout(() => {
          navigate(success === 'true' ? '/' : '/cart');
        }, 3000);
      }
    };

    initializeVerification();
  }, [success, navigate, orderId, token, setToken, loadCartData, clearCart, url]);

  if (error) {
    return (
      <div className="verify-container">
        <div className="verify-failed">
          <h2>Verification Error</h2>
          <p>{error}</p>
          <p>Redirecting back...</p>
        </div>
      </div>
    );
  }

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
          <p>{isProcessing ? 'Processing your order...' : 'Redirecting to home page...'}</p>
        </div>
      ) : (
        <div className="verify-failed">
          <h2>Payment Cancelled</h2>
          <p>Your payment was cancelled.</p>
          <p>Your cart has been preserved.</p>
          <p>{isProcessing ? 'Restoring your cart...' : 'Redirecting back to cart...'}</p>
        </div>
      )}
    </div>
  );
};

export default Verify; 