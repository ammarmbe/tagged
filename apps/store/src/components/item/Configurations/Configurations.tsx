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
    <div className="card !gap-0 !p-0 sm:min-w-[350px]">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 p-4">
        <div className="flex gap-2">
          <RiSettingsLine size={24} className="text-text-600" />
          <p className="label-medium">Configurations</p>
        </div>
        <ReactSelect
          instanceId={"item-overview-sizes"}
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
      <div className="mx-4 grid grid-cols-2 gap-4 rounded-[10px] bg-bg-50 p-1 sm:min-w-[300px]">
        <button
          className={`label-small rounded-[10px] px-4 py-1 transition-all ${
            sizesOpen
              ? "bg-bg-0 shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
              : "text-text-400"
          }`}
          onClick={() => setSizesOpen(true)}
        >
          Sizes
        </button>
        <button
          className={`label-small rounded-[10px] px-4 py-1 transition-all ${
            !sizesOpen
              ? "bg-bg-0 shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
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
