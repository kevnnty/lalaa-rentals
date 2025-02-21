import { AuthModalProvider } from "@/context/AuthModalContext";
import React from "react";

// global file for all contexts
export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  return <AuthModalProvider>{children}</AuthModalProvider>;
}
