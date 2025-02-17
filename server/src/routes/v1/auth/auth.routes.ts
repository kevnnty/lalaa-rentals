import { Router } from "express";
import authController from "../../../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.get("/", authController.login);

export default authRouter;
