import mongoose from "mongoose";
import { songModel } from "./songModel.js";
import { User } from "./userModel.js";

const playlistSchema = new mongoose.Schema(
  {
    listenAgain: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: User },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: songModel }],
      },
    ],
    like: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: User },
        songs: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: songModel,
            liked: { type: Boolean },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Playlist = mongoose.model("playlist", playlistSchema);

export { Playlist };
