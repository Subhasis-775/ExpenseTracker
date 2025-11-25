import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = async () => {
  try {
    // Using Gmail App Password (simpler and more reliable than OAuth2)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email transporter is ready');
    
    return transporter;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return null;
  }
};

export default createTransporter;
