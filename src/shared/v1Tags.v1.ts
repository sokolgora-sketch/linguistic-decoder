// src/shared/v1Tags.v1.ts
//
// V1 Tags (top-level JSON add-ons for analyzeWordV1)
// Centralized so adding tags cannot break object-return syntax.

import { oEdgePolarityForWord, type OEdgePolarityTag } from "./oEdgePolarity.v1";
import { sClusterVisionForWord, type SClusterTag } from "./sClusterVision.v1";

export type V1Tags = {
  o_edge_polarity: OEdgePolarityTag | null;
  s_cluster_vision: SClusterTag | null;
};

export function buildV1Tags(word: string): V1Tags {
  return {
    o_edge_polarity: oEdgePolarityForWord({ word, vowel_path: null }),
    s_cluster_vision: sClusterVisionForWord(word),
  };
}
