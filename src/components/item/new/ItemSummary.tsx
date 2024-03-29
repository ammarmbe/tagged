import Button from "@/components/primitives/Button";
import FancyButton from "@/components/primitives/FancyButton";
import { formatCurrency } from "@/utils";
import { RiArrowRightSLine, RiFileTextLine } from "react-icons/ri";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

export default function ItemSummary({
  itemDetails,
  colors,
  sizes,
  quantities,
  setLevel,
}: {
  itemDetails?: {
    name: string;
    description: string;
    price: number;
    discount: number;
    category: {
      label: string;
      value: string[];
    };
  };
  colors: { color: string; hex: string }[];
  sizes: string[];
  quantities: { color: string; size: string; quantity: number | undefined }[];
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}) {
  const router = useRouter();

  const newItemMutation = useMutation({
    mutationKey: ["new-item"],
    mutationFn: async () => {
      const res = await fetch("/api/item/new", {
        method: "POST",
        body: JSON.stringify({
          itemDetails,
          quantities,
        }),
      });

      return res.text();
    },
    onSuccess(data) {
      router.push(`/item/${data}`);
    },
  });

  return (
    <>
      <div className="hidden flex-col items-center pt-12 sm:flex">
        <div className="relative w-fit rounded-full bg-[linear-gradient(180deg,#E4E5E7_0%,rgba(228,229,231,0)76.56%)] p-px">
          <div className="absolute inset-px rounded-full bg-white" />
          <div className="relative z-10 w-fit rounded-full bg-[linear-gradient(180deg,rgba(228,229,231,0.48)0%,rgba(247,248,248,0)100%,rgba(228,229,231,0)100%)] p-4">
            <div className="w-fit rounded-full border bg-white p-4 shadow-[0px_2px_4px_0px_#1B1C1D0A]">
              <RiFileTextLine size={32} className="text-icon-500" />
            </div>
          </div>
        </div>
        <div className="title-h5 mt-2">Item Summary</div>
        <p className="paragraph-medium mt-1 text-text-500">
          Double check the details of your item, you can always go back and edit
          them.
        </p>
      </div>
      <div className="sm:card flex h-fit w-full flex-grow flex-col !gap-0 !overflow-visible !p-0 sm:max-w-md sm:flex-grow-0">
        <div className="label-medium p-4">Item Summary</div>
        <div className="flex min-h-0 flex-grow flex-col sm:flex-grow-0">
          <div className="subheading-xsmall flex items-center justify-between bg-bg-100 px-2 py-1.5 pl-4 text-text-400">
            Item details
          </div>
          <div className="grid grid-cols-[1fr,auto] gap-2 p-4">
            <p className="paragraph-small text-text-500">Name</p>
            <p className="label-small text-end">{itemDetails?.name}</p>
            <p className="paragraph-small text-text-500">Description</p>
            <p className="label-small text-end">{itemDetails?.description}</p>
            <p className="paragraph-small text-text-500">Category</p>
            <p className="label-small text-end">
              {itemDetails?.category.value.map((c, i) => (
                <React.Fragment key={c}>
                  <span className="underline-offset-2 hover:underline">
                    {c}
                  </span>
                  {i < itemDetails?.category.value.length - 1 ? (
                    <RiArrowRightSLine size={20} className="text-icon-400" />
                  ) : null}
                </React.Fragment>
              ))}
            </p>
            <p className="paragraph-small text-text-500">Price</p>
            <p className="label-small text-end">
              {formatCurrency(itemDetails?.price)}
            </p>
            <p className="paragraph-small text-text-500">Discount</p>
            <p className="label-small text-end">
              {itemDetails?.discount
                ? formatCurrency(itemDetails?.discount)
                : "-"}
            </p>
          </div>
          <div className="subheading-xsmall flex items-center justify-between bg-bg-100 px-2 py-1.5 pl-4 text-text-400">
            Colors & Sizes
          </div>
          <div className="grid grid-cols-[1fr,auto] gap-2 p-4">
            <p className="paragraph-small text-text-500">Colors</p>
            <div className="flex justify-end gap-2.5">
              {colors
                .concat([
                  {
                    color: "Red",
                    hex: "#FF0000",
                  },
                  {
                    color: "Green",
                    hex: "#00cc00",
                  },
                  {
                    color: "Blue",
                    hex: "#0000FF",
                  },
                ])
                .map((color) => {
                  return (
                    <div
                      key={color.color}
                      className="label-small flex items-center gap-1"
                    >
                      <div
                        className="size-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.color}</span>
                    </div>
                  );
                })}
            </div>
            <p className="paragraph-small text-text-500">Sizes</p>
            <div className="label-small text-end">{sizes.join(", ")}</div>
          </div>
          <div className="subheading-xsmall flex items-center justify-between bg-bg-100 px-2 py-1.5 pl-4 text-text-400">
            Quantities
          </div>
          <div className="grid grid-cols-[1fr,auto] gap-2 p-4">
            {quantities.map((quantity, index) => {
              return (
                <React.Fragment key={index}>
                  <p className="paragraph-small text-text-500">
                    {quantity.color + " / " + quantity.size}
                  </p>
                  <p className="label-small text-end">
                    {quantity.quantity || 0}
                  </p>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t p-4">
          <Button
            text="Back"
            onClick={() => setLevel((prev) => prev - 1)}
            size="md"
            color="gray"
            className="justify-center"
          />
          <FancyButton
            text="Finish"
            size="md"
            color="main"
            className="justify-center"
            type="button"
            disabled={newItemMutation.isPending}
            onClick={() => newItemMutation.mutate()}
          />
        </div>
      </div>
    </>
  );
}
