import { CookieOptions } from "express";

export const cookieConfig : CookieOptions = {
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
};
