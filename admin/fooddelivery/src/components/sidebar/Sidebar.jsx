import React from 'react'
import './sidebar.css'
import { assets } from '../../assets/asset'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon_white} alt="Add Icon" />
          <p>Add Items</p>
        </NavLink>

        <NavLink to='/list' className="sidebar-option">
          <img src={assets.list_icon} alt="List Icon" />
          <p>View Items</p>
        </NavLink>

        <NavLink to='/users' className="sidebar-option">
          <img src={assets.profile_icon} alt="Users Icon" />
          <p>Users</p>
        </NavLink>

        <NavLink to='/reviews' className="sidebar-option">
          <img src={assets.review_icon || assets.list_icon} alt="Reviews Icon" />
          <p>Reviews</p>
        </NavLink>

        <NavLink to='/drivers' className="sidebar-option">
          <img src={assets.parcel_icon} alt="Drivers Icon" />
          <p>Drivers</p>
        </NavLink>
        
        <NavLink to='/order' className="sidebar-option">
          <img src={assets.order_icon} alt="Order Icon" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
