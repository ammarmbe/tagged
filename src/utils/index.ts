import { useQuery } from "@tanstack/react-query";
import { User } from "lucia";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { StylesConfig } from "react-select";

export const useUser = () => {
  const { data: user, isFetching } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/current-user");
      const data = await res.json();

      return data as User;
    },
  });

  return { user, isFetching };
};

function leapYear(year: number) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

export const months = (count: number = 12, short: boolean = false) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (short) {
    return months.map((month) => month.slice(0, 3)).slice(0, count);
  }

  return months.slice(0, count);
};

export const days = (count: number = 7, short: boolean = false) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (short) {
    return days.map((day) => day.slice(0, 3)).slice(0, count);
  }

  return days.slice(0, count);
};

export const daysInMonth = (
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) => {
  let numOfDays: number;

  if (month === 2 && leapYear(year)) {
    numOfDays = 29;
  } else if (month === 2 && !leapYear(year)) {
    numOfDays = 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    numOfDays = 30;
  } else {
    numOfDays = 31;
  }

  return Array.from({ length: numOfDays }, (_, i) => {
    return `${i + 1}/${month}`;
  });
};

export const selectStyles = ({
  size = "md",
  error = false,
  width,
  iconSide,
  dropdownIndicator,
}: {
  size?: "xs" | "sm" | "md";
  error?: boolean;
  width?: string;
  iconSide?: "left" | "right";
  dropdownIndicator?: boolean;
}) => {
  return {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: error || state.isFocused ? "white !important" : "white",
      padding: size === "md" ? "10px" : size === "sm" ? "8px" : "6px",
      paddingLeft: iconSide === "left" ? "40px" : "10px",
      paddingRight: iconSide === "right" ? "40px" : "10px",
      fontSize: "14px",
      lineHeight: "20px",
      gap: "8px",
      minHeight: "0px",
      letterSpacing: "-0.006em",
      borderColor: error
        ? "#DF1C41 !important"
        : state.isFocused
          ? "#0A0D14 !important"
          : "#CDD0D5",
      borderRadius: "8px",
      boxShadow: state.isFocused
        ? error
          ? "0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #F8C9D2"
          : "0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #E4E5E7"
        : "0px 1px 2px 0px #E4E5E73D",
      color: "#0A0D14",
      transitionProperty: "all",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms",
      "&:placeholder": {
        color: "#525866",
      },
      "&:disabled": {
        borderColor: "transparent",
        backgroundColor: "#F6F8FA !important",
        color: "#CDD0D5 !important",
      },
      "&:hover": {
        borderColor: "transparent",
        backgroundColor: "#F6F8FA",
      },
    }),
    indicatorsContainer: (styles) => ({
      ...styles,
      display: dropdownIndicator === false ? "none" : "flex",
      justifyContent: "center",
      alignItems: "center",
      "& *": {
        padding: "0",
      },
    }),
    dropdownIndicator: (styles, state) => ({
      ...styles,
      cursor: "auto",
      padding: "0",
      margin: "0",
      color: error || state.isFocused ? "#0A0D14 !important" : "#868C98",
      "&:disabled": {
        color: "#CDD0D5 !important",
      },
    }),
    container: (styles) => ({
      ...styles,
      padding: "0",
      flex: "none",
      width,
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
      cursor: "auto",
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
      margin: "6px 0px",
      padding: "0",
      overflow: "hidden",
      zIndex: "30",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused || isSelected ? "#f2f4f7" : "white",
      color: "#1f2937",
      "&:hover": {
        backgroundColor: "#f2f4f7",
      },
      borderRadius: "4px",
      fontSize: "14px",
      lineHeight: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "1px",
      marginTop: "4px",
      "&:first-of-type": {
        marginTop: "0",
      },
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
  } as StylesConfig<
    {
      value: string;
      label: string;
    },
    true,
    never
  >;
};

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sP = useSearchParams();
  const searchParams = new URLSearchParams(Object.fromEntries(sP.entries()));

  const get = (filter: string) => {
    return searchParams.get(filter);
  };

  const set = (filter: string, value: string) => {
    searchParams.set(filter, value);

    router.push(pathname + "?" + searchParams.toString());
  };

  const clear = (filter: string) => {
    searchParams.delete(filter);

    router.push(pathname + "?" + searchParams.toString());
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const getAll = () => {
    return Object.fromEntries(searchParams.entries());
  };

  return { get, set, clear, clearAll, getAll };
}

export const timeConstraint = (
  range: "day" | "week" | "month" | "year" | "all",
  table?: string,
  column?: string,
) => {
  return range === "day"
    ? `DATE(${table ? table + "." : ""}${
        column ? column : "created_at"
      }) = CURRENT_DATE`
    : range === "week"
      ? `EXTRACT(WEEK FROM ${table ? table + "." : ""}${
          column ? column : "created_at"
        }) = EXTRACT(WEEK FROM CURRENT_DATE) AND EXTRACT(YEAR FROM ${
          table ? table + "." : ""
        }${column ? column : "created_at"}) = EXTRACT(YEAR FROM CURRENT_DATE)`
      : range === "month"
        ? `EXTRACT(MONTH FROM ${table ? table + "." : ""}${
            column ? column : "created_at"
          }) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM ${
            table ? table + "." : ""
          }${column ? column : "created_at"}) = EXTRACT(YEAR FROM CURRENT_DATE)`
        : range === "year"
          ? `EXTRACT(YEAR FROM ${table ? table + "." : ""}${
              column ? column : "created_at"
            }) = EXTRACT(YEAR FROM CURRENT_DATE)`
          : "1=1";
};

export function formatCurrency(number?: number | null, decimals?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: decimals || 0,
  }).format(number || 0);
}
