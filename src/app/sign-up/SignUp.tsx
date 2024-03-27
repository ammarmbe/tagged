"use client";
import Spinner from "@/components/Spinner";
import { Scrypt, generateId } from "lucia";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "@/utils/Link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    setError,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>();

  const onSubmit: SubmitHandler<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }> = async (data) => {
    const { email, password, name } = data;

    // check if a user with the same email exists
    const count: number = await fetch("/api/email-exists", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json() as Promise<number>);

    if (count > 0) {
      setError("email", {
        message: "A user with the same email already exists.",
      });

      return;
    }

    const hashedPassword = await new Scrypt().hash(password);
    const userId = generateId(15);

    if (typeof email === "string") {
      await fetch("/api/sign-up", {
        method: "POST",
        body: JSON.stringify({ email, hashedPassword, userId, name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    router.push("/");
  };

  return (
    <main className="my-40 flex flex-col items-center justify-center">
      <div>
        <h1 className="mb-8 text-2xl font-semibold">Sign up</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-w-[300px] flex-col gap-5"
        >
          <div>
            <label className="label" htmlFor="name">
              Name *
            </label>
            <input
              className="input"
              {...register("name", { required: "Name is required." })}
              type="name"
              name="name"
              data-invalid={Boolean(errors.name)}
              id="name"
              autoComplete="name"
            />
            {errors.name ? (
              <p className="mt-1.5 text-sm text-error-600">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email *
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
              Password *
            </label>
            <div className="relative">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters.",
                  },
                  maxLength: {
                    value: 100,
                    message: "Password must be at most 100 characters.",
                  },
                })}
                name="password"
                data-invalid={Boolean(errors.password)}
                id="password"
                autoComplete="new-password"
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
          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm password *
            </label>
            <div className="relative">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Password is required",
                  validate: (value) =>
                    value !== watch("password")
                      ? "Passwords do not match."
                      : undefined,
                })}
                name="confirmPassword"
                data-invalid={Boolean(errors.confirmPassword)}
                id="confirmPassword"
                autoComplete="new-password"
              />
              <button
                type="button"
                className={`absolute right-[calc((2.5rem+2px)/2)] top-[calc((2.5rem+2px)/2)] -translate-y-1/2 translate-x-1/2 p-2 ${
                  errors.confirmPassword ? "text-error-500" : "text-quaternary"
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
            {errors.confirmPassword ? (
              <p className="mt-1.5 text-sm text-error-600">
                {errors.confirmPassword.message}
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
          Already have an account?{" "}
          <Link href="sign-in" className="font-semibold text-main-500">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
