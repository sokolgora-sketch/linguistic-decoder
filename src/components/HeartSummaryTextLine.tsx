"use client";

import React from "react";
import { buildHeartSummaryText } from "../lib/heartSummaryText";

type PrimaryPathLike = {
  voicePath?: string[];
  ringPath?: number[];
};

type HeartSummaryTextLineProps = {
  word: string;
  primaryPath?: PrimaryPathLike;
  className?: string;
};

/**
 * Small presentational component that renders a one-line heart summary like:
 *
 *   study: U → I (rings 1 → 1)
 *
 * It is deliberately defensive and optional:
 * - If primaryPath is missing, it renders nothing.
 * - If paths are empty, it falls back to "?" markers.
 */
export function HeartSummaryTextLine({
  word,
  primaryPath,
  className,
}: HeartSummaryTextLineProps) {
  if (!primaryPath) return null;

  const text = buildHeartSummaryText({
    word,
    primaryPath: {
      voicePath: primaryPath.voicePath ?? [],
      ringPath: primaryPath.ringPath ?? [],
    },
  });

  return (
    <p className={className ?? "text-xs text-muted-foreground mt-1"}>
      {text}
    </p>
  );
}
