"use client";
import { useEffect } from "react";
import { TRange } from "../../home/RevenueOverview/RevenueOverview";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils";
import Tooltip from "../../primitives/Tooltip";
import Loading from "../../primitives/Loading";

const colors = {
  blue: {
    lighter: "#EBF1FF",
    light: "#C2D6FF",
    text: "#162664",
  },
  orange: {
    lighter: "#FEF3EB",
    light: "#FFDAC2",
    text: "#6E330C",
  },
  yellow: {
    lighter: "#FEF7EC",
    light: "#FBDFB1",
    text: "#693D11",
  },
  red: {
    lighter: "#FDEDF0",
    light: "#F8C9D2",
    text: "#710E21",
  },
  green: {
    lighter: "#EFFAF6",
    light: "#CBF5E4",
    text: "#176448",
  },
  purple: {
    lighter: "#EEEBFF",
    light: "#CAC2FF",
    text: "#2B1664",
  },
  pink: {
    lighter: "#FDEBFF",
    light: "#F9C2FF",
    text: "#620F6C",
  },
  teal: {
    lighter: "#EBFAFF",
    light: "#C2EFFF",
    text: "#164564",
  },
} as {
  [key: string]: {
    light: string;
    lighter: string;
    text: string;
  };
};

export default function Colors({
  nano_id,
  range,
}: {
  nano_id: string;
  range: TRange;
}) {
  const {
    data: item_colors,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["item-colors", nano_id],
    queryFn: async () => {
      const res = await fetch(
        `/api/item/colors?nano_id=${nano_id}&range=${range.value}`,
      );
      return res.json() as Promise<
        {
          name: string;
          hex: string;
          quantity: number;
          sizes: string[];
          revenue: number;
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [range, refetch]);

  return (
    <div className="relative flex-grow overflow-hidden rounded-b-2xl">
      <Loading size={40} isLoading={isLoading} />
      <div className="grid min-h-[100px] grid-cols-1 gap-2 p-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-1">
        {item_colors?.map((color) => (
          <div
            key={color.name}
            className="h-fit space-y-1 rounded-xl p-4"
            style={{
              background: `linear-gradient(${
                colors[color.name.toLowerCase()]?.light ?? "#ffffff"
              }, ${colors[color.name.toLowerCase()]?.lighter ?? "#ffffff"})`,
              border: `1px solid ${colors[color.name.toLowerCase()] ? "transparent" : "#e1e4e9"}`,
            }}
          >
            <div className="flex w-full items-center justify-between">
              <p
                className="label-medium"
                style={{
                  color: colors[color.name.toLowerCase()]?.text ?? "#162664",
                }}
              >
                {color.name}
              </p>
              <Tooltip
                content="Revenue in the selected range."
                trigger={
                  <p
                    className={`label-xsmall rounded-full px-2 py-0.5 text-text-600 ${
                      colors[color.name.toLowerCase()] ? "bg-bg-0" : "bg-bg-200"
                    }`}
                  >
                    {formatCurrency(color.revenue)}
                  </p>
                }
              />
            </div>
            <p
              className="label-small !font-normal"
              style={{
                color: colors[color.name.toLowerCase()]?.text
                  ? colors[color.name.toLowerCase()]?.text + "B8"
                  : "#162664B8",
              }}
            >
              {color.quantity} in stock
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
