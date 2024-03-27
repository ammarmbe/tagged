import * as Dialog from "@radix-ui/react-dialog";
import { RiCloseLine, RiDeleteBinLine } from "react-icons/ri";
import Button from "../primitives/Button";
import Input from "../primitives/Input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import DialogComponent from "../primitives/Dialog";

export default function DeleteItem({
  id,
  trigger,
}: {
  id?: string;
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationKey: ["delete-item", id],
    mutationFn: async ({ t, i }: { t: string; i: string | undefined }) => {
      if (t !== "DELETE" || !i) return;

      await fetch(`/api/item/delete`, {
        method: "DELETE",
        body: JSON.stringify({ id: i }),
      });
    },
    onSuccess: async () => {
      router.push("/items");
    },
  });

  return (
    <DialogComponent
      trigger={trigger}
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
    >
      <div className="pointer-events-auto h-fit min-w-[350px] max-w-2xl rounded-2xl bg-white sm:max-w-md">
        <div className="flex gap-4 p-4">
          <div className="h-fit rounded-full border p-2.5 text-icon-500">
            <RiDeleteBinLine size={24} />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between">
              <p className="label-medium">Are you sure?</p>
              <Dialog.Close asChild>
                <Button
                  iconLeft={<RiCloseLine size={20} />}
                  color="gray"
                  className="!rounded-full !border-none !p-0.5"
                />
              </Dialog.Close>
            </div>
            <p className="paragraph-small mt-1 text-text-500">
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="border-t" />
        <div className="p-5">
          <p className="label-small mb-1 text-text-500">
            Please type <span className="text-text-900">DELETE</span> to
            confirm.
          </p>
          <Input
            size="sm"
            className="w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="border-t" />
        <div className="grid grid-cols-2 gap-3 p-4">
          <Dialog.Close asChild>
            <Button
              text="Cancel"
              size="md"
              color="gray"
              className="justify-center"
            />
          </Dialog.Close>
          <Button
            text="Delete"
            size="md"
            color="danger"
            className="justify-center"
            disabled={deleteMutation.isPending || text !== "DELETE"}
            onClick={() => {
              deleteMutation.mutate({ t: text, i: id });
            }}
          />
        </div>
      </div>
    </DialogComponent>
  );
}
