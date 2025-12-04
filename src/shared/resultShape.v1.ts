import type { DeepRootSummaryV1 } from "./deepRoot.v1";
import type { WordMatrixV1 } from "./wordMatrix.v1";
import type { AnalysisResult_DEPRECATED } from "./engineShape";

export type AnalyzeWordResultV1 = AnalysisResult_DEPRECATED & {
    deepRoot?: DeepRootSummaryV1;
    wordMatrix?: WordMatrixV1;
    primaryPath: any;
    frontier?: any;
    languageFamilies?: any;
    symbolic?: any;
    word?: any;
    meta?: any;
  };
  