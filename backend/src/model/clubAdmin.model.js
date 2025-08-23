import mongoose from "mongoose";

const clubAdminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  clubName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

clubAdminSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const ClubAdmin = mongoose.model("ClubAdmin", clubAdminSchema);
export default ClubAdmin;