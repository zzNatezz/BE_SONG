import { Router } from "express";
import { userController } from "../controller/userController.js";
import { middlewareController } from "../controller/middlewareController.js";

const userRoute = Router();

userRoute.get(
  "/",
  middlewareController.verifyTokenAdmin,
  userController.getUsers
);

userRoute.get("/:id", userController.getUser);
userRoute.put("/:id", userController.updateUser);
userRoute.delete(
  "/:id",
  middlewareController.verifyTokenAdmin,
  userController.deleteUser
);

// userRoute.put("/", songController.fileterSong);

export default userRoute;
