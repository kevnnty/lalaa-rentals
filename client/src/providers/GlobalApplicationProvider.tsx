import React from "react";
import PageTransition from "./PageTransition";
import Progressbar from "./Progressbar";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "react-hot-toast";

// global file for all providers
export default function GlobalApplicationProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Progressbar>
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster />
      </Progressbar>
    </>
  );
}
