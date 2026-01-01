// tests/helpers/stableSnapshot.ts
//
// Snapshot hygiene: keep canon/gold snapshots focused on core engine behavior.
// Tags are validated in their dedicated test suites (v1Tags/oEdgePolarity/sClusterVision).

export function stripV1Tags<T extends Record<string, any>>(obj: T): T {
  const { o_edge_polarity, s_cluster_vision, trust_geometry, ...rest } = obj as any;
  return rest as T;
}
