import Link from "next/link";
import {
  RiUserLine,
  RiArrowRightSLine,
  RiShip2Line,
  RiShieldUserLine,
} from "react-icons/ri";

export default function Sidebar({ page }: { page: string }) {
  return (
    <aside className="sm:bg-bg-0 bg-bg-50 flex flex-none flex-col gap-5 border-t p-3 sm:h-screen sm:w-fit sm:border-r sm:border-t-0 sm:p-5">
      <div className="hidden sm:block">
        <p className="label-large">Settings</p>
        <p className="paragraph-small text-text-600 mt-1">
          Manage your account settings
        </p>
      </div>
      <div className="hidden border-t sm:block" />
      <nav className="grid grid-cols-3 gap-3 sm:block">
        <Link
          href="/settings/profile"
          className={`label-small hover:text-text-950 flex justify-center gap-1.5 rounded-lg p-2 transition-all sm:justify-start ${page === "profile" ? "bg-bg-0 sm:bg-bg-50 shadow-sm sm:shadow-none" : "text-text-600"}`}
        >
          <RiUserLine
            size={20}
            className={
              page === "profile"
                ? "text-main-base"
                : "text-text-600 sm:bg-bg-0 bg-bg-50"
            }
          />
          <span className="hidden flex-grow pr-5 sm:inline">Profile</span>
          <span
            className={`bg-bg-0 text-text-600 hidden rounded-full shadow-sm sm:inline ${page === "profile" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
        <Link
          href="/settings/shipping"
          className={`label-small hover:text-text-950 flex justify-center gap-1.5 rounded-lg p-2 transition-all sm:justify-start ${page === "shipping" ? "bg-bg-0 sm:bg-bg-50 shadow-sm sm:shadow-none" : "text-text-600"}`}
        >
          <RiShip2Line
            size={20}
            className={page === "shipping" ? "text-main-base" : "text-text-600"}
          />
          <span className="hidden flex-grow pr-5 sm:inline">Shipping</span>
          <span
            className={`bg-bg-0 text-text-600 hidden rounded-full shadow-sm sm:inline ${page === "shipping" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
        <Link
          href="/settings/appearance"
          className={`label-small hover:text-text-950 flex justify-center gap-1.5 rounded-lg p-2 transition-all sm:justify-start ${page === "appearance" ? "bg-bg-0 sm:bg-bg-50 shadow-sm sm:shadow-none" : "text-text-600 sm:bg-bg-0 bg-bg-50"}`}
        >
          <RiShieldUserLine
            size={20}
            className={
              page === "appearance" ? "text-main-base" : "text-text-600"
            }
          />
          <span className="hidden flex-grow pr-5 sm:inline">Appearance</span>
          <span
            className={`bg-bg-0 text-text-600 hidden rounded-full shadow-sm sm:inline ${page === "appearance" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
      </nav>
    </aside>
  );
}
