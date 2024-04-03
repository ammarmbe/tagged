"use client";
import Spinner from "@/components/Spinner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "@/utils/Link";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    setError,
    handleSubmit,
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

    if (typeof email === "string") {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 400) {
        setError("email", {
          message: "Invalid email or password.",
        });

        return;
      }
    }

    window.location.href = "/";
  };

  return (
    <main className="my-40 flex flex-col items-center justify-center">
      <div>
        <h1 className="mb-8 text-2xl font-semibold">Sign in</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-w-[300px] flex-col gap-5"
        >
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              {...register("email", { required: "Email is required." })}
              type="email"
              name="email"
              data-invalid={Boolean(errors.email)}
              id="email"
              autoComplete="email"
            />
            {errors.email ? (
              <p className="mt-1.5 text-sm text-error-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
                name="password"
                data-invalid={Boolean(errors.password)}
                id="password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className={`absolute right-[calc((2.5rem+2px)/2)] top-[calc((2.5rem+2px)/2)] -translate-y-1/2 translate-x-1/2 p-2 ${
                  errors.password ? "text-error-500" : "text-quaternary"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <EyeIcon size={18} />
                ) : (
                  <EyeOffIcon size={18} />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="mt-1.5 text-sm text-error-600">
                {errors.password.message}
              </p>
            ) : null}
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="button main sm:lg md mt-1 justify-center"
          >
            {isSubmitting ? <Spinner size="sm" /> : "Continue"}
          </button>
        </form>
        <p className="text-tertiary mt-8 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="sign-in" className="font-semibold text-main-500">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
