import express from "express";
const router = express.Router();

import {
  validateRegister,
  validateLogin,
  validateResetPassword,
  validateVerifyCode,
} from "../validators/authValidation.js";
import {
  register,
  login,
  resetPassword,
  requestPasswordReset,
  verifySignup,
} from "../controllers/authController.js";
// Routes
router.post("/register", validateRegister, register);
router.post("/verify", validateVerifyCode, verifySignup);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateResetPassword, requestPasswordReset);
router.post("/reset-password", validateResetPassword, resetPassword);
export const authRoutes = router;
