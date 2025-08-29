import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addExpense, deleteExpense, getExpenses, updateExpense } from '../controllers/expenseController.js';
const router=express.Router();
router.get("/",authMiddleware,getExpenses);
router.post('/',authMiddleware,addExpense);
router.put('/:id',authMiddleware,updateExpense);
router.delete("/:id",authMiddleware,deleteExpense);
export default router;