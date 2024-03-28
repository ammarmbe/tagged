"use client";
import { useUser } from "@/utils";
import Header from "@/components/header/Header";
import Button from "@/components/primitives/Button";
import { RiArrowRightSLine, RiFileCopyLine, RiUserLine } from "react-icons/ri";
import Image from "next/image";
import { toast } from "@/components/primitives/toast/use-toast";
import { useEffect, useState } from "react";
import Input from "@/components/primitives/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Page() {
  const queryClient = useQueryClient();
  const user = useUser();

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);

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

      await fetch("/api/current-user/email", {
        method: "PATCH",
        body: JSON.stringify({ email }),
      });
    },
    onSuccess() {
      toast({
        title: "Email updated successfully.",
        color: "green",
        saturation: "high",
        size: "sm",
        position: "center",
      });

      setEditingEmail(false);
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

  const onNameSubmit: SubmitHandler<{ name: string }> = async ({ name }) => {
    await nameMutation.mutateAsync(name);
  };

  const onEmailSubmit: SubmitHandler<{ email: string }> = async ({ email }) => {
    await emailMutation.mutateAsync(email);
  };

  useEffect(() => {
    setNameValue("name", user?.name || "");
    setEmailValue("email", user?.email || "");
  }, [user?.name, user?.email, setNameValue, setEmailValue]);

  return (
    <div className="flex flex-grow flex-col">
      <Header
        icon={<RiUserLine size={24} className="text-icon-500" />}
        title="Profile Settings"
        description="Manage your store profile settings"
      />
      <div className="mx-8 border-t" />
      <div className="grid gap-x-10 gap-y-5 px-8 py-5 sm:grid-cols-2 sm:gap-x-20">
        <div>
          <p className="label-small">Store ID</p>
          <div className="paragraph-small mt-1 text-text-500">{user?.id}</div>
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
        <div>
          <p className="label-small">Profile Photo</p>
          <div className="paragraph-small mt-1 text-text-500">
            Recommended 400x400px. PNG or JPEG formats only.
          </div>
        </div>
        <div className="flex items-center gap-4 self-center">
          <Image
            src="/default_pfp.jpg"
            width={46}
            height={46}
            alt="Default profile photo"
          />
          <Button size="xs" className="w-fit self-center" text="Upload" />
        </div>
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
              <div className="paragraph-small mt-1 text-text-500">
                This will be displayed on your store page and on your items.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">{user?.name}</p>
              <button
                onClick={() => setEditingName(true)}
                className="label-small flex items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
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
              <div className="paragraph-small mt-1 text-text-500">
                This will be used for order-related notifications.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">{user?.email}</p>
              <button
                onClick={() => setEditingEmail(true)}
                className="label-small flex items-center gap-0.5 text-main-base"
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
