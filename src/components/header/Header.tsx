import Link from "@/utils/Link";
import getUser from "@/utils/getUser";
import Image from "next/image";
import { generalSans } from "@/utils";
import Account from "./Account";
// import SearchBar from "../SearchBar";

export default async function Header() {
  const { user } = await getUser();

  return (
    <header className="text-tertiary mx-auto w-full max-w-7xl p-4 font-medium">
      <div className="rounded-xl border">
        <div className="flex items-center justify-between gap-4 p-4 md:gap-6">
          <div className="flex flex-grow gap-4 md:gap-6">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" height={28} width={28} alt="Atlas Logo" />
              <h1
                className={`select-none text-2xl font-semibold leading-[1.125] text-gray-900 ${generalSans.className}`}
              >
                <Link href="/">Atlas</Link>
              </h1>
            </div>
            {/* <SearchBar /> */}
          </div>
          {!user ? (
            <div className="flex space-x-3">
              <Link
                className="button sm:md !border-none hover:text-gray-800"
                href="/sign-in"
              >
                Sign in
              </Link>
              <Link className="button main sm:md" href="/sign-up">
                Sign up
              </Link>
            </div>
          ) : (
            <Account user={user} />
          )}
        </div>
        <div className="border-t" />
        <nav className="text-tertiary space-x-5 p-4 py-2.5 text-sm">
          <Link className="hover:text-gray-800" href="/shop?category=hoodies">
            Hoodies
          </Link>
          <Link className="hover:text-gray-800" href="/shop?category=jeans">
            Jeans
          </Link>
          <Link className="hover:text-gray-800" href="/shop">
            All Items
          </Link>
        </nav>
      </div>
    </header>
  );
}
