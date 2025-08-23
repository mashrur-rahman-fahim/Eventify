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

const router = express.Router();

// Apply authentication middleware to all event routes
// router.use(verify);

// Event routes
router.post("/create/:clubId", createEvent);
router.get("/getAll", getAllEvents);
router.get("/getEvent/:eventId", getEventById);
router.put("/update/:eventId", updateEvent);
router.delete("/delete/:eventId", deleteEvent);
router.get("/club/:clubId", getEventsByClub);

export default router;