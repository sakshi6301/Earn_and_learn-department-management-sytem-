import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    providerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    providerType: {
      type: String,
      enum: ["Organization", "Person"],
      required: true
    },
    providerName: {
      type: String,
      required: true
    },
    contactName: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    contactEmail: {
      type: String,
      required: true
    },
    workType: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    pay: {
      type: Number,
      required: true
    },
    hours: {
      type: String,
      required: true
    },
    positions: {
      type: Number,
      required: true
    },
    skills: String,
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
