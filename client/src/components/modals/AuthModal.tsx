"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ForgotPasswordForm from "./forms/ForgotPasswordForm";
import PasswordResetSuccess from "./forms/PasswordResetSuccess";
import ResetPasswordForm from "./forms/ResetPasswordForm";
import VerifyEmailOtpForm from "./forms/VerifyEmailOtpForm";
import VerifyPasswordResetOtpForm from "./forms/VerifyPasswordResetOtpForm";

type Mode = "login" | "signup" | "forgotPassword" | "verifyPasswordResetOtp" | "resetPassword" | "passwordResetSuccess" | "verifyEmailOtp";
interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode?: Mode | null;
  setMode: (mode: Mode) => void;
  canClose: boolean;
  data: any;
}

export function AuthModal({ isOpen, setIsOpen, mode, setMode, canClose, data }: AuthModalProps) {
  const [email, setEmail] = useState(data?.email ?? "");

  useEffect(() => {
    if (data?.email) {
      setEmail(data?.email);
    }
  }, [data?.email]);

  const handleOpenChange = (isOpen: boolean) => {
    if (canClose) {
      setIsOpen(isOpen);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case "forgotPassword":
        return <ForgotPasswordForm setMode={setMode} setEmail={setEmail} />;
      case "verifyPasswordResetOtp":
        return <VerifyPasswordResetOtpForm setMode={setMode} email={email} />;
      case "resetPassword":
        return <ResetPasswordForm setMode={setMode} email={email} />;
      case "passwordResetSuccess":
        return <PasswordResetSuccess setMode={setMode} />;
      case "verifyEmailOtp":
        return <VerifyEmailOtpForm email={email} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full">
            {renderForm()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
