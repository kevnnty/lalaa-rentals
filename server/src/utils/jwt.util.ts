import Jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } from "../config/env.config";
import { User } from "@prisma/client";

class JwtUtil {
  generateAccessToken = (payload: Partial<User>) => {
    try {
      const { id, email, role } = payload;
      return Jwt.sign({ id, email, role }, REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  generateRefreshToken = (payload: Partial<User>) => {
    try {
      const { id, email } = payload;
      return Jwt.sign({ id, email }, ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  validateAccessToken = (token: string) => {
    try {
      return Jwt.verify(token, REFRESH_TOKEN_SECRET) as Jwt.JwtPayload;
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  validateRefreshToken = (token: string) => {
    try {
      return Jwt.verify(token, ACCESS_TOKEN_SECRET) as Jwt.JwtPayload;
    } catch (e: any) {
      throw new Error(e.message);
    }
  };
}

export default new JwtUtil();
