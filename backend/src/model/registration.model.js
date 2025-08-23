import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["registered", "attended", "cancelled"],
    default: "registered"
  },
  attendedAt: {
    type: Date,
    default: null
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Certificate",
    default: null
  }
});

// Create compound index to prevent duplicate registrations
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;