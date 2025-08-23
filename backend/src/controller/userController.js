import User from "../models/user.model.js";
import Role from "../models/roles.model.js";
import { generateToken } from "../services/token.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;
    
    // Find role by name
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({
        message: "Invalid role specified",
      });
    }
    
    const user = await User.create({ name, email, password, roleId: role._id });
    const token = generateToken(user._id);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: parseInt(process.env.MAX_AGE),
    });
    
    return res.status(201).json({
      message: "User created successfully",
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