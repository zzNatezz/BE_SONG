import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import { songController } from "./controller/songController.js";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_API_SECRET,
});

const sv = express();

sv.use(cors());
sv.use(cookieParser());

sv.use(express.json());
sv.use(morgan("combined"));

sv.use("/songs", songController);

sv.use("/v1/auth", authRoute);
sv.use("/v1/user", userRoute);

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(
        `server port http://localhost:${process.env.PORT} is running !!!`
      )
    )
  );
