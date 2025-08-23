import express from "express";
import { seedRoles } from "../controller/roleCotroller.js";

const router = express.Router();

router.get("/seedRoles", seedRoles);

export default router;