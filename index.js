import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import songRoute from "./routes/songRoute.js";
import likeRoute from "./routes/likeRoute.js";
import cron from "node-cron";
import { songModel } from "./modell/songModel.js";
import { songController } from "./controller/songController.js";

dotenv.config();

const sv = express();

sv.use(cors());

sv.use(cookieParser());

sv.use(express.json());
sv.use(morgan("combined"));

sv.use("/v1/songs", songRoute);
sv.use("/v1/auth", authRoute);
sv.use("/v1/user", userRoute);
sv.use("v1/likelist", likeRoute);

cron.schedule("*/5 * * * *", async () => {
  try {
    const allSongs = await songModel.find({});
    await Promise.all(
      allSongs.map(async (song) => {
        await songController.updateUrlYtb(song._id);
      })
    );
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(
        `server port http://localhost:${process.env.PORT} is running !!!`
      )
    )
  );
