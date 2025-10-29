import Joi from "joi";
import { handleValidationError } from "../utils/helperfunction.js";

// ===============================
// Joi Schemas
// ===============================

// 🔹 Register
const registerSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "any.required": "First name is required",
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),
});

// 🔹 Login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
});

// 🔹 Forgot Password (Request reset code)
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email required",
    "any.required": "Email is required",
  }),
});

// 🔹 Reset Password (Submit code + new password)
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email required",
    "any.required": "Email is required",
  }),
  code: Joi.string().required().messages({
    "any.required": "Reset code is required",
    "string.empty": "Reset code is required",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "New password must be at least 8 characters",
    "any.required": "New password is required",
  }),
});

// 🔹 Verify Signup Code
const verifySignupCodeSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email required",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),
  code: Joi.string().required().messages({
    "any.required": "Verification code is required",
    "string.empty": "Verification code is required",
  }),
});

// ===============================
// Middleware Functions
// ===============================

// Register
export const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};

// Login
export const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};

// Forgot Password
export const validateForgotPassword = (req, res, next) => {
  const { error, value } = forgotPasswordSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};

// Reset Password
export const validateResetPassword = (req, res, next) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};

// Verify Signup Code
export const validateVerificationCode = (req, res, next) => {
  const { error, value } = verifySignupCodeSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};
