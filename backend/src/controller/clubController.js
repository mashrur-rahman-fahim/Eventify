import mongoose from "mongoose";
import Club from "../model/club.model.js";
import User from "../model/user.model.js";
import Event from "../model/event.model.js";
import Role from "../model/roles.model.js";

export const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;
    const role = await Role.findById(req.user.role);

    if (!role.permissions.canCreateEvents) {
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

export const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("admins", "name email")
      .populate("joinRequests.userId", "name email");

    res.status(200).json({ clubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
    const role = await Role.findById(req.user.role);

    if (!role.permissions.canEditEvents) {
      return res.status(403).json({
        message: "You don't have permission to edit clubs",
      });
    }

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

export const requestToJoinClub = async (req, res) => {
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

    if (club.admins.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already an admin of this club" });
    }

    const existingRequest = club.joinRequests.find(
      (request) =>
        request.userId.toString() === userId.toString() &&
        request.status === "pending"
    );

    if (existingRequest) {
      return res
        .status(400)
        .json({
          message: "You already have a pending request to join this club",
        });
    }

    club.joinRequests.push({
      userId,
      status: "pending",
    });

    await club.save();

    res.status(200).json({ message: "Join request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJoinRequests = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    const club = await Club.findById(clubId)
      .populate("joinRequests.userId", "name email")
      .populate("admins", "name email");

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const isAdmin = club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only club admins can view join requests",
      });
    }

    res.status(200).json({ joinRequests: club.joinRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const processJoinRequest = async (req, res) => {
  try {
    const { clubId, requestId } = req.params;
    const { action } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(clubId) ||
      !mongoose.Types.ObjectId.isValid(requestId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const isAdmin = club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only club admins can process join requests",
      });
    }

    const requestIndex = club.joinRequests.findIndex(
      (request) => request._id.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Join request not found" });
    }

    const request = club.joinRequests[requestIndex];

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    if (action === "approve") {
      if (!club.admins.includes(request.userId)) {
        club.admins.push(request.userId);

        await User.findByIdAndUpdate(request.userId, {
          $push: { clubs: clubId },
        });
      }
    } else if (action !== "reject") {
      return res.status(400).json({ message: "Invalid action" });
    }

    club.joinRequests.splice(requestIndex, 1);

    await club.save();

    const updatedClub = await Club.findById(clubId)
      .populate("admins", "name email")
      .populate("joinRequests.userId", "name email");

    res.status(200).json({
      message: `Join request ${
        action === "approve" ? "approved" : "rejected"
      } successfully`,
      club: updatedClub,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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

    const isAdmin = club.admins.some(
      (adminId) => adminId.toString() === userId.toString()
    );

    if (!isAdmin) {
      return res
        .status(400)
        .json({ message: "You are not an admin of this club" });
    }

    if (club.admins.length === 1) {
      await Event.deleteMany({ clubId });

      await User.updateMany(
        { _id: { $in: club.admins } },
        { $pull: { clubs: clubId } }
      );

      await Club.findByIdAndDelete(clubId);

      return res.status(200).json({
        message: "You were the last admin. The club has been deleted.",
      });
    }

    club.admins = club.admins.filter(
      (adminId) => adminId.toString() !== userId.toString()
    );

    if (club.userId.toString() === userId.toString()) {
      club.userId = club.admins[0];
    }

    await club.save();

    await User.findByIdAndUpdate(userId, {
      $pull: { clubs: clubId },
    });

    res.status(200).json({ message: "You have left the club successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
    const role = await Role.findById(req.user.role);

    if (!role.permissions.canDeleteEvents) {
      return res.status(403).json({
        message: "You don't have permission to delete clubs",
      });
    }

    if (club.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the club creator can delete the club",
      });
    }

    await User.updateMany(
      { _id: { $in: club.admins } },
      { $pull: { clubs: clubId } }
    );

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
    const clubs = await Club.find({ admins: userId })
      .populate("admins", "name email")
      .populate("joinRequests.userId", "name email");
    res.status(200).json({ clubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getClubAdmins = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    const club = await Club.findById(clubId)
      .populate("admins", "name email role")
      .select("admins name");

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({
      clubName: club.name,
      admins: club.admins,
      totalAdmins: club.admins.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchClubsByName = async (req, res) => {
  try {
    const { characters } = req.query;

    if (!characters) {
      return res.status(400).json({ message: "Characters are required" });
    }

    const regexPattern = `^[${characters}]`;
    const clubs = await Club.find({
      name: { $regex: regexPattern, $options: "i" },
    })
      .populate("admins", "name email")
      .populate("userId", "name email")
      .limit(10);

    return res.status(200).json({ clubs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};