"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React, { Fragment } from "react";

export default function Progressbar({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <ProgressBar height="4px" color="#3b82f6" options={{ showSpinner: false }} />
      {children}
    </Fragment>
  );
}
