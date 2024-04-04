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
        {children}
        <p
          style={{
            color: "#475467",
            padding: "1rem 0rem",
          }}
        >
          Thanks,
          <br />
          The Atlas Team
        </p>
      </div>
    </div>
  );
}
