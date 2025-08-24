import express from "express";
import {
  registerForEvent,
  unregisterFromEvent,
  getUserRegistrations,
  getEventRegistrations,
  updateRegistrationStatus,
  getRegistrationByUser,
} from "../controller/registrationController.js";
import { verify } from "../middleware/isLoggedIn.js";

const router = express.Router();

// Apply authentication middleware to all registration routes
router.use(verify);

// Registration routes
router.post("/event/register/:eventId", registerForEvent);
router.delete("/event/unregister/:eventId", unregisterFromEvent);
router.get("/event/userRegistrations", getUserRegistrations);
router.get("/registration/event/:eventId", getEventRegistrations);
router.put("/registration/:registrationId/status", updateRegistrationStatus);
router.get("/registration/user/:eventId", getRegistrationByUser);

export default router;
