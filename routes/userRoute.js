import { Router } from "express";
import { userController } from "../controller/userController.js";

const userRoute = Router();

userRoute.get("/", userController.getAllUsers);

userRoute.delete("/:id", userController.deleteUser);

export default userRoute;
