"use client";
import { LuDot } from "react-icons/lu";
import { useEffect } from "react";
import { TRange } from "../../home/RevenueOverview/RevenueOverview";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils";
import Tooltip from "../../primitives/Tooltip";
import Loading from "../../primitives/Loading";

export default function Sizes({
  nano_id,
  range,
}: {
  nano_id: string;
  range: TRange;
}) {
  const {
    data: item_sizes,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["item-sizes", nano_id],
    queryFn: async () => {
      const res = await fetch(
        `/api/item/sizes?nano_id=${nano_id}&range=${range.value}`,
      );
      return res.json() as Promise<
        {
          name: string;
          quantity: number;
          colors: string[];
          revenue: number;
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  return (
    <div className="relative flex-grow overflow-hidden rounded-b-2xl">
      <Loading size={40} isFetching={isFetching} />
      <div className="grid min-h-[100px] grid-cols-1 gap-2 p-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-1">
        {item_sizes?.map((size) => (
          <div
            key={size.name}
            className="h-fit space-y-1 rounded-xl border p-4"
          >
            <div className="flex w-full items-center justify-between">
              <p className="label-medium">{size.name}</p>
              <Tooltip
                content="Revenue in the selected range."
                trigger={
                  <p className="label-xsmall rounded-full bg-bg-100 px-2 py-0.5 text-text-500">
                    {formatCurrency(size.revenue)}
                  </p>
                }
              />
            </div>
            <div className="label-small flex items-center gap-0.5 !font-normal">
              <Tooltip
                trigger={
                  <p className="underline-offset-2 hover:underline">
                    {size.colors.length} color
                    {size.colors.length === 1 ? "" : "s"}
                  </p>
                }
                content={size.colors.join(", ")}
              />
              <LuDot size={16} className="text-[#162664B8]" />
              <p>{size.quantity} in stock</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
