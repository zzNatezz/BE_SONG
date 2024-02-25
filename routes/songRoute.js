import { Router } from "express";
import { uploader } from "../utils/uploader.js";
import { songController } from "../controller/songController.js";
import { asyncCatch } from "../utils/asyncCatch.js";
import {
  postListenedListValid,
  songArrayUploadValid,
  songPutvalid,
  songSingleUploadValid,
} from "../validate/song.validate.js";

const songRoute = Router();

songRoute.post(
  "/",
  uploader.array("files"),
  asyncCatch(songArrayUploadValid),
  asyncCatch(songPutvalid),
  asyncCatch(songController.uploadSong)
);
songRoute.get("/", asyncCatch(songController.getAllSong));
songRoute.put(
  "/:songId",
  asyncCatch(songPutvalid),
  asyncCatch(songController.update_song_tiltle_and_author)
);
songRoute.put(
  "/img/:songId",
  uploader.single("file"),
  asyncCatch(songSingleUploadValid),
  asyncCatch(songController.update_song_img)
);
songRoute.delete("/:songId", asyncCatch(songController.deleteSong));
songRoute.post(
  "/listened/:songId",
  asyncCatch(postListenedListValid),
  asyncCatch(songController.listnedList)
);
songRoute.get("/listened/:userId", asyncCatch(songController.getListenedList));
songRoute.put(
  "/listened/:userId/:songId",
  asyncCatch(songController.updateListenedList)
);
export default songRoute;
