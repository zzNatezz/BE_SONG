import mongoose from "mongoose";
import { songModel } from "./songModel.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    avatar: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export { User };
