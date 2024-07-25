import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const transporter = nodemailer.createTransport({
  service: config.SERVICE_NODEMAILER,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

export const sendRegistrationEmail = async (userEmail) => {
  const mailOptions = {
    from: config.FROM_NODEMAILER,
    to: userEmail,
    subject: 'Registration Confirmation',
    text: 'Thank you for registering!',
    html: '<h1>Thank you for registering!</h1><p>We are glad to have you with us.</p>',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully');
  } catch (error) {
    console.error('Error sending registration email:', error);
  }
};
