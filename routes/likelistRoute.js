import { Router } from "express";
import { asyncCatch } from "../utils/asyncCatch.js";
import { listLikeController } from "../controller/listLikeController.js";


const likelistRoute = Router();
likelistRoute.put('/:userId/:songId',asyncCatch(listLikeController.updateListLike));

likelistRoute.get('/:userId',asyncCatch(listLikeController.getListLike));

export default likelistRoute