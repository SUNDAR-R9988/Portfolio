const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

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

    return res.status(200).json({
      message: "Message sent successfully!"
    });

  } catch (error) {

    console.error("Email error:", error);

    return res.status(500).json({
      message: "Failed to send message."
    });
  }
};