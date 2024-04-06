"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LinkHandler({
  href,
  target,
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string | URL;
  target?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      target={target}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();

        if (href !== pathname)
          window.dispatchEvent(new Event("myCustomEvent", { bubbles: true }));
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}
