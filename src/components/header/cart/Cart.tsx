"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, X } from "lucide-react";
import Spinner from "../../Spinner";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import Link from "@/utils/Link";

export default function Cart() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [items, setItems] = useState<
    {
      id: string;
      store_nano_id: string;
      store_id: string;
      item_id: string;
      nano_id: string;
      discount: number;
      item_name: string;
      store_name: string;
      price: number;
      quantity: number;
      color: string;
      size: string;
      allowed_gov: string;
      shipping_price: number;
    }[]
  >([]);

  const { data: count, isLoading } = useQuery({
    queryKey: ["cart-count"],
    queryFn: async () => {
      const response = await fetch("/api/cart/count");
      const data = (await response.json()) as number;
      return data;
    },
  });

  const { data, isLoading: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      const data = (await response.json()) as {
        id: string;
        store_id: string;
        item_id: string;
        store_nano_id: string;
        nano_id: string;
        item_name: string;
        store_name: string;
        discount: number;
        price: number;
        quantity: number;
        color: string;
        size: string;
        allowed_gov: string;
        shipping_price: number;
      }[];
      return data;
    },
  });

  useEffect(() => {
    data &&
      setItems(
        data.map((item) => ({ ...item, quantity: Number(item.quantity) })),
      );
  }, [data]);

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger asChild>
        <button className="button secondary relative !p-2" type="button">
          <ShoppingBag size={20} />
          {count && count > 0 ? (
            <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-gray-700 text-xs font-semibold text-white">
              {count}
            </span>
          ) : null}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 hidden bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:block" />
        <Dialog.Content className="bg-background bg-primary fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col justify-between gap-4 shadow-lg transition duration-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:w-3/4 sm:max-w-md sm:border-l sm:ease-in-out sm:data-[state=closed]:duration-300 sm:data-[state=open]:duration-500 sm:data-[state=closed]:fade-out-100 sm:data-[state=open]:fade-in-100 sm:data-[state=closed]:slide-out-to-right sm:data-[state=open]:slide-in-from-right">
          <Dialog.Close className="button secondary !absolute right-4 top-4 !p-2">
            <X />
          </Dialog.Close>
          <h2 className="text-secondary p-6 pb-0 text-xl font-semibold">
            Your Cart
          </h2>
          {isLoading || cartIsLoading ? (
            <div className="relative flex flex-grow items-center justify-center overflow-hidden p-6">
              <Spinner size="lg" />
            </div>
          ) : count == 0 ? (
            <>
              <div className="relative flex h-full flex-grow items-center justify-center overflow-hidden p-6">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+100px)]">
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
                  <h3 className="text-xl font-medium">Your cart is empty</h3>
                  <p className="text-tertiary mt-2 px-5">
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                </div>
              </div>
              <div />
            </>
          ) : (
            <>
              <div className="flex flex-grow flex-col justify-start gap-3 p-6 pt-0">
                {items?.map((item, index) => (
                  <CartItem
                    key={item.item_id + item.color + item.size}
                    item={item}
                    index={index}
                    setItems={setItems}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center justify-between border-t px-6 py-4">
                <div className="mb-4 flex w-full items-baseline justify-between">
                  <p className="text-secondary text-lg font-medium">Total</p>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "EGP",
                      currencyDisplay: "symbol",
                    }).format(
                      items.reduce(
                        (acc, item) =>
                          acc + (item.price - item.discount) * item.quantity,
                        0,
                      ),
                    )}
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className="button main sm:lg md w-full justify-center"
                  onClick={() => setDialogOpen(false)}
                >
                  Check Out
                </Link>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
