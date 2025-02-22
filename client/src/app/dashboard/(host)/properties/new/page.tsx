"use client";

import axiosClient from "@/config/axios.config";
import { useState } from "react";
import AttachmentsUpload from "./components/AttachmentsUpload";
import ThumbnailUpload from "./components/ThumbnailUpload";
import { Input } from "@/components/ui/input";
import TextareaAutosize from "react-textarea-autosize";
import Spinner from "@/components/ui/spinner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

// Zod validation schema
const propertyFormSchema = z.object({
  title: z.string().min(3, "Title is required").max(100, "Title is too long"),
  description: z.string().min(100, "Description should be at least 100 characters long").optional(),
  location: z.string().min(3, "Location is required"),
  price: z
    .string()
    .min(1, "Price must be greater than 0")
    .refine((value) => !isNaN(parseFloat(value)), "Price must be a number"),

  thumbnail: z.string().nullable(),
  attachments: z.array(z.string()).min(1, "At least one attachment is required"),
  facilities: z.array(z.string()).optional(), // New field for facilities
});

const facilityOptions = [
  "Wi-Fi",
  "Air Conditioning",
  "Heating",
  "Kitchen",
  "Parking",
  "Swimming Pool",
  "Gym",
  "TV",
  "Washing Machine",
  "Pet Friendly",
  "Elevator",
  "Balcony",
  "Dishwasher",
  "Refrigerator",
  "Microwave",
  "Garden",
  "Private Entrance",
  "Sauna",
  "Security System",
  "Fireplace",
  "Hot Tub",
  "Shared Pool",
  "Coffee Machine",
  "Smoke Detector",
  "BBQ Grill",
  "Concierge Service",
  "Outdoor Seating",
  "Playground",
  "24/7 Security",
  "Storage Space",
];

type PropertyFormData = z.infer<typeof propertyFormSchema>;

export default function AddListing() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    trigger, // This is used for manually triggering validation
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: "",
      thumbnail: "",
      attachments: [],
      facilities: [],
    },
    reValidateMode: "onChange", // Trigger validation on every change
  });

  const router = useRouter();

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post("/properties/create", {
        ...data,
        price: parseFloat(data.price as string),
        facilities: data.facilities || [],
      });

      toast.success(response.data.message);
      router.push(`/dashboard/properties/${response.data.data.id}`);
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to add listing.");
    } finally {
      setLoading(false);
    }
  };

  const thumbnail = watch("thumbnail");
  const attachments = watch("attachments");

  const handleThumbnailChange = (fileUrl: string | null) => {
    setValue("thumbnail", fileUrl);
    trigger("thumbnail");
  };

  const handleAttachmentsChange = (updatedAttachments: string[]) => {
    setValue("attachments", updatedAttachments);
    trigger("attachments");
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-semibold mb-4">Host Your Property with Us</h1>
      <p className="text-gray-400">Share your property with potential renters and start earning today!</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5 border-t pt-6">
        <div className="space-y-2">
          <label className="block font-medium text-lg">Property Title</label>
          <Controller name="title" control={control} render={({ field }) => <Input {...field} placeholder="Enter a title for your property" />} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-lg">Property Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                placeholder="Provide a brief description of your property"
                className="max-h-[240px] text-sm px-3.5 py-2.5 w-full outline-none bg-transparent border-2 border-gray-300 rounded-xl resize-none"
                minRows={4}
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-lg">Location</label>
          <Controller name="location" control={control} render={({ field }) => <Input {...field} placeholder="Where is your property located" />} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-lg">Price per Night</label>
          <Controller name="price" control={control} render={({ field }) => <Input {...field} placeholder="Set the price per night" type="number" />} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* File Uploads */}
        <div className="space-y-3">
          <label className="block font-medium text-lg">Thumbnail</label>
          <ThumbnailUpload thumbnail={thumbnail} setThumbnail={handleThumbnailChange} />
        </div>

        <div className="space-y-3">
          <label className="block font-medium text-lg">
            Attachments <span className="text-gray-500 text-sm">(images that showcase your property for potential renters)</span>
          </label>
          <AttachmentsUpload attachments={attachments} setAttachments={handleAttachmentsChange} />
        </div>

        <div className="space-y-3 pb-5">
          <label className="block font-medium text-lg">Available Facilities</label>
          <div className="grid grid-cols-2 gap-3">
            {facilityOptions.map((facility) => (
              <Controller
                key={facility}
                name="facilities"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value?.includes(facility) || false}
                      onCheckedChange={(checked) => {
                        const updatedFacilities = checked ? [...(field.value || []), facility] : field.value?.filter((item) => item !== facility);

                        setValue("facilities", updatedFacilities);
                        trigger("facilities");
                      }}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label className="text-gray-600">{facility}</label>
                  </div>
                )}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          title={!isValid ? "Please fill in all details about your property before publishing this" : ""}
          disabled={loading || !isValid || isSubmitting}
          className="sticky bottom-0 w-full bg-blue-500 text-white h-14 flex justify-center items-center rounded-xl shadow-2xl shadow-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300">
          {loading ? <Spinner /> : "Publish Property"}
        </button>
      </form>
    </div>
  );
}
