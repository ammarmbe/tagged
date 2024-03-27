"use client";
import { selectStyles } from "@/utils";
import ReactSelect from "react-select";
import { useState } from "react";
import Cards from "./Cards";
import Graph from "./Graph";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TRange } from "../RevenueOverview/RevenueOverview";

export default function ViewsOverview() {
  const [range, setRange] = useState<TRange>({
    value: "day",
    label: "Today",
  });

  return (
    <div className="card h-fit">
      <div className="flex items-center justify-between gap-5">
        <div className="flex gap-2">
          <RiMoneyDollarCircleLine size={24} className="text-icon-500" />
          <p className="label-medium">Views Overview</p>
        </div>
        <ReactSelect
          instanceId={"views-overview"}
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
      <div className="border-t" />
      <Cards range={range} />
      <div className="border-t" />
      <Graph range={range} />
    </div>
  );
}
