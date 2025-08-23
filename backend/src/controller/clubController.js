import Club from "../models/club.model.js";
import User from "../models/user.model.js";

// Create a new club
export const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const club = await Club.create({
      name,
      description,
      userId: req.user._id,
      admins: [req.user._id], // Creator is automatically an admin
    });
    
    // Add club to user's clubs list
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { clubs: club._id } }
    );
    
    return res.status(201).json({
      message: "Club created successfully",
      club,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get all clubs
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("userId", "name")
      .populate("admins", "name email")
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      clubs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get club by ID
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("userId", "name email")
      .populate("admins", "name email")
      .populate("members", "name email");
    
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    return res.status(200).json({
      club,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Join a club
export const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    // Check if user is already a member
    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already a member of this club" });
    }
    
    club.members.push(req.user._id);
    await club.save();
    
    // Add club to user's clubs list
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { clubs: club._id } }
    );
    
    return res.status(200).json({
      message: "Joined club successfully",
      club,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Add admin to club
export const addClubAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    // Only the creator can add admins
    if (club.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the club creator can add admins" });
    }
    
    // Check if user is already an admin
    if (club.admins.includes(userId)) {
      return res.status(400).json({ message: "User is already an admin of this club" });
    }
    
    club.admins.push(userId);
    await club.save();
    
    return res.status(200).json({
      message: "Admin added successfully",
      club,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};