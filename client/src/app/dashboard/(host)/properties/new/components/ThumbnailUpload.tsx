"use client";

import Spinner from "@/components/ui/spinner";
import { Camera } from "lucide-react";
import axiosClient from "@/config/axios.config";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const acceptedFileTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export default function ThumbnailUpload({ thumbnail, setThumbnail }: { thumbnail: string | null; setThumbnail: (url: string | null) => void }) {
  const [isThumbnailUploadPending, setIsThumbnailUploadPending] = useState(false);

  const handleThumbnailUpload = async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (thumbnail) {
      toast("You can only upload one thumbnail.");
      return;
    }

    if (rejectedFiles.length > 0) {
      toast("Please upload only one image of type JPG, JPEG, PNG or WEBP.");
      return;
    }

    const newThumbnail = acceptedFiles[0];
    setIsThumbnailUploadPending(true);

    try {
      const formData = new FormData();
      formData.append("file", newThumbnail);

      const response = await axiosClient.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setThumbnail(response.data.files[0].url);
      toast.success("Thumbnail uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while uploading the file.");
    } finally {
      setIsThumbnailUploadPending(false);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      handleThumbnailUpload(acceptedFiles, rejectedFiles);
    },
    [handleThumbnailUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB limit
  });

  return (
    <div className="bg-gradient-shadow-primary pb-1.5 transition-all rounded-[40px]">
      <div className={`relative bg-white outline-none w-full flex justify-center items-center h-[396px] border-2 rounded-[30px]`}>
        {thumbnail ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <img src={thumbnail} alt="Product thumbnail" className="h-[300px] aspect-auto rounded-xl cursor-pointer" />
            <button
              onClick={removeThumbnail}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 grid place-content-center text-sm z-[2]">
              <XIcon size={16} />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={clsx(
              `absolute inset-0 cursor-pointer w-full h-full flex justify-center items-center outline-none`,
              isThumbnailUploadPending && "!cursor-not-allowed"
            )}>
            <input {...getInputProps()} disabled={isThumbnailUploadPending} />
            {isThumbnailUploadPending ? (
              <Spinner size={40} color="#000" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                {isDragActive ? (
                  <p className="text-lg text-center text-primary-black font-medium">Drop the file here...</p>
                ) : (
                  <>
                    <div className="bg-[#4B465C14] p-3 rounded-xl">
                      <Camera />
                    </div>
                    <div className="text-center space-y-4">
                      <h1 className="text-primary-paragraph text-xl font-medium">Click to upload thumbnail</h1>
                      <p className="text-sm text-primary-black text-opacity-70">(Max file size: 5MB)</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
