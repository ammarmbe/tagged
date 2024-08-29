import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "@/components/primitives/Link";
import { FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="relative bottom-0 mx-auto w-full max-w-7xl flex-none p-4">
      <footer className="flex flex-col gap-8 rounded-xl bg-main-900 px-8 py-12 text-main-200 sm:px-20">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div className="flex flex-col gap-6 text-main-100">
            <Image
              src="/logo.svg"
              height={30}
              width={105}
              alt="Tagged Logo"
              className="invert"
            />
            <p className="text-balance">Elevate Your Style, Tag Your Trend</p>
            <nav className="grid w-full grid-cols-2 flex-wrap gap-x-6 gap-y-3 font-medium sm:flex">
              <Link href="/shop?category=dresses">Dresses</Link>
              <Link href="/shop?category=jeans">Jeans</Link>
              <Link href="/shop?category=sweatpants">Sweatpants</Link>
              <Link href="/shop">All Items</Link>
              <Link href="/">Sell With Us</Link>
            </nav>
          </div>
          <div className="flex flex-none flex-col gap-3">
            <p className="text-sm font-medium text-main-100">Get the app</p>
            <Image
              src="/play-store.svg"
              height={40}
              width={135}
              alt="Google Play Store"
            />
            <Image
              src="/app-store.svg"
              height={40}
              width={135}
              alt="Apple App Store"
            />
          </div>
        </div>
        <div className="border-t border-main-950/30" />
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-between gap-6 text-sm sm:flex-row-reverse">
            <div className="flex gap-4">
              <Instagram size={20} />
              <Facebook size={20} />
              <FaTiktok size={20} />
            </div>
            <p>
              &copy; {new Date().getFullYear()} Tagged. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
