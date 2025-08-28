import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
dotenv.config();
connectDB();
const app=express();
// middleware
app.use(cors());
app.use(express.json());
app.set(express.urlencoded({extended:true}));
app.use('/api/auth',authRoutes);
const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
})


