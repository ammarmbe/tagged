import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/utils/QueryClientProvider";
import { Toaster } from "@/components/primitives/toast/Toaster";
import Sidebar from "@/components/Sidebar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin-ext"],
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
          <div className="flex h-screen flex-col-reverse bg-bg-0 text-text-950 sm:flex-row">
            <Toaster />
            <Sidebar />
            {children}
          </div>
        </body>
      </QueryClientProvider>
    </html>
  );
}
