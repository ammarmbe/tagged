import Button from "@/components/primitives/Button";
import Input from "@/components/primitives/Input";
import Select from "@/components/primitives/Select";
import { RiFileTextLine } from "react-icons/ri";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export default function ItemDetails({
  itemDetails,
  setItemDetails,
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
  setItemDetails: Dispatch<
    SetStateAction<
      | {
          name: string;
          description: string;
          price: number;
          discount: number;
          category: {
            label: string;
            value: string[];
          };
        }
      | undefined
    >
  >;
  setLevel: Dispatch<SetStateAction<number>>;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<{
    name: string;
    description: string;
    price: number;
    discount: number;
    category: {
      label: string;
      value: string[];
    };
  }>({
    defaultValues: itemDetails,
  });

  const onSubmit: SubmitHandler<{
    name: string;
    description: string;
    price: number;
    discount: number;
    category: {
      label: string;
      value: string[];
    };
  }> = (data) => {
    setItemDetails(data);
    setLevel(2);
  };

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
        <div className="title-h5 mt-2">Item Details</div>
        <p className="paragraph-medium mt-1 text-text-500">
          Set name, description, price, and category for your new item.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:card flex h-fit max-w-md flex-grow flex-col !gap-0 !overflow-visible !p-0 sm:flex-grow-0"
      >
        <div className="label-medium p-4">Item Details</div>
        <div className="border-t" />
        <div className="flex min-h-0 flex-grow flex-col gap-6 p-4 sm:flex-grow-0">
          <div className="flex flex-col gap-1">
            <label htmlFor="editName" className="label-small">
              Name
            </label>
            <Input
              size="sm"
              className="!w-full"
              id="editName"
              error={Boolean(errors.name)}
              errorMessage={errors.name?.message}
              {...register("name", {
                required: {
                  value: true,
                  message: "Name is required.",
                },
                maxLength: {
                  value: 64,
                  message: "Name should not exceed 64 characters.",
                },
                minLength: {
                  value: 3,
                  message: "Name should be at least 3 characters.",
                },
              })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="editDescription" className="label-small">
              Description
            </label>
            <Input
              textarea
              size="sm"
              className="!w-full"
              id="editDescription"
              error={Boolean(errors.description)}
              errorMessage={errors.description?.message}
              {...register("description", {
                required: {
                  value: true,
                  message: "description is required.",
                },
                maxLength: {
                  value: 2000,
                  message: "description should not exceed 2000 characters.",
                },
                minLength: {
                  value: 10,
                  message: "description should be at least 10 characters.",
                },
              })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3.5 gap-y-1">
            <div className="flex flex-col gap-1">
              <label htmlFor="editPrice" className="label-small">
                Price <span className="font-normal text-text-500">(EGP)</span>
              </label>
              <Input
                type="number"
                size="sm"
                className="!w-full"
                id="editPrice"
                error={Boolean(errors.price)}
                errorMessage={errors.price?.message}
                {...register("price", {
                  required: {
                    value: true,
                    message: "Price is required.",
                  },
                  max: {
                    value: 10000,
                    message: "Price should not exceed 10000 EGP.",
                  },
                  min: {
                    value: 10,
                    message: "Price should be at least 10 EGP.",
                  },
                })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="editDiscount" className="label-small">
                Discount{" "}
                <span className="font-normal text-text-500">(EGP)</span>
              </label>
              <Input
                type="number"
                size="sm"
                className="!w-full"
                id="editDiscount"
                error={Boolean(errors.discount)}
                errorMessage={errors.discount?.message}
                {...register("discount", {
                  max: {
                    value: 9999,
                    message: "Discount should not exceed 9999 EGP.",
                  },
                  min: {
                    value: 0,
                    message: "Discount should not be less than 0 EGP.",
                  },
                  validate: (value) => {
                    if (Number(value) >= Number(watch("price"))) {
                      return "Discount should be less than price.";
                    }

                    return true;
                  },
                })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="label-small">Category</p>
            <Controller
              control={control}
              name="category"
              rules={{ required: "Category is required." }}
              render={({
                field: { onChange, value, name, ref, onBlur, disabled },
              }) => (
                <Select
                  size="sm"
                  className="!w-full"
                  instanceId={"category-new"}
                  placeholder
                  error={Boolean(errors.category)}
                  errorMessage="Category is required."
                  options={options.map((option) => {
                    return {
                      label: option.at(-1) || "",
                      value: option,
                    };
                  })}
                  onChange={onChange}
                  value={{
                    label: value?.label || "",
                    value: value?.value || [],
                  }}
                  name={name}
                  ref={ref}
                  isDisabled={disabled}
                  onBlur={onBlur}
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t p-4">
          <Button
            text="Back"
            href="/"
            size="md"
            color="gray"
            className="justify-center"
          />
          <Button
            text="Next"
            size="md"
            color="main"
            className="justify-center"
            type="submit"
          />
        </div>
      </form>
    </>
  );
}
