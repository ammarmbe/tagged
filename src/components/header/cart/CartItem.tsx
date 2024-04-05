"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, X } from "lucide-react";
import Link from "@/utils/Link";
import { Dispatch, SetStateAction } from "react";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

export default function CartItem({
  item,
  setItems,
  index,
}: {
  item: {
    id: string;
    store_nano_id: string;
    nano_id: string;
    discount: number;
    item_id: string;
    image_url: string;
    quantity: number;
    color: string;
    size: string;
    item_name: string;
    store_name: string;
    store_id: string;
    price: number;
    allowed_gov: string;
    shipping_price: number;
  };
  setItems: Dispatch<
    SetStateAction<
      {
        id: string;
        store_nano_id: string;
        nano_id: string;
        item_id: string;
        image_url: string;
        discount: number;
        quantity: number;
        color: string;
        size: string;
        item_name: string;
        store_name: string;
        store_id: string;
        price: number;
        allowed_gov: string;
        shipping_price: number;
      }[]
    >
  >;
  index: number;
}) {
  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationKey: ["delete-cart", item.id],
    mutationFn: async () => {
      await fetch("/api/cart", {
        method: "DELETE",
        body: JSON.stringify({ id: item.id }),
      });
    },
    onMutate() {
      queryClient.setQueryData(["cart"], (prev: (typeof item)[] | undefined) =>
        prev?.filter(
          (i) =>
            i.item_id !== item.item_id ||
            i.color !== item.color ||
            i.size !== item.size,
        ),
      );

      queryClient.setQueryData(
        ["checkout"],
        (prev: (typeof item)[] | undefined) =>
          prev?.filter(
            (i) =>
              i.item_id !== item.item_id ||
              i.color !== item.color ||
              i.size !== item.size,
          ),
      );

      queryClient.setQueryData(["cart-count"], (prev: number | undefined) =>
        prev ? prev - item.quantity : prev,
      );
    },
    async onError() {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      await queryClient.invalidateQueries({ queryKey: ["cart-count"] });
      await queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });

  const debounce = useDebouncedCallback(async () => {
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({
        id: item.item_id,
        quantity: item.quantity,
        type: "set",
        color: item.color,
        size: item.size,
      }),
    });
  }, 500);

  return (
    <div className="grid grid-cols-[auto,1fr] items-start gap-4 rounded-lg border p-3">
      <div className="relative size-28">
        <AspectRatio.Root ratio={1}>
          <Image
            src={item.image_url}
            alt={item.item_name}
            fill
            className="rounded-md object-cover"
          />
        </AspectRatio.Root>
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <Link
            href={`/item/${item.nano_id}`}
            className="text-secondary truncate font-semibold"
          >
            {item.item_name}
          </Link>
          <button
            type="button"
            className="button secondary h-fit self-start justify-self-end !p-1.5"
            onClick={() => {
              removeMutation.mutate();
            }}
          >
            <X size={16} />
          </button>
        </div>
        <Link
          href={`/shop/store/${item.store_nano_id}`}
          className="font-medium text-main-500"
        >
          {item.store_name}
        </Link>
        <p className="text-tertiary my-1">
          {item.color} / {item.size}
        </p>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <p className="text-tertiary flex flex-wrap gap-x-2 font-medium">
            {item.discount ? (
              <span className="line-through">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                  currencyDisplay: "symbol",
                }).format(item.price)}
              </span>
            ) : null}
            <span className="text-secondary">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "EGP",
                currencyDisplay: "symbol",
              }).format(item.price - (item.discount || 0))}
            </span>
          </p>
          <div className="text-secondary border-primary flex w-fit divide-x divide-gray-300 rounded-md border shadow-sm">
            <button
              type="button"
              className="disabled:text-quaternary active:bg-primary rounded-l-md p-1 transition-all hover:bg-gray-100 active:shadow-[0_0_0_4px_#98a2b324] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:active:shadow-none"
              onClick={() => {
                if (item.quantity === 1) {
                  removeMutation.mutate();
                  return;
                }

                setItems((prev) =>
                  prev.map((i, iIndex) => {
                    if (iIndex === index) {
                      return { ...i, quantity: i.quantity - 1 };
                    }
                    return i;
                  }),
                );

                queryClient.setQueryData(
                  ["cart-count"],
                  (prev: number) => prev - 1,
                );

                debounce();
              }}
            >
              <Minus size={16} />
            </button>
            <span className="px-4">{item.quantity}</span>
            <button
              type="button"
              className="disabled:text-quaternary active:bg-primary rounded-r-md p-1 transition-all hover:bg-gray-100 active:shadow-[0_0_0_4px_#98a2b324] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:active:shadow-none"
              disabled={item.quantity >= 10}
              onClick={() => {
                setItems((prev) =>
                  prev.map((i, iIndex) => {
                    if (iIndex === index) {
                      return { ...i, quantity: i.quantity + 1 };
                    }
                    return i;
                  }),
                );

                queryClient.setQueryData(
                  ["cart-count"],
                  (prev: number) => prev + 1,
                );

                debounce();
              }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
