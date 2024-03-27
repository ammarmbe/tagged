import Link from "next/link";
import {
  RiUserLine,
  RiArrowRightSLine,
  RiShip2Line,
  RiShieldUserLine,
} from "react-icons/ri";

export default function Sidebar({ page }: { page: string }) {
  return (
    <aside className="flex h-screen w-fit flex-none flex-col gap-5 border-r p-5">
      <div>
        <p className="label-large">Settings</p>
        <p className="paragraph-small mt-1 text-text-500">
          Choose between categories.
        </p>
      </div>
      <div className="border-t" />
      <nav>
        <Link
          href="/settings/profile"
          className={`label-small flex gap-1.5 rounded-lg p-2 transition-all hover:text-text-900 ${page === "profile" ? "bg-bg-100" : "text-text-500"}`}
        >
          <RiUserLine
            size={20}
            className={page === "profile" ? "text-main-base" : "text-text-500"}
          />
          <span className="flex-grow pr-5">Profile</span>
          <span
            className={`rounded-full bg-white text-text-500 shadow-sm ${page === "profile" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
        <Link
          href="/settings/shipping"
          className={`label-small flex gap-1.5 rounded-lg p-2 transition-all hover:text-text-900 ${page === "shipping" ? "bg-bg-100" : "text-text-500"}`}
        >
          <RiShip2Line
            size={20}
            className={page === "shipping" ? "text-main-base" : "text-text-500"}
          />
          <span className="flex-grow pr-5">Shipping</span>
          <span
            className={`rounded-full bg-white text-text-500 shadow-sm ${page === "shipping" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
        <Link
          href="/settings/privacy"
          className={`label-small flex gap-1.5 rounded-lg p-2 transition-all hover:text-text-900 ${page === "privacy" ? "bg-bg-100" : "text-text-500"}`}
        >
          <RiShieldUserLine
            size={20}
            className={page === "privacy" ? "text-main-base" : "text-text-500"}
          />
          <span className="flex-grow pr-5">Privacy & Security</span>
          <span
            className={`rounded-full bg-white text-text-500 shadow-sm ${page === "privacy" ? "" : "opacity-0"}`}
          >
            <RiArrowRightSLine size={20} />
          </span>
        </Link>
      </nav>
    </aside>
  );
}
