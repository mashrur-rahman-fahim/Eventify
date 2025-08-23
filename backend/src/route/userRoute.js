import express from "express";
import { registerUser } from "../controller/userController.js";
import { loginUser } from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
export default router;