import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
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
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration",
    required: true
  },
  certificateUrl: {
    type: String,
    required: true
  },
  certificateCode: {
    type: String,
    required: true,
    unique: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date,
    default: null
  }
});

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;