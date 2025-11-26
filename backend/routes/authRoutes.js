import express from 'express';
import { login, signup, upgradeToPremium } from '../controllers/authControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router=express.Router();
router.post('/signup',signup);
router.post('/login',login);
router.post('/upgrade', authMiddleware, upgradeToPremium);

export default router;