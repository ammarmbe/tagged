"use client";
import Link from "@/utils/Link";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Item({
  item,
}: {
  item: {
    item_name: string;
    item_id: string;
    store_nano_id: string;
    image_url: string;
    store_name: string;
    store_id: string;
    nano_id: string;
    description: string;
    price: number;
    discount: number;
    out_of_stock: boolean;
    colors: string[];
  };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <div
      className="border-primary relative flex cursor-pointer flex-col rounded-[10px] border p-3 shadow-sm transition-all hover:bg-gray-50 hover:!shadow-none"
      onMouseEnter={async () => {
        await queryClient.prefetchQuery({
          queryKey: ["item", item.nano_id],
          queryFn: async () => {
            const res = await fetch(`/api/item?nano_id=${item.nano_id}`);
            return await res.json();
          },
        });
      }}
      tabIndex={0}
      role="button"
      onClick={() => {
        router.push(`/item/${item.nano_id}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          router.push(`/item/${item.nano_id}`);
        }
      }}
    >
      <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-md bg-gray-100 p-2">
        <Image
          src={item.image_url}
          alt="Image"
          fill
          className="object-cover"
          quality={50}
        />
        <AspectRatio.Root ratio={1} className="flex flex-col justify-between">
          <div className="flex flex-wrap justify-end gap-1">
            {item.out_of_stock ? (
              <div className="rounded-full border border-[#fedf89] bg-[#fffaeb] px-2 py-0.5 text-xs font-medium text-[#b54708]">
                Out of stock
              </div>
            ) : null}
            {item.discount ? (
              <div className="rounded-full border border-[#fecdc9] bg-[#fef3f2] px-2 py-0.5 text-xs font-medium text-[#b32318]">
                Sale
              </div>
            ) : null}
          </div>
          <div className="flex w-fit gap-1.5 self-end rounded-full bg-gray-100/70 p-1 backdrop-blur-md">
            {item.colors.map((color, index) => (
              <div
                key={index}
                className="size-3 rounded-full"
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </AspectRatio.Root>
      </div>
      <h3 className="mt-3 font-medium sm:text-lg">{item.item_name}</h3>
      <p className="text-tertiary text-sm font-medium sm:text-base">
        From{" "}
        <Link
          href={`/shop/store/${item.store_nano_id}`}
          className="font-semibold text-main-500 transition-colors hover:text-main-600"
        >
          {item.store_name}
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2">
        {item.discount ? (
          <p className="text-tertiary text-sm font-semibold line-through">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EGP",
              currencyDisplay: "symbol",
            }).format(item.price)}
          </p>
        ) : (
          <div />
        )}
        <p className="font-semibold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "EGP",
            currencyDisplay: "symbol",
          }).format(item.discount ? item.price - item.discount : item.price)}
        </p>
      </div>
    </div>
  );
}
