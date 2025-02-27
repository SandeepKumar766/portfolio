import React, { useState } from "react";
import axios from "axios";
import '../css/Contact.css';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await axios.post("http://localhost:5000/send-email", formData);
      setStatus(response.data.message);
    } catch (error) {
      setStatus("Failed to send email. Try again.");
    }
  };

  return (
    <div className="contact-section">
      <h2>Contact Me</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" onChange={handleChange} required />
        <input type="text" name="subject" placeholder="Subject" onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message" rows="4" onChange={handleChange} required></textarea>
        <button type="submit" className="cta-button">Send Email</button>
        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
  );
};

export default Contact;
