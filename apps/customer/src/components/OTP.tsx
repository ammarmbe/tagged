"use client";
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName="flex items-center gap-2 has-[:disabled]:opacity-50"
    className="disabled:cursor-not-allowed"
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className="flex items-center gap-2" {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, isActive, hasFakeCaret } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={`relative flex h-16 w-16 items-center justify-center rounded-lg border-2 border-[#D0D5DD] px-2 py-0.5 text-5xl shadow-sm transition-all ${isActive && "z-10 border-gray-400 ring-1 ring-gray-400"} text-gray-700 ${className}`}
      {...props}
    >
      {char || <span className="text-gray-300">0</span>}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="animate-caret-blink h-12 w-px bg-gray-700 duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"span">,
  React.ComponentPropsWithoutRef<"span">
>(({ ...props }, ref) => (
  <span className="text-5xl text-[#D0D5DD]" ref={ref} {...props}>
    -
  </span>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
