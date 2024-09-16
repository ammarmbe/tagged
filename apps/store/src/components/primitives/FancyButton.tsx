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
  const class_name = `flex h-full flex-grow items-center gap-0.5 rounded-[8px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)0%,rgba(255,255,255,0)100%),linear-gradient(0deg,#6E3FF3,#6E3FF3)] text-white transition-all hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.24)0%,rgba(255,255,255,0)100%),linear-gradient(0deg,#6E3FF3,#6E3FF3)] active:bg-[linear-gradient(180deg,rgba(255,255,255,0)0%,rgba(255,255,255,0.16)100%),linear-gradient(0deg,#6E3FF3,#6E3FF3)] disabled:border-border-200 disabled:!bg-bg-200 !h-fit min-h-0 disabled:text-text-300 disabled:!shadow-none ${
    size === "xs"
      ? "p-[calc(0.375rem-1px)]"
      : size === "sm"
        ? "p-[calc(0.375rem-1px)] sm:p-[calc(0.5rem-1px)]"
        : "p-[calc(0.5rem-1px)] sm:p-[calc(0.625rem-1px)]"
  } ${className}`;

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #6E3FF3, #6E3FF3)",
        boxShadow: "0px 0px 0px 1px #6E3FF3, 0px 1px 2px 0px #5A36BF7A",
      }}
      className={`flex !h-fit min-h-0 overflow-hidden rounded-[10px] ${
        //@ts-ignore
        props.disabled ? "!bg-none !shadow-none" : ""
      }`}
    >
      <div
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
        className={`flex !h-fit min-h-0 flex-grow overflow-hidden rounded-[9px] ${
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
            className={class_name}
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
            className={class_name}
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
