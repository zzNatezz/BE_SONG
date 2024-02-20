import { Router } from "express";
import { cloudinary, uploader } from "../utils/uploader.js";
import { songController } from "../controller/songController.js";
import {asyncCatch} from '../utils/asyncCatch.js'
import { songUploadValid } from "../validate/songUpload.validate.js";
import { songModel } from "../modell/songModel.js";
const songRoute = Router();


songRoute.post("/upload", uploader.array('files'), async (req, res)=>{
    const body = req.body;
    const listFile = req.files;
    if(listFile > 2){
        return res.status(400).send(`only accept 2 files`)
    }
    if(!listFile){
        return res.status(400).send(`khong tai duoc tep`)
    };
    const dataImage = [];
    const dataAudio = [];
    for( const file of listFile){
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const fileName = file.originalname.split('.')[0];
        const uploaded = await cloudinary.uploader.upload(dataUrl,{
            public_id:fileName,
            resource_type : 'auto'
        })
        uploaded.resource_type === "image" ? dataImage.push(uploaded) : dataAudio.push(uploaded)
    }
    const song = await songModel.create({
        title : req.body.title,
        author : req.body.author,
        image : dataImage[0].secure_url, 
        song : dataAudio[0].secure_url,
        isPublic : req.body.isPublic
    })
    res.status(201).send(`Song has been created.`)
    })

songRoute.post('/test/upload', songController.testCreatSong)
songRoute.get('/upload', songController.getAllSong)


export default songRoute;
