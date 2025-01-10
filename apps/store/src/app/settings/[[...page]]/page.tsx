import Sidebar from "@/components/settings/Sidebar";
import Appearance from "@/components/settings/Appearance";
import Profile from "@/components/settings/Profile";
import Shipping from "@/components/settings/Shipping";

export default async function Page({
  params,
}: {
  params: Promise<{ page: string[] }>;
}) {
  const { page } = await params;

  return (
    <main className="flex min-h-0 flex-grow flex-col-reverse sm:h-full sm:flex-row">
      <Sidebar page={page?.[0] || "profile"} />
      <div className="flex-grow overflow-auto">
        {page?.[0] === "shipping" ? (
          <Shipping />
        ) : page?.[0] === "appearance" ? (
          <Appearance />
        ) : (
          <Profile />
        )}
      </div>
    </main>
  );
}
