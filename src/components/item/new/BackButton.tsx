"use client";
import Button from "@/components/primitives/Button";
import { usePathname } from "next/navigation";
import { RiArrowLeftLine } from "react-icons/ri";

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

export default function BackButton() {
  const pathname = usePathname();

  return (
    <Button
      href={
        levels[levels.findIndex((l) => l.pathname === pathname) - 1]?.pathname
      }
      color="gray"
      disabled={pathname === "/item/new"}
      className="absolute right-6 top-6 hidden rounded-full border bg-bg-0 p-3 shadow-md sm:block"
      iconLeft={<RiArrowLeftLine />}
    />
  );
}
