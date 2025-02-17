import { Router } from "express";
import authController from "../../../controllers/auth/auth.controller";
import passport from "../../../config/passport.config";
import { FRONTEND_URL } from "../../../config/env.config";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refreshToken);
authRouter.get("/logout", authController.logout);
authRouter.get("/logout", authController.logout);

authRouter.get("/google", passport.authenticate("google-oauth", { scope: ["profile", "email"], session: false }));
authRouter.get(
  "/google/callback",
  passport.authenticate("google-oauth", { failureRedirect: `${FRONTEND_URL}`, session: false }),
  authController.googleOauthCallback
);

export default authRouter;
