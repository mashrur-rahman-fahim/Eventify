import axios from "axios";
const Base_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

const api = axios.create({
  baseURL: Base_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Chatbot API functions
export const chatbotAPI = {
  sendMessage: async (message) => {
    const response = await api.post("/api/chat/send", { message });
    return response.data;
  },

  getSuggestions: async () => {
    const response = await api.get("/api/chat/suggestions");
    return response.data;
  },

  getConversationHistory: async () => {
    const response = await api.get("/api/chat/history");
    return response.data;
  },

  clearConversation: async () => {
    try {
      const response = await api.delete("/api/chat/clear");
      return response.data;
    } catch (error) {
      console.error("API Error in clearConversation:", error);
      throw error;
    }
  },
};

export default api;
