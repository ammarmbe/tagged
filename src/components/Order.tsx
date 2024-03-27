import OrderItems from "@/app/orders/OrderItems";
import Status from "@/components/Status";

export default function Page({
  order,
}: {
  order: {
    id: number;
    governorate: string;
    city: string;
    created_at: string;
    shipping_price: number;
    reason: string;
    status:
      | "pending"
      | "shipped"
      | "delivered"
      | "cancelled"
      | "returned"
      | "customer_cancelled";
    store_name: string;
    store_id: number;
    street: string;
    customer_name: string;
    apartment: string;
    phone_number: string;
    total: number;
    nano_id: string;
  };
}) {
  const reasons = [
    {
      value: "outOfStock",
      label: "Item out of stock",
    },
    {
      value: "dontShipToAddress",
      label: "Don't ship to this address",
    },
    {
      value: "incorrectItemData",
      label: "Incorrect item data",
    },
    {
      value: "addressIncorrect",
      label: "Address is incorrect",
    },
  ];

  return (
    <div className="bg-primary grid w-full grid-cols-1 gap-7 p-6 md:grid-cols-[auto,auto,auto]">
      <div className="flex-grow">
        <h2 className="font-medium">Address</h2>
        <div className="ml-3 mt-3">
          <p>{order.customer_name}</p>
          <p>{order.street}</p>
          <p>{order.apartment}</p>
          <p>{order.city}</p>
          <p>{order.governorate}</p>
          <p>{order.phone_number}</p>
        </div>
      </div>
      <div className="flex-grow">
        <h2 className="font-medium">Order items</h2>
        <div className="ml-3 mt-3 max-h-[400px] space-y-3 overflow-auto">
          <OrderItems orderId={order.id} />
        </div>
      </div>
      <div className="flex-grow">
        <h2 className="font-medium">Order details</h2>
        <div className="ml-3 mt-3 grid grid-cols-[auto,auto] gap-4">
          <div>
            <p className="text-tertiary mb-1 font-medium">Order ID</p>
            <p>{order.nano_id}</p>
          </div>
          <div>
            <p className="text-tertiary mb-1 font-medium">Subtotal</p>
            <p>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "EGP",
                currencyDisplay: "symbol",
              }).format(order.total)}
            </p>
          </div>
          <div>
            <p className="text-tertiary mb-1 font-medium">Shipping price</p>
            <p>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "EGP",
                currencyDisplay: "symbol",
              }).format(order.shipping_price)}
            </p>
          </div>
          <div>
            <p className="text-tertiary mb-1 font-medium">Created at</p>
            <p>
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(order.created_at))}
            </p>
          </div>
          <div>
            <p className="text-tertiary mb-1 font-medium">Status</p>
            <p>
              <Status status={order.status} inline store={false} />
            </p>
          </div>
          {order.status === "cancelled" && order.reason ? (
            <div>
              <p className="text-tertiary mb-1 font-medium">Reason</p>
              <p>
                {reasons.find((r) => r.value === order.reason)?.label ??
                  order.reason}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
