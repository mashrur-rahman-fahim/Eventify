import Event from "../models/event.model.js";
import Club from "../models/club.model.js";
import Registration from "../models/registration.model.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, image, clubId, maxParticipants } = req.body;
    
    // Check if user is an admin of the club
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    if (!club.admins.includes(req.user._id) && club.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to create events for this club" });
    }
    
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      clubId,
      userId: req.user._id,
      maxParticipants,
      admins: [req.user._id] // Creator is automatically an admin
    });
    
    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate("clubId", "name")
      .populate("userId", "name")
      .sort({ date: 1 });
    
    return res.status(200).json({
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("clubId", "name description")
      .populate("userId", "name")
      .populate("admins", "name email");
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Get registration count
    const registrationCount = await Registration.countDocuments({ 
      eventId: req.params.id, 
      status: "registered" 
    });
    
    return res.status(200).json({
      event: {
        ...event.toObject(),
        registrationCount
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Check if user is an admin of this event
    if (!event.admins.includes(req.user._id) && event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this event" });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Only the creator can delete the event
    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the event creator can delete this event" });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    // Also delete all registrations for this event
    await Registration.deleteMany({ eventId: req.params.id });
    
    return res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Add admin to event
export const addEventAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Only the creator can add admins
    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the event creator can add admins" });
    }
    
    // Check if user is already an admin
    if (event.admins.includes(userId)) {
      return res.status(400).json({ message: "User is already an admin of this event" });
    }
    
    event.admins.push(userId);
    await event.save();
    
    return res.status(200).json({
      message: "Admin added successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};