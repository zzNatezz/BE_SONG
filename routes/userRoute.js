import { Router } from "express";
import { userController } from "../controller/userController.js";
import { middlewareController } from "../controller/middlewareController.js";
import { uploader } from "../utils/uploader.js";

const userRoute = Router();

userRoute.get(
  "/",
  middlewareController.verifyTokenAdmin,
  userController.getUsers
);

userRoute.get("/:id", userController.getUser);
userRoute.put("/:id", uploader.single("file"), userController.updateUser);
userRoute.delete("/:id", userController.deleteUser);

// userRoute.put("/", songController.fileterSong);

export default userRoute;
