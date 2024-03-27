import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

type InputProps = {
  error?: boolean;
  icon?: React.ReactNode;
  iconSide?: "left" | "right";
  errorMessage?: string;
  size?: "sm" | "md";
  textarea?: boolean;
};

const Input = React.forwardRef<
  HTMLInputElement,
  Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "size"
  > &
    InputProps
>(
  (
    {
      className,
      error,
      icon,
      errorMessage,
      size = "md",
      textarea,
      iconSide,
      ...props
    },
    ref
  ) => {
    const classes = `border rounded-lg max-w-full placeholder:text-text-400 shadow-xs hover:border-transparent hover:bg-bg-100 hover:placeholder:text-icon-500 focus:bg-white focus:placeholder:text-icon-500 focus:border-border-900 peer focus:shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_4px_#E4E5E7] text-text-900 transition-all placeholder:transition-all disabled:bg-bg-100 disabled:border-transparent disabled:text-text-300 disabled:placeholder:text-text-300 disabled:hover:placeholder:text-text-300 resize-none ${
      size === "md" ? "p-2 px-3" : "p-2 paragraph-small"
    } ${
      icon
        ? size === "md"
          ? iconSide === "right"
            ? "pr-10"
            : "pl-10"
          : iconSide === "right"
          ? "pr-9"
          : "pl-9"
        : ""
    } ${
      error
        ? "!border-error focus:!shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_4px_#F8C9D2]"
        : "border-border-300"
    } ${className}`;

    return (
      <div>
        <div className="relative">
          {textarea ? (
            // @ts-ignore
            <textarea
              ref={ref as any}
              rows={5}
              {...props}
              className={classes}
            />
          ) : (
            <input ref={ref} {...props} className={classes} />
          )}
          <div
            className={`absolute top-[calc(0.5rem+1px)] text-icon-400 peer-hover:text-icon-500 peer-focus:text-icon-900 transition-all ${
              size === "md" ? "p-[2px]" : ""
            } ${
              iconSide === "right"
                ? "right-[calc(0.5rem+1px)]"
                : "left-[calc(0.5rem+1px)]"
            }`}
          >
            {icon}
          </div>
        </div>
        {error && errorMessage && (
          <p className="paragraph-xsmall text-error mt-1.5">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
