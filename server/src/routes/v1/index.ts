import { Router } from "express";
import authRouter from "./auth/auth.routes";
import usersRouter from "./users/users.routes";
import propertiesRouter from "./properties/properties.routes";
import bookingRouter from "./booking/booking.routes";
import uploadsRouter from "./uploads/uploads.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users/accounts", usersRouter);
router.use("/properties", propertiesRouter);
router.use("/booking", bookingRouter);
router.use("/uploads", uploadsRouter);

export default router;
