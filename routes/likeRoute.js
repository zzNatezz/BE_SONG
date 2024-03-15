import { Router } from "express";
import { likeController } from "../controller/likeController.js";

const likeRoute = Router();

likeRoute.get("/:userId", likeController.listLike);
likeRoute.put("/:userId/:songId", likeController.liked);
likeRoute.delete("/:userId/:songId", likeController.unlike);

export default likeRoute;
