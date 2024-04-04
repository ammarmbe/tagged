import Spinner from "@/components/Spinner";
import { toast } from "@/utils/toast/use-toast";
import { selectStyles } from "@/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { ToastDescription, ToastTitle } from "@/utils/toast/toast";
import { ToastClose } from "@radix-ui/react-toast";
import Image from "next/image";

export default function Address({
  data,
}: {
  data: {
    street: string;
    apartment: string;
    city: string;
    governorate: string;
    postal: string;
    number: string;
    first_name: string;
    last_name: string;
  };
}) {
  const [governorate, setGovernorate] = useState<{
    value: string;
    label: string;
  }>({
    value: data.governorate,
    label: data.governorate,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    street: string;
    apartment: string;
    city: string;
    governorate: string;
    postal: string;
    number: string;
    first_name: string;
    last_name: string;
  }>({
    defaultValues: {
      first_name: data.first_name,
      last_name: data.last_name,
      street: data.street,
      apartment: data.apartment,
      city: data.city,
      governorate: data.governorate,
      postal: data.postal,
      number: data.number,
    },
  });

  const onSubmit = async (data: {
    street: string;
    apartment: string;
    city: string;
    governorate: string;
    postal: string;
    number: string;
    first_name: string;
    last_name: string;
  }) => {
    const res = await fetch("/api/address", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        governorate: governorate.value,
      }),
    });

    if (res.ok) {
      toast({
        toast_content: (
          <div className="flex gap-2">
            <Image
              width={38}
              height={38}
              src="/check.svg"
              alt="check"
              className="-ml-2 -mt-2 h-fit flex-none"
            />
            <div className="flex flex-col gap-2">
              <div className="space-y-1">
                <ToastTitle className="font-medium text-gray-900">
                  Address updated
                </ToastTitle>
                <ToastDescription className="text-sm text-gray-700">
                  Your address has been updated successfully.
                </ToastDescription>
              </div>
              <ToastClose className="text-tertiary w-fit text-sm font-semibold">
                Dismiss
              </ToastClose>
            </div>
          </div>
        ),
      });
    }
  };

  const governorates = [
    "Cairo",
    "Alexandria",
    "Giza",
    "Aswan",
    "Asyut",
    "Beheira",
    "Beni Suef",
    "Dakahlia",
    "Damietta",
    "Faiyum",
    "Gharbia",
    "Ismailia",
    "Kafr El Sheikh",
    "Luxor",
    "Matrouh",
    "Minya",
    "Monufia",
    "New Valley",
    "North Sinai",
    "Port Said",
    "Qalyubia",
    "Qena",
    "Red Sea",
    "Sharqia",
    "Sohag",
    "South Sinai",
    "Suez",
  ];

  return (
    <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-grow overflow-visible rounded-xl border"
      >
        <div className="mx-6 my-7 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Address</h2>
          <button
            disabled={isSubmitting}
            type="submit"
            className={`button main w-fit self-end !transition-colors ${isSubmitting ? "!px-5" : "!px-3"}`}
          >
            {isSubmitting ? <Spinner size="xs" /> : "Save"}
          </button>
        </div>
        <div className="border-t" />
        <div className="flex max-w-xl flex-col gap-5 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="label">
                First name *
              </label>
              <input
                type="text"
                className="input"
                id="first_name"
                data-invalid={Boolean(errors.first_name)}
                {...register("first_name", {
                  required: {
                    value: true,
                    message: "First name is required",
                  },
                  maxLength: {
                    value: 100,
                    message: "First name is too long",
                  },
                })}
              />
              {errors.first_name ? (
                <p className="mt-1.5 text-sm text-error-600">
                  {errors.first_name.message}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="last_name" className="label">
                Last name *
              </label>
              <input
                type="text"
                className="input"
                id="last_name"
                data-invalid={Boolean(errors.last_name)}
                {...register("last_name", {
                  required: {
                    value: true,
                    message: "Last name is required",
                  },
                  maxLength: {
                    value: 100,
                    message: "Last name is too long",
                  },
                })}
              />
              {errors.last_name ? (
                <p className="mt-1.5 text-sm text-error-600">
                  {errors.last_name.message}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="street" className="label">
              Street Address *
            </label>
            <input
              type="text"
              className="input"
              id="street"
              data-invalid={Boolean(errors.street)}
              {...register("street", {
                required: {
                  value: true,
                  message: "Street Address is required",
                },
                minLength: {
                  value: 5,
                  message: "Street Address is too short",
                },
                maxLength: {
                  value: 100,
                  message: "Street Address is too long",
                },
              })}
            />
            {errors.street ? (
              <p className="mt-1.5 text-sm text-error-600">
                {errors.street.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="apartment" className="label">
              Apartment, Suite, etc.
            </label>
            <input
              type="text"
              className="input"
              id="apartment"
              data-invalid={Boolean(errors.apartment)}
              {...register("apartment", {
                maxLength: {
                  value: 100,
                  message: "Apartment is too long",
                },
              })}
            />
            {errors.apartment ? (
              <p className="mt-1.5 text-sm text-error-600">
                {errors.apartment.message}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="label">
                City *
              </label>
              <input
                type="text"
                className="input"
                id="city"
                data-invalid={Boolean(errors.city)}
                {...register("city", {
                  required: {
                    value: true,
                    message: "City is required",
                  },
                  minLength: {
                    value: 2,
                    message: "City is too short",
                  },
                  maxLength: {
                    value: 100,
                    message: "City is too long",
                  },
                })}
              />
              {errors.city ? (
                <p className="mt-1.5 text-sm text-error-600">
                  {errors.city.message}
                </p>
              ) : null}
            </div>
            <div>
              <p className="label">Governorate *</p>
              <div className="special_scrollbar relative z-20">
                <ReactSelect
                  instanceId={"governorate"}
                  styles={selectStyles}
                  placeholder
                  options={governorates.map((g) => ({ value: g, label: g }))}
                  value={governorate}
                  onChange={(e: any) => setGovernorate(e)}
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="number" className="label">
              Phone number *
            </label>
            <div className="relative flex rounded-lg shadow-sm">
              <p className="border-primary -mr-[1px] rounded-l-lg border px-3 py-2">
                +20
              </p>
              <input
                type="text"
                className='input relative z-10 resize-none !rounded-l-none !shadow-none focus:!shadow-[0_0_0_4px_#9e77ed3D,0_1px_2px_0_#1018280D] data-[invalid="true"]:focus:!shadow-[0_0_0_4px_#F044383D,0_1px_2px_0_#1018280D]'
                id="number"
                data-invalid={Boolean(errors.number)}
                {...register("number", {
                  required: {
                    value: true,
                    message: "Phone number is required",
                  },
                  minLength: {
                    value: 10,
                    message: "Phone number is too short",
                  },
                  maxLength: {
                    value: 11,
                    message: "Phone number is too long",
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Phone number is invalid",
                  },
                  validate: (value) => {
                    if (
                      value.length === 10 &&
                      !value.startsWith("10") &&
                      !value.startsWith("11") &&
                      !value.startsWith("12") &&
                      !value.startsWith("15")
                    )
                      return "Phone number is invalid";

                    if (
                      value.length === 11 &&
                      !value.startsWith("010") &&
                      !value.startsWith("011") &&
                      !value.startsWith("012") &&
                      !value.startsWith("015")
                    )
                      return "Phone number is invalid";
                  },
                })}
              />
            </div>
            {errors.number ? (
              <p className="mt-1.5 text-sm text-error-600">
                {errors.number.message}
              </p>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
