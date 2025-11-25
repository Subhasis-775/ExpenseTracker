import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Expense from "../models/expenseModel.js";

dotenv.config();

// Initialize Google Generative AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const callGemini = async (prompt) => {
  if (!genAI) {
    console.warn("⚠️  Gemini API key not configured");
    return null;
  }

  try {
    // Try models in order of preference
    const models = ["gemini-1.5-pro", "gemini-1.5-flash-latest", "gemini-pro"];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ Using model: ${modelName}`);
        return text?.trim() || null;
      } catch (modelError) {
        console.log(`⚠️  Model ${modelName} not available:`, modelError.message);
        continue; // Try next model
      }
    }
    
    throw new Error("All models failed");
  } catch (err) {
    console.error("❌ Gemini API call failed:", err.message);
    return null;
  }
};

/**
 * Fallback categorization using simple keyword matching
 */
const fallbackCategorize = (title, description = "") => {
  const text = `${title} ${description}`.toLowerCase();
  
  const categoryKeywords = {
    Food: ['food', 'restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'meal', 'pizza', 'burger', 'starbucks', 'mcdonalds', 'kfc', 'dominos'],
    Travel: ['uber', 'taxi', 'flight', 'hotel', 'train', 'bus', 'travel', 'fuel', 'petrol', 'gas', 'ola'],
    Shopping: ['amazon', 'flipkart', 'shopping', 'clothes', 'shoes', 'mall', 'store', 'purchase'],
    Entertainment: ['movie', 'cinema', 'netflix', 'spotify', 'prime', 'game', 'concert', 'theater'],
    Bills: ['electricity', 'water', 'internet', 'wifi', 'phone', 'mobile', 'broadband', 'bill'],
    Utilities: ['rent', 'maintenance', 'repair', 'service'],
    Healthcare: ['doctor', 'hospital', 'medicine', 'pharmacy', 'health', 'medical', 'clinic'],
    Education: ['school', 'college', 'course', 'book', 'tuition', 'fee', 'education'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return "Other";
};

/**
 * Auto-categorize expense based on title/description
 */
export const categorizeExpense = async (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const availableCategories = [
      "Food",
      "Travel",
      "Shopping",
      "Entertainment",
      "Bills",
      "Utilities",
      "Healthcare",
      "Education",
      "Other"
    ];

    const prompt = `
You are an expense categorization assistant.
Given an expense title and optional description, determine the most appropriate category.

Available categories: ${availableCategories.join(", ")}

Expense Title: "${title}"
${description ? `Description: "${description}"` : ""}

Rules:
- Respond with ONLY the category name, nothing else
- Choose the single most appropriate category from the list
- If unsure, choose "Other"
- Do not add any explanation or formatting

Category:`;

    let category = "Other";
    let confidence = "low";

    // Try AI categorization first
    const aiResponse = await callGemini(prompt);
    
    if (aiResponse) {
      // Clean and validate the response
      const suggestedCategory = aiResponse.trim().replace(/['"]/g, "");
      if (availableCategories.includes(suggestedCategory)) {
        category = suggestedCategory;
        confidence = "high";
      }
    } else {
      // Fallback to keyword matching
      category = fallbackCategorize(title, description);
      confidence = "medium";
    }

    res.json({ 
      category,
      confidence,
      method: aiResponse ? "ai" : "keyword"
    });
  } catch (err) {
    console.error("Categorization error:", err);
    // Final fallback
    const category = fallbackCategorize(req.body.title, req.body.description);
    res.json({ 
      category,
      confidence: "medium",
      method: "keyword"
    });
  }
};

/**
 * Fallback response generation
 */
const generateFallbackResponse = (message, expenses, totalSpent, byCategory) => {
  const msg = message.toLowerCase();
  
  // Common questions and responses
  if (msg.includes('most') || msg.includes('where')) {
    const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    return `Based on your expense data, you're spending the most on ${topCat[0]} with ₹${topCat[1].toFixed(2)}, which is ${((topCat[1]/totalSpent)*100).toFixed(1)}% of your total spending of ₹${totalSpent.toFixed(2)}.`;
  }
  
  if (msg.includes('total') || msg.includes('spent')) {
    return `You've spent a total of ₹${totalSpent.toFixed(2)} across ${expenses.length} transactions. Your expenses are distributed across ${Object.keys(byCategory).length} categories.`;
  }
  
  if (msg.includes('save') || msg.includes('saving')) {
    const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    return `To save money, consider reducing spending on ${topCat[0]}, your highest expense category at ₹${topCat[1].toFixed(2)}. Small changes in this category can make a big difference!`;
  }
  
  // Default response with overview
  const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  return `You've tracked ${expenses.length} expenses totaling ₹${totalSpent.toFixed(2)}. Your top spending category is ${topCat[0]} at ₹${topCat[1].toFixed(2)} (${((topCat[1]/totalSpent)*100).toFixed(1)}%). Keep tracking to get better insights!`;
};

