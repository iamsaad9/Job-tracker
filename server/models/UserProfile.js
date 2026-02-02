const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Basic Info
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    headline: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },

    // Contact Info
    email: {
      type: String,
      lowercase: true,
    },
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,

    // Skills
    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    // Work Experience
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],

    // Education
    education: [
      {
        degree: String,
        institution: String,
        startDate: Date,
        endDate: Date,
        grade: String,
        description: String,
      },
    ],

    // Resume Media (PDFs)
    resumes: [
      {
        fileId: String, // UUID or storage key
        fileName: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
