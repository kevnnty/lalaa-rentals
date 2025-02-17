import dotenv from "dotenv";
import passport from "passport";
import userService from "../services/users/user.service";
import { googleOauthStrategy } from "./passport-strategies/google-oauth.strategy";

dotenv.config();

// Google OAuth
passport.use("google-oauth", googleOauthStrategy);

// Serialize and Deserialize User
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userService.findUserById(id as string);
  done(null, user);
});

export default passport;
