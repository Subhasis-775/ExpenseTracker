import express from'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addRecurring, deleteRecurring, getRecurring } from '../controllers/recurringControl.js';
const router=express.Router();
router.post('/',authMiddleware,addRecurring);
router.get('/',authMiddleware,getRecurring);
router.delete('/:id',authMiddleware,deleteRecurring);

export default router;