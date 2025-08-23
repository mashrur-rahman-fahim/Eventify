import express from "express";
import certificateController from "../controller/certificateController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Generate certificate for a specific registration
router.post(
  "/generate/:registrationId",
  isLoggedIn,
  certificateController.generateCertificate
);

// Download certificate PDF
router.get(
  "/download/:certificateId",
  isLoggedIn,
  certificateController.downloadCertificate
);

// Get certificate details
router.get("/:certificateId", isLoggedIn, certificateController.getCertificate);

// Get all certificates for the logged-in user
router.get("/user/all", isLoggedIn, certificateController.getUserCertificates);

// Get all certificates for an event (admin only)
router.get(
  "/event/:eventId",
  isLoggedIn,
  isAdmin,
  certificateController.getEventCertificates
);

// Generate certificates for all attended participants of an event (admin only)
router.post(
  "/event/:eventId/generate-all",
  isLoggedIn,
  isAdmin,
  certificateController.generateEventCertificates
);

// Verify certificate authenticity (public endpoint)
router.get("/verify/:certificateId", certificateController.verifyCertificate);

export default router;
