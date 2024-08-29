"use client";
import { useUser } from "@/utils";
import {
  RiArrowRightSLine,
  RiHomeLine,
  RiSettings2Line,
  RiShoppingBag2Line,
  RiTShirt2Line,
} from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const [options] = useState([
    {
      label: "Home",
      icon: <RiHomeLine size={20} className="size-6 sm:size-5" />,
      link: "/",
    },
    {
      label: "Items",
      icon: <RiTShirt2Line size={20} className="size-6 sm:size-5" />,
      link: "/items",
    },
    {
      label: "Orders",
      icon: <RiShoppingBag2Line size={20} className="size-6 sm:size-5" />,
      link: "/orders",
    },
    {
      label: "Settings",
      icon: <RiSettings2Line size={20} className="size-6 sm:size-5" />,
      link: "/settings",
    },
  ]);

  useLayoutEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (pathname === "/login" || pathname.startsWith("/item/new")) return null;

  return (
    <>
      <aside
        className={`flex flex-none flex-col gap-3 border-t sm:hidden ${pathname.startsWith("/settings") ? "" : "shadow-sm"}`}
      >
        <div className="flex-grow p-3">
          <nav className="grid grid-cols-4 gap-1">
            {options.map((option) => (
              <Link
                href={option.link}
                key={option.label}
                className={`relative flex items-center justify-center rounded-lg p-2 font-medium transition-all hover:bg-bg-50 ${
                  (option.link === "/settings" &&
                    pathname.startsWith(option.link)) ||
                  pathname === option.link
                    ? "bg-bg-50 text-text-950"
                    : "text-text-600"
                }`}
              >
                <span
                  className={
                    "transition-all " +
                    ((option.link === "/settings" &&
                      pathname.startsWith(option.link)) ||
                    pathname === option.link
                      ? "text-main-base"
                      : "text-text-600")
                  }
                >
                  {option.icon}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <aside className="sticky top-0 hidden h-[calc(100vh-32px)] flex-none flex-col gap-3 border-r sm:flex">
        <div
          className={`flex-grow ${pathname.startsWith("/settings") ? "p-3" : "p-5"}`}
        >
          {pathname.startsWith("/settings") ? null : (
            <p className="subheading-xsmall mb-1.5 p-1 text-text-400">Menu</p>
          )}
          <nav className="flex flex-col gap-1">
            {options.map((option) => (
              <Link
                href={option.link}
                key={option.label}
                className={`relative flex items-center justify-between gap-3 rounded-lg font-medium transition-all hover:bg-bg-50 ${pathname.startsWith("/settings") ? "p-2" : "px-3 py-2"} ${
                  (option.link === "/settings" &&
                    pathname.startsWith(option.link)) ||
                  pathname === option.link
                    ? "bg-bg-50 text-text-950"
                    : "text-text-600"
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
                        : "text-text-600")
                    }
                  >
                    {option.icon}
                  </span>
                  {pathname.startsWith("/settings") ? null : (
                    <span>{option.label}</span>
                  )}
                </span>
                {pathname.startsWith("/settings") ? null : (
                  <RiArrowRightSLine
                    size={20}
                    className={
                      "transition-all " +
                      ((option.link === "/settings" &&
                        pathname.startsWith(option.link)) ||
                      pathname === option.link
                        ? "text-text-600"
                        : "text-text-0")
                    }
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
        {pathname.startsWith("/settings") ? (
          <Link href="/settings/profile" className="group flex flex-col">
            <span className="mx-3 block border-t transition-all group-hover:border-transparent" />
            <span className="block p-4">
              <span className="relative block size-7 rounded-full bg-gray-100">
                {user?.pfp_url ? (
                  <Image
                    fill
                    src={user.pfp_url}
                    alt={user.name}
                    className="rounded-full"
                  />
                ) : null}
              </span>
            </span>
          </Link>
        ) : (
          <Link href="/settings/profile" className="group flex flex-col">
            <span className="mx-5 block border-t transition-all group-hover:border-transparent" />
            <span className="flex items-center gap-3 p-6 pt-5 transition-all group-hover:bg-bg-200">
              <div className="relative flex size-10 overflow-hidden rounded-full">
                {user?.pfp_url ? (
                  <Image
                    fill
                    src={user.pfp_url}
                    alt={user.name}
                    className="rounded-full"
                  />
                ) : null}
                <span className="flex-grow rounded-full bg-gray-100" />
              </div>
              <span className="flex min-w-32 flex-grow flex-col gap-1 text-sm">
                <span className="label-small block">{user?.name}</span>
                <span className="paragraph-xsmall block text-text-600">
                  {user?.email}
                </span>
              </span>
              <RiArrowRightSLine size={20} className="text-text-600" />
            </span>
          </Link>
        )}
      </aside>
    </>
  );
}
