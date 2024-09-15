import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { RiArrowRightSLine } from "react-icons/ri";

export default function Items({ searchTerm }: { searchTerm: string }) {
  const { data, refetch } = useQuery({
    queryKey: ["search", "items"],
    queryFn: async () => {
      if (!searchTerm) return Promise.resolve([]);

      const response = await fetch(
        "/api/search/items?search_term=" + searchTerm,
      );
      return response.json() as Promise<
        {
          name: string;
          nano_id: string;
        }[]
      >;
    },
  });

  useEffect(() => {
    refetch();
  }, [searchTerm, refetch]);

  if (!searchTerm) return null;

  return data?.length ? (
    <div className="border-t p-4">
      <p className="label-small text-text-600">Items</p>
      <div className="mt-2">
        {data.map((result, index) => (
          <Link
            key={index}
            href={`/item/${result.nano_id}`}
            className="border-bg-300 hover:bg-bg-50 group flex items-center rounded-lg p-2 pl-3"
          >
            <p className="paragraph-small flex-grow">{result.name}</p>
            <span className="bg-bg-0 text-text-600 rounded-full opacity-0 shadow-sm group-hover:opacity-100">
              <RiArrowRightSLine size={20} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  ) : null;
}
