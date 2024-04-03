"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/OTP";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Page() {
  const [error, setError] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch("/api/email-verify", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      return response.json();
    },
    onSettled(data, error) {
      if (data) {
        window.location.href = "/";
      }

      if (error) {
        setError(true);
      }
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      timer > 0 && setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
      <form className="flex-grow overflow-visible rounded-xl border">
        <div className="mx-6 my-7 text-xl font-semibold">Verify Your Email</div>
        <div className="border-t" />
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
            <div className="flex items-baseline justify-between p-1">
              {error ? (
                <p className="text-sm font-medium text-error-600">
                  Invalid verification code.
                </p>
              ) : (
                <p />
              )}
              <div>
                {timer === 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      fetch("/api/email-verify");

                      setTimer(120);
                    }}
                    className="text-sm font-medium text-main-500"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="pointer-events-none text-sm font-medium text-gray-400">
                    {Math.floor(timer / 60)
                      .toString()
                      .padStart(2, "0") +
                      ":" +
                      (timer % 60).toString().padStart(2, "0")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
