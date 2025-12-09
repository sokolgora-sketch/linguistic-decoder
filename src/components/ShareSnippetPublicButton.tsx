"use client";

import React from "react";
import { Button } from "./ui/button";
import { buildPublicSummarySnippet } from "@/lib/shareSnippetPublic";
import { useToast } from "@/components/ui/use-toast";
import type { AnalyzeWordResultUI } from "@/shared/resultsUI";

type Props = {
  result: AnalyzeWordResultUI | null;
};

export default function ShareSnippetPublicButton({ result }: Props) {
  const { toast } = useToast();

  const handleClick = async () => {
    if (!result) {
      toast({
        title: "Nothing to share",
        description: "Run an analysis first.",
      });
      return;
    }

    const text = buildPublicSummarySnippet(result);

    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Summary copied",
        description: "Share snippet is now in your clipboard.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Clipboard is not available in this browser.",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      onClick={handleClick}
      className="mt-2"
    >
      Copy public snippet
    </Button>
  );
}
