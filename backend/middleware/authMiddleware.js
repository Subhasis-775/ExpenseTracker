import jwt from 'jsonwebtoken';
import User from '../models/user.js';
const authMiddleware=async(req,res,next)=>{
    try{
        const authHeader=req.header('Authorization');
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"access denied"});
        }
        const token=authHeader.replace("Bearer ","").trim();
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message:"user not found"});
        }
        req.user=user;
        next();
    }
    catch(error){
        return res.status(401).json({message:"Invalid token"});
    }
}
export default authMiddleware;