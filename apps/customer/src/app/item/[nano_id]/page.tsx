import Item from "./Item";
import getUser from "@/utils/getUser";
import { QueryClient } from "@tanstack/react-query";

export type TItem = {
  category: string[];
  item_id: string;
  item_name: string;
  store_name: string;
  store_nano_id: string;
  store_id: string;
  description: string;
  price: number;
  discount: number;
  configurations: {
    color: string;
    size: string;
    quantity: number;
    color_hex: string;
  }[];
  colors: { name: string; value: string }[];
  sizes: string[];
};

const queryClient = new QueryClient();

export default async function Page({
  params,
}: {
  params: { nano_id: string };
}) {
  const { user } = await getUser();

  queryClient.prefetchQuery({
    queryKey: ["item", params.nano_id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/item?nano_id=${params.nano_id}`,
      );
      return (await res.json()) as TItem;
    },
  });

  return <Item user={user} nano_id={params.nano_id} />;
}
