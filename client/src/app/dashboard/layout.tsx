import React from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import PageTransition from "@/providers/PageTransition";
import AuthProvider from "@/providers/AuthProvider";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex items-start overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-screen flex flex-col bg-slate-50 p-5">
          <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden">
            <Navbar />
            <div className="flex-1 flex flex-col overflow-y-auto p-5">
              <PageTransition classNames="flex-1">{children}</PageTransition>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
