import { useState } from 'react';
import './ContactMe.css';

function ContactMe() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Me</h1>
      <div className="contact-form-wrapper">
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
            rows="6"
          />
          <button type="submit" className="cursor-target">Send Message</button>
          {submitted && <p className="success-msg">Message sent successfully!</p>}
        </form>
      </div>
    </div>
  );
}

export default ContactMe;
