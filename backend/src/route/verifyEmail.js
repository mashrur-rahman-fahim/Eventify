import express from "express";
import { verifyEmail } from "../controller/emailVerificationController.js";
import { isEmailVerified } from "../controller/isEmailVerified.js";
import { resendVerificationEmail } from "../controller/emailVerificationController.js";

const router = express.Router();

router.get("/verify/:token", verifyEmail);
router.post("/isEmailVerified", isEmailVerified);
router.post("/resendVerificationEmail", resendVerificationEmail);
export default router;