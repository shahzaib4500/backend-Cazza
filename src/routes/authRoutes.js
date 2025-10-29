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
// Routes
router.post("/signup", validateRegister, register);
router.post("/verify-code", validateVerificationCode, verifySignup);
router.post("/signin", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, requestPasswordReset);
router.post("/reset-password", validateResetPassword, resetPassword);
export const authRoutes = router;
