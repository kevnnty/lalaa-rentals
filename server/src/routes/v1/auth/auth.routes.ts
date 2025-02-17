import { Router } from "express";
import authController from "../../../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refreshToken);
authRouter.get("/logout", authController.logout);

export default authRouter;
