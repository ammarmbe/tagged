"use client";
import Button from "@/components/primitives/Button";
import Input from "@/components/primitives/Input";
import Spinner from "@/components/primitives/Spinner";
import {
  RiArrowRightLine,
  RiEyeLine,
  RiEyeOffLine,
  RiUserLine,
} from "react-icons/ri";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{
    email: string;
    password: string;
  }>();

  const onSubmit: SubmitHandler<{
    email: string;
    password: string;
  }> = async (data) => {
    const { email, password } = data;

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      setError("email", {
        message: "Invalid email or password.",
      });

      return;
    }

    window.location.href = "/";
  };

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <form className="card" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
          <div className="flex gap-2">
            <RiUserLine size={24} className="text-icon-500" />
            <p className="label-medium">Log In</p>
          </div>
          <Button
            className={`w-fit justify-center self-end ${
              isSubmitting
                ? "pointer-events-none cursor-not-allowed !border-main-light !bg-main-light"
                : ""
            }`}
            text="Log in"
            color="main"
            size="xs"
            iconRight={
              isSubmitting ? (
                <Spinner size={20} fill="fill-white" />
              ) : (
                <RiArrowRightLine size={20} />
              )
            }
            aria-disabled={isSubmitting}
          />
        </div>
        <div className="border-t" />
        <div className="flex flex-col gap-0.5">
          <label htmlFor="email" className="label-small">
            Email
          </label>
          <Input
            {...register("email", { required: true })}
            type="email"
            id="email"
            error={Boolean(errors.email)}
            className="w-full"
            errorMessage="Email is required."
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="password" className="label-small mb-1">
            Password
          </label>
          <Input
            {...register("password", { required: true })}
            type={showPassword ? "text" : "password"}
            id="password"
            iconSide="right"
            className="w-full"
            error={Boolean(errors.password)}
            icon={
              showPassword ? (
                <RiEyeLine
                  size={20}
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <RiEyeOffLine
                  size={20}
                  onClick={() => setShowPassword(!showPassword)}
                />
              )
            }
            errorMessage="Password is required."
          />
        </div>
      </form>
    </main>
  );
}
