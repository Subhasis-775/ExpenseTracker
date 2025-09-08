import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { chatWithAI } from "../services/ai";

const AIChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I’m your AI finance assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAI(input.trim());
      let aiResponse = res.data.answer || "Sorry, I couldn't process that.";
      aiResponse = aiResponse.replace(/\s+/g, " ").trim(); // remove extra spaces/line breaks
      setMessages((prev) => [...prev, { role: "assistant", text: aiResponse }]);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Failed to get AI response. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 flex flex-col z-50 overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h2 className="font-semibold text-lg">AI Assistant</h2>
        <button onClick={onClose} className="hover:text-gray-200 transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-2xl max-w-[80%] shadow-sm transition-colors duration-300 ${
              msg.role === "user"
                ? "ml-auto bg-indigo-600 text-white rounded-br-none"
                : "mr-auto bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border dark:border-gray-600 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-300 text-xs">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-150">●</span>
            <span className="animate-bounce delay-300">●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 items-center bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <input
          type="text"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl disabled:opacity-50 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AIChatBox;
