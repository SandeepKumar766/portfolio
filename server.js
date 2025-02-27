// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();

// app.use(bodyParser.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/portfolio", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Contact Schema
// const contactSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   message: String,
// });

// const Contact = mongoose.model("Contact", contactSchema);

// // API Endpoint to save contact form data
// app.post("/contact", async (req, res) => {
//   try {
//     const { name, email, message } = req.body;
//     const newContact = new Contact({ name, email, message });
//     await newContact.save();
//     res.status(200).send("Message received.");
//   } catch (error) {
//     res.status(500).send("Error saving message.");
//   }
// });

// app.listen(5000, () => {
//   console.log("Server is running on http://localhost:5000");
// });






const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/portfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail
    pass: process.env.GMAIL_PASS, // App Password
  },
});

// API Endpoint: Save data + send email
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1️⃣ Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2️⃣ Send Email
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

    res.status(200).send("Message received and email sent successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to save message or send email.");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
