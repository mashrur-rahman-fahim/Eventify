import {
  processMessage,
  getSuggestedQuestions,
} from "../services/chatbotService.js";

// In-memory storage for recent conversations (max 50 messages per user)
const recentConversations = new Map();

// Send a message and get bot response
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id; // From auth middleware

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Get bot response
    const botResponse = processMessage(message);

    // Store recent conversation in memory if user is logged in
    if (userId) {
      if (!recentConversations.has(userId)) {
        recentConversations.set(userId, []);
      }

      const userConversation = recentConversations.get(userId);

      // Add user message
      userConversation.push({
        content: message,
        sender: "user",
        timestamp: new Date(),
      });

      // Add bot response
      userConversation.push({
        content: botResponse.message,
        sender: "bot",
        timestamp: botResponse.timestamp,
      });

      // Keep only the last 50 messages to prevent memory issues
      if (userConversation.length > 50) {
        userConversation.splice(0, userConversation.length - 50);
      }
    }

    res.json({
      success: true,
      response: botResponse,
      userMessage: message,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};

// Get conversation history for logged-in user
export const getConversationHistory = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get recent conversation from memory
    const userConversation = recentConversations.get(userId) || [];

    res.json({ messages: userConversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation history" });
  }
};

// Get suggested questions
export const getSuggestions = async (req, res) => {
  try {
    const suggestions = getSuggestedQuestions();
    res.json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
};

// Clear conversation history
export const clearConversation = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Clear conversation from memory
    recentConversations.delete(userId);

    res.json({
      success: true,
      message: "Conversation cleared",
      deleted: true,
    });
  } catch (error) {
    console.error("Error clearing conversation:", error);
    res.status(500).json({ error: "Failed to clear conversation" });
  }
};
