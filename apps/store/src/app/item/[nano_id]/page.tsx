"use client";
import Configurations from "@/components/item/Configurations/Configurations";
import Header from "@/components/header/Header";
import Info from "@/components/item/Info";
import Overview from "@/components/item/Overview/Overview";
import Sales from "@/components/item/Sales";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TooltipComponent from "@/components/primitives/Tooltip";
import { LuDot } from "react-icons/lu";
import UpdateStock from "@/components/item/UpdateStock";
import Button from "@/components/primitives/Button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { RiBox3Line, RiTShirt2Line } from "react-icons/ri";
import Images from "@/components/item/Images";

export default function Page({ params }: { params: { nano_id: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["item", params.nano_id],
    queryFn: async () => {
      const res = await fetch(`/api/item?nano_id=${params.nano_id}`);
      return res.json() as Promise<{
        deleted: boolean;
        id: string;
        name: string;
        description: string;
        price: number;
        discount: number;
        category: string[];
        colors: string[];
        sizes: string[];
        quantity: number;
        quantities: string[];
      }>;
    },
  });

  if (data?.deleted === true) {
    return (
      <main className="flex flex-grow flex-col items-center p-10">
        <p className="label-large text-text-400">This item has been deleted.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-0 min-w-0 flex-grow flex-col overflow-auto">
      <Header
        title={data?.name}
        icon={<RiTShirt2Line size={24} className="text-text-600" />}
        description={
          data ? (
            <span className="flex items-center gap-2">
              <TooltipComponent
                trigger={
                  <span className="underline-offset-2 hover:underline">
                    {data?.colors[0] ? data?.colors.length : 0} color
                    {data?.colors.length === 1 ? "" : "s"}
                  </span>
                }
                content={data?.colors.join(", ") || "0 sizes"}
              />
              <LuDot size={16} className="text-text-600" />
              <TooltipComponent
                trigger={
                  <span className="underline-offset-2 hover:underline">
                    {data?.sizes[0] ? data?.sizes.length : 0} size
                    {data?.sizes.length === 1 ? "" : "s"}{" "}
                  </span>
                }
                content={data?.sizes.join(", ") || "0 colors"}
              />
              <LuDot size={16} className="text-text-600" />
              <TooltipComponent
                trigger={
                  <span
                    className={`underline-offset-2 hover:underline 
                  ${
                    (data?.quantity ?? 0) == 0
                      ? "text-error"
                      : (data?.quantity ?? 0) <= 5
                        ? "text-warning"
                        : undefined
                  }`}
                  >
                    {data?.quantity ?? 0} in stock
                  </span>
                }
                content={
                  data?.quantities?.map((q) => <p key={q}>{q}</p>) ||
                  "0 in stock"
                }
              />
            </span>
          ) : (
            <span></span>
          )
        }
        buttonNode={
          <UpdateStock
            data={data}
            trigger={
              <DialogTrigger asChild>
                <Button
                  color="main"
                  size="md"
                  className="flex-none justify-center"
                  iconLeft={<RiBox3Line size={20} />}
                  text="Update Stock"
                />
              </DialogTrigger>
            }
          />
        }
      />
      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-1 sm:gap-6 sm:px-8 2xl:grid-cols-[auto,1fr]">
        <div className="flex flex-col gap-4 sm:gap-6">
          <Info data={data} isLoading={isLoading} nano_id={params.nano_id} />
          <Configurations nano_id={params.nano_id} />
          <Images nano_id={params.nano_id} />
        </div>
        <div className="flex flex-col gap-4 sm:gap-6">
          <Overview nano_id={params.nano_id} />
          <Sales nano_id={params.nano_id} />
        </div>
      </div>
    </main>
  );
}
