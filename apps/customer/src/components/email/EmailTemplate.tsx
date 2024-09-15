import * as React from "react";
import { Img } from "@react-email/components";

export default function EmailTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "1.5rem",
        background: "white",
      }}
    >
      <a
        href="/"
        style={{
          color: "#101828",
          lineHeight: "26px",
          height: "26px",
          textDecoration: "none",
          marginTop: "2px !important",
          marginLeft: "0.625rem !important",
        }}
      >
        <Img
          src="https://tagged.ambe.dev/logo.png"
          height={30}
          width={105}
          alt="Tagged Logo"
        />
      </a>
      <div
        style={{
          padding: "1.5rem 0",
          fontSize: "1rem",
          lineHeight: "1.5",
        }}
      >
        {children}
        <p
          style={{
            color: "#475467",
            padding: "1rem 0rem",
          }}
        >
          Thanks,
          <br />
          The Tagged Team
        </p>
      </div>
    </div>
  );
}
