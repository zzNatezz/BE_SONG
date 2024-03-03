import { Router } from "express";
import likeController from "../controller/likeController.js";
import { asyncCatch } from "../utils/asyncCatch.js";

const likeRoute = Router();

likeRoute.put("/:userId/:songId", asyncCatch(likeController.updateLikeList))

export default likeRoute;
