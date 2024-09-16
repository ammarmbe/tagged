"use client";
import { selectStyles } from "@/utils";
import { RiEye2Line } from "react-icons/ri";
import ReactSelect from "react-select";
import { TRange } from "./RevenueOverview/RevenueOverview";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import Loading from "../primitives/Loading";
import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip,
  BarElement,
} from "chart.js";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export default function ViewsByCategory() {
  const [range, setRange] = useState<TRange>({
    label: "Today",
    value: "day",
  });

  const {
    data: raw,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["views-by-category"],
    queryFn: async () => {
      const res = await fetch(
        `/api/home/views-by-category?range=${range.value}`,
      );
      return res.json() as Promise<
        {
          views: number;
          category: string[];
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  const data = {
    labels: raw?.map((d) => d.category?.at(-1)) || [],
    datasets: [
      {
        label: "Views",
        data:
          raw?.map((d) => ({
            x: d.category?.at(-1),
            y: d.views,
          })) || [],
        backgroundColor: "#6E3FF3",
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="card h-fit">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="flex gap-2">
          <RiEye2Line size={24} className="text-text-600" />
          <p className="label-medium">
            Views <span className="text-text-600">(by category)</span>
          </p>
        </div>
        <ReactSelect
          instanceId={"views-by-category"}
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
      <div className="relative p-4 pt-1">
        <Loading size={40} isFetching={isFetching} />
        <div className="flex h-72 w-full">
          <Bar
            data={data}
            options={{
              interaction: {
                intersect: false,
                mode: "index",
              },
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      let label = context.dataset.label || "";
                      if (context.parsed.y !== null) {
                        label += " " + context.parsed.y;
                      }
                      return label;
                    },
                  },
                },
              },
              scales: {
                y: {
                  stacked: true, // show at most 5 ticks
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 6,
                  },
                  beginAtZero: true,
                },
                x: {
                  stacked: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
