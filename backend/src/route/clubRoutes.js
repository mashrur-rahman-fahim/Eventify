import express from "express";
import {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  addMember,
  addAdmin,
  leaveClub,
  deleteClub
} from "../controller/clubController.js";
import { verify } from "../middleware/isLoggedIn.js";

const router = express.Router();

// Apply authentication middleware to all club routes
// router.use(verify);

// Club routes
router.post("/create", createClub);
router.get("/getAll", getAllClubs);
router.get("/getClub/:clubId", getClubById);
router.put("/update/:clubId", updateClub);
router.post("/addMember/:clubId", addMember);
router.post("/addAdmin/:clubId", addAdmin);
router.delete("/leave/:clubId", leaveClub);
router.delete("/delete/:clubId", deleteClub);

export default router;