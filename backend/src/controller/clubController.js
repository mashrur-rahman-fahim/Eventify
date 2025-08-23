import mongoose from "mongoose";
import Club from "../model/club.model.js";
import User from "../model/user.model.js";
import Event from "../model/event.model.js";

// Create a new club
export const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    // Check if user has permission to create clubs (ClubAdmin)
    if (!req.user.role.permissions.canCreateEvents) {
      return res.status(403).json({
        message: "You don't have permission to create clubs",
      });
    }

    const club = new Club({
      name,
      description,
      userId,
      admins: [userId],
    });

    await club.save();

    await User.findByIdAndUpdate(userId, {
      $push: { clubs: club._id },
    });

    res.status(201).json({
      message: "Club created successfully",
      club,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all clubs
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate("admins", "name email");

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
        message: "You don't have permission to edit clubs",
      });
    }

    // Check if user is club admin or creator
    const isAdmin = club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    );

    if (!isAdmin && club.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only club admins can update club details",
      });
    }

    const updatedClub = await Club.findByIdAndUpdate(
      clubId,
      { name, description },
      { new: true, runValidators: true }
    ).populate("admins", "name email");

    res.status(200).json({
      message: "Club updated successfully",
      club: updatedClub,
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

    if (
      !mongoose.Types.ObjectId.isValid(clubId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user has permission to add admins
    if (!req.user.role.permissions.canAddAdmins) {
      return res.status(403).json({
        message: "You don't have permission to add admins",
      });
    }

    // Check if user is club admin
    const isAdmin = club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only club admins can add other admins",
      });
    }

    // Check if user is already an admin
    if (club.admins.includes(userId)) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    // Add user to admins
    club.admins.push(userId);
    await club.save();

    // Add club to user's clubs array
    await User.findByIdAndUpdate(userId, {
      $push: { clubs: clubId },
    });

    const updatedClub = await Club.findById(clubId).populate(
      "admins",
      "name email"
    );

    res.status(200).json({
      message: "Admin added successfully",
      club: updatedClub,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin leaves club
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

    // Check if user is an admin of this club
    const isAdmin = club.admins.some(
      (adminId) => adminId.toString() === userId.toString()
    );

    if (!isAdmin) {
      return res
        .status(400)
        .json({ message: "You are not an admin of this club" });
    }

    // If this is the last admin, delete the club
    if (club.admins.length === 1) {
      // Delete all events associated with this club
      await Event.deleteMany({ clubId });

      // Remove club from all admins' clubs array
      await User.updateMany(
        { _id: { $in: club.admins } },
        { $pull: { clubs: clubId } }
      );

      await Club.findByIdAndDelete(clubId);

      return res.status(200).json({
        message: "You were the last admin. The club has been deleted.",
      });
    }

    // Remove user from admins
    club.admins = club.admins.filter(
      (adminId) => adminId.toString() !== userId.toString()
    );

    // If the leaving user is the creator, transfer ownership to another admin
    if (club.userId.toString() === userId.toString()) {
      // Assign the creator role to the first available admin
      club.userId = club.admins[0];
    }

    await club.save();

    // Remove club from user's clubs array
    await User.findByIdAndUpdate(userId, {
      $pull: { clubs: clubId },
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
        message: "You don't have permission to delete clubs",
      });
    }

    // Check if user is the creator
    if (club.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the club creator can delete the club",
      });
    }

    // Remove club from all admins' clubs array
    await User.updateMany(
      { _id: { $in: club.admins } },
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

export const getClubByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const clubs = await Club.find({ admins: userId });
    res.status(200).json({ clubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
