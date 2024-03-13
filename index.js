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

dotenv.config();

const sv = express();

const allowedOrigins = ["https://stave.icu", "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

sv.use(cors(corsOptions));

sv.use(cookieParser());

sv.use(express.json());
sv.use(morgan("combined"));

sv.use("/v1/songs", songRoute);
sv.use("/v1/auth", authRoute);
sv.use("/v1/user", userRoute);
sv.use("v1/likelist", likeRoute);

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(
        `server port http://localhost:${process.env.PORT} is running !!!`
      )
    )
  );
