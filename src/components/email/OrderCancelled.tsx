import * as React from "react";
import EmailTemplate from "./EmailTemplate";

interface OrderCancelledProps {
  nano_id: string;
}

export const OrderCancelled: React.FC<Readonly<OrderCancelledProps>> = ({
  nano_id,
}) => (
  <EmailTemplate>
    <p
      style={{
        margin: 0,
        color: "#475467",
        maxWidth: "32rem",
      }}
    >
      You have cancelled{" "}
      <a
        style={{
          color: "#E04F16",
          textDecoration: "none",
        }}
        href={`https://atlasstore.vercel.app/order/${nano_id}`}
      >
        Order {nano_id}
      </a>
      .
    </p>
  </EmailTemplate>
);
