import React from 'react'
import Navbar from './components/navbar/navbar'
import {Routes, Route, Navigate} from 'react-router-dom'
import Order from './pages/Order/Order'
// import { ToastContainer} from 'react-toastify';
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Login from './pages/Login/Login'
import Sidebar from './components/sidebar/Sidebar'
import TokenTest from './pages/TokenTest'

const Layout = ({ children }) => {
  return (
    <div className="app-content">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Navbar />
      <hr />
      <Layout>{children}</Layout>
    </>
  );
};

const App = () => {
  const token = localStorage.getItem('token');

  if (!token && window.location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      {/* <ToastContainer/> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/add" element={
          <ProtectedRoute>
            <Add />
          </ProtectedRoute>
        }/>
        <Route path="/list" element={
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        }/>
        <Route path="/order" element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }/>
        <Route path="/test-token" element={
          <ProtectedRoute>
            <TokenTest />
          </ProtectedRoute>
        }/>
        <Route path="/" element={<Navigate to="/add" />} />
      </Routes>
    </div>
  );
};

export default App

