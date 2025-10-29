// middleware/authMiddleware.js
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token); // using your helper
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: err.message || "Invalid or expired token" });
  }
};
