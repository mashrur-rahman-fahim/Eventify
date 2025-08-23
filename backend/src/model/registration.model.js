
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
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["registered", "attended", "cancelled"],
    default: "registered"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index to prevent duplicate registrations
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;