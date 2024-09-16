import * as React from "react";
import EmailTemplate from "./EmailTemplate";

interface EmailVerificationProps {
  verificationToken: string;
  name: string;
}

export const EmailVerification: React.FC<Readonly<EmailVerificationProps>> = ({
  verificationToken,
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
    </div>
    <p
      style={{
        color: "#475467",
        maxWidth: "28rem",
      }}
    >
      This code will expire in 15 minutes. If you did not request this
      verification code, please ignore this email.
    </p>
  </EmailTemplate>
);
