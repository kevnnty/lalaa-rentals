"use client";

import Spinner from "@/components/ui/spinner";
import { Camera, ImageIcon } from "lucide-react";
import axiosClient from "@/config/axios.config";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const acceptedFileTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

interface Props {
  attachments: string[];
  setAttachments: (updatedAttachments: string[]) => void;
}

export default function AttachmentsUpload({ attachments, setAttachments }: Props) {
  const [isAttachmentUploadPending, setIsAttachmentUploadPending] = useState(false);

  const handleFileUpload = async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (attachments.length >= 3) {
      toast("You can only upload up to 3 files.");
      return;
    }

    if (rejectedFiles.length > 0) {
      toast("Please upload only 3 images of type JPG, JPEG, PNG or WEBP.");
      return;
    }

    const remainingSlots = 3 - attachments.length;

    if (remainingSlots <= 0 || acceptedFiles.length === 0) return;

    const newFiles = acceptedFiles.slice(0, remainingSlots);
    setIsAttachmentUploadPending(true);

    try {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append("file", file));

      const response = await axiosClient.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newAttachments = [...attachments, ...response.data.files.map((file: any) => file.url)];
      setAttachments(newAttachments);

      toast.success("Attachments uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while uploading the files.");
    } finally {
      setIsAttachmentUploadPending(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      handleFileUpload(acceptedFiles, rejectedFiles);
    },
    [attachments, handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: Math.max(3 - attachments.length, 0),
    multiple: true,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <>
      <div className="bg-gradient-shadow-primary pb-1.5 transition-all rounded-[40px]">
        <div
          {...getRootProps()}
          className={clsx(
            `bg-white outline-none w-full flex justify-center items-center h-[396px] cursor-pointer border-2 rounded-[30px]`,
            isAttachmentUploadPending && "!cursor-not-allowed"
          )}>
          <input {...getInputProps()} disabled={isAttachmentUploadPending} multiple />
          {isAttachmentUploadPending ? (
            <Spinner size={40} color="#000" />
          ) : (
            <>
              {isDragActive ? (
                <p className="text-lg text-center text-primary-black font-medium">Drop the file here...</p>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[#4B465C14] p-3 rounded-xl">
                    <Camera />
                  </div>
                  <div className="text-center space-y-4">
                    <h1 className="text-primary-paragraph text-xl font-medium">
                      Drag and drop image <br /> or click here to browse your files.
                    </h1>
                    <p className="text-sm text-primary-black text-opacity-70">(Max file size: 5MB)</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center justify-center border-dashed border-2 border-[#DBDBDB] rounded-2xl h-[214px] relative p-3">
            {attachments[index] ? (
              <div>
                <img src={attachments[index]} alt="Product Attachment" className="max-h-[180px] object-cover aspect-auto rounded-xl" />
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 grid place-content-center text-sm">
                  <XIcon size={16} />
                </button>
              </div>
            ) : (
              <div>
                <ImageIcon className="text-[#DBDBDB]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
