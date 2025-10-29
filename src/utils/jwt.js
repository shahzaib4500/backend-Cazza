// utils/jwt.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Generate JWT access token
export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME || "15m",
  });
}

// Generate JWT refresh token
export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME || "30d",
  });
}

// Verify any JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

// Hash password using bcrypt
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password with hash
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Generate 6-char random verification/reset code
export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric code
}
