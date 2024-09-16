import * as Tooltip from "@radix-ui/react-tooltip";

export default function Status({
  status,
  inline,
}: {
  status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "completed"
    | "store_cancelled"
    | "customer_cancelled"
    | "return_requested"
    | "return_declined"
    | "return_accepted"
    | "returned";
  inline?: boolean;
}) {
  let statusColors = {
    border: "border-primary",
    text: "text-secondary",
    background: "bg-primary",
    status_text: "Pending",
    tooltip_content: "The store has not confirmed your order yet.",
  };

  switch (status) {
    case "pending":
      statusColors = {
        border: "#d5d9eb",
        text: "#363f72",
        background: "#f8f9fc",
        status_text: "Pending",
        tooltip_content: "The store has not confirmed your order yet.",
      };
      break;
    case "shipped":
      statusColors = {
        border: "#b9e6fe",
        text: "#026aa2",
        background: "#f0f9ff",
        status_text: "Shipped",
        tooltip_content: "Your order has been shipped.",
      };
      break;
    case "completed":
      statusColors = {
        border: "#aaefc6",
        text: "#067647",
        background: "#ecfdf3",
        status_text: "Completed",
        tooltip_content: "Your order has been completed.",
      };
      break;
    case "store_cancelled":
      statusColors = {
        border: "#fecdc9",
        text: "#b32318",
        background: "#fef3f2",
        status_text: "Cancelled by store",
        tooltip_content: "Your order has been cancelled by the store.",
      };
      break;
    case "customer_cancelled":
      statusColors = {
        border: "#fecdc9",
        text: "#b32318",
        background: "#fef3f2",
        status_text: "Cancelled by you",
        tooltip_content: "You have cancelled this order.",
      };
      break;
    case "returned":
      statusColors = {
        border: "#fedf89",
        text: "#b54708",
        background: "#fffaeb",
        status_text: "Returned",
        tooltip_content: "Your order has been returned.",
      };
      break;
    case "confirmed":
      statusColors = {
        border: "#F9DBAF",
        text: "#B93815",
        background: "#FEF6EE",
        status_text: "Confirmed",
        tooltip_content: "Your order has been confirmed by the store.",
      };
      break;
    case "return_requested":
      statusColors = {
        border: "#F9DBAF",
        text: "#B93815",
        background: "#FEF6EE",
        status_text: "Return requested",
        tooltip_content: "You have requested a return.",
      };
      break;
    case "return_declined":
      statusColors = {
        border: "#F9DBAF",
        text: "#B93815",
        background: "#FEF6EE",
        status_text: "Return declined",
        tooltip_content: "Your return request has been declined.",
      };
      break;
    case "return_accepted":
      statusColors = {
        border: "#F9DBAF",
        text: "#B93815",
        background: "#FEF6EE",
        status_text: "Return accepted",
        tooltip_content: "Your return request has been accepted.",
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
            {statusColors.status_text}
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
