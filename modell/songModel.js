import mongoose from "mongoose";

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
  liked: {
    type: Map,
    of: Boolean,
  },

  updatedAt: Date,
  linkytb: { type: String },
  user: { type: String, require: true },
  status: String,
});

const songModel = mongoose.model("song", songSchema);

export { songModel };
