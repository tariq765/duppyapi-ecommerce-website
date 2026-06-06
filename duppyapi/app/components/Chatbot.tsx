"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiSend, FiX, FiCpu, FiCheck } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Chatbot() {
  const { user, accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello! Main DuppyBot hoon, aapka e-commerce assistant. Main aapko products dhoondhne, current orders track karne ya shop policies ke baare me help kar sakta hoon. Aaj main aapki kya madad karoon?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "What laptops do you have?",
    "Are there any discounts?",
    "Track my order",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle opening the chatbot
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Helper to format/parse basic markdown (bold text) in messages
  const formatMessageText = (text: string) => {
    // Replace markdown bold (**text**) with <strong>text</strong>
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-bold text-violet-300">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to history
    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Map messages for backend payload format
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Make API call to backend
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await axios.post(
        `${API_URL}/chatbot/query`,
        {
          query: text,
          history: historyPayload,
        },
        { headers }
      );

      // Get reply and updated suggestions
      const botReply = response.data.response;
      const botSuggestions = response.data.suggested_prompts || [];

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: botReply,
          timestamp: new Date(),
        },
      ]);
      
      if (botSuggestions.length > 0) {
        setSuggestions(botSuggestions);
      }
    } catch (error) {
      console.error("Error communicating with chatbot API:", error);
      // Fallback message in case backend has an error
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Sorry, I am facing some server issues right now. Plase check back in a moment or verify that the API is running.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 w-[380px] h-[550px] bg-slate-950/95 backdrop-blur-md border border-slate-800/80 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 px-4 py-4 text-white flex justify-between items-center relative overflow-hidden">
              {/* Background glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <FiCpu className="text-violet-200 text-lg animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    DuppyBot AI
                  </h3>
                  <p className="text-[11px] text-violet-100 opacity-90">Shopping Assistant</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors text-white"
                aria-label="Close chat"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-md"
                        : "bg-slate-900/80 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-line text-[13px]">
                      {msg.role === "model" ? formatMessageText(msg.content) : msg.content}
                    </div>
                    <span
                      className={`block text-[10px] mt-1.5 ${
                        msg.role === "user" ? "text-violet-200" : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/80 border border-slate-800 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2.5 h-2.5 bg-violet-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-900 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="text-[11px] px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-900 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-violet-600 text-xs transition duration-200"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="w-9 h-9 flex items-center justify-center bg-violet-600 hover:bg-violet-500 disabled:bg-slate-850 disabled:text-slate-600 text-white rounded-xl transition duration-200 shadow-md shadow-violet-950/30 cursor-pointer"
                aria-label="Send message"
              >
                <FiSend size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-lg shadow-violet-900/35 border border-violet-500/30 flex items-center justify-center cursor-pointer relative overflow-hidden group focus:outline-none"
        aria-label="Open chat"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiX size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <FiMessageSquare size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
