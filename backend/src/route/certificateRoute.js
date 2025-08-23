import express from "express";
import certificateController from "../controller/certificateController.js";
import { verify } from "../middleware/isLoggedIn.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Generate certificate for a specific registration
router.post(
  "/generate/:registrationId",
  verify,
  certificateController.generateCertificate
);

// Download certificate PDF
router.get(
  "/download/:certificateId",
  verify,
  certificateController.downloadCertificate
);

// Get certificate details
router.get("/:certificateId", verify, certificateController.getCertificate);

// Get all certificates for the logged-in user
router.get("/user/all", verify, certificateController.getUserCertificates);

// Get all certificates for an event (admin only)
router.get(
  "/event/:eventId",
  verify,
  isAdmin,
  certificateController.getEventCertificates
);

// Generate certificates for all attended participants of an event (admin only)
router.post(
  "/event/:eventId/generate-all",
  verify,
  isAdmin,
  certificateController.generateEventCertificates
);

// Verify certificate authenticity (public endpoint)
router.get("/verify/:certificateId", certificateController.verifyCertificate);

export default router;
