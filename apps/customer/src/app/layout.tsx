import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/utils/QueryClientProvider";
import Header from "@/components/header/Header";
import LoadingBar from "@/utils/LoadingBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/utils/toast/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tagged",
  description: "Tagged is an e-commerce platform for clothing and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          inter.className + " flex min-h-screen flex-col justify-between"
        }
      >
        <Analytics />
        <QueryClientProvider>
          <LoadingBar />
          <Toaster />
          <Header />
          <div className="flex max-w-full flex-grow flex-col">{children}</div>
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
