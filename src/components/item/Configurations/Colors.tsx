"use client";
import { LuDot } from "react-icons/lu";
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
    isFetching,
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
      <Loading size={40} isFetching={isFetching} />
      <div className="grid min-h-[100px] grid-cols-1 gap-2 p-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-1">
        {item_colors?.map((color) => (
          <div
            key={color.name}
            className="h-fit space-y-1 rounded-xl p-4"
            style={{
              background: `linear-gradient(${
                colors[color.name.toLowerCase()]?.light ?? "#C2D6FF"
              }, ${colors[color.name.toLowerCase()]?.lighter ?? "#EBF1FF"})`,
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
                  <p className="label-xsmall rounded-full bg-white px-2 py-0.5 text-text-500">
                    {formatCurrency(color.revenue)}
                  </p>
                }
              />
            </div>
            <div
              className="label-small flex items-center gap-0.5 !font-normal"
              style={{
                color: colors[color.name.toLowerCase()]?.text
                  ? colors[color.name.toLowerCase()]?.text + "B8"
                  : "#162664B8",
              }}
            >
              <Tooltip
                trigger={
                  <p className="underline-offset-2 hover:underline">
                    {color.sizes.length} sizes
                  </p>
                }
                content={color.sizes.join(", ")}
              />
              <LuDot size={16} className="text-[#162664B8]" />
              <p>{color.quantity} in stock</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
