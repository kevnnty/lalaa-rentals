import { User } from "@prisma/client";
import Jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/security/jwt.config";

class JwtUtil {
  generateAccessToken = (payload: Partial<User>) => {
    return Jwt.sign(payload, JWT_CONFIG.ACCESS_SECRET, { expiresIn: JWT_CONFIG.ACCESS_EXPIRY as any });
  };

  generateRefreshToken = (payload: Partial<User>) => {
    return Jwt.sign(payload, JWT_CONFIG.REFRESH_SECRET, { expiresIn: JWT_CONFIG.REFRESH_EXPIRY as any });
  };

  validateAccessToken = (token: string): Jwt.JwtPayload | null => {
    try {
      return Jwt.verify(token, JWT_CONFIG.ACCESS_SECRET) as Jwt.JwtPayload;
    } catch {
      return null;
    }
  };

  validateRefreshToken = (token: string): Jwt.JwtPayload | null => {
    try {
      return Jwt.verify(token, JWT_CONFIG.REFRESH_SECRET) as Jwt.JwtPayload;
    } catch {
      return null;
    }
  };
}

export default new JwtUtil();
