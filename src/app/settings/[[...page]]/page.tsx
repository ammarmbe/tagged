import Sidebar from "@/components/settings/Sidebar";
import Privacy from "@/components/settings/Privacy";
import Profile from "@/components/settings/Profile";
import Shipping from "@/components/settings/Shipping";

export default function Page({ params }: { params: { page: string[] } }) {
  return (
    <main className="flex min-h-0 flex-grow flex-col-reverse sm:h-full sm:flex-row">
      <Sidebar page={params.page?.[0] || "profile"} />
      <div className="flex-grow overflow-auto">
        {params.page?.[0] === "shipping" ? (
          <Shipping />
        ) : params.page?.[0] === "privacy" ? (
          <Privacy />
        ) : (
          <Profile />
        )}
      </div>
    </main>
  );
}
