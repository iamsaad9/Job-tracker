const router = require("express").Router();
const UserProfile = require("../models/UserProfile");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");

//Get current profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id }).populate(
      "user",
      ["username", "email"],
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Post profile
router.post("/", authMiddleware, async (req, res) => {
  try {
    // We explicitly pull the user ID from the auth middleware, not the body
    const profileFields = { ...req.body, user: req.user.id };

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/profile/experience
router.put("/experience", authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Add new experience to the beginning of the array
    profile.experience.unshift(req.body);
    await profile.save();

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/profile/experience/:exp_id
router.delete("/experience/:exp_id", authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    // Filter out the experience by ID
    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id,
    );

    await profile.save();
    res
      .status(200)
      .json({ success: true, message: "Experience removed", data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/profile/user/:username
router.get("/user/:username", async (req, res) => {
  try {
    // Note: This assumes your User model has a username field
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await UserProfile.findOne({ user: user._id }).populate(
      "user",
      ["username", "firstName", "lastName"],
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/profile/education/:edu_id
router.patch("/education/:edu_id", authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id, "education._id": req.params.edu_id },
      {
        $set: {
          "education.$": { ...req.body, _id: req.params.edu_id },
        },
      },
      { new: true },
    );
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/profile/resume
router.post("/resume", authMiddleware, async (req, res) => {
  try {
    const { fileId, fileName } = req.body;
    const profile = await UserProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    profile.resumes.push({ fileId, fileName });
    await profile.save();

    res
      .status(201)
      .json({ success: true, message: "Resume linked", data: profile.resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/profile/skills
router.put("/skills", authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { skills: { $each: req.body.skills } } }, // Prevents duplicate skills
      { new: true },
    );
    res.status(200).json({ success: true, data: profile.skills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
