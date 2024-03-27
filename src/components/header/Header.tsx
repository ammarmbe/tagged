import { ReactNode } from "react";
import Button from "../primitives/Button";
import Search from "./search/Search";
import Notifications from "./notifications/Notifications";

export default function Header({
  title,
  description,
  icon,
  button,
  buttonNode,
}: {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  button?: {
    color?: "main" | "gray";
    text?: string;
    iconLeft?: ReactNode;
    href?: string;
    iconRight?: ReactNode;
    onClick?: () => void;
  };
  buttonNode?: ReactNode;
}) {
  return (
    <header className="flex w-full items-center gap-3 px-5 py-3 sm:px-8 sm:py-5">
      <div className="grid flex-grow gap-x-3.5 gap-y-1 sm:grid-cols-[auto,1fr]">
        <div className="row-span-2 hidden rounded-full border bg-white p-3 shadow-xs sm:block">
          {icon}
        </div>
        <p className="label-large truncate">{title}</p>
        <p className="paragraph-small hidden text-text-500 sm:block">
          {description}
        </p>
      </div>
      <Search />
      <Notifications />
      {buttonNode ? (
        buttonNode
      ) : button ? (
        <Button
          size="md"
          className="flex-none"
          color={button.color}
          text={button.text}
          href={button.href}
          onClick={button.onClick}
          iconLeft={button.iconLeft}
        />
      ) : null}
    </header>
  );
}
