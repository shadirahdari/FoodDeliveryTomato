// //import React, { useContext, useState } from 'react';
// import './PlaceOrder.css';
// import { StoreContext } from '../../../Context/StoreContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const PlaceOrder = () => {
//   const { getTotalCartAmount, cartItems, food_list, token, url } = useContext(StoreContext);
//   const navigate = useNavigate();

//   const subtotal = getTotalCartAmount();
//   const deliveryFee = 2;
//   const total = subtotal + deliveryFee;

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   const onChangeHandler = (event) => {
//     const { name, value } = event.target;
//     setData(prevData => ({ ...prevData, [name]: value }));
//   };

//   const reviewCart = () => {
//     navigate('/cart');
//   };

//   const placeOrder = async (event) => {
//     event.preventDefault();

//     // Add token validation
//     if (!token || token === "null" || token === "undefined" || token.trim() === "") {
//       alert("Please log in to place an order");
//       return;
//     }

//     console.log("Token being used:", token);

//     const orderItems = food_list
//       .filter(item => cartItems[item._id] > 0)
//       .map(item => ({ ...item, quantity: cartItems[item._id] }));

//     if (orderItems.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     try {
//       console.log("Sending order with data:", {
//         items: orderItems,
//         amount: total,
//         address: data
//       });

//       const response = await axios.post(
//         "http://localhost:4001/api/order/place",
//         {
//           items: orderItems,
//           amount: total,
//           address: data,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//         }
//       );

//       console.log("Full Response:", response.data);

//       if (response.data.success) {
//         // Save cart state to localStorage before redirecting
//         localStorage.setItem('savedCartItems', JSON.stringify(cartItems));
//         localStorage.setItem('savedOrderData', JSON.stringify(data));
        
//         const { session_url } = response.data;
//         window.location.replace(session_url);
//       } else {
//         alert("Failed to place the order. Server returned success: false.");
//       }
//     } catch (error) {
//       console.error("Request failed:", error);
//       if (error.response) {
//         console.error("Error response:", error.response.data);
//         alert(`Order failed: ${error.response.data.message || error.message}`);
//       } else if (error.request) {
//         alert("No response received from server. Please try again.");
//       } else {
//         alert("Error creating order. Please try again.");
//       }
//     }
//   };

//   return (
//     <form onSubmit={placeOrder} className='place-order'>
//       <div className="place-order-left">
//         <p className='title'>Delivery Information</p>
//         <div className="multi-field">
//           <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
//           <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
//         </div>
//         <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
//         <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
//         <div className="multi-field">
//           <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
//           <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
//         </div>
//         <div className="multi-field">
//           <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
//           <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
//         </div>
//         <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone number' />
//       </div>

//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-detials">
//               <p>Subtotal</p>
//               <p>${subtotal}</p>
//             </div>
//             <hr />
//             <div className="cart-total-detials">
//               <p>Delivery Fee</p>
//               <p>${subtotal === 0 ? 0 : deliveryFee}</p>
//             </div>
//             <hr />
//             <div className="cart-total-detials">
//               <b>Total</b>
//               <b>${subtotal === 0 ? 0 : total}</b>
//             </div>
//           </div>
//           <button type='button' onClick={reviewCart} className="review-cart-button">Review Cart</button>
//           <button type='submit'>Proceed to Payment</button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;