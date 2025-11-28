import { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare, Minimize2, Maximize2, Sparkles } from "lucide-react";
import { chatWithAI } from "../services/ai";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "Analyze my spending",
  "How much did I save?",
  "Set a budget",
  "Recent transactions"
];

const AIChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I’m your AI finance assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMinimized]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const newMessage = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAI(text.trim());
      let aiResponse = res.data.answer || "Sorry, I couldn't process that.";
      // aiResponse = aiResponse.replace(/\s+/g, " ").trim(); // Removed to preserve markdown formatting
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        drag
        dragMomentum={false}
        dragConstraints={{ left: -window.innerWidth + 350, right: 20, top: -window.innerHeight + 100, bottom: 20 }}
        className={`fixed bottom-5 right-5 z-50 flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden ${
          isMinimized ? "w-72 h-14" : "w-96 h-[600px]"
        } max-w-[90vw]`}
      >
        {/* Header */}
        <div 
          className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white cursor-move"
          onDoubleClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="font-semibold text-lg">AI Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMinimized(!isMinimized)} 
              className="hover:text-gray-200 transition p-1 hover:bg-white/10 rounded-lg"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={onClose} 
              className="hover:text-gray-200 transition p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 text-sm bg-gray-50 dark:bg-gray-800 transition-colors duration-300 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`p-3 rounded-2xl max-w-[85%] shadow-sm transition-colors duration-300 ${
                    msg.role === "user"
                      ? "ml-auto bg-indigo-600 text-white rounded-br-none"
                      : "mr-auto bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border dark:border-gray-600 rounded-bl-none"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          code: ({node, inline, className, children, ...props}) => {
                            return inline ? (
                              <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-gray-200 dark:bg-gray-600 p-2 rounded text-xs overflow-x-auto" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-300 text-xs ml-2">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-150">●</span>
                  <span className="animate-bounce delay-300">●</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="flex items-center gap-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-600 hover:border-indigo-200 dark:hover:border-gray-500 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
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
                onClick={() => handleSend()}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl disabled:opacity-50 transition shadow-lg shadow-indigo-500/30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatBox;
