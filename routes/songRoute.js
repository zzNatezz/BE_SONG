import { Router } from "express";
import { uploader } from "../utils/uploader.js";
import { songController } from "../controller/songController.js";
import {asyncCatch} from '../utils/asyncCatch.js'
import { songUpdateValid, songUploadValid } from "../validate/song.validate.js";
import { songModel } from "../modell/songModel.js";

const songRoute = Router();


songRoute.post("/", uploader.array('files'), asyncCatch(songUploadValid), songController.uploadSong);
songRoute.get('/', songController.getAllSong);
songRoute.put('/:songId', uploader.array('files'), asyncCatch(songUpdateValid), songController.updateSong);


export default songRoute;
