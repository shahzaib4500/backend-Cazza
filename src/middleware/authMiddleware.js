const jwtUtils = require("../utils/jwt");
const userModel = require("../models/userModel");


async function authMiddleware(req, res, next) {
  try {
    const auth = req.get("authorization") || req.get("Authorization");
    if (!auth)
      return res.status(401).json({ message: "Missing Authorization header" });

    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).json({ message: "Invalid Authorization format" });
    }

    const token = parts[1];
    let payload;
    try {
      payload = jwtUtils.verifyToken(token);
    } catch (err) {
      return res.status(401).json({ message: err.message || "Invalid token" });
    }

    // Expecting payload to contain user id
    if (!payload || !payload.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await userModel.getUserById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Attach sanitized user
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
