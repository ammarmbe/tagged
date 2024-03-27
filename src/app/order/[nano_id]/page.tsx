"use client";
import Header from "@/components/header/Header";
import Address from "@/components/order/Address";
import { useQuery } from "@tanstack/react-query";
import Items from "@/components/order/Items";
import StatusHistory from "@/components/order/StatusHistory";
import { RiInboxUnarchiveLine, RiMindMap } from "react-icons/ri";
import { LuDot } from "react-icons/lu";
import Status from "@/components/Status";
import UpdateStatus from "@/components/order/UpdateStatus";
import Button from "@/components/primitives/Button";

export default function Page({ params }: { params: { nano_id: string } }) {
  const { data, isFetching } = useQuery({
    queryKey: ["order", params.nano_id],
    queryFn: async () => {
      const res = await fetch(`/api/order?nano_id=${params.nano_id}`);
      return res.json() as Promise<{
        nano_id: string;
        status:
          | "pending"
          | "confirmed"
          | "shipped"
          | "completed"
          | "store_cancelled"
          | "customer_cancelled"
          | null;
        governorate: string;
        first_name: string;
        address_hidden: boolean;
        city?: string;
        street?: string;
        apartment?: string;
        last_name?: string;
        phone_number?: string;
      }>;
    },
  });

  return (
    <main className="flex flex-grow flex-col">
      <Header
        icon={<RiInboxUnarchiveLine size={24} className="text-icon-500" />}
        title={`Order ${params.nano_id}`}
        description={
          <span className="flex items-center gap-1.5">
            <Status status={data?.status} inline />
            <LuDot size={16} />
            {data?.governorate}
          </span>
        }
        buttonNode={
          <UpdateStatus
            trigger={
              <Button
                text="Update Status"
                iconLeft={<RiMindMap size={20} />}
                color="main"
              />
            }
            current_status={data?.status}
            data={data}
          />
        }
      />
      <div className="flex flex-wrap gap-6 px-8 pb-6 pt-1">
        <Address
          address={{
            address_hidden: data?.address_hidden,
            city: data?.city,
            street: data?.street,
            apartment: data?.apartment,
            first_name: data?.first_name,
            governorate: data?.governorate,
            last_name: data?.last_name,
            phone_number: data?.phone_number,
          }}
          isFetching={isFetching}
        />
        <Items nano_id={params.nano_id} />
        <StatusHistory nano_id={params.nano_id} />
      </div>
    </main>
  );
}
