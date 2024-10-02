"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import Input from "../primitives/Input";
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiSearch2Line,
  RiExpandUpDownLine,
  RiDeleteBinLine,
  RiCloseLine,
} from "react-icons/ri";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ReactSelect from "react-select";
import { formatCurrency, selectStyles, useFilters, useUser } from "@/utils";
import Spinner from "../primitives/Spinner";
import { useDebouncedCallback } from "use-debounce";
import Filters from "./Filters";
import Button from "../primitives/Button";
import DialogComponent from "../primitives/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "@/components/primitives/toast/use-toast";

type TFilters = {
  availability: "all" | "in_stock" | "out_of_stock";
  name: string;
  quantity_min: number;
  quantity_max: number;
  price_min: number;
  price_max: number;
  category: string;
  discount: boolean;
  discount_min: number;
  discount_max: number;
  revenue_min: number;
  revenue_max: number;
};

type TItem = {
  total_count: number;
  id: number;
  nano_id: string;
  name: string;
  price: number;
  quantity: number;
  category: string[];
  discount: number;
  revenue: number;
};

const columnHelper = createColumnHelper<TItem>();

export default function Table() {
  const searchParams = useSearchParams();
  const filters = useFilters();
  const [data, setData] = useState<TItem[]>([]);
  const [orderBy, setOrderBy] = useState<{
    column: "name" | "price" | "quantity" | "category" | "discount" | "revenue";
    direction: "asc" | "desc";
  }>();
  const [limit, setLimit] = useState(10);
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteText, setDeleteText] = useState("");
  const { user } = useUser();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "checkbox",
        header: () => (
          <input
            type="checkbox"
            checked={selected.length === data.length}
            onChange={() => {
              if (selected.length === data.length) {
                setSelected([]);
              } else {
                setSelected(data.map((item) => item.id));
              }
            }}
            className="checkbox"
          />
        ),
        cell: (info) => (
          <div className="flex h-full w-full items-center justify-center">
            <input
              type="checkbox"
              checked={selected.includes(info.row.original.id)}
              onChange={() => {
                if (selected.includes(info.row.original.id)) {
                  setSelected(
                    selected.filter((id) => id !== info.row.original.id),
                  );
                } else {
                  setSelected([...selected, info.row.original.id]);
                }
              }}
              className="checkbox"
            />
          </div>
        ),
      }),
      columnHelper.accessor("nano_id", {
        id: "id",
        header: () => "ID",
        cell: (info) => info.renderValue(),
        size: 12.5,
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: () => "Name",
        cell: (info) => info.renderValue(),
        size: 20,
      }),
      columnHelper.accessor("discount", {
        id: "discount",
        header: () => "Price (discounted)",
        cell: (info) =>
          formatCurrency(info.row.original.price - (info.renderValue() || 0)),
        size: 15,
      }),
      columnHelper.accessor("price", {
        id: "price",
        header: () => "Price",
        cell: (info) => formatCurrency(info.renderValue()),
        size: 10,
      }),
      columnHelper.accessor("revenue", {
        id: "revenue",
        header: () => "Revenue",
        cell: (info) => formatCurrency(info.renderValue()),
        size: 10,
      }),
      columnHelper.accessor("quantity", {
        id: "quantity",
        header: () => "Inventory",
        cell: (info) => info.renderValue(),
        size: 10,
      }),

      columnHelper.accessor("category", {
        id: "category",
        header: () => "Category",
        cell: (info) => (
          <span className="capitalize">{info.renderValue()?.at(-1)}</span>
        ),
        size: 12.5,
      }),
      columnHelper.display({
        id: "status",
        header: () => "Status",
        cell: (info) => (
          <span className="flex w-full items-center justify-center">
            <span
              className={`label-xsmall rounded-full px-1.5 py-0.5 ${
                info.row.original.quantity > 0
                  ? "bg-[#CBF5E4] text-[#176448]"
                  : "bg-[#F8C9D2] text-[#710E21]"
              }`}
            >
              {info.row.original.quantity > 0 ? "In stock" : "Out of stock"}
            </span>
          </span>
        ),
        size: 12.5,
      }),
    ],
    [selected, data],
  );

  const itemFilters = useMemo(() => {
    let filters = {} as TFilters;

    const name = searchParams.get("name");
    const availability = searchParams.get("availability");
    const quantity_min = searchParams.get("quantity_min");
    const quantity_max = searchParams.get("quantity_max");
    const price_min = searchParams.get("price_min");
    const price_max = searchParams.get("price_max");
    const category = searchParams.get("category");
    const discount = searchParams.get("discount");
    const discount_min = searchParams.get("discount_min");
    const discount_max = searchParams.get("discount_max");
    const revenue_min = searchParams.get("revenue_min");
    const revenue_max = searchParams.get("revenue_max");

    if (name) {
      filters.name = name;
    }
    if (availability) {
      filters.availability = availability as TFilters["availability"];
    }
    if (quantity_min) {
      filters.quantity_min = parseInt(quantity_min);
    }
    if (quantity_max) {
      filters.quantity_max = parseInt(quantity_max);
    }
    if (price_min) {
      filters.price_min = parseInt(price_min);
    }
    if (price_max) {
      filters.price_max = parseInt(price_max);
    }
    if (quantity_max) {
      filters.quantity_max = parseInt(quantity_max);
    }
    if (category) {
      filters.category = category;
    }
    if (discount) {
      filters.discount = discount === "true";
    }
    if (discount_min) {
      filters.discount_min = parseInt(discount_min);
    }
    if (discount_max) {
      filters.discount_max = parseInt(discount_max);
    }
    if (revenue_min) {
      filters.revenue_min = parseInt(revenue_min);
    }
    if (revenue_max) {
      filters.revenue_max = parseInt(revenue_max);
    }

    return filters;
  }, [searchParams]);

  const debounced = useDebouncedCallback((value) => {
    if (value) filters.set("name", value);
    else filters.clear("name");
  }, 500);

  const stockMutation = useMutation({
    mutationKey: ["stock-mutation", selected],
    mutationFn: async ({ selected }: { selected: true | number[] }) => {
      const res = await fetch("/api/items/out-of-stock", {
        method: "POST",
        body: JSON.stringify({
          selected,
        }),
      });

      return res.ok;
    },
    onSuccess(ok) {
      ok
        ? toast({
            title: "Your changes have been saved successfully",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });
      refetch();

      setSelected([]);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-items"],
    mutationFn: async ({
      text,
      selected,
    }: {
      text: string;
      selected: true | number[];
    }) => {
      if (text !== "DELETE" || !selected) return;

      const res = await fetch(`/api/items/delete`, {
        method: "DELETE",
        body: JSON.stringify({ selected }),
      });

      return res.ok;
    },
    onSuccess: async (ok) => {
      ok
        ? toast({
            title: "Your changes have been saved successfully",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });
      refetch();

      setSelected([]);
    },
  });

  const {
    data: raw,
    refetch,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/items`, {
        method: "POST",
        body: JSON.stringify({
          ...itemFilters,
          orderBy,
          limit: limit * 2,
          pageParam,
        }),
      });
      return res.json() as Promise<TItem[]>;
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
  }, [itemFilters, orderBy, limit, refetch]);

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
  }, [itemFilters, orderBy, table]);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 pb-4 pt-6">
        <div className="hidden min-w-[300px] grid-cols-3 gap-4 rounded-[10px] bg-bg-50 p-1 sm:grid">
          <button
            className={`label-small rounded-[10px] px-4 py-1 transition-all ${
              !itemFilters.availability
                ? "bg-bg-0 shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
                : "text-text-400"
            }`}
            onClick={() => filters.clear("availability")}
          >
            All
          </button>
          <button
            className={`label-small rounded-[10px] px-4 py-1 transition-all ${
              itemFilters.availability === "in_stock"
                ? "bg-bg-0 shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
                : "text-text-400"
            }`}
            onClick={() => filters.set("availability", "in_stock")}
          >
            In stock
          </button>
          <button
            className={`label-small rounded-[10px] px-4 py-1 transition-all ${
              itemFilters.availability === "out_of_stock"
                ? "bg-bg-0 shadow-[0px_2px_4px_0px_#1B1C1D05,0px_6px_10px_0px_#1B1C1D0F]"
                : "text-text-400"
            }`}
            onClick={() => filters.set("availability", "out_of_stock")}
          >
            Out of stock
          </button>
        </div>
        <div className="flex max-w-full items-center gap-3">
          {selected.length > 0 ? (
            <>
              <p className="label-small text-text-400">
                {selected.length} / {data.length} selected
              </p>
              <DialogComponent trigger={<Button text="Set out of stock" />}>
                <div className="flex gap-4 p-4">
                  <div className="h-fit rounded-full border p-2.5 text-text-600">
                    <RiDeleteBinLine size={24} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="label-medium">Are you sure?</p>
                      <DialogClose asChild>
                        <Button
                          iconLeft={<RiCloseLine size={20} />}
                          color="gray"
                          className="!rounded-full !border-none !p-0.5"
                        />
                      </DialogClose>
                    </div>
                    <p className="paragraph-small mt-1 text-text-600">
                      You are about to{" "}
                      <span className="font-medium text-text-950">
                        set {selected.length} item
                        {selected.length !== 1 ? "s" : ""} to out of stock.
                      </span>{" "}
                      You&apos;ll have to change{" "}
                      {selected.length !== 1 ? "them" : "it"} back manually if
                      you want to undo this change.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4 pt-0">
                  <DialogClose asChild>
                    <Button
                      text="Cancel"
                      size="md"
                      color="gray"
                      className="justify-center"
                    />
                  </DialogClose>
                  <Button
                    text="Set out of stock"
                    size="md"
                    color="danger"
                    className="justify-center"
                    disabled={stockMutation.isPending}
                    onClick={() => {
                      stockMutation.mutate({
                        selected,
                      });
                    }}
                  />
                </div>
              </DialogComponent>
              <DialogComponent
                trigger={<Button iconLeft={<RiDeleteBinLine size={20} />} />}
              >
                <div className="pointer-events-auto h-fit min-w-[350px] max-w-2xl rounded-2xl bg-bg-0 sm:max-w-md">
                  <div className="flex gap-4 p-4">
                    <div className="h-fit rounded-full border p-2.5 text-text-600">
                      <RiDeleteBinLine size={24} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="label-medium">Are you sure?</p>
                        <DialogClose asChild>
                          <Button
                            iconLeft={<RiCloseLine size={20} />}
                            color="gray"
                            className="!rounded-full !border-none !p-0.5"
                          />
                        </DialogClose>
                      </div>
                      <p className="paragraph-small mt-1 text-text-600">
                        You are about to{" "}
                        <span className="font-medium text-text-950">
                          delete {selected.length} item
                          {selected.length !== 1 ? "s" : ""}
                        </span>
                        , this action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="border-t" />
                  <div className="p-5">
                    <p className="label-small mb-1 text-text-600">
                      Please type <span className="text-text-950">DELETE</span>{" "}
                      to confirm.
                    </p>
                    <Input
                      size="sm"
                      className="w-full"
                      value={deleteText}
                      onChange={(e) => setDeleteText(e.target.value)}
                    />
                  </div>
                  <div className="border-t" />
                  <div className="grid grid-cols-2 gap-3 p-4">
                    <DialogClose asChild>
                      <Button
                        text="Cancel"
                        size="md"
                        color="gray"
                        className="justify-center"
                      />
                    </DialogClose>
                    <Button
                      text="Delete"
                      size="md"
                      color="danger"
                      className="justify-center"
                      disabled={
                        deleteMutation.isPending || deleteText !== "DELETE"
                      }
                      onClick={() => {
                        deleteMutation.mutate({
                          text: deleteText,
                          selected,
                        });
                      }}
                    />
                  </div>
                </div>
              </DialogComponent>
            </>
          ) : null}
          <Input
            icon={<RiSearch2Line size={20} />}
            iconSide="left"
            placeholder="Search..."
            size="sm"
            onChange={(e) => debounced(e.target.value)}
            defaultValue={itemFilters.name}
          />
          <Filters />
        </div>
      </div>
      <div className="flex flex-grow flex-col justify-between gap-10">
        <div className="relative flex flex-grow">
          <div
            className={`absolute inset-0 flex flex-col ${
              isFetching ? "" : "pointer-events-none"
            }`}
          >
            <div className="h-[2.25rem] w-full" />
            {isFetching ? (
              <div className="bg-bg-0/40 z-10 flex flex-grow items-center justify-center backdrop-blur-[2px]">
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
                        className={`paragraph-small bg-bg-50 py-2 font-normal text-text-600 first:rounded-l-lg last:rounded-r-lg ${user?.feature_flags.table_size === "compact" ? "px-4" : "px-6"}`}
                        style={{
                          width:
                            header.column.id === "checkbox"
                              ? "3rem"
                              : header.column.columnDef.size + "%",
                        }}
                      >
                        <button
                          className="flex items-center gap-1"
                          onClick={() => {
                            if (
                              header.column.columnDef.id === "id" ||
                              header.column.columnDef.id === "checkbox"
                            ) {
                              return;
                            }

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
                          {header.isPlaceholder ? null : (
                            <>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.columnDef.id !== "checkbox" ? (
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
                    className="peer cursor-pointer border-t first:border-t-0 hover:border-transparent hover:bg-bg-50 [&+tr]:hover:border-transparent"
                    role="button"
                    onClick={() => {
                      router.push("/item/" + row.original.nano_id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        router.push("/item/" + row.original.nano_id);
                    }}
                    tabIndex={0}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`paragraph-medium truncate first:rounded-l-xl last:rounded-r-xl ${
                          cell.column.columnDef.id !== "name"
                            ? "text-text-600"
                            : ""
                        } ${user?.feature_flags.table_size === "compact" ? "px-4 py-2" : "px-6 py-4"}`}
                        style={{
                          width:
                            cell.column.id === "checkbox"
                              ? "3rem"
                              : cell.column.columnDef.size + "%",
                        }}
                        onClick={(e) =>
                          cell.column.columnDef.id === "checkbox" &&
                          e.stopPropagation()
                        }
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
            <p className="paragraph-small self-center text-text-600">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.ceil((data[0]?.total_count || limit) / limit)}
            </p>
            <div className="flex items-center gap-3 self-center justify-self-end sm:justify-self-center">
              <button
                className="rounded-[10px] border border-transparent p-2 text-text-600 transition-all hover:bg-bg-50 hover:text-text-950 active:bg-bg-0 active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#E4E5E7] disabled:text-text-300 disabled:shadow-none"
                disabled={table.getState().pagination.pageIndex === 0}
                onClick={() =>
                  table.setPageIndex(table.getState().pagination.pageIndex - 1)
                }
              >
                <RiArrowLeftSLine size={18} />
              </button>
              <div className="flex items-center justify-center gap-3">
                {Array.from({
                  length: Math.ceil((data[0]?.total_count || 0) / limit) || 1,
                }).map((_, i) => {
                  const total = Math.ceil((data[0]?.total_count || 0) / limit);
                  const current = table.getState().pagination.pageIndex + 1;
                  const number = i + 1;

                  if (total > 7) {
                    if (number < 6 || number === total)
                      return (
                        <span
                          key={i}
                          className={`${
                            i === table.getState().pagination.pageIndex
                              ? "label-small text-text-950"
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
                                ? "label-small text-text-950"
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
                                ? "label-small text-text-950"
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
                                ? "label-small text-text-950"
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
                            ? "label-small text-text-950"
                            : "label-small hidden text-text-400 sm:inline"
                        }`}
                      >
                        {i + 1}
                      </span>
                    );
                  }
                })}
              </div>
              <button
                className="rounded-[10px] border border-transparent p-2 text-text-600 transition-all hover:bg-bg-50 hover:text-text-950 active:bg-bg-0 active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#E4E5E7] disabled:text-text-300 disabled:shadow-none"
                onClick={async () => {
                  await fetchNextPage();
                  table.setPageIndex(table.getState().pagination.pageIndex + 1);
                }}
                disabled={
                  table.getState().pagination.pageIndex + 1 ===
                  (Math.ceil((data[0]?.total_count || 0) / limit) || 1)
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
