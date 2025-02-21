import AuthProvider from "@/providers/AuthProvider";
import React from "react";

export default function RenterPagesLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider requiredRole="RENTER">{children}</AuthProvider>;
}
