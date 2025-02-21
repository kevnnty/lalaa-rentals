import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class BookingService {
  // Create a new booking
  async createBooking({ data, renterId }: { renterId: string; data: { propertyId: string; checkIn: Date; checkOut: Date } }) {
    // Ensure no overlapping bookings for the same property
    const existingBooking = await prisma.booking.findFirst({
      where: {
        renterId: renterId,
        propertyId: data.propertyId,
        checkOut: { gte: data.checkIn },
        checkIn: { lte: data.checkOut },
        status: { not: BookingStatus.CANCELED },
      },
    });

    if (existingBooking) {
      throw new Error("This property is already booked for the selected dates.");
    }

    // Proceed with creating the booking
    return prisma.booking.create({
      data: {
        ...data,
        renterId,
      },
    });
  }

  // Get all user bookings
  async getUserBookings(renterId: string) {
    return prisma.booking.findMany({
      where: { renterId },
      include: { property: true },
    });
  }

  // Get booking by ID
  async getBookingById(bookingId: string) {
    return await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true, renter: true },
    });
  }

  // Update booking status (Confirm or Cancel)
  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }

  // Delete a booking
  async deleteBooking(bookingId: string) {
    return await prisma.booking.delete({
      where: { id: bookingId },
    });
  }
}

export default new BookingService();
