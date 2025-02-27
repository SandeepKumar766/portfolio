const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail
    pass: process.env.GMAIL_PASS, // App Password
  },
});

// API Endpoint: Send email only
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Send Email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER, // Your Gmail to receive messages
      subject: `Portfolio Contact: Message from ${name}`,
      text: `
        You have a new message from your portfolio contact form:

        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("Message sent successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to send email.");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
