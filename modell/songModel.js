import mongoose from "mongoose";
import { User } from "./userModel.js";

const like = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "users" },
  liked: { type: Boolean, default: false },
});

const songSchema = new mongoose.Schema({
  title: { type: String, require: true },
  author: { type: String, require: true },
  view: Number,
  image: {
    url: String,
    publicId: String,
  },
  createdAt: { type: Date, default: Date.now },
  isPublic: Boolean,
  song: {
    url: String,
    publicId: String,
  },
  liked: [like],
  updatedAt: Date,
  linkytb: { type: String },
  user: { type: String, require: true },
  status: String,
});

const songModel = mongoose.model("song", songSchema);

export { songModel };
