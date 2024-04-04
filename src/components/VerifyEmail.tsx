import * as React from "react";
import { Img } from "@react-email/components";

interface EmailTemplateProps {
  verificationToken: string;
  name: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  verificationToken,
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
        Here is your verification code:
      </p>
      <div
        style={{
          padding: "0.5rem 0",
          fontSize: "2.5rem",
          lineHeight: "1.25",
          letterSpacing: "0.1em",
          color: "#101828",
          fontWeight: 600,
        }}
      >
        {verificationToken}
      </div>{" "}
      <p
        style={{
          color: "#475467",
          paddingBottom: "1rem",
          maxWidth: "28rem",
        }}
      >
        This code will expire in 15 minutes. If you did not request this
        verification code, please ignore this email.
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
