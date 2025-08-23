import Registration from "../models/registration.model.js";
import Event from "../models/event.model.js";

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    // Check if event exists and is active
    const event = await Event.findById(eventId);
    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found or not active" });
    }
    
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      userId: req.user._id,
      eventId,
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }
    
    // Check if event has reached maximum participants
    if (event.maxParticipants) {
      const registrationCount = await Registration.countDocuments({ 
        eventId, 
        status: "registered" 
      });
      
      if (registrationCount >= event.maxParticipants) {
        return res.status(400).json({ message: "Event is full" });
      }
    }
    
    const registration = await Registration.create({
      userId: req.user._id,
      eventId,
    });
    
    return res.status(201).json({
      message: "Registered for event successfully",
      registration,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Unregister from an event
export const unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    const registration = await Registration.findOneAndDelete({
      userId: req.user._id,
      eventId,
    });
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    
    return res.status(200).json({
      message: "Unregistered from event successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get user's registered events
export const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate({
        path: "eventId",
        populate: {
          path: "clubId",
          select: "name",
        },
      })
      .sort({ registrationDate: -1 });
    
    return res.status(200).json({
      registrations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get event attendees
export const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Check if user is an admin of this event or the club
    const isEventAdmin = event.admins.includes(req.user._id) || event.userId.toString() === req.user._id.toString();
    
    if (!isEventAdmin) {
      return res.status(403).json({ message: "You are not authorized to view attendees" });
    }
    
    const attendees = await Registration.find({ eventId: req.params.id, status: "registered" })
      .populate("userId", "name email")
      .sort({ registrationDate: -1 });
    
    return res.status(200).json({
      attendees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};