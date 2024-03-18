import mongoose from "mongoose";
import { songModel } from "./songModel.js";
import { User } from "./userModel.js";

const userSongSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: songModel,
  },
  listenAgain: {
    type: Boolean,
  },
  likes: {
    type: Boolean,
  },
});

const userSong = mongoose.model("userSong", userSongSchema);

export { userSong };
