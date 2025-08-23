const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS (STARTTLS)
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSKEY, // App Password (not your Gmail password)
  },
  tls: {
    rejectUnauthorized: false, // Only in dev! Remove for production
  },
});

module.exports = transporter;