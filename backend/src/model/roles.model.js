
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Student", "ClubAdmin"]
  },
  level: {
    type: Number,
    required: true,
    enum: [0, 1], // 0 for Student, 1 for ClubAdmin
    unique: true
  }
});

const Role = mongoose.model("Role", roleSchema);
export default Role;