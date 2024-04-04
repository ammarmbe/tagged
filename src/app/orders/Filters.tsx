import { selectStyles } from "@/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactSelect from "react-select";

export default function Filters({
  filters,
  setFilters,
  setFiltersOpen,
}: {
  filters: {
    governorate?: string;
    status?: string[];
    totalMin?: number;
    totalMax?: number;
    shippingMin?: number;
    shippingMax?: number;
    createdMin?: Date;
    createdMax?: Date;
  };
  setFilters: Dispatch<
    SetStateAction<{
      governorate?: string;
      status?: string[];
      totalMin?: number;
      totalMax?: number;
      shippingMin?: number;
      shippingMax?: number;
      createdMin?: Date;
      createdMax?: Date;
    }>
  >;
  setFiltersOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const governorates = [
    "Cairo",
    "Alexandria",
    "Giza",
    "Aswan",
    "Asyut",
    "Beheira",
    "Beni Suef",
    "Dakahlia",
    "Damietta",
    "Faiyum",
    "Gharbia",
    "Ismailia",
    "Kafr El Sheikh",
    "Luxor",
    "Matrouh",
    "Minya",
    "Monufia",
    "New Valley",
    "North Sinai",
    "Port Said",
    "Qalyubia",
    "Qena",
    "Red Sea",
    "Sharqia",
    "Sohag",
    "South Sinai",
    "Suez",
  ];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  return (
    <>
      <div className="p-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <p className="text-tertiary text-sm">Apply filters to table data.</p>
        <div className="mt-6 space-y-5">
          <div>
            <p className="label">Status</p>
            <ReactSelect
              styles={selectStyles}
              options={[
                { value: "pending", label: "Pending" },
                { value: "shipped", label: "Shipped" },
                { value: "completed", label: "completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "returned", label: "Returned" },
                { value: "confirmed", label: "Confirmed" },
              ]}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  status: e.map((x) => x.value),
                })
              }
              isClearable
              placeholder
              isMulti
            />
          </div>
          <div>
            <p className="label">Governorate</p>
            <ReactSelect
              styles={selectStyles}
              options={governorates.map((g) => ({ value: g, label: g }))}
              value={
                localFilters.governorate
                  ? {
                      value: localFilters.governorate,
                      label: localFilters.governorate,
                    }
                  : null
              }
              onChange={(e: any) =>
                setLocalFilters({ ...localFilters, governorate: e.value })
              }
              isClearable
              placeholder
              isMulti
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="totalMin" className="label">
                Subtotal (min)
              </label>
              <input
                type="number"
                id="totalMin"
                className="input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilters(localFilters);
                    setFiltersOpen(false);
                  }
                }}
                value={localFilters.totalMin}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    totalMin: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="totalMax" className="label">
                Subtotal (max)
              </label>
              <input
                type="number"
                id="totalMax"
                className="input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilters(localFilters);
                    setFiltersOpen(false);
                  }
                }}
                value={localFilters.totalMax}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    totalMax: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="shippingMin" className="label">
                Shipping (min)
              </label>
              <input
                type="number"
                id="shippingMin"
                className="input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilters(localFilters);
                    setFiltersOpen(false);
                  }
                }}
                value={localFilters.shippingMin}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    shippingMin: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="shippingMax" className="label">
                Shipping (max)
              </label>
              <input
                type="number"
                className="input"
                id="shippingMax"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilters(localFilters);
                    setFiltersOpen(false);
                  }
                }}
                value={localFilters.shippingMax}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    shippingMax: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="createdMin" className="label">
                Created after
              </label>
              <input
                type="datetime-local"
                id="createdMin"
                className="input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilters(localFilters);
                    setFiltersOpen(false);
                  }
                }}
                value={localFilters.createdMin?.toISOString().slice(0, -8)}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    createdMin: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="createdMax" className="label">
                Created before
              </label>
              <input
                type="datetime-local"
                id="createdMax"
                className="input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilters(localFilters);
                    setFiltersOpen(false);
                  }
                }}
                value={localFilters.createdMax?.toISOString().slice(0, -8)}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    createdMax: new Date(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t px-6 py-4">
        <DialogClose className="button gray">Cancel</DialogClose>
        <DialogClose
          className="button main"
          onClick={() => {
            setFilters(localFilters);
          }}
        >
          Apply
        </DialogClose>
      </div>
    </>
  );
}
