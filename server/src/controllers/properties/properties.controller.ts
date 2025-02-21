import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import propertiesService from "../../services/properties/properties.service";
import { errorResponse, successResponse } from "../../utils/response.util";
import { User } from "@prisma/client";

export class PropertiesController {
  // Create Property
  async create(req: Request, res: Response) {
    try {
      const user: User = (req as any).user;
      const property = await propertiesService.createProperty({ creatorId: user.id, data: req.body });
      return res.status(StatusCodes.CREATED).json(successResponse({ message: "Property created!", data: property }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  }

  // Get All Properties
  async getAll(req: Request, res: Response) {
    try {
      const properties = await propertiesService.getAllProperties();
      return res.status(StatusCodes.OK).json(successResponse({ message: "Properties retrieved!", data: properties }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  }

  // Get Property by ID
  async getById(req: Request, res: Response) {
    try {
      const property = await propertiesService.getPropertyById(req.params.id);
      if (!property) return res.status(StatusCodes.NOT_FOUND).json(errorResponse({ message: "Property not found" }));
      return res.status(StatusCodes.OK).json(successResponse({ message: "Property retrieved succesfully!", data: property }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  }

  // Update Property
  async update(req: Request, res: Response) {
    try {
      const property = await propertiesService.updateProperty(req.params.id, req.body);
      return res.status(StatusCodes.OK).json(successResponse({ message: "Property updated succesfully!", data: property }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  }

  // Delete Property
  async delete(req: Request, res: Response) {
    try {
      await propertiesService.deleteProperty(req.params.id);
      return res.status(StatusCodes.OK).json(successResponse({ message: "Property deleted succesfully!" }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  }
}

export default new PropertiesController();
