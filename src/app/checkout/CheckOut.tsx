"use client";
import { useState } from "react";
import Address from "./Address";
import Items from "./Items";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Spinner from "@/components/Spinner";

export default function CheckOut({
  address,
  cart,
}: {
  address?: {
    street: string;
    apartment: string;
    city: string;
    governorate: string;
    postal: string;
    number: string;
    first_name: string;
    last_name: string;
  };
  cart?: {
    id: string;
    store_id: string;
    item_id: string;
    nano_id: string;
    image_url: string;
    store_nano_id: string;
    item_name: string;
    store_name: string;
    price: number;
    discount: number;
    quantity: number;
    color: string;
    size: string;
    allowed_gov: string;
    shipping_price: number;
  }[];
}) {
  const [governorate, setGovernorate] = useState<{
    value: string;
    label: string;
  }>({
    value: address?.governorate || "Cairo",
    label: address?.governorate || "Cairo",
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    street: string;
    apartment: string;
    city: string;
    governorate: string;
    postal: string;
    number: string;
    first_name: string;
    last_name: string;
  }>({
    defaultValues: {
      street: address?.street,
      apartment: address?.apartment,
      city: address?.city,
      governorate: address?.governorate,
      postal: address?.postal,
      number: address?.number,
      first_name: address?.first_name,
      last_name: address?.last_name,
    },
  });

  const onSubmit = async (data: {
    street: string;
    apartment: string;
    city: string;
    governorate: string;
    postal: string;
    number: string;
    first_name: string;
    last_name: string;
  }) => {
    const res = await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        governorate: governorate.value,
      }),
    });

    if (res.ok) {
      const nano_id = await res.text();

      router.push(`/order/${nano_id}/success`);
    }
  };

  return (
    <form
      className="grid gap-8 sm:grid-cols-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Address
        governorate={governorate}
        setGovernorate={setGovernorate}
        register={register}
        errors={errors}
      />
      <div className="flex flex-col gap-5 p-6 pt-0 sm:pl-0">
        <h2 className="text-secondary text-lg font-medium">Items</h2>
        {cart ? <Items cart={cart} governorate={governorate} /> : <div />}
        <button
          type="submit"
          disabled={
            isSubmitting ||
            cart?.length === 0 ||
            cart?.some((item) => !item.allowed_gov?.includes(governorate.value))
          }
          className={`active:bg-primary inline-flex w-full items-center justify-center gap-2 self-end rounded-lg border border-main-500 bg-main-500 px-3 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-white hover:text-main-500 active:border-main-600 active:text-main-500 active:!shadow-[0_0_0_4px_#9e77ed3d,0_1px_2px_0_#1018280d] disabled:cursor-not-allowed disabled:border disabled:border-[#EAECF0] disabled:bg-[#f2f4f7] disabled:text-[#98a2b3] disabled:hover:bg-gray-200 disabled:hover:text-[#98a2b3] ${
            isSubmitting ? "!px-[27px]" : "!px-5"
          }`}
        >
          {isSubmitting ? <Spinner size="sm" /> : "Complete Order"}
        </button>
      </div>
    </form>
  );
}
