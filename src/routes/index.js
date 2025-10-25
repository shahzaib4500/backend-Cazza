const express = require("express");
const router = express.Router();

// Import individual route modules and mount them under logical subpaths.
const authRoutes = require("./authRoutes");

// Example: /api/auth/register, /api/auth/login, /api/auth/me
router.use("/auth", authRoutes);

module.exports = router;
