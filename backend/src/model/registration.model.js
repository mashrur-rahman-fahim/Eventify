import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  attended: {
    type: Boolean,
    default: false
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateUrl: {
    type: String,
    default: null
  }
});

// Create a compound index to prevent duplicate registrations
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;