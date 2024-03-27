"use client";
import { User } from "lucia";
import { ChevronRight } from "lucide-react";
import Link from "@/utils/Link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import Configuration from "./Configuration";
import { Item } from "./page";
import { getBaseUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";

export default function Page({ id, user }: { id: string; user: User | null }) {
  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await fetch(`${getBaseUrl()}/api/item?id=${id}`);
      return (await res.json()) as Item;
    },
  });

  if (item === null) return notFound();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[min(100%,80rem)] flex-grow px-4">
        <div className="flex items-center justify-center rounded-xl border p-10">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (item)
    return (
      <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
        <div className="grid flex-grow gap-3 overflow-hidden rounded-xl border sm:grid-cols-2">
          <div />
          <div className="m-7">
            <div className="flex justify-between gap-3">
              <div className="flex-grow">
                {item.categories ? (
                  <div className="mb-2 flex items-center gap-2 text-sm">
                    {item.categories.map((category, i) => (
                      <Fragment key={i}>
                        <span>
                          <Link
                            href={`/shop?category=${category.toLocaleLowerCase()}`}
                            className={`rounded-md font-medium transition-all ${i === item.categories.length - 1 ? "text-main-500 hover:text-main-600 active:text-main-700" : "hover:text-secondary text-tertiary active:text-secondary"}`}
                          >
                            {category}
                          </Link>
                        </span>
                        {i < item.categories.length - 1 ? (
                          <span className="text-quaternary">
                            <ChevronRight size={16} />
                          </span>
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-1.5 text-xl font-semibold">
                      {item.item_name}{" "}
                      {item.discount ? (
                        <span className="ml-1 rounded-full border border-[#fecdc9] bg-[#fef3f2] px-2 py-0.5 text-xs font-medium text-[#b32318]">
                          Sale
                        </span>
                      ) : (
                        ""
                      )}
                    </h2>
                    <p className="text-secondary mt-1.5 font-medium">
                      From{" "}
                      <Link
                        className="font-semibold text-main-500"
                        href={`/shop/store/${item.store_name.toLocaleLowerCase() + "-" + item.store_id}`}
                      >
                        {item.store_name}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <p className="flex w-fit flex-col items-center font-semibold">
                <span
                  className={
                    item.discount
                      ? "text-quaternary line-through"
                      : "text-secondary"
                  }
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                    currencyDisplay: "symbol",
                  }).format(item.price)}
                </span>
                {item.discount ? (
                  <>
                    <span className="text-secondary font-semibold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "EGP",
                        currencyDisplay: "symbol",
                      }).format(item.price - item.discount)}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
            <p className="mt-4">{item.description}</p>
            <Configuration item={item} user={user} />
          </div>
        </div>
      </div>
    );
}
