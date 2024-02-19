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

const storage = multer.diskStorage({
  // filename: function(req, file, cb){
  //   cb(null, file.originalname)
  // }
});

const uploader = multer({ storage: storage });

export { uploader , cloudinary };
