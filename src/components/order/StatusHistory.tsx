import { RiHistoryLine } from "react-icons/ri";
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
          status: string;
        }[]
      >;
    },
  });

  return (
    <div className="card min-w-[200px] !gap-0 !p-0">
      <div className="flex gap-2 p-4">
        <RiHistoryLine size={24} className="text-icon-500" />
        <p className="label-medium flex items-center gap-1.5">
          Status History{" "}
        </p>
      </div>
      <div className="mx-4 border-t" />
      <div className="relative flex-grow">
        <Loading isFetching={isFetching} />
        <div className="grid grid-cols-[1fr,auto] gap-2 gap-x-16 p-4">
          {data?.[0]?.created_at ? (
            <>
              <p className="paragraph-small text-text-500">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(data?.[0].created_at))}
              </p>
              <p className="label-small text-end capitalize">Order created</p>
            </>
          ) : null}
          {data
            ?.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            )
            .map((status) => (
              <Fragment key={status.date}>
                <p className="paragraph-small text-text-500">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(status.date))}
                </p>
                <p className="label-small text-end capitalize">
                  {status.status}
                </p>
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
