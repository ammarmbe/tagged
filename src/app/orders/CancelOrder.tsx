import Spinner from "@/components/Spinner";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function CancelOrder({ orderId }: { orderId: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationKey: ["cancel-order", orderId],
    mutationFn: async () => {
      await fetch(`/api/order/cancel?id=${orderId}`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "orders",
      });
      setDialogOpen(false);
    },
  });

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger
        className="button gray !py-1.5"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => {
          pathname === "/orders" &&
            e.currentTarget.parentElement?.parentElement?.classList.remove(
              "hover:bg-gray-50",
            );
        }}
        onMouseLeave={(e) => {
          pathname === "/orders" &&
            e.currentTarget.parentElement?.parentElement?.classList.add(
              "hover:bg-gray-50",
            );
        }}
      >
        Cancel
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-40 cursor-default bg-black opacity-30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          onClick={(e) => e.stopPropagation()}
          className="bg-primary border-primary fixed left-[50%] top-[50%] z-50 flex w-fit max-w-[400px] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-xl border shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2"
        >
          <div>
            <div className="flex gap-4 p-5 pb-0">
              <Image
                src="/mark.svg"
                width={50}
                height={50}
                alt="Check mark"
                className="h-fit flex-none"
              />
              <div className="flex flex-col gap-2">
                <p className="test-gray-900 text-lg font-semibold">
                  Are you sure?
                </p>
                <p className="text-tertiary flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  You are about to cancel this order. This action cannot be
                  undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3 px-5 pb-5">
              <Dialog.Close className="button gray">Cancel</Dialog.Close>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                type="submit"
                className="button danger min-w-20 justify-center"
              >
                {cancelMutation.isPending ? <Spinner size="xs" /> : "Confirm"}
              </button>
            </div>
            <Dialog.Close className="button secondary !text-quaternary absolute right-3 top-3 !p-1.5">
              <X size={24} />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
