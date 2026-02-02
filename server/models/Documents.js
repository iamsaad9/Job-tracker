const mongoose = require("mongoose");

const userDocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["cv", "cover_letter", "portfolio", "certificate"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Storage reference (NOT public URL)
    file: {
      fileId: {
        type: String, // UUID / S3 key
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      },
      mimeType: {
        type: String,
        default: "application/pdf",
      },
      size: Number, // in bytes
    },

    // Optional structured content (for AI / editing later)
    content: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Versioning
    version: {
      type: Number,
      default: 1,
    },
    parentDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Documents",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    lastUsedAt: Date,

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Documents", userDocumentSchema);
