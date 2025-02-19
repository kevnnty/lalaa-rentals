import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT!;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
export const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME!;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD!;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;
export const FRONTEND_URL = process.env.FRONTEND_URL!;
export const SERVER_URL = process.env.SERVER_URL!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
