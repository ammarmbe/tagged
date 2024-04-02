import Header from "@/components/header/Header";
import Table from "@/components/orders/Table";
import Button from "@/components/primitives/Button";
import Loading from "@/components/primitives/Loading";
import { Suspense } from "react";
import { RiInboxUnarchiveLine, RiUploadLine } from "react-icons/ri";

export default function Page() {
  return (
    <main className="flex min-h-0 min-w-0 flex-grow flex-col overflow-auto">
      <Header
        icon={<RiInboxUnarchiveLine size={24} className="text-text-600" />}
        title="Orders"
        description="View and track your orders"
      />
      <div className="relative flex flex-grow flex-col px-5 sm:px-8">
        <Suspense fallback={<Loading />}>
          <div className="flex items-center justify-between gap-8 py-4">
            <div className="space-y-1">
              <p className="label-large">All Orders</p>
              <p className="paragraph-small text-text-600 hidden sm:block">
                Monitor and manager your orders
              </p>
            </div>
            <Button
              text="Export As"
              color="gray"
              className="flex-none"
              iconLeft={<RiUploadLine size={20} />}
              size="md"
            />
          </div>
          <div className="border-t" />
          <Table />
        </Suspense>
      </div>
    </main>
  );
}
