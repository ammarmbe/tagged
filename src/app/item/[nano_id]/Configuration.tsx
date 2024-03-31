"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Item } from "./page";
import { useState } from "react";
import { User } from "lucia";
import { useRouter } from "next/navigation";
import { toast } from "@/utils/toast/use-toast";
import {
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@radix-ui/react-toast";
import Image from "next/image";

export default function Configuration({
  item,
  user,
}: {
  item: Item;
  user: User | null;
}) {
  const [selected, setSelected] = useState<{
    color_id: number;
    size_id: number;
  }>({
    color_id: 0,
    size_id: 0,
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const cartMutation = useMutation({
    mutationKey: ["cart"],
    mutationFn: async (data: {
      id: string;
      color: string;
      size: string;
      buy_now?: boolean;
    }) => {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, quantity: 1, type: "add" }),
      });

      return data.buy_now;
    },
    onMutate: () => {
      queryClient.setQueryData(["cart-count"], (prev: number) => prev + 1);
      queryClient.setQueryData(["cart"], (prev: any) => {
        if (prev.find((i: any) => i.item_id === item.item_id)) {
          return prev.map((i: any) => {
            if (i.item_id === item.item_id) {
              return { ...i, quantity: i.quantity + 1 };
            }
            return i;
          });
        }

        toast({
          toast_content: (
            <div className="flex gap-2">
              <Image
                width={38}
                height={38}
                src="/check.svg"
                alt="check"
                className="-ml-2 -mt-2 h-fit flex-none"
              />
              <div className="flex flex-col gap-2">
                <div className="space-y-1">
                  <ToastTitle>Added to cart</ToastTitle>
                  <ToastDescription>
                    {item.item_name} has been added to your cart
                  </ToastDescription>
                </div>
                <ToastClose className="text-tertiary w-fit text-sm font-semibold">
                  Dismiss
                </ToastClose>
              </div>
            </div>
          ),
        });

        return [
          ...prev,
          {
            id: Math.random().toString(),
            item_id: item.item_id,
            store_id: item?.store_id,
            store_name: item?.store_name,
            item_name: item?.item_name,
            price: item?.price,
            quantity: 1,
            color: item?.colors[selected.color_id].name,
            size: item?.sizes[selected.size_id],
          },
        ];
      });
    },
    onSuccess: (data) => {
      if (!data) queryClient.invalidateQueries({ queryKey: ["cart"] });
      else router.push("/checkout");
    },
  });

  return (
    <>
      <div className="mt-4">
        <p className="text-secondary mb-2 text-sm font-medium">Colors</p>
        <div className="flex items-center gap-3">
          {item.colors.map((color, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected({ ...selected, color_id: i })}
              className="h-9 w-9 cursor-pointer rounded-md shadow-sm hover:opacity-90"
            >
              <div
                className={`h-full w-full rounded-md transition-shadow ${
                  i === selected.color_id
                    ? "shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#9e77ed] active:shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#9e77ed,0_0_0_8px_#9e77ed3D]"
                    : ""
                }`}
                style={{ backgroundColor: color.value }}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <p className="text-secondary mb-1.5 text-sm font-medium">Sizes</p>
        <div className="flex items-center gap-2.5">
          {item.sizes.map((size, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected({ ...selected, size_id: i })}
              className={`button gray sm:lg md !text-secondary !border-2 !px-3.5 !py-1.5 hover:!bg-white ${
                selected.size_id === i
                  ? "active:!bg-primary !border-main-500 active:!shadow-[0_0_0_4px_#9e77ed3D,0_1px_2px_0_#1018280D]"
                  : "!border-primary active:!shadow-[0_0_0_4px_#98a2b324,_0_1px_2px_0_#1018280d]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3">
        <button
          disabled={
            (item.configurations.find(
              (config) =>
                config.color === item.colors[selected.color_id].name &&
                config.size === item.sizes[selected.size_id],
            )?.quantity || 0) == 0 || cartMutation.isPending
          }
          onClick={() => {
            if (
              item.configurations.find(
                (config) =>
                  config.color === item.colors[selected.color_id].name &&
                  config.size === item.sizes[selected.size_id],
              )?.quantity != 0
            ) {
              cartMutation.mutate({
                id: item.item_id,
                color: item.colors[selected.color_id].name,
                size: item.sizes[selected.size_id],
              });
            }
          }}
          className="button gray sm:lg md justify-center"
        >
          {item.configurations.find(
            (config) =>
              config.color === item.colors[selected.color_id].name &&
              config.size === item.sizes[selected.size_id],
          )?.quantity == 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>
        <button
          disabled={
            (item.configurations.find(
              (config) =>
                config.color === item.colors[selected.color_id].name &&
                config.size === item.sizes[selected.size_id],
            )?.quantity || 0) == 0
          }
          className="sm:lg md hover:bg-primary active:bg-primary inline-flex items-center justify-center gap-2 rounded-lg border border-main-500 bg-main-500 px-3 py-2 font-medium text-white shadow-sm transition-all hover:text-main-500 active:border-main-600 active:text-main-600 active:!shadow-[0_0_0_4px_#9e77ed3d,0_1px_2px_0_#1018280d] disabled:cursor-not-allowed disabled:border-main-400 disabled:bg-main-400 disabled:text-white"
          onClick={() => {
            if (
              item.configurations.find(
                (config) =>
                  config.color === item.colors[selected.color_id].name &&
                  config.size === item.sizes[selected.size_id],
              )?.quantity != 0
            ) {
              cartMutation.mutate({
                id: item.item_id,
                color: item.colors[selected.color_id].name,
                size: item.sizes[selected.size_id],
                buy_now: true,
              });
            }
          }}
        >
          {item.configurations.find(
            (config) =>
              config.color === item.colors[selected.color_id].name &&
              config.size === item.sizes[selected.size_id],
          )?.quantity == 0
            ? "Out of Stock"
            : "Buy Now"}
        </button>
      </div>
    </>
  );
}
