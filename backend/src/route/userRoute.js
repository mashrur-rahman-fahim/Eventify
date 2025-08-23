import express from "express";
import { registerUser } from "../controller/userController.js";
import { loginUser } from "../controller/userController.js";
import { getUserProfile } from "../controller/userController.js";
import { verify } from "../middleware/isLoggedIn.js";
import { logoutUser } from "../controller/userController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUserProfile",verify, getUserProfile);
router.get("/logout", verify, logoutUser);
export default router;