import express from "express";
import {
  registerForEvent,
  unregisterFromEvent,
  getUserRegistrations,
  getEventRegistrations,
  updateRegistrationStatus
} from "../controllers/registrationController.js";
import { verify } from "../middleware/isLoggedIn.js";

const router = express.Router();

// Apply authentication middleware to all registration routes
// router.use(verify);

// Registration routes
router.post("/register/:eventId", registerForEvent);
router.delete("/unregister/:eventId", unregisterFromEvent);
router.get("/userRegistrations", getUserRegistrations);
router.get("/eventRegistrations/:eventId", getEventRegistrations);
router.put("/updateStatus/:registrationId", updateRegistrationStatus);

export default router;