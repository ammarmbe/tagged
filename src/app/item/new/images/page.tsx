"use client";
import Button from "@/components/primitives/Button";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useMemo, useState } from "react";
import { LuDot } from "react-icons/lu";
import {
  RiCheckboxCircleFill,
  RiCloseLine,
  RiDeleteBinLine,
  RiErrorWarningFill,
  RiImageLine,
  RiLoader2Fill,
  RiUploadCloud2Line,
} from "react-icons/ri";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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
      color?: string;
      uploaded?: number;
      url?: string;
      file: File;
      error?: boolean;
    }[]
  >(queryClient.getQueryData(["images"]) ?? []);

  const uploadFile = async (image: { file: File; id: string }) => {
    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("name", image.id);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/file");

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
          <div className="absolute inset-px rounded-full bg-white" />
          <div className="relative z-10 w-fit rounded-full bg-[linear-gradient(180deg,rgba(228,229,231,0.48)0%,rgba(247,248,248,0)100%,rgba(228,229,231,0)100%)] p-4">
            <div className="w-fit rounded-full border bg-white p-4 shadow-[0px_2px_4px_0px_#1B1C1D0A]">
              <RiImageLine size={32} className="text-icon-500" />
            </div>
          </div>
        </div>
        <div className="title-h5 mt-2">Images</div>
        <p className="paragraph-medium mt-1 text-text-500">
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
              className="drag flex cursor-pointer flex-col items-center gap-5 rounded-xl border border-dashed border-border-300 p-8 transition-all hover:bg-bg-100 active:border-solid"
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
              <RiUploadCloud2Line size={24} className="text-icon-500" />
              <div className="space-y-1">
                <p className="label-small">
                  Choose a file or drag and drop it here.
                </p>
                <p className="paragraph-xsmall text-text-400">
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
                    "hover:bg-bg-100",
                  )
                }
                onMouseLeave={(e) =>
                  e.currentTarget.parentElement?.classList.add(
                    "hover:bg-bg-100",
                  )
                }
                onClick={(e) =>
                  (
                    e.currentTarget.previousElementSibling as HTMLElement
                  )?.click()
                }
              />
            </label>
          </div>
          {localImages.map((image, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-xl border px-3.5 py-4 ${image.error ? "border-error" : ""}`}
            >
              <div className="flex items-start gap-3">
                <Image src="/img.svg" height={40} width={36} alt="image" />
                <div className="flex flex-grow flex-col gap-1">
                  <p className="label-small">{image.file.name}</p>
                  <div className="paragraph-xsmall flex items-center gap-1 text-text-400">
                    <span>
                      {image.file.size / 1024 / 1024 > 1
                        ? `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(image.file.size / 1024 / 1024)} MB`
                        : `${Math.ceil(image.file.size / 1024)} KB`}
                    </span>
                    <LuDot size={16} />
                    {image.error ? (
                      <span className="flex items-center gap-1 text-text-900">
                        <RiErrorWarningFill size={16} className="text-error" />
                        {image.file.size > 5 * 1024 * 1024
                          ? "File too large"
                          : "Failed"}
                      </span>
                    ) : image.uploaded !== 1 || !image.url ? (
                      <span className="flex items-center gap-1 text-text-900">
                        <RiLoader2Fill
                          size={16}
                          className="animate-spin text-information"
                        />
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-text-900">
                        <RiCheckboxCircleFill
                          size={16}
                          className="text-success"
                        />
                        Completed
                      </span>
                    )}
                    {image.file.size < 5 * 1024 * 1024 && image.url ? (
                      <>
                        <LuDot size={16} />
                        <DropdownMenu.Root modal={false}>
                          <DropdownMenu.Trigger className="label-xsmall flex items-center gap-1.5 text-text-900">
                            {colors?.find(
                              (c: { color: string; hex: string }) =>
                                c.color === image.color,
                            )?.hex ? (
                              <div
                                style={{
                                  backgroundColor: colors.find(
                                    (c: { color: string; hex: string }) =>
                                      c.color === image.color,
                                  )?.hex,
                                }}
                                className="size-3 rounded-full"
                              />
                            ) : null}
                            <span className="underline underline-offset-2">
                              {image.color ? image.color : "Select color"}
                            </span>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content className="z-30 mt-1 overflow-hidden rounded-lg border bg-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                            {colors
                              .concat({
                                color: "No color",
                                hex: "transparent",
                              })
                              .reverse()
                              .map(
                                (
                                  color: { color: string; hex: string },
                                  i: number,
                                ) => (
                                  <DropdownMenu.Item
                                    key={i}
                                    className="flex cursor-pointer items-center gap-2 p-3 py-2.5 font-medium text-text-900 hover:bg-bg-100"
                                    onSelect={() =>
                                      setLocalImages((prev) =>
                                        prev.map((img, j) =>
                                          j === index
                                            ? { ...img, color: color.color }
                                            : img,
                                        ),
                                      )
                                    }
                                  >
                                    <div
                                      className="h-4 w-4 rounded-full"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <span>{color.color}</span>
                                  </DropdownMenu.Item>
                                ),
                              )}
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className="p-0.5 text-icon-500 hover:text-icon-900"
                  onClick={async () => {
                    setLocalImages((prev) =>
                      prev.filter((_, i) => i !== index),
                    );

                    await fetch("/api/file", {
                      method: "DELETE",
                      body: JSON.stringify({ id: image.id }),
                    });
                  }}
                >
                  {image.uploaded === 1 || image.error ? (
                    <RiDeleteBinLine
                      size={20}
                      className={image.error ? "!text-error" : ""}
                    />
                  ) : (
                    <RiCloseLine size={20} />
                  )}
                </button>
              </div>
              {image.error ? (
                image.file.size < 5 * 1024 * 1024 ? (
                  <button
                    onClick={() => {
                      setLocalImages((prev) =>
                        prev.map((img) =>
                          img.id === image.id
                            ? {
                                ...img,
                                error: false,
                              }
                            : img,
                        ),
                      );

                      uploadFile({ file: image.file, id: image.id });
                    }}
                    className="ml-[calc(0.75rem+36px)] mt-2 w-fit text-xs font-medium text-error underline underline-offset-2"
                  >
                    Try Again
                  </button>
                ) : null
              ) : (
                <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-bg-200">
                  <div
                    className="absolute h-full rounded-full bg-main-base"
                    style={{
                      width: `${((image.uploaded || 0) - (!image.url ? 0.05 : 0)) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
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
