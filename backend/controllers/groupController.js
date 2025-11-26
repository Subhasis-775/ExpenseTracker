import Group from '../models/groupModel.js';
import SplitExpense from '../models/splitExpenseModel.js';

// Create a new group
export const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.user.id;

        // Add the creator to the members list if not already present
        // For simplicity, we assume the creator's name is passed or we fetch it.
        // Here we'll just trust the members array passed from frontend.

        const group = await Group.create({
            name,
            members,
            createdBy: userId
        });

        res.status(201).json({ success: true, data: group });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all groups for the user
export const getGroups = async (req, res) => {
    try {
        const userId = req.user.id;
        const groups = await Group.find({ createdBy: userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: groups });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get group details with expenses and balances
export const getGroupDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id);
        
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        const expenses = await SplitExpense.find({ groupId: id }).sort({ date: -1 });

        // Calculate Balances
        const balances = {};
        group.members.forEach(member => balances[member] = 0);

        expenses.forEach(expense => {
            const amount = expense.amount;
            const payer = expense.paidBy;
            const splitCount = expense.splitBetween.length;
            const splitAmount = amount / splitCount;

            // Payer gets credit
            if (balances[payer] !== undefined) {
                balances[payer] += amount;
            }

            // Splitters get debit
            expense.splitBetween.forEach(member => {
                if (balances[member] !== undefined) {
                    balances[member] -= splitAmount;
                }
            });
        });

        res.status(200).json({ 
            success: true, 
            data: {
                group,
                expenses,
                balances
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add expense to group
export const addGroupExpense = async (req, res) => {
    try {
        const { groupId, description, amount, paidBy, splitBetween } = req.body;
        
        const expense = await SplitExpense.create({
            groupId,
            description,
            amount,
            paidBy,
            splitBetween
        });

        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
