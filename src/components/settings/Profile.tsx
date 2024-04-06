"use client";
import { useUser } from "@/utils";
import Header from "@/components/header/Header";
import Button from "@/components/primitives/Button";
import { RiArrowRightSLine, RiFileCopyLine, RiUserLine } from "react-icons/ri";
import Image from "next/image";
import { toast } from "@/components/primitives/toast/use-toast";
import { useEffect, useRef, useState } from "react";
import Input from "@/components/primitives/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import imageCompression from "browser-image-compression";

export default function Page() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);

  const [editingInstagram, setEditingInstagram] = useState(false);
  const [editingFacebook, setEditingFacebook] = useState(false);
  const [editingTiktok, setEditingTiktok] = useState(false);

  const pfpRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const nameMutation = useMutation({
    mutationKey: ["updateName"],
    mutationFn: async (name: string) => {
      if (name === user?.name || !name) return;

      await fetch("/api/current-user/name", {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      toast({
        title: "Name updated successfully.",
        color: "green",
        saturation: "high",
        size: "sm",
        position: "center",
      });

      setEditingName(false);
    },
  });

  const emailMutation = useMutation({
    mutationKey: ["updateEmail"],
    mutationFn: async (email: string) => {
      if (email === user?.email || !email) return;

      const res = await fetch("/api/current-user/email", {
        method: "PATCH",
        body: JSON.stringify({ email }),
      });

      return res.ok;
    },
    async onSuccess(ok) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      ok
        ? toast({
            title: "Email updated successfully.",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });

      setEditingEmail(false);
    },
  });

  const instagramMutation = useMutation({
    mutationKey: ["updateInstagram"],
    mutationFn: async (instagram: string) => {
      if (instagram === user?.feature_flags.instagram) return;

      const res = await fetch("/api/current-user/instagram", {
        method: "PATCH",
        body: JSON.stringify({ instagram }),
      });

      return res.ok;
    },
    async onSuccess(ok) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      ok
        ? toast({
            title: "Instagram username updated successfully.",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });

      setEditingInstagram(false);
    },
  });

  const facebookMutation = useMutation({
    mutationKey: ["updateFacebook"],
    mutationFn: async (facebook: string) => {
      if (facebook === user?.feature_flags.facebook) return;

      const res = await fetch("/api/current-user/facebook", {
        method: "PATCH",
        body: JSON.stringify({ facebook }),
      });

      return res.ok;
    },
    async onSuccess(ok) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      ok
        ? toast({
            title: "Facebook username updated successfully.",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });

      setEditingFacebook(false);
    },
  });

  const tiktokMutation = useMutation({
    mutationKey: ["updateTiktok"],
    mutationFn: async (tiktok: string) => {
      if (tiktok === user?.feature_flags.tiktok) return;

      const res = await fetch("/api/current-user/tiktok", {
        method: "PATCH",
        body: JSON.stringify({ tiktok }),
      });

      return res.ok;
    },
    async onSuccess(ok) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      ok
        ? toast({
            title: "Tiktok username updated successfully.",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });

      setEditingTiktok(false);
    },
  });

  const {
    register: nameRegister,
    handleSubmit: handleNameSubmit,
    setValue: setNameValue,
  } = useForm<{
    name: string;
  }>({
    defaultValues: {
      name: user?.name || "",
    },
  });

  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    setValue: setEmailValue,
  } = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: user?.email || "",
    },
  });

  const {
    register: instagramRegister,
    handleSubmit: handleInstagramSubmit,
    setValue: setInstagramValue,
  } = useForm<{
    instagram: string;
  }>({
    defaultValues: {
      instagram: user?.feature_flags.instagram || "",
    },
  });

  const {
    register: facebookRegister,
    handleSubmit: handleFacebookSubmit,
    setValue: setFacebookValue,
  } = useForm<{
    facebook: string;
  }>({
    defaultValues: {
      facebook: user?.feature_flags.facebook || "",
    },
  });

  const {
    register: tiktokRegister,
    handleSubmit: handleTiktokSubmit,
    setValue: setTiktokValue,
  } = useForm<{
    tiktok: string;
  }>({
    defaultValues: {
      tiktok: user?.feature_flags.tiktok || "",
    },
  });

  const onNameSubmit: SubmitHandler<{ name: string }> = async ({ name }) => {
    await nameMutation.mutateAsync(name);
  };

  const onEmailSubmit: SubmitHandler<{ email: string }> = async ({ email }) => {
    await emailMutation.mutateAsync(email);
  };

  const onInstagramSubmit: SubmitHandler<{ instagram: string }> = async ({
    instagram,
  }) => {
    await instagramMutation.mutateAsync(instagram);
  };

  const onFacebookSubmit: SubmitHandler<{ facebook: string }> = async ({
    facebook,
  }) => {
    await facebookMutation.mutateAsync(facebook);
  };

  const onTiktokSubmit: SubmitHandler<{ tiktok: string }> = async ({
    tiktok,
  }) => {
    await tiktokMutation.mutateAsync(tiktok);
  };

  const pfpMutation = useMutation({
    mutationKey: ["uploadPfp"],
    mutationFn: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File size must be less than 5MB.",
          color: "red",
          saturation: "high",
          size: "sm",
          position: "center",
        });

        return;
      }

      const formData = new FormData();

      const f = await imageCompression(file, {
        maxSizeMB: 3,
      });

      formData.append("file", f);

      const res = await fetch("/api/current-user/pfp", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "current-user",
        });

        toast({
          title: "Profile photo updated successfully.",
          color: "green",
          saturation: "high",
          size: "sm",
          position: "center",
        });
      } else {
        toast({
          title: "An error occured, please try again.",
          color: "red",
          saturation: "high",
          size: "sm",
          position: "center",
        });
      }
    },
  });

  const coverMutation = useMutation({
    mutationKey: ["coverPfp"],
    mutationFn: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File size must be less than 5MB.",
          color: "red",
          saturation: "high",
          size: "sm",
          position: "center",
        });

        return;
      }

      const formData = new FormData();

      const f = await imageCompression(file, {
        maxSizeMB: 3,
      });

      formData.append("file", f);

      const res = await fetch("/api/current-user/cover", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "current-user",
        });

        toast({
          title: "Cover photo updated successfully.",
          color: "green",
          saturation: "high",
          size: "sm",
          position: "center",
        });
      } else {
        toast({
          title: "An error occured, please try again.",
          color: "red",
          saturation: "high",
          size: "sm",
          position: "center",
        });
      }
    },
  });

  useEffect(() => {
    setNameValue("name", user?.name || "");
    setEmailValue("email", user?.email || "");
    setInstagramValue("instagram", user?.feature_flags.instagram || "");
    setFacebookValue("facebook", user?.feature_flags.facebook || "");
    setTiktokValue("tiktok", user?.feature_flags.tiktok || "");
  }, [
    user?.name,
    user?.email,
    user?.feature_flags.instagram,
    user?.feature_flags.facebook,
    user?.feature_flags.tiktok,
    setNameValue,
    setEmailValue,
    setInstagramValue,
    setFacebookValue,
    setTiktokValue,
  ]);

  return (
    <div className="flex flex-grow flex-col">
      <Header
        icon={<RiUserLine size={24} className="text-text-600" />}
        title="Profile Settings"
        description="Manage your store profile settings"
      />
      <div className="mx-8 border-t" />
      <div className="grid gap-x-10 gap-y-5 px-8 py-5 sm:grid-cols-2 sm:gap-x-20">
        <div>
          <p className="label-small">Store ID</p>
          <div className="paragraph-small mt-1 text-text-600">
            {user?.nano_id}
          </div>
        </div>
        <Button
          size="xs"
          className="w-fit self-center"
          text="Copy ID"
          onClick={async () => {
            navigator.clipboard.writeText(user?.id || "");

            toast({
              title: "Copied to clipboard",
              color: "green",
              saturation: "medium",
              noIcon: true,
              size: "sm",
              position: "center",
            });
          }}
          iconLeft={<RiFileCopyLine size={20} />}
        />
        <div className="border-t sm:col-span-2" />
        {editingName ? (
          <>
            <form onSubmit={handleNameSubmit(onNameSubmit)}>
              <p className="label-small mb-1">Store Name</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  {...nameRegister("name", {
                    required: "Name is required.",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters.",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name must be at most 50 characters.",
                    },
                  })}
                />
                <Button
                  size="sm"
                  text="Save"
                  disabled={nameMutation.isPending}
                  type="submit"
                />
              </div>
            </form>
            <div />
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Store Name</p>
              <div className="paragraph-small mt-1 text-text-600">
                This will be displayed on your store page and on your items.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">{user?.name}</p>
              <button
                onClick={() => setEditingName(true)}
                className="label-small flex w-fit items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="border-t sm:col-span-2" />
        <div>
          <p className="label-small">Profile Picture</p>
          <div className="paragraph-small mt-1 text-text-600">
            Recommended 400x400px. Maximum 5MB.
          </div>
        </div>
        <div className="flex items-center gap-4 self-center">
          <Image
            src={
              user?.pfp_url ??
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAABPeSURBVHhe7dYxDQAgEARB8K+ShAYVkKBhy3kBV0y+2Ln2ucMRIECAAAECBAhkAlNgZZaGCBAgQIAAAQJfQGB5BAIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQeHhtwCxRajMnAAAAAElFTkSuQmCC"
            }
            width={46}
            height={46}
            alt={user?.name ?? "Profile Picture"}
            className="h-[46px] w-[46px] rounded-full object-cover"
          />
          <input
            type="file"
            name=""
            id=""
            hidden
            ref={pfpRef}
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => pfpMutation.mutate(e)}
            disabled={pfpMutation.isPending}
          />
          <Button
            size="xs"
            className="w-fit self-center"
            text="Upload"
            disabled={pfpMutation.isPending}
            onClick={() => {
              pfpRef.current?.click();
            }}
          />
        </div>
        <div className="border-t sm:col-span-2" />
        <div>
          <p className="label-small">Cover Photo</p>
          <div className="paragraph-small mt-1 text-text-600">
            Recommended 1200x300px. Maximum 5MB.
          </div>
        </div>
        <div className="flex items-center gap-4 self-center">
          <Image
            src={
              user?.cover_url ??
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAABPeSURBVHhe7dYxDQAgEARB8K+ShAYVkKBhy3kBV0y+2Ln2ucMRIECAAAECBAhkAlNgZZaGCBAgQIAAAQJfQGB5BAIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQEFh+gAABAgQIECAQCwisGNQcAQIECBAgQEBg+QECBAgQIECAQCwgsGJQcwQIECBAgAABgeUHCBAgQIAAAQKxgMCKQc0RIECAAAECBASWHyBAgAABAgQIxAICKwY1R4AAAQIECBAQWH6AAAECBAgQIBALCKwY1BwBAgQIECBAQGD5AQIECBAgQIBALCCwYlBzBAgQIECAAAGB5QcIECBAgAABArGAwIpBzREgQIAAAQIEBJYfIECAAAECBAjEAgIrBjVHgAABAgQIEBBYfoAAAQIECBAgEAsIrBjUHAECBAgQIEBAYPkBAgQIECBAgEAsILBiUHMECBAgQIAAAYHlBwgQIECAAAECsYDAikHNESBAgAABAgQElh8gQIAAAQIECMQCAisGNUeAAAECBAgQeHhtwCxRajMnAAAAAElFTkSuQmCC"
            }
            width={184}
            height={46}
            alt={user?.name ?? "Profile Picture"}
            className="h-[46px] rounded-lg object-cover"
          />
          <input
            type="file"
            name=""
            id=""
            hidden
            ref={coverRef}
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => coverMutation.mutate(e)}
            disabled={coverMutation.isPending}
          />
          <Button
            size="xs"
            className="w-fit self-center"
            text="Upload"
            disabled={coverMutation.isPending}
            onClick={() => {
              coverRef.current?.click();
            }}
          />
        </div>
        <div className="border-t sm:col-span-2" />
        {editingEmail ? (
          <>
            <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
              <p className="label-small mb-1">Store Name</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  type="email"
                  {...emailRegister("email", {
                    required: "Email is required.",
                    minLength: {
                      value: 6,
                      message: "Email must be at least 6 characters.",
                    },
                    maxLength: {
                      value: 50,
                      message: "Email must be at most 50 characters.",
                    },
                  })}
                />
                <Button
                  size="sm"
                  text="Save"
                  disabled={emailMutation.isPending}
                  type="submit"
                />
              </div>
            </form>
            <div />
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Email Address</p>
              <div className="paragraph-small mt-1 text-text-600">
                This will be used for order-related notifications.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">{user?.email}</p>
              <button
                onClick={() => setEditingEmail(true)}
                className="label-small flex w-fit items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="border-t sm:col-span-2" />
        {editingInstagram ? (
          <>
            <form onSubmit={handleInstagramSubmit(onInstagramSubmit)}>
              <p className="label-small mb-1">Instagram</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  type="text"
                  placeholder="my_store"
                  {...instagramRegister("instagram", {
                    maxLength: {
                      value: 64,
                      message:
                        "Instagram username must be at most 64 characters.",
                    },
                  })}
                />
                <Button
                  size="sm"
                  text="Save"
                  disabled={instagramMutation.isPending}
                  type="submit"
                />
              </div>
            </form>
            <div />
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Instagram</p>
              <div className="paragraph-small mt-1 text-text-600">
                Your Instagram username.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {user?.feature_flags.instagram
                  ? "instagram.com/" + user.feature_flags.instagram
                  : "Not set"}
              </p>
              <button
                onClick={() => setEditingInstagram(true)}
                className="label-small flex w-fit items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="border-t sm:col-span-2" />
        {editingFacebook ? (
          <>
            <form onSubmit={handleFacebookSubmit(onFacebookSubmit)}>
              <p className="label-small mb-1">Facebook</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  type="text"
                  placeholder="my_store"
                  {...facebookRegister("facebook", {
                    maxLength: {
                      value: 64,
                      message:
                        "Facebook username must be at most 64 characters.",
                    },
                  })}
                />
                <Button
                  size="sm"
                  text="Save"
                  disabled={facebookMutation.isPending}
                  type="submit"
                />
              </div>
            </form>
            <div />
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Facebook</p>
              <div className="paragraph-small mt-1 text-text-600">
                Your Facebook username.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {user?.feature_flags.facebook
                  ? "facebook.com/" + user.feature_flags.facebook
                  : "Not set"}
              </p>
              <button
                onClick={() => setEditingFacebook(true)}
                className="label-small flex w-fit items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="border-t sm:col-span-2" />
        {editingTiktok ? (
          <>
            <form onSubmit={handleTiktokSubmit(onTiktokSubmit)}>
              <p className="label-small mb-1">Tiktok</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  type="text"
                  placeholder="@my_store"
                  {...tiktokRegister("tiktok", {
                    maxLength: {
                      value: 64,
                      message: "Tiktok username must be at most 64 characters.",
                    },
                  })}
                />
                <Button
                  size="sm"
                  text="Save"
                  disabled={tiktokMutation.isPending}
                  type="submit"
                />
              </div>
            </form>
            <div />
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Tiktok</p>
              <div className="paragraph-small mt-1 text-text-600">
                Your Tiktok username.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {user?.feature_flags.tiktok
                  ? "tiktok.com/" + user.feature_flags.tiktok
                  : "Not set"}
              </p>
              <button
                onClick={() => setEditingTiktok(true)}
                className="label-small flex w-fit items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
