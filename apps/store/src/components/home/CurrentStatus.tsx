"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  RiArrowRightSLine,
  RiTimeLine,
  RiArrowGoBackLine,
  RiNotification3Line,
} from "react-icons/ri";
import Loading from "../primitives/Loading";

export default function CurrentStatus() {
  const { data, isFetching } = useQuery({
    queryKey: ["current-status"],
    queryFn: async () => {
      const response = await fetch("/api/home/current-status");
      return response.json() as Promise<{
        orders_pending: number;
        return_requests: number;
        new_notifications: number;
      }>;
    },
  });

  return (
    <div className="card relative !gap-0 !p-0">
      <Loading isFetching={isFetching} />
      <Link
        href="/orders?status=pending"
        className="hover:bg-bg-50 group flex items-center gap-3 rounded-t-lg p-4 transition-all"
      >
        <RiTimeLine size={20} className="text-text-600" />
        <span
          className={`label-small flex-grow ${(data?.orders_pending || 0) > 10 ? "text-warning" : ""}`}
        >
          {data?.orders_pending} order{data?.orders_pending == 1 ? "" : "s"}{" "}
          pending
        </span>
        <span className="bg-bg-0 text-text-600 rounded-full group-hover:shadow-sm">
          <RiArrowRightSLine size={20} />
        </span>
      </Link>
      <Link
        href="/orders?status=return_requested"
        className="hover:bg-bg-50 group flex items-center gap-3 p-4 transition-all"
      >
        <RiArrowGoBackLine size={20} className="text-text-600" />
        <span
          className={`label-small flex-grow ${(data?.return_requests || 0) > 5 ? "text-warning" : ""}`}
        >
          {data?.return_requests} return request
          {data?.return_requests == 1 ? "" : "s"}
        </span>
        <span className="bg-bg-0 text-text-600 rounded-full group-hover:shadow-sm">
          <RiArrowRightSLine size={20} />
        </span>
      </Link>
      <button
        className="hover:bg-bg-50 group flex items-center gap-3 rounded-b-lg p-4 transition-all"
        onClick={() => {
          document.dispatchEvent(new Event("show-notifications"));
        }}
      >
        <RiNotification3Line size={20} className="text-text-600" />
        <span className="label-small flex-grow text-start">
          {data?.new_notifications} new notification
          {data?.new_notifications == 1 ? "" : "s"}
        </span>
        <span className="bg-bg-0 text-text-600 rounded-full group-hover:shadow-sm">
          <RiArrowRightSLine size={20} />
        </span>
      </button>
    </div>
  );
}