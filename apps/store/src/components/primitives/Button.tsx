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
    sm: "sm:p-2 p-1.5",
    md: "sm:p-2.5 p-2",
  },
  color: {
    main: "text-white border-main-base hover:border-main-dark active:border-main-base bg-main-base hover:bg-main-dark active:bg-main-base active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#CAC2FF]",
    black:
      "text-white bg-bg-800 border-bg-800 hover:border-bg-950 active:border-bg-800 hover:bg-bg-950 active:bg-bg-800 active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#E4E5E7]",
    danger:
      "text-white border-error hover:border-[#AF1D38] active:border-error bg-error hover:bg-[#AF1D38] active:bg-error active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#F8C9D2]",
    gray: "bg-bg-0 border-border-300 hover:bg-bg-50 hover:border-transparent text-text-600 hover:text-text-950 active:bg-bg-0 active:border-border-950 active:shadow-[0_0_0_2px_var(--color-bg-0),0_0_0_4px_#E4E5E7]",
    danger_hidden:
      "text-error hover:bg-[#FDEDF0] bg-bg-0 border-white active:border-error active:bg-bg-0 active:shadow-[0px_0px_0px_4px_#FFECEB,_0px_0px_0px_2px_var(--color-bg-0)]",
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
          className={`flex h-fit items-center gap-0.5 rounded-[10px] border transition-all disabled:border-border-200 disabled:bg-bg-50 disabled:text-text-300 disabled:!shadow-none ${styles.size[size]} ${styles.color[color]} ${className}`}
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
        className={`flex h-fit items-center gap-0.5 rounded-[10px] border transition-all disabled:border-border-200 disabled:bg-bg-50 disabled:text-text-300 disabled:!shadow-none ${styles.size[size]} ${styles.color[color]} ${className}`}
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
