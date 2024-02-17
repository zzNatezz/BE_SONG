import { Router } from "express";
import { authController } from "../controller/authController.js";

const authRoute = Router();

const register = authRoute.post("/register", authController.registerUser);

const login = authRoute.post("/login", authController.loginUser);

const reresh = authRoute.post("/refresh", authController.requestRefreshToken);

export default authRoute;
