import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  template: {
    type: String,
    default: 'default'
  },
  verificationUrl: {
    type: String,
    required: true
  }
});

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;