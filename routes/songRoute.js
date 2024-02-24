import { Router } from "express";
import { uploader } from "../utils/uploader.js";
import { songController } from "../controller/songController.js";
import {asyncCatch} from '../utils/asyncCatch.js'
import { songUpdateValid, songUploadValid } from "../validate/song.validate.js";
import { songModel } from "../modell/songModel.js";

const songRoute = Router();


songRoute.post("/", uploader.array('files'), asyncCatch(songUploadValid), asyncCatch(songController.uploadSong));
songRoute.get('/', asyncCatch(songController.getAllSong));
// songRoute.put('/:songId', uploader.array('files'), asyncCatch(songUpdateValid), songController.updateSong);
songRoute.delete('/:songId', asyncCatch(songController.deleteSong))
songRoute.post('/listened/:songId', asyncCatch(songController.listnedList))
songRoute.get('/listened', asyncCatch(songController.getListenedList))

export default songRoute;