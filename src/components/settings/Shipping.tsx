"use client";
import { formatCurrency } from "@/utils";
import Header from "@/components/header/Header";
import Button from "@/components/primitives/Button";
import { RiArrowRightSLine, RiShip2Line } from "react-icons/ri";
import { toast } from "@/components/primitives/toast/use-toast";
import { useEffect, useState } from "react";
import Input from "@/components/primitives/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import Loading from "../primitives/Loading";

export default function Page() {
  const queryClient = useQueryClient();
  const [editingPrice, setEditingPrice] = useState(false);
  const [editingExchangePolicy, setEditingExchangePolicy] = useState(false);
  const [editingReturnPolicy, setEditingReturnPolicy] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["current-user", "shipping"],
    queryFn: async () => {
      const res = await fetch("/api/current-user/shipping");
      return res.json() as Promise<{
        price: string;
        return_policy: string;
        exchange_policy: string;
        allowed_governorates: string[];
      }>;
    },
  });

  const priceMutation = useMutation({
    mutationKey: ["updatePrice"],
    mutationFn: async (price: number) => {
      if (price === Number(data?.price)) return;

      await fetch("/api/current-user/shipping/price", {
        method: "PATCH",
        body: JSON.stringify({ price }),
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "current-user" &&
          query.queryKey[1] === "shipping",
      });

      toast({
        title: "Price updated successfully.",
        color: "green",
        saturation: "high",
        size: "sm",
        position: "center",
      });

      setEditingPrice(false);
    },
  });

  const exchangePolicyMutation = useMutation({
    mutationKey: ["updateExchangePolicy"],
    mutationFn: async (exchangePolicy: string) => {
      if (exchangePolicy === data?.exchange_policy) return;

      await fetch("/api/current-user/shipping/exchange-policy", {
        method: "PATCH",
        body: JSON.stringify({ exchangePolicy }),
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "current-user" &&
          query.queryKey[1] === "shipping",
      });

      toast({
        title: "Exchange policy updated successfully.",
        color: "green",
        saturation: "high",
        size: "sm",
        position: "center",
      });

      setEditingExchangePolicy(false);
    },
  });

  const returnPolicyMutation = useMutation({
    mutationKey: ["updateReturnPolicy"],
    mutationFn: async (returnPolicy: string) => {
      if (returnPolicy === data?.return_policy) return;

      await fetch("/api/current-user/shipping/return-policy", {
        method: "PATCH",
        body: JSON.stringify({ returnPolicy }),
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "current-user" &&
          query.queryKey[1] === "shipping",
      });

      toast({
        title: "Return policy updated successfully.",
        color: "green",
        saturation: "high",
        size: "sm",
        position: "center",
      });

      setEditingReturnPolicy(false);
    },
  });

  const {
    register: priceRegister,
    handleSubmit: handlePriceSubmit,
    setValue: setPriceValue,
  } = useForm<{
    price: string;
  }>({
    defaultValues: {
      price: data?.price || "0",
    },
  });

  const {
    register: exchangePolicyRegister,
    handleSubmit: handleExchangePolicySubmit,
    setValue: setExchangePolicyValue,
  } = useForm<{
    exchangePolicy: string;
  }>({
    defaultValues: {
      exchangePolicy: data?.exchange_policy || "",
    },
  });

  const {
    register: returnPolicyRegister,
    handleSubmit: handleReturnPolicySubmit,
    setValue: setReturnPolicyValue,
  } = useForm<{
    returnPolicy: string;
  }>({
    defaultValues: {
      returnPolicy: data?.return_policy || "",
    },
  });

  const onPriceSubmit: SubmitHandler<{ price: string }> = async ({ price }) => {
    await priceMutation.mutateAsync(Number(price));
  };

  const onExchangePolicySubmit: SubmitHandler<{
    exchangePolicy: string;
  }> = async ({ exchangePolicy }) => {
    await exchangePolicyMutation.mutateAsync(exchangePolicy);
  };

  const onReturnPolicySubmit: SubmitHandler<{
    returnPolicy: string;
  }> = async ({ returnPolicy }) => {
    await returnPolicyMutation.mutateAsync(returnPolicy);
  };

  useEffect(() => {
    setPriceValue("price", data?.price || "0");
    setExchangePolicyValue("exchangePolicy", data?.exchange_policy || "");
    setReturnPolicyValue("returnPolicy", data?.return_policy || "");
  }, [setPriceValue, setExchangePolicyValue, setReturnPolicyValue, data]);

  return (
    <div className="flex flex-grow flex-col">
      <Header
        icon={<RiShip2Line size={24} className="text-icon-500" />}
        title="Shipping"
        description="Set shipping price and return policy"
      />
      <div className="mx-8 border-t" />
      <div className="relative grid grid-cols-2 gap-x-20 gap-y-5 px-8 py-5">
        <Loading isFetching={isFetching} />
        {editingPrice ? (
          <>
            <form onSubmit={handlePriceSubmit(onPriceSubmit)}>
              <p className="label-small mb-1">Shipping Price (EGP)</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  type="number"
                  {...priceRegister("price", {
                    required: "Price is required.",
                    min: {
                      value: 0,
                      message: "Price must be at least 0 EGP.",
                    },
                    max: {
                      value: 1000,
                      message: "Price must be at most 1000 EGP.",
                    },
                  })}
                />
                <Button
                  size="sm"
                  text="Save"
                  disabled={priceMutation.isPending}
                  type="submit"
                />
              </div>
            </form>
            <div />
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Shipping Price</p>
              <div className="paragraph-small mt-1 text-text-500">
                This will be added to the total price of the order.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {formatCurrency(Number(data?.price))}
              </p>
              <button
                onClick={() => setEditingPrice(true)}
                className="label-small flex items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="col-span-2 border-t" />
        {editingReturnPolicy ? (
          <>
            <form onSubmit={handleReturnPolicySubmit(onReturnPolicySubmit)}>
              <p className="label-small mb-1">Return Policy</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  className="w-screen max-w-[300px]"
                  textarea
                  {...returnPolicyRegister("returnPolicy", {
                    maxLength: {
                      value: 2000,
                      message: "Return policy must be at most 2000 characters.",
                    },
                  })}
                />
                <Button
                  size="sm"
                  text="Save"
                  disabled={returnPolicyMutation.isPending}
                  type="submit"
                />
              </div>
            </form>
            <div />
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Return Policy</p>
              <div className="paragraph-small mt-1 text-text-500">
                This will be displayed on the product page.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {data?.return_policy || "No return policy"}
              </p>
              <button
                onClick={() => setEditingReturnPolicy(true)}
                className="label-small flex items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="col-span-2 border-t" />
        {editingExchangePolicy ? (
          <>
            <form onSubmit={handleExchangePolicySubmit(onExchangePolicySubmit)}>
              <p className="label-small mb-1">Exchange Policy</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  className="w-screen max-w-[300px]"
                  textarea
                  {...exchangePolicyRegister("exchangePolicy", {
                    maxLength: {
                      value: 2000,
                      message:
                        "Exchange policy must be at most 2000 characters.",
                    },
                  })}
                />
                <Button
                  size="sm"
                  text="Save"
                  disabled={exchangePolicyMutation.isPending}
                  type="submit"
                />
              </div>
            </form>
            <div />
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Exchange Policy</p>
              <div className="paragraph-small mt-1 text-text-500">
                This will be displayed on the product page.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {data?.exchange_policy || "No exchange policy"}
              </p>
              <button
                onClick={() => setEditingExchangePolicy(true)}
                className="label-small flex items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
