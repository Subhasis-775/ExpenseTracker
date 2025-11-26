import Budget from '../models/budgetModel.js';
import Expense from '../models/expenseModel.js';
import mongoose from 'mongoose';

// Set or Update Budget
export const setBudget = async (req, res) => {
    try {
        const { category, amount, month, year } = req.body;
        const userId = req.user.id;

        // Default to current month/year if not provided
        const currentMonth = month || new Date().getMonth() + 1;
        const currentYear = year || new Date().getFullYear();

        let budget = await Budget.findOne({
            userId,
            category,
            month: currentMonth,
            year: currentYear
        });

        if (budget) {
            budget.amount = amount;
            // Reset alerts if budget is increased
            if (amount > budget.amount) {
                budget.alertSent80 = false;
                budget.alertSent100 = false;
            }
            await budget.save();
        } else {
            budget = await Budget.create({
                userId,
                category,
                amount,
                month: currentMonth,
                year: currentYear
            });
        }

        res.status(200).json({ success: true, data: budget });
    } catch (error) {
        console.error("Set Budget Error:", error);
        res.status(500).json({ success: false, message: "Failed to set budget" });
    }
};

// Get Budgets with Progress
export const getBudgets = async (req, res) => {
    try {
        const userId = req.user.id;
        const { month, year } = req.query;

        const currentMonth = Number(month) || new Date().getMonth() + 1;
        const currentYear = Number(year) || new Date().getFullYear();

        // 1. Get all budgets for the user for this month
        const budgets = await Budget.find({
            userId,
            month: currentMonth,
            year: currentYear
        });

        // 2. Calculate total spending per category for this month
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        const expenses = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalSpent: { $sum: "$amount" }
                }
            }
        ]);

        // 3. Merge budgets with spending
        const budgetData = budgets.map(budget => {
            const expense = expenses.find(e => e._id === budget.category);
            const spent = expense ? expense.totalSpent : 0;
            const percentage = Math.min((spent / budget.amount) * 100, 100);
            
            return {
                ...budget.toObject(),
                spent,
                percentage,
                remaining: Math.max(budget.amount - spent, 0),
                isExceeded: spent > budget.amount
            };
        });

        res.status(200).json({ success: true, data: budgetData });
    } catch (error) {
        console.error("Get Budgets Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch budgets" });
    }
};

// Delete Budget
export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;
        await Budget.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Budget deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete budget" });
    }
};
