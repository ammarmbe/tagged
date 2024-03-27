import Link from "next/link";
import React, { DetailedHTMLProps } from "react";

type ButtonProps = {
  size?: "xs" | "sm" | "md";
  color?: "main" | "black" | "danger" | "gray" | "danger_hidden";
  text?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  noBorder?: boolean;
  href?: string;
};

const styles = {
  size: {
    xs: "p-1.5",
    sm: "p-2",
    md: "p-2.5",
  },
  color: {
    main: "text-white border-main-base hover:border-main-dark active:border-main-base bg-main-base hover:bg-main-dark active:bg-main-base active:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#CAC2FF]",
    black:
      "text-white bg-bg-700 border-bg-700 hover:border-bg-900 active:border-bg-700 hover:bg-bg-900 active:bg-bg-700 active:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#E4E5E7]",
    danger:
      "text-white border-error hover:border-[#AF1D38] active:border-error bg-error hover:bg-[#AF1D38] active:bg-error active:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#F8C9D2]",
    gray: "bg-white border-border-300 hover:bg-bg-100 hover:border-transparent text-text-500 hover:text-text-900 active:bg-white active:border-border-900 active:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#E4E5E7]",
    danger_hidden:
      "text-error hover:bg-[#FDEDF0] bg-white border-white active:border-error active:bg-white active:shadow-[0px_0px_0px_4px_#FFECEB,_0px_0px_0px_2px_#FFFFFF]",
  },
};

const Button = React.forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    ButtonProps
>(
  (
    {
      className,
      size = "sm",
      text,
      href,
      iconLeft,
      iconRight,
      color = "gray",
      ...props
    },
    ref,
  ) => {
    if (href) {
      return (
        <Link
          ref={ref as any}
          href={href}
          {...(props as any)}
          className={`flex h-fit items-center gap-0.5 rounded-[10px] border transition-all disabled:border-border-200 disabled:bg-bg-100 disabled:text-text-300 disabled:!shadow-none ${styles.size[size]} ${styles.color[color]} ${className}`}
        >
          {iconLeft}
          {text ? <span className="label-small px-1">{text}</span> : null}
          {iconRight}
        </Link>
      );
    }

    return (
      <button
        ref={ref as any}
        {...(props as any)}
        className={`flex h-fit items-center gap-0.5 rounded-[10px] border transition-all disabled:border-border-200 disabled:bg-bg-100 disabled:text-text-300 disabled:!shadow-none ${styles.size[size]} ${styles.color[color]} ${className}`}
      >
        {iconLeft}
        {text ? <span className="label-small px-1">{text}</span> : null}
        {iconRight}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
