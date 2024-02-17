import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authController } from "./controller/authController.js";
import { userController } from "./controller/userController.js";
import { songController } from "./controller/songController.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_API_SECRET,
});

const sv = express();
sv.use(express.json());
sv.use(morgan("combined"));

sv.use("/auth", authController);
sv.use("/users", userController);
sv.use("/songs", songController);
sv.use("/index", (req, res) => res.status(200).send("hello"));

//test branch Hieu

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(`server port ${process.env.PORT} is running !!!`)
    )
  );
