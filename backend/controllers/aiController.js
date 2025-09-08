// backend/controllers/aiController.js
import dotenv from "dotenv";
import Expense from "../models/expenseModel.js";

dotenv.config();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

// --- Helper function for Gemini API ---
const callGemini = async (prompt) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      console.error("Gemini API Error:", err || response.statusText);
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (err) {
    console.warn("Gemini API call failed:", err.message);
    return null;
  }
};

// --- AI Chat Controller ---
export const chatWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "Message is required" });

    // 🔹 Fetch all expenses for this user
    const expenses = await Expense.find({ userId }).lean();

    // 🔹 Summarize expenses
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    // 🔹 Updated AI prompt for clean, chat-like responses
    const prompt = `
You are a friendly and helpful financial assistant.
Answer the user's question in plain, conversational language.
Do NOT use bullet points, asterisks, or Markdown formatting.
Use the user's expense data only if the question is finance-related.

User's Expense Summary:
- Total spent: ${totalSpent}
- Breakdown by category: ${JSON.stringify(byCategory)}

User's Question: "${message}"

Answer naturally and clearly, like a chat message from a helpful assistant.
    `;

    const aiResponse =
      (await callGemini(prompt)) || "⚠️ Sorry, I couldn’t analyze your expenses right now.";

    res.json({ answer: aiResponse });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ message: "Failed to process AI chat" });
  }
};
