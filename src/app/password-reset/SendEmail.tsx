import Spinner from "@/components/Spinner";
import { toast } from "@/utils/toast/use-toast";
import {
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@radix-ui/react-toast";
import { useQuery } from "@tanstack/react-query";
import Link from "@/utils/Link";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";

export default function SendEmail({ email }: { email: string | null }) {
  const { data, error } = useQuery({
    queryKey: ["can-sign-in"],
    queryFn: async () => {
      const res = await fetch("/api/password-reset");

      if (res.status === 429) {
        throw new Error("Too many requests");
      }

      return res.text();
    },
    retry: false,
  });

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: email || "",
    },
  });

  const onSubmit: SubmitHandler<{
    email: string;
  }> = async (data) => {
    const { email } = data;

    await fetch("/api/password-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    toast({
      toast_content: (
        <div className="flex gap-2">
          <Image
            width={38}
            height={38}
            src="/check.svg"
            alt="check"
            className="-ml-2 -mt-2 h-fit flex-none"
          />
          <div className="flex flex-col gap-2">
            <div className="space-y-1">
              <ToastTitle className="font-medium text-gray-900">
                Email sent
              </ToastTitle>
              <ToastDescription className="text-sm text-gray-700">
                We have sent you an email with a link to reset your password.
              </ToastDescription>
            </div>
            <ToastClose className="text-tertiary w-fit text-sm font-semibold">
              Dismiss
            </ToastClose>
          </div>
        </div>
      ),
    });
  };

  useEffect(() => {
    if (error) {
      setError("root", {
        message: "Please try again later.",
      });
    }
  }, [error, setError]);

  return (
    <main className="my-40 flex flex-col items-center justify-center">
      <div>
        <h1 className="mb-2 text-2xl font-semibold">Reset Your Password</h1>
        <p className="mb-6 max-w-[300px] text-gray-600">
          Enter your email and we will send you a password reset link.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-w-[300px] flex-col gap-5"
        >
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input disabled:!text-gray-500"
              {...register("email", { required: "Email is required." })}
              type="email"
              name="email"
              disabled={Boolean(errors.root)}
              data-invalid={Boolean(errors.email)}
              id="email"
              autoComplete="email"
            />
            {errors.email ? (
              <p className="mt-1.5 text-sm text-error-600">
                {errors.email.message}
              </p>
            ) : null}
            {errors.root ? (
              <p className="mt-1.5 text-sm text-gray-600">
                {errors.root.message}
              </p>
            ) : null}
          </div>
          <button
            disabled={isSubmitting || Boolean(errors.root)}
            type="submit"
            className="button main sm:lg md mt-1 justify-center"
          >
            {isSubmitting ? <Spinner size="sm" /> : "Send Email"}
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
