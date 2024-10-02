"use client";
import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { TRange } from "@/components/home/RevenueOverview/RevenueOverview";
import { formatCurrency } from "@/utils";
import Loading from "@/components/primitives/Loading";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
);

export default function Graph({
  range,
  nano_id,
}: {
  range: TRange;
  nano_id: string;
}) {
  const {
    data: raw,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["item-overview", "graphs", nano_id],
    queryFn: async () => {
      const res = await fetch(
        `/api/item/item-overview/graph?range=${range.value}&nano_id=${nano_id}`,
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

  const data = {
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
        backgroundColor: "#ef6820" + "33", // 33 is 20% opacity
        pointHoverRadius: 4,
        pointRadius: 0,
        pointBackgroundColor: "#ef6820",
        borderColor: "#ef6820",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="relative p-4 pt-1">
      <Loading size={40} isLoading={isLoading} />
      <div className="flex h-96 w-full">
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
  );
}
