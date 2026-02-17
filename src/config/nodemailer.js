// config/nodemailer.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config(); // Cargar variables de entorno
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar 'gmail', 'outlook', o configurar tu propio SMTP
  auth: {
    user: process.env.EMAIL_USER, // Tu dirección de correo
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación/App Password
  }
});
module.exports = transporter;