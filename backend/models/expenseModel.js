import mongoose from 'mongoose';
const expenseSchema=new mongoose.Schema({
    title:{type:String,
        required:[true,"please enter a title for expense"],
    trim:true
          },
    amount:{
        type:Number,
        required:[true,"please enter an amount"],
        min:[0,"amount cannot be negative"]
           },
    category:{
        type:String,
        required:[true,"Please select a category"],
        enum:["Food", "Travel", "Shopping", "Entertainment", "Bills", "Utilities", "Healthcare", "Education", "Other"]
        },
    date:{type:Date,
        required:true,
        default:Date.now,
    },
    notes:{
        type:String,
        trim:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},
{timestamps:true},
);
const Expense=mongoose.model("Expense",expenseSchema);
export default Expense;