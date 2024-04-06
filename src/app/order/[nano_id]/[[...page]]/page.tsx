"use client";
import Spinner from "@/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import Status from "@/components/Status";
import Order from "@/components/Order";
import { CheckCircle } from "lucide-react";
import CancelOrder from "@/app/orders/CancelOrder";
import ReturnOrder from "@/app/orders/ReturnOrder";

export default function CustomerOrder({
  params,
}: {
  params: { nano_id: string; page: string[] };
}) {
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", params.nano_id],
    queryFn: async () => {
      const res = await fetch(`/api/order?nano_id=${params.nano_id}`);
      return (await res.json()) as {
        id: number;
        governorate: string;
        city: string;
        nano_id: string;
        created_at: string;
        shipping_price: number;
        cancel_reason: string;
        return_reason: string;
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
        customer_name: string;
        apartment: string;
        phone_number: string;
        total: number;
      };
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
        <div className="overflow-hidden rounded-xl border">
          <h2 className="mx-6 my-7 flex items-center gap-1.5 text-xl font-semibold">
            Order {params.nano_id}
          </h2>
          <div className="border-t" />
          <div className="flex items-center justify-center p-10">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (order)
    return (
      <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
        <div className="flex-grow overflow-visible rounded-xl border">
          <h2 className="mx-6 my-7 flex flex-col gap-3 text-xl">
            {params.page?.[0] === "success" ? (
              <div className="hidden items-center gap-3 sm:flex">
                <CheckCircle size={32} color="#079455" />
                <p className="text-3xl font-semibold">Success</p>
              </div>
            ) : null}
            <div
              className={`flex flex-wrap items-center gap-1.5 ${params.page?.[0] === "success" ? "font-semibold sm:font-medium sm:text-gray-700" : "font-semibold"}`}
            >
              <p className="flex w-full flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  Order {params.nano_id}{" "}
                  <span className="w-fit font-medium">
                    <Status status={order.status} />
                  </span>
                </span>
                {order.status === "completed" ? (
                  <ReturnOrder orderId={order.id} />
                ) : order.status === "pending" ? (
                  <CancelOrder orderId={order.id} />
                ) : null}
              </p>
            </div>
          </h2>
          <div className="border-t" />
          <Order order={order} />
        </div>
      </div>
    );
}
