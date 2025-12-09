"use client";

import React from "react";
import { Button } from "./ui/button";
import { buildPublicShareSnippet, type ShareSource } from "../lib/shareSnippet";
import { useToast } from "../hooks/use-toast";

type Props = {
  source: ShareSource | null;
};

export default function ShareSnippetPublicButton({ source }: Props) {
  const { toast } = useToast();

  const handleClick = async () => {
    if (!source) {
      toast({
        title: "Nothing to share",
        description: "Run an analysis first.",
      });
      return;
    }

    const text = buildPublicShareSnippet(source);

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
