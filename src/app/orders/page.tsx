import Header from "@/components/header/Header";
import Table from "@/components/orders/Table";
import Button from "@/components/primitives/Button";
import { RiInboxUnarchiveLine, RiUploadLine } from "react-icons/ri";

export default function Page() {
  return (
    <main className="flex flex-grow flex-col">
      <Header
        icon={<RiInboxUnarchiveLine size={24} className="text-icon-500" />}
        title="Orders"
        description="View and track your orders"
      />
      <div className="flex flex-grow flex-col px-8">
        <div className="flex justify-between gap-8 py-4">
          <div className="space-y-1">
            <p className="label-large">All Orders</p>
            <p className="paragraph-small text-text-500">
              Monitor and manager your orders
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
      </div>
    </main>
  );
}
