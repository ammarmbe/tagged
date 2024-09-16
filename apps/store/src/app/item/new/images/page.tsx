"use client";
import Button from "@/components/primitives/Button";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { RiImageLine, RiUploadCloud2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ImageComponent from "@/components/Image";
import imageCompression from "browser-image-compression";

export default function Images() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const colors = useMemo(
    () =>
      queryClient.getQueryData(["colors"]) as { color: string; hex: string }[],
    [queryClient],
  );

  const [localImages, setLocalImages] = useState<
    {
      id: string;
      url?: string;
      file?: File;
      size?: number;
      thumbnail?: boolean;
      color?: string;
      error?: boolean;
      uploaded?: number;
    }[]
  >(queryClient.getQueryData(["images"]) ?? []);

  const uploadFile = async (image: { file: File; id: string }) => {
    const formData = new FormData();

    const f = await imageCompression(image.file, {
      maxSizeMB: 3,
    });

    formData.append("file", f);
    formData.append("name", image.id);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/image");

    xhr.upload.onprogress = (e) => {
      setLocalImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                uploaded: e.loaded / e.total,
              }
            : img,
        ),
      );
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const url = xhr.responseText;
        setLocalImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, url, uploaded: 1 } : img,
          ),
        );
      } else {
        setLocalImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, error: true } : img,
          ),
        );
      }
    };

    xhr.send(formData);
  };

  return (
    <>
      <div className="hidden flex-col items-center pt-12 sm:flex">
        <div className="relative w-fit rounded-full bg-[linear-gradient(180deg,#E4E5E7_0%,rgba(228,229,231,0)76.56%)] p-px">
          <div className="absolute inset-px rounded-full bg-bg-0" />
          <div className="relative z-10 w-fit rounded-full bg-[linear-gradient(180deg,rgba(228,229,231,0.48)0%,rgba(247,248,248,0)100%,rgba(228,229,231,0)100%)] p-4">
            <div className="w-fit rounded-full border bg-bg-0 p-4 shadow-[0px_2px_4px_0px_#1B1C1D0A]">
              <RiImageLine size={32} className="text-text-600" />
            </div>
          </div>
        </div>
        <div className="title-h5 mt-2">Images</div>
        <p className="paragraph-medium mt-1 text-text-600">
          Add images for your new item.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          queryClient.setQueryData(
            ["images"],
            localImages.filter((img) => img.url && img.uploaded === 1),
          );

          router.push("/item/new/summary");
        }}
        className="sm:card flex h-fit w-full flex-grow flex-col !gap-0 !overflow-visible !p-0 sm:max-w-md sm:flex-grow-0"
      >
        <div className="label-medium p-4">Images</div>
        <div className="border-t" />
        <div className="flex flex-col gap-3 p-4">
          <div className="flex min-h-0 flex-grow flex-col gap-6 sm:flex-grow-0">
            <label
              className="drag flex cursor-pointer flex-col items-center gap-5 rounded-xl border border-dashed border-border-300 p-8 transition-all hover:bg-bg-50 active:border-solid"
              htmlFor="image"
            >
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                hidden
                id="image"
                onChange={(e) => {
                  // add files to images state
                  const file = e.target.files?.[0];
                  const id = nanoid();

                  if (file) {
                    setLocalImages((prev) => [
                      ...prev,
                      {
                        file,
                        id: file.name + "-" + id,
                        error: file.size > 5 * 1024 * 1024,
                      },
                    ]);

                    // upload file to Azure Blob Storage
                    file.size < 5 * 1024 * 1024 &&
                      uploadFile({ file, id: file.name + "-" + id });
                  }

                  // reset input value
                  e.target.value = "";
                }}
              />
              <RiUploadCloud2Line size={24} className="text-text-600" />
              <div className="space-y-1">
                <p className="label-small">
                  Choose a file or drag and drop it here.
                </p>
                <p className="paragraph-xsmall text-text-600">
                  JPEG, PNG, and WEBP formats, up to 5 MB.
                </p>
              </div>
              <Button
                type="button"
                size="xs"
                color="gray"
                text="Browse Files"
                className="w-fit"
                onMouseEnter={(e) =>
                  e.currentTarget.parentElement?.classList.remove(
                    "hover:bg-bg-50",
                  )
                }
                onMouseLeave={(e) =>
                  e.currentTarget.parentElement?.classList.add("hover:bg-bg-50")
                }
                onClick={(e) =>
                  (
                    e.currentTarget.previousElementSibling as HTMLElement
                  )?.click()
                }
              />
            </label>
          </div>
          {localImages.map((image) => (
            <ImageComponent
              image={image}
              key={image.id}
              setImages={setLocalImages}
              invalidate={[]}
              colors={colors}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 border-t p-4">
          <Button
            text="Back"
            href="/item/new/quantities"
            size="md"
            color="gray"
            className="justify-center"
            type="button"
          />
          <Button
            text="Next"
            size="md"
            color="main"
            className="justify-center"
            type="submit"
          />
        </div>
      </form>
    </>
  );
}
