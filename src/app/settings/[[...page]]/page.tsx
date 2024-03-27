import Sidebar from "@/components/settings/Sidebar";
import Privacy from "@/components/settings/Privacy";
import Profile from "@/components/settings/Profile";
import Shipping from "@/components/settings/Shipping";

export default function Page({ params }: { params: { page: string[] } }) {
  return (
    <main className="flex h-full flex-grow flex-col-reverse sm:flex-row">
      <Sidebar page={params.page?.[0] || "profile"} />
      {params.page?.[0] === "shipping" ? (
        <Shipping />
      ) : params.page?.[0] === "privacy" ? (
        <Privacy />
      ) : (
        <Profile />
      )}
    </main>
  );
}
