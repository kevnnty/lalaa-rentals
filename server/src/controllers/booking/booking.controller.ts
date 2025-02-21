import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bookingService from "../../services/booking/booking.service";
import { errorResponse, successResponse } from "../../utils/response.util";

export class BookingController {
  // Create a booking
  async create(req: Request, res: Response) {
    try {
      const renterId = (req as any).user.id;
      const booking = await bookingService.createBooking({ renterId: renterId, data: req.body });
      return res
        .status(StatusCodes.CREATED)
        .json(successResponse({ message: "Booking request sent, please wait for confirmation by property owner.", data: booking }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  }

  // Get all bookings
  async getUserBookings(req: Request, res: Response) {
    try {
      const renterId = (req as any).user.id;
      const bookings = await bookingService.getUserBookings(renterId);
      return res.status(StatusCodes.OK).json(successResponse({ message: "User bookings retrieved successfully!", data: bookings }));
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse({ message: error.message, error }));
    }
  }

  // Get a single booking by ID
  async getById(req: Request, res: Response) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) return res.status(404).json(errorResponse({ message: "Booking not found" }));
      return res.status(200).json(successResponse({ message: "Booking retrieved successfully", data: booking }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  }

  // Update booking status (Confirm or Cancel)
  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (!["CONFIRMED", "CANCELED"].includes(status)) {
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse({ message: "Invalid status update." }));
      }

      const updatedBooking = await bookingService.updateBookingStatus(bookingId, status);
      return res.status(StatusCodes.OK).json(successResponse({ message: "Booking status updated.", data: updatedBooking }));
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse({ message: error.message, error }));
    }
  }

  // Delete a booking
  async delete(req: Request, res: Response) {
    try {
      await bookingService.deleteBooking(req.params.id);
      return res.status(StatusCodes.OK).json(successResponse({ message: "Booking deleted." }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  }
}

export default new BookingController();
