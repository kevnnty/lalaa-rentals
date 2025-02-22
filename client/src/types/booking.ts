import { Property } from "./property";
import { User } from "./user";

export interface Booking {
  id: string;
  propertyId: string;
  renterId: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  createdAt: string;
  updatedAt: string;
  renter: User;
  property: Property;
}
