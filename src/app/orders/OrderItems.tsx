import Spinner from "@/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OrderItems({ orderId }: { orderId: number }) {
  const router = useRouter();

  const { data: items, isLoading } = useQuery({
    queryKey: ["orderItems", orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/items?orderId=${orderId}`);
      return (await response.json()) as {
        color: string;
        description: string;
        discount: number;
        id: number;
        image_url: string;
        nano_id?: string;
        item_id: string;
        name: string;
        price: number;
        quantity: number;
        size: string;
        order_id: number;
      }[];
    },
  });

  return (
    <div className="mb-3 flex flex-col gap-2">
      {isLoading ? (
        <div className="flex h-[100px] flex-grow items-center justify-center">
          <Spinner />
        </div>
      ) : (
        items?.map((item) => (
          <div
            key={item.id}
            className="bg-primary border-primary grid min-w-[250px] cursor-pointer grid-cols-[auto,1fr] items-center gap-4 rounded-lg border p-3 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              item.nano_id && router.push(`/item/${item.nano_id}`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && item.nano_id)
                router.push(`/item/${item.nano_id}`);
            }}
            tabIndex={0}
          >
            {item.image_url ? (
              <Image
                width={106}
                height={106}
                alt={item.name}
                src={item.image_url}
                className="h-[6.625rem] w-[6.625rem] rounded-md object-cover"
              />
            ) : (
              <div className="h-[6.625rem] w-[6.625rem] flex-shrink-0 rounded-md bg-gray-200" />
            )}
            <div className="pr-10">
              <p className="text-secondary truncate font-semibold">
                {item.name}
              </p>
              <p className="text-tertiary my-1">
                {item.color} / {item.size}
              </p>
              <p className="text-tertiary mt-2 flex flex-col gap-x-2 font-medium">
                <span className="text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                    currencyDisplay: "symbol",
                  }).format(item.price - (item.discount || 0))}
                </span>{" "}
                <span className="mt-0.5 text-sm">
                  ({item.quantity} x{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                    currencyDisplay: "symbol",
                  }).format(item.price - (item.discount || 0))}
                  )
                </span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
