import { formatCurrency } from "@/utils";
import { RiInformationLine, RiArrowRightSLine } from "react-icons/ri";
import React from "react";
import Loading from "../primitives/Loading";
import Edit from "./Edit";
import Link from "next/link";

export default function Info({
  data,
  isLoading,
  nano_id,
}: {
  data?: {
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
  };
  isLoading: boolean;
  nano_id: string;
}) {
  return (
    <div className="card !gap-0 !p-0">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 p-4">
        <div className="flex gap-2">
          <RiInformationLine size={24} className="text-text-600" />
          <p className="label-medium">Information</p>
        </div>
        <Edit data={data} />
      </div>
      <div className="mx-4 border-t" />
      <div className="relative flex flex-col gap-3 overflow-hidden rounded-b-2xl p-4">
        <Loading size={40} isLoading={isLoading} />
        <div className="grid grid-cols-[1fr,2fr] gap-3">
          <div>
            <p className="subheading-xsmall mb-1 text-text-400">ID</p>
            <p className="label-small">{nano_id}</p>
          </div>
          <div>
            <p className="subheading-xsmall mb-1 text-text-400">Name</p>
            <p className="label-small">{data?.name}</p>
          </div>
        </div>
        <div className="border-t" />
        <div>
          <p className="subheading-xsmall mb-1 text-text-400">Category</p>
          <p className="label-small flex gap-0.5">
            {data?.category.map((c, i) => (
              <React.Fragment key={c}>
                <Link
                  href={`/items?category=${c.toLowerCase()}`}
                  className="underline-offset-2 hover:underline"
                >
                  {c}
                </Link>
                {i < data?.category.length - 1 ? (
                  <RiArrowRightSLine size={20} className="text-text-400" />
                ) : null}
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className="border-t" />
        <div>
          <p className="subheading-xsmall mb-1 text-text-400">Description</p>
          <p className="label-small">{data?.description}</p>
        </div>
        <div className="border-t" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="subheading-xsmall mb-1 text-text-400">Price</p>
            <p className="label-small">{formatCurrency(data?.price)}</p>
          </div>
          <div>
            <p className="subheading-xsmall mb-1 text-text-400">Discount</p>
            <p className="label-small">{formatCurrency(data?.discount)}</p>
          </div>
        </div>
        <div className="border-t" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="subheading-xsmall mb-1 text-text-400">Colors</p>
            <p className="label-small">{data?.colors.join(", ") || "-"}</p>
          </div>
          <div>
            <p className="subheading-xsmall mb-1 text-text-400">Sizes</p>
            <p className="label-small">{data?.sizes.join(", ") || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
