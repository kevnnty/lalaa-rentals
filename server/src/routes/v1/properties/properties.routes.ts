import { Router } from "express";
import propertiesController from "../../../controllers/properties/properties.controller";
import authMiddleware from "../../../middleware/auth.middleware";

const propertiesRouter = Router();

propertiesRouter.post("/create", authMiddleware.verifyToken, authMiddleware.requireRole("HOST"), propertiesController.create);
propertiesRouter.get("/", authMiddleware.verifyToken, propertiesController.getAll);
propertiesRouter.get("/host", authMiddleware.verifyToken, authMiddleware.requireRole("HOST"), propertiesController.getHostProperties);
propertiesRouter.get("/:id", authMiddleware.verifyToken, propertiesController.getById);
propertiesRouter.put("/:id", authMiddleware.verifyToken, authMiddleware.requireRole("HOST"), propertiesController.update);
propertiesRouter.delete("/:id", authMiddleware.verifyToken, authMiddleware.requireRole("HOST"), propertiesController.delete);

export default propertiesRouter;
