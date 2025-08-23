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
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Apply authentication middleware to all club routes
// router.use(verify);

// Club routes
router.post("/create",verify, isAdmin, createClub);
router.get("/getAll", verify,isAdmin, getAllClubs);
router.get("/getClub/:clubId", verify, isAdmin, getClubById);
router.put("/update/:clubId", verify, isAdmin, updateClub);
router.post("/addMember/:clubId", verify, isAdmin, addMember);
router.post("/addAdmin/:clubId", verify, isAdmin, addAdmin);
router.delete("/leave/:clubId", verify, isAdmin, leaveClub);
router.delete("/delete/:clubId", verify, isAdmin, deleteClub);

export default router;