"use client";
import Spinner from "@/components/Spinner";
import CheckOut from "./CheckOut";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: cart, isLoading: isCartLoading } = useQuery({
    queryKey: ["checkout"],
    queryFn: async () => {
      const cartRes = await fetch("/api/cart/checkout");
      return (await cartRes.json()) as {
        id: string;
        store_id: string;
        store_nano_id: string;
        nano_id: string;
        item_id: string;
        item_name: string;
        store_name: string;
        price: number;
        image_url: string;
        quantity: number;
        discount: number;
        color: string;
        size: string;
        allowed_gov: string;
        shipping_price: number;
      }[];
    },
  });

  const { data: address, isLoading: isAddressLoading } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const addressRes = await fetch("/api/address");
      return (await addressRes.json()) as {
        street: string;
        apartment: string;
        city: string;
        governorate: string;
        postal: string;
        number: string;
        first_name: string;
        last_name: string;
      };
    },
  });

  if (isCartLoading || isAddressLoading) {
    return (
      <div className="mx-auto w-full max-w-[min(100%,80rem)] flex-grow px-4">
        <div className="flex flex-grow items-center justify-center rounded-xl border p-10">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
      <div className="flex-grow overflow-visible rounded-xl border">
        <h2 className="mx-6 my-7 mb-6 text-xl font-semibold">Check Out</h2>
        <div className="mb-7 border-t" />
        <CheckOut address={address} cart={cart} />
      </div>
    </div>
  );
}
