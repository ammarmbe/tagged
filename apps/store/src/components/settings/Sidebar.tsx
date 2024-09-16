import Link from "next/link";
import {
  RiUserLine,
  RiArrowRightSLine,
  RiShip2Line,
  RiShieldUserLine,
} from "react-icons/ri";

export default function Sidebar({ page }: { page: string }) {
  return (
    <aside className="flex flex-none flex-col gap-5 border-t bg-bg-50 p-3 sm:h-screen sm:w-fit sm:border-r sm:border-t-0 sm:bg-bg-0 sm:p-5">
      <div className="hidden sm:block">
        <p className="label-large">Settings</p>
        <p className="paragraph-small mt-1 text-text-600">
          Manage your account settings
        </p>
      </div>
      <div className="hidden border-t sm:block" />
      <nav className="grid grid-cols-3 gap-3 sm:block">
        <Link
          href="/settings/profile"
          className={`label-small flex justify-center gap-1.5 rounded-lg p-2 transition-all hover:text-text-950 sm:justify-start ${page === "profile" ? "bg-bg-0 shadow-sm sm:bg-bg-50 sm:shadow-none" : "text-text-600"}`}
        >
          <RiUserLine
            size={20}
            className={
              page === "profile"
                ? "text-main-base"
                : "bg-bg-50 text-text-600 sm:bg-bg-0"
            }
          />
          <span className="hidden flex-grow pr-5 sm:inline">Profile</span>
          <span
            className={`hidden rounded-full bg-bg-0 text-text-600 shadow-sm sm:inline ${page === "profile" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
        <Link
          href="/settings/shipping"
          className={`label-small flex justify-center gap-1.5 rounded-lg p-2 transition-all hover:text-text-950 sm:justify-start ${page === "shipping" ? "bg-bg-0 shadow-sm sm:bg-bg-50 sm:shadow-none" : "text-text-600"}`}
        >
          <RiShip2Line
            size={20}
            className={page === "shipping" ? "text-main-base" : "text-text-600"}
          />
          <span className="hidden flex-grow pr-5 sm:inline">Shipping</span>
          <span
            className={`hidden rounded-full bg-bg-0 text-text-600 shadow-sm sm:inline ${page === "shipping" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
        <Link
          href="/settings/appearance"
          className={`label-small flex justify-center gap-1.5 rounded-lg p-2 transition-all hover:text-text-950 sm:justify-start ${page === "appearance" ? "bg-bg-0 shadow-sm sm:bg-bg-50 sm:shadow-none" : "bg-bg-50 text-text-600 sm:bg-bg-0"}`}
        >
          <RiShieldUserLine
            size={20}
            className={
              page === "appearance" ? "text-main-base" : "text-text-600"
            }
          />
          <span className="hidden flex-grow pr-5 sm:inline">Appearance</span>
          <span
            className={`hidden rounded-full bg-bg-0 text-text-600 shadow-sm sm:inline ${page === "appearance" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
      </nav>
    </aside>
  );
}
