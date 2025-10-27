import Joi from "joi";
import { handleValidationError } from "../utils/helperfunction.js";
// ===============================
// Joi Schemas
// ===============================

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

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email required",
    "any.required": "Email is required",
  }),
});

const verifyCodeSchema = Joi.object({
  code: Joi.string().required().messages({
    "any.required": "Code is required",
    "string.empty": "Code is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});

// ===============================
// Middleware Functions
// ===============================

export const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};

export const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};

export const validateResetPassword = (req, res, next) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};

export const validateVerifyCode = (req, res, next) => {
  const { error, value } = verifyCodeSchema.validate(req.body);
  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};
