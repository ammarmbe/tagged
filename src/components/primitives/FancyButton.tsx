import Link from "next/link";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  size?: "xs" | "sm" | "md";
  text?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  noBorder?: boolean;
  href?: string;
};

const Button: React.FC<
  ButtonProps &
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = ({
  className,
  size = "sm",
  text,
  href,
  iconLeft,
  iconRight,
  ...props
}: {
  className?: string;
  size?: "xs" | "sm" | "md";
  text?: React.ReactNode;
  href?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #DF1C41, #DF1C41)",
        boxShadow: "0px 0px 0px 1px #E93535, 0px 1px 2px 0px #AF1D1D7A",
      }}
      className={`rounded-[10px] overflow-hidden flex ${
        //@ts-ignore
        props.disabled ? "!bg-none !shadow-none" : ""
      }`}
    >
      <div
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
        className={`rounded-[9px] overflow-hidden flex-grow flex ${
          //@ts-ignore
          props.disabled ? "!bg-none" : "p-px"
        }`}
      >
        {href ? (
          <Link
            href={href}
            {...props}
            style={{
              //@ts-ignore
              backgroundImage: props.disabled ? "none" : undefined,
            }}
            className={`rounded-[8px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)0%,rgba(255,255,255,0)100%),linear-gradient(0deg,#DF1C41,#DF1C41)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.24)0%,rgba(255,255,255,0)100%),linear-gradient(0deg,#DF1C41,#DF1C41)] active:bg-[linear-gradient(180deg,rgba(255,255,255,0)0%,rgba(255,255,255,0.16)100%),linear-gradient(0deg,#DF1C41,#DF1C41)] text-white h-full flex-grow disabled:!bg-bg-100 disabled:text-text-300 disabled:border-border-200 disabled:!shadow-none  transition-all flex gap-0.5 items-center ${
              size === "xs" ? "p-1.5" : size === "sm" ? "p-2" : "p-2.5"
            } ${className}`}
          >
            {iconLeft}
            {text ? <span className="label-small px-1">{text}</span> : null}
            {iconRight}
          </Link>
        ) : (
          <button
            {...props}
            style={{
              //@ts-ignore
              backgroundImage: props.disabled ? "none" : undefined,
            }}
            className={`rounded-[9px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)0%,rgba(255,255,255,0)100%),linear-gradient(0deg,#DF1C41,#DF1C41)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.24)0%,rgba(255,255,255,0)100%),linear-gradient(0deg,#DF1C41,#DF1C41)] active:bg-[linear-gradient(180deg,rgba(255,255,255,0)0%,rgba(255,255,255,0.16)100%),linear-gradient(0deg,#DF1C41,#DF1C41)] text-white h-full flex-grow disabled:!bg-bg-100 disabled:text-text-300 disabled:border-border-200 disabled:!shadow-none  transition-all flex gap-0.5 items-center ${
              size === "xs" ? "p-1.5" : size === "sm" ? "p-2" : "p-2.5"
            } ${className}`}
          >
            {iconLeft}
            {text ? <span className="label-small px-1">{text}</span> : null}
            {iconRight}
          </button>
        )}
      </div>
    </div>
  );
};

Button.displayName = "FancyButton";
export default Button;
