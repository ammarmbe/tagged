"use client";
import { formatCurrency, useUser } from "@/utils";
import Header from "@/components/header/Header";
import Button from "@/components/primitives/Button";
import { RiArrowRightSLine, RiShip2Line } from "react-icons/ri";
import { toast } from "@/components/primitives/toast/use-toast";
import { useEffect, useState } from "react";
import Input from "@/components/primitives/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Loading from "../primitives/Loading";
import Select from "../primitives/Select";

type TDuration = {
  value: "1d" | "3d" | "7d" | "14d" | "30d" | "";
  label:
    | "1 day"
    | "3 days"
    | "7 days"
    | "14 days"
    | "30 days"
    | "No exchanges allowed"
    | "No returns allowed";
};

const exchange_durations = [
  {
    value: "",
    label: "No exchanges allowed",
  },
  {
    value: "1d",
    label: "1 day",
  },
  {
    value: "3d",
    label: "3 days",
  },
  {
    value: "7d",
    label: "7 days",
  },
  {
    value: "14d",
    label: "14 days",
  },
  {
    value: "30d",
    label: "30 days",
  },
] as const;

const return_durations = [
  {
    value: "",
    label: "No returns allowed",
  },
  {
    value: "1d",
    label: "1 day",
  },
  {
    value: "3d",
    label: "3 days",
  },
  {
    value: "7d",
    label: "7 days",
  },
  {
    value: "14d",
    label: "14 days",
  },
  {
    value: "30d",
    label: "30 days",
  },
] as const;

const gov = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Aswan",
  "Assiut",
  "Beheira",
  "Beni Suef",
  "Dakahlia",
  "Damietta",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Kafr el-Sheikh",
  "Matrouh",
  "Minya",
  "Menofia",
  "New Valley",
  "North Sinai",
  "Port Said",
  "Qualyubia",
  "Qena",
  "Red Sea",
  "Al-Sharqia",
  "Soha",
  "South Sinai",
  "Suez",
  "Luxor",
];

