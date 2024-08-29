import "react-responsive-carousel/lib/styles/carousel.min.css";
import Strip from "@/components/home/Strip";

export default async function Home() {
  return (
    <main className="mx-auto max-w-[min(80rem,100%)] px-4">
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
            <a href="/shop" className="button gray lg">
              Shop New
            </a>
            <a href="/shop" className="button main lg">
              All items
            </a>
          </div>
        </div>
        <div className="mb-4">
          <Strip />
        </div>
      </div>
    </main>
  );
}
