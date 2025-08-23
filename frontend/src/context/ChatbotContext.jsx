import React, { createContext, useContext, useState, useEffect } from "react";
import { chatbotAPI } from "../utils/api.js";

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Load suggestions on mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const response = await chatbotAPI.getSuggestions();
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message immediately
    const userMessage = {
      content: message,
      sender: "user",
      timestamp: new Date(),
      id: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatbotAPI.sendMessage(message);

      // Add bot response
      const botMessage = {
        content: response.response.message,
        sender: "bot",
        timestamp: new Date(response.response.timestamp),
        id: Date.now() + 1,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Update authentication status if needed
      if (isAuthenticated === null || isAuthenticated === false) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      // Add error message
      const errorMessage = {
        content: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        id: Date.now() + 1,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversationHistory = async () => {
    try {
      setIsLoading(true);
      const response = await chatbotAPI.getConversationHistory();
      const historyMessages = response.messages.map((msg, index) => ({
        ...msg,
        id: Date.now() + index,
      }));
      setMessages(historyMessages);
      setHistoryLoaded(true);
      setIsAuthenticated(true);
      console.log(
        "Loaded recent conversation history:",
        historyMessages.length,
        "messages"
      );
    } catch (error) {
      console.error("Failed to load conversation history:", error);

      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setHistoryLoaded(true); // Mark as loaded even if failed, to prevent retry loops
        console.log("User not authenticated, skipping history load");
      } else {
        // For other errors, still mark as loaded to prevent infinite retry
        setHistoryLoaded(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async () => {
    try {
      await chatbotAPI.clearConversation();
      setMessages([]);
      setHistoryLoaded(false); // Reset history loaded state
      console.log("Conversation cleared successfully");
    } catch (error) {
      console.error("Failed to clear conversation:", error);
      // If user is not authenticated or any other error, just clear local messages
      if (error.response?.status === 401) {
        setMessages([]);
        setIsAuthenticated(false);
        setHistoryLoaded(false);
        console.log("User not authenticated, cleared local messages only");
      } else {
        // For any other error, still clear local messages as fallback
        setMessages([]);
        setHistoryLoaded(false);
        console.log("API failed, cleared local messages as fallback");
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Only load history if chat is being opened, no messages exist, and history hasn't been loaded yet
    if (!isOpen && messages.length === 0 && !historyLoaded) {
      loadConversationHistory();
    }
  };

  // Function to reset chatbot state when user logs in/out
  const resetChatbotState = () => {
    setMessages([]);
    setHistoryLoaded(false);
    setIsAuthenticated(null);
  };

  const value = {
    messages,
    isOpen,
    isLoading,
    suggestions,
    isAuthenticated,
    historyLoaded,
    sendMessage,
    toggleChat,
    clearConversation,
    loadConversationHistory,
    resetChatbotState,
  };

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};
