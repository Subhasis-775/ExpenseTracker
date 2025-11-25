import User from '../models/user.js';
import Expense from '../models/expenseModel.js';
import Recurring from '../models/recurringModel.js';
import createTransporter from '../config/emailConfig.js';
import {
  getWeeklySummaryTemplate,
  getMonthlySummaryTemplate,
  getRecurringAlertTemplate,
} from '../utils/emailTemplates.js';

// Send Weekly Summary (Last 7 days)
export const sendWeeklySummary = async () => {
  console.log('Starting weekly summary email job...');
  const transporter = await createTransporter();
  if (!transporter) return;

  try {
    const users = await User.find({});
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    for (const user of users) {
      // Get expenses for the week
      const expenses = await Expense.find({
        userId: user._id,
        date: { $gte: startDate, $lte: endDate },
      });

      if (expenses.length === 0) continue;

      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      // Category breakdown
      const categoryMap = {};
      expenses.forEach((exp) => {
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
      });

      const categoryBreakdown = Object.keys(categoryMap).map((cat) => ({
        category: cat,
        amount: categoryMap[cat],
      }));

      const emailHtml = getWeeklySummaryTemplate(
        user.name,
        startDate.toLocaleDateString(),
        endDate.toLocaleDateString(),
        totalSpent,
        categoryBreakdown
      );

      await transporter.sendMail({
        from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Weekly Expense Summary (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`,
        html: emailHtml,
      });

      console.log(`Weekly summary sent to ${user.email}`);
    }
  } catch (error) {
    console.error('Error sending weekly summaries:', error);
  }
};

// Send Monthly Summary (Last Month)
export const sendMonthlySummary = async () => {
  console.log('Starting monthly summary email job...');
  const transporter = await createTransporter();
  if (!transporter) return;

  try {
    const users = await User.find({});
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const monthName = firstDayLastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    for (const user of users) {
      const expenses = await Expense.find({
        userId: user._id,
        date: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
      });

      if (expenses.length === 0) continue;

      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      // Top categories
      const categoryMap = {};
      expenses.forEach((exp) => {
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
      });

      const topCategories = Object.keys(categoryMap)
        .map((cat) => ({ category: cat, amount: categoryMap[cat] }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      const emailHtml = getMonthlySummaryTemplate(
        user.name,
        monthName,
        totalSpent,
        topCategories
      );

      await transporter.sendMail({
        from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Monthly Expense Report - ${monthName}`,
        html: emailHtml,
      });

      console.log(`Monthly summary sent to ${user.email}`);
    }
  } catch (error) {
    console.error('Error sending monthly summaries:', error);
  }
};

// Check for upcoming recurring expenses (Due in 3 days)
export const checkUpcomingRecurring = async () => {
  console.log('Checking for upcoming recurring expenses...');
  const transporter = await createTransporter();
  if (!transporter) return;

  try {
    const users = await User.find({});
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    for (const user of users) {
      const recurring = await Recurring.find({ userId: user._id });

      for (const item of recurring) {
        const nextDue = new Date(item.nextDue);
        
        // Check if due date is exactly 3 days from now (ignoring time)
        const isDueIn3Days = 
          nextDue.getDate() === threeDaysLater.getDate() &&
          nextDue.getMonth() === threeDaysLater.getMonth() &&
          nextDue.getFullYear() === threeDaysLater.getFullYear();

        if (isDueIn3Days) {
          const emailHtml = getRecurringAlertTemplate(
            user.name,
            item.title,
            item.amount,
            nextDue.toLocaleDateString()
          );

          await transporter.sendMail({
            from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Upcoming Expense Alert: ${item.title}`,
            html: emailHtml,
          });

          console.log(`Recurring alert sent to ${user.email} for ${item.title}`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking recurring expenses:', error);
  }
};
