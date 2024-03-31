import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiCheckboxCircleFill,
  RiCloseLine,
  RiDeleteBinLine,
  RiErrorWarningFill,
  RiImage2Line,
  RiImageLine,
  RiLoader2Fill,
  RiPencilLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import Loading from "../primitives/Loading";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Button from "../primitives/Button";
import DialogComponent from "../primitives/Dialog";
import { nanoid } from "nanoid";
import { LuDot } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function Images({ nano_id }: { nano_id: string }) {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["images", nano_id],
    queryFn: async () => {
      const res = await fetch(`/api/item/images?nano_id=${nano_id}`);
      return res.json() as Promise<
        {
          id: string;
          url: string;
          item_id: string;
          color: string;
        }[]
      >;
    },
  });

  const [localImages, setLocalImages] = useState<
    ({
      id: string;
      color?: string;
      uploaded?: number;
      url?: string;
      error?: boolean;
    } & ({ file: File; old: false } | { file: undefined; old: true }))[]
  >(
    data?.map((img) => ({ ...img, uploaded: 1, file: undefined, old: true })) ||
      [],
  );

  useEffect(() => {
    setLocalImages(
      data?.map((img) => ({
        ...img,
        uploaded: 1,
        file: undefined,
        old: true,
      })) || [],
    );
  }, [data]);

  const uploadFile = async (image: { file: File; id: string }) => {
    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("name", image.id);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/file?item_id=${data?.[0].item_id}`);

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

        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "images" && query.queryKey[1] === nano_id,
        });
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
    <div className="card !gap-0 !p-0 sm:min-w-[350px]">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex gap-2">
          <RiImageLine size={24} className="text-icon-500" />
          <p className="label-medium">Images</p>
        </div>
        <DialogComponent
          trigger={
            <Button
              iconLeft={<RiPencilLine size={20} />}
              color="gray"
              size="xs"
              text="Edit"
            />
          }
          sheet
        >
          <div className="flex items-center gap-5 p-4 pl-6 sm:px-6 sm:py-5">
            <p className="label-large flex-grow">Images</p>
            <Dialog.Close asChild>
              <Button
                iconLeft={<RiCloseLine size={20} />}
                color="gray"
                className="!border-none"
              />
            </Dialog.Close>
          </div>
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
                          old: false,
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
                <div
                  className={`flex items-start gap-3 ${image.old ? "items-center" : ""}`}
                >
                  <Image src="/img.svg" height={40} width={36} alt="image" />
                  <div className="flex flex-grow flex-col gap-1">
                    <p className="label-small">
                      {image.file?.name ||
                        image.id.substring(0, image.id.length - 22)}
                    </p>
                    {!image.old ? (
                      <div className="paragraph-xsmall flex items-center gap-1 text-text-400">
                        <span>
                          {image.file.size / 1024 / 1024 > 1
                            ? `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(image.file.size / 1024 / 1024)} MB`
                            : `${Math.ceil(image.file.size / 1024)} KB`}
                        </span>
                        <LuDot size={16} />
                        {image.error ? (
                          <span className="flex items-center gap-1 text-text-900">
                            <RiErrorWarningFill
                              size={16}
                              className="text-error"
                            />
                            {(image.file?.size || 0) > 5 * 1024 * 1024
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
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="self-start p-0.5 text-icon-500 hover:text-icon-900"
                    onClick={async () => {
                      setLocalImages((prev) =>
                        prev.filter((_, i) => i !== index),
                      );

                      await fetch("/api/file", {
                        method: "DELETE",
                        body: JSON.stringify({ id: image.id }),
                      });

                      queryClient.invalidateQueries({
                        predicate: (query) =>
                          query.queryKey[0] === "images" &&
                          query.queryKey[1] === nano_id,
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
                {image.old ? null : image.error ? (
                  (image.file?.size || 0) < 5 * 1024 * 1024 ? (
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

                        image.file &&
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
          <div className="flex flex-grow flex-col gap-6 px-6 py-5"></div>
        </DialogComponent>
      </div>
      <div className="mx-4 border-t" />
      <div className="relative min-h-[200px] flex-grow overflow-auto rounded-b-2xl">
        <Loading isFetching={isFetching} />
        {data?.map((image, i) => (
          <Dialog.Root key={i}>
            <Dialog.Trigger asChild>
              <div className="group flex cursor-pointer items-center justify-between gap-4 p-3 px-4 transition-all hover:bg-bg-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-full border p-2 transition-all group-hover:border-border-300">
                    <RiImage2Line size={20} className="text-main-base" />
                  </div>
                  <p className="label-small truncate">
                    {image.id.substring(0, image.id.length - 22)}
                  </p>
                </div>
                {image.color ? (
                  <p className="label-xsmall rounded-full bg-[#C2EFFF] px-2 py-0.5 text-[#164564]">
                    {image.color}
                  </p>
                ) : null}
              </div>
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-[hsla(209,84%,5%,0.19)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="!pointer-events-none fixed inset-0 z-50 flex items-center justify-center rounded-2xl shadow-[0px_16px_32px_-12px_#585C5F1A] transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out sm:data-[state=closed]:duration-200 sm:data-[state=open]:duration-200 sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0">
              <div className="pointer-events-none relative h-full max-h-[80vh] w-full max-w-[80vw]">
                <Image
                  src={image.url}
                  fill
                  alt={image.id}
                  className="pointer-events-auto object-contain"
                  quality={50}
                />
              </div>
              <Dialog.Close className="pointer-events-auto absolute right-10 top-10 z-[60] cursor-pointer rounded-md bg-white/30 p-2 transition-all hover:bg-white/60">
                <RiCloseLine size={24} />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        ))}
      </div>
    </div>
  );
}
