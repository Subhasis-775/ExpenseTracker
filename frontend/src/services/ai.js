// src/services/ai.js
import API from "./api.js";

export const chatWithAI = (message) => {
  return API.post("/ai/chat", { message });
};
