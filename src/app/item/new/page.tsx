"use client";
import ColorsSizes from "@/components/item/new/ColorsSizes";
import ItemDetails from "@/components/item/new/ItemDetails";
import ItemSummary from "@/components/item/new/ItemSummary";
import Quantities from "@/components/item/new/Quantities";
import Sidebar from "@/components/item/new/Sidebar";
import Button from "@/components/primitives/Button";
import { RiArrowLeftLine } from "react-icons/ri";
import { useEffect, useState } from "react";

export default function Page() {
  const [level, setLevel] = useState(1);
  const [itemDetails, setItemDetails] = useState<
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
  >({
    name: "Black Dress",
    description: "A simple black dress",
    price: 1800,
    discount: 0,
    category: {
      label: "Dresses",
      value: ["Dresses"],
    },
  });
  const [colors, setColors] = useState<{ color: string; hex: string }[]>([
    { color: "Black", hex: "#000000" },
  ]);
  const [sizes, setSizes] = useState<string[]>(["Small", "Medium", "Large"]);
  const [quantities, setQuantities] = useState<
    { color: string; size: string; quantity: number | undefined }[]
  >([]);

  useEffect(() => {
    if (
      level > 1 &&
      (!itemDetails?.name ||
        !itemDetails?.description ||
        !itemDetails?.price ||
        !itemDetails?.category?.value.filter((c) => c).length)
    ) {
      setLevel(1);
    }
  }, [level, itemDetails]);

  useEffect(() => {
    if (level > 2 && (!colors.length || !sizes.length)) {
      setLevel(2);
    }
  }, [level, colors, sizes]);

  useEffect(() => {
    if (
      level > 3 &&
      (!quantities.length || quantities.length !== colors.length * sizes.length)
    ) {
      setLevel(3);
    }
  }, [level, quantities, colors, sizes]);

  useEffect(() => {
    setColors([{ color: "Black", hex: "#000000" }]);
    setSizes(["Small", "Medium", "Large"]);
    setQuantities([]);
  }, [itemDetails]);

  useEffect(() => {
    setQuantities([]);
  }, [colors, sizes]);

  return (
    <div className="flex h-screen flex-grow flex-col sm:flex-row">
      <Sidebar current_level={level} />
      <div className="relative z-10 flex min-h-0 min-w-0 flex-grow flex-col items-center gap-10 overflow-auto">
        <Button
          color="gray"
          disabled={level === 1}
          onClick={() => setLevel(level === 1 ? level : level - 1)}
          className="absolute right-6 top-6 hidden rounded-full border bg-white p-3 shadow-md sm:block"
          iconLeft={<RiArrowLeftLine />}
        />
        {level === 1 ? (
          <ItemDetails
            setItemDetails={setItemDetails}
            itemDetails={itemDetails}
            setLevel={setLevel}
          />
        ) : level === 2 ? (
          <ColorsSizes
            setLevel={setLevel}
            colors={colors}
            sizes={sizes}
            setColors={setColors}
            setSizes={setSizes}
          />
        ) : level === 3 ? (
          <Quantities
            colors={colors}
            sizes={sizes}
            setQuantities={setQuantities}
            setLevel={setLevel}
          />
        ) : (
          <ItemSummary
            itemDetails={itemDetails}
            colors={colors}
            sizes={sizes}
            quantities={quantities}
            setLevel={setLevel}
          />
        )}
      </div>
    </div>
  );
}
