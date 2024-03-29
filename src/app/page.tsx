import Header from "@/components/header/Header";
import RevenueOverview from "@/components/home/RevenueOverview/RevenueOverview";
import RevenueByCategory from "@/components/home/RevenueByCategory";
import ViewsOverview from "@/components/home/ViewsOverview/ViewsOverview";
import ViewsByCategory from "@/components/home/ViewsByCategory";
import getUser from "@/utils/getUser";
import CurrentStatus from "@/components/home/CurrentStatus";
import BestSellers from "@/components/home/BestSellers";
import Statistics from "@/components/home/Statistics";

export default async function Home() {
  const { user } = await getUser();

  return (
    <main className="min-h-0 min-w-0 flex-grow overflow-auto">
      <Header
        icon={<div className="row-span-2 size-5 rounded-full bg-bg-100" />}
        title={user?.name}
        description={user?.email}
      />
      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-1 sm:gap-6 sm:px-8 xl:grid-cols-[1fr,3fr]">
        <div className="flex max-w-full flex-col gap-4 sm:gap-6">
          <CurrentStatus />
          <BestSellers />
        </div>
        <RevenueOverview />
      </div>
      <div className="grid grid-cols-1 gap-4 px-5 pb-6 sm:gap-6 sm:px-8 xl:grid-cols-2">
        <RevenueByCategory />
        <Statistics />
        <ViewsOverview />
        <ViewsByCategory />
      </div>
    </main>
  );
}
