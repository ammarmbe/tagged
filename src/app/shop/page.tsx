"use client";
import Spinner from "@/components/Spinner";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { Filter, Grid, Grid2X2, ShoppingBag, X } from "lucide-react";
import Filters from "./Filters";
import InfiniteScroll from "react-infinite-scroll-component";
import Item from "@/components/Item";
import { usePathname, useRouter } from "next/navigation";

export interface TFilter {
  name?: string;
  category?: string;
  store_ids?: string[];
  price_min?: number;
  price_max?: number;
  sale?: boolean;
  colors?: string[];
  in_stock?: boolean;
  out_of_stock?: boolean;
}

export default function ShopAll({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [largeView, setLargeView] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => {
    const f: TFilter = {};

    if (searchParams.name) f.name = searchParams.name as string;
    if (searchParams.category) f.category = searchParams.category as string;
    if (searchParams.store_ids)
      f.store_ids = [searchParams.store_ids as string].flat();
    if (searchParams.price_min) f.price_min = Number(searchParams.price_min);
    if (searchParams.price_max) f.price_max = Number(searchParams.price_max);
    if (searchParams.sale) f.sale = searchParams.sale === "true";
    if (searchParams.colors) f.colors = [searchParams.colors as string].flat();
    if (searchParams.in_stock) f.in_stock = searchParams.in_stock === "true";
    if (searchParams.out_of_stock)
      f.out_of_stock = searchParams.out_of_stock === "true";

    return f;
  }, [searchParams]);

  const {
    data: items,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["shop-all"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch("/api/shop", {
        method: "POST",
        body: JSON.stringify({
          id: pageParam,
          ...filters,
        }),
      });

      return (await res.json()) as {
        item_name: string;
        item_id: string;
        store_name: string;
        nano_id: string;
        store_nano_id: string;
        store_id: string;
        description: string;
        price: number;
        discount: number;
        out_of_stock: boolean;
        colors: string[];
      }[];
    },
    getNextPageParam: (lastPage) =>
      lastPage.length === 10 ? lastPage.length : undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  if (isLoading)
    return (
      <div className="mx-auto w-full max-w-[min(100%,80rem)] flex-grow px-4">
        <div className="flex flex-grow items-center justify-center rounded-xl border p-10">
          <div className="mx-6 my-7 flex items-start justify-between gap-10">
            <Spinner />
          </div>
        </div>
      </div>
    );

  if (items)
    return (
      <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
        <div className="flex-grow overflow-visible rounded-xl border">
          <div className="mx-6 my-7 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-xl font-semibold capitalize">
              Shop {filters.category ?? "All"}
            </h2>
          </div>
          <div className="border-t" />
          <div
            className={`flex flex-col ${Object.keys(filters).length ? "justify-between" : "justify-end"} gap-3 p-3 sm:flex-row `}
          >
            {Object.keys(filters).length ? (
              <div className="flex gap-3">
                {Object.keys(filters).map((filter) => {
                  if (
                    // @ts-ignore
                    !filters[filter] ||
                    ((filter === "in_stock" || filter === "out_of_stock") &&
                      filters.in_stock === filters.out_of_stock)
                  )
                    return null;

                  return (
                    <div
                      key={filter}
                      className="button gray hover:!bg-primary active:!shadow-sm"
                    >
                      <span className="font-medium">
                        {(() => {
                          switch (filter) {
                            case "name":
                              return filters.name;
                            case "category":
                              return (
                                <span className="capitalize">
                                  {filters.category}
                                </span>
                              );
                            case "store_ids":
                              return `${filters.store_ids?.length} store${filters.store_ids?.length === 1 ? "" : "s"}`;
                            case "price_min":
                              return (
                                "> " +
                                new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currencyDisplay: "symbol",
                                  currency: "EGP",
                                }).format(filters.price_min || 0)
                              );
                            case "price_max":
                              return (
                                "< " +
                                new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currencyDisplay: "symbol",
                                  currency: "EGP",
                                }).format(filters.price_max || 0)
                              );
                            case "sale":
                              return filters.sale ? "Sale" : null;
                            case "colors":
                              return `${filters.colors?.length} color${filters.colors?.length === 1 ? "" : "s"}`;
                            case "in_stock":
                              return filters.in_stock !== filters.out_of_stock
                                ? filters.in_stock
                                  ? "In stock"
                                  : null
                                : null;
                            case "out_of_stock":
                              return filters.in_stock !== filters.out_of_stock
                                ? filters.out_of_stock
                                  ? "Out of stock"
                                  : null
                                : null;
                          }
                        })()}
                      </span>
                      <button
                        onClick={() => {
                          // remove from url search params
                          const s = new URLSearchParams(window.location.search);

                          s.delete(filter);

                          router.push(pathname + "?" + s.toString());
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
            <div className="flex gap-3">
              <Dialog.Root open={filtersOpen} onOpenChange={setFiltersOpen}>
                <Dialog.Trigger asChild>
                  <button className="button gray md" disabled={isLoading}>
                    <Filter size={18} /> Filters
                  </button>
                </Dialog.Trigger>
                <Filters searchParams={searchParams} />
              </Dialog.Root>
              <button
                onClick={() => setLargeView(!largeView)}
                className="button gray md flex-none !p-[11px] md:hidden"
              >
                {largeView ? <Grid size={18} /> : <Grid2X2 size={18} />}
              </button>
            </div>
          </div>
          <div className="border-t" />
          <InfiniteScroll
            dataLength={items.pages.flat().length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className="flex items-center justify-center p-5">
                <Spinner size="sm" />
              </div>
            }
            endMessage={
              items.pages.flat().length ? (
                <div className="flex items-center justify-center p-4 pt-2 sm:p-6 sm:pt-3">
                  <p className="text-quaternary font-medium">No more items</p>
                </div>
              ) : null
            }
          >
            {items.pages.flat().length ? (
              <div
                className={`grid gap-4 p-4 sm:gap-5 sm:p-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${largeView ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {items.pages.flat().map((item, index) => (
                  <Item item={item} key={item.item_id + index} />
                ))}
              </div>
            ) : (
              <div className="h-full flex-grow items-center justify-center overflow-hidden p-6">
                <div className="relative left-1/2 -my-48 mx-auto -mb-52 w-fit -translate-x-1/2 sm:left-auto sm:translate-x-0">
                  <svg
                    width="566"
                    height="566"
                    viewBox="0 0 566 566"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Cart button</title>
                    <mask
                      id="mask0_4_24"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="566"
                      height="566"
                    >
                      <rect
                        width="566"
                        height="566"
                        fill="url(#paint0_radial_4_24)"
                      />
                    </mask>
                    <g mask="url(#mask0_4_24)">
                      <circle cx="283" cy="283" r="56.1" stroke="#EAECF0" />
                      <circle cx="283" cy="283" r="282.5" stroke="#EAECF0" />
                      <circle cx="283" cy="283" r="244.767" stroke="#EAECF0" />
                      <circle cx="283" cy="283" r="207.033" stroke="#EAECF0" />
                      <circle cx="283" cy="283" r="93.8333" stroke="#EAECF0" />
                      <circle cx="283" cy="283" r="130.387" stroke="#EAECF0" />
                      <circle cx="283" cy="283" r="169.3" stroke="#EAECF0" />
                    </g>
                    <defs>
                      <radialGradient
                        id="paint0_radial_4_24"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(283 283) rotate(90) scale(283)"
                      >
                        <stop />
                        <stop offset="1" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                  <div
                    style={{
                      boxShadow: "0 1px 2px 0 #1018280D",
                    }}
                    className="text-secondary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border p-3.5"
                  >
                    <ShoppingBag size={28} />
                  </div>
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-lg font-medium">No items found...</h3>
                  <p className="text-tertiary">
                    No items match your selected filters.
                  </p>
                </div>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    );
}
