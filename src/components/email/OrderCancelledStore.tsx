import * as React from "react";
import EmailTemplate from "./EmailTemplate";

interface OrderCancelledStoreProps {
  nano_id: string;
}

export const OrderCancelledStore: React.FC<
  Readonly<OrderCancelledStoreProps>
> = ({ nano_id }) => (
  <EmailTemplate>
    <p
      style={{
        margin: 0,
        color: "#475467",
        maxWidth: "32rem",
      }}
    >
      <a
        style={{
          color: "#E04F16",
          textDecoration: "none",
        }}
        href={`https://atlasstore.vercel.app/order/${nano_id}`}
      >
        Order {nano_id}
      </a>{" "}
      has been cancelled by the customer.
    </p>
  </EmailTemplate>
);
