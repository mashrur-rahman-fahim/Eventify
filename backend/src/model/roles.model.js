import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Student", "ClubAdmin"],
  },
  level: {
    type: Number,
    required: true,
    enum: [0, 1], // 0 for Student, 1 for ClubAdmin
  },
  description: {
    type: String,
  },
  permissions: {
    canCreateEvents: { type: Boolean, default: false },
    canEditEvents: { type: Boolean, default: false },
    canDeleteEvents: { type: Boolean, default: false },
    canManageAttendees: { type: Boolean, default: false },
    canAddMembers: { type: Boolean, default: false },
    canAddAdmins: { type: Boolean, default: false },
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

// Pre-save middleware to set permissions based on role level
roleSchema.pre("save", function (next) {
  if (this.level === 0) { // Student
    this.permissions = {
      canCreateEvents: false,
      canEditEvents: false,
      canDeleteEvents: false,
      canManageAttendees: false,
      canAddMembers: false,
      canAddAdmins: false,
    };
    this.name = "Student";
  } else if (this.level === 1) { // ClubAdmin
    this.permissions = {
      canCreateEvents: true,
      canEditEvents: true,
      canDeleteEvents: true,
      canManageAttendees: true,
      canAddMembers: true,
      canAddAdmins: true,
    };
    this.name = "ClubAdmin";
  }
  next();
});

const Role = mongoose.model("Role", roleSchema);
export default Role;