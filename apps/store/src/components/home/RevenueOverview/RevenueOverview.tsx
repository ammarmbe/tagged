"use client";
import { selectStyles } from "@/utils";
import ReactSelect from "react-select";
import { useState } from "react";
import Cards from "./Cards";
import Graph from "./Graph";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

export type TRange =
  | {
      value: "day";
      label: "Today";
    }
  | {
      value: "week";
      label: "Last week";
    }
  | {
      value: "month";
      label: "Last month";
    }
  | {
      value: "year";
      label: "Last year";
    }
  | {
      value: "all";
      label: "All time";
    };

export default function RevenueOverview() {
  const [range, setRange] = useState<TRange>({
    value: "day",
    label: "Today",
  });

  return (
    <div className="card h-fit">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="flex gap-2">
          <RiMoneyDollarCircleLine size={24} className="text-text-600" />
          <p className="label-medium">Revenue Overview</p>
        </div>
        <ReactSelect
          instanceId={"revenue-overview"}
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
      <div className="border-t" />
      <Cards range={range} />
      <div className="border-t" />
      <Graph range={range} />
    </div>
  );
}
