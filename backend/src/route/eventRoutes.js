import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByClub
} from "../controller/eventController.js";
import { verify } from "../middleware/isLoggedIn.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Apply authentication middleware to all event routes
// router.use(verify);

// Event routes
router.post("/event/create/:clubId", verify, isAdmin, createEvent);
router.get("/event/getAll", getAllEvents);
router.get("/event/getEvent/:eventId", getEventById);
router.put("/event/update/:eventId",verify, isAdmin, updateEvent);
router.delete("/event/delete/:eventId", verify, isAdmin, deleteEvent);
router.get("/event/club/:clubId", getEventsByClub);

export default router;