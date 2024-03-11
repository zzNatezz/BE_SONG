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
  "/:userId",
  uploader.array("files"),
  asyncCatch(songArrayUploadValid),
  asyncCatch(songPutvalid),
  asyncCatch(songController.uploadSong)
);
songRoute.get("/", asyncCatch(songController.getAllSong));
songRoute.get("/update-ytb", asyncCatch(songController.updateUrlYtb));
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
songRoute.put(
  "/audio/:songId",
  uploader.single("file"),
  asyncCatch(songSingleUploadValid),
  asyncCatch(songController.update_song_audio)
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
songRoute.get("/trending", asyncCatch(songController.trendingList));
songRoute.put("/trending/:songId", asyncCatch(songController.countView));
songRoute.get("/recommend/:userId", asyncCatch(songController.recommendList));

songRoute.get("/ytb", asyncCatch(songController.urlYtb));

songRoute.put("/approved/:songId", asyncCatch(songController.approvedSong));
songRoute.put("/rejected/:songId", asyncCatch(songController.rejectedSong));

songRoute.get('/pending', asyncCatch(songController.getPendingSong));

export default songRoute;
