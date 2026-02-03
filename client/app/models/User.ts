import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: null, // ✅ important
      minlength: 8,
    },

    roles: {
      type: String,
      default: "user",
    },

    googleId: {
      type: String,
    },
    avatar: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${this.name.split(" ").join("+")}`;
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
