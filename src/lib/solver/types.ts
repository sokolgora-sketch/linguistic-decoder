
import type { Vowel, CClass } from "./valueTables";

export type { Vowel } from "./valueTables";

export type Checksum = {
  V: number;
  E: number;
  C: number;
};

export type Path = {
  voice_path: Vowel[];
  ring_path: number[];
  level_path: number[];
  ops: string[];
  checksums: Checksum;
  kept: number;
};

export type Analysis = {
  engineVersion: string;
  word: string;
  mode: SolveMode;
  alphabet: string;
  primary: Path;
  frontier: Path[];
  signals: string[];
  windows?: string[];
  windowClasses?: CClass[];
};

export type SolveMode = "strict" | "open";

    