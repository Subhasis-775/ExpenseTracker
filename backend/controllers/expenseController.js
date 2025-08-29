import Expense from '../models/expenseModel.js';
// Get all expenses
export const getExpenses=async(req,res)=>{
    try{
    const expenses=await Expense.find({userId:req.user.id}).sort({date:-1});
    res.status(200).json(expenses);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:`error fetching expenses ${error.message}`});
    }
};
// add Expenses
export const addExpense=async(req,res)=>{
    const {title,amount,category,date,notes}=req.body;
    try{
    if(!title || !amount || !category  ){
        return res.status(400).json({message:"please input the required fields"});
    }
    const newExpense=new Expense({title,amount,category,date:date?new Date(date):Date.now(),notes,userId:req.user.id});
    await newExpense.save();
    res.status(201).json(newExpense);
}
catch(error){
    res.status(500).json({message:`error adding expense ${error.message}`});
}
};
// Update expense
export const updateExpense=async(req,res)=>{

    try{
        const expense=await Expense.findOne({_id:req.params.id,userId:req.user.id});
        if(!expense){
            return res.status(404).json({message:"expense not found"});
        }
        const updatedExpense=await Expense.findOneAndUpdate({_id:req.params.id,userId:req.user.id},
            req.body,
            {new:true},);
        res.status(200).json(updatedExpense);
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({message:`error in updating the content ${error.message}`});
    }
}
// delete Expense
export const deleteExpense=async(req,res)=>{
    try{
        const expense=await Expense.findOne({_id:req.params.id,userId:req.user.id});
        if(!expense){
            return res.status(404).json({message:"expense not found"});
        }
    await expense.deleteOne();
    res.status(200).json({message:"expense deleted successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:`error in deleting the expense ${error.message}`})
    }
}
