"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiExpandUpDownLine,
} from "react-icons/ri";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ReactSelect from "react-select";
import { formatCurrency, selectStyles, useFilters } from "@/utils";
import Spinner from "../primitives/Spinner";
import Filters from "./Filters";
import Status from "../Status";

type TFilters = {
  status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "completed"
    | "store_cancelled"
    | "customer_cancelled";
  total_price_min: number;
  total_price_max: number;
  total_items_min: number;
  total_items_max: number;
  total_discount_min: number;
  total_discount_max: number;
  governorates: string[];
  created_at_min: string;
  created_at_max: string;
};

type TOrder = {
  total_count: number;
  id: number;
  nano_id: string;
  status: TFilters["status"];
  total_price: number;
  total_items: number;
  total_discount: number;
  governorate: string;
  created_at: string;
};

const columnHelper = createColumnHelper<TOrder>();

const columns = [
  columnHelper.accessor("nano_id", {
    id: "id",
    header: () => "ID",
    cell: (info) => info.renderValue(),
    size: 12.5,
  }),
  columnHelper.accessor("total_price", {
    id: "total_price",
    header: () => "Price",
    cell: (info) => formatCurrency(info.getValue()),
    size: 12.5,
  }),
  columnHelper.accessor("total_discount", {
    id: "total_discount",
    header: () => "Discount",
    cell: (info) => formatCurrency(info.getValue()),
    size: 12.5,
  }),
  columnHelper.accessor("total_items", {
    id: "total_items",
    header: () => "Item Count",
    cell: (info) => info.renderValue(),
    size: 12.5,
  }),
  columnHelper.accessor("governorate", {
    id: "governorate",
    header: () => "Governorate",
    cell: (info) => info.renderValue(),
    size: 12.5,
  }),
  columnHelper.accessor("created_at", {
    id: "created_at",
    header: () => "Created At",
    cell: (info) =>
      new Intl.DateTimeFormat("en-EG", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(info.getValue() as string)),
    size: 15,
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: () => "Status",
    cell: (info) => <Status status={info.getValue()} />,
    size: 10,
  }),
];

