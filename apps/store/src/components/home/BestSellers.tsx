"use client";
import { formatCurrency, selectStyles } from "@/utils";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { TRange } from "./RevenueOverview/RevenueOverview";
import { useQuery } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import { RiSparklingLine, RiTShirt2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function BestSellers() {
  const router = useRouter();

  const [range, setRange] = useState<TRange>({
    value: "day",
    label: "Today",
  });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: async () => {
      const res = await fetch(`/api/home/best-sellers?range=${range.value}`);
      return res.json() as Promise<
        {
          name: string;
          revenue: number;
          units: number;
          nano_id: string;
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  return (
    <div className="card flex-grow !p-0 sm:min-w-[350px]">
      <div className="flex items-center justify-between gap-4 p-4 pb-0 sm:gap-10">
        <div className="flex gap-2">
          <RiSparklingLine size={24} className="text-text-600" />
          <p className="label-medium">Best Sellers</p>
        </div>
        <ReactSelect
          instanceId={"best-sellers"}
          styles={selectStyles({ size: "xs", width: "130px" })}
          options={[
            {
              value: "day",
              label: "Today",
            },
            {
              value: "week",
              label: "Last week",
            },
            {
              value: "month",
              label: "Last month",
            },
            {
              value: "year",
              label: "Last year",
            },
            {
              value: "all",
              label: "All time",
            },
          ]}
          value={range}
          onChange={(option) => {
            if (option) {
              setRange(option as unknown as TRange);
            }
          }}
        />
      </div>
      <div className="mx-4 border-t" />
      <div className="relative min-h-[200px] flex-grow overflow-auto rounded-b-2xl">
        <Loading size={40} isLoading={isLoading} />
        {data?.map((item, i) => (
          <div
            key={i}
            className="group flex items-center justify-between gap-4 p-4 px-6 transition-all hover:bg-bg-50"
            role="button"
            tabIndex={0}
            onClick={() => {
              router.push(`/item/${item.nano_id}`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                router.push(`/item/${item.nano_id}`);
              }
            }}
          >
            <div className="flex gap-3">
              <div className="flex size-11 items-center justify-center rounded-full border p-2 transition-all group-hover:border-border-300">
                <RiTShirt2Line size={20} className="text-main-base" />
              </div>
              <div className="flex flex-col">
                <p className="label-medium truncate">{item.name}</p>
                <p className="label-small truncate text-text-400 transition-all group-hover:text-text-600">
                  {item.units} unit{item.units == 1 ? "" : "s"} sold
                </p>
              </div>
            </div>
            <p className="label-xsmall rounded-full bg-[#C2EFFF] px-2 py-0.5 text-[#164564]">
              {formatCurrency(item.revenue)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
