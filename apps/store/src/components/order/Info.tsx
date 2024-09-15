import { formatCurrency } from "@/utils";
import { RiInformationLine } from "react-icons/ri";
import React from "react";
import Loading from "../primitives/Loading";
import Status from "../Status";

export default function Info({
  data,
  isFetching,
}: {
  data?: {
    nano_id: string;
    created_at: string;
    shipping_price: number;
    status:
      | "pending"
      | "confirmed"
      | "shipped"
      | "completed"
      | "store_cancelled"
      | "customer_cancelled"
      | "return_requested"
      | "return_declined"
      | "return_accepted"
      | "returned"
      | null;
    cancel_reason: string;
  };
  isFetching: boolean;
}) {
  return (
    <div className="card !gap-0 !p-0">
      <div className="flex gap-2 p-4">
        <RiInformationLine size={24} className="text-text-600" />
        <p className="label-medium">Information</p>
      </div>
      <div className="mx-4 border-t" />
      <div className="relative flex min-w-[300px] flex-col gap-3 overflow-hidden rounded-b-2xl p-4">
        <Loading size={40} isFetching={isFetching} />
        <div className="grid grid-cols-[auto,auto] gap-3">
          <div>
            <p className="subheading-xsmall mb-1 text-text-400">ID</p>
            <p className="label-small">{data?.nano_id}</p>
          </div>
          <div>
            <p className="subheading-xsmall mb-1 text-text-400">
              Shipping Price
            </p>
            <p className="label-small">
              {formatCurrency(data?.shipping_price)}
            </p>
          </div>
        </div>
        <div className="border-t" />
        <div>
          <p className="subheading-xsmall mb-1 text-text-400">Created At</p>
          <p className="label-small flex gap-0.5">
            {data?.created_at
              ? new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(data.created_at))
              : "-"}
          </p>
        </div>
        <div className="border-t" />
        <div>
          <p className="subheading-xsmall mb-1 text-text-400">Status</p>
          <p className="label-small">
            <Status inline status={data?.status} className="w-fit" />
          </p>
        </div>
        {data?.cancel_reason ? (
          <>
            <div className="border-t" />
            <div>
              <p className="subheading-xsmall mb-1 text-text-400">
                Cancel Reason
              </p>
              <p className="label-small">{data?.cancel_reason}</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
