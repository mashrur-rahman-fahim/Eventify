import mongoose from "mongoose";
import Registration from "../model/registration.model.js";
import Event from "../model/event.model.js";
import Club from "../model/club.model.js";
import User from "../model/user.model.js";
import Role from "../model/roles.model.js";
import certificateService from "../services/certificateService.js";

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is active
    if (!event.isActive) {
      return res.status(400).json({ message: "Event registration is closed" });
    }
    // Check if registration deadline has passed
    if (new Date() > event.registrationDeadline) {
      return res
        .status(400)
        .json({ message: "Registration deadline has passed" });
    }

    // Check if event has reached maximum attendees
    if (event.maxAttendees > 0) {
      const currentAttendees = await Registration.countDocuments({
        eventId,
        status: { $in: ["registered", "attended"] },
      });

      if (currentAttendees >= event.maxAttendees) {
        return res.status(400).json({ message: "Event is full" });
      }
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      userId,
    });
    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" });
    }

    const registration = new Registration({
      userId,
      eventId,
      clubId: event.clubId,
      status: "registered",
    });

    await registration.save();

    // Add user to event attendees
    event.attendees.push(userId);
    await event.save();

    // Add event to user's registeredEvents array
    await User.findByIdAndUpdate(userId, {
      $push: { registeredEvents: eventId },
    });

    res.status(201).json({
      message: "Registered for event successfully",
      registration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Unregister from an event
export const unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const registration = await Registration.findOne({ eventId, userId });
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    await Registration.findByIdAndDelete(registration._id);

    // Remove user from event attendees
    await Event.findByIdAndUpdate(eventId, {
      $pull: { attendees: userId },
    });

    // Remove event from user's registeredEvents array
    await User.findByIdAndUpdate(userId, {
      $pull: { registeredEvents: eventId },
    });

    res.status(200).json({ message: "Unregistered from event successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user's registrations
export const getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const registrations = await Registration.find(query)
      .populate("eventId", "title date time location category")
      .populate("clubId", "name")
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Registration.countDocuments(query);

    res.status(200).json({
      registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get event registrations (for admins)
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const role = await Role.findById(req.user.role);

    // Check if user has permission to manage attendees
    if (!role.permissions.canManageAttendees) {
      return res.status(403).json({
        message: "You don't have permission to view event registrations",
      });
    }

    // Check if user is event admin or club admin
    const isEventAdmin = event.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    );

    const club = await Club.findById(event.clubId);
    const isClubAdmin = club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    );

    if (!isEventAdmin && !isClubAdmin) {
      return res.status(403).json({
        message: "Only event or club admins can view registrations",
      });
    }

    const query = { eventId };
    if (status) {
      query.status = status;
    }

    const registrations = await Registration.find(query)
      .populate("userId", "name email")
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Registration.countDocuments(query);

    res.status(200).json({
      registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update registration status (for admins)
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    const registration = await Registration.findById(registrationId).populate(
      "eventId"
    );

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    const role = await Role.findById(req.user.role);
    // Check if user has permission to manage attendees
    if (!role.permissions.canManageAttendees) {
      return res.status(403).json({
        message: "You don't have permission to manage registrations",
      });
    }

    // Check if user is event admin or club admin
    const event = await Event.findById(registration.eventId);
    const isEventAdmin = event.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    );

    const club = await Club.findById(event.clubId);
    const isClubAdmin = club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    );

    if (!isEventAdmin && !isClubAdmin) {
      return res.status(403).json({
        message: "Only event or club admins can update registrations",
      });
    }

    registration.status = status;
    if (status === "attended") {
      registration.attendedAt = new Date();
    }

    await registration.save();

    // Automatically generate certificate when status is changed to "attended"
    if (status === "attended" && !registration.certificateGenerated) {
      try {
        await certificateService.generateCertificate(registration._id);
      } catch (certError) {
        console.error("Certificate generation failed:", certError);
        // Don't fail the request if certificate generation fails
      }
    }

    res.status(200).json({
      message: "Registration status updated successfully",
      registration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRegistrationByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const registrations = await Registration.find({ eventId, userId });
    if (registrations.length > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
