import Header from "@/components/header/Header";
import BestCategories from "@/components/home/BestCategories";
import BestSellers from "@/components/home/BestSellers";
import RevenueOverview from "@/components/home/RevenueOverview/RevenueOverview";
import RevenueByCategory from "@/components/home/RevenueByCategory";
import ViewsOverview from "@/components/home/ViewsOverview/ViewsOverview";
import ViewsByCategory from "@/components/home/ViewsByCategory";
import getUser from "@/utils/getUser";
import { RiArrowRightLine } from "react-icons/ri";

export default async function Home() {
  const { user } = await getUser();

  return (
    <main className="flex-grow">
      <Header
        icon={<div className="row-span-2 size-5 rounded-full bg-bg-100" />}
        title={user?.name}
        description={user?.email}
        button={{
          text: "Move Money",
          iconRight: <RiArrowRightLine size={20} />,
          color: "main",
        }}
      />
      <div className="grid grid-cols-1 gap-6 px-8 pb-6 pt-1 2xl:grid-cols-[auto,1fr]">
        <div className="grid grid-cols-1 gap-6">
          <BestSellers />
          <BestCategories />
        </div>
        <RevenueOverview />
      </div>
      <div className="grid grid-cols-1 gap-6 px-8 pb-6 2xl:grid-cols-2">
        <RevenueByCategory />
        <ViewsByCategory />
        <ViewsOverview />
      </div>
    </main>
  );
}
