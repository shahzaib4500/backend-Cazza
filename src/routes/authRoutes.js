const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const signUpValidator = require("../validators/signUpValidator");
const signInValidator = require("../validators/signInValidator");

// Public
router.post("/register", signUpValidator, authController.register);
router.post("/login", signInValidator, authController.login);

// Protected
router.get("/me", authMiddleware, authController.me);

module.exports = router;
