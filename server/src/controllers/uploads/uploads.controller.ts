import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import uploadsService from "../../services/uploads/uploads.service";

class UploadsController {
  uploadFile = async (req: Request, res: Response): Promise<Response> => {
    try {
      // Check if files were uploaded
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Please upload at least one file!",
        });
      }

      const files: Express.Multer.File[] = Array.isArray(req.files) ? req.files : Object.values(req.files).flat(); // Handles multiple fields

      const maxFileSize = 5 * 1024 * 1024; // 5MB

      for (const file of files) {
        if (file.size > maxFileSize) {
          return res.status(StatusCodes.REQUEST_TOO_LONG).json({
            message: `File size exceeds the maximum limit of ${maxFileSize / (1024 * 1024)}MB.`,
          });
        }
      }

      // Convert file buffers to base64 & upload
      const uploadPromises = files.map((file) => {
        const base64 = file.buffer.toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64}`;
        return uploadsService.uploadFile(dataURI);
      });

      const uploadResults = await Promise.all(uploadPromises);

      return res.status(StatusCodes.CREATED).json({
        message: `File${files.length > 1 ? "s" : ""} uploaded successfully!`,
        files: uploadResults.map((result) => ({
          url: result.secure_url,
          public_id: result.public_id,
        })),
      });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  };
}

export default new UploadsController();
