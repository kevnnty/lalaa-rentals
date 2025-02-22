"use client";

import { DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { updateUser } from "@/lib/store/features/auth/auth.slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface VerifyEmailOtpFormProps {
  email: string;
}

export default function VerifyEmailOtpForm({ email }: VerifyEmailOtpFormProps) {
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [isNewOtpRequestPending, setIsNewRequestPending] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>("");
  const { isLoggedIn, currentUser } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const { closeAuthModal } = useAuthModal();

  if (isLoggedIn && !!currentUser) {
    email = currentUser.email;
  }

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = async () => {
    if (!canResend) return;
    setIsNewRequestPending(true);
    setCanResend(false);
    try {
      const response = await axiosClient.post("/users/accounts/verify-email/resend-code", { email });
      setTimer(30);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message || "Error resending OTP");
    } finally {
      setIsNewRequestPending(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (otp.length === 4) {
        handleVerifyOtp();
      }
    }, 100);
    return () => clearTimeout(timerId);
  }, [otp]);

  const handleVerifyOtp = async () => {
    if (!/^\d{4}$/.test(otp)) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }

    setIsPending(true);
    setError("");

    try {
      const response = await axiosClient.post("/users/accounts/verify-email", { email, otp });
      toast.success(response.data.message);

      if (isLoggedIn) {
        dispatch(updateUser({ isVerified: true }));
        closeAuthModal();
      } else {
        router.push("/auth/login");
        closeAuthModal();
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Error verifying OTP");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-full max-w-[400px] mx-auto space-y-5 py-10">
        <div className="space-y-3">
          <DialogTitle>Verify your email</DialogTitle>
          <p className="text-[#454C52] text-center text-[16px]">
            A 4-digit verification code has been sent to your email. Please use it to complete the verification process.
          </p>
        </div>

        <div className="space-y-2 flex justify-center">
          <InputOTP maxLength={4} onChange={(value) => setOtp(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-[70px] w-[75px]" />
              <InputOTPSlot index={1} className="h-[70px] w-[75px]" />
              <InputOTPSlot index={2} className="h-[70px] w-[75px]" />
              <InputOTPSlot index={3} className="h-[70px] w-[75px]" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          onClick={handleVerifyOtp}
          className={`!mt-8 bg-blue-500 h-16 rounded-full text-[16px] uppercase w-full text-white data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed flex items-center justify-center`}
          disabled={isPending || isNewOtpRequestPending}>
          {isPending ? <Spinner /> : "Continue"}
        </button>

        <p className="text-primary-red text-center">{`00:${timer.toString().padStart(2, "0")}`}</p>

        <p className="text-center text-[#808080] !mt-2">
          If you didn’t receive a code!{" "}
          <button
            disabled={isPending || isNewOtpRequestPending}
            onClick={handleResend}
            className={`underline ${canResend ? "text-primary-red cursor-pointer font-semibold" : "cursor-not-allowed"}`}>
            <span className="flex items-center gap-2">
              Resend{isNewOtpRequestPending && "ing"} {isNewOtpRequestPending && <Spinner size={12} color="#000" />}
            </span>
          </button>
        </p>
      </div>
    </div>
  );
}
