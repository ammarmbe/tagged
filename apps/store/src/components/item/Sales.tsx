import { formatCurrency, useUser } from "@/utils";
import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import Spinner from "../primitives/Spinner";
import Status from "../Status";
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiBarcodeLine,
  RiExpandUpDownLine,
} from "react-icons/ri";
import { useRouter } from "next/navigation";

type TSale = {
  total_count: number;
  id: number;
  price: number;
  quantity: number;
  color: string;
  size: string;
  order_id: string;
  discount: number;
  created_at: string;
  status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "completed"
    | "store_cancelled"
    | "customer_cancelled"
    | "return_requested"
    | "return_declined"
    | "return_accepted"
    | "returned";
};

const columnHelper = createColumnHelper<TSale>();

const columns = [
  columnHelper.accessor("order_id", {
    id: "order_id",
    header: () => "Order ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("price", {
    id: "price",
    header: () => "Price",
    cell: (info) => formatCurrency(info.renderValue()),
  }),
  columnHelper.accessor("discount", {
    id: "discount",
    header: () => "Discount",
    cell: (info) => formatCurrency(info.renderValue()),
  }),
  columnHelper.accessor("color", {
    id: "color",
    header: () => "Color",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("size", {
    id: "size",
    header: () => "Size",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("created_at", {
    id: "created_at",
    header: () => "Created at",
    cell: (info) =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(info.renderValue() as string)),
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: () => "Status",
    cell: (info) => <Status status={info.renderValue()} />,
  }),
];

export default function ItemSales({ nano_id }: { nano_id: string }) {
  const { user } = useUser();
  const router = useRouter();

  const [data, setData] = useState<TSale[]>([]);
  const [orderBy, setOrderBy] = useState<{
    column: "name" | "price" | "quantity" | "category" | "discount" | "revenue";
    direction: "asc" | "desc";
  }>();

  const {
    data: raw,
    refetch,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/item/item-sales`, {
        method: "POST",
        body: JSON.stringify({
          nano_id,
          orderBy,
          pageParam,
        }),
      });
      return res.json() as Promise<TSale[]>;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.length > 10) return undefined;
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
  }, [orderBy, refetch]);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    autoResetPageIndex: false,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [orderBy, table]);

  return (
    <div className="card">
      <div className="flex gap-2">
        <RiBarcodeLine size={24} className="text-text-600" />
        <p className="label-medium">Item Sales</p>
      </div>
      <div className="border-t" />
      <div className="flex flex-col gap-4">
        <div className="overflow-auto">
          <table className="min-h-[200px] w-full min-w-[1000px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`paragraph-small bg-bg-50 py-2 font-normal text-text-600 first:rounded-l-lg last:rounded-r-lg ${user?.feature_flags.table_size === "compact" ? "px-4" : "px-6"}`}
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
                                | "name"
                                | "price"
                                | "quantity"
                                | "category"
                                | "discount"
                                | "revenue",
                              direction: "desc",
                            });
                          else
                            header.column.columnDef.id &&
                              setOrderBy({
                                column: header.column.columnDef.id as
                                  | "name"
                                  | "price"
                                  | "quantity"
                                  | "category"
                                  | "discount"
                                  | "revenue",
                                direction: "asc",
                              });
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.columnDef.id !== "id" ? (
                          header.column.columnDef.id === orderBy?.column ? (
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
                            <RiExpandUpDownLine size={16} className="inline" />
                          )
                        ) : null}
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="relative">
              {isFetching ? (
                <tr className="bg-bg-0/40 absolute inset-0 z-10 backdrop-blur-[2px]">
                  <td className="absolute inset-0 flex items-center justify-center">
                    <Spinner size={44} fill="fill-main-base" />
                  </td>
                </tr>
              ) : null}
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="peer cursor-pointer border-t first:border-t-0 hover:border-transparent hover:bg-bg-50 [&+tr]:hover:border-transparent"
                  role="button"
                  onClick={() => {
                    router.push("/order/" + row.original.order_id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      router.push("/order/" + row.original.order_id);
                  }}
                  tabIndex={0}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`paragraph-medium truncate text-text-600 first:rounded-l-xl last:rounded-r-xl ${user?.feature_flags.table_size === "compact" ? "px-4 py-2" : "px-6 py-4"}`}
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
        <footer>
          <div className="grid grid-cols-2">
            <p className="paragraph-small self-center text-text-600">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.ceil((data[0]?.total_count ?? 5) / 5)}
            </p>
            <div className="flex items-center gap-3 self-center justify-self-end">
              <button
                className="rounded-[10px] border border-transparent p-2 text-text-600 transition-all hover:bg-bg-50 hover:text-text-950 active:bg-bg-0 active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#E4E5E7] disabled:border-white disabled:bg-bg-0 disabled:text-text-300 disabled:shadow-none"
                disabled={table.getState().pagination.pageIndex === 0}
                onClick={() =>
                  table.setPageIndex(table.getState().pagination.pageIndex - 1)
                }
              >
                <RiArrowLeftSLine size={18} />
              </button>
              {Array.from({
                length: Math.ceil(data[0]?.total_count / 5),
              }).map((_, i) => (
                <span
                  key={i}
                  className={`${
                    i === table.getState().pagination.pageIndex
                      ? "label-small text-text-950"
                      : "label-small text-text-400"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
              <button
                className="rounded-[10px] border border-transparent p-2 text-text-600 transition-all hover:bg-bg-50 hover:text-text-950 active:bg-bg-0 active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#E4E5E7] disabled:border-white disabled:bg-bg-0 disabled:text-text-300 disabled:shadow-none"
                onClick={async () => {
                  await fetchNextPage();
                  table.setPageIndex(table.getState().pagination.pageIndex + 1);
                }}
                disabled={
                  table.getState().pagination.pageIndex + 1 ===
                  (Math.ceil((data[0]?.total_count || 5) / 5) || 1)
                }
              >
                <RiArrowRightSLine size={18} />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
