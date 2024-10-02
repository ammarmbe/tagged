import { RiInformationLine, RiMapPinLine } from "react-icons/ri";
import TooltipComponent from "../primitives/Tooltip";
import Loading from "../primitives/Loading";

export default function Address({
  address,
  isLoading,
}: {
  address: {
    address_hidden: boolean | undefined;
    city: string | undefined;
    street: string | undefined;
    apartment: string | undefined;
    first_name: string | undefined;
    governorate: string | undefined;
    last_name: string | undefined;
    phone_number: string | undefined;
  };
  isLoading: boolean;
}) {
  return (
    <div className="card min-w-[200px] !gap-0 !p-0">
      <div className="flex gap-2 p-4">
        <RiMapPinLine size={24} className="text-text-600" />
        <p className="label-medium flex items-center gap-1.5">
          Address{" "}
          <TooltipComponent
            trigger={
              <span>
                <RiInformationLine size={16} className="inline text-text-600" />
              </span>
            }
            content={
              <>
                Customer address is hidden until you confirm
                <br />
                their order and after the order is completed.
              </>
            }
          />
        </p>
      </div>
      <div className="mx-4 border-t" />
      <div className="relative flex-grow">
        <Loading isLoading={isLoading} />
        <div className="flex flex-col gap-3 p-4 sm:gap-2">
          <div className="flex flex-col justify-between gap-x-8 gap-y-1 sm:flex-row sm:items-center">
            <p className="paragraph-small text-text-600">Name</p>
            <p className="label-small flex gap-1.5 text-end sm:justify-end">
              {address.first_name}{" "}
              {address.last_name ?? (
                <span className="pointer-events-none inline-block h-5 w-20 select-none rounded-md bg-bg-200 text-transparent" />
              )}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-x-8 gap-y-1 sm:flex-row sm:items-center">
            <p className="paragraph-small text-text-600">Phone number</p>
            <p className="label-small flex sm:text-end">
              {address.phone_number ?? (
                <span className="pointer-events-none inline-block h-5 w-36 select-none rounded-md bg-bg-200 text-transparent" />
              )}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-x-8 gap-y-1 sm:flex-row sm:items-center">
            <p className="paragraph-small text-text-600">Street</p>
            <p className="label-small flex sm:text-end">
              {address.street ?? (
                <span className="pointer-events-none inline-block h-5 w-40 select-none rounded-md bg-bg-200 text-transparent" />
              )}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-x-8 gap-y-1 sm:flex-row sm:items-center">
            <p className="paragraph-small text-text-600">Apartment</p>
            <p className="label-small flex sm:text-end">
              {address.apartment ?? (
                <span className="pointer-events-none inline-block h-5 w-28 select-none rounded-md bg-bg-200 text-transparent" />
              )}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-x-8 gap-y-1 sm:flex-row sm:items-center">
            <p className="paragraph-small text-text-600">City</p>
            <p className="label-small flex sm:text-end">
              {address.city ?? (
                <span className="pointer-events-none inline-block h-5 w-36 select-none rounded-md bg-bg-200 text-transparent" />
              )}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-x-8 gap-y-1 sm:flex-row sm:items-center">
            <p className="paragraph-small text-text-600">Governorate</p>
            <p className="label-small flex sm:text-end">
              {address.governorate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
