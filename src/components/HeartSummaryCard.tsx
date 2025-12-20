"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { HeartSummaryTextLine } from "./HeartSummaryTextLine";

type PrimaryPathLike = {
  voicePath?: string[];
  ringPath?: number[];
};

type HeartSummaryCardProps = {
  word: string;
  primaryPath?: PrimaryPathLike;
  title?: string;
  className?: string;
};

/**
 * Small reusable card that shows a one-line Seven-vowel "heart summary"
 * for a word. It stays defensive and optional:
 *
 * - If primaryPath is missing, it renders nothing.
 * - If paths are empty, HeartSummaryTextLine will fall back to '曆' markers.
 */
export function HeartSummaryCard({
  word,
  primaryPath,
  title,
  className,
}: HeartSummaryCardProps) {
  if (!primaryPath) return null;

  return (
    <Card className={className ?? "border border-border/60"}>
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium">
          {title ?? "Heart summary"}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <HeartSummaryTextLine word={word} primaryPath={primaryPath} />
      </CardContent>
    </Card>
  );
}
