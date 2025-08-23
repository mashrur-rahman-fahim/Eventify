import express from "express";
import {
  sendMessage,
  getConversationHistory,
  getSuggestions,
  clearConversation,
} from "../controller/chatbotController.js";
import { verify } from "../middleware/isLoggedIn.js";

const router = express.Router();

// Send a message (public - no auth required)
router.post("/chat/send", sendMessage);

// Get suggested questions (public)
router.get("/chat/suggestions", getSuggestions);

// Protected routes (require authentication)
router.get("/chat/history", verify, getConversationHistory);
router.delete("/chat/clear", verify, clearConversation);

export default router;
