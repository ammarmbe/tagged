import * as Dialog from "@radix-ui/react-dialog";
import Button from "../primitives/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RiCloseLine, RiMindMap } from "react-icons/ri";
import Input from "../primitives/Input";
import { toast } from "../primitives/toast/use-toast";
import { SubmitHandler, useForm } from "react-hook-form";

const statuses = [
  {
    name: "pending",
    title: "Pending",
    description: "Order has been placed but not confirmed yet",
  },
  {
    name: "confirmed",
    title: "Confirmed",
    description: "Order has been confirmed by the store, ready to be shipped.",
  },
  {
    name: "shipped",
    title: "Shipped",
    description: "Order has been shipped to the customer and is on its way.",
  },
  {
    name: "completed",
    title: "Completed",
    description:
      "Order has been delivered to the customer and completed, nothing more to do.",
  },
  {
    name: "store_cancelled",
    title: "Cancelled",
    description:
      "Order has been cancelled by the store, a reason must be provided.",
  },
];

export default function UpdateStatus({
  nano_id,
  trigger,
  current_status,
}: {
  nano_id: string;
  trigger: React.ReactNode;
  current_status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "completed"
    | "store_cancelled"
    | "customer_cancelled"
    | null
    | undefined;
}) {
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<
    | "pending"
    | "confirmed"
    | "shipped"
    | "completed"
    | "store_cancelled"
    | "customer_cancelled"
    | null
  >(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonOpen, setCancelReasonOpen] = useState(false);

  const updateStatusMutation = useMutation({
    mutationKey: ["updateStatus", nano_id],
    mutationFn: async ({
      status,
      cancel_reason,
    }: {
      status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "completed"
        | "store_cancelled"
        | "customer_cancelled"
        | null;
      cancel_reason?: string | null;
    }) => {
      await fetch(`/api/order/update-status`, {
        method: "POST",
        body: JSON.stringify({
          nano_id: nano_id,
          status,
          cancel_reason,
        }),
      });
    },
    onSuccess: async () => {
      setStatus(null);
      setCancelReason("");
      setUpdateStatusOpen(false);

      toast({
        title: "Your changes have been saved successfully",
        color: "green",
        saturation: "high",
        size: "sm",
        position: "center",
      });

      // Update header and info card query
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[1] == nano_id;
        },
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    status:
      | "pending"
      | "confirmed"
      | "shipped"
      | "completed"
      | "store_cancelled"
      | "customer_cancelled"
      | null;
    cancel_reason: string | null;
  }>();

  const onSubmit: SubmitHandler<{
    status:
      | "pending"
      | "confirmed"
      | "shipped"
      | "completed"
      | "store_cancelled"
      | "customer_cancelled"
      | null;
    cancel_reason: string | null;
  }> = (data) => {
    updateStatusMutation.mutate(data);
  };

  return (
    <Dialog.Root open={updateStatusOpen} onOpenChange={setUpdateStatusOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="!pointer-events-none fixed inset-0 z-50 flex items-center justify-center rounded-2xl shadow-[0px_16px_32px_-12px_#585C5F1A] transition duration-200 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pointer-events-auto h-fit max-w-2xl rounded-2xl bg-white sm:max-w-md"
          >
            <div className="flex gap-4 p-4">
              <div className="h-fit rounded-full border p-2.5 text-icon-500">
                <RiMindMap size={24} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <p className="label-medium">Update Status</p>
                  <Dialog.Close asChild>
                    <Button
                      iconLeft={<RiCloseLine size={20} />}
                      color="gray"
                      className="!rounded-full !border-none !p-0.5"
                    />
                  </Dialog.Close>
                </div>
                <p className="paragraph-small mt-1 text-text-500">
                  Updating the status of an order will notify the customer.{" "}
                  <span className="font-medium text-text-900">
                    This action is irreversible.
                  </span>
                </p>
              </div>
            </div>
            <div className="border-t" />
            <div className="w-full overflow-hidden">
              <div
                className={`relative grid w-fit grid-cols-[42rem,42rem] transition-all sm:grid-cols-[28rem,28rem] ${
                  cancelReasonOpen
                    ? "-ml-[42rem] max-h-[calc(9rem+2px+1.375rem)] sm:-ml-[28rem]"
                    : "max-h-[calc(((5.75rem+2px)*5)+2rem+4rem)]"
                }`}
              >
                <div className="flex flex-col gap-4 p-4">
                  {statuses.map((s, i) => (
                    <label
                      htmlFor={s.name}
                      key={i}
                      aria-disabled={
                        statuses.findIndex(
                          (st) => st.name === current_status,
                        ) >= i
                      }
                      className={`group flex cursor-pointer gap-4 rounded-xl border p-4 transition-all hover:border-border-100 hover:bg-bg-100 disabled:!border-border-200 aria-disabled:cursor-not-allowed aria-disabled:hover:border-border-300 aria-disabled:hover:bg-white ${
                        status !== s.name
                          ? "shadow-xs"
                          : "!border-main-base !bg-white"
                      }`}
                    >
                      <div className="flex-grow">
                        <p
                          className={`label-small flex items-center gap-1.5 group-aria-disabled:text-text-500 ${
                            s.name === "store_cancelled" ? "text-error" : ""
                          }`}
                        >
                          {s.title}
                          {s.name === current_status && (
                            <span className="inline-block rounded-full bg-[#C2D6FF] px-1.5 py-0.5 text-xs font-medium leading-none text-[#162664]">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="paragraph-small text-text-500 group-aria-disabled:text-text-400">
                          {s.description}
                        </p>
                      </div>
                      <div className="p-1">
                        <input
                          type="radio"
                          {...register("status", {
                            required: "Please select a status",
                          })}
                          className="radio"
                          name="status"
                          value={s.name}
                          checked={status === s.name}
                          onChange={(e) => {
                            if (
                              !(
                                statuses.findIndex(
                                  (st) => st.name === current_status,
                                ) >= i
                              ) &&
                              e.target.checked
                            )
                              setStatus(
                                s.name as
                                  | "pending"
                                  | "confirmed"
                                  | "shipped"
                                  | "completed"
                                  | "store_cancelled"
                                  | "customer_cancelled"
                                  | null,
                              );
                          }}
                          disabled={
                            statuses.findIndex(
                              (st) => st.name === current_status,
                            ) >= i
                          }
                          id={s.name}
                        />
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-1 p-4">
                  <label htmlFor="cancelReason" className="label-small">
                    Please select a reason for canceling
                  </label>
                  <Input
                    id="cancelReason"
                    value={cancelReason}
                    {...register("cancel_reason", {
                      required: {
                        value: status === "store_cancelled",
                        message: "Please provide a reason for canceling",
                      },
                    })}
                    error={Boolean(errors.cancel_reason?.message)}
                    errorMessage={errors.cancel_reason?.message}
                    className="w-full"
                    // @ts-ignore
                    rows={3}
                    onChange={(e) => setCancelReason(e.target.value)}
                    textarea
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              <Button
                text={
                  status === "store_cancelled" && cancelReasonOpen
                    ? "Back"
                    : "Cancel"
                }
                size="md"
                type="button"
                onClick={() => {
                  if (status === "store_cancelled" && cancelReasonOpen)
                    setCancelReasonOpen(false);
                  else setUpdateStatusOpen(false);
                }}
                color="gray"
                className="justify-center"
              />
              <Button
                text={
                  status === "store_cancelled" && !cancelReasonOpen
                    ? "Next"
                    : "Update"
                }
                size="md"
                color="main"
                type={
                  status === "store_cancelled" && !cancelReasonOpen
                    ? "button"
                    : "submit"
                }
                className="justify-center"
                disabled={updateStatusMutation.isPending || !status}
                onClick={() => {
                  if (status === "store_cancelled" && !cancelReasonOpen) {
                    setCancelReasonOpen(true);
                  }
                }}
              />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
