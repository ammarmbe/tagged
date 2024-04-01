import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { LuDot } from "react-icons/lu";
import {
  RiErrorWarningFill,
  RiLoader2Fill,
  RiCheckboxCircleFill,
  RiDeleteBinLine,
  RiCloseLine,
} from "react-icons/ri";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ImageComponent({
  image,
  nano_id,
  invalidate,
  setImages,
  colors,
}: {
  image: {
    id: string;
    url?: string;
    file?: File;
    size?: number;
    error?: boolean;
    color?: string;
    uploaded?: number;
  };
  nano_id?: string;
  invalidate: any[][];
  setImages: Dispatch<
    SetStateAction<
      {
        id: string;
        url?: string;
        file?: File;
        size?: number;
        error?: boolean;
        color?: string;
        uploaded?: number;
      }[]
    >
  >;
  colors: { color: string; hex: string }[];
}) {
  const queryClient = useQueryClient();
  const fileSize = useMemo(() => {
    return image.file?.size || image.size;
  }, [image.size, image.file]);

  const uploadFile = useCallback(async () => {
    if (!image.file) return;

    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("name", image.id);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/file?nano_id=${nano_id}`);

    xhr.upload.onprogress = (e) => {
      setImages((prev) =>
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
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, url, uploaded: 1 } : img,
          ),
        );

        invalidate.forEach((args) => {
          queryClient.invalidateQueries({
            queryKey: args,
          });
        });
      } else {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, error: true } : img,
          ),
        );
      }
    };

    xhr.send(formData);
  }, [image.file, image.id, invalidate, nano_id, queryClient, setImages]);

  return (
    <div
      className={`flex flex-col rounded-xl border px-3.5 py-4 ${image.error ? "border-error" : ""}`}
    >
      <div className="flex items-start gap-3">
        <Image src="/img.svg" height={40} width={36} alt="image" />
        <div className="flex flex-grow flex-col gap-1">
          <p className="label-small">
            {image.file?.name || image.id.substring(0, image.id.length - 22)}
          </p>
          <div className="paragraph-xsmall flex items-center gap-1 text-text-400">
            {fileSize ? (
              <span>
                {fileSize / 1024 / 1024 > 1
                  ? `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(fileSize / 1024 / 1024)} MB`
                  : `${Math.ceil(fileSize / 1024)} KB`}
              </span>
            ) : null}
            {image.error ? (
              <>
                <LuDot size={16} />
                <span className="flex items-center gap-1 text-text-900">
                  <RiErrorWarningFill size={16} className="text-error" />
                  {(image.file?.size || 0) > 5 * 1024 * 1024
                    ? "File too large"
                    : "Failed"}
                </span>
              </>
            ) : (image.uploaded !== 1 || !image.url) && image.file ? (
              <>
                <LuDot size={16} />
                <span className="flex items-center gap-1 text-text-900">
                  <RiLoader2Fill
                    size={16}
                    className="animate-spin text-information"
                  />
                  Uploading...
                </span>
              </>
            ) : image.file ? (
              <>
                <LuDot size={16} />
                <span className="flex items-center gap-1 text-text-900">
                  <RiCheckboxCircleFill size={16} className="text-success" />
                  Completed
                </span>
              </>
            ) : null}
            {!image.error && image.url ? (
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
                        (color: { color: string; hex: string }, i: number) => (
                          <DropdownMenu.Item
                            key={i}
                            className="flex cursor-pointer items-center gap-2 p-3 py-2.5 font-medium text-text-900 hover:bg-bg-100"
                            onSelect={async () => {
                              setImages((prev) =>
                                prev.map((img) =>
                                  img.id === image.id
                                    ? { ...img, color: color.color }
                                    : img,
                                ),
                              );

                              nano_id &&
                                (await fetch("/api/file/color", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    id: image.id,
                                    color: color.color,
                                  }),
                                }));

                              nano_id &&
                                invalidate.forEach((args) => {
                                  queryClient.invalidateQueries({
                                    queryKey: args,
                                  });
                                });
                            }}
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
          className="self-start p-0.5 text-icon-500 hover:text-icon-900"
          onClick={async () => {
            setImages((prev) => prev.filter(({ id }) => id !== image.id));

            await fetch("/api/file", {
              method: "DELETE",
              body: JSON.stringify({ id: image.id }),
            });

            invalidate.forEach((args) => {
              queryClient.invalidateQueries({
                queryKey: args,
              });
            });
          }}
        >
          {(image.uploaded === 1 && image.url) || image.error ? (
            <RiDeleteBinLine
              size={20}
              className={image.error ? "!text-error" : ""}
            />
          ) : (
            <RiCloseLine size={20} />
          )}
        </button>
      </div>
      {image.error && (fileSize || 0) < 5 * 1024 * 1024 ? (
        <button
          onClick={() => {
            setImages((prev) =>
              prev.map((img) =>
                img.id === image.id
                  ? {
                      ...img,
                      error: false,
                    }
                  : img,
              ),
            );

            image.file && uploadFile();
          }}
          className="ml-[calc(0.75rem+36px)] mt-2 w-fit text-xs font-medium text-error underline underline-offset-2"
        >
          Try Again
        </button>
      ) : image.file ? (
        <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-bg-200">
          <div
            className="absolute h-full rounded-full bg-main-base"
            style={{
              width: `${((image.uploaded || 0) - (!image.url ? 0.05 : 0)) * 100}%`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
