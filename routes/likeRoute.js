import { Router } from "express";
import likeController from "../controller/likeController.js";
import { asyncCatch } from "../utils/asyncCatch.js";

const likeRoute = Router();
likeRoute.get("/likes/:userId", asyncCatch(likeController.listLike));
likeRoute.put("/:userId/:songId", asyncCatch(likeController.liked));
likeRoute.delete("/:userId/:songId", asyncCatch(likeController.unlike));

export default likeRoute;
