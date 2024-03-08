import mongoose from "mongoose";

const { Schema } = mongoose;

const songSchema = new Schema({
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
  updatedAt: Date,
  like: Boolean,
  ytb: { type: Boolean, default: false },
  linkYtb: { type: String },
  user: { type: String, require: true },
});

const songModel = mongoose.model("song", songSchema);

export { songModel };
