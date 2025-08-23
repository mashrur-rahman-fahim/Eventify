import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByClub,
  getAdminEvents,
  getAdminEventStats
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
router.get("/event/admin/events", verify, getAdminEvents);
router.get("/event/admin/stats", verify, getAdminEventStats);

export default router;