import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  organizationName: user.organizationName,
  providerType: user.providerType,
  officeLocation: user.officeLocation,
  course: user.course,
  residence: user.residence,
  skills: user.skills,
  availability: user.availability,
  department: user.department
});

export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    role,
    organizationName,
    providerType,
    officeLocation,
    course,
    residence,
    skills,
    availability,
    department
  } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "An account with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    role,
    organizationName,
    providerType,
    officeLocation,
    course,
    residence,
    skills,
    availability,
    department
  });

  res.status(201).json({
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

export const getMe = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

export const updateMe = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.name = req.body.name?.trim() || user.name;
  user.phone = req.body.phone?.trim() || user.phone;

  if (user.role === "provider") {
    user.organizationName = req.body.organizationName?.trim() || "";
    user.providerType = req.body.providerType || user.providerType;
    user.officeLocation = req.body.officeLocation?.trim() || "";
  }

  if (user.role === "student") {
    user.course = req.body.course?.trim() || "";
    user.residence = req.body.residence?.trim() || "";
    user.skills = req.body.skills?.trim() || "";
    user.availability = req.body.availability?.trim() || "";
  }

  if (user.role === "head") {
    user.department = req.body.department?.trim() || "";
  }

  const updatedUser = await user.save();

  res.json({
    user: sanitizeUser(updatedUser)
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters." });
  }

  const user = await User.findById(req.user._id);
  const validPassword = await bcrypt.compare(currentPassword, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Current password is incorrect." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully." });
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.json({
      message: "If this account exists, a reset token has been generated."
    });
  }

  const rawToken = crypto.randomBytes(3).toString("hex").toUpperCase();
  user.resetPasswordTokenHash = await bcrypt.hash(rawToken, 10);
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  res.json({
    message: "Password reset token generated. Use it within 15 minutes.",
    resetToken: rawToken
  });
};

export const resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({ message: "Email, reset token, and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters." });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
    return res.status(400).json({ message: "Invalid or expired reset request." });
  }

  if (user.resetPasswordExpiresAt.getTime() < Date.now()) {
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    return res.status(400).json({ message: "Reset token has expired." });
  }

  const validToken = await bcrypt.compare(resetToken, user.resetPasswordTokenHash);
  if (!validToken) {
    return res.status(400).json({ message: "Invalid reset token." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.json({ message: "Password reset successfully. Please sign in." });
};
