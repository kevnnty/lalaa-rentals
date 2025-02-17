import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../env.config";

export const JWT_CONFIG = {
  ACCESS_SECRET: JWT_ACCESS_SECRET || "nivek",
  REFRESH_SECRET: JWT_REFRESH_SECRET || "nivek",
  ACCESS_EXPIRY: "15m", // Access Token expires in 15 minutes
  REFRESH_EXPIRY: "7d", // Refresh Token expires in 7 days
};
