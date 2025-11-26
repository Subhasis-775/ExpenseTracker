import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: ["Food", "Travel", "Shopping", "Entertainment", "Bills", "Utilities", "Healthcare", "Education", "Recurring", "Subscription", "Other"]
    },
    amount: {
        type: Number,
        required: [true, "Please enter a budget limit"],
        min: [1, "Budget must be at least 1"]
    },
    month: {
        type: Number,
        required: true, // 1-12
        default: () => new Date().getMonth() + 1
    },
    year: {
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    },
    // To track if 80% alert has been sent for this specific budget
    alertSent80: {
        type: Boolean,
        default: false
    },
    // To track if 100% alert has been sent
    alertSent100: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure unique budget per category per month per user
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
