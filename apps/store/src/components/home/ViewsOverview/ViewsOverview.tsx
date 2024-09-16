"use client";
import { selectStyles } from "@/utils";
import ReactSelect from "react-select";
import { useState } from "react";
import Cards from "./Cards";
import Graph from "./Graph";
import { RiEye2Line } from "react-icons/ri";
import { TRange } from "../RevenueOverview/RevenueOverview";

export default function ViewsOverview() {
  const [range, setRange] = useState<TRange>({
    value: "day",
    label: "Today",
  });

  return (
    <div className="card h-fit">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="flex gap-2">
          <RiEye2Line size={24} className="text-text-600" />
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
