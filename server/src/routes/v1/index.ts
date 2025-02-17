import { Router } from "express";
import authRouter from "./auth/auth.routes";
import usersRouter from "./users/users.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users/accounts", usersRouter);

export default router;
