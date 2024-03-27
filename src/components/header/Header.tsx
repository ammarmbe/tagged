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
    <header className="flex w-full items-center gap-3 px-8 py-5">
      <div className="grid flex-grow grid-cols-[auto,1fr] gap-x-3.5 gap-y-1">
        <div className="row-span-2 rounded-full border bg-white p-3 shadow-xs">
          {icon}
        </div>
        <p className="label-large">{title}</p>
        <p className="paragraph-small text-text-500">{description}</p>
      </div>
      <Search />
      <Notifications />
      {buttonNode ? (
        buttonNode
      ) : button ? (
        <Button
          size="md"
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
