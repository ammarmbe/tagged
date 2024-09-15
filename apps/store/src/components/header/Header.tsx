import { ReactNode } from "react";
import Button from "../primitives/Button";
import Search from "./search/Search";
import Notifications from "./notifications/Notifications";
import Image from "next/image";

export default function Header({
  title,
  description,
  icon,
  button,
  buttonNode,
  user,
}: {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode | null;
  button?: {
    color?: "main" | "gray";
    text?: string;
    iconLeft?: ReactNode;
    href?: string;
    iconRight?: ReactNode;
    onClick?: () => void;
  };
  buttonNode?: ReactNode;
  user?: {
    name: string;
    pfp_url: string | undefined;
  } | null;
}) {
  return (
    <header className="flex w-full items-center gap-3 px-5 py-3 sm:px-8 sm:py-5">
      <div className="grid flex-grow gap-x-3.5 gap-y-1 sm:grid-cols-[auto,1fr]">
        {icon ? (
          <div className="row-span-2 hidden rounded-full border bg-bg-0 p-3 shadow-xs sm:block">
            {icon}
          </div>
        ) : user?.pfp_url ? (
          <div className="relative row-span-2 hidden size-12 overflow-hidden rounded-full border border-transparent sm:flex">
            <Image fill src={user.pfp_url} alt={user.name} />
            <div className="flex-grow bg-bg-300" />
          </div>
        ) : (
          <div className="row-span-2 hidden sm:block" />
        )}
        <p className="label-large truncate">{title}</p>
        <p className="paragraph-small hidden text-text-600 sm:block">
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
