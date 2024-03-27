import Header from "@/components/header/Header";
import BestCategories from "@/components/home/BestCategories";
import BestSellers from "@/components/home/BestSellers";
import RevenueOverview from "@/components/home/RevenueOverview/RevenueOverview";
import RevenueByCategory from "@/components/home/RevenueByCategory";
import ViewsOverview from "@/components/home/ViewsOverview/ViewsOverview";
import ViewsByCategory from "@/components/home/ViewsByCategory";
import getUser from "@/utils/getUser";

export default async function Home() {
  const { user } = await getUser();

  return (
    <main className="flex-grow">
      <Header
        icon={<div className="row-span-2 size-5 rounded-full bg-bg-100" />}
        title={user?.name}
        description={user?.email}
      />
      <div className="grid grid-cols-1 gap-4 px-5 pb-6 pt-1 sm:gap-6 sm:px-8 2xl:grid-cols-[auto,1fr]">
        <div className="grid max-w-full grid-cols-1 gap-4 sm:gap-6">
          <BestSellers />
          <BestCategories />
        </div>
        <RevenueOverview />
      </div>
      <div className="grid grid-cols-1 gap-4 px-5 pb-6 sm:gap-6 sm:px-8 2xl:grid-cols-2">
        <RevenueByCategory />
        <ViewsByCategory />
        <ViewsOverview />
      </div>
    </main>
  );
}
