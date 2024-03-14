import { Router } from "express";
import likeController from "../controller/likeController.js";
import { asyncCatch } from "../utils/asyncCatch.js";

const likeRoute = Router();

likeRoute.post("/:userId/:songId", asyncCatch(likeController.liked));

export default likeRoute;
