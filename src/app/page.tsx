import Item from "@/components/Item";
import { getBaseUrl } from "@/utils";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Strip from "@/components/home/Strip";

export default async function Home() {
  const res = await fetch(
    `${getBaseUrl()}/api/home?categories=${["sweatpants", "hoodies", "jeans"].join(",")}&limit=10`,
    {
      cache: "reload",
    },
  );

  const items = (await res.json()) as {
    categories: string[];
    item_name: string;
    item_id: string;
    store_name: string;
    store_id: string;
    description: string;
    price: number;
    discount: number;
    out_of_stock: boolean;
    colors: string[];
  }[];

  return (
    <main className="mx-auto max-w-[min(80rem,100%)] px-4">
      <div className="overflow-hidden rounded-xl border">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-4 text-center md:gap-4">
          <p className="text-secondary text-2xl font-semibold md:text-4xl">
            Lorem Ipsum, Dolor <span className="text-main-500">Sit Amet</span>.
          </p>
          <p className="text-secondary text-lg md:text-xl">
            Shop +200,000 items
          </p>
          <div className="flex gap-2">
            <button className="button gray lg">Test</button>
            <button className="button main lg">Test</button>
          </div>
        </div>
        <div className="mb-4">
          <Strip />
        </div>
        <div className="flex flex-col gap-4 p-6">
          <p className="text-secondary text-lg font-medium">Shop Hoodies</p>
          <div className="flex gap-3 overflow-auto">
            {items
              ?.filter((i) => i.categories.includes("hoodies"))
              .map((item, index) => (
                <div className="min-w-[200px]" key={item.item_id + index}>
                  <Item item={item} />
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <p className="text-secondary text-lg font-medium">Shop Jeans</p>
          <div className="flex gap-3 overflow-auto">
            {items
              ?.filter((i) => i.categories.includes("jeans"))
              .map((item, index) => (
                <div className="min-w-[200px]" key={item.item_id + index}>
                  <Item item={item} />
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <p className="text-secondary text-lg font-medium">Shop Sweatpants</p>
          <div className="flex gap-3 overflow-auto">
            {items
              ?.filter((i) => i.categories.includes("sweatpants"))
              .map((item, index) => (
                <div className="min-w-[200px]" key={item.item_id + index}>
                  <Item item={item} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
