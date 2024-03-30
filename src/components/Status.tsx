import * as Tooltip from "@radix-ui/react-tooltip";

export default function Status({
  status,
  inline,
  store,
}: {
  status:
    | "pending"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"
    | "confirmed"
    | "customer_cancelled";
  inline?: boolean;
  store: boolean;
}) {
  let statusColors = {
    border: "border-primary",
    text: "text-secondary",
    background: "bg-primary",
    tooltip_content: store
      ? "You have not confirmed this order yet."
      : "The store has not confirmed your order yet.",
  };

  switch (status) {
    case "pending":
      statusColors = {
        border: "#d5d9eb",
        text: "#363f72",
        background: "#f8f9fc",
        tooltip_content: store
          ? "You have not confirmed this order yet"
          : "The store has not confirmed your order yet.",
      };
      break;
    case "shipped":
      statusColors = {
        border: "#b9e6fe",
        text: "#026aa2",
        background: "#f0f9ff",
        tooltip_content: store
          ? "You have shipped this order."
          : "Your order has been shipped.",
      };
      break;
    case "delivered":
      statusColors = {
        border: "#aaefc6",
        text: "#067647",
        background: "#ecfdf3",
        tooltip_content: store
          ? "You have delivered this order."
          : "Your order has been delivered.",
      };
      break;
    case "cancelled":
      statusColors = {
        border: "#fecdc9",
        text: "#b32318",
        background: "#fef3f2",
        tooltip_content: store
          ? "You have cancelled this order."
          : "Your order has been cancelled by the store.",
      };
      break;
    case "customer_cancelled":
      statusColors = {
        border: "#fecdc9",
        text: "#b32318",
        background: "#fef3f2",
        tooltip_content: store
          ? "This order has been cancelled by the customer."
          : "You have cancelled this order.",
      };
      break;
    case "returned":
      statusColors = {
        border: "#fedf89",
        text: "#b54708",
        background: "#fffaeb",
        tooltip_content: store
          ? "This order has been returned by the customer."
          : "Your order has been returned.",
      };
      break;
    case "confirmed":
      statusColors = {
        border: "#e9d7fe",
        text: "#6941c6",
        background: "#f9f5ff",
        tooltip_content: store
          ? "You have confirmed this order."
          : "Your order has been confirmed by the store.",
      };
      break;
    default:
      break;
  }

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger
          className="flex cursor-help items-center justify-center"
          asChild
        >
          <span
            style={{
              borderColor: statusColors.border,
              color: statusColors.text,
              backgroundColor: statusColors.background,
            }}
            className={`text-medium w-fit text-nowrap rounded-full border p-2 py-0.5 text-xs ${inline ? "inline" : "block"}`}
          >
            {status === "customer_cancelled" ? (
              "Cancelled by customer"
            ) : status === "cancelled" ? (
              "Cancelled by store"
            ) : (
              <span className="capitalize">{status}</span>
            )}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="rounded-md bg-[#0C111D] px-3 py-2 text-xs font-medium text-white shadow-lg animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
            {statusColors.tooltip_content}
            <Tooltip.Arrow className="-mt-[1px]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
