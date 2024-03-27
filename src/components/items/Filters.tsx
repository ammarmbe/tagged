import * as Dialog from "@radix-ui/react-dialog";
import Button from "../primitives/Button";
import { useEffect, useState } from "react";
import Input from "../primitives/Input";
import Select from "../primitives/Select";
import { useSearchParams } from "next/navigation";
import { useFilters } from "@/utils";
import { RiCloseLine, RiFilter3Line } from "react-icons/ri";
import DialogComponent from "../primitives/Dialog";

export default function Filters() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = useFilters();
  const searchParams = useSearchParams();
  const [localFilters, setLocalFilters] = useState({
    name: "",
    category: [] as string[],
    availability: {
      inStock: false,
      outOfStock: false,
    },
    quantity: {
      min: "",
      max: "",
    },
    price: {
      min: "",
      max: "",
    },
    discount: {
      active: false,
      min: "",
      max: "",
    },
    revenue: {
      min: "",
      max: "",
    },
  });

  useEffect(() => {
    setLocalFilters({
      name: searchParams.get("name") || "",
      category: searchParams.getAll("category") as string[],
      availability: {
        inStock: searchParams.get("availability") === "in_stock",
        outOfStock: searchParams.get("availability") === "out_of_stock",
      },
      quantity: {
        min: searchParams.get("quantity_min") || "",
        max: searchParams.get("quantity_max") || "",
      },
      price: {
        min: searchParams.get("price_min") || "",
        max: searchParams.get("price_max") || "",
      },
      discount: {
        active: searchParams.get("discount") === "true",
        min: searchParams.get("discount_min") || "",
        max: searchParams.get("discount_max") || "",
      },
      revenue: {
        min: searchParams.get("revenue_min") || "",
        max: searchParams.get("revenue_max") || "",
      },
    });
  }, [searchParams]);

  return (
    <DialogComponent
      trigger={
        <Button
          text="Filter"
          iconLeft={<RiFilter3Line size={20} />}
          size="sm"
          color="gray"
        />
      }
      open={filtersOpen}
      onOpenChange={setFiltersOpen}
      sheet
    >
      <div className="flex items-center gap-5 p-4 pl-6 sm:px-6 sm:py-5">
        <p className="label-large flex-grow">Filters</p>
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
          <label htmlFor="nameFilters" className="label-small">
            Name
          </label>
          <Input
            size="sm"
            className="!w-full"
            id="nameFilters"
            value={localFilters.name}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                name: e.target.value,
              })
            }
          />
        </div>{" "}
        <div className="space-y-1">
          <label className="label-small">Category</label>
          <Select
            isMulti
            placeholder
            size="sm"
            value={localFilters.category.map((item) => ({
              value: item,
              label: item,
            }))}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                category: e.map((item) => item.value),
              })
            }
            options={[
              "Jackets",
              "Dresses",
              "Shoes",
              "Accessories",
              "Tops",
              "Tshirts",
              "Shirts",
              "Hoodies",
              "Sweatshirts",
              "Bottoms",
              "Shorts",
              "Jeans",
              "Sweatpants",
              "Cargo",
              "Leggings",
            ].map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </div>
        <div className="space-y-2">
          <p className="label-small">Availability</p>
          <div className="space-y-1">
            <div className="flex gap-1.5">
              <div className="flex size-[18px] items-center justify-center">
                <input
                  type="checkbox"
                  id="in_stock"
                  className="checkbox"
                  checked={localFilters.availability.inStock}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      availability: {
                        ...localFilters.availability,
                        inStock: e.target.checked,
                      },
                    })
                  }
                />
              </div>
              <label htmlFor="in_stock" className="paragraph-small">
                In stock
              </label>
            </div>
            <div className="flex gap-1.5">
              <div className="flex size-[18px] items-center justify-center">
                <input
                  type="checkbox"
                  id="out_of_stock"
                  className="checkbox"
                  checked={localFilters.availability.outOfStock}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      availability: {
                        ...localFilters.availability,
                        outOfStock: e.target.checked,
                      },
                    })
                  }
                />
              </div>
              <label htmlFor="out_of_stock" className="paragraph-small">
                Out of stock
              </label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5 gap-y-1">
          <p className="label-small col-span-2">Quantity</p>
          <Input
            size="sm"
            className="!w-auto"
            type="number"
            placeholder="Min"
            value={localFilters.quantity.min}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                quantity: {
                  ...localFilters.quantity,
                  min: e.target.value,
                },
              })
            }
          />
          <Input
            size="sm"
            className="!w-auto"
            type="number"
            placeholder="Max"
            value={localFilters.quantity.max}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                quantity: {
                  ...localFilters.quantity,
                  max: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5 gap-y-1">
          <p className="label-small col-span-2">Price</p>
          <Input
            size="sm"
            className="!w-auto"
            type="number"
            placeholder="Min"
            value={localFilters.price.min}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                price: {
                  ...localFilters.price,
                  min: e.target.value,
                },
              })
            }
          />
          <Input
            size="sm"
            className="!w-auto"
            type="number"
            placeholder="Max"
            value={localFilters.price.max}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                price: {
                  ...localFilters.price,
                  max: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5 gap-y-1">
          <div className="col-span-2 flex gap-1.5">
            <div className="flex size-[18px] items-center justify-center">
              <input
                type="checkbox"
                id="discountFilter"
                className="checkbox"
                checked={localFilters.discount.active}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    discount: {
                      ...localFilters.discount,
                      active: e.target.checked,
                    },
                  })
                }
              />
            </div>
            <label htmlFor="discountFilter" className="label-small">
              Discount
            </label>
          </div>
          <Input
            size="sm"
            className="!w-auto"
            type="number"
            placeholder="Min"
            value={localFilters.discount.min}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                discount: {
                  ...localFilters.discount,
                  min: e.target.value,
                },
              })
            }
            disabled={!localFilters.discount.active}
          />
          <Input
            size="sm"
            className="!w-auto"
            type="number"
            placeholder="Max"
            value={localFilters.discount.max}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                discount: {
                  ...localFilters.discount,
                  max: e.target.value,
                },
              })
            }
            disabled={!localFilters.discount.active}
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5 gap-y-1">
          <p className="label-small col-span-2">Revenue</p>
          <Input
            size="sm"
            className="!w-auto"
            type="number"
            placeholder="Min"
            value={localFilters.revenue.min}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                revenue: {
                  ...localFilters.revenue,
                  min: e.target.value,
                },
              })
            }
          />
          <Input
            size="sm"
            className="!w-auto"
            type="number"
            placeholder="Max"
            value={localFilters.revenue.max}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                revenue: {
                  ...localFilters.revenue,
                  max: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div className="border-t" />
      <div className="grid grid-cols-2 gap-4 gap-y-1 px-6 py-5">
        <Button
          color="gray"
          size="md"
          className="justify-center"
          text="Clear"
          onClick={(e) => {
            e.preventDefault();
            filters.clearAll();
            setFiltersOpen(false);
          }}
        />
        <Button
          text="Apply"
          color="main"
          size="md"
          className="justify-center"
          onClick={() => {
            const newFilters = { ...localFilters };

            if (
              newFilters.availability.inStock ===
              newFilters.availability.outOfStock
            ) {
              newFilters.availability.inStock = false;
              newFilters.availability.outOfStock = false;
            }

            Array.from(Object.entries(newFilters)).forEach(([key, value]) => {
              if (value)
                if (Array.isArray(value)) {
                  if (value.join("") !== "") filters.set(key, value.join(","));
                } else if (typeof value === "object") {
                  Array.from(Object.entries(value)).forEach(([k, v]) => {
                    if (v)
                      filters.set(
                        k === "active" ? key : `${key}_${k}`,
                        v.toString(),
                      );
                  });
                } else {
                  filters.set(key, value);
                }
            });

            setFiltersOpen(false);
          }}
        />
      </div>
    </DialogComponent>
  );
}
