import React, { useState } from 'react'
import Navbar from './Components/Navbar/navbar'
import{ Route, Routes} from 'react-router-dom'
import Home from './Components/Pages/Home/Home'
import Cart from './Components/Pages/Cart/Cart'
import PlaceOrder from "./Components/Pages/PlaceOrder/PlaceOrder";
import Footer from './Components/Footer/Footer'
import LogInPopup from './Components/LogInPopup/LogInPopup'
import Register from './Components/Pages/Register'
import Verify from './Components/Pages/Verify/Verify'
import ContactUs from './Components/Pages/ContactUs/ContactUs'

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className='App'>
      <Navbar key={localStorage.getItem("token")} setShowLogin={setShowLogin} />

        {showLogin && <LogInPopup setShowLogin={setShowLogin} />}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cart' element={<Cart />} />
          <Route path='/Order' element={<PlaceOrder />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/contact' element={<ContactUs />} />
        </Routes>
      </div>
      
      <Footer />
    </>
  );
}

export default App
