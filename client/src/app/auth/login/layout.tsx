import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome back | Lalaa Rentals",
  description: "Lalaa rentals",
};
import React from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
