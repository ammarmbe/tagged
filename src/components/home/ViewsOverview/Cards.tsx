"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Loading from "@/components/primitives/Loading";
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiBox2Line,
  RiTShirt2Line,
} from "react-icons/ri";
import { TRange } from "../RevenueOverview/RevenueOverview";
import Link from "next/link";

export default function Cards({ range }: { range: TRange }) {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["views-overview", "cards"],
    queryFn: async () => {
      const res = await fetch(
        `/api/home/views-overview/cards?range=${range.value}`,
      );
      return res.json() as Promise<{
        category: string[];
        item_name: string;
        item_nano_id: string;
        category_views: number;
        item_views: number;
        category_previous: number;
        item_previous: number;
      }>;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  return (
    <div className="relative grid grid-cols-1 gap-5 py-3 lg:grid-cols-[1fr,1px,1fr] lg:gap-3 lg:py-5">
      <Loading size={40} isFetching={isFetching} />
      <div className="flex items-center lg:justify-center ">
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
          <div className="row-span-2 rounded-full border p-2.5">
            <RiBox2Line size={22} className="text-main-base" />
          </div>
          <p className="subheading-xsmall text-text-400">
            Most Viewed Category
          </p>
          {data?.category?.length ? (
            <p className="label-medium flex items-center gap-1.5">
              <Link
                href={`/items?category=${data?.category?.at(-1)?.toLowerCase()}`}
                className="w-fit capitalize underline-offset-2 hover:underline"
              >
                {data?.category?.at(-1)}
              </Link>
              <span
                className={`subheading-2xsmall flex items-center gap-0.5 rounded-full p-0.5 pr-1.5 ${
                  data?.category_previous < data?.category_views
                    ? "bg-[#CBF5E4] text-[#176448]"
                    : data?.category_previous > data?.category_views
                      ? "bg-[#F8C9D2] text-[#710E21]"
                      : "bg-[#F6F8FA] text-[#525866]"
                }`}
              >
                {data?.category_previous < data?.category_views ? (
                  <RiArrowUpSFill size={14} className="inline" />
                ) : (
                  <RiArrowDownSFill size={14} className="inline" />
                )}{" "}
                {data?.category_views}
              </span>
            </p>
          ) : (
            "-"
          )}
        </div>
      </div>
      <div className="border-t lg:border-l" />
      <div className="flex items-center lg:justify-center ">
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
          <div className="row-span-2 rounded-full border p-2.5">
            <RiTShirt2Line size={22} className="text-main-base" />
          </div>
          <p className="subheading-xsmall text-text-400">Most Viewed Item</p>
          {data?.item_name ? (
            <p className="label-medium flex items-center gap-1.5">
              <Link
                href={`/item/${data?.item_nano_id}`}
                className="label-medium w-fit underline-offset-2 hover:underline"
              >
                {data?.item_name}
              </Link>
              <span
                className={`subheading-2xsmall flex items-center gap-0.5 rounded-full p-0.5 pr-1.5 ${
                  data?.item_previous < data?.item_views
                    ? "bg-[#CBF5E4] text-[#176448]"
                    : data?.item_previous > data?.item_views
                      ? "bg-[#F8C9D2] text-[#710E21]"
                      : "bg-[#F6F8FA] text-[#525866]"
                }`}
              >
                {data?.item_previous < data?.item_views ? (
                  <RiArrowUpSFill size={14} className="inline" />
                ) : (
                  <RiArrowDownSFill size={14} className="inline" />
                )}{" "}
                {data?.item_views}
              </span>
            </p>
          ) : (
            "-"
          )}
        </div>
      </div>
    </div>
  );
}
