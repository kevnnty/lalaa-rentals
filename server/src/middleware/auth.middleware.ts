import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userService from "../services/users/user.service";
import jwtUtil from "../utils/jwt.util";
import { errorResponse } from "../utils/response.util";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = {
  verifyToken: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse({ message: "Authentication token is required." }));

      const decoded = jwtUtil.validateAccessToken(token);
      if (!decoded) return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse({ message: "Invalid or expired token." }));

      const user = await userService.findUserById(decoded.id);
      if (!user) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse({ message: "Invalid token. User not found." }));

      req.user = user;
      next();
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: "Authentication failed.", error }));
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
