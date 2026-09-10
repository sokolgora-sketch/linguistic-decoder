// src/lib/downloadJson.ts

export function downloadText(
  filename: string,
  text: string,
  mimeType = "application/json",
) {
  // Guard for SSR / tests
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function downloadJson(filename: string, data: unknown) {
  downloadText(filename, JSON.stringify(data, null, 2));
}
