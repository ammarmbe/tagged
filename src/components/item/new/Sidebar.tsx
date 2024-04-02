"use client";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { RiCheckFill, RiArrowRightSLine } from "react-icons/ri";

const levels = [
  {
    pathname: "/item/new",
    title: "Item Details",
  },
  {
    pathname: "/item/new/colors-sizes",
    title: "Colors & Sizes",
  },
  {
    pathname: "/item/new/quantities",
    title: "Quantities",
  },
  {
    pathname: "/item/new/images",
    title: "Images",
  },
  {
    pathname: "/item/new/summary",
    title: "Item Summary",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const itemDetails = queryClient.getQueryData(["itemDetails"]);
    const colors = queryClient.getQueryData(["colors"]);
    const sizes = queryClient.getQueryData(["sizes"]);
    const quantities = queryClient.getQueryData(["quantities"]);
    const images = queryClient.getQueryData(["images"]);

    if (!itemDetails && levels.findIndex((l) => l.pathname === pathname) > 0) {
      router.push("/item/new");
    } else if (
      (!colors || !sizes) &&
      levels.findIndex((l) => l.pathname === pathname) > 1
    ) {
      router.push("/item/new/colors-sizes");
    } else if (
      !quantities &&
      levels.findIndex((l) => l.pathname === pathname) > 2
    ) {
      router.push("/item/new/quantities");
    } else if (
      !images &&
      levels.findIndex((l) => l.pathname === pathname) > 3
    ) {
      router.push("/item/new/images");
    }
  }, [pathname, router, queryClient]);

  return (
    <aside className="flex-none bg-bg-200 p-3 sm:m-2 sm:rounded-2xl sm:p-4">
      <div className="flex flex-grow flex-col gap-3">
        <p className="subheading-xsmall hidden p-1 text-text-400 sm:block">
          New Item
        </p>
        <nav className="grid grid-cols-5 flex-col gap-2 sm:flex">
          {levels.map((level, index) => (
            <div
              key={index}
              className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-[10px] p-2 transition-all ${
                level.pathname === pathname
                  ? "bg-bg-0 shadow-[0px_2px_4px_0px_#1B1C1D0A]"
                  : "text-text-600"
              }`}
            >
              {index < levels.findIndex((l) => l.pathname === pathname) ? (
                <div className="label-xsmall flex size-6 items-center justify-center rounded-full bg-success p-1 text-center !font-semibold text-white shadow-[0px_2px_4px_0px_#1B1C1D0A] transition-all">
                  <RiCheckFill size={16} />
                </div>
              ) : (
                <div
                  className={`label-xsmall flex size-6 items-center justify-center rounded-full p-1 text-center !font-semibold shadow-[0px_2px_4px_0px_#1B1C1D0A] transition-all ${
                    level.pathname === pathname
                      ? "bg-bg-800 text-white"
                      : "bg-bg-0 text-text-600"
                  }`}
                >
                  {index + 1}
                </div>
              )}
              <p className="label-small hidden flex-grow pr-8 sm:block">
                {level.title}
              </p>
              <div
                className={
                  level.pathname === pathname
                    ? "text-text-600 hidden transition-all sm:block"
                    : "hidden opacity-0 transition-all sm:block"
                }
              >
                <RiArrowRightSLine size={20} />
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
