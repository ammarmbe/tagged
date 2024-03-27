"use client";

import { useState } from "react";
import Sizes from "./Sizes";
import Colors from "./Colors";
import { RiSettingsLine } from "react-icons/ri";
import { TRange } from "@/components/home/RevenueOverview/RevenueOverview";
import { selectStyles } from "@/utils";
import ReactSelect from "react-select";

export default function ItemConfigurations({ nano_id }: { nano_id: string }) {
  const [sizesOpen, setSizesOpen] = useState(true);
  const [range, setRange] = useState<TRange>({
    value: "day",
    label: "Today",
  });

  return (
    <div className="card min-w-[350px] !gap-0 !p-0">
      <div className="flex items-center justify-between gap-5 p-4">
        <div className="flex gap-2">
          <RiSettingsLine size={24} className="text-icon-500" />
          <p className="label-medium">Configurations</p>
        </div>
        <ReactSelect
          instanceId={"item-overview-sizes"}
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
      <div className="mx-4 grid min-w-[300px] grid-cols-2 gap-4 rounded-[10px] bg-bg-100 p-1">
        <button
          className={`label-small rounded-[10px] px-4 py-1 transition-all ${
            sizesOpen
              ? "bg-white shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
              : "text-text-400"
          }`}
          onClick={() => setSizesOpen(true)}
        >
          Sizes
        </button>
        <button
          className={`label-small rounded-[10px] px-4 py-1 transition-all ${
            !sizesOpen
              ? "bg-white shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
              : "text-text-400"
          }`}
          onClick={() => setSizesOpen(false)}
        >
          Colors
        </button>
      </div>
      {sizesOpen ? (
        <Sizes nano_id={nano_id} range={range} />
      ) : (
        <Colors nano_id={nano_id} range={range} />
      )}
    </div>
  );
}
