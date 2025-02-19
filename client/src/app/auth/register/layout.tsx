import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account | Lalaa Rentals",
  description: "Lalaa rentals",
};
import React from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
