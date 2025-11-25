import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import createTransporter from '../config/emailConfig.js';
import { getWelcomeEmailTemplate, getLoginNotificationTemplate } from '../utils/authEmailTemplates.js';

// Register
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "fill all the required fields" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Send welcome email (don't wait for it to complete)
        sendWelcomeEmail(name, email).catch(err =>
            console.error('Failed to send welcome email:', err.message)
        );

        res.status(201).json({ token, user: { id: user._id, name, email } });
    }
    catch (error) {
        console.error(`signup error ${error.message}`);
        res.status(500).json({ message: error.message });
    };
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "please provide email and password" });
        }
        const user = await User.findOne({ email: email.trim() });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Send login notification email (don't wait for it to complete)
        const loginTime = new Date().toLocaleString();
        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
        sendLoginNotification(user.name, user.email, loginTime, ipAddress).catch(err =>
            console.error('Failed to send login notification:', err.message)
        );

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (error) {
        console.error(`login error ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Helper function to send welcome email
async function sendWelcomeEmail(userName, userEmail) {
    try {
        const transporter = await createTransporter();
        if (!transporter) {
            console.log('Email transporter not available');
            return;
        }

        const emailHtml = getWelcomeEmailTemplate(userName, userEmail);

        await transporter.sendMail({
            from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '🎉 Welcome to Expense Tracker!',
            html: emailHtml,
        });

        console.log(`Welcome email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending welcome email:', error.message);
        throw error;
    }
}

// Helper function to send login notification email
async function sendLoginNotification(userName, userEmail, loginTime, ipAddress) {
    try {
        const transporter = await createTransporter();
        if (!transporter) {
            console.log('Email transporter not available');
            return;
        }

        const emailHtml = getLoginNotificationTemplate(userName, loginTime, ipAddress);

        await transporter.sendMail({
            from: `"Expense Tracker Security" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '🔐 New Login to Your Account',
            html: emailHtml,
        });

        console.log(`Login notification sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending login notification:', error.message);
        throw error;
    }
}