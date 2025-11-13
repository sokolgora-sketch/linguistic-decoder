
import type { Vowel } from "./valueTables";

export type { Vowel } from "./valueTables";

export type Checksum = {
  type: 'V' | 'E' | 'C';
  value: number;
};

export type Path = {
  voicePath: Vowel[];
  ringPath: number[];
  levelPath: number[];
  ops: string[];
  checksums: Checksum[];
  kept: number;
};

export type Analysis = {
  engineVersion: string;
  word: string;
  mode: SolveMode;
  primaryPath: Path;
  frontierPaths: Path[];
  signals: string[];
};

export type SolveMode = "strict" | "open";

    