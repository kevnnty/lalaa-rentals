import { Router } from "express";
import bookingController from "../../../controllers/booking/booking.controller";
import authMiddleware from "../../../middleware/auth.middleware";

const bookingRouter = Router();

bookingRouter.post("/", authMiddleware.verifyToken, bookingController.create);
bookingRouter.get("/my-bookings", authMiddleware.verifyToken, bookingController.getUserBookings);
bookingRouter.get("/:id", authMiddleware.verifyToken, bookingController.getById);
bookingRouter.put("/:id/status", authMiddleware.verifyToken, bookingController.updateBookingStatus);
bookingRouter.delete("/:id", authMiddleware.verifyToken, bookingController.delete);

export default bookingRouter;
