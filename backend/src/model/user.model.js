import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  image: {
    url: {
      type: String, // URL to uploaded image
      default: null,
    },
    public_id: {
      type: String, // Cloudinary public_id for deletion
      default: null,
    },
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  clubs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
  ],
  registeredEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  // Password reset fields
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
