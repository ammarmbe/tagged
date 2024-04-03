import { formatCurrency } from "@/utils";
import { RiTShirt2Line } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import Loading from "../primitives/Loading";
import { useRouter } from "next/navigation";

export default function Items({ nano_id }: { nano_id: string }) {
  const router = useRouter();

  const { data, isFetching } = useQuery({
    queryKey: ["order-items", nano_id],
    queryFn: async () => {
      const res = await fetch(`/api/order/items?nano_id=${nano_id}`);
      return res.json() as Promise<
        {
          nano_id: string;
          color: string;
          size: string;
          price: number;
          quantity: number;
          discount: number;
          item_id: number;
          name: string;
          description: string;
          id: number;
        }[]
      >;
    },
  });

  return (
    <div className="card min-w-[200px] !gap-0 !p-0">
      <div className="flex gap-2 p-4">
        <RiTShirt2Line size={24} className="text-text-600" />
        <p className="label-medium flex items-center gap-1.5">Order Items </p>
      </div>
      <div className="mx-4 border-t" />
      <div className="relative flex-grow">
        <Loading isFetching={isFetching} />
        <div className="flex max-h-[400px] flex-grow flex-col gap-3 overflow-auto">
          {data?.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col gap-1 p-4 ${item.nano_id ? "transition-all hover:bg-bg-50" : ""}`}
              tabIndex={item.nano_id ? 0 : undefined}
              onClick={() => {
                item.nano_id && router.push(`/item/${item.nano_id}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && item.nano_id) {
                  router.push(`/item/${item.nano_id}`);
                }
              }}
              role={item.nano_id ? "button" : undefined}
            >
              <div className="flex items-center justify-between gap-10">
                <p className="label-medium truncate">{item.name}</p>
                <p className="label-xsmall rounded-full bg-[#C2EFFF] px-2 py-0.5 text-[#164564]">
                  {item.color} / {item.size}
                </p>
              </div>
              <p className="label-small flex items-center gap-1.5 truncate text-text-600 transition-all group-hover:text-text-600">
                <span>{item.quantity}</span>
                <span>x</span>
                <span>{formatCurrency(item.price - item.discount)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
