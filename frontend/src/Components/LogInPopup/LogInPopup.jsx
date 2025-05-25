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
    console.log("🐞 onLogin function is running");

    let newUrl = url.endsWith('/') ? url : url + '/';
    newUrl += currentState === "Login" ? "api/user/login" : "api/user/register";

    const payload = currentState === "Login"
      ? { email: data.email, password: data.password }
      : data;

    console.log("POST to:", newUrl, "with data:", payload);
    console.log("🚨 About to send login request...");

    try {
      const response = await axios.post(newUrl, payload);
      console.log("✅ Login response FULL:", response);

      if (response.status === 200 && response.data.token) {
        console.log("✅ Got token:", response.data.token);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        console.warn("⚠️ Login failed or token missing:", response.data);
        alert(response.data.message || "Login failed.");
      }

    } catch (error) {
      console.error("❌ Login error:", error);

      if (error.response) {
        console.error("🔍 Backend responded with:", error.response.data);
        alert(error.response.data.message || "Login failed (server responded).");
      } else if (error.request) {
        console.error("📡 No response from backend:", error.request);
        alert("No response from server. Check your backend.");
      } else {
        console.error("❗ Unexpected error:", error.message);
        alert("Unexpected login error.");
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
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandeler}
            value={data.password}
            placeholder="Password"
            required
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
