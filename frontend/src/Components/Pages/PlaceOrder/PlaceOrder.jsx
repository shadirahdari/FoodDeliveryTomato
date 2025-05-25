import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../../Context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Form field configuration
const FORM_FIELDS = {
  firstName: { type: 'text', placeholder: 'First Name', required: true },
  lastName: { type: 'text', placeholder: 'Last Name', required: true },
  email: { type: 'email', placeholder: 'Email', required: true },
  street: { type: 'text', placeholder: 'Street', required: true },
  city: { type: 'text', placeholder: 'City', required: true },
  state: { type: 'text', placeholder: 'State', required: true },
  zipcode: { type: 'text', placeholder: 'Zip Code', required: true },
  country: { type: 'text', placeholder: 'Country', required: true },
  phone: { type: 'tel', placeholder: 'Phone number', required: true },
};

// Group fields for multi-field layout
const FIELD_GROUPS = [
  ['firstName', 'lastName'],
  ['email'],
  ['street'],
  ['city', 'state'],
  ['zipcode', 'country'],
  ['phone'],
];

const DeliveryForm = ({ data, onChangeHandler }) => {
  return (
    <div className="place-order-left">
      <p className='title'>Delivery Information</p>
      {FIELD_GROUPS.map((group, groupIndex) => (
        <div key={groupIndex} className={group.length > 1 ? "multi-field" : ""}>
          {group.map((fieldName) => {
            const field = FORM_FIELDS[fieldName];
            return (
              <input
                key={fieldName}
                required={field.required}
                name={fieldName}
                type={field.type}
                placeholder={field.placeholder}
                value={data[fieldName]}
                onChange={onChangeHandler}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const CartSummary = ({ subtotal, deliveryFee, total, onReviewCart }) => {
  return (
    <div className="place-order-right">
      <div className="cart-total">
        <h2>Cart Totals</h2>
        <div>
          <div className="cart-total-detials">
            <p>Subtotal</p>
            <p>${subtotal}</p>
          </div>
          <hr />
          <div className="cart-total-detials">
            <p>Delivery Fee</p>
            <p>${subtotal === 0 ? 0 : deliveryFee}</p>
          </div>
          <hr />
          <div className="cart-total-detials">
            <b>Total</b>
            <b>${subtotal === 0 ? 0 : total}</b>
          </div>
        </div>
        <button type='button' onClick={onReviewCart} className="review-cart-button">
          Review Cart
        </button>
        <button type='submit'>Proceed to Payment</button>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, food_list, token, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const subtotal = getTotalCartAmount();
  const deliveryFee = 2;
  const total = subtotal + deliveryFee;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReviewCart = () => {
    navigate('/cart');
  };

  const validateOrder = () => {
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      throw new Error("Please log in to place an order");
    }

    const orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id]
      }));

    if (orderItems.length === 0) {
      throw new Error("Your cart is empty!");
    }

    return orderItems;
  };

  const saveOrderState = () => {
    localStorage.setItem('savedCartItems', JSON.stringify(cartItems));
    localStorage.setItem('savedOrderData', JSON.stringify(formData));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    try {
      const orderItems = validateOrder();

      const response = await axios.post(
        `${url}/api/order/place`,
        {
          items: orderItems,
          amount: total,
          address: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        saveOrderState();
        window.location.replace(response.data.session_url);
      } else {
        throw new Error("Failed to place the order. Server returned success: false.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(error.response?.data?.message || error.message || "Error creating order. Please try again.");
    }
  };

  return (
    <form onSubmit={handlePlaceOrder} className='place-order'>
      <DeliveryForm 
        data={formData} 
        onChangeHandler={handleInputChange} 
      />
      <CartSummary 
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onReviewCart={handleReviewCart}
      />
    </form>
  );
};

export default PlaceOrder;
