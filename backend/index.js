import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cron from 'node-cron';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import recurringRoutes from './routes/recurringRoutes.js';
import reportsRoute from './routes/reportsRoute.js';
import budgetRoutes from './routes/budgetRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import { processRecurring } from './controllers/recurringControl.js';
import aiRoutes from './routes/aiRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { 
  sendWeeklySummary, 
  sendMonthlySummary, 
  checkUpcomingRecurring 
} from './controllers/notificationController.js';

// Load .env explicitly from the same folder where index.js is
dotenv.config();

// DB Connection
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/reports', reportsRoute);
app.use('/api/budgets', budgetRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Cron Jobs

// Process Recurring Expenses (Daily at midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Running Recurring Expense Job...");
  await processRecurring();
});

// Weekly Summary (Every Monday at 9 AM)
cron.schedule("0 9 * * 1", async () => {
  console.log("Running Weekly Summary Job...");
  await sendWeeklySummary();
});

// Monthly Summary (1st of every month at 9 AM)
cron.schedule("0 9 1 * *", async () => {
  console.log("Running Monthly Summary Job...");
  await sendMonthlySummary();
});

// Upcoming Expense Alerts (Daily at 9 AM)
cron.schedule("0 9 * * *", async () => {
  console.log("Checking for upcoming expenses...");
  await checkUpcomingRecurring();
});

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
