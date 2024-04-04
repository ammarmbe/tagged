import * as React from "react";
import { Img } from "@react-email/components";

interface PasswordTemplateProps {
  code: string;
  name: string;
}

export const PasswordTemplate: React.FC<Readonly<PasswordTemplateProps>> = ({
  code,
  name,
}) => (
  <div
    style={{
      padding: "1.5rem",
      background: "white",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Img
        src="https://atlascustomer.vercel.app/logo.png"
        height={28}
        width={28}
        alt="Atlas Logo"
      />
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          lineHeight: "26px",
          height: "26px",
          color: "#101828",
          marginTop: "2px !important",
          marginLeft: "0.625rem !important",
          margin: 0,
        }}
      >
        <a
          href="/"
          style={{
            color: "#101828",
            lineHeight: "26px",
            marginTop: "2px",
            height: "26px",
            textDecoration: "none",
          }}
        >
          Atlas
        </a>
      </h1>
    </div>
    <div
      style={{
        padding: "1.5rem 0",
        fontSize: "1rem",
        lineHeight: "1.5",
      }}
    >
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
          backgroundColor: "#7F56D9",
          fontWeight: 600,
          textDecoration: "none",
          borderRadius: "0.25rem",
          padding: "0.5rem 1rem",
        }}
        href={`https://atlascustomer.vercel.app/password-reset?code=${code}`}
      >
        Reset your password
      </a>{" "}
      <p
        style={{
          color: "#475467",
          paddingBottom: "1rem",
          maxWidth: "28rem",
        }}
      >
        This link will expire in 1 hour. If you did not request this, please
        ignore this email.
      </p>
      <p
        style={{
          color: "#475467",
          paddingBottom: "1rem",
        }}
      >
        Thanks,
        <br />
        The Atlas Team
      </p>
    </div>
  </div>
);
