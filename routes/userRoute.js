import { Router } from "express";
import { userController } from "../controller/userController.js";
import { middlewareController } from "../controller/middlewareController.js";

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

export default userRoute;
