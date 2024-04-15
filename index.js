import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import songRoute from "./routes/songRoute.js";
import likelistRoute from "./routes/likelistRoute.js";
import { Server } from "socket.io";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import http from "http";

dotenv.config();

const sv = express();
const sv_io = http.createServer(sv);
const io = new Server(sv_io, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const __dirname = dirname(fileURLToPath(import.meta.url));

sv.use(
  cors({
    origin: "http://localhost:3000",
  })
);

sv.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

sv.use(cookieParser());

sv.use(express.json());
sv.use(morgan("combined"));

sv.use("/v1/songs", songRoute);
sv.use("/v1/auth", authRoute);
sv.use("/v1/user", userRoute);
sv.use("/v1/likelist", likelistRoute);
sv.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log(` socket is connected `);
  socket.on(`disconect`, () => {
    console.log(` an user disconected`);
  });
});

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv_io.listen(process.env.PORT, () =>
      console.log(
        `server port http://localhost:${process.env.PORT} is running !!!`
      )
    )
  )
  .then(() => {
    const db = mongoose.connection.db;
    const collection = db.collection("songs");
    const changeStream = collection.watch();
    changeStream.on("change", (data) => {
      io.emit(`reload`, data) 
      console.log(`Db is changed`);
    });
  });
