import mongoose from "mongoose";
import Certificate from "../models/certificate.model.js";
import Registration from "../models/registration.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import { generateCertificate } from "../services/certificateService.js";

// Generate certificate
export const generateEventCertificate = async (req, res) => {
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

    // Check if event has ended
    const eventEndTime = new Date(event.date);
    if (eventEndTime > new Date()) {
      return res.status(400).json({ message: "Event has not ended yet" });
    }

    // Check if user attended the event
    const registration = await Registration.findOne({ 
      eventId, 
      userId,
      status: "attended" 
    });

    if (!registration) {
      return res.status(400).json({ 
        message: "You did not attend this event or your attendance was not recorded" 
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({ 
      eventId, 
      userId 
    });

    if (existingCertificate) {
      return res.status(200).json({
        message: "Certificate already generated",
        certificate: existingCertificate
      });
    }

    // Generate certificate
    const user = await User.findById(userId);
    const certificateUrl = await generateCertificate(user, event);

    // Generate unique certificate code
    const certificateCode = `CERT-${eventId.slice(-4)}-${userId.slice(-4)}-${Date.now().toString(36)}`;

    const certificate = new Certificate({
      userId,
      eventId,
      registrationId: registration._id,
      certificateUrl,
      certificateCode
    });

    await certificate.save();

    // Update registration with certificate ID
    registration.certificateId = certificate._id;
    registration.certificateGenerated = true;
    await registration.save();

    res.status(201).json({
      message: "Certificate generated successfully",
      certificate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user certificates
export const getUserCertificates = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const certificates = await Certificate.find({ userId })
      .populate("eventId", "title date category")
      .populate("registrationId")
      .sort({ issuedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Certificate.countDocuments({ userId });

    res.status(200).json({
      certificates,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify certificate
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateCode } = req.params;

    const certificate = await Certificate.findOne({ certificateCode })
      .populate("userId", "name email")
      .populate("eventId", "title date location category")
      .populate("registrationId");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Verify the certificate
    certificate.verified = true;
    certificate.verifiedAt = new Date();
    await certificate.save();

    res.status(200).json({
      message: "Certificate verified successfully",
      certificate,
      isValid: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get event certificates (for admins)
export const getEventCertificates = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user has permission to manage attendees
    if (!req.user.role.permissions.canManageAttendees) {
      return res.status(403).json({ 
        message: "You don't have permission to view certificates" 
      });
    }

    // Check if user is event admin or club admin
    const isEventAdmin = event.admins.some(adminId => 
      adminId.toString() === req.user._id.toString()
    );
    
    const club = await Club.findById(event.clubId);
    const isClubAdmin = club.admins.some(adminId => 
      adminId.toString() === req.user._id.toString()
    );
    
    if (!isEventAdmin && !isClubAdmin) {
      return res.status(403).json({ 
        message: "Only event or club admins can view certificates" 
      });
    }

    const certificates = await Certificate.find({ eventId })
      .populate("userId", "name email")
      .populate("registrationId")
      .sort({ issuedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Certificate.countDocuments({ eventId });

    res.status(200).json({
      certificates,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};