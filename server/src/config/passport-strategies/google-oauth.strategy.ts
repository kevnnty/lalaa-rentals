import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import userService from "../../services/users/user.service";
import { OauthSocialProfile } from "../../types/oauth.profile";
import jwtUtil from "../../utils/jwt.util";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } from "../env.config";

const generateTokens = async (user: any) => {
  const accessToken = jwtUtil.generateAccessToken(user);
  const refreshToken = jwtUtil.generateRefreshToken(user);
  await userService.updateUser(user.id, { refreshToken });
  return { accessToken, refreshToken };
};

export const googleOauthStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${SERVER_URL}/api/v1/auth/google/callback`,
    scope: ["profile", "email"],
    passReqToCallback: true,
  },
  async (req: any, accessToken: string, refreshToken: string, profile: OauthSocialProfile, done: any) => {
    try {
      const role = req.cookies.oauth_role;

      const user = await userService.findOrCreateUser(profile, "GOOGLE", role);
      const tokens = await generateTokens(user);
      req.res?.clearCookie("oauth_role", { httpOnly: true, secure: true });

      done(null, { user, ...tokens });
    } catch (error) {
      done(error, false);
    }
  }
);
