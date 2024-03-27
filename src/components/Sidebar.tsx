"use client";
import { useUser } from "@/utils";
import {
  RiArrowRightSLine,
  RiHomeLine,
  RiSettingsLine,
  RiShoppingBag2Line,
  RiTShirt2Line,
} from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const user = useUser();

  const [options] = useState([
    { label: "Home", icon: <RiHomeLine size={20} />, link: "/" },
    { label: "Items", icon: <RiTShirt2Line size={20} />, link: "/items" },
    {
      label: "Orders",
      icon: <RiShoppingBag2Line size={20} />,
      link: "/orders",
    },
    {
      label: "Settings",
      icon: <RiSettingsLine size={20} />,
      link: "/settings",
    },
  ]);

  if (pathname === "/login" || pathname === "/item/new") return null;

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-none flex-col gap-3 border-r ${collapsed ? "p-3" : "p-5"}`}
    >
      <div className="flex-grow">
        {collapsed ? null : (
          <p className="subheading-xsmall mb-1.5 p-1 text-text-400">Menu</p>
        )}
        <nav className="flex flex-col gap-1">
          {options.map((option) => (
            <Link
              href={option.link}
              key={option.label}
              className={`relative flex items-center justify-between gap-3 rounded-lg font-medium transition-all hover:bg-bg-100 ${collapsed ? "p-2" : "px-3 py-2"} ${
                (option.link === "/settings" &&
                  pathname.startsWith(option.link)) ||
                pathname === option.link
                  ? "bg-bg-100 text-text-900"
                  : "text-text-500"
              }`}
            >
              <span
                className={`absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-lg bg-main-base transition-all ${
                  (option.link === "/settings" &&
                    pathname.startsWith(option.link)) ||
                  pathname === option.link
                    ? "-left-5"
                    : "-left-6"
                }`}
              />
              <span className="flex items-center gap-2">
                <span
                  className={
                    "h-fit transition-all " +
                    ((option.link === "/settings" &&
                      pathname.startsWith(option.link)) ||
                    pathname === option.link
                      ? "text-main-base"
                      : "text-icon-500")
                  }
                >
                  {option.icon}
                </span>
                {collapsed ? null : <span>{option.label}</span>}
              </span>
              <RiArrowRightSLine
                size={20}
                className={
                  "transition-all " +
                  ((option.link === "/settings" &&
                    pathname.startsWith(option.link)) ||
                  pathname === option.link
                    ? "text-icon-500"
                    : "text-bg-100")
                }
              />
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t" />
      {collapsed ? (
        <div className="p-1">
          <div className="size-8 rounded-full bg-gray-100" />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-1 pt-3">
          <div className="size-10 rounded-full bg-gray-100" />
          <div className="flex min-w-32 flex-col gap-1 text-sm">
            <p className="label-small">{user?.name}</p>
            <p className="paragraph-xsmall text-text-500">{user?.email}</p>
          </div>
          <RiArrowRightSLine size={20} className="text-icon-500" />
        </div>
      )}
    </aside>
  );
}
