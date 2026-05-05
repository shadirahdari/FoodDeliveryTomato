import React, { useState } from 'react';
import './ContactUs.css';

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
            <div className="contact-icon" aria-hidden="true">📍</div>
            <h3>Our Location</h3>
            <p>123 Food Street</p>
            <p>Downtown City, NY 10001</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon" aria-hidden="true">📞</div>
            <h3>Phone Number</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Sun 9am-11pm</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon" aria-hidden="true">✉️</div>
            <h3>Email Address</h3>
            <p>support@fooddelivery.com</p>
            <p>info@fooddelivery.com</p>
          </div>
        </div>

        <div className="contact-right-section">
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

          <div className="map-container">
            <h2>Find Us</h2>
            <div className="map-wrapper">
              <iframe
                title="Food Delivery Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.03%2C40.70%2C-73.98%2C40.73&amp;layer=mapnik&amp;marker=40.7128%2C-74.0060"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="map-info">
              <p><strong>Address:</strong> 123 Food Street, Downtown City, NY 10001</p>
              <p><strong>Directions:</strong> Easy access from major highways. Street parking and nearby garage available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 