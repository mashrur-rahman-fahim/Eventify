import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  participantName: {
    type: String,
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  clubName: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  pdfPath: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Generate certificate number
certificateSchema.pre("save", async function (next) {
  if (!this.certificateNumber) {
    const count = await mongoose.model("Certificate").countDocuments();
    this.certificateNumber = `CERT-${String(count + 1).padStart(
      6,
      "0"
    )}-${new Date().getFullYear()}`;
  }
  next();
});

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
