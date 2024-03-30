import * as Dialog from "@radix-ui/react-dialog";
import Input from "../primitives/Input";
import Button from "../primitives/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { RiBox3Line, RiCloseLine } from "react-icons/ri";
import { toast } from "../primitives/toast/use-toast";
import DialogComponent from "../primitives/Dialog";

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
      const res = await fetch(`/api/item/update-quantities`, {
        method: "POST",
        body: JSON.stringify({ id: data?.id, quantities }),
      });

      return res.ok;
    },
    onSuccess: async (ok) => {
      setQuantitiesOpen(false);

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

      // Update header and info card query
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[1] == data?.id;
        },
      });
    },
  });

  return (
    <DialogComponent
      trigger={trigger}
      open={quantitiesOpen}
      onOpenChange={setQuantitiesOpen}
    >
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
      <div className="flex flex-grow flex-col justify-center">
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
      </div>
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
    </DialogComponent>
  );
}
