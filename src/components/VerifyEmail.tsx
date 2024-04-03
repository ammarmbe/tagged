import * as React from "react";

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
      padding: "2rem",
      background: "white",
    }}
  >
    <div
      style={{
        padding: "1.5rem",
      }}
    >
      <div className="flex items-center gap-2.5">
        <img src="/logo.svg" height={28} width={28} alt="Atlas Logo" />
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            lineHeight: "1.125",
            color: "#101828",
          }}
        >
          <a href="/">Atlas</a>
        </h1>
      </div>
      <div
        style={{
          padding: "2rem 1.5rem",
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
          This is your verification code:
        </p>
        <div
          style={{
            padding: "1.5rem 0",
          }}
        >
          {verificationToken}
        </div>
      </div>
    </div>
  </div>
);
