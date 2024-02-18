import { Router } from "express";
import { uploadSong } from "../utils/uploader.js";
import { songController } from "../controller/songController.js";
import {asyncCatch} from '../utils/asyncCatch.js'
import { songUploadValid } from "../validate/songUpload.validate.js";
const songRoute = Router();


// songRoute.post("/upload", uploadSong, asyncCatch(songUploadValid), asyncCatch(songController.creatSong));

songRoute.post('/test/upload', songController.testCreatSong)

export default songRoute;
