import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "./multiSourceFunctionalResearchEvidenceCatalog.v0_1";

import type {
  MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "./multiSourceFunctionalResearchEvidenceRegistry.v0_1";

/**
 * Backward-compatible ER research-row view.
 *
 * Canonical evidence data now lives in the static research catalog.
 *
 * This module remains temporarily so existing bounded ER tests and
 * callers retain the same public import while production runtime
 * moves to the complete generic catalog.
 */
export const multiSourceFunctionalResearchEvidenceRowsErV0_1:
  readonly MultiSourceFunctionalResearchEvidenceRowV0_1[] =
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1()
    .filter(
      (row) =>
        row.embryo
          .normalize("NFC")
          .trim()
          .toLocaleUpperCase(
            "en-US",
          ) ===
        "ER",
    );
