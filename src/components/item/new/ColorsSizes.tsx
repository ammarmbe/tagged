import Button from "@/components/primitives/Button";
import Input from "@/components/primitives/Input";
import { RiCloseLine, RiPantoneLine } from "react-icons/ri";
import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

const customColors = {
  blue: {
    lighter: "#EBF1FF",
    light: "#C2D6FF",
    text: "#162664",
    input: "#f4f7ff",
    classes: <div className="!text-[#162664]" />,
  },
  orange: {
    lighter: "#FEF3EB",
    light: "#FFDAC2",
    text: "#6E330C",
    input: "#fff9f5",
    classes: <div className="!text-[#6E330C]" />,
  },
  yellow: {
    lighter: "#FEF7EC",
    light: "#FBDFB1",
    text: "#693D11",
    input: "#fffcf6",
    classes: <div className="!text-[#693D11]" />,
  },
  red: {
    lighter: "#FDEDF0",
    light: "#F8C9D2",
    text: "#710E21",
    input: "#fff5f7",
    classes: <div className="!text-[#710E21]" />,
  },
  green: {
    lighter: "#EFFAF6",
    light: "#CBF5E4",
    text: "#176448",
    input: "#f9fffd",
    classes: <div className="!text-[#176448]" />,
  },
  purple: {
    lighter: "#EEEBFF",
    light: "#CAC2FF",
    text: "#2B1664",
    input: "#f6f4ff",
    classes: <div className="!text-[#2B1664]" />,
  },
  pink: {
    lighter: "#FDEBFF",
    light: "#F9C2FF",
    text: "#620F6C",
    input: "#fef4ff",
    classes: <div className="!text-[#620F6C]" />,
  },
  teal: {
    lighter: "#EBFAFF",
    light: "#C2EFFF",
    text: "#164564",
    input: "#f7fdff",
    classes: <div className="!text-[#164564]" />,
  },
} as {
  [key: string]: {
    light: string;
    lighter: string;
    text: string;
    input: string;
  };
};

