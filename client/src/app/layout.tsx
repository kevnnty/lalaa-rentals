import type { Metadata } from "next";
import "@/styles/globals.css";
import GlobalApplicationProvider from "@/providers/GlobalApplicationProvider";
import GlobalContextProvider from "@/providers/GlobalContextProvider";

export const metadata: Metadata = {
  title: "Lalaa Rentals",
  description: "Lalaa rentals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <GlobalApplicationProvider>
          <GlobalContextProvider>{children}</GlobalContextProvider>
        </GlobalApplicationProvider>
      </body>
    </html>
  );
}
