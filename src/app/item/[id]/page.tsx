import Item from "./Item";
import getUser from "@/utils/getUser";
import { getBaseUrl } from "@/utils";
import { QueryClient } from "@tanstack/react-query";

export type Item = {
  categories: string[];
  item_id: string;
  item_name: string;
  store_name: string;
  store_id: string;
  description: string;
  price: number;
  discount: number;
  configurations: {
    color: string;
    size: string;
    quantity: number;
    color_value: string;
  }[];
  colors: { name: string; value: string }[];
  sizes: string[];
};

const queryClient = new QueryClient();

export default async function Page({ params }: { params: { id: string } }) {
  const { user } = await getUser();

  await queryClient.prefetchQuery({
    queryKey: ["item", params.id],
    queryFn: async () => {
      const res = await fetch(`${getBaseUrl()}/api/item?id=${params.id}`);
      return (await res.json()) as Item;
    },
  });

  return <Item user={user} id={params.id} />;
}
