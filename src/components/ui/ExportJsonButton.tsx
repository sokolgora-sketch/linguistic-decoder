"use client";
import { Button } from "@/components/ui/button";
import { downloadJson } from "@/lib/downloadJson";

export function ExportJsonButton({
  data,
  filename,
}: {
  data: any;
  filename: string;
}) {
  const handleExport = () => {
    downloadJson(filename, data);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      Export JSON
    </Button>
  );
}