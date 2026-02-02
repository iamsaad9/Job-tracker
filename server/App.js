const express = require("express");
const app = express();
const authRouter = require("./controllers/authController");
const jobRouter = require("./controllers/jobController");

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);

module.exports = app;
