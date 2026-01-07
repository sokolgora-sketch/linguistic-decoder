"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  label?: string;
};

/**
 * DevOnly
 * - Debug/UI dump surfaces must not ship in production.
 */
export function DevOnly({ children, label }: Props) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div data-devonly="true">
      {label ? <div className="mb-2 text-xs opacity-70">{label}</div> : null}
      {children}
    </div>
  );
}
