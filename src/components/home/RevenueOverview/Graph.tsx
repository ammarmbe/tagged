"use client";
import React, { useEffect } from "react";
import { TRange } from "./RevenueOverview";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "@/components/chart.css";
import { useQuery } from "@tanstack/react-query";
import { days, daysInMonth, formatCurrency, months } from "@/utils";
import Loading from "@/components/primitives/Loading";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export default function Graph({ range }: { range: TRange }) {
  const {
    data: raw,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["revenue-overview", "graphs"],
    queryFn: async () => {
      const res = await fetch(
        `/api/home/revenue-overview/graph?range=${range.value}`,
      );
      return res.json() as Promise<
        {
          revenue: number;
          date: string;
          type: "revenue" | "potential";
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  const data = {
    labels:
      range.value === "week"
        ? days()
        : range.value === "year"
          ? months(undefined, true)
          : range.value === "month"
            ? daysInMonth()
            : raw?.filter((d) => d.type === "revenue").map((d) => d.date) || [],
    datasets: [
      {
        label: "Revenue",
        data:
          raw
            ?.filter((d) => d.type === "revenue")
            .map((d) => ({
              x:
                range.value === "month"
                  ? d.date.trim().split("/").map(Number).join("/")
                  : d.date.trim(),
              y: d.revenue,
            })) || [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
      {
        label: "Potential Revenue",
        data:
          raw
            ?.filter((d) => d.type === "potential")
            .map((d) => ({
              x:
                range.value === "month"
                  ? d.date.trim().split("/").map(Number).join("/")
                  : d.date.trim(),
              y: d.revenue,
            })) || [],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgb(255, 159, 64)",
        borderWidth: 1,
      },
    ],
  };

  return (
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
  );
}
