import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv'
import multer from "multer";
import {v2 as cloundinary} from cloundinary;
import { authController } from "./controller/authController.js";
import { userController } from "./controller/userController.js";
import { songController } from "./controller/songController.js";

dotenv.config();

cloundinary.config({
    cloud_name: 'dxo324ch0',
    api_key: '392236692491454',
    api_secret: 'qYDv0H5lDyR81eueVbGoSsKGOHQ'
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const sv = express();
sv.use(express.json());
sv.use(morgan("combined"));


sv.use('/auth', authController);
sv.use('/users', userController);
sv.use('/songs', songController);
sv.use('/index', (req, res) => res.status(200).send('hello'))

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(`server port ${process.env.PORT} is running !!!`)
    )
  );
