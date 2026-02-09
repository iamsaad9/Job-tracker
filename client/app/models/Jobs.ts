import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobUrl: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  applicationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    required: false,
  },
  // Documents attached to this job application
  documents: {
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Documents",
      required: false,
    },
    coverLetter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Documents",
      required: false,
    },
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Documents",
      required: false,
    },
    other: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Documents",
      },
    ],
  },
});

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;