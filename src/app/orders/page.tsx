"use client";
import Status from "@/components/Status";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ShoppingBag } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import Order from "@/components/Order";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import CancelOrder from "./CancelOrder";

type Order = {
  customer_name: string;
  cancel_reason: string;
  apartment: string;
  city: string;
  governorate: string;
  id: number;
  created_at: string;
  phone_number: string;
  shipping_price: number;
  status:
    | "pending"
    | "shipped"
    | "completed"
    | "cancelled"
    | "returned"
    | "customer_cancelled";
  store_name: string;
  store_id: number;
  street: string;
  first_name: string;
  last_name: string;
  total: number;
  nano_id: string;
};

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <Status status={info.getValue()} store={false} />,
    size: 10,
  }),
  columnHelper.accessor("total", {
    header: "Subtotal",
    cell: (info) =>
      new Intl.NumberFormat("en-US", {
        currency: "EGP",
        style: "currency",
        currencyDisplay: "symbol",
      }).format(info.getValue()),
    size: 10,
  }),
  columnHelper.accessor("shipping_price", {
    header: "Shipping",
    cell: (info) =>
      new Intl.NumberFormat("en-US", {
        currency: "EGP",
        style: "currency",
        currencyDisplay: "symbol",
      }).format(info.getValue()),
    size: 10,
  }),
  columnHelper.accessor("created_at", {
    header: "Created at",
    cell: (info) =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(info.getValue())),
    size: 15,
  }),
  columnHelper.display({
    id: "dropdownButton",
    header: "",
    cell: (info) => (
      <div className="text-tertiary hidden items-center justify-end gap-4 md:flex">
        {info.row.original.status === "pending" ? (
          <CancelOrder orderId={info.row.original.id} />
        ) : null}
        <ChevronDown className="transition-all" />
      </div>
    ),
    size: 10,
  }),
];

