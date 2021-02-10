const nodemailer = require('nodemailer');

//TODO: get values from config

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'info@backendboilerplate.com',
    pass: 'strong_password',
  },
});

module.exports = { transporter };
