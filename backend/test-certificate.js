import mongoose from "mongoose";
import dotenv from "dotenv";
import certificateService from "./src/services/certificateService.js";
import Registration from "./src/model/registration.model.js";
import User from "./src/model/user.model.js";
import Event from "./src/model/event.model.js";
import Club from "./src/model/club.model.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function testCertificateGeneration() {
  try {
    console.log("Testing certificate generation...");

    // Create test data
    const testClub = new Club({
      name: "Test Club",
      description: "A test club for certificate generation",
      category: "Technology",
      admins: [],
    });
    await testClub.save();
    console.log("Created test club:", testClub.name);

    const testUser = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@test.com",
      password: "hashedpassword",
      role: "user",
    });
    await testUser.save();
    console.log(
      "Created test user:",
      `${testUser.firstName} ${testUser.lastName}`
    );

    const testEvent = new Event({
      title: "Test Event for Certificate",
      description: "A test event to verify certificate generation",
      date: new Date("2024-12-15"),
      time: "14:00",
      location: "Main Auditorium",
      category: "Workshop",
      clubId: testClub._id,
      userId: testUser._id,
      registrationDeadline: new Date("2024-12-14"),
      maxAttendees: 50,
    });
    await testEvent.save();
    console.log("Created test event:", testEvent.title);

    const testRegistration = new Registration({
      userId: testUser._id,
      eventId: testEvent._id,
      clubId: testClub._id,
      status: "attended",
      attendedAt: new Date(),
    });
    await testRegistration.save();
    console.log("Created test registration with attended status");

    // Test certificate generation
    console.log("Generating certificate...");
    const certificate = await certificateService.generateCertificate(
      testRegistration._id
    );

    console.log("Certificate generated successfully!");
    console.log("Certificate details:");
    console.log("- Certificate Number:", certificate.certificateNumber);
    console.log("- Participant Name:", certificate.participantName);
    console.log("- Event Title:", certificate.eventTitle);
    console.log("- PDF Path:", certificate.pdfPath);

    // Test certificate retrieval
    const retrievedCertificate = await certificateService.getCertificateById(
      certificate._id
    );
    console.log("Certificate retrieval test passed");

    // Test user certificates
    const userCertificates = await certificateService.getCertificatesByUser(
      testUser._id
    );
    console.log("User certificates count:", userCertificates.length);

    // Test event certificates
    const eventCertificates = await certificateService.getCertificatesByEvent(
      testEvent._id
    );
    console.log("Event certificates count:", eventCertificates.length);

    console.log("\n✅ All certificate tests passed!");
    console.log(
      "\nCertificate file should be available at:",
      certificateService.getCertificateFilePath(certificate.pdfPath)
    );
  } catch (error) {
    console.error("❌ Certificate test failed:", error.message);
    console.error(error.stack);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the test
testCertificateGeneration();
