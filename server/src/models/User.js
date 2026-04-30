import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["provider", "student", "head"],
      required: true
    },
    organizationName: String,
    providerType: {
      type: String,
      enum: ["Organization", "Person"]
    },
    officeLocation: String,
    course: String,
    residence: String,
    skills: String,
    availability: String,
    department: String,
    resetPasswordTokenHash: String,
    resetPasswordExpiresAt: Date
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
