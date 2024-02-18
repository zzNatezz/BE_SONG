import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SongDB",
    resource_type: 'auto',
    allowedFormats: ["jpg", "png", "svd", "mp3", "mp4"],
  },
});

const uploader = multer({ storage: storage });

const uploadSong = uploader.fields([{name : "image", maxCount:1},{name:"song", maxCount : 1 }], (req, res) =>{
  const listFile = req.files;
  if(!listFile){
    return (
      res.status(400).send("invalid file")
      )
  }
  const listResult = [];
  for(file in listFile){
    const fileName = file.originalname.split('.')[0];
    cloudinary.uploader.upload(file.path, {
      public_id : fileName,
      resource_type: 'auto'
    }, (err, result) =>{
      if(result) {listResult.push(file)}
    }
    )
  }
  res.json({mes: "upload is completed"}, listFile)
})

export { uploader , cloudinary, uploadSong };
