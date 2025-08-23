import express from "express";
import {
  registerForEvent,
  unregisterFromEvent,
  getUserRegistrations,
  getEventRegistrations,
  updateRegistrationStatus,
  getRegistrationByUser
} from "../controller/registrationController.js";
import { verify } from "../middleware/isLoggedIn.js";

const router = express.Router();

// Apply authentication middleware to all registration routes
router.use(verify);

// Registration routes
router.post("/event/register/:eventId", registerForEvent);
router.delete("/event/unregister/:eventId", unregisterFromEvent);
router.get("/event/userRegistrations", getUserRegistrations);
router.get("/event/eventRegistrations/:eventId", getEventRegistrations);
router.put("/event/updateStatus/:registrationId", updateRegistrationStatus);
router.get("/event/getRegistrationByUser&event/:eventId", getRegistrationByUser);

export default router;
