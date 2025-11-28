import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a goal name"],
    trim: true
  },
  targetAmount: {
    type: Number,
    required: [true, "Please enter a target amount"],
    min: [0, "Target amount cannot be negative"]
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, "Current amount cannot be negative"]
  },
  deadline: {
    type: Date,
    required: false
  },
  category: {
    type: String,
    enum: ["Vacation", "Electronics", "Education", "Emergency Fund", "Home", "Vehicle", "Other"],
    default: "Other"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
