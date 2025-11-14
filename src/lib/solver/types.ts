
import type { Vowel, CClass } from "./valueTables";

export type { Vowel } from "./valueTables";

export type Checksum = {
  V: number;
  E: number;
  C: number;
};

export type Path = {
  voicePath: Vowel[];
  ringPath: number[];
  levelPath: number[];
  ops: string[];
  checksums: Checksum;
  kept: number;
};

export type Analysis = {
  engineVersion: string;
  word: string;
  mode: SolveMode;
  alphabet: string;
  primaryPath: Path;
  frontierPaths: Path[];
  signals: string[];
  windows?: string[];
  windowClasses?: CClass[];
  solveMs?: number;
  ts?: number;
};

export type SolveMode = "strict" | "open";

    