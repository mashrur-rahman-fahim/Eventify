import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./route/testRoute.js";
import path from "path";
import helmet from "helmet";
import userRoute from "./route/userRoute.js";
import verifyEmail from "./route/verifyEmail.js";
import { sendVerificationEmail } from "./services/emailService.js";
import verificationRoute from "./route/verificationRoute.js";
import chatbotRoute from "./route/chatbotRoute.js";
import cookieParser from "cookie-parser";
import roleRoute from "./route/roleRoute.js";
import certificateRoute from "./route/certificateRoute.js";
import registrationRoute from "./route/registrationRoutes.js";
import clubRoute from "./route/clubRoutes.js";
import eventRoute from "./route/eventRoutes.js";
import recommendationRoute from "./route/recommendationRoutes.js";
dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    })
  );
}
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "data:", "https:", "http:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:", "*"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      objectSrc: ["'none'"],
      connectSrc: [
        "'self'",
        "https:",
        "http:",
        "https://res.cloudinary.com",
        "https://api.cloudinary.com",
        "https://avatars.githubusercontent.com",
        "https://daintree.onrender.com",
        "https://images.unsplash.com",
        "https://api.unsplash.com",
        "https://images.pexels.com",
        "https://api.pexels.com",
      ],
    },
  })
);

app.get("/test/email", async (req, res) => {
  try {
    await sendVerificationEmail("mashrur950@gmail.com", "1234567890");
    res.send("Email sent successfully");
  } catch (error) {
    console.error("Email test failed:", error.message);
    res.status(500).send(`Email test failed: ${error.message}`);
  }
});
app.use("/api", testRoute);
app.use("/api", userRoute);
app.use("/api", verifyEmail);
app.use("/api", verificationRoute);
app.use("/api", chatbotRoute);
app.use("/api", roleRoute);
app.use("/api", clubRoute);
app.use("/api", eventRoute);
app.use("/api", registrationRoute);
app.use("/api", recommendationRoute);
app.use("/api/certificates", certificateRoute);

if (process.env.NODE_ENV === "production") {
  // Serve static files from the frontend dist directory
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Serve the vite.svg file specifically
  app.get("/vite.svg", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/vite.svg"));
  });

  // Handle all other routes by serving the React app
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

export default app;
