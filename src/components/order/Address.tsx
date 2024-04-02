import { RiInformationLine, RiMapPinLine } from "react-icons/ri";
import TooltipComponent from "../primitives/Tooltip";
import Loading from "../primitives/Loading";

export default function Address({
  address,
  isFetching,
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
  isFetching: boolean;
}) {
  return (
    <div className="card min-w-[200px] !gap-0 !p-0">
      <div className="flex gap-2 p-4">
        <RiMapPinLine size={24} className="text-text-600" />
        <p className="label-medium flex items-center gap-1.5">
          Address{" "}
          <TooltipComponent
            trigger={
              <RiInformationLine size={16} className="text-text-600 inline" />
            }
            content="Customer address is hidden until you confirm their order"
          />
        </p>
      </div>
      <div className="mx-4 border-t" />
      <div className="relative flex-grow">
        <Loading isFetching={isFetching} />
        <div className="grid gap-2 gap-x-8 p-4 sm:grid-cols-[1fr,auto]">
          <p className="paragraph-small text-text-600">Name</p>
          <p className="label-small flex gap-1.5 text-end sm:justify-end">
            {address.first_name}{" "}
            {address.last_name ?? (
              <span className="bg-bg-300/50 pointer-events-none inline-block h-full w-20 select-none rounded-md text-transparent" />
            )}
          </p>
          <p className="paragraph-small text-text-600">Phone number</p>
          <p className="label-small sm:text-end">
            {address.phone_number ?? (
              <span className="bg-bg-300/50 pointer-events-none inline-block h-full w-36 select-none rounded-md text-transparent" />
            )}
          </p>
          <p className="paragraph-small text-text-600">Street</p>
          <p className="label-small sm:text-end">
            {address.street ?? (
              <span className="bg-bg-300/50 pointer-events-none inline-block h-full w-40 select-none rounded-md text-transparent" />
            )}
          </p>
          <p className="paragraph-small text-text-600">Apartment</p>
          <p className="label-small sm:text-end">
            {address.apartment ?? (
              <span className="bg-bg-300/50 pointer-events-none inline-block h-full w-28 select-none rounded-md text-transparent" />
            )}
          </p>
          <p className="paragraph-small text-text-600">City</p>
          <p className="label-small sm:text-end">
            {address.city ?? (
              <span className="bg-bg-300/50 pointer-events-none inline-block h-full w-36 select-none rounded-md text-transparent" />
            )}
          </p>
          <p className="paragraph-small text-text-600">Governorate</p>
          <p className="label-small sm:text-end">{address.governorate}</p>
        </div>
      </div>
    </div>
  );
}
