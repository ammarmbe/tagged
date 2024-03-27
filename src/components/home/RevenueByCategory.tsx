"use client";
import { formatCurrency, selectStyles } from "@/utils";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import ReactSelect from "react-select";
import { TRange } from "./RevenueOverview/RevenueOverview";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import Loading from "../primitives/Loading";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export default function RevenueByCategory() {
  const [range, setRange] = useState<TRange>({
    label: "Today",
    value: "day",
  });

  const {
    data: raw,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["revenue-by-category"],
    queryFn: async () => {
      const res = await fetch(
        `/api/home/revenue-by-category?range=${range.value}`,
      );
      return res.json() as Promise<
        {
          revenue: number;
          categories: string[];
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  const data = {
    labels: raw?.map((d) => d.categories.at(-1)) || [],
    datasets: [
      {
        label: "Revenue",
        data:
          raw?.map((d) => ({
            x: d.categories.at(-1),
            y: d.revenue,
          })) || [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card h-fit">
      <div className="flex items-center justify-between gap-5">
        <div className="flex gap-2">
          <RiMoneyDollarCircleLine size={24} className="text-icon-500" />
          <p className="label-medium">
            Revenue <span className="text-text-500">(by category)</span>
          </p>
        </div>
        <ReactSelect
          instanceId={"revenue-by-category"}
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
      <div className="relative p-4 pt-1">
        <Loading size={40} isFetching={isFetching} />
        <div className="flex h-96 w-full">
          <Bar
            data={data}
            options={{
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      let label = context.dataset.label || "";
                      if (context.parsed.y !== null) {
                        label += " " + formatCurrency(context.parsed.y);
                      }
                      return label;
                    },
                  },
                },
              },
              scales: {
                y: {
                  stacked: true,
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
