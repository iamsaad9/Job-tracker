const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
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
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
