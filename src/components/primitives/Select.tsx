import { selectStyles } from "@/utils";
import React from "react";
import ReactSelect from "react-select";
import Creatable from "react-select/creatable";

type SelectProps = {
  error?: boolean;
  icon?: React.ReactNode;
  iconSide?: "left" | "right";
  errorMessage?: string;
  width?: string;
  size?: "sm" | "md" | "xs";
  dropdownIndicator?: boolean;
  creatable?: boolean;
};

const Select = React.forwardRef<
  React.ElementRef<
    typeof ReactSelect<{ value: any; label: string }, true, never>
  >,
  React.ComponentPropsWithoutRef<
    typeof ReactSelect<{ value: any; label: string }, true, never>
  > &
    SelectProps
>(
  (
    {
      error,
      icon,
      errorMessage,
      creatable,
      width,
      dropdownIndicator,
      size = "md",
      iconSide,
      ...props
    },
    ref,
  ) => (
    <div>
      <div className="relative">
        {creatable ? (
          <Creatable
            ref={ref}
            {...props}
            styles={selectStyles({
              size,
              error,
              width,
              iconSide,
              dropdownIndicator,
            })}
            formatCreateLabel={(inputValue) => inputValue}
            className="peer"
          />
        ) : (
          <ReactSelect
            ref={ref}
            {...props}
            styles={selectStyles({
              size,
              error,
              width,
              iconSide,
              dropdownIndicator,
            })}
            className="peer"
          />
        )}
        <div
          className={`absolute top-[calc(0.5rem+1px)] text-icon-400 transition-all peer-hover:text-icon-500 peer-focus:text-icon-900 ${
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
        <p className="paragraph-xsmall mt-1.5 text-error">{errorMessage}</p>
      )}
    </div>
  ),
);

Select.displayName = "Select";
export default Select;
