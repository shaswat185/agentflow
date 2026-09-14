import { Router } from "express";
import { registerUser, loginUser} from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;