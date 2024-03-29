"use client";
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ ...props }, ref) => (
  <SwitchPrimitives.Root
    className="group relative h-4 w-7 cursor-pointer rounded-full border-t shadow-[0px_4px_4px_0px_hsla(240,3%,6%,0.06)_inset] transition-all disabled:shadow-none data-[state=checked]:border-main-dark data-[state=unchecked]:border-[#CDD0D5] data-[state=checked]:bg-main-base data-[state=unchecked]:bg-bg-200 data-[state=checked]:hover:bg-main-dark data-[state=unchecked]:hover:bg-[#CDD0D5] data-[state=checked]:active:bg-main-base data-[state=unchecked]:active:bg-[#CDD0D5]"
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className="absolute top-px inline-flex size-3 items-center justify-center rounded-full border border-white bg-white shadow-[0px_-3px_3px_0px_#E4E5E7_inset,0px_6px_10px_0px_#16266414,0px_4px_8px_0px_#16266414,0px_2px_4px_0px_#16266414] transition-all after:size-1 after:rounded-full group-active:top-0.5 group-active:size-2.5 data-[state=checked]:left-[calc(1rem-2px)] data-[state=unchecked]:left-0.5 data-[state=checked]:after:bg-main-base data-[state=unchecked]:after:bg-bg-200 data-[state=checked]:group-hover:after:bg-main-dark data-[state=unchecked]:group-hover:after:bg-[#CDD0D5] data-[state=checked]:group-active:left-[calc(1rem-1px)] data-[state=unchecked]:group-active:left-[3px] data-[state=checked]:group-active:after:bg-main-base data-[state=unchecked]:group-active:after:bg-[#CDD0D5]" />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