export default function Table() {
  const searchParams = useSearchParams();
  const filters = useFilters();
  const [data, setData] = useState<TOrder[]>([]);
  const [orderBy, setOrderBy] = useState<{
    column:
      | "status"
      | "total_price"
      | "total_items"
      | "total_discount"
      | "governorate"
      | "created_at";
    direction: "asc" | "desc";
  }>();
  const [limit, setLimit] = useState(10);
  const router = useRouter();

  const orderFilters = useMemo(() => {
    let filters = {} as TFilters;

    const status = searchParams.get("status");

    const total_price_min = searchParams.get("total_price_min");
    const total_price_max = searchParams.get("total_price_max");
    const total_items_min = searchParams.get("total_items_min");
    const total_items_max = searchParams.get("total_items_max");
    const total_discount_min = searchParams.get("total_discount_min");
    const total_discount_max = searchParams.get("total_discount_max");
    const governorates = searchParams.getAll("governorates");
    const created_at_min = searchParams.get("created_at_min");
    const created_at_max = searchParams.get("created_at_max");

    if (status) filters.status = status as TFilters["status"];
    if (total_price_min) filters.total_price_min = +total_price_min;
    if (total_price_max) filters.total_price_max = +total_price_max;
    if (total_items_min) filters.total_items_min = +total_items_min;
    if (total_items_max) filters.total_items_max = +total_items_max;
    if (total_discount_min) filters.total_discount_min = +total_discount_min;
    if (total_discount_max) filters.total_discount_max = +total_discount_max;
    if (governorates.length) filters.governorates = governorates;
    if (created_at_min) filters.created_at_min = created_at_min;
    if (created_at_max) filters.created_at_max = created_at_max;

    return filters;
  }, [searchParams]);

  const {
    data: raw,
    refetch,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/orders`, {
        method: "POST",
        body: JSON.stringify({
          ...orderFilters,
          orderBy,
          limit: limit * 2,
          pageParam,
        }),
      });
      return res.json() as Promise<TOrder[]>;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.length > limit * 2) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
  });

  useEffect(() => {
    if (raw) {
      setData(raw.pages.flat());
    }
  }, [raw]);

  useEffect(() => {
    refetch();
  }, [orderFilters, orderBy, limit, refetch]);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: limit,
        pageIndex: 0,
      },
    },
    autoResetPageIndex: false,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    table.setPageSize(limit);
  }, [limit, table]);

  useEffect(() => {
    table.setPageIndex(0);
  }, [orderFilters, orderBy, table]);

  return (
    <>
      <div className="flex justify-between gap-3 pb-4 pt-6">
        <div className="hidden min-w-[300px] grid-cols-5 gap-4 rounded-[10px] bg-bg-100 p-1 sm:grid">
          <button
            className={`label-small rounded-[10px] px-4 py-1 transition-all ${
              !orderFilters.status
                ? "bg-white shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
                : "text-text-400"
            }`}
            onClick={() => filters.clear("status")}
          >
            All
          </button>
          <button
            className={`label-small rounded-[10px] px-4 py-1 transition-all ${
              orderFilters.status === "pending"
                ? "bg-white shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
                : "text-text-400"
            }`}
            onClick={() => filters.set("status", "pending")}
          >
            Pending
          </button>
          <button
            className={`label-small rounded-[10px] px-4 py-1 transition-all ${
              orderFilters.status === "confirmed"
                ? "bg-white shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
                : "text-text-400"
            }`}
            onClick={() => filters.set("status", "confirmed")}
          >
            Confirmed
          </button>
          <button
            className={`label-small rounded-[10px] px-4 py-1 transition-all ${
              orderFilters.status === "shipped"
                ? "bg-white shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
                : "text-text-400"
            }`}
            onClick={() => filters.set("status", "shipped")}
          >
            Shipped
          </button>
          <button
            className={`label-small rounded-[10px] px-4 py-1 transition-all ${
              orderFilters.status === "completed"
                ? "bg-white shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
                : "text-text-400"
            }`}
            onClick={() => filters.set("status", "completed")}
          >
            Completed
          </button>
        </div>
        <Filters />
      </div>
      <div className="flex flex-grow flex-col justify-between gap-10">
        <div className="relative flex-grow">
          <div
            className={`absolute inset-0 flex flex-col ${
              isFetching ? "" : "pointer-events-none"
            }`}
          >
            <div className="h-[2.25rem] w-full" />
            {isFetching ? (
              <div className="z-10 flex flex-grow items-center justify-center bg-white/40 backdrop-blur-[2px]">
                <Spinner size={44} fill="fill-main-base" />
              </div>
            ) : null}
          </div>
          <div className="flex-grow overflow-auto">
            <table className="w-full min-w-[1400px] table-fixed">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="paragraph-small bg-bg-100 px-6 py-2 font-normal text-text-500 first:rounded-l-lg last:rounded-r-lg"
                        style={{
                          width: header.column.columnDef.size + "%",
                        }}
                      >
                        <button
                          className="flex items-center gap-1"
                          onClick={() => {
                            if (
                              orderBy?.column === header.column.columnDef.id &&
                              orderBy?.direction === "desc"
                            )
                              setOrderBy(undefined);
                            else if (
                              orderBy?.column === header.column.columnDef.id &&
                              orderBy?.direction === "asc"
                            )
                              setOrderBy({
                                column: header.column.columnDef.id as
                                  | "status"
                                  | "total_price"
                                  | "total_items"
                                  | "total_discount"
                                  | "governorate"
                                  | "created_at",
                                direction: "desc",
                              });
                            else
                              header.column.columnDef.id &&
                                setOrderBy({
                                  column: header.column.columnDef.id as
                                    | "status"
                                    | "total_price"
                                    | "total_items"
                                    | "total_discount"
                                    | "governorate"
                                    | "created_at",
                                  direction: "asc",
                                });
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.columnDef.id !== "id" ? (
                                header.column.columnDef.id ===
                                orderBy?.column ? (
                                  orderBy?.direction === "asc" ? (
                                    <RiArrowUpSLine size={16} />
                                  ) : orderBy?.direction === "desc" ? (
                                    <RiArrowDownSLine size={16} />
                                  ) : (
                                    <RiExpandUpDownLine
                                      size={16}
                                      className="inline"
                                    />
                                  )
                                ) : (
                                  <RiExpandUpDownLine
                                    size={16}
                                    className="inline"
                                  />
                                )
                              ) : null}
                            </>
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="peer cursor-pointer border-t first:border-t-0 hover:border-transparent hover:bg-bg-100 [&+tr]:hover:border-transparent"
                    role="button"
                    onClick={() => {
                      router.push("/order/" + row.original.nano_id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        router.push("/order/" + row.original.nano_id);
                    }}
                    tabIndex={0}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`paragraph-medium truncate px-6 py-4 first:rounded-l-xl last:rounded-r-xl ${
                          cell.column.columnDef.id !== "total_price"
                            ? "text-text-500"
                            : ""
                        }`}
                        style={{
                          width: cell.column.columnDef.size + "%",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <footer className="pb-4 sm:pb-7">
          <div className="grid grid-cols-2 sm:grid-cols-3">
            <p className="paragraph-small self-center text-text-500">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.ceil((data[0]?.total_count || limit) / limit)}
            </p>
            <div className="flex items-center gap-3 self-center justify-self-end sm:justify-self-center">
              <button
                className="rounded-[10px] border border-transparent p-2 text-text-500 transition-all hover:bg-bg-100 hover:text-text-900 active:bg-white active:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#E4E5E7] disabled:text-text-300 disabled:shadow-none"
                disabled={table.getState().pagination.pageIndex === 0}
                onClick={() =>
                  table.setPageIndex(table.getState().pagination.pageIndex - 1)
                }
              >
                <RiArrowLeftSLine size={18} />
              </button>
              {Array.from({
                length: Math.ceil(data[0]?.total_count / limit) || 1,
              }).map((_, i) => {
                const total = Math.ceil(data[0]?.total_count / limit);
                const current = table.getState().pagination.pageIndex + 1;
                const number = i + 1;

                if (total > 7) {
                  if (number < 6 || number === total)
                    return (
                      <span
                        key={i}
                        className={`${
                          i === table.getState().pagination.pageIndex
                            ? "label-small text-text-900"
                            : "label-small hidden text-text-400 sm:inline"
                        }`}
                      >
                        {i + 1}
                      </span>
                    );
                  if (number === 6 && number === current)
                    return (
                      <Fragment key={i}>
                        <span
                          className={`${
                            i === table.getState().pagination.pageIndex
                              ? "label-small text-text-900"
                              : "label-small hidden text-text-400 sm:inline"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="label-small hidden text-text-400 sm:inline">
                          ...
                        </span>
                      </Fragment>
                    );
                  if (number < total - 1 && number === current)
                    return (
                      <Fragment key={i}>
                        <span className="label-small hidden text-text-400 sm:inline">
                          ...
                        </span>
                        <span
                          className={`${
                            i === table.getState().pagination.pageIndex
                              ? "label-small text-text-900"
                              : "label-small hidden text-text-400 sm:inline"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="label-small hidden text-text-400 sm:inline">
                          ...
                        </span>
                      </Fragment>
                    );
                  if (number === current)
                    return (
                      <Fragment key={i}>
                        <span className="label-small hidden text-text-400 sm:inline">
                          ...
                        </span>
                        <span
                          className={`${
                            i === table.getState().pagination.pageIndex
                              ? "label-small text-text-900"
                              : "label-small hidden text-text-400 sm:inline"
                          }`}
                        >
                          {i + 1}
                        </span>
                      </Fragment>
                    );

                  if (number === 7 && (current < 6 || current === total))
                    return (
                      <span
                        key={i}
                        className="label-small hidden text-text-400 sm:inline"
                      >
                        ...
                      </span>
                    );
                } else {
                  return (
                    <span
                      key={i}
                      className={`${
                        i === table.getState().pagination.pageIndex
                          ? "label-small text-text-900"
                          : "label-small hidden text-text-400 sm:inline"
                      }`}
                    >
                      {i + 1}
                    </span>
                  );
                }
              })}
              <button
                className="rounded-[10px] border border-transparent p-2 text-text-500 transition-all hover:bg-bg-100 hover:text-text-900 active:bg-white active:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#E4E5E7] disabled:text-text-300 disabled:shadow-none"
                onClick={async () => {
                  await fetchNextPage();
                  table.setPageIndex(table.getState().pagination.pageIndex + 1);
                }}
                disabled={
                  table.getState().pagination.pageIndex + 1 ===
                  (Math.ceil(data[0]?.total_count / limit) || 1)
                }
              >
                <RiArrowRightSLine size={18} />
              </button>
            </div>
            <div className="hidden self-center justify-self-end sm:block">
              <ReactSelect
                instanceId={"limit"}
                styles={selectStyles({ size: "xs", width: "120px" })}
                options={[
                  {
                    value: 5,
                    label: "5 / page",
                  },
                  {
                    value: 10,
                    label: "10 / page",
                  },
                  {
                    value: 20,
                    label: "20 / page",
                  },
                  {
                    value: 50,
                    label: "50 / page",
                  },
                ]}
                defaultValue={{
                  value: limit,
                  label: `${limit} / page`,
                }}
                onChange={(e: any) => setLimit(e.value)}
                menuPlacement="top"
              />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
