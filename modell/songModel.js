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
  liked: [
    {
      user: { type: Schema.Types.ObjectId, ref: "users" },
      like: { type: Boolean, default: false },
    },
  ],
  updatedAt: Date,
  linkytb: { type: String },
  user: { type: String, require: true },
  status: String,
});

const songModel = mongoose.model("song", songSchema);

export { songModel };
