"use client";

import GoogleIcon from "@/components/icons/GoogleIcon";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { API_URL } from "@/lib/api";
import { login } from "@/lib/store/features/auth/auth.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { House } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { RegisterForm, registerSchema } from "./validation";
import { useAuthModal } from "@/context/AuthModalContext";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as "RENTER" | "HOST" | null;
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    if (role !== "RENTER" && role !== "HOST") {
      router.push("/");
    }
  }, []);

  const userRole = role;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setLoading(true);
    const userData = { ...data, role: userRole };

    toast
      .promise(axiosClient.post("/users/accounts/register", userData), {
        loading: "Creating account...",
        success: (response) => {
          openAuthModal("verifyEmailOtp", false, { email: data.email });
          return response?.data?.message || "Account created!";
        },
        error: (err) => err.response?.data?.message || err.message || "Registration failed. Please try again later.",
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${API_URL}/auth/google?role=${role}`;
  };

  return (
    <div className="relative z-[20] mx-auto w-full max-w-3xl flex flex-col">
      <div className="pb-5 w-full flex flex-col items-center space-y-2">
        <House size={40} color="#3b82f6" />
        <h1 className="font-bold text-xl text-blue-500">Lalaa Rentals</h1>
      </div>
      <div className="bg-white p-10 rounded-3xl border border-gray-100 w-full flex flex-col space-y-5">
        <h2 className="text-3xl font-bold text-center mb-4">Create account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="w-full flex gap-3">
            <div className="w-full space-y-1">
              <label className="block text-sm font-semibold mb-2">First Name</label>
              <Input type="text" placeholder="Enter your first name" {...register("firstName")} />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            <div className="w-full space-y-1">
              <label className="block text-sm font-semibold mb-2">Last Name</label>
              <Input type="text" placeholder="Enter your last name" {...register("lastName")} />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <Input type="email" placeholder="Enter your email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <Input type="password" placeholder="Enter your password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" onCheckedChange={(value: boolean) => setValue("terms", value, { shouldValidate: true })} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Accept terms and conditions
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-2 h-14 bg-blue-500 text-white rounded-xl disabled:opacity-80">
            {loading ? <Spinner /> : "Continue"}
          </button>
        </form>
        <div className="w-full flex items-center gap-3">
          <span className="bg-gray-200 h-0.5 w-full"></span>
          <span className="text-gray-500">OR</span>
          <span className="bg-gray-200 h-0.5 w-full"></span>
        </div>
        <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border p-4 rounded-full">
          <GoogleIcon />
          <span className="font-semibold">Sign up with Google</span>
        </button>
      </div>
      <p className="text-center mt-5">
        Already have an account{" "}
        <Link href="/auth/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
