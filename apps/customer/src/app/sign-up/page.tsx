import getUser from "@/utils/getUser";
import { redirect } from "next/navigation";
import SignUp from "./SignUp";

export default async function Page() {
  const { user } = await getUser();

  if (user) {
    redirect("/");
  }

  return <SignUp />;
}
