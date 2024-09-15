"use client";

import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastViewport,
} from "@/utils/toast/toast";
import { useToast } from "@/utils/toast/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, toast_content, ...props }) {
        return (
          <Toast key={id} {...props}>
            {toast_content}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