export default function ColorsSizes({
  colors,
  sizes,
  setColors,
  setSizes,
  setLevel,
}: {
  colors: { color: string; hex: string }[];
  sizes: string[];
  setColors: Dispatch<SetStateAction<{ color: string; hex: string }[]>>;
  setSizes: Dispatch<SetStateAction<string[]>>;
  setLevel: Dispatch<SetStateAction<number>>;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{
    colors: {
      color: string;
      hex: string;
    }[];
    sizes: string[];
  }>({
    defaultValues: {
      colors,
      sizes,
    },
  });

  const debounced = useDebouncedCallback(
    (value: { hex: string; index: number }) => {
      setValue(`colors.${value.index}.hex`, value.hex);
    },
    300,
  );

  const onSubmit: SubmitHandler<{
    colors: {
      color: string;
      hex: string;
    }[];
    sizes: string[];
  }> = (e) => {
    setColors(e.colors);
    setSizes(e.sizes);
    setLevel(3);
  };

  return (
    <>
      <div className="hidden flex-col items-center pt-12 sm:flex">
        <div className="relative w-fit rounded-full bg-[linear-gradient(180deg,#E4E5E7_0%,rgba(228,229,231,0)76.56%)] p-px">
          <div className="absolute inset-px rounded-full bg-white" />
          <div className="relative z-10 w-fit rounded-full bg-[linear-gradient(180deg,rgba(228,229,231,0.48)0%,rgba(247,248,248,0)100%,rgba(228,229,231,0)100%)] p-4">
            <div className="w-fit rounded-full border bg-white p-4 shadow-[0px_2px_4px_0px_#1B1C1D0A]">
              <RiPantoneLine size={32} className="text-icon-500" />
            </div>
          </div>
        </div>
        <div className="title-h5 mt-2">Colors & Sizes</div>
        <p className="paragraph-medium mt-1 text-text-500">
          Add different colors and sizes for your new item.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:card flex h-fit w-full flex-grow flex-col !gap-0 !overflow-visible !p-0 sm:max-w-md sm:flex-grow-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-4">
          <div className="label-medium">Colors & Sizes</div>
          <div className="flex gap-2">
            <Button
              text="Add color"
              onClick={() =>
                setValue("colors", [
                  ...watch("colors"),
                  { color: "", hex: "#000000" },
                ])
              }
              size="xs"
              color="gray"
            />
            <Button
              text="Add size"
              onClick={() => setValue("sizes", [...watch("sizes"), ""])}
              size="xs"
              color="gray"
            />
          </div>
        </div>
        <div className="grid flex-grow grid-cols-2">
          <div
            {...register("colors", {
              validate: (value) => {
                if (!value?.length) return "Please add at least one color.";
              },
            })}
            className={`subheading-xsmall hidden bg-bg-100 px-2 py-1.5 pl-4 sm:block ${
              errors.colors?.message ? "text-error" : "text-text-400"
            }`}
          >
            Colors
          </div>
          <div
            {...register("sizes", {
              validate: (value) => {
                if (!value?.length) return "Please add at least one size.";
              },
            })}
            className={`subheading-xsmall hidden bg-bg-100 px-2 py-1.5 pl-2 sm:block ${
              errors.sizes?.message ? "text-error" : "text-text-400"
            }`}
          >
            Sizes
          </div>
          <div className="col-span-2 grid-cols-2 overflow-auto sm:grid sm:max-h-[300px]">
            <div
              className={`subheading-xsmall h-fit bg-bg-100 px-2 py-1.5 pl-4 sm:hidden ${
                errors.colors?.message ? "text-error" : "text-text-400"
              }`}
            >
              Colors
            </div>
            <div className="flex flex-col gap-3 p-4 sm:pr-2">
              {watch("colors").length ? (
                watch("colors").map((color, i) => (
                  <div
                    key={i}
                    className="h-fit space-y-1 rounded-xl border"
                    style={{
                      background: `linear-gradient(${
                        customColors[color.color.toLowerCase()]?.light ??
                        "#FFFFFF"
                      }, ${
                        customColors[color.color.toLowerCase()]?.lighter ??
                        "#FFFFFF"
                      })`,
                      border: customColors[color.color.toLowerCase()]?.text
                        ? "none"
                        : "1px solid #E2E4E9",
                      padding: customColors[color.color.toLowerCase()]?.text
                        ? "calc(0.75rem + 1px)"
                        : "0.75rem",
                    }}
                  >
                    <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
                      <div />
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={"colorName" + i}
                          className="label-small"
                          style={{
                            color:
                              customColors[color.color.toLowerCase()]?.text ??
                              undefined,
                          }}
                        >
                          Color name
                        </label>
                        <button
                          color="gray"
                          className={`!rounded-full border-none !bg-transparent !p-0.5 !text-[${
                            customColors[color.color.toLowerCase()]?.text
                          }]`}
                          onClick={() => {
                            setValue(
                              "colors",
                              watch("colors").filter((_, index) => index !== i),
                            );
                          }}
                        >
                          <RiCloseLine size={16} />
                        </button>
                      </div>
                      <input
                        type="color"
                        onChange={(e) => {
                          debounced({ hex: e.target.value, index: i });
                        }}
                        className="size-[calc(2rem+2px)] sm:size-[calc(2.251rem+2px)]"
                      />
                      <Input
                        type="text"
                        id={"colorName" + i}
                        error={Boolean(errors.colors?.[i]?.color?.message)}
                        {...register(`colors.${i}.color`, {
                          required: {
                            value: true,
                            message: "Color name is required.",
                          },
                          validate: (value, formValues) => {
                            if (
                              formValues.colors.filter((c) => c.color === value)
                                .length > 1
                            )
                              return "Color name must be unique.";

                            return true;
                          },
                        })}
                        errorMessage={errors.colors?.[i]?.color?.message}
                        className={
                          customColors[color.color.toLowerCase()]
                            ? "w-full !shadow-none focus:border-text-400"
                            : "w-full"
                        }
                        size="sm"
                      />
                    </div>
                  </div>
                ))
              ) : errors.colors?.message ? (
                <p className="label-small py-3 text-center text-error">
                  Please add at least one color.
                </p>
              ) : (
                <p className="label-small py-3 text-center text-text-400">
                  No colors
                </p>
              )}
            </div>
            <div
              className={`subheading-xsmall h-fit bg-bg-100 px-2 py-1.5 pl-2 sm:hidden ${
                errors.sizes?.message ? "text-error" : "text-text-400"
              }`}
            >
              Sizes
            </div>
            <div className="flex flex-col gap-3 p-4 sm:pl-2">
              {watch("sizes").length ? (
                watch("sizes").map((_, i) => (
                  <div
                    key={i}
                    className="h-fit space-y-1 rounded-xl border bg-white p-3"
                  >
                    <div className="flex items-center justify-between">
                      <label htmlFor={"sizeName" + i} className="label-small">
                        Size name
                      </label>
                      <button
                        color="gray"
                        className="!rounded-full border-none !bg-transparent !p-0.5"
                        onClick={() => {
                          setValue(
                            "sizes",
                            watch("sizes").filter((_, index) => index !== i),
                          );
                        }}
                      >
                        <RiCloseLine size={16} />
                      </button>
                    </div>
                    <Input
                      type="text"
                      id={"sizeName" + i}
                      error={Boolean(errors.sizes?.[i]?.message)}
                      errorMessage={errors.sizes?.[i]?.message}
                      size="sm"
                      className="w-full"
                      {...register(`sizes.${i}`, {
                        required: "Size name is required.",
                        validate: (value, formValues) => {
                          if (
                            formValues.sizes.filter((s) => s === value).length >
                            1
                          )
                            return "Size name must be unique.";

                          return true;
                        },
                      })}
                    />
                  </div>
                ))
              ) : errors.sizes?.message ? (
                <p className="label-small py-3 text-center text-error">
                  Please add at least one size.
                </p>
              ) : (
                <p className="label-small py-3 text-center text-text-400">
                  No sizes
                </p>
              )}
            </div>
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
