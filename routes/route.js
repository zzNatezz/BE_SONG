import { Router } from "express";
import { authController } from "../controller/authController.js";

const router = Router();

const register = router.post("/register", authController.registerUser);

const login = router.post("/login", authController.loginUser);

export default router;
