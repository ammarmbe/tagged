"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Spinner from "../Spinner";
import Link from "@/utils/Link";
import Image from "next/image";

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const currentParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams();
  const queryClient = useQueryClient();
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    setValue(currentParams.get("name") || "");
  }, [currentParams, pathname]);

  const {
    data: items,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      const res = await fetch(`/api/search?term=${value}`);
      return res.json() as Promise<
        {
          item_nano_id: number;
          image_url: string | null;
          item_name: string;
          store_name: string;
          store_nano_id: number;
          price: number;
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, value, currentParams]);

  return (
    <>
      <div className="relative hidden max-w-[500px] flex-grow sm:block">
        <Dialog.Root open={focus} onOpenChange={setFocus}>
          <Dialog.Overlay
            className="fixed inset-0 z-20 bg-black/15 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            onClick={() => setFocus(false)}
          />
        </Dialog.Root>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            queryClient.cancelQueries({
              queryKey: ["shop-all"],
            });

            params.set("name", value);
            params.delete;
            router.push(`/shop?${params.toString()}`);
          }}
          className="relative z-[30]"
          onClick={() => setFocus(true)}
        >
          <input
            type="search"
            autoComplete="off"
            placeholder="Search for an item"
            className="input !relative z-[30] !rounded-none !border-none bg-transparent font-normal !shadow-none focus:rounded-b-none"
            id="searchItems"
            onFocus={() => setFocus(true)}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button
            type="submit"
            className="text-quaternary absolute right-[4px] top-[4px] z-[30] p-2"
          >
            <Search size={18} />
          </button>
          <div
            className={`bg-primary border-primary absolute top-0 w-full rounded-lg border ${focus ? "!border-main-500 shadow-[0_0_5px_4px_#b59aed71]" : "shadow-sm"}`}
          >
            <div className="left-0 h-[40px] w-full"></div>
            <div className={`${focus ? "" : "hidden"}`}>
              {isFetching ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner size="md" />
                </div>
              ) : items?.length ? (
                <div className="divide">
                  {items?.map((item) => (
                    <div
                      key={item.item_nano_id}
                      onMouseEnter={() => {
                        queryClient.prefetchQuery({
                          queryKey: ["item", item.item_nano_id],
                          queryFn: async () => {
                            const res = await fetch(
                              `/api/item?nano_id=${item.item_nano_id}`,
                            );
                            return await res.json();
                          },
                        });
                      }}
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/item/${item.item_nano_id}`);
                        setFocus(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          router.push(`/item/${item.item_nano_id}`);
                          setFocus(false);
                        }
                      }}
                      className="grid cursor-pointer grid-cols-[auto,1fr] items-start gap-4 p-3 last:rounded-b-lg hover:bg-gray-100"
                    >
                      <div className="relative size-[4.5rem] flex-none overflow-hidden rounded-md bg-gray-200">
                        <Image
                          src={item.image_url ?? ""}
                          alt={item.item_name}
                          fill
                          objectFit="cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between gap-3">
                          <Link
                            href={`/item/${item.item_nano_id}`}
                            className="text-secondary truncate font-medium"
                          >
                            {item.item_name}
                          </Link>
                        </div>
                        <Link
                          href={`/shop/store/${item.item_nano_id}`}
                          className="font-medium text-main-500"
                        >
                          {item.store_name}
                        </Link>
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <p className="text-tertiary font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "EGP",
                              currencyDisplay: "symbol",
                            }).format(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : value ? (
                <h3 className="text-tertiary p-4 text-center text-sm font-medium">
                  No items found...
                </h3>
              ) : null}
            </div>
          </div>
        </form>
      </div>
      <div className="block sm:hidden">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="button-secondary !p-2" type="button">
              <Search size={20} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="bg-background bg-primary fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col justify-start shadow-lg transition duration-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              <div className="flex gap-4 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    queryClient.cancelQueries({
                      queryKey: ["shop-all"],
                    });

                    params.set("name", value);
                    params.delete;
                    router.push(`/shop?${params.toString()}`);
                  }}
                  className="relative w-full"
                >
                  <input
                    type="search"
                    autoComplete="off"
                    placeholder="Search for an item"
                    className="input"
                    id="searchItems"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                  />
                  <button
                    type="submit"
                    className="text-quaternary absolute right-[4px] top-[4px] p-2"
                  >
                    <Search size={18} />
                  </button>
                </form>
                <Dialog.Close className="button-secondary h-fit !p-2">
                  <X />
                </Dialog.Close>
              </div>
              {isFetching ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner size="md" />
                </div>
              ) : items?.length ? (
                <div className="divide">
                  {items?.map((item) => (
                    <Dialog.Close key={item.item_nano_id} asChild>
                      <div
                        onMouseEnter={() => {
                          queryClient.prefetchQuery({
                            queryKey: ["item", item.item_nano_id],
                            queryFn: async () => {
                              const res = await fetch(
                                `/api/item?nano_id=${item.item_nano_id}`,
                              );
                              return await res.json();
                            },
                          });
                        }}
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/item/${item.item_nano_id}`);
                          setFocus(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            router.push(`/item/${item.item_nano_id}`);
                            setFocus(false);
                          }
                        }}
                        className="grid cursor-pointer grid-cols-[auto,1fr] items-start gap-4 p-4 last:rounded-b-lg hover:bg-gray-100"
                      >
                        <div className="size-[72px] flex-none rounded-md bg-gray-200"></div>
                        <div>
                          <div className="flex items-baseline justify-between gap-3">
                            <Link
                              href={`/item/${item.item_nano_id}`}
                              className="text-secondary truncate font-medium"
                            >
                              {item.item_name}
                            </Link>
                          </div>
                          <Link
                            href={`/shop/store/${item.item_nano_id}`}
                            className="font-medium text-main-500"
                          >
                            {item.store_name}
                          </Link>
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <p className="text-tertiary font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "EGP",
                                currencyDisplay: "symbol",
                              }).format(item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Dialog.Close>
                  ))}
                </div>
              ) : value ? (
                <h3 className="text-tertiary p-4 text-center text-sm font-medium">
                  No items found...
                </h3>
              ) : null}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  );
}
