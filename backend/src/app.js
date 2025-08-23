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
dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(cookieParser());
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://res.cloudinary.com",
        "https://avatars.githubusercontent.com",
        "https://daintree.onrender.com",
      ],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      connectSrc: [
        "'self'",
        "https://api.cloudinary.com",
        "https://avatars.githubusercontent.com",
        "https://daintree.onrender.com",
      ],
    },
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
}
app.get("/", (req, res) => {
  res.send("Hello World");
});
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
app.use("/api/certificates", certificateRoute);
app.use("/api/registrations", registrationRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

export default app;
