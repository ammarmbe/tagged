import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sP = useSearchParams();
  const searchParams = new URLSearchParams(Object.fromEntries(sP.entries()));

  const get = (filter: string) => {
    return searchParams.get(filter);
  };

  const set = (filter: string, value: string) => {
    searchParams.set(filter, value);

    router.push(pathname + "?" + searchParams.toString());
  };

  const clear = (filter: string) => {
    searchParams.delete(filter);

    router.push(pathname + "?" + searchParams.toString());
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const getAll = () => {
    return Object.fromEntries(searchParams.entries());
  };

  return { get, set, clear, clearAll, getAll };
}
