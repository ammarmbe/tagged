import Spinner from "@/components/Spinner";
import { Scrypt } from "lucia";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "@/utils/Link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function NewPassword({ code }: { code: string }) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{
    password: string;
    confirmPassword: string;
  }>();

  const onSubmit: SubmitHandler<{
    password: string;
    confirmPassword: string;
  }> = async (data) => {
    const { password } = data;

    const hashedPassword = await new Scrypt().hash(password);

    const res = await fetch("/api/password-reset/reset", {
      method: "POST",
      body: JSON.stringify({ code, hashedPassword }),
    });

    if (!res.ok) {
      setError("password", {
        type: "manual",
        message: "Invalid link.",
      });
      return;
    }

    window.location.href = "/";
  };

  return (
    <main className="my-40 flex flex-col items-center justify-center">
      <div>
        <h1 className="mb-2 text-2xl font-semibold">Reset Your Password</h1>
        <p className="mb-6 max-w-[300px] text-gray-600">
          Choose a new password for your account.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-w-[300px] flex-col gap-5"
        >
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
            {isSubmitting ? <Spinner size="sm" /> : "Save Password"}
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
