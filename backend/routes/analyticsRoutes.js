import express from 'express';
import {
  getWeeklyTrends,
  getCategoryComparison,
  getMonthlyComparison
} from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All analytics routes are protected
router.get('/weekly', authMiddleware, getWeeklyTrends);
router.get('/category-comparison', authMiddleware, getCategoryComparison);
router.get('/monthly-comparison', authMiddleware, getMonthlyComparison);

export default router;
