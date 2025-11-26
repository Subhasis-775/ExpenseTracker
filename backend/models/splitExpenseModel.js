import mongoose from 'mongoose';

const splitExpenseSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidBy: {
        type: String, // Name of the member who paid
        required: true
    },
    splitBetween: [{
        type: String // Names of members involved in the split
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const SplitExpense = mongoose.model('SplitExpense', splitExpenseSchema);
export default SplitExpense;
