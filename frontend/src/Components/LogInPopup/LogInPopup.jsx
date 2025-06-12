import React, { useContext, useState, useEffect } from 'react';
import './LogInPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from "axios";

const LogInPopup = ({ setShowLogin }) => {
  const { token, setToken, url } = useContext(StoreContext);

  useEffect(() => {
    if (token && token !== "null" && token !== "undefined") {
      setShowLogin(false);
    }
  }, [token]);

  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandeler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    console.log("🔍 Debug - Context URL:", url);
    console.log("🔍 Debug - Current State:", currentState);
    console.log("🔍 Debug - Form Data:", data);

    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const endpoint = currentState === "Login" ? "/api/user/login" : "/api/user/register";
    const fullUrl = baseUrl + endpoint;

    const payload = currentState === "Login"
      ? { email: data.email, password: data.password }
      : data;

    console.log("📡 Making request to:", fullUrl);
    console.log("📦 With payload:", payload);

    try {
      console.log("🚀 Starting request...");
      const response = await axios.post(fullUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("✅ Full response:", response);
      console.log("📄 Response data:", response.data);

      if (response.data.success && response.data.token) {
        console.log("🎉 Login successful! Token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setShowLogin(false);
      } else {
        console.warn("⚠️ Login failed - Server response:", response.data);
        alert(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("❌ Login error - Full error object:", error);
      if (error.response) {
        console.error("🔍 Server response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        alert(error.response.data.message || "Login failed (server responded).");
      } else if (error.request) {
        console.error("📡 No response received - Request details:", error.request);
        alert("No response from server. Please try again.");
      } else {
        console.error("❗ Error setting up request:", error.message);
        alert("Unable to connect to server. Please try again.");
      }
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <input
              type="text"
              name="name"
              onChange={onChangeHandeler}
              value={data.name}
              placeholder="Your name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            onChange={onChangeHandeler}
            value={data.email}
            placeholder="Your email"
            required
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandeler}
            value={data.password}
            placeholder="Password"
            required
            autoComplete="current-password"
          />
        </div>
        <button type='submit'>
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currentState === "Login" ? (
          <p>Create a new account? <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default LogInPopup;
