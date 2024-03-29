"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { RiCloseLine, RiSearch2Line } from "react-icons/ri";
import Analytics from "./Analytics";
import Items from "./Items";
import Orders from "./Orders";
import Settings from "./Settings";

export default function Search() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<
    "analytics" | "items" | "orders" | "settings" | undefined
  >();

  useEffect(() => {
    if (!searchOpen) {
      setSearchTerm("");
      setSelected(undefined);
    }
  }, [searchOpen]);

  return (
    <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
      <Dialog.Trigger className="h-fit rounded-[10px] border border-transparent p-2 text-icon-500 transition-all hover:bg-bg-100 hover:text-text-900 active:bg-white active:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#E4E5E7] disabled:text-text-300 disabled:shadow-none sm:p-2.5">
        <RiSearch2Line size={20} />
      </Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-[hsla(209,84%,5%,0.19)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        autoFocus
        className="!pointer-events-none fixed inset-0 z-50 flex items-start justify-center rounded-2xl pt-10 shadow-[0px_16px_32px_-12px_#585C5F1A] transition duration-200 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]"
      >
        <div className="pointer-events-auto h-fit min-w-[350px] max-w-2xl rounded-2xl bg-white sm:min-w-[500px] sm:max-w-md">
          <div className="relative">
            <div className="absolute left-4 top-3 p-0.5 text-main-base">
              <RiSearch2Line size={20} />
            </div>
            <Dialog.Close className="absolute right-4 top-3 p-0.5 text-icon-500">
              <RiCloseLine size={20} />
            </Dialog.Close>
            <input
              id="mainSearchBar"
              type="text"
              autoComplete="off"
              className="w-full rounded-t-2xl border-b px-[calc(20px+2rem)] py-3"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <div className="p-4">
              <p className="label-small mb-3 text-text-400">
                What are you looking for?
              </p>
              <div className="flex flex-wrap gap-2">
                <div
                  className={`label-xsmall cursor-pointer rounded-lg px-2.5 py-1.5 transition-all ${
                    selected === "analytics"
                      ? "bg-bg-700 text-white"
                      : "bg-bg-100 text-text-500 hover:bg-bg-200"
                  }`}
                  onClick={() => {
                    if (selected === "analytics") {
                      setSelected(undefined);
                    } else {
                      setSelected("analytics");
                    }
                  }}
                >
                  Analytics
                </div>
                <div
                  className={`label-xsmall cursor-pointer rounded-lg px-2.5 py-1.5 transition-all ${
                    selected === "items"
                      ? "bg-bg-700 text-white"
                      : "bg-bg-100 text-text-500 hover:bg-bg-200"
                  }`}
                  onClick={() => {
                    if (selected === "items") {
                      setSelected(undefined);
                    } else {
                      setSelected("items");
                    }
                  }}
                >
                  Items
                </div>
                <div
                  className={`label-xsmall cursor-pointer rounded-lg px-2.5 py-1.5 transition-all ${
                    selected === "orders"
                      ? "bg-bg-700 text-white"
                      : "bg-bg-100 text-text-500 hover:bg-bg-200"
                  }`}
                  onClick={() => {
                    if (selected === "orders") {
                      setSelected(undefined);
                    } else {
                      setSelected("orders");
                    }
                  }}
                >
                  Orders
                </div>
                <div
                  className={`label-xsmall cursor-pointer rounded-lg px-2.5 py-1.5 transition-all ${
                    selected === "settings"
                      ? "bg-bg-700 text-white"
                      : "bg-bg-100 text-text-500 hover:bg-bg-200"
                  }`}
                  onClick={() => {
                    if (selected === "settings") {
                      setSelected(undefined);
                    } else {
                      setSelected("settings");
                    }
                  }}
                >
                  Settings
                </div>
              </div>
            </div>
            {selected === "analytics" || !selected ? (
              <Analytics searchTerm={searchTerm} />
            ) : null}
            {selected === "items" || !selected ? (
              <Items searchTerm={searchTerm} />
            ) : null}
            {selected === "orders" || !selected ? (
              <Orders searchTerm={searchTerm} />
            ) : null}
            {selected === "settings" || !selected ? (
              <Settings searchTerm={searchTerm} />
            ) : null}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
