import * as Tooltip from "@radix-ui/react-tooltip";
import { RiInformationLine } from "react-icons/ri";

export default function TooltipComponent({
  content,
  small = false,
  black = true,
  trigger = <RiInformationLine size={15} className="inline" />,
}: {
  content: React.ReactNode;
  small?: boolean;
  black?: boolean;
  trigger?: React.ReactNode;
}) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild className="cursor-help">
          {trigger}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={`rounded-md shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${
              black ? "bg-bg-800 text-white" : "bg-bg-0 border"
            } ${
              small
                ? "paragraph-xsmall px-1.5 py-0.5"
                : "paragraph-small px-2.5 py-1"
            }`}
          >
            <Tooltip.Arrow />
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