export default function CustomerOrders() {
  const router = useRouter();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      return (await response.json()) as {
        customer_name: string;
        cancel_reason: string;
        apartment: string;
        city: string;
        governorate: string;
        id: number;
        created_at: string;
        phone_number: string;
        shipping_price: number;
        status:
          | "pending"
          | "shipped"
          | "completed"
          | "cancelled"
          | "returned"
          | "customer_cancelled";
        store_name: string;
        store_id: number;
        street: string;
        first_name: string;
        last_name: string;
        total: number;
        nano_id: string;
      }[];
    },
  });

  const table = useReactTable({
    data: orders || [],
    columns,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
      <div className="flex-grow overflow-hidden rounded-xl border">
        <div className="mx-6 my-7 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Orders</h2>
        </div>
        <div className="border-t" />
        <div className="flex w-full flex-wrap gap-5">
          {isLoading ? (
            <div className="flex flex-grow items-center justify-center p-4">
              <Spinner />
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-clip">
              <Accordion.Root type="single" collapsible>
                <table className="w-full min-w-[1000px] table-fixed">
                  <thead className="text-tertiary w-full border-b bg-gray-50 text-sm">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="truncate px-6 py-3 text-start font-medium"
                            style={{
                              width: header.column.columnDef.size + "%",
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-tertiary p-4"
                        >
                          <div className="flex items-center justify-center">
                            <Spinner />
                          </div>
                        </td>
                      </tr>
                    ) : table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <Fragment key={row.id + row.original.id}>
                          <Accordion.Item
                            value={row.original.id.toString()}
                            className="w-full"
                            asChild
                          >
                            <tr className="text-secondary border-b last:border-b-0">
                              <td colSpan={columns.length} className="p-0">
                                <table className="w-full table-fixed">
                                  <tbody>
                                    <Accordion.Trigger asChild>
                                      <tr className="bg-primary hidden cursor-pointer appearance-none hover:bg-gray-50 md:table-row [&[data-state=open]_svg]:rotate-180">
                                        {row.getVisibleCells().map((cell) => (
                                          <td
                                            key={cell.id}
                                            className="px-6 py-3"
                                            style={{
                                              width:
                                                cell.column.columnDef.size +
                                                "%",
                                            }}
                                          >
                                            {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext(),
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    </Accordion.Trigger>
                                    <tr className="bg-primary table-row cursor-pointer appearance-none hover:bg-gray-50 md:hidden [&[data-state=open]_svg]:rotate-180">
                                      {row.getVisibleCells().map((cell) => (
                                        <td
                                          key={cell.id}
                                          className="px-6 py-3"
                                          onClick={() => {
                                            cell.getValue() &&
                                              router.push(
                                                `/order/${row.original.nano_id}`,
                                              );
                                          }}
                                          tabIndex={
                                            cell.getValue() ? 0 : undefined
                                          }
                                          role={
                                            cell.getValue()
                                              ? "button"
                                              : undefined
                                          }
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Enter" &&
                                              cell.getValue()
                                            ) {
                                              router.push(
                                                `/order/${row.original.nano_id}`,
                                              );
                                            }
                                          }}
                                          style={{
                                            width:
                                              cell.column.columnDef.size + "%",
                                          }}
                                        >
                                          {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                    <tr className="bg-primary">
                                      <td
                                        colSpan={columns.length}
                                        style={{
                                          width: "100%",
                                          padding: "0",
                                        }}
                                      >
                                        <Accordion.Content className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                          <Order order={row.original} />
                                        </Accordion.Content>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </Accordion.Item>
                        </Fragment>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-tertiary p-4 text-center"
                        >
                          <div className="h-full flex-grow items-center justify-center overflow-hidden p-6">
                            <div className="relative -my-52 mx-auto w-fit">
                              <svg
                                width="566"
                                height="566"
                                viewBox="0 0 566 566"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <title>Cart button</title>
                                <mask
                                  id="mask0_4_24"
                                  style={{ maskType: "alpha" }}
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="566"
                                  height="566"
                                >
                                  <rect
                                    width="566"
                                    height="566"
                                    fill="url(#paint0_radial_4_24)"
                                  />
                                </mask>
                                <g mask="url(#mask0_4_24)">
                                  <circle
                                    cx="283"
                                    cy="283"
                                    r="56.1"
                                    stroke="#EAECF0"
                                  />
                                  <circle
                                    cx="283"
                                    cy="283"
                                    r="282.5"
                                    stroke="#EAECF0"
                                  />
                                  <circle
                                    cx="283"
                                    cy="283"
                                    r="244.767"
                                    stroke="#EAECF0"
                                  />
                                  <circle
                                    cx="283"
                                    cy="283"
                                    r="207.033"
                                    stroke="#EAECF0"
                                  />
                                  <circle
                                    cx="283"
                                    cy="283"
                                    r="93.8333"
                                    stroke="#EAECF0"
                                  />
                                  <circle
                                    cx="283"
                                    cy="283"
                                    r="130.387"
                                    stroke="#EAECF0"
                                  />
                                  <circle
                                    cx="283"
                                    cy="283"
                                    r="169.3"
                                    stroke="#EAECF0"
                                  />
                                </g>
                                <defs>
                                  <radialGradient
                                    id="paint0_radial_4_24"
                                    cx="0"
                                    cy="0"
                                    r="1"
                                    gradientUnits="userSpaceOnUse"
                                    gradientTransform="translate(283 283) rotate(90) scale(283)"
                                  >
                                    <stop />
                                    <stop offset="1" stopOpacity="0" />
                                  </radialGradient>
                                </defs>
                              </svg>
                              <div
                                style={{
                                  boxShadow: "0 1px 2px 0 #1018280D",
                                }}
                                className="text-secondary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border p-3.5"
                              >
                                <ShoppingBag size={28} />
                              </div>
                            </div>
                            <div className="relative z-10 text-center">
                              <h3 className="text-lg font-medium">No Orders</h3>
                              <p className="text-tertiary">
                                Looks like you haven&apos;t made any orders yet.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Accordion.Root>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
