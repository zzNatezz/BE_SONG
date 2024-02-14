import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv'

dotenv.config();

const sv = express();
sv.use(express.json());
sv.use(morgan("combined"));

sv.use('/index' , (req, res) => res.status(200).send(`i am comback`));

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(`server port ${process.env.PORT} is running !!!`)
    )
  );
