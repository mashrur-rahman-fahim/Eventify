import express from "express";
import {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  requestToJoinClub,
  getJoinRequests,
  processJoinRequest,
  leaveClub,
  deleteClub,
  getClubByUserId,
  getClubAdmins,
  searchClubsByName,
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
router.delete("/club/leave/:clubId", verify, isAdmin, leaveClub);
router.delete("/club/delete/:clubId", verify, isAdmin, deleteClub);
router.get("/club/getClubByUserId", verify, isAdmin, getClubByUserId);
router.get("/club/admins/:clubId", verify, isAdmin, getClubAdmins);
router.get("/club/search", verify, isAdmin, searchClubsByName);
router.post("/club/join/:clubId", verify, isAdmin, requestToJoinClub);
router.get("/club/join-requests/:clubId", verify, isAdmin, getJoinRequests);
router.post(
  "/club/process-request/:clubId/:requestId",
  verify,
  isAdmin,
  processJoinRequest
);

export default router;
