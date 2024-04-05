import * as React from "react";
import EmailTemplate from "./EmailTemplate";

interface ResetPasswordProps {
  code: string;
  name: string;
}

export const ResetPassword: React.FC<Readonly<ResetPasswordProps>> = ({
  code,
  name,
}) => (
  <EmailTemplate>
    <p
      style={{
        color: "#475467",
      }}
    >
      Hi {name},
      <br />
      <br />
      Here&apos;s the link to reset your password. Click the button below to
      reset
    </p>
    <a
      style={{
        margin: "1.25rem 0",
        display: "block",
        width: "fit-content",
        fontSize: "1rem",
        lineHeight: "1.5",
        color: "white",
        backgroundColor: "#E04F16",
        fontWeight: 600,
        textDecoration: "none",
        borderRadius: "0.25rem",
        padding: "0.5rem 1rem",
      }}
      href={`https://atlascustomer.vercel.app/password-reset?code=${code}`}
    >
      Reset your password
    </a>
    <p
      style={{
        color: "#475467",
        maxWidth: "28rem",
      }}
    >
      This link will expire in 1 hour. If you did not request this, please
      ignore this email.
    </p>
  </EmailTemplate>
);
