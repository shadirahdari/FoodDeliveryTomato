import React, { useState } from 'react';
import './ContactUs.css';
import { assets } from '../../../assets/assets';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-us">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for any questions or concerns</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-card">
            <img src={assets.location_icon} alt="Location" />
            <h3>Our Location</h3>
            <p>123 Food Street</p>
            <p>Foodie City, FC 12345</p>
          </div>

          <div className="contact-card">
            <img src={assets.phone_icon} alt="Phone" />
            <h3>Phone Number</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Sun 9am-11pm</p>
          </div>

          <div className="contact-card">
            <img src={assets.email_icon} alt="Email" />
            <h3>Email Address</h3>
            <p>support@fooddelivery.com</p>
            <p>info@fooddelivery.com</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 