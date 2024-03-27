import * as Dialog from "@radix-ui/react-dialog";
import Input from "../primitives/Input";
import Button from "../primitives/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { RiBox3Line, RiCloseLine } from "react-icons/ri";
import { toast } from "../primitives/toast/use-toast";

export default function UpdateStock({
  data,
  trigger,
}: {
  data?: {
    id: string;
    quantities: string[];
  };
  trigger: React.ReactNode;
}) {
  const [quantitiesOpen, setQuantitiesOpen] = useState(false);
  const [quantities, setQuantities] = useState(
    data?.quantities?.map((q) => {
      const [colorSize, quantity] = q.split(": ");
      const [color, size] = colorSize.split(" / ");
      return { color, size, quantity };
    }) ?? [],
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    setQuantities(
      data?.quantities?.map((q) => {
        const [colorSize, quantity] = q.split(": ");
        const [color, size] = colorSize.split(" / ");
        return { color, size, quantity };
      }) ?? [],
    );
  }, [data?.quantities]);

  const updateQuantitiesMutation = useMutation({
    mutationKey: ["updateQuantities", data?.id],
    mutationFn: async (
      quantities: { color: string; size: string; quantity: string }[],
    ) => {
      await fetch(`/api/item/update-quantities`, {
        method: "POST",
        body: JSON.stringify({ id: data?.id, quantities }),
      });
    },
    onSuccess: async () => {
      setQuantitiesOpen(false);

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
          return query.queryKey[1] == data?.id;
        },
      });
    },
  });

  return (
    <Dialog.Root open={quantitiesOpen} onOpenChange={setQuantitiesOpen}>
      {trigger}
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="!pointer-events-none fixed inset-0 z-50 flex items-center justify-center rounded-2xl shadow-[0px_16px_32px_-12px_#585C5F1A] transition duration-200 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]">
        <div className="pointer-events-auto h-fit max-w-2xl rounded-2xl bg-white sm:max-w-md">
          <div className="flex gap-4 p-4">
            <div className="h-fit rounded-full border p-2.5 text-icon-500">
              <RiBox3Line size={24} />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <p className="label-medium">Update Stock</p>
                <Dialog.Close asChild>
                  <Button
                    iconLeft={<RiCloseLine size={20} />}
                    color="gray"
                    className="!rounded-full !border-none !p-0.5"
                  />
                </Dialog.Close>
              </div>
              <p className="paragraph-small mt-1 text-text-500">
                Update stock for different sizes and colors
              </p>
            </div>
          </div>
          <div className="border-t" />
          {data?.quantities?.map((quantity, index) => {
            return (
              <Fragment key={index}>
                <div className="grid grid-cols-[1fr,auto] items-center gap-4 p-4">
                  <p className="label-small">{quantity.split(": ")[0]}</p>
                  <Input
                    size="sm"
                    type="number"
                    className="!w-[100px]"
                    onChange={(e) => {
                      setQuantities((prev) => {
                        const newQuantities = [...prev];
                        if (newQuantities[index]?.quantity)
                          newQuantities[index].quantity = e.target.value;
                        return newQuantities;
                      });
                    }}
                    defaultValue={quantity.split(": ")[1]}
                  />
                </div>
                <div className="border-t" />
              </Fragment>
            );
          }) ?? (
            <p className="label-small p-4 text-center text-text-400">
              Please add at least one color and size first.
            </p>
          )}
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
              text="Save Changes"
              size="md"
              color="main"
              className="justify-center"
              disabled={updateQuantitiesMutation.isPending}
              onClick={() => {
                updateQuantitiesMutation.mutate(quantities);
              }}
            />
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
