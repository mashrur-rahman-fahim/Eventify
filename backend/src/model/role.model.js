import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['user', 'admin'],
    default: 'user'
  },
  value: {
    type: Number,
    required: true,
    unique: true,
    enum: [0, 1],
    default: 0
  },
  permissions: {
    canCreateEvents: {
      type: Boolean,
      default: false
    },
    canEditEvents: {
      type: Boolean,
      default: false
    },
    canDeleteEvents: {
      type: Boolean,
      default: false
    },
    canViewAttendees: {
      type: Boolean,
      default: false
    },
    canManageUsers: {
      type: Boolean,
      default: false
    }
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

// Pre-save middleware to update timestamps
roleSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to initialize default roles
roleSchema.statics.initDefaultRoles = async function() {
  try {
    const defaultRoles = [
      {
        name: 'user',
        value: 0,
        permissions: {
          canCreateEvents: false,
          canEditEvents: false,
          canDeleteEvents: false,
          canViewAttendees: false,
          canManageUsers: false
        }
      },
      {
        name: 'admin',
        value: 1,
        permissions: {
          canCreateEvents: true,
          canEditEvents: true,
          canDeleteEvents: true,
          canViewAttendees: true,
          canManageUsers: false
        }
      }
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await this.findOne({ name: roleData.name });
      if (!existingRole) {
        await this.create(roleData);
        console.log(`Created default role: ${roleData.name}`);
      }
    }
  } catch (error) {
    console.error('Error initializing default roles:', error);
  }
};

const Role = mongoose.model("Role", roleSchema);
export default Role;