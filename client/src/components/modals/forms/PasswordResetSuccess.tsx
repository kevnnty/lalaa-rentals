"use client";
import { DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

export default function PasswordResetSuccess({ setMode }: { setMode: (mode: "login") => void }) {
  return (
    <div className="relative">
      <div className="w-full max-w-[400px] mx-auto space-y-5 py-10">
        <Image src="/gifs/animated-checkmark.gif" alt="" width={200} height={200} className="-mt-3 mx-auto relative z-[1]" />
        <div className="space-y-3">
          <DialogTitle>Successful</DialogTitle>
          <p className="text-[#454C52] text-center">Your password has been reset successfully</p>
        </div>
        <button onClick={() => setMode("login")} className="!mt-8 bg-blue-500 h-16 rounded-full text-[16px] uppercase w-full text-white">
          Continue
        </button>
      </div>
    </div>
  );
}
