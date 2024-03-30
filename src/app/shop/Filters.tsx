import { selectStyles } from "@/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import Creatable from "react-select/creatable";
import * as Slider from "@radix-ui/react-slider";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { TFilter } from "./page";
import Link from "next/link";

export default function Filters({
  noStore,
  searchParams,
}: {
  noStore?: boolean;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [localFilters, setLocalFilters] = useState(
    (() => {
      const f: TFilter = {};

      if (searchParams.name) f.name = searchParams.name as string;
      if (searchParams.category) f.category = searchParams.category as string;
      if (searchParams.store_ids && !noStore)
        f.store_ids = [searchParams.store_ids as string].flat();
      if (searchParams.price_min) f.price_min = Number(searchParams.price_min);
      if (searchParams.price_max) f.price_max = Number(searchParams.price_max);
      if (searchParams.sale) f.sale = searchParams.sale === "true";
      if (searchParams.colors)
        f.colors = [searchParams.colors as string].flat();
      if (searchParams.in_stock) f.in_stock = searchParams.in_stock === "true";
      if (searchParams.out_of_stock)
        f.out_of_stock = searchParams.out_of_stock === "true";

      return f;
    })(),
  );

  const router = useRouter();
  const pathname = usePathname();

  const [values, setValues] = useState<{
    // category: { id: number; name: string; parent_id: number }[];
    colors: string[];
    maxPrice: number;
    stores: { id: number; name: string }[];
  }>();

  useEffect(() => {
    async function getValues() {
      const maxPriceRes = await fetch("/api/prices");
      const colorsRes = await fetch("/api/colors");
      const storesRes = await fetch("/api/stores");

      setValues({
        colors: await colorsRes.json(),
        maxPrice: await maxPriceRes.json(),
        stores: await storesRes.json(),
      });
    }

    getValues();
  }, []);

  useEffect(() => {
    setLocalFilters({
      ...(() => {
        const f: TFilter = {};

        if (searchParams.name) f.name = searchParams.name as string;
        if (searchParams.category) f.category = searchParams.category as string;
        if (searchParams.store_ids)
          f.store_ids = [searchParams.store_ids as string].flat();
        if (searchParams.price_min)
          f.price_min = Number(searchParams.price_min);
        if (searchParams.price_max)
          f.price_max = Number(searchParams.price_max);
        if (searchParams.sale) f.sale = searchParams.sale === "true";
        if (searchParams.colors)
          f.colors = [searchParams.colors as string].flat();
        if (searchParams.in_stock)
          f.in_stock = searchParams.in_stock === "true";
        if (searchParams.out_of_stock)
          f.out_of_stock = searchParams.out_of_stock === "true";

        return f;
      })(),
      price_max:
        typeof searchParams.price_max === "string"
          ? parseInt(searchParams.price_max)
          : values?.maxPrice,
    });
  }, [searchParams, values?.maxPrice]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 hidden bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:block" />
      <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col justify-between gap-4 bg-white shadow-lg transition duration-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:w-3/4 sm:max-w-md sm:border-l sm:ease-in-out sm:data-[state=closed]:duration-300 sm:data-[state=open]:duration-500 sm:data-[state=closed]:fade-out-100 sm:data-[state=open]:fade-in-100 sm:data-[state=closed]:slide-out-to-right sm:data-[state=open]:slide-in-from-right">
        <div className="min-h-0 flex-grow overflow-auto p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Dialog.Close className="hover:text-quaternary text-quaternary active:bg-primary rounded-lg p-1 transition-all hover:bg-gray-50 active:shadow-[0_0_0_4px_#98A2B324]">
              <X size={20} />
            </Dialog.Close>
          </div>
          <p className="text-tertiary text-sm">Apply filters to table data.</p>
          <div className="mt-6 space-y-5">
            {!noStore ? (
              <div>
                <p className="label">Store</p>
                <Creatable
                  styles={selectStyles}
                  options={
                    values?.stores.map((s) => ({
                      value: s.id.toString(),
                      label: s.name,
                    })) || []
                  }
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      store_ids: e.map((s) => s.value),
                    })
                  }
                  placeholder
                  isMulti
                  formatCreateLabel={(value) => {
                    return value;
                  }}
                />
              </div>
            ) : null}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="label !mb-0">Price</p>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="sale"
                    className="checkbox"
                    checked={localFilters.sale}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        sale: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="sale" className="label !mb-0">
                    Sale
                  </label>
                </div>
              </div>
              <Slider.Root
                value={[
                  localFilters.price_min || 0,
                  localFilters.price_max || 600,
                ]}
                onValueChange={(e) => {
                  if (e[0] === 0)
                    setLocalFilters({
                      ...localFilters,
                      price_max: e[1],
                    });
                  else
                    setLocalFilters({
                      ...localFilters,
                      price_min: e[0],
                      price_max: e[1],
                    });
                }}
                min={0}
                max={values?.maxPrice || 600}
                step={50}
                className="relative flex h-6 w-full touch-none select-none items-center rounded-full"
              >
                <Slider.Track className="relative h-2 flex-grow rounded-full bg-gray-200">
                  <Slider.Range className="absolute h-full rounded-full bg-main-500" />
                </Slider.Track>
                <Slider.Thumb className="transition-allactive:shadow-[0_0_0_4px_#9E77ED3D,0_1px_2px_0_#1018280F,0_1px_3px_0_#1018281A] bg-primary relative block size-6 rounded-full border-2 border-main-500 font-medium shadow-[0_2px_4px_-2px_#1018280F,0_4px_8px_-2px_#1018281A]" />
                <Slider.Thumb className="bg-primary relative block size-6 rounded-full border-2 border-main-500 font-medium shadow-[0_2px_4px_-2px_#1018280F,0_4px_8px_-2px_#1018281A] transition-all active:shadow-[0_0_0_4px_#9E77ED3D,0_1px_2px_0_#1018280F,0_1px_3px_0_#1018281A]" />
              </Slider.Root>
              <div className="text-tertiary mt-2 flex w-full items-baseline justify-between text-sm font-medium">
                <p>
                  {new Intl.NumberFormat("en-US", {
                    currency: "EGP",
                    style: "currency",
                    currencyDisplay: "symbol",
                    maximumFractionDigits: 0,
                  }).format(localFilters.price_min || 0)}
                </p>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    currency: "EGP",
                    style: "currency",
                    currencyDisplay: "symbol",
                    maximumFractionDigits: 0,
                  }).format(localFilters.price_max || 600)}
                </p>
              </div>
            </div>
            <div>
              <p className="label">Colors</p>
              <Creatable
                placeholder
                styles={selectStyles}
                isMulti
                isClearable={false}
                formatCreateLabel={(inputValue) => inputValue}
                options={
                  values?.colors
                    ? values?.colors.map((c) => ({
                        value: c,
                        label: c,
                      }))
                    : []
                }
                value={
                  localFilters.colors?.map((c) => ({
                    value: c,
                    label: c,
                  })) || []
                }
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    colors: e.map((c) => c.value),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="inStock"
                  className="checkbox"
                  checked={localFilters.in_stock}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      in_stock: e.target.checked,
                    })
                  }
                />
                <label htmlFor="inStock" className="label !mb-0">
                  In stock
                </label>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="outOfStock"
                  className="checkbox"
                  checked={localFilters.out_of_stock}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      out_of_stock: e.target.checked,
                    })
                  }
                />
                <label htmlFor="outOfStock" className="label !mb-0">
                  Out of stock
                </label>
              </div>
            </div>
            <div>
              <p className="label">Categories</p>
              <div className="space-y-1 font-medium text-main-500">
                {searchParams.category !== "jackets" ? (
                  <Link className="block w-fit" href="/shop?category=jackets">
                    Jackets
                  </Link>
                ) : (
                  <p className="text-primary">Jackets</p>
                )}
                {searchParams.category !== "dresses" ? (
                  <Link className="block w-fit" href="/shop?category=dresses">
                    Dresses
                  </Link>
                ) : (
                  <p className="text-primary">Dresses</p>
                )}
                {searchParams.category !== "shoes" ? (
                  <Link className="block w-fit" href="/shop?category=shoes">
                    Shoes
                  </Link>
                ) : (
                  <p className="text-primary">Shoes</p>
                )}
                {searchParams.category !== "accessories" ? (
                  <Link
                    className="block w-fit"
                    href="/shop?category=accessories"
                  >
                    Accessories
                  </Link>
                ) : (
                  <p className="text-primary">Accessories</p>
                )}
                {searchParams.category !== "tops" ? (
                  <Link className="block w-fit" href="/shop?category=tops">
                    Tops
                  </Link>
                ) : (
                  <p className="text-primary">Tops</p>
                )}
                <div className="ml-5">
                  {searchParams.category !== "tshirts" ? (
                    <Link className="block w-fit" href="/shop?category=tshirts">
                      Tshirts
                    </Link>
                  ) : (
                    <p className="text-primary">Tshirts</p>
                  )}
                  {searchParams.category !== "shirts" ? (
                    <Link className="block w-fit" href="/shop?category=shirts">
                      Shirts
                    </Link>
                  ) : (
                    <p className="text-primary">Shirts</p>
                  )}
                  {searchParams.category !== "hoodies" ? (
                    <Link className="block w-fit" href="/shop?category=hoodies">
                      Hoodies
                    </Link>
                  ) : (
                    <p className="text-primary">Hoodies</p>
                  )}
                  {searchParams.category !== "sweatshirts" ? (
                    <Link
                      className="block w-fit"
                      href="/shop?category=sweatshirts"
                    >
                      Sweatshirts
                    </Link>
                  ) : (
                    <p className="text-primary">Sweatshirts</p>
                  )}
                </div>
                {searchParams.category !== "bottoms" ? (
                  <Link className="block w-fit" href="/shop?category=bottoms">
                    Bottoms
                  </Link>
                ) : (
                  <p className="text-primary">Bottoms</p>
                )}
                <div className="ml-5">
                  {searchParams.category !== "shorts" ? (
                    <Link className="block w-fit" href="/shop?category=shorts">
                      Shorts
                    </Link>
                  ) : (
                    <p className="text-primary">Shorts</p>
                  )}
                  {searchParams.category !== "jeans" ? (
                    <Link className="block w-fit" href="/shop?category=jeans">
                      Jeans
                    </Link>
                  ) : (
                    <p className="text-primary">Jeans</p>
                  )}
                  {searchParams.category !== "sweatpants" ? (
                    <Link
                      className="block w-fit"
                      href="/shop?category=sweatpants"
                    >
                      Sweatpants
                    </Link>
                  ) : (
                    <p className="text-primary">Sweatpants</p>
                  )}
                  {searchParams.category !== "cargo" ? (
                    <Link className="block w-fit" href="/shop?category=cargo">
                      Cargo
                    </Link>
                  ) : (
                    <p className="text-primary">Cargo</p>
                  )}
                  {searchParams.category !== "leggings" ? (
                    <Link
                      className="block w-fit"
                      href="/shop?category=leggings"
                    >
                      Leggings
                    </Link>
                  ) : (
                    <p className="text-primary">Leggings</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-none justify-end gap-3 border-t px-6 py-4">
          <DialogClose className="button gray">Cancel</DialogClose>
          <DialogClose
            className="button main"
            onClick={() => {
              const newFilters = { ...localFilters };

              if (newFilters.price_max === values?.maxPrice)
                delete newFilters.price_max;
              if (newFilters.price_min === 0) delete newFilters.price_min;
              if (newFilters.sale === false) delete newFilters.sale;

              const searchParams = new URLSearchParams();

              for (const key in newFilters) {
                // @ts-ignore
                if (Array.isArray(newFilters[key])) {
                  // @ts-ignore
                  newFilters[key].forEach((value) => {
                    searchParams.append(key, value);
                  });
                } else {
                  // @ts-ignore
                  searchParams.append(key, newFilters[key]);
                }
              }

              router.push(pathname + "?" + searchParams.toString());
            }}
          >
            Apply
          </DialogClose>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
