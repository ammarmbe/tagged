import {
  RiAddLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiForbidLine,
  RiHistoryLine,
  RiShip2Line,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import { Fragment } from "react";

export default function StatusHistory({ nano_id }: { nano_id: string }) {
  const { data, isFetching } = useQuery({
    queryKey: ["order-history", nano_id],
    queryFn: async () => {
      const res = await fetch(`/api/order/status-history?nano_id=${nano_id}`);
      return res.json() as Promise<
        {
          created_at: string;
          date: string;
          status:
            | "confirmed"
            | "shipped"
            | "completed"
            | "store_cancelled"
            | "customer_cancelled";
        }[]
      >;
    },
  });

  return (
    <div className="card min-w-[200px] !gap-0 !p-0">
      <div className="flex gap-2 p-4">
        <RiHistoryLine size={24} className="text-text-600" />
        <p className="label-medium flex items-center gap-1.5">
          Status History{" "}
        </p>
      </div>
      <div className="mx-4 border-t" />
      <div className="relative flex-grow">
        <Loading isFetching={isFetching} />
        <div className="flex flex-col gap-3 p-4 sm:gap-2">
          {data?.[0]?.created_at ? (
            <div className="flex flex-col justify-between gap-x-8 gap-y-1 sm:flex-row sm:items-center">
              <p className="label-small flex items-center gap-1.5 capitalize">
                <RiAddLine size={16} className="inline text-text-600" />
                Order created
              </p>
              <p className="paragraph-small text-text-600 sm:text-end">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(data?.[0].created_at))}
              </p>
            </div>
          ) : null}
          {data
            ?.filter((status) => status.status)
            ?.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            )
            .map((status) => (
              <div
                className="flex flex-col justify-between gap-x-8 gap-y-1 sm:flex-row sm:items-center"
                key={status.date}
              >
                <p className="label-small flex items-center gap-1.5 capitalize">
                  {status.status.endsWith("cancelled") ? (
                    <RiForbidLine size={16} className="inline text-text-600" />
                  ) : status.status === "shipped" ? (
                    <RiShip2Line size={16} className="inline text-text-600" />
                  ) : status.status === "confirmed" ? (
                    <RiCheckLine size={16} className="inline text-text-600" />
                  ) : status.status === "completed" ? (
                    <RiCheckDoubleLine
                      size={16}
                      className="inline text-text-600"
                    />
                  ) : null}
                  {status.status === "store_cancelled"
                    ? "Cancelled by store"
                    : status.status === "customer_cancelled"
                      ? "Cancelled by customer"
                      : status.status}
                </p>
                <p className="paragraph-small text-text-600 sm:text-end">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(status.date))}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
