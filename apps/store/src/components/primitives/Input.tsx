import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

type InputProps = {
  error?: any;
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
    ref,
  ) => {
    const classes = `border rounded-lg max-w-full placeholder:text-text-400 shadow-xs hover:border-transparent hover:bg-bg-50 hover:placeholder:text-text-600 focus:bg-bg-0 focus:placeholder:text-text-600 focus:border-border-950 peer focus:shadow-[0px_0px_0px_2px_var(--color-bg-0),0px_0px_0px_4px_#E4E5E7] text-text-950 transition-all placeholder:transition-all disabled:!bg-bg-100 disabled:!border-border-200 disabled:!text-text-400 disabled:pointer-events-none min-w-0 disabled:placeholder:text-text-300 disabled:hover:placeholder:text-text-300 resize-none ${
      size === "md"
        ? "p-2 sm:px-3 px-2 paragraph-small"
        : "sm:p-2 p-1.5 paragraph-small"
    } ${
      icon
        ? size === "md"
          ? iconSide === "right"
            ? "sm:pr-10 pr-9"
            : "sm:pl-10 pl-9"
          : iconSide === "right"
            ? "sm:pr-9 pr-8"
            : "sm:pl-9 pl-8"
        : ""
    } ${
      error
        ? "!border-error focus:!shadow-[0px_0px_0px_2px_var(--color-bg-0),0px_0px_0px_4px_#F8C9D2]"
        : "border-border-300"
    } ${className}`;

    return (
      <div className="min-w-0">
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
            className={`absolute flex items-center justify-center text-text-400 transition-all peer-hover:text-text-600 peer-focus:text-text-950 ${
              size === "md"
                ? "size-[2.375rem]"
                : "top-[calc(0.375rem+1px)] sm:top-[calc(0.5rem+1px)]"
            } ${iconSide === "right" ? "right-[calc(0.375rem+1px)] sm:right-[calc(0.5rem+1px)]" : "left-[calc(0.375rem+1px)] sm:left-[calc(0.5rem+1px)]"}`}
          >
            {icon}
          </div>
        </div>
        {Boolean(error) && errorMessage && (
          <p className="paragraph-xsmall mt-1.5 text-error">{errorMessage}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
