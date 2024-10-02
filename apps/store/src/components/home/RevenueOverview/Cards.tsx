"use client";
import Tooltip from "@/components/primitives/Tooltip";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TRange } from "./RevenueOverview";
import { formatCurrency } from "@/utils";
import Loading from "@/components/primitives/Loading";
import {
  RiForbid2Line,
  RiLineChartLine,
  RiShoppingBag3Line,
} from "react-icons/ri";

export default function Cards({ range }: { range: TRange }) {
  const [percentages, setPercentages] = useState({
    revenue: 0,
    potential: 0,
    units: 0,
  });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["revenue-overview", "cards"],
    queryFn: async () => {
      const res = await fetch(
        `/api/home/revenue-overview/cards?range=${range.value}`,
      );
      return res.json() as Promise<{
        revenue: number;
        potential: number;
        units: number;
        prev_revenue: number;
        prev_potential: number;
        prev_units: number;
      }>;
    },
  });

  useEffect(() => {
    if (data) {
      setPercentages({
        revenue:
          data.prev_revenue == 0
            ? data.revenue > 0
              ? 100
              : 0
            : Math.round(
                ((data.revenue - data.prev_revenue) / data.prev_revenue) * 100,
              ),
        potential:
          data.prev_potential == 0
            ? data.potential > 0
              ? 100
              : 0
            : Math.round(
                ((data.potential - data.prev_potential) / data.prev_potential) *
                  100,
              ),
        units:
          data.prev_units == 0
            ? data.units > 0
              ? 100
              : 0
            : Math.round(
                ((data.units - data.prev_units) / data.prev_units) * 100,
              ),
      });
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  return (
    <div className="relative grid grid-cols-1 gap-5 py-3 lg:grid-cols-[1fr,1px,1fr,1px,1fr] lg:gap-3 lg:py-5">
      <Loading size={40} isLoading={isLoading} />
      <div className="flex items-start lg:justify-center">
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
          <div className="row-span-2 h-fit rounded-full border p-2.5">
            <RiLineChartLine size={22} className="text-main-base" />
          </div>
          <p className="subheading-xsmall text-text-400">Revenue</p>
          <p className="label-medium flex items-center gap-1.5">
            {formatCurrency(data?.revenue)}
            <span
              className={`subheading-2xsmall rounded-full px-1.5 py-0.5 ${
                percentages.revenue > 0
                  ? "bg-[#CBF5E4] text-[#176448]"
                  : percentages.revenue < 0
                    ? "bg-[#F8C9D2] text-[#710E21]"
                    : "bg-[#F6F8FA] text-[#525866]"
              }`}
            >
              {(percentages.revenue > 0 ? "+" : "") + percentages.revenue}%
            </span>
          </p>
        </div>
      </div>
      <div className="border-t lg:border-l" />
      <div className="flex items-start lg:justify-center">
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
          <div className="row-span-2 h-fit rounded-full border p-2.5">
            <RiForbid2Line size={22} className="text-main-base" />
          </div>
          <p className="subheading-xsmall flex items-start gap-1.5 text-text-400">
            Potential Revenue{" "}
            <Tooltip content="Revenue missed out on due to cancellations." />
          </p>
          <p className="label-medium flex items-center gap-1.5">
            {formatCurrency(data?.potential)}
            <span
              className={`subheading-2xsmall rounded-full px-1.5 py-0.5 ${
                percentages.potential > 0
                  ? "bg-[#CBF5E4] text-[#176448]"
                  : percentages.potential < 0
                    ? "bg-[#F8C9D2] text-[#710E21]"
                    : "bg-[#F6F8FA] text-[#525866]"
              }`}
            >
              {(percentages.potential > 0 ? "+" : "") + percentages.potential}%
            </span>
          </p>
        </div>
      </div>
      <div className="border-t lg:border-l" />
      <div className="flex items-start lg:justify-center">
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
          <div className="row-span-2 h-fit rounded-full border p-2.5">
            <RiShoppingBag3Line size={22} className="text-main-base" />
          </div>
          <p className="subheading-xsmall text-text-400">Units sold</p>
          <p className="label-medium flex items-center gap-1.5">
            {Number(data?.units) || 0}
            <span
              className={`subheading-2xsmall rounded-full px-1.5 py-0.5 ${
                percentages.units > 0
                  ? "bg-[#CBF5E4] text-[#176448]"
                  : percentages.units < 0
                    ? "bg-[#F8C9D2] text-[#710E21]"
                    : "bg-[#F6F8FA] text-[#525866]"
              }`}
            >
              {(percentages.units > 0 ? "+" : "") + percentages.units}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
