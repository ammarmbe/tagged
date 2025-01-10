"use client";

import { AppProgressBar } from "next-nprogress-bar";

export default function ProgressBar() {
  return (
    <AppProgressBar
      height="2px"
      color="#EF6820"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
