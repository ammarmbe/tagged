import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../primitives/Button";
import Input from "../primitives/Input";
import Select from "../primitives/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiCloseLine, RiPencilLine } from "react-icons/ri";
import DeleteItem from "./DeleteItem";
import { toast } from "../primitives/toast/use-toast";
import DialogComponent from "../primitives/Dialog";

export default function Edit({
  data,
}: {
  data?: {
    id: string;
    name: string;
    description: string;
    category: string[];
    price: number;
    discount: number;
    colors: string[];
    sizes: string[];
    quantity: number;
    quantities: string[];
  };
}) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState(data?.category || []);
  const [colors, setColors] = useState(data?.colors || []);
  const [sizes, setSizes] = useState(data?.sizes || []);

  const options = useMemo(
    () => [
      ["Jackets"],
      ["Dresses"],
      ["Shoes"],
      ["Accessories"],
      ["Tops", "Tshirts"],
      ["Tops", "Shirts"],
      ["Tops", "Hoodies"],
      ["Tops", "Sweatshirts"],
      ["Bottoms", "Shorts"],
      ["Bottoms", "Jeans"],
      ["Bottoms", "Sweatpants"],
      ["Bottoms", "Cargo"],
      ["Bottoms", "Leggings"],
    ],
    [],
  );

  const updateMutation = useMutation({
    mutationKey: ["update-item", data?.id],
    mutationFn: async (data: {
      id: string | undefined;
      name: string | undefined;
      description: string | undefined;
      category: string[];
      price: number;
      discount: number;
      colors: string[];
      sizes: string[];
      old_colors: string[] | undefined;
      old_sizes: string[] | undefined;
    }) => {
      const res = await fetch(`/api/item`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      return res.ok;
    },
    onSuccess: async (ok) => {
      setEditOpen(false);

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

  useEffect(() => {
    data?.colors && setColors(data?.colors);
  }, [data?.colors]);

  useEffect(() => {
    data?.sizes && setSizes(data?.sizes);
  }, [data?.sizes]);

  useEffect(() => {
    data?.category && setCategory(data?.category);
  }, [data?.category]);

  return (
    <DialogComponent
      trigger={
        <Button
          iconLeft={<RiPencilLine size={20} />}
          color="gray"
          size="xs"
          text="Edit"
        />
      }
      open={editOpen}
      onOpenChange={setEditOpen}
      sheet
    >
      <div className="flex items-center gap-5 p-4 pl-6 sm:px-6 sm:py-5">
        <p className="label-large flex-grow">Edit Item</p>
        <Dialog.Close asChild>
          <Button
            iconLeft={<RiCloseLine size={20} />}
            color="gray"
            className="!border-none"
          />
        </Dialog.Close>
      </div>
      <div className="border-t" />
      <div className="flex flex-grow flex-col gap-6 px-6 py-5">
        <div className="space-y-1">
          <label htmlFor="editName" className="label-small">
            Name
          </label>
          <Input
            size="sm"
            className="!w-full"
            id="editName"
            ref={nameRef}
            defaultValue={data?.name}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="editDescription" className="label-small">
            Description
          </label>
          <Input
            textarea
            size="sm"
            className="!w-full"
            id="editDescription"
            ref={descriptionRef}
            defaultValue={data?.description}
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5 gap-y-1">
          <div className="space-y-1">
            <label htmlFor="editPrice" className="label-small">
              Price <span className="text-text-600 font-normal">(EGP)</span>
            </label>
            <Input
              type="number"
              size="sm"
              className="!w-full"
              id="editPrice"
              ref={priceRef}
              defaultValue={data?.price}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="editDiscount" className="label-small">
              Discount <span className="text-text-600 font-normal">(EGP)</span>
            </label>
            <Input
              type="number"
              size="sm"
              className="!w-full"
              id="editDiscount"
              ref={discountRef}
              defaultValue={data?.discount}
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="label-small">Category</p>
          <Select
            size="sm"
            className="!w-full"
            placeholder
            defaultValue={{
              label: category?.at(-1) || "",
              value: category,
            }}
            options={options.map((option) => {
              return {
                label: option.at(-1) || "",
                value: option,
              };
            })}
            onChange={(e: any) => {
              setCategory(e.value);
            }}
          />
        </div>
        <div className="space-y-1">
          <p className="label-small">Colors</p>
          <Select
            size="sm"
            className="!w-full"
            placeholder
            defaultValue={data?.colors
              ?.filter((c) => c)
              .map((color) => {
                return {
                  label: color,
                  value: color,
                };
              })}
            isMulti
            creatable
            isClearable={false}
            onChange={(e) => {
              setColors(e.map((color) => color.value));
            }}
          />
        </div>
        <div className="space-y-1">
          <p className="label-small">Sizes</p>
          <Select
            size="sm"
            className="!w-full"
            placeholder
            defaultValue={data?.sizes
              ?.filter((s) => s)
              .map((size) => {
                return {
                  label: size,
                  value: size,
                };
              })}
            isMulti
            creatable
            isClearable={false}
            onChange={(e) => {
              setSizes(e.map((size) => size.value));
            }}
          />
        </div>
      </div>
      <div className="border-t" />
      <div className="grid grid-cols-2 gap-4 gap-y-1 px-6 py-5">
        <DeleteItem
          id={data?.id}
          trigger={
            <Button
              text="Delete Item"
              size="md"
              color="danger_hidden"
              className="justify-center"
            />
          }
        />
        <Button
          text="Save"
          size="md"
          color="main"
          className="justify-center"
          disabled={updateMutation.isPending}
          onClick={() => {
            updateMutation.mutate({
              id: data?.id,
              name: nameRef.current?.value,
              description: descriptionRef.current?.value,
              category: category,
              price: Number(priceRef.current?.value),
              discount: Number(discountRef.current?.value),
              colors: colors,
              sizes: sizes,
              old_colors: data?.colors,
              old_sizes: data?.sizes,
            });
          }}
        />
      </div>
    </DialogComponent>
  );
}
