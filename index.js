import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import songRoute from "./routes/songRoute.js";
import serviceAccount from "./songs-cac58-firebase-adminsdk-u9fi1-aecf840a24.json" assert { type: "json" };

dotenv.config();

const sv = express();
const crosOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://songs-cac58.firebaseio.com",
});

sv.use(cors(crosOptions));
sv.use(cookieParser());

sv.use(express.json());
sv.use(morgan("combined"));

sv.use("/v1/songs", songRoute);
sv.use("/v1/auth", authRoute);
sv.use("/v1/user", userRoute);
sv.use("/index", (req, res) => res.send(`ok`));

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(
        `server port http://localhost:${process.env.PORT} is running !!!`
      )
    )
  );
