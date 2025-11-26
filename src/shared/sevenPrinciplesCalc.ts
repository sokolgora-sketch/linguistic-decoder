// src/shared/sevenPrinciplesCalc.ts
export type VoicePrinciple = 'A' | 'E' | 'I' | 'O' | 'U' | 'Y' | 'Ë';

export type SevenOp = 'add' | 'subtract' | 'multiply' | 'divide';

export interface SevenCalcResult {
  leftExpr: string;        // e.g. "AO"
  rightExpr: string;       // e.g. "ËA"
  op: SevenOp;             // "add" | "subtract" | ...
  decimal: number;         // e.g. 13
  base7: number[];         // e.g. [1, 6]
  voices: VoicePrinciple[];// e.g. ['A', 'Y']
  principle: VoicePrinciple; // final principle, e.g. 'Y'
}
