"use client";
import Header from "@/components/header/Header";
import { RiPantoneLine } from "react-icons/ri";
import Loading from "../primitives/Loading";
import { useState, useEffect } from "react";
import { useUser } from "@/utils";

export default function Page() {
  const [table, setTable] = useState<"comfortable" | "compact">();

  const { user, isLoading } = useUser();

  useEffect(() => {
    setTable(user?.feature_flags?.table_size);
  }, [user?.feature_flags]);

  return (
    <div className="flex flex-grow flex-col">
      <Header
        icon={<RiPantoneLine size={24} className="text-text-600" />}
        title="Appearance"
        description="Change the look of your dashboard."
      />
      <div className="mx-8 border-t" />
      <div className="relative grid gap-x-10 gap-y-5 px-8 py-5 sm:grid-cols-2 sm:gap-x-20">
        <Loading isLoading={isLoading} />
        <div>
          <p className="label-small">Table Size</p>
          <div className="paragraph-small mt-1 text-text-600">
            Choose between a comfortable or compact table size.
          </div>
        </div>
        <div className="flex flex-col gap-2 self-center">
          <div className="flex gap-2">
            <input
              type="radio"
              className="radio"
              name="table"
              id="comfortable"
              checked={table === "comfortable"}
              onChange={async () => {
                setTable("comfortable");

                await fetch("/api/current-user/appearance/table", {
                  method: "POST",
                  body: JSON.stringify({ table: "comfortable" }),
                });
              }}
            />
            <label htmlFor="comfortable" className="label-small">
              Comfortable
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              className="radio"
              id="compact"
              name="table"
              checked={table === "compact"}
              onChange={async () => {
                setTable("compact");

                await fetch("/api/current-user/appearance/table", {
                  method: "POST",
                  body: JSON.stringify({ table: "compact" }),
                });
              }}
            />
            <label htmlFor="compact" className="label-small">
              Compact
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
