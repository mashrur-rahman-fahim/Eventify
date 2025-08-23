import mongoose from "mongoose";
import Event from "../model/event.model.js";
import Club from "../model/club.model.js";
import Registration from "../model/registration.model.js";
import Role from "../model/roles.model.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      maxAttendees,
      registrationDeadline
    } = req.body;

    const userId = req.user._id;
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }
    const role=await Role.findById(req.user.role)

    // Check if user has permission to create events
    if (!role.permissions.canCreateEvents) {
      return res.status(403).json({ 
        message: "You don't have permission to create events" 
      });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user is club admin
    const isAdmin = club.admins.some(adminId => 
      adminId.toString() === userId.toString()
    );
    
    if (!isAdmin) {
      return res.status(403).json({ 
        message: "Only club admins can create events" 
      });
    }

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      maxAttendees,
      registrationDeadline,
      clubId,
      userId,
      admins: [userId] // Creator becomes event admin
    });

    await event.save();

    // Add event to club's events array
    club.events.push(event._id);
    await club.save();

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = { isActive: true };
   console.log(query);
    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate("clubId", "name")
      .populate("userId", "name email")
      .populate("admins", "name email")
      .sort({ date: 1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    

    const total = await Event.countDocuments(query);

    res.status(200).json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .populate("clubId", "name description")
      .populate("userId", "name email")
      .populate("admins", "name email")
      .populate("attendees", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get registration count
    const registrationCount = await Registration.countDocuments({ 
      eventId, 
      status: { $in: ["registered", "attended"] } 
    });

    res.status(200).json({ 
      event,
      registrationCount 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const role=await Role.findById(req.user.role)
    // Check if user has permission to edit events
    if (!role.permissions.canEditEvents) {
      return res.status(403).json({ 
        message: "You don't have permission to edit events" 
      });
    }

    // Check if user is the event creator or event admin
    const isEventAdmin = event.admins.some(adminId => 
      adminId.toString() === req.user._id.toString()
    );
    
    if (!isEventAdmin && event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Only event admins can update event details" 
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("clubId", "name")
      .populate("userId", "name email")
      .populate("admins", "name email");

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const role=await Role.findById(req.user.role)
    // Check if user has permission to delete events
    if (!role.permissions.canDeleteEvents) {
      return res.status(403).json({ 
        message: "You don't have permission to delete events" 
      });
    }

    // Check if user is the event creator
    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Only the event creator can delete the event" 
      });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ eventId });

    // Remove event from club's events array
    await Club.findByIdAndUpdate(event.clubId, {
      $pull: { events: eventId }
    });

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get events by club
export const getEventsByClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const events = await Event.find({ clubId, isActive: true })
      .populate("userId", "name email")
      .populate("attendees", "name email")
      .sort({ date: 1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments({ clubId, isActive: true });

    res.status(200).json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAdminEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    const query = { 
      admins: userId 
    };

    if (status === 'active') {
      query.isActive = true;
      query.registrationDeadline = { $gte: new Date() };
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'past') {
      query.date = { $lt: new Date() };
    } else if (status === 'upcoming') {
      query.date = { $gte: new Date() };
      query.isActive = true;
    }

    const events = await Event.find(query)
      .populate("clubId", "name")
      .populate("userId", "name email")
      .populate("admins", "name email")
      .populate("attendees", "name email")
      .sort({ date: 1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    const eventsWithRegistrationCounts = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({ 
          eventId: event._id, 
          status: { $in: ["registered", "attended"] } 
        });
        
        return {
          ...event.toObject(),
          registrationCount
        };
      })
    );

    res.status(200).json({
      events: eventsWithRegistrationCounts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      status
    });
  } catch (error) {
    console.error("Error fetching admin events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAdminEventStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalEvents = await Event.countDocuments({ admins: userId });
    const activeEvents = await Event.countDocuments({ 
      admins: userId, 
      isActive: true,
      registrationDeadline: { $gte: new Date() }
    });
    const pastEvents = await Event.countDocuments({ 
      admins: userId, 
      date: { $lt: new Date() }
    });
    const upcomingEvents = await Event.countDocuments({ 
      admins: userId, 
      date: { $gte: new Date() },
      isActive: true
    });

    const events = await Event.find({ admins: userId }).select('attendees');
    const totalAttendees = events.reduce((total, event) => total + event.attendees.length, 0);

    res.status(200).json({
      totalEvents,
      activeEvents,
      pastEvents,
      upcomingEvents,
      totalAttendees
    });
  } catch (error) {
    console.error("Error fetching admin event stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchEventsByName = async (req, res) => {
  try {
    const { characters } = req.query;
    if (!characters) {
      return res.status(400).json({ message: "Characters are required" });
    }
    const regexPattern = `^[${characters}]`;
    const events = await Event.find({
      title: { $regex: regexPattern, $options: "i" },
      isActive: true
    })
      .populate("clubId", "name")
      .populate("userId", "name email")
      .limit(10);
    return res.status(200).json({ events });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};