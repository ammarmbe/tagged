"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/OTP";
import Spinner from "@/components/Spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Page() {
  const [error, setError] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: timer, isLoading } = useQuery({
    queryKey: ["email-verify-status"],
    queryFn: async () => {
      const response = await fetch("/api/email-verify/status");
      return Number(await response.text());
    },
  });

  useEffect(() => {
    if ((timer || 0) > 0) {
      const interval = setInterval(() => {
        queryClient.setQueryData(["email-verify-status"], (prev: number) => {
          if (prev === 0) {
            clearInterval(interval);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, queryClient]);

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch("/api/email-verify", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      return response.status;
    },
    onSettled(status) {
      if (status === 400) {
        setError(true);
        return;
      }

      window.location.href = "/";
    },
  });

  return (
    <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
      <form className="flex-grow overflow-visible rounded-xl border">
        <div className="mx-6 my-7 text-xl font-semibold">Verify Your Email</div>
        <div className="border-t" />
        {isLoading ? (
          <div className="flex w-full items-center justify-center p-6">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="flex flex-col items-center p-6">
            <div className="5 flex flex-col gap-1">
              <InputOTP
                maxLength={6}
                disabled={verifyMutation.isPending}
                onChange={(value) => {
                  if (value.length === 6) {
                    verifyMutation.mutate(value);
                  }
                  setError(false);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    className={error ? "!border-error-400" : ""}
                    index={0}
                  />
                  <InputOTPSlot
                    className={error ? "!border-error-400" : ""}
                    index={1}
                  />
                  <InputOTPSlot
                    className={error ? "!border-error-400" : ""}
                    index={2}
                  />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot
                    className={error ? "!border-error-400" : ""}
                    index={3}
                  />
                  <InputOTPSlot
                    className={error ? "!border-error-400" : ""}
                    index={4}
                  />
                  <InputOTPSlot
                    className={error ? "!border-error-400" : ""}
                    index={5}
                  />
                </InputOTPGroup>
              </InputOTP>
              <div className="flex items-baseline justify-between p-1 text-sm font-medium">
                {error ? (
                  <p className="text-error-600">Invalid verification code.</p>
                ) : (
                  <p />
                )}
                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      if ((timer || 0) > 0) return;

                      queryClient.setQueryData(["email-verify-status"], 120);

                      await fetch("/api/email-verify");
                    }}
                    className={
                      timer === 0
                        ? "text-main-500"
                        : "cursor-default text-gray-400"
                    }
                  >
                    {timer === 0
                      ? "Resend code"
                      : Math.floor((timer || 0) / 60)
                          .toString()
                          .padStart(2, "0") +
                        ":" +
                        ((timer || 0) % 60).toString().padStart(2, "0")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
