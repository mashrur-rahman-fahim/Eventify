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

// Recommendation API functions
export const recommendationAPI = {
  getPersonalizedRecommendations: async (limit = 10) => {
    const response = await api.get(
      `/api/recommendations/personalized?limit=${limit}`
    );
    return response.data;
  },

  getTrendingEvents: async (limit = 10) => {
    const response = await api.get(
      `/api/recommendations/trending?limit=${limit}`
    );
    return response.data;
  },

  getCategoryRecommendations: async (category, limit = 10) => {
    const response = await api.get(
      `/api/recommendations/category/${category}?limit=${limit}`
    );
    return response.data;
  },

  getDashboardRecommendations: async (
    personalizedLimit = 6,
    trendingLimit = 4
  ) => {
    const response = await api.get(
      `/api/recommendations/dashboard?personalizedLimit=${personalizedLimit}&trendingLimit=${trendingLimit}`
    );
    return response.data;
  },

  getRecommendationStats: async () => {
    const response = await api.get(`/api/recommendations/stats`);
    return response.data;
  },
};

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
