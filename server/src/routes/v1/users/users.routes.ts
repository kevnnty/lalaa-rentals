import { Router } from "express";
import userController from "../../../controllers/users/user.controller";
import authMiddleware from "../../../middleware/auth.middleware";

const usersRouter = Router();

usersRouter.post("/register", userController.registerUser);
usersRouter.post("/verify-email", userController.verifyEmail);
usersRouter.post("/verify-email/resend-code", userController.resendEmailVerificationCode);

usersRouter.put("/", authMiddleware.verifyToken, userController.updateUser);
usersRouter.get("/me", authMiddleware.verifyToken, userController.getMyProfile);
usersRouter.delete("/", authMiddleware.verifyToken, userController.deleteMyAccount);

export default usersRouter;
