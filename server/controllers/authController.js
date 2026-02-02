const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

router.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.send({
        message: "User already exists",
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
    res.send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.send({
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
      return res.send({
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
      return res.send({
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

    res.send({
      message: "User logged in successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
