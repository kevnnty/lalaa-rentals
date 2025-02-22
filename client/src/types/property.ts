import { Booking } from "./booking";
import { User } from "./user";

export interface Property {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  location: string;
  attachments: string[];
  facilities: string[];
  hostId: string;
  host: User;
  bookings: Booking[];
}
