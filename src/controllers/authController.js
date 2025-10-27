import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register user + send verification code
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashed },
    });

    const code = crypto.randomBytes(3).toString("hex");
    await prisma.signupVerification.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // You can send the code via email here
    console.log("Verification code:", code);

    res
      .status(201)
      .json({ message: "User created, verification code sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify signup code
export const verifySignup = async (req, res) => {
  try {
    const { code } = req.body;
    const record = await prisma.signupVerification.findUnique({
      where: { code },
    });
    if (!record || record.expiresAt < new Date())
      return res.status(400).json({ message: "Invalid or expired code" });

    await prisma.signupVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    res.json({ message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = crypto.randomBytes(3).toString("hex");
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    console.log("Password reset code:", code);
    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify reset code & set new password
export const resetPassword = async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    const reset = await prisma.passwordReset.findUnique({ where: { code } });
    if (!reset || reset.used || reset.expiresAt < new Date())
      return res.status(400).json({ message: "Invalid or expired code" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: reset.userId },
      data: { password: hashed },
    });

    await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { used: true },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
