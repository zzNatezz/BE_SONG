import { Router } from "express";
import { uploader } from "../utils/uploader.js";
import { songController } from "../controller/songController.js";
import { asyncCatch } from "../utils/asyncCatch.js";
import {
  postListenedListValid,
  songArrayUploadValid,
  songAuthorValid,
  songSingleUploadValid,
  songTitleValid,
} from "../validate/song.validate.js";

const songRoute = Router();
songRoute.post(
  "/:userId",
  uploader.array("files"),
  asyncCatch(songArrayUploadValid),
  asyncCatch(songAuthorValid),
  asyncCatch(songTitleValid),
  asyncCatch(songController.uploadSong)
);
songRoute.get("/", asyncCatch(songController.getAllSong));

songRoute.get("/update-ytb", asyncCatch(songController.updateUrlYtb));
songRoute.get("/ytb", asyncCatch(songController.urlYtb));
songRoute.post("/ytb/:userId", asyncCatch(songController.uploadSongYtb));

songRoute.put(
  "/title/:songId",
  asyncCatch(songTitleValid),
  asyncCatch(songController.update_song_tiltle)
);
songRoute.put(
  "/author/:songId",
  asyncCatch(songAuthorValid),
  asyncCatch(songController.update_song_author)
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
songRoute.get("/listened/:userId", asyncCatch(songController.againList));
songRoute.put(
  "/listened/:userId/:songId",
  asyncCatch(songController.updateAgainList)
);
songRoute.get("/trending", asyncCatch(songController.trendingList));
songRoute.put("/trending/:songId", asyncCatch(songController.countView));
songRoute.get("/recommend/:userId", asyncCatch(songController.recommendList));

songRoute.put("/approved/:songId", asyncCatch(songController.approvedSong));
songRoute.put("/rejected/:songId", asyncCatch(songController.rejectedSong));

songRoute.get("/pending", asyncCatch(songController.getPendingSong));

songRoute.get("/like/:userId", asyncCatch(songController.listLike));
songRoute.put("/like/:userId/:songId", asyncCatch(songController.liked));

export default songRoute;
