"use client";
import Header from "@/components/header/Header";
import { RiPantoneLine } from "react-icons/ri";
import Loading from "../primitives/Loading";
import { useState, useEffect } from "react";
import { useUser } from "@/utils";

export default function Page() {
  const [table, setTable] = useState<"comfortable" | "compact">();
  const [theme, setTheme] = useState<"light" | "dark">();

  const { user, isFetching } = useUser();

  useEffect(() => {
    setTable(user?.feature_flags?.table_size);
    setTheme(user?.feature_flags?.color_theme);
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
        <Loading isFetching={isFetching} />
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
        <div className="border-t sm:col-span-2" />
        <div>
          <p className="label-small">Color Theme</p>
          <div className="paragraph-small mt-1 text-text-600">
            Switch between light and dark mode.
          </div>
        </div>
        <div className="flex flex-col gap-2 self-center">
          <div className="flex gap-2">
            <input
              type="radio"
              className="radio"
              name="theme"
              id="light"
              checked={theme === "light"}
              onChange={async () => {
                setTheme("light");

                await fetch("/api/current-user/appearance/theme", {
                  method: "POST",
                  body: JSON.stringify({ theme: "light" }),
                });

                // add to localStorage
                localStorage.setItem("theme", "light");
                document.documentElement.classList.remove("dark");
              }}
            />
            <label htmlFor="light" className="label-small">
              Light
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              className="radio"
              id="dark"
              name="theme"
              checked={theme === "dark"}
              onChange={async () => {
                setTheme("dark");

                await fetch("/api/current-user/appearance/theme", {
                  method: "POST",
                  body: JSON.stringify({ theme: "dark" }),
                });

                // add to localStorage
                localStorage.setItem("theme", "dark");
                document.documentElement.classList.add("dark");
              }}
            />
            <label htmlFor="dark" className="label-small">
              Dark
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              className="radio"
              id="system"
              name="theme"
              checked={!theme}
              onChange={async () => {
                setTheme(undefined);

                await fetch("/api/current-user/appearance/theme", {
                  method: "POST",
                  body: JSON.stringify({ theme: undefined }),
                });

                // add to localStorage
                localStorage.removeItem("theme");
                document.documentElement.classList.remove("dark");
              }}
            />
            <label htmlFor="system" className="label-small">
              System
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
