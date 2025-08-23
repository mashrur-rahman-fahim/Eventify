import User from "../model/user.model.js";

import { generateToken } from "../services/tokenService.js";
import { sendVerificationEmail } from "../services/emailService.js";
import mongoose from "mongoose";
import Role from "../model/roles.model.js";
export const registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ name, email, password });
    const findRole = await Role.findOne({ level: role });
    if (!findRole) {
      return res.status(400).json({ message: "Role not found" });
    }
    user.role = findRole._id;
    await user.save({ session });
    const token = generateToken(user._id);
    await sendVerificationEmail(email, token);
    console.log("email sent");
    user.emailVerified = false;
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const emailVerified = user.emailVerified;
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!emailVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({
      message: "User logged in successfully",

      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("roleId", "name level")
      .select("-password");

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.clearCookie("token");
    await user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const searchUserByName = async (req, res) => {
  try {
    const { characters } = req.query;
    if (!characters) {
      return res.status(400).json({ message: "Characters are required" });
    }
    const regexPattern = `^[${characters}]`;
    const users = await User.find({
      name: { $regex: regexPattern, $options: "i" },
    })
      .select("-password")
      .limit(10);
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

