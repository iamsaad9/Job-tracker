const express = require("express");
const app = express();
const authRouter = require("./controllers/authController");
const jobRouter = require("./controllers/jobController");
const documentRouter = require("./controllers/documentController");
const profileRouter = require("./controllers/userProfile");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/documents", documentRouter);
app.use("/api/profile", profileRouter);

module.exports = app;
