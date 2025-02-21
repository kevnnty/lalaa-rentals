import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary.config";

class UploadsService {
  uploadFile = async (file: string): Promise<UploadApiResponse> => {
    if (!file) {
      throw new Error("File is required for upload.");
    }

    const result: UploadApiResponse = await cloudinary.uploader.upload(file, {
      folder: "lalaa-rentals",
      resource_type: "auto",
    });

    return result;
  };
}

export default new UploadsService();
