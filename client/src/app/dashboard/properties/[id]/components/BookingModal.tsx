"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import RangeDatePicker from "./DatePicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "@/config/axios.config";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/spinner";
import Image from "next/image";

const today = new Date();
today.setHours(0, 0, 0, 0);

const bookingSchema = z
  .object({
    checkIn: z.date({ required_error: "Check-in date is required" }),
    checkOut: z.date({ required_error: "Check-out date is required" }),
  })
  .superRefine(({ checkIn, checkOut }, ctx) => {
    if (checkIn < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-in date cannot be in the past",
        path: ["checkIn"],
      });
    }
    if (checkOut <= checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-out date must be after check-in date",
        path: ["checkOut"],
      });
    }
  });

interface BookingModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  property: Property;
}

interface BookingFormValues {
  checkIn: Date;
  checkOut: Date;
}

export default function BookingModal({ isOpen, setIsOpen, property }: BookingModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { checkIn: today, checkOut: today },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.max(1, (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * property.price;
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post("/booking", {
        propertyId: property.id,
        checkIn,
        checkOut,
      });

      toast.success(response.data.message);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl p-6">
        <DialogTitle className="text-2xl font-semibold border-b pb-4">Book Reservation</DialogTitle>
        <div className="flex gap-3">
          <Image src={property.thumbnail} alt={property.title} width={200} height={200} className="w-[240px] h-[200px] object-cover rounded-lg mb-4 border" />

          <div className="w-full space-y-2">
            <h1 className="text-2xl font-semibold">{property.title}</h1>
            <p className="line-clamp-4 leading-relaxed">{property.description}</p>
            <h1 className="text-3xl border p-1.5 px-3 rounded-xl">
              ${property.price.toLocaleString("en-us", { maximumFractionDigits: 2 })}
              <span className="text-gray-500 text-base"> /night</span>
            </h1>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <Controller
            name="checkIn"
            control={control}
            render={({ field }) => (
              <RangeDatePicker
                date={{ from: field.value, to: checkOut }}
                onDateChange={(range) => {
                  if (range?.from) setValue("checkIn", range.from);
                  if (range?.to) setValue("checkOut", range.to);
                }}
              />
            )}
          />
          {errors.checkIn?.message && <p className="text-red-500 text-sm">{String(errors.checkIn.message)}</p>}
          {errors.checkOut?.message && <p className="text-red-500 text-sm">{String(errors.checkOut.message)}</p>}

          <div className="text-xl font-semibold">Total Price: ${calculateTotal().toLocaleString("en-us", { maximumFractionDigits: 2 })}</div>

          <Button
            className="w-full px-5 h-14 text-base bg-blue-500 hover:bg-blue-400 rounded-lg text-white"
            disabled={!checkIn || !checkOut || loading}
            onClick={handleSubmit(onSubmit)}>
            {loading ? <Spinner /> : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
