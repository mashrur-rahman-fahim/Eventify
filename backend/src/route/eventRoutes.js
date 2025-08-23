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
router.post("/create/:clubId", verify, isAdmin, createEvent);
router.get("/getAll", getAllEvents);
router.get("/getEvent/:eventId", getEventById);
router.put("/update/:eventId",verify, isAdmin, updateEvent);
router.delete("/delete/:eventId", verify, isAdmin, deleteEvent);
router.get("/club/:clubId", getEventsByClub);

export default router;