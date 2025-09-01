import mongoose from 'mongoose';
const recurringSchema=new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    amount:{type:Number,required:true},
    frequency:{type:String,enum:["daily","weekly","monthly"],required:true},
    nextDue:{type:Date,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
});

const Recurring=mongoose.model("Recurring",recurringSchema);
export default Recurring;