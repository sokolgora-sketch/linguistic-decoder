import React from "react";
import { HeartSummaryCard } from "../../components/HeartSummaryCard";

const demoPrimaryPath = {
  voicePath: ["U", "I"], // study → U→I
  ringPath: [1, 1],
};

export default function HeartSummaryDemoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-xl font-semibold">Heart summary demo</h1>
        <p className="text-sm text-muted-foreground">
          Static example using the Seven-vowel heart summary line.
        </p>
        <HeartSummaryCard word="study" primaryPath={demoPrimaryPath} />
      </div>
    </main>
  );
}