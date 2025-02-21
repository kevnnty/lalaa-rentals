import { Router } from "express";
import bookingController from "../../../controllers/booking/booking.controller";
import authMiddleware from "../../../middleware/auth.middleware";

const bookingRouter = Router();

bookingRouter.post("/", authMiddleware.verifyToken, bookingController.create);
bookingRouter.put("/", authMiddleware.verifyToken, bookingController.getHostPropertiesWithBookings);
bookingRouter.get("/my-bookings", authMiddleware.verifyToken, bookingController.getUserBookings);
bookingRouter.get("/:id", authMiddleware.verifyToken, bookingController.getById);
bookingRouter.delete("/:id", authMiddleware.verifyToken, bookingController.delete);
bookingRouter.put("/:id/status", authMiddleware.verifyToken, authMiddleware.requireRole("HOST"), bookingController.updateBookingStatus);

export default bookingRouter;
