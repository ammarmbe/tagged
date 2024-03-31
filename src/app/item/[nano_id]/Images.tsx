"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Images({ id }: { id: string }) {
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

  return (
    <div className="m-4 flex flex-col-reverse gap-4 lg:m-7 lg:mr-3.5 lg:flex-row">
      <div className="flex gap-3 lg:flex-col">
        {data?.map((image) => (
          <button
            key={image.id}
            onClick={() => setCurrentImage(image)}
            className={`relative h-20 w-20 overflow-hidden rounded-lg border border-white transition-all hover:opacity-90 ${
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
      <div className="relative min-h-[80vw] flex-grow overflow-hidden rounded-lg lg:min-h-0 lg:rounded-xl">
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
      </div>
    </div>
  );
}
