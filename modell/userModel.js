import mongoose from "mongoose";
import { listenedListModel } from "./listenedList.js";

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
    listenAgain: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    listnedList : {
      type : mongoose.Types.ObjectId,
      ref : listenedListModel
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export { User };
