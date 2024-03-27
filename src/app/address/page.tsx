"use client";
import Address from "./Address";
import Spinner from "@/components/Spinner";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const response = await fetch("/api/address");
      return (await response.json()) as {
        street: string;
        apartment: string;
        city: string;
        governorate: string;
        postal: string;
        number: string;
        first_name: string;
        last_name: string;
      };
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[min(100%,80rem)] flex-grow px-4">
        <div className="flex flex-grow items-center justify-center rounded-xl border p-10">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (data) return <Address data={data} />;
}
