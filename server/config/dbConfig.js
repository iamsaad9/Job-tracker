const mongoose = require("mongoose");

//Connection logic
mongoose.connect(process.env.MONGO_URI);

//Connected state
const db = mongoose.connection;

//Check DB connection
db.on("connected", () => {
  console.log("Database connected successfully");
});

db.on("err", () => {
  console.log("Database connection failed");
});

module.exports = db;
