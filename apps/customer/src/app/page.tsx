import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default async function Home() {
  return (
    <main className="mx-auto w-full max-w-[min(80rem,100%)] px-4">
      <div className="overflow-hidden rounded-xl border">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-4 text-center md:gap-4">
          <p className="text-secondary text-2xl font-semibold md:text-4xl">
            Elevate Your Style,{" "}
            <span className="text-main-500">Tag Your Trend</span>
          </p>
          <p className="text-secondary text-lg md:text-xl">
            Shop +200,000 items
          </p>
          <div className="flex gap-2">
            <Link href="/shop" className="button main lg">
              All items
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
