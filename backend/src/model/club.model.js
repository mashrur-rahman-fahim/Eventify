import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

clubSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const Club = mongoose.model("Club", clubSchema);
export default Club;