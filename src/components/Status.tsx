export default function Status({
  status,
  size = "sm",
}: {
  status?:
    | "pending"
    | "confirmed"
    | "shipped"
    | "completed"
    | "store_cancelled"
    | "customer_cancelled"
    | null;
  size?: "sm" | "md";
}) {
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
      break;
    case "confirmed":
      colors = {
        text: "#162664",
        bg: "#C2D6FF",
      };
      break;
    case "shipped":
      colors = {
        text: "#2B1664",
        bg: "#CAC2FF",
      };
      break;
    case "completed":
      colors = {
        text: "#176448",
        bg: "#CBF5E4",
      };
      break;
    case "store_cancelled":
      colors = {
        text: "#710E21",
        bg: "#F8C9D2",
      };
      break;
    case "customer_cancelled":
      colors = {
        text: "#710E21",
        bg: "#F8C9D2",
      };
      break;
    default:
      colors = {
        text: "#525866",
        bg: "#F6F8FA",
      };
      break;
  }

  if (!status) return null;

  return (
    <div className="flex items-center justify-center">
      <span
        className={`rounded-full px-2 py-0.5 ${size === "sm" ? "label-xsmall" : "label-small"}`}
        style={{
          color: colors.text,
          backgroundColor: colors.bg,
        }}
      >
        {status === "customer_cancelled" ? (
          "Cancelled by customer"
        ) : (
          <span className="capitalize">{status}</span>
        )}
      </span>
    </div>
  );
}
