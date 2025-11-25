import express from "express";
import { chatWithAI, categorizeExpense } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Chat with AI for expense insights
router.post("/chat", authMiddleware, chatWithAI);

// Auto-categorize expense based on title
router.post("/categorize", authMiddleware, categorizeExpense);

export default router;
