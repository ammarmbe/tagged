import * as React from "react";
import EmailTemplate from "./EmailTemplate";

interface ReturnRequestStoreProps {
  nano_id: string;
}

export const ReturnRequestStore: React.FC<
  Readonly<ReturnRequestStoreProps>
> = ({ nano_id }) => (
  <EmailTemplate>
    <p
      style={{
        margin: 0,
        color: "#475467",
        maxWidth: "32rem",
      }}
    >
      A return request has been made for{" "}
      <a
        style={{
          color: "#E04F16",
          textDecoration: "none",
        }}
        href={`https://tagged.ambe.dev/order/${nano_id}`}
      >
        Order {nano_id}
      </a>
      . Please review the request and update the status through the dashboard.
    </p>
  </EmailTemplate>
);
