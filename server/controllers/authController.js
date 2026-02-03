const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.status(400).send({
        message: "User already exists",
        success: false,
      });
    }

    if (!existingUser.password) {
      return res.status(400).json({
        message: "Please login using Google",
        success: false,
      });
    }
    

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in Signup",
      error: error.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    //1. Check if user exist
    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (!existingUser) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    //2. Check if password correct
    const isValid = await bcrypt.compare(
      req.body.password,
      existingUser.password,
    );
    if (!isValid) {
      return res.status(400).send({
        message: "Incorrect password",
        success: false,
      });
    }

    //If the user exists & password is correct, assign a JWT (json web token)
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );

    res.status(200).send({
      message: "User logged in successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
    );
  }
);

router.post("/auth/change-password", authMiddleware, async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password change not available for OAuth users",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;
