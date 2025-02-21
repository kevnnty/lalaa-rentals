"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import { AppDispatch } from "@/lib/store";
import { fetchCurrentUser } from "@/lib/store/features/auth/auth.actions";
import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface AuthProviderProps {
  requiredRole?: "RENTER" | "HOST";
  redirectPath?: string;
  children: React.ReactNode;
}

export default function AuthProvider({ requiredRole, redirectPath = "/", children }: AuthProviderProps) {
  const { isLoggedIn, currentUser } = useAuth();
  const { openAuthModal } = useAuthModal();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (isLoggedIn) {
          dispatch(fetchCurrentUser()).unwrap();
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchUserData();
    else setLoading(false);
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        toast.error("You must be logged in to access this resource");
        router.replace(redirectPath);
        return;
      }

      if (requiredRole && requiredRole !== currentUser?.role) {
        toast.error("You don't have permission to access this resource.");
        router.replace(redirectPath);
        return;
      }

      if (isLoggedIn && !currentUser?.isVerified) {
        openAuthModal("verifyEmailOtp", true);
      }
    }
  }, [isLoggedIn, currentUser, requiredRole, router, redirectPath, loading, openAuthModal]);

  if (loading) return null;
  if (!isLoggedIn || (requiredRole && requiredRole !== currentUser?.role)) return null;

  return <>{children}</>;
}
