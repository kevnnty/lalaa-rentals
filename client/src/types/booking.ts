import { Property } from "./property";

export interface Booking {
  id: string;
  propertyId: string;
  renterId: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  createdAt: string;
  updatedAt: string;
  property: Property;
}
