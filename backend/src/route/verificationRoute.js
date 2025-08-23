import express from "express";
import { verify, isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.get("/isLoggedIn", verify, isLoggedIn);

export default router;