import { Router } from "express";
import { authController } from "../controller/authController.js";
import { middlewareController } from "../controller/middlewareController.js";

const authRoute = Router();

const register = authRoute.post("/register", authController.registerUser);

const login = authRoute.post("/login", authController.loginUser);

const reresh = authRoute.post("/refresh", authController.requestRefreshToken);

const logout = authRoute.post(
  "/logout",
  middlewareController.verifyToken,
  authController.logoutUser
);

export default authRoute;
