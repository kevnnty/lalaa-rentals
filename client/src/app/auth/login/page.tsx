"use client";

import { useState } from "react";
import { loginSchema, LoginForm } from "./validation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "@/config/axios.config";
import { API_URL } from "@/lib/api";
import { useDispatch } from "react-redux";
import { login } from "@/lib/store/features/auth/auth.slice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { House } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/ui/spinner";
import GoogleIcon from "@/components/icons/GoogleIcon";

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    toast
      .promise(
        axiosClient.post("/auth/login", data).then((response) => {
          dispatch(login({ accessToken: response.data.data.accessToken, user: response.data.data.user }));
          router.push("/dashboard");
        }),
        {
          loading: "Logging in...",
          success: "Login successful!",
          error: (err) => err.response?.data?.message || err.message || "Account creation failed. Please try again later.",
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="relative z-[20] mx-auto w-full max-w-[500px] flex flex-col">
      <div className="pb-5 w-full flex flex-col items-center space-y-2">
        <House size={40} color="#3b82f6" />
        <h1 className="font-bold text-xl text-blue-500">Lalaa Rentals</h1>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 w-full flex flex-col space-y-5">
        <h2 className="text-3xl font-bold text-center mb-4">Welcome back</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="space-y-1">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <Input type="email" placeholder="Enter your email" {...register("email")} className="w-full p-3 h-14 border border-gray-200 rounded-xl" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <Input type="password" placeholder="Enter your password" {...register("password")} className="w-full p-3 h-14 border border-gray-200 rounded-xl" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <label htmlFor="remember-me" className="mt-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </label>
            </div>
            <p className="text-blue-500 cursor-pointer">Forgot Password?</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-2 h-14 bg-blue-500 text-white rounded-xl disabled:opacity-80">
            {loading ? <Spinner /> : "Sign in"}
          </button>
        </form>
        <div className="w-full flex items-center gap-3">
          <span className="bg-gray-200 h-0.5 w-full"></span>
          <span className="text-gray-500">OR</span>
          <span className="bg-gray-200 h-0.5 w-full"></span>
        </div>
        <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border p-4 rounded-full">
          <GoogleIcon />
          <span className="font-semibold">Sign in with Google</span>
        </button>
      </div>
      <p className="text-center mt-3">
        Don't have an account{" "}
        <Link href="/" className="underline">
          Sign up
        </Link>{" "}
      </p>
    </div>
  );
};

export default Login;
