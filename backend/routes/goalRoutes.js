import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalController.js';

const router = express.Router();

router.get("/", authMiddleware, getGoals);
router.post('/', authMiddleware, createGoal);
router.put('/:id', authMiddleware, updateGoal);
router.delete("/:id", authMiddleware, deleteGoal);

export default router;
