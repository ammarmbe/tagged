import * as React from "react";
import EmailTemplate from "./EmailTemplate";

interface ReturnRequestProps {
  nano_id: string;
}

export const ReturnRequest: React.FC<Readonly<ReturnRequestProps>> = ({
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
      You have requested to return{" "}
      <a
        style={{
          color: "#E04F16",
          textDecoration: "none",
        }}
        href={`https://tagged.ambe.dev/order/${nano_id}`}
      >
        Order {nano_id}
      </a>
      . The store will review your request and get back to you soon.
    </p>
  </EmailTemplate>
);
