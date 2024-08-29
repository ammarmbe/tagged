"use client";
import Sidebar from "@/components/item/new/Sidebar";
import BackButton from "@/components/item/new/BackButton";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[calc(100vh-32px)] flex-grow flex-col sm:flex-row">
      <Sidebar />
      <div className="relative z-10 flex min-h-0 min-w-0 flex-grow flex-col items-center gap-10 overflow-auto">
        <BackButton />
        {children}
      </div>
    </div>
  );
}
