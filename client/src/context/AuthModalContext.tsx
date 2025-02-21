"use client";

import { AuthModal } from "@/components/modals/AuthModal";
import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type Mode = "login" | "signup" | "forgotPassword" | "verifyPasswordResetOtp" | "resetPassword" | "passwordResetSuccess" | "verifyEmailOtp";

interface AuthModalContextType {
  openAuthModal: (mode?: Mode, preventClose?: boolean, data?: any) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<Mode | undefined>();
  const [canClose, setCanClose] = useState(true);
  const { currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const modalFromQuery = searchParams.get("auth-mode");
    if (
      modalFromQuery &&
      ["login", "signup", "forgotPassword", "verifyPasswordResetOtp", "resetPassword", "passwordResetSuccess", "verifyEmailOtp"].includes(modalFromQuery)
    ) {
      setAuthModalMode(modalFromQuery as Mode);
      setIsAuthModalOpen(true);
    } else {
      setIsAuthModalOpen(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentUser?.isVerified) {
      setCanClose(true);
      setIsAuthModalOpen(false);
    }
  }, [currentUser?.isVerified]);

  const openAuthModal = (mode?: Mode, preventClose = false, data?: any) => {
    setAuthModalMode(mode);
    setCanClose(!preventClose);
    setIsAuthModalOpen(true);
    setData(data);
    router.push(`?auth-mode=${mode}`);
  };

  const closeAuthModal = () => {
    if (canClose) {
      setIsAuthModalOpen(false);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("auth-mode");
      router.push(newUrl.toString());
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setAuthModalMode(newMode);
    router.push(`?auth-mode=${newMode}`);
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} mode={authModalMode} setMode={handleModeChange} canClose={canClose} data={data} />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
