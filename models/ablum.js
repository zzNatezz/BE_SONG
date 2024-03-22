import mongoose from "mongoose";

const { Schema } = mongoose;

const albumSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: Number, required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
