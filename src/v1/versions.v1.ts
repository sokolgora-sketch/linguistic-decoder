/**
 * ZË-RO Version levers (Solo policy)
 *
 * - engineVersion: behavior changes (even if shape stable)
 * - contractVersion: JSON shape/semantics changes
 * - rulesetVersion: hypothesis/extractor rules change
 * - canonVersion: canon battery / gold fixtures change
 *
 * Keep these centralized. Do not duplicate in multiple files.
 */

export const ENGINE_VERSION_V1 = "v1.0.0";
export const CONTRACT_VERSION_V1 = "scientific-output-v1.1";

/**
 * v1.2: functionalRoots adds damage + father extractor (ruleset expansion)
 * If you later change functionalRoots logic, bump RULESET_VERSION_V1.
 */
export const RULESET_VERSION_V1 = "ruleset-v1.2";

/**
 * Canon/gold battery version. Bump whenever canon list or expected outputs change.
 * If you add VATËR/BESË/ZË entries or change canon fixtures, bump this.
 */
export const CANON_VERSION_V1 = "canon-v1.0";
