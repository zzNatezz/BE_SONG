import { Router } from "express";
import { cloudinary, uploader } from "../utils/uploader.js";
import { songController } from "../controller/songController.js";
import {asyncCatch} from '../utils/asyncCatch.js'
import { songUploadValid } from "../validate/songUpload.validate.js";
import { songModel } from "../modell/songModel.js";
const songRoute = Router();


songRoute.post("/upload", uploader.fields([{name : 'image', maxCount:1}, {name: 'audio',maxCount:1}]), (req, res)=>{
    const listFile = req.files; console.log(listFile);
    if(!listFile){
        return res.status(400).send(`khong tai duoc tep`)
    };
    const datacb = [];
    for( let file in listFile){
        const fileName = file.originalname.split('.')[0]
         cloudinary.uploader.upload(req.file.path,{
            resource_type:'auto',
            public_id: fileName
        }, (err,result) => {
            if(err){
                console.log(err);
                return res.status(500),send('fail')
            }
            datacb.push(result)
        })
    };
    console.log(datacb);
    res.send(`ok`)
})

songRoute.post('/test/upload', songController.testCreatSong)
songRoute.get('/test/upload', songController.getAllSong)


export default songRoute;
