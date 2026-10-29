#!/usr/bin/env python3
"""Export only exact candidate-matching rows from the pinned Fjalori Parquet.

This is a local research helper. It requires an isolated Python environment with
PyArrow installed; it is not imported by the application and adds no project
runtime dependency. The generated file contains dictionary text and must remain
outside the repository.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Any

EXPECTED_BYTES = 11_714_723
EXPECTED_SHA256 = "6c6c4f4db543ccdbc41d800efa5e141e1880807d5f7d48d1a33043bd2956c6b1"
EXPECTED_ROWS = 36_407
EXPECTED_COLUMNS = (
    "word",
    "full_header",
    "syntactic_tag",
    "sem_tag_1",
    "sem_tag_2",
    "sem_tag_3",
    "definition",
    "senses",
    "num_senses",
)
EXPORT_SCHEMA = "open-instrument.fjalori-agentive-definition-export.v0_1"
NEGATIVE_CONTROL_LEMMAS = ("shqiptar", "gjitar", "gjueti", "kombëtar")


def nfc_casefold(value: str) -> str:
    return unicodedata.normalize("NFC", value).casefold()


def sha256_file(path: Path) -> tuple[int, str]:
    digest = hashlib.sha256()
    byte_count = 0
    with path.open("rb") as source:
        while chunk := source.read(1024 * 1024):
            byte_count += len(chunk)
            digest.update(chunk)
    return byte_count, digest.hexdigest()


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def is_within(path: Path, parent: Path) -> bool:
    try:
        path.relative_to(parent)
        return True
    except ValueError:
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path, help="Locally acquired Fjalori Parquet file")
    parser.add_argument("--candidate-batch", required=True, type=Path, help="Repository candidate batch JSON")
    parser.add_argument("--output", required=True, type=Path, help="Private JSON export path outside the repository")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[2]
    try:
        source_path = args.source.expanduser().resolve(strict=True)
    except OSError as error:
        print(f"SOURCE_UNAVAILABLE:{error.__class__.__name__}:{error.errno}", file=sys.stderr)
        return 9
    batch_path = args.candidate_batch.expanduser().resolve(strict=True)
    output_path = args.output.expanduser().resolve()
    if is_within(output_path, repo_root):
        print("REFUSED: Fjalori text output must be outside the public repository", file=sys.stderr)
        return 2

    try:
        size, digest = sha256_file(source_path)
    except OSError as error:
        print(f"SOURCE_UNAVAILABLE:{error.__class__.__name__}:{error.errno}", file=sys.stderr)
        return 9
    if size != EXPECTED_BYTES or digest != EXPECTED_SHA256:
        print(f"SOURCE_IDENTITY_MISMATCH bytes={size} sha256={digest}", file=sys.stderr)
        return 3

    try:
        import pyarrow.parquet as parquet
    except ImportError:
        print("PYARROW_UNAVAILABLE: install PyArrow only in a local research environment", file=sys.stderr)
        return 4

    parquet_file = parquet.ParquetFile(source_path)
    schema_columns = tuple(parquet_file.schema_arrow.names)
    if schema_columns != EXPECTED_COLUMNS:
        print(f"SCHEMA_MISMATCH columns={schema_columns!r}", file=sys.stderr)
        return 5
    if parquet_file.metadata.num_rows != EXPECTED_ROWS:
        print(f"ROW_COUNT_MISMATCH rows={parquet_file.metadata.num_rows}", file=sys.stderr)
        return 6

    batch = json.loads(batch_path.read_text(encoding="utf-8"))
    candidates = batch.get("candidates")
    if not isinstance(candidates, list) or len(candidates) != 30:
        print("CANDIDATE_BATCH_MISMATCH: expected the verified 30-sense batch", file=sys.stderr)
        return 7
    for candidate in candidates:
        record = candidate.get("sourceRecord") if isinstance(candidate, dict) else None
        if (
            not isinstance(candidate, dict)
            or not isinstance(candidate.get("candidateId"), str)
            or not isinstance(record, dict)
            or not isinstance(record.get("lemma"), str)
        ):
            print("CANDIDATE_BATCH_ROW_INVALID", file=sys.stderr)
            return 8

    null_counts: Counter[str] = Counter()
    exact_words: set[str] = set()
    folded_words: set[str] = set()
    full_record_fingerprints: set[str] = set()
    row_ordinals_by_word: dict[str, list[int]] = {}
    candidate_lemma_keys = {
        nfc_casefold((candidate.get("sourceRecord") or {}).get("lemma", ""))
        for candidate in candidates
    }
    control_lemma_keys = {nfc_casefold(lemma) for lemma in NEGATIVE_CONTROL_LEMMAS}
    selected_rows: list[dict[str, Any]] = []
    selected_control_rows: list[dict[str, Any]] = []
    multiple_sense_rows = 0
    zero_sense_rows = 0

    physical_ordinal = 0
    for record_batch in parquet_file.iter_batches(batch_size=512):
        for source_row in record_batch.to_pylist():
            row = {column: source_row.get(column) for column in EXPECTED_COLUMNS}
            word = row["word"]
            if not isinstance(word, str):
                raise ValueError(f"word must be a string at physical row {physical_ordinal}")
            folded = nfc_casefold(word)
            exact_words.add(word)
            folded_words.add(folded)
            row_ordinals_by_word.setdefault(folded, []).append(physical_ordinal)
            full_record_fingerprints.add(canonical_json(row))
            for column, value in row.items():
                if value is None:
                    null_counts[column] += 1
            senses = row["senses"]
            if not isinstance(senses, list):
                raise ValueError(f"senses must be a list at physical row {physical_ordinal}")
            if row["num_senses"] == 0:
                zero_sense_rows += 1
            if len(senses) > 1:
                multiple_sense_rows += 1
            if folded in candidate_lemma_keys:
                selected_rows.append(
                    {
                        "physicalRowOrdinal": physical_ordinal,
                        "normalizedWord": folded,
                        **row,
                    }
                )
            if folded in control_lemma_keys:
                selected_control_rows.append(
                    {
                        "physicalRowOrdinal": physical_ordinal,
                        "normalizedWord": folded,
                        **row,
                    }
                )
            physical_ordinal += 1
    if physical_ordinal != parquet_file.metadata.num_rows:
        raise ValueError(f"ITERATED_ROW_COUNT_MISMATCH:{physical_ordinal}")

    candidate_matches = []
    candidate_lemmas: set[str] = set()
    matched_lemmas: set[str] = set()
    for candidate in candidates:
        record = candidate.get("sourceRecord") or {}
        lemma = record.get("lemma")
        candidate_id = candidate.get("candidateId")
        if not isinstance(lemma, str) or not isinstance(candidate_id, str):
            raise ValueError("candidate is missing candidateId or exact target lemma")
        key = nfc_casefold(lemma)
        candidate_lemmas.add(key)
        ordinals = row_ordinals_by_word.get(key, [])
        if ordinals:
            matched_lemmas.add(key)
        candidate_matches.append(
            {
                "candidateId": candidate_id,
                "targetLemma": lemma,
                "normalizedLemma": key,
                "matchedPhysicalRowOrdinals": ordinals,
            }
        )

    negative_control_matches = [
        {
            "targetLemma": lemma,
            "normalizedLemma": nfc_casefold(lemma),
            "matchedPhysicalRowOrdinals": row_ordinals_by_word.get(nfc_casefold(lemma), []),
        }
        for lemma in NEGATIVE_CONTROL_LEMMAS
    ]

    output = {
        "schemaVersion": EXPORT_SCHEMA,
        "source": {
            "sourceIdentity": "Fjalori Shqip; Hugging Face dataset akadriu/fjalori-shqip; data/train-00000-of-00001.parquet",
            "artifactSha256": digest,
            "artifactBytes": size,
            "recordCount": parquet_file.metadata.num_rows,
            "columns": list(EXPECTED_COLUMNS),
        },
        "scanSummary": {
            "sourceRowsScanned": physical_ordinal,
            "uniqueExactWordCount": len(exact_words),
            "uniqueNfcCasefoldWordCount": len(folded_words),
            "duplicateFullRecordCount": physical_ordinal - len(full_record_fingerprints),
            "duplicateNormalizedHeadwordRowCount": physical_ordinal - len(folded_words),
            "nullCountsByColumn": {column: null_counts[column] for column in EXPECTED_COLUMNS},
            "numSensesZeroRowCount": zero_sense_rows,
            "multipleStructuredSenseRowCount": multiple_sense_rows,
        },
        "candidateMatchSummary": {
            "candidateSenseCount": len(candidates),
            "uniqueCandidateLemmaCount": len(candidate_lemmas),
            "exactLemmaMatchedCount": len(matched_lemmas),
            "matchedCandidateSenseCount": sum(bool(m["matchedPhysicalRowOrdinals"]) for m in candidate_matches),
            "missingCandidateLemmas": [m["targetLemma"] for m in candidate_matches if not m["matchedPhysicalRowOrdinals"]],
        },
        "candidateMatches": candidate_matches,
        "matchedRows": selected_rows,
        "negativeControlMatches": negative_control_matches,
        "negativeControlRows": selected_control_rows,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(
        "EXPORT_OK "
        f"rows_scanned={physical_ordinal} unique_candidate_lemmas={len(candidate_lemmas)} "
        f"matched_lemmas={len(matched_lemmas)} matched_rows={len(selected_rows)} output={output_path}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
