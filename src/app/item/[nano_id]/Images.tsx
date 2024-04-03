"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

export default function Images({
  id,
  color,
}: {
  id: string;
  color: string | undefined;
}) {
  const [currentImage, setCurrentImage] = useState<{
    id: string;
    url: string;
    item_id: string;
    color: string;
  }>();

  const { data } = useQuery({
    queryKey: ["images", id],
    queryFn: async () => {
      const res = await fetch(`/api/images?item_id=${id}`);
      return (await res.json()) as {
        id: string;
        url: string;
        item_id: string;
        color: string;
      }[];
    },
  });

  useEffect(() => {
    if (data && !currentImage) setCurrentImage(data[0]);
  }, [data, currentImage]);

  useEffect(() => {
    if (data && color) {
      const image = data.find((image) => image.color === color);

      if (image) setCurrentImage(image);
    }
  }, [color, data]);

  useEffect(() => {
    function scroll() {
      const scroller = document.querySelector(".scrollbar-hidden");

      if (scroller)
        if (window.innerWidth > 768) {
          scroller.classList.remove("scroll-x-end");
          scroller.classList.remove("scroll-x-start");
          scroller.classList.remove("scroll-x");
          scroller.classList.add("scroll-y");

          if (scroller.scrollTop === 0) {
            scroller.classList.add("scroll-y-start");
            scroller.classList.remove("scroll-y-end");
          } else if (
            scroller.scrollTop + scroller.clientHeight ===
            scroller.scrollHeight
          ) {
            scroller.classList.add("scroll-y-end");
            scroller.classList.remove("scroll-y-start");
          } else {
            scroller.classList.remove("scroll-y-start", "scroll-y-end");
          }
        } else {
          scroller.classList.remove("scroll-y-end");
          scroller.classList.remove("scroll-y-start");
          scroller.classList.remove("scroll-y");
          scroller.classList.add("scroll-x");

          if (scroller.scrollLeft === 0) {
            scroller.classList.add("scroll-x-start");
            scroller.classList.remove("scroll-x-end");
          } else if (
            scroller.scrollLeft + scroller.clientWidth ===
            scroller.scrollWidth
          ) {
            scroller.classList.add("scroll-x-end");
            scroller.classList.remove("scroll-x-start");
          } else {
            scroller.classList.remove("scroll-x-start", "scroll-x-end");
          }
        }
    }

    scroll();

    window.addEventListener("resize", scroll);

    return () => window.removeEventListener("resize", scroll);
  });

  return (
    <div className="m-4 flex flex-col-reverse gap-3 md:m-7 md:mr-4 md:flex-row md:gap-4">
      <div className="relative h-[4.5rem] md:h-full md:w-[5.5rem]">
        <div
          onScroll={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.classList.remove("scroll-x-end");
              e.currentTarget.classList.remove("scroll-x-start");
              e.currentTarget.classList.remove("scroll-x");
              e.currentTarget.classList.add("scroll-y");

              if (e.currentTarget.scrollTop === 0) {
                e.currentTarget.classList.add("scroll-y-start");
                e.currentTarget.classList.remove("scroll-y-end");
              } else if (
                e.currentTarget.scrollTop + e.currentTarget.clientHeight ===
                e.currentTarget.scrollHeight
              ) {
                e.currentTarget.classList.add("scroll-y-end");
                e.currentTarget.classList.remove("scroll-y-start");
              } else {
                e.currentTarget.classList.remove(
                  "scroll-y-start",
                  "scroll-y-end",
                );
              }
            } else {
              e.currentTarget.classList.remove("scroll-y-end");
              e.currentTarget.classList.remove("scroll-y-start");
              e.currentTarget.classList.remove("scroll-y");
              e.currentTarget.classList.add("scroll-x");

              if (e.currentTarget.scrollLeft === 0) {
                e.currentTarget.classList.add("scroll-x-start");
                e.currentTarget.classList.remove("scroll-x-end");
              } else if (
                e.currentTarget.scrollLeft + e.currentTarget.clientWidth ===
                e.currentTarget.scrollWidth
              ) {
                e.currentTarget.classList.add("scroll-x-end");
                e.currentTarget.classList.remove("scroll-x-start");
              } else {
                e.currentTarget.classList.remove(
                  "scroll-x-start",
                  "scroll-x-end",
                );
              }
            }
          }}
          className="scrollbar-hidden absolute inset-0 flex gap-3 overflow-auto p-1 transition-all md:flex-col md:gap-4"
        >
          {data?.map((image) => (
            <button
              key={image.id}
              onClick={() => setCurrentImage(image)}
              className={`relative size-16 flex-none overflow-hidden rounded-lg border border-white transition-all hover:opacity-90 md:size-20 ${
                currentImage?.id === image.id
                  ? "shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#9e77ed] active:shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#9e77ed,0_0_0_8px_#9e77ed3D]"
                  : ""
              }`}
            >
              <Image
                src={image.url}
                alt={image.id}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-fit flex-grow overflow-hidden rounded-lg md:min-h-0 md:rounded-xl">
        <AspectRatio.Root ratio={5 / 6}>
          {currentImage ? (
            <Image
              src={currentImage.url}
              alt={currentImage.id}
              fill
              className="object-cover"
            />
          ) : (
            <div />
          )}
        </AspectRatio.Root>
      </div>
    </div>
  );
}
