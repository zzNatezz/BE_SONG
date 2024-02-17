import { songModel } from "../modell/songModel.js";
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';

const storage = multer.memoryStorage();
const upload = multer({storage : storage});


export const uploadSong = (upload.single('file') , (req, res) => {
    const file = req.file;
    if(!file){
        return res.status(400).json({error : 'uploading is canceled.'})
    };
    const dataUrl = `data: ${file.mimetype}; base 64, ${file.buffer.toString('base64')}`;
    const fileName = file.originalName.split('.')[0];

    cloudinary.uploader.upload(dataUrl , {
        public: fileName,
        resource_type: 'auto',
    },(err, result) =>{
        if(result){
            console.log(result.recure_url);
        }
    })
    res.status(201).send({
        data : file,
        mes : 'upload is completed'
    })
})