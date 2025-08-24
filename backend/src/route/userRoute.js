import express from "express";
import { registerUser } from "../controller/userController.js";
import { loginUser } from "../controller/userController.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controller/userController.js";
import { verify } from "../middleware/isLoggedIn.js";
import { logoutUser } from "../controller/userController.js";
import { deleteUser } from "../controller/userController.js";
import { updateUser } from "../controller/userController.js";
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controller/userController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.get("/getUserProfile", verify, getUserProfile);
router.put(
  "/updateUserProfile",
  verify,
  upload.single("image"),
  updateUserProfile
);
router.get("/logout", verify, logoutUser);
router.delete("/deleteUser", verify, deleteUser);
router.put("/updateUser", verify, updateUser);
export default router;
