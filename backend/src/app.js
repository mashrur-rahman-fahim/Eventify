import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./route/testRoute.js";
import path from "path";
import helmet from "helmet";

dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com","https://avatars.githubusercontent.com","https://daintree.onrender.com"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        connectSrc: ["'self'", "https://api.cloudinary.com","https://avatars.githubusercontent.com","https://daintree.onrender.com"],
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
app.use("/api", testRoute);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/*splat", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }



export default app;