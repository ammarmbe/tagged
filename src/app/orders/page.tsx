"use client";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import { ShoppingBag } from "lucide-react";
import Order from "@/components/Order";
import { useRouter } from "next/navigation";
import CancelOrder from "./CancelOrder";
import ReturnOrder from "./ReturnOrder";

type Order = {
  customer_name: string;
  cancel_reason: string;
  apartment: string;
  city: string;
  governorate: string;
  id: number;
  created_at: string;
  phone_number: string;
  shipping_price: number;
  status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "completed"
    | "store_cancelled"
    | "customer_cancelled"
    | "return_requested"
    | "return_declined"
    | "return_accepted"
    | "returned";
  store_name: string;
  store_id: number;
  street: string;
  first_name: string;
  last_name: string;
  total: number;
  nano_id: string;
};

export default function CustomerOrders() {
  const router = useRouter();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      return (await response.json()) as {
        customer_name: string;
        cancel_reason: string;
        apartment: string;
        city: string;
        governorate: string;
        id: number;
        created_at: string;
        phone_number: string;
        shipping_price: number;
        status:
          | "pending"
          | "confirmed"
          | "shipped"
          | "completed"
          | "store_cancelled"
          | "customer_cancelled"
          | "return_requested"
          | "return_declined"
          | "return_accepted"
          | "returned";
        store_name: string;
        store_id: number;
        street: string;
        first_name: string;
        last_name: string;
        total: number;
        nano_id: string;
      }[];
    },
  });

  return (
    <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
      <div className="flex-grow overflow-hidden rounded-xl border">
        <div className="mx-6 my-7 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Orders</h2>
        </div>
        <div className="border-t" />
        <div className="flex w-full flex-wrap md:gap-5 md:p-6">
          {isLoading ? (
            <div className="flex flex-grow items-center justify-center p-4">
              <Spinner />
            </div>
          ) : orders?.length ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="w-full cursor-pointer overflow-hidden border-b last:border-b-0 hover:bg-gray-50 md:rounded-lg md:border md:border-gray-300 md:last:border-b"
                onClick={() => {
                  router.push(`/order/${order.nano_id}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/order/${order.nano_id}`);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 p-6 pb-0 pt-6 text-lg font-semibold">
                  Order {order.nano_id}
                  {order.status === "completed" ? (
                    <ReturnOrder nano_id={order.nano_id} />
                  ) : order.status === "pending" ? (
                    <CancelOrder nano_id={order.nano_id} />
                  ) : null}
                </div>
                <Order order={order} />
              </div>
            ))
          ) : (
            <div className="h-full flex-grow items-center justify-center overflow-hidden p-6">
              <div className="relative -my-52 mx-auto w-fit">
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
                <h3 className="text-lg font-medium">No Orders</h3>
                <p className="text-tertiary">
                  Looks like you haven&apos;t made any orders yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
