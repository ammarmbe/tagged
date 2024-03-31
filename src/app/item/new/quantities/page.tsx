"use client";
import Button from "@/components/primitives/Button";
import Input from "@/components/primitives/Input";
import { RiNumbersLine } from "react-icons/ri";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function Quantities() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    quantities: {
      color: string;
      hex: string;
      size: string;
      quantity: number | undefined;
    }[];
  }>({
    defaultValues: {
      quantities:
        queryClient.getQueryData(["quantities"]) ??
        (
          queryClient.getQueryData(["colors"]) as {
            color: string;
            hex: string;
          }[]
        )?.reduce<
          {
            color: string;
            size: string;
            hex: string;
            quantity: number | undefined;
          }[]
        >(
          (acc, { color, hex }) => [
            ...acc,
            ...(queryClient.getQueryData(["sizes"]) as string[]).map(
              (size) => ({
                color,
                size,
                hex,
                quantity: undefined,
              }),
            ),
          ],
          [],
        ) ??
        [],
    },
  });

  const onSubmit: SubmitHandler<{
    quantities: {
      color: string;
      size: string;
      hex: string;
      quantity: number | undefined;
    }[];
  }> = (data) => {
    queryClient.setQueryData(["quantities"], data.quantities);
    router.push("/item/new/images");
  };

  return (
    <>
      <div className="hidden flex-col items-center pt-12 sm:flex">
        <div className="relative w-fit rounded-full bg-[linear-gradient(180deg,#E4E5E7_0%,rgba(228,229,231,0)76.56%)] p-px">
          <div className="absolute inset-px rounded-full bg-white" />
          <div className="relative z-10 w-fit rounded-full bg-[linear-gradient(180deg,rgba(228,229,231,0.48)0%,rgba(247,248,248,0)100%,rgba(228,229,231,0)100%)] p-4">
            <div className="w-fit rounded-full border bg-white p-4 shadow-[0px_2px_4px_0px_#1B1C1D0A]">
              <RiNumbersLine size={32} className="text-icon-500" />
            </div>
          </div>
        </div>
        <div className="title-h5 mt-2">Quantities</div>
        <p className="paragraph-medium mt-1 text-text-500">
          Set the quantities for different configurations of your new item.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:card flex h-fit w-full flex-grow flex-col !gap-0 !overflow-visible !p-0 sm:max-w-md sm:flex-grow-0"
      >
        <div className="label-medium p-4">Quantities</div>
        <div className="border-t" />
        <div className="flex min-h-0 flex-grow flex-col gap-6 p-4 sm:flex-grow-0">
          {watch("quantities")?.map((quantity, index) => {
            return (
              <div
                key={index}
                className="grid grid-cols-[1fr,auto] items-start gap-4"
              >
                <p className="label-small flex h-[calc(2.25rem+2px)] items-center">
                  {quantity.color + " / " + quantity.size}
                </p>
                <Input
                  size="sm"
                  type="number"
                  className="w-[100px] sm:!w-[200px]"
                  error={Boolean(errors.quantities?.[index]?.quantity?.message)}
                  errorMessage={errors.quantities?.[index]?.quantity?.message}
                  {...register(`quantities.${index}.quantity` as const, {
                    min: {
                      value: 0,
                      message: "Inventory must be at least 0",
                    },
                  })}
                />
              </div>
            );
          }) ?? (
            <p className="label-small p-4 text-center text-text-400">
              Please add at least one color and size first.
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 border-t p-4">
          <Button
            text="Back"
            href="/item/new/colors-sizes"
            size="md"
            color="gray"
            className="justify-center"
            type="button"
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
