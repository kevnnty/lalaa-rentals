export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  isVerified: boolean;
  role?: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}
