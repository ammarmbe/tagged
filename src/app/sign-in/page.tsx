import getUser from "@/utils/getUser";
import { redirect } from "next/navigation";
import SignIn from "./SignIn";

export default async function Page() {
  const { user } = await getUser();

  if (user) {
    redirect("/");
  }

  return <SignIn />;
}
