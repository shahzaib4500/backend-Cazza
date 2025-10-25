const userModel = require("../models/userModel");
const jwtUtils = require("../utils/jwt");

/**
 * Register a new user
 * Body: { email, password, name }
 */
async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existing = await userModel.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password and create user
    const password_hash = await jwtUtils.hashPassword(password);
    const user = await userModel.createUser({ email, password_hash, name });

    // Generate access token
    const token = jwtUtils.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    next(err);
  }
}

/**
 * Login
 * Body: { email, password }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Get user from DB
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const valid = await jwtUtils.comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access token
    const token = jwtUtils.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    next(err);
  }
}

/**
 * Return currently authenticated user
 * (req.user set by authentication middleware)
 */
async function me(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json({ user: sanitizeUser(req.user) });
  } catch (err) {
    next(err);
  }
}

/** Helper to remove sensitive fields */
function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

module.exports = {
  register,
  login,
  me,
};
