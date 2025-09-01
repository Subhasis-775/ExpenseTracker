import Expense from "../models/expenseModel.js";
import Recurring from "../models/recurringModel.js";

export const addRecurring=async(req,res)=>{
    try{
    const {title,amount,frequency,nextDue}=req.body;
    if(!title || !amount || !frequency || !nextDue){
        return res.status(400).json("please input the required fields");
    }
    const recurring=await new Recurring({title,amount,frequency,nextDue,userId:req.user._id});
     await recurring.save();
     res.status(201).json(recurring);
}
catch(error){
    return res.status(500).json({message:`error adding recurring expense ${error.message}`});
}
};

export const getRecurring=async(req,res)=>{
    try{
        const recurring=await Recurring.find({userId:req.user._id}).sort({nextDue:1});
        if(recurring.length===0){
            return res.status(200).json([]);
        }
        res.status(200).json(recurring);
    }
    catch(error){
        return res.status(500).json({message:`error in fetching the recurring expenses ${error.message}`});
    }
};

export const deleteRecurring=async(req,res)=>{
    try{
        const recurring=await Recurring.findOneAndDelete({_id:req.params.id,userId:req.user._id});
        if(!recurring){
            return res.status(404).json({message:"Not found"});
        }
        res.status(200).json({message:"recurring expense deleted"});
    }
    catch(error){
        res.status(500).json({ message: "Error deleting recurring expense", error:error.message });
    }
}

export const processRecurring=async()=>{
    try {
        const today=new Date();
        today.setHours(0,0,0,0);
        const recurringExpense=await Recurring.find({nextDue:{$lte:today}});
        for(const r of recurringExpense){
            await Expense.create({
                title:r.title,
                amount:r.amount,
                category:"Recurring",
                date:today,
                userId:r.userId,
                isAutoAdded:true,
            });

            let newDate=new Date(r.nextDue);
            if(r.frequency==="daily") newDate.setDate(newDate.getDate()+1);
            if(r.frequency==="weekly") newDate.setDate(newDate.getDate()+7);
            if(r.frequency==="monthly") newDate.setMonth(newDate.getMonth()+1);
            newDate.setHours(0,0,0,0);
            r.nextDue=newDate;
            await r.save();
        }
        // res.status(200).json({ message: "Recurring expenses processed", count: recurringExpense.length });
 console.log(`✅ Processed ${recurringExpense.length} recurring expenses`);
    return recurringExpense.length;
    } catch (error) {
        console.error("error processing the recurring expense",error.message);
    }
}
