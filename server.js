// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const mailgun = require('mailgun-js');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Mailgun setup
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Nodemailer transport using Mailgun
const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USER, // Mailgun SMTP username
    pass: process.env.MAILGUN_PASSWORD, // Mailgun SMTP password
  },
});

// Endpoint to send email
app.post('/send-email', (req, res) => {
  const { name, email, contact, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'webdevkush23@gmail.com', // Your receiving email
    subject: 'Investor Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nContact: ${contact}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ success: false, message: 'Error sending email' });
    }
    res.status(200).send({ success: true, message: 'Email sent successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
