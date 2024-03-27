import localFont from "next/font/local";
import { StylesConfig } from "react-select";

export const generalSans = localFont({
  src: "../../public/GeneralSans-Variable.woff2",
});

export const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    // get local server url
    return `http://localhost:3000`;
  }

  return `https://store-rust-iota.vercel.app`;
};

export const selectStyles: StylesConfig<
  {
    value: string;
    label: string;
  },
  true,
  never
> = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "white",
    padding: "2px 2px 2px 0.75rem",
    borderColor: state.isFocused ? "#9e77ed !important" : "#d0d5dd",
    borderRadius: "0.5rem",
    cursor: "text",

    boxShadow: state.isFocused
      ? "0 0 0 4px #9e77ed3D, 0 1px 2px 0 #1018280D"
      : "0 1px 2px 0 #1018280d",
    color: "#101828",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "150ms",
    "&:placeholder": {
      color: "#667085",
    },
    "&:disabled": {
      backgroundColor: "#f9fafb",
    },
    "&:hover": {
      borderColor: "#d0d5dd",
    },
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
    "& *": {
      padding: "0",
    },
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    cursor: "auto",
  }),
  container: (styles) => ({
    ...styles,
    padding: "0",
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: "0",
    gap: "4px",
  }),
  input: (styles) => ({
    ...styles,
    padding: "0",
    margin: "0",
    cursor: "text",
  }),
  indicatorSeparator: () => ({
    display: "hidden",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
    border: "1px solid #d1d5db",
    margin: "4px 0px",
    padding: "0",
    overflow: "hidden",
    zIndex: "30",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? "#f2f4f7" : "white",
    color: "#1f2937",
    "&:hover": {
      backgroundColor: "#f2f4f7",
    },
    borderRadius: "4px",
    display: isSelected ? "flex" : "flex",
    flexDirection: "column",
    gap: "1px",
  }),
  menuList: (styles) => ({
    ...styles,
    padding: "5px",
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#e4e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    lineHeight: "18px",
    padding: "2px",
    background: "white",
    border: "1px solid #d0d5dd",
    margin: "0",
    gap: "2px",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    padding: "0",
    color: "#344054",
    fontWeight: "500",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#98a2b3",
    padding: "2px",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#98a2b3",
    },
  }),
};
