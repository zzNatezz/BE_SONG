import { Router } from "express";
import { userController } from "../controller/userController.js";
import { uploader } from "../utils/uploader.js";
import { midleware } from "../validate/middleware.js";

const userRoute = Router();

userRoute.get("/", midleware.verifyToken, userController.getUsers);

userRoute.get("/:id", userController.getUser);
userRoute.put(
  "/:id",
  midleware.verifyTokenAdmin,
  uploader.single("file"),
  userController.updateUser
);
userRoute.delete("/:id", midleware.verifyTokenAdmin, userController.deleteUser);

// userRoute.put("/", songController.fileterSong);

export default userRoute;
