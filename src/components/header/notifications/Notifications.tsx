"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { RiNotification3Line } from "react-icons/ri";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LuDot } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/utils";
import { useRouter } from "next/navigation";
dayjs.extend(relativeTime);

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<"all" | "unread" | "new-orders">(
    "all",
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notifications, refetch } = useQuery({
    queryKey: ["notifications", selected],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?tab=${selected}`);
      return res.json() as Promise<
        {
          id: number;
          order_nano_id?: string;
          type: "new-order" | "custom";
          order_governorate?: string;
          text?: string;
          customer_name?: string;
          order_total?: number;
          created_at?: string;
          read: boolean;
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [selected, refetch, open]);

  useEffect(() => {
    document.addEventListener("show-notifications", () => {
      setOpen(true);
    });

    return () => {
      document.removeEventListener("show-notifications", () => {
        setOpen(true);
      });
    };
  });

  useEffect(() => {
    setUnreadCount(notifications?.filter((n) => !n.read).length || 0);
  }, [notifications]);

  const readMutation = useMutation({
    mutationFn: async (id: number | undefined) => {
      await fetch(`/api/notifications/read?id=${id ?? ""}`, {
        method: "PATCH",
      });
    },
    onMutate: (id) => {
      if (id) {
        setUnreadCount((prev) => prev - 1);
      } else {
        setUnreadCount(0);
      }

      queryClient.setQueryData(
        ["current-status"],
        (oldData: {
          orders_pending: number;
          return_requests: number;
          new_notifications: number;
        }) => {
          return {
            ...oldData,
            new_notifications: id ? oldData.new_notifications - 1 : 0,
          };
        },
      );
    },
  });

  return (
    <DropdownMenu.Root
      modal={false}
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DropdownMenu.Trigger
        id="notifications-trigger"
        className="relative h-fit rounded-[10px] border border-transparent p-2 text-text-600 transition-all hover:bg-bg-50 hover:text-text-950 active:bg-bg-0 active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#E4E5E7] disabled:text-text-300 disabled:shadow-none sm:p-2.5"
      >
        <RiNotification3Line size={20} />
        {unreadCount ? (
          <div className="absolute right-2 top-1.5 size-3 rounded-full border-2 border-white bg-[#FC3747]" />
        ) : null}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="end"
        className="z-30 mt-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      >
        <div className="card min-w-72 !gap-0 !p-0 !shadow-md sm:min-w-96">
          <div className="flex items-center justify-between p-4">
            <p className="label-medium">Notifications</p>
            <button
              disabled={unreadCount === 0}
              onClick={() => {
                readMutation.mutate(undefined);
              }}
              className="label-small text-main-base underline-offset-2 hover:underline disabled:text-text-300 disabled:hover:no-underline"
            >
              Mark all as read
            </button>
          </div>
          <div className="border-t" />
          <div className="flex gap-4 border-b px-3.5">
            <button
              className={`label-small -mb-px flex flex-col gap-3.5 pt-3.5 transition-all ${selected === "all" ? "" : "text-text-600"}`}
              onClick={() => {
                setSelected("all");
              }}
            >
              All
              <div
                className={`w-full border-b-2 transition-all ${selected === "all" ? "border-main-base" : "border-transparent"}`}
              />
            </button>
            <button
              className={`label-small -mb-px flex flex-col gap-3.5 pt-3.5 transition-all ${selected === "unread" ? "" : "text-text-600"}`}
              onClick={() => {
                setSelected("unread");
              }}
            >
              <p className="flex items-center gap-1.5">
                Unread{" "}
                {unreadCount ? (
                  <span
                    className={`subheading-2xsmall size flex items-center justify-center rounded-full bg-[#FC3747] text-white ${
                      unreadCount > 9 ? "size-5" : "size-4"
                    }`}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </p>
              <div
                className={`w-full border-b-2 transition-all ${selected === "unread" ? "border-main-base" : "border-transparent"}`}
              />
            </button>
            <button
              className={`label-small -mb-px flex flex-col gap-3.5 pt-3.5 transition-all ${selected === "new-orders" ? "" : "text-text-600"}`}
              onClick={() => {
                setSelected("new-orders");
              }}
            >
              New Orders
              <div
                className={`w-full border-b-2 transition-all ${selected === "new-orders" ? "border-main-base" : "border-transparent"}`}
              />
            </button>
          </div>
          <div>
            {notifications?.filter((n) => {
              if (selected === "unread") {
                return !n.read;
              } else if (selected === "new-orders") {
                return n.type === "new-order";
              }
              return true;
            }).length ? (
              notifications
                ?.filter((n) => {
                  if (selected === "unread") {
                    return !n.read;
                  } else if (selected === "new-orders") {
                    return n.type === "new-order";
                  }
                  return true;
                })
                .map(
                  (n: {
                    id: number;
                    order_nano_id?: string;
                    type: "new-order" | "custom";
                    order_governorate?: string;
                    customer_name?: string;
                    text?: string;
                    order_total?: number;
                    created_at?: string;
                    read: boolean;
                  }) => (
                    <div
                      key={n.id}
                      className="label-small relative cursor-pointer border-t px-3 py-3 text-text-600 transition-all first:border-t-0 hover:bg-bg-50"
                      tabIndex={n.type === "new-order" ? 0 : undefined}
                      role={n.type === "new-order" ? "button" : undefined}
                      onClick={() => {
                        if (n.type === "new-order") {
                          router.push(`/order/${n.order_nano_id}`);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && n.type === "new-order") {
                          router.push(`/order/${n.order_nano_id}`);
                        }
                      }}
                    >
                      <p className="text-text-600">
                        {n.type === "new-order" ? (
                          <>
                            New order from{" "}
                            <span className="text-text-950">
                              {n.customer_name}
                            </span>{" "}
                            in{" "}
                            <span className="text-text-950">
                              {n.order_governorate}
                            </span>
                          </>
                        ) : (
                          n.text
                        )}
                      </p>
                      <p className="label-xsmall mt-1 flex items-center gap-2">
                        <span>{dayjs().to(dayjs(n.created_at))}</span>
                        {n.type === "new-order" ? (
                          <>
                            <LuDot size={8} />
                            <span>worth {formatCurrency(n.order_total)}</span>
                          </>
                        ) : null}
                        {unreadCount && !n.read ? (
                          <>
                            <LuDot size={8} />
                            <span
                              className="text-main-base underline-offset-2 hover:underline"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                e.currentTarget.parentElement?.parentElement?.classList.remove(
                                  "hover:bg-bg-50",
                                );
                              }}
                              onMouseLeave={(e) => {
                                e.stopPropagation();
                                e.currentTarget.parentElement?.parentElement?.classList.add(
                                  "hover:bg-bg-50",
                                );
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                readMutation.mutate(n.id);
                                e.currentTarget.parentElement?.parentElement?.classList.add(
                                  "hover:bg-bg-50",
                                );
                              }}
                            >
                              Mark as read
                            </span>
                          </>
                        ) : null}
                      </p>
                    </div>
                  ),
                )
            ) : (
              <p className="label-small p-4 text-center text-text-400">
                No notifications
              </p>
            )}
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
