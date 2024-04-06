import Link from "@/components/primitives/Link";
import getUser from "@/utils/getUser";
import Image from "next/image";
import Account from "./Account";
import SearchBar from "./SearchBar";

export default async function Header() {
  const { user } = await getUser();

  return (
    <header className="text-tertiary mx-auto w-full max-w-7xl p-4 font-medium">
      <div className="rounded-xl border">
        <div className="flex items-center justify-between gap-1 p-4 md:gap-6">
          <div className="flex flex-grow items-center justify-between gap-4 md:justify-start md:gap-6">
            <Link href="/">
              <Image
                src="/logo.svg"
                height={30}
                width={105}
                alt="Tagged Logo"
                className="mt-1 md:ml-1"
              />
            </Link>
            <SearchBar />
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
