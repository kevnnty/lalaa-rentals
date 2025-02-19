"use client";

import { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "@/config/axios.config";
import Spinner from "@/components/ui/spinner";
import Image from "next/image";
import toast from "react-hot-toast";
import { DialogTitle } from "@/components/ui/dialog";

export default function ForgotPasswordForm({ setMode, setEmail }: { setMode: (mode: "verifyPasswordResetOtp") => void; setEmail: (value: string) => void }) {
  const [isPending, setIsPending] = useState(false);

  const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setIsPending(true);
    try {
      const response = await axiosClient.post("/auth/forgot-password", data);

      toast.success(response.data.message);
      setEmail(data.email);
      setMode("verifyPasswordResetOtp");
    } catch (error: any) {
      toast.error(error.response?.data.message || "Failed to send verification code");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(handleForgotPassword)} className="w-full max-w-[400px] mx-auto space-y-5 py-10">
        <div className="space-y-3">
          <DialogTitle>Forgot Your Password?</DialogTitle>
          <p className="text-[#454C52] text-center text-[16px]">Enter your email for the verification process. We will send a 4-digit code to your email.</p>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Email</label>
          <div className="bg-[#F4F7FC] border-2 border-[#E7E7E7] w-full rounded-xl">
            <input type="email" {...register("email")} className="bg-transparent p-4 h-16 w-full outline-none" placeholder="Enter your email" />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="!mt-8 bg-blue-500 h-16 rounded-full text-[16px] uppercase w-full text-white flex justify-center items-center data-[disabled]:opacity-80 data-[disabled]:cursor-default">
          {isPending ? <Spinner /> : "Continue"}
        </button>
      </form>
    </div>
  );
}
