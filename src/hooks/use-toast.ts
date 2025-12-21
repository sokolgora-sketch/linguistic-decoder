"use client";

import * as React from "react";

export type ToastVariant = "default" | "destructive" | "success";

export type ToastInput = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastItem = ToastInput & {
  id: string;
};

let _toasts: ToastItem[] = [];

export function toast(input: ToastInput) {
  // Minimal implementation: keep a small in-memory list + dev console log.
  const item: ToastItem = { id: `${Date.now()}-${Math.random()}`, ...input };
  _toasts = [item, ..._toasts].slice(0, 5);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[toast]", item);
  }

  return {
    id: item.id,
    dismiss: () => dismiss(item.id),
  };
}

export function dismiss(id?: string) {
  if (!id) {
    _toasts = [];
    return;
  }
  _toasts = _toasts.filter((t) => t.id !== id);
}

export function useToast() {
  // We expose the same-ish shape most UI code expects.
  // If later you add the real shadcn toaster, you can replace this file.
  const [, force] = React.useState(0);

  const api = React.useMemo(() => {
    return {
      toast: (t: ToastInput) => {
        const res = toast(t);
        force((x) => x + 1);
        return res;
      },
      dismiss: (id?: string) => {
        dismiss(id);
        force((x) => x + 1);
      },
      toasts: _toasts as ToastItem[],
    };
  }, []);

  return api;
}
