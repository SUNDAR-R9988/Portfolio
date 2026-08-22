const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Message: ${subject}`,
      text: `
New message from your portfolio

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `
    });

    res.status(200).json({
      message: "Message sent successfully!"
    });

  } catch (error) {
    console.error("Email error:", error);

    res.status(500).json({
      message: "Failed to send message."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});