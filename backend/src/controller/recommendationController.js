import recommendationService from "../services/recommendationService.js";
import mongoose from "mongoose";

/**
 * Get personalized event recommendations for the logged-in user
 */
export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const recommendations = await recommendationService.getRecommendations(
      userId,
      parseInt(limit)
    );

    res.status(200).json({
      message: "Recommendations fetched successfully",
      recommendations,
      total: recommendations.length,
    });
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    res.status(500).json({
      message: "Failed to fetch recommendations",
      error: error.message,
    });
  }
};

/**
 * Get trending events based on recent registration activity
 */
export const getTrendingEvents = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trendingEvents = await recommendationService.getTrendingEvents(
      parseInt(limit)
    );

    res.status(200).json({
      message: "Trending events fetched successfully",
      events: trendingEvents,
      total: trendingEvents.length,
    });
  } catch (error) {
    console.error("Error fetching trending events:", error);
    res.status(500).json({
      message: "Failed to fetch trending events",
      error: error.message,
    });
  }
};

/**
 * Get recommendations based on a specific category
 */
export const getCategoryRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category } = req.params;
    const { limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const recommendations =
      await recommendationService.getCategoryRecommendations(
        userId,
        category,
        parseInt(limit)
      );

    res.status(200).json({
      message: "Category recommendations fetched successfully",
      recommendations,
      category,
      total: recommendations.length,
    });
  } catch (error) {
    console.error("Error fetching category recommendations:", error);
    res.status(500).json({
      message: "Failed to fetch category recommendations",
      error: error.message,
    });
  }
};

/**
 * Get comprehensive dashboard recommendations including personalized, trending, and category-based
 */
export const getDashboardRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { personalizedLimit = 6, trendingLimit = 4 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get personalized recommendations
    const personalizedRecommendations =
      await recommendationService.getRecommendations(
        userId,
        parseInt(personalizedLimit)
      );

    // Get trending events
    const trendingEvents = await recommendationService.getTrendingEvents(
      parseInt(trendingLimit)
    );

    res.status(200).json({
      message: "Dashboard recommendations fetched successfully",
      data: {
        personalized: personalizedRecommendations,
        trending: trendingEvents,
      },
      counts: {
        personalizedCount: personalizedRecommendations.length,
        trendingCount: trendingEvents.length,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard recommendations:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard recommendations",
      error: error.message,
    });
  }
};

/**
 * Get recommendation statistics for debugging/admin purposes
 */
export const getRecommendationStats = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get detailed recommendations with score breakdown
    const detailedRecommendations =
      await recommendationService.getRecommendations(userId, 20);

    // Calculate average scores by type
    const avgScores = detailedRecommendations.reduce(
      (acc, rec) => {
        if (rec.scoreBreakdown) {
          acc.content += rec.scoreBreakdown.content || 0;
          acc.collaborative += rec.scoreBreakdown.collaborative || 0;
          acc.popularity += rec.scoreBreakdown.popularity || 0;
          acc.clubAffinity += rec.scoreBreakdown.clubAffinity || 0;
          acc.count++;
        }
        return acc;
      },
      { content: 0, collaborative: 0, popularity: 0, clubAffinity: 0, count: 0 }
    );

    if (avgScores.count > 0) {
      avgScores.content /= avgScores.count;
      avgScores.collaborative /= avgScores.count;
      avgScores.popularity /= avgScores.count;
      avgScores.clubAffinity /= avgScores.count;
    }

    res.status(200).json({
      message: "Recommendation statistics fetched successfully",
      stats: {
        totalRecommendations: detailedRecommendations.length,
        averageScores: avgScores,
        topRecommendations: detailedRecommendations.slice(0, 5).map((rec) => ({
          eventTitle: rec.title,
          category: rec.category,
          score: rec.recommendationScore,
          breakdown: rec.scoreBreakdown,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching recommendation stats:", error);
    res.status(500).json({
      message: "Failed to fetch recommendation statistics",
      error: error.message,
    });
  }
};
