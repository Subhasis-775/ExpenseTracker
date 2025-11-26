import express from 'express';
import { createGroup, getGroups, getGroupDetails, addGroupExpense } from '../controllers/groupController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createGroup);
router.get('/', authMiddleware, getGroups);
router.get('/:id', authMiddleware, getGroupDetails);
router.post('/expense', authMiddleware, addGroupExpense);

export default router;
