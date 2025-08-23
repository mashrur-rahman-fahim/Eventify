import mongoose from "mongoose";
import Club from "../model/club.model.js";
import User from "../models/user.model.js";
import Event from "../models/event.model.js";

// Create a new club
export const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    // Check if user has permission to create clubs (ClubAdmin)
    if (!req.user.role.permissions.canCreateEvents) {
      return res.status(403).json({ 
        message: "You don't have permission to create clubs" 
      });
    }

    const club = new Club({
      name,
      description,
      userId,
      admins: [userId], // Creator becomes first admin
      members: [userId] // Creator is also a member
    });

    await club.save();

    // Add club to user's clubs array
    await User.findByIdAndUpdate(userId, {
      $push: { clubs: club._id }
    });

    res.status(201).json({
      message: "Club created successfully",
      club
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all clubs
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("userId", "name email")
      .populate("admins", "name email")
      .populate("members", "name email");

    res.status(200).json({ clubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get club by ID
export const getClubById = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    const club = await Club.findById(clubId)
      .populate("userId", "name email")
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("events");

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({ club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update club
export const updateClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user has permission to edit clubs
    if (!req.user.role.permissions.canEditEvents) {
      return res.status(403).json({ 
        message: "You don't have permission to edit clubs" 
      });
    }

    // Check if user is club admin or creator
    const isAdmin = club.admins.some(adminId => 
      adminId.toString() === req.user._id.toString()
    );
    
    if (!isAdmin && club.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Only club admins can update club details" 
      });
    }

    const updatedClub = await Club.findByIdAndUpdate(
      clubId,
      { name, description },
      { new: true, runValidators: true }
    ).populate("admins", "name email").populate("members", "name email");

    res.status(200).json({
      message: "Club updated successfully",
      club: updatedClub
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add member to club
export const addMember = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clubId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user has permission to add members
    if (!req.user.role.permissions.canAddMembers) {
      return res.status(403).json({ 
        message: "You don't have permission to add members" 
      });
    }

    // Check if user is club admin
    const isAdmin = club.admins.some(adminId => 
      adminId.toString() === req.user._id.toString()
    );
    
    if (!isAdmin) {
      return res.status(403).json({ 
        message: "Only club admins can add members" 
      });
    }

    // Check if user is already a member
    if (club.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Add user to members
    club.members.push(userId);
    await club.save();

    // Add club to user's clubs array
    await User.findByIdAndUpdate(userId, {
      $push: { clubs: club._id }
    });

    const updatedClub = await Club.findById(clubId)
      .populate("admins", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Member added successfully",
      club: updatedClub
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add admin to club
export const addAdmin = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clubId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user has permission to add admins
    if (!req.user.role.permissions.canAddAdmins) {
      return res.status(403).json({ 
        message: "You don't have permission to add admins" 
      });
    }

    // Check if user is club admin
    const isAdmin = club.admins.some(adminId => 
      adminId.toString() === req.user._id.toString()
    );
    
    if (!isAdmin) {
      return res.status(403).json({ 
        message: "Only club admins can add other admins" 
      });
    }

    // Check if user is already an admin
    if (club.admins.includes(userId)) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    // Check if user is a member first
    if (!club.members.includes(userId)) {
      return res.status(400).json({ message: "User must be a member first" });
    }

    // Add user to admins
    club.admins.push(userId);
    await club.save();

    const updatedClub = await Club.findById(clubId)
      .populate("admins", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Admin added successfully",
      club: updatedClub
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Leave club
export const leaveClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user is a member
    if (!club.members.includes(userId)) {
      return res.status(400).json({ message: "You are not a member of this club" });
    }

    // Remove user from members
    club.members = club.members.filter(memberId => 
      memberId.toString() !== userId.toString()
    );

    // Remove user from admins if they are one
    club.admins = club.admins.filter(adminId => 
      adminId.toString() !== userId.toString()
    );

    await club.save();

    // Remove club from user's clubs array
    await User.findByIdAndUpdate(userId, {
      $pull: { clubs: clubId }
    });

    res.status(200).json({ message: "You have left the club successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete club
export const deleteClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user has permission to delete clubs
    if (!req.user.role.permissions.canDeleteEvents) {
      return res.status(403).json({ 
        message: "You don't have permission to delete clubs" 
      });
    }

    // Check if user is the creator
    if (club.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Only the club creator can delete the club" 
      });
    }

    // Remove club from all members' clubs array
    await User.updateMany(
      { _id: { $in: club.members } },
      { $pull: { clubs: clubId } }
    );

    // Delete all events associated with this club
    await Event.deleteMany({ clubId });

    await Club.findByIdAndDelete(clubId);

    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};