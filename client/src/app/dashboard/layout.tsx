import AuthProvider from "@/providers/AuthProvider";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider requiredRole="RENTER">
      <div>{children}</div>;
    </AuthProvider>
  );
}
