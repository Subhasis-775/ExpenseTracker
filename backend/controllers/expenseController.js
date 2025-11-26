import Expense from '../models/expenseModel.js';
import Budget from '../models/budgetModel.js';
import { transporter } from '../config/emailConfig.js';
import { getBudgetAlertTemplate } from '../utils/emailTemplates.js';

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, sort, page = 1 } = req.query;
    const limit = 5; // fixed limit

    let query = { userId: req.user.id || req.user._id };

    if (category) query.category = category;

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const sortMap = {
      newest: { date: -1 },
      oldest: { date: 1 },
      amountAsc: { amount: 1 },
      amountDesc: { amount: -1 },
      title: { title: 1 },
    };

    const sortOption = sortMap[sort] || sortMap.newest;
    const skip = (page - 1) * limit;

    const expenses = await Expense.find(query).sort(sortOption).skip(skip).limit(limit);
    const total = await Expense.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      count: expenses.length,
      page: Number(page),
      pages: Math.ceil(total / limit),
      expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching expenses: ${error.message}` });
  }
};

// add Expenses
export const addExpense = async (req, res) => {
  const { title, amount, category, date, notes } = req.body;
  try {
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "please input the required fields" });
    }
    const newExpense = new Expense({
      title,
      amount,
      category,
      date: date ? new Date(date) : Date.now(),
      notes,
      userId: req.user.id
    });
    await newExpense.save();

    // --- BUDGET CHECK LOGIC ---
    try {
      const expenseDate = new Date(newExpense.date);
      const month = expenseDate.getMonth() + 1;
      const year = expenseDate.getFullYear();

      const budget = await Budget.findOne({
        userId: req.user.id,
        category,
        month,
        year
      });

      if (budget) {
        // Calculate total spent in this category for the month
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);

        const result = await Expense.aggregate([
          {
            $match: {
              userId: newExpense.userId, // Use the objectId from the new expense
              category: category,
              date: { $gte: startOfMonth, $lte: endOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" }
            }
          }
        ]);

        const totalSpent = result.length > 0 ? result[0].total : 0;
        const percentage = (totalSpent / budget.amount) * 100;

        // Check for alerts
        let alertType = null;
        if (percentage >= 100 && !budget.alertSent100) {
          alertType = '100%';
          budget.alertSent100 = true;
          await budget.save();
        } else if (percentage >= 80 && percentage < 100 && !budget.alertSent80) {
          alertType = '80%';
          budget.alertSent80 = true;
          await budget.save();
        }

        if (alertType) {
          console.log(`Sending ${alertType} budget alert for ${category}`);
          const emailHtml = getBudgetAlertTemplate(
            req.user.name,
            category,
            budget.amount,
            totalSpent,
            percentage
          );

          await transporter.sendMail({
            from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
            to: req.user.email,
            subject: alertType === '100%' ? `🚨 Budget Exceeded: ${category}` : `⚠️ Budget Warning: ${category}`,
            html: emailHtml
          });
        }
      }
    } catch (budgetError) {
      console.error("Budget check failed:", budgetError);
      // Don't fail the request if budget check fails
    }
    // --------------------------

    res.status(201).json(newExpense);
  }
  catch (error) {
    res.status(500).json({ message: `error adding expense ${error.message}` });
  }
};

// Update expense
export const updateExpense = async (req, res) => {

  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    const updatedExpense = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },);
    res.status(200).json(updatedExpense);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: `error in updating the content ${error.message}` });
  }
}
// delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    await expense.deleteOne();
    res.status(200).json({ message: "expense deleted successfully" });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: `error in deleting the expense ${error.message}` })
  }
}
