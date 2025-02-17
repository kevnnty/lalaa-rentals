import axios from "axios";
import OAuth2Strategy from "passport-oauth2";
import userService from "../../services/users/user.service";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } from "../env.config";
import jwtUtil from "../../utils/jwt.util";

const generateTokens = async (user: any) => {
  const accessToken = jwtUtil.generateAccessToken(user);
  const refreshToken = jwtUtil.generateRefreshToken(user);
  await userService.updateUser(user.id, { refreshToken });
  return { accessToken, refreshToken };
};

export const googleOauthStrategy = new OAuth2Strategy(
  {
    authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenURL: "https://oauth2.googleapis.com/token",
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: `${SERVER_URL}/api/v1/auth/google/callback`,
    scope: ["profile", "email"],
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const { data: userProfile } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = await userService.findOrCreateUser(userProfile, "GOOGLE");

      const tokens = await generateTokens(user);

      done(null, { user, ...tokens });
    } catch (error) {
      done(error, false);
    }
  }
);
