import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv'
import { authController } from "./controller/authController.js";
import { userController } from "./controller/userController.js";
import { songController } from "./controller/songController.js";

dotenv.config();

const sv = express();
sv.use(express.json());
sv.use(morgan("combined"));


sv.use('auth', authController);
sv.use('users', userController);
sv.use('songs', songController);

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(`server port ${process.env.PORT} is running !!!`)
    )
  );
