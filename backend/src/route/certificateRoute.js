import express from "express";
import {
  generateEventCertificate,
  getUserCertificates,
  verifyCertificate,
  getEventCertificates
} from "../controller/certificateController.js";
import { verify } from "../middleware/isLoggedIn.js";

const router = express.Router();

// Apply authentication middleware to all certificate routes
//router.use(verify);

// Certificate routes
router.post("/generate/:eventId", generateEventCertificate);
router.get("/user", getUserCertificates);
router.get("/verify/:certificateCode", verifyCertificate);
router.get("/event/:eventId", getEventCertificates);

export default router;