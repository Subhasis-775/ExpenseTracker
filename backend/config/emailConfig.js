import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create the transporter object
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection (optional but good for debugging)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
  } else {
    console.log('✅ Email transporter is ready');
  }
});
