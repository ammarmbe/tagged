"use client";
import { formatCurrency } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {
  RiArrowLeftDownLine,
  RiArrowRightUpLine,
  RiSubtractLine,
} from "react-icons/ri";
import Image from "next/image";
import Loading from "../primitives/Loading";

export default function Statistics() {
  const { data, isFetching } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const response = await fetch("/api/home/statistics");
      return response.json() as Promise<{
        conversion_rate: number;
        average_order_value: number;
        return_rate: number;
        prev_conversion_rate: number;
        prev_average_order_value: number;
        prev_return_rate: number;
      }>;
    },
    initialData: {
      conversion_rate: 0,
      average_order_value: 0,
      return_rate: 0,
      prev_conversion_rate: 0,
      prev_average_order_value: 0,
      prev_return_rate: 0,
    },
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-2 sm:gap-6">
      <div className="card relative !p-0">
        <Loading isFetching={isFetching} />
        <div className="flex flex-grow flex-col justify-between !p-5">
          <div className="flex w-full justify-between">
            <div className="h-fit rounded-full border p-2 text-icon-500 shadow-xs">
              {data.conversion_rate > data.prev_conversion_rate ? (
                <RiArrowRightUpLine size={24} />
              ) : data.conversion_rate === data.prev_conversion_rate ? (
                <RiSubtractLine size={24} />
              ) : (
                <RiArrowLeftDownLine size={24} />
              )}
            </div>
            <Image src="/chart.svg" height={40} width={120} alt="Chart" />
          </div>
          <div>
            <p className="paragraph-small mb-1 text-text-500">
              Conversion Rate
            </p>
            <div className="flex items-end justify-between">
              <p className="title-h4 flex items-center gap-2">
                {data.conversion_rate * 100 + "%"}
                <span
                  className={`subheading-2xsmall rounded-full px-1.5 py-0.5 ${
                    data.conversion_rate > data.prev_conversion_rate
                      ? "bg-[#CBF5E4] text-[#176448]"
                      : data.conversion_rate < data.prev_conversion_rate
                        ? "bg-[#F8C9D2] text-[#710E21]"
                        : "bg-[#F6F8FA] text-[#525866]"
                  }`}
                >
                  {data.conversion_rate > data.prev_conversion_rate ? "+" : ""}
                  {(
                    (data.conversion_rate - data.prev_conversion_rate) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="card relative !p-0">
        <Loading isFetching={isFetching} />
        <div className="flex flex-grow flex-col justify-between !p-5">
          <div className="flex w-full justify-between">
            <div className="h-fit rounded-full border p-2 text-icon-500 shadow-xs">
              {data.average_order_value > data.prev_average_order_value ? (
                <RiArrowRightUpLine size={24} />
              ) : data.average_order_value === data.prev_average_order_value ? (
                <RiSubtractLine size={24} />
              ) : (
                <RiArrowLeftDownLine size={24} />
              )}
            </div>
            <Image src="/chart.svg" height={40} width={120} alt="Chart" />
          </div>
          <div>
            <p className="paragraph-small mb-1 text-text-500">
              Average Order Value
            </p>
            <p className="title-h4 flex items-center gap-2">
              {formatCurrency(data.average_order_value)}
              <span
                className={`subheading-2xsmall rounded-full px-1.5 py-0.5 ${
                  data.average_order_value > data.prev_average_order_value
                    ? "bg-[#CBF5E4] text-[#176448]"
                    : data.average_order_value < data.prev_average_order_value
                      ? "bg-[#F8C9D2] text-[#710E21]"
                      : "bg-[#F6F8FA] text-[#525866]"
                }`}
              >
                {data.average_order_value > data.prev_average_order_value
                  ? "+"
                  : ""}
                {(
                  (data.average_order_value - data.prev_average_order_value) *
                  100
                ).toFixed(1)}
                %
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="card relative !p-0">
        <Loading isFetching={isFetching} />
        <div className="flex flex-grow flex-col justify-between !p-5">
          <div className="flex w-full justify-between">
            <div className="h-fit rounded-full border p-2 text-icon-500 shadow-xs">
              {data.return_rate > data.prev_return_rate ? (
                <RiArrowRightUpLine size={24} />
              ) : data.return_rate === data.prev_return_rate ? (
                <RiSubtractLine size={24} />
              ) : (
                <RiArrowLeftDownLine size={24} />
              )}
            </div>
            <Image src="/chart.svg" height={40} width={120} alt="Chart" />
          </div>
          <div>
            <p className="paragraph-small mb-1 text-text-500">Return Rate</p>
            <p className="title-h4 flex items-center gap-2">
              {data.return_rate * 100 + "%"}
              <span
                className={`subheading-2xsmall rounded-full px-1.5 py-0.5 ${
                  data.return_rate > data.prev_return_rate
                    ? "bg-[#CBF5E4] text-[#176448]"
                    : data.return_rate < data.prev_return_rate
                      ? "bg-[#F8C9D2] text-[#710E21]"
                      : "bg-[#F6F8FA] text-[#525866]"
                }`}
              >
                {data.return_rate > data.prev_return_rate ? "+" : ""}
                {((data.return_rate - data.prev_return_rate) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="card relative !p-0">
        <Loading isFetching={isFetching} />
        <div className="flex flex-grow flex-col justify-between !p-5">
          <div className="flex w-full justify-between">
            <div className="h-fit rounded-full border p-2 text-icon-500 shadow-xs">
              {0 > 1 ? (
                <RiArrowLeftDownLine size={24} />
              ) : (
                <RiArrowRightUpLine size={24} />
              )}
            </div>
            <Image src="/chart.svg" height={40} width={120} alt="Chart" />
          </div>
          <div>
            <p className="paragraph-small mb-1 text-text-500">
              Conversion Rate
            </p>
            <p className="title-h4 flex items-center gap-2">
              54.2%
              <span
                className={`subheading-2xsmall rounded-full px-1.5 py-0.5 ${
                  0 > 100
                    ? "bg-[#CBF5E4] text-[#176448]"
                    : 0 < 100
                      ? "bg-[#F8C9D2] text-[#710E21]"
                      : "bg-[#F6F8FA] text-[#525866]"
                }`}
              >
                {(0 > 100 ? "+" : "") + 40}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
