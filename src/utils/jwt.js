const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Generate JWT access token
function generateAccessToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not configured");
  }
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRE_TIME || "15m",
  });
}

// Generate JWT refresh token
function generateRefreshToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not configured");
  }
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME || "30d",
  });
}

// Verify JWT token
function verifyToken(token, secret) {
  try {
    const jwtSecret = secret || process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret not configured");
    }
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    if (error && error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    if (error && error.message === "JWT secret not configured") {
      throw error;
    }
    throw new Error("Invalid token");
  }
}

// Generate random token for password reset
function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Generate verification token (4-digit)
function generateToken() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Hash password using bcrypt
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare password with hash
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateResetToken,
  generateToken,
  hashPassword,
  comparePassword,
};
