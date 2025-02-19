import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { cookieConfig } from "../../config/cookies.config";
import authService from "../../services/auth/auth.service";
import { errorResponse, successResponse } from "../../utils/response.util";
import { FRONTEND_URL } from "../../config/env.config";

class AuthController {
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse({ message: "Email and password are required!" }));
      }

      const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

      return res
        .cookie("refreshToken", refreshToken, cookieConfig)
        .status(StatusCodes.OK)
        .json(successResponse({ message: "Login successful!", data: { user, accessToken } }));
    } catch (error: any) {
      return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse({ message: error.message, error }));
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json(errorResponse({ message: "Refresh token required" }));

      const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);
      return res
        .cookie("refreshToken", newRefreshToken, cookieConfig)
        .status(StatusCodes.OK)
        .json(successResponse({ message: "Token refreshed!", data: { accessToken } }));
    } catch (error: any) {
      return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse({ message: error.message, error }));
    }
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      await authService.logoutUser(userId);
      return res.status(StatusCodes.OK).json(successResponse({ message: "Logged out successfully!" }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: "Logout failed", error }));
    }
  };

  googleOauthCallback = async (req: Request, res: Response) => {
    try {
      const { accessToken, refreshToken } = req.user as { accessToken: string; refreshToken: string };
      if (!accessToken || !refreshToken) throw new Error("Access or refresh tokens are missing");
      res.cookie("refreshToken", refreshToken, cookieConfig).cookie("accessToken", accessToken, cookieConfig);
      res.redirect(`${FRONTEND_URL}/auth/google/success`);
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      res.redirect(`${FRONTEND_URL}/auth/login?error=${error.message}`);
    }
  };
}

export default new AuthController();
