import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userService from "../services/users/user.service";
import jwtUtil from "../utils/jwt.util";
import { errorResponse } from "../utils/response.util";
import { User } from "@prisma/client";
import { cookieConfig } from "../config/cookies.config";
import authService from "../services/auth/auth.service";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = {
  verifyToken: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization?.split(" ")[1];
      if (!accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication token is required." });
      }

      let decoded;
      try {
        decoded = jwtUtil.validateAccessToken(accessToken);
      } catch (error: any) {
        if (error.message === "jwt expired") {
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token is required." });
          }

          const { accessToken: newAccessToken, newRefreshToken } = await authService.refreshAccessToken(refreshToken);

          res.cookie("refreshToken", newRefreshToken, cookieConfig);
          res.setHeader("Authorization", `Bearer ${newAccessToken}`);
          req.headers.authorization = `Bearer ${newAccessToken}`;

          decoded = jwtUtil.validateAccessToken(newAccessToken);
        } else {
          throw error;
        }
      }

      const user = await userService.findUserById((decoded as User).id);
      if (!user) {
        throw new Error("User not found");
      }

      req.user = user;
      next();
    } catch (error: any) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication failed, please sign in again to continue." });
    }
  },

  requireRole: (role: "RENTER" | "HOST") => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse({ message: "Authentication required." }));
      if (req.user.role !== role) return res.status(StatusCodes.FORBIDDEN).json(errorResponse({ message: "Access denied." }));
      next();
    };
  },
};

export default authMiddleware;