/**
 * Enhanced AI chat with detailed expense analysis
 */
export const chatWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "Message is required" });

    // Fetch all user expenses with detailed information
    const expenses = await Expense.find({ userId }).sort({ date: -1 }).lean();

    if (expenses.length === 0) {
      return res.json({ 
        answer: "You haven't added any expenses yet. Start tracking your expenses to get personalized insights and analysis!"
      });
    }

    // Calculate comprehensive statistics
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    // Get recent expenses (last 5)
    const recentExpenses = expenses.slice(0, 5).map(exp => ({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: new Date(exp.date).toLocaleDateString()
    }));

    // Calculate monthly average
    const monthlyData = expenses.reduce((acc, exp) => {
      const monthKey = new Date(exp.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      acc[monthKey] = (acc[monthKey] || 0) + exp.amount;
      return acc;
    }, {});

    const avgMonthly = totalSpent / Math.max(Object.keys(monthlyData).length, 1);

    // Get top spending category
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    // Get date range
    const oldestDate = new Date(expenses[expenses.length - 1].date).toLocaleDateString();
    const newestDate = new Date(expenses[0].date).toLocaleDateString();

    const prompt = `
You are an intelligent financial advisor assistant for an Expense Tracker app.
Analyze the user's expense data and answer their question with detailed, actionable insights.

USER'S EXPENSE DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 OVERVIEW:
- Total Expenses Tracked: ${expenses.length} transactions
- Total Amount Spent: ₹${totalSpent.toFixed(2)}
- Average Monthly Spending: ₹${avgMonthly.toFixed(2)}
- Tracking Period: ${oldestDate} to ${newestDate}
- Top Spending Category: ${topCategory ? `${topCategory[0]} (₹${topCategory[1].toFixed(2)})` : 'N/A'}

📁 CATEGORY BREAKDOWN:
${Object.entries(byCategory).map(([cat, amt]) => 
  `- ${cat}: ₹${amt.toFixed(2)} (${((amt/totalSpent)*100).toFixed(1)}%)`
).join('\n')}

🕐 RECENT TRANSACTIONS:
${recentExpenses.map((exp, i) => 
  `${i+1}. ${exp.title} - ₹${exp.amount} (${exp.category}) on ${exp.date}`
).join('\n')}

USER'S QUESTION: "${message}"

INSTRUCTIONS:
1. Answer in a friendly, conversational tone
2. Use the expense data to provide specific, personalized insights
3. Include relevant numbers and percentages
4. Provide actionable advice when appropriate
5. Keep responses concise (max 200 words)
6. DO NOT use markdown formatting

YOUR ANSWER:`;

    // Try AI response first
    let aiResponse = await callGemini(prompt);
    
    const finalResponse = aiResponse || generateFallbackResponse(message, expenses, totalSpent, byCategory);

    res.json({ 
      answer: finalResponse,
      method: aiResponse ? "ai" : "fallback"
    });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ message: "Failed to process AI chat" });
  }
};
