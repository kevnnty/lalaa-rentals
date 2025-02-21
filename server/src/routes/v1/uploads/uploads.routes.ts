import { Router } from "express";
import uploadsController from "../../../controllers/uploads/uploads.controller";
import multer from "multer";

const uploadsRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).any();

uploadsRouter.post("/", upload, uploadsController.uploadFile);

export default uploadsRouter;
