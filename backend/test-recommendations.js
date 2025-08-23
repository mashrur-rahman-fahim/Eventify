import mongoose from "mongoose";
import dotenv from "dotenv";
import recommendationService from "./src/services/recommendationService.js";
import User from "./src/model/user.model.js";
import Event from "./src/model/event.model.js";
import Registration from "./src/model/registration.model.js";
import Club from "./src/model/club.model.js";
import Role from "./src/model/roles.model.js";

dotenv.config();

// Test script for the recommendation system
async function testRecommendationSystem() {
  try {
    console.log("🚀 Testing Recommendation System...\n");

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    // Test 1: Check if we can generate recommendations for existing users
    console.log("\n📊 Test 1: Getting recommendations for existing users");

    const users = await User.find().limit(3);
    console.log(`Found ${users.length} users in database`);

    for (const user of users) {
      try {
        const recommendations = await recommendationService.getRecommendations(
          user._id,
          5
        );
        console.log(
          `📌 User ${user.name}: ${recommendations.length} recommendations generated`
        );

        if (recommendations.length > 0) {
          const firstRec = recommendations[0];
          console.log(
            `   Top recommendation: "${firstRec.title}" (Score: ${(
              firstRec.recommendationScore * 100
            ).toFixed(1)}%)`
          );
          if (firstRec.scoreBreakdown) {
            console.log(`   Score breakdown:`, {
              content: (firstRec.scoreBreakdown.content * 100).toFixed(1) + "%",
              collaborative:
                (firstRec.scoreBreakdown.collaborative * 100).toFixed(1) + "%",
              popularity:
                (firstRec.scoreBreakdown.popularity * 100).toFixed(1) + "%",
              clubAffinity:
                (firstRec.scoreBreakdown.clubAffinity * 100).toFixed(1) + "%",
            });
          }
        }
      } catch (error) {
        console.log(`❌ Error for user ${user.name}: ${error.message}`);
      }
    }

    // Test 2: Get trending events
    console.log("\n📈 Test 2: Getting trending events");
    try {
      const trendingEvents = await recommendationService.getTrendingEvents(5);
      console.log(`📌 Found ${trendingEvents.length} trending events`);

      trendingEvents.forEach((event, index) => {
        console.log(
          `   ${index + 1}. "${event.title}" (${
            event.recentRegistrations || 0
          } recent registrations)`
        );
      });
    } catch (error) {
      console.log(`❌ Error getting trending events: ${error.message}`);
    }

    // Test 3: Test category recommendations
    console.log("\n🏷️ Test 3: Getting category-based recommendations");

    // Get all unique categories
    const categories = await Event.distinct("category", {
      isActive: true,
      date: { $gte: new Date() },
    });

    console.log(`📌 Found categories: ${categories.join(", ")}`);

    if (categories.length > 0 && users.length > 0) {
      try {
        const categoryRecs =
          await recommendationService.getCategoryRecommendations(
            users[0]._id,
            categories[0],
            3
          );
        console.log(
          `📌 Category "${categories[0]}": ${categoryRecs.length} recommendations`
        );
      } catch (error) {
        console.log(
          `❌ Error getting category recommendations: ${error.message}`
        );
      }
    }

    // Test 4: Database statistics
    console.log("\n📊 Test 4: Database statistics");

    const stats = {
      totalUsers: await User.countDocuments(),
      totalEvents: await Event.countDocuments(),
      activeEvents: await Event.countDocuments({
        isActive: true,
        date: { $gte: new Date() },
      }),
      totalRegistrations: await Registration.countDocuments(),
      totalClubs: await Club.countDocuments(),
    };

    console.log("Database stats:", stats);

    // Test 5: Check for potential issues
    console.log("\n🔍 Test 5: Checking for potential issues");

    const issues = [];

    if (stats.totalUsers === 0) {
      issues.push("No users found - recommendations will not work");
    }

    if (stats.activeEvents === 0) {
      issues.push("No active future events - no recommendations possible");
    }

    if (stats.totalRegistrations === 0) {
      issues.push(
        "No registrations found - collaborative filtering will not work"
      );
    }

    if (issues.length === 0) {
      console.log(
        "✅ No issues found - recommendation system should work properly"
      );
    } else {
      console.log("⚠️ Potential issues found:");
      issues.forEach((issue) => console.log(`   - ${issue}`));
    }

    console.log("\n🎉 Recommendation system test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  }
}

// Run the test
testRecommendationSystem().catch(console.error);
