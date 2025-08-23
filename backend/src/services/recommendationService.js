import Event from "../model/event.model.js";
import Registration from "../model/registration.model.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";

class RecommendationService {
  /**
   * Generate personalized event recommendations for a user
   * Uses hybrid approach: content-based + collaborative filtering + popularity
   */
  async getRecommendations(userId, limit = 10) {
    try {
      const user = await User.findById(userId)
        .populate("registeredEvents")
        .populate("clubs");

      if (!user) {
        throw new Error("User not found");
      }

      // Get all upcoming active events
      const upcomingEvents = await Event.find({
        isActive: true,
        date: { $gte: new Date() },
        registrationDeadline: { $gte: new Date() },
        _id: { $nin: user.registeredEvents }, // Exclude already registered events
      })
        .populate("clubId", "name")
        .populate("attendees", "_id");

      if (upcomingEvents.length === 0) {
        return [];
      }

      // Calculate scores for each event
      const scoredEvents = await Promise.all(
        upcomingEvents.map(async (event) => {
          const contentScore = await this.calculateContentScore(user, event);
          const collaborativeScore = await this.calculateCollaborativeScore(
            user,
            event
          );
          const popularityScore = this.calculatePopularityScore(event);
          const clubAffinityScore = this.calculateClubAffinityScore(
            user,
            event
          );

          // Weighted combination of scores
          const totalScore =
            contentScore * 0.3 +
            collaborativeScore * 0.3 +
            popularityScore * 0.2 +
            clubAffinityScore * 0.2;

          return {
            event,
            score: totalScore,
            breakdown: {
              content: contentScore,
              collaborative: collaborativeScore,
              popularity: popularityScore,
              clubAffinity: clubAffinityScore,
            },
          };
        })
      );

      // Sort by score and return top recommendations
      return scoredEvents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => ({
          ...item.event.toObject(),
          recommendationScore: item.score,
          scoreBreakdown: item.breakdown,
        }));
    } catch (error) {
      console.error("Error generating recommendations:", error);
      throw error;
    }
  }

  /**
   * Content-based filtering: Score based on user's historical event preferences
   */
  async calculateContentScore(user, event) {
    try {
      // Get user's registration history
      const userRegistrations = await Registration.find({
        userId: user._id,
        status: { $in: ["registered", "attended"] },
      }).populate("eventId");

      if (userRegistrations.length === 0) {
        return 0.5; // Neutral score for new users
      }

      const registeredEvents = userRegistrations
        .map((reg) => reg.eventId)
        .filter((e) => e); // Filter out null events

      // Calculate category preference
      const categoryPreferences = {};
      registeredEvents.forEach((regEvent) => {
        categoryPreferences[regEvent.category] =
          (categoryPreferences[regEvent.category] || 0) + 1;
      });

      const totalRegistrations = registeredEvents.length;
      const categoryScore = categoryPreferences[event.category]
        ? categoryPreferences[event.category] / totalRegistrations
        : 0;

      // Boost score if user has shown interest in this category
      const recencyBoost = this.calculateRecencyBoost(registeredEvents, event);

      return Math.min(categoryScore + recencyBoost, 1.0);
    } catch (error) {
      console.error("Error calculating content score:", error);
      return 0.5;
    }
  }

  /**
   * Collaborative filtering: Score based on similar users' preferences
   */
  async calculateCollaborativeScore(user, event) {
    try {
      // Find users who registered for similar events
      const userRegistrations = await Registration.find({
        userId: user._id,
        status: { $in: ["registered", "attended"] },
      });

      if (userRegistrations.length === 0) {
        return 0.5;
      }

      const userEventIds = userRegistrations.map((reg) => reg.eventId);

      // Find users with overlapping event registrations
      const similarUsers = await Registration.aggregate([
        {
          $match: {
            eventId: { $in: userEventIds },
            userId: { $ne: user._id },
            status: { $in: ["registered", "attended"] },
          },
        },
        {
          $group: {
            _id: "$userId",
            commonEvents: { $sum: 1 },
          },
        },
        {
          $match: {
            commonEvents: { $gte: 1 }, // At least 1 common event
          },
        },
        {
          $sort: { commonEvents: -1 },
        },
        {
          $limit: 50, // Top 50 similar users
        },
      ]);

      if (similarUsers.length === 0) {
        return 0.5;
      }

      // Check how many similar users registered for this event
      const similarUserIds = similarUsers.map((u) => u._id);
      const eventRegistrationsBySimilarUsers =
        await Registration.countDocuments({
          eventId: event._id,
          userId: { $in: similarUserIds },
          status: { $in: ["registered", "attended"] },
        });

      // Calculate collaborative score
      const collaborativeScore = Math.min(
        eventRegistrationsBySimilarUsers / Math.min(similarUsers.length, 10),
        1.0
      );

      return collaborativeScore;
    } catch (error) {
      console.error("Error calculating collaborative score:", error);
      return 0.5;
    }
  }

  /**
   * Popularity score based on registration count and recent activity
   */
  calculatePopularityScore(event) {
    try {
      const attendeeCount = event.attendees ? event.attendees.length : 0;
      const maxAttendees = event.maxAttendees || 100; // Default max if not set

      // Base popularity score
      let popularityScore =
        attendeeCount / Math.max(maxAttendees, attendeeCount);

      // Boost for recently created events (within last 7 days)
      const daysSinceCreation = Math.floor(
        (new Date() - new Date(event.createdAt)) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceCreation <= 7) {
        popularityScore += 0.2;
      }

      // Boost for events happening soon (within next 7 days)
      const daysUntilEvent = Math.floor(
        (new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilEvent <= 7 && daysUntilEvent >= 0) {
        popularityScore += 0.15;
      }

      return Math.min(popularityScore, 1.0);
    } catch (error) {
      console.error("Error calculating popularity score:", error);
      return 0.5;
    }
  }

  /**
   * Club affinity score based on user's club memberships
   */
  calculateClubAffinityScore(user, event) {
    try {
      if (!user.clubs || user.clubs.length === 0) {
        return 0.3; // Neutral score for users not in any clubs
      }

      const userClubIds = user.clubs.map((club) => club._id.toString());
      const eventClubId = event.clubId._id.toString();

      // High score if event is from user's club
      if (userClubIds.includes(eventClubId)) {
        return 1.0;
      }

      // Medium score for events from clubs in similar categories
      // This could be enhanced with club categorization
      return 0.4;
    } catch (error) {
      console.error("Error calculating club affinity score:", error);
      return 0.3;
    }
  }

  /**
   * Calculate recency boost based on recent similar events
   */
  calculateRecencyBoost(registeredEvents, currentEvent) {
    try {
      const recentEvents = registeredEvents.filter((regEvent) => {
        const daysSinceRegistration = Math.floor(
          (new Date() - new Date(regEvent.createdAt)) / (1000 * 60 * 60 * 24)
        );
        return (
          daysSinceRegistration <= 30 &&
          regEvent.category === currentEvent.category
        );
      });

      return Math.min(recentEvents.length * 0.1, 0.3);
    } catch (error) {
      console.error("Error calculating recency boost:", error);
      return 0;
    }
  }

  /**
   * Get trending events based on recent registration activity
   */
  async getTrendingEvents(limit = 10) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const trendingEvents = await Registration.aggregate([
        {
          $match: {
            registrationDate: { $gte: sevenDaysAgo },
            status: { $in: ["registered", "attended"] },
          },
        },
        {
          $group: {
            _id: "$eventId",
            recentRegistrations: { $sum: 1 },
          },
        },
        {
          $sort: { recentRegistrations: -1 },
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "_id",
            as: "event",
          },
        },
        {
          $unwind: "$event",
        },
        {
          $match: {
            "event.isActive": true,
            "event.date": { $gte: new Date() },
            "event.registrationDeadline": { $gte: new Date() },
          },
        },
      ]);

      // Populate additional fields
      const eventIds = trendingEvents.map((item) => item._id);
      const populatedEvents = await Event.find({ _id: { $in: eventIds } })
        .populate("clubId", "name")
        .populate("userId", "name email");

      return populatedEvents.map((event) => {
        const trendingData = trendingEvents.find(
          (item) => item._id.toString() === event._id.toString()
        );
        return {
          ...event.toObject(),
          recentRegistrations: trendingData.recentRegistrations,
        };
      });
    } catch (error) {
      console.error("Error getting trending events:", error);
      throw error;
    }
  }

  /**
   * Get category-based recommendations
   */
  async getCategoryRecommendations(userId, category, limit = 10) {
    try {
      const user = await User.findById(userId).populate("registeredEvents");

      if (!user) {
        throw new Error("User not found");
      }

      const categoryEvents = await Event.find({
        isActive: true,
        date: { $gte: new Date() },
        registrationDeadline: { $gte: new Date() },
        category: category,
        _id: { $nin: user.registeredEvents },
      })
        .populate("clubId", "name")
        .sort({ createdAt: -1 })
        .limit(limit);

      return categoryEvents;
    } catch (error) {
      console.error("Error getting category recommendations:", error);
      throw error;
    }
  }
}

export default new RecommendationService();
