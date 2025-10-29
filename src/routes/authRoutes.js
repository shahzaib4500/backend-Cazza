import express from "express";
const router = express.Router();

import {
  validateRegister,
  validateLogin,
  validateResetPassword,
  validateForgotPassword,
  validateVerificationCode,
} from "../validators/authValidation.js";
import {
  register,
  login,
  resetPassword,
  requestPasswordReset,
  verifySignup,
} from "../controllers/authController.js";
import { validateOnboarding } from "../validators/onboarding.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { completeOnboarding } from "../controllers/onboardingController.js";
// Routes
router.post("/signup", validateRegister, register);
router.post("/verify-code", validateVerificationCode, verifySignup);
router.post("/signin", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, requestPasswordReset);
router.post("/reset-password", validateResetPassword, resetPassword);
router.post(
  "/onboarding",
  authMiddleware,
  validateOnboarding,
  completeOnboarding
);
export const authRoutes = router;
