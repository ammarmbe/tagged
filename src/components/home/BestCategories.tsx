"use client";
import { formatCurrency, selectStyles } from "@/utils";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { TRange } from "./RevenueOverview/RevenueOverview";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Loading from "../primitives/Loading";
import { RiBox3Line, RiTShirt2Line } from "react-icons/ri";

export default function BestCategories() {
  const [range, setRange] = useState<TRange>({
    value: "day",
    label: "Today",
  });

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["best-categories"],
    queryFn: async () => {
      const res = await fetch(`/api/home/best-categories?range=${range.value}`);
      return res.json() as Promise<
        {
          category_name: string;
          revenue: number;
          units: number;
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  return (
    <div className="card !p-0 sm:min-w-[350px]">
      <div className="flex items-center justify-between gap-4 p-4 pb-0 sm:gap-10">
        <div className="flex gap-2">
          <RiBox3Line size={24} className="text-icon-500" />
          <p className="label-medium">Best Categories</p>
        </div>
        <ReactSelect
          instanceId={"best-categories"}
          styles={selectStyles({ size: "xs", width: "130px" })}
          options={[
            {
              value: "day",
              label: "Today",
            },
            {
              value: "week",
              label: "This week",
            },
            {
              value: "month",
              label: "This month",
            },
            {
              value: "year",
              label: "This year",
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
        <Loading size={40} isFetching={isFetching} />
        {data?.map((category, i) => (
          <Link
            href={`/products?category=${category.category_name}`}
            key={i}
            className="group flex items-center justify-between gap-4 p-4 px-6 transition-all hover:bg-bg-100"
          >
            <div className="flex gap-3">
              <div className="flex size-11 items-center justify-center rounded-full border p-2 transition-all group-hover:border-border-300">
                <RiTShirt2Line size={20} className="text-main-base" />
              </div>
              <div className="flex flex-col">
                <p className="label-medium truncate">
                  {category.category_name ?? "No category"}
                </p>
                <p className="label-small truncate text-text-400 transition-all group-hover:text-text-500">
                  {category.units} unit{category.units == 1 ? "" : "s"} sold
                </p>
              </div>
            </div>
            <p className="label-xsmall rounded-full bg-[#C2EFFF] px-2 py-0.5 text-[#164564]">
              {formatCurrency(category.revenue)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
