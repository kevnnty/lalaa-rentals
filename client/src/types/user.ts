export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  isVerified: boolean;
  role?: "RENTER" | "HOST";
  createdAt: Date;
  updatedAt: Date;
}