export default function Page() {
  const queryClient = useQueryClient();
  const [editingPrice, setEditingPrice] = useState(false);
  const [editingExchangePolicy, setEditingExchangePolicy] = useState(false);
  const [editingReturnPolicy, setEditingReturnPolicy] = useState(false);
  const [allowedGov, setAllowedGov] = useState<string[]>([
    "Cairo",
    "Giza",
    "Alexandria",
  ]);

  const { user, isFetching } = useUser();

  const priceMutation = useMutation({
    mutationKey: ["updatePrice"],
    mutationFn: async (price: number) => {
      if (price === Number(user?.feature_flags?.shipping_price)) return;

      const res = await fetch("/api/current-user/shipping/price", {
        method: "PATCH",
        body: JSON.stringify({ price }),
      });

      return res.ok;
    },
    async onSuccess(ok) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      ok
        ? toast({
            title: "Price updated successfully.",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });

      setEditingPrice(false);
    },
  });

  const exchangePolicyMutation = useMutation({
    mutationKey: ["updateExchangePolicy"],
    mutationFn: async ({ exchange_period }: { exchange_period: TDuration }) => {
      const res = await fetch("/api/current-user/shipping/exchange-policy", {
        method: "PATCH",
        body: JSON.stringify({ exchange_period: exchange_period.value }),
      });

      return res.ok;
    },
    async onSuccess(ok) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      ok
        ? toast({
            title: "Exchange policy updated successfully.",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });

      setEditingExchangePolicy(false);
    },
  });

  const returnPolicyMutation = useMutation({
    mutationKey: ["updateReturnPolicy"],
    mutationFn: async ({ return_period }: { return_period: TDuration }) => {
      const res = await fetch("/api/current-user/shipping/return-policy", {
        method: "PATCH",
        body: JSON.stringify({ return_period: return_period.value }),
      });

      return res.ok;
    },
    async onSuccess(ok) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      ok
        ? toast({
            title: "Return policy updated successfully.",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });

      setEditingReturnPolicy(false);
    },
  });

  const allowedGovMutation = useMutation({
    mutationKey: ["updateAllowedGov"],
    mutationFn: async (allowed_gov: string[]) => {
      const res = await fetch("/api/current-user/shipping/allowed-gov", {
        method: "PATCH",
        body: JSON.stringify({ allowed_gov }),
      });

      return res.ok;
    },
    async onSuccess(ok) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "current-user",
      });

      ok
        ? toast({
            title: "Allowed governorates updated successfully.",
            color: "green",
            saturation: "high",
            size: "sm",
            position: "center",
          })
        : toast({
            title: "An error occured, please try again.",
            color: "red",
            saturation: "high",
            size: "sm",
            position: "center",
          });
    },
  });

  const {
    register: priceRegister,
    handleSubmit: handlePriceSubmit,
    setValue: setPriceValue,
    formState: { errors: priceErrors },
  } = useForm<{
    price: string;
  }>({
    defaultValues: {
      price: user?.feature_flags?.shipping_price?.toString() || "0",
    },
  });

  const {
    handleSubmit: handleExchangePolicySubmit,
    setValue: setExchangePolicyValue,
    control: exchangePolicyControl,
  } = useForm<{
    exchange_period: TDuration;
  }>({
    defaultValues: {
      exchange_period: {
        value: user?.feature_flags?.exchange_period || "",
        label:
          exchange_durations.find(
            (duration) =>
              duration.value === user?.feature_flags?.exchange_period,
          )?.label || "No exchanges allowed",
      },
    },
  });

  const {
    handleSubmit: handleReturnPolicySubmit,
    setValue: setReturnPolicyValue,
    control: returnPolicyControl,
  } = useForm<{
    return_period: TDuration;
  }>({
    defaultValues: {
      return_period: {
        value: user?.feature_flags?.return_period || "",
        label:
          return_durations.find(
            (duration) => duration.value === user?.feature_flags?.return_period,
          )?.label || "No returns allowed",
      },
    },
  });

  const onPriceSubmit: SubmitHandler<{ price: string }> = async ({ price }) => {
    await priceMutation.mutateAsync(Number(price));
  };

  const onExchangePolicySubmit: SubmitHandler<{
    exchange_period: TDuration;
  }> = async ({ exchange_period }) => {
    await exchangePolicyMutation.mutateAsync({ exchange_period });
  };

  const onReturnPolicySubmit: SubmitHandler<{
    return_period: TDuration;
  }> = async ({ return_period }) => {
    await returnPolicyMutation.mutateAsync({ return_period });
  };

  useEffect(() => {
    setPriceValue(
      "price",
      user?.feature_flags?.shipping_price?.toString() || "0",
    );
    setExchangePolicyValue("exchange_period", {
      value: user?.feature_flags?.exchange_period || "",
      label:
        exchange_durations.find(
          (duration) => duration.value === user?.feature_flags?.exchange_period,
        )?.label || "No exchanges allowed",
    });
    setReturnPolicyValue("return_period", {
      value: user?.feature_flags?.return_period || "",
      label:
        exchange_durations.find(
          (duration) => duration.value === user?.feature_flags?.return_period,
        )?.label || "No returns allowed",
    });
  }, [
    setPriceValue,
    setExchangePolicyValue,
    setReturnPolicyValue,
    user?.feature_flags,
  ]);

  return (
    <div className="flex flex-grow flex-col">
      <Header
        icon={<RiShip2Line size={24} className="text-text-600" />}
        title="Shipping"
        description="Set shipping price and return policy"
      />
      <div className="mx-8 border-t" />
      <div className="relative grid gap-x-10 gap-y-5 px-8 py-5 lg:grid-cols-2 lg:gap-x-20">
        <Loading isFetching={isFetching} />
        {editingPrice ? (
          <>
            <form onSubmit={handlePriceSubmit(onPriceSubmit)}>
              <p className="label-small mb-1">Shipping Price (EGP)</p>
              <div className="flex gap-3">
                <Input
                  size="sm"
                  type="number"
                  error={priceErrors.price?.message}
                  errorMessage={priceErrors.price?.message}
                  {...priceRegister("price", {
                    required: "Shipping price is required.",
                    min: {
                      value: 0,
                      message: "Shipping price must be at least 0 EGP.",
                    },
                    max: {
                      value: 1000,
                      message: "Shipping price must be at most 1000 EGP.",
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
              <div className="paragraph-small mt-1 text-text-600">
                This will be added to the total price of the order.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {formatCurrency(Number(user?.feature_flags?.shipping_price))}
              </p>
              <button
                onClick={() => setEditingPrice(true)}
                className="label-small flex w-fit items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="border-t sm:col-span-2" />
        {editingReturnPolicy ? (
          <>
            <form
              onSubmit={handleReturnPolicySubmit(onReturnPolicySubmit)}
              className="col-span-2"
            >
              <div className="w-full">
                <p className="label-small mb-1">Return Period</p>
                <div className="flex gap-3">
                  <Controller
                    control={returnPolicyControl}
                    name="return_period"
                    render={({
                      field: { onChange, value, name, ref, onBlur, disabled },
                    }) => (
                      <Select
                        size="sm"
                        className="w-screen !max-w-[200px]"
                        width="1000px"
                        value={value}
                        onChange={onChange}
                        options={return_durations}
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                        isDisabled={disabled}
                      />
                    )}
                  />
                  <Button
                    size="sm"
                    text="Save"
                    disabled={returnPolicyMutation.isPending}
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Return Policy</p>
              <div className="paragraph-small mt-1 text-text-600">
                This will be displayed on the product page.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {return_durations.find(
                  (duration) =>
                    duration.value === user?.feature_flags?.return_period,
                )?.label || "No returns allowed"}
              </p>
              <button
                onClick={() => setEditingReturnPolicy(true)}
                className="label-small flex w-fit items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="border-t sm:col-span-2" />
        {editingExchangePolicy ? (
          <>
            <form
              onSubmit={handleExchangePolicySubmit(onExchangePolicySubmit)}
              className="cols-span-2"
            >
              <div className="w-full">
                <p className="label-small mb-1">Exchange Period</p>
                <div className="flex gap-3">
                  <Controller
                    control={exchangePolicyControl}
                    name="exchange_period"
                    render={({
                      field: { onChange, value, name, ref, onBlur, disabled },
                    }) => (
                      <Select
                        size="sm"
                        className="w-screen !max-w-[200px]"
                        value={value}
                        width="1000px"
                        onChange={onChange}
                        options={exchange_durations}
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                        isDisabled={disabled}
                      />
                    )}
                  />
                  <Button
                    size="sm"
                    text="Save"
                    disabled={exchangePolicyMutation.isPending}
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            <div>
              <p className="label-small">Exchange Policy</p>
              <div className="paragraph-small mt-1 text-text-600">
                This will be displayed on the product page.
              </div>
            </div>
            <div className="flex flex-col gap-2 self-center">
              <p className="paragraph-small">
                {exchange_durations.find(
                  (duration) =>
                    duration.value === user?.feature_flags?.exchange_period,
                )?.label || "No exchanges allowed"}
              </p>
              <button
                onClick={() => setEditingExchangePolicy(true)}
                className="label-small flex w-fit items-center gap-0.5 text-main-base"
              >
                Edit <RiArrowRightSLine size={20} />
              </button>
            </div>
          </>
        )}
        <div className="border-t sm:col-span-2" />
        <div>
          <div>
            <p className="label-small">Allowed Governorates</p>
            <div className="paragraph-small mt-1 text-text-600">
              Select governorates that you can ship to.
            </div>
          </div>

          <Button
            size="sm"
            text="Save"
            className="mt-3 w-fit"
            disabled={allowedGovMutation.isPending}
            onClick={() => allowedGovMutation.mutate(allowedGov)}
            type="submit"
          />
        </div>
        <div className="grid grid-cols-2 gap-1">
          {gov.map((gov) => (
            <div key={gov} className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={allowedGov.includes(gov)}
                onChange={() => {
                  if (allowedGov.includes(gov)) {
                    setAllowedGov(allowedGov.filter((g) => g !== gov));
                  } else {
                    setAllowedGov([...allowedGov, gov]);
                  }
                }}
                className="checkbox"
              />
              <p className="paragraph-small">{gov}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
