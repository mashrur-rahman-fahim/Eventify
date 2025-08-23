import express from "express";
import {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  addAdmin,
  leaveClub,
  deleteClub,
  getClubByUserId,
} from "../controller/clubController.js";
import { verify } from "../middleware/isLoggedIn.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Apply authentication middleware to all club routes
// router.use(verify);

// Club routes
router.post("/club/create", verify, isAdmin, createClub);
router.get("/club/getAll", verify, isAdmin, getAllClubs);
router.get("/club/getClub/:clubId", verify, isAdmin, getClubById);
router.put("/club/update/:clubId", verify, isAdmin, updateClub);
router.post("/club/addAdmin/:clubId", verify, isAdmin, addAdmin);
router.delete("/club/leave/:clubId", verify, isAdmin, leaveClub);
router.delete("/club/delete/:clubId", verify, isAdmin, deleteClub);
router.get("/club/getClubByUserId",verify,isAdmin,  getClubByUserId);

export default router;
