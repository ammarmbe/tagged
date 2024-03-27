"use client";
import { selectStyles } from "@/utils";
import ReactSelect from "react-select";
import { useState } from "react";
import Cards from "./Cards";
import Graph from "./Graph";
import { TRange } from "@/components/home/RevenueOverview/RevenueOverview";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

export default function ItemOverview({ nano_id }: { nano_id: string }) {
  const [range, setRange] = useState<TRange>({
    value: "day",
    label: "Today",
  });

  return (
    <div className="card h-fit">
      <div className="flex items-center justify-between gap-5">
        <div className="flex gap-2">
          <RiMoneyDollarCircleLine size={24} className="text-icon-500" />
          <p className="label-medium">Overview</p>
        </div>
        <ReactSelect
          instanceId={"item-overview"}
          styles={selectStyles({ size: "xs", width: "150px" })}
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
      <Cards range={range} nano_id={nano_id} />
      <div className="border-t" />
      <Graph range={range} nano_id={nano_id} />
    </div>
  );
}
