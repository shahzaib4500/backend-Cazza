import { prisma } from "../config/db.js";
import {
  hashPassword,
  generateCode,
  generateRefreshToken,
  comparePassword,
  generateAccessToken,
} from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import { verificationTemplate } from "../utils/helperfunction.js";

// Register user + send verification code
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });
    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashed },
    });

    const code = generateCode();
    await prisma.signupVerification.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // You can send the code via email here
    console.log("Verification code:", code);
    await sendEmail(
      email,
      "Verification Code",
      verificationTemplate(firstName, code)
    );

    res
      .status(201)
      .json({ message: "Sign Up Completed, verification code sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify signup code
export const verifySignup = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const record = await prisma.signupVerification.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() },
        verified: false,
      },
    });
    if (!record || record.expiresAt < new Date())
      return res.status(400).json({ message: "Invalid or expired code" });

    await prisma.$transaction([
      prisma.signupVerification.update({
        where: { id: record.id },
        data: { verified: true },
      }),
      prisma.user.update({
        where: { id: record.userId },
        data: { verified: true },
      }),
    ]);

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

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Account not verified. Please verify your email." });
    }

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // Only send safe fields
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    };

    res.json({
      accessToken,
      refreshToken,
      user: safeUser,
    });
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

    const code = generateCode();
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    console.log("Password reset code:", code);
    await sendEmail(
      email,
      "Verification Code",
      verificationTemplate(user.firstName, code)
    );
    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Step 1: Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Step 2: Find password reset record for that user and code
    const reset = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!reset)
      return res.status(400).json({ message: "Invalid or expired code" });

    // Step 3: Hash new password (await important!)
    const hashed = await hashPassword(newPassword);

    // Step 4: Update user password & mark reset as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { used: true },
      }),
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

