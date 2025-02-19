"use client";

import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { login } from "@/lib/store/features/auth/auth.slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function GoogleSuccessPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/users/accounts/me");
      dispatch(login(response.data));
      router.replace("/marketplace");
    } catch (error: any) {
      toast.error(error.message);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [dispatch]);

  if (loading)
    return (
      <div className="h-[80vh] w-full flex flex-col gap-4 justify-center items-center">
        <Spinner size={40} color="#000" />
        Authenticating...
      </div>
    );
}
