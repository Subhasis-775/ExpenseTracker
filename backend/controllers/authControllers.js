import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
// register
export const signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"fill all the required fields"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"user already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password:hashedPassword});
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.status(201).json({token,user:{id:user._id,name,email}});
    }
    catch(error){
        console.error(`signup error ${error.message}`);
        res.status(500).json({message:error.message});
    };
};

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"please provide email and password"});
        }
    const user=await User.findOne({email:email.trim()});
    if(!user){
        return res.status(400).json({message:"Invalid credentials"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.status(200).json({token,user:{id:user._id,name:user.name,email:user.email}});
    }
    catch(error){
        console.error(`login error ${error}`);
        res.status(500).json({message:"Internal server error"});
    }
}