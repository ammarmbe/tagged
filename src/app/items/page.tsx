import Header from "@/components/header/Header";
import Table from "@/components/items/Table";
import Button from "@/components/primitives/Button";
import Loading from "@/components/primitives/Loading";
import { Suspense } from "react";
import { RiAddLine, RiTShirt2Line, RiUploadLine } from "react-icons/ri";

export default function Page() {
  return (
    <main className="flex flex-grow flex-col">
      <Header
        icon={<RiTShirt2Line size={24} className="text-icon-500" />}
        title="Items"
        description="View and track your items"
        button={{
          text: "New Item",
          iconLeft: <RiAddLine size={20} />,
          color: "main",
          href: "/item/new",
        }}
      />
      <div className="relative flex flex-grow flex-col px-8">
        <Suspense fallback={<Loading />}>
          <div className="flex justify-between gap-8 py-4">
            <div className="space-y-1">
              <p className="label-large">All Items</p>
              <p className="paragraph-small text-text-500">
                Monitor and manager your items
              </p>
            </div>
            <Button
              text="Export As"
              color="gray"
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
