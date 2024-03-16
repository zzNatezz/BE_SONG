import { Router } from "express";
import { userController } from "../controller/userController.js";
import { middlewareController } from "../controller/middlewareController.js";
import { songController } from "../controller/songController.js";

const userRoute = Router();

userRoute.get(
  "/",
  middlewareController.verifyToken,
  userController.getAllUsers
);

userRoute.delete(
  "/:id",
  middlewareController.verifyTokenAdmin,
  userController.deleteUser
);

userRoute.put("/", songController.fileterSong);

export default userRoute;
