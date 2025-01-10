"use client";

import { AppProgressBar } from "next-nprogress-bar";

export default function ProgressBar() {
  return (
    <AppProgressBar
      height="2px"
      color="var(--color-main-base)"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
