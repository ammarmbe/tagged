import CartItem from "@/components/header/cart/CartItem";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ShoppingBag, HelpCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Items({
  cart,
  governorate,
}: {
  cart: {
    id: string;
    item_id: string;
    nano_id: string;
    store_id: string;
    item_name: string;
    store_name: string;
    price: number;
    quantity: number;
    color: string;
    discount: number;
    size: string;
    allowed_gov: string;
    shipping_price: number;
  }[];
  governorate: { value: string; label: string };
}) {
  const [items, setItems] = useState(cart);

  useEffect(() => {
    if (cart) setItems(cart);
  }, [cart]);

  return (
    <>
      <div className="flex max-h-[1000px] flex-grow flex-col justify-start gap-3 overflow-auto">
        {items.length ? (
          items.map((item, index) => (
            <CartItem
              key={item.item_id + item.color + item.size}
              item={item}
              index={index}
              setItems={setItems}
            />
          ))
        ) : (
          <div className="relative flex h-full flex-grow flex-col items-center justify-center overflow-hidden p-6">
            <div className="absolute left-1/2 mx-auto flex -translate-x-1/2 items-center justify-center">
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
            <div className="relative z-10 pt-40 text-center">
              <h3 className="text-xl font-medium">Your cart is empty</h3>
              <p className="text-tertiary">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex w-full items-baseline justify-between">
          <p className="text-tertiary font-medium">Subtotal</p>
          <p className="text-tertiary font-medium">
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
        <p className="text-tertiary mt-2 flex items-center gap-1.5 font-medium">
          Shipping
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger
                className="flex cursor-help items-center justify-center"
                type="button"
              >
                <HelpCircle size={16} className="inline" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="rounded-md bg-[#0C111D] px-3 py-2 text-xs font-medium text-white shadow-lg animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
                  Shipping is calculated based on the brands you are buying from
                  <Tooltip.Arrow className="-mt-[1px]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </p>
        <div className="ml-5 mt-1">
          {Array.from(new Set(items.map((item) => item.store_id))).map(
            (ship) => (
              <div
                key={items.find((item) => item.store_id === ship)?.store_id}
                className={`flex w-full items-baseline justify-between ${
                  items
                    .find((item) => item.store_id === ship)
                    ?.allowed_gov?.includes(governorate.value)
                    ? "text-tertiary"
                    : "text-error-600"
                }`}
              >
                <p className="flex items-center gap-1.5 font-medium">
                  {items.find((item) => item.store_id === ship)?.store_name}
                  {!items
                    .find((item) => item.store_id === ship)
                    ?.allowed_gov?.includes(governorate.value) ? (
                    <Tooltip.Provider>
                      <Tooltip.Root delayDuration={100}>
                        <Tooltip.Trigger className="flex cursor-help items-center justify-center">
                          <AlertCircle size={16} className="inline" />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="rounded-md bg-[#0C111D] px-3 py-2 text-xs font-medium text-white shadow-lg animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
                            {
                              items.find((item) => item.store_id === ship)
                                ?.store_name
                            }{" "}
                            does not ship to {governorate.label}
                            <Tooltip.Arrow className="-mt-[1px]" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  ) : null}
                </p>
                <p className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                    currencyDisplay: "symbol",
                  }).format(
                    items.find((item) => item.store_id === ship)
                      ?.shipping_price || 0,
                  )}
                </p>
              </div>
            ),
          )}
        </div>
        <div className="mt-2 flex w-full items-baseline justify-between">
          <p className="text-tertiary font-medium">Total shipping</p>
          <p className="text-tertiary font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EGP",
              currencyDisplay: "symbol",
            }).format(
              items
                .reduce<
                  {
                    store_id: string;
                    shipping_price: number;
                  }[]
                >((acc, item) => {
                  if (acc.find((a) => a.store_id === item.store_id)) return acc;
                  return acc.concat({
                    store_id: item.store_id,
                    shipping_price: item.shipping_price,
                  });
                }, [])
                .reduce((acc, item) => acc + item.shipping_price, 0),
            )}
          </p>
        </div>
        <div className="mt-2 flex w-full items-baseline justify-between">
          <p className="text-secondary font-medium">Total</p>
          <p className="font-semibold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EGP",
              currencyDisplay: "symbol",
            }).format(
              Number(
                items.reduce(
                  (acc, item) =>
                    acc + (item.price - item.discount) * item.quantity,
                  0,
                ),
              ) +
                Number(
                  items
                    .reduce<
                      {
                        store_id: string;
                        shipping_price: number;
                      }[]
                    >((acc, item) => {
                      if (acc.find((a) => a.store_id === item.store_id))
                        return acc;
                      return acc.concat({
                        store_id: item.store_id,
                        shipping_price: item.shipping_price,
                      });
                    }, [])
                    .reduce((acc, item) => acc + item.shipping_price, 0),
                ),
            )}
          </p>
        </div>
      </div>
    </>
  );
}
