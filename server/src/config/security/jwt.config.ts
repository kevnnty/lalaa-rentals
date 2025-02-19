import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../env.config";

export const JWT_CONFIG = {
  ACCESS_SECRET: ACCESS_TOKEN_SECRET || "nivek",
  REFRESH_SECRET: REFRESH_TOKEN_SECRET || "nivek",
  ACCESS_EXPIRY: "15m", // Access Token expires in 15 minutes
  REFRESH_EXPIRY: "7d", // Refresh Token expires in 7 days
};
