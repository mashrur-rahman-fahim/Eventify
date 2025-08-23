import express from "express";
import {
  getPersonalizedRecommendations,
  getTrendingEvents,
  getCategoryRecommendations,
  getDashboardRecommendations,
  getRecommendationStats,
} from "../controller/recommendationController.js";
import { verify } from "../middleware/isLoggedIn.js";

const router = express.Router();

// Apply authentication middleware to all recommendation routes
router.use(verify);

// Recommendation routes
router.get("/recommendations/personalized", getPersonalizedRecommendations);
router.get("/recommendations/trending", getTrendingEvents);
router.get("/recommendations/category/:category", getCategoryRecommendations);
router.get("/recommendations/dashboard", getDashboardRecommendations);
router.get("/recommendations/stats", getRecommendationStats);

export default router;
