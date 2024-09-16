export default function Status({
  status,
  size = "sm",
  inline,
  className,
}: {
  status?:
    | "pending"
    | "confirmed"
    | "shipped"
    | "completed"
    | "store_cancelled"
    | "customer_cancelled"
    | "return_requested"
    | "return_declined"
    | "return_accepted"
    | "returned"
    | null;
  size?: "sm" | "md";
  inline?: boolean;
  className?: string;
}) {
  let text;

  let colors: {
    text: string;
    bg: string;
  };

  switch (status) {
    case "pending":
      colors = {
        text: "#6E330C",
        bg: "#FFDAC2",
      };
      text = "Pending";
      break;
    case "confirmed":
      colors = {
        text: "#162664",
        bg: "#C2D6FF",
      };
      text = "Confirmed";
      break;
    case "shipped":
      colors = {
        text: "#2B1664",
        bg: "#CAC2FF",
      };
      text = "Shipped";
      break;
    case "completed":
      colors = {
        text: "#176448",
        bg: "#CBF5E4",
      };
      text = "Completed";
      break;
    case "store_cancelled":
      colors = {
        text: "#710E21",
        bg: "#F8C9D2",
      };
      text = "Cancelled by you";
      break;
    case "customer_cancelled":
      colors = {
        text: "#710E21",
        bg: "#F8C9D2",
      };
      text = "Cancelled by customer";
      break;
    case "return_requested":
      colors = {
        text: "#682F12",
        bg: "#FFD5C0",
      };
      text = "Return requested";
      break;
    case "return_declined":
      colors = {
        text: "#710E21",
        bg: "#F8C9D2",
      };
      text = "Return declined";
      break;
    case "return_accepted":
      colors = {
        text: "#682F12",
        bg: "#FFD5C0",
      };
      text = "Return accepted";
      break;
    case "returned":
      colors = {
        text: "#682F12",
        bg: "#FFD5C0",
      };
      text = "Returned";
      break;
    default:
      colors = {
        text: "#6E330C",
        bg: "#FFDAC2",
      };
      text = "Pending";
      break;
  }

  if (!status) return null;

  return (
    <span
      className={`flex items-center justify-center ${inline ? "inline" : "block"} ${className}`}
    >
      <span
        className={`rounded-full px-2 py-0.5 ${size === "sm" ? "label-xsmall" : "label-small"}`}
        style={{
          color: colors.text,
          backgroundColor: colors.bg,
        }}
      >
        {text}
      </span>
    </span>
  );
}
