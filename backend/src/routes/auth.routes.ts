import { Router } from "express";
import { body } from "express-validator";
import {registerUser, loginUser} from "../controllers/auth.controller.js";
import validationMiddleware from "../middleware/validation.middleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validationMiddleware,
  registerUser
);



router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  validationMiddleware,
  loginUser
);



export default router;