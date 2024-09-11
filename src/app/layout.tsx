import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryClientProvider from "@/utils/QueryClientProvider";
import { Toaster } from "@/components/primitives/toast/Toaster";
import Sidebar from "@/components/Sidebar";
import { Analytics } from "@vercel/analytics/react";

const inter = localFont({
  src: [
    {
      path: "/../../public/InterVariable.ttf",
      style: "normal",
    },
    {
      path: "/../../public/InterVariable-Italic.ttf",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Tagged Dashboard",
  description: "Tagged Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProvider>
        <Analytics />
        <body className={`${inter.className} flex h-screen flex-col`}>
          <div className="label-small flex h-[40px] items-center justify-center bg-white text-center">
            This is a demo version of the app, data-altering actions will not
            work.
          </div>
          <div className="flex h-[calc(100vh-40px)] flex-col-reverse bg-bg-0 text-text-950 sm:flex-row">
            <Toaster />
            <Sidebar />
            {children}
          </div>
        </body>
      </QueryClientProvider>
    </html>
  );
}
