import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { generateReport } from '../controllers/reportController.js';
const router=express.Router();
router.get('/',authMiddleware,generateReport);

export default router;