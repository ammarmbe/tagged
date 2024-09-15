"use client";
import { useSearchParams } from "next/navigation";
import SendEmail from "./SendEmail";
import NewPassword from "./NewPassword";

export default function SignIn() {
  const searchParams = useSearchParams();

  if (searchParams.has("code")) {
    return <NewPassword code={searchParams.get("code") as string} />;
  } else {
    return <SendEmail email={searchParams.get("email")} />;
  }
}
