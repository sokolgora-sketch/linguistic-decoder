export type EngineManifest = {
  name: string;
  build: string; // e.g. "1.0.0"
  description?: string;
  notes?: string[];
};

/**
 * Local engine manifest for the app-layer engine wrapper.
 * Keeping this tiny + stable so Jest and the UI can rely on it.
 */
export function getManifest(): EngineManifest {
  return {
    name: "Seven-Voices",
    build: "1.0.0",
    description: "ZË-RO engine manifest (app wrapper).",
    notes: ["Local manifest fallback for app/src/engine/analyzeWord.ts"],
  };
}
