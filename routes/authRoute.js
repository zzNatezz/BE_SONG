import { Router } from "express";
import { authController } from "../controller/authController.js";

const authRoute = Router();

authRoute.post("/register", authController.registerUser);

authRoute.post("/login", authController.loginUser);

authRoute.post("/refresh", authController.refreshToken);

authRoute.post("/logout", authController.logoutUser);

export default authRoute;
