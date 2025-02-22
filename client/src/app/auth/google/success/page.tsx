"use client";

import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { login } from "@/lib/store/features/auth/auth.slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function GoogleSuccessPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");

  useEffect(() => {
    if (!accessToken) {
      toast.error("Missing access token.");
      router.push("/auth/login");
      return;
    }

    dispatch(login({ accessToken }));
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    fetchProfile();
  }, [dispatch]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/users/accounts/me");
      dispatch(login({ user: response.data.data, accessToken: accessToken }));
      router.replace("/dashboard");
    } catch (error: any) {
      toast.error("Failed to authenticate. Please try again.");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] w-full flex flex-col gap-4 justify-center items-center">
        <Spinner size={40} color="#000" />
        Authenticating...
      </div>
    );

  return null;
}
