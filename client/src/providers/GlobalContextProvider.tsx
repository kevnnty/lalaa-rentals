import { AuthModalProvider } from "@/context/AuthModalContext";
import React from "react";
import AuthProvider from "./AuthProvider";

// global file for all contexts
export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthModalProvider>
      <AuthProvider requireLogin={false} redirectPath="/">
        {children}
      </AuthProvider>
    </AuthModalProvider>
  );
}
