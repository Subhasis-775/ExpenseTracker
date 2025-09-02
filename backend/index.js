import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js'
import recurringRoutes from './routes/recurringRoutes.js';
import reportsRoute from './routes/reportsRoute.js';
import { processRecurring } from './controllers/recurringControl.js';
dotenv.config();
connectDB();
const app=express();
// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/auth',authRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/recurring',recurringRoutes);
app.use('/api/reports',reportsRoute);
cron.schedule("0 0 * * *",async()=>{
    console.log("Running recurring expenses cron job");
    await processRecurring();
})
const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
})


