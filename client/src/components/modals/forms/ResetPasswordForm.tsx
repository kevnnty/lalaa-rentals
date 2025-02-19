"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "@/config/axios.config";
import Spinner from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { DialogTitle } from "@/components/ui/dialog";

export default function ResetPasswordForm({ setMode, email }: { setMode: (mode: "passwordResetSuccess") => void; email: string }) {
  const [isPending, setIsPending] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const resetPasswordSchema = z
    .object({
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords must match",
    });

  type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const toggleVisibility = (field: "newPassword" | "confirmPassword") => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleResetPassword: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    setIsPending(true);
    try {
      const response = await axiosClient.put("/auth/reset-password", {
        email,
        newPassword: data.newPassword,
      });

      toast.success(response.data.message);
      setMode("passwordResetSuccess");
    } catch (error: any) {
      toast.error(error.response?.data.message || "Failed to reset password");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(handleResetPassword)} className="w-full max-w-[400px] mx-auto space-y-5 py-10">
        <div className="space-y-2">
          <DialogTitle>New Password</DialogTitle>
          <p className="text-primary-paragraph text-center text-[16px]">Set the new password for your account so you can log in and access all features.</p>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">New Password</label>
          <div className="bg-[#F4F7FC] border-2 border-[#E7E7E7] w-full rounded-xl flex items-center pr-3">
            <input
              type={passwordVisibility.newPassword ? "text" : "password"}
              {...register("newPassword")}
              className="bg-transparent p-4 h-16 w-full outline-none"
              placeholder="Enter your password"
            />
            <button type="button" onClick={() => toggleVisibility("newPassword")} className="text-[#808080]">
              {passwordVisibility.newPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Confirm Password</label>
          <div className="bg-[#F4F7FC] border-2 border-[#E7E7E7] w-full rounded-xl flex items-center pr-3">
            <input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="bg-transparent p-4 h-16 w-full outline-none"
              placeholder="Confirm your password"
            />
            <button type="button" onClick={() => toggleVisibility("confirmPassword")} className="text-[#808080]">
              {passwordVisibility.confirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="!mt-8 bg-blue-500 h-16 rounded-full text-[16px] uppercase w-full text-white flex justify-center items-center data-[disabled]:opacity-80 data-[disabled]:cursor-default">
          {isPending ? <Spinner /> : "Update Password"}
        </button>
      </form>
    </div>
  );
}
