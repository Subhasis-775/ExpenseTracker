import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentDetails,
} from '../controllers/paymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/history', authMiddleware, getPaymentHistory);
router.get('/:id', authMiddleware, getPaymentDetails);

export default router;
