"use client";
import React, { useEffect } from "react";
import { TRange } from "./RevenueOverview";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ChartData,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "@/components/chart.css";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils";
import Loading from "@/components/primitives/Loading";

ChartJS.register(
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Filler,
);

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
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  const data: ChartData<
    "line",
    {
      x: string;
      y: number;
    }[],
    string
  > = {
    labels: raw?.map((d) => d.date) || [],
    datasets: [
      {
        label: "Revenue",
        data:
          raw?.map((d) => ({
            x: d.date,
            y: d.revenue,
          })) || [],
        fill: "origin",
        backgroundColor: "#6E3FF3" + "33", // 33 is 20% opacity
        pointHoverRadius: 4,
        pointRadius: 2,
        pointBackgroundColor: "#6E3FF3",
        borderColor: "#6E3FF3",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="relative p-4 pt-1">
      <Loading size={40} isFetching={isFetching} />
      <div className="flex h-72 w-full">
        <Line
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
                // show at most 5 ticks
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
  );
}
