import { Suspense } from "react";
import PasswordReset from "./PasswordReset";
import Spinner from "@/components/Spinner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <PasswordReset />
    </Suspense>
  );
}
