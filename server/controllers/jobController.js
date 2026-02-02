const router = require("express").Router();
const Job = require("../models/Jobs");
const Documents = require("../models/Documents");
const authMiddleware = require("../middlewares/authMiddleware");

//Create a new job application
router.post("/", authMiddleware, async (req, res) => {
  try {
    const existingJob = await Job.findOne({
      user: req.user.id,
      jobUrl: req.body.jobUrl,
    });
    if (existingJob) {
      return res.status(400).json({
        success: false,
        message: "Job application with this URL already exists",
      });
    }

    const newJob = new Job({
      ...req.body,
      user: req.user.id,
    });
    await newJob.save();
    res.status(201).json({
      success: true,
      message: "Job application created successfully",
      data: newJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create job application",
      error: "Server Error",
    });
  }
});

//Get all jobs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({
      applicationDate: -1,
    });
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
      error: "Server Error",
    });
  }
});

//Get job by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user.id });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

//Update a job
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Track document usage if a document is used in this job
    if (req.body.documentId) {
      const doc = await Documents.findOne({
        _id: req.body.documentId,
        user: req.user.id,
      });
      if (doc) {
        doc.lastUsedAt = new Date();
        await doc.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

//Delete a job
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      message: "Job application deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;
