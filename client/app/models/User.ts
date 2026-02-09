import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  password?: string;
  roles?: string;
  googleId?: string;
  provider?: "local" | "google";
  avatar?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
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
    provider:{
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    avatar: {
      type: String,
      default: function (this: IUser) {
        return `https://ui-avatars.com/api/?name=${this.name.split(" ").join("+")}`;
      },
    },
    resetToken: String,
resetTokenExpiry: Date,
  },
  
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

